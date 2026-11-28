// Hand-authored M1 representative programme roster, Builder 3A ONLY.
// 44 distinctive missing category/biome/size architecture records.
// Each row: type|biome|size|identity|width|depth|roof|footprint-cut|cutWidth|
// cutLength|open-roof-workcourt|partition-program|pierSpacing|rackSide.
// The companion builder materializes every selected coordinate, including
// real nonrectangular cut footprints, roofs, structural piers, and rooms.
const ROWS=[
'armorer|temperate|medium|forge-and-fitting-crosshall|25|28|cross|nw|4|9|north-loading|two|5|west',
'armorer|temperate|large|royal-harness-nave|32|34|gambrel|east|5|10|east-garden|three|6|east',
'armorer|desert|small|courtyard-bronze-fitting|23|25|butterfly|se|3|8|south-porch|one|4|east',
'armorer|desert|large|colonnaded-plate-forge|36|33|terrace|sw|6|11|west-court|three|7|west',
'armorer|snow|small|compact-snowplate-shop|24|26|hip|ne|4|7|none|one|5|west',
'armorer|snow|medium|winter-sheltered-armory|28|29|gable|west|4|10|central-skylight|two|4|east',
'armorer|enchanted-forest|small|vine-bound-armor-shed|22|27|lantern|nw|3|8|north-loading|one|4|west',
'armorer|enchanted-forest|medium|moonsteel-gallery|29|26|axial|east|5|9|east-garden|two|5|east',
'armorer|enchanted-forest|large|elderwood-harness-complex|35|37|cloister|sw|6|13|west-court|three|6|west',
'armorer|mountain|small|ridgeplate-fabricator|26|24|stepped|ne|4|7|south-porch|one|4|east',
'armorer|mountain|large|fortress-armor-gallery|37|36|saw|west|5|12|central-skylight|three|7|west',
'carpenter|temperate|medium|riverbend-joinery-hall|27|28|shed|ne|4|9|east-garden|two|5|east',
'carpenter|temperate|large|guild-framing-yard|34|32|cross|west|5|12|west-court|three|6|west',
'carpenter|desert|small|sand-dried-cabinet-shed|23|27|pergola|sw|3|7|south-porch|one|4|west',
'carpenter|desert|medium|oasis-timber-market|30|29|butterfly|east|5|11|east-garden|two|5|east',
'carpenter|snow|small|cedar-warming-cabin|24|25|gambrel|nw|4|6|none|one|5|west',
'carpenter|snow|medium|fir-beam-drying-hall|28|31|hip|se|4|10|central-skylight|two|5|east',
'carpenter|snow|large|winter-lumber-complex|35|35|saw|west|6|13|north-loading|three|7|west',
'carpenter|enchanted-forest|small|bentbranch-craft-kiosk|22|28|lantern|ne|3|8|east-garden|one|4|east',
'carpenter|enchanted-forest|large|canopy-joiners-compound|36|34|cloister|sw|6|12|west-court|three|6|west',
'carpenter|mountain|small|mountain-cedar-sawshop|25|26|stepped|nw|4|7|south-porch|one|4|west',
'carpenter|mountain|medium|cliff-frame-carpentry|31|30|axial|east|5|10|north-loading|two|6|east',
'stonemason|temperate|medium|townstone-carving-house|28|27|gable|se|4|9|south-porch|two|5|west',
'stonemason|temperate|large|guildstone-column-yard|35|38|half-vault|west|6|12|west-court|three|7|east',
'stonemason|desert|small|sunbaked-stonecutters|24|28|pergola|ne|4|7|east-garden|one|4|east',
'stonemason|desert|medium|sandstone-inlay-gallery|30|28|terrace|sw|5|10|north-loading|two|5|west',
'stonemason|snow|small|icegranite-carving-shelter|25|27|hip|nw|4|8|none|one|5|west',
'stonemason|snow|large|frost-column-works|37|35|gambrel|east|6|13|central-skylight|three|6|east',
'stonemason|enchanted-forest|small|glimmerstone-cutter|23|29|lantern|se|3|9|south-porch|one|4|east',
'stonemason|enchanted-forest|medium|rune-carving-atelier|31|27|axial|west|5|9|west-court|two|5|west',
'stonemason|enchanted-forest|large|enchanted-monolith-yard|38|39|cloister|ne|6|14|east-garden|three|7|east',
'stonemason|mountain|small|highpass-quarry-shed|26|25|stepped|sw|4|7|north-loading|one|5|west',
'stonemason|mountain|large|escarpment-stoneworks|39|36|cross|east|6|13|central-skylight|three|7|east',
'mining-workshop|temperate|medium|river-ore-sorting-house|27|29|shed|nw|4|9|north-loading|two|5|west',
'mining-workshop|temperate|large|ore-cart-transshipment|36|34|saw|se|6|11|south-porch|three|6|east',
'mining-workshop|desert|small|dune-ore-storehouse|24|26|pergola|sw|4|7|west-court|one|4|west',
'mining-workshop|desert|medium|arid-mineral-sorting|29|31|terrace|ne|5|11|east-garden|two|6|east',
'mining-workshop|desert|large|desert-crusher-yard-shell|38|37|butterfly|west|6|14|north-loading|three|7|west',
'mining-workshop|snow|small|snow-ore-measuring-hut|25|28|hip|nw|4|8|none|one|5|west',
'mining-workshop|snow|large|icepass-transfer-barracks|37|39|gambrel|east|6|13|central-skylight|three|6|east',
'mining-workshop|enchanted-forest|small|lucent-ore-staging|23|30|lantern|se|3|9|south-porch|one|4|east',
'mining-workshop|enchanted-forest|medium|aether-mineral-wash-hall|32|29|cloister|sw|5|11|west-court|two|5|west',
'mining-workshop|mountain|small|tunnelmouth-equipment-store|26|27|stepped|ne|4|8|north-loading|one|5|east',
'mining-workshop|mountain|medium|cliff-ore-ramp-station|33|32|cross|west|5|12|central-skylight|two|6|west'
];
const FIELDS=['type','biome','size','design','width','depth','roofProfile','footprintCut','cutWidth','cutLength','roofCourt','partitionPlan','pierSpacing','rackSide'];
export const M1_COMPLETION_SPECS=Object.freeze(ROWS.map(s=>{
 const values=s.split('|');if(values.length!==FIELDS.length)throw Error('Invalid 3A authored specification '+s);
 const o=Object.fromEntries(FIELDS.map((f,i)=>[f,[4,5,8,9,12].includes(i)?Number(values[i]):values[i]]));
 return Object.freeze(o);
}));
if(M1_COMPLETION_SPECS.length!==44)throw Error('M1 completion must author exactly 44 missing representatives');
