// PM7 fixture-only persistent rank/preset transactions, independent of XP.
import {compileTypedFixtureTree} from './typed-tree.mjs';
import {compileSkillTree} from './skill-tree.mjs';
import {compileEffectCatalog,candidatePoints} from './specialization.mjs';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const nameOk=n=>typeof n==='string'&&n.length>0&&n.length<=40&&n.trim()===n;
const deny=reason=>({ok:false,reason});
export function createDurableSpecialization({scope,definition,effects,readContext,readLevel,storage,interval=3,typedEffects}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof readLevel!=='function'||typeof readContext!=='function'||typeof storage?.read!=='function'||typeof storage?.compareExchange!=='function')throw Error('Invalid host');
  const typed=typedEffects===undefined?null:compileTypedFixtureTree(definition,typedEffects);
  const catalog=typed?null:compileEffectCatalog(effects),tree=typed?typed.tree:compileSkillTree(definition,{allowedEffects:catalog.ids});
  candidatePoints(1,interval);
  const policy=typed?JSON.stringify([typed.policy,interval]):JSON.stringify([tree.skill,tree.nodes,catalog.ids.map(k=>catalog.get(k)),interval]);
  const allowed=()=>{const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true&&c.inCombat===false;};
  const fresh=()=>({version:1,scope,policy,revision:0,ranks:{},presets:[]});
  const validate=(r,level)=>tree.inspect(r,level,candidatePoints(level,interval));
  function decode(raw){
    if(raw===null)return fresh();if(typeof raw!=='string'||raw.length>65536)throw Error('Invalid bytes');
    const s=JSON.parse(raw);
    if(!exact(s,['version','scope','policy','revision','ranks','presets'])||s.version!==1||s.scope!==scope||s.policy!==policy||!Number.isSafeInteger(s.revision)||s.revision<0||!Array.isArray(s.presets)||s.presets.length>16)throw Error('Invalid state');
    validate(s.ranks,99);const names=new Set();for(const p of s.presets){if(!exact(p,['name','ranks'])||!nameOk(p.name)||names.has(p.name))throw Error('Invalid preset');names.add(p.name);validate(p.ranks,99);}
    return s;
  }
  const view=(s,level)=>Object.freeze({revision:s.revision,level,...validate(s.ranks,level),presets:Object.freeze(s.presets.map(p=>p.name)),...(typed?{effects:typed.project(s.ranks,level,candidatePoints(level,interval))}:{})});
  let busy=false;
  async function change(expected,fn){
    if(busy)return deny('busy');busy=true;
    try{
      if(!allowed())return deny('context');const raw=await storage.read(),s=decode(raw),level=readLevel();
      validate(s.ranks,level);if(s.revision!==expected||!Number.isSafeInteger(s.revision+1))return deny('stale');
      fn(s,level);s.revision++;const v=view(s,level),next=JSON.stringify(s);
      if(next.length>65536||!allowed()||readLevel()!==level)return deny('context-or-capacity');
      if(await storage.compareExchange(raw,next)!==true)return deny('conflict');return {ok:true,view:v};
    }catch{return deny('invalid-or-storage');}finally{busy=false;}
  }
  return Object.freeze({validateSnapshot(raw){try{if(raw===null)return false;decode(raw);return true;}catch{return false;}},async read(){try{return {ok:true,view:view(decode(await storage.read()),readLevel())};}catch{return deny('invalid-or-storage');}},
    purchase(key,expected){return change(expected,(s,l)=>{s.ranks=tree.purchase(s.ranks,key,l,candidatePoints(l,interval)).ranks;});},
    respec(expected){return change(expected,s=>{s.ranks={};});},
    savePreset(name,expected){return change(expected,s=>{if(!nameOk(name))throw Error('Name');const i=s.presets.findIndex(p=>p.name===name);if(i<0&&s.presets.length>=16)throw Error('Capacity');const p={name,ranks:s.ranks};if(i<0)s.presets.push(p);else s.presets[i]=p;});},
    applyPreset(name,expected){return change(expected,(s,l)=>{const p=s.presets.find(p=>p.name===name);if(!p)throw Error('Missing preset');s.ranks=validate(p.ranks,l).ranks;});},
    removePreset(name,expected){return change(expected,s=>{const i=s.presets.findIndex(p=>p.name===name);if(i<0)throw Error('Missing preset');s.presets.splice(i,1);});}
  });
}
