// Builder 1B exclusive planning/authoring contract. Never writes to the world.
export const SCHEMA='mythwrought.building-pool.roadmap-1b.allocation.v1';
export const BIOMES=Object.freeze(["temperate","desert","snow","enchanted-forest","mountain"]);
export const SIZES=Object.freeze(["small","medium","large"]);
export const QUOTAS=Object.freeze({'bathhouse':4,'stable':5,'farm-barn':4,'greenhouse':4,'fishing-lodge':4,'harbor-office':4,'lighthouse':4});
export const TARGET=15*Object.values(QUOTAS).reduce((a,b)=>a+b,0);
export function blueprintId(category,biome,size,index){
 if(!Object.hasOwn(QUOTAS,category)||!BIOMES.includes(biome)||!SIZES.includes(size)||!Number.isInteger(index)||index<1||index>QUOTAS[category])throw Error('Outside Builder 1B exclusive allocation');
 return ['r1',category,biome,size,String(index).padStart(3,'0')].join(':');
}
export function validateAllocation(items){
 if(!Array.isArray(items)||items.length>TARGET)throw Error('Invalid 1B candidate pool');
 const ids=new Set(),buckets=new Map();
 for(const b of items){
  if(!b||b.id!==blueprintId(b.category,b.biome,b.size,b.index)||b.status!=='candidate')throw Error('1B candidate identity mismatch');
  if(ids.has(b.id))throw Error('Duplicate 1B blueprint ID');ids.add(b.id);
  const slot=[b.category,b.biome,b.size].join('/');buckets.set(slot,(buckets.get(slot)||0)+1);
  if(buckets.get(slot)>QUOTAS[b.category])throw Error('1B slot quota exceeded');
 }
 return {authored:ids.size,target:TARGET,remaining:TARGET-ids.size,buckets:Object.fromEntries(buckets)};
}
