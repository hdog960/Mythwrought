import test from 'node:test';
import assert from 'node:assert/strict';
import {createCSunbarrowCaravanGatehouse} from '../../../src/building-pool/roadmap-3b/c5-sunbarrow-desert-gatehouse.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {validateGatehouseTopology} from '../../../src/building-pool/roadmap-3b/fortification-topology.mjs';

const b=createCSunbarrowCaravanGatehouse(),k=(x,y,z)=>[x,y,z].join(',');
const solids=new Map(b.modules.flatMap(m=>m.cells.map(c=>[k(c[0],c[1],c[2]),m.role])));
const has=(x,y,z)=>solids.has(k(x,y,z));
const walk=(x,z)=>has(x,0,z)&&has(x,1,z)&&[2,3,4].every(y=>!has(x,y,z));

test('C5 original Sunbarrow gate has true unique C-only desert small gatehouse source, 3535 occupied voxels and six physical guarding spaces',()=>{
 assert.equal(b.id,'r3:gatehouse:desert:small:1');
 assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
 assert.equal(validateBlueprint(b,ASSET_CATALOG).cellCount,3535);
 assert.equal(b.modules.find(m=>m.role==='foundation').cells.length,881);
 assert.equal(b.modules.find(m=>m.role==='stair').cells.length,10);
 assert.equal(b.spaces.length,7);
 assert.equal(b.architecture.carriageWidth,3);
 assert.equal(b.architecture.carriageLength,34);
 assert.equal(b.architecture.gameRegistered,false);
 assert.equal(geometryFingerprint(b),geometryFingerprint(createCSunbarrowCaravanGatehouse()));
 const topo=validateGatehouseTopology(b);
 assert.equal(topo.clearCells,102);assert.equal(topo.routeSteps,34);
});
test('C5 the entire real 34-long wagon corridor is three-wide, solid-floor, true 3-high air, with both flank-bearing posts and central lintel',()=>{
 for(let z=0;z<34;z++)for(let x=17;x<=19;x++)
  assert.ok(walk(x,z),'wagon corridor is a fake token '+k(x,2,z));
 for(let x of [16,20])for(let y=0;y<=5;y++)
  assert.ok(has(x,y,17),'physically missing central gate flank '+k(x,y,17));
 for(let x=17;x<=19;x++)assert.ok(has(x,5,17),'missing real massive arch above passage '+x);
 assert.equal(b.openings[0].facing,'north');
 assert.equal(b.openings[1].facing,'south');
 assert.equal(b.openings[0].width,3);assert.equal(b.openings[1].width,3);
});
test('C5 both three-by-three cooling courts really lack ALL source foundations, floors, roofs, and added fixtures',()=>{
 for(const p of b.fortification.coolingCourts)
  for(let x=p.x0;x<=p.x1;x++)for(let z=p.z0;z<=p.z1;z++)
   for(let y=0;y<b.envelope.height;y++)assert.ok(!has(x,y,z),'decorative but not actual empty sky court '+k(x,y,z));
});
test('C5 every ground-level guard post and rear gate is physically reachable from north via contiguous three-high source air',()=>{
 const start=[17,0],q=[start],vis=new Set([start.join(',')]);
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const xx=x+dx,zz=z+dz,p=xx+','+zz;
   if(!vis.has(p)&&walk(xx,zz)){vis.add(p);q.push([xx,zz]);}
  }
 }
 for(const n of b.navigation.nodes.filter(x=>x.y===2)){
  assert.ok(vis.has(n.x+','+n.z),'fake navigation adjacency '+n.id);
  assert.ok(walk(n.x+1,n.z),'required second clear path column blocked '+n.id);
 }
 assert.ok(q.length>150);
});
test('C5 five literal two-wide stair treads each bear on real source masonry and have no upper head collisions',()=>{
 for(let i=0;i<5;i++)for(let x=13;x<=14;x++){
  const z=26+i,top=2+i;
  assert.equal(solids.get(k(x,top,z)),'stair','missing physically installed step');
  for(let y=0;y<top;y++)assert.ok(has(x,y,z),'floating stair support '+k(x,y,z));
  for(let y=top+1;y<=top+3;y++)assert.ok(!has(x,y,z),'false stair headroom '+k(x,y,z));
 }
 assert.ok(has(13,6,31)&&!has(13,7,31)&&!has(13,8,31),'false supported landing');
});
test('C5 real gate collision corruption or missing flank must be rejected, not hidden behind schema metadata',()=>{
 const blocked=structuredClone(b);
 blocked.modules.find(m=>m.role==='gate-arch').cells.push([17,2,17,'pack3:069']);
 assert.throws(()=>validateGatehouseTopology(blocked),/blocked physical gateway/);
 const damaged=structuredClone(b);
 const wall=damaged.modules.find(m=>m.role==='wall');
 wall.cells=wall.cells.filter(c=>!(c[0]===16&&c[1]===3&&c[2]===17));
 assert.throws(()=>validateGatehouseTopology(damaged),/unanchored physical gate flanking post/);
});
