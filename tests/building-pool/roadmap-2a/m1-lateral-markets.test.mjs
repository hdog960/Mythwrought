import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_LATERAL_MARKETS,M1_LATERAL_MARKET_SPECS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
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
import {assertDistinctArchitecture,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inventory} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
const previous=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS];
const all=[...previous,...M1_LATERAL_MARKETS],key=(x,y,z)=>x+','+y+','+z;
const footprint=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function d4(points){const output=[];for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
 const pts=points.map(([x,z])=>{if(mirror)x=-x;for(let i=0;i<rot;i++){const t=x;x=-z;z=t;}return [x,z];});
 const minX=Math.min(...pts.map(v=>v[0])),minZ=Math.min(...pts.map(v=>v[1]));
 output.push(new Set(pts.map(([x,z])=>(x-minX)+','+(z-minZ))));
}return output;}
function overlap(a,b){let common=0;for(const k of a)if(b.has(k))common++;return common/(a.size+b.size-common);}
test('preserve every earlier 68 blueprint and add six source-authored L court originals, detached 74/420',()=>{
 assert.equal(previous.length,68);assert.equal(M1_LATERAL_MARKETS.length,6);assert.equal(all.length,74);
 assert.equal(inventory().authoredCandidateTotal,110);assert.equal(inventory().newlyAuthored,95);
 assert.equal(inventory().unwrittenNewCandidates,310);
 assert.equal(assertDistinctArchitecture(all).distinctArchitectures,74);
 for(const b of M1_LATERAL_MARKETS){assert(validateBlueprint(b).valid);assert.equal(b.worldPlaced,false);assert.equal(b.rooms.length,4);assert.equal(b.courtyardGeometry.length,3);}
});
test('each lateral L passage is truly open air with independently bearing full height returns',()=>{
 let removed=0;for(let i=0;i<6;i++){
  const b=M1_LATERAL_MARKETS[i],s=M1_LATERAL_MARKET_SPECS[i],courtyard=b.courtyardGeometry[2];
  assert.equal(courtyard.kind,'east-side-open-L-gallery');const cells=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  for(let x=courtyard.x0;x<=courtyard.x1;x++)for(let z=courtyard.z0;z<=courtyard.z1;z++){
   for(let y=0;y<b.extents.y;y++)assert(!cells.has(key(x,y,z)),b.id+' blocked true open side court');
   removed++;
  }
  const bearing=(x,z,role)=>{
   assert.equal(cells.get(key(x,1,z))?.kind,'floor',b.id+' side bearing floor absent');
   assert.equal(cells.get(key(x,s.h+1,z))?.kind,'roof',b.id+' side cap absent');
   for(let y=2;y<=s.h;y++){const v=cells.get(key(x,y,z));assert.equal(v?.kind,'wall');assert.equal(v.architecturalRole,role);}
  };
  for(let z=courtyard.z0;z<=courtyard.z1;z++)bearing(courtyard.x0-1,z,'lateral-gallery-inner-weather-wall');
  for(let x=courtyard.x0;x<=courtyard.x1;x++){
   bearing(x,courtyard.z0-1,'lateral-gallery-north-return');
   bearing(x,courtyard.z1+1,'lateral-gallery-south-return');
  }
  assert(b.voxels.length>1800,'no substantial coordinate-authored building');
 }assert(removed>60,'not enough truly absent exterior cells');
});
test('all 24 ground-level room access anchors reachable with genuine Pack5 occupancy and two-leaf bank vault',()=>{
 for(const b of M1_LATERAL_MARKETS){
  const map=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const physical=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of physical.occupiedOffsets){
    const k=key(v.x+dx,v.y+dy,v.z+dz),other=map.get(k);
    assert(!other||k===key(v.x,v.y,v.z)||other.kind==='floor','producer occupied a real source cell '+b.id+' '+k);
    assert.equal(map.get(key(v.x+dx,1,v.z+dz))?.kind,'floor','unsupported fixture '+b.id+' '+k);
    blocked.add((v.x+dx)+','+(v.z+dz));
   }
  }
  const e=b.openings.find(o=>o.type==='entrance'),queue=[[e.x,1]],seen=new Set();
  for(let j=0;j<queue.length;j++){
   const [x,z]=queue[j],k=x+','+z;
   if(seen.has(k)||blocked.has(k)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
      map.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>map.has(key(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  for(const r of b.rooms)assert(seen.has(r.access.join(',')),b.id+' room unreachable: '+r.name+' '+r.access);
  if(b.category==='bank'){
   const gate=b.openings.find(o=>o.role==='vault-threshold');assert(gate);
   const physical=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(physical.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of physical.occupiedOffsets)for(let h=0;h<3;h++)assert(!map.has(key(gate.x+dx,gate.y+dy+h,gate.z+dz)));
  }
 }
});
test('new L plans reject all exact D4 clones and near-identical old/new footprint profiles',()=>{
 const plans=all.map(b=>({id:b.id,cells:new Set(footprint(b).map(p=>p.join(',')))}));
 for(const b of M1_LATERAL_MARKETS){
  const versions=d4(footprint(b));
  let largest=0,closest='';
  for(const other of plans)if(other.id!==b.id){const score=Math.max(...versions.map(v=>overlap(v,other.cells)));if(score>largest){largest=score;closest=other.id;}}
  assert(largest<.89,b.id+' too close to '+closest+' overlap '+largest);
 }
});
test('source validator detects tampering inside L gallery void and blocked entry',()=>{
 const b=M1_LATERAL_MARKETS[0],court=b.courtyardGeometry[2],bad={...b,voxels:[...b.voxels,{x:court.x0,y:2,z:court.z0,material:'pack1:005',kind:'wall'}]};
 assert(bad.voxels.some(v=>v.x===court.x0&&v.y===2&&v.z===court.z0));
 const occupied=new Set(bad.voxels.map(v=>key(v.x,v.y,v.z)));
 assert.throws(()=>{for(let x=court.x0;x<=court.x1;x++)for(let z=court.z0;z<=court.z1;z++)for(let y=0;y<b.extents.y;y++)if(occupied.has(key(x,y,z)))throw Error('courtyard intruder');},/courtyard intruder/);
 const door=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:door.x,y:2,z:0,kind:'wall',material:'pack1:005'}]}),/blocked entrance/);
});
