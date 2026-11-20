// Builder 4B M2: ten independently authored original variant-03 plans.
// Explicit physical voxel footprints, functional rooms, real courtyard voids.
// Candidate-only: no world placement, save/ID writes, sibling-lane mutation.
import {M2_63_ALL} from './m2-variant02-completion.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
{t:'healers-house',b:'temperate',s:'large',variant:3,title:'Hearthreach Split-Oval Hospice',dim:[44,15,42],
 discs:[[12,15,9,9],[31,23,9,9]],r:[[13,31,15,21],[18,25,1,18]],e:[21,1],
 rooms:[['waiting',21,5],['treatment',12,15],['recovery',31,23],['consultation',23,17],['herbal-study',17,20],['isolation-ward',31,28]],
 div:[['x',21,12,19,15]],peak:[[12,15],[31,23],[21,8]],roof:'temperate-offset-oval-flying-bridge'},
{t:'healers-house',b:'desert',s:'medium',variant:3,title:'Saltshade Forked Quarantine',dim:[34,13,33],
 r:[[13,20,1,29],[3,13,8,15],[20,30,16,24]],e:[16,1],
 rooms:[['waiting',16,5],['treatment',7,11],['recovery',26,20],['dispensary',16,25],['isolation-bay',16,16]],
 div:[['z',15,14,19,16]],peak:[[7,11],[26,20],[16,23]],roof:'saltshade-asymmetric-separation-wings'},
{t:'healers-house',b:'snow',s:'small',variant:3,title:'Frostcoil Quadrant Clinic',dim:[26,12,26],
 discs:[[12,13,10,10]],holes:[[12,13,3,3]],r:[[10,15,1,7]],e:[12,1],
 rooms:[['waiting',12,5],['treatment',6,13],['recovery',18,13],['herb-storage',12,20]],
 div:[['x',7,10,17,13]],peak:[[6,13],[18,13],[12,20]],roof:'snow-quadrant-open-air-dome'},
{t:'healers-house',b:'enchanted-forest',s:'large',variant:3,title:'Three-Moonleaf Treatment Gardens',dim:[44,15,42],
 discs:[[14,13,10,9],[29,13,10,9],[21,29,11,9]],r:[[14,29,11,30],[17,24,1,12]],e:[20,1],
 rooms:[['waiting',20,5],['treatment',13,13],['recovery',30,13],['herb-garden',21,28],['consultation',13,30],['isolation-ward',29,30]],
 div:[['x',21,17,25,20]],peak:[[14,13],[29,13],[21,29]],roof:'triple-staggered-moonleaf-pavilions'},
{t:'healers-house',b:'mountain',s:'medium',variant:3,title:'Stonehook Stair-Step Infirmary',dim:[36,13,35],
 r:[[14,21,1,30],[4,15,5,11],[20,33,15,23],[7,16,25,32]],e:[17,1],
 rooms:[['waiting',17,5],['treatment',8,8],['recovery',27,19],['dispensary',11,29],['recovery-gallery',17,21]],
 div:[['z',18,15,21,18]],peak:[[8,8],[27,19],[11,29]],roof:'three-offset-switchback-crag-gables'},
{t:'library',b:'temperate',s:'small',variant:3,title:'Wisteria Split-Cloister Reading House',dim:[28,12,28],
 discs:[[8,11,6,6],[19,16,6,7]],r:[[10,17,9,17],[10,15,1,10]],e:[12,1],
 rooms:[['catalogue',12,5],['collections',7,11],['reading-room',19,16],['archive',12,15]],
 div:[['x',13,10,16,12]],peak:[[8,11],[19,16]],roof:'wisteria-twin-offset-timber-domes'},
{t:'library',b:'desert',s:'large',variant:3,title:'Caravan Offset Twin Courts',dim:[45,15,43],
 r:[[3,18,6,34],[26,41,8,37],[16,28,17,23],[17,26,1,19]],holes:[[10,18,4,5],[33,23,4,5]],e:[21,1],
 rooms:[['catalogue',21,5],['collections',8,10],['reading-room',36,12],['archive',8,30],['scribe-vault',36,31],['map-room',21,20]],
 div:[['x',21,11,18,14]],peak:[[8,10],[36,12],[8,30],[36,31]],roof:'staggered-desert-double-sky-courts'},
{t:'library',b:'snow',s:'medium',variant:3,title:'Glacier Three-Tower Study',dim:[38,13,35],
 r:[[16,22,1,30],[3,16,7,14],[22,35,17,25]],discs:[[8,10,6,6],[29,22,6,6]],e:[19,1],
 rooms:[['catalogue',19,5],['collections',8,10],['reading-room',29,22],['archive',19,27],['manuscript-gallery',19,17]],
 div:[['z',12,16,22,19]],peak:[[8,10],[29,22],[19,27]],roof:'snow-three-tower-bridge-atrium'},
{t:'library',b:'enchanted-forest',s:'small',variant:3,title:'Fernspiral Lore Wheel',dim:[28,12,28],
 discs:[[13,13,11,11]],holes:[[13,13,3,3]],r:[[11,15,1,7]],e:[13,1],
 rooms:[['catalogue',13,5],['collections',6,12],['reading-room',20,12],['herbal-archive',13,21]],
 div:[['x',9,9,17,10]],peak:[[6,12],[20,12],[13,21]],roof:'fernspiral-courtyard-reading-wheel'},
{t:'library',b:'mountain',s:'large',variant:3,title:'Basalt Switchback Cliff Atlas',dim:[47,15,44],
 r:[[17,25,1,42],[2,18,5,13],[24,44,16,24],[4,19,32,40]],discs:[[11,9,8,7],[34,20,8,8],[11,36,7,6]],e:[21,1],
 rooms:[['catalogue',21,5],['collections',9,9],['reading-room',34,20],['archive',11,36],['cartographic-study',21,29],['rear-vault',21,39]],
 div:[['z',20,18,25,21]],peak:[[11,9],[34,20],[11,36],[21,32]],roof:'basalt-three-turn-switchback-roofline'}
]);
export const M2_VARIANT03_FIRST10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_73_ALL=Object.freeze([...M2_63_ALL,...M2_VARIANT03_FIRST10]);
export const M2_73_CENSUS=Object.freeze({
newModels:M2_VARIANT03_FIRST10.length,
authored:M2_73_ALL.length,
remaining:285-M2_73_ALL.length,
healers:M2_73_ALL.filter(x=>x.type==='healers-house').length,
libraries:M2_73_ALL.filter(x=>x.type==='library').length,
fingerprints:new Set(M2_73_ALL.map(geometrySignature)).size,
creatorApproved:0,integrated:0
});
validateCollection(M2_73_ALL);
if(M2_73_CENSUS.newModels!==10||M2_73_CENSUS.authored!==73||
M2_73_CENSUS.healers!==35||M2_73_CENSUS.libraries!==35||
M2_73_CENSUS.fingerprints!==73)throw Error('Builder 4B M2 variant03 originauthoring quota or geometry failure');
export const M2_VARIANT03_NAMES=Object.freeze(PLANS.map(x=>x.title));
