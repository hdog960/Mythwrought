import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {censusMountainV8Tiles as census}
  from '../src/manual-biomes/mountain-v8-tile-census.mjs';
import {auditMountainV8IntegrationHandoff as handoff,
  MOUNTAIN_V8_HANDOFF_REQUIREMENTS as required}
  from '../src/manual-biomes/mountain-v8-integration-handoff.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';
import {FULL_CUBE,validateShape} from '../src/voxel-shape-interactions.mjs';

const ATLASES=Object.freeze([
  [179,-88,24],[179,-80,-8],[2026,-48,-8],[2026,-80,-24]
]);
test('genuine original-world material handoff preserves 112 source sites and does not register IDs',()=>{
  const rows=[];
  for(const [seed,tileX,tileZ] of ATLASES){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const result=census({seed,tileX,tileZ,width:8,height:8,world});
    assert.ok(result);
    assert.equal(JSON.stringify(world.save()),before);
    assert.equal(world.edits.size,0);
    assert.equal(world.rotations.size,0);
    rows.push({seed,tileX,tileZ,stats:result.stats});
  }
  const out=handoff(rows);
  assert.ok(out);
  assert.equal(out.sitesAudited,256);
  assert.equal(out.sourceAcceptedSites,112);
  assert.equal(out.sourceRejectedSites,115);
  assert.deepEqual(out.counters,{
    tiles:256,accepted:112,rejected:115,seamRejected:29,
    terrainRejected:0,terrainCells:1089,plantCells:40,plantSites:9,
    originalV8SeamFaces:51,fullCubeProxyFaces:4724,
    fullCubeProxyBytes:1020384,fullCubeNaiveBytes:1463184,
    internalPairs:1025
  });
  assert.deepEqual(Object.fromEntries(out.materials.map(m=>
    [m.material,m.originalSourceCells])),{
    stone:927,dirt:50,snow:61,'alpine-grass':25,
    slate:15,gneiss:4,scree:7,
    flower:3,'flower-petal':3,heather:4,'heather-tip':4,
    'conifer-trunk':6,'conifer-needles':20
  });
  assert.equal(out.terrainDescriptorKinds,7);
  assert.equal(out.floraDescriptorKinds,6);
  assert.equal(out.numericalV8IdsAssigned,0);
  assert.equal(out.proposedV8BlockMapping,null);
  assert.equal(out.integrationReady,false);
  assert.equal(out.safeToIntegrate,false);
  assert.equal(out.fullCubeProxyOnly,true);
  assert.equal(out.measuredGPUBytes,null);
  assert.equal(out.inGameCollisionVerified,false);
  assert.equal(out.inGameRaycastVerified,false);
  assert.equal(out.inGameMiningVerified,false);
  assert.equal(out.iphonePwaAccepted,false);
  assert.equal(out.baselineIdSources.pack2RegisteredCount,18);
  assert.equal(out.baselineIdSources.biome130RegisteredCount,130);
  assert.deepEqual(out.baselineIdSources.existingM7GroundIds,
    [400,401,402,403,404,405,406,407,408,409,410]);
  assert.equal(out.baselineIdSources.knownOccupiedOrSentinelCount,170);
  assert.equal(out.baselineIdSources.incompleteOtherOwnerNamespaceAudit,true);
  assert.equal(required.length,7);
  assert.ok(validateShape(FULL_CUBE));
  assert.ok(out.materials.slice(0,7).every(m=>
    m.kind==='solid-cube-terrain'&&m.shapeContract==='FULL_CUBE'));
  assert.ok(out.materials.slice(7).every(m=>
    m.kind==='unapproved-physical-flora'&&
    m.shapeContract==='UNRESOLVED_AUTHORED_NONCUBE'));
  assert.ok(Object.isFrozen(out.materials));
  assert.ok(Object.isFrozen(out.counters));
  assert.equal(Object.keys(MOUNTAIN_V8_PLANT_PATTERNS).length,3);
  console.log('MOUNTAIN V8 ORIGINAL PHYSICAL INTEGRATION HANDOFF '+
    JSON.stringify(out));
});
test('handoff rejects forged budgets, missing materials and duplicate atlas identity',()=>{
  const world=new VoxelWorld(179),data=census({
    seed:179,tileX:-88,tileZ:24,width:8,height:8,world});
  assert.ok(data);
  const row={seed:179,tileX:-88,tileZ:24,stats:data.stats};
  assert.ok(handoff([row]));
  assert.equal(handoff([row,row]),null);
  assert.equal(handoff([]),null);
  assert.equal(handoff(Array(5).fill(row)),null);
  assert.equal(handoff([{...row,seed:179.5}]),null);
  const invalid=[
    {fullCubeProxyBytes:row.stats.fullCubeProxyBytes+216},
    {fullCubeNaiveBytes:row.stats.fullCubeNaiveBytes+1296},
    {physicalDescriptorSites:row.stats.physicalDescriptorSites-1},
    {sourceBudgetExhausted:1},
    {plantCells:row.stats.plantCells+19},
    {terrainCells:row.stats.terrainCells+19},
    {seamExposedFaces:row.stats.seamExposedFaces+1},
    {physicalMaterialCells:{...row.stats.physicalMaterialCells,other:1}},
    {physicalMaterialCubeFaces:{...row.stats.physicalMaterialCubeFaces,stone:-1}}
  ];
  for(const changed of invalid)
    assert.equal(handoff([{...row,stats:{...row.stats,...changed}}]),null);
});
