// Thirty coordinate-authored theoretical blacksmiths and watchtowers, isolated from world generation.
// Every occupied voxel slot is labelled by an existing block or one exact symbolic future asset family.
// Candidate family physical dimensions and orientation remain unresolved until engine integration.
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint,validatePool} from './contract.mjs';

const PROFILES=Object.freeze({
 'temperate':Object.freeze({deltaW:0,deltaD:1,wall:'pack1:002',trim:'pack2:015',roof:'pack3:023',deck:'pack1:007',accent:'pack1:010',roofStyle:'gabled',buttress:'corner'}),
 'desert':Object.freeze({deltaW:2,deltaD:0,wall:'biome130:006',trim:'pack1:010',roof:'pack1:007',deck:'pack1:007',accent:'biome130:006',roofStyle:'flat-shaded',buttress:'windbreak'}),
 'snow':Object.freeze({deltaW:1,deltaD:3,wall:'biome130:094',trim:'pack2:015',roof:'pack3:025',deck:'pack1:007',accent:'pack1:010',roofStyle:'steep-snow',buttress:'entry-vestibule'}),
 'enchanted-forest':Object.freeze({deltaW:3,deltaD:2,wall:'biome130:096',trim:'pack2:015',roof:'pack3:023',deck:'pack2:013',accent:'biome130:096',roofStyle:'asymmetric-canopy',buttress:'root-bays'}),
 'mountain':Object.freeze({deltaW:4,deltaD:4,wall:'biome130:104',trim:'pack1:010',roof:'pack3:025',deck:'pack1:007',accent:'biome130:098',roofStyle:'terraced',buttress:'cliff-anchors'})
});
const sizeIndex=size=>{const n=SIZES.indexOf(size);if(n<0)throw new RangeError('unknown size');return n;};
function blank(type,biome,size,w,d,h){
 const modules=new Map();const occupied=new Map();
 function put(role,x,y,z,ref){
   if(!ASSET_CATALOG[ref])throw new Error('unresolved family '+ref);
   if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(z)||x<0||z<0||y<0||x>=w||z>=d||y>=h)throw new Error('invalid occupied voxel '+[x,y,z]);
   const key=`${x},${y},${z}`;
   if(occupied.has(key))throw new Error(`overlapping authored cells ${key} ${occupied.get(key)} and ${role}`);
   occupied.set(key,role);
   if(!modules.has(role))modules.set(role,[]);
   modules.get(role).push([x,y,z,ref]);
 }
 const entryX=Math.floor(w/2)-1;
 return {type,biome,size,w,d,h,put,occupied,entryX,modules,
  finish({clearances,openings,spaces,navigation,features,architecture,dependencies}){
   const out={id:slotId(type,biome,size,1),type,biome,size,variant:1,status:'theoretical',activated:false,
    envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
    modules:[...modules].map(([role,cells])=>({id:`${role}-01`,role,cells})),
    clearances,openings,spaces,navigation,features,
    architecture:{...architecture,physicalCellSlots:occupied.size},
    dependencies,
    implementation:'CONCEPT_ONLY; neither placed in game nor guaranteed candidate geometry fit'};
   validateBlueprint(out,ASSET_CATALOG);
   return out;
  }
 };
}
function space(id,kind,x,y,z,width,height,depth,accessNode){return {id,kind,bounds:{x,y,z,width,height,depth},accessNode};}
function clearance(x,y,z,width=2,height=2,depth=1){return {x,y,z,width,height,depth};}
function navNode(id,x,y,z,kind='passage'){return {id,x,y,z,kind,width:2,headroom:2};}
function feature(name,x,y,z,assetRef,unresolvedDependency=null){return {name,position:[x,y,z],assetRef,unresolvedDependency};}
function raiseWalls(b,top,wallRef,door,openWindow){
 const {w,d,put}=b;
 for(let y=2;y<=top;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(x!==0&&x!==w-1&&z!==0&&z!==d-1)continue;
  if(z===d-1&&x>=door&&x<door+2&&y<=4)continue;
  if(openWindow(x,y,z))continue;
  put('wall',x,y,z,wallRef);
 }
}
function buildBlacksmith(biome,size){
 const si=sizeIndex(size),p=PROFILES[biome],w=[14,18,22][si]+p.deltaW,d=[15,19,23][si]+p.deltaD;
 const h=19;const b=blank('blacksmith',biome,size,w,d,h),{put,entryX:x}=b;
 // Integral full-cell foundation and walkable deck, physically present at every foot location.
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){put('foundation',a,0,z,'builtin:stone');put('floor',a,1,z,p.deck);}
 const window=(a,y,z)=>y>=4&&y<=5&&((a===0&&z===Math.floor(d/3))||(a===w-1&&z===d-5));
 raiseWalls(b,7,p.wall,x,window);
 const spaces=[space('forge-room','forge',2,2,2,x+1,4,d-4,'work'),
   space('stock-room','storage',x,2,2,w-x-2,4,d-4,'stock')];
 // Actual interior divider structure differs by biome; 2-wide central route stays unobstructed.
 const dividerZ=d-7-si;
 if(biome==='snow'||biome==='desert'){
  for(let a=x+2;a<w-1;a++)if(a!==x+3)for(let y=2;y<=4;y++)put('wall',a,y,dividerZ,p.wall);
 }else if(biome==='enchanted-forest'){
  for(let z=4;z<d-4;z+=3)for(let y=2;y<=5;y++)put('structure',w-3,y,z,p.accent);
 }else if(biome==='mountain'){
  for(let z=3;z<d-4;z+=4)for(let y=2;y<=5;y++)put('structure',1,y,z,p.accent);
 }else{
  for(let z=4;z<d-4;z+=5)for(let y=2;y<=4;y++)put('structure',w-2,y,z,p.trim);
 }
 // Five distinct roof cross sections and biome-specific heights form genuine silhouette changes.
 const highRoof=a=>{
  const dist=Math.min(a,w-1-a);
  if(p.roofStyle==='gabled')return 8+Math.min(3,Math.floor(dist/3));
  if(p.roofStyle==='flat-shaded')return 8+(a>=w-4?1:0);
  if(p.roofStyle==='steep-snow')return 8+Math.min(5,Math.floor(dist/2));
  if(p.roofStyle==='asymmetric-canopy')return 8+Math.min(4,Math.floor((dist+(a<w/2?2:0))/3));
  return 8+Math.min(3,Math.floor(a/4));
 };
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){
  const top=highRoof(a);
  for(let y=8;y<=top;y++)put('roof',a,y,z,p.roof);
 }
 // A physically mounted chimney opening is a future candidate shape; smoke is not simulated.
 for(let y=highRoof(2)+1;y<=Math.min(h-2,highRoof(2)+3);y++)put('structure',2,y,2,'pack4:063');
 // Work equipment is in labelled exact family slots; no functionality is attributed to these modules.
 put('fixture',2,2,d-6,'pack4:064');
 put('fixture',w-4,2,d-6,'pack5:088');
 put('fixture',w-3,2,3,'pack2:013');
 // Exterior/structural elements have different geometry and positions in every biome.
 if(biome==='temperate'){
  for(let z=d-3;z<d-1;z++)for(let a=2;a<=3;a++)put('structure',a,6,z,'pack2:015');
 }else if(biome==='desert'){
  for(let z=2;z<d-1;z+=3)for(let y=2;y<=6;y++)put('structure',1,y,z,p.accent);
 }else if(biome==='snow'){
  for(let a=x-2;a<=x+3;a++)put('structure',a,7,d-2,p.trim);
 }else if(biome==='enchanted-forest'){
  for(let z=1;z<d-1;z+=5)for(let y=2;y<=6;y++)put('structure',1,y,z,p.accent);
 }else{
  for(let z=1;z<d-1;z+=3)for(let y=2;y<=4;y++)put('structure',w-2,y,z,p.accent);
 }
 const nav=[navNode('entry',x,2,d-1,'entry'),navNode('work',x,2,d-5,'work'),navNode('stock',x,2,3,'storage')];
 const clearances=[clearance(x,2,2,2,3,d-2),clearance(x,5,2,2,2,d-3)];
 const features=[feature('forge-mouth',2,2,d-6,'pack4:064'),feature('anvil',w-4,2,d-6,'pack5:088'),
 feature('non-operational bench',w-3,2,3,'pack2:013'),feature('chimney ventilation',2,highRoof(2)+1,2,'pack4:063'),
 feature('fuel separation',2,2,4,null,'Dedicated heat/fire-safety simulation and fireproof wall core not available')];
 return b.finish({clearances,openings:[{id:'main-entrance',facing:'south',x,y:2,z:d-1,width:2,height:3}],spaces,
  navigation:{entry:'entry',nodes:nav,edges:[{from:'entry',to:'work',kind:'level'},{from:'work',to:'stock',kind:'level'}]},
  features,architecture:{style:p.roofStyle,roofStyle:p.roofStyle,workshopZones:['forge','anvil','stock','ventilation'],chimney:'symbolic static physical candidate',roofCrossSection:Array.from({length:w},(_,i)=>highRoof(i)),interiorPartition:biome},
  dependencies:['pack5:088','pack4:064','pack4:063','unknown live shape and collision dimensions','future integration approval']});
}
function buildWatchtower(biome,size){
 const si=sizeIndex(size),p=PROFILES[biome];
 const w=[15,19,23][si]+p.deltaW,d=[19,23,27][si]+p.deltaD;
 const steps=[10,12,14][si],deckY=steps,wallTop=deckY-1,platformFoot=deckY+1,h=deckY+10;
 const b=blank('watchtower',biome,size,w,d,h),{put,entryX:x}=b,runX=3,stairStartZ=3;
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){
  put('foundation',a,0,z,'builtin:stone');
  // Keep stair tread and floor from overlapping in the same (x,y,z) cells.
  if(!(a>=runX&&a<runX+2&&z>=stairStartZ&&z<stairStartZ+steps))put('floor',a,1,z,p.deck);
 }
 const window=(a,y,z)=>y>=4&&y<=5&&((a===0&&z===Math.floor(d/2))||(a===w-1&&z===Math.floor(d/3)));
 raiseWalls(b,wallTop,p.wall,x,window);
 // A real stack of solid two-wide voxel stair treads, each a unit higher.
 const nav=[navNode('entry',x,2,d-1,'entry'),navNode('base',x,2,3,'ground-circulation')];
 for(let i=0;i<steps;i++){
  const z=stairStartZ+i;
  for(let a=runX;a<runX+2;a++)put('stair',a,1+i,z,'pack1:008');
  nav.push(navNode('step-'+i,runX,2+i,z,'stairs'));
 }
 // Top observation deck with genuine stairwell cut-out and carved parapet blocks.
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){
  const stairSlot=a>=runX&&a<runX+2&&z>=stairStartZ&&z<stairStartZ+steps;
  if(!stairSlot)put('roof',a,deckY,z,p.deck);
  const perimeter=a===0||a===w-1||z===0||z===d-1;
  if(perimeter&&((a+z+si)%3!==0))put('battlement',a,deckY+1,z,'pack3:070');
 }
 // Upper corridor meets the last tread horizontally; observation is fully traversable.
 nav.push(navNode('platform',runX+2,platformFoot,stairStartZ+steps-1,'observation'));
 nav.push(navNode('lookout',Math.max(runX+2,x),platformFoot,3,'observation'));
 const edges=[{from:'entry',to:'base',kind:'level'},{from:'base',to:'step-0',kind:'level'}];
 for(let i=1;i<steps;i++)edges.push({from:'step-'+(i-1),to:'step-'+i,kind:'stair'});
 edges.push({from:'step-'+(steps-1),to:'platform',kind:'level'},{from:'platform',to:'lookout',kind:'level'});
 // Visibly distinct regional fortification structure with no traps or operating mechanisms.
 if(biome==='temperate'){
  for(let y=2;y<=wallTop;y++)for(const [a,z] of [[1,1],[w-2,1],[1,d-2],[w-2,d-2]])put('structure',a,y,z,p.accent);
 }else if(biome==='desert'){
  for(let z=2;z<d-1;z+=3)for(let y=2;y<=wallTop-2;y++)put('structure',w-2,y,z,p.accent);
  for(let a=w-5;a<w-1;a++)for(let z=2;z<d-2;z++)put('structure',a,deckY+4,z,p.trim);
 }else if(biome==='snow'){
  for(let a=2;a<w-2;a++)for(let z=2;z<d-2;z++){
   const rise=Math.min(4,Math.floor(Math.min(a,w-1-a)/3));
   put('structure',a,deckY+4+rise,z,p.roof);
  }
 }else if(biome==='enchanted-forest'){
  for(let z=2;z<d-2;z+=4)for(let y=2;y<=wallTop;y++)put('structure',w-2,y,z,p.accent);
  for(let a=5;a<w-2;a+=3)put('structure',a,deckY+3,2,p.trim);
 }else{
  for(let z=2;z<d-2;z+=3)for(let y=2;y<=wallTop;y++)put('structure',w-2,y,z,p.accent);
  for(let a=4;a<w-1;a++)put('structure',a,deckY+3,d-3,p.roof);
 }
 const clearances=[clearance(x,2,2,2,3,d-2),clearance(runX,2,3,2,2,1),
  ...Array.from({length:steps},(_,i)=>clearance(runX,2+i,stairStartZ+i)),
  clearance(runX+2,platformFoot,stairStartZ+steps-1),clearance(Math.max(runX+2,x),platformFoot,3),
  clearance(runX+2,platformFoot,2,2,2,d-4)];
 const spaces=[space('entry-chamber','guard-access',x-1,2,2,4,4,d-3,'base'),
  space('observation-floor','observation',runX+2,platformFoot,1,w-runX-4,2,d-2,'platform')];
 const features=[feature('parapet access',runX+2,platformFoot,stairStartZ+steps-1,'pack3:070'),
   feature('observation platform',runX+2,platformFoot,3,p.deck),
   feature('vertical stair route',runX,2,stairStartZ,'pack1:008'),
   feature('static observation signal mount',w-3,platformFoot,3,null,'Signal mount is not a catalogued functioning block family')];
 return b.finish({clearances,openings:[{id:'main-entrance',facing:'south',x,y:2,z:d-1,width:2,height:3}],spaces,
  navigation:{entry:'entry',nodes:nav,edges},features,
  architecture:{style:p.buttress,roofStyle:p.roofStyle,stairSteps:steps,observationY:platformFoot,observationAccess:true,regionalButtresses:p.buttress},
  dependencies:['pack1:008','pack3:070','physical stair profile and collision fit pending','future integration approval']});
}
export function createM1Blueprint(type,biome,size){
 if(!BIOMES.includes(biome))throw new RangeError('unknown biome');
 if(!SIZES.includes(size))throw new RangeError('unknown size');
 if(type==='blacksmith')return buildBlacksmith(biome,size);
 if(type==='watchtower')return buildWatchtower(biome,size);
 throw new RangeError('M1 only authors blacksmith and watchtower types');
}
export function createM1Pool(){
 const buildings=['blacksmith','watchtower'].flatMap(type=>BIOMES.flatMap(biome=>SIZES.map(size=>createM1Blueprint(type,biome,size))));
 const summary=validatePool(buildings,ASSET_CATALOG);
 if(summary.authored!==30)throw new Error('M1 requires thirty distinct physical-coordinate blueprints');
 return buildings;
}
