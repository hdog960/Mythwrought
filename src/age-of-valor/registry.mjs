export const FAMILIES=Object.freeze(["slashing","piercing","crushing","fire","frost","lightning","poison","arcane","resonance"]);
export function createCombatRegistry(definitions, families=FAMILIES){
 const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
 const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_-]{0,31}:[a-z0-9][a-z0-9._-]{0,63}$/.test(x);
 const number=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
 const ms=x=>Number.isSafeInteger(x)&&number(x,1,60000);
 const exact=(obj,keys)=>record(obj)&&Object.keys(obj).length===keys.length&&keys.every(k=>Object.hasOwn(obj,k));
 if(!Array.isArray(definitions)||definitions.length>4096)throw Error('invalid definition list');
 const map=new Map();
 const actionTypes=['unarmed','projectile','spell','ability'];
 const equipmentTypes=['weapon','armor','accessory'];
 const mods=['maxHealth','maxStamina','maxMana','physicalAttack','magicalAttack','accuracy','criticalChance','criticalDamage','mitigation','healthRegen','staminaRegen','manaRegen','actionEfficiency',...families.map(f=>'resistance.'+f)];
 function requirements(input){
  if(!Array.isArray(input)||input.length>32)throw Error('invalid requirements');
  const seen=new Set();
  return Object.freeze(input.map(v=>{if(!exact(v,['skillId','level'])||!id(v.skillId)||!Number.isInteger(v.level)||!number(v.level,1,99)||seen.has(v.skillId))throw Error('invalid skill requirement');seen.add(v.skillId);return Object.freeze({...v});}));
 }
 for(const d of definitions){
  if(!record(d)||!id(d.id)||d.version!==1||map.has(d.id)||!['fixture','content'].includes(d.scope))throw Error('invalid identity');
  const common=['id','version','scope','type','requirements'];
  let normalized;
  if(actionTypes.includes(d.type)){
   if(!exact(d,[...common,'delivery','damage','power','reach','timing','cost','critical','geometry','effects','hooks'])||!['melee','projectile','area','self','target','channel'].includes(d.delivery)||!['physical','magical','none'].includes(d.power)||!number(d.reach,0,128))throw Error('invalid action');
   if(!Array.isArray(d.damage)||d.damage.length>families.length||(d.damage.length===0&&d.delivery==='melee'))throw Error('invalid damage profile');
   const seen=new Set();
   const damage=Object.freeze(d.damage.map(v=>{if(!exact(v,['family','amount','scaling'])||!families.includes(v.family)||seen.has(v.family)||!number(v.amount,0,100000)||!number(v.scaling,0,10))throw Error('invalid damage component');seen.add(v.family);return Object.freeze({...v});}).sort((a,b)=>families.indexOf(a.family)-families.indexOf(b.family)));
   if(!exact(d.timing,['windupMs','activeMs','recoveryMs','cooldownMs'])||!['windupMs','activeMs','recoveryMs'].every(k=>ms(d.timing[k]))||!Number.isSafeInteger(d.timing.cooldownMs)||!number(d.timing.cooldownMs,0,600000))throw Error('invalid timing');
   if(!exact(d.cost,['stamina','mana'])||!number(d.cost.stamina,0,100000)||!number(d.cost.mana,0,100000)||typeof d.critical!=='boolean')throw Error('invalid cost/critical');
   if(!exact(d.geometry,['shape','radius','maxTargets'])||!['sweep','ray','sphere','self'].includes(d.geometry.shape)||!number(d.geometry.radius,0,16)||!Number.isInteger(d.geometry.maxTargets)||!number(d.geometry.maxTargets,1,32))throw Error('invalid geometry');
   if(!Array.isArray(d.effects)||d.effects.length>16||d.effects.some(x=>!id(x))||new Set(d.effects).size!==d.effects.length||!exact(d.hooks,['animation','feedback'])||Object.values(d.hooks).some(x=>x!==null&&!id(x)))throw Error('invalid effects/hooks');
   normalized={...d,requirements:requirements(d.requirements),damage,timing:Object.freeze({...d.timing}),cost:Object.freeze({...d.cost}),geometry:Object.freeze({...d.geometry}),effects:Object.freeze([...d.effects]),hooks:Object.freeze({...d.hooks})};
  }else if(equipmentTypes.includes(d.type)){
   if(!exact(d,[...common,'slot','actions','modifiers','weight'])||!['main-hand','off-hand','head','body','legs','feet','accessory'].includes(d.slot)||!number(d.weight,0,1000)||!Array.isArray(d.actions)||d.actions.length>16||d.actions.some(x=>!id(x))||new Set(d.actions).size!==d.actions.length||!Array.isArray(d.modifiers)||d.modifiers.length>32)throw Error('invalid equipment');
   if(d.type==='weapon'&&(!['main-hand','off-hand'].includes(d.slot)||!d.actions.length)||d.type==='armor'&&!['head','body','legs','feet'].includes(d.slot)||d.type==='accessory'&&d.slot!=='accessory')throw Error('invalid equipment slot');
   const seen=new Set();
   const modifiers=Object.freeze(d.modifiers.map(m=>{if(!exact(m,['id','stat','delta'])||!id(m.id)||seen.has(m.id)||!mods.includes(m.stat)||!number(m.delta,-100000,100000))throw Error('invalid equipment modifier');seen.add(m.id);return Object.freeze({...m});}));
   normalized={...d,requirements:requirements(d.requirements),actions:Object.freeze([...d.actions]),modifiers};
  }else throw Error('unknown content type');
  map.set(d.id,Object.freeze(normalized));
 }
 for(const d of map.values())if(equipmentTypes.includes(d.type))for(const ref of d.actions){const action=map.get(ref);if(!action||!actionTypes.includes(action.type)||d.scope==='content'&&action.scope!=='content')throw Error('unresolved or fixture action reference');}
 return Object.freeze({version:1,size:map.size,get:key=>map.get(key)??null,list:()=>Object.freeze([...map.values()].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0))});
}
