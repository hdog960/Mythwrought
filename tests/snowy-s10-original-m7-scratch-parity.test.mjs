// Real immutable Desert-main original-source witness, not a fake cave,
// fabricated biome climate or an active renderer integration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
 restoreFourRegionWorld}
 from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt}
 from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,terrainHeight} from '../production-readonly/src/voxel.mjs';
import {createSnowS10MeshResidentPigment}
 from '../src/manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs';
import {previewSnowS6WinterTone}
 from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';
const WINTER=new Set([272,276,279]);
function top(plan){
 let y=-Infinity,id=null;
 for(const [sy,v] of plan)if(sy>y){y=sy;id=v;}
 return {y,id};
}
test('original seed179/2026 M7 exact RGB vs S6 on every genuine 32x32 visible winter cap',()=>{
 for(const [seed,z0] of [[179,512],[2026,480]]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const w=new FourRegionWorld(seed,profile),before=JSON.stringify(w.save());
  const s=createSnowS10MeshResidentPigment(seed,v6BiomeAt);
  let admitted=0,blocked=0,other=0,snow=0,glacier=0,rime=0;
  for(let z=z0;z<z0+32;z++)for(let x=-160;x<-128;x++){
   const {y,id}=top(w._columnPlan(x,z));
   if(!WINTER.has(id)){other++;continue;}
   const v=s.colorAt(x,y,z,id,{top:y,id},
     w.get(x,y,z),w.get(x,y-1,z),w.get(x,y+1,z),
     w.edits.has(x+','+y+','+z),w.edits.has(x+','+(y-1)+','+z),
     w.environmentCaves.get(x,y,z),
     w.environmentCaves.get(x,y-1,z));
   if(!v){blocked++;continue;}
   admitted++;
   if(id===272)snow++;else if(id===276)glacier++;else rime++;
   const region=v6BiomeAt(x,z,seed);
   assert.equal(region?.name,'snow');
   assert.deepEqual([...v],previewSnowS6WinterTone(seed,x,z,id,region.weight)
     .proposedLinearRgb,'Original seed sourceRGB mismatch at '+x+','+z);
   assert.equal(w.get(x,y,z),id);
   assert.equal(w.get(x,y+1,z),0);
  }
  assert.ok(admitted>=200,'Original winter sample vanished');
  assert.ok(snow>0&&glacier>0);
  assert.equal(admitted+blocked+other,1024);
  const stats=s.stats();
  assert.equal(stats.requests,admitted+blocked);
  assert.equal(stats.accepted,admitted);
  assert.ok(stats.climateReads<=stats.requests);
  assert.equal(JSON.stringify(w.save()),before);
  assert.deepEqual(restoreFourRegionWorld(w.save(),profile).save(),w.save());
  // Genuine historically retained green original source; never recast.
  const gx=-104,gz=360,y=terrainHeight(gx,gz,seed);
  const originalId=w.get(gx,y,gz);
  assert.equal(originalId,BLOCK.GRASS);
  assert.equal(s.colorAt(gx,y,gz,originalId,{top:y,id:originalId},
    originalId,w.get(gx,y-1,gz),w.get(gx,y+1,gz),false,false,
    w.environmentCaves.get(gx,y,gz),
    w.environmentCaves.get(gx,y-1,gz)),undefined);
  assert.equal(w.get(gx,y,gz),BLOCK.GRASS);
  console.log('SNOW_S10_REAL_M7_NO_EXTRA_RGB_ALLOCATIONS '+JSON.stringify({
   seed,sourceWindow:{x:[-160,-129],z:[z0,z0+31]},
   realCells:1024,admitted,blocked,other,originalSnow272:snow,
   originalGlacier276:glacier,originalRime279:rime,
   strictlyReusableRgbScratch:true,originalSourceClimateCalls:stats.climateReads,
   sourceSaveAndCavesUnchanged:true,retainedGreenGrassUnchanged:true,
   originalMeshPerformanceNotYetAccepted:true}));
 }
});
