// Fixture-only checksummed CAS wrapper. Checksum detects damage, not malicious edits.
const MAX=65536;
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const bytes=x=>typeof x==='string'&&x.length<=MAX;
function checksum(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(16).padStart(8,'0');}
const seal=body=>({body,checksum:checksum(body)});
const good=x=>exact(x,['body','checksum'])&&bytes(x.body)&&x.checksum===checksum(x.body);
export function createFixtureRecoveryPort({scope,storage,readContext,validate}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof storage?.read!=='function'||typeof storage?.compareExchange!=='function'||typeof readContext!=='function'||typeof validate!=='function')throw Error('Invalid recovery host');
  const allowed=()=>{const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true&&c.inCombat===false;};
  function checked(x){try{return good(x)&&validate(x.body)===true;}catch{return false;}}
  function inspect(raw){
    if(raw===null)return {kind:'empty',primary:null};
    try{
      if(!bytes(raw))throw Error();const p=JSON.parse(raw);
      if(!exact(p,['version','scope','sealed','primary','backup','archived'])||p.version!==1||p.scope!==scope||typeof p.sealed!=='boolean'||(!p.sealed&&p.archived!==null))throw Error();
      const primary=checked(p.primary),backup=checked(p.backup);
      if(primary&&(p.backup===null||backup))return {kind:p.sealed?'sealed':'ready',primary:p.primary.body,p};
      if(!p.sealed&&!primary&&backup)return {kind:'recovery',primary:p.backup.body,p};
    }catch{}return {kind:'corrupt',primary:null};
  }
  async function publish(raw,next){if(!bytes(next)||!allowed())return false;try{return await storage.compareExchange(raw,next)===true;}catch{return false;}}
  const port=Object.freeze({async read(){const x=inspect(await storage.read());if(!['empty','ready','sealed'].includes(x.kind))throw Error('Protected specialization');return x.primary;},
    async compareExchange(expected,next){if(!bytes(next)||!checked(seal(next))||!allowed())return false;const raw=await storage.read(),x=inspect(raw);if(!['empty','ready'].includes(x.kind)||expected!==x.primary||expected===next)return false;
      return publish(raw,JSON.stringify({version:1,scope,sealed:false,primary:seal(next),backup:x.p?.primary??null,archived:null}));}});
  return Object.freeze({port,async status(){try{const x=inspect(await storage.read());return {kind:x.kind,recovery:x.kind==='recovery'?x.primary:null};}catch{return {kind:'unavailable',recovery:null};}},
    async restoreBackup(confirm){try{if(confirm!==true||!allowed())return false;const raw=await storage.read(),x=inspect(raw);if(!['ready','recovery'].includes(x.kind)||!checked(x.p.backup))return false;
      return publish(raw,JSON.stringify({version:1,scope,sealed:true,primary:x.p.backup,backup:null,archived:x.p.primary}));}catch{return false;}}});
}
