// Original M7 oasis-water/cave-source/shoreline and exact original accepted
// rendering provenance. No synthetic oasis plans or changed game source.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,
 M7_ENVIRONMENT_GENERATOR as M7} from '../src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as AcceptedWorld,fourRegionProfile as acceptedProfile}
 from '../../accepted/src/manual-biomes/profile-world.mjs';
import {meshChunk,chunkCoord,BLOCK,worldKey} from '../src/voxel.mjs';
import {meshChunk as acceptedMesh} from '../../accepted/src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2WaterSectionVertices} from '../src/pack2-integration.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {oasisSites,OASIS_WATER,nearOasisSite} from '../src/manual-biomes/environment-oasis.mjs';
import {canBlendNaturalDesertSurface} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
import {canWarmSourceScree,canUseDesertHardpanCue} from '../src/manual-biomes/desert-bilateral-rgb.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';

const S=[179,2026,4099,701];
const CENTERS=[-3,-2,-1,0,1,2,3];
const report={seedList:S,desertTileCenters:0,sourceSiteProbes:0,
 acceptedSourceOases:0,originalWaterCells:0,originalShoreColumns:0,
 noOasisSites:0,selectionSourceVetoes:0,sites:[]};
let winner=null;
test('source-generated M7 Desert oasis census uses real V6 centers and original protected natural source',()=>{
 for(const seed of S){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  let perSeed=0,probes=0,admitted=0;
  outer:
  for(const tx of CENTERS)for(const tz of CENTERS){
   const x=tx*512,z=tz*512;
   const core=v6BiomeAt(x,z,seed);
   if(core?.name!=='desert'||core.weight<.9)continue;
   perSeed++;report.desertTileCenters++;
   const sites=oasisSites(core.center,seed);
   assert.equal(sites.length,4);
   for(const [sx,sz] of sites){
    const actualClimate=v6BiomeAt(sx,sz,seed);
    if(actualClimate?.name!=='desert')continue;
    assert.equal(nearOasisSite(oasisSites(actualClimate.center,seed),sx,sz),true);
    probes++;report.sourceSiteProbes++;
    const original=w._oasisNear(sx,sz,0,actualClimate);
    if(!original){report.noOasisSites++;continue;}
    if(!original.water?.length||!original.columns?.size)continue;
    admitted++;report.acceptedSourceOases++;
    report.originalWaterCells+=original.water.length;
    report.originalShoreColumns+=original.shore.length;
    const [wx,wy,wz]=original.center;
    const water=original.water[0],waterKey=worldKey(water[0],water[1],water[2]);
    const snap={seed,biomeCenter:actualClimate.center,waterCenter:[wx,wy,wz],
      sourceWaterCells:original.water.length,shoreColumns:original.shore.length,
      firstWater:water.slice(0,3),sourceColumn:original.columns.has(water[0]+','+water[2])};
    report.sites.push(snap);
    assert.equal(original.columns.get(water[0]+','+water[2])?.get(water[1]),OASIS_WATER.id);
    assert.equal(w.environmentWaterState(...water.slice(0,3))?.id,OASIS_WATER.id);
    assert.equal(w.get(...water.slice(0,3)),OASIS_WATER.id);
    if(!winner)winner={seed,point:water.slice(0,3),center:[wx,wy,wz],tile:actualClimate.center};
    // An original authored oasis was found; avoid redundant expensive
    // original plans in this seed. Other seeds retain independent coverage.
    break outer;
   }
  }
  assert.ok(w.cachedBiomeColumns<=1024);
  assert.deepEqual(w.save().edits,[]);
  console.log('DESERT_P3_OASIS_SEED '+JSON.stringify({seed,desertTileCenters:perSeed,
    probedOriginalSiteCoords:probes,originalOasesAdmitted:admitted,
    sourceCacheColumns:w.cachedBiomeColumns}));
 }
 assert.ok(report.desertTileCenters>0&&report.sourceSiteProbes>0);
 console.log('DESERT_P3_OASIS_SOURCE_CENSUS '+JSON.stringify(report));
});

