// PM6/7 fixture policy. No gameplay effects or authoritative combat state yet.
import {compileSkillTree} from './skill-tree.mjs';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9:_-]{0,63}$/.test(x);
const kinds=new Set(['passive','active','conditional','mastery','discovery']);
export function compileEffectCatalog(definitions){
  if(!Array.isArray(definitions)||definitions.length>128)throw Error('Invalid effects');
  const map=new Map();for(const e of definitions){
    if(!e||Object.keys(e).length!==3||!id(e.id)||!kinds.has(e.kind)||!id(e.contract)||map.has(e.id))throw Error('Invalid effect');
    map.set(e.id,Object.freeze({id:e.id,kind:e.kind,contract:e.contract}));
  }
  return Object.freeze({ids:Object.freeze([...map.keys()]),get:key=>map.get(key)??null});
}
export function candidatePoints(level,interval=3){
  if(!Number.isInteger(level)||level<1||level>99||!Number.isInteger(interval)||interval<1||interval>98)throw Error('Invalid point policy');
  return Math.floor((level-1)/interval);
}
export function createFixtureSpecialization({scope,definition,effects,readContext,readLevel,interval=3}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof readContext!=='function'||typeof readLevel!=='function')throw Error('Invalid fixture host');
  const catalog=compileEffectCatalog(effects),tree=compileSkillTree(definition,{allowedEffects:catalog.ids});
  const presets=new Map();let ranks=Object.freeze({}),revision=0,busy=false;
  function allowed(){const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true&&c.inCombat===false;}
  const current=()=>{const level=readLevel();return {level,budget:candidatePoints(level,interval)};};
  const inspect=(r,c)=>tree.inspect(r,c.level,c.budget);
  function transaction(fn){if(busy)throw Error('Busy');busy=true;try{if(!allowed())throw Error('Combat or context');return fn(current());}finally{busy=false;}}
  function replace(next,c){const checked=inspect(next,c);if(!allowed())throw Error('Combat or context');const now=current();if(now.level!==c.level||now.budget!==c.budget)throw Error('Stale level');ranks=checked.ranks;revision++;return checked;}
  const nameOk=n=>typeof n==='string'&&n.trim()===n&&n.length>0&&n.length<=40;
  return Object.freeze({
    view(){const c=current();return Object.freeze({revision,level:c.level,...inspect(ranks,c),presets:Object.freeze([...presets.keys()])});},
    purchase(key){return transaction(c=>replace(tree.purchase(ranks,key,c.level,c.budget).ranks,c));},
    previewRespec(){const c=current();return Object.freeze({revision,refund:inspect(ranks,c).spent});},
    respec(expected){return transaction(c=>{if(expected!==revision)throw Error('Stale preview');return replace({},c);});},
    savePreset(name){return transaction(c=>{if(!nameOk(name)||(!presets.has(name)&&presets.size>=16))throw Error('Invalid preset');const checked=inspect(ranks,c);if(!allowed())throw Error('Combat or context');presets.set(name,checked.ranks);revision++;return name;});},
    applyPreset(name,expected){return transaction(c=>{if(expected!==revision||!presets.has(name))throw Error('Stale or unknown preset');return replace(presets.get(name),c);});},
    removePreset(name){return transaction(()=>{if(!presets.has(name)||!allowed())throw Error('Unknown preset or context');presets.delete(name);revision++;return true;});},
  });
}
