import {SCHEMA,validateBlueprint} from './schema.mjs';

// Five genuinely different M1 coordinate-authored commercial/cultural layouts.
// Every coordinate is deterministic, owned by Builder 2B and never sent to runtime.
const M={
 stone:'pack1:002',paving:'pack1:005',wood:'pack2:013',beam:'pack2:015',
 roof:'pack3:023',roofSnow:'pack3:025',glass:'pack4:030',frame:'pack4:032',
 lantern:'pack4:035',crate:'pack4:057',bench:'pack4:058',table:'pack4:059',
 banner:'pack4:061',counter:'pack5:086',display:'pack5:087',stair:'pack1:008'
};
function hall(category,width,depth,biome='temperate'){
 const cells=new Map(),center=Math.floor(width/2),k=(x,y,z)=>x+','+y+','+z;
 const inside=(x,y,z)=>Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(z)&&
   x>=0&&x<width&&y>=0&&y<12&&z>=0&&z<depth;
 function put(x,y,z,material,kind,detail){
   if(!inside(x,y,z))throw Error('out-of-bounds '+category+' '+k(x,y,z));
   if(cells.has(k(x,y,z)))throw Error('overlapping cell '+category+' '+k(x,y,z));
   cells.set(k(x,y,z),{x,y,z,material,kind,...(detail||{})});
 }
 function change(x,y,z,material,kind,detail){
   if(!cells.has(k(x,y,z)))throw Error('cannot replace missing voxel');
   cells.set(k(x,y,z),{x,y,z,material,kind,...(detail||{})});
 }
 function erase(x,y,z){if(!cells.delete(k(x,y,z)))throw Error('door not in physical wall');}
 function wallX(z,x0,x1,doors=[]){
   for(let x=x0;x<=x1;x++)for(let y=2;y<=5;y++)
     if(!doors.includes(x)||y===5)put(x,y,z,M.beam,'wall');
 }
 function wallZ(x,z0,z1,doors=[]){
   for(let z=z0;z<=z1;z++)for(let y=2;y<=5;y++)
     if(!doors.includes(z)||y===5)put(x,y,z,M.beam,'wall');
 }
 function furnishing(x,z,material,role,kind='fixture',extra){
   put(x,2,z,material,kind,{role,...(extra||{})});
 }
 function roofOrnament(x,z,material=M.beam,role='ridge'){
   put(x,8,z,material,'roof',{role});
 }
 for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
   put(x,0,z,M.stone,'foundation');
   put(x,1,z,x===center?M.paving:M.wood,'floor');
 }
 for(let x=0;x<width;x++)for(const z of [0,depth-1])for(let y=2;y<=6;y++)
   put(x,y,z,M.beam,'wall');
 for(let z=1;z<depth-1;z++)for(const x of [0,width-1])for(let y=2;y<=6;y++)
   put(x,y,z,M.beam,'wall');
 for(let y=2;y<=4;y++)erase(center,y,0);
 for(const x of [3,width-4])for(const y of [3,4])
   change(x,y,0,y===3?M.glass:M.frame,'window');
 for(const z of [5,depth-6])for(const x of [0,width-1])
   change(x,3,z,M.glass,'window');
 for(let x=0;x<width;x++)for(let z=0;z<depth;z++)
   put(x,7,z,biome==='snow'?M.roofSnow:M.roof,'roof');
 const api={category,width,depth,center,cells,put,change,erase,wallX,wallZ,furnishing,roofOrnament,
   k,loc:(x,y,z)=>cells.get(k(x,y,z))};
 return api;
}
function finish(api,{title,biome='temperate',size='small',rooms,circulation,features,targets,signature,openings=[],roof}){
 const voxels=[...api.cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const windows=voxels.filter(v=>v.kind==='window').map(({x,y,z,material})=>({type:'window',x,y,z,material}));
 const symbols=[...new Set(voxels.map(v=>v.material))].sort();
 const bp={
   schema:SCHEMA,id:'r2:'+api.category+':'+biome+':'+size+':01',
   category:api.category,biome,size,variation:1,title,
   status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   units:'coordinate-authored physical voxel candidate; asset shape/collision/save ABI requires integration',
   extents:{x:api.width,y:12,z:api.depth},
   architecturalSignature:signature,roof:{form:roof,biomeSpecific:true},
   rooms,circulation,features,
   openings:[{type:'entrance',x:api.center,y:2,z:0,clearHeightCells:3,
     doorSymbol:'pack2:020',doorOpenState:'unverified'},...windows,...openings],
   routeTargets:targets,
   unresolvedDependencies:[...new Set([...symbols,'pack2:020'])].sort().map(ref=>({
     ref,issue:'Physical family shape, variant, orientation, support, glazing, mounting, selection, collision and schema-1 save are unresolved for this conceptual cell use'})),
   voxels
 };
 validateBlueprint(bp);
 return Object.freeze(bp);
}
function tailor(){
 const a=hall('tailor',19,19),c=a.center;
 // Long central showroom, privately screened east-side fitting suite, separate
 // rear cutting room. Real three-high service doors, not graph-only divisions.
 a.wallZ(13,4,9,[7]);
 a.wallX(3,14,17);
 a.wallX(10,14,17);
 a.wallX(11,1,17,[c]);
 for(const [x,z] of [[3,4],[6,4],[3,7],[6,7]])a.furnishing(x,z,M.display,'garment-display');
 for(const [x,z] of [[11,5],[11,8]])a.furnishing(x,z,M.counter,'sales-counter');
 for(const [x,z] of [[15,5],[16,8]])a.furnishing(x,z,M.bench,'fitting-bench');
 for(const [x,z] of [[4,14],[6,14],[5,16]])a.furnishing(x,z,M.table,'cutting-table');
 a.furnishing(15,15,M.crate,'fabric-stock','decor');
 a.furnishing(2,16,M.lantern,'rear-lantern','decor');
 for(let z=2;z<=16;z++)a.roofOrnament(c,z,M.roof,'sewing-hall-pitched-ridge');
 return finish(a,{title:'Larkspur Tailor & Pattern House',signature:'front retail gallery, enclosed lateral three-cell fitting suite, transverse rear cutting workshop and raised longitudinal gable',
   roof:'narrow steep sewing-hall gable with long central ridge',
   rooms:[
    {name:'Garment display and client counter',uses:['sales-floor','service-counter','garment-display'],bounds:{x0:1,x1:12,z0:1,z1:10}},
    {name:'Enclosed east fitting suite',uses:['fitting-area'],bounds:{x0:14,x1:17,z0:4,z1:9}},
    {name:'Rear cutting and pattern workshop',uses:['cutting-area'],bounds:{x0:1,x1:17,z0:12,z1:17}}
   ],
   circulation:[
    {from:'exterior',to:'sales-floor',via:'open front center x9, three-high'},
    {from:'sales-floor',to:'fitting-area',via:'screen opening x13,z7'},
    {from:'sales-floor',to:'cutting-area',via:'transverse passage x9,z11'}
   ],features:['fitting-area','cutting-area','tailoring benches','separate workshop'],
   openings:[{type:'internal-doorway',x:13,y:2,z:7,clearHeightCells:3},
     {type:'internal-doorway',x:c,y:2,z:11,clearHeightCells:3}],
   targets:[{name:'sales',x:9,z:5},{name:'fitting',x:15,z:7},{name:'cutting',x:9,z:14}]});
}
function butcher(){
 const a=hall('butcher',21,19),c=a.center;
 // Separate physically enclosed cold room to west and preparation to east.
 a.wallX(9,1,19,[5,15]);
 a.wallZ(10,10,17,[14]);
 for(const [x,z] of [[4,4],[6,4],[14,4],[16,4]])
   a.furnishing(x,z,M.counter,'display-counter');
 for(const [x,z] of [[3,12],[3,15],[6,16]])a.furnishing(x,z,M.crate,'insulated-cold-stock','fixture');
 for(const [x,z] of [[13,12],[16,12],[13,15]])
   a.furnishing(x,z,M.table,'butcher-preparation-table');
 a.furnishing(18,16,M.crate,'service-packing','decor');
 a.furnishing(8,3,M.lantern,'shop-lantern','decor');
 // Ventilation hood above rear preparation zone, with physical supported roof.
 for(let x=12;x<=18;x++)for(let z=11;z<=16;z++)a.roofOrnament(x,z,M.roof,'rear-hood');
 return finish(a,{title:'Stonefield Covered Butcher Hall',signature:'wide front counter hall, transverse double service gates, two separately partitioned rear cold-and-prep workrooms, offset ventilation hood',
   roof:'stepped rear preparation hood over low front shop roof',
   rooms:[
    {name:'Covered retail and weighing room',uses:['sales-floor','service-counter'],bounds:{x0:1,x1:19,z0:1,z1:8}},
    {name:'West enclosed cold-storage chamber',uses:['cold-storage'],bounds:{x0:1,x1:9,z0:10,z1:17}},
    {name:'East wash and preparation room',uses:['butcher-workspace'],bounds:{x0:11,x1:19,z0:10,z1:17}}
   ],circulation:[
    {from:'exterior',to:'sales-floor',via:'clear front center entrance'},
    {from:'sales-floor',to:'cold-storage',via:'western rear access at x5,z9'},
    {from:'sales-floor',to:'butcher-workspace',via:'eastern rear access at x15,z9'}
   ],features:['butcher-workspace','cold-storage','separate cold-store partition','worktables and service counters'],
   openings:[{type:'internal-doorway',x:5,y:2,z:9,clearHeightCells:3},
     {type:'internal-doorway',x:15,y:2,z:9,clearHeightCells:3},
     {type:'internal-doorway',x:10,y:2,z:14,clearHeightCells:3}],
   targets:[{name:'retail',x:10,z:5},{name:'cold',x:5,z:12},{name:'prep',x:15,z:12}]});
}
function jeweler(){
 const a=hall('jeweler',19,20),c=a.center;
 // Front showroom has one monitored access to a rear workroom, with a
 // separately sealed side vault accessible only from the workroom.
 a.wallX(10,1,17,[7]);
 a.wallZ(10,11,18,[14]);
 a.wallX(11,11,17);
 a.wallX(18,11,17);
 for(const [x,z] of [[3,4],[5,7],[14,4],[16,7]])
   a.furnishing(x,z,M.display,'glass-jewelry-display');
 a.furnishing(11,6,M.counter,'showroom-counter');
 for(const [x,z] of [[3,13],[6,14]])a.furnishing(x,z,M.table,'jewelry-workbench');
 a.furnishing(14,15,M.crate,'secured-case');
 a.furnishing(16,17,M.stone||M.stone,'vault-plinth','decor');
 a.furnishing(2,17,M.lantern,'workshop-lantern','decor');
 // Roof-top watch lantern on vaulted side chamber, not just recolored gable.
 for(let x=11;x<=17;x++)for(let z=12;z<=17;z++)a.roofOrnament(x,z,M.beam,'secured-roof-tile');
 return finish(a,{title:'Gildspire Jeweler & Strongroom',signature:'public jewel display at front, one controlled rear workroom access, inward-facing vault screen with single transfer door and raised fortified rear roof',
   roof:'low showroom roof with raised secure-vault canopy',
   rooms:[
    {name:'Public glazed jewel display room',uses:['sales-floor','service-counter','jewelry-display'],bounds:{x0:1,x1:17,z0:1,z1:9}},
    {name:'Secured jeweler workroom',uses:['secure-workroom'],bounds:{x0:1,x1:9,z0:11,z1:18}},
    {name:'Enclosed strongroom vault',uses:['vault'],bounds:{x0:11,x1:17,z0:12,z1:17}}
   ],circulation:[
    {from:'exterior',to:'sales-floor',via:'front center public entry'},
    {from:'sales-floor',to:'secure-workroom',via:'single workshop access x7,z10'},
    {from:'secure-workroom',to:'vault',via:'interior-only secure transfer at x10,z14'}
   ],features:['jewelry-display','secure-workroom','vault','protected rear access','partitioned strongroom'],
   openings:[{type:'internal-doorway',x:7,y:2,z:10,clearHeightCells:3},
     {type:'internal-doorway',x:10,y:2,z:14,clearHeightCells:3}],
   targets:[{name:'showroom',x:9,z:5},{name:'workroom',x:7,z:13},{name:'vault',x:13,z:14}]});
}
function bookshop(){
 const a=hall('bookshop',19,21),c=a.center;
 // Reading annex has capped ends so its registered entrance is real.
 // Backstock is enclosed behind a separate full-span wall.
 a.wallZ(13,4,12,[8]);
 a.wallX(3,14,17);
 a.wallX(13,14,17);
 a.wallX(15,1,17,[c]);
 for(const [x,z] of [[3,4],[3,7],[3,10],[6,4],[6,7],[6,10],[11,4],[11,11]])
   a.furnishing(x,z,M.display,'library-shelf');
 for(const [x,z] of [[15,5],[16,10]])
   a.furnishing(x,z,M.bench,'reading-bench');
 a.furnishing(8,12,M.counter,'bookseller-counter');
 for(const [x,z] of [[3,17],[6,18],[14,18]])
   a.furnishing(x,z,M.crate,'backstock-box');
 a.furnishing(2,17,M.lantern,'backroom-lamp','decor');
 for(let z=4;z<=12;z++)a.roofOrnament(15,z,M.roof,'reading-annex-clerestory');
 return finish(a,{title:'Elmword Bookshop & Reading Nook',signature:'west wall stacks with free central browsing aisle, enclosed east reading annex with capped north/south ends, cross-wall rear book archive and clerestory',
   roof:'east-side raised clerestory over quiet reading annex',
   rooms:[
    {name:'Front shelves and bookseller desk',uses:['sales-floor','service-counter','bookshelves'],bounds:{x0:1,x1:12,z0:1,z1:14}},
    {name:'Screened reading annex',uses:['reading-area'],bounds:{x0:14,x1:17,z0:4,z1:12}},
    {name:'Rear book-box storeroom',uses:['stockroom'],bounds:{x0:1,x1:17,z0:16,z1:19}}
   ],circulation:[
    {from:'exterior',to:'sales-floor',via:'central front opening x9'},
    {from:'sales-floor',to:'reading-area',via:'single annex door x13,z8'},
    {from:'sales-floor',to:'stockroom',via:'rear aisle to central door x9,z15'}
   ],features:['bookshelves','reading-area','backstock','clerestory','screened quiet reading'],
   openings:[{type:'internal-doorway',x:13,y:2,z:8,clearHeightCells:3},
     {type:'internal-doorway',x:c,y:2,z:15,clearHeightCells:3}],
   targets:[{name:'browse',x:9,z:6},{name:'reading',x:15,z:8},{name:'stockroom',x:9,z:17}]});
}
function theater(){
 const a=hall('theater',27,25),c=a.center;
 // Raked seating is *not* claimed physically implemented: two accessible
 // seating banks surround a three-cell center aisle and open side promenades.
 for(const z of [4,7,10])for(const x of [7,9,11,15,17,19])
   a.furnishing(x,z,M.bench,'audience-row');
 // Solid raised stage and two symbolic approach steps; headroom remains y3..6.
 for(let x=7;x<=19;x++)for(let z=13;z<=18;z++)
   a.furnishing(x,z,M.wood,'raised-stage-platform');
 for(const x of [6,20])a.furnishing(x,14,M.stair,'symbolic-stage-step','fixture',
   {intendedFacing:'stage',shapeRotationStatus:'unresolved-symbolic'});
 // Two physically solid proscenium posts, attached to wall-level public floor.
 for(const x of [6,20])for(let y=2;y<=6;y++)a.put(x,y,12,M.beam,'wall',{role:'proscenium-post'});
 a.wallX(19,1,25,[5,21]);
 for(const [x,z] of [[4,22],[22,22]])a.furnishing(x,z,M.crate,'prop-store');
 a.furnishing(13,22,M.table,'backstage-costume-table');
 a.furnishing(3,5,M.lantern,'house-lantern','decor');
 for(let x=6;x<=20;x++)for(let z=12;z<=18;z++)
   a.roofOrnament(x,z,M.roof,'elevated-stage-cover');
 return finish(a,{title:'Thornsong Proscenium Playhouse',signature:'wide horseshoe-like spectator hall with two bench banks, continuous three-cell center aisle, side stage promenades, genuinely raised 13-by-6 stage and enclosed two-door backstage',
   roof:'raised stage-cover ridge above lower audience hall and proscenium pair',
   rooms:[
    {name:'Open audience hall',uses:['audience-area','public-circulation'],bounds:{x0:1,x1:25,z0:1,z1:12}},
    {name:'Raised performance stage',uses:['stage'],bounds:{x0:7,x1:19,z0:13,z1:18}},
    {name:'Two-wing enclosed backstage',uses:['backstage'],bounds:{x0:1,x1:25,z0:20,z1:23}}
   ],circulation:[
    {from:'exterior',to:'audience-area',via:'front box-office opening, center aisle'},
    {from:'audience-area',to:'public-circulation',via:'both stage-side walkable promenades'},
    {from:'public-circulation',to:'stage',via:'two symbolic stair candidates x6/20,z14; physical slope/collision remains unapproved'},
    {from:'public-circulation',to:'backstage',via:'west/east fully open access cells x5/21,z19'}
   ],features:['stage','audience-area','backstage','public-circulation','stage-step-symbolic-ABI','separate prop storage'],
   openings:[{type:'internal-doorway',x:5,y:2,z:19,clearHeightCells:3},
     {type:'internal-doorway',x:21,y:2,z:19,clearHeightCells:3}],
   targets:[{name:'audience-center',x:13,z:6},{name:'western-promenade',x:5,z:16},{name:'eastern-promenade',x:21,z:16},
     {name:'backstage-west',x:5,z:21},{name:'backstage-east',x:21,z:21}]});
}
export const TRADE_CULTURE_M1_EXEMPLARS=Object.freeze([
 tailor(),butcher(),jeweler(),bookshop(),theater()
]);
