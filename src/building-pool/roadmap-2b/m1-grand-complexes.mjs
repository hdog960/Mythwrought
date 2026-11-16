import {SCHEMA,validateBlueprint} from './schema.mjs';
// Eight independent large source-authored architecture plans. Not game placement.
const M={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',living:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',box:'pack4:057',
 bench:'pack4:058',table:'pack4:059',canopy:'pack4:062',counter:'pack5:086',
 display:'pack5:087',altar:'pack5:093'};
function site(category,biome,size,W,D,H=15){
 const v=new Map(),mid=Math.floor(W/2),k=(x,y,z)=>x+','+y+','+z;
 const put=(x,y,z,material,kind,extra={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=W||y<0||y>=H||z<0||z>=D||v.has(k(x,y,z)))
   throw Error(category+' collision or bounds '+k(x,y,z));
  v.set(k(x,y,z),{x,y,z,material,kind,...extra});
 };
 const replace=(x,y,z,material,kind,extra={})=>{
  if(!v.has(k(x,y,z)))throw Error(category+' missing physical '+k(x,y,z));
  v.set(k(x,y,z),{x,y,z,material,kind,...extra});
 };
 const remove=(x,y,z)=>{if(!v.delete(k(x,y,z)))throw Error(category+' missing erased '+k(x,y,z));};
 const ground=()=>{for(let x=0;x<W;x++)for(let z=0;z<D;z++){
  put(x,0,z,M.stone,'foundation');put(x,1,z,x===mid?M.path:M.wood,'floor');
 }};
 const shell=()=>{ground();
  for(let x=0;x<W;x++)for(const z of [0,D-1])for(let y=2;y<=6;y++)put(x,y,z,M.beam,'wall');
  for(let z=1;z<D-1;z++)for(const x of [0,W-1])for(let y=2;y<=6;y++)put(x,y,z,M.beam,'wall');
  for(let y=2;y<=4;y++)remove(mid,y,0);
  for(const x of [4,W-5])for(const y of [3,4])
   replace(x,y,0,y===3?M.glass:M.frame,'window');
  for(const x of [0,W-1])for(const z of [6,D-7])replace(x,3,z,M.glass,'window');
 };
 const cross=(z,a,b,holes=[])=>{for(let x=a;x<=b;x++)for(let y=2;y<=5;y++)
  if(y===5||!holes.includes(x))put(x,y,z,M.beam,'wall',{role:'privacy-screen'});};
 const lateral=(x,a,b,holes=[])=>{for(let z=a;z<=b;z++)for(let y=2;y<=5;y++)
  if(y===5||!holes.includes(z))put(x,y,z,M.beam,'wall',{role:'privacy-screen'});};
 const roof=(omit=()=>false,material=M.roof)=>{for(let x=0;x<W;x++)for(let z=0;z<D;z++)
  if(!omit(x,z))put(x,7,z,material,'roof');};
 const post=(x,z,top=5)=>{for(let y=2;y<=top;y++)put(x,y,z,M.post,'wall',{role:'bearing-post'});};
 const f=(x,z,material,role,kind='fixture',extra={})=>put(x,2,z,material,kind,{role,...extra});
 const upper=(x,y,z,material,role,kind='roof')=>put(x,y,z,material,kind,{role});
 const finish=({title,variation=1,signature,roofForm,rooms,connections,features,doors=[],targets=[],voids=[],stairs=[]})=>{
  const voxels=[...v.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const windows=voxels.filter(t=>t.kind==='window').map(o=>({type:'window',x:o.x,y:o.y,z:o.z,material:o.material}));
  const syms=[...new Set([...voxels.map(t=>t.material),'pack2:020'])].sort();
  const bp={schema:SCHEMA,id:'r2:'+category+':'+biome+':'+size+':'+String(variation).padStart(2,'0'),
   category,biome,size,variation,title,status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   extents:{x:W,y:H,z:D},architecturalSignature:signature,roof:{form:roofForm,biomeSpecific:true},
   units:'integer source geometry only; physical producer shape/collision/save ABI not accepted',
   rooms,circulation:connections,features,
   openings:[{type:'entrance',x:mid,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'},
    ...windows,...doors.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))],
   routeTargets:targets,intentionallyOpenRoof:voids,symbolicStairApproaches:stairs,
   unresolvedDependencies:syms.map(ref=>({ref,issue:'Confirm physical source variant/yaw, AABBs, occupied offsets, support, collision, selection, glazing and schema-1 before integration'})),
   voxels};validateBlueprint(bp);return Object.freeze(bp);
 };
 return {W,D,mid,v,put,replace,remove,ground,shell,cross,lateral,roof,post,f,upper,finish};
}
function stall(p,x,z,label,roof=M.canopy){
 for(const xx of [x,x+4])for(const zz of [z,z+4])p.post(xx,zz,5);
 for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)p.upper(xx,6,zz,roof,label+'-trade-roof');
 for(let xx=x+1;xx<=x+3;xx++)for(let y=2;y<=4;y++)p.put(xx,y,z+4,M.wood,'wall',{role:label+'-rear-screen'});
 for(const xx of [x+1,x+3]){
  p.replace(xx,3,z+4,M.glass,'window');p.replace(xx,4,z+4,M.frame,'window');
 }
 for(let xx=x+1;xx<=x+3;xx++)p.f(xx,z+3,M.counter,label+'-trade-counter');
 p.f(x+1,z+2,M.display,label+'-goods');
 p.f(x+3,z+2,M.box,label+'-stock','decor');
 return {name:label,x:x+2,z:z+1};
}
function sevenCourtMarket(){
 const p=site('market-square','temperate','large',41,39),c=p.mid;p.ground();
 const stalls=[
  stall(p,2,4,'west-vegetables'),stall(p,34,4,'east-timber'),
  stall(p,2,14,'west-textiles'),stall(p,34,14,'east-crafts'),
  stall(p,2,24,'west-herbs'),stall(p,34,24,'east-spices'),
  stall(p,17,32,'north-trader')];
 for(const x of [c-7,c+7])for(const z of [10,18,26])p.post(x,z,5);
 for(let x=c-7;x<=c+7;x++)for(const z of [10,26])p.upper(x,6,z,M.roof,'civic-portico-crossbeam');
 for(let z=11;z<26;z++)for(const x of [c-7,c+7])p.upper(x,6,z,M.roof,'civic-portico-longbeam');
 for(const x of [c-3,c-2])for(const z of [17,18])p.f(x,z,M.stone,'public-water-arch');
 p.f(11,34,M.lamp,'public-marker','decor');
 return p.finish({title:'Seven Courts Civic Exchange',
  signature:'seven separate detached 5x5 seller booths orbit a six-column long civic arcade, off-axis public well and center-to-north open street; never a scaled small market',
  roofForm:'seven independent seller roofs and an elongated six-bearing civic portico around open sky',
  rooms:[
   {name:'Open civic procession',uses:['square','public-circulation'],bounds:{x0:10,x1:30,z0:1,z1:37}},
   {name:'Seven distinct seller pavilions',uses:['vendor-stalls'],bounds:{x0:2,x1:38,z0:4,z1:36}},
   {name:'Long roofed public portico',uses:['public-circulation'],bounds:{x0:14,x1:26,z0:11,z1:25}}],
  connections:[{from:'exterior',to:'square',via:'southern unrestricted entrance'},
   {from:'square',to:'vendor-stalls',via:'seven physically distinct trader approaches'},
   {from:'square',to:'public-circulation',via:'long perimeter passage around off-axis public well'}],
  features:['square','vendor-stalls','public-circulation','seven private roofs','public basin'],
  targets:[{name:'center crossing',x:c,z:15},{name:'north route',x:c,z:28},...stalls]});
}
function sunCaravanMarket(){
 const p=site('market-square','desert','large',43,37),c=p.mid;p.ground();
 const stalls=[
  stall(p,2,4,'west-salt',M.roof),stall(p,36,4,'east-textiles',M.roof),
  stall(p,2,25,'west-grain',M.roof),stall(p,36,25,'east-pottery',M.roof),
  stall(p,12,30,'north-scrolls',M.roof),stall(p,26,30,'north-metals',M.roof)];
 // Distinct non-ring sun galleries joined at 4 supported beacon turrets.
 for(const x of [c-9,c+9])for(const z of [9,21])p.post(x,z,5);
 for(let z=9;z<=21;z++)for(const x of [c-9,c+9])p.upper(x,6,z,M.roof,'parallel-sun-shade');
 for(const x of [c-9,c+9])for(const z of [9,21]){
  for(let y=7;y<=10;y++)p.upper(x,y,z,M.stone,'beacon-turret','wall');
  p.upper(x,11,z,M.roof,'turret-cap');
 }
 for(const [x,z] of [[16,14],[26,14],[16,18],[26,18]])p.f(x,z,M.bench,'sun-market-seat');
 p.f(20,22,M.lamp,'caravan-lamp','decor');
 return p.finish({title:'Caravan Six-Wing Sun Exchange',
  signature:'six independent trading bungalows around an open desert caravan gathering court with two straight parallel side-shade galleries and four distinct high sun towers',
  roofForm:'six isolated flat seller roofs, open court and two detached shaded north-south galleries with beacon caps',
  rooms:[
   {name:'Caravan arrival court',uses:['square','public-circulation'],bounds:{x0:14,x1:28,z0:1,z1:29}},
   {name:'Six caravan seller wings',uses:['vendor-stalls'],bounds:{x0:2,x1:40,z0:4,z1:34}},
   {name:'Two opposite side shade colonnades',uses:['public-circulation'],bounds:{x0:12,x1:30,z0:9,z1:21}}],
  connections:[{from:'exterior',to:'square',via:'open broad central desert court'},
   {from:'square',to:'vendor-stalls',via:'six independently approached sellers'},
   {from:'square',to:'public-circulation',via:'open way between parallel weather shade walls'}],
  features:['square','vendor-stalls','public-circulation','six detached stalls','four sun turrets'],
  targets:[{name:'sun gathering',x:c,z:17},{name:'western shaded path',x:c-7,z:16},
   {name:'eastern shaded path',x:c+7,z:16},...stalls]});
}
function greatDuneTailor(){
 const p=site('tailor','desert','large',35,35),c=p.mid;p.shell();
 p.roof((x,z)=>x>=14&&x<=21&&z>=8&&z<=14);
 p.lateral(10,5,24,[9,19]);
 for(const z of [5,15,24])p.cross(z,1,9);
 p.cross(26,1,33,[c]);
 for(const [x,z] of [[13,5],[25,5],[14,10],[27,10],[14,18],[26,20]])p.f(x,z,M.display,'fabric-gallery');
 p.f(19,23,M.counter,'great-atelier-counter');
 for(const [x,z] of [[3,9],[6,12],[3,19],[6,21]])p.f(x,z,M.bench,'ceremonial-fitting-bench');
 for(const [x,z] of [[4,29],[9,30],[14,31],[22,30],[29,29]])p.f(x,z,M.table,'linen-loom-station');
 p.f(31,32,M.box,'loom-fabric-crate','decor');
 for(const [x,z] of [[13,7],[23,7],[13,15],[23,15]])p.upper(x,8,z,M.stone,'sun-fin');
 return p.finish({title:'Duneweave Grand Atelier',
  signature:'two independently bounded west fitting salons, giant rear production loom room, front grand showroom and separate eight-cell open sun-finned cloth courtyard',
  roofForm:'desert weaving lightwell at front, sheltered extensive rear craft workshop',
  rooms:[
   {name:'Public fabric trade',uses:['sales-floor','service-counter','garment-display'],bounds:{x0:11,x1:33,z0:1,z1:25}},
   {name:'First private fitting salon',uses:['fitting-area'],bounds:{x0:1,x1:9,z0:6,z1:14}},
   {name:'Second independent fitting salon',uses:['second-fitting'],bounds:{x0:1,x1:9,z0:16,z1:23}},
   {name:'Rear full-size loom factory',uses:['cutting-area'],bounds:{x0:1,x1:33,z0:27,z1:33}}],
  connections:[{from:'exterior',to:'sales-floor',via:'front public cloth hall'},
   {from:'sales-floor',to:'fitting-area',via:'only x10,z9 fitting entry'},
   {from:'sales-floor',to:'second-fitting',via:'only x10,z19 second salon entry'},
   {from:'sales-floor',to:'cutting-area',via:'rear x17,z26 industrial work access'}],
  features:['sales-floor','service-counter','garment-display','fitting-area','second-fitting','cutting-area'],
  doors:[[10,9],[10,19],[c,26]],
  targets:[{name:'trade',x:c,z:12},{name:'salon1',x:5,z:9},
   {name:'salon2',x:5,z:19},{name:'looms',x:c,z:30}],
  voids:[{x0:14,x1:21,z0:8,z1:14}]});
}
function iceThreeHallButcher(){
 const p=site('butcher','snow','large',37,33),c=p.mid;p.shell();p.roof(()=>false,M.snow);
 p.cross(4,1,35,[c]);p.cross(13,1,35,[7,18,29]);
 p.lateral(12,14,31,[23]);p.lateral(24,14,31,[23]);
 for(const [x,z] of [[5,7],[8,7],[27,7],[30,7]])p.f(x,z,M.counter,'winter-meat-shop-counter');
 for(const [x,z] of [[3,17],[6,20],[9,27]])p.f(x,z,M.box,'ice-cellar-stock');
 for(const [x,z] of [[16,17],[19,20],[16,27]])p.f(x,z,M.table,'hygienic-prep-counter');
 for(const [x,z] of [[28,17],[32,20]])p.f(x,z,M.table,'curing-workbench');
 p.f(33,28,M.box,'smoked-stock','decor');
 for(let y=8;y<=12;y++)p.upper(32,y,25,M.stone,'full-height-smoke-flue',y===12?'roof':'wall');
 for(let z=4;z<=29;z++)p.upper(c,8,z,M.snow,'snow-shelter-ridge');
 return p.finish({title:'Icevault Three-Hall Butchery',
  signature:'double-vestibule public winter shop with three separate rear wings for ice preservation, hygienic prep and smoke curing, each with independent service entrance and tall smoke flue',
  roofForm:'snow-proof multi-bay roof with central long ridge and eastern full-height chimney',
  rooms:[
   {name:'Front covered winter market',uses:['sales-floor','service-counter'],bounds:{x0:1,x1:35,z0:1,z1:12}},
   {name:'Left isolated ice pantry',uses:['cold-storage'],bounds:{x0:1,x1:11,z0:14,z1:31}},
   {name:'Center sanitary cutting floor',uses:['butcher-workspace'],bounds:{x0:13,x1:23,z0:14,z1:31}},
   {name:'Right smoke cure department',uses:['smoke-room'],bounds:{x0:25,x1:35,z0:14,z1:31}}],
  connections:[{from:'exterior',to:'sales-floor',via:'thermal front x18,z4 gate'},
   {from:'sales-floor',to:'cold-storage',via:'west rear x7,z13 entrance'},
   {from:'sales-floor',to:'butcher-workspace',via:'central rear x18,z13 entrance'},
   {from:'sales-floor',to:'smoke-room',via:'east rear x29,z13 entrance'}],
  features:['sales-floor','service-counter','butcher-workspace','cold-storage','smoke-room'],
  doors:[[c,4],[7,13],[18,13],[29,13],[12,23],[24,23]],
  targets:[{name:'public',x:c,z:8},{name:'cold room',x:7,z:20},
   {name:'prep',x:18,z:20},{name:'smoker',x:29,z:20}]});
}
function everwoodGemVault(){
 const p=site('jeweler','enchanted-forest','large',37,35),c=p.mid;p.shell();
 p.roof((x,z)=>x>=14&&x<=22&&z>=6&&z<=13,M.living);
 p.cross(15,1,35,[9]);p.lateral(23,16,33,[25]);
 for(const [x,z] of [[4,5],[8,8],[27,5],[30,10],[18,6]])p.f(x,z,M.display,'crystal-showroom');
 p.f(17,12,M.counter,'gem-auction-counter');
 for(const [x,z] of [[4,20],[8,25],[13,29],[19,21]])p.f(x,z,M.table,'lapidary-craftstation');
 for(const [x,z] of [[27,19],[31,25]])p.f(x,z,M.stone,'inner-vault-plinth');
 p.f(33,31,M.box,'locked-gem-cache','decor');
 p.f(3,30,M.lamp,'craft-work-lantern','decor');
 for(const x of [24,35])for(const z of [17,31]){
  p.upper(x,8,z,M.post,'upper-vault-wood-bearing','wall');
  p.upper(x,9,z,M.post,'upper-vault-wood-bearing','wall');
 }
 for(let x=24;x<=35;x++)for(let z=17;z<=31;z++)
  p.upper(x,10,z,M.living,'sheltered-vault-bower');
 return p.finish({title:'Evershade Grand Gem Archive',
  signature:'vast skylit public gem courtyard plus large west atelier, single sequential access to a separate eastern vault with four tall supported livingwood canopy posts',
  roofForm:'open northern light court, separately roofed raised right-side root-vault bower',
  rooms:[
   {name:'Enchanted public gem bower',uses:['sales-floor','service-counter','jewelry-display'],bounds:{x0:1,x1:35,z0:1,z1:14}},
   {name:'Restricted artisan gem factory',uses:['secure-workroom'],bounds:{x0:1,x1:22,z0:16,z1:33}},
   {name:'Controlled massive root-vault',uses:['vault'],bounds:{x0:24,x1:35,z0:16,z1:33}}],
  connections:[{from:'exterior',to:'sales-floor',via:'public central bower entry'},
   {from:'sales-floor',to:'secure-workroom',via:'single rear x9,z15 workroom port'},
   {from:'secure-workroom',to:'vault',via:'only eastern x23,z25 inner vault door'}],
  features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault'],
  doors:[[9,15],[23,25]],targets:[{name:'gem showroom',x:c,z:9},
   {name:'lapidary',x:12,z:24},{name:'vault',x:29,z:25}],
  voids:[{x0:14,x1:22,z0:6,z1:13}]});
}
function mountainGrandBooks(){
 const p=site('bookshop','mountain','large',39,35),c=p.mid;p.shell();p.roof(()=>false,M.stone);
 p.lateral(29,6,24,[15]);for(const z of [6,24])p.cross(z,30,37);
 p.cross(27,1,37,[c]);
 for(const x of [3,6,9,13,17,23])for(const z of [6,10,16,21])
  p.f(x,z,M.display,'cliff-literature-stack');
 p.f(20,25,M.counter,'cliff-ledger-counter');
 for(const [x,z] of [[32,9],[34,18]])p.f(x,z,M.bench,'panorama-reading-seat');
 for(const [x,z] of [[4,29],[8,31],[15,31],[30,31]])p.f(x,z,M.box,'sealed-parchment-cache');
 p.f(35,31,M.lamp,'archive-lamp','decor');
 for(const x of [4,34])for(const z of [3,30]){
  p.upper(x,8,z,M.stone,'integral-tower');
  p.upper(x,9,z,M.stone,'integral-tower');
  p.upper(x,10,z,M.roof,'tower-cap');
 }
 for(let z=4;z<=29;z++)p.upper(c,8,z,M.stone,'central-library-ridge');
 return p.finish({title:'Cliffscript Great Bookvault',
  signature:'six-longitudinal-bay giant archive library, one-door full-length east view gallery, rear physically sealed parchment stockroom and four roof-integral mountain reading towers',
  roofForm:'strong mountain roof with four crowned bookvault towers and full-length central ridge',
  rooms:[
   {name:'Six-bank book arcade',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:28,z0:1,z1:26}},
   {name:'Separate east panorama reader',uses:['reading-area'],bounds:{x0:30,x1:37,z0:7,z1:23}},
   {name:'Rear secure parchment archive',uses:['stockroom'],bounds:{x0:1,x1:37,z0:28,z1:33}}],
  connections:[{from:'exterior',to:'sales-floor',via:'front public book promenade'},
   {from:'sales-floor',to:'reading-area',via:'only x29,z15 quiet gallery entrance'},
   {from:'sales-floor',to:'stockroom',via:'rear x19,z27 stockroom passage'}],
  features:['sales-floor','service-counter','bookshelves','reading-area','stockroom'],
  doors:[[29,15],[c,27]],targets:[{name:'books',x:c,z:15},
   {name:'readers',x:33,z:15},{name:'archive',x:c,z:30}]});
}
function sunGrandTemple(){
 const p=site('temple','desert','large',41,39),c=p.mid;p.shell();
 p.roof((x,z)=>x>=15&&x<=25&&z>=9&&z<=22,M.stone);
 p.lateral(11,8,23,[15]);p.lateral(29,8,23,[15]);
 for(const z of [7,24]){p.cross(z,1,10);p.cross(z,30,39);}
 p.cross(28,1,39,[c-1,c,c+1]);
 for(const [x,z] of [[4,11],[6,18],[34,11],[36,18]])p.f(x,z,M.bench,'side-chantry-pew');
 p.f(5,22,M.lamp,'west-worship-light','decor');
 p.f(35,22,M.lamp,'east-worship-light','decor');
 for(const z of [34,35])for(let x=c-5;x<=c+5;x++)p.f(x,z,M.stone,'sun-altar-terrace');
 p.upper(c,3,35,M.altar,'sun-citadel-altar','fixture');
 for(const x of [c-5,c+5])p.f(x,31,M.stair,'symbolic-altar-step','fixture',
  {shapeRotationStatus:'unresolved-symbolic'});
 for(const [x,z] of [[3,3],[37,3],[3,32],[37,32]]){
  p.upper(x,8,z,M.stone,'tall-sun-tower','wall');
  p.upper(x,9,z,M.stone,'tall-sun-tower','wall');
  p.upper(x,10,z,M.roof,'sun-tower-cap');
 }
 return p.finish({title:'Four-Dunes Grand Sanctuary',variation:2,
  signature:'eleven-wide open sacred prayer court, two completely end-capped side pilgrim chantries, triple rear access to grand raised altar and four separated sun towers',
  roofForm:'wide open sanctuary skycourt framed by heavy desert side roofs and four tall sun crowns',
  rooms:[
   {name:'Central open prayer processional',uses:['ceremonial-space','public-circulation'],bounds:{x0:12,x1:28,z0:1,z1:27}},
   {name:'Western enclosed pilgrim chantry',uses:['west-meditation'],bounds:{x0:1,x1:10,z0:8,z1:23}},
   {name:'Eastern enclosed pilgrim chantry',uses:['east-meditation'],bounds:{x0:30,x1:39,z0:8,z1:23}},
   {name:'Rear giant solar altar apse',uses:['altar'],bounds:{x0:1,x1:39,z0:29,z1:37}}],
  connections:[{from:'exterior',to:'ceremonial-space',via:'public front prayer court'},
   {from:'ceremonial-space',to:'public-circulation',via:'open eleven-wide main court'},
   {from:'ceremonial-space',to:'west-meditation',via:'western x11,z15 chapel passage'},
   {from:'ceremonial-space',to:'east-meditation',via:'eastern x29,z15 chapel passage'},
   {from:'ceremonial-space',to:'altar',via:'rear triple sanctuary x19..21,z28'}],
  features:['ceremonial-space','altar','public-circulation','two private pilgrimage chapels'],
  doors:[[11,15],[29,15],[c-1,28],[c,28],[c+1,28]],
  targets:[{name:'main prayer court',x:c,z:14},{name:'west chantry',x:6,z:15},
   {name:'east chantry',x:35,z:15},{name:'altar',x:c,z:32}],
  stairs:[{x:c-5,y:2,z:31,shapeRotationStatus:'unresolved-symbolic'},
   {x:c+5,y:2,z:31,shapeRotationStatus:'unresolved-symbolic'}],
  voids:[{x0:15,x1:25,z0:9,z1:22}]});
}
function kingfisherGrandTheater(){
 const p=site('theater','temperate','large',43,39),c=p.mid;p.shell();p.roof(()=>false,M.roof);
 for(const x of [4,6,8,10,13,15,27,30,32,34,36,38])
  for(const z of [6,9,12,15,18])p.f(x,z,M.bench,'audience-rank');
 for(let x=14;x<=28;x++)for(let z=23;z<=29;z++)p.f(x,z,M.wood,'raised-stage-floor');
 // Four supported flytower corners are attached to the y7 roof. No doubled
 // roof-beam cells: perimeter y9 spans omit their previously placed corners.
 for(const x of [13,29])for(const z of [23,29]){
  // A continuous load-bearing post runs from walking floor through y7 roof.
  p.post(x,z,6);
  p.upper(x,8,z,M.post,'flytower-bearing','wall');
  p.upper(x,9,z,M.post,'flytower-bearing','wall');
 }
 for(let x=14;x<=28;x++)for(const z of [23,29])p.upper(x,9,z,M.beam,'flytower-eave-beam');
 for(let z=24;z<=28;z++)for(const x of [13,29])p.upper(x,9,z,M.beam,'flytower-eave-beam');
 for(let x=13;x<=29;x++)for(let z=23;z<=29;z++)p.upper(x,10,z,M.roof,'upper-flytower-roof');
 p.cross(32,1,41,[8,34]);
 for(const [x,z] of [[3,35],[39,35]])p.f(x,z,M.box,'stage-scenery-cache','decor');
 p.f(c,35,M.table,'costume-preparation-table');
 for(const x of [13,29])p.f(x,25,M.stair,'symbolic-stage-step','fixture',{shapeRotationStatus:'unresolved-symbolic'});
 p.f(2,5,M.lamp,'public-sightline-lamp','decor');
 return p.finish({title:'Kingfisher Grand Playhouse',
  signature:'wide twelve-bank spectator seating across large floorplan, fifteen-by-seven raised stage, separately supported overhead flytower, side promenades and physically walled two-door rear costume atelier',
  roofForm:'weather-sealed grand temperate theater with elevated seventeen-by-seven stage flytower enclosure',
  rooms:[
   {name:'Grand spectator auditorium',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:41,z0:1,z1:22}},
   {name:'Major raised proscenium stage',uses:['stage'],bounds:{x0:14,x1:28,z0:23,z1:29}},
   {name:'Wide backstage costume and scenery store',uses:['backstage'],bounds:{x0:1,x1:41,z0:33,z1:37}}],
  connections:[{from:'exterior',to:'audience-area',via:'central front spectator gate'},
   {from:'audience-area',to:'public-circulation',via:'continuous east and west stage-side aisles'},
   {from:'public-circulation',to:'stage',via:'two physically symbolic side stairs, actual height collision still unapproved'},
   {from:'public-circulation',to:'backstage',via:'two real rear x8/x34,z32 doors'}],
  features:['stage','audience-area','backstage','public-circulation','stage flytower'],
  doors:[[8,32],[34,32]],
  targets:[{name:'audience',x:c,z:12},{name:'west promenade',x:8,z:27},
   {name:'east promenade',x:34,z:27},{name:'west backstage',x:8,z:35},
   {name:'east backstage',x:34,z:35}],
  stairs:[{x:13,y:2,z:25,shapeRotationStatus:'unresolved-symbolic'},
   {x:29,y:2,z:25,shapeRotationStatus:'unresolved-symbolic'}]});
}
export const M1_GRAND_COMPLEXES=Object.freeze([
 sevenCourtMarket(),sunCaravanMarket(),greatDuneTailor(),iceThreeHallButcher(),
 everwoodGemVault(),mountainGrandBooks(),sunGrandTemple(),kingfisherGrandTheater()
]);
