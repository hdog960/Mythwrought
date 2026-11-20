import test from 'node:test';
import assert from 'node:assert/strict';
import {createCWinterglassMarket} from '../../../src/building-pool/roadmap-c-trades/wave6-winterglass-snow-market.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import witness from '../../../docs/building-pool/roadmap-c-trades/C_2B_FROZEN_OWNER_WITNESS_V1.json' with {type:'json'};

const b=createCWinterglassMarket(),k=(x,y,z)=>[x,y,z].join(',');
const occupied=new Set(b.voxels.map(v=>k(v.x,v.y,v.z)));
const standing=(x,z)=>occupied.has(k(x,0,z))&&occupied.has(k(x,1,z))&&[2,3,4].every(y=>!occupied.has(k(x,y,z)));
test('Winterglass snow market has exclusive frozen C-owned unused ID and authentic original 4968 source voxels',()=>{
 assert.equal(b.id,'r2:market-square:snow:small:03');
 assert.ok(witness.ownerIds.C.includes(b.id));
 assert.ok(!witness.ownerIds.B.includes(b.id)&&!witness.ownerIds.D.includes(b.id));
 assert.equal(validateBlueprint(b).uniqueCells,4968);
 assert.equal(b.voxels.filter(x=>x.kind==='foundation').length,1929);
 assert.equal(b.voxels.filter(x=>x.kind==='roof').length,710);
 assert.equal(b.voxels.filter(x=>x.kind==='window').length,28);
 assert.equal(b.originalBooths.length,7);
 assert.equal(b.worldPlaced,false);assert.equal(b.isolated,true);
 assert.equal(structuralFingerprint(b),structuralFingerprint(createCWinterglassMarket()));
});
test('Winterglass seven genuinely separate profiled roofs, seven physical street approaches, exposed snow plaza',()=>{
 const roofing=new Set(b.voxels.filter(v=>v.kind==='roof').map(v=>v.y));
 assert.deepEqual([...roofing].sort((a,b)=>a-b),[7,8,9,10,11]);
 assert.equal(new Set(b.originalBooths.map(q=>q.name)).size,7);
 for(const booth of b.originalBooths){
  const {x,z}=booth.approach;
  assert.ok(standing(x,z),'false shopper access at '+booth.name);
  assert.ok(b.voxels.some(v=>v.kind==='roof'&&v.y===booth.roofY&&
   v.x>=booth.bounds.x0&&v.x<=booth.bounds.x1&&
   v.z>=booth.bounds.z0&&v.z<=booth.bounds.z1),'missing real stall canopy '+booth.name);
 }
 assert.equal(b.voxels.some(v=>v.kind==='roof'&&v.x===24&&v.z===20),false,
  'unroofed public plaza incorrectly capped');
});
test('Winterglass 30 literal snow melt-source void cells have no floor, walls, ceiling or fake furnishings at any height',()=>{
 assert.equal(b.actualSourceCourts.length,30);
 for(const {x,z} of b.actualSourceCourts){
  for(let y=0;y<b.extents.y;y++)assert.ok(!occupied.has(k(x,y,z)),
   'physical ground/roof exists at supposedly absent thermal court '+k(x,y,z));
 }
});
test('Winterglass every pavilion entrance and open-plaza landmark is reachable via real three-high continuous source ground',()=>{
 const door=b.openings.find(x=>x.type==='entrance'),seen=new Set([door.x+','+door.z]),q=[[door.x,door.z]];
 assert.ok(standing(door.x,door.z));
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,p=nx+','+nz;
   if(!seen.has(p)&&standing(nx,nz)){seen.add(p);q.push([nx,nz]);}
  }
 }
 assert.ok(q.length>=600,'not enough independently walkable market cells');
 for(const item of [...b.originalBooths.map(x=>x.approach),...b.publicWaypoints])
  assert.ok(seen.has(item.x+','+item.z),'false or disconnected source route '+JSON.stringify(item));
 for(const entry of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway')){
  for(let y=entry.y;y<entry.y+entry.clearHeightCells;y++)
   assert.ok(!occupied.has(k(entry.x,y,entry.z)),'fake source clear doorway '+JSON.stringify(entry));
 }
});
