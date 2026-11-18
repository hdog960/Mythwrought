// Builder 4B M2: ten independently authored variant-02 spatial designs.
// No random seeds, mirrors, rotations, palette-only duplicates or live world placement.
import {M2_33_ALL,buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
{t:'healers-house',b:'temperate',s:'medium',variant:2,title:'Trident Recovery Clinic',dim:[29,13,29],
 r:[[11,17,1,26],[3,11,9,17],[17,25,9,17]],e:[14,1],
 rooms:[['waiting',14,5],['treatment',7,13],['recovery',21,13],['herb-storage',14,22]],
 div:[['z',11,10,18,14]],peak:[[7,13],[21,13],[14,21]],roof:'trident-slope-and-three-gables'},
{t:'healers-house',b:'desert',s:'large',variant:2,title:'Oasis Ring Recovery Court',dim:[38,14,38],
 r:[[3,33,3,32],[14,22,1,5]],holes:[[18,19,7,7]],e:[18,1],
 rooms:[['waiting',18,6],['treatment',8,12],['recovery',29,12],['dispensary',8,28],['isolation-ward',29,28],['consultation',18,29]],
 div:[['z',9,7,29,18]],peak:[[7,7],[29,7],[7,29],[29,29]],roof:'sun-sheltered-circular-court'},
{t:'healers-house',b:'snow',s:'medium',variant:2,title:'Twin-Fir Warming Clinic',dim:[32,13,29],
 discs:[[10,12,8,8],[23,12,7,7]],r:[[8,25,8,16],[9,15,1,9]],e:[12,1],
 rooms:[['waiting',12,5],['treatment',10,12],['recovery',23,12],['dispensary',19,14]],
 div:[['x',17,9,15,12]],peak:[[10,12],[23,12]],roof:'twin-warm-snow-domes'},
{t:'healers-house',b:'enchanted-forest',s:'small',variant:2,title:'Petalglow Remedy House',dim:[24,12,24],
 discs:[[11,11,9,9]],r:[[8,14,1,7]],e:[11,1],
 rooms:[['waiting',11,5],['treatment',7,11],['recovery',15,11],['herb-storage',11,16]],
 div:[['z',9,8,14,11]],peak:[[11,11]],roof:'low-timber-petal-cap'},
{t:'healers-house',b:'mountain',s:'large',variant:2,title:'Five-Crags Mountain Hospital',dim:[41,14,38],
 r:[[15,23,1,35],[3,16,8,15],[22,36,8,15],[6,15,24,32],[23,34,23,32]],e:[19,1],
 rooms:[['waiting',19,5],['treatment',9,12],['recovery',30,12],['dispensary',10,29],['isolation-ward',29,28],['rest-gallery',19,20]],
 div:[['x',14,10,15,12]],peak:[[9,12],[30,12],[10,29],[29,28]],roof:'five-spur-cliff-gables'},
{t:'library',b:'temperate',s:'medium',variant:2,title:'Circular Twin-Stacks Athenaeum',dim:[33,13,31],
 discs:[[10,12,8,8],[23,12,8,8]],r:[[9,24,9,16],[13,19,1,10],[11,21,17,26]],e:[16,1],
 rooms:[['catalogue',16,5],['collections',10,12],['reading-room',23,12],['archive',16,22]],
 div:[['z',18,12,20,16]],peak:[[10,12],[23,12],[16,22]],roof:'three-circular-reading-towers'},
{t:'library',b:'desert',s:'small',variant:2,title:'Zigzag Manuscript Study',dim:[27,13,27],
 r:[[8,14,1,24],[2,11,7,13],[11,23,15,21]],e:[11,1],
 rooms:[['catalogue',11,5],['collections',6,10],['reading-room',19,18],['archive',11,22]],
 div:[['z',10,9,17,13]],peak:[[6,10],[19,18],[11,21]],roof:'switching-desert-ridge'},
{t:'library',b:'snow',s:'medium',variant:2,title:'Winter Codex Butterfly',dim:[32,13,29],
 r:[[3,28,3,18],[10,21,1,5],[4,11,19,26],[20,27,19,25]],e:[15,1],
 rooms:[['catalogue',15,5],['collections',7,10],['reading-room',24,10],['archive',7,23],['vault',24,23]],
 div:[['z',12,13,19,15]],peak:[[7,10],[24,10],[7,23],[24,23]],roof:'four-butterfly-ice-bays'},
{t:'library',b:'enchanted-forest',s:'large',variant:2,title:'Moonwell Open-Air Lore Library',dim:[40,15,40],
 discs:[[19,19,16,16]],holes:[[19,19,7,7]],r:[[16,22,1,6]],e:[19,1],
 rooms:[['catalogue',19,6],['collections',9,16],['reading-room',29,16],['archive',9,27],['scholars-study',29,27],['observatory',19,32]],
 div:[['x',12,10,15,12]],peak:[[9,16],[29,16],[9,27],[29,27]],roof:'moonwell-ring-four-stacks'},
{t:'library',b:'mountain',s:'medium',variant:2,title:'Spur-Wing Codex Library',dim:[35,13,32],
 r:[[13,20,1,28],[2,14,10,16],[19,32,17,25]],e:[16,1],
 rooms:[['catalogue',16,5],['collections',7,13],['reading-room',26,21],['archive',16,24]],
 div:[['x',12,11,15,13]],peak:[[7,13],[26,21],[16,12]],roof:'cliff-spur-ridge-and-wings'}
]);
export const M2_VARIANT_02=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_43_ALL=Object.freeze([...M2_33_ALL,...M2_VARIANT_02]);
export const M2_43_CENSUS=Object.freeze({
 newModels:M2_VARIANT_02.length,authored:M2_43_ALL.length,remaining:285-M2_43_ALL.length,
 healers:M2_43_ALL.filter(x=>x.type==='healers-house').length,
 libraries:M2_43_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_43_ALL.map(geometrySignature)).size,
 creatorApproved:0,integrated:0
});
validateCollection(M2_43_ALL);
if(M2_43_CENSUS.newModels!==10||M2_43_CENSUS.authored!==43||M2_43_CENSUS.healers!==20||
 M2_43_CENSUS.libraries!==20||M2_43_CENSUS.fingerprints!==43)
 throw Error('Builder 4B M2 second-variant authorship/cell identity invalid');
export const M2_VARIANT_02_NAMES=Object.freeze(PLANS.map(p=>p.title));
