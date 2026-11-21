// M7 enchanted-forest screenshot ground-material provenance — original source.
// This does not mutate source gameplay, player saves, scenery or biome boundaries.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,BLOCK} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G,environmentGround} from '../../src/environment-ground.mjs';

const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceBlob=execFileSync('git',['hash-object','src/manual-biomes/environment-v7.mjs'],{encoding:'utf8'}).trim();
const seed=7919,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const scenes=[
  {name:'landmark-camera',point:[-74,-585],radius:26},
  {name:'landmark-target',point:[-56,-568],radius:26},
  {name:'forest-interior-camera',point:[-24,-537],radius:26},
  {name:'forest-interior-target',point:[0,-512],radius:26}
];
const materialIds=[BLOCK.GRASS,G.woodlandLoam,G.woodlandPeat,G.woodlandMoss];
const materials=Object.fromEntries(materialIds.map(id=>[id,
  id===BLOCK.GRASS?{name:'Original Plains Grass',color:null}:environmentGround(id)]));
const samples=[];
function surface(x,z){
  const biome=v6BiomeAt(x,z,seed),old=terrainHeight(x,z,seed),
    plan=world._columnPlan(x,z),top=plan.size?Math.max(...plan.keys()):old,
    id=world.naturalAndLandmarkBlock(x,top,z);
  return {x,z,biome:biome?.name??'plains',weight:biome?.weight??0,
    top,old,id,planSize:plan.size};
}
for(const scene of scenes){
  const [cx,cz]=scene.point,counts={},fullCounts={},site=[],all=[];
  for(let z=cz-scene.radius;z<=cz+scene.radius;z+=2)
    for(let x=cx-scene.radius;x<=cx+scene.radius;x+=2){
      const v=surface(x,z);all.push(v);
      fullCounts[v.id]=(fullCounts[v.id]??0)+1;
      if(v.biome==='enchanted'&&v.weight>=.70){
        counts[v.id]=(counts[v.id]??0)+1;
        if(v.id===BLOCK.GRASS)site.push(v);
      }
    }
  const center=surface(cx,cz);
  const chain=[];
  for(const p of [[-74,-585],[-72,-583],[-70,-580],[-66,-576],[-62,-572],[-58,-568],[-56,-568],[-24,-537],[0,-512]])
    chain.push(surface(...p));
  const interior=Object.values(counts).reduce((a,b)=>a+b,0);
  samples.push({...scene,center,interiorCount:interior,counts,fullCounts,
    interiorGrassWitnesses:site.slice(0,12),landmarkCameraToTargetChain:chain,
    mossShareInEnchantedInterior:interior?+(100*(counts[G.woodlandMoss]??0)/interior).toFixed(2):0,
    groundMap:all.map(v=>({x:v.x,z:v.z,id:v.id,weight:+v.weight.toFixed(3),
      top:v.top,planSize:v.planSize,biome:v.biome}))});
}
assert.equal(samples.length,4);
for(const scene of samples){
  assert.ok(scene.interiorCount>400,'did not sample real enchanted interior');
  assert.equal(scene.interiorGrassWitnesses.length,0,'original GRASS in enchanted interior');
}
const report={
 kind:'mythwrought-enchanted-real-ground-color-provenance-v1',head,sourceBlob,
 seed,generator:M7_ENVIRONMENT_GENERATOR,
 sourceMaterialColors:materials,
 screenshotRealRun:44954690614,screenshotWebgl2Head:'d56982944e229637ce964ce55f7405cb4a42d9ba',
 cameraMovedForEvidence:true,observedPixelToBlockProjection:false,
 // Ground samples are original voxel IDs and deterministic coordinates;
 // they are NOT a claim that a chosen pixel can be ray-inverted from the screenshot.
 scenes:samples
};
mkdirSync('artifacts/enchanted-forest',{recursive:true});
writeFileSync('artifacts/enchanted-forest/phase1-ground-color-provenance.json',
 JSON.stringify(report,null,2)+'\n');
console.log('ENCHANTED GROUND COLOR PROVENANCE '+JSON.stringify({
 head,seed,sourceBlob,sourceMaterialColors:materials,
 scenes:samples.map(({name,center,interiorCount,counts,fullCounts,
  mossShareInEnchantedInterior,landmarkCameraToTargetChain})=>({
  name,center,interiorCount,counts,fullCounts,mossShareInEnchantedInterior,
  landmarkCameraToTargetChain:name==='landmark-camera'?landmarkCameraToTargetChain:undefined
 }))
}));
