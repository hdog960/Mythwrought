// Original Enchanted Forest Phase 2 :24 upper-network source and walking
// junction audit. All floor, AIR, corner and body evidence comes from the
// ORIGINAL upperCaveCells generator, independently verified against the M7
// combined reader and real world collision. Never infer a missing bridge.
// This does not register the caves or modify a save, tree or movement rule.
import {BLOCK,worldKey} from '../voxel.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN} from '../deep-cave-network.mjs';
import {deepVaultCells} from '../deep-vault-galleries.mjs';
import {descentCells,DESCENT_ORIGIN} from '../underground-switchback-descent.mjs';
import {upperCaveCells,UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {originalCaveEntranceSites} from '../manual-caves/entrance-preflight.mjs';
import {originalM7AuthoredCaveFloorCap}
  from './enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,
 replayFullOriginalM7CaveAnchorWalk}
  from './enchanted-original-full-anchor-continuity.mjs';

export const ORIGINAL_UPPER_M7_BOUNDS=Object.freeze({
  ownerSteps:24,waypoints:144
});
const known=Object.freeze({
  'upper24-windcut':0,'upper24-hollowbend':1
});
const original=w=>w?.profile?.generator===M7_ENVIRONMENT_GENERATOR&&
  Number.isInteger(w.seed)&&w.seed===(w.seed|0)&&
  typeof w.environmentCaves?.get==='function'&&typeof w.get==='function';
const floorRecord=(p)=>[p.x,p.surface,p.z];
const fail=(reason,detail={})=>Object.freeze({ok:false,reason,...detail});
function inspectOwnerCap(world,owner,x,floor,z){
  const originalFloor=owner.cells.get(worldKey(x,floor,z));
  const head=[1,2,3].map(i=>owner.cells.get(worldKey(x,floor+i,z)));
  const actual=originalM7AuthoredCaveFloorCap(world,x,floor,z);
  const authorOwned=originalFloor!==undefined&&originalFloor!==BLOCK.AIR&&
    head.every(id=>id===BLOCK.AIR);
  const exactM7=authorOwned&&!!actual&&
    actual.material===originalFloor;
  return Object.freeze({
    x,floor,z,originalFloor:originalFloor??null,
    originalHead:Object.freeze(head.map(x=>x??null)),
    actualWorldFloor:world.get(x,floor,z),
    actualCombinedSourceFloor:world.environmentCaves.get(x,floor,z)??null,
    authorOwned,exactM7,
    cap:exactM7?actual:null
  });
}
function sourceUpperOwner(seed,which){
  // This duplicates NO plan geometry: call exactly the original source
  // composer inputs and the exact author exported upperCaveCells function.
  const originalSources=[
    deepCaveCells(DEEP_CAVE_ORIGIN),deepVaultCells(seed),
    descentCells(DESCENT_ORIGIN)
  ];
  const reservation=originalSources[2];
  const protectedCells=new Set(originalSources.flatMap(x=>[...x.keys()]));
  const site=UPPER_SITES[which];
  const owner=upperCaveCells({seed,site,
    descentReservation:reservation,
    protectedCells,editedCells:new Set(),legacyCells:()=>null});
  if(!owner.ok)return fail('original-upper-owner-source-rejected',
    {originalOwnerReason:owner.reason,originalConflictCount:owner.conflictCount??0});
  return Object.freeze({ok:true,site,owner});
}

