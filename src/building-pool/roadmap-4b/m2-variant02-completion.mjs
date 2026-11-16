// Mythwrought Builder 4B M2 — the ten previously missing variant-02 regional slots.
// Individually specified coordinate ranges, rounded pavilions, real open courtyards,
// room programs and supported roof crowns. Source candidates, not runtime integration.
import {M2_53_ALL} from './m2-variant02-expansion.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
{t:'healers-house',b:'temperate',s:'large',variant:2,title:'Riverbend Serpentine Infirmary',dim:[41,14,38],
 r:[[16,23,1,33],[4,17,7,15],[22,36,17,25],[6,17,25,32]],e:[19,1],
 rooms:[['waiting',19,5],['treatment',9,11],['recovery',30,21],['herbal-dispensary',10,29],['isolation-ward',19,29],['consultation',19,14]],
 div:[['x',13,8,15,11]],peak:[[9,11],[30,21],[10,29],[19,15]],roof:'serpentine-four-wing-healing-gables'},
{t:'healers-house',b:'desert',s:'small',variant:2,title:'Dustgate Dual-Round Apothecary',dim:[24,12,24],
 r:[[10,15,1,21],[7,11,8,12],[15,18,12,17]],discs:[[6,10,5,5],[18,15,4,4]],e:[12,1],
 rooms:[['waiting',12,5],['treatment',6,9],['recovery',18,15],['herb-storage',12,18]],
 div:[['x',11,8,14,10]],peak:[[6,9],[18,15],[12,15]],roof:'sunshield-double-round-dome-and-spine'},
{t:'healers-house',b:'snow',s:'small',variant:2,title:'Iceloft Hearth Cross',dim:[25,12,25],
 r:[[9,16,1,22],[3,11,9,15],[14,22,8,14]],e:[12,1],
 rooms:[['waiting',12,5],['treatment',6,12],['recovery',19,11],['herb-storage',12,19]],
 div:[['z',9,10,16,13]],peak:[[6,12],[19,11],[12,17]],roof:'three-roof-ice-cross'},
{t:'healers-house',b:'enchanted-forest',s:'large',variant:2,title:'Moonpetal Grand Recovery House',dim:[40,14,40],
 discs:[[19,15,11,10],[10,28,8,8],[29,28,8,8]],r:[[15,23,1,17],[14,24,14,30]],e:[19,1],
 rooms:[['waiting',19,5],['treatment',10,27],['recovery',29,27],['herbal-repository',19,23],['consultation',13,14],['isolation-ward',26,14]],
 div:[['x',15,20,29,24]],peak:[[19,14],[10,27],[29,27],[19,23]],roof:'grand-triple-lotus-dome-wings'},
{t:'healers-house',b:'mountain',s:'medium',variant:2,title:'Skybridge Curative Lodge',dim:[35,13,32],
 r:[[14,21,1,29],[3,15,9,17],[20,32,15,24]],e:[17,1],
 rooms:[['waiting',17,5],['treatment',8,13],['recovery',27,20],['medicine-cabinet',17,25]],
 div:[['x',13,10,16,13]],peak:[[8,13],[27,20],[17,25]],roof:'tri-spur-stone-curative-roofs'},
{t:'library',b:'temperate',s:'small',variant:2,title:'Brookgate Twin-Round Reading Cottage',dim:[24,12,25],
 r:[[9,15,1,21],[3,10,8,14],[14,21,13,19]],discs:[[6,11,4,4]],e:[12,1],
 rooms:[['catalogue',12,5],['collections',6,11],['reading-room',18,16],['archive',12,19]],
 div:[['x',9,10,15,12]],peak:[[6,11],[18,16]],roof:'offset-brookgate-reading-gables'},
{t:'library',b:'desert',s:'large',variant:2,title:'Sirocco Twin-Courtyard Archive',dim:[42,14,39],
 r:[[3,37,3,33],[17,23,1,5]],holes:[[13,17,5,5],[27,17,5,5]],e:[20,1],
 rooms:[['catalogue',20,6],['collections',7,9],['reading-room',33,9],['scroll-archive',7,28],['manuscript-vault',33,28],['scriptorium',20,29]],
 div:[['z',8,12,24,18]],peak:[[8,9],[33,9],[8,28],[33,28]],roof:'siroscript-double-open-sky-archive'},
{t:'library',b:'snow',s:'small',variant:2,title:'Frostflower Rear-Wing Library',dim:[24,12,25],
 discs:[[11,12,9,9]],r:[[9,13,1,7],[13,19,14,22]],e:[11,1],
 rooms:[['catalogue',11,5],['collections',6,12],['reading-room',16,12],['archive',11,18]],
 div:[['z',10,6,15,12]],peak:[[11,12],[17,18]],roof:'frostflower-circular-crown-and-rear-archive'},
{t:'library',b:'enchanted-forest',s:'medium',variant:2,title:'Greenhush Branching Lore Grove',dim:[34,13,34],
 discs:[[9,13,7,7],[24,13,7,7],[17,25,6,6]],r:[[13,20,10,24],[14,20,1,11]],e:[17,1],
 rooms:[['catalogue',17,6],['collections',9,13],['reading-room',24,13],['lore-archive',17,25],['oral-history',17,19]],
 div:[['x',13,11,17,14]],peak:[[9,13],[24,13],[17,25]],roof:'branching-three-timber-reading-domes'},
{t:'library',b:'mountain',s:'small',variant:2,title:'Basalt Sentry Round Archive',dim:[25,12,26],
 discs:[[10,11,7,7]],r:[[11,19,10,22],[9,13,1,8]],e:[11,1],
 rooms:[['catalogue',11,5],['collections',7,11],['reading-room',17,16],['book-vault',15,20]],
 div:[['z',11,11,18,14]],peak:[[10,11],[17,17]],roof:'round-stone-front-bastion-and-rear-gable'}
]);
export const M2_VARIANT02_COMPLETION=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_63_ALL=Object.freeze([...M2_53_ALL,...M2_VARIANT02_COMPLETION]);
export const M2_63_CENSUS=Object.freeze({
 newModels:M2_VARIANT02_COMPLETION.length,authored:M2_63_ALL.length,remaining:285-M2_63_ALL.length,
 healers:M2_63_ALL.filter(x=>x.type==='healers-house').length,
 libraries:M2_63_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_63_ALL.map(geometrySignature)).size,
 creatorApproved:0,integrated:0
});
validateCollection(M2_63_ALL);
if(M2_63_CENSUS.newModels!==10||M2_63_CENSUS.authored!==63||
 M2_63_CENSUS.healers!==30||M2_63_CENSUS.libraries!==30||
 M2_63_CENSUS.fingerprints!==63)throw Error('Builder 4B M2 full variant-02 census and unique geometry failure');
export const M2_VARIANT02_COMPLETION_NAMES=Object.freeze(PLANS.map(p=>p.title));
