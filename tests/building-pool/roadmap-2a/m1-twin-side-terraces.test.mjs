import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_TWIN_SIDE_TERRACE_SHOPS,M1_TWIN_SIDE_TERRACE_SPECS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
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
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inventory} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
const old=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS];
const all=[...old,...M1_TWIN_SIDE_TERRACE_SHOPS],k=(x,y,z)=>x+','+y+','+z;
const floor=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function d4(source){const out=[];for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
 const points=source.map(([a,b])=>{let x=mirror?-a:a,z=b;for(let r=0;r<rot;r++){const n=x;x=-z;z=n;}return[x,z]});
 const x0=Math.min(...points.map(p=>p[0])),z0=Math.min(...points.map(p=>p[1]));
 out.push(new Set(points.map(([x,z])=>(x-x0)+','+(z-z0))));
}return out;}
function iou(a,b){let common=0;for(const p of a)if(b.has(p))common++;return common/(a.size+b.size-common);}
test('preserve all 74 designs and add six distinct coordinate-authored detached candidates, 80 total',()=>{
 assert.equal(old.length,74);assert.equal(M1_TWIN_SIDE_TERRACE_SHOPS.length,6);assert.equal(all.length,80);
 assert.equal(inventory().authoredCandidateTotal,92);assert.equal(inventory().newlyAuthored,77);
 assert.equal(inventory().unwrittenNewCandidates,328);assert.equal(assertDistinctArchitecture(all).distinctArchitectures,80);
 for(const b of M1_TWIN_SIDE_TERRACE_SHOPS){assert(validateBlueprint(b).valid);assert.equal(b.rooms.length,4);assert.equal(b.courtyardGeometry.length,4);assert.equal(b.worldPlaced,false);}
});
test('each new building has four actual weather-separated open-air courtyards with intact support/caps',()=>{
 let voids=0;
 for(let i=0;i<6;i++){
  const b=M1_TWIN_SIDE_TERRACE_SHOPS[i],s=M1_TWIN_SIDE_TERRACE_SPECS[i],c=b.courtyardGeometry[3],cells=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));
  assert.equal(c.kind,'west-side-open-service-garden');
  for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++){
   for(let y=0;y<b.extents.y;y++)assert(!cells.has(k(x,y,z)),b.id+' void contains a block '+k(x,y,z));voids++;
  }
  const bearing=(x,z,role)=>{
   assert.equal(cells.get(k(x,1,z))?.kind,'floor','no terrace floor at '+k(x,1,z));
   assert.equal(cells.get(k(x,s.h+1,z))?.kind,'roof','no terrace roof cap at '+k(x,s.h+1,z));
   for(let y=2;y<=s.h;y++){const v=cells.get(k(x,y,z));assert.equal(v?.kind,'wall');assert.equal(v.architecturalRole,role);}
  };
  for(let z=c.z0;z<=c.z1;z++)bearing(s.westWidth,z,'west-service-garden-inner-weather-leg');
  for(let x=0;x<s.westWidth;x++){
   bearing(x,c.z0-1,'west-service-garden-north-return');
   bearing(x,c.z1+1,'west-service-garden-south-return');
  }
  assert(b.voxels.length>1600,'source building too small for planned morphology');
 }
 assert(voids>50);
});
test('all 24 new interior access points are actually reachable around producer-resolved Pack5 multi-cell fixtures',()=>{
 let checked=0;
 for(const b of M1_TWIN_SIDE_TERRACE_SHOPS){
  const vox=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));
  const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const p=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of p.occupiedOffsets){
    const coord=k(v.x+dx,v.y+dy,v.z+dz),other=vox.get(coord);
    assert(!other||coord===k(v.x,v.y,v.z)||other.kind==='floor','Pack fixture conflicts with solid source '+coord);
    assert.equal(vox.get(k(v.x+dx,1,v.z+dz))?.kind,'floor','unsupported Pack footprint '+coord);
    blocked.add((v.x+dx)+','+(v.z+dz));
   }
  }
  const entrance=b.openings.find(x=>x.type==='entrance'),q=[[entrance.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],a=x+','+z;
   if(seen.has(a)||blocked.has(a)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
     vox.get(k(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>vox.has(k(x,y,z))))continue;
   seen.add(a);for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){checked++;assert(seen.has(room.access.join(',')),b.id+' inaccessible room '+room.name+' '+room.access);}
  if(b.category==='bank'){
   const gate=b.openings.find(x=>x.role==='vault-threshold');assert(gate);
   const shape=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(shape.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of shape.occupiedOffsets)for(let y=0;y<3;y++)
    assert(!vox.has(k(gate.x+dx,gate.y+dy+y,gate.z+dz)),'physical bank gate obstructed');
  }
 }
 assert.equal(checked,24);
});
test('strict D4 near-duplicate floor IoU stays below 0.89 versus all 80 authored candidates',()=>{
 const plans=all.map(b=>({id:b.id,points:new Set(floor(b).map(p=>p.join(',')))}));
 for(const b of M1_TWIN_SIDE_TERRACE_SHOPS){
  const moves=d4(floor(b));let max=0,otherId='';
  for(const other of plans)if(other.id!==b.id){const score=Math.max(...moves.map(x=>iou(x,other.points)));if(score>max){max=score;otherId=other.id;}}
  assert(max<.89,b.id+' resembles '+otherId+' max IoU '+max);
 }
});
test('fail closed on blocked front entrance and a disguised no-void west courtyard',()=>{
 const b=M1_TWIN_SIDE_TERRACE_SHOPS[0],c=b.courtyardGeometry[3],door=b.openings.find(x=>x.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:door.x,y:2,z:0,kind:'wall',material:'pack1:005'}]}),/blocked entrance/);
 const falseGarden={...b,voxels:[...b.voxels,{x:c.x0,y:2,z:c.z0,kind:'wall',material:'pack1:005'}]};
 assert.throws(()=>{const occupied=new Set(falseGarden.voxels.map(v=>k(v.x,v.y,v.z)));for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++)for(let y=0;y<b.extents.y;y++)if(occupied.has(k(x,y,z)))throw Error('fake courtyard with occupied voxel');},/fake courtyard/);
});
