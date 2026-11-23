// SNOW S6 DETACHED cross-owner forest certificate, never registered or live.
// Four 16x16 consumer chunks, exact canonical-owner source trees, original
// M7 player-body collision and cave readers. NO world/set/save/mesh mutations.
import {previewSnowS3CanonicalOwnerChunk}
  from './snowy-s3-owner-chunk-preview.mjs';
import {reviewSnowS3PlayerApprovedChunk}
  from './snowy-s3-player-approved-chunk.mjs';
import {auditSnowS3OriginalPlayerBody}
  from './snowy-s3-player-body-audit.mjs';
const M7='mythwrought-five-surface-regions-v7';
const STYLES=new Set(['compact-fir','layered-spruce','highland-pine','windswept-alpine']);
const BLOCKS=new Set([4,406,407]);
const freeze=Object.freeze;
const cellKey=(x,y,z)=>x+','+y+','+z;
const integer=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const fail=(reason,extra={})=>freeze({kind:'detached-S6-cross-owner-original-body-forest',
  safe:false,reason,...extra,writerEnabled:false});
const cellSort=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]||a[3]-b[3];
const sorted=a=>a.slice().sort(cellSort);
const sameCells=(a,b)=>JSON.stringify(sorted(a))===JSON.stringify(sorted(b));

/** Test both request orders without permitting an order-dependent world.
 * For real acceptance, deps.collides MUST be the original voxel.collides.
 * The result is a strict OFFLINE single four-chunk window, NOT a proof of
 * unbounded multi-owner forests or actual on-device frame time.
 */
