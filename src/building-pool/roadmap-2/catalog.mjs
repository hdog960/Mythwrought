// Roadmap 2 only: planned slots do not represent authored buildings.
export const BIOMES=Object.freeze(["temperate","desert","snow","enchanted-forest","mountain"]);
export const SIZES=Object.freeze(["small","medium","large"]);
export const CATEGORIES=Object.freeze([["general-store",5,2,["sales-floor","service-counter","display-shelves","storage"]],["pet-shop",5,2,["sales-floor","service-counter","empty-animal-display","storage"]],["magic-shop",5,2,["sales-floor","service-counter","arcane-display","storage"]],["potion-shop",5,2,["sales-floor","service-counter","alchemy-workspace","storage"]],["bakery",5,2,["sales-floor","service-counter","oven","food-preparation","storage"]],["market-square",4,3,["square","vendor-stalls","public-circulation"]],["tailor",4,3,["sales-floor","service-counter","garment-display","fitting-area"]],["butcher",4,3,["sales-floor","service-counter","butcher-workspace","cold-storage"]],["jeweler",4,3,["sales-floor","service-counter","jewelry-display","secure-workroom"]],["bookshop",4,3,["sales-floor","service-counter","bookshelves","reading-area"]],["bank",3,4,["public-hall","administrative-office","vault"]],["temple",5,4,["ceremonial-space","altar","public-circulation"]],["theater",3,4,["stage","audience-area","backstage","public-circulation"]]].map(([key,variants,milestone,requirements])=>Object.freeze({key,variants,milestone,requirements})));
export function plannedSlots(){
 const result=[];
 for(const c of CATEGORIES)for(const biome of BIOMES)for(const size of SIZES)
 for(let variation=1;variation<=c.variants;variation++)
 result.push(Object.freeze({id:"r2:"+c.key+":"+biome+":"+size+":"+String(variation).padStart(2,"0"),category:c.key,biome,size,variation,milestone:c.milestone,status:"planned"}));
 return result;
}
export function inventory(){
 const slots=plannedSlots();
 return {target:slots.length,byCategory:Object.fromEntries(CATEGORIES.map(c=>[c.key,slots.filter(s=>s.category===c.key).length])),byMilestone:Object.fromEntries([2,3,4].map(m=>["M"+m,slots.filter(s=>s.milestone===m).length]))};
}
