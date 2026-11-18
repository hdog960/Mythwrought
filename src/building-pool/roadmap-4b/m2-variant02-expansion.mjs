// Builder 4B M2: ten more original variant-02 buildings in missing biome×size slots.
// Explicit authored spatial forms/rooms, never rotational/mirrored/palette-only variants.
import {M2_43_ALL} from './m2-variant02.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
{t:'healers-house',b:'temperate',s:'small',variant:2,title:'Hollowbrook L-Wing Clinic',dim:[22,12,23],
 r:[[3,10,2,18],[10,17,9,17],[8,13,1,7]],e:[11,1],
 rooms:[['waiting',11,4],['treatment',6,10],['recovery',14,14],['herb-storage',7,16]],
 div:[['x',9,12,17,14]],peak:[[6,10],[14,14]],roof:'hollowbrook-staggered-L-ridge'},
{t:'healers-house',b:'desert',s:'medium',variant:2,title:'Duneveil Hollow-Court Clinic',dim:[29,13,28],
 r:[[3,25,3,22],[10,18,1,5]],holes:[[14,13,4,4]],e:[14,1],
 rooms:[['waiting',14,5],['treatment',7,8],['recovery',21,8],['dispensary',7,19],['cooling-chamber',21,19]],
 div:[['x',9,9,15,11]],peak:[[6,8],[22,8],[7,19],[22,19]],roof:'dune-courtyard-raised-arcades'},
{t:'healers-house',b:'snow',s:'large',variant:2,title:'Crosspeak Winter Hospice',dim:[36,14,34],
 r:[[3,14,2,28],[19,31,5,31],[12,22,11,17],[13,20,1,6]],e:[16,1],
 rooms:[['waiting',16,4],['treatment',7,9],['recovery',25,10],['supply-room',8,24],['isolation-ward',25,26],['warming-gallery',17,14]],
 div:[['z',19,20,28,24]],peak:[[7,9],[25,10],[8,24],[25,26]],roof:'crosspeak-insulated-four-roofs'},
{t:'healers-house',b:'enchanted-forest',s:'medium',variant:2,title:'Lilywheel Leaf Apothecary',dim:[32,13,32],
 discs:[[10,14,8,8],[23,14,7,7]],r:[[9,23,11,17],[13,18,2,13]],e:[15,2],
 rooms:[['waiting',15,6],['treatment',10,14],['recovery',23,14],['herb-storage',15,18]],
 div:[['z',16,17,23,20]],peak:[[10,14],[23,14],[16,9]],roof:'lilywheel-three-separate-pitched-crowns'},
{t:'healers-house',b:'mountain',s:'small',variant:2,title:'Switchback Cragline Outpost',dim:[25,12,25],
 r:[[10,16,1,21],[3,11,7,12],[14,22,13,18]],e:[13,1],
 rooms:[['waiting',13,4],['treatment',6,10],['recovery',19,16],['medicine-cabinet',13,19]],
 div:[['x',12,8,14,10]],peak:[[6,10],[19,16],[13,15]],roof:'rockline-switchback-gables'},
{t:'library',b:'temperate',s:'large',variant:2,title:'Quadryght Garden Archive',dim:[38,14,35],
 r:[[2,33,3,28],[15,21,1,5]],holes:[[18,16,7,6]],e:[18,1],
 rooms:[['catalogue',18,6],['collections',7,9],['reading-room',28,9],['archive',7,24],['study-hall',28,24],['cartography',18,27]],
 div:[['z',7,5,10,7]],peak:[[7,9],[28,9],[7,24],[28,24]],roof:'temperate-quad-ridge-and-sky-court'},
{t:'library',b:'desert',s:'medium',variant:2,title:'Sandscript Forked Scriptorium',dim:[29,13,30],
 r:[[3,24,1,12],[8,14,12,26],[17,25,12,24]],e:[12,1],
 rooms:[['catalogue',12,5],['collections',6,8],['reading-room',20,8],['copy-room',11,22],['archive',22,20]],
 div:[['x',9,13,20,16]],peak:[[6,8],[20,8],[11,22],[22,20]],roof:'desert-splayed-fork-gables'},
{t:'library',b:'snow',s:'large',variant:2,title:'Icebridge Glacial Codex Hall',dim:[38,14,34],
 r:[[3,15,2,28],[20,34,7,31],[13,25,15,20],[13,21,1,7]],e:[17,1],
 rooms:[['catalogue',17,4],['collections',8,8],['reading-room',28,12],['archive',8,24],['manuscript-vault',27,27],['index-workroom',18,17]],
 div:[['z',21,22,31,26]],peak:[[8,8],[28,12],[8,24],[27,27]],roof:'offset-glacier-parallel-wings'},
{t:'library',b:'enchanted-forest',s:'small',variant:2,title:'Two-Bloom Lore Cottage',dim:[24,12,25],
 discs:[[8,12,7,7],[16,16,5,5]],r:[[8,13,1,10],[11,17,12,16]],e:[10,1],
 rooms:[['catalogue',10,5],['collections',6,12],['reading-room',17,16],['archive',12,17]],
 div:[['z',10,5,12,9]],peak:[[8,12],[16,16]],roof:'two-bloom-nested-crown'},
{t:'library',b:'mountain',s:'large',variant:2,title:'Four-Buttress Basalt Library',dim:[41,15,38],
 r:[[15,23,1,35],[3,15,9,16],[23,37,9,17],[5,15,23,31],[23,35,24,33]],e:[19,1],
 rooms:[['catalogue',19,5],['collections',8,12],['reading-room',30,12],['archive',8,27],['rare-books-vault',29,28],['map-room',19,22]],
 div:[['x',17,12,19,15]],peak:[[8,12],[30,12],[8,27],[29,28]],roof:'basalt-four-buttresses-and-spire'}
]);
export const M2_VARIANT02_EXPANSION=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_53_ALL=Object.freeze([...M2_43_ALL,...M2_VARIANT02_EXPANSION]);
export const M2_53_CENSUS=Object.freeze({
 newModels:M2_VARIANT02_EXPANSION.length,authored:M2_53_ALL.length,remaining:285-M2_53_ALL.length,
 healers:M2_53_ALL.filter(x=>x.type==='healers-house').length,
 libraries:M2_53_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_53_ALL.map(geometrySignature)).size,
 creatorApproved:0,integrated:0
});
validateCollection(M2_53_ALL);
if(M2_53_CENSUS.newModels!==10||M2_53_CENSUS.authored!==53||
 M2_53_CENSUS.healers!==25||M2_53_CENSUS.libraries!==25||
 M2_53_CENSUS.fingerprints!==53)throw Error('M2 53-model physical source census or shape originality failure');
export const M2_VARIANT02_EXPANSION_NAMES=Object.freeze(PLANS.map(p=>p.title));