export function auditSnowS6CrossOwnerForest(world,cx,cz,deps={},options={}){
  if(!integer(cx)||!integer(cz)||!Number.isInteger(world?.seed)||
    world.seed!==(world.seed|0)||world?.generationProfile?.generator!==M7||
    !(world.edits instanceof Map)||typeof world.save!=='function'||
    typeof world.get!=='function'||typeof world.environmentCaves?.get!=='function'||
    typeof deps.collides!=='function'||typeof deps.proposedSnowTree!=='function'||
    options?.reverse!==undefined&&typeof options.reverse!=='boolean'||
    options?.stepPlayer!==undefined&&typeof options.stepPlayer!=='function'||
    options?.width!==undefined&&options.width!==3&&options.width!==2||
    options?.height!==undefined&&options.height!==2)
    return fail('original-M7-forest-source-contract-required');
  const startSave=JSON.stringify(world.save());
  // A 3x2 original-window opt-in verifies multi-owner original-world
  // movement. Default remains the EXACT earlier 2x2 original acceptance.
  const width=options.width??2,height=options.height??2,box=[];
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++)
    box.push([cx+dx,cz+dz]);
  if(box.some(([x,z])=>!integer(x)||!integer(z)))return fail('original-chunk-window-unbounded');
  const ordered=options.reverse?[...box].reverse():box;
  const previews=new Map(),ownerIds=new Set();
  for(const [x,z] of ordered){
    const id=x+','+z;
    let p;
    try{p=previewSnowS3CanonicalOwnerChunk(world,x,z,deps)}
    catch{return fail('canonical-consumer-preview-threw')}
    if(!p.safe)return fail('canonical-consumer-source-failed:'+p.reason);
    if(p.cx!==x||p.cz!==z||p.physicalCells!==p.cells.length||
      p.physicalCells>640||p.accepted.length>24)
      return fail('canonical-consumer-budget-or-coordinate-mismatch');
    previews.set(id,p);
    for(const a of p.accepted)ownerIds.add(a.ownerChunk);
  }
  const owners=new Map();
  for(const id of [...ownerIds].sort()){
    const [ox,oz]=id.split(',').map(Number);
    if(!integer(ox)||!integer(oz))return fail('invalid-original-owner-chunk');
    let r;
    try{r=reviewSnowS3PlayerApprovedChunk(world,ox,oz,deps)}
    catch{return fail('original-owner-reconstruction-threw')}
    if(!r.safe)return fail('original-owner-reconstruction-failed:'+r.reason);
    if(r.cx!==ox||r.cz!==oz||r.admitted.length>24)
      return fail('original-owner-source-budget-exceeded');
    owners.set(id,r);
  }
  const candidates=new Map(),chunks=[];
  for(const [x,z] of box){
    const id=x+','+z,p=previews.get(id),expected=[],actual=p.cells;
    for(const accepted of p.accepted){
      const owner=owners.get(accepted.ownerChunk);
      const t=owner?.admitted.find(t=>t.key===accepted.key);
      if(!t||!STYLES.has(t.style)||!Array.isArray(t.cells)||
        t.cells.length<16||t.cells.length>119||
        !Number.isSafeInteger(t.x)||!Number.isSafeInteger(t.z)||
        accepted.ownerChunk!==Math.floor(t.x/16)+','+Math.floor(t.z/16))
        return fail('unproven-original-tree-style-or-owner');
      if(candidates.has(t.key)){
        const other=candidates.get(t.key);
        if(other.owner!==accepted.ownerChunk||other.style!==t.style||
          !sameCells(other.cells,t.cells))
          return fail('inconsistent-owner-acceptance-across-chunks');
      }else{
        let generated;
        try{generated=deps.proposedSnowTree(t.style,t.x,t.floor,t.z,{wind:t.wind})}
        catch{return fail('original-snow-tree-factory-threw')}
        if(generated?.style!==t.style||!sameCells(generated.cells,t.cells))
          return fail('unproven-original-tree-physical-silhouette');
        candidates.set(t.key,{...t,owner:accepted.ownerChunk});
      }
      for(const cell of t.cells){
        if(Math.floor(cell[0]/16)===x&&Math.floor(cell[2]/16)===z)
          expected.push(cell);
      }
    }
    if(!sameCells(actual,expected))return fail('consumer-slice-not-exact-owner-cells');
    chunks.push(freeze({cx:x,cz:z,accepted:p.accepted.length,
      physicalCells:p.physicalCells,ownerReviews:p.ownerReviews}));
  }
  if(candidates.size>96||owners.size>24)
    return fail('four-chunk-owner-budget-exceeded');
  const all=[...candidates.values()].sort((a,b)=>
    a.owner.localeCompare(b.owner)||a.key.localeCompare(b.key));
  const cellOwners=new Map(),source=[];
  for(const tree of all){
    for(const cell of tree.cells){
      if(!Array.isArray(cell)||cell.length!==4||
        !cell.every(Number.isSafeInteger)||!BLOCKS.has(cell[3]))
        return fail('invalid-original-physical-tree-cell');
      const [x,y,z,id]=cell,k=cellKey(x,y,z);
      if(y<1||y>19||cellOwners.has(k))
        return fail('cross-owner-physical-cell-overlap');
      cellOwners.set(k,id);
      const cave=world.environmentCaves.get(x,y,z),block=world.get(x,y,z);
      if(cave!==undefined||block!==0||world.edits.has(k))
        return fail('original-cave-edit-or-physical-occupancy-veto');
      source.push([x,y,z,cave===undefined?null:cave,block,world.edits.has(k)]);
    }
  }
  // Now check all UNIQUE trees in globally deterministic owner+site order
  // against previous admitted owners, not just each owner's private forest.
  // Every stage is a read-only world.get overlay. A severed directed original
  // player passage fails the WHOLE audit; no silent pruning for green counts.
  const stagedCells=new Map(),staged=Object.create(world);
  staged.get=(x,y,z)=>stagedCells.get(cellKey(x,y,z))??world.get(x,y,z);
  staged.save=()=>world.save();
  let bodyProbes=0,protectedPairs=0;
  const styles={};
  for(const tree of all){
    const certificate=auditSnowS3OriginalPlayerBody(staged,tree,{collides:deps.collides});
    bodyProbes+=certificate.collisionProbes??0;
    if(!certificate.safe)return fail('multi-owner-player-passage:'+certificate.reason,
      {checkedTrees:Object.keys(styles).reduce((s,k)=>s+styles[k],0),
        bodyProbes});
    protectedPairs+=certificate.preservedPairs;
    styles[tree.style]=(styles[tree.style]??0)+1;
    for(const [x,y,z,id] of tree.cells)stagedCells.set(cellKey(x,y,z),id);
  }
  if(stagedCells.size!==cellOwners.size)
    return fail('original-cross-owner-physical-union-incomplete');
  // Original stepPlayer is injected by the genuine full-repository gate, NOT
  // simulated. Each local player path is independent; the voxel read-through
  // includes the ENTIRE accepted union from every original owner.
  let stepFrames=0,walkedTrees=0,originalClearStarts=0;
  const walks=[];
  if(options.stepPlayer){
    for(const tree of all){
      let selected=null;
      for(const [dx,dz] of [[0,-2.5],[0,2.5],[-2.5,0],[2.5,0]]){
        const state={x:tree.x+dx+.5,z:tree.z+dz+.5,feet:tree.floor+1,
          yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,
          jumpBuffer:0};
        try{
          if(deps.collides(world,state.x,state.feet,state.z)||
            deps.collides(staged,state.x,state.feet,state.z))continue;
          originalClearStarts++;
          const start=[state.x,state.z,state.feet];
          for(let tick=0;tick<45;tick++){
            options.stepPlayer(staged,state,{forward:1,strafe:0,jump:false},1/60);
            if(![state.x,state.z,state.feet].every(Number.isFinite)||
              deps.collides(staged,state.x,state.feet,state.z))
              return fail('genuine-original-stepPlayer-penetration-or-invalid-pose',
                {treeKey:tree.key,atTick:tick});
            stepFrames++;
          }
          selected=freeze({treeKey:tree.key,owner:tree.owner,start:freeze(start),
            end:freeze([state.x,state.z,state.feet]),frames:45});
          walkedTrees++;
          break;
        }catch(error){return fail('genuine-original-stepPlayer-callback-failed',
          {treeKey:tree.key,detail:String(error?.message??error)});}
      }
      if(selected)walks.push(selected);
    }
  }
  for(const [x,y,z,cave,block,edit] of source){
    const current=world.environmentCaves.get(x,y,z);
    if((current===undefined?null:current)!==cave||
      world.get(x,y,z)!==block||world.edits.has(cellKey(x,y,z))!==edit)
      return fail('original-world-source-mutated-during-forest-audit');
  }
  if(JSON.stringify(world.save())!==startSave)
    return fail('original-schema-1-save-mutated-during-forest-audit');
  return freeze({kind:'detached-S6-cross-owner-original-body-forest',
    safe:true,window:freeze([cx,cz,width,height]),chunks:freeze(chunks),
    distinctOwnerReviews:owners.size,distinctAcceptedTrees:all.length,
    physicalCells:stagedCells.size,styleCounts:freeze(styles),
    trees:freeze(all.map(t=>freeze({key:t.key,owner:t.owner,style:t.style,
      x:t.x,z:t.z,floor:t.floor,physicalCells:t.cells.length}))),
    bodyProbes,protectedDirectedPortalPairs:protectedPairs,
    originalStepPlayerSourceUsed:Boolean(options.stepPlayer),
    originalStepFrames:stepFrames,originalWalkedTrees:walkedTrees,
    originalClearWalkStarts:originalClearStarts,walks:freeze(walks),
    originalSourceUnchanged:true,readOnly:true,notLiveM7:true,
    noWholeWorldApproval:true,noIPhoneOrVisualApproval:true,
    writerEnabled:false});
}
