/**
 * Read-only original main-camera to Pack5 ray precedence witness, Node-only.
 *
 * Imports the ACTUAL original camera, touch camera clamp, block inspection,
 * Pack5 live adapter and voxel ray implementation. It never imports main.mjs
 * (the DOM/renderer-owned entrypoint) or executes its edit loop.
 *
 * The exact main.mjs camera and edit-guard source expressions are checked
 * lexically before interpreting their Boolean guard in this source test.
 */
import {readFileSync} from 'node:fs';
import {forwardVector,clampLook} from '../../camera.mjs';
import {safePointerDelta} from '../../input.mjs';
import {inspectBlockTarget} from '../../blocks.mjs';
import {createPack5LiveAdapter} from '../../pack5-integration/live-adapter.mjs';
import {BLOCK} from '../../voxel.mjs';

const deny=(x,message)=>{if(!x)throw Error('Roadmap A original camera/Pack5 risk denied: '+message);};
const BRICK_VARIANTS=Object.freeze(['hearth-running-bond','kiln-soldier-course']);
const EDGE_COORDINATES=Object.freeze([0.01999995,0.02,0.02000005,0.97999995,0.98,0.98000005]);
const TOUCH_DELTA=Object.freeze([-1,0,1]);
const BLOCKERS=Object.freeze(['none','front-legacy','rear-legacy']);
const location=a=>a?.join(',')??null;
const rayEqual=(a,b)=>a===null&&b===null ||
 a!==null&&b!==null&&Math.abs(a-b)<=0.0000001;
const positiveSafe=n=>Number.isSafeInteger(n)&&n>=0;
/** Static source witness, not main.mjs execution. Fails closed on any upstream
 * gameplay decision drift or disappearance of the owner guards.
 */
export function inspectOriginalMainCameraPack5GuardSource(){
 const source=readFileSync(new URL('../../main.mjs',import.meta.url),'utf8');
 const exact=[
  "const eye=()=>[player.x,player.feet+1.55,player.z];",
  "const facing=()=>forwardVector(player.yaw,player.pitch);",
  "if(pack5Mode&&pack5Builder){",
  "const target=inspectBlockTarget(world,eye(),facing(),selected,player);",
  "const shape=pack5Builder.layer.raycast(eye(),facing(),6);",
  "if(shape&&(!target.hit||shape.distance<target.distance-1e-6)){",
  "if(mode==='mine'&&target.hit&&pack5Builder.supportsLegacyCell(target.hit)){",
  "if(mode==='place'&&target.adjacent&&pack5Builder.layer.cell(target.adjacent)){",
  "pack5Builder.placeFacing(eye(),facing(),",
  "pack5Builder.removeFacing(eye(),facing());"
 ];
 for(const line of exact)deny(source.includes(line),'original main input/camera expression changed: '+line);
 deny(source.includes("if(!help.hidden||exploration.isOpen()||document.hidden||graphicsLost||g2Active())return;"),
  'original main gameplay closed-menu/GPU guard changed');
 const head=source.indexOf("if(pack5Mode&&pack5Builder){");
 const normal=source.indexOf("if(pack5Builder){",head+1);
 deny(head>0&&normal>head&&source.indexOf("const shape=pack5Builder.layer.raycast",normal)>normal,
  'opt-in Pack5 and normal legacy edit modes must remain separate');
 return {originalMainSourceCameraExpressionsRead:true,
  originalMainModeAndOcclusionGuardsRead:true,
  originalMainCodeImportedOrExecuted:false,verifiedExpressions:exact.length,
  editGuardDistanceBiasBlockUnits:0.000001,
  actualMainRuntimeCameraOrTouchUsed:false,
  noGameMutationOrSourceChange:true};
}
const sourceWorld=blocker=>{
 const at=blocker==='front-legacy'?[0,2,1]:
  blocker==='rear-legacy'?[0,2,-1]:null;
 const world=Object.freeze({
  seed:179,biomeCellCount:0,pack2Cells:new Map(),
  get(x,y,z){
   deny([x,y,z].every(Number.isSafeInteger),'original world ray requested noninteger voxel');
   return at&&location([x,y,z])===location(at)?BLOCK.STONE:BLOCK.AIR;
  }
 });
 deny(!Object.hasOwn(world,'set')&&!Object.hasOwn(world,'save')&&
  !Object.hasOwn(world,'pack5Layer')&&Object.isFrozen(world),
  'synthetic only-get original world required');
 return world;
};
const pose=(x,touch)=>{
 // Original main.mjs eye and facing expressions; original camera modules do
 // actual orientation calculations with a bounded one-pixel test input.
 const p={x,feet:0.95,z:2.5,yaw:Math.PI,pitch:0};
 const move=safePointerDelta(touch,0);
 const look=clampLook(p.yaw,p.pitch,move.x,move.y,1,0.008);
 p.yaw=look.yaw;p.pitch=look.pitch;
 return {player:p,eye:[p.x,p.feet+1.55,p.z],direction:forwardVector(p.yaw,p.pitch),
  originalInputWasOnePixelOrCenter:touch===0||move.x===touch};
};
/** Match the unchanged normal-mode main.js Boolean guard, but do not
 * execute actual main.js or invoke edit/placement callbacks.
 */
