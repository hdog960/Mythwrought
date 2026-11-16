import {SCHEMA,validateBlueprint} from './schema.mjs';

// Eight ADDITIONAL independently authored regional gallery architectures.
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


function mountainMarket(){
 const p=architect('market-square','mountain','medium',35,35),c=p.center;p.base();
 const stalls=[
  booth(p,2,6,'cliff-ore',B.tile),booth(p,28,6,'cliff-wool',B.tile),
  booth(p,2,24,'mountain-provisions',B.tile),booth(p,28,24,'mineral-trader',B.tile),
  booth(p,13,27,'ridge-scribe',B.tile)];
 for(const x of [c-7,c+7])for(const z of [11,22])p.post(x,z,5,B.rock);
 for(let z=11;z<=22;z++)for(const x of [c-7,c+7])
  p.elevated(x,6,z,B.tile,'long-supported-cliff-gallery');
 for(const [x,z] of [[10,11],[24,11],[10,22],[24,22]])
  for(let y=7;y<=9;y++)p.elevated(x,y,z,B.rock,'four-raised-cliff-beacons',y===9?'roof':'wall');
 for(const x of [0,34])for(let z=8;z<=26;z++)for(let y=2;y<=3;y++)
  p.put(x,y,z,B.rock,'wall',{role:'cliff-windbreak'});
 p.furniture(16,19,B.light,'public-cliff-marker','decor');
 return p.end({title:'Switchback Five-Trade Terrace',
 signature:'five separate mountain trade kiosks and two parallel stone cliff galleries with four high overlook corners and windbreaks; not a symmetric public ring',
 roofForm:'detached five vendor roofs, parallel vaulted stone gallery strips and taller overlook beacons',
 rooms:[{name:'Mountain civic passage',uses:['square','public-circulation']},
  {name:'Five independent cliff vendors',uses:['vendor-stalls']},
  {name:'Opposite sheltered overlooks',uses:['public-circulation']}],
 edges:[{from:'exterior',to:'square',via:'open central mountain entrance'},
  {from:'square',to:'vendor-stalls',via:'five separate trader fronts'},
  {from:'square',to:'public-circulation',via:'open between two sheltered linear arcades'}],
 features:['square','vendor-stalls','public-circulation','windbreaks','stone galleries'],
 targets:[{name:'center passage',x:c,z:16},{name:'north approach',x:c,z:25},...stalls]});
}
function winterMarket(){
 const p=architect('market-square','snow','medium',37,35),c=p.center;p.base();
 const stalls=[booth(p,2,5,'west-fish',B.snow),booth(p,30,5,'east-wool',B.snow),
  booth(p,2,25,'west-coal',B.snow),booth(p,30,25,'east-winterwear',B.snow)];
 for(const x of [c-4,c+4])for(const z of [12,20])p.post(x,z);
 for(let x=c-4;x<=c+4;x++)for(let z=12;z<=20;z++)
  p.elevated(x,6,z,B.snow,'detached-public-warming-pavilion');
 for(const [x,z] of [[16,15],[20,15],[16,19],[20,19]])
  p.furniture(x,z,B.bench,'warming-shelter-seat');
 for(const x of [c-6,c+6])p.post(x,1);
 for(let x=c-6;x<=c+6;x++)p.elevated(x,6,1,B.snow,'winter-gateway-lintel');
 p.furniture(12,30,B.light,'winter-market-beacon','decor');
 return p.end({title:'Four-Winds Winter Trade Lodge',
 signature:'four outward separated snow stall roofs plus independent nine-by-nine warming hall and front gateway, a cross-axis unlike the snow T bazaar',
 roofForm:'four individual snow trade shelters, separately roofed central warming lodge and entry lintel',
 rooms:[{name:'Open winter crossroads',uses:['square','public-circulation']},
  {name:'Four complete winter vendor pockets',uses:['vendor-stalls']},
  {name:'Warm public lounge and entry arcade',uses:['public-circulation']}],
 edges:[{from:'exterior',to:'square',via:'entrance under winter lintel'},
  {from:'square',to:'vendor-stalls',via:'independent physical vendor approaches'},
  {from:'square',to:'public-circulation',via:'open public lounge pavilion'}],
 features:['square','vendor-stalls','public-circulation','warming benches'],
 targets:[{name:'crossroads',x:c,z:9},{name:'warming pavilion',x:c,z:18},...stalls]});
}
function gladeTailor(){
 const p=architect('tailor','enchanted-forest','medium',33,35),c=p.center;p.shell();
 p.roof((x,z)=>x>=12&&x<=20&&z>=7&&z<=16,B.leaves);
 p.along(8,6,25,[13]);p.along(24,6,25,[19]);
 for(const z of [5,26]){p.across(z,1,7);p.across(z,25,31);}
 p.across(27,1,31,[c]);
 for(const [x,z] of [[12,4],[21,4],[13,19],[20,20]])
  p.furniture(x,z,B.display,'glade-trade-display');
 p.furniture(17,24,B.counter,'tailoring-counter');
 for(const [x,z] of [[3,12],[5,17],[27,15],[29,20]])
  p.furniture(x,z,B.bench,'fitting-seat');
 for(const [x,z] of [[11,29],[16,30],[21,30]])p.furniture(x,z,B.table,'rear-pattern-work');
 p.furniture(29,31,B.crate,'silk-stock','decor');
 for(let x=12;x<=20;x++)for(const z of [6,17])
  p.elevated(x,8,z,B.leaves,'sunlit-leaf-arch');
 return p.end({title:'Twinstitch Glade Atelier',variation:2,
 signature:'opposed west/east private fitting wings around a tall open retail garden, independent rear embroidery room and two upper crosswise leaf roofs',
 roofForm:'large rectangular sky-lit forest showroom with east-west leaf lintels and private side roofs',
 rooms:[{name:'Central garment showroom',uses:['sales-floor','service-counter','garment-display']},
  {name:'West enclosed fitting garden',uses:['fitting-area']},
  {name:'East second fitting hall',uses:['second-fitting']},
  {name:'Rear embroidery studio',uses:['cutting-area']}],
 edges:[{from:'exterior',to:'sales-floor',via:'main public garden entry'},
  {from:'sales-floor',to:'fitting-area',via:'west door x8,z13'},
  {from:'sales-floor',to:'second-fitting',via:'east door x24,z19'},
  {from:'sales-floor',to:'cutting-area',via:'rear portal x16,z27'}],
 doors:[[8,13],[24,19],[c,27]],
 features:['sales-floor','service-counter','garment-display','fitting-area','second-fitting','cutting-area'],
 targets:[{name:'retail',x:c,z:12},{name:'west fitting',x:5,z:13},
  {name:'east fitting',x:28,z:19},{name:'rear embroidery',x:17,z:31}],
 voids:[{x0:12,x1:20,z0:7,z1:16}]});
}
function orchardButcher(){
 const p=architect('butcher','temperate','medium',35,31),c=p.center;p.shell();
 p.roof((x,z)=>x>=14&&x<=20&&z>=5&&z<=10);
 p.across(13,1,33,[6,17,28]);
 p.along(12,14,29,[21]);p.along(23,14,29,[21]);
 for(const [x,z] of [[5,5],[8,8],[26,5],[29,8]])
  p.furniture(x,z,B.counter,'public-provisions-counter');
 for(const [x,z] of [[3,17],[5,24],[9,27]])p.furniture(x,z,B.crate,'cold-larder-stores');
 for(const [x,z] of [[16,17],[19,24]])p.furniture(x,z,B.table,'butcher-clean-workbench');
 for(const [x,z] of [[27,17],[29,25]])p.furniture(x,z,B.table,'herb-curing-workbench');
 p.furniture(32,26,B.light,'hygienic-lamp','decor');
 for(let z=16;z<=27;z++)p.elevated(28,8,z,B.tile,'raised-temperate-curing-ridge');
 return p.end({title:'Orchard Three-Chamber Provisions',
 signature:'front lightwell public market and three independent rear workroom bays linked by two cross-transfer doors and an asymmetric raised eastern curing roof',
 roofForm:'central customer lightwell with a long one-sided smoking ridge',
 rooms:[{name:'Public provisions counter',uses:['sales-floor','service-counter']},
  {name:'West cold meat larder',uses:['cold-storage']},
  {name:'Center clean cutting floor',uses:['butcher-workspace']},
  {name:'Eastern curing room',uses:['curing-area']}],
 edges:[{from:'exterior',to:'sales-floor',via:'open shop entry'},
  {from:'sales-floor',to:'cold-storage',via:'west rear gate'},
  {from:'sales-floor',to:'butcher-workspace',via:'central rear gate'},
  {from:'sales-floor',to:'curing-area',via:'east rear gate'}],
 doors:[[6,13],[17,13],[28,13],[12,21],[23,21]],
 features:['sales-floor','service-counter','cold-storage','butcher-workspace','curing-area'],
 targets:[{name:'market counter',x:c,z:7},{name:'cold larder',x:6,z:21},
  {name:'prep floor',x:17,z:21},{name:'curing floor',x:28,z:21}],
 voids:[{x0:14,x1:20,z0:5,z1:10}]});
}
function jewelerSnow(){
 const p=architect('jeweler','snow','medium',33,35),c=p.center;p.shell();
 p.roof(()=>false,B.snow);
 p.across(3,1,31,[c]);p.across(16,1,31,[9]);p.along(21,17,33,[24]);
 for(const [x,z] of [[4,7],[7,11],[26,7],[28,12]])
  p.furniture(x,z,B.display,'frost-crystal-display');
 p.furniture(16,14,B.counter,'gem-sales-counter');
 for(const [x,z] of [[4,21],[9,28],[15,24]])p.furniture(x,z,B.table,'heated-gem-craft');
 for(const [x,z] of [[25,20],[28,27]])p.furniture(x,z,B.rock,'vault-secure-plinth');
 p.furniture(29,31,B.crate,'vault-gem-case','decor');
 for(let z=5;z<=29;z++)for(let x=c-2;x<=c+2;x++)
  p.elevated(x,8,z,B.snow,'wide-butterfly-winter-roof');
 for(let z=7;z<=27;z++)p.elevated(c,9,z,B.snow,'high-winter-ridge');
 return p.end({title:'Frostcut Double-Secure Gemhouse',
 signature:'insulated double-gate public gem showroom, one controlled craft workshop and sequentially secured eastern inner vault under broad raised twin snow ridges',
 roofForm:'five-cell wide winter double ridgeline and high center snow cap',
 rooms:[{name:'Insulated gem retail room',uses:['sales-floor','service-counter','jewelry-display']},
  {name:'Rear heated artisan workshop',uses:['secure-workroom']},
  {name:'Sequential security vault',uses:['vault']}],
 edges:[{from:'exterior',to:'sales-floor',via:'winter vestibule x16,z3'},
  {from:'sales-floor',to:'secure-workroom',via:'rear craft door x9,z16'},
  {from:'secure-workroom',to:'vault',via:'only vault door x21,z24'}],
 doors:[[c,3],[9,16],[21,24]],
 features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault'],
 targets:[{name:'showroom',x:c,z:9},{name:'workshop',x:10,z:24},{name:'vault',x:26,z:24}]});
}
function forestBooks(){
 const p=architect('bookshop','enchanted-forest','medium',35,37),c=p.center;p.shell();
 p.roof((x,z)=>x>=13&&x<=21&&z>=9&&z<=20,B.leaves);
 p.along(9,6,26,[13]);p.along(25,6,26,[19]);
 for(const z of [5,27]){p.across(z,1,8);p.across(z,26,33);}
 p.across(29,1,33,[c]);
 for(const [x,z] of [[12,5],[20,5],[13,15],[20,16],[15,23]])
  p.furniture(x,z,B.display,'public-bookshelf');
 p.furniture(18,26,B.counter,'bookseller-desk');
 for(const [x,z] of [[3,12],[5,22],[29,12],[31,23]])
  p.furniture(x,z,B.bench,'quiet-reading-bench');
 for(const [x,z] of [[13,31],[17,33],[21,32]])
  p.furniture(x,z,B.crate,'dry-scroll-stock');
 p.furniture(28,32,B.light,'scribe-lamp','decor');
 for(let x=13;x<=21;x++)for(const z of [8,21])
  p.elevated(x,8,z,B.leaves,'cloister-arch-top');
 return p.end({title:'Mossbound Twin Cloister Library',
 signature:'two opposite single-door book reading galleries at different offsets from a large open sky paper atrium, bounded rear manuscript archive and raised leaf cloister arches',
 roofForm:'large forest atrium open sky with raised paired cross roofs, enclosed side and rear stocks',
 rooms:[{name:'Main forest book atrium',uses:['sales-floor','service-counter','bookshelves']},
  {name:'Left quiet reading cloister',uses:['reading-area']},
  {name:'East independent reading hall',uses:['second-reading']},
  {name:'Protected rear stock archive',uses:['stockroom']}],
 edges:[{from:'exterior',to:'sales-floor',via:'forest public entry'},
  {from:'sales-floor',to:'reading-area',via:'west x9,z13'},
  {from:'sales-floor',to:'second-reading',via:'east x25,z19'},
  {from:'sales-floor',to:'stockroom',via:'rear x17,z29'}],
 doors:[[9,13],[25,19],[c,29]],
 features:['sales-floor','service-counter','bookshelves','reading-area','second-reading','stockroom'],
 targets:[{name:'shelf court',x:c,z:14},{name:'west reading',x:5,z:13},
  {name:'east reading',x:30,z:19},{name:'book stock',x:18,z:33}],
 voids:[{x0:13,x1:21,z0:9,z1:20}]});
}
function templeGarden(){
 const p=architect('temple','temperate','large',45,43),c=p.center;p.shell();
 p.roof((x,z)=>x>=16&&x<=28&&z>=10&&z<=25,B.tile);
 p.along(11,8,29,[17]);p.along(33,8,29,[21]);
 for(const z of [7,30]){p.across(z,1,10);p.across(z,34,43);}
 p.across(33,1,43,[c-1,c,c+1]);
 for(const [x,z] of [[3,12],[6,23],[38,12],[41,23]])
  p.furniture(x,z,B.bench,'quiet-prayer-seat');
 p.furniture(4,27,B.light,'west-votive','decor');
 p.furniture(40,27,B.light,'east-votive','decor');
 for(let x=c-5;x<=c+5;x++)for(const z of [38,39])
  p.furniture(x,z,B.rock,'altar-stone-platform');
 p.elevated(c,3,39,B.altar,'grand-garden-altar','fixture');
 for(const x of [c-5,c+5])p.furniture(x,36,B.stair,'symbolic-sanctuary-step','fixture',{shapeRotationStatus:'unresolved-symbolic'});
 for(const x of [4,40])for(const z of [4,36]){
  p.post(x,z,6);
  for(let y=8;y<=12;y++)p.elevated(x,y,z,B.rock,'grounded-four-bell-tower',y===12?'roof':'wall');
 }
 for(let z=12;z<=28;z++)for(const x of [14,30])
  p.elevated(x,8,z,B.tile,'raised-side-cloister-roof');
 return p.end({title:'Four-Bell Garden Cloister',variation:2,
 signature:'central thirteen-wide open-air prayer garden between individually closed side chapels, triple-entry rear altar and four ground-to-belfry corner towers with separate side roofs',
 roofForm:'wide open central garden flanked by raised side colonnades and four belfry towers',
 rooms:[{name:'Sky-lit main pilgrimage courtyard',uses:['ceremonial-space','public-circulation']},
  {name:'Western enclosed chantry',uses:['west-meditation']},
  {name:'Eastern cloister prayer hall',uses:['east-meditation']},
  {name:'Great rear ceremonial apse',uses:['altar']}],
 edges:[{from:'exterior',to:'ceremonial-space',via:'front processional entry'},
  {from:'ceremonial-space',to:'public-circulation',via:'central garden path'},
  {from:'ceremonial-space',to:'west-meditation',via:'west x11,z17 chapel door'},
  {from:'ceremonial-space',to:'east-meditation',via:'east x33,z21 chapel door'},
  {from:'ceremonial-space',to:'altar',via:'rear triple x21..23,z33'}],
 doors:[[11,17],[33,21],[c-1,33],[c,33],[c+1,33]],
 features:['ceremonial-space','altar','public-circulation','sky-garden','belfries'],
 targets:[{name:'main garden',x:c,z:18},{name:'west chapel',x:5,z:17},
  {name:'east chapel',x:39,z:21},{name:'altar route',x:c,z:36}],
 stairs:[{x:c-5,y:2,z:36,shapeRotationStatus:'unresolved-symbolic'},
  {x:c+5,y:2,z:36,shapeRotationStatus:'unresolved-symbolic'}],
 voids:[{x0:16,x1:28,z0:10,z1:25}]});
}
function sunAmphitheater(){
 const p=architect('theater','desert','large',45,41),c=p.center;p.shell();
 p.roof((x,z)=>x>=5&&x<=39&&z>=3&&z<=28,B.tile);
 for(const x of [5,7,9,11,13,15,29,31,33,35,37,39])
  for(const z of [7,10,13,16,19])p.furniture(x,z,B.bench,'desert-audience-bank');
 for(const x of [3,41])for(const z of [5,15,25])p.post(x,z,5);
 for(const x of [3,41])for(let z=5;z<=25;z++)
  p.elevated(x,6,z,B.rock,'twin-shaded-gallery');
 for(let x=16;x<=28;x++)for(let z=25;z<=30;z++)
  p.furniture(x,z,B.wood,'raised-stage-floor');
 for(const x of [15,29])for(const z of [24,31]){
  p.post(x,z,6);
  if(z===24)p.elevated(x,7,z,B.rock,'grounded-stage-post','wall');
  p.elevated(x,8,z,B.rock,'stage-proscenium-post','wall');
 }
 for(let x=15;x<=29;x++)for(let z=24;z<=31;z++)
  p.elevated(x,9,z,B.tile,'stage-crescent-canopy');
 for(let x=18;x<=26;x++)for(let z=26;z<=29;z++)
  p.elevated(x,10,z,B.tile,'upper-desert-proscenium');
 p.across(34,1,43,[8,36]);
 for(const [x,z] of [[4,37],[40,37]])p.furniture(x,z,B.crate,'backstage-props','decor');
 p.furniture(c,37,B.table,'rear-costume-work');
 for(const x of [15,29])p.furniture(x,26,B.stair,'symbolic-stage-ramp','fixture',{shapeRotationStatus:'unresolved-symbolic'});
 p.furniture(2,10,B.light,'public-gallery-lantern','decor');
 return p.end({title:'Sundial Open-Air Grand Theater',
 signature:'fully open desert audience sightline enclosed by two physically separate shaded side promenades, thirteen-by-six raised stage and tiered stage-sunshade with two rear costume room ports',
 roofForm:'uncovered central audience and low side shade galleries, tall upper two-tier stage canopy',
 rooms:[{name:'Open-sky spectator house',uses:['audience-area','public-circulation']},
  {name:'Raised covered desert stage',uses:['stage']},
  {name:'Protected two-door costume warehouse',uses:['backstage']}],
 edges:[{from:'exterior',to:'audience-area',via:'main open public entry'},
  {from:'audience-area',to:'public-circulation',via:'two long independent side promenades'},
  {from:'public-circulation',to:'stage',via:'two symbolic physical Pack1 stairs; slope unresolved'},
  {from:'public-circulation',to:'backstage',via:'side rear x8/x36,z34 ports'}],
 doors:[[8,34],[36,34]],
 features:['stage','audience-area','backstage','public-circulation','two stone galleries'],
 targets:[{name:'audience',x:c,z:14},{name:'west promenade',x:8,z:28},
  {name:'east promenade',x:36,z:28},{name:'west backstage',x:8,z:37},
  {name:'east backstage',x:36,z:37}],
 stairs:[{x:15,y:2,z:26,shapeRotationStatus:'unresolved-symbolic'},
  {x:29,y:2,z:26,shapeRotationStatus:'unresolved-symbolic'}],
 voids:[{x0:5,x1:39,z0:3,z1:23}]});
}
export const M1_REGIONAL_GALLERIES=Object.freeze([
 mountainMarket(),winterMarket(),gladeTailor(),orchardButcher(),
 jewelerSnow(),forestBooks(),templeGarden(),sunAmphitheater()
]);