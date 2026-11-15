import {SCHEMA,validateBlueprint} from './schema.mjs';

// Builder 2B M1: six ORIGINAL public/cultural architectural plans.
// Deterministic, fully materialized coordinate cells. No world placement, economy,
// settlement or final producer AABB/shape assumptions. Original temple :01
// identities and all 33 earlier blueprints are left untouched.
const S=Object.freeze({
 foundation:'pack1:002',paving:'pack1:005',wall:'pack1:002',
 timber:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',stoneRoof:'pack3:025',livingRoof:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',crate:'pack4:057',
 bench:'pack4:058',lantern:'pack4:035',table:'pack4:059',
 banner:'pack4:061',counter:'pack5:086',display:'pack5:087',
 altar:'pack5:093',stair:'pack1:008',canopy:'pack4:062'
});
function make(category,biome,size,variation,W,D,H=14){
 const cells=new Map(),c=Math.floor(W/2),key=(x,y,z)=>x+','+y+','+z;
 const inRange=(x,y,z)=>[x,y,z].every(Number.isInteger)&&x>=0&&x<W&&y>=0&&y<H&&z>=0&&z<D;
 function put(x,y,z,material,kind,extra={}){
  if(!inRange(x,y,z))throw Error(category+': out of range '+key(x,y,z));
  const k=key(x,y,z);if(cells.has(k))throw Error(category+': overlap '+k);
  cells.set(k,{x,y,z,material,kind,...extra});
 }
 function set(x,y,z,material,kind,extra={}){
  if(!cells.has(key(x,y,z)))throw Error(category+': cannot replace missing '+key(x,y,z));
  cells.set(key(x,y,z),{x,y,z,material,kind,...extra});
 }
 function remove(x,y,z){
  if(!cells.delete(key(x,y,z)))throw Error(category+': expected occupied '+key(x,y,z));
 }
 function base(){
  for(let x=0;x<W;x++)for(let z=0;z<D;z++){
   put(x,0,z,S.foundation,'foundation');
   put(x,1,z,(x===c||z===Math.floor(D/2))?S.paving:S.timber,'floor');
  }
 }
 function wallX(z,x0,x1,openings=[]){
  for(let x=x0;x<=x1;x++)for(let y=2;y<=6;y++)
   if(y>=5||!openings.includes(x))put(x,y,z,S.beam,'wall');
 }
 function outer(){
  base();
  for(let x=0;x<W;x++)for(const z of [0,D-1])for(let y=2;y<=6;y++)
   put(x,y,z,S.wall,'wall');
  for(let z=1;z<D-1;z++)for(const x of [0,W-1])for(let y=2;y<=6;y++)
   put(x,y,z,S.wall,'wall');
  for(let y=2;y<=4;y++)remove(c,y,0);
  for(const x of [3,W-4])for(let y=3;y<=4;y++)
   set(x,y,0,y===3?S.glass:S.frame,'window');
  for(const z of [5,D-6])for(const x of [0,W-1])
   set(x,3,z,S.glass,'window');
 }
 function roof(exclude=()=>false,material=S.roof){
  for(let x=0;x<W;x++)for(let z=0;z<D;z++)
   if(!exclude(x,z))put(x,7,z,material,'roof');
 }
 function post(x,z,top=6,material=S.post){
  for(let y=2;y<=top;y++)put(x,y,z,material,'wall',{role:'load-bearing-column'});
 }
 function feature(x,z,material,role,kind='fixture',other={}){
  put(x,2,z,material,kind,{role,...other});
 }
 function windows(){return [...cells.values()].filter(v=>v.kind==='window').map(v=>({type:'window',x:v.x,y:v.y,z:v.z,material:v.material}));}
 function done({title,signature,roofForm,rooms,circulation,features=[],ports=[],targets=[],stairs=[],openRoof=[]}){
  const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const entrance={type:'entrance',x:c,y:2,z:0,clearHeightCells:3,
   doorSymbol:'pack2:020',doorOpenState:'unverified'};
  const refs=[...new Set([...voxels.map(v=>v.material),entrance.doorSymbol])].sort();
  const result={
   schema:SCHEMA,id:'r2:'+category+':'+biome+':'+size+':'+String(variation).padStart(2,'0'),
   category,biome,size,variation,title,status:'authored-candidate',isolated:true,
   worldPlaced:false,numericIdsAssigned:false,
   extents:{x:W,y:H,z:D},
   units:'actual authored integer coordinate cells; shape/variant/yaw ABI not certified',
   architecturalSignature:signature,roof:{form:roofForm,biomeSpecific:true},
   rooms,circulation,features,
   openings:[entrance,...windows(),...ports],
   routeTargets:targets,
   symbolicStairApproaches:stairs,
   intentionallyOpenRoof:openRoof,
   unresolvedDependencies:refs.map(ref=>({ref,
    issue:'2B integrator must resolve exact physical-family source variant, AABB/footprint, orientation, load support, mount, collision, transparency, selection and schema-1 persistence before game use'})),
   voxels
  };
  validateBlueprint(result);
  return Object.freeze(result);
 }
 return {category,biome,size,variation,W,D,H,c,cells,key,put,set,remove,base,wallX,outer,roof,post,feature,done};
}
function shrineCloister(){
 const p=make('temple','temperate','small',2,21,25,13),c=p.c;
 p.outer();
 // Roof-enclosed nave except a deliberate seven-wide sky-lit cloister.
 p.roof((x,z)=>x>=c-3&&x<=c+3&&z>=6&&z<=10);
 const chapelDoors=[];
 for(const x of [5,p.W-6]){
  for(let z=5;z<=13;z++)for(let y=2;y<=5;y++)
   if(z!==9||y===5)p.put(x,y,z,S.beam,'wall',{role:'cloister-screen'});
  chapelDoors.push({type:'internal-doorway',x,y:2,z:9,clearHeightCells:3});
 }
 for(const [x0,x1] of [[1,4],[p.W-5,p.W-2]])for(const z of [4,14])
  for(let x=x0;x<=x1;x++)for(let y=2;y<=4;y++)
   p.put(x,y,z,S.beam,'wall',{role:'cloister-end-cap'});
 p.wallX(17,1,p.W-2,[c-1,c,c+1]);
 for(const x of [c-3,c+3])for(const z of [6,10])p.post(x,z);
 for(const x of [2,p.W-3])p.feature(x,7,S.bench,'cloister-meditation-seat');
 for(const x of [3,p.W-4])p.feature(x,11,S.lantern,'chapel-lamp','decor');
 for(const z of [20,21])for(let x=c-2;x<=c+2;x++)
  p.feature(x,z,S.wall,'raised-ceremonial-dais');
 p.put(c,3,21,S.altar,'fixture',{role:'sanctuary-altar'});
 const steps=[];
 for(const x of [c-2,c+2]){
  p.feature(x,19,S.stair,'symbolic-dais-stair','fixture',
   {intendedFacing:'+z',shapeRotationStatus:'unresolved-symbolic'});
  steps.push({x,y:2,z:19,lowerLanding:{x,y:1,z:18},upperLanding:{x,y:2,z:20},
   shapeRotationStatus:'unresolved-symbolic'});
 }
 // Paired ACTUAL 2×2 attached belfries, resting on every foundation cell.
 for(const origin of [1,p.W-3])for(let dx=0;dx<2;dx++)for(let z=1;z<=2;z++){
  const x=origin+dx;
  for(let y=2;y<=9;y++){
   if(y===7)p.set(x,y,z,S.beam,'wall',{role:'belfry-tower-shaft'});
   else p.put(x,y,z,y===8&&dx===0&&z===1?S.glass:S.beam,
    y===8&&dx===0&&z===1?'window':'wall',{role:'belfry-tower-shaft'});
  }
  p.put(x,10,z,S.roof,'roof',{role:'belfry-cap'});
 }
 return p.done({
  title:'Bellgarden Cloister & Sanctuary',
  signature:'cross-lit open seven-by-five cloister, two enclosed side meditation chapels with single entries, separate rear raised altar, paired supported 2x2 front belfries',
  roofForm:'open garden cloister ring roof with paired tall belfry caps',
  rooms:[
   {name:'Processional nave and open cloister',bounds:{x0:6,x1:14,z0:1,z1:16},uses:['ceremonial-space','public-circulation']},
   {name:'West meditation cloister',bounds:{x0:1,x1:4,z0:5,z1:13},uses:['west-meditation']},
   {name:'East bell-meditation cloister',bounds:{x0:16,x1:19,z0:5,z1:13},uses:['east-meditation']},
   {name:'Rear altar apse',bounds:{x0:6,x1:14,z0:18,z1:23},uses:['altar']}
  ],
  circulation:[
   {from:'exterior',to:'ceremonial-space',via:'three-high middle front processional doorway'},
   {from:'ceremonial-space',to:'public-circulation',via:'open sky-lit center garden'},
   {from:'ceremonial-space',to:'west-meditation',via:'real west x5,z9 three-high port'},
   {from:'ceremonial-space',to:'east-meditation',via:'real east x15,z9 three-high port'},
   {from:'ceremonial-space',to:'altar',via:'three-wide cross-wall apse opening at z17'}
  ],
  ports:[...chapelDoors,...[c-1,c,c+1].map(x=>({type:'internal-doorway',x,y:2,z:17,clearHeightCells:3}))],
  features:['ceremonial-space','altar','public-circulation','enclosed cloisters','open garden nave','supported belfries'],
  targets:[{name:'center-nave',x:c,z:8},{name:'west-cloister',x:3,z:9},
   {name:'east-cloister',x:p.W-4,z:9},{name:'altar-approach',x:c,z:18}],
  stairs:steps,openRoof:[{x0:c-3,x1:c+3,z0:6,z1:10}]
 });
}
function shrineSunwell(){
 const p=make('temple','desert','medium',2,27,29,13),c=p.c;
 p.outer();p.roof((x,z)=>x>=c-4&&x<=c+4&&z>=7&&z<=14,S.stoneRoof);
 // Real four-corner hypostyle supports around an uncovered processional court.
 for(const x of [c-6,c+6])for(const z of [7,12])p.post(x,z);
 p.wallX(20,1,p.W-2,[c-1,c,c+1]);
 for(const [x,z] of [[4,7],[p.W-5,7],[4,14],[p.W-5,14]])
  p.feature(x,z,S.bench,'courtyard-ablution-seat');
 for(const x of [5,p.W-6])for(const z of [17,19])
  p.feature(x,z,S.lantern,'ritual-path-lantern','decor');
 for(const z of [24,25])for(let x=c-3;x<=c+3;x++)
  p.feature(x,z,S.wall,'raised-hypostyle-altar-terrace');
 p.put(c,3,25,S.altar,'fixture',{role:'sunwell-altar'});
 const steps=[];
 for(const x of [c-3,c+3]){
  p.feature(x,23,S.stair,'symbolic-sunwell-stair','fixture',
   {intendedFacing:'+z',shapeRotationStatus:'unresolved-symbolic'});
  steps.push({x,y:2,z:23,lowerLanding:{x,y:1,z:22},upperLanding:{x,y:2,z:24},
   shapeRotationStatus:'unresolved-symbolic'});
 }
 // Four individually grounded shade towers, physically distinct from
 // inherited paired front belfries and from temperate cloister.
 for(const [x,z] of [[2,3],[p.W-3,3],[2,p.D-4],[p.W-3,p.D-4]]){
  for(let y=2;y<=9;y++){
   if(y===7)p.set(x,y,z,S.wall,'wall',{role:'desert-shade-tower'});
   else p.put(x,y,z,S.wall,'wall',{role:'desert-shade-tower'});
  }
  p.put(x,10,z,S.stoneRoof,'roof',{role:'desert-shade-cap'});
 }
 for(let x=c-2;x<=c+2;x++)p.put(x,8,3,S.wall,'roof',{role:'shade-screen-lintel'});
 return p.done({
  title:'Sunwell Hypostyle Court',
  signature:'nine-wide open-air desert prayer court with four load-bearing columns, single transverse sanctuary screen, seven-wide altar terrace and four non-belfry shade towers',
  roofForm:'desert flat shaded side aisles and open central hypostyle courtyard with four shade tower caps',
  rooms:[
   {name:'Public hypostyle prayer court',bounds:{x0:7,x1:19,z0:1,z1:19},uses:['ceremonial-space','public-circulation']},
   {name:'Rear sunwell sanctuary',bounds:{x0:3,x1:23,z0:21,z1:27},uses:['altar']}
  ],
  circulation:[
   {from:'exterior',to:'ceremonial-space',via:'open south processional port'},
   {from:'ceremonial-space',to:'public-circulation',via:'unroofed center walking axis'},
   {from:'ceremonial-space',to:'altar',via:'clear triple-entry sanctuary screen at z20'}
  ],
  ports:[...[-1,0,1].map(dx=>({type:'internal-doorway',x:c+dx,y:2,z:20,clearHeightCells:3}))],
  features:['ceremonial-space','altar','public-circulation','sky-exposed hypostyle','four shade towers','raised altar'],
  targets:[{name:'center-court',x:c,z:11},{name:'rear-altar-approach',x:c,z:22}],
  stairs:steps,openRoof:[{x0:c-4,x1:c+4,z0:7,z1:14}]
 });
}
function booth(p,x,z,label,roofMaterial=S.canopy){
 // Each public vending counter has true 5×5 occupied roof, grounded
 // support posts, physical rear wall and two exact window aperture cells.
 for(const xx of [x,x+4])for(const zz of [z,z+4])p.post(xx,zz,5);
 for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
  p.put(xx,6,zz,roofMaterial,'roof',{role:label+'-canopy'});
 for(let xx=x+1;xx<=x+3;xx++)for(let y=2;y<=4;y++)
  p.put(xx,y,z+4,S.timber,'wall',{role:label+'-rear-screen'});
 for(const xx of [x+1,x+3]){
  p.set(xx,3,z+4,S.glass,'window');p.set(xx,4,z+4,S.frame,'window');
 }
 for(let xx=x+1;xx<=x+3;xx++)p.feature(xx,z+3,S.counter,label+'-trade-counter');
 p.feature(x+1,z+2,S.display,label+'-stock-display');
 p.feature(x+3,z+2,S.crate,label+'-crate','decor');
 return {name:label,x:x+2,z:z+1};
}
function marketSwitchback(){
 const p=make('market-square','mountain','small',1,25,25,12),c=p.c;p.base();
 const b=[
  booth(p,2,4,'stone-stall-west'),booth(p,p.W-7,5,'stone-stall-east'),
  booth(p,3,13,'ore-stall-west'),booth(p,p.W-8,14,'ore-stall-east')
 ];
 for(const x of [0,p.W-1])for(let z=5;z<=17;z++)for(let y=2;y<=4;y++)
  p.put(x,y,z,S.wall,'wall',{role:'mountain-retaining-screen'});
 for(const x of [c-4,c+4])for(let y=2;y<=5;y++)
  p.put(x,y,1,S.beam,'wall',{role:'gateway-column'});
 for(let x=c-4;x<=c+4;x++)p.put(x,6,1,S.stoneRoof,'roof',{role:'stone-gate-arch'});
 // A roofed north mineral exchange separated from its four diagonal booths.
 for(const x of [c-4,c+4])for(const z of [20,22])p.post(x,z,5,S.wall);
 for(let x=c-4;x<=c+4;x++)for(let z=20;z<=22;z++)
  p.put(x,6,z,S.stoneRoof,'roof',{role:'terraced-exchange-cover'});
 p.feature(c-2,21,S.table,'ore-weighing-desk');
 p.feature(c+2,21,S.crate,'mineral-crate','decor');
 const aisle=[
  {name:'south-mountain-gateway',x:c,z:1},{name:'central-stone-crossing',x:c,z:12},
  {name:'roofed-north-exchange',x:c,z:21},...b
 ];
 return p.done({
  title:'Switchback Stone Market',
  signature:'four staggered offset 5x5 stone stalls in open mountain terraces, long paired retaining walls, independent roofed north mineral exchange, supported south gate',
  roofForm:'separate mountain stall canopies, all-open central crossway and two stone civic roofs',
  rooms:[
   {name:'Open stone trade terrace',uses:['square','public-circulation'],bounds:{x0:c-4,x1:c+4,z0:1,z1:23}},
   {name:'Four staggered sheltered stalls',uses:['vendor-stalls'],bounds:{x0:2,x1:p.W-3,z0:4,z1:18}},
   {name:'Covered mountain mineral exchange',uses:['public-circulation'],bounds:{x0:c-3,x1:c+3,z0:20,z1:22}}
  ],
  circulation:[
   {from:'exterior',to:'square',via:'ground-level south portal at x12'},
   {from:'square',to:'vendor-stalls',via:'separate four reachable open stall fronts'},
   {from:'square',to:'public-circulation',via:'unblocked terrace spine to roofed weighing desk'}
  ],
  features:['square','vendor-stalls','public-circulation','retaining walls','stone gate','four independently roofed stalls'],
  targets:aisle,openRoof:[{x0:c-2,x1:c+2,z0:6,z1:17}]
 });
}
function marketMoonroot(){
 const p=make('market-square','enchanted-forest','large',1,37,35,12),c=p.c;p.base();
 const locations=[
  [2,4,'west-herbs'],[p.W-7,4,'east-potions'],
  [2,12,'west-leaves'],[p.W-7,12,'east-timber'],
  [2,20,'west-crystals'],[p.W-7,20,'east-dyes'],
  [11,27,'north-lanterns'],[21,27,'north-charms']
 ];
 const stalls=locations.map(([x,z,id])=>booth(p,x,z,id,S.livingRoof));
 for(const x of [c-7,c+7])for(const z of [12,20])p.post(x,z,5);
 for(let x=c-7;x<=c+7;x++)for(const z of [12,20])
  p.put(x,6,z,S.livingRoof,'roof',{role:'ring-arcade-crossbeam'});
 for(let z=12;z<=20;z++)for(const x of [c-7,c+7])
  if(z!==12&&z!==20)p.put(x,6,z,S.livingRoof,'roof',{role:'ring-arcade-sidebeam'});
 for(const x of [c-5,c+5])p.feature(x,16,S.lantern,'grove-market-lantern','decor');
 for(const x of [c-3,c+3])for(let y=2;y<=5;y++)
  p.put(x,y,0,S.post,'wall',{role:'livingwood-public-gateway'});
 for(let x=c-3;x<=c+3;x++)p.put(x,6,0,S.livingRoof,'roof',{role:'livingwood-public-arch'});
 return p.done({
  title:'Moonroot Ring Exchange',
  signature:'eight nonoverlapping independent trading canopy wings encircling a fifteen-by-nine livingwood covered ring; open central glade and north twin stalls',
  roofForm:'eight separated livingwood canopies and four-sided raised arcade with open sky at the center',
  rooms:[
   {name:'Open glade circulation',uses:['square','public-circulation'],bounds:{x0:c-6,x1:c+6,z0:1,z1:30}},
   {name:'Eight individually roofed market stalls',uses:['vendor-stalls'],bounds:{x0:2,x1:p.W-3,z0:4,z1:31}},
   {name:'Ring arcade',uses:['public-circulation'],bounds:{x0:c-6,x1:c+6,z0:13,z1:19}}
  ],
  circulation:[
   {from:'exterior',to:'square',via:'open three-high south livingwood gateway'},
   {from:'square',to:'vendor-stalls',via:'eight separate trade-front routes'},
   {from:'square',to:'public-circulation',via:'walkable sky-lit inner forest market ring'}
  ],
  features:['square','vendor-stalls','public-circulation','eight supported canopies','sky-lit ring arcade','natural open public space'],
  targets:[{name:'south-glade-gateway',x:c,z:0},{name:'open-center',x:c,z:16},
   {name:'north-exit',x:c,z:32},...stalls],
  openRoof:[{x0:c-5,x1:c+5,z0:13,z1:19}]
 });
}
function openTheater(desert){
 const p=desert?make('theater','desert','medium',1,29,29,13):
  make('theater','mountain','large',1,37,33,14);
 const c=p.c,stageZ=desert?16:17,half=desert?6:8,backZ=desert?23:27;
 p.outer();
 // The Desert is a true open-air performance court. Mountain has overhead
 // snow-safe roof, stepped raised stage canopy and genuine skylight strip.
 if(desert)p.roof((x,z)=>z<backZ&&x>3&&x<p.W-4,S.stoneRoof);
 else p.roof((x,z)=>x>=c-4&&x<=c+4&&z>=4&&z<=11,S.stoneRoof);
 for(const z of [4,7,10])for(const x of (desert?[7,9,11,17,19,21]:
  [7,9,11,13,23,25,27,29]))p.feature(x,z,S.bench,'audience-seating');
 for(let x=c-half;x<=c+half;x++)for(let z=stageZ;z<=stageZ+5;z++)
  p.feature(x,z,S.timber,'raised-stage');
 // Side entrances are three-high and the rear wall seals the backstage;
 // neither stage walkability nor physical slope is falsely certified.
 p.wallX(backZ,1,p.W-2,[5,p.W-6]);
 for(const x of [5,p.W-6])p.feature(x,backZ+2,S.crate,'backstage-costume-stock');
 p.feature(c,backZ+2,S.table,'costume-preparation-table');
 p.feature(2,2,S.lantern,'entry-wayfinding-lamp','decor');
 for(const x of [c-half-1,c+half+1]){
  for(let y=2;y<=6;y++)p.put(x,y,stageZ-1,S.post,'wall',{role:'proscenium-post'});
  p.feature(x,stageZ+1,S.stair,'symbolic-stage-stair','fixture',
   {intendedFacing:'towards-stage',shapeRotationStatus:'unresolved-symbolic'});
 }
 if(desert){
  for(const x of [3,p.W-4])for(const z of [5,10,15])p.post(x,z,6,S.wall);
  for(const x of [3,p.W-4])for(let z=5;z<=17;z++)
   p.put(x,8,z,S.stoneRoof,'roof',{role:'side-shade-gallery'});
 }else{
  for(const x of [3,p.W-4])for(const z of [6,12,19])p.post(x,z);
  for(let x=c-half;x<=c+half;x++)for(let z=stageZ;z<=stageZ+5;z++)
   p.put(x,8,z,S.stoneRoof,'roof',{role:'high-cliff-stage-cover'});
  for(const x of [2,p.W-3])for(let z=5;z<=18;z++)
   p.put(x,8,z,S.stoneRoof,'roof',{role:'tiered-side-gallery'});
 }
 const western=5,eastern=p.W-6;
 return p.done({
  title:desert?'Solstage Open-Air Playhouse':'Cliffecho Mountain Auditorium',
  signature:desert?
   'roofless audience courtyard with lateral sandstone shade colonnades, separately covered backstage, 13x6 raised stage and twin proscenium piers':
   'large snow-safe mountain house with central clerestory, side gallery tiers, independently roofed 17x6 raised stage, opposed backstage entries and cliff piers',
  roofForm:desert?'fully open-air audience with shaded side galleries and enclosed backstage':
   'stepped stone auditorium and stage-cover roof, partial high clerestory',
  rooms:[
   {name:'Public audience and aisles',uses:['audience-area','public-circulation'],
    bounds:{x0:1,x1:p.W-2,z0:1,z1:stageZ-1}},
   {name:'Raised stage for performance',uses:['stage'],
    bounds:{x0:c-half,x1:c+half,z0:stageZ,z1:stageZ+5}},
   {name:'Two-door enclosed backstage',uses:['backstage'],
    bounds:{x0:1,x1:p.W-2,z0:backZ+1,z1:p.D-2}}
  ],
  circulation:[
   {from:'exterior',to:'audience-area',via:'open front central public entrance'},
   {from:'audience-area',to:'public-circulation',via:'two clear stage-side promenades'},
   {from:'public-circulation',to:'stage',via:'two symbolic stage-step access points; slope unresolved'},
   {from:'public-circulation',to:'backstage',via:'two physically empty rear-door ports'}
  ],
  ports:[{type:'internal-doorway',x:western,y:2,z:backZ,clearHeightCells:3},
   {type:'internal-doorway',x:eastern,y:2,z:backZ,clearHeightCells:3}],
  features:['stage','audience-area','backstage','public-circulation','raised stage','dual backstage doors'],
  targets:[{name:'audience-center',x:c,z:7},{name:'west-promenade',x:western,z:stageZ+2},
   {name:'east-promenade',x:eastern,z:stageZ+2},
   {name:'west-backstage',x:western,z:backZ+2},{name:'east-backstage',x:eastern,z:backZ+2}],
  stairs:[{x:c-half-1,y:2,z:stageZ+1,shapeRotationStatus:'unresolved-symbolic'},
   {x:c+half+1,y:2,z:stageZ+1,shapeRotationStatus:'unresolved-symbolic'}],
  openRoof:desert?[{x0:4,x1:p.W-5,z0:1,z1:backZ-1}]:
   [{x0:c-4,x1:c+4,z0:4,z1:11}]
 });
}
export const M1_PUBLIC_MONUMENTS=Object.freeze([
 shrineCloister(),shrineSunwell(),marketSwitchback(),marketMoonroot(),
 openTheater(true),openTheater(false)
]);
