// Roadmap C Builder 1A #646 Saffronwind: authentic original-source physical invariants.
// CI ONLY. This file makes no changes to original compiler, packs or runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AHousesWave23,ROADMAP_C_1A_WAVE23_HOUSE_IDS,ROADMAP_C_1A_WAVE23_HOUSE_SPECS} from '../src/building-pool/roadmap-1a/m2-housing-wave23-roadmap-c.mjs';
import {validateBlueprint,validatePool} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';

const [b]=getRoadmapC1AHousesWave23(),spec=ROADMAP_C_1A_WAVE23_HOUSE_SPECS[0];
const key=p=>p.join(',');
const vox=new Map(b.placements.map(p=>[key(p.at),p]));
const walk=new Set(b.walkable.map(key));
const rooms=new Map(b.rooms.map(r=>[r.id,r]));
const inside=(r,x,z)=>x>=r.min[0]&&x<r.max[0]&&z>=r.min[2]&&z<r.max[2];
const absent=(x,z)=>spec.exteriorNotches.some(([a,b,c,d])=>x>=a&&x<=c&&z>=b&&z<=d);
const vectors={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};

test('Saffronwind new legal desert-large house 019 original compiler has 14 real rooms and 20 unobstructed portals',()=>{
 assert.deepEqual(ROADMAP_C_1A_WAVE23_HOUSE_IDS,['r1:house:desert:large:019']);
 assert.equal(b.id,'r1:house:desert:large:019');assert.equal(validateBlueprint(b),true);
 assert.equal(validatePool([b]).authored,1);
 assert.equal(b.rooms.length,14);assert.equal(b.portals.length,20);
 assert.deepEqual([b.footprint.width,b.footprint.height,b.footprint.depth],[64,12,56]);
 assert.equal(vox.size,b.placements.length,'overlapping source placement');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
});

test('Saffronwind every portal truly connects declared room interiors on opposite sides and walks remain connected',()=>{
 const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
 for(const p of b.portals){
  const [x,y,z]=p.at;assert.equal(y,1);
  assert.ok(walk.has(key(p.at))&&!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'blocked double-high portal '+p.from+' / '+p.to);
  const from=rooms.get(p.from),to=rooms.get(p.to);
  assert.ok(to);assert.ok(p.from==='outside'||from);
  const genuine=dirs.some(([dx,dz])=>{
   const fx=x-dx,fz=z-dz,tx=x+dx,tz=z+dz;
   const source=p.from==='outside'
    ? fz===0&&fx===31&&walk.has(key([fx,1,fz]))
    : inside(from,fx,fz)&&walk.has(key([fx,1,fz]));
   return source&&inside(to,tx,tz)&&walk.has(key([tx,1,tz]));
  });
  // Room 'from'/'to' may be either geometrical direction, so check the symmetric relation.
  const backwards=p.from!=='outside'&&dirs.some(([dx,dz])=>{
    const fx=x+dx,fz=z+dz,tx=x-dx,tz=z-dz;
    return inside(from,fx,fz)&&inside(to,tx,tz)&&walk.has(key([fx,1,fz]))&&walk.has(key([tx,1,tz]));
  });
  assert.ok(genuine||backwards,'portal does not physically connect its named rooms '+JSON.stringify(p));
 }
 for(const r of b.rooms)assert.ok(b.walkable.some(([x,y,z])=>inside(r,x,z)),'unwalkable room '+r.id);
 const todo=[b.portals[0].at],seen=new Set([key(todo[0])]);
 for(let i=0;i<todo.length;i++)for(const [dx,dz] of dirs){
  const q=[todo[i][0]+dx,1,todo[i][2]+dz],k=key(q);
  if(walk.has(k)&&!seen.has(k)){seen.add(k);todo.push(q);}
 }
 assert.equal(seen.size,walk.size);assert.equal(walk.size,2231);
});

