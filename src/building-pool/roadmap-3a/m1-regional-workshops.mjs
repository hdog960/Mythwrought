// Builder 3A M1: TWELVE new regional physical-coordinate workshop exemplars.
// Different authored plans, construction and silhouette; NOT reskins or world placement.
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';

const A=Object.freeze({stone:'pack1:002',slab:'pack1:007',pillar:'pack1:010',
 wood:'pack2:013',beam:'pack2:015',shingle:'pack3:023',slate:'pack3:025',
 anvil:'pack5:088',crate:'pack4:057'});
// Every entry has its own occupied envelope, roof equation, plan cuts,
// work-zone articulation, column rhythm and explicit category programme.
export const M1_REGIONAL_SPECS=Object.freeze([
 {type:'armorer',biome:'desert',size:'medium',w:24,d:25,h:22,design:'shade-arcade',roof:'split-shade',cut:'east-court',bay:'forge-arcade',divider:12,postStep:5},
 {type:'armorer',biome:'snow',size:'large',w:31,d:29,h:22,design:'insulated-double-forge',roof:'twin-ridges',cut:'none',bay:'winter-fitting-hall',divider:14,postStep:6},
 {type:'armorer',biome:'mountain',size:'medium',w:25,d:28,h:22,design:'terraced-plate-armor',roof:'cliff-stepped',cut:'north-yard',bay:'plate-cooling-terrace',divider:13,postStep:4},
 {type:'carpenter',biome:'enchanted-forest',size:'medium',w:27,d:25,h:22,design:'root-frame-joinery',roof:'wandering-canopy',cut:'east-court',bay:'livingwood-rack',divider:0,postStep:5},
 {type:'carpenter',biome:'mountain',size:'large',w:33,d:31,h:22,design:'cliff-timber-drying',roof:'zigzag-shed',cut:'north-yard',bay:'mountain-drying-platform',divider:0,postStep:6},
 {type:'carpenter',biome:'desert',size:'large',w:30,d:33,h:22,design:'open-air-furniture-yard',roof:'pergola-strips',cut:'west-court',bay:'sun-seasoned-stock',divider:0,postStep:5},
 {type:'stonemason',biome:'desert',size:'large',w:35,d:30,h:22,design:'colonnaded-cutting-court',roof:'half-vault',cut:'east-court',bay:'stone-column-yard',divider:0,postStep:4},
 {type:'stonemason',biome:'snow',size:'medium',w:25,d:26,h:22,design:'frost-quarry-gallery',roof:'snow-hip',cut:'north-yard',bay:'enclosed-carving-gallery',divider:12,postStep:5},
 {type:'stonemason',biome:'mountain',size:'medium',w:29,d:24,h:22,design:'cliffstone-atelier',roof:'terraced-slab',cut:'west-court',bay:'granite-block-platform',divider:10,postStep:4},
 {type:'mining-workshop',biome:'snow',size:'medium',w:28,d:29,h:22,design:'insulated-ore-sorting',roof:'skylight-bands',cut:'roof-lantern',bay:'heated-dry-sort',divider:14,postStep:6},
 {type:'mining-workshop',biome:'enchanted-forest',size:'large',w:36,d:33,h:22,design:'aetherstone-wash-house',roof:'forest-span',cut:'east-court',bay:'nonfunctional-crystal-sorting',divider:17,postStep:5},
 {type:'mining-workshop',biome:'mountain',size:'large',w:34,d:37,h:22,design:'cliff-ore-transfer-house',roof:'high-low-roofs',cut:'north-yard',bay:'dry-ore-transfer',divider:18,postStep:7}
].map(Object.freeze));

