import {SCHEMA,validateBlueprint} from './schema.mjs';
// Builder 2B: five independently architect-authored CONCAVE footprints.
// The intentional cutouts have NO foundation, NO walking floor, NO roof.
const MAT={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',leaf:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',
 crate:'pack4:057',seat:'pack4:058',table:'pack4:059',
 counter:'pack5:086',display:'pack5:087'};
const models=[
 {category:'tailor',biome:'temperate',size:'medium',title:'Greenmantle U-Court Clothier',
 w:37,d:33,h:14,rect:[[0,36,0,13],[0,12,14,32],[24,36,14,32]],entry:[18,0],sky:[[16,20,5,9]],
 partitions:[['z',14,1,11,[6]],['z',14,25,35,[30]]],
 fixtures:[[5,4,'display','garments'],[11,8,'display','cloaks'],[27,4,'display','dye-gallery'],[32,8,'display','tailored-cloaks'],[18,11,'counter','tailor-shop'],[3,20,'seat','private-fitting'],[8,26,'seat','fitting-seat'],[27,20,'table','loom-work'],[32,25,'table','pattern-cutting'],[33,29,'crate','fabric-storage','decor']],
 high:[[2,11,17,31,8,'wood','west-fitting-gable'],[6,6,19,29,9,'roof','private-west-high-roof'],[25,34,17,31,8,'roof','independent-east-cutting-roof'],[29,31,20,28,9,'roof','raised-pattern-workshop-ridge'],[3,10,2,6,8,'roof','asymmetric-entrance-loggia']],
 rooms:[['Front public garment gallery',['sales-floor','service-counter','garment-display'],[1,35,1,13]],['West enclosed fitting salon',['fitting-area'],[1,11,15,31]],['East independent cutting workshop',['cutting-area'],[25,35,15,31]]],
 links:[['exterior','sales-floor','south public entrance'],['sales-floor','fitting-area','west private x6,z14'],['sales-floor','cutting-area','east private x30,z14']],
 targets:[['public sales',18,7],['west fitting',6,22],['east cutting',30,22]],
 features:['sales-floor','service-counter','garment-display','fitting-area','cutting-area'],
 signature:'real U-shaped architecture with 209 physically absent rear ground cells, opposite private fitting and cutting wings and three different roof profiles'},
 {category:'butcher',biome:'desert',size:'medium',title:'Duneshade L-Court Butchery',
 w:37,d:35,h:14,rect:[[0,36,0,18],[0,17,19,34]],entry:[18,0],sky:[[14,22,4,8]],
 partitions:[['z',11,1,35,[8,27]],['z',19,1,16,[8]],['x',17,12,17,[15]]],
 fixtures:[[4,5,'counter','salt-meat-sales'],[7,7,'counter','provisions'],[29,5,'counter','dry-meat'],[32,7,'counter','public-market'],[3,23,'crate','sealed-salt-stock'],[6,29,'crate','meat-cold-hold'],[12,25,'crate','cold-storage'],[24,14,'table','clean-cutting'],[30,15,'table','hygiene-work'],[33,17,'table','curing-station'],[13,16,'table','spice-exchange'],[12,31,'lamp','stock-safety','decor']],
 high:[[2,16,21,33,8,'stone','raised-west-salt-house'],[7,10,23,31,9,'stone','high-thermal-vault'],[20,35,12,17,8,'roof','east-hygienic-work-roof'],[27,28,13,16,9,'roof','elevated-processing-vent'],[2,11,3,7,8,'roof','shaded-trade-portico']],
 rooms:[['Long public desert meat counter',['sales-floor','service-counter'],[1,35,1,10]],['West deep L-wing salt-coldhouse',['cold-storage'],[1,16,20,33]],['East forward sanitary preparation studio',['butcher-workspace'],[18,35,12,17]],['Inner public service distribution',['public-circulation'],[1,16,12,18]]],
 links:[['exterior','sales-floor','south market'],['sales-floor','butcher-workspace','east x27,z11'],['sales-floor','cold-storage','west x8,z11 then x8,z19'],['butcher-workspace','public-circulation','hygiene transfer x17,z15']],
 targets:[['public market',18,6],['clean prep',27,15],['cold store',8,26],['service lane',12,16]],
 features:['sales-floor','service-counter','butcher-workspace','cold-storage','public-circulation'],
 signature:'L-shaped stone-thermal coldhouse with 304 missing northeast foundation cells, forward eastern cutting wing and unique offset street porch'},
 {category:'jeweler',biome:'mountain',size:'medium',title:'Twin-Spur Gem Citadel',
 w:41,d:37,h:14,rect:[[0,40,0,16],[0,14,17,36],[26,40,17,36]],entry:[20,0],sky:[[17,23,4,9]],
 partitions:[['z',17,1,13,[8]],['z',17,27,39,[33]]],
 fixtures:[[5,5,'display','gem-case'],[10,10,'display','minerals'],[29,5,'display','jewelry'],[36,10,'display','crystal-shrine'],[20,13,'counter','public-gem-sales'],[4,23,'table','faceted-cutting'],[9,28,'table','polishing'],[12,32,'table','gem-bench'],[29,24,'stone','vault-plinth'],[35,29,'stone','locked-strongbox'],[37,33,'crate','rare-gems','decor']],
 high:[[2,13,20,35,8,'stone','left-lapidary-cliff-roof'],[6,8,23,32,9,'stone','left-triple-gable'],[27,39,19,35,8,'stone','right-protected-vault-roof'],[33,35,22,32,9,'stone','triple-citadel-gable'],[3,12,2,6,8,'roof','public-mountain-portico']],
 rooms:[['Public mountain jewelry exhibition',['sales-floor','service-counter','jewelry-display'],[1,39,1,16]],['West elevated lapidary wing',['secure-workroom'],[1,13,18,35]],['East isolated guarded strongbox',['vault'],[27,39,18,35]]],
 links:[['exterior','sales-floor','public south doorway'],['sales-floor','secure-workroom','west only x8,z17'],['sales-floor','vault','east locked x33,z17']],
 targets:[['public gallery',20,12],['lapidary',8,26],['strongbox',33,26]],
 features:['sales-floor','service-counter','jewelry-display','secure-workroom','vault'],
 signature:'truly U-shaped cliffside gem fortress with 220 foundation gaps, two competing high ridges, cut-rock private wing and protected vault wing'},
 {category:'bookshop',biome:'snow',size:'medium',title:'Snowline Elbow Archive',
 w:39,d:35,h:14,rect:[[0,38,0,16],[13,38,17,34]],entry:[19,0],sky:[[17,21,4,9]],
 partitions:[['z',17,14,37,[19,32]],['x',25,18,33,[24]]],
 fixtures:[[4,5,'display','book-stack'],[8,10,'display','parchments'],[13,14,'display','shelves'],[25,5,'display','novels'],[32,12,'display','maps'],[19,15,'counter','bookshop-counter'],[16,22,'seat','quiet-reader'],[20,27,'seat','sheltered-reading'],[28,22,'crate','archives'],[33,29,'crate','rare-manuscripts'],[36,32,'lamp','safe-paper-lamp','decor']],
 high:[[14,24,19,33,8,'snow','separate-winter-reader-roof'],[18,20,21,31,9,'snow','high-three-wide-reader-gable'],[26,37,19,33,8,'stone','protected-archive-roof'],[31,33,21,30,9,'snow','archive-snow-crest'],[2,11,3,8,8,'snow','short-front-trade-porch']],
 rooms:[['Public insulated book showroom',['sales-floor','service-counter','bookshelves'],[1,37,1,16]],['Private west reading lodge',['reading-area'],[14,24,18,33]],['East protected stock archive',['stockroom'],[26,37,18,33]]],
 links:[['exterior','sales-floor','winter front entrance'],['sales-floor','reading-area','west x19,z17'],['sales-floor','stockroom','east x32,z17'],['reading-area','stockroom','private archive transfer x25,z24']],
 targets:[['public shelves',19,12],['private reading',19,25],['archive',32,26]],
 features:['sales-floor','service-counter','bookshelves','reading-area','stockroom'],
 signature:'real L elbow snow library with 234 absent west-back ground cells, crossed physically distinct tall book wing and snow-capped archive'},
 {category:'theater',biome:'enchanted-forest',size:'large',title:'Bowergate Horseshoe Playhouse',
 w:49,d:47,h:15,rect:[[0,14,0,15],[34,48,0,15],[0,48,16,46]],entry:[10,0],sky:[[13,35,17,31]],
 partitions:[['z',41,1,47,[10,38]]],
 fixtures:[[5,20,'seat','audience-left'],[9,20,'seat','audience-left'],[13,20,'seat','audience-left'],[35,20,'seat','audience-right'],[39,20,'seat','audience-right'],[43,20,'seat','audience-right'],[5,23,'seat','audience-left'],[9,23,'seat','audience-left'],[13,23,'seat','audience-left'],[35,23,'seat','audience-right'],[39,23,'seat','audience-right'],[43,23,'seat','audience-right'],[5,27,'seat','audience-left'],[9,27,'seat','audience-left'],[13,27,'seat','audience-left'],[35,27,'seat','audience-right'],[39,27,'seat','audience-right'],[43,27,'seat','audience-right'],[10,44,'crate','backstage-props','decor'],[38,44,'crate','costume-stock','decor'],[24,44,'table','wardrobe-table'],[8,20,'lamp','audience-light','decor'],[16,35,'stair','stage-riser-west'],[32,35,'stair','stage-riser-east']],
 stage:[18,30,34,38],posts:[[16,33],[16,39],[32,33],[32,39]],
 high:[[2,13,3,12,8,'leaf','left-entry-bower'],[35,46,3,12,8,'leaf','separate-right-entry-bower'],[6,8,5,10,9,'leaf','high-left-horn'],[39,42,5,10,9,'leaf','high-right-horn'],[16,32,33,39,8,'wood','high-real-stage-roof'],[19,29,34,38,9,'leaf','upper-proscenium'],[23,25,35,37,10,'leaf','three-tier-stage-crown']],
 rooms:[['Open large forest amphitheater',['audience-area','public-circulation'],[1,47,16,32]],['Raised performance stage and approach',['stage'],[18,30,33,39]],['Enclosed two-door backstage wardrobe',['backstage'],[1,47,42,45]]],
 links:[['exterior','audience-area','west entrance horn beside absent front middle'],['audience-area','public-circulation','horseshoe public walk'],['public-circulation','stage','stair shape explicitly unapproved'],['public-circulation','backstage','double secure gates x10/x38,z41']],
 targets:[['west entry',10,8],['open center audience',24,23],['stage-side approach',24,32],['west dressing',12,44],['east dressing',36,44]],
 stairs:[[16,35],[32,35]],
 features:['stage','audience-area','backstage','public-circulation'],
 signature:'actual missing 19-wide front courtyard foundation, two detached entrance horns, open-sky forest amphitheater, rising tiered stage and separately bounded back offices'}
];
function author(s){
 const exists=(x,z)=>x>=0&&z>=0&&x<s.w&&z<s.d&&s.rect.some(r=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3]);
 const cells=new Map(),key=(x,y,z)=>x+','+y+','+z;
 const put=(x,y,z,material,kind,meta={})=>{
  if(!exists(x,z)||y<0||y>=s.h||cells.has(key(x,y,z)))throw Error(s.title+' duplicate/outside physical footprint '+key(x,y,z));
  cells.set(key(x,y,z),{x,y,z,material,kind,...meta});
 };
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(exists(x,z)){
  put(x,0,z,MAT.stone,'foundation');
  put(x,1,z,x===s.entry[0]?MAT.path:MAT.wood,'floor');
 }
 const border=[];
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(exists(x,z)&&[[1,0],[-1,0],[0,1],[0,-1]].some(p=>!exists(x+p[0],z+p[1]))){
  border.push([x,z]);
  for(let y=2;y<=6;y++)if(!(x===s.entry[0]&&z===s.entry[1]&&y<=4))
   put(x,y,z,MAT.beam,'wall',{role:'genuine-outer-footprint-envelope'});
 }
 for(let i=5;i<border.length;i+=11){
  const [x,z]=border[i];if(x===s.entry[0]&&z===s.entry[1])continue;
  for(const y of [3,4])if(cells.has(key(x,y,z)))
   cells.set(key(x,y,z),{x,y,z,material:y===3?MAT.glass:MAT.frame,kind:'window',role:'registered-real-glazing'});
 }
 const open=(x,z)=>s.sky.some(r=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3]);
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(exists(x,z)&&!open(x,z))
  put(x,7,z,s.biome==='snow'?MAT.snow:s.biome==='enchanted-forest'?MAT.leaf:MAT.roof,'roof',{role:'envelope-roof'});
 const ports=[];
 for(const [axis,num,from,to,doors] of s.partitions){
  for(let q=from;q<=to;q++){
   const x=axis==='z'?q:num,z=axis==='z'?num:q;
   if(!exists(x,z))throw Error('partition without ground '+key(x,1,z));
   for(let y=2;y<=5;y++)if(y===5||!doors.includes(q))put(x,y,z,MAT.beam,'wall',{role:'real-private-room-divider'});
  }
  for(const v of doors)ports.push(axis==='z'?[v,num]:[num,v]);
 }
 for(const [x,z]of(s.posts||[]))for(let y=2;y<=6;y++)if(!cells.has(key(x,y,z)))put(x,y,z,MAT.post,'wall',{role:'foundation-bearing-stage-post'});
 if(s.stage){const [x0,x1,z0,z1]=s.stage;for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)put(x,2,z,MAT.wood,'fixture',{role:'real-elevated-stage'});}
 for(const [x,z,m,role,kind='fixture']of s.fixtures)
  put(x,2,z,MAT[m],kind,{role,...m==='stair'?{shapeRotationStatus:'unresolved-symbolic'}:{}});
 for(const [x0,x1,z0,z1,y,m,role]of s.high)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!cells.has(key(x,y-1,z)))throw Error('floating upper roof '+role+' '+key(x,y,z));
   put(x,y,z,MAT[m],'roof',{role});
  }
 const v=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const symbols=[...new Set([...v.map(o=>o.material),'pack2:020'])].sort();
 const b={schema:SCHEMA,id:'r2:'+s.category+':'+s.biome+':'+s.size+':01',
  category:s.category,biome:s.biome,size:s.size,variation:1,title:s.title,status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:s.h,z:s.d},units:'author-specified nonrectangular complete physical occupied integer cells',
  architecturalSignature:s.signature,roof:{form:'explicit concave occupied footprint with multiple supported regional roof mass elevations',biomeSpecific:true},
  footprintRectangles:s.rect.map(r=>({x0:r[0],x1:r[1],z0:r[2],z1:r[3]})),
  deliberatelyAbsentFootprintCells:s.w*s.d-v.filter(o=>o.y===0).length,
  rooms:s.rooms.map(([name,uses,[x0,x1,z0,z1]])=>({name,uses,bounds:{x0,x1,z0,z1}})),
  circulation:s.links.map(([from,to,via])=>({from,to,via})),features:s.features,
  openings:[{type:'entrance',x:s.entry[0],y:2,z:s.entry[1],clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'},
   ...v.filter(o=>o.kind==='window').map(o=>({type:'window',x:o.x,y:o.y,z:o.z,material:o.material})),
   ...ports.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))],
  routeTargets:s.targets.map(([name,x,z])=>({name,x,z})),
  intentionallyOpenRoof:s.sky.map(r=>({x0:r[0],x1:r[1],z0:r[2],z1:r[3]})),
  symbolicStairApproaches:(s.stairs||[]).map(([x,z])=>({x,y:2,z,shapeRotationStatus:'unresolved-symbolic'})),
  unresolvedDependencies:symbols.map(ref=>({ref,issue:'Real Pack physical-family variant, yaw, shape AABB, support, collision, transparency and save schema-1 remain unresolved'})),
  voxels:v};
 validateBlueprint(b);return Object.freeze(b);
}
export const M1_CONCAVE_COURTS=Object.freeze(models.map(author));
