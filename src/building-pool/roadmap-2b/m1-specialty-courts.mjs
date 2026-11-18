import {SCHEMA,validateBlueprint} from './schema.mjs';

// Eight individually authored original occupied-cell architectures.
// Never inject into production, fill symbolic variants, or change saves.
const B={rock:'pack1:002',path:'pack1:005',stair:'pack1:008',wood:'pack2:013',
 beam:'pack2:015',post:'pack2:022',tile:'pack3:023',snow:'pack3:025',
 leaves:'pack3:026',glass:'pack4:030',frame:'pack4:032',light:'pack4:035',
 crate:'pack4:057',bench:'pack4:058',table:'pack4:059',sign:'pack4:061',
 canopy:'pack4:062',counter:'pack5:086',display:'pack5:087',altar:'pack5:093'};
function architect(type,biome,size,W,D,H=14){
 const C=new Map(),center=Math.floor(W/2),k=(x,y,z)=>x+','+y+','+z;
 const put=(x,y,z,material,kind,extra={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=W||y<0||y>=H||z<0||z>=D||C.has(k(x,y,z)))
   throw Error(type+' invalid overlapping coordinate '+k(x,y,z));
  C.set(k(x,y,z),{x,y,z,material,kind,...extra});
 };
 const replace=(x,y,z,material,kind,extra={})=>{
  if(!C.has(k(x,y,z)))throw Error('expected existing '+k(x,y,z));
  C.set(k(x,y,z),{x,y,z,material,kind,...extra});
 };
 const erase=(x,y,z)=>{if(!C.delete(k(x,y,z)))throw Error('expected occupied '+k(x,y,z));};
 const base=()=>{for(let x=0;x<W;x++)for(let z=0;z<D;z++){
  put(x,0,z,B.rock,'foundation');put(x,1,z,(x===center?B.path:B.wood),'floor');
 }};
 const shell=()=>{base();for(let x=0;x<W;x++)for(const z of [0,D-1])
  for(let y=2;y<=6;y++)put(x,y,z,B.beam,'wall');
  for(let z=1;z<D-1;z++)for(const x of [0,W-1])for(let y=2;y<=6;y++)
   put(x,y,z,B.beam,'wall');
  for(let y=2;y<=4;y++)erase(center,y,0);
  for(const x of [3,W-4])for(const y of [3,4])replace(x,y,0,y===3?B.glass:B.frame,'window');
  for(const x of [0,W-1])for(const z of [5,D-6])replace(x,3,z,B.glass,'window');
 };
 const across=(z,a,b,doors=[])=>{for(let x=a;x<=b;x++)for(let y=2;y<=5;y++)
  if(y===5||!doors.includes(x))put(x,y,z,B.beam,'wall',{role:'room-screen'});};
 const along=(x,a,b,doors=[])=>{for(let z=a;z<=b;z++)for(let y=2;y<=5;y++)
  if(y===5||!doors.includes(z))put(x,y,z,B.beam,'wall',{role:'room-screen'});};
 const roof=(skip=()=>false,mat=B.tile)=>{for(let x=0;x<W;x++)for(let z=0;z<D;z++)
  if(!skip(x,z))put(x,7,z,mat,'roof');};
 const post=(x,z,top=5,material=B.post)=>{for(let y=2;y<=top;y++)put(x,y,z,material,'wall',{role:'grounded-bearing-post'});};
 const furniture=(x,z,material,role,kind='fixture',meta={})=>put(x,2,z,material,kind,{role,...meta});
 const elevated=(x,y,z,material,role,kind='roof')=>put(x,y,z,material,kind,{role});
 const end=({title,variation=1,signature,roofForm,rooms,edges,features,
  doors=[],targets=[],voids=[],stairs=[]})=>{
  const voxels=[...C.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const windows=voxels.filter(v=>v.kind==='window')
   .map(v=>({type:'window',x:v.x,y:v.y,z:v.z,material:v.material}));
  const symbols=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
  const result={
   schema:SCHEMA,id:'r2:'+type+':'+biome+':'+size+':'+String(variation).padStart(2,'0'),
   category:type,biome,size,variation,title,
   status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   extents:{x:W,y:H,z:D},units:'exact owned integer occupied voxels, not final production AABBs',
   architecturalSignature:signature,roof:{form:roofForm,biomeSpecific:true},
   rooms,circulation:edges,features,
   openings:[{type:'entrance',x:center,y:2,z:0,clearHeightCells:3,
    doorSymbol:'pack2:020',doorOpenState:'unverified'},...windows,
    ...doors.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))],
   routeTargets:targets,intentionallyOpenRoof:voids,symbolicStairApproaches:stairs,
   unresolvedDependencies:symbols.map(ref=>({ref,
    issue:'Exact source producer variant/yaw, multivoxel occupied footprint, support, collision/selection, glazing and schema-1 save ABI unresolved until central integration'})),
   voxels};
  validateBlueprint(result);return Object.freeze(result);
 };
 return {center,W,D,H,C,put,replace,erase,base,shell,across,along,roof,post,furniture,elevated,end};
}
function booth(p,x,z,label,cover=B.canopy){
 for(const xx of [x,x+4])for(const zz of [z,z+4])p.post(xx,zz);
 for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
  p.elevated(xx,6,zz,cover,label+'-roof');
 for(let xx=x+1;xx<=x+3;xx++)for(let y=2;y<=4;y++)
  p.put(xx,y,z+4,B.wood,'wall',{role:'rear-seller-partition'});
 for(const xx of [x+1,x+3]){
  p.replace(xx,3,z+4,B.glass,'window');p.replace(xx,4,z+4,B.frame,'window');
 }
 for(let xx=x+1;xx<=x+3;xx++)p.furniture(xx,z+3,B.counter,label+'-trade-counter');
 p.furniture(x+1,z+2,B.display,label+'-display');
 p.furniture(x+3,z+2,B.crate,label+'-supply','decor');
 return {name:label,x:x+2,z:z+1};
}
function market(){
 const p=architect('market-square','temperate','medium',31,31),c=p.center;p.base();
 const stalls=[
  booth(p,2,5,'west-grain'),booth(p,24,5,'east-fabric'),
  booth(p,2,16,'west-flowers'),booth(p,24,16,'east-pottery'),
  booth(p,12,24,'north-apothecary')];
 for(const x of [c-5,c+5])for(const z of [9,20])p.post(x,z);
 for(let x=c-5;x<=c+5;x++)for(const z of [9,20])p.elevated(x,6,z,B.tile,'civic-arcade');
 for(let z=10;z<20;z++)for(const x of [c-5,c+5])p.elevated(x,6,z,B.tile,'civic-arcade');
 for(const [x,z] of [[12,14],[13,14],[12,15],[13,15]])
  p.furniture(x,z,B.rock,'off-center-public-water-basin');
 for(const [x,z] of [[7,26],[23,26],[9,3],[21,3]])
  p.furniture(x,z,B.light,'arcade-light','decor');
 return p.end({title:'Five-Gate Arcade Market',
  signature:'five separated vendor kiosks on three sides, a supported eleven-by-twelve civic ring roof around an open-center courtyard, offset stone public basin',
  roofForm:'five isolated seller canopies and elevated civic gallery ring, sky-lit central fountain',
  rooms:[
   {name:'Public processional court',uses:['square','public-circulation'],bounds:{x0:7,x1:23,z0:0,z1:29}},
   {name:'Five individual trade stall bays',uses:['vendor-stalls'],bounds:{x0:2,x1:28,z0:5,z1:28}},
   {name:'Weather-protected inner gallery',uses:['public-circulation'],bounds:{x0:11,x1:19,z0:10,z1:19}}
  ],
  edges:[
   {from:'exterior',to:'square',via:'open southern public portal'},
   {from:'square',to:'vendor-stalls',via:'five independent clear trade fronts'},
   {from:'square',to:'public-circulation',via:'surrounding the offset public water basin'}
  ],
  features:['square','vendor-stalls','public-circulation','five full-roof canopies','four-bearing arcade'],
  targets:[{name:'south public entry',x:c,z:0},{name:'west arcade',x:c-4,z:13},
   {name:'east arcade',x:c+4,z:13},{name:'northward link',x:c,z:21},...stalls]});
}
function clothier(){
 const p=architect('tailor','snow','medium',25,27),c=p.center;p.shell();p.roof(()=>false,B.snow);
 p.along(8,5,17,[8,14]);
 for(const z of [5,11,17])p.across(z,1,7);
 p.across(19,1,23,[c]);
 for(const [x,z] of [[15,5],[19,5],[15,9],[19,13]])
  p.furniture(x,z,B.display,'winter-outerwear-gallery');
 p.furniture(16,16,B.counter,'central-purchase-counter');
 for(const [x,z] of [[3,8],[5,9],[4,14],[6,15]])
  p.furniture(x,z,B.bench,'dressing-stool');
 for(const [x,z] of [[5,22],[9,23],[15,23],[19,22]])
  p.furniture(x,z,B.table,'spinning-cutting-workbench');
 p.furniture(21,24,B.crate,'wool-stock','decor');
 for(let z=3;z<=23;z++)p.elevated(c,8,z,B.snow,'snow-loft-ridge');
 return p.end({title:'Pineweft Winter Clothier',
  signature:'two physically separate sealed left fitting rooms, main winter clothing gallery, full-width rear wool production workroom and tall snow-ridge loft',
  roofForm:'heavy ridgeline winter roof over dual fitting alcoves and large loom studio',
  rooms:[
   {name:'Central outerwear showroom',uses:['sales-floor','service-counter','garment-display'],bounds:{x0:9,x1:23,z0:1,z1:18}},
   {name:'Private first fitting suite',uses:['fitting-area'],bounds:{x0:1,x1:7,z0:6,z1:10}},
   {name:'Separate second fitting suite',uses:['second-fitting'],bounds:{x0:1,x1:7,z0:12,z1:16}},
   {name:'Wide rear wool cutting atelier',uses:['cutting-area'],bounds:{x0:1,x1:23,z0:20,z1:25}}
  ],
  edges:[
   {from:'exterior',to:'sales-floor',via:'front doorway to main trade corridor'},
   {from:'sales-floor',to:'fitting-area',via:'actual x8,z8 suite entrance'},
   {from:'sales-floor',to:'second-fitting',via:'independent x8,z14 suite entrance'},
   {from:'sales-floor',to:'cutting-area',via:'rear partition x12,z19'}
  ],
  doors:[[8,8],[8,14],[c,19]],
  features:['sales-floor','service-counter','garment-display','fitting-area','second-fitting','cutting-area'],
  targets:[{name:'trade corridor',x:c,z:10},{name:'first fitting',x:5,z:8},
   {name:'second fitting',x:5,z:14},{name:'cutting workshop',x:c,z:22}]});
}
function herbButcher(){
 const p=architect('butcher','enchanted-forest','small',25,23),c=p.center;p.shell();
 p.roof((x,z)=>x>=9&&x<=15&&z>=3&&z<=7,B.leaves);
 p.across(10,1,23,[5,19]);p.along(12,11,21,[15]);
 for(const [x,z] of [[4,4],[6,4],[18,4],[20,4]])p.furniture(x,z,B.counter,'herb-shop-counter');
 for(const [x,z] of [[3,14],[4,17],[7,18]])p.furniture(x,z,B.crate,'cold-stock');
 for(const [x,z] of [[17,13],[20,15],[17,19]])p.furniture(x,z,B.table,'herbal-meat-preparation');
 p.furniture(19,19,B.light,'drying-lamp','decor');
 for(let x=15;x<=22;x++)for(let z=14;z<=20;z++)
  p.elevated(x,8,z,B.leaves,'drying-canopy');
 return p.end({title:'Greenbark Herb Butchery',
  signature:'front herb-filtered seven-by-five lightwell, two separate cold / hygienic prep rear wings and an elevated herbal drying canopy',
  roofForm:'split living roof with open customer court and raised west-to-east drying ventilation',
  rooms:[
   {name:'Greenwood public counter',uses:['sales-floor','service-counter'],bounds:{x0:1,x1:23,z0:1,z1:9}},
   {name:'Cold-preserved stockroom',uses:['cold-storage'],bounds:{x0:1,x1:11,z0:11,z1:21}},
   {name:'Separate herb butchering chamber',uses:['butcher-workspace'],bounds:{x0:13,x1:23,z0:11,z1:21}}
  ],
  edges:[
   {from:'exterior',to:'sales-floor',via:'public market entry'},
   {from:'sales-floor',to:'cold-storage',via:'western rear service gate x5,z10'},
   {from:'sales-floor',to:'butcher-workspace',via:'separate hygienic east gate x19,z10'}
  ],
  doors:[[5,10],[19,10],[12,15]],
  features:['sales-floor','service-counter','cold-storage','butcher-workspace','open herbal lightwell'],
  targets:[{name:'counter',x:c,z:6},{name:'cold goods',x:5,z:15},
   {name:'prep',x:19,z:15}],voids:[{x0:9,x1:15,z0:3,z1:7}]});
}
function gemVault(){
 const p=architect('jeweler','desert','small',23,23),c=p.center;p.shell();
 p.roof((x,z)=>x>=8&&x<=14&&z>=4&&z<=8);
 p.across(12,1,21,[6]);p.along(14,13,21,[17]);
 for(const [x,z] of [[3,4],[6,7],[17,4],[19,7]])
  p.furniture(x,z,B.display,'sunlight-gem-display');
 p.furniture(11,10,B.counter,'precious-stone-counter');
 for(const [x,z] of [[4,15],[7,18]])p.furniture(x,z,B.table,'lapidary-table');
 for(const [x,z] of [[17,14],[19,18]])p.furniture(x,z,B.rock,'vault-plinth');
 p.furniture(20,20,B.crate,'protected-strongroom-stock','decor');
 p.furniture(2,19,B.light,'craft-lamp','decor');
 for(let x=15;x<=21;x++)for(let z=13;z<=21;z++)
  p.elevated(x,8,z,B.rock,'raised-stone-vault-cap');
 return p.end({title:'Sunstone Lapidary Strongroom',
  signature:'public open sunlight gem gallery, single-door lapidary workroom, second controlled screen into eastern strongroom and raised secure stone vault',
  roofForm:'seven-wide sunlit front lightwell; elevated stonemasonry vault roof over rear eastern security annex',
  rooms:[
   {name:'Sun gem sales',uses:['sales-floor','service-counter','jewelry-display'],bounds:{x0:1,x1:21,z0:1,z1:11}},
   {name:'Craft and cutting workshop',uses:['secure-workroom'],bounds:{x0:1,x1:13,z0:13,z1:21}},
   {name:'East locked strongroom',uses:['vault'],bounds:{x0:15,x1:21,z0:13,z1:21}}
  ],
  edges:[
   {from:'exterior',to:'sales-floor',via:'public gem-court'},
   {from:'sales-floor',to:'secure-workroom',via:'single rear access x6,z12'},
   {from:'secure-workroom',to:'vault',via:'protected transfer x14,z17'}
  ],
  doors:[[6,12],[14,17]],
  features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault','sunlit front court'],
  targets:[{name:'gem display',x:c,z:6},{name:'lapidary',x:6,z:16},
   {name:'locked vault',x:18,z:17}],voids:[{x0:8,x1:14,z0:4,z1:8}]});
}
function snowBookshop(){
 const p=architect('bookshop','snow','small',23,25),c=p.center;p.shell();p.roof(()=>false,B.snow);
 p.across(3,1,21,[c]);p.along(15,5,16,[12]);
 for(const z of [5,16])p.across(z,16,21);
 p.across(19,1,21,[c]);
 for(const [x,z] of [[3,7],[3,11],[6,7],[6,12],[10,8]])
  p.furniture(x,z,B.display,'winter-book-shelves');
 p.furniture(12,17,B.counter,'bookkeeper-counter');
 for(const [x,z] of [[17,9],[19,13]])p.furniture(x,z,B.bench,'quiet-hearth-reading');
 for(const [x,z] of [[4,21],[8,22],[17,22]])p.furniture(x,z,B.crate,'protected-archive');
 p.furniture(19,21,B.light,'archive-lantern','decor');
 for(let z=2;z<=22;z++)p.elevated(c,8,z,B.snow,'insulated-roof-ridge');
 return p.end({title:'Snowhollow Hearthside Bookshop',
  signature:'double-portal winter vestibule, separate capped eastern hearthside reading annex, public shelf gallery and full-length dry archive screen',
  roofForm:'low insulated archive annex under continuous snowy ridgeline',
  rooms:[
   {name:'Winter book gallery',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:14,z0:4,z1:18}},
   {name:'Protected hearthside reading',uses:['reading-area'],bounds:{x0:16,x1:21,z0:6,z1:15}},
   {name:'Rear dry archive',uses:['stockroom'],bounds:{x0:1,x1:21,z0:20,z1:23}}
  ],
  edges:[
   {from:'exterior',to:'sales-floor',via:'second vestibule gate x11,z3'},
   {from:'sales-floor',to:'reading-area',via:'only east reading port x15,z12'},
   {from:'sales-floor',to:'stockroom',via:'rear archive x11,z19'}
  ],
  doors:[[c,3],[15,12],[c,19]],
  features:['sales-floor','service-counter','bookshelves','reading-area','stockroom','snow vestibule'],
  targets:[{name:'public gallery',x:c,z:9},{name:'reading annex',x:18,z:12},
   {name:'dry archive',x:c,z:22}]});
}
function mountainSanctuary(){
 const p=architect('temple','mountain','medium',29,31),c=p.center;p.shell();p.roof(()=>false,B.rock);
 p.along(9,7,20,[13]);p.along(19,7,20,[13]);
 for(const z of [6,21]){p.across(z,1,8);p.across(z,20,27);}
 p.across(23,1,27,[c-1,c,c+1]);
 for(const [x,z] of [[3,10],[5,16],[23,10],[25,16]])
  p.furniture(x,z,B.bench,'cliff-prayer-seat');
 p.furniture(3,18,B.light,'west-chapel-light','decor');
 p.furniture(25,18,B.light,'east-chapel-light','decor');
 for(const z of [27,28])for(let x=c-4;x<=c+4;x++)
  p.furniture(x,z,B.rock,'supported-altar-platform');
 p.elevated(c,3,28,B.altar,'ceremonial-stone-altar','fixture');
 for(const x of [c-4,c+4])p.furniture(x,25,B.stair,'symbolic-sanctuary-stair','fixture',
  {shapeRotationStatus:'unresolved-symbolic'});
 for(const [x,z] of [[3,3],[25,3],[3,26],[25,26]]){
  p.post(x,z,6,B.beam);
  for(let y=8;y<=11;y++)p.elevated(x,y,z,B.rock,'four-bell-cliff-tower',y===11?'roof':'wall');
 }
 for(let z=4;z<=24;z++)p.elevated(c,8,z,B.rock,'center-nave-high-ridge');
 return p.end({variation:2,title:'Four-Beacon Cliff Sanctuary',
  signature:'four independently grounded corner towers, two entirely end-capped rock chapels with single private ports, central nave and three-wide raised rear altar',
  roofForm:'weighted mountain masonry roof, four bell-tower crowns and center-length supported stone ridge',
  rooms:[
   {name:'Mountain central processional nave',uses:['ceremonial-space','public-circulation'],bounds:{x0:10,x1:18,z0:1,z1:22}},
   {name:'West enclosed stone meditation hall',uses:['west-meditation'],bounds:{x0:1,x1:8,z0:7,z1:20}},
   {name:'East enclosed stone meditation hall',uses:['east-meditation'],bounds:{x0:20,x1:27,z0:7,z1:20}},
   {name:'Four-beacon altar apse',uses:['altar'],bounds:{x0:1,x1:27,z0:24,z1:29}}
  ],
  edges:[
   {from:'exterior',to:'ceremonial-space',via:'front mountain pass ceremonial port'},
   {from:'ceremonial-space',to:'public-circulation',via:'three-wide covered central nave'},
   {from:'ceremonial-space',to:'west-meditation',via:'west x9,z13 chapel door'},
   {from:'ceremonial-space',to:'east-meditation',via:'east x19,z13 chapel door'},
   {from:'ceremonial-space',to:'altar',via:'triple rear x13..15,z23 sanctuary gate'}
  ],
  doors:[[9,13],[19,13],[c-1,23],[c,23],[c+1,23]],
  features:['ceremonial-space','altar','public-circulation','enclosed cliff meditation','four supported bell towers'],
  targets:[{name:'nave',x:c,z:10},{name:'west chapel',x:5,z:13},
   {name:'east chapel',x:23,z:13},{name:'rear sanctuary',x:c,z:25}],
  stairs:[{x:c-4,y:2,z:25,shapeRotationStatus:'unresolved-symbolic'},
   {x:c+4,y:2,z:25,shapeRotationStatus:'unresolved-symbolic'}]});
}
function snowStage(){
 const p=architect('theater','snow','small',27,29),c=p.center;p.shell();p.roof(()=>false,B.snow);
 p.across(3,1,25,[c]);
 for(const z of [6,9,12])for(const x of [5,7,9,17,19,21])
  p.furniture(x,z,B.bench,'auditorium-rows');
 for(let x=8;x<=18;x++)for(let z=17;z<=21;z++)
  p.furniture(x,z,B.wood,'elevated-stage-floor');
 for(const x of [7,19])for(let y=2;y<=6;y++)p.put(x,y,16,B.post,'wall',{role:'proscenium-pier'});
 for(const x of [7,19])for(const z of [17,21])p.post(x,z,6,B.beam);
 for(let x=7;x<=19;x++)for(let z=17;z<=21;z++)
  p.elevated(x,8,z,B.snow,'separately-insulated-stage-canopy');
 p.across(23,1,25,[5,21]);
 for(const [x,z] of [[3,26],[23,26]])p.furniture(x,z,B.crate,'dressing-room-stores');
 p.furniture(c,26,B.table,'costume-preparation-desk');
 p.furniture(2,5,B.light,'public-wayfinding','decor');
 for(const x of [7,19])p.furniture(x,18,B.stair,'symbolic-stage-ramp','fixture',
  {shapeRotationStatus:'unresolved-symbolic'});
 for(let z=4;z<=26;z++){
  if(z<17||z>21)p.elevated(c,8,z,B.snow,'ridge-bearing-course');
  p.elevated(c,9,z,B.snow,'high-snow-auditorium-ridge');
 }
 return p.end({title:'Snowveil Insulated Playhouse',
  signature:'two-threshold winter audience hall, separated seat banks, eleven-by-five raised stage under independently supported roof, sealed two-door dressing room',
  roofForm:'full snow roof, higher raised insulated stage cover and reinforced long center ridge',
  rooms:[
   {name:'Insulated winter audience',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:25,z0:4,z1:16}},
   {name:'Raised winter stage',uses:['stage'],bounds:{x0:8,x1:18,z0:17,z1:21}},
   {name:'Enclosed two-entry backstage',uses:['backstage'],bounds:{x0:1,x1:25,z0:24,z1:27}}
  ],
  edges:[
   {from:'exterior',to:'audience-area',via:'interior second portal of thermal vestibule x13,z3'},
   {from:'audience-area',to:'public-circulation',via:'two stage-side clear lanes'},
   {from:'public-circulation',to:'stage',via:'two conceptual Pack1 stairs, slope must be validated'},
   {from:'public-circulation',to:'backstage',via:'opposite open dressing-room doors x5 / x21,z23'}
  ],
  doors:[[c,3],[5,23],[21,23]],
  features:['stage','audience-area','backstage','public-circulation','thermal vestibule','separate stage roof'],
  targets:[{name:'audience',x:c,z:10},{name:'west promenade',x:5,z:19},
   {name:'east promenade',x:21,z:19},{name:'west dressing access',x:5,z:26},
   {name:'east dressing access',x:21,z:26}],
  stairs:[{x:7,y:2,z:18,shapeRotationStatus:'unresolved-symbolic'},
   {x:19,y:2,z:18,shapeRotationStatus:'unresolved-symbolic'}]});
}
function temperateBookCourt(){
 const p=architect('bookshop','temperate','medium',27,29),c=p.center;p.shell();
 p.roof((x,z)=>x>=10&&x<=16&&z>=8&&z<=13);
 p.along(19,5,18,[12]);
 for(const z of [5,18])p.across(z,20,25);
 p.across(21,1,25,[c]);
 for(const [x,z] of [[3,5],[3,10],[3,15],[6,5],[6,10],[9,5],[9,16],[15,5]])
  p.furniture(x,z,B.display,'atrium-arcade-bookshelf');
 p.furniture(16,17,B.counter,'public-binding-counter');
 for(const [x,z] of [[22,8],[23,15]])p.furniture(x,z,B.bench,'reading-arcade-seat');
 for(const [x,z] of [[4,24],[7,26],[16,25],[23,26]])
  p.furniture(x,z,B.crate,'protected-manuscript-stock');
 p.furniture(24,24,B.light,'archive-ward-lamp','decor');
 for(const [x,z] of [[9,7],[17,7],[9,14],[17,14]])
  p.elevated(x,8,z,B.beam,'book-courtyard-beam');
 return p.end({title:'Goldenleaf Atrium Books',
  signature:'medium sky-lit seven-by-six courtyard bookshelf arcade, separately enclosed eastern reading gallery and fully screened full-width rear warehouse archive',
  roofForm:'roof-broken skylit reading atrium with raised pavilion beams and enclosed side and rear stacks',
  rooms:[
   {name:'Public open bookshelf gallery',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:18,z0:1,z1:20}},
   {name:'East cloistered quiet reading suite',uses:['reading-area'],bounds:{x0:20,x1:25,z0:6,z1:17}},
   {name:'Protected rear literature archive',uses:['stockroom'],bounds:{x0:1,x1:25,z0:22,z1:27}}
  ],
  edges:[
   {from:'exterior',to:'sales-floor',via:'south public reader entrance'},
   {from:'sales-floor',to:'reading-area',via:'single x19,z12 gallery screen passage'},
   {from:'sales-floor',to:'stockroom',via:'full-width partition rear gateway x13,z21'}
  ],
  doors:[[19,12],[c,21]],
  features:['sales-floor','service-counter','bookshelves','reading-area','stockroom','sky-lit atrium'],
  targets:[{name:'main book court',x:c,z:11},{name:'quiet gallery',x:22,z:12},
   {name:'rear archive',x:c,z:25}],
  voids:[{x0:10,x1:16,z0:8,z1:13}]});
}
export const M1_SPECIALTY_COURTS=Object.freeze([
 market(),clothier(),herbButcher(),gemVault(),snowBookshop(),
 mountainSanctuary(),snowStage(),temperateBookCourt()
]);
