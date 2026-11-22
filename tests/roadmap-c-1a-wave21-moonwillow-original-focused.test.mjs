// MYTHWROUGHT Roadmap C Builder 1A #644 Moonwillow Lanternring Inn.
// Additive, detached original-source QA only. Does NOT register, place, merge or deploy.
// These tests must be executed against the actual original M2 compiler/schema, never
// a simulated world or weakened/stubbed Pack physical producer. Full 276-source
// historical & real Chrome/WebGL2 acceptance is a separate later milestone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AInnWave21,ROADMAP_C_1A_WAVE21_INN_IDS,ROADMAP_C_1A_WAVE21_INN_SPECS} from '../src/building-pool/roadmap-1a/m3-inn-wave21-roadmap-c.mjs';
import {validateBlueprint,validatePool} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {getHospitalityWave1} from '../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave2} from '../src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs';
import {getHospitalityWave3} from '../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave7} from '../src/building-pool/roadmap-1a/m3-hospitality-wave7.mjs';

const [b]=getRoadmapC1AInnWave21(),spec=ROADMAP_C_1A_WAVE21_INN_SPECS[0];
const key=p=>p.join(',');
const positions=new Map(b.placements.map(p=>[key(p.at),p]));
const walk=new Set(b.walkable.map(key));
const dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const inside=(r,x,z)=>x>=r.min[0]&&x<r.max[0]&&z>=r.min[2]&&z<r.max[2];
const disabled=(x,z)=>spec.exteriorNotches.some(([a,b,c,d])=>x>=a&&x<=c&&z>=b&&z<=d);
const windcourt=[29,38,37,44];

test('Moonwillow genuine original schema, unused enchanted-forest-large inn 005, safe source-only registration',()=>{
 assert.deepEqual(ROADMAP_C_1A_WAVE21_INN_IDS,['r1:inn:enchanted-forest:large:005']);
 assert.equal(b.id,'r1:inn:enchanted-forest:large:005');
 assert.equal(validateBlueprint(b),true);
 assert.equal(validatePool([b]).authored,1);
 assert.deepEqual([b.footprint.width,b.footprint.height,b.footprint.depth],[68,12,58]);
 assert.equal(positions.size,b.placements.length,'original overlapping source placements');
 assert.equal(b.rooms.length,16);assert.equal(b.portals.length,30);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.roofWeatherSealApproved,false);
});

test('Moonwillow all 30 authentic portal holes join their declared opposite-side rooms and entire floor is connected',()=>{
 const room=new Map(b.rooms.map(r=>[r.id,r])),dirs=[[1,0],[-1,0],[0,1],[0,-1]];
 assert.equal(room.size,16);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(y,1);assert.ok(walk.has(key(p.at)),'inaccessible portal '+JSON.stringify(p));
  assert.ok(!positions.has(key([x,1,z]))&&!positions.has(key([x,2,z])),'blocked 2-high door');
  const from=room.get(p.from),to=room.get(p.to);
  assert.ok(to,'unknown target room');
  assert.ok(p.from==='outside'||from,'unknown source room');
  const real=dirs.some(([dx,dz])=>{
   const xTo=x+dx,zTo=z+dz,xFrom=x-dx,zFrom=z-dz;
   const goodFrom=p.from==='outside'
     ? zFrom===0&&xFrom===b.portals[0].at[0]&&walk.has(key([xFrom,1,zFrom]))
     : inside(from,xFrom,zFrom)&&walk.has(key([xFrom,1,zFrom]));
   return goodFrom&&inside(to,xTo,zTo)&&walk.has(key([xTo,1,zTo]));
  });
  assert.ok(real,'phony disconnected portal '+JSON.stringify(p));
 }
 for(const r of b.rooms)
  assert.ok(b.walkable.some(([x,y,z])=>inside(r,x,z)),'fake nonwalkable room '+r.id);
 const queue=[b.portals[0].at],seen=new Set([key(queue[0])]);
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];for(const [dx,dz] of dirs){
   const to=[x+dx,y,z+dz],k=key(to);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);queue.push(to);}
  }
 }
 assert.equal(seen.size,walk.size,'source corridor contains inaccessible walking islands');
});

test('Moonwillow 591 actual absent forest-clearing columns and 63 grounded fully roof-open moonlight cells',()=>{
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 assert.equal(b.architecturalIdentity.exteriorVoidFootprintCells,591);
 assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,windcourt);
 let voids=0,court=0;
 for(let x=0;x<64;x++)for(let z=0;z<56;z++){
  if(disabled(x,z)){
   voids++;
   for(let y=0;y<12;y++)assert.ok(!positions.has(key([x,y,z])),'void contains a source voxel');
  }else assert.equal(positions.get(key([x,0,z]))?.role,'foundation','missing real ground');
  if(x>=windcourt[0]&&x<=windcourt[2]&&z>=windcourt[1]&&z<=windcourt[3]){
   court++;
   assert.equal(positions.get(key([x,0,z]))?.role,'foundation');
   assert.ok(walk.has(key([x,1,z])),'court is fake or obstructed');
   for(let y=1;y<12;y++)assert.ok(!positions.has(key([x,y,z])),'court has roof or solid obstruction');
  }
 }
 assert.equal(voids,591);assert.equal(court,63);
});

