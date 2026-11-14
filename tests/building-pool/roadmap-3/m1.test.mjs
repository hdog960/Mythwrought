import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-3/roster.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3/assets.mjs';
import {validatePool,validateBlueprint,serializeBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3/contract.mjs';
import {createM1Blueprint,createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
const pool=createM1Pool();
const coord=([x,y,z])=>`${x},${y},${z}`;
const occupied=b=>new Set(b.modules.flatMap(m=>m.cells.map(coord)));
const walkable=(b,solid,x,y,z)=>{
 if(x<0||z<0||y<2||x+1>=b.envelope.width||z>=b.envelope.depth||y+1>=b.envelope.height)return false;
 for(const dx of [0,1]){
  if(solid.has(`${x+dx},${y},${z}`)||solid.has(`${x+dx},${y+1},${z}`))return false;
  if(!solid.has(`${x+dx},${y-1},${z}`))return false;
 }
 return true;
};
// This independent grid flood checks authored 2-voxel-wide clearance + support at every footfall;
// graph reachability alone is not sufficient to demonstrate a physical traversable route.
function reachable(b){
 const solid=occupied(b),start=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(walkable(b,solid,start.x,start.y,start.z),`${b.id} spawn/entry blocked`);
 const found=new Set([coord([start.x,start.y,start.z])]),front=[[start.x,start.y,start.z]];
 for(let head=0;head<front.length;head++){
  const [x,y,z]=front[head];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
   const [nx,ny,nz]=[x+dx,y+dy,z+dz],key=coord([nx,ny,nz]);
   if(!found.has(key)&&walkable(b,solid,nx,ny,nz)){
    // A change in height needs a corresponding stepped tread (at the ascending destination)
    // rather than assuming an instant teleport to a distant level.
    if(dy!==0&&!b.modules.some(m=>m.role==='stair'&&m.cells.some(([sx,sy,sz])=>sx>=nx&&sx<nx+2&&sy===ny-1&&sz===nz)))continue;
    found.add(key);front.push([nx,ny,nz]);
   }
  }
 }
 for(const n of b.navigation.nodes)assert.ok(found.has(coord([n.x,n.y,n.z])),`${b.id}: ${n.id} has no supported physical walking path`);
 return found.size;
}
test('M1 physically authors 30 exact allocated category × biome × size designs',()=>{
 assert.equal(pool.length,30);
 assert.deepEqual([['blacksmith',15],['watchtower',15]],['blacksmith','watchtower'].map(type=>[type,pool.filter(p=>p.type===type).length]));
 assert.equal(new Set(pool.map(b=>b.id)).size,30);
 for(const biome of BIOMES)for(const size of SIZES){
  assert.equal(pool.filter(b=>b.biome===biome&&b.size===size).length,2);
  for(const type of ['blacksmith','watchtower'])assert.equal(pool.filter(b=>b.biome===biome&&b.size===size&&b.type===type).length,1);
 }
 assert.deepEqual(validatePool(pool,ASSET_CATALOG),{authored:30,remaining:675});
});
test('all 30 include substantial real coordinate geometry in foundation/floor/wall/roof',()=>{
 for(const b of pool){
  const stats=validateBlueprint(b,ASSET_CATALOG),rs=new Set(b.modules.map(m=>m.role));
  assert.ok(stats.cellCount>800,`${b.id} too few authored physical cells`);
  assert.ok(['foundation','floor','wall','roof'].every(r=>rs.has(r)),b.id);
  assert.equal(stats.cellCount,b.architecture.physicalCellSlots,b.id);
  assert.ok(b.spaces.length>=2&&b.openings.length>=1,b.id);
  assert.equal(b.activated,false);
  assert.match(b.implementation,/CONCEPT_ONLY/);
 }
});
test('blacksmiths have explicit forge, working/anvil, fuel separation, stock and chimney',()=>{
 for(const b of pool.filter(b=>b.type==='blacksmith')){
  for(const name of ['forge-mouth','anvil','non-operational bench','chimney ventilation','fuel separation'])assert.ok(b.features.some(f=>f.name===name),`${b.id} missing ${name}`);
  assert.ok(b.modules.some(m=>m.cells.some(c=>c[3]==='pack5:088')),b.id);
  assert.ok(b.modules.some(m=>m.cells.some(c=>c[3]==='pack4:063')),b.id);
  assert.ok(b.spaces.some(s=>s.kind==='forge')&&b.spaces.some(s=>s.kind==='storage'),b.id);
  assert.equal(b.navigation.nodes.some(n=>n.y!==2),false,b.id);
 }
});
test('every watchtower has supported unit-step vertical circulation and a walkable observation deck',()=>{
 for(const b of pool.filter(b=>b.type==='watchtower')){
  assert.ok(b.modules.some(m=>m.role==='stair'),b.id);
  assert.equal(b.navigation.edges.filter(e=>e.kind==='stair').length,b.architecture.stairSteps-1,b.id);
  assert.ok(b.navigation.nodes.some(n=>n.kind==='observation'),b.id);
  assert.ok(b.modules.some(m=>m.role==='battlement'),b.id);
  assert.ok(b.spaces.some(s=>s.kind==='observation'),b.id);
 }
});
test('genuine two-wide supported voxel-grid reachability from every entrance to all workspaces and observation decks',()=>{
 for(const b of pool)assert.ok(reachable(b)>40,`${b.id} trivial/blocked route`);
});
test('no occupied solid cell lies in any declared two-voxel-high clearance region',()=>{
 for(const b of pool){
  const set=occupied(b);
  for(const c of b.clearances)for(let x=c.x;x<c.x+c.width;x++)for(let y=c.y;y<c.y+c.height;y++)for(let z=c.z;z<c.z+c.depth;z++)
    assert.equal(set.has(coord([x,y,z])),false,`${b.id} clearance intersects ${x},${y},${z}`);
 }
});
test('all architectural fingerprints are unique even without material, room names or biome metadata',()=>{
 const signatures=pool.map(geometryFingerprint);
 assert.equal(new Set(signatures).size,30);
 for(const type of ['blacksmith','watchtower'])for(const size of SIZES){
  const styles=pool.filter(b=>b.type===type&&b.size===size);
  assert.equal(new Set(styles.map(b=>b.architecture.roofStyle)).size,5);
  assert.equal(new Set(styles.map(geometryFingerprint)).size,5);
 }
});
test('canonical source serialization reproduces byte-identical coordinate lists without random or time inputs',()=>{
 const regenerated=createM1Pool();
 for(let i=0;i<pool.length;i++)assert.equal(serializeBlueprint(pool[i]),serializeBlueprint(regenerated[i]));
});
test('all forward-looking physical family references remain symbolic, with no fabricated persistent IDs or asset dimensions',()=>{
 for(const b of pool)for(const m of b.modules)for(const c of m.cells){
  const a=ASSET_CATALOG[c[3]];assert.ok(a,`${b.id} unknown ${c[3]}`);
  if(a.kind==='planned'){assert.equal(a.dimensions,null);assert.equal(a.persistentId,null);}
 }
});
test('size changes increase authored occupied volume for each region and type',()=>{
 for(const biome of BIOMES)for(const type of ['blacksmith','watchtower']){
  const stats=SIZES.map(size=>createM1Blueprint(type,biome,size).architecture.physicalCellSlots);
  assert.ok(stats[0]<stats[1]&&stats[1]<stats[2],`${type} ${biome} lacks scale variation: ${stats}`);
 }
});
test('invalid sizes, regions or deferred building families cannot be counted as M1',()=>{
 assert.throws(()=>createM1Blueprint('blacksmith','volcano','small'),/unknown biome/);
 assert.throws(()=>createM1Blueprint('watchtower','desert','giant'),/unknown size/);
 assert.throws(()=>createM1Blueprint('mill','temperate','small'),/M1 only/);
});
