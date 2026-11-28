// AV2 pure projection, no health/resource mutation or persistence.
export function projectCombatStats({base,health,resources,layers={}}){
  const families=['slashing','piercing','crushing','fire','frost','lightning','poison','arcane','resonance'];
  const bounds={maxHealth:[1,100000],maxStamina:[1,100000],maxMana:[1,100000],physicalAttack:[0,100000],magicalAttack:[0,100000],accuracy:[0,4],criticalChance:[0,1],criticalDamage:[1,10],mitigation:[0,.95],healthRegen:[0,10000],staminaRegen:[0,10000],manaRegen:[0,10000],actionEfficiency:[.1,4]};
  for(const family of families)bounds['resistance.'+family]=[-1,.95];
  const keys=Object.keys(bounds);
  const own=(obj,k)=>Object.prototype.hasOwnProperty.call(obj,k);
  const record=obj=>obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&[Object.prototype,null].includes(Object.getPrototypeOf(obj));
  const within=(x,lo,hi)=>typeof x==='number'&&Number.isFinite(x)&&x>=lo&&x<=hi;
  if(!record(base)||Object.keys(base).length!==keys.length||keys.some(k=>!own(base,k)||!within(base[k],...bounds[k])))throw Error('invalid base stats');
  if(!record(layers)||Object.keys(layers).some(k=>!['skill','equipment','temporary'].includes(k)))throw Error('invalid modifier layers');
  const sums={...base};
  const used=new Set();
  for(const layer of ['skill','equipment','temporary']){
    const entries=own(layers,layer)?layers[layer]:[];
    if(!Array.isArray(entries)||entries.length>32)throw Error('invalid modifier count');
    const ordered=[...entries];
    for(const m of ordered){
      if(!record(m)||typeof m.id!=='string'||!(/^[a-z0-9][a-z0-9:._-]{0,95}$/).test(m.id)||used.has(layer+':'+m.id)||!own(bounds,m.stat)||!within(m.delta,-100000,100000))throw Error('invalid modifier');
      used.add(layer+':'+m.id);
    }
    ordered.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
    for(const m of ordered)sums[m.stat]+=m.delta;
  }
  const values={},limited=[];
  for(const k of keys){
    const [lo,hi]=bounds[k],v=Math.min(hi,Math.max(lo,sums[k]));
    values[k]=v;if(v!==sums[k])limited.push(k);
  }
  if(!record(health)||!within(health.max,1,100000)||!within(health.current,0,health.max))throw Error('invalid authoritative health');
  if(!record(resources)||!within(resources.stamina,0,values.maxStamina)||!within(resources.mana,0,values.maxMana))throw Error('invalid resource snapshot');
  const requestedHealthMax=values.maxHealth;values.maxHealth=health.max;
  const resistance=Object.freeze(Object.fromEntries(families.map(f=>[f,values['resistance.'+f]])));
  return Object.freeze({version:1,stats:Object.freeze(values),resistance,health:Object.freeze({current:health.current,max:health.max,alive:health.current>0}),resources:Object.freeze({stamina:resources.stamina,mana:resources.mana}),requestedHealthMax,healthMaxRequiresAuthority:requestedHealthMax!==health.max,limited:Object.freeze(limited)});
}