test('Saffronwind real three absent exterior terraced voids and 56 completely open grounded mirrorgarden columns',()=>{
 assert.deepEqual(spec.exteriorNotches,[[0,0,15,15],[51,21,63,37],[0,44,13,55]]);
 assert.equal(b.architecturalIdentity.exteriorVoidFootprintCells,645);
 assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,[28,33,35,39]);
 let missing=0,court=0;
 for(let x=0;x<64;x++)for(let z=0;z<56;z++){
  if(absent(x,z)){missing++;for(let y=0;y<12;y++)assert.ok(!vox.has(key([x,y,z])),'fake absent exterior column');}
  else assert.equal(vox.get(key([x,0,z]))?.role,'foundation');
  if(x>=28&&x<=35&&z>=33&&z<=39){
   court++;assert.ok(walk.has(key([x,1,z])),'court blocked');
   for(let y=1;y<12;y++)assert.ok(!vox.has(key([x,y,z])),'fake open-air court');
  }
 }
 assert.equal(missing,645);assert.equal(court,56);
});

test('Saffronwind 14 original independent physically backed roof wings, staggered silhouette and genuine source support',()=>{
 assert.equal(spec.roofWings.length,14);
 const roofs=b.placements.filter(p=>p.role==='roof');
 const uniqueNames=new Set(spec.roofWings.map(w=>w.name));assert.equal(uniqueNames.size,14);
 assert.ok(new Set(roofs.map(p=>p.at[1])).size>=4);
 for(const wing of spec.roofWings){
  const [a,z0,c,z1]=wing.rect;
  const cells=roofs.filter(p=>p.at[0]>=a&&p.at[0]<=c&&p.at[2]>=z0&&p.at[2]<=z1);
  assert.ok(cells.length>=65,'missing real roof mass '+wing.name);
 }
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.ok(vox.has(key([x,y-1,z])),'floating roof cell '+key(p.at));
  assert.ok(x<28||x>35||z<33||z>39,'roof covers the open mirrorgarden');
 }
});

test('Saffronwind 19 actual oriented external glazing cuts, three notch vistas, 28 in-room fixtures and three two-cell reservations',()=>{
 const windows=b.placements.filter(p=>p.role==='window'),
 fixtures=b.placements.filter(p=>p.role==='furnishing');
 assert.equal(windows.length,19);assert.equal(fixtures.length,28);
 let notchViews=0;
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=vectors[p.orientation]||[];
  assert.ok(Number.isInteger(dx)&&Number.isInteger(dz),'invalid glazing orientation');
  assert.equal(y,2);assert.equal(p.asset,'pack4:030');
  const [ox,oz]=[x+dx,z+dz],[ix,iz]=[x-dx,z-dz];
  assert.ok(walk.has(key([ix,1,iz])),'window inaccessible from the room');
  assert.ok(absent(ox,oz)||ox===0||oz===0||ox===63||oz===55,'window looks into another room');
  for(const height of [2,3])assert.ok(!vox.has(key([ox,height,oz])),'fake window through solid shell');
  if(absent(ox,oz))notchViews++;
 }
 assert.equal(notchViews,3);
 for(const p of fixtures){const r=rooms.get(p.room);assert.ok(r&&inside(r,p.at[0],p.at[2]),'fixture outside named room');}
 assert.equal(fixtures.filter(p=>p.asset==='pack5:082').length,3);
 assert.ok(fixtures.filter(p=>p.asset==='pack5:082').every(p=>p.variant==='wanderer-quilt'), 'all Pack5 beds must use the original physically supported builder variant');
 assert.equal(b.footprintReservations.length,3);
 for(const r of b.footprintReservations)for(const foot of r.extraCells){
  assert.ok(!vox.has(key(foot))&&!walk.has(key(foot))&&!vox.has(key([foot[0],foot[1]+1,foot[2]])),
   'two-cell bed footprint blocks walk or head clearance');
 }
});
