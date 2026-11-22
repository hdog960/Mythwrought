// MYTHWROUGHT Roadmap C Stonecrown #641 — focused original window + furnishing provenance.
// This is an additive detached native test only; do not change protected sources,
// historic tests or the existing in-flight original acceptance run #45035834001.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AHousesWave18} from '../src/building-pool/roadmap-1a/m2-housing-wave18-roadmap-c.mjs';
import {validateBlueprint} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';

const at=(x,y,z)=>x+','+y+','+z;
const directions=Object.freeze({north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]});
const interior=(r,x,z)=>r.min[0]<=x&&x<r.max[0]&&r.min[2]<=z&&z<r.max[2];
test('Stonecrown nine original windows face true outside air, including the cliffside notch view',()=>{
 const [b]=getRoadmapC1AHousesWave18();
 assert.equal(validateBlueprint(b),true);
 assert.equal(b.id,'r1:house:mountain:large:017');
 const pos=new Map(b.placements.map(p=>[at(...p.at),p]));
 const walk=new Set(b.walkable.map(p=>at(...p)));
 const windows=b.placements.filter(p=>p.role==='window');
 assert.equal(windows.length,9,'missing original exterior glazed source');
 const cuts=b.architecturalIdentity.exteriorNotches;
 assert.equal(cuts.length,3);
 let notchViewCount=0;
 for(const p of windows){
  const [x,y,z]=p.at,dir=directions[p.orientation];
  assert.ok(dir,'window missing authored cardinal exterior facing '+JSON.stringify(p));
  assert.equal(p.asset,'pack4:030','window does not use original Pack4 opening');
  assert.equal(y,2,'window source must actually occupy eye level');
  const [dx,dz]=dir;
  const out=[x+dx,z+dz],inn=[x-dx,z-dz];
  assert.ok(walk.has(at(inn[0],1,inn[1])),'blocked interior window approach '+at(x,y,z));
  const notch=cuts.some(([x0,z0,x1,z1])=>out[0]>=x0&&out[0]<=x1&&out[1]>=z0&&out[1]<=z1);
  const perimeter=out[0]===0||out[0]===b.footprint.width-1||out[1]===0||out[1]===b.footprint.depth-1;
  assert.ok(notch||perimeter,'window opens into an enclosed room rather than outdoors '+at(x,y,z));
  if(notch)notchViewCount++;
  for(let yy=1;yy<b.footprint.height;yy++)
    assert.ok(!pos.has(at(out[0],yy,out[1])),'window view occluded by physical source '+at(out[0],yy,out[1]));
 }
 assert.equal(notchViewCount,1,'one intentional exterior cliffside vista must remain visible');
});
test('Stonecrown all eleven authored fixtures occupy their REAL declared rooms; all bed feet remain free',()=>{
 const [b]=getRoadmapC1AHousesWave18();
 const rooms=new Map(b.rooms.map(r=>[r.id,r]));
 const furniture=b.placements.filter(p=>p.role==='furnishing');
 const vox=new Set(b.placements.map(p=>at(...p.at)));
 const walk=new Set(b.walkable.map(p=>at(...p)));
 assert.equal(furniture.length,11,'unexpected original fixture count');
 assert.equal(b.rooms.length,10,'original room count changed');
 for(const p of furniture){
  const r=rooms.get(p.room);
  assert.ok(r,'furnishing claims nonexistent original room: '+p.room);
  const [x,y,z]=p.at;
  assert.ok(interior(r,x,z),'furnishing is outside declared physical room '+p.room+' at '+at(x,y,z));
  assert.equal(y,1,'fixture placed at wrong physical floor level');
 }
 const beds=furniture.filter(p=>p.asset==='pack5:082');
 assert.equal(beds.length,3);
 assert.equal(b.footprintReservations.length,3);
 for(const reserve of b.footprintReservations){
  const anchor=at(...reserve.anchor);
  assert.ok(beds.some(p=>at(...p.at)===anchor),'orphaned multi-cell bed reservation');
  for(const [x,y,z] of reserve.extraCells){
   assert.ok(!vox.has(at(x,y,z))&&!walk.has(at(x,y,z)),'occupied guest-bed foot');
   assert.ok(!vox.has(at(x,y+1,z)),'no headroom at reserved bed foot');
  }
 }
 assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
});
