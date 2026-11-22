import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-2/schema.mjs';

// Named against the full Issue #117 inventory, NOT the currently unbuilt
// candidate implementations: biome130:044 = woven magical branch lattices,
// biome130:098 = mountain cliff-anchor fittings. These are *attachments*,
// not structural full-cell beams or stone masonry.
const PREVIOUSLY_MISUSED={
 'enchanted-forest': {wrong:'biome130:044',replacement:'pack2:015',regionWall:'biome130:096'},
 mountain:{wrong:'biome130:098',replacement:'pack1:005',regionWall:'pack1:002'}
};

function models(biome){return M1_REPRESENTATIVES.filter(b=>b.biome===biome)}

test('all twelve fantasy-forest and cliff buildings use appropriate manufactured support candidate rosters',()=>{
 for(const [biome,rule] of Object.entries(PREVIOUSLY_MISUSED)){
  const all=models(biome);
  assert.equal(all.length,6);
  for(const bp of all){
   const supports=bp.voxels.filter(v=>v.material===rule.replacement&&['wall','roof','fixture'].includes(v.kind));
   assert(supports.length>50,`missing actual authored support geometry: ${bp.id}`);
   assert.equal(bp.voxels.some(v=>v.material===rule.wrong),false,`partial-volume attachment used in full-cell structure: ${bp.id}`);
   assert(bp.voxels.some(v=>v.material===rule.regionWall&&v.kind==='wall'),`lost region structural wall identity: ${bp.id}`);
   assert(bp.unresolvedDependencies.some(d=>d.ref===rule.replacement&&d.issue),`missing explicit support ABI risk: ${bp.id}`);
   assert(!bp.unresolvedDependencies.some(d=>d.ref===rule.wrong),`stale orphaned attachment roster dependency: ${bp.id}`);
   assert.equal(validateBlueprint(bp).valid,true);
  }
 }
});

test('regional foundation, floor, wall, roof and distinct architecture survive semantic support repair',()=>{
 const expected={
   'enchanted-forest':{foundation:'biome130:038',floor:'pack2:013',wall:'biome130:096',roof:'pack3:026'},
   mountain:{foundation:'biome130:047',floor:'pack1:005',wall:'pack1:002',roof:'pack3:025'}
 };
 for(const [biome,parts] of Object.entries(expected))for(const bp of models(biome)){
  const symbols=new Set(bp.voxels.map(v=>`${v.kind}:${v.material}`));
  for(const [kind,material] of Object.entries(parts))
   assert(symbols.has(`${kind}:${material}`),`missing ${kind} ${material} at ${bp.id}`);
  assert(bp.voxels.length>500,`truncated authored structure: ${bp.id}`);
  assert.equal(bp.worldPlaced,false);assert.equal(bp.numericIdsAssigned,false);
 }
});