test('Moonwillow all sixteen independent roofs have true supported mass, varied pitch and no skywell occlusion',()=>{
 const roof=b.placements.filter(p=>p.role==='roof');
 const wings=spec.roofWings;
 assert.equal(wings.length,16);assert.equal(roof.length,3290);
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=4);
 const uniqueWings=new Set();
 for(const wing of wings){
  const [x0,z0,x1,z1]=wing.rect;
  const cells=roof.filter(p=>p.at[0]>=x0&&p.at[0]<=x1&&p.at[2]>=z0&&p.at[2]<=z1);
  assert.ok(cells.length>=45,'roof wing exists as metadata only '+wing.name);
  uniqueWings.add(wing.name);
 }
 assert.equal(uniqueWings.size,16);
 for(const p of roof){
  const [x,y,z]=p.at;
  assert.ok(positions.has(key([x,y-1,z])),'unsupported real roof source '+key(p.at));
  assert.ok(x<windcourt[0]||x>windcourt[2]||z<windcourt[1]||z>windcourt[3],
   'physical roof blocks the open moonlight court');
 }
});

test('Moonwillow nineteen genuine moonlit-glazed windows, twenty-three in-room furnishings, eight two-cell beds',()=>{
 const windows=b.placements.filter(p=>p.role==='window');
 const furnishings=b.placements.filter(p=>p.role==='furnishing');
 assert.equal(windows.length,19);assert.equal(furnishings.length,23);
 const room=new Map(b.rooms.map(r=>[r.id,r]));let notchViews=0;
 for(const p of windows){
  assert.equal(p.asset,'pack4:030');
  const [x,y,z]=p.at,[dx,dz]=dirs[p.orientation]||[];
  assert.ok(Number.isInteger(dx)&&Number.isInteger(dz),'unoriented original glazing');
  assert.equal(y,2);
  const outer=[x+dx,z+dz],inner=[x-dx,z-dz];
  assert.ok(walk.has(key([inner[0],1,inner[1]])),'window interior face is unreachable');
  assert.ok(disabled(...outer)||outer[0]===0||outer[1]===0||outer[0]===67||outer[1]===57,
    'window looks into another enclosed room');
  for(const yy of [2,3])
   assert.ok(!positions.has(key([outer[0],yy,outer[1]])),'window lacks actual eye-level exterior visibility');
  if(disabled(...outer))notchViews++;
 }
 assert.equal(notchViews,4);
 for(const f of furnishings){
  const r=room.get(f.room);
  assert.ok(r,'fixture declares nonexistent source room '+f.room);
  assert.ok(inside(r,f.at[0],f.at[2]),'fixture physically outside original room');
 }
 const beds=furnishings.filter(p=>p.asset==='pack5:082');
 assert.equal(beds.length,8);assert.equal(b.footprintReservations.length,8);
 for(const reserve of b.footprintReservations){
  assert.ok(beds.some(f=>key(f.at)===key(reserve.anchor)),'bed-foot reservation without actual anchor');
  for(const [x,y,z] of reserve.extraCells){
   assert.ok(!walk.has(key([x,y,z]))&&!positions.has(key([x,y,z])),'bed foot overlaps circulation');
   assert.ok(!positions.has(key([x,y+1,z])),'bed foot lacks headroom');
  }
 }
});

const floor=(shape,t=0)=>{
 const p=shape.placements.filter(q=>q.role==='foundation').map(q=>[q.at[0],q.at[2]]);
 const oriented=p.map(([x,z])=>{let a=t&1?-x:x,bb=z;if(t&2)[a,bb]=[bb,a];if(t&4)bb=-bb;return[a,bb];});
 const xmin=Math.min(...oriented.map(x=>x[0])),zmin=Math.min(...oriented.map(x=>x[1]));
 return new Set(oriented.map(([x,z])=>(x-xmin)+','+(z-zmin)));
};
const d4=(a,c)=>{
 const existing=floor(c);
 let max=0;
 for(let t=0;t<8;t++){const rotated=floor(a,t);let common=0;
  for(const k of rotated)if(existing.has(k))common++;
  const overlap=common/(rotated.size+existing.size-common);
  if(overlap>max)max=overlap;
 }
 return max;
};
test('Moonwillow original enchanted-forest-large inn #005 is distinct from accepted historic enchanted-forest-large inns',()=>{
 const accepted=[...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave7()]
   .filter(p=>p.category==='inn'&&p.biome==='enchanted-forest'&&p.size==='large');
 assert.deepEqual(accepted.map(p=>p.id).sort(),
   ['r1:inn:enchanted-forest:large:001','r1:inn:enchanted-forest:large:002','r1:inn:enchanted-forest:large:003','r1:inn:enchanted-forest:large:004']);
 const ratios=accepted.map(p=>({id:p.id,ratio:d4(b,p)}));
 for(const ratio of ratios)assert.ok(ratio.ratio<.89,'enchanted-forest-large original near-clone '+JSON.stringify(ratio));
 console.log('MOONWILLOW_ORIGINAL_SNOW_LARGE_D4='+JSON.stringify(ratios));
});
