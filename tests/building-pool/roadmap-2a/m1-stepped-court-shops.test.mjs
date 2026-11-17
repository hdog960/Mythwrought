import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_STEPPED_COURT_SHOPS,M1_STEPPED_COURT_PROFILES,M1_STEPPED_COURT_SPECS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {assertDistinctArchitecture,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const old=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS]);
const designs=[...old,...M1_STEPPED_COURT_SHOPS];
const key=(x,y,z)=>[x,y,z].join(',');
const footprint=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function d4(source){
 const out=[];
 for(let m=0;m<2;m++)for(let r=0;r<4;r++){
  const moved=source.map(([a,b])=>{let x=m?-a:a,z=b;for(let t=0;t<r;t++){const n=x;x=-z;z=n;}return[x,z];});
  const minX=Math.min(...moved.map(x=>x[0])),minZ=Math.min(...moved.map(x=>x[1]));
  out.push(new Set(moved.map(([x,z])=>(x-minX)+','+(z-minZ))));
 }return out;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n);};

test('six original stepped-court architectural sources increase 62 protected designs to 68/420 while remaining detached',()=>{
 assert.equal(old.length,62);assert.equal(M1_STEPPED_COURT_SHOPS.length,6);assert.equal(designs.length,68);
 assert.equal(inventory().authoredCandidateTotal,122);assert.equal(inventory().newlyAuthored,107);
 assert.equal(inventory().unwrittenNewCandidates,298);assert.equal(plannedSlots().filter(x=>x.authoredHere).length,122);
 assert.equal(assertDistinctArchitecture(designs).distinctArchitectures,68);
 for(const bp of M1_STEPPED_COURT_SHOPS){assert(validateBlueprint(bp).valid);assert.equal(bp.worldPlaced,false);assert.equal(bp.rooms.length,4);}
});
test('all six retain actual open rear courts, two stepped front notches and weather-separated wings',()=>{
 let empty=0,rooms=0;for(let i=0;i<6;i++){
  const p=M1_STEPPED_COURT_PROFILES[i],s=M1_STEPPED_COURT_SPECS[i],b=M1_STEPPED_COURT_SHOPS[i],map=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  assert.equal(b.courtyardGeometry.length,3);const u=b.courtyardGeometry[0],f=b.courtyardGeometry[1],o=b.courtyardGeometry[2];
  assert.equal(u.kind,'open-rear-U-courtyard');assert.equal(f.kind,'asymmetric-front-step');assert.equal(o.kind,'opposite-front-forecourt');
  const emptyColumn=(x,z)=>{for(let y=0;y<b.extents.y;y++)assert(!map.has(key(x,y,z)),b.id+' unexpectedly occupies '+key(x,y,z));empty++;};
  for(let x=u.x0;x<=u.x1;x++)for(let z=u.z0;z<=u.z1;z++)emptyColumn(x,z);
  for(let z=0;z<s.stepDepth;z++)for(let x=s.frontSide==='west'?0:s.w-s.stepWidth;x<(s.frontSide==='west'?s.stepWidth:s.w);x++)emptyColumn(x,z);
  for(let x=o.x0;x<=o.x1;x++)for(let z=o.z0;z<=o.z1;z++)emptyColumn(x,z);
  const wall=(x,z,role)=>{assert.equal(map.get(key(x,1,z))?.kind,'floor');assert.equal(map.get(key(x,p.h+1,z))?.kind,'roof');
   for(let y=2;y<=p.h;y++){const v=map.get(key(x,y,z));assert.equal(v?.kind,'wall',b.id+' broken weather seal '+key(x,y,z));assert.equal(v.architecturalRole,role);}
  };
  const inner=s.frontSide==='east'?s.oppositeWidth:s.w-s.oppositeWidth-1;
  for(let z=0;z<s.oppositeDepth;z++)wall(inner,z,'opposite-forecourt-weather-leg');
  for(let x=o.x0;x<=o.x1;x++)wall(x,s.oppositeDepth,'opposite-forecourt-return');
  rooms+=b.rooms.length;
  assert(b.voxels.length>2100);
 }
 assert(empty>900,'not enough physically empty open-air footprint columns');assert.equal(rooms,24);
});
test('entrance really walks to all 24 room access coordinates while producer footprints avoid source collisions',()=>{
 for(const b of M1_STEPPED_COURT_SHOPS){
  const map=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v])),blocked=new Set();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of shape.occupiedOffsets){
    const pos=key(v.x+dx,v.y+dy,v.z+dz),other=map.get(pos);
    assert(!other||pos===key(v.x,v.y,v.z)||other.kind==='floor','producer fixture overlap '+b.id+': '+pos);
    assert.equal(map.get(key(v.x+dx,1,v.z+dz))?.kind,'floor','unsupported producer fixture '+b.id+': '+pos);
    blocked.add((v.x+dx)+','+(v.z+dz));
   }
  }
  const entry=b.openings.find(o=>o.type==='entrance'),queue=[[entry.x,1]],seen=new Set();
  for(let i=0;i<queue.length;i++){
   const [x,z]=queue[i],k=x+','+z;
   if(seen.has(k)||blocked.has(k)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||map.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>map.has(key(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  for(const room of b.rooms)assert(seen.has(room.access.join(',')),b.id+' real walking failed '+room.name+' '+room.access);
  const gate=b.openings.find(x=>x.role==='vault-threshold');
  if(b.category==='bank'){
   assert(gate);const shape=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(shape.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of shape.occupiedOffsets)for(let h=0;h<3;h++)assert(!map.has(key(gate.x+dx,gate.y+dy+h,gate.z+dz)),'blocked real two-leaf bank gate');
  }
 }
});
test('new floorplans reject near-duplicates of any of the 68 source floorplates under eight D4 symmetries',()=>{
 const data=designs.map(b=>({id:b.id,set:new Set(footprint(b).map(p=>p.join(',')))}));
 for(const b of M1_STEPPED_COURT_SHOPS){
  const versions=d4(footprint(b));let max=0,which='';
  for(const other of data)if(other.id!==b.id){const score=Math.max(...versions.map(v=>iou(v,other.set)));if(score>max){max=score;which=other.id;}}
  assert(max<.89,b.id+' duplicates '+which+' IoU='+max);
 }
});
test('physical producer rejection detects an intentionally blocked open courtyard and blocked real entry',()=>{
 const b=M1_STEPPED_COURT_SHOPS[0],c=b.courtyardGeometry[0];
 const cells=new Set(b.voxels.map(v=>key(v.x,v.y,v.z)));const target=key(c.x0,2,c.z0);
 assert(!cells.has(target));const counterfeit={...b,voxels:[...b.voxels,{x:c.x0,y:2,z:c.z0,kind:'wall',material:'pack1:004'}]};
 assert.throws(()=>{const map=new Set(counterfeit.voxels.map(v=>key(v.x,v.y,v.z)));for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++)for(let y=0;y<counterfeit.extents.y;y++)if(map.has(key(x,y,z)))throw Error('non-air courtyard column');},/non-air courtyard column/);
 const entry=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:entry.x,y:2,z:0,kind:'wall',material:'pack1:004'}]}),/blocked entrance/);
});
