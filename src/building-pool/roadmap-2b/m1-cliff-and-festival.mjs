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


// These are eight independent literal-coordinate spatial programs, not clones,
// random seeds, recolors, generator titles, or production-placeable structures.
function r(p,x0,x1,z0,z1,y,mat,name){
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  p.elevated(x,y,z,mat,name);
}
function mtMarket(){
 const p=architect('market-square','mountain','small',27,29),c=p.center;p.base();
 const stalls=[booth(p,2,4,'ore',B.tile),booth(p,20,4,'wool',B.tile),
  booth(p,2,20,'herbs',B.tile),booth(p,20,20,'traveler',B.tile)];
 for(const x of [8,18])for(const z of [11,17])p.post(x,z,5,B.rock);
 r(p,8,8,11,17,6,B.tile,'cliffside-gallery');
 r(p,9,18,17,17,6,B.tile,'mountain-switchback-span');
 p.furniture(12,12,B.light,'public-cliff-lamp','decor');
 return p.end({variation:2,title:'Highpass Switchback Commons',
 signature:'four remote sheltered booths with an L-shaped raised stone roof arcade and deep open cliff crossing',
 roofForm:'four distinct merchant huts plus irregular L-shaped connecting portico',
 rooms:[{name:'Cliffside civic commons',uses:['square','public-circulation'],bounds:{x0:8,x1:18,z0:1,z1:27}},
  {name:'Four independently roofed hill traders',uses:['vendor-stalls'],bounds:{x0:2,x1:24,z0:4,z1:24}},
  {name:'Roofed mountain switchback overlook',uses:['public-circulation'],bounds:{x0:8,x1:18,z0:11,z1:17}}],
 edges:[{from:'exterior',to:'square',via:'central approach'},
  {from:'square',to:'vendor-stalls',via:'four physically independent stall facades'},
  {from:'square',to:'public-circulation',via:'unroofed center beside stone gallery'}],
 features:['square','vendor-stalls','public-circulation'],
 targets:[{name:'central crossing',x:c,z:12},...stalls]});
}
function mtTailor(){
 const p=architect('tailor','mountain','small',23,27),c=p.center;p.shell();
 p.along(8,5,16,[11]);for(const z of [5,17])p.across(z,1,7);
 p.across(20,1,21,[c]);
 p.roof((x,z)=>x>=10&&x<=14&&z>=6&&z<=10);
 for(const [x,z]of [[13,5],[17,9],[16,16]])p.furniture(x,z,B.display,'wool-garment-display');
 p.furniture(14,18,B.counter,'tailor-shop-desk');
 for(const [x,z]of [[3,9],[5,13]])p.furniture(x,z,B.bench,'fitting-room-seat');
 for(const [x,z]of [[4,23],[11,23],[18,23]])p.furniture(x,z,B.table,'rear-cutting-and-loom');
 p.furniture(19,24,B.crate,'loom-stock','decor');
 r(p,1,7,6,16,8,B.tile,'west-fitted-wing');
 r(p,4,4,7,15,9,B.tile,'raised-wool-gable');
 r(p,4,19,21,25,8,B.tile,'rear-weaver-pavilion');
 r(p,c,c,22,24,9,B.tile,'rear-weaver-crest');
 return p.end({title:'Needlepeak Split-Wing Tailor',
 signature:'asymmetric west fitting wing under gable and independent transverse rear loom pavilion with sky-lit front sales',
 roofForm:'west tall private wing, rear crossing weaver gable and front open lightwell',
 rooms:[{name:'Public highland garment showroom',uses:['sales-floor','service-counter','garment-display'],bounds:{x0:9,x1:21,z0:1,z1:19}},
  {name:'Secluded western fitting salon',uses:['fitting-area'],bounds:{x0:1,x1:7,z0:6,z1:16}},
  {name:'Rear wool cutting and loom studio',uses:['cutting-area'],bounds:{x0:1,x1:21,z0:21,z1:25}}],
 edges:[{from:'exterior',to:'sales-floor',via:'south retail entry'},
  {from:'sales-floor',to:'fitting-area',via:'west physical portal x8,z11'},
  {from:'sales-floor',to:'cutting-area',via:'rear studio portal x11,z20'}],
 doors:[[8,11],[c,20]],features:['sales-floor','service-counter','garment-display','fitting-area','cutting-area'],
 targets:[{name:'public retail',x:c,z:13},{name:'private fitting',x:4,z:11},
  {name:'rear looms',x:12,z:23}],
 voids:[{x0:10,x1:14,z0:6,z1:10}]});
}
function mtButcher(){
 const p=architect('butcher','mountain','small',25,25),c=p.center;p.shell();
 p.across(10,1,23,[5,19]);p.along(12,11,23,[17]);
 p.roof((x,z)=>x>=9&&x<=15&&z>=3&&z<=7);
 for(const [x,z]of [[4,5],[6,7],[18,5],[20,7]])p.furniture(x,z,B.counter,'public-provisions-counter');
 for(const [x,z]of [[3,15],[7,18],[9,21]])p.furniture(x,z,B.crate,'stone-cold-storage');
 for(const [x,z]of [[16,14],[19,18]])p.furniture(x,z,B.table,'clean-cutting-room');
 p.furniture(20,22,B.light,'sanitary-lamp','decor');
 r(p,1,10,12,23,8,B.rock,'west-insulated-mountain-roof');
 r(p,6,6,13,22,9,B.rock,'left-cold-ridge');
 p.post(21,20,6);
 for(let y=8;y<=11;y++)p.elevated(21,y,20,B.rock,'grounded-stone-extraction',y===11?'roof':'wall');
 return p.end({title:'Stonechill Salt & Cutters',
 signature:'front skylight trade, sealed west cold pantry, independent clean east cutting atelier and foundation-connected high smoke shaft',
 roofForm:'one-sided stone cold ridge paired with tall chimney opposite the public front skylight',
 rooms:[{name:'Public highpass meat counter',uses:['sales-floor','service-counter'],bounds:{x0:1,x1:23,z0:1,z1:9}},
  {name:'Insulated west rock-salt pantry',uses:['cold-storage'],bounds:{x0:1,x1:11,z0:11,z1:23}},
  {name:'Separated east hygienic cutting atelier',uses:['butcher-workspace'],bounds:{x0:13,x1:23,z0:11,z1:23}}],
 edges:[{from:'exterior',to:'sales-floor',via:'south shopping entrance'},
  {from:'sales-floor',to:'cold-storage',via:'west x5,z10 isolation door'},
  {from:'sales-floor',to:'butcher-workspace',via:'east x19,z10 service door'}],
 doors:[[5,10],[19,10],[12,17]],
 features:['sales-floor','service-counter','cold-storage','butcher-workspace'],
 targets:[{name:'retail',x:c,z:6},{name:'cold stores',x:5,z:16},
  {name:'butcher studio',x:19,z:16}],
 voids:[{x0:9,x1:15,z0:3,z1:7}]});
}
function mtJeweler(){
 const p=architect('jeweler','mountain','small',25,27),c=p.center;p.shell();
 p.across(12,1,23,[6]);p.along(15,13,25,[20]);
 p.roof((x,z)=>x>=9&&x<=15&&z>=4&&z<=9,B.rock);
 for(const [x,z]of [[4,5],[8,8],[19,5],[20,10]])p.furniture(x,z,B.display,'miner-gem-display');
 p.furniture(11,11,B.counter,'public-gem-purchase');
 for(const [x,z]of [[4,16],[8,22]])p.furniture(x,z,B.table,'artisan-polishing');
 for(const [x,z]of [[18,17],[21,22]])p.furniture(x,z,B.rock,'private-mountain-vault');
 p.furniture(21,24,B.crate,'vault-supply','decor');
 r(p,16,23,14,25,8,B.rock,'sealed-eastern-gem-bulkhead');
 r(p,20,20,16,23,9,B.rock,'upper-mountain-vault-ridge');
 return p.end({title:'Gemspur Mountain Strongbox',
 signature:'sunlit retail inspection court opening into west lapidary workshop and an east sequential single-gate high stone strongbox',
 roofForm:'raised east-side stone vault and front small public rooflight',
 rooms:[{name:'Skylit public mineral examination',uses:['sales-floor','service-counter','jewelry-display'],bounds:{x0:1,x1:23,z0:1,z1:11}},
  {name:'Private west gemstone cutting studio',uses:['secure-workroom'],bounds:{x0:1,x1:14,z0:13,z1:25}},
  {name:'Independently bounded east strongbox',uses:['vault'],bounds:{x0:16,x1:23,z0:13,z1:25}}],
 edges:[{from:'exterior',to:'sales-floor',via:'front gem display entrance'},
  {from:'sales-floor',to:'secure-workroom',via:'single workshop gate x6,z12'},
  {from:'secure-workroom',to:'vault',via:'only high-security x15,z20 port'}],
 doors:[[6,12],[15,20]],features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault'],
 targets:[{name:'public display',x:c,z:7},{name:'workroom',x:6,z:19},
  {name:'east strongbox',x:19,z:20}],
 voids:[{x0:9,x1:15,z0:4,z1:9}]});
}
function mtBooks(){
 const p=architect('bookshop','mountain','small',25,29),c=p.center;p.shell();p.roof(()=>false,B.rock);
 p.along(17,5,20,[12]);for(const z of [5,20])p.across(z,18,23);
 p.across(22,1,23,[c]);
 for(const [x,z]of [[3,6],[3,11],[6,16],[10,9],[13,16]])p.furniture(x,z,B.display,'rock-parchment-shelves');
 p.furniture(13,20,B.counter,'scrollery-sales');
 for(const [x,z]of [[19,10],[21,16]])p.furniture(x,z,B.bench,'private-overlook-reading');
 for(const [x,z]of [[4,24],[8,26],[19,25]])p.furniture(x,z,B.crate,'archive-parchments');
 p.furniture(21,25,B.light,'dry-scroll-lamp','decor');
 r(p,18,23,6,20,8,B.rock,'eastern-reader-tower');
 r(p,21,21,7,19,9,B.rock,'raised-reader-crest');
 r(p,2,16,23,27,8,B.rock,'rear-archive-lean-to');
 r(p,9,9,24,26,9,B.rock,'transverse-archive-gable');
 return p.end({title:'Gablemark Cliffside Scrollery',
 signature:'long eastern one-entry reader tower, opposite transverse rear low parchment archive and staggered occupied rock scroll shelves',
 roofForm:'north-south reading gable and crossing rear manuscript storage gable',
 rooms:[{name:'Mountain manuscript showroom and shelves',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:16,z0:1,z1:21}},
  {name:'Single-door east cliff reading gallery',uses:['reading-area'],bounds:{x0:18,x1:23,z0:6,z1:19}},
  {name:'Separated rear parchment archive',uses:['stockroom'],bounds:{x0:1,x1:23,z0:23,z1:27}}],
 edges:[{from:'exterior',to:'sales-floor',via:'main mountain browse passage'},
  {from:'sales-floor',to:'reading-area',via:'east x17,z12 single reader gate'},
  {from:'sales-floor',to:'stockroom',via:'rear x12,z22 paper archive'}],
 doors:[[17,12],[c,22]],features:['sales-floor','service-counter','bookshelves','reading-area','stockroom'],
 targets:[{name:'shelves',x:c,z:12},{name:'reading tower',x:20,z:12},
  {name:'rear archive',x:c,z:25}]});
}
function mtTheater(){
 const p=architect('theater','mountain','small',29,31),c=p.center;p.shell();
 p.roof((x,z)=>x>=3&&x<=25&&z>=4&&z<=19,B.rock);
 for(const x of [5,8,11,17,20,23])for(const z of [6,9,12])p.furniture(x,z,B.bench,'cliff-audience-bench');
 for(let x=9;x<=19;x++)for(let z=21;z<=24;z++)p.furniture(x,z,B.wood,'elevated-stage-floor');
 for(const x of [8,20])for(const z of [20,25])p.post(x,z,6);
 r(p,8,20,20,25,8,B.rock,'stone-stage-overhang');
 r(p,11,17,21,24,9,B.rock,'tiered-cliff-stage-canopy');
 p.across(27,1,27,[5,23]);
 p.furniture(3,28,B.crate,'backstage-set-storage','decor');
 p.furniture(25,28,B.table,'costume-station');
 p.furniture(2,8,B.light,'audience-lamp','decor');
 for(const x of [8,20])p.furniture(x,22,B.stair,'symbolic-stage-stair','fixture',{shapeRotationStatus:'unresolved-symbolic'});
 return p.end({title:'Boulderfall Pocket Amphitheater',
 signature:'open cliff audience rows and small raised stage under physically supported staggered rock overhang, rear dual-entry wardrobe room',
 roofForm:'uncovered mountain audience and deeply covered two-tier cliff performance roof',
 rooms:[{name:'Open-air rock-bowl spectator benches',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:27,z0:1,z1:19}},
  {name:'Covered elevated boulder performance stage',uses:['stage'],bounds:{x0:9,x1:19,z0:21,z1:24}},
  {name:'Double-door rear cliff dressing room',uses:['backstage'],bounds:{x0:1,x1:27,z0:28,z1:29}}],
 edges:[{from:'exterior',to:'audience-area',via:'south spectator entrance'},
  {from:'audience-area',to:'public-circulation',via:'two separate side promenades'},
  {from:'public-circulation',to:'stage',via:'symbolic slope pending physical producer verification'},
  {from:'public-circulation',to:'backstage',via:'two distinct x5/x23,z27 passageways'}],
 doors:[[5,27],[23,27]],features:['stage','audience-area','backstage','public-circulation'],
 targets:[{name:'spectators',x:c,z:11},{name:'west stage path',x:5,z:22},
  {name:'east stage path',x:23,z:22},{name:'west dressing',x:5,z:28},
  {name:'east dressing',x:23,z:28}],
 stairs:[{x:8,y:2,z:22,shapeRotationStatus:'unresolved-symbolic'},
  {x:20,y:2,z:22,shapeRotationStatus:'unresolved-symbolic'}],
 voids:[{x0:3,x1:25,z0:4,z1:19}]});
}
function faeMarket(){
 const p=architect('market-square','enchanted-forest','medium',37,37),c=p.center;p.base();
 const stalls=[booth(p,2,6,'mushrooms',B.leaves),booth(p,30,6,'berries',B.leaves),
  booth(p,2,25,'fae-inks',B.leaves),booth(p,30,25,'living-fiber',B.leaves),
  booth(p,9,30,'root-dyes',B.leaves),booth(p,23,30,'forest-craft',B.leaves)];
 for(const x of [11,25])for(const z of [13,21])p.post(x,z);
 r(p,11,11,13,21,6,B.leaves,'west-pergola');
 r(p,25,25,13,26,6,B.leaves,'long-east-pergola');
 for(const x of [14,22]){
  p.post(x,27,6); // Grounded independent ends of nine-cell canopy beam.
  p.elevated(x,7,27,B.wood,'foundation-to-arch-bearing','wall');
 }
 r(p,14,22,27,27,8,B.leaves,'high-festival-bough');
 p.furniture(18,16,B.light,'woodland-gathering-lamp','decor');
 return p.end({title:'Six-Lantern Woodland Festival',
 signature:'six detached livingwood trader roofs surrounding a wide open dance lane and twin unequal pergolas connected by a raised ceremonial arch',
 roofForm:'six separate canopy houses and two uneven festival side pergolas',
 rooms:[{name:'Open sky woodland dance commons',uses:['square','public-circulation'],bounds:{x0:12,x1:24,z0:1,z1:29}},
  {name:'Six independent livingwood seller booths',uses:['vendor-stalls'],bounds:{x0:2,x1:34,z0:6,z1:34}},
  {name:'Unequal long public pergola galleries',uses:['public-circulation'],bounds:{x0:11,x1:25,z0:13,z1:27}}],
 edges:[{from:'exterior',to:'square',via:'south forest public trail'},
  {from:'square',to:'vendor-stalls',via:'six independent seller access paths'},
  {from:'square',to:'public-circulation',via:'central wide sky-open festival'}],
 features:['square','vendor-stalls','public-circulation'],
 targets:[{name:'main festival crossing',x:c,z:13},{name:'north dance',x:c,z:26},...stalls]});
}
function snowTheater(){
 const p=architect('theater','snow','medium',33,35),c=p.center;p.shell();p.roof(()=>false,B.snow);
 p.across(3,1,31,[c]);
 for(const x of [4,7,10,22,25,28])for(const z of [6,9,12,15])p.furniture(x,z,B.bench,'six-column-snow-audience');
 for(let x=10;x<=22;x++)for(let z=21;z<=25;z++)p.furniture(x,z,B.wood,'raised-stage-floor');
 for(const x of [9,23])for(const z of [20,26])p.post(x,z,6);
 r(p,9,23,20,26,8,B.snow,'winter-covered-stage');
 r(p,12,20,21,25,9,B.snow,'raised-snow-flytower');
 r(p,c,c,22,24,10,B.snow,'high-winter-stage-crest');
 p.across(29,1,31,[6,26]);
 p.furniture(3,32,B.crate,'backstage-cold-props','decor');
 p.furniture(29,32,B.table,'costume-warming-table');
 p.furniture(2,8,B.light,'snow-audience-lamp','decor');
 for(const x of [9,23])p.furniture(x,22,B.stair,'symbolic-snow-stage-step','fixture',{shapeRotationStatus:'unresolved-symbolic'});
 return p.end({title:'Winterglass Lantern Auditorium',
 signature:'six-column insulated winter seating, double thermal vestibule, high tiered full-width stage flytower and twin independently open backstage doors',
 roofForm:'three-tiered winter stage crest over enclosed auditorium and back costume suite',
 rooms:[{name:'Insulated winter spectator auditorium',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:31,z0:4,z1:19}},
  {name:'Raised snow-covered performance platform',uses:['stage'],bounds:{x0:10,x1:22,z0:21,z1:25}},
  {name:'Separate winter costume and prop workshop',uses:['backstage'],bounds:{x0:1,x1:31,z0:30,z1:33}}],
 edges:[{from:'exterior',to:'audience-area',via:'second thermal vestibule x16,z3'},
  {from:'audience-area',to:'public-circulation',via:'both wide side aisles'},
  {from:'public-circulation',to:'stage',via:'stage symbolic steps not physically approved'},
  {from:'public-circulation',to:'backstage',via:'two separate x6/x26,z29 port routes'}],
 doors:[[c,3],[6,29],[26,29]],features:['stage','audience-area','backstage','public-circulation'],
 targets:[{name:'winter audience',x:c,z:11},{name:'west stage path',x:6,z:23},
  {name:'east stage path',x:26,z:23},{name:'backstage west',x:6,z:31},
  {name:'backstage east',x:26,z:31}],
 stairs:[{x:9,y:2,z:22,shapeRotationStatus:'unresolved-symbolic'},
  {x:23,y:2,z:22,shapeRotationStatus:'unresolved-symbolic'}]});
}
export const M1_CLIFF_AND_FESTIVAL=Object.freeze([
 mtMarket(),mtTailor(),mtButcher(),mtJeweler(),mtBooks(),mtTheater(),faeMarket(),snowTheater()
]);