// Thirty coordinate-authored theoretical blacksmiths and watchtowers, isolated from world generation.
// Every occupied voxel slot is labelled by an existing block or one exact symbolic future asset family.
// Candidate family physical dimensions and orientation remain unresolved until engine integration.
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {ASSET_CATALOG} from './legacy-assets.mjs';
import {validateBlueprint,validatePool} from './legacy-validation.mjs';

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
function raiseWalls(b,top,wallRef,door,openWindow,frameRef){
 const {w,d,put}=b;
 for(let y=2;y<=top;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(x!==0&&x!==w-1&&z!==0&&z!==d-1)continue;
  if(z===d-1&&x>=door&&x<door+2&&y<=4)continue;
  if(openWindow(x,y,z))continue;
  // Entrance is a real two-wide three-high void, visually framed by separate
  // future trim voxels rather than an unlabeled dark gap in uniform masonry.
  // This reclassifies existing wall cells, never adds an obstruction or changes
  // the authored cell total, player corridor, save schema, or envelope.
  const jamb=z===d-1&&(x===door-1||x===door+2)&&y>=2&&y<=6;
  const lintel=z===d-1&&(x===door||x===door+1)&&y>=5&&y<=7;
  const framed=jamb||lintel;
  // The pair of two-high side windows lacked any architectural surround,
  // making their apertures disappear in genuine mobile-sized WebGL2 views.
  // Reclassify existing adjacent wall voxels as regional trim: no extra solid
  // cells, no invented materials, and no changes to the open window volume.
  const sideWall=x===0||x===w-1;
  const windowSurround=sideWall&&(
   openWindow(x,y,z-1)||openWindow(x,y,z+1)||
   openWindow(x,y-1,z)||openWindow(x,y+1,z));
  const role=framed?'entry-frame':windowSurround?'window-trim':'wall';
  put(role,x,y,z,framed||windowSurround?frameRef:wallRef);
 }
}
function buildBlacksmith(biome,size){
 const si=sizeIndex(size),p=PROFILES[biome],w=[14,18,22][si]+p.deltaW,d=[15,19,23][si]+p.deltaD;
 const h=19;const b=blank('blacksmith',biome,size,w,d,h),{put,entryX:x}=b;
 // Integral full-cell foundation and walkable deck, physically present at every foot location.
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){
  put('foundation',a,0,z,'builtin:stone');
  // Work zones are physically authored using the SAME symbolic deck family;
  // distinct module roles make the forge and stock bays legible in M1 cutaways
  // and integration handoff without inventing a material or changing collision.
  const insideBay=a>=2&&a<w-1;
  const role=insideBay&&z>=d-9&&z<d-2?'forge-deck':
   insideBay&&z>=2&&z<d-9?'stock-deck':'floor';
  put(role,a,1,z,p.deck);
 }
 const window=(a,y,z)=>y>=4&&y<=5&&((a===0&&z===Math.floor(d/3))||(a===w-1&&z===d-5));
 raiseWalls(b,7,p.wall,x,window,p.trim);
 // Separate, non-overlapping floor-plan zones. The original full-depth
 // bounds overlapped for every blacksmith, making future room/fixture handoffs
 // ambiguous. These are accessible workflow bays, not fictional sealed rooms:
 // the open plan remains physically walkable and its geometry is unchanged.
 const spaces=[space('forge-bay','forge',2,2,d-9,w-3,4,7,'work'),
   space('stock-bay','storage',2,2,2,w-3,4,d-11,'stock')];
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
 // A one-voxel-thick roof follows the actual regional roofline. End gables
 // close the open triangular wall, without filling the whole roof volume with stone.
 // A deliberate vertical void above the hearth reserves a chimney flue; the true
 // hollow shape of future Pack 4 chimney courses remains an integration dependency.
 const chimneyX=2,chimneyZ=d-6;
 for(let a=0;a<w;a++)for(let z=0;z<d;z++){
  const top=highRoof(a);
  if(a!==chimneyX||z!==chimneyZ)put('roof',a,top,z,p.roof);
  if(z===0||z===d-1)for(let y=8;y<top;y++)put('wall',a,y,z,p.wall);
 }
 // Exposed rafters supply real below-roof supporting members rather than floating eaves.
 for(let z=2;z<d-2;z+=4)for(let a=1;a<w-1;a++){
  if(a===chimneyX&&z===chimneyZ)continue;
  const y=highRoof(a)-1;
  if(y>7)put('rafter',a,y,z,p.trim);
 }
 // The future hollow chimney courses align with the hearth (not an unrelated wall).
 const firstChimneyY=highRoof(chimneyX)+1;
 for(let y=firstChimneyY;y<=Math.min(h-2,highRoof(chimneyX)+3);y++)
  put('structure',chimneyX,y,chimneyZ,'pack4:063');
 // A small side-borne corbel carries the hollow candidate above the deliberately
 // open flue tile. Without it the chimney is a floating three-cell island on
 // flatter regional roofs. A naturally higher neighboring roof tile also counts.
 const braceX=chimneyX+1,braceKey=`${braceX},${firstChimneyY},${chimneyZ}`;
 if(!b.occupied.has(braceKey))put('flue-support',braceX,firstChimneyY,chimneyZ,p.trim);
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
 feature('non-operational bench',w-3,2,3,'pack2:013'),feature('chimney ventilation',chimneyX,highRoof(chimneyX)+1,chimneyZ,'pack4:063'),
 feature('fuel separation',2,2,4,null,'Dedicated heat/fire-safety simulation and fireproof wall core not available')];
 return b.finish({clearances,openings:[{id:'main-entrance',facing:'south',x,y:2,z:d-1,width:2,height:3}],spaces,
  navigation:{entry:'entry',nodes:nav,edges:[{from:'entry',to:'work',kind:'level'},{from:'work',to:'stock',kind:'level'}]},
  features,architecture:{style:p.roofStyle,roofStyle:p.roofStyle,workshopZones:['forge','anvil','stock','ventilation'],chimney:'symbolic hollow candidate above hearth; geometry/airflow not yet certified',flueVoid:[chimneyX,chimneyZ],roofShellThickness:1,roofCrossSection:Array.from({length:w},(_,i)=>highRoof(i)),interiorPartition:biome},
  dependencies:['pack5:088','pack4:064','pack4:063','unknown live shape and collision dimensions','future integration approval']});
}

/**
 * Isolated Builder 3A adapter. The complete original blacksmith construction
 * body above is byte-for-byte inherited from PR #122 at the pinned source blob.
 * Neither the 3B watchtower function nor any live runtime is copied.
 */
export function createLegacyBlacksmith(biome,size){
 if(!BIOMES.includes(biome))throw new RangeError('unknown biome');
 if(!SIZES.includes(size))throw new RangeError('unknown size');
 return buildBlacksmith(biome,size);
}
export function createLegacyBlacksmithPool(){
 const buildings=BIOMES.flatMap(biome=>SIZES.map(size=>createLegacyBlacksmith(biome,size)));
 const summary=validatePool(buildings,ASSET_CATALOG);
 if(summary.authored!==15)throw new Error('Expected exactly fifteen inherited blacksmith blueprints');
 return buildings;
}
