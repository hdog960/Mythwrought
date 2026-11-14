// Roadmap 3: planning identities, not persistent block IDs.
export const BIOMES = Object.freeze(['temperate', 'desert', 'snow', 'enchanted-forest', 'mountain']);
export const SIZES = Object.freeze(['small', 'medium', 'large']);
export const TYPES = Object.freeze([
  {key:'blacksmith', perSizeBiome:5, milestone:2},
  {key:'armorer', perSizeBiome:5, milestone:2},
  {key:'carpenter', perSizeBiome:5, milestone:2},
  {key:'stonemason', perSizeBiome:4, milestone:3},
  {key:'mining-workshop', perSizeBiome:4, milestone:3},
  {key:'lumberyard', perSizeBiome:4, milestone:3},
  {key:'mill', perSizeBiome:4, milestone:3},
  {key:'watchtower', perSizeBiome:5, milestone:4},
  {key:'barracks', perSizeBiome:4, milestone:4},
  {key:'gatehouse', perSizeBiome:4, milestone:4},
  {key:'city-wall', perSizeBiome:3, milestone:4},
].map(Object.freeze));
export const TOTAL_DESIGNS = TYPES.reduce((n,t)=>n+t.perSizeBiome*BIOMES.length*SIZES.length,0);
export function slotId(type,biome,size,variant){return `r3:${type}:${biome}:${size}:${variant}`;}
export function assertSlot(type,biome,size,variant){
  const t=TYPES.find(t=>t.key===type);
  if(!t||!BIOMES.includes(biome)||!SIZES.includes(size)||!Number.isInteger(variant)||variant<1||variant>t.perSizeBiome)
    throw new RangeError('Roadmap 3 category / biome / size / variation is not allocated');
  return slotId(type,biome,size,variant);
}
export function* slots(){
  for(const type of TYPES)for(const biome of BIOMES)for(const size of SIZES)
    for(let variant=1;variant<=type.perSizeBiome;variant++)
      yield Object.freeze({id:slotId(type.key,biome,size,variant),type:type.key,biome,size,variant,milestone:type.milestone});
}