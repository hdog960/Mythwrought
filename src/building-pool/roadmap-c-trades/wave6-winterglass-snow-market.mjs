// MYTHWROUGHT Roadmap C: C-owned original snow market, producer/game INACTIVE.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
export function createCWinterglassMarket(){
 const id='r2:market-square:snow:small:03',extents={x:55,y:17,z:49};
 const cells=new Map(),ground=new Set(),voids=[],booths=[],windows=[];
 const K=(x,y,z)=>[x,y,z].join(','),F=(x,z)=>x+','+z;
 const rect=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z)};
 for(const r of [[15,34,0,47],[3,14,4,17],[3,14,25,38],[35,47,3,16],
  [35,51,19,31],[38,50,35,44],[34,39,38,39],[9,20,37,47],[21,33,39,47],[0,9,18,24]])
  rect(...r,(x,z)=>ground.add(F(x,z)));
 for(const r of [[6,9,10,12],[43,46,24,26],[13,14,40,42]])
  rect(...r,(x,z)=>{if(ground.delete(F(x,z)))voids.push({x,z})});
 if(voids.length!==30)throw Error(id+' wrong actual empty-earth court '+voids.length);
 const has=(x,z)=>ground.has(F(x,z));
 function put(x,y,z,material,kind){
  if(!has(x,z)||x<0||y<0||z<0||x>=55||y>=17||z>=49)
   throw Error(id+' ungrounded source '+K(x,y,z));
  const key=K(x,y,z);if(cells.has(key))throw Error(id+' physical source overlap '+key);
  cells.set(key,{x,y,z,material,kind});
 }
 function glaze(x,y,z){
  const key=K(x,y,z);if(!cells.has(key))throw Error(id+' no glass support '+key);
  cells.set(key,{x,y,z,material:'pack4:030',kind:'window'});
  windows.push({type:'window',x,y,z,material:'pack4:030'});
 }
 for(const p of ground){const [x,z]=p.split(',').map(Number);
  put(x,0,z,'pack1:002','foundation');put(x,1,z,'pack1:007','floor');
 }
 const halls=[
  ['wool',3,12,4,16,8],['furs',3,12,26,37,9],
  ['herbs',37,46,4,15,8],['tools',37,50,20,30,10],
  ['lanterns',39,49,36,43,9],['storage',22,32,40,46,11],
  ['weigh-house',0,8,19,23,7]
 ];
 for(const [name,a,b,c,d,h] of halls){
  for(const x of [a,b])for(const z of [c,d])for(let y=2;y<h;y++)
   put(x,y,z,'pack2:015','wall');
  for(let x=a+1;x<b;x++)for(let y=2;y<=4;y++)put(x,y,d,'pack2:013','wall');
  for(const x of [a+2,b-2])for(const y of [3,4])glaze(x,y,d);
  for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)if(has(x,z))
   put(x,h,z,h%2?'pack3:025':'pack3:026','roof');
  // All source fixtures intentionally inside, not on a perimeter wind wall.
  put(a+1,2,c+2,'pack5:086','fixture');
  put(a+2,2,c+2,'pack5:086','fixture');
  put(b-2,2,c+3,'pack5:087','fixture');
  const approach={x:Math.floor((a+b)/2),y:2,z:c+1};
  for(let y=2;y<=4;y++)if(cells.has(K(approach.x,y,approach.z)))
   throw Error(id+' blocked real customer entrance '+name);
  booths.push({name,approach,roofY:h,bounds:{x0:a,x1:b,z0:c,z1:d}});
 }
 // Inert winter lanterns as actual decorative source voxels: no active lighting.
 for(const [x,z] of [[17,2],[32,2],[17,45],[32,45]])put(x,2,z,'pack4:057','decor');
 const avenues=[[24,0],[24,8],[24,20],[24,30],[24,39],[24,47],
  [13,5],[13,16],[13,27],[13,35],[35,7],[35,25]];
 for(const [x,z] of avenues)for(let y=2;y<=4;y++)
  if(!has(x,z)||cells.has(K(x,y,z)))throw Error(id+' blocked actual public route '+K(x,y,z));
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const materials=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const bp={schema:SCHEMA,id,category:'market-square',biome:'snow',size:'small',variation:3,
  title:'Winterglass Seven-Hall Snow Market',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  blueprintVersion:'roadmap-c-original-winterglass-v1',extents,
  architecturalStyle:{form:'seven separate irregular snow-roofed timber lodges linked by an open city-square winter boulevard',biomeSpecific:true},
  rooms:[{name:'public open-sky winter exchange avenue',uses:['public-circulation'],bounds:{x0:15,x1:34,z0:0,z1:47}},
  ...booths.map(b=>({name:b.name,uses:[b.name==='storage'?'stockroom':b.name==='weigh-house'?'service-counter':'vendor-stalls'],bounds:b.bounds}))],
  circulation:[{from:'exterior',to:'public-circulation',via:'real unroofed two-way source-founded plaza'},
   ...booths.map(b=>({from:'public-circulation',to:b.name==='storage'?'stockroom':b.name==='weigh-house'?'service-counter':'vendor-stalls',
    via:'open real stall threshold at '+b.approach.x+','+b.approach.z}))],
  openings:[{type:'entrance',x:24,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'},
   ...booths.map(b=>({type:'internal-doorway',x:b.approach.x,y:2,z:b.approach.z,clearHeightCells:3})),...windows],
  features:['square','public-circulation','vendor-stalls','service-counter','stockroom',
   'seven separate architectural roof forms','30 literally groundless thermal courts',
   'four inert source-lantern landmark blocks'],
  actualSourceCourts:voids,originalBooths:booths,
  publicWaypoints:avenues.map(([x,z])=>({x,y:2,z})),
  npcTradeEnabled:false,realSnowWeatherEnabled:false,
  unresolvedDependencies:materials.map(ref=>({ref,issue:'Actual Manual Pack physical variant and snow/wind gameplay collision, AABB/yaw not yet accepted'})),
  voxels
 };
 validateBlueprint(bp);return Object.freeze(bp);
}
export function getRoadmapCTradeWave6(){return [createCWinterglassMarket()];}
