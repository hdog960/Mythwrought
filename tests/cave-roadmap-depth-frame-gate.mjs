// Roadmap #240 C6: fail-closed, test-owned actual-game deep mesh residency gate.
// Never rewrites geometry, global streaming, sky, save bytes or the original
// intentionally open historic East Gallery. Source of truth: src/depth.mjs.
import {chunkCoord} from '../src/voxel.mjs';
import {sectionForY,sectionWindow,sectionChunkRadius} from '../src/depth.mjs';

export const C6_STABLE_RENDERED_FRAMES=4;
export function expectedDeepSceneResidency(at){
 if(!at||![at.x,at.y,at.z].every(Number.isInteger))
  throw Error('C6_EXPECTED_INVALID_SOURCE_CAMERA');
 const feet=at.y+.01,active=sectionForY(feet);
 if(active===null||active>=0)throw Error('C6_EXPECTED_NOT_A_DEEP_CAMERA');
 const sections=sectionWindow(feet,false);
 if(!sections.length||sections[0]!==active)throw Error('C6_EXPECTED_BAD_SECTION_WINDOW');
 const count=sections.reduce((sum,section)=>{
  const radius=sectionChunkRadius(section,active);
  return sum+(radius*2+1)**2;
 },0);
 if(count<9||count>27)throw Error('C6_EXPECTED_INVALID_RESIDENT_BUFFER_BUDGET');
 return Object.freeze({
  originalPosition:Object.freeze({...at}),feet,activeSection:active,
  sections:Object.freeze([...sections]),requiredChunks:count,
  expectedCenter:chunkCoord(at.x)+','+chunkCoord(at.z)+'|'+sections.join(',')
 });
}
export function assessDeepSceneFrame(frame,expected){
 if(!frame||!expected)throw Error('C6_FRAME_OR_EXPECTATION_MISSING');
 const faults=[];
 if(frame.center!==expected.expectedCenter)faults.push('WRONG_CHUNK_CENTER');
 if(frame.loadedChunks!==expected.requiredChunks)faults.push('INCOMPLETE_RESIDENCY');
 if(frame.pendingChunks!==0)faults.push('PENDING_CHUNK_MESHES');
 if(!Number.isInteger(frame.renderedFrames)||frame.renderedFrames<1)faults.push('NO_REAL_RENDERED_FRAME');
 if(!Number.isFinite(frame.renderedMeshVertices)||frame.renderedMeshVertices<=800)
  faults.push('MISSING_ACTUAL_MESH');
 if(!Number.isFinite(frame.playerFeet)||Math.abs(frame.playerFeet-expected.feet)>.2)
  faults.push('UNSTABLE_SOURCE_CAMERA');
 if(frame.webgl2!==true||frame.contextLost!==false)
  faults.push('WEBGL2_CONTEXT_UNAVAILABLE');
 return Object.freeze({ok:faults.length===0,faults:Object.freeze(faults)});
}
export function verifyStableDeepSceneFrames(frames,expected){
 if(!Array.isArray(frames)||frames.length<C6_STABLE_RENDERED_FRAMES)
  throw Error('C6_NOT_ENOUGH_REAL_RENDERED_FRAMES');
 let prev=0;
 for(let i=0;i<frames.length;i++){
  const frame=frames[i],check=assessDeepSceneFrame(frame,expected);
  if(!check.ok)throw Error('C6_FRAME_NOT_RESIDENT_'+i+':'+check.faults.join(','));
  if(i>0&&frame.renderedFrames<=prev)
   throw Error('C6_NO_FRAME_ADVANCE_'+i);
  prev=frame.renderedFrames;
 }
 return Object.freeze({ok:true,samples:frames.length,
  requiredChunks:expected.requiredChunks,firstFrame:frames[0].renderedFrames,
  lastFrame:frames.at(-1).renderedFrames,
  expectedCenter:expected.expectedCenter});
}
