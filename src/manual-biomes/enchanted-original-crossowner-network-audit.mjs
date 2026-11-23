// Enchanted P2 isolated cross-owner handoff diagnosis. Distinguishes
// original :36 proposed source geometry from ACTUAL combined M7 voxel
// admission and continuous player walking. This never authors, bridges,
// writes, promotes profiles, or alters the separate cave developer's work.
import {BLOCK,collides} from '../voxel.mjs';
import {GROUND_PROBE} from '../physics.mjs';
import {descentEntranceApproach,descentRoute}
  from '../underground-switchback-descent.mjs';
import {originalM7AuthoredCaveFloorCap}
  from './enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,
  replayFullOriginalM7CaveAnchorWalk}
  from './enchanted-original-full-anchor-continuity.mjs';

export function surveyOriginalM7SwitchbackAnchorTo36(world,{routeSteps=8}={}){
  if(!Number.isInteger(routeSteps)||routeSteps<1||routeSteps>12)
    throw Error('Invalid bounded original switchback source survey');
  const base=planFullOriginalM7CaveAnchorWalk(world,'switchback36');
  if(!base.ok)return Object.freeze({ok:false,reason:base.reason,
    sourceSurveyOnly:true});
  const five=descentEntranceApproach();
  const owner=descentRoute();
  if(five.length!==5||owner.length<routeSteps+1)
    throw Error('Unexpected ORIGINAL switchback route source');
  const anchor=five[0],end=five.at(-1),first=owner[0];
  if(anchor.x!==base.sourceAnchor.x||anchor.z!==base.sourceAnchor.z||
     anchor.floor!==base.sourceAnchor.floor||
     end.x!==first.x||end.z!==first.z||end.floor!==first.floor)
    throw Error('Original :36 entrance/source route anchor identity mismatch');
  const originalSteps=[
    ...five.slice(1).map((p,i)=>({...p,label:'original-descent-entrance-'+(i+1)})),
    ...owner.slice(1,routeSteps+1).map((p,i)=>
      ({...p,label:'original-switchback-route-'+(i+1)}))
  ];
  const observations=[],caps=[],baseAnchor=base.path.at(-1);
  let prior=baseAnchor;
  for(const q of originalSteps){
    const actual=world.environmentCaves.get(q.x,q.floor,q.z);
    const physical=world.get(q.x,q.floor,q.z);
    const head=[1,2,3].map(k=>world.environmentCaves.get(q.x,q.floor+k,q.z));
    const cap=originalM7AuthoredCaveFloorCap(world,q.x,q.floor,q.z);
    const adjacent=Math.abs(q.x-prior.x)+Math.abs(q.z-prior.z)===1;
    const fact=Object.freeze({
      name:q.label,source:[q.x,q.floor,q.z],
      authoredFloor:actual??null,
      realWorldFloor:physical,
      authoredHead:Object.freeze(head.map(v=>v??null)),
      fullyAuthoredFloor:actual!==undefined&&actual!==BLOCK.AIR,
      fullyAuthoredHead:head.every(v=>v===BLOCK.AIR),
      realBodyFree:!collides(world,q.x+.5,q.floor+1,q.z+.5),
      realGroundContact:collides(world,q.x+.5,q.floor+1-GROUND_PROBE,q.z+.5),
      canonicalFloorCap:!!cap,cardinalAdjacent:adjacent
    });
    observations.push(fact);
    if(!cap||!adjacent)break;
    caps.push(Object.freeze({...cap,original36Source:q.label}));
    prior=q;
  }
  let nativeAttempt=null;
  if(caps.length===originalSteps.length){
    const joined=Object.freeze({
      ...base,path:Object.freeze([...base.path,...caps]),
      original36ConnectionSourceOnly:true,
      networkContinuationCells:caps.length,
      fullDeepNetworkAccepted:false
    });
    // Real unmodified original stepPlayer is the ONLY acceptance authority.
    nativeAttempt=replayFullOriginalM7CaveAnchorWalk(world,joined);
  }
  return Object.freeze({ok:true,anchor:base.completedSourceAnchor,
    proposedOriginalOwnerSteps:originalSteps.length,
    sourceAuthenticatedSteps:caps.length,
    sourceObservations:Object.freeze(observations),
    actualFullJoinedPhysicsAttempt:nativeAttempt,
    actualJoinedPhysicsAccepted:nativeAttempt?.ok===true,
    // Never infer the entire switchback/upper network from a first
    // few authored cells or an AIR pocket near the entry.
    entireNetworkProven:false,
    inferredOrFilledOriginalTerrain:false});
}
