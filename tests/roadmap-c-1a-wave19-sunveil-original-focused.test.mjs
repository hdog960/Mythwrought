// Roadmap C Builder 1A #642 Sunveil Windcourt original compiler-focused proposal.
// Test-only detached branch. This executes ORIGINAL original 1A source modules,
// not synthesized geometry callbacks, mock world placement, save, or schema changes.
// These five tests are AUTHORED but not native-executed until a targeted test run.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AInnWave19,ROADMAP_C_1A_WAVE19_INN_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave19-roadmap-c.mjs';
import {validateBlueprint,validatePool} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {getHospitalityWave1} from '../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave3} from '../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave4} from '../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {getHospitalityWave9} from '../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';

const key=at=>at.join(',');
const inside=(r,x,z)=>r.min[0]<=x&&x<r.max[0]&&r.min[2]<=z&&z<r.max[2];
const court=[26,21,33,28];
const notches=[[0,0,13,13],[47,20,59,34],[0,40,13,51]];
const cardinal={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const [b]=getRoadmapC1AInnWave19();
const occupied=new Map(b.placements.map(p=>[key(p.at),p]));
const walk=new Set(b.walkable.map(key));
const isActive=(x,z)=>x>=0&&z>=0&&x<b.footprint.width&&z<b.footprint.depth&&
  notches.every(([x0,z0,x1,z1])=>x<x0||x>x1||z<z0||z>z1);

test('Sunveil original compiler creates valid unique symbolic desert LARGE inn 005',()=>{
 assert.deepEqual(ROADMAP_C_1A_WAVE19_INN_IDS,['r1:inn:desert:large:005']);
 assert.equal(b.id,'r1:inn:desert:large:005');
 assert.equal(validateBlueprint(b),true);
 assert.equal(validatePool([b]).authored,1);
 assert.deepEqual([b.footprint.width,b.footprint.height,b.footprint.depth],[60,12,52]);
 assert.equal(b.rooms.length,14);
 assert.equal(b.portals.length,23);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(occupied.size,b.placements.length,'overlapping original source voxels');
 assert.equal(b.footprintReservations.length,5,'missing original 2-cell beds');
});
test('Sunveil all 23 original portal throats actually connect named walkable opposite-side interiors',()=>{
 const room=new Map(b.rooms.map(r=>[r.id,r]));
 assert.equal(room.size,14);
 const neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
 for(const portal of b.portals){
  const [x,y,z]=portal.at;assert.equal(y,1);
  assert.ok(walk.has(key(portal.at)),'source doorway is not traversable');
  assert.ok(!occupied.has(key([x,1,z]))&&!occupied.has(key([x,2,z])),'2-high throat is blocked');
  const to=room.get(portal.to),from=room.get(portal.from);
  assert.ok(to,'portal references a nonexistent destination room');
  assert.ok(portal.from==='outside'||from,'portal references a nonexistent source room');
  const actual=neighbors.some(([dx,dz])=>{
   const tx=x+dx,tz=z+dz,fx=x-dx,fz=z-dz;
   const sourceOK=portal.from==='outside'
     ? fz===0&&fx===b.portals[0].at[0]&&walk.has(key([fx,1,fz]))
     : inside(from,fx,fz)&&walk.has(key([fx,1,fz]));
   return sourceOK&&inside(to,tx,tz)&&walk.has(key([tx,1,tz]));
  });
  assert.ok(actual,'phony room-to-room portal '+JSON.stringify(portal));
 }
 for(const r of b.rooms)
  assert.ok(b.walkable.some(([x,y,z])=>inside(r,x,z)),'non-walkable declared room '+r.id);
});
test('Sunveil desert windcourt has 64 genuinely roof-open grounded columns and 559 absent sand-yard columns',()=>{
 assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,court);
 assert.equal(b.architecturalIdentity.exteriorVoidFootprintCells,559);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 let opened=0,missing=0;
 for(let x=0;x<b.footprint.width;x++)for(let z=0;z<b.footprint.depth;z++){
  if(!isActive(x,z)){
   missing++;
   for(let y=0;y<b.footprint.height;y++)
    assert.ok(!occupied.has(key([x,y,z])),'falsely filled source sand patio '+[x,y,z]);
  } else assert.equal(occupied.get(key([x,0,z]))?.role,'foundation');
  if(x>=court[0]&&x<=court[2]&&z>=court[1]&&z<=court[3]){
   opened++;
   assert.equal(occupied.get(key([x,0,z]))?.role,'foundation');
   assert.ok(walk.has(key([x,1,z])),'skywell court is blocked');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!occupied.has(key([x,y,z])),'roof or fixture occludes open windcourt '+[x,y,z]);
  }
 }
 assert.equal(missing,559);assert.equal(opened,64);
});
test('Sunveil 14 original sun-facing Pack4 windows, 16 physically in-room fixtures and 5 bed feet are real',()=>{
 const rooms=new Map(b.rooms.map(r=>[r.id,r]));
 const windows=b.placements.filter(p=>p.role==='window');
 const fixtures=b.placements.filter(p=>p.role==='furnishing');
 assert.equal(windows.length,14);assert.equal(fixtures.length,16);
 let notchViews=0;
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=cardinal[p.orientation]||[];
  assert.ok(Number.isInteger(dx)&&Number.isInteger(dz),'missing window cardinal source');
  assert.equal(p.asset,'pack4:030');assert.equal(y,2);
  const outer=[x+dx,z+dz],inner=[x-dx,z-dz];
  assert.ok(walk.has(key([inner[0],1,inner[1]])),'window is unreachable from inn room');
  assert.ok(!isActive(...outer)||outer[0]===0||outer[1]===0||
    outer[0]===b.footprint.width-1||outer[1]===b.footprint.depth-1,
    'window does not face exterior sand or courtyard');
  for(const yy of [2,3])
    assert.ok(!occupied.has(key([outer[0],yy,outer[1]])),'blocked eye-level exterior window view');
  notchViews+=notches.some(([a,b,c,d])=>outer[0]>=a&&outer[0]<=c&&outer[1]>=b&&outer[1]<=d)?1:0;
 }
 assert.equal(notchViews,2,'missing real window vistas onto west/east sand patios');
 for(const p of fixtures){
  const room=rooms.get(p.room);assert.ok(room,'fixture names nonexistent room');
  assert.ok(inside(room,p.at[0],p.at[2]),'fixture physically outside source room');
 }
 const bedAnchors=fixtures.filter(p=>p.asset==='pack5:082').map(p=>key(p.at));
 assert.equal(bedAnchors.length,5);
 for(const reservation of b.footprintReservations){
  assert.ok(bedAnchors.includes(key(reservation.anchor)),'unattached bed footprint');
  for(const [x,y,z] of reservation.extraCells){
   assert.ok(!walk.has(key([x,y,z]))&&!occupied.has(key([x,y,z])),'bed foot intersects floor circulation');
   assert.ok(!occupied.has(key([x,y+1,z])),'bed has no headroom');
  }
 }
});
const footprint=(shape,t=0)=>{
 const pts=shape.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]);
 const oriented=pts.map(([x,z])=>{let a=t&1?-x:x,q=z;if(t&2)[a,q]=[q,a];if(t&4)q=-q;return [a,q];});
 const minx=Math.min(...oriented.map(p=>p[0])),minz=Math.min(...oriented.map(p=>p[1]));
 return new Set(oriented.map(([x,z])=>(x-minx)+','+(z-minz)));
};
const iou=(a,b)=>{let hit=0;for(const p of a)if(b.has(p))hit++;return hit/(a.size+b.size-hit);};
test('Sunveil strictly differs under all D4 rotations/reflections from FOUR accepted desert LARGE inns',()=>{
 const prior=[...getHospitalityWave1(),...getHospitalityWave3(),
              ...getHospitalityWave4(),...getHospitalityWave9()]
   .filter(x=>x.category==='inn'&&x.biome==='desert'&&x.size==='large');
 assert.equal(prior.length,4,'expected accepted earlier inn 001-004 only');
 assert.deepEqual(prior.map(x=>x.id).sort(),
  [1,2,3,4].map(i=>'r1:inn:desert:large:'+String(i).padStart(3,'0')));
 let greatest=0,closest='';
 for(const existing of prior){
  const old=footprint(existing),m=Math.max(...Array.from({length:8},(_,t)=>iou(footprint(b,t),old)));
  if(m>greatest){greatest=m;closest=existing.id;}
  assert.ok(m<0.89,'D4 original inn near-duplicate: '+existing.id+' / '+m);
 }
 console.log('SUNVEIL_4_PRIOR_DESERT_LARGE_INNS_MAX_D4='+greatest+' nearest='+closest);
});