test('actual oasis-water protected source is not promoted to Desert hardpan/scree and player edits preserve canonical save',()=>{
 // The search above is deliberately real and bounded. If no oasis was
 // admitted by the ORIGINAL generator, do not invent a non-source oasis.
 if(!winner){
  console.log('DESERT_P3_OASIS_NO_AUTHENTIC_WATER '+JSON.stringify({
   sourceSiteProbes:report.sourceSiteProbes,
   conclusion:'No fabricated positive oasis; full live-oasis assertions explicitly not established'}));
  assert.ok(report.sourceSiteProbes>0);
  return;
 }
 const {seed,point:[x,y,z],center,tile}=winner,profile=fourRegionProfile(seed,M7);
 const w=new FourRegionWorld(seed,profile);
 const p=w._columnPlan(x,z),source=p.size?{top:Math.max(...p.keys()),
   id:p.get(Math.max(...p.keys()))}:null;
 assert.equal(w.get(x,y,z),OASIS_WATER.id);
 assert.equal(w.environmentWaterState(x,y,z)?.id,OASIS_WATER.id);
 assert.equal(p.get(y),OASIS_WATER.id);
 assert.equal(canBlendNaturalDesertSurface({
  id:258,edited:false,region:v6BiomeAt(x,z,seed),sourceSurface:source,y}),false);
 assert.equal(canWarmSourceScree({
  id:401,edited:false,region:v6BiomeAt(x,z,seed),sourceSurface:source,y}),false);
 assert.equal(canUseDesertHardpanCue({sourceSurface:source,region:v6BiomeAt(x,z,seed),
  edited:false,actualId:258,atY:y,sampleY:y}),false);
 const old=editAffectedChunks(x,z),batch=desertSeamEditAffectedChunks(w,x,z,y);
 assert.deepEqual(batch,old,'Natural oasis WATER cannot invoke Desert color-only refresh');
 const cx=chunkCoord(x),cz=chunkCoord(z),wrapped=new Pack2LiveWorld(w);
 const baseline=meshChunk(w,cx,cz);
 const originalSource=new AcceptedWorld(seed,acceptedProfile(seed,M7));
 assert.deepEqual(baseline,acceptedMesh(originalSource,cx,cz),
  'Original oasis terrain and water-adjacent opaque source must match accepted game');
 const fluid=pack2WaterSectionVertices(wrapped,cx,cz,0);
 assert.ok(fluid.length>0,'Authentic original oasis fluid must reach the real Pack2 mesh composer');
 assert.equal(fluid.length%9,0);
 const entries=w.environmentOasisWaterEntries(cx,cz);
 assert.ok(entries.some(([key,s])=>key===worldKey(x,y,z)&&s.id===OASIS_WATER.id));
 assert.ok(w.set(x,y,z,BLOCK.AIR));
 assert.ok(w.edits.has(worldKey(x,y,z)));
 assert.equal(w.get(x,y,z),BLOCK.AIR);
 assert.equal(w.environmentWaterState(x,y,z),null);
 assert.equal(w.environmentOasisWaterEntries(cx,cz).some(([key])=>key===worldKey(x,y,z)),false);
 assert.equal(canBlendNaturalDesertSurface({
  id:258,edited:true,region:v6BiomeAt(x,z,seed),sourceSurface:source,y}),false);
 assert.equal(canWarmSourceScree({
  id:401,edited:true,region:v6BiomeAt(x,z,seed),sourceSurface:source,y}),false);
 const save=w.save(),reload=restoreFourRegionWorld(save,profile);
 assert.equal(save.edits.length,1);
 assert.deepEqual(reload.save().edits,save.edits);
 assert.equal(reload.get(x,y,z),BLOCK.AIR);
 assert.deepEqual(pack2WaterSectionVertices(new Pack2LiveWorld(reload),cx,cz,0),
  pack2WaterSectionVertices(wrapped,cx,cz,0));
 assert.ok(w.set(x,y,z,OASIS_WATER.id));
 assert.deepEqual(w.save().edits,[]);
 assert.deepEqual(meshChunk(w,cx,cz),baseline);
 assert.deepEqual(pack2WaterSectionVertices(wrapped,cx,cz,0),fluid);
 console.log('DESERT_P3_OASIS_ORIGINAL_WATER_SAVE '+JSON.stringify({
  seed,center,tile,originalWater:[x,y,z],tag:OASIS_WATER.id,
  originalChunk:[cx,cz],opaqueVertexBytes:baseline.byteLength,
  waterVertexBytes:fluid.byteLength,fluidEntries:entries.length,
  savedEditRowsAfterEdit:save.edits.length,savedEditRowsAfterUndo:0,
  acceptedSourceOpaqueFloat32Parity:true,
  note:'genuine accepted environmental water and source-only disposable save test'}));
});
