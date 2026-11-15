// Builder 3A only. Planning identities, never persistent voxel IDs or world placements.
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
export const TYPES=Object.freeze([
  {key:'blacksmith',perCombination:5,total:75,milestone:'M2'},
  {key:'armorer',perCombination:5,total:75,milestone:'M2'},
  {key:'carpenter',perCombination:5,total:75,milestone:'M3'},
  {key:'stonemason',perCombination:4,total:60,milestone:'M3'},
  {key:'mining-workshop',perCombination:4,total:60,milestone:'M4'}
].map(Object.freeze));
export const TOTAL_DESIGNS=345;
export const LEGACY_CANDIDATES=15;
export const UNAUTHORED=TOTAL_DESIGNS-LEGACY_CANDIDATES;
export function assertSlot(type,biome,size,variant){
  const row=TYPES.find(t=>t.key===type);
  if(!row||!BIOMES.includes(biome)||!SIZES.includes(size)||
     !Number.isSafeInteger(variant)||variant<1||variant>row.perCombination)
    throw RangeError('Builder 3A category, biome, size or variation is not allocated');
  return true;
}
export function isLegacySlot(type,biome,size,variant){
  assertSlot(type,biome,size,variant);
  return type==='blacksmith'&&variant===1;
}
export function slotId(type,biome,size,variant){
  assertSlot(type,biome,size,variant);
  // Original #122 identities are immutable. Never mint a duplicate 3A identity.
  const prefix=isLegacySlot(type,biome,size,variant)?'r3':'r3a';
  return `${prefix}:${type}:${biome}:${size}:${variant}`;
}
export function* slots(){
  for(const row of TYPES)for(const biome of BIOMES)for(const size of SIZES)
    for(let variant=1;variant<=row.perCombination;variant++)
      yield Object.freeze({id:slotId(row.key,biome,size,variant),
        type:row.key,biome,size,variant,legacy:isLegacySlot(row.key,biome,size,variant),milestone:row.milestone});
}
