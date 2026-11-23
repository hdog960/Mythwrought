// Isolated Mountain V8 source-only conifer full-footprint compatibility gate.
// Owner must inject EXACT current Desert P3 naturalTreeTouchesDesert from the
// separate production main; the older isolated checkout does NOT own it.
// No world write, registry ID, V8 activation, renderer, save or GPU call.
// An accepted source geometry certificate is NOT gameplay authorization.
import {chunkCoord,CHUNK_SIZE} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {planMountainV8PlantCells,MOUNTAIN_V8_PLANT_PATTERNS}
  from './mountain-v8-vegetation-cells.mjs';
import {auditMountainV8ProvisionalFloraPhysics}
  from './mountain-v8-unapproved-flora-physics-prototype.mjs';

const frozen=Object.freeze,integer=Number.isSafeInteger;
export const MOUNTAIN_V8_P3_REQUIRED_MAIN=
  'db4bbcc32156e5df311f733bcaa53d559c17313b';
export const MOUNTAIN_V8_P3_TREE_SOURCE_BLOB=
  '7fa5be721d8597baa22df8c45fb9b10536a7c155';
const reject=(reason,onVeto,at=null)=>{
  onVeto?.(frozen({reason,at:at&&frozen([...at])}));
  return null;
};
/** Caller supplies real, read-only source evidence:
 *   originalDesertTreeTouches(seed,cells,origin) must be the exact function
 *     exported by current production src/manual-biomes/environment-v7.mjs.
 *   V6 climate is read directly from the unchanged original source module.
 *   readOriginalBlock/protectedAt/proposedSurfaceAt are source-world readers.
 * Fail closed on missing P3 callback or conflicting original source.
 */
export function auditMountainV8P3ConiferFootprint(proposal,{
  sourceMainHead,sourceDesertTreeBlob,
  originalDesertTreeTouches,
  readOriginalBlock,protectedAt,proposedSurfaceAt,
  worldMaxY=19,airId=0,onVeto
}={}){
  if(!proposal||proposal.vegetation!=='dwarf-conifer'||
     !integer(proposal.x)||!integer(proposal.z)||!integer(proposal.seed)||
     proposal.seed!==(proposal.seed|0)||!integer(proposal.top)||
     sourceMainHead!==MOUNTAIN_V8_P3_REQUIRED_MAIN||
     sourceDesertTreeBlob!==MOUNTAIN_V8_P3_TREE_SOURCE_BLOB||
     [originalDesertTreeTouches,readOriginalBlock,
       protectedAt,proposedSurfaceAt].some(f=>typeof f!=='function')||
     (onVeto!==undefined&&typeof onVeto!=='function'))
    return reject('missing-exact-current-main-source-or-unverified-proposal',onVeto);
  const plant=planMountainV8PlantCells(proposal,{
    worldMaxY,airId,readOriginalBlock,protectedAt,
    mountainAt:(x,z)=>{
      const region=v6BiomeAt(x,z,proposal.seed);
      return region?.name==='mountain'&&region.weight>=.82;
    },proposedSurfaceAt
  });
  if(!plant)return reject('source-plant-envelope-or-air-veto',onVeto);
  const pattern=MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'];
  if(plant.cells.length!==13||pattern.length!==13)
    return reject('authored-conifer-cell-count-changed',onVeto);
  const originalCells=plant.cells.map(cell=>[cell.x,cell.y,cell.z]);
  // The CURRENT Desert P3 source bans trees whose ANY authored footprint
  // touches desert, including foliage belonging to a non-Desert trunk.
  const origin=[proposal.x,proposal.top,proposal.z];
  if(originalDesertTreeTouches(proposal.seed,originalCells,origin))
    return reject('current-main-desert-p3-entire-footprint-veto',onVeto,origin);
  const rootChunk=[chunkCoord(proposal.x),chunkCoord(proposal.z)];
  const occupiedChunks=new Set();
  for(let i=0;i<plant.cells.length;i++){
    const cell=plant.cells[i],[dx,dy,dz,material]=pattern[i];
    if(cell.x!==proposal.x+dx||cell.y!==proposal.top+dy||
       cell.z!==proposal.z+dz||cell.material!==material)
      return reject('original-v8-pattern-mismatch',onVeto,[cell.x,cell.y,cell.z]);
    const region=v6BiomeAt(cell.x,cell.z,proposal.seed);
    if(region?.name!=='mountain'||!(region.weight>=.82))
      return reject('current-main-foreign-canopy-column',onVeto,
        [cell.x,cell.y,cell.z]);
    occupiedChunks.add(chunkCoord(cell.x)+','+chunkCoord(cell.z));
  }
  // Original V8 8x8 tile roots are offset +2..+5; horizontal foliage
  // ranges only +/-1. Every generated conifer therefore lies within one
  // 16x16 chunk, including negative chunks. This is an admission invariant,
  // NOT a substitute for surrounding terrain or edited-mesh seam refresh.
  if(CHUNK_SIZE!==16||occupiedChunks.size!==1||
     !occupiedChunks.has(rootChunk.join(',')))
    return reject('conifer-cross-chunk-source-invariant-changed',onVeto);
  const physical=auditMountainV8ProvisionalFloraPhysics();
  const shapes=new Map(physical.materials.map(x=>[x.material,x]));
  const physicalCells=frozen(plant.cells.map(cell=>{
    const p=shapes.get(cell.material);
    if(!p||p.approvedForGameplay||p.newNumericBlockId!==null)
      throw Error('Unapproved original flora shape policy changed');
    return frozen({x:cell.x,y:cell.y,z:cell.z,material:cell.material,
      selectionBoxes:p.selectionBoxes,bodyCollisionBoxes:p.bodyCollisionBoxes,
      physicalPolicyApproval:false});
  }));
  return frozen({
    sourceMainHead,sourceDesertTreeBlob,
    seed:proposal.seed,origin:frozen([...origin]),
    chunk:frozen(rootChunk),distinctSourceChunkCount:occupiedChunks.size,
    sourceCells:physicalCells,sourceCellCount:physicalCells.length,
    originalSourceAirAndProtectionChecked:true,
    originalCurrentMainDesertFootprintVetoChecked:true,
    originalSourceCanopyBiomeChecked:true,
    noNewMaterialIds:true,originalWorldUnchanged:true,
    coniferMiningApproved:false,coniferColliderApproved:false,
    allOwnerSignoffsObtained:false,actualV8GameplayTested:false,
    gpuBytesMeasured:null,runtimeActivationAuthorized:false,
    safeToIntegrate:false
  });
}
