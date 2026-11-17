// Isolated Roadmap 2A reservation ledger. These records are NOT authored geometry.
export const BIOMES=Object.freeze(["temperate","desert","snow","enchanted-forest","mountain"]);
export const SIZES=Object.freeze(["small","medium","large"]);
export const CATEGORY_QUOTAS=Object.freeze({"general-store":5,"pet-shop":5,"magic-shop":5,"potion-shop":5,"bakery":5,"bank":3});
export const SOURCE_PR=124;
export const SOURCE_HEAD="07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68";
export const LEGACY_CATEGORY="general-store";
export const M1_SPECIALIST_IDS=Object.freeze(["r2:pet-shop:temperate:small:01","r2:magic-shop:enchanted-forest:medium:01","r2:potion-shop:snow:medium:01","r2:bakery:desert:small:01","r2:bank:mountain:large:01"]);
export const M1_ADDITIONAL_IDS=Object.freeze(["r2:general-store:desert:medium:02","r2:pet-shop:mountain:medium:01","r2:magic-shop:snow:large:01","r2:potion-shop:desert:small:01","r2:bakery:temperate:large:01","r2:bank:enchanted-forest:medium:01"]);
export const M1_REGIONAL_IDS=Object.freeze(["r2:general-store:temperate:medium:02","r2:pet-shop:desert:medium:01","r2:magic-shop:mountain:medium:01","r2:potion-shop:enchanted-forest:large:01","r2:bakery:snow:medium:01","r2:bank:desert:large:01"]);
export const M1_BIOME_EXPANSION_IDS=Object.freeze(["r2:general-store:mountain:large:02","r2:pet-shop:enchanted-forest:large:01","r2:magic-shop:temperate:large:01","r2:potion-shop:snow:small:01","r2:bakery:enchanted-forest:medium:01","r2:bank:snow:medium:01"]);
export const M1_CATEGORY_ARCADE_IDS=Object.freeze(["r2:general-store:desert:large:02","r2:pet-shop:mountain:small:01","r2:magic-shop:desert:medium:01","r2:potion-shop:mountain:large:01","r2:bakery:snow:large:01","r2:bank:temperate:medium:01"]);
export const M1_MARKET_FRONT_IDS=Object.freeze(["r2:general-store:snow:medium:02","r2:pet-shop:temperate:medium:01","r2:magic-shop:enchanted-forest:small:01","r2:potion-shop:desert:large:01","r2:bakery:mountain:medium:01","r2:bank:enchanted-forest:large:01"]);
export const M1_COURTYARD_IDS=Object.freeze(["r2:general-store:enchanted-forest:small:02","r2:pet-shop:snow:large:01","r2:magic-shop:snow:medium:01","r2:potion-shop:temperate:medium:01","r2:bakery:desert:medium:01","r2:bank:mountain:small:01"]);
export const M1_U_COURT_IDS=Object.freeze(["r2:general-store:mountain:medium:03","r2:pet-shop:desert:large:02","r2:magic-shop:enchanted-forest:large:02","r2:potion-shop:snow:large:02","r2:bakery:temperate:large:02","r2:bank:desert:large:02"]);
export const M1_STEPPED_COURT_IDS=Object.freeze(["r2:general-store:snow:large:03","r2:pet-shop:enchanted-forest:medium:02","r2:magic-shop:mountain:large:02","r2:potion-shop:temperate:large:02","r2:bakery:desert:large:03","r2:bank:snow:large:02"]);
export const M1_LATERAL_MARKET_IDS=Object.freeze(["r2:general-store:temperate:large:02","r2:pet-shop:snow:medium:02","r2:magic-shop:desert:large:02","r2:potion-shop:mountain:medium:02","r2:bakery:enchanted-forest:large:02","r2:bank:temperate:large:02"]);
export const M1_TWIN_SIDE_TERRACE_IDS=Object.freeze(["r2:general-store:desert:large:03","r2:pet-shop:temperate:medium:02","r2:magic-shop:snow:small:01","r2:potion-shop:mountain:small:01","r2:bakery:enchanted-forest:small:01","r2:bank:temperate:large:03"]);
export const M1_FIVE_COURT_IDS=Object.freeze(["r2:general-store:snow:large:04","r2:pet-shop:mountain:large:01","r2:magic-shop:temperate:small:01","r2:potion-shop:desert:medium:01","r2:bakery:mountain:large:01","r2:bank:snow:small:01"]);
export const M1_DISTINCT_WING_IDS=Object.freeze(["r2:general-store:temperate:medium:04","r2:pet-shop:snow:large:03","r2:magic-shop:desert:large:03","r2:potion-shop:enchanted-forest:large:03","r2:bakery:temperate:medium:03","r2:bank:mountain:large:03"]);
export const M1_LANDMARK_IDS=Object.freeze(["r2:general-store:enchanted-forest:large:03","r2:pet-shop:desert:large:03","r2:magic-shop:mountain:large:03","r2:potion-shop:snow:large:03","r2:bakery:enchanted-forest:large:03","r2:bank:desert:large:03"]);
export const M1_SIGNATURE_SKYLINE_IDS=Object.freeze(["r2:general-store:snow:small:03","r2:pet-shop:enchanted-forest:small:03","r2:magic-shop:temperate:medium:03","r2:potion-shop:mountain:large:03","r2:bakery:desert:medium:03","r2:bank:enchanted-forest:medium:02"]);
export const M1_SCULPTED_MARKET_IDS=Object.freeze(["r2:general-store:desert:small:04","r2:pet-shop:temperate:large:03","r2:magic-shop:snow:medium:03","r2:potion-shop:enchanted-forest:medium:03","r2:bakery:mountain:small:03","r2:bank:temperate:small:02"]);
const M1_SPECIALIST_SET=new Set([...M1_SPECIALIST_IDS,...M1_ADDITIONAL_IDS,...M1_REGIONAL_IDS,...M1_BIOME_EXPANSION_IDS,...M1_CATEGORY_ARCADE_IDS,...M1_MARKET_FRONT_IDS,...M1_COURTYARD_IDS,...M1_U_COURT_IDS,...M1_STEPPED_COURT_IDS,...M1_LATERAL_MARKET_IDS,...M1_TWIN_SIDE_TERRACE_IDS,...M1_FIVE_COURT_IDS,...M1_DISTINCT_WING_IDS,...M1_LANDMARK_IDS,...M1_SIGNATURE_SKYLINE_IDS,...M1_SCULPTED_MARKET_IDS]);

