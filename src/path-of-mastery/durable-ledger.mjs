// PM4 fixture-only ordered producer ledger. No production storage keys or activation.
import { SKILLS, getSkill } from './registry.mjs';
import { CANDIDATE_CURVE, experienceProgress } from './experience.mjs';
const CAP = CANDIDATE_CURVE.at(-1), LIMIT = 65536;
const id = x => typeof x === 'string' && /^[a-zA-Z0-9:_./-]{1,96}$/.test(x);
const natural = x => Number.isSafeInteger(x) && x >= 0;
const exact = (x, keys) => x && typeof x === 'object' && !Array.isArray(x) &&
  Object.keys(x).length === keys.length && keys.every(k => Object.hasOwn(x,k));
const deny = reason => Object.freeze({ok:false,reason});
function fingerprint(s) {
  let h=2166136261;
  for(let i=0;i<s.length;i++) h=Math.imul(h^s.charCodeAt(i),16777619);
  return (h>>>0).toString(16).padStart(8,'0');
}
function seal(state) {
  const body=JSON.stringify(state);
  return JSON.stringify({body,checksum:fingerprint(body)});
}
function parse(raw) {
  if(typeof raw!=='string'||raw.length>LIMIT) throw Error('Invalid bytes');
  return JSON.parse(raw);
}
// Port: read() => string|null; compareExchange(expected,next) => boolean.
// Both may be async. CAS MUST be atomic across all writers, durable on success,
// with no partial record writes. A localStorage read+set shim is NOT sufficient.
export function createDurableFixtureLedger({scope, rules, storage, readContext}={}) {
  if(!id(scope)||!/^fixture:.+$/.test(scope)||!Array.isArray(rules)||rules.length<1||rules.length>32||
     typeof storage?.read!=='function'||typeof storage?.compareExchange!=='function'||typeof readContext!=='function')
    throw Error('Invalid fixture host');
  const sources=new Map();
  for(const r of rules) {
    if(!exact(r,['source','skill','amount','verify'])||!id(r.source)||sources.has(r.source)||
       !getSkill(r.skill)||!natural(r.amount)||r.amount<1||r.amount>CAP||typeof r.verify!=='function') throw Error('Invalid rule');
    sources.set(r.source,Object.freeze({...r}));
  }
  const names=[...sources.keys()].sort();
  const policy=JSON.stringify(names.map(n=>{const {skill,amount}=sources.get(n);return [n,skill,amount];}));
  const fresh=()=>({version:2,scope,curve:'pm-cubic-candidate-v1',policy,revision:0,sealed:false,
    cursors:names.map(()=>0)});
  function decode(raw) {
    const e=parse(raw);
    if(!exact(e,['body','checksum'])||typeof e.body!=='string'||e.checksum!==fingerprint(e.body)) throw Error('Checksum');
    const s=parse(e.body);
    if(!exact(s,['version','scope','curve','policy','revision','sealed','cursors'])||s.version!==2||s.scope!==scope||
       s.curve!=='pm-cubic-candidate-v1'||s.policy!==policy||!natural(s.revision)||typeof s.sealed!=='boolean'||
       !Array.isArray(s.cursors)||s.cursors.length!==names.length||!s.cursors.every(natural)||
       (!s.sealed&&s.cursors.reduce((sum,n)=>sum+BigInt(n),0n)!==BigInt(s.revision))) throw Error('Invalid state');
    return s;
  }
  function view(s) {
    const xp=Object.fromEntries(SKILLS.map(k=>[k.id,0n]));
    names.forEach((n,i)=>{const r=sources.get(n);xp[r.skill]+=BigInt(s.cursors[i])*BigInt(r.amount);});
    return Object.freeze({revision:s.revision,sealed:s.sealed,
      cursors:Object.freeze(Object.fromEntries(names.map((n,i)=>[n,s.cursors[i]]))),
      xp:Object.freeze(Object.fromEntries(Object.entries(xp).map(([k,v])=>[k,Number(v>BigInt(CAP)?BigInt(CAP):v)])))});
  }
  function inspect(raw) {
    if(raw===null) return {kind:'empty',raw,state:fresh()};
    let p;
    try {
      p=parse(raw);
      if(!exact(p,['primary','backup','archived'])||typeof p.primary!=='string'||
         !(p.backup===null||typeof p.backup==='string')||!(p.archived===null||typeof p.archived==='string')) throw Error('Invalid pair');
    } catch { return {kind:'corrupt',raw}; }
    let primary,backup;
    try{primary=decode(p.primary);}catch{}
    try{if(p.backup!==null)backup=decode(p.backup);}catch{}
    if(primary) {
      if((p.backup!==null&&!backup)||(!primary.sealed&&p.archived!==null)||
        (backup&&backup.revision>=primary.revision)) return {kind:'corrupt',raw};
      return {kind:primary.sealed?'sealed':'ready',raw,p,state:primary,backup};
    }
    return backup?{kind:'recovery',raw,p,state:backup,backup}:{kind:'corrupt',raw};
  }
  const context=()=>{const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true;};
  async function publish(raw,next) {
    if(next.length>LIMIT) return deny('capacity');
    try { return await storage.compareExchange(raw,next)===true?{ok:true}:deny('conflict'); }
    catch { /* outcome unknown until exact readback */ }
    try {const observed=await storage.read();return observed===next?{ok:true}:deny(observed===raw?'not-committed':'conflict-or-unknown');}
    catch {return deny('unknown');}
  }
  let busy=false;
  async function exclusive(fn) {
    if(busy)return deny('busy');busy=true;
    try{return await fn();}catch{return deny('storage-or-authority-error');}finally{busy=false;}
  }
  return Object.freeze({
    async read(){try{const x=inspect(await storage.read());return Object.freeze({kind:x.kind,progress:x.state?view(x.state):null});}
      catch{return Object.freeze({kind:'unavailable',progress:null});}},
    award(source,evidence){return exclusive(async()=>{
      const rule=sources.get(source);if(!rule||!context())return deny('context-or-source');
      const x=inspect(await storage.read());if(!['ready','empty'].includes(x.kind))return deny(x.kind);
      const i=names.indexOf(source),seq=rule.verify(evidence),old=x.state.cursors[i];
      if(!natural(seq)||seq<1)return deny('unverified');
      if(seq<=old)return deny('duplicate');if(seq!==old+1)return deny('gap');
      if(!natural(x.state.revision+1)||!context())return deny('context-or-capacity');
      const next={...x.state,revision:x.state.revision+1,cursors:[...x.state.cursors]};next.cursors[i]=seq;
      const before=view(x.state),after=view(next);
      const result=await publish(x.raw,JSON.stringify({primary:seal(next),backup:x.p?.primary??null,archived:null}));
      return result.ok?Object.freeze({ok:true,skill:rule.skill,applied:after.xp[rule.skill]-before.xp[rule.skill],
        progress:experienceProgress(after.xp[rule.skill]),revision:next.revision}):result;
    });},
    // Restore is deliberately sealed: rolling back cursors cannot authorize new XP.
    restoreBackup(confirm){return exclusive(async()=>{
      if(confirm!==true||!context())return deny('confirmation-or-context');
      const x=inspect(await storage.read());
      if(!['ready','recovery'].includes(x.kind)||!x.backup||x.p.archived!==null)return deny('no-restorable-backup');
      const revision=Math.max(x.state.revision,x.backup.revision)+1;
      if(!natural(revision)||!context())return deny('context-or-capacity');
      const next={...x.backup,revision,sealed:true};
      const result=await publish(x.raw,JSON.stringify({primary:seal(next),backup:x.p.backup,archived:x.p.primary}));
      return result.ok?Object.freeze({ok:true,progress:view(next)}):result;
    });},
  });
}
