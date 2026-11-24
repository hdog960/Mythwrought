import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {VoxelWorld,terrainHeight,collides,meshChunk} from '../production-readonly/src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld}
 from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalScenery} from '../production-readonly/src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../production-readonly/src/nonblock/candidate-scene.mjs';
import {stepPlayer} from '../production-readonly/src/physics.mjs';
import {createSnowS12ClimateBoundTreeFactory} from '../src/manual-biomes/snowy-s12-natural-conifer-prototypes.mjs';
import {createSnowS13CertifiedForest,S13_WINDOW} from '../src/manual-biomes/snowy-s13-certified-forest-overlay.mjs';
const starts={179:[[-16,512.5,7],[-16,514.5,7],[0,512.5,9],[0,514.5,11]],
 2026:[[-16,512.5,7],[-16,516.5,7],[0,512.5,10],[0,514.5,12]]};
function walk(world,border,z,feet){
 const p={x:border-2.5,z,feet,vX:0,vY:0,vZ:0,yaw:Math.PI/2,pitch:0,onGround:true,coyote:.09,jumpBuffer:0};
 assert.equal(collides(world,p.x,p.feet,p.z),false);
 assert.equal(collides(world,p.x,p.feet-.065,p.z),true);
 let cross=null;
 for(let i=0;i<132;i++){
  stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
  assert.ok([p.x,p.z,p.feet].every(Number.isFinite));
  assert.equal(collides(world,p.x,p.feet,p.z),false);
  if(cross===null&&p.x>=border+.75)cross=i+1;
 }
 assert.ok(cross!==null,'Original documented border crossing was severed');
 return {cross,end:[p.x,p.feet,p.z],frames:132};
}
function sample(a,b,cx,cz){
 // Warm each exact source path, then alternate order within 16 pairs.
 meshChunk(a,cx,cz);meshChunk(b,cx,cz);
 const samples=[[],[]],bytes=[0,0],worlds=[a,b];
 for(let i=0;i<16;i++)for(const k of i%2?[1,0]:[0,1]){
  const t=performance.now(),mesh=meshChunk(worlds[k],cx,cz);
  samples[k].push(performance.now()-t);
  assert.ok(mesh instanceof Float32Array&&mesh.length%9===0);
  if(i)assert.equal(mesh.byteLength,bytes[k]);else bytes[k]=mesh.byteLength;
 }
 const q=(s,p)=>Math.round(s.slice().sort((a,b)=>a-b)[Math.ceil(s.length*p)-1]*100)/100;
 return {chunk:[cx,cz],originalBytes:bytes[0],stagedBytes:bytes[1],
  originalP50:q(samples[0],.5),originalP95:q(samples[0],.95),
  stagedP50:q(samples[1],.5),stagedP95:q(samples[1],.95),samples};
}
test('S13 all eight historically verified border routes with COMPLETE S12 owner trees and paired native mesh costs',async()=>{
 const reports=[];
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
  const deps={biomeAt:v6BiomeAt,terrainHeight,collides,
   proposedSnowTree:createSnowS12ClimateBoundTreeFactory(seed,v6BiomeAt),
   legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
   planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject};
  const {manifest,overlay}=createSnowS13CertifiedForest(world,deps);
  assert.equal(manifest.trees.length,seed===179?4:3);
  assert.equal(manifest.cells.length,seed===179?203:148);
  assert.throws(()=>overlay.set(0,0,0,4),/read-only/);
  const routes=starts[seed].map(([boundary,z,feet])=>({boundary,z,feet,
    original:walk(world,boundary,z,feet),staged:walk(overlay,boundary,z,feet)}));
  const chunks=S13_WINDOW.filter(([cx,cz])=>manifest.cells.some(([x,,z])=>
   Math.floor(x/16)===cx&&Math.floor(z/16)===cz));
  const costs=chunks.map(([cx,cz])=>sample(world,overlay,cx,cz));
  for(const r of costs)assert.ok(r.stagedBytes>r.originalBytes);
  assert.equal(JSON.stringify(world.save()),before);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  const report={seed,trees:manifest.trees,fullCells:manifest.cells.length,routes,costs,
   originalSaveUnchanged:true,nativeTimingOnly:true};
  reports.push(report);
  console.log('SNOW_S13_ORIGINAL_LONG_WALK_AND_COST '+JSON.stringify(report));
  if(process.env.SNOW_S13_EXPORT==='1'){
   await mkdir('artifacts/snow-s13',{recursive:true});
   await writeFile('artifacts/snow-s13/forest-'+seed+'.json',JSON.stringify(manifest));
  }
 }
 if(process.env.SNOW_S13_EXPORT==='1')await writeFile('artifacts/snow-s13/native-report.json',JSON.stringify(reports,null,2));
});
