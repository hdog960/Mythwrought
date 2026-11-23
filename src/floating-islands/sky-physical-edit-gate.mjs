// MYTHWROUGHT Floating Islands — detached source-authorized mine/place plan.
// Actual original shape-aware ray selection, original voxel physical world and
// collision-veto callbacks retain authority. No world, save or GPU mutation.
// This is NOT Codex's unavailable upper-world save/selection implementation.
import {planSkySessionEdit} from './sky-edit-session.mjs';
import {skyIslandMeshKey,skyIslandSectionForY} from './sky-runtime-adapter.mjs';

const fail=s=>{throw new TypeError('Sky physical edit gate: '+s);};
const safe=Number.isSafeInteger;
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const tok=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const cell=x=>Array.isArray(x)&&x.length===3&&x.every(safe)&&
  Math.abs(x[0])<=10000000&&x[1]>=19&&x[1]<=256&&Math.abs(x[2])<=10000000;
const coord=(a)=>a.join(',');
const eq=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
  a.every((x,i)=>x===b[i]);
const result=(reason)=>Object.freeze({ok:false,reason,sourceOnly:true,
  worldWrites:0,groundSaveWrites:0,skySaveWrites:0,gpuUploads:0});
const angles=[[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1],[0,0,0]];
const key=(x,y,z)=>skyIslandMeshKey(Math.floor(x/16),Math.floor(z/16),skyIslandSectionForY(y));

function authority(source,overlay,session){
  overlay.assertFresh();
  const id=source.readIdentity(),rev=source.readWorldRevision();
  if(!id||!tok(id.worldToken)||!tok(id.generatorFingerprint)||
    !safe(id.epoch)||id.epoch<0||!safe(id.seed)||!safe(rev)||rev<0||
    id.worldToken!==overlay.identity.worldToken||
    id.generatorFingerprint!==overlay.identity.generatorFingerprint||
    id.epoch!==overlay.identity.epoch||id.seed!==overlay.identity.seed||
    session.state.worldId!==id.worldToken||
    session.state.generatorFingerprint!==id.generatorFingerprint||
    session.state.seed!==id.seed)
    fail('sky edit against stale source, ecology or player save identity');
  return Object.freeze({worldToken:id.worldToken,generatorFingerprint:id.generatorFingerprint,
    epoch:id.epoch,seed:id.seed,worldRevision:rev});
}
const same=(a,b)=>Object.keys(a).every(k=>a[k]===b[k]);
function matchPlayerSnapshot(session,overlay){
  const edits=overlay.copyPlayerEdits(),rotations=overlay.copyPlayerRotations();
  if(!(edits instanceof Map)||!(rotations instanceof Map)||edits.size!==session.state.edits.length)
    fail('player AIR/rotation snapshot differs from ecology world');
  for(const [x,y,z,id,rotation] of session.state.edits){
    const k=`${x},${y},${z}`;
    if(!edits.has(k)||edits.get(k)!==id||(rotations.get(k)??0)!==rotation)
      fail('original player edit or physical rotation not reflected in ecology');
  }
  return true;
}
function surfaceHalo(source,target){
  const revisions=new Map(),ground=new Map();
  for(const [dx,dy,dz] of angles){
    const [x,y,z]=[target[0]+dx,target[1]+dy,target[2]+dz];
    if(y>=20&&y<=256){
      const sectionKey=key(x,y,z);
      if(!revisions.has(sectionKey)){
        const r=source.sectionRevision(sectionKey);
        if(!safe(r)||r<0)fail('original upper section revision unavailable');
        revisions.set(sectionKey,r);
      }
    }
    if(y===19){
      const c=`${Math.floor(x/16)},${Math.floor(z/16)}`;
      if(!ground.has(c)){
        if(typeof source.groundRevision!=='function')fail('Y19/20 surface revision authority required');
        const r=source.groundRevision(c);
        if(!safe(r)||r<0)fail('original ground revision unavailable');
        ground.set(c,r);
      }
    }
  }
  // A Y20 edit can reveal Y19 faces in the original surface chunk and
  // its horizontal neighbors. Fence those owners even if some are not yet
  // resident: publication may rebuild them in a later frame.
  if(target[1]===20){
    const cx=Math.floor(target[0]/16),cz=Math.floor(target[2]/16);
    const horizontal=[[cx,cz]],lx=target[0]-cx*16,lz=target[2]-cz*16;
    if(lx===0)horizontal.push([cx-1,cz]);
    if(lx===15)horizontal.push([cx+1,cz]);
    if(lz===0)horizontal.push([cx,cz-1]);
    if(lz===15)horizontal.push([cx,cz+1]);
    for(const [a,b] of horizontal){
      const k=a+','+b;
      if(ground.has(k))continue;
      if(typeof source.groundRevision!=='function')fail('Y19/20 surface revision authority required');
      const r=source.groundRevision(k);
      if(!safe(r)||r<0)fail('original ground revision unavailable');
      ground.set(k,r);
    }
  }
  return [revisions,ground];
}
function matchingRay(a,b){
  return a&&b&&eq(a.hit,b.hit)&&
    ((a.adjacent===null||a.adjacent===undefined)&&(b.adjacent===null||b.adjacent===undefined)||
    eq(a.adjacent,b.adjacent))&&valid(a.distance)&&valid(b.distance)&&
    Math.abs(a.distance-b.distance)<=1e-7;
}

