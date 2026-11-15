// Builder 4B M2: 12 separately coordinate-authored silhouette-first buildings.
// Authored rectangles/discs/courtyards/room centres and elevations, no procedural seed.
// Draft theoretical assets ONLY; never change world, numeric IDs, saves or registry.
import {SCHEMA,validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
import {M2_ALL_AUTHORED} from './m2-healing-library.mjs';
const H='healers-house', L='library';
const PLANS=[
{t:H,b:'desert',s:'small',title:'Sunwell Crescent Clinic',dim:[21,12,22],
 r:[[2,7,3,18],[12,17,3,18],[7,12,3,7],[7,12,14,18]],e:[9,3],
 rooms:[['treatment',4,10],['recovery',15,10],['waiting',9,5],['herb-storage',9,16]],
 div:[['x',7,8,13,10]],peak:[[4,9],[15,9]],roof:'crescent-sawtooth'},
{t:H,b:'snow',s:'large',title:'Crosswind Field Hospital',dim:[33,13,31],
 r:[[13,19,2,28],[2,14,8,17],[18,30,11,23],[11,22,2,8],[10,23,22,28]],e:[16,2],
 rooms:[['treatment',7,12],['recovery',26,16],['waiting',16,5],['isolation-ward',16,25],['supply-room',26,21]],
 div:[['x',12,10,17,13]],peak:[[16,14],[26,16]],roof:'polar-cross-gable'},
{t:H,b:'enchanted-forest',s:'medium',title:'Cloverleaf Apothecary',dim:[30,12,27],
 r:[[10,18,7,20]],discs:[[14,7,5,5],[7,18,5,5],[22,18,5,5]],e:[14,2],
 rooms:[['waiting',14,6],['treatment',7,18],['recovery',22,18],['herb-storage',14,16]],
 div:[['z',13,12,17,15]],peak:[[14,7],[7,18],[22,18]],roof:'clover-triple-dome'},
{t:H,b:'enchanted-forest',s:'large',title:'Moonring Healing Sanctuary',dim:[36,13,36],
 discs:[[17,17,14,14]],holes:[[17,17,5,5]],r:[[14,20,3,8]],e:[17,3],
 rooms:[['waiting',17,7],['treatment',8,17],['recovery',26,17],['herb-storage',17,27],['consultation',9,9],['rest-garden-gallery',25,25]],
 div:[['z',10,11,23,17]],peak:[[17,7],[8,17],[26,17],[17,27]],roof:'donut-open-sky-cloister'},
{t:H,b:'mountain',s:'small',title:'Switchback Mountain Sickbay',dim:[23,12,23],
 r:[[8,14,1,20],[2,10,7,12],[13,20,13,18]],e:[11,1],
 rooms:[['waiting',11,4],['treatment',5,9],['recovery',17,15],['medicine-cabinet',11,18]],
 div:[['z',9,8,14,11]],peak:[[11,12],[17,15]],roof:'stair-step-ridge'},
{t:H,b:'mountain',s:'large',title:'Three-Terrace Sanatorium',dim:[38,14,35],
 r:[[15,22,1,32],[2,17,9,17],[20,34,6,13],[4,17,21,30],[20,34,22,31]],e:[18,1],
 rooms:[['waiting',18,5],['treatment',8,13],['recovery',28,9],['dispensary',10,26],['isolation-ward',28,27],['recuperation-gallery',18,21]],
 div:[['x',14,10,17,13]],peak:[[8,13],[28,9],[10,26],[28,27]],roof:'five-terrace-pitched'},
{t:L,b:'desert',s:'large',title:'Sun Court Double Cloister',dim:[38,14,35],
 r:[[3,33,3,30],[15,21,1,4]],holes:[[18,17,6,5]],e:[18,1],
 rooms:[['catalogue',18,7],['collections',8,8],['reading-room',29,8],['archive',8,26],['scriptorium',29,26],['scribe-reading',18,27]],
 div:[['z',11,5,31,18]],peak:[[6,6],[30,6],[6,28],[30,28]],roof:'open-court-parapet'},
{t:L,b:'snow',s:'large',title:'Hearthline Twin-Shaft Library',dim:[36,14,31],
 r:[[2,11,2,27],[23,32,2,27],[10,24,12,17]],e:[6,2],
 rooms:[['collections',7,6],['reading-room',27,6],['lending-atrium',17,14],['archive',7,23],['manuscript-vault',27,23]],
 div:[['z',14,10,24,17]],peak:[[7,12],[27,12]],roof:'parallel-pitched-ice'},
{t:L,b:'enchanted-forest',s:'small',title:'Octagonal Lumen Reading Room',dim:[22,13,23],
 discs:[[10,11,8,8]],r:[[8,12,1,7]],e:[10,1],
 rooms:[['reading-room',10,5],['collections',6,11],['catalogue',14,11],['lore-archive',10,17]],
 div:[['z',12,6,14,10]],peak:[[10,11]],roof:'octadome-tiered'},
{t:L,b:'enchanted-forest',s:'medium',title:'Twin-Octagon Lore Exchange',dim:[35,13,26],
 discs:[[9,12,7,7],[25,12,7,7]],r:[[14,20,9,15]],e:[9,5],
 rooms:[['collections',9,10],['reading-room',25,10],['catalogue',17,12],['oral-history',9,16],['scribe-studio',25,16]],
 div:[['x',16,10,14,12]],peak:[[9,12],[25,12]],roof:'figure-eight-octadomes'},
{t:L,b:'mountain',s:'small',title:'Switchspine Ridge Library',dim:[25,13,25],
 r:[[8,15,1,22],[2,9,6,11],[14,21,12,18]],e:[11,1],
 rooms:[['catalogue',11,5],['collections',5,9],['reading-room',18,15],['book-vault',11,19]],
 div:[['z',12,8,15,11]],peak:[[11,10],[18,15]],roof:'sloped-ridge-spine'},
{t:L,b:'mountain',s:'large',title:'Four-Bastion Archive',dim:[39,15,39],
 r:[[15,22,1,35],[8,17,11,15],[20,29,11,15],[8,17,27,31],[20,29,27,31]],
 discs:[[7,12,6,6],[30,12,6,6],[7,29,6,6],[30,29,6,6]],e:[18,1],
 rooms:[['catalogue',18,6],['collections',7,12],['reading-room',30,12],['archive',7,29],['rare-books-vault',30,29],['cartographic-study',18,22]],
 div:[['x',16,17,24,20]],peak:[[7,12],[30,12],[7,29],[30,29]],roof:'four-bastion-dome-gables'}
];
const key=(x,y,z)=>x+','+y+','+z;
const k2=(x,z)=>x+','+z;
const disc=(x,z,cx,cz,rx,rz)=>((x-cx)/rx)**2+((z-cz)/rz)**2<=1.000001;
function compile(p){
 const [w,h,d]=p.dim,foot=new Set(),cells=new Map(),dependencies=new Map(),features=[],openings=[];
 const floor=(x,z)=>foot.has(k2(x,z));
 const edge=(x,z)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!floor(x+dx,z+dz));
 const putFoot=(x,z)=>{if(x<0||x>=w||z<0||z>=d)throw Error('bad footprint '+p.title);foot.add(k2(x,z));};
 const add=(x,y,z,role,asset,feature)=>{
  const at=key(x,y,z);
  if(x<0||x>=w||y<0||y>=h||z<0||z>=d||cells.has(at))throw Error('duplicate/out-of-bounds '+p.title+' '+at);
  const c={at:[x,y,z],role,asset,facing:'north'};if(feature)c.feature=feature;cells.set(at,c);return c;
 };
 const dep=(ref)=>{if(!dependencies.has(ref))dependencies.set(ref,{ref,source:'manual-five-pack',status:'catalog-provisional',shape:'unknown',orientation:'unknown',
  unresolved:['Resolve exact approved family variant geometry and occupied collision footprint before mounting',
   'Confirm bearing support, texture, transparency, picking, orientation, save persistence and mobile cost via integrator']});};
 for(const [x0,x1,z0,z1] of p.r||[])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)putFoot(x,z);
 for(const [cx,cz,rx,rz] of p.discs||[])for(let x=cx-rx;x<=cx+rx;x++)for(let z=cz-rz;z<=cz+rz;z++)if(disc(x,z,cx,cz,rx,rz))putFoot(x,z);
 for(const [cx,cz,rx,rz] of p.holes||[])for(let x=cx-rx;x<=cx+rx;x++)for(let z=cz-rz;z<=cz+rz;z++)if(disc(x,z,cx,cz,rx,rz))foot.delete(k2(x,z));
 const [ex,ez]=p.e;
 if(!floor(ex,ez)||!edge(ex,ez))throw Error('no external door '+p.title);
 const list=[...foot].map(s=>s.split(',').map(Number)).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 for(const [x,z] of list){
  add(x,0,z,'foundation','live:stone');
  add(x,1,z,'floor','live:wood');
  if(edge(x,z))for(let y=2;y<=6;y++)if(!(x===ex&&z===ez&&y<4))add(x,y,z,'wall','live:stone');
  add(x,7,z,'roof','live:wood','weather-plane');
 }
 openings.push({kind:'entrance',at:[ex,2,ez],facing:'north',plannedClosure:'pack2:020'});
 const exterior=list.filter(([x,z])=>edge(x,z)&&!(x===ex&&z===ez)&&Math.abs(x-ex)+Math.abs(z-ez)>3);
 let winCount=0;
 for(let i=3;i<exterior.length;i+=6){
  const [x,z]=exterior[i],a=cells.get(key(x,3,z)),beam=cells.get(key(x,4,z));
  if(!a||!beam)continue;
  a.role='window';a.asset='pack4:030';a.feature='symbolic-glazing';
  beam.role='beam';beam.asset='live:wood';beam.feature='lintel';
  dep('pack4:030');winCount++;
  openings.push({kind:'window',at:[x,3,z],facing:!floor(x,z-1)?'north':!floor(x+1,z)?'east':!floor(x,z+1)?'south':'west'});
 }
 if(winCount<6)throw Error('not enough windows '+p.title);
 for(const [axis,fixed,from,to,gap] of p.div||[])for(let v=from;v<=to;v++){
  const x=axis==='x'?fixed:v,z=axis==='z'?fixed:v;
  if(!floor(x,z)||edge(x,z))continue;
  if(v===gap){if(!cells.has(key(x,4,z)))add(x,4,z,'beam','live:wood','open-port-lintel');
   openings.push({kind:'door',at:[x,2,z],facing:axis==='x'?'east':'north',plannedClosure:'pack2:020'});
  }else for(let y=2;y<=4;y++)if(!cells.has(key(x,y,z)))add(x,y,z,'partition','live:wood','room-divider');
 }
 // Roof: every tier directly seats upon the prior solid roof row, creating
 // visible and physically-connected authored crown volumes, unlike a flat palette.
 for(let n=0;n<p.peak.length;n++){
  const [cx,cz]=p.peak[n];
  const outer=p.roof.includes('parapet')?2:3;
  for(const [r,y] of [[outer,8],[2,9],[1,10]])for(let x=cx-r;x<=cx+r;x++)for(let z=cz-r;z<=cz+r;z++){
   if(!floor(x,z)||cells.has(key(x,y,z))||(y>8&&!cells.has(key(x,y-1,z))))continue;
   add(x,y,z,'roof',n%2?'live:wood':'live:stone','authored-'+p.roof+'-tier-'+n);
  }
 }
 const taken=new Set(),spaces=[];
 for(let i=0;i<p.rooms.length;i++){
  const [kind,cx,cz]=p.rooms[i],tiles=[];
  if(!floor(cx,cz)||edge(cx,cz)||cells.has(key(cx,2,cz)))throw Error('invalid authored room anchor '+p.title+' '+kind+' '+[cx,cz]);
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   if(!floor(x,z)||edge(x,z)||cells.has(key(x,2,z))||cells.has(key(x,3,z))||taken.has(k2(x,z)))continue;
   tiles.push([x,z]);taken.add(k2(x,z));
  }
  if(tiles.length<4||!tiles.some(t=>t[0]===cx&&t[1]===cz))throw Error('room footprint too narrow '+p.title+' '+kind);
  spaces.push({id:kind+'-'+i,kind,level:2,footprint:tiles,access:[cx,2,cz]});
 }
 const candidates=list.filter(([x,z])=>!edge(x,z)&&!taken.has(k2(x,z))&&!cells.has(key(x,2,z))&&!cells.has(key(x,3,z))&&
   Math.abs(x-ex)+Math.abs(z-ez)>4);
 if(candidates.length<12)throw Error('not enough fixture space '+p.title);
 for(let i=0;i<2;i++){
  const [x,z]=candidates[i===0?Math.floor(candidates.length/3):Math.floor(candidates.length*2/3)];
  const ref=i===0?'pack4:058':'pack4:059';
  add(x,2,z,'fixture',ref,i===0?'unapproved-bench':'unapproved-scribe-table');
  dep(ref);features.push({kind:i===0?'visitor-bench':'work-table',at:[x,2,z],dependency:ref,active:false});
 }
 const navigation=list.filter(([x,z])=>!cells.has(key(x,2,z))&&!cells.has(key(x,3,z)))
  .map(([x,z])=>({at:[x,2,z],mode:'walk'}));
 const b={schema:SCHEMA,id:'r4:'+p.t+':'+p.b+':'+p.s+':01',type:p.t,biome:p.b,size:p.s,variant:1,bounds:p.dim,
  provenance:{lane:'roadmap-4b',milestone:'M2',originalPlan:p.title,roofProfile:p.roof,
   method:'separately authored corridor, wing and round-pavilion physical voxel design',
   source:'M2 distinctive by region',originalFromLegacyPR123:false,liveIntegration:false},
  worldPlaced:false,creatorApproved:false,integrated:false,
  cells:[...cells.values()],openings,spaces,navigation,dependencies:[...dependencies.values()],features};
 validateBlueprint(b);
 return b;
}
export const M2_DISTINCTIVE=Object.freeze(PLANS.map(compile));
export const M2_33_ALL=Object.freeze([...M2_ALL_AUTHORED,...M2_DISTINCTIVE]);
export const M2_33_CENSUS=Object.freeze({
  newThisPass:12,authored:M2_33_ALL.length,remaining:285-M2_33_ALL.length,
  healer:M2_33_ALL.filter(b=>b.type===H).length,library:M2_33_ALL.filter(b=>b.type===L).length,
  fingerprints:new Set(M2_33_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0
});
validateCollection(M2_33_ALL);
if(M2_33_CENSUS.authored!==33||M2_33_CENSUS.healer!==15||M2_33_CENSUS.library!==15||
 M2_33_CENSUS.fingerprints!==33)throw Error('M2 architectural census/unique slots broken');
export const M2_DISTINCTIVE_NAMES=Object.freeze(PLANS.map(p=>p.title));
