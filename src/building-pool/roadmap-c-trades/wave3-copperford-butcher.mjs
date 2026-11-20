// Roadmap C original butcher: C-owned r2:butcher:temperate:small:02.
// Inert architecture only, with source-resolved public, prep and cold storage.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const E={x:34,y:15,z:33};
const P={stone:'pack1:002',floor:'pack1:007',tile:'pack5:081',plank:'pack2:013',
 beam:'pack2:015',roof:'pack3:025',shingle:'pack3:023',glass:'pack4:030',
 grill:'pack4:034',crate:'pack4:057',counter:'pack5:086',shelf:'pack5:087',sign:'pack4:061'};
const K=(x,y,z)=>x+','+y+','+z,F=(x,z)=>x+','+z;
export function createCCopperfordButcher(){
 const id='r2:butcher:temperate:small:02',ground=new Set(),cells=new Map();
 const rectangle=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
 // Long central storefront, projecting smokehouse, insulated east cold vault,
 // and offset rear wagon-service entrance, rather than four cloned box rooms.
 [[10,23,0,29],[2,11,8,22],[22,31,10,25],[12,27,25,31]]
  .forEach(([a,b,c,d])=>rectangle(a,b,c,d,(x,z)=>ground.add(F(x,z))));
 let removed=0;
 rectangle(17,18,22,25,(x,z)=>{if(ground.delete(F(x,z)))removed++});
 if(removed!==8)throw Error(id+' exterior drainage well missing');
 const has=(x,z)=>ground.has(F(x,z));
 const door=new Set();
 function portal(x,z,axis){for(let i=0;i<2;i++)for(let y=2;y<=4;y++)
  door.add(K(x+(axis==='x'?i:0),y,z+(axis==='z'?i:0)));}
 portal(15,0,'x');portal(10,12,'z');portal(23,16,'z');
 portal(15,25,'x');portal(15,31,'x');
 const wallDividers=new Set();
 for(let z=9;z<=21;z++)wallDividers.add(F(10,z));
 for(let z=11;z<=24;z++)wallDividers.add(F(23,z));
 for(let x=12;x<=25;x++)wallDividers.add(F(x,25));
 const roofHeight=(x,z)=>z>=25&&x>=12&&x<=27?10:
  x<=9&&z>=8&&z<=22?7:
  x>=24&&z>=10&&z<=25?8:9;
 function put(x,y,z,material,kind,tag){
  if(!has(x,z)||x<0||y<0||z<0||x>=E.x||y>=E.y||z>=E.z)throw Error(id+' ungrounded '+K(x,y,z));
  const k=K(x,y,z);if(cells.has(k))throw Error(id+' overlapping '+k+' '+kind);
  cells.set(k,{x,y,z,material,kind,...tag?{structuralRole:tag}:{}});
 }
 function swap(x,y,z,material,kind){
  const k=K(x,y,z);if(!cells.has(k))throw Error(id+' glazing without wall '+k);
  cells.set(k,{x,y,z,material,kind});
 }
 for(const s of ground){const [x,z]=s.split(',').map(Number);
  put(x,0,z,P.stone,'foundation');
  put(x,1,z,x>=24&&z>=10&&z<=25?P.tile:P.floor,'floor');
 }
 for(const s of ground){
  const [x,z]=s.split(',').map(Number);
  const edge=[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([xx,zz])=>!has(xx,zz));
  if(!edge&&!wallDividers.has(s))continue;
  for(let y=2;y<=Math.min(roofHeight(x,z)-1,6);y++)
   if(!door.has(K(x,y,z)))put(x,y,z,edge?P.stone:P.plank,'wall',edge?'weather-shell':'cold-work-divider');
 }
 const glass=[];
 for(const [x,z] of [[12,0],[20,0],[10,4],[2,11],[2,19],[31,14],[31,21],[14,31],[25,31]])
  for(const y of [3,4]){
   swap(x,y,z,P.glass,'window');
   glass.push({type:'window',x,y,z,material:P.glass});
  }
 for(const s of ground){const [x,z]=s.split(',').map(Number),h=roofHeight(x,z);
  put(x,h,z,h===7?P.shingle:P.roof,'roof',
   h===7?'open-smokehouse-hip':h===8?'cold-store-insulating-slope':h===9?'market-nave-roof':'wagon-bay-high-ridge');
 }
 // Smokehouse hanging bars, inert processing table and real insulated source
 // stock: no meat decay, trade, recipes or mob spawning is implemented.
 for(const [x,y,z,material,role] of [
  [13,2,5,P.counter,'sales-register'],[14,2,5,P.counter,'sales-register'],
  [20,2,10,P.shelf,'retail-display'],[21,2,10,P.shelf,'retail-display'],
  [6,2,11,P.counter,'inert-prep-block'],[7,2,11,P.counter,'inert-prep-block'],
  [6,5,17,P.grill,'smoke-vent-grate'],[7,5,17,P.grill,'smoke-vent-grate'],
  [27,2,13,P.crate,'cold-store-stock'],[28,2,13,P.crate,'cold-store-stock'],
  [27,2,21,P.crate,'cold-store-stock'],[21,2,28,P.crate,'wagon-supply']
 ])put(x,y,z,material,y===5?'decor':'fixture',role);
 put(15,10,0,P.sign,'decor','original-copperford-inert-shop-sign');
 const routeTargets=[[15,0],[15,5],[15,12],[15,20],[13,24],
  [10,12],[8,12],[6,15],[23,16],[26,16],[27,19],
  [15,25],[15,28],[15,31]];
 for(const [x,z] of routeTargets)for(let y=2;y<=4;y++)
  if(!has(x,z)||cells.has(K(x,y,z)))throw Error(id+' obstructed route '+K(x,y,z));
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const refs=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const bp={
  schema:SCHEMA,id,category:'butcher',biome:'temperate',size:'small',variation:2,
  title:'Copperford Provision House — smokehouse and cold-vault',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  blueprintVersion:'roadmap-c-copperford-original-butcher-v1',extents:E,
  architecturalStyle:{form:'unequal smokehouse and tile-cooled vault branches around long central exchange and rear wagon bay',biomeSpecific:true},
  rooms:[
   {name:'Long public provision gallery',uses:['sales-floor'],bounds:{x0:10,x1:23,z0:0,z1:24}},
   {name:'Front weigh-and-pay register',uses:['service-counter'],bounds:{x0:12,x1:19,z0:3,z1:11}},
   {name:'West stone smoke and food-preparation room',uses:['butcher-workspace'],bounds:{x0:2,x1:11,z0:8,z1:22}},
   {name:'East tile-insulated cold storage',uses:['cold-storage'],bounds:{x0:22,x1:31,z0:10,z1:25}},
   {name:'Rear wagon unloading hall',uses:['stockroom'],bounds:{x0:12,x1:27,z0:25,z1:31}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'two-wide actual front shop arch'},
   {from:'sales-floor',to:'service-counter',via:'open public counter aisle'},
   {from:'sales-floor',to:'butcher-workspace',via:'real two-wide west food-preparation door'},
   {from:'sales-floor',to:'cold-storage',via:'two-wide east vault opening'},
   {from:'sales-floor',to:'stockroom',via:'rear two-wide wagon loading passage'}
  ],
  openings:[
   {type:'entrance',x:15,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'},
   {type:'internal-doorway',x:10,y:2,z:12,clearHeightCells:3},
   {type:'internal-doorway',x:23,y:2,z:16,clearHeightCells:3},
   {type:'internal-doorway',x:15,y:2,z:25,clearHeightCells:3},
   {type:'internal-doorway',x:15,y:2,z:31,clearHeightCells:3},
   ...glass],
  features:['sales-floor','service-counter','butcher-workspace','cold-storage',
   'smokehouse grate with NO actual cooking functionality','tile cold room without cooling mechanics','rear wagon dock'],
  drainageCourt:{x0:17,x1:18,z0:22,z1:25,groundTrulyAbsent:true},
  roomAccess:routeTargets.map(([x,z])=>({x,y:2,z})),
  productionGameplayEnabled:false,
  unresolvedDependencies:refs.map(ref=>({ref,issue:'Manual Packs 1–5 variant, support, glass, yaw and physical collision need independent producer certification'})),
  voxels
 };
 validateBlueprint(bp);
 return Object.freeze(bp);
}
export function getRoadmapCTradeWave3(){return [createCCopperfordButcher()];}
