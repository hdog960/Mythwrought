// Builder 2B only. 420 reserved identities are NOT 420 authored buildings.
// Identity prefix r2: is inherited intact from draft legacy PR #124; category ownership is exclusive.
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
const categories=[
  ['market-square',4,2,['square','vendor-stalls','public-circulation']],
  ['tailor',4,2,['sales-floor','service-counter','garment-display','fitting-area']],
  ['butcher',4,2,['sales-floor','service-counter','butcher-workspace','cold-storage']],
  ['jeweler',4,3,['sales-floor','service-counter','jewelry-display','secure-workroom']],
  ['bookshop',4,3,['sales-floor','service-counter','bookshelves','reading-area']],
  ['temple',5,3,['ceremonial-space','altar','public-circulation']],
  ['theater',3,4,['stage','audience-area','backstage','public-circulation']]
];
export const CATEGORIES=Object.freeze(categories.map(([key,variants,milestone,requirements])=>
  Object.freeze({key,variants,milestone,requirements:Object.freeze(requirements)})));
export function plannedSlots(){
  const result=[];
  for(const c of CATEGORIES)for(const biome of BIOMES)for(const size of SIZES)
    for(let variation=1;variation<=c.variants;variation++)
      result.push(Object.freeze({id:`r2:${c.key}:${biome}:${size}:${String(variation).padStart(2,'0')}`,
        category:c.key,biome,size,variation,milestone:c.milestone,status:'planned'}));
  return result;
}
export function inventory(){
  const slots=plannedSlots();
  return {target:slots.length,inheritedTemples:15,unbuilt:slots.length-15,
    byCategory:Object.fromEntries(CATEGORIES.map(c=>[c.key,slots.filter(s=>s.category===c.key).length])),
    byMilestone:Object.fromEntries([2,3,4].map(m=>['M'+m,slots.filter(s=>s.milestone===m).length]))};
}
