// Research-only integrated native staging gate. Uses the same actual
// physical meshChunk and environmental nonblock scene as original main.
// No GL context, runtime hook, generator migration, or save writes.
import {createHash} from 'node:crypto';
import {BLOCK,meshChunk,worldKey} from '../voxel.mjs';
import {validateChunkUploadBytes} from '../gpu-recovery.mjs';
import {planEnvironmentalScenery} from '../nonblock/staged-habitats.mjs';
import {createCandidateScene,candidateVertices} from '../nonblock/candidate-scene.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
const storage=Object.freeze({getItem:()=>null});
const hash=v=>createHash('sha256').update(new Uint8Array(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
function geometry(vertices){
 const bytes=validateChunkUploadBytes(vertices);
 if(!vertices.every(Number.isFinite))throw Error('Nonfinite original native vertex');
 return {bytes,vertices:vertices.length/9,sha256:hash(vertices)};
}
export function originalM7SurfaceScene(world,cx,cz){
 if(world.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR||
    ![cx,cz].every(Number.isSafeInteger))throw Error('Original M7 source required');
 const layout=planEnvironmentalScenery(world,cx,cz);
 const scene=createCandidateScene(world.seed,M7_ENVIRONMENT_GENERATOR,layout,{
  storage,blockAt:(x,y,z)=>world.get(x,y,z)!==BLOCK.AIR,
  editedAt:(x,y,z)=>world.edits.has(worldKey(x,y,z)),voxelPick:()=>null
 });
 return {layout,scene};
}
export function measureOriginalM7SurfaceWindow(world,cx,cz){
 const {layout,scene}=originalM7SurfaceScene(world,cx,cz);
 const visible=scene.visible();
 for(const o of visible)for(const [x,y,z] of o.supports){
  if(world.get(x,y,z)===BLOCK.AIR||world.edits.has(worldKey(x,y,z)))
   throw Error('Original scenery unsupported or edited');
 }
 const native=geometry(meshChunk(world,cx,cz));
 const scenery=geometry(candidateVertices(visible));
 return {chunk:[cx,cz],climate:v6BiomeAt(cx*16+8,cz*16+8,world.seed)?.name??'plains',
  native,scenery,combinedStagingBytes:native.bytes+scenery.bytes,
  layout:layout.map(o=>({...o})),visible:visible.map(o=>({key:o.instanceKey,sceneId:o.sceneId,supports:o.supports})),
  physicalIphone:false,actualGpuUpload:false};
}
