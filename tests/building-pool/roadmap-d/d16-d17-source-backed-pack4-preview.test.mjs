// Builder D read-only REAL original source Pack4 family physical-preview contract.
// Focuses 16 newly authored source buildings and does not run expensive WebGL2.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {inspectD16D17Pack4PhysicalSamples} from '../../../src/building-pool/roadmap-d/d16-d17-source-backed-pack4-preview.mjs';
const all=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
test('all 16 original D16–17 buildings select real Pack4 glazing mesh with authoritative per-facade orientation and two original pieces of furniture',()=>{
 assert.equal(all.length,16);let samples=0,fixtures=0,orientationDisagreements=0;
 for(const b of all){
  const before=b.cells.map(c=>c.at.join(',')+'|'+c.role+'|'+c.asset).join(';');
  const m=inspectD16D17Pack4PhysicalSamples(b,{resolvePack4Asset:pack4BuilderAsset,maxWindows:12});
  assert.equal(m.blueprintId,b.id);assert.equal(m.sampledPhysicalWindows.length,12);
  assert.ok(m.totalOriginalWindowOpenings>=12);
  assert.equal(m.sampledPhysicalFurniture.length,2);
  assert.deepEqual(new Set(m.sampledPhysicalFurniture.map(x=>x.originalNumericId)),new Set([171,172]));
  assert.ok(m.sampledPhysicalWindows.every(w=>w.originalNumericId===159&&w.renderableOriginalMesh&&w.physicalVisibleBoxes>0&&w.physicalSelectionBoxes>0));
  assert.ok(m.sampledPhysicalFurniture.every(f=>f.renderableOriginalMesh&&f.physicalVisibleBoxes>0));
  assert.equal(m.exactPack4OriginalCandidateGeometry,true);
  assert.deepEqual([m.sourceSamplesOnly,m.fullFacadePhysicalMeshesAccepted,m.worldMountsVerified,m.creatorArtApproved,m.iphoneHomeScreenAccepted,m.productionRegistered,m.originalSourceCellsMutated],[true,false,false,false,false,false,false]);
  assert.equal(b.cells.map(c=>c.at.join(',')+'|'+c.role+'|'+c.asset).join(';'),before,'original source cells mutated by read-only preview');
  samples+=m.sampledPhysicalWindows.length;fixtures+=m.sampledPhysicalFurniture.length;
  orientationDisagreements+=m.sampledPhysicalWindows.filter(w=>w.sourceCellFacingIgnored).length;
 }
 assert.deepEqual([samples,fixtures],[192,32]);
 assert.ok(orientationDisagreements>=8,'source cell.facing default was mistaken for true authoritatively authored opening direction');
});
test('physical preview refuses unsupported source, missing original Pack4 resolver, too-large sample budget and fraudulent physical assets',()=>{
 const b=all[0];
 assert.throws(()=>inspectD16D17Pack4PhysicalSamples(b),/resolver/i);
 assert.throws(()=>inspectD16D17Pack4PhysicalSamples(b,{resolvePack4Asset:pack4BuilderAsset,maxWindows:100}),/bounded/i);
 const fake=()=>({id:159,ref:'pack4:030',visible:[],selection:[],hasRealPhysicalGeometry:true,registeredInLiveGame:false});
 assert.throws(()=>inspectD16D17Pack4PhysicalSamples(b,{resolvePack4Asset:fake}),/physical|legitimate/i);
 const ruined={...b,creatorApproved:true};
 assert.throws(()=>inspectD16D17Pack4PhysicalSamples(ruined,{resolvePack4Asset:pack4BuilderAsset}),/unregistered/i);
});
