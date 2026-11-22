// Detached, read-only S2 census review for explicitly versioned FUTURE worlds.
// Does not authorize writes to accepted M7 natural terrain or any save.
const CLASS=Object.freeze({
  'unsupported-subsoil-0':'protect-cave-air',
  'protected-above-3':'protect-legacy-stone',
  'protected-above-4':'protect-legacy-wood',
  'protected-above-7':'protect-legacy-leaves'
});
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function reviewSnowS2RejectedGrass(census){
  if(!Array.isArray(census?.records)||census.records.length===0||
      census.records.length>16)
    throw new TypeError('Missing or oversized authoritative S2 census');
  const seeds=new Set(),categories=Object.fromEntries(
    Object.values(CLASS).map(name=>[name,0]));
  let grass=0,candidates=0,protectedGrass=0,sampled=0;
  for(const row of census.records){
    if(!Number.isInteger(row?.seed)||row.seed!==(row.seed|0)||
      seeds.has(row.seed)||![row.sampled,row.grass,row.proposed,
        row.skippedProtected].every(natural)||
      row.grass!==row.proposed+row.skippedProtected||
      row.grass>row.sampled||!row.rejectedReasons||
      typeof row.rejectedReasons!=='object'||
      Array.isArray(row.rejectedReasons))
      throw new TypeError('Malformed seed or inconsistent S2 surface census');
    seeds.add(row.seed);
    const keys=Object.keys(row.rejectedReasons);
    if(!keys.every(key=>own(CLASS,key)&&natural(row.rejectedReasons[key])))
      throw new TypeError('Unknown or corrupt protected S2 reason');
    if(keys.reduce((s,k)=>s+row.rejectedReasons[k],0)!==row.skippedProtected)
      throw new TypeError('Missing protected S2 classifications');
    for(const key of keys)categories[CLASS[key]]+=row.rejectedReasons[key];
    for(const example of row.rejectionExamples??[]){
      if(!keys.includes(example?.reason)||
        !Array.isArray(example.at)||example.at.length!==3||
        !example.at.every(Number.isSafeInteger))
        throw new TypeError('Invalid physical S2 source witness');
      const id=example.reason.startsWith('protected-above-')?
        Number(example.reason.slice('protected-above-'.length)):null;
      if(id!==null&&(example.blockAbove?.id!==id||
        !Number.isSafeInteger(example.blockAbove.y)||
        example.blockAbove.y<=example.at[1]))
        throw new TypeError('Protected above-surface ID witness mismatch');
      if(id===null&&(example.support!==0||example.blockAbove!==null))
        throw new TypeError('Protected AIR witness mismatch');
    }
    grass+=row.grass;candidates+=row.proposed;
    protectedGrass+=row.skippedProtected;sampled+=row.sampled;
  }
  if(Object.values(categories).reduce((a,b)=>a+b,0)!==protectedGrass)
    throw new TypeError('S2 source categories do not conserve grass');
  return Object.freeze({state:'detached-read-only-no-M7-writes',seeds:Object.freeze([...seeds]),
    sampled,grass,eligibleFutureCaps:candidates,protectedGrass,
    categories:Object.freeze(categories)});
}
