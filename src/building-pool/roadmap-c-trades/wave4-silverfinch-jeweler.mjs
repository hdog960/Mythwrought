// Roadmap C original C-exclusive jeweler r2:jeweler:temperate:small:02.
// Genuine occupied cells. Inert displays, locks and gems: no commerce / saves.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const E={x:33,y:18,z:35};
const A={foundation:'pack1:002',floor:'pack1:007',stone:'pack1:010',wall:'pack2:013',
 post:'pack2:015',roof:'pack3:025',crown:'pack3:069',
 glass:'pack4:030',iron:'pack4:034',case:'pack5:087',counter:'pack5:086',
 anvil:'pack5:088',crate:'pack4:057',sign:'pack4:061'};
const K=(x,y,z)=>x+','+y+','+z,F=(x,z)=>x+','+z;
export function createCSilverfinchJeweler(){
 const id='r2:jeweler:temperate:small:02',ground=new Set(),solid=new Map();
 const box=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
 // Precision gem gallery on a central street axis, angular west lapidary bay,
 // east barred vault, and towering rear appraisal lantern.
 for(const [a,b,c,d] of [[9,22,0,28],[3,10,10,25],[22,29,8,20],[14,27,24,33]])
  box(a,b,c,d,(x,z)=>ground.add(F(x,z)));
 let open=0;box(16,17,19,21,(x,z)=>{if(ground.delete(F(x,z)))open++});
 if(open!==6)throw Error(id+' six-column real source-light shaft missing');
 const has=(x,z)=>ground.has(F(x,z));
 const door=new Set();
 function portal(x,z,axis){for(let i=0;i<2;i++)for(let y=2;y<=4;y++)
  door.add(K(x+(axis==='x'?i:0),y,z+(axis==='z'?i:0)));}
 portal(15,0,'x');portal(9,14,'z');portal(22,12,'z');
 portal(18,24,'x');portal(18,33,'x');
 const partitions=new Set();
 for(let z=11;z<=24;z++)partitions.add(F(9,z));
 for(let z=9;z<=20;z++)partitions.add(F(22,z));
 for(let x=14;x<=22;x++)partitions.add(F(x,24));
 const height=(x,z)=>z>=24&&x>=14&&x<=27?12:
  x<=8&&z>=10&&z<=25?7:
  x>=23&&z>=8&&z<=20?10:9;
 function put(x,y,z,mat,kind,tag){
  if(!has(x,z)||x<0||y<0||z<0||x>=E.x||y>=E.y||z>=E.z)
   throw Error(id+' ungrounded place '+K(x,y,z));
  const k=K(x,y,z);if(solid.has(k))throw Error(id+' overlapping true geometry '+k);
  solid.set(k,{x,y,z,kind,material:mat,...tag?{physicalPurpose:tag}:{}});
 }
 const change=(x,y,z,mat,kind)=>{
  const k=K(x,y,z);if(!solid.has(k))throw Error(id+' glazing unbacked '+k);
  solid.set(k,{x,y,z,kind,material:mat});
 };
 for(const a of ground){const [x,z]=a.split(',').map(Number);
  put(x,0,z,A.foundation,'foundation');
  put(x,1,z,A.floor,'floor');
 }
 for(const s of ground){
  const [x,z]=s.split(',').map(Number);
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([xx,zz])=>!has(xx,zz));
  if(!edge&&!partitions.has(s))continue;
  for(let y=2;y<=Math.min(height(x,z)-1,7);y++)
   if(!door.has(K(x,y,z)))put(x,y,z,edge?A.stone:A.wall,'wall',edge?'outer-jewel-bearing':'security-division');
 }
 const windows=[];
 for(const [x,z] of [[12,0],[20,0],[9,5],[3,13],[3,21],[29,10],[29,17],[14,29],[27,29],[17,33],[24,33]])
  for(const y of [3,4]){
   change(x,y,z,A.glass,'window');windows.push({type:'window',x,y,z,material:A.glass});
  }
 // The taller rear appraisal room is externally supported by authentic
 // post pillars, not a metadata-only turret.
 for(const [x,z] of [[15,26],[26,26],[15,31],[26,31]])
  for(let y=2;y<height(x,z);y++)
   if(!solid.has(K(x,y,z))&&!door.has(K(x,y,z)))put(x,y,z,A.post,'wall','observatory-post');
 for(const s of ground){const [x,z]=s.split(',').map(Number),h=height(x,z);
  put(x,h,z,h===12?A.crown:A.roof,'roof',
   h===12?'high-appraisal-lantern':h===10?'east-security-vault':h===7?'west-lapidary-workshop':'long-main-market-ridge');
 }
 // Real bars in a secure vault and workstation/selection counters; no auto
 // lock controls are represented as operative mechanics.
 for(const [x,y,z,mat,tag] of [
  [12,2,5,A.counter,'front-appraisal-register'],
  [19,2,8,A.case,'public-polished-display'],
  [20,2,8,A.case,'public-polished-display'],
  [5,2,15,A.anvil,'lapidary-bench'],
  [6,2,15,A.counter,'lapidary-prep'],
  [25,2,15,A.iron,'inert-secure-bars'],
  [26,2,15,A.iron,'inert-secure-bars'],
  [25,2,18,A.crate,'inert-locked-stock'],
  [20,2,28,A.case,'north-high-value-display'],
  [22,2,30,A.counter,'private-appraisal-table']
 ])put(x,y,z,mat,'fixture',tag);
 put(15,10,0,A.sign,'decor','inert-silverfinch-shop-symbol');
 const routes=[[15,0],[15,7],[15,13],[13,17],[15,23],
  [9,14],[7,14],[5,18],
  [22,12],[24,12],[27,14],
  [18,24],[18,27],[18,33]];
 for(const [x,z] of routes)for(let y=2;y<=4;y++)
  if(!has(x,z)||solid.has(K(x,y,z)))throw Error(id+' blocked jewellery route '+K(x,y,z));
 const voxels=[...solid.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const refs=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const b={schema:SCHEMA,id,category:'jeweler',biome:'temperate',size:'small',variation:2,
  title:'Silverfinch Lapidary — lantern appraisal and secured gem court',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  blueprintVersion:'roadmap-c-original-jeweler-w4',extents:E,
  architecturalStyle:{form:'long public showroom with unequal low lapidary wing, barred east vault and high rear appraisal lantern',biomeSpecific:true},
  rooms:[
   {name:'Public jewel gallery',uses:['sales-floor'],bounds:{x0:9,x1:22,z0:0,z1:24}},
   {name:'Register and gem assay',uses:['service-counter'],bounds:{x0:11,x1:21,z0:4,z1:12}},
   {name:'Polished gems selection',uses:['jewelry-display'],bounds:{x0:12,x1:21,z0:7,z1:19}},
   {name:'West lapidary workshop',uses:['secure-workroom'],bounds:{x0:3,x1:10,z0:10,z1:25}},
   {name:'East barred stock vault',uses:['stockroom'],bounds:{x0:22,x1:29,z0:8,z1:20}},
   {name:'High north-lantern appraisal hall',uses:['appraisal-hall'],bounds:{x0:14,x1:27,z0:24,z1:33}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'real two-wide shop entry x15–16'},
   {from:'sales-floor',to:'service-counter',via:'front open register aisle'},
   {from:'sales-floor',to:'jewelry-display',via:'glass-lit source display recess'},
   {from:'sales-floor',to:'secure-workroom',via:'real low west doorway x9 z14–15'},
   {from:'sales-floor',to:'stockroom',via:'guarded east two-wide portal x22 z12–13'},
   {from:'sales-floor',to:'appraisal-hall',via:'rear lantern-gallery passage x18–19 z24'}
  ],
  openings:[
   {type:'entrance',x:15,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'},
   {type:'internal-doorway',x:9,y:2,z:14,clearHeightCells:3},
   {type:'internal-doorway',x:22,y:2,z:12,clearHeightCells:3},
   {type:'internal-doorway',x:18,y:2,z:24,clearHeightCells:3},
   {type:'internal-doorway',x:18,y:2,z:33,clearHeightCells:3},...windows],
  features:['sales-floor','service-counter','jewelry-display','secure-workroom',
   'inert vault bars','physically grounded appraisal lantern','six-column real skylight well'],
  daylightShaft:{x0:16,x1:17,z0:19,z1:21,groundAbsenceVerified:true},
  physicalPublicWaypoints:routes.map(([x,z])=>({x,y:2,z})),
  secureGameplayDisabled:true,
  unresolvedDependencies:refs.map(ref=>({ref,issue:'Producer physical variant, precise AABB, collision, glass and security mechanism not approved'})),
  voxels
 };
 validateBlueprint(b);return Object.freeze(b);
}
export function getRoadmapCTradeWave4(){return [createCSilverfinchJeweler()];}
