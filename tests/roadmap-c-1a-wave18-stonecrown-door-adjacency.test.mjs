// Stonecrown original Wave18 regression: a declared portal is not sufficient proof
// that it ACTUALLY joins both named source rooms through the physical wall.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AHousesWave18} from '../src/building-pool/roadmap-1a/m2-housing-wave18-roadmap-c.mjs';
import {validateBlueprint} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
const inside=(r,x,z)=>r.min[0]<=x&&x<r.max[0]&&r.min[2]<=z&&z<r.max[2];
test('Stonecrown all 14 actual source portal throats join the declared opposite-side rooms',()=>{
 const [b]=getRoadmapC1AHousesWave18();
 assert.equal(validateBlueprint(b),true);
 assert.equal(b.id,'r1:house:mountain:large:017');
 assert.equal(b.rooms.length,10);
 assert.equal(b.portals.length,14);
 const rooms=new Map(b.rooms.map(r=>[r.id,r]));
 const solids=new Set(b.placements.map(p=>key(...p.at)));
 const walk=new Set(b.walkable.map(p=>key(...p)));
 const dir=[[1,0],[-1,0],[0,1],[0,-1]];
 for(const portal of b.portals){
  const [x,y,z]=portal.at;
  assert.equal(y,1,'doorway must be at floor level');
  assert.ok(walk.has(key(x,1,z)),'door not on real walking space: '+JSON.stringify(portal));
  assert.ok(!solids.has(key(x,1,z))&&!solids.has(key(x,2,z)),'two-high source throat obstructed');
  const to=rooms.get(portal.to),from=rooms.get(portal.from);
  assert.ok(to,'unknown portal destination');
  assert.ok(portal.from==='outside'||from,'unknown source room');
  let aligned=false;
  for(const [dx,dz] of dir){
   const ax=x+dx,az=z+dz,bx=x-dx,bz=z-dz;
   if(!inside(to,ax,az))continue;
   const fromOkay=portal.from==='outside'
    ? bz===0 && bx===b.portals[0].at[0] && walk.has(key(bx,1,bz))
    : inside(from,bx,bz)&&walk.has(key(bx,1,bz));
   if(fromOkay&&walk.has(key(ax,1,az))){aligned=true;break;}
  }
  assert.ok(aligned,'source portal is not between declared rooms with physical walkable opposite cells: '+JSON.stringify(portal));
 }
 assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
});
test('Stonecrown ten source rooms retain at least one genuinely traversable internal cell',()=>{
 const [b]=getRoadmapC1AHousesWave18();
 const walk=b.walkable.filter(p=>p[1]===1);
 for(const r of b.rooms){
  assert.ok(walk.some(([x,y,z])=>inside(r,x,z)),
   'source room exists only as an unlived geometry label: '+r.id);
 }
});
