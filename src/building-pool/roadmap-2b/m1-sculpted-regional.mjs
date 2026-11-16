import {SCHEMA,validateBlueprint} from './schema.mjs';

// Six independent coordinate-authored architectural spatial programs.
// All carve away ACTUAL foundation/floor outside joined, specified plan bands;
// neither random seeds nor palette-swapped rectangular templates are allowed.
const A={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',leaf:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',
 crate:'pack4:057',seat:'pack4:058',table:'pack4:059',
 counter:'pack5:086',display:'pack5:087',altar:'pack5:093'};
const DESIGNS=[
{category:'tailor',biome:'snow',size:'large',variation:1,title:'Frostweave Three-Hearth Hall',
 w:47,d:45,h:15,plan:[[0,46,0,15],[0,12,16,44],[20,34,16,31],[35,46,16,44]],entry:[23,0],
 sky:[[18,28,4,9]],
 partitions:[['z',16,1,11,[6]],['z',16,21,33,[26]],['z',16,36,45,[41]]],
 furnishing:[[4,4,'display','fur-cloaks'],[11,10,'display','felt-capes'],[29,4,'display','snow-linens'],[40,10,'display','winter-coats'],[23,12,'counter','retail-cloth-desk'],[5,23,'seat','private-fur-fitting'],[9,36,'seat','north-fur-fitting'],[25,23,'table','central-weaving-loom'],[30,27,'table','pattern-bench'],[39,23,'table','dye-and-felt-room'],[43,36,'crate','dry-wool-storage','decor']],
 mass:[[2,11,19,43,8,'snow','long-west-private-wing'],[5,7,22,40,9,'snow','west-vented-gable'],[22,33,19,30,8,'wood','central-independent-loom-hall'],[26,28,21,28,9,'snow','central-short-ridge'],[36,45,19,43,8,'snow','east-long-dyework-roof'],[40,42,22,40,9,'snow','east-twin-crest'],[41,41,24,36,10,'snow','high-east-drying-spine'],[2,11,2,6,8,'snow','short-west-facade-portico']],
 rooms:[['Public winter garment sales hall',['sales-floor','service-counter','garment-display'],[1,45,1,15]],['Secluded west multi-fitting gallery',['fitting-area'],[1,11,17,43]],['Central independent snow loom works',['cutting-area'],[21,33,17,30]],['Long east dye and felt workshop',['dye-room'],[36,45,17,43]]],
 edges:[['exterior','sales-floor','south public shop gate'],['sales-floor','fitting-area','west full partition single x6,z16'],['sales-floor','cutting-area','center loom portal x26,z16'],['sales-floor','dye-room','east felt door x41,z16']],
 targets:[['public boutique',23,11],['private fitting',6,27],['loom benches',26,24],['winter felt room',41,27]],
 features:['sales-floor','service-counter','garment-display','fitting-area','cutting-area','dye-room'],
 signature:'true three-prong alpine snow tailor with entirely absent two deep inter-wing ground valleys, separate unequal private loom and felt halls, three independently snow-sheathed high gables'},
{category:'butcher',biome:'enchanted-forest',size:'large',variation:1,title:'Rootveil Four-Branch Provisioner',
 w:45,d:43,h:15,plan:[[0,44,0,15],[0,13,16,42],[21,31,16,32],[32,44,16,30]],entry:[22,0],
 sky:[[17,27,4,10]],
 partitions:[['z',16,1,12,[7]],['z',16,22,30,[26]],['z',16,33,43,[38]],['x',31,17,29,[24]]],
 furnishing:[[5,5,'counter','public-game-counter'],[11,10,'counter','riverfish-provisions'],[30,5,'counter','foraged-food-trade'],[39,10,'counter','market-icebox'],[4,23,'crate','forest-cold-stock'],[9,34,'crate','root-cellar'],[24,22,'table','hygienic-cutting-bench'],[28,29,'table','trimmed-game-prep'],[37,20,'table','herb-curing-station'],[42,27,'table','scented-preservation'],[11,39,'lamp','cellar-guidance','decor']],
 mass:[[1,12,19,41,8,'leaf','west-thick-root-cellar'],[5,7,22,38,9,'leaf','west-livingwood-roof'],[22,30,19,31,8,'wood','center-preparation-hall'],[25,27,21,29,9,'leaf','center-short-fork-gable'],[33,43,19,29,8,'leaf','east-preservation-wing'],[38,40,21,27,9,'leaf','east-curing-bough'],[2,10,2,6,8,'wood','short-market-porch']],
 rooms:[['Open-sun enchanted provisions bazaar',['sales-floor','service-counter'],[1,43,1,15]],['West enclosed root coldhouse',['cold-storage'],[1,12,17,41]],['Middle sanitary cutting atelier',['butcher-workspace'],[22,30,17,31]],['East herb fermentation and curing',['curing-area'],[33,43,17,29]]],
 edges:[['exterior','sales-floor','open south shopping route'],['sales-floor','cold-storage','single west cellar x7,z16'],['sales-floor','butcher-workspace','middle sanitary door x26,z16'],['sales-floor','curing-area','east curing room x38,z16'],['butcher-workspace','curing-area','service-only double-shift x31,z24']],
 targets:[['public counter',22,11],['cool root cellar',7,27],['clean butchery',26,24],['curing station',38,24]],
 features:['sales-floor','service-counter','cold-storage','butcher-workspace','curing-area'],
 signature:'four separate true occupied forest prongs with two deep open-air valleys, long root-stock cellar, center hygienic workshop, short curing pavilion and uneven canopy heights'},
{category:'jeweler',biome:'desert',size:'large',variation:1,title:'Starwell Treasury Ring',
 w:49,d:47,h:16,plan:[[0,48,0,15],[0,15,16,46],[33,48,16,46],[16,32,34,46]],entry:[24,0],
 sky:[[19,29,4,10]],
 partitions:[['z',16,1,14,[8]],['z',16,34,47,[40]],['x',15,36,45,[40]],['x',33,36,45,[40]]],
 furnishing:[[4,5,'display','amber-cabinet'],[12,10,'display','jade-trade'],[36,5,'display','sunstone-window'],[44,10,'display','desert-gem-preview'],[24,13,'counter','public-merchant-trade'],[4,22,'table','west-jewel-smelter'],[10,32,'table','precision-faceting'],[40,22,'stone','west-vault-guardian-plinth'],[44,34,'stone','high-value-vault-plinth'],[22,39,'display','rear-public-secured-catalog'],[26,43,'table','rear-valuation-worktable'],[42,43,'crate','sealed-jewel-parcel','decor']],
 mass:[[2,14,19,45,8,'stone','high-west-artisan-gallery'],[6,9,22,40,9,'stone','west-faceted-ridge'],[34,47,19,45,8,'stone','east-secure-treasury-roof'],[38,42,21,40,9,'stone','east-heavy-vault-ridge'],[39,41,25,37,10,'roof','eastern-mast-crest'],[18,30,36,45,8,'roof','transverse-rear-valuation-bridge'],[22,26,38,43,9,'stone','high-rear-valuation-vault'],[2,13,2,7,8,'roof','left-entrance-sun-shade']],
 rooms:[['Front sky-lit mineral exchange',['sales-floor','service-counter','jewelry-display'],[1,47,1,15]],['West separate artisan metal and faceting',['secure-workroom'],[1,14,17,45]],['East vaulted guarded treasury',['vault'],[34,47,17,45]],['Rear crosswise authenticated appraisal corridor',['valuation-gallery'],[17,31,35,45]]],
 edges:[['exterior','sales-floor','sunward south trade doorway'],['sales-floor','secure-workroom','west x8,z16 guarded crafts door'],['sales-floor','vault','east x40,z16 sole outer vault port'],['secure-workroom','valuation-gallery','rear x15,z40 double lock'],['vault','valuation-gallery','right x33,z40 second controlled lock']],
 targets:[['public stones',24,11],['western forge',8,28],['treasury',41,28],['back valuation',24,39]],
 features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault','valuation-gallery'],
 signature:'large complete courtyard-ring treasury with 17x18 actually missing central earth and walking surface, guarded radial east/west banks and a true raised connecting rear bridge'},
{category:'bookshop',biome:'temperate',size:'large',variation:1,title:'Crossleaf Grand Scriptorium',
 w:49,d:43,h:15,plan:[[12,36,0,42],[0,48,12,25],[0,14,26,40]],entry:[24,0],
 sky:[[18,30,3,9]],
 partitions:[['x',12,13,24,[18]],['x',36,13,24,[19]],['z',26,13,35,[24]],['z',26,1,11,[6]]],
 furnishing:[[17,5,'display','entry-periodicals'],[32,5,'display','new-chronicles'],[24,11,'counter','central-scroll-sales'],[4,16,'seat','west-reader-window'],[8,22,'seat','quiet-reader-table'],[41,16,'table','east-illuminated-manuscript'],[45,22,'table','scriptorium-quills'],[18,32,'crate','protected-rear-manuscripts'],[30,36,'crate','rare-books'],[6,33,'seat','little-west-reading-gallery'],[5,38,'lamp','dry-ink-lantern','decor']],
 mass:[[1,11,14,24,8,'wood','west-reading-crosswing'],[5,7,16,22,9,'roof','west-gallery-crest'],[38,47,14,24,8,'roof','east-scriptory-crosswing'],[42,44,16,22,9,'roof','scribe-high-gable'],[14,34,29,41,8,'wood','north-codex-library-roof'],[23,26,31,39,9,'roof','raised-north-book-transept'],[2,11,29,39,8,'roof','staggered-west-story-bay'],[5,7,32,37,9,'roof','short-west-secondary-gable']],
 rooms:[['Long central nave of shelves and sales',['sales-floor','service-counter','bookshelves'],[13,35,1,25]],['West open panorama reading crossarm',['reading-area'],[1,11,13,24]],['East separate manuscript scriptorium',['scribe-room'],[37,47,13,24]],['North deep controlled archival vault',['stockroom'],[13,35,27,41]],['Southwest auxiliary reading annexe',['second-reading'],[1,11,27,39]]],
 edges:[['exterior','sales-floor','long south nave public entry'],['sales-floor','reading-area','west lateral x12,z18'],['sales-floor','scribe-room','east lateral x36,z19'],['sales-floor','stockroom','north archive gate x24,z26'],['reading-area','second-reading','west z26 internal branch x6']],
 targets:[['south public entry',24,7],['west quiet readers',6,19],['east scriptory',42,19],['north manuscript archive',24,35],['west annex',6,33]],
 features:['sales-floor','service-counter','bookshelves','reading-area','stockroom','scribe-room','second-reading'],
 signature:'unequal true cross/offset S footprint, narrow central nave, far west reading transept, wide east manuscript wing and separately projecting west rear reading annex'},
{category:'theater',biome:'mountain',size:'medium',variation:1,title:'Stonefall Terraced Playhouse',
 w:41,d:39,h:15,plan:[[0,40,0,9],[5,35,10,32],[13,27,33,38]],entry:[20,0],
 sky:[[8,32,12,25]],
 partitions:[['z',33,14,26,[16,24]],['x',20,34,37,[35]]],
 furnishing:[[8,15,'seat','west-stepped-bench'],[11,19,'seat','west-stepped-bench'],[8,23,'seat','west-stepped-bench'],[33,15,'seat','east-stepped-bench'],[30,19,'seat','east-stepped-bench'],[33,23,'seat','east-stepped-bench'],[6,27,'lamp','cliffside-path-marker','decor'],[34,27,'lamp','upper-path-light','decor'],[17,36,'crate','backstage-props','decor'],[24,36,'table','costumes']],
 stage:[14,26,27,30],posts:[[12,27],[12,31],[28,27],[28,31]],
 mass:[[2,10,2,7,8,'stone','front-cliff-portico-left'],[30,38,2,7,8,'stone','front-cliff-portico-right'],[12,28,27,31,8,'stone','supported-mountain-stage-overhang'],[16,24,28,30,9,'roof','tiered-stone-performance-roof'],[19,21,29,29,10,'roof','cliff-flytower-crest'],[14,26,34,37,8,'stone','narrow-rear-wardrobe-roof']],
 rooms:[['Central sky-lit mountain spectator bowl',['audience-area','public-circulation'],[6,34,10,26]],['Covered highland stage floor',['stage'],[14,26,27,30]],['West separate backstage store',['backstage'],[14,19,34,37]],['East dressing and costume room',['second-backstage'],[21,26,34,37]]],
 edges:[['exterior','audience-area','wide low south public terrace'],['audience-area','public-circulation','stepped central spectator aisles'],['public-circulation','stage','stage symbolic stair remains unapproved'],['public-circulation','backstage','west x16,z33 locked backstage port'],['public-circulation','second-backstage','east x24,z33 actors port']],
 targets:[['spectators',20,18],['west long aisle',7,24],['east long aisle',34,24],['stage approach',20,26],['west dressing',16,36],['east wardrobe',24,35]],
 stairs:[[12,29],[28,29]],
 features:['stage','audience-area','backstage','public-circulation','second-backstage'],
 signature:'true three-tier tapered mountaintop occupied floor with huge missing side-step footings, rear narrow divided costume rooms, uncovered mountain spectators and actual tiered flytower'},
{category:'temple',biome:'snow',size:'small',variation:2,title:'Frostcross Pilgrim Reliquary',
 w:31,d:33,h:15,plan:[[11,19,0,32],[0,30,12,22],[8,22,26,32]],entry:[15,0],
 sky:[[13,17,5,9]],
 partitions:[['x',11,13,21,[17]],['x',19,13,21,[17]],['z',26,9,21,[15]]],
 furnishing:[[13,5,'seat','processional-pew'],[17,5,'seat','opposite-pew'],[4,16,'seat','west-transept-prayer'],[7,20,'lamp','winter-candle','decor'],[23,16,'seat','east-sacristy-pew'],[27,20,'lamp','snow-votive','decor'],[15,28,'stone','grounded-altar-plinth'],[15,30,'altar','sacred-rime-reliquary']],
 posts:[[13,3],[17,3],[4,17],[26,17]],
 mass:[[1,9,14,20,8,'snow','left-long-transept'],[4,6,16,18,9,'snow','west-high-transverse-gable'],[21,29,14,20,8,'snow','right-long-transept'],[24,26,16,18,9,'snow','right-transept-high-gable'],[10,20,27,31,8,'stone','rear-stone-apse'],[14,16,28,30,9,'snow','pilgrim-apse-winter-ridge'],[13,13,3,3,8,'stone','west-front-bell-column'],[13,13,3,3,9,'stone','west-belfry-tower'],[13,13,3,3,10,'stone','west-high-tower'],[17,17,3,3,8,'stone','east-front-bell-column'],[17,17,3,3,9,'stone','east-belfry-tower'],[17,17,3,3,10,'stone','east-high-tower']],
 rooms:[['Central covered pilgrim nave',['ceremonial-space','public-circulation'],[12,18,1,25]],['Western transept prayer cloister',['west-prayer'],[1,10,13,21]],['Eastern independent votive cloister',['east-prayer'],[20,29,13,21]],['Deep rear reliquary altar apse',['altar'],[9,21,27,31]]],
 edges:[['exterior','ceremonial-space','southern pilgrim processional opening'],['ceremonial-space','public-circulation','central nave path'],['ceremonial-space','west-prayer','western side portal x11,z17'],['ceremonial-space','east-prayer','eastern side portal x19,z17'],['ceremonial-space','altar','northward sole altar access x15,z26']],
 targets:[['processional nave',15,11],['west cloister',5,17],['east cloister',25,17],['altar foot',15,27]],
 features:['ceremonial-space','altar','public-circulation','west-prayer','east-prayer','pilgrim-belfries'],
 signature:'true four-sided cruciform winter chapel with large absent four corner foundation quarters, twin front belfry heads, pair of accessible transepts and separate high rear reliquary'}
];
function author(s){
 const inside=(x,z)=>x>=0&&z>=0&&x<s.w&&z<s.d&&s.plan.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);
 const cells=new Map(),key=(x,y,z)=>x+','+y+','+z;
 const put=(x,y,z,material,kind,meta={})=>{
  if(!inside(x,z)||y<0||y>=s.h||cells.has(key(x,y,z)))
   throw Error(s.title+' invalid or overlapping source voxel '+key(x,y,z));
  cells.set(key(x,y,z),{x,y,z,kind,material,...meta});
 };
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)){
  put(x,0,z,A.stone,'foundation');
  put(x,1,z,x===s.entry[0]?A.path:A.wood,'floor');
 }
 const boundary=[];
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)&&[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dz])=>!inside(x+dx,z+dz))){
  boundary.push([x,z]);
  for(let y=2;y<=6;y++)if(!(x===s.entry[0]&&z===s.entry[1]&&y<=4))
   put(x,y,z,A.beam,'wall',{role:'actually-concave-weather-perimeter'});
 }
 for(let i=5;i<boundary.length;i+=9){
  const [x,z]=boundary[i];
  if(x===s.entry[0]&&z===s.entry[1])continue;
  for(const y of [3,4])if(cells.has(key(x,y,z)))
   cells.set(key(x,y,z),{x,y,z,kind:'window',material:y===3?A.glass:A.frame,role:'physical-exterior-window'});
 }
 const skies=(x,z)=>s.sky.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)&&!skies(x,z))
  put(x,7,z,s.biome==='snow'?A.snow:s.biome==='enchanted-forest'?A.leaf:A.roof,'roof',{role:'real-concave-supported-weather-roof'});
 const doorPorts=[];
 for(const [axis,n,a,b,doors] of s.partitions){
  for(let q=a;q<=b;q++){
   const x=axis==='z'?q:n,z=axis==='z'?n:q;
   if(!inside(x,z))throw Error('actual architectural division outside plan '+key(x,1,z));
   for(let y=2;y<=5;y++)if(y===5||!doors.includes(q))
    put(x,y,z,A.beam,'wall',{role:'actual-restricted-room-partition'});
  }
  for(const d of doors)doorPorts.push(axis==='z'?[d,n]:[n,d]);
 }
 for(const [x,z]of(s.posts||[]))for(let y=2;y<=6;y++)
  if(!cells.has(key(x,y,z)))put(x,y,z,A.post,'wall',{role:'foundation-bearing-architectural-post'});
 if(s.stage){const [x0,x1,z0,z1]=s.stage;for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  put(x,2,z,A.wood,'fixture',{role:'raised-original-performance-stage'});
 }
 for(const [x,z,mat,role,kind='fixture']of s.furnishing)
  put(x,2,z,A[mat],kind,{role});
 for(const [x0,x1,z0,z1,y,mat,role]of s.mass)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!cells.has(key(x,y-1,z)))throw Error('floating upper architectural roof '+role+' '+key(x,y,z));
   put(x,y,z,A[mat],'roof',{role});
  }
 for(const [x,z]of(s.stairs||[]))put(x,2,z,A.stair,'fixture',{role:'symbolic-stage-step',shapeRotationStatus:'unresolved-symbolic'});
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const symbols=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const bp={
  schema:SCHEMA,id:'r2:'+s.category+':'+s.biome+':'+s.size+':'+String(s.variation).padStart(2,'0'),
  category:s.category,biome:s.biome,size:s.size,variation:s.variation,title:s.title,status:'authored-candidate',
  isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:s.h,z:s.d},units:'fixed author-authored complete physical occupied-cell architecture; real Pack ABI unresolved',
  architecturalSignature:s.signature,roof:{form:'multiple bespoke elevated supported gables across genuinely nonrectangular occupied ground',biomeSpecific:true},
  footprintRectangles:s.plan.map(([x0,x1,z0,z1])=>({x0,x1,z0,z1})),
  deliberatelyAbsentFootprintCells:s.w*s.d-voxels.filter(v=>v.y===0).length,
  rooms:s.rooms.map(([name,uses,[x0,x1,z0,z1]])=>({name,uses,bounds:{x0,x1,z0,z1}})),
  circulation:s.edges.map(([from,to,via])=>({from,to,via})),features:s.features,
  openings:[{type:'entrance',x:s.entry[0],y:2,z:s.entry[1],clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'},
   ...voxels.filter(v=>v.kind==='window').map(v=>({type:'window',x:v.x,y:v.y,z:v.z,material:v.material})),
   ...doorPorts.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))],
  routeTargets:s.targets.map(([name,x,z])=>({name,x,z})),
  intentionallyOpenRoof:s.sky.map(([x0,x1,z0,z1])=>({x0,x1,z0,z1})),
  symbolicStairApproaches:(s.stairs||[]).map(([x,z])=>({x,y:2,z,shapeRotationStatus:'unresolved-symbolic'})),
  unresolvedDependencies:symbols.map(ref=>({ref,issue:'Real Pack-family authored variant, orientation/rotation, multi-cell AABB/reservations, collision, weather/lighting, glazing and schema-1 save unresolved'})),
  voxels
 };
 validateBlueprint(bp);return Object.freeze(bp);
}
export const M1_SCULPTED_REGIONAL=Object.freeze(DESIGNS.map(author));
