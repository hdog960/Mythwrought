import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {createM1OriginalWorkshopPool,M1_ORIGINAL_TYPES} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {validateBlueprint,validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
const examples=createM1OriginalWorkshopPool();
const occupy=b=>new Set(b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3).join(','))));
const blocked=(cells,x,y,z)=>cells.has([x,y,z].join(','));
test('four original physical-coordinate M1 workshop exemplars, distinct categories and structures',()=>{
 assert.deepEqual(examples.map(x=>x.type),M1_ORIGINAL_TYPES);
 assert.equal(examples.length,4);
 assert.equal(validateAuthoredPool(examples).authored,4);
 assert.equal(new Set(examples.map(x=>x.id)).size,4);
 assert.equal(new Set(examples.map(x=>x.architecture.roofStyle)).size,4);
 for(const b of examples){
  assert.equal(b.biome,'temperate');assert.equal(b.size,'small');
  assert.equal(b.id,slotId(b.type,b.biome,b.size,1));
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  const v=validateBlueprint(b);
  assert.ok(v.coordinateCells>800,'actual contiguous physical coordinates required');
  assert.ok(b.spaces.length>=2&&b.features.length>=2&&b.openings.length>=1);
  assert.equal(b.modules.flatMap(m=>m.cells).length,v.coordinateCells);
  assert.ok(b.dependencies.length>=2);
 }
});
test('all new rooms have true TWO-wide corridor, three-cell headroom and a physical floor',()=>{
 for(const b of examples){
  const cells=occupy(b);
  const x=b.navigation.nodes[0].x,zStart=b.navigation.nodes[0].z;
  for(let z=2;z<=zStart;z++)for(let dx=0;dx<2;dx++){
   assert.ok(blocked(cells,x+dx,1,z),'deck under foot at '+b.id+' '+z);
   for(const y of [2,3,4])assert.ok(!blocked(cells,x+dx,y,z),'authored corridor blocked '+b.id+' '+[x+dx,y,z]);
  }
  for(const node of b.navigation.nodes){
   assert.ok(!blocked(cells,node.x,node.y,node.z));
   assert.ok(!blocked(cells,node.x+1,node.y+1,node.z));
   assert.ok(b.spaces.some(s=>s.accessNode===node.id)||node.id==='entry');
  }
 }
});
test('no duplicate physical occupancy or category palette-swap geometry',()=>{
 const signatures=new Set();
 for(const b of examples){
  const c=b.modules.flatMap(m=>m.cells);
  assert.equal(occupy(b).size,c.length);
  const raw=c.map(v=>v.slice(0,3).join(',')).sort().join('|');
  const signature=createHash('sha256').update(raw).digest('hex');
  assert.ok(!signatures.has(signature),'identical voxel massing');
  signatures.add(signature);
  assert.equal(b.modules.find(m=>m.role==='fixture').cells.length,2);
  assert.ok(b.architecture.structuralLoadApproved===false);
 }
});

test('new Pack 5 anvil and Pack 4 crate have source-authored variant, yaw and certified floor supports',()=>{
 const armorer=examples.find(b=>b.type==='armorer');
 const mining=examples.find(b=>b.type==='mining-workshop');
 for(const [b,symbol,variant] of [[armorer,'pack5:088','blackiron-horn'],[mining,'pack4:057',null]]){
  const cell=b.modules.flatMap(m=>m.cells).find(c=>c[3]===symbol);
  assert.ok(cell&&cell.length===5,'an installed physical variant needs explicit placement');
  assert.equal(cell[4].orientation,'north');
  if(variant!==null)assert.equal(cell[4].variant,variant);
  const a=resolveManualFivePackAsset(symbol,variant===null?{orientation:cell[4].orientation}:
    {orientation:cell[4].orientation,variant});
  assert.equal(a.builderResolvable,true);assert.equal(a.livePlaceable,false);
  const positions=occupy(b);
  assert.ok(a.occupiedOffsets.every(([dx,dy,dz])=>!positions.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(','))||dx===0&&dy===0&&dz===0));
  for(const [dx,dy,dz] of a.supportOffsets)
   assert.ok(positions.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(',')),
    'M1 fixture physical mounting requires an authored supporting block');
 }
});
