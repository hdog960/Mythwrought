// Detached Mountain V8 physical column planner. No world writes or dispatch.
// All material names are descriptors pending separately approved V8 block IDs.
export const MOUNTAIN_V8_COLUMN_WRITE_LIMIT=18;
const valid=n=>Number.isSafeInteger(n);
const validCap=new Set(['snow','alpine-grass','slate','gneiss','scree']);
/** Plan bounded connected support for a source-provenanced, isolated V8 cap.
 * Refuse to cross cave AIR, authored structures, player edits, or unknown sky.
 * All reads are ORIGINAL pre-uplift source; no recursive V8 dispatch.
 */
export function planMountainV8PhysicalColumn(proposal,{
  worldMaxY=19,ids,readOriginalBlock,protectedAt=()=>false
}={}){
  if(!proposal||proposal.safeToIntegrate!==false||
     proposal.generatorIdentityRequired!=='v8-new-opt-in'||
     !validCap.has(proposal.cap)||
     ![proposal.x,proposal.z,proposal.legacyTop,proposal.top,worldMaxY].every(valid)||
     proposal.legacyTop<2||proposal.top<proposal.legacyTop||
     proposal.top>worldMaxY-2||
     proposal.top-proposal.legacyTop+1>MOUNTAIN_V8_COLUMN_WRITE_LIMIT||
     !ids||![ids.AIR,ids.GRASS,ids.DIRT,ids.STONE].every(valid)||
     new Set([ids.AIR,ids.GRASS,ids.DIRT,ids.STONE]).size!==4||
     typeof readOriginalBlock!=='function'||typeof protectedAt!=='function')return null;
  const {x,z,legacyTop,top,cap}=proposal;
  // A natural cap needs a continuous three-layer original foundation.
  // Exposed or cave-carved AIR beneath it cannot be buried by a V8 uplift.
  const support=readOriginalBlock(x,legacyTop-1,z);
  for(let d=2;d<=3;d++)
    if(protectedAt(x,legacyTop-d,z)||
       readOriginalBlock(x,legacyTop-d,z)===ids.AIR)return null;
  if(readOriginalBlock(x,legacyTop,z)!==ids.GRASS||
     ![ids.DIRT,ids.STONE].includes(support)||
     protectedAt(x,legacyTop-1,z))return null;
  const writes=[];
  for(let y=legacyTop;y<=top;y++){
    const original=readOriginalBlock(x,y,z);
    if(protectedAt(x,y,z)||original!==(y===legacyTop?ids.GRASS:ids.AIR))return null;
    // Alpine grass gets two shallow dirt layers, never a rock-only underlay.
    // Deeper uplift remains full-cube mineable stone. Snow/rock remain rocky.
    const material=y===top?cap:
      cap==='alpine-grass'&&y>=top-2?'dirt':'stone';
    writes.push(Object.freeze({x,y,z,material}));
  }
  return Object.freeze({x,z,legacyTop,top,cap,
    writes:Object.freeze(writes),supportOriginalId:support,
    estimatedCells:writes.length,safeToIntegrate:false,
    requiresApprovedV8BlockMapping:true});
}
