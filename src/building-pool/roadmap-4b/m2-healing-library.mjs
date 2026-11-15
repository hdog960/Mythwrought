// Builder 4B — M2: sixteen original region/scale healer and library plans.
// Every plan declares its own footprint wings, functional rear-room program and ridge.
// This deterministic physical-cell expansion is NOT a seed, palette-only or in-game build.
import {M1_EXEMPLARS,buildAdditionalFourBPlan} from './m1-exemplars.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
const HEAL='healers-house', LIB='library';
// x-z wings are [xStart,xEnd,zStart,zEnd]; the lower, full front hall is [1,w-2]×[1,front].
const PLANS=Object.freeze([
 {type:HEAL,biome:'temperate',size:'medium',w:22,front:13,tail:21,name:'Garden-Court Infirmary',
  wings:[[7,15,14,20]],rear:['herb-dispensary']},
 {type:HEAL,biome:'temperate',size:'large',w:27,front:16,tail:26,name:'Terraced Twin-Ward Hospice',
  wings:[[2,9,17,25],[17,24,17,24]],rear:['outpatient-services','private-rest-ward']},
 {type:HEAL,biome:'desert',size:'medium',w:23,front:12,tail:21,name:'Sandstone Arcaded Clinic',
  wings:[[2,8,13,20],[15,21,13,17]],rear:['cooling-chamber','medicine-preparation']},
 {type:HEAL,biome:'desert',size:'large',w:30,front:19,tail:33,name:'Oasis Recuperation Cloister',
  wings:[[2,9,20,28],[20,27,20,32]],rear:['open-air-herbal-study','isolation-rest-bay']},
 {type:HEAL,biome:'snow',size:'small',w:16,front:11,tail:16,name:'Firline Triage Lodge',
  wings:[[5,10,12,15]],rear:['warm-supplies']},
 {type:HEAL,biome:'snow',size:'medium',w:24,front:14,tail:26,name:'Avalanche Field Hospital',
  wings:[[3,9,15,20],[14,22,15,25]],rear:['cold-weather-recovery','insulated-stockroom']},
 {type:HEAL,biome:'enchanted-forest',size:'small',w:18,front:10,tail:19,name:'Mossveil Remedy Pavilion',
  wings:[[4,13,11,18]],rear:['botanical-consultation']},
 {type:HEAL,biome:'mountain',size:'medium',w:28,front:15,tail:24,name:'Highpass Sanatorium',
  wings:[[2,8,16,23],[20,26,16,19]],rear:['supplies-alcove','viewing-recuperation-wing']},

 {type:LIB,biome:'temperate',size:'small',w:17,front:12,tail:18,name:'Riverside Reading Lodge',
  wings:[[4,10,13,17]],rear:['community-catalogue']},
 {type:LIB,biome:'temperate',size:'medium',w:26,front:15,tail:23,name:'Twin-Wing Athenaeum',
  wings:[[1,7,16,22],[17,24,16,21]],rear:['scholars-study','bookbinding-studio']},
 {type:LIB,biome:'temperate',size:'large',w:30,front:20,tail:32,name:'Conservatory Grand Archive',
  wings:[[2,9,21,31],[21,27,21,28]],rear:['archive-consultation','rare-book-vault']},
 {type:LIB,biome:'desert',size:'small',w:19,front:12,tail:20,name:'Sandstone Scroll House',
  wings:[[11,17,13,19]],rear:['scribes-workroom']},
 {type:LIB,biome:'desert',size:'medium',w:25,front:18,tail:28,name:'Atrium Scriptorium',
  wings:[[2,8,19,27],[16,23,19,22]],rear:['scriptorium','sandstone-indexing']},
 {type:LIB,biome:'snow',size:'small',w:19,front:13,tail:19,name:'Snowbound Ledger House',
  wings:[[6,12,14,18]],rear:['protected-card-index']},
 {type:LIB,biome:'enchanted-forest',size:'large',w:32,front:22,tail:33,name:'Livingwood Lore Athenaeum',
  wings:[[3,11,23,32],[22,29,23,29]],rear:['livingwood-scriptorium','oral-history-chamber']},
 {type:LIB,biome:'mountain',size:'medium',w:30,front:18,tail:27,name:'Cliffstone Shelf Archive',
  wings:[[2,9,19,26],[21,28,19,23]],rear:['sealed-book-vault','ridge-observatory-reading']}
]);
const PALETTE={
 temperate:['live:stone','live:wood'],
 desert:['live:stone','live:wood'],
 snow:['live:deepstone','live:wood'],
 'enchanted-forest':['live:wood','live:stone'],
 mountain:['live:deepstone','live:wood']
};
function design(p){
 const mid=Math.floor(p.w/2);
 const bands=[[1,p.front,1,p.w-2],...p.wings.map(([x0,x1,z0,z1])=>[z0,z1,x0,x1])];
 const rooms=[
  {id:p.type===HEAL?'examination-suite':'reference-stacks',
   kind:p.type===HEAL?'treatment':'collections',box:[2,mid-4,4,8]},
  {id:p.type===HEAL?'recovery-bay':'public-reading-hall',
   kind:p.type===HEAL?'recovery':'reading-room',box:[mid+4,p.w-3,4,8]},
  {id:p.type===HEAL?'arrival-waiting':'entry-catalogue',
   kind:p.type===HEAL?'waiting':'catalogue',box:[mid-1,mid+1,4,6]}
 ];
 for(let i=0;i<p.wings.length;i++){
  const [x0,x1,z0,z1]=p.wings[i];
  rooms.push({id:'wing-'+(i+1),kind:p.rear[i],box:[x0+1,x1-1,z0+1,z1-1]});
 }
 const windows=[[3,1],[5,1],[p.w-6,1],[p.w-4,1],[1,6],[p.w-2,6]];
 const passages=[
  {axis:'x',fixed:mid-2,from:4,to:Math.min(11,p.front-2),gaps:[6]},
  {axis:'x',fixed:mid+2,from:4,to:Math.min(11,p.front-2),gaps:[6]}
 ];
 const roofRidges=[
  {axis:'x',fixed:4,from:3,to:p.w-4},
  ...p.wings.map(([x0,x1,z0,z1])=>({axis:'z',fixed:Math.floor((x0+x1)/2),from:z0,to:z1-1}))
 ];
 const cfg={type:p.type,biome:p.biome,size:p.size,variant:1,bounds:[p.w,10,p.tail+1],
  roof:p.name,palette:PALETTE[p.biome],bands,entrance:[mid,2,1],windows,passages,rooms,
  fixtures:[{at:[mid-1,2,2],asset:'pack4:058',name:'visitor-bench'},
            {at:[mid+1,2,2],asset:'pack4:059',name:'reception-table'}],roofRidges};
 const b=buildAdditionalFourBPlan(cfg);
 b.provenance.milestone='M2';
 b.provenance.originalPlan=p.name;
 b.provenance.method='individual authored footprint wings and named room plans; deterministic integer-cell expansion';
 b.provenance.region=p.biome;
 validateBlueprint(b);
 return b;
}
export const M2_HEALING_LIBRARY=Object.freeze(PLANS.map(design));
export const M2_ALL_AUTHORED=Object.freeze([...M1_EXEMPLARS,...M2_HEALING_LIBRARY]);
export const M2_CENSUS=Object.freeze({
 authored:M2_ALL_AUTHORED.length,originalM2:M2_HEALING_LIBRARY.length,
 inherited:0,remaining:285-M2_ALL_AUTHORED.length,creatorApproved:0,integrated:0,
 healers:M2_ALL_AUTHORED.filter(x=>x.type===HEAL).length,
 libraries:M2_ALL_AUTHORED.filter(x=>x.type===LIB).length,
 fingerprints:new Set(M2_ALL_AUTHORED.map(geometrySignature)).size
});
validateCollection(M2_ALL_AUTHORED);
if(M2_CENSUS.originalM2!==16||M2_CENSUS.authored!==21||M2_CENSUS.healers!==9||
 M2_CENSUS.libraries!==9||M2_CENSUS.fingerprints!==21)throw Error('M2 candidate census mismatch');
export function findM2Blueprint(id){return M2_HEALING_LIBRARY.find(x=>x.id===id)||null;}
