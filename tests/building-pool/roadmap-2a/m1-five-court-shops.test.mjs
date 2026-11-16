import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_FIVE_COURT_SHOPS,M1_FIVE_COURT_SPECS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
import {M1_LATERAL_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inventory} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
const old=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS];
const all=[...old,...M1_FIVE_COURT_SHOPS],k=(x,y,z)=>[x,y,z].join(',');
const floor=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function d4(points){const out=[];for(let mirror=0;mirror<2;mirror++)for(let r=0;r<4;r++){
 const moved=points.map(([a,b])=>{let x=mirror?-a:a,z=b;for(let i=0;i<r;i++){const n=x;x=-z;z=n;}return[x,z]});
 const minX=Math.min(...moved.map(p=>p[0])),minZ=Math.min(...moved.map(p=>p[1]));
 out.push(new Set(moved.map(([x,z])=>(x-minX)+','+(z-minZ))));
}return out;}
const iou=(a,b)=>{let n=0;for(const p of a)if(b.has(p))n++;return n/(a.size+b.size-n)};
test('all original 80 source blueprints preserved; six independently specified five-court originals increase total to 86/420',()=>{
 assert.equal(old.length,80);assert.equal(M1_FIVE_COURT_SHOPS.length,6);assert.equal(all.length,86);
 assert.equal(inventory().authoredCandidateTotal,98);assert.equal(inventory().newlyAuthored,83);
 assert.equal(inventory().unwrittenNewCandidates,322);
 assert.equal(assertDistinctArchitecture(all).distinctArchitectures,86);
 for(const b of M1_FIVE_COURT_SHOPS){assert(validateBlueprint(b).valid);assert.equal(b.rooms.length,4);assert.equal(b.courtyardGeometry.length,5);assert.equal(b.worldPlaced,false);}
});
test('each fifth courtyard is open to sky and has authentic floor-rooted roof-capped full-height weather returns',()=>{
 let cleared=0;for(let i=0;i<6;i++){
  const b=M1_FIVE_COURT_SHOPS[i],s=M1_FIVE_COURT_SPECS[i],c=b.courtyardGeometry[4],cells=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));
  assert.equal(c.kind,'front-east-independent-lane');
  for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++){
   for(let y=0;y<b.extents.y;y++)assert(!cells.has(k(x,y,z)),b.id+' roof/floor blocks fifth real court '+k(x,y,z));
   cleared++;
  }
  const wall=(x,z,role)=>{
   assert.equal(cells.get(k(x,1,z))?.kind,'floor',b.id+' unsustained return floor');
   assert.equal(cells.get(k(x,s.h+1,z))?.kind,'roof',b.id+' unsustained return cap');
   for(let y=2;y<=s.h;y++){const v=cells.get(k(x,y,z));assert.equal(v?.kind,'wall',b.id+' open return '+k(x,y,z));assert.equal(v.architecturalRole,role);}
  };
  for(let z=c.z0;z<=c.z1;z++)wall(c.x0-1,z,'fifth-court-front-east-bearing-wall');
  for(let x=c.x0;x<=c.x1;x++){wall(x,c.z0-1,'fifth-court-north-weather-return');wall(x,c.z1+1,'fifth-court-south-weather-return');}
  assert(b.voxels.length>2200);
 }assert.equal(cleared,54);
});
test('24 new room access points remain walkable with actual producer-specific multi-cell Pack5 footprints',()=>{
 let reached=0;
 for(const b of M1_FIVE_COURT_SHOPS){
  const source=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v])),blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  const used=new Map();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const p=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of p.occupiedOffsets){
    const x=v.x+dx,y=v.y+dy,z=v.z+dz,key=k(x,y,z),other=source.get(key);
    assert(!other||key===k(v.x,v.y,v.z)||other.kind==='floor','Pack source collides '+b.id+' '+key);
    assert.equal(source.get(k(x,1,z))?.kind,'floor','no support under Pack fixture '+key);
    assert(!used.has(key),'two Pack fixtures occupy same cell '+key);used.set(key,v.role);
    blocked.add(x+','+z);
   }
  }
  const entry=b.openings.find(x=>x.type==='entrance'),q=[[entry.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],coord=x+','+z;
   if(seen.has(coord)||blocked.has(coord)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
     source.get(k(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>source.has(k(x,y,z))))continue;
   seen.add(coord);for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){assert(seen.has(room.access.join(',')),b.id+' inaccessible '+room.name+' '+room.access);reached++;}
  if(b.category==='bank'){
   const gate=b.openings.find(x=>x.role==='vault-threshold');assert(gate);
   const physical=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(physical.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of physical.occupiedOffsets)for(let h=0;h<3;h++)
     assert(!source.has(k(gate.x+dx,gate.y+dy+h,gate.z+dz)),'bank physical gate collision');
  }
 }assert.equal(reached,24);
});
test('all six new fully occupied 2D footprints strictly reject D4 near-clones against all 86 models',()=>{
 const forms=all.map(b=>({id:b.id,set:new Set(floor(b).map(v=>v.join(',')))}));
 for(const b of M1_FIVE_COURT_SHOPS){
  const v=d4(floor(b));let max=0,near='';
  for(const other of forms)if(other.id!==b.id){const score=Math.max(...v.map(x=>iou(x,other.set)));if(score>max){max=score;near=other.id;}}
  assert(max<.89,b.id+' near-duplicate '+near+' IoU '+max);
 }
});
test('fifth-court and entrance tampering cannot be disguised as valid physical circulation',()=>{
 const b=M1_FIVE_COURT_SHOPS[0],c=b.courtyardGeometry[4],door=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:door.x,y:2,z:door.z,material:'pack1:004',kind:'wall'}]}),/blocked entrance/);
 const altered={...b,voxels:[...b.voxels,{x:c.x0,y:2,z:c.z0,material:'pack1:004',kind:'wall'}]};
 const cells=new Set(altered.voxels.map(v=>k(v.x,v.y,v.z)));
 assert.throws(()=>{for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++)for(let y=0;y<b.extents.y;y++)if(cells.has(k(x,y,z)))throw Error('sky-open fifth court contains solid voxel');},/contains solid voxel/);
});
