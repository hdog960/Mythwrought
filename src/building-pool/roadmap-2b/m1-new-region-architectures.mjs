import {SCHEMA,validateBlueprint} from './schema.mjs';

// Builder 2B: eight original coordinate-authored spaces, deliberately not seeds,
// rescaled legacy temples or ready-to-place builds. Each architectural section
// specifies its own occupied cells, functional ports, skylights and bearing.
const P=Object.freeze({
 stone:'pack1:002',paving:'pack1:005',stair:'pack1:008',
 timber:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snowRoof:'pack3:025',living:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lantern:'pack4:035',
 crate:'pack4:057',bench:'pack4:058',table:'pack4:059',
 banner:'pack4:061',canopy:'pack4:062',
 counter:'pack5:086',display:'pack5:087',altar:'pack5:093'
});
const coord=(x,y,z)=>x+','+y+','+z;
function architect(category,biome,size,W,D,H=13){
 const occupied=new Map(),mid=Math.floor(W/2),ctx={category,biome,size,W,D,H,mid};
 const bounds=(x,y,z)=>[x,y,z].every(Number.isSafeInteger)&&x>=0&&x<W&&y>=0&&y<H&&z>=0&&z<D;
 ctx.get=(x,y,z)=>occupied.get(coord(x,y,z));
 ctx.put=(x,y,z,material,kind,other={})=>{
  if(!bounds(x,y,z))throw Error('2B architectural coordinate out of bounds '+coord(x,y,z));
  const k=coord(x,y,z);if(occupied.has(k))throw Error('2B duplicate physical cell '+category+':'+k);
  occupied.set(k,{x,y,z,material,kind,...other});
 };
 ctx.replace=(x,y,z,material,kind,other={})=>{
  const k=coord(x,y,z);if(!occupied.has(k))throw Error('2B replacement of air '+k);
  occupied.set(k,{x,y,z,material,kind,...other});
 };
 ctx.remove=(x,y,z)=>{if(!occupied.delete(coord(x,y,z)))throw Error('2B attempted removal of air '+coord(x,y,z));};
 ctx.foundation=()=>{
  for(let x=0;x<W;x++)for(let z=0;z<D;z++){
   ctx.put(x,0,z,P.stone,'foundation');
   ctx.put(x,1,z,x===mid?P.paving:P.timber,'floor');
  }
 };
 ctx.shell=()=>{
  ctx.foundation();
  for(let x=0;x<W;x++)for(const z of [0,D-1])for(let y=2;y<=6;y++)
   ctx.put(x,y,z,P.beam,'wall',{role:'weather-shell'});
  for(let z=1;z<D-1;z++)for(const x of [0,W-1])for(let y=2;y<=6;y++)
   ctx.put(x,y,z,P.beam,'wall',{role:'weather-shell'});
  for(let y=2;y<=4;y++)ctx.remove(mid,y,0);
  for(const x of [3,W-4])for(let y=3;y<=4;y++)
   ctx.replace(x,y,0,y===3?P.glass:P.frame,'window');
  for(const x of [0,W-1])for(const z of [5,D-6])
   ctx.replace(x,3,z,P.glass,'window');
 };
 ctx.screenX=(z,x0,x1,doorXs=[])=>{
  for(let x=x0;x<=x1;x++)for(let y=2;y<=5;y++)
   if(y===5||!doorXs.includes(x))ctx.put(x,y,z,P.beam,'wall',{role:'room-partition'});
 };
 ctx.screenZ=(x,z0,z1,doors=[])=>{
  for(let z=z0;z<=z1;z++)for(let y=2;y<=5;y++)
   if(y===5||!doors.includes(z))ctx.put(x,y,z,P.beam,'wall',{role:'room-partition'});
 };
 ctx.roof=(skip=()=>false,material=P.roof)=>{
  for(let x=0;x<W;x++)for(let z=0;z<D;z++)
   if(!skip(x,z))ctx.put(x,7,z,material,'roof',{role:'weather-roof'});
 };
 ctx.post=(x,z,top=6,material=P.post)=>{
  for(let y=2;y<=top;y++)ctx.put(x,y,z,material,'wall',{role:'roof-bearing-post'});
 };
 ctx.fixture=(x,z,material,role,kind='fixture',meta={})=>ctx.put(x,2,z,material,kind,{role,...meta});
 ctx.high=(x,y,z,material,role,kind='roof')=>ctx.put(x,y,z,material,kind,{role});
 ctx.done=({variation=1,title,signature,roofForm,rooms,circulation,features,ports=[],targets,voids=[],stairIntents=[]})=>{
  const voxels=[...occupied.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const entrance={type:'entrance',x:mid,y:2,z:0,clearHeightCells:3,
   doorSymbol:'pack2:020',doorOpenState:'unverified'};
  const windows=voxels.filter(v=>v.kind==='window').map(v=>({type:'window',x:v.x,y:v.y,z:v.z,material:v.material}));
  const materials=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
  const bp={schema:SCHEMA,
   id:'r2:'+category+':'+biome+':'+size+':'+String(variation).padStart(2,'0'),
   category,biome,size,variation,title,
   status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   extents:{x:W,y:H,z:D},units:'authored integer cells; geometry for each physical producer variant unresolved',
   architecturalSignature:signature,roof:{form:roofForm,biomeSpecific:true},
   rooms,circulation,features,
   openings:[entrance,...windows,...ports],routeTargets:targets,
   intentionallyOpenRoof:voids,symbolicStairApproaches:stairIntents,
   unresolvedDependencies:materials.map(ref=>({ref,
    issue:'Check source-authentic variant, occupied offsets, yaw, support, mounting, collision, selection, transparency and schema-1 before central integration'})),
   voxels};
  validateBlueprint(bp);return Object.freeze(bp);
 };
 return ctx;
}
function kiosk(p,x,z,label,roof=P.snowRoof){
 for(const xx of [x,x+4])for(const zz of [z,z+4])p.post(xx,zz,5);
 for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
  p.high(xx,6,zz,roof,label+'-weather-canopy');
 for(let xx=x+1;xx<=x+3;xx++)for(let y=2;y<=4;y++)
  p.put(xx,y,z+4,P.timber,'wall',{role:'trading-stall-rear-screen'});
 for(const xx of [x+1,x+3]){
  p.replace(xx,3,z+4,P.glass,'window');
  p.replace(xx,4,z+4,P.frame,'window');
 }
 for(let xx=x+1;xx<=x+3;xx++)p.fixture(xx,z+3,P.counter,label+'-counter');
 p.fixture(x+1,z+2,P.display,label+'-stock-display');
 p.fixture(x+3,z+2,P.crate,label+'-crate','decor');
 return {name:label,x:x+2,z:z+1};
}
function snowMarket(){
 const p=architect('market-square','snow','small',27,25,12),c=p.mid;p.foundation();
 // A deliberate THREE-stall T plan rather than another four-wing market.
 const stalls=[
  kiosk(p,2,5,'windward-fish'),
  kiosk(p,20,5,'lee-side-cloth'),
  kiosk(p,10,16,'north-coal')
 ];
 for(const x of [0,26])for(let z=5;z<=19;z++)for(let y=2;y<=4;y++)
  p.put(x,y,z,P.stone,'wall',{role:'winter-wind-shield'});
 for(const [x,z] of [[20,16],[24,16],[20,20],[24,20]])p.post(x,z,5,P.beam);
 for(let x=20;x<=24;x++)for(let z=16;z<=20;z++)
  p.high(x,6,z,P.snowRoof,'separate-warming-pavilion');
 p.fixture(22,18,P.bench,'public-warming-seat');
 for(const x of [c-3,c+3])p.post(x,0,5);
 for(let x=c-3;x<=c+3;x++)p.high(x,6,0,P.snowRoof,'snow-entry-tunnel');
 p.fixture(2,20,P.lantern,'winter-beacon','decor');
 return p.done({
  title:'Frosttrail Three-Wing Bazaar',
  signature:'three independent weatherproof trade kiosks forming an asymmetric T plus detached eastern warming pavilion and full-height side winter wind shields',
  roofForm:'three detached five-cell snow roofs, independent sheltered warming square and winter entry awning',
  rooms:[
   {name:'Open crossing and snow-market walkway',uses:['square','public-circulation'],bounds:{x0:8,x1:18,z0:0,z1:23}},
   {name:'Three winter trading alcoves',uses:['vendor-stalls'],bounds:{x0:2,x1:24,z0:5,z1:20}},
   {name:'Separated wind-proof warming pavilion',uses:['public-circulation'],bounds:{x0:20,x1:24,z0:16,z1:20}}
  ],
  circulation:[
   {from:'exterior',to:'square',via:'grounded south winter entry at x13'},
   {from:'square',to:'vendor-stalls',via:'three independent three-cell-high customer approaches'},
   {from:'square',to:'public-circulation',via:'east-side independent warming court'}
  ],
  features:['square','vendor-stalls','public-circulation','three independent kiosks','warming pavilion','snow wind-break'],
  targets:[{name:'entry',x:c,z:0},{name:'plaza-spine',x:c,z:11},
   {name:'warming-pavilion',x:22,z:17},...stalls]
 });
}
function desertTailor(){
 const p=architect('tailor','desert','small',19,21),c=p.mid;p.shell();
 p.roof((x,z)=>x>=6&&x<=11&&z>=7&&z<=11);
 // Bounded east fitting suite and independently accessed rear pattern studio.
 p.screenZ(13,4,13,[8]);
 p.screenX(4,14,17);
 p.screenX(14,14,17);
 p.screenX(15,1,17,[c]);
 for(const [x,z] of [[3,4],[3,8],[5,4],[5,11]])
  p.fixture(x,z,P.display,'draped-garment-shelf');
 p.fixture(11,5,P.counter,'tailoring-service-counter');
 for(const [x,z] of [[15,6],[16,10]])p.fixture(x,z,P.bench,'fitting-stool');
 for(const [x,z] of [[4,17],[7,18],[13,17]])p.fixture(x,z,P.table,'pattern-cutting-table');
 p.fixture(16,18,P.crate,'folded-bolt-fabric','decor');
 for(const [x,z] of [[5,7],[12,7],[5,11],[12,11]])p.high(x,8,z,P.stone,'courtyard-sunshade-fin');
 for(let x=6;x<=11;x++)p.high(x,8,6,P.stone,'courtyard-front-shade-slat');
 return p.done({
  title:'Duneward Open-Light Tailor',
  signature:'open-roof central courtyard beneath stone sun fins, capped east three-cell fitting suite and separate transverse rear pattern-cutting workshop',
  roofForm:'sun-baffled rooftop sewing lightwell with full sheltered fitting and rear workspaces',
  rooms:[
   {name:'Public tailoring display gallery',uses:['sales-floor','service-counter','garment-display'],bounds:{x0:1,x1:12,z0:1,z1:14}},
   {name:'Single-door east fitting room',uses:['fitting-area'],bounds:{x0:14,x1:17,z0:5,z1:13}},
   {name:'Rear cloth cutting atelier',uses:['cutting-area'],bounds:{x0:1,x1:17,z0:16,z1:19}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'south three-high doorway'},
   {from:'sales-floor',to:'fitting-area',via:'one door x13,z8 through physical side screen'},
   {from:'sales-floor',to:'cutting-area',via:'rear partition x9,z15'}
  ],
  ports:[{type:'internal-doorway',x:13,y:2,z:8,clearHeightCells:3},
   {type:'internal-doorway',x:c,y:2,z:15,clearHeightCells:3}],
  features:['fitting-area','garment-display','sales-floor','service-counter','cutting-area','courtyard lightwell'],
  targets:[{name:'retail',x:c,z:5},{name:'fitting',x:15,z:8},{name:'cutting',x:c,z:17}],
  voids:[{x0:6,x1:11,z0:7,z1:11}]
 });
}
function snowButcher(){
 const p=architect('butcher','snow','small',23,21),c=p.mid;p.shell();
 p.roof(()=>false,P.snowRoof);
 // Physically protected DOUBLE-entry vestibule before the selling hall.
 p.screenX(3,1,21,[c]);
 p.screenX(10,1,21,[5,17]);
 p.screenZ(11,11,19,[15]);
 for(const [x,z] of [[4,6],[6,6],[16,6],[18,6]])p.fixture(x,z,P.counter,'weighing-and-cold-meat-counter');
 for(const [x,z] of [[3,13],[4,16],[7,17]])p.fixture(x,z,P.crate,'separate-ice-cellar-stock');
 for(const [x,z] of [[15,13],[18,14],[17,17]])p.fixture(x,z,P.table,'clean-preparation-table');
 p.fixture(20,18,P.lantern,'smoke-room-warning','decor');
 for(let z=2;z<=18;z++)p.high(c,8,z,P.snowRoof,'tall-snow-drift-ridge');
 for(let y=8;y<=11;y++)p.high(19,y,17,P.stone,'separate-extraction-flue','wall');
 return p.done({
  title:'Whiteiron Double-Lock Butchery',
  signature:'snow-proof sales entry vestibule with a second central inner gate, isolated rear ice cellar and distinct prep smokehouse, real interior service transfer and tall rear extraction flue',
  roofForm:'full snow roof with tall central drift ridge and separate vertically stacked cold-smoke flue',
  rooms:[
   {name:'Double-door winter vestibule',uses:['sales-floor','service-counter'],bounds:{x0:1,x1:21,z0:1,z1:9}},
   {name:'Enclosed western ice chamber',uses:['cold-storage'],bounds:{x0:1,x1:10,z0:11,z1:19}},
   {name:'Clean smoke and preparation room',uses:['butcher-workspace'],bounds:{x0:12,x1:21,z0:11,z1:19}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'second vestibule doorway x11,z3'},
   {from:'sales-floor',to:'cold-storage',via:'west independent x5,z10 threshold'},
   {from:'sales-floor',to:'butcher-workspace',via:'east independent x17,z10 threshold'}
  ],
  ports:[{type:'internal-doorway',x:c,y:2,z:3,clearHeightCells:3},
   {type:'internal-doorway',x:5,y:2,z:10,clearHeightCells:3},
   {type:'internal-doorway',x:17,y:2,z:10,clearHeightCells:3},
   {type:'internal-doorway',x:11,y:2,z:15,clearHeightCells:3}],
  features:['sales-floor','service-counter','butcher-workspace','cold-storage','second vestibule screen','real smoke flue'],
  targets:[{name:'retail',x:c,z:6},{name:'cold',x:5,z:13},{name:'prep',x:17,z:13}]
 });
}
function forestJeweler(){
 const p=architect('jeweler','enchanted-forest','small',23,21),c=p.mid;p.shell();
 p.roof((x,z)=>x>=8&&x<=12&&z>=5&&z<=9,P.living);
 p.screenX(10,1,21,[6]);
 p.screenZ(14,11,19,[15]);
 for(const [x,z] of [[4,4],[6,6],[17,4],[19,6]])p.fixture(x,z,P.display,'front-crystal-display');
 p.fixture(12,7,P.counter,'emerald-bargain-counter');
 for(const [x,z] of [[3,13],[6,15]])p.fixture(x,z,P.table,'lapidary-cutting-bench');
 for(const [x,z] of [[17,13],[19,16]])p.fixture(x,z,P.stone,'vault-gem-base');
 p.fixture(18,18,P.crate,'secure-vault-cabinet');
 p.fixture(3,18,P.lantern,'workroom-lantern','decor');
 for(const [x,z] of [[6,5],[14,5],[6,9],[14,9]])p.high(x,8,z,P.post,'living-bower-branch-post');
 for(let x=15;x<=20;x++)for(let z=12;z<=18;z++)
  p.high(x,8,z,P.living,'raised-root-vault-cap');
 return p.done({
  title:'Thornlight Gemhouse & Root Vault',
  signature:'skylit gem-bargain courtyard front, single west-facing protected craft access and separately screened eastern vaulted root-vault under higher livingwood roof',
  roofForm:'five-by-five skylit gemstone showroom opening and raised organic protected vault cap',
  rooms:[
   {name:'Public gemstone light gallery',uses:['sales-floor','service-counter','jewelry-display'],bounds:{x0:1,x1:21,z0:1,z1:9}},
   {name:'Single-entry craft workroom',uses:['secure-workroom'],bounds:{x0:1,x1:13,z0:11,z1:19}},
   {name:'Privately enclosed gem root-vault',uses:['vault'],bounds:{x0:15,x1:21,z0:11,z1:19}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'open front gallery at x11'},
   {from:'sales-floor',to:'secure-workroom',via:'only rear workroom access x6,z10'},
   {from:'secure-workroom',to:'vault',via:'interior-only protected transfer x14,z15'}
  ],
  ports:[{type:'internal-doorway',x:6,y:2,z:10,clearHeightCells:3},
   {type:'internal-doorway',x:14,y:2,z:15,clearHeightCells:3}],
  features:['jewelry-display','secure-workroom','vault','sales-floor','service-counter','gemstone courtyard'],
  targets:[{name:'showroom',x:c,z:6},{name:'workshop',x:6,z:14},{name:'vault',x:17,z:15}],
  voids:[{x0:8,x1:12,z0:5,z1:9}]
 });
}
function desertBookshop(){
 const p=architect('bookshop','desert','small',21,23),c=p.mid;p.shell();
 p.roof((x,z)=>x>=6&&x<=10&&z>=7&&z<=11);
 p.screenZ(14,5,14,[9]);p.screenX(4,15,19);p.screenX(15,15,19);
 p.screenX(16,1,19,[c]);
 for(const [x,z] of [[3,5],[3,9],[4,12],[7,5],[11,4],[12,12]])
  p.fixture(x,z,P.display,'sandstone-bookstack');
 p.fixture(11,13,P.counter,'public-scribe-desk');
 for(const [x,z] of [[16,7],[17,11]])p.fixture(x,z,P.bench,'shaded-reader-seat');
 for(const [x,z] of [[3,18],[6,20],[15,20]])p.fixture(x,z,P.crate,'protected-manuscript-stock');
 p.fixture(18,19,P.lantern,'archive-ward-lamp','decor');
 for(let z=6;z<=12;z++)p.high(16,8,z,P.stone,'raised-reading-loggia-shade');
 return p.done({
  title:'Miragescript Reading Courtyard',
  signature:'sandstone front open-air reading lightwell, separately end-capped right reading loggia with single west door, protected back-scroll archive beyond full cross partition',
  roofForm:'open low courtyard surrounded by stone light-filtering loggia and separately roofed rear archive',
  rooms:[
   {name:'Open book-display and scribal counter',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:13,z0:1,z1:15}},
   {name:'East enclosed reading loggia',uses:['reading-area'],bounds:{x0:15,x1:19,z0:5,z1:14}},
   {name:'Rear protected scroll archive',uses:['stockroom'],bounds:{x0:1,x1:19,z0:17,z1:21}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'central front entry x10'},
   {from:'sales-floor',to:'reading-area',via:'single physical reading loggia passage x14,z9'},
   {from:'sales-floor',to:'stockroom',via:'rear full-width screen opening x10,z16'}
  ],
  ports:[{type:'internal-doorway',x:14,y:2,z:9,clearHeightCells:3},
   {type:'internal-doorway',x:c,y:2,z:16,clearHeightCells:3}],
  features:['bookshelves','reading-area','sales-floor','service-counter','back-stock','reading courtyard'],
  targets:[{name:'book-gallery',x:c,z:6},{name:'reading',x:16,z:9},{name:'archive',x:c,z:19}],
  voids:[{x0:6,x1:10,z0:7,z1:11}]
 });
}
function snowTemple(){
 const p=architect('temple','snow','medium',29,29,14),c=p.mid;p.shell();
 p.roof(()=>false,P.snowRoof);
 // Twin enclosed nave chambers, independent chapels, three-wide rear altar.
 p.screenZ(10,6,18,[12]);p.screenZ(18,6,18,[12]);
 p.screenX(20,1,27,[c-1,c,c+1]);
 for(const [x,z] of [[4,8],[6,11],[22,8],[24,11]])p.fixture(x,z,P.bench,'chapel-meditation-pew');
 for(const [x,z] of [[3,16],[25,16]])p.fixture(x,z,P.lantern,'sanctuary-winter-lamp','decor');
 for(let z=25;z<=26;z++)for(let x=c-3;x<=c+3;x++)
  p.fixture(x,z,P.stone,'raised-apse-dais');
 p.high(c,3,26,P.altar,'winter-sanctuary-altar','fixture');
 for(const x of [c-3,c+3])
  p.fixture(x,23,P.stair,'symbolic-altar-step','fixture',{shapeRotationStatus:'unresolved-symbolic',intendedFacing:'+z'});
 for(let z=2;z<=26;z++)for(const x of [c-1,c,c+1])p.high(x,8,z,P.snowRoof,'triple-insulated-nave-ridge');
 for(const [x,z] of [[4,4],[24,4]])for(let y=8;y<=11;y++)
  p.high(x,y,z,P.stone,'attached-bell-shaft',y===11?'roof':'wall');
 return p.done({
  variation:2,title:'Frostbell Twin-Nave Monastery',
  signature:'two independently sealed lateral winter chapels linked to a central covered processional nave and triple-entry rear raised sanctuary, plus paired roof-mounted bell shafts and triple snow ridge',
  roofForm:'high triple snow ridge above double side nave chapels with two built-in bell shafts',
  rooms:[
   {name:'Center public ritual nave',uses:['ceremonial-space','public-circulation'],bounds:{x0:11,x1:17,z0:1,z1:19}},
   {name:'West winter chapel',uses:['west-meditation'],bounds:{x0:1,x1:9,z0:6,z1:18}},
   {name:'East winter chapel',uses:['east-meditation'],bounds:{x0:19,x1:27,z0:6,z1:18}},
   {name:'Rear sheltered sanctuary apse',uses:['altar'],bounds:{x0:1,x1:27,z0:21,z1:27}}
  ],
  circulation:[
   {from:'exterior',to:'ceremonial-space',via:'three-high front snow port'},
   {from:'ceremonial-space',to:'public-circulation',via:'sheltered central three-wide aisle'},
   {from:'ceremonial-space',to:'west-meditation',via:'single west chapel door x10,z12'},
   {from:'ceremonial-space',to:'east-meditation',via:'single east chapel door x18,z12'},
   {from:'ceremonial-space',to:'altar',via:'three-wide rear shrine opening x13..15,z20'}
  ],
  ports:[{type:'internal-doorway',x:10,y:2,z:12,clearHeightCells:3},
   {type:'internal-doorway',x:18,y:2,z:12,clearHeightCells:3},
   ...[c-1,c,c+1].map(x=>({type:'internal-doorway',x,y:2,z:20,clearHeightCells:3}))],
  features:['ceremonial-space','altar','public-circulation','two enclosed winter chapels','double bell shafts'],
  targets:[{name:'center-nave',x:c,z:9},{name:'west-chapel',x:5,z:12},
   {name:'east-chapel',x:23,z:12},{name:'altar-approach',x:c,z:22}],
  stairIntents:[{x:c-3,y:2,z:23,shapeRotationStatus:'unresolved-symbolic'},
   {x:c+3,y:2,z:23,shapeRotationStatus:'unresolved-symbolic'}]
 });
}
function stage(p,x0,x1,z0,z1){
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  p.fixture(x,z,P.timber,'raised-stage-floor');
}
function seats(p,xs,zs){
 for(const x of xs)for(const z of zs)p.fixture(x,z,P.bench,'audience-pew');
}
function temperateTheater(){
 const p=architect('theater','temperate','medium',29,27,13),c=p.mid;p.shell();
 // Open-roof summer seating, side vaulted galleries, covered stage/rear.
 p.roof((x,z)=>x>5&&x<23&&z<20,P.roof);
 seats(p,[5,7,9,11,17,19,21,23],[5,8,11]);
 stage(p,8,20,14,18);
 for(const x of [6,22])for(let y=2;y<=6;y++)
  p.put(x,y,13,P.post,'wall',{role:'side-proscenium'});
 for(let x=8;x<=20;x++)for(let z=14;z<=18;z++)
  p.high(x,8,z,P.roof,'taller-covered-stage');
 p.screenX(20,1,27,[5,23]);
 for(const [x,z] of [[3,24],[25,24]])p.fixture(x,z,P.crate,'backstage-stage-scenery');
 p.fixture(c,24,P.table,'backstage-costume-table');
 p.fixture(2,4,P.lantern,'public-aisle-light','decor');
 for(const x of [7,21])p.fixture(x,15,P.stair,'symbolic-stage-stair','fixture',
  {shapeRotationStatus:'unresolved-symbolic',intendedFacing:'stage'});
 return p.done({
  title:'Summerfold Colonnade Theater',
  signature:'large open-air central spectator court with sheltered side-gallery lanes, higher separately roofed proscenium, 13x5 raised stage, two backstage corridors and distinct scenery wings',
  roofForm:'summer courtyard open-sky audience, side vaulted shade, taller stage cover and sheltered backstage',
  rooms:[
   {name:'Amphitheater audience and aisle',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:27,z0:1,z1:13}},
   {name:'Raised covered proscenium',uses:['stage'],bounds:{x0:8,x1:20,z0:14,z1:18}},
   {name:'Separated backstage preparation rooms',uses:['backstage'],bounds:{x0:1,x1:27,z0:21,z1:25}}
  ],
  circulation:[
   {from:'exterior',to:'audience-area',via:'open central public entrance'},
   {from:'audience-area',to:'public-circulation',via:'separate west/east side gallery lanes'},
   {from:'public-circulation',to:'stage',via:'two symbolic stage stair access sites, physical slope pending'},
   {from:'public-circulation',to:'backstage',via:'two opposed doorway approaches x5/x23 at z20'}
  ],
  ports:[{type:'internal-doorway',x:5,y:2,z:20,clearHeightCells:3},
   {type:'internal-doorway',x:23,y:2,z:20,clearHeightCells:3}],
  features:['stage','audience-area','backstage','public-circulation','open-air summer courtyard'],
  targets:[{name:'central audience',x:c,z:7},{name:'west-promenade',x:5,z:16},
   {name:'east-promenade',x:23,z:16},{name:'west backstage',x:5,z:23},{name:'east backstage',x:23,z:23}],
  stairIntents:[{x:7,y:2,z:15,shapeRotationStatus:'unresolved-symbolic'},
   {x:21,y:2,z:15,shapeRotationStatus:'unresolved-symbolic'}],
  voids:[{x0:6,x1:22,z0:1,z1:13}]
 });
}
function forestTheater(){
 const p=architect('theater','enchanted-forest','small',25,25,13),c=p.mid;p.shell();
 // In-the-round canopy stage and four audience wings, not a proscenium hall.
 p.roof((x,z)=>x>=4&&x<=20&&z>=4&&z<=19,P.living);
 seats(p,[5,7,17,19],[5,7,18]);
 for(const x of [9,12,15])p.fixture(x,6,P.bench,'north-arc-seating');
 for(const x of [5,19])for(const z of [11,14])p.fixture(x,z,P.bench,'side-arc-seating');
 stage(p,9,15,10,16);
 for(const x of [8,16])for(const z of [9,17])p.post(x,z,6);
 for(let x=8;x<=16;x++)for(let z=9;z<=17;z++)
  p.high(x,8,z,P.living,'raised-ring-stage-canopy');
 p.screenX(20,1,23,[4,20]);
 for(const [x,z] of [[2,23],[22,23]])p.fixture(x,z,P.crate,'dressing-props');
 p.fixture(c,22,P.table,'stage-dressing-table');
 p.fixture(2,3,P.lantern,'forest-theater-lantern','decor');
 for(const x of [8,16])p.fixture(x,13,P.stair,'symbolic-in-the-round-stage-step','fixture',
  {shapeRotationStatus:'unresolved-symbolic',intendedFacing:'stage'});
 return p.done({
  title:'Ferncircle Intimate Canopy Playhouse',
  signature:'central seven-by-seven raised in-the-round stage, four connected bearing posts and roof canopy, surrounding radial seating banks, two separate side entrances to rear dressing suite',
  roofForm:'small forest theater with elevated leaf-roof stage island and a perimeter of uncovered audience space',
  rooms:[
   {name:'Four-way public spectator ring',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:23,z0:1,z1:19}},
   {name:'Compact circular-performance stage',uses:['stage'],bounds:{x0:9,x1:15,z0:10,z1:16}},
   {name:'Independent two-door dressing suite',uses:['backstage'],bounds:{x0:1,x1:23,z0:21,z1:23}}
  ],
  circulation:[
   {from:'exterior',to:'audience-area',via:'center front audience entry'},
   {from:'audience-area',to:'public-circulation',via:'four-way audience ring around center roof'},
   {from:'public-circulation',to:'stage',via:'two physical symbolic stair-site intentions; no certified slope'},
   {from:'public-circulation',to:'backstage',via:'two real west/east approach doors in rear screen'}
  ],
  ports:[{type:'internal-doorway',x:4,y:2,z:20,clearHeightCells:3},
   {type:'internal-doorway',x:20,y:2,z:20,clearHeightCells:3}],
  features:['stage','audience-area','backstage','public-circulation','in-the-round staging'],
  targets:[{name:'north-audience',x:c,z:5},{name:'west-ring',x:4,z:13},
   {name:'east-ring',x:20,z:13},{name:'west-backstage',x:4,z:22},{name:'east-backstage',x:20,z:22}],
  stairIntents:[{x:8,y:2,z:13,shapeRotationStatus:'unresolved-symbolic'},
   {x:16,y:2,z:13,shapeRotationStatus:'unresolved-symbolic'}],
  voids:[{x0:4,x1:20,z0:4,z1:19}]
 });
}
export const M1_NEW_REGION_ARCHITECTURES=Object.freeze([
 snowMarket(),desertTailor(),snowButcher(),forestJeweler(),
 desertBookshop(),snowTemple(),temperateTheater(),forestTheater()
]);