export function blueprintId(category,biome,size,variation){
  if(!Object.hasOwn(CATEGORY_QUOTAS,category)||!BIOMES.includes(biome)||!SIZES.includes(size)||!Number.isInteger(variation)||variation<1||variation>CATEGORY_QUOTAS[category]) throw new Error("unreserved roadmap-2a slot");
  return `r2:${category}:${biome}:${size}:${String(variation).padStart(2,"0")}`;
}
export function plannedSlots(){
  const items=[];
  for(const [category,quota] of Object.entries(CATEGORY_QUOTAS)) for(const biome of BIOMES) for(const size of SIZES) for(let variation=1;variation<=quota;variation++){
    const id=blueprintId(category,biome,size,variation);
    items.push(Object.freeze({id,category,biome,size,variation,legacySourceCandidate:category===LEGACY_CATEGORY&&variation===1,authoredHere:(category===LEGACY_CATEGORY&&variation===1)||M1_SPECIALIST_SET.has(id),status:(category===LEGACY_CATEGORY&&variation===1)||M1_SPECIALIST_SET.has(id)?"authored-candidate":"reserved-not-authored"}));
  }
  return items;
}
export function inventory(){
  const slots=plannedSlots();
  return Object.freeze({target:slots.length,legacySourceCandidates:slots.filter(x=>x.legacySourceCandidate).length,locallyMigrated:15,authoredCandidateTotal:110,newlyAuthored:95,creatorApproved:0,integratedIntoGame:0,unwrittenNewCandidates:310,byCategory:Object.freeze(Object.fromEntries(Object.keys(CATEGORY_QUOTAS).map(key=>[key,slots.filter(x=>x.category===key).length])))});
}

// Builder 2A owned physical-space requirements. Symbols are NOT persistent block IDs.
export const CATEGORIES=Object.freeze(Object.entries(CATEGORY_QUOTAS).map(([key,variants])=>Object.freeze({key,variants,requirements:Object.freeze({"general-store":["sales-floor","service-counter","display-shelves","storage"],"pet-shop":["sales-floor","service-counter","empty-animal-display","storage"],"magic-shop":["sales-floor","service-counter","arcane-display","storage"],"potion-shop":["sales-floor","service-counter","alchemy-workspace","storage"],"bakery":["sales-floor","service-counter","oven","food-preparation","storage"],"bank":["public-hall","administrative-office","vault"]}[key])})));