function normalEditIntercept(shape,target){
 return shape!==null&&(!target.hit||shape.distance<target.distance-0.000001);
}
export function auditOriginalPack5CameraAndEditingPrecedence(){
 const guard=inspectOriginalMainCameraPack5GuardSource();
 const originalFixtureCases=[],byDensity={},probeComparisons=new Map();
 let total=0,temporaryLayers=0,originalCameraVectors=0,originalLegacyTargets=0,
  originalPack5Targets=0,adapterShapeTargets=0,normalModeGuards=0,
  directDenseRayDisagreements=0,originalAdapterVsMainGuardDisagreements=0,
  syntheticWorldWrites=0;
 for(const variant of BRICK_VARIANTS)for(const yaw of [2,3]){
  for(const density of [1,65])for(const blocker of BLOCKERS){
   const world=sourceWorld(blocker);
   const adapter=createPack5LiveAdapter(world,{storage:null});
   const primary=adapter.layer.place('pack5:080',[0,2,0],yaw,variant);
   deny(primary?.ok===true,'original first temporary Pack5 preview cannot be placed');
   if(density===65)for(let i=0;i<64;i++){
    const filler=adapter.layer.place('pack5:080',[100+i*2,2,0],0,'hearth-running-bond');
    deny(filler?.ok===true,'original distant test-only dense Pack5 preview cannot be placed');
   }
   deny(adapter.layer.count()===density,'original Pack5 ray branch density incorrect');
   const row={testOnlyVariant:variant,testOnlyYaw:yaw,testOnlyDensity:density,
    testOnlyLegacyBlocker:blocker,originalPack5SourceBranch:density<=64?'DIRECT':'DENSE',
    probes:0,legacyHits:0,layerSelectionHits:0,adapterSelectionHits:0,
    normalMainModeGuardIntercepts:0,sourceCameraLookVectors:0,
    firstBoundedNearEdgeWarnings:[]};
   for(const x of EDGE_COORDINATES)for(const touchDelta of TOUCH_DELTA){
    const {player,eye,direction,originalInputWasOnePixelOrCenter}=pose(x,touchDelta);
    deny(originalInputWasOnePixelOrCenter&&direction.every(Number.isFinite)&&
     Math.abs(Math.hypot(...direction)-1)<1e-10,
     'actual source camera normalizing or original input changed');
    const originalTarget=inspectBlockTarget(world,eye,direction,BLOCK.STONE,player,0);
    const shape=adapter.layer.raycast(eye,direction,6);
    const inspected=adapter.inspect(eye,direction);
    const guarded=normalEditIntercept(shape,originalTarget);
    // Live adapter inspect() additionally applies original terrain occlusion.
    deny(inspected.legacy?.distance===originalTarget.distance||
     inspected.legacy===null&&originalTarget.distance===null,
     'original voxel target and adapter legacy target disagree');
    deny(inspected.shape===null||
     (shape!==null&&rayEqual(shape.distance,inspected.shape.distance)),
     'original live adapter selected a shape absent from source ray');
    const legacyFront=originalTarget.hit&&shape&&
     originalTarget.distance<=shape.distance+0.00000001;
    if(legacyFront)deny(inspected.shape===null,
     'original adapter targeted furniture behind a nearer legacy voxel');
    if(blocker==='front-legacy')deny(!guarded,
     'normal main edit guard bypassed front legacy block unexpectedly');
    // No source-geometry selection should be interpreted as a real game edit.
    row.probes++;total++;originalCameraVectors++;row.sourceCameraLookVectors++;
    if(originalTarget.hit){row.legacyHits++;originalLegacyTargets++;}
    if(shape){row.layerSelectionHits++;originalPack5Targets++;}
    if(inspected.shape){row.adapterSelectionHits++;adapterShapeTargets++;}
    if(guarded){row.normalMainModeGuardIntercepts++;normalModeGuards++;}
    if(density===1){
     probeComparisons.set([variant,yaw,blocker,x,touchDelta].join('|'),
      {distance:shape?.distance??null,legacyDistance:originalTarget.distance,
       guard:guarded,adapter:inspected.shape?.distance??null});
    }else{
     const direct=probeComparisons.get([variant,yaw,blocker,x,touchDelta].join('|'));
     deny(direct!==undefined,'missing original reference one-instance ray');
     const match=rayEqual(direct.distance,shape?.distance??null)&&
      rayEqual(direct.legacyDistance,originalTarget.distance)&&
      direct.guard===guarded&&
      rayEqual(direct.adapter,inspected.shape?.distance??null);
     if(!match)directDenseRayDisagreements++;
     if(!match&&row.firstBoundedNearEdgeWarnings.length<8)
      row.firstBoundedNearEdgeWarnings.push({x,touchDelta,direct,
       dense:{distance:shape?.distance??null,legacyDistance:originalTarget.distance,
        guard:guarded,adapter:inspected.shape?.distance??null}});
    }
    if((guarded)!==(inspected.shape!==null)){
     // Difference is reportable: opt-in live adapter uses its own occlusion
     // tie tolerance, while main has a slightly stronger 1e-6 edit bias.
     originalAdapterVsMainGuardDisagreements++;
    }
   }
   deny(row.probes===18,'missing original per-asset original camera rays');
   originalFixtureCases.push(row);temporaryLayers++;
   byDensity[density]??={fixtureCases:0,originalCameraProbes:0,selectedHits:0};
   byDensity[density].fixtureCases++;
   byDensity[density].originalCameraProbes+=row.probes;
   byDensity[density].selectedHits+=row.layerSelectionHits;
  }
 }
 deny(temporaryLayers===24&&total===432&&originalCameraVectors===432&&
  probeComparisons.size===216&&
  Object.values(byDensity).every(x=>x.fixtureCases===12&&x.originalCameraProbes===216),
  'full original direct/dense camera and source ray census incomplete');
 deny([originalLegacyTargets,originalPack5Targets,adapterShapeTargets,
  normalModeGuards,directDenseRayDisagreements,
  originalAdapterVsMainGuardDisagreements].every(positiveSafe),
  'bad original source camera and ray census counters');
 return {schema:'mythwrought.roadmap-a.pack5-original-main-camera-gate-preview.v1',
  ...guard,totalSourceCameraRayProbes:total,temporaryOnlyPack5BuilderLayers:temporaryLayers,
  originalPlayerCameraDirectionCalculations:originalCameraVectors,
  originalInspectorLegacyHitProbes:originalLegacyTargets,
  originalPack5DetailSelectionHitProbes:originalPack5Targets,
  originalAdapterOcclusionAwareSelectionHits:adapterShapeTargets,
  originalNormalEditGuardInterceptions:normalModeGuards,
  originalDirectVersusDenseSelectionDisagreements:directDenseRayDisagreements,
  originalAdapterVersusMainGuardWarnings:originalAdapterVsMainGuardDisagreements,
  originalCases:originalFixtureCases,densityBreakdown:byDensity,
  originalMainGameLoopNotExecuted:true,originalWorldIsReadonlyFake:true,
  realPlayerMovementOrTouchNotExecuted:true,realPack5GameGpuNotUsed:true,
  pack5SourceVariantsOrYawAssignedToA5:false,
  originalA5BlueprintsModified:false,actualSaveOrWorldModified:false,
  structuralLoadsCertified:false,creatorAccepted:false,releaseBlocked:true};
}