export function planPhysicalSkyEdit({session,overlay,source,physicalHost,action,
  eye,direction,blockId,rotation=0,playerBody,loadedSkyKeys,
  loadedGroundKeys=new Set(),range=7}={}){
  if(!session?.state||!session.context||!overlay||
     typeof overlay.assertFresh!=='function'||typeof overlay.get!=='function'||
     typeof overlay.copyPlayerEdits!=='function'||
     typeof overlay.copyPlayerRotations!=='function'||
     !source||!['readIdentity','readWorldRevision','sectionRevision','isProtectedCell',
       'isSkySectionResident','canRaycastLoaded','readPlayerEye',
       'readPlayerBody'].every(k=>typeof source[k]==='function')||
     source.physicalWorld!==physicalHost?.world||
     typeof physicalHost.physical?.raycast!=='function'||
     !['mine','place'].includes(action)||
     !Array.isArray(eye)||eye.length!==3||!eye.every(valid)||
     !Array.isArray(direction)||direction.length!==3||!direction.every(valid)||
     Math.hypot(...direction)<1e-9||!valid(range)||range<=0||range>7||
     !(loadedSkyKeys instanceof Set)||!(loadedGroundKeys instanceof Set))
    fail('genuine original ray/physical world, bounded selection and source revisions required');
  if(action==='place'&&(!safe(blockId)||blockId<=0||blockId>65534||
      !safe(rotation)||rotation<0||rotation>3||
      typeof source.canPlaceCell!=='function'||!playerBody))
    fail('registered placement and original player-body collision veto required');
  const liveEye=source.readPlayerEye(),liveBody=source.readPlayerBody();
  const originalEye=Object.freeze([...eye]),originalDirection=Object.freeze([...direction]);
  const originalBody=liveBody&&Object.freeze({...liveBody});
  if(!eq(originalEye,liveEye)||!originalBody||
     ![originalBody.x,originalBody.feet,originalBody.z].every(valid)||
     (action==='place'&&(!playerBody||
      [playerBody.x,playerBody.feet,playerBody.z].some((v,i)=>
        v!==[originalBody.x,originalBody.feet,originalBody.z][i]))))
    fail('source selection must use the actual current original player eye and body');
  if(session.context.naturalAt!==overlay.naturalAt)
    fail('player edit baseline must be exact certified natural ecology');
  const before=authority(source,overlay,session);
  matchPlayerSnapshot(session,overlay);
  if(source.canRaycastLoaded(originalEye,originalDirection,range)!==true)
    return result('Original ray path crosses an unloaded region');
  const selected=physicalHost.physical.raycast(originalEye,originalDirection,range);
  if(!selected||!cell(selected.hit)||!valid(selected.distance)||selected.distance<0||
     selected.distance>range+1e-8)return result('No bounded original physical ray target');
  // Never retain caller-owned ray arrays: the original host or another
  // callback could mutate the same result object during the second read.
  const firstRay=Object.freeze({hit:Object.freeze([...selected.hit]),
    adjacent:cell(selected.adjacent)?Object.freeze([...selected.adjacent]):null,
    distance:selected.distance});
  const target=action==='mine'?firstRay.hit:firstRay.adjacent;
  if(!cell(target)||target[1]<20)return result('Selected cell outside authoritative upper world');
  const [x,y,z]=target,section=key(x,y,z);
  if(!loadedSkyKeys.has(section)||source.isSkySectionResident(section)!==true)
    return result('Target upper section not GPU-resident in original renderer');
  if(source.isProtectedCell(x,y,z))return result('Original physical cell protected');
  if(physicalHost.world.get(x,y,z)!==overlay.get(x,y,z))
    return result('Original physical world and edited ecology do not agree');
  const occupied=overlay.get(x,y,z);
  if(action==='mine'&&occupied===0)return result('Original selected cell already AIR');
  if(action==='place'&&occupied!==0)return result('Placement target already physically occupied');
  if(action==='place'&&source.canPlaceCell({x,y,z,id:blockId,rotation,playerBody:originalBody,
    world:physicalHost.world})!==true)
    return result('Original shape/actor placement veto');
  const revisions=surfaceHalo(source,target);
  const check=()=>{
    const after=authority(source,overlay,session);
    if(!same(before,after))fail('source changed during sky edit planning');
    for(const [s,rev] of revisions[0])if(source.sectionRevision(s)!==rev)
      fail('upper seam changed during sky edit planning');
    for(const [g,rev] of revisions[1])if(source.groundRevision(g)!==rev)
      fail('original Y19 surface changed during sky edit planning');
    matchPlayerSnapshot(session,overlay);
    const nextBody=source.readPlayerBody();
    if(!eq(originalEye,source.readPlayerEye())||!nextBody||
       [nextBody.x,nextBody.feet,nextBody.z].some((v,i)=>
         v!==[originalBody.x,originalBody.feet,originalBody.z][i]))
      fail('original player moved during sky selection planning');
    if(physicalHost.world.get(x,y,z)!==occupied||
       !loadedSkyKeys.has(section)||source.isSkySectionResident(section)!==true||
       source.isProtectedCell(x,y,z)||source.canRaycastLoaded(originalEye,originalDirection,range)!==true)
      fail('original selection source, residency or protection changed during edit');
    if(action==='place'&&source.canPlaceCell({x,y,z,id:blockId,rotation,playerBody:originalBody,
      world:physicalHost.world})!==true)
      fail('original placement clearance changed during edit');
    return true;
  };
  check();
  const second=physicalHost.physical.raycast(originalEye,originalDirection,range);
  if(!matchingRay(firstRay,second))fail('original physical ray selection changed during planning');
  check();
  const planned=planSkySessionEdit(session,{x,y,z,id:action==='mine'?0:blockId,
    rotation:action==='mine'?0:rotation,
    expectedRevision:session.state.revision,worldId:before.worldToken,
    generatorFingerprint:before.generatorFingerprint},
    {loadedSkyKeys,loadedGroundKeys});
  check();
  if(!planned.ok||!planned.changed)return result(planned.reason||'No physical cell edit');
  return Object.freeze({ok:true,action,target:Object.freeze([...target]),
    previousId:occupied,proposedId:action==='mine'?0:blockId,
    candidate:planned.session,meshInvalidations:planned.meshInvalidations,
    expectedWorldRevision:before.worldRevision,
    sourceSkyRevisions:Object.freeze([...revisions[0]].map(row=>Object.freeze([...row]))),
    sourceGroundRevisions:Object.freeze([...revisions[1]].map(row=>Object.freeze([...row]))),
    assertFresh:check,originalRayDistance:firstRay.distance,
    worldWrites:0,groundSaveWrites:0,skySaveWrites:0,gpuUploads:0,
    sourceOnly:true});
}
