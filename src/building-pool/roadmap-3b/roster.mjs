// Builder 3B — exclusively Production & Fortifications. Planning IDs are NOT block IDs.
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
export const TYPES=Object.freeze([
 {key:'lumberyard',perSizeBiome:4,milestone:2},
 {key:'mill',perSizeBiome:4,milestone:2},
 {key:'watchtower',perSizeBiome:5,milestone:2},
 {key:'barracks',perSizeBiome:4,milestone:3},
 {key:'gatehouse',perSizeBiome:4,milestone:3},
 {key:'city-wall',perSizeBiome:3,milestone:4}
].map(Object.freeze));
export const TOTAL_DESIGNS=TYPES.reduce((n,t)=>n+t.perSizeBiome*BIOMES.length*SIZES.length,0);
export const IMPORTED_LEGACY_DESIGNS=15;
export const CREATOR_ACCEPTED=0;
export const INTEGRATED_DESIGNS=0;
// Retain original PR #122 IDs exactly. Sibling 3A owns disjoint category names.
export function slotId(type,biome,size,variant){return `r3:${type}:${biome}:${size}:${variant}`;}
export function assertSlot(type,biome,size,variant){
 const t=TYPES.find(t=>t.key===type);
 if(!t||!BIOMES.includes(biome)||!SIZES.includes(size)||!Number.isInteger(variant)||variant<1||variant>t.perSizeBiome)
  throw new RangeError('Roadmap 3B category / biome / size / variation is not allocated');
 return slotId(type,biome,size,variant);
}
export function* slots(){
 for(const type of TYPES)for(const biome of BIOMES)for(const size of SIZES)
  for(let variant=1;variant<=type.perSizeBiome;variant++)
   yield Object.freeze({id:slotId(type.key,biome,size,variant),type:type.key,biome,size,variant,milestone:type.milestone});
}