function make(q){
 const {w,d,h}=q, entryX=Math.floor(w/2)-1,modules=new Map(),cells=new Map();
 const key=(x,y,z)=>[x,y,z].join(',');
 const has=(x,y,z)=>cells.has(key(x,y,z));
 function put(role,x,y,z,ref,physical=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||y<0||z<0||x>=w||y>=h||z>=d)
   throw RangeError(q.design+' outside physical envelope: '+[x,y,z]);
  if(has(x,y,z))throw Error(q.design+' duplicate physical cell '+key(x,y,z));
  cells.set(key(x,y,z),ref);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(physical===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(physical)]);
 }
 function roofY(x,z){
  switch(q.roof){
   case 'split-shade':return 9+(x>=Math.floor(w*.68)?2:0);
   case 'twin-ridges':return 9+Math.min(4,Math.floor(Math.min(x%Math.ceil(w/2),Math.ceil(w/2)-1-x%Math.ceil(w/2))/2));
   case 'cliff-stepped':return 9+Math.floor(x/7);
   case 'wandering-canopy':return 9+Math.min(4,Math.floor((Math.min(x,w-1-x)+(z%9))/6));
   case 'zigzag-shed':return 9+(Math.floor(x/5)%3);
   case 'pergola-strips':return 9+(Math.floor(z/7)%2);
   case 'half-vault':return 9+Math.min(4,Math.floor(Math.min(x,w-1-x)/5));
   case 'snow-hip':return 9+Math.min(4,Math.floor(Math.min(x,w-1-x,z,d-1-z)/3));
   case 'terraced-slab':return 9+Math.floor(z/6);
   case 'skylight-bands':return 9+(Math.floor(x/5)%2);
   case 'forest-span':return 9+Math.min(5,Math.floor(Math.min(x,w-1-x)/4));
   case 'high-low-roofs':return 9+(z>Math.floor(d*.63)?3:1);
   default:throw Error('Unknown original regional roof');
  }
 }
 function openAir(x,z){
  const east=x>=w-8&&x<w-2&&z>4&&z<d-4;
  const west=x>1&&x<8&&z>4&&z<d-4;
  const north=z>2&&z<10&&x>6&&x<w-6;
  if(q.cut==='east-court')return east;
  if(q.cut==='west-court')return west;
  if(q.cut==='north-yard')return north;
  if(q.cut==='roof-lantern')return x>=w-10&&x<w-7&&z>8&&z<d-8;
  return false;
 }
 function opening(x,y,z){
  if(z===d-1&&x>=entryX&&x<entryX+2&&y<=4)return true;
  if(y===4||y===5){
   if(x===0&&z>3&&z<8)return true;
   if(x===w-1&&z>d-10&&z<d-5)return true;
  }
  if(q.cut==='east-court'&&x===w-1&&z>6&&z<d-7&&y<=5)return true;
  if(q.cut==='west-court'&&x===0&&z>6&&z<d-7&&y<=5)return true;
  return false;
 }
 const masonry=q.type==='carpenter'?A.wood:A.stone;
 const deck=q.type==='armorer'||q.type==='mining-workshop'?A.slab:A.wood;
 const roofBlock=q.biome==='snow'||q.biome==='mountain'?A.slate:A.shingle;
 // Every 3D coordinate is emitted and checked, including a continuous 2-wide entrance route.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  put('foundation',x,0,z,A.stone);
  put('floor',x,1,z,deck);
 }
 for(let y=2;y<=8;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!(x===0||x===w-1||z===0||z===d-1)||opening(x,y,z))continue;
  const portal=z===d-1&&(x===entryX-1||x===entryX+2)&&y<=7;
  put(portal?'entry-frame':'wall',x,y,z,portal?A.pillar:masonry);
 }
 // 12 distinct roof plans with real open courts / alternating roof ribs.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(openAir(x,z))continue;
  const y=roofY(x,z);
  put('roof',x,y,z,roofBlock);
 }
 // Floor-anchored support piers with 2-sided roof purlins.
 const pz=new Set([2,d-3,Math.floor(d/2),...Array.from({length:Math.floor(d/q.postStep)},(_,i)=>3+i*q.postStep)]);
 for(const z of pz)for(const x of [2,w-3]){
  if(openAir(x,z))continue;
  const yTop=roofY(x,z)-1;
  for(let y=2;y<=yTop;y++)if(!has(x,y,z))put('support-pier',x,y,z,A.pillar);
 }
 for(let z=2;z<d-2;z+=q.postStep)for(let x=3;x<w-3;x++){
  if(openAir(x,z))continue;
  const y=roofY(x,z)-1;
  if(!has(x,y,z))put('purlin',x,y,z,A.beam);
 }
 // Category-specific two-sided bays; never obstruct the central through-route.
 if(q.divider){
  for(let x=2;x<w-2;x++)if(x!==entryX&&x!==entryX+1)
   for(let y=2;y<=6;y++)if(!has(x,y,q.divider))
    put('internal-partition',x,y,q.divider,masonry);
 }
 const rackX=q.type==='stonemason'?w-5:4;
 for(let z=5;z<d-6;z+=q.postStep)for(let y=2;y<=5;y++)
  if(!has(rackX,y,z))put(q.type==='mining-workshop'?'ore-rack':'stock-rack',rackX,y,z,
   q.type==='carpenter'?A.beam:A.pillar);
 // Two distinct workstations, with no fabricated operating machines or block IDs.
 const stations=[],fixtures=[
  {label:q.bay+' non-operating worktable',x:6,z:5,asset:q.type==='armorer'?A.anvil:A.slab},
  {label:q.design+' stock marker',x:w-7,z:d-6,asset:q.type==='mining-workshop'?A.crate:A.pillar}
 ];
 for(const s of fixtures){
  if(has(s.x,2,s.z))throw Error(q.design+' station intersects structure');
  const data=s.asset===A.anvil?{orientation:'north',variant:'blackiron-horn',state:{}}:
   s.asset===A.crate?{orientation:'north',state:{}}:
   {orientation:'north'};
  put('fixture',s.x,2,s.z,s.asset,data);
  stations.push({name:s.label,position:[s.x,2,s.z],assetRef:s.asset,
    unresolvedDependency:'Dry-run theoretical fitting only; gameplay/crafting absent',active:false});
 }
 // A third occupied feature is a noninteractive sign/pedestal adjacent to the bay.
 const markX=w-6,markZ=4;
 if(!has(markX,2,markZ))put('display-pedestal',markX,2,markZ,A.pillar);
 const nodes=[
  {id:'entry',x:entryX,y:2,z:d-1,width:2,headroom:3},
  {id:'front',x:entryX,y:2,z:d-7,width:2,headroom:3},
  {id:'rear',x:entryX,y:2,z:4,width:2,headroom:3}
 ];
 const frontDepth=10,backDepth=d-12;
 const b={id:slotId(q.type,q.biome,q.size,1),type:q.type,biome:q.biome,size:q.size,variant:1,
  status:'theoretical',activated:false,worldPlaced:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...modules].map(([role,packed])=>({id:role+'-01',role,cells:packed})),
  openings:[{kind:'entrance',id:'south-portal',facing:'south',x:entryX,y:2,z:d-1,width:2,height:3}],
  clearances:[{x:entryX,y:2,z:2,width:2,height:3,depth:d-2}],
  spaces:[
   {id:'front-bay',kind:q.bay,bounds:{x:2,y:2,z:d-11,width:w-4,height:5,depth:frontDepth},accessNode:'front'},
   {id:'rear-bay',kind:'regional-stock-and-tool-storage',
    bounds:{x:2,y:2,z:2,width:w-4,height:5,depth:backDepth},accessNode:'rear'}
  ],
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'front',kind:'level'},{from:'front',to:'rear',kind:'level'}]},
  features:stations,
  dependencies:['Manual five-pack physical shape selection/real support load remains central integration gate',
    'No functional crafting, tool power, ore extraction or physical-iPhone acceptance'],
  architecture:{
   design:q.design,roofStyle:q.roof,openAtrium:q.cut,clearSpineWidth:2,
   regionalStructuralPattern:q.postStep,originalCoordinateLayout:true,
   roofLoadApproved:false,weatherTightApproved:false,sourcePreviewOnly:true
  }
 };
 validateBlueprint(b);
 return b;
}
export function createM1RegionalWorkshop(type,biome,size){
 const q=M1_REGIONAL_SPECS.find(q=>q.type===type&&q.biome===biome&&q.size===size);
 if(!q)throw RangeError('Not an authored M1 regional exemplar '+[type,biome,size]);
 return make(q);
}
export function createM1RegionalPool(){return M1_REGIONAL_SPECS.map(make);}
