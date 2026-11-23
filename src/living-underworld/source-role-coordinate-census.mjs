// Living Underworld Phase 25: independent, bounded proof of which exact cells
// each ORIGINAL caller-supplied role reader was asked to inspect. This does
// not authenticate the reader, carve blocks, or establish live M7 walking.
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const STAGES=Object.freeze(['bridge','pad']);
const INT=Number.isSafeInteger;
const key=(x,y,z)=>`${x},${y},${z}`;
export function createUnderpassReaderCellCensus({
 maxCellsPerStage=20000,expectedStageCoordinates=null
}={}){
 if(!INT(maxCellsPerStage)||maxCellsPerStage<1||maxCellsPerStage>20000)
  throw TypeError('Invalid underpass source cell census budget');
 // Preserve legacy read-only count/role audits when no independent route
 // witness is supplied, but an integrated source gate MUST supply one.
 // Copy manifests before reading source; subsequent caller mutation cannot
 // silently rewrite the geometric truth set.
 let geometry=null;
 if(expectedStageCoordinates!==null){
  if(!expectedStageCoordinates||
     typeof expectedStageCoordinates!=='object')
   throw TypeError('Invalid independent underpass coordinate manifest');
  geometry=Object.create(null);
  for(const stage of STAGES){
   const values=expectedStageCoordinates[stage];
   if(!Array.isArray(values)||values.length<1||
      values.length>maxCellsPerStage)
    throw TypeError('Invalid independent underpass coordinate manifest');
   const copy=new Set();
   for(const value of values){
    if(typeof value!=='string'||value.split(',').length!==3||
       !value.split(',').every(s=>Number.isSafeInteger(Number(s))&&
        String(Number(s))===s))
     throw TypeError('Invalid independent underpass coordinate manifest');
    copy.add(value);
   }
   if(copy.size!==values.length)
    throw TypeError('Duplicate independent underpass expected coordinate');
   geometry[stage]=copy;
  }
 }
 const cells=Object.fromEntries(STAGES.map(stage=>[stage,
  Object.fromEntries(ROLES.map(role=>[role,new Set()]))]));
 const calls=Object.fromEntries(STAGES.map(stage=>[stage,
  Object.fromEntries(ROLES.map(role=>[role,0]))]));
 const duplicates=Object.fromEntries(STAGES.map(stage=>[stage,
  Object.fromEntries(ROLES.map(role=>[role,0]))]));
 let currentStage='bridge',sealed=false;
 function enterPad(){
  if(sealed||currentStage!=='bridge')throw Error('Underpass reader census stage transition invalid');
  currentStage='pad';
 }
 function record(stage,role,x,y,z){
  if(sealed||stage!==currentStage||!STAGES.includes(stage)||
    !ROLES.includes(role)||![x,y,z].every(INT))
   throw TypeError('Invalid underpass reader role/cell/stage');
  const set=cells[stage][role],k=key(x,y,z);
  if(!set.has(k)&&set.size>=maxCellsPerStage)
   throw Error('Underpass exact source cell census budget exceeded');
  calls[stage][role]++;
  if(set.has(k))duplicates[stage][role]++;
  else set.add(k);
 }
 function audit({bridgeCells,padCells}={}){
  if(sealed||currentStage!=='pad'||!INT(bridgeCells)||!INT(padCells)||
    bridgeCells<1||padCells<1||bridgeCells>maxCellsPerStage||
    padCells>maxCellsPerStage)
   throw TypeError('Invalid completed underpass source cell census');
  sealed=true;
  const expected={bridge:bridgeCells,pad:padCells};
  const stageRoleCalls=Object.freeze(Object.fromEntries(STAGES.map(stage=>[stage,
   Object.freeze({...calls[stage]})])));
  const stageRoleDistinctCells=Object.freeze(Object.fromEntries(STAGES.map(stage=>[stage,
   Object.freeze(Object.fromEntries(ROLES.map(role=>[role,cells[stage][role].size])))])));
  const stageRoleDuplicateCalls=Object.freeze(Object.fromEntries(STAGES.map(stage=>[stage,
   Object.freeze({...duplicates[stage]})])));
  let reason=null,firstMismatch=null;
  for(const stage of STAGES){
   const master=cells[stage].editedAt;
   for(const role of ROLES){
    const set=cells[stage][role];
    if(duplicates[stage][role]>0&&!reason){
     reason='DUPLICATE_SOURCE_ROLE_CELL_READ';firstMismatch={stage,role};
    }
    if((calls[stage][role]!==expected[stage]||set.size!==expected[stage])&&!reason){
     reason='SOURCE_ROLE_CELL_COUNT_MISMATCH';firstMismatch={stage,role};
    }
    if(set.size!==master.size||[...master].some(k=>!set.has(k))){
     if(!reason){reason='SOURCE_ROLE_COORDINATE_SET_MISMATCH';firstMismatch={stage,role};}
    }
    if(geometry&&(set.size!==geometry[stage].size||
       [...geometry[stage]].some(k=>!set.has(k)))){
     if(!reason){
      reason='SOURCE_ROLE_INDEPENDENT_FOOTPRINT_MISMATCH';
      firstMismatch={stage,role};
     }
    }
   }
  }
  const bridge=cells.bridge.editedAt,pad=cells.pad.editedAt;
  let overlapCells=0;
  for(const k of bridge)if(pad.has(k))overlapCells++;
  return Object.freeze({ok:reason===null,reason,
   firstMismatch:firstMismatch&&Object.freeze(firstMismatch),
   stageRoleCalls,stageRoleDistinctCells,stageRoleDuplicateCalls,
   bridgeDistinctCells:bridge.size,padDistinctCells:pad.size,
   bridgePadOverlapCells:overlapCells,
   combinedDistinctCells:bridge.size+pad.size-overlapCells,
   independentGeometryFootprintProvided:geometry!==null,
   independentGeometryFootprintPassed:geometry!==null&&reason===null,
   expectedStageDistinctCells:geometry&&Object.freeze({
    bridge:geometry.bridge.size,pad:geometry.pad.size
   }),
   sourceReaderIdentityCallerOnly:true,originalM7WorldNotAuthenticated:true,
   worldChanged:false,noWorldWrites:true});
 }
 return Object.freeze({record,enterPad,audit});
}
