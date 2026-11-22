// MYTHWROUGHT Floating Islands: direct pure integration of original physical
// WorldView, certified ecology, and separate edited-player voxel priority.
// Caller supplies the real original host; never writes actual world or saves.
import {planOriginalSkyEcology} from './sky-original-flora-authority.mjs';
import {createCertifiedSkyEcologyOverlay} from './sky-ecology-overlay.mjs';
const fail=s=>{throw new TypeError('Sky ecology stage: '+s);};
export function stageOriginalSkyEcology({physicalHost,source,materials,seed,plan,
  playerEdits=new Map(),playerRotations=new Map(),maxCells=512}={}){
  if(!physicalHost?.world||typeof physicalHost.world.get!=='function'||
     !source||source.physicalWorld!==physicalHost.world||
     typeof source.naturalGet!=='function'||typeof source.validateId!=='function'||
     !(playerEdits instanceof Map)||playerEdits.size>8192)
    fail('same immutable original physical-world source required');
  // Source reader and supplied player sidecar must describe the same merged
  // physical world; otherwise a mined AIR root may be incorrectly certified.
  for(const [loc,id] of playerEdits){
    if(typeof loc!=='string'||!/^(-?(?:0|[1-9]\d*)),(0|[1-9]\d*),(-?(?:0|[1-9]\d*))$/.test(loc))
      fail('invalid original player edit coordinate');
    const [x,y,z]=loc.split(',').map(Number);
    if(![x,y,z].every(Number.isSafeInteger)||physicalHost.world.get(x,y,z)!==id)
      fail('player edits are not reflected in the original physical host');
  }
  // The ONLY certificate path in this facade is the real S9 source+geometry
  // planner. A caller cannot fabricate a stale or convenient sourceProof.
  const certificate=planOriginalSkyEcology({physicalHost,source,materials,seed,plan,maxCells});
  const overlay=createCertifiedSkyEcologyOverlay({certificate,source,
    playerEdits,playerRotations});
  overlay.assertFresh();
  // Every use of this host descriptor to rebuild a world or render a mesh
  // MUST first and last call assertFresh; no caller owns the internal maps.
  return Object.freeze({certificate,overlay,
    physicalHostInput:Object.freeze({skyGet:overlay.naturalAt,
      skyRotationAt:overlay.rotationAt,
      skyEdits:overlay.copyPlayerEdits(),skyRotations:overlay.copyPlayerRotations(),
      assertFresh:overlay.assertFresh}),
    worldWrites:0,groundSaveWrites:0,skySaveWrites:0,renderOnlyMeshes:0,
    gpuUploads:0,shadowPasses:0});
}
