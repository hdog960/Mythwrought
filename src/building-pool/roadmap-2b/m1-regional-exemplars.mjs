import {SCHEMA,validateBlueprint} from './schema.mjs';

// Builder 2B / M1: 12 separately authored regional architectural programs.
// These functions expand fully specified physical occupied-coordinate designs.
// No random seed, title-only filler, world placement or production block IDs.
// Shape/yaw/mounting/support and save ABI of individual pack pieces stay unresolved.
const B=Object.freeze({
 stone:'pack1:002',paving:'pack1:005',moss:'pack1:003',
 wall:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snowRoof:'pack3:025',livingRoof:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lantern:'pack4:035',
 crate:'pack4:057',bench:'pack4:058',table:'pack4:059',banner:'pack4:061',
 canopy:'pack4:062',counter:'pack5:086',shelves:'pack5:087',
 stair:'pack1:008'
});
const coords=(x,y,z)=>x+','+y+','+z;
function plan(category,biome,size,W,D){
 const cells=new Map(),center=Math.floor(W/2);
 const p={category,biome,size,W,D,center,cells};
 p.get=(x,y,z)=>cells.get(coords(x,y,z));
 p.put=(x,y,z,material,kind,details={})=>{
  if(![x,y,z].every(Number.isSafeInteger)||x<0||z<0||y<0||x>=W||z>=D||y>=12)
   throw Error(category+' out-of-bounds '+coords(x,y,z));
  const k=coords(x,y,z);
  if(cells.has(k))throw Error(category+' duplicate at '+k);
  cells.set(k,{x,y,z,material,kind,...details});
 };
 p.change=(x,y,z,material,kind,details={})=>{
  const k=coords(x,y,z);
  if(!cells.has(k))throw Error('missing cell for alteration '+k);
  cells.set(k,{x,y,z,material,kind,...details});
 };
 p.remove=(x,y,z)=>{
  if(!cells.delete(coords(x,y,z)))throw Error('missing cell for opening '+coords(x,y,z));
 };
 p.fixed=(x,z,material,role,kind='fixture')=>p.put(x,2,z,material,kind,{role});
 p.window=(x,y,z,material)=>p.change(x,y,z,material,'window');
 p.foundation=()=>{
  for(let x=0;x<W;x++)for(let z=0;z<D;z++){
   p.put(x,0,z,B.stone,'foundation');
   p.put(x,1,z,(x===center||z===Math.floor(D/2))?B.paving:B.wall,'floor');
  }
 };
 p.screenX=(z,from,to,doorXs=[])=>{
  for(let x=from;x<=to;x++)for(let y=2;y<=5;y++)
   if(y>=5||!doorXs.includes(x))p.put(x,y,z,B.beam,'wall',{role:'interior-screen'});
 };
 p.screenZ=(x,from,to,doorZs=[])=>{
  for(let z=from;z<=to;z++)for(let y=2;y<=5;y++)
   if(y>=5||!doorZs.includes(z))p.put(x,y,z,B.beam,'wall',{role:'interior-screen'});
 };
 p.shell=(roofMaterial=B.roof)=>{
  p.foundation();
  for(let x=0;x<W;x++)for(const z of [0,D-1])for(let y=2;y<=6;y++)
   p.put(x,y,z,B.beam,'wall');
  for(let z=1;z<D-1;z++)for(const x of [0,W-1])for(let y=2;y<=6;y++)
   p.put(x,y,z,B.beam,'wall');
  for(let y=2;y<=4;y++)p.remove(center,y,0);
  for(const x of [3,W-4])for(let y=3;y<=4;y++)
   p.window(x,y,0,y===3?B.glass:B.frame);
  for(const x of [0,W-1])for(const z of [5,D-6])
   p.window(x,3,z,B.glass);
  for(let x=0;x<W;x++)for(let z=0;z<D;z++)
   p.put(x,7,z,roofMaterial,'roof');
  // Actual spanning tie-beam rows above 3-cell standing head clearance.
  for(let z=5;z<D-2;z+=6)for(let x=1;x<W-1;x++)
   p.put(x,6,z,B.beam,'wall',{role:'high-level-tie'});
 };
 return p;
}
function finish(p,{title,signature,roof,rooms,circulation,features,extraOpenings=[],targets=[],intentionalVoid=[]}){
 const voxels=[...p.cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const windows=voxels.filter(v=>v.kind==='window').map(v=>({
  type:'window',x:v.x,y:v.y,z:v.z,material:v.material
 }));
 const door={type:'entrance',x:p.center,y:2,z:0,clearHeightCells:3,
  doorSymbol:'pack2:020',doorOpenState:'unverified'};
 const used=new Set(voxels.map(v=>v.material));used.add(door.doorSymbol);
 const blueprint={
  schema:SCHEMA,
  id:'r2:'+p.category+':'+p.biome+':'+p.size+':01',
  category:p.category,biome:p.biome,size:p.size,variation:1,
  title,status:'authored-candidate',isolated:true,worldPlaced:false,
  numericIdsAssigned:false,extents:{x:p.W,y:12,z:p.D},
  units:'integer occupied candidate cells; final physical family AABB/rotation unverified',
  architecturalSignature:signature,
  roof:{form:roof,biomeSpecific:true},
  rooms,circulation,features,
  openings:[door,...windows,...extraOpenings],
  routeTargets:targets,
  intentionallyOpenRoof:intentionalVoid,
  unresolvedDependencies:[...used].sort().map(ref=>({ref,
   issue:'Builder 2B handoff: validate physical variant, true AABB and multicell occupancy, yaw, load bearing, glass collision/transparency, mounting, selection and schema-1 save before integration'})),
  voxels
 };
 validateBlueprint(blueprint);
 return Object.freeze(blueprint);
}
function market({biome,size,W,D,stallRows,signature,title}){
 const p=plan('market-square',biome,size,W,D),c=p.center;
 p.foundation();
 const booths=[];
 for(let row=0;row<stallRows.length;row++){
  const z=stallRows[row];
  for(const [side,x] of [['west',2],['east',W-7]]){
   const label=side+'-row-'+(row+1);
   booths.push({name:label,x:x+2,z:z+1});
   for(const xx of [x,x+4])for(const zz of [z,z+4])for(let y=2;y<=5;y++)
    p.put(xx,y,zz,B.post,'wall',{role:'kiosk-support'});
   for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
    p.put(xx,6,zz,biome==='snow'?B.snowRoof:B.canopy,'roof',{role:'trade-canopy'});
   for(let xx=x+1;xx<=x+3;xx++)for(let y=2;y<=4;y++)
    p.put(xx,y,z+4,B.wall,'wall',{role:'back-screen'});
   for(const xx of [x+1,x+3]){
    p.window(xx,3,z+4,B.glass);p.window(xx,4,z+4,B.frame);
   }
   for(let xx=x+1;xx<=x+3;xx++)
    p.fixed(xx,z+3,B.counter,'merchant-counter');
   for(const xx of [x+1,x+3])p.fixed(xx,z+2,B.shelves,'stall-display');
   p.fixed(x+1,z+1,B.crate,'bulk-stock','decor');
  }
 }
 // Physically joined west/east market entries and distinct shade pavilion.
 for(const xx of [c-3,c+3])for(let y=2;y<=5;y++)
  p.put(xx,y,0,B.beam,'wall',{role:'entry-pier'});
 for(let xx=c-3;xx<=c+3;xx++)
  p.put(xx,6,0,B.roof,'roof',{role:'public-gate-lintel'});
 const zP=D-4;
 for(const xx of [c-4,c+4])for(const zz of [zP-1,zP+1])
  for(let y=2;y<=5;y++)p.put(xx,y,zz,B.beam,'wall',{role:'exchange-pavilion-post'});
 for(let xx=c-4;xx<=c+4;xx++)for(let zz=zP-1;zz<=zP+1;zz++)
  p.put(xx,6,zz,B.roof,'roof',{role:'exchange-pavilion-canopy'});
 for(let xx=c-2;xx<=c+2;xx++)for(let y=2;y<=4;y++)
  p.put(xx,y,zP+1,B.wall,'wall',{role:'market-notice-screen'});
 for(const xx of [c-2,c+2]){
  p.window(xx,3,zP+1,B.glass);
  p.window(xx,4,zP+1,B.frame);
 }
 // Regional architecture: desert wind-stone edge piers vs enclosed snowy
 // wind screens. These are actual occupied cells, not color swaps.
 if(biome==='desert'){
  for(const x of [1,W-2])for(let z=9;z<=13;z++)
   for(let y=2;y<=3;y++)p.put(x,y,z,B.stone,'wall',{role:'sand-wind-baffle'});
  for(const x of [c-2,c,c+2])p.put(x,7,0,B.stone,'decor',{role:'sand-gate-battlement'});
 }else if(biome==='snow'){
  for(const x of [0,W-1])for(let z=10;z<=15;z++)for(let y=2;y<=4;y++)
   p.put(x,y,z,B.beam,'wall',{role:'winter-market-windward-screen'});
  for(const xx of [c-3,c+3])p.put(xx,7,zP,B.snowRoof,'decor',{role:'roof-snowcap'});
 }
 // Distinct physical planters/market markers, never interactive NPCs.
 for(const x of [c-5,c+5])p.fixed(x,2,B.crate,'marker-crate','decor');
 const rooms=[
  {name:'Open market court',uses:['square','public-circulation'],
   bounds:{x0:c-4,x1:c+4,z0:1,z1:D-6}},
  {name:'Independent covered vendor stalls',uses:['vendor-stalls'],
   bounds:{x0:2,x1:W-3,z0:stallRows[0],z1:stallRows.at(-1)+4}},
  {name:'North covered exchange pavilion',uses:['public-circulation'],
   bounds:{x0:c-3,x1:c+3,z0:zP-1,z1:zP}}
 ];
 return finish(p,{title,signature,roof:biome==='snow'?'snow-sheltered independent arcade stalls and separate public pavilion':'wind-baffled open-air caravan exchange with linked roofed kiosks',
  rooms,circulation:[
   {from:'exterior',to:'square',via:'three-high open south center gate'},
   {from:'square',to:'vendor-stalls',via:'each kiosk x+2,z+1 independently walkable'},
   {from:'square',to:'public-circulation',via:'three-cell central north spine and covered exchange'}
  ],
  features:['square','vendor-stalls','public-circulation','real counters and displays','open-to-sky visitor circulation','support-founded kiosk canopies'],
  targets:[{name:'south-gateway',x:c,z:0},{name:'plaza-crossing',x:c,z:Math.floor(D/2)},
   {name:'pavilion',x:c,z:zP},...booths]});
}
const TRADES=[
 {category:'tailor',biome:'enchanted-forest',size:'medium',W:23,D:23,title:'Moonthread Fitting Atelier',
  roof:'livingwood ring ridge with forked south eave',
  signature:'east-side private fitting grove plus west cutting atelier; independent diagonal livingwood roof spires',
  variant:'living-clerestory'},
 {category:'tailor',biome:'mountain',size:'large',W:31,D:27,title:'Highloom Terrace Tailors',
  roof:'two stepped cliffwork roof galleries and a sheltered annex',
  signature:'large western cutting bay, east private fitting suite, vaulted rear annex and terraced mountain roof tiers',
  variant:'cliff-terrace'},
 {category:'butcher',biome:'snow',size:'medium',W:25,D:23,title:'Frostcellar Covered Butchery',
  roof:'deep snow ridge over independent cold cell and raised flue',
  signature:'separate insulated west deep-store and east preparation suite, high snow ridge and winter-entry lintel',
  variant:'snow-flue'},
 {category:'butcher',biome:'desert',size:'large',W:31,D:27,title:'Sunscarp Spice Butcher Hall',
  roof:'desert roof-withdrawn public drying court and shaded rear service annex',
  signature:'sunlit covered butchery forecourt, independent cooling and salting cells, rear sunshade plus actual roof skylight',
  variant:'desert-skylight'},
 {category:'jeweler',biome:'desert',size:'medium',W:23,D:23,title:'Sandglass Gem Exchange',
  roof:'low stepped desert watchparapet with open-light oculus',
  signature:'single guarded workshop threshold, interior-only secure gem vault, skylit public bargaining hall',
  variant:'desert-parapet'},
 {category:'jeweler',biome:'mountain',size:'large',W:31,D:27,title:'Cairncrest Lapidary & Stronghold',
  roof:'offset fortified stone roof dormers and rear structural parapet',
  signature:'long public gemstone gallery, west lapidary bay, sealed east strongroom and high cliffside stone buttresses',
  variant:'cliff-terrace'},
 {category:'bookshop',biome:'mountain',size:'medium',W:23,D:23,title:'Stoneleaf Terrace Scriptorium',
  roof:'monumental split stone cap with high lamp ridge',
  signature:'west high bookshelves, separate enclosed east reading vault, long-spine backstock archive and stone crest roof',
  variant:'stone-ridge'},
 {category:'bookshop',biome:'enchanted-forest',size:'large',W:31,D:27,title:'Glimmerbough Book Conservatory',
  roof:'livingwood skylight reading-conservatory roof with long archive gallery',
  signature:'large glazed public bookstore, private livingwood reading bower and detached rear book conservation chamber',
  variant:'living-clerestory'}
];
function shop(config){
 const {category,biome,size,W,D,variant,title,signature,roof}=config;
 const p=plan(category,biome,size,W,D),c=p.center;
 p.shell(biome==='snow'?B.snowRoof:biome==='enchanted-forest'?B.livingRoof:B.roof);
 const split=Math.floor(D/2),leftDoor=Math.floor(W/3),rightDoor=Math.floor(2*W/3);
 const isJewel=category==='jeweler';
 p.screenX(split,1,W-2,isJewel?[leftDoor]:[leftDoor,rightDoor]);
 const vaultDoor=split+4;
 p.screenZ(c,split+1,D-2,isJewel?[vaultDoor]:[]);
 if(size==='large'){
  const zAnnex=D-6;
  p.screenX(zAnnex,1,c-1,[4]);
 }
 // A supported windowed retail gallery with real fixtures off the public aisle.
 const frontNames={
  tailor:['garment-display','sales-counter'],butcher:['meat-counter','sales-counter'],
  jeweler:['gem-display','sales-counter'],bookshop:['bookcase-stack','sales-counter']
 };
 for(const x of [3,5,W-6,W-4])for(const z of [4,7])
  p.fixed(x,z,category==='butcher'?B.counter:B.shelves,frontNames[category][0]);
 p.fixed(c+2,5,B.counter,frontNames[category][1]);
 const leftName={
  tailor:'cutting-bench',butcher:'insulated-cold-stock',
  jeweler:'lapidary-bench',bookshop:'archive-stock'
 }[category];
 const rightName={
  tailor:'fitting-bench',butcher:'preparation-table',
  jeweler:'vault-plinth',bookshop:'reading-bench'
 }[category];
 for(const x of [3,5])for(const z of [split+3,split+5])
  p.fixed(x,z,(category==='butcher'||category==='bookshop')?B.crate:B.table,leftName);
 for(const x of [W-6,W-4])for(const z of [split+3,split+5])
  p.fixed(x,z,category==='jeweler'?B.stone:category==='butcher'?B.table:B.bench,rightName);
 p.fixed(2,D-3,B.lantern,'rear-room-lantern','decor');
 p.fixed(W-3,3,B.banner,'shop-banner','decor');
 if(size==='large')p.fixed(5,D-3,B.crate,'independent-annex-stock','fixture');
 // Every rooftop ornament is physically seated upon an existing roof cell.
 if(variant==='living-clerestory'){
  for(const x of [3,W-4])for(const z of [3,D-4])for(let y=8;y<=9;y++)
   p.put(x,y,z,B.post,'roof',{role:'grown-root-pier'});
  for(let z=3;z<D-3;z++)p.put(c+3,8,z,B.livingRoof,'roof',{role:'raised-reading-bower'});
 }else if(variant==='cliff-terrace'){
  for(let z=split+2;z<D-2;z++)for(let x=3;x<W-3;x++)
   p.put(x,8,z,B.stone,'roof',{role:'raised-stone-terrace'});
  for(const x of [2,W-3])for(let y=8;y<=10;y++)
   p.put(x,y,D-3,B.stone,'wall',{role:'cliff-buttress'});
 }else if(variant==='snow-flue'){
  for(let z=2;z<D-2;z++)p.put(c,8,z,B.snowRoof,'roof',{role:'insulated-ridge'});
  for(let y=8;y<=10;y++)p.put(W-4,y,D-4,B.stone,'wall',{role:'prepared-meat-flue'});
 }else if(variant==='desert-skylight'||variant==='desert-parapet'){
  for(let z=4;z<=7;z++)for(let x=c-2;x<=c+2;x++)
   p.remove(x,7,z);
  for(const z of [1,D-2])for(let x=1;x<W-1;x+=3)
   p.put(x,8,z,B.stone,'roof',{role:'desert-sunshade-crenel'});
 }else if(variant==='stone-ridge'){
  for(let z=2;z<D-2;z++)for(const x of [c-1,c,c+1])
   p.put(x,8,z,B.stone,'roof',{role:'high-scriptorium-ridge'});
 }
 const leftUse={tailor:'cutting-workspace',butcher:'cold-storage',
  jeweler:'secure-workroom',bookshop:'back-stock'}[category];
 const rightUse={tailor:'fitting-area',butcher:'butcher-workspace',
  jeweler:'vault',bookshop:'reading-area'}[category];
 const primaryUses={
  tailor:['sales-floor','service-counter','garment-display'],
  butcher:['sales-floor','service-counter'],
  jeweler:['sales-floor','service-counter','jewelry-display'],
  bookshop:['sales-floor','service-counter','bookshelves']
 }[category];
 const rooms=[
  {name:'Front commercial gallery',uses:primaryUses,bounds:{x0:1,x1:W-2,z0:1,z1:split-1}},
  {name:'West protected working zone',uses:[leftUse],bounds:{x0:1,x1:c-1,z0:split+1,z1:D-3}},
  {name:'East specialty room',uses:[rightUse],bounds:{x0:c+1,x1:W-2,z0:split+1,z1:D-3}}
 ];
 const circulation=[
  {from:'exterior',to:'sales-floor',via:'center-three-high front aperture'},
  {from:'sales-floor',to:leftUse,via:'three-high west transverse opening'},
  {from:isJewel?leftUse:'sales-floor',to:rightUse,via:isJewel?'controlled interior vault screen':'independent eastern transverse opening'}
 ];
 const extraOpenings=[
  {type:'internal-doorway',x:leftDoor,y:2,z:split,clearHeightCells:3},
  ...(isJewel?[{type:'internal-doorway',x:c,y:2,z:vaultDoor,clearHeightCells:3}]:
   [{type:'internal-doorway',x:rightDoor,y:2,z:split,clearHeightCells:3}])
 ];
 const targets=[
  {name:'retail-gallery',x:c,z:5},
  {name:leftUse,x:leftDoor,z:split+2},
  {name:rightUse,x:rightDoor,z:split+2}
 ];
 if(size==='large'){
  rooms.push({name:'Additional rear service annex',uses:['storage'],
   bounds:{x0:1,x1:c-1,z0:D-5,z1:D-2}});
  circulation.push({from:leftUse,to:'storage',via:'separate roofed annex doorway x4,z'+(D-6)});
  extraOpenings.push({type:'internal-doorway',x:4,y:2,z:D-6,clearHeightCells:3});
  targets.push({name:'rear-annex',x:4,z:D-4});
 }
 return finish(p,{title,signature,roof,rooms,circulation,extraOpenings,targets,
  features:[...primaryUses,leftUse,rightUse,...(size==='large'?['storage']:[]),
   'real window apertures','individually supported roof system',
   ...(isJewel?['single interior-only vault port']:[])]});
}
function theater({biome,size,W,D,title,signature}){
 const p=plan('theater',biome,size,W,D),c=p.center;
 p.shell(biome==='snow'?B.snowRoof:B.livingRoof);
 const stageZ=Math.floor(D/2),half=size==='large'?8:6,backZ=stageZ+7;
 // Distinct regional visual design, not a stretched temperate stage.
 for(const z of [4,7,10])for(const dx of [-8,-6,-4,4,6,8])
  p.fixed(c+dx,z,B.bench,'raked-audience-row');
 for(let x=c-half;x<=c+half;x++)for(let z=stageZ;z<=stageZ+5;z++)
  p.fixed(x,z,B.wall,'raised-stage-platform');
 const approaches=[];
 for(const x of [c-half-1,c+half+1]){
  p.put(x,2,stageZ+1,B.stair,'fixture',{
   role:'stage-stair-candidate',intendedFacing:'stage',
   lowerLanding:{x,y:1,z:stageZ},
   upperLanding:{x:x<c?x+1:x-1,y:2,z:stageZ+1},
   shapeRotationStatus:'unresolved-symbolic'
  });
  approaches.push({name:x<c?'west-stage-lower-landing':'east-stage-lower-landing',x,z:stageZ});
  for(let y=2;y<=5;y++)
   p.put(x,y,stageZ-1,B.post,'wall',{role:'stage-proscenium'});
  // A preexisting y6 roof tie connects the two pylons above 3-high headroom.
 }
 p.screenX(backZ,1,W-2,[3,W-4]);
 for(const x of [3,W-4])p.fixed(x,backZ+2,B.crate,'backstage-crew-storage');
 p.fixed(c,backZ+2,B.table,'costume-preparation-table');
 p.fixed(2,3,B.lantern,'entry-lamp','decor');
 for(let x=c-half;x<=c+half;x++)for(let z=stageZ;z<=stageZ+5;z++)
  p.put(x,8,z,biome==='snow'?B.snowRoof:B.livingRoof,'roof',{role:'elevated-stage-shelter'});
 if(biome==='enchanted-forest'){
  // An actual roof opening makes the glade theater acoustically/visually
  // different from an enclosed winter hall.
  for(let x=c-4;x<=c+4;x++)for(let z=3;z<=11;z++)p.remove(x,7,z);
  for(const x of [2,W-3])for(let y=8;y<=10;y++)
   p.put(x,y,stageZ+3,B.post,'wall',{role:'living-bough-tower'});
 }else{
  for(let z=2;z<D-2;z++)for(const x of [c-2,c+2])
   if(!p.get(x,8,z))
    p.put(x,8,z,B.snowRoof,'roof',{role:'double-insulated-truss'});
  // Do not place a duplicate truss where the separately authored stage canopy
  // already owns the same roof cell; both regions share a single physical roof.
  for(const x of [1,W-2])for(let y=8;y<=9;y++)
   p.put(x,y,backZ+2,B.stone,'wall',{role:'snow-shed-buttress'});
 }
 return finish(p,{
  title,signature,roof:biome==='snow'?'enclosed double ridge over raked audience and fully sheltered stage':'open-audience glade oculus and a raised livingwood stage canopy',
  rooms:[
   {name:'Seat-banked audience chamber',uses:['audience-area','public-circulation'],
    bounds:{x0:1,x1:W-2,z0:1,z1:stageZ-2}},
   {name:'Raised three-dimensional performance stage',uses:['stage'],
    bounds:{x0:c-half,x1:c+half,z0:stageZ,z1:stageZ+5}},
   {name:'Separately entered prop and backstage hall',uses:['backstage'],
    bounds:{x0:1,x1:W-2,z0:backZ+1,z1:D-2}}
  ],circulation:[
   {from:'exterior',to:'audience-area',via:'unblocked three-high central entry'},
   {from:'audience-area',to:'public-circulation',via:'two exterior stage side promenades'},
   {from:'public-circulation',to:'stage',via:'two shape/rotation-unapproved physical stair candidate positions'},
   {from:'public-circulation',to:'backstage',via:'independent twin three-high side doors'}
  ],
  extraOpenings:[
   {type:'internal-doorway',x:3,y:2,z:backZ,clearHeightCells:3},
   {type:'internal-doorway',x:W-4,y:2,z:backZ,clearHeightCells:3}
  ],
  features:['stage','audience-area','backstage','public-circulation','physical elevated stage cells',
   'two independently guarded backstage doors','symbolic stage stair ABI'],
  targets:[{name:'audience-center',x:c,z:5},
   {name:'western-side-promenade',x:3,z:stageZ+1},
   {name:'eastern-side-promenade',x:W-4,z:stageZ+1},
   {name:'western-backstage-access',x:3,z:backZ+1},
   {name:'eastern-backstage-access',x:W-4,z:backZ+1},...approaches],
  intentionalVoid:biome==='enchanted-forest'?[{role:'open-air audience vault',x0:c-4,x1:c+4,z0:3,z1:11,y:7}]:[]
 });
}
export const M1_REGIONAL_EXEMPLARS=Object.freeze([
 market({biome:'desert',size:'medium',W:29,D:27,stallRows:[4,14],
  title:'Suntrail Windbreak Caravan Exchange',
  signature:'four detached desert trading pavilions, dual sandstorm side baffles, broad uncovered processional court and north archive-pavilion'}),
 market({biome:'snow',size:'large',W:35,D:31,stallRows:[4,13,21],
  title:'Frostlane Six-Stall Winter Exchange',
  signature:'six winter kiosk wings with physical insulated wind screens, three separated trade rows and snow-capped communal pavilion'}),
 ...TRADES.map(shop),
 theater({biome:'enchanted-forest',size:'medium',W:29,D:25,
  title:'Whisperroot Living Glade Theater',
  signature:'open-air livingwood ceiling aperture, compact performance platform, paired backstage entrances and two forest-grown stage pylons'}),
 theater({biome:'snow',size:'large',W:35,D:31,
  title:'Whiteharbor Snow-Shed Playhouse',
  signature:'extra-wide raked winter seating banks, sheltered twin-stage wings, two backstage portals, snow-buttressed high insulated roof'})
]);
