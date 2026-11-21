import test from 'node:test';
import assert from 'node:assert/strict';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryBlueprint,createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {validateBlueprint,validatePool,geometryFingerprint,serializeBlueprint}
 from '../../../src/building-pool/roadmap-3b/contract.mjs';

const originals=createM2IndustryPool(),positions=b=>new Set(b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3).join(','))));
const key=(x,y,z)=>[x,y,z].join(',');
function footprintWalk(b,occ,x,y,z){
 if(x<0||x+1>=b.envelope.width||z<0||z>=b.envelope.depth||y<2)return false;
 for(const a of [x,x+1])if(occ.has(key(a,y,z))||occ.has(key(a,y+1,z))||!occ.has(key(a,y-1,z)))return false;
 return true;
}
function physicalReach(b){
 const occ=positions(b),entry=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(footprintWalk(b,occ,entry.x,entry.y,entry.z),b.id+' blocked entry');
 const queue=[[entry.x,entry.y,entry.z]],seen=new Set([key(entry.x,entry.y,entry.z)]);
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=key(nx,y,nz);
   if(!seen.has(k)&&footprintWalk(b,occ,nx,y,nz)){seen.add(k);queue.push([nx,y,nz]);}
  }
 }
 for(const n of b.navigation.nodes)
  assert.ok(seen.has(key(n.x,n.y,n.z)),b.id+' physically inaccessible '+n.id);
 return seen;
}
function foundationConnectivity(b){
 const cells=b.modules.flatMap(m=>m.cells.map(c=>[...c.slice(0,3),m.role]));
 const lookup=new Map(cells.map(c=>[key(...c.slice(0,3)),c]));
 const reached=new Set(),queue=[];
 for(const c of cells)if(c[3]==='foundation'){
  const k=key(...c.slice(0,3));reached.add(k);queue.push(c);
 }
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const k=key(x+dx,y+dy,z+dz);
   if(lookup.has(k)&&!reached.has(k)){reached.add(k);queue.push(lookup.get(k));}
  }
 }
 assert.equal(reached.size,cells.length,b.id+' floating or orphan roof/structure');
}
test('M2 adds two original, full-coordinate Temperate Small industry designs without altering 15 inherited towers',()=>{
 assert.deepEqual(originals.map(b=>b.id),['r3:lumberyard:temperate:small:1','r3:mill:temperate:small:1']);
 assert.deepEqual(originals.map(b=>b.type),['lumberyard','mill']);
 assert.equal(createLegacyWatchtowerPool().length,15);
 assert.deepEqual(validatePool([...createLegacyWatchtowerPool(),...originals],ASSET_CATALOG),{authored:17,remaining:343});
 assert.equal(new Set([...createLegacyWatchtowerPool(),...originals].map(geometryFingerprint)).size,17);
 for(const b of originals){
  assert.equal(b.activated,false);assert.equal(b.status,'theoretical');
  assert.equal(b.architecture.authorship,'M2 original coordinate design');
  assert.equal(b.architecture.worldPlaced,false);
  assert.equal(b.architecture.variantDeclared,false);
  assert.equal(b.architecture.orientationDeclared,false);
  assert.match(b.implementation,/SOURCE_ONLY/);
 }
});
test('M2 industry candidates have substantial unique physical-cell modules, rooms, entrances, fixtures and roof shells',()=>{
 assert.deepEqual(originals.map(b=>validateBlueprint(b,ASSET_CATALOG).cellCount),[1479,2703]);
 for(const b of originals){
  assert.deepEqual(new Set(b.modules.map(m=>m.role)).has('foundation'),true);
  for(const required of ['floor','wall','roof'])assert.ok(b.modules.some(m=>m.role===required),b.id+' '+required);
  assert.ok(b.spaces.length>=3&&b.features.length>=5&&b.openings.length===1);
  assert.equal(b.architecture.roofShellThickness,1);
  assert.equal(b.architecture.occupiedCoordinates,positions(b).size);
  assert.ok(b.modules.flatMap(m=>m.cells).some(c=>c[3].startsWith('pack')),b.id);
 }
 assert.equal(originals[0].architecture.kind,'three-bay lumberyard');
 assert.equal(originals[1].architecture.kind,'partitioned gable millhouse');
 assert.ok(originals[0].spaces.some(s=>s.kind==='cart-loading-bay'));
 assert.ok(originals[1].spaces.some(s=>s.kind==='shaft-service'));
 assert.ok(originals[1].features.some(f=>f.name==='external-wheel-mount'&&f.assetRef===null));
 assert.equal(originals[1].architecture.wheelPower,'SYMBOLIC_ONLY');
});
test('two-wide accessible routes from actual physical gate cells to every authored work zone',()=>{
 const counts=originals.map(b=>physicalReach(b).size);
 assert.ok(counts[0]>250&&counts[1]>300,'not enough true traversable service space');
});
test('new roof strips, gable cores, fences, sheds and upper supports remain connected to actual foundations',()=>{
 for(const b of originals)foundationConnectivity(b);
});
test('M2 source layout and serialization are deterministic without palette-only false identities',()=>{
 const repeated=createM2IndustryPool();
 for(let i=0;i<originals.length;i++){
  assert.equal(serializeBlueprint(originals[i]),serializeBlueprint(repeated[i]));
  assert.equal(geometryFingerprint(originals[i]),geometryFingerprint(repeated[i]));
 }
 assert.notEqual(geometryFingerprint(originals[0]),geometryFingerprint(originals[1]));
});
test('unwritten M2 categories, sizes, variants and regions do not masquerade as authored blueprints',()=>{
 assert.throws(()=>createM2IndustryBlueprint('armorer'),/Unsupported/);
 assert.throws(()=>createM2IndustryBlueprint('lumberyard','snow','small',1),/Only two/);
 assert.throws(()=>createM2IndustryBlueprint('mill','temperate','medium',1),/Only two/);
 assert.throws(()=>createM2IndustryBlueprint('mill','temperate','small',2),/Only two/);
});
test('all 3B source-only industry assets stay catalogued, with unknown physical family state explicit',()=>{
 for(const b of originals){
  assert.ok(b.dependencies.some(s=>s.includes('orientation')),b.id);
  for(const m of b.modules)for(const [x,y,z,ref] of m.cells){
   assert.ok([x,y,z].every(Number.isSafeInteger));
   const a=ASSET_CATALOG[ref];assert.ok(a,ref);
   if(a.kind!=='existing'){assert.equal(a.dimensions,null);assert.equal(a.persistentId,null);}
  }
 }
});