// Two adjacent author route centers may differ by both x and z. An
// intermediary cell is permitted ONLY when the exact original upper
// author explicitly owns its floor AND all three headroom AIR voxels, the
// real M7 world exposes them and the body has actual support. No guessed
// L-turns, gravity shortcuts or virtual corner blocks.
export function auditOriginalM7UpperAnchorWalk(world,name,{ownerSteps=8}={}){
  if(!original(world)||!Object.hasOwn(known,name)||
     !Number.isInteger(ownerSteps)||ownerSteps<1||
     ownerSteps>ORIGINAL_UPPER_M7_BOUNDS.ownerSteps)
    throw Error('Invalid original M7 upper route audit');
  const base=planFullOriginalM7CaveAnchorWalk(world,name);
  if(!base.ok)return fail('original-upper-entrance-not-physically-authored',
    {name,baseReason:base.reason,sourceOnly:true});
  const selected=sourceUpperOwner(world.seed,known[name]);
  if(!selected.ok)return fail(selected.reason,{name,sourceOnly:true});
  const {owner,site}=selected;
  const authorAnchor=originalCaveEntranceSites().find(s=>s.name===name);
  const first=owner.route?.[0];
  if(!authorAnchor||!first||first.x!==authorAnchor.x||
     first.z!==authorAnchor.z||first.floor!==authorAnchor.floor||
     site.x!==authorAnchor.x||site.z!==authorAnchor.z)
    throw Error('Original source upper route does not start at canonical M7 anchor');
  const path=[...base.path],observations=[];
  let predecessor=path.at(-1),ownerCount=0;
  for(let i=1;i<=ownerSteps;i++){
    const q=owner.route[i];
    if(!q)return fail('original-upper-source-route-out-of-bounds',
      {name,atStep:i,sourceStepsConfirmed:ownerCount,observations});
    const dx=q.x-predecessor.x,dz=q.z-predecessor.z;
    if(Math.abs(dx)>1||Math.abs(dz)>1||!dx&&!dz)
      return fail('original-upper-route-discontinuous',
        {name,atStep:i,sourceStepsConfirmed:ownerCount,
         source:[q.x,q.floor,q.z],observations});
    // Every diagonal is split ONLY across an actually owner-authored
    // integral voxel floor. Try both cardinal orderings and both REAL
    // already authored endpoints' elevations, never insert fictitious AIR.
    if(dx&&dz){
      let choice=null;
      for(const [x,z] of [[q.x,predecessor.z],
                          [predecessor.x,q.z]]){
        for(const floor of [predecessor.surface,q.floor]){
          const cap=inspectOwnerCap(world,owner,x,floor,z);
          if(cap.exactM7&&
             Math.abs(cap.cap.feet-predecessor.feet)<=1.01&&
             Math.abs(cap.cap.feet-(q.floor+1))<=1.01){
            choice=cap;break;
          }
        }
        if(choice)break;
      }
      if(!choice)return fail('original-upper-diagonal-has-no-authored-supported-corner',
        {name,atStep:i,sourceStepsConfirmed:ownerCount,
          prior:floorRecord(predecessor),
          target:[q.x,q.floor,q.z],
          observations:Object.freeze(observations)});
      path.push(Object.freeze({...choice.cap,
        owner:'original-upper-owner-supported-corner',
        upperRouteStep:i,corner:true}));
      predecessor=path.at(-1);
      observations.push(Object.freeze({step:i,kind:'owner-authored-corner',
        at:floorRecord(predecessor)}));
    }
    const end=inspectOwnerCap(world,owner,q.x,q.floor,q.z);
    if(!end.exactM7||
       Math.abs(end.cap.feet-predecessor.feet)>1.01||
       Math.abs(end.cap.x-predecessor.x)+
       Math.abs(end.cap.z-predecessor.z)!==1)
      return fail('original-upper-center-not-authored-or-adjacent',
        {name,atStep:i,sourceStepsConfirmed:ownerCount,
          prior:floorRecord(predecessor),target:[q.x,q.floor,q.z],
          inspected:Object.freeze({...end,cap:null}),
          observations:Object.freeze(observations)});
    path.push(Object.freeze({...end.cap,owner:'original-upper-owner-center',
      upperRouteStep:i,corner:false}));
    predecessor=path.at(-1);
    ownerCount++;
    observations.push(Object.freeze({step:i,kind:'original-upper-route-center',
      at:floorRecord(predecessor)}));
  }
  if(path.length>ORIGINAL_UPPER_M7_BOUNDS.waypoints)
    throw Error('Original upper physically sourced path exceeds research budget');
  const plan=Object.freeze({...base,path:Object.freeze(path),
    upperOwnerName:site.name,sourceOwnedUpperRouteSteps:ownerCount,
    upperOwnerSourceObserved:true,
    fullDeepNetworkAccepted:false});
  const physics=replayFullOriginalM7CaveAnchorWalk(world,plan);
  return Object.freeze({ok:true,name,siteName:site.name,
    sourceOwnedUpperSteps:ownerCount,
    extraVerifiedPhysicalWaypoints:path.length-base.path.length,
    lastSourceUpperCenter:floorRecord(predecessor),
    authoredCornersAdded:observations.filter(a=>a.kind==='owner-authored-corner').length,
    observations:Object.freeze(observations),
    physics,
    physicallyTraversedUpperSteps:physics.ok?ownerCount:0,
    upperPhysicsAccepted:physics.ok,
    sourceUnchanged:true,
    wholeUpperNetworkProven:false});
}
