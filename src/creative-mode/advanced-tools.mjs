// Mythwrought Roadmap 9 M6 — isolated, fail-closed advanced building tools.
// Pure plans over M4/M5 detached memory. NO game, storage, chunks, registry or save writes.
import {BUILD_ABI,MAX_BATCH_EDITS,planBuildBatch} from './build-model.mjs';
import {HISTORY_ABI,buildFingerprint,executeHistoryBatch} from './history-model.mjs';
import {stablePlaceableKey} from './inventory-model.mjs';

export const ADVANCED_TOOLS_ABI='mythwrought.creative.tools.v1';
export const MAX_SELECTION_CELLS=216;
export const MAX_SELECTION_SPAN=12;
export const MAX_TOOL_ACTIONS=MAX_BATCH_EDITS;
const INT=Number.isSafeInteger;
const validPoint=p=>p&&INT(p.x)&&INT(p.y)&&INT(p.z);
const copy=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
const key=p=>`${p.x},${p.y},${p.z}`;
const failure=(session,reason)=>Object.freeze({ok:false,reason,session});
const sorted=p=>p.sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
const validID=id=>typeof id==='string'&&/^[A-Za-z][A-Za-z0-9_.:-]{1,127}$/.test(id)||INT(id)&&id>0;
function enumerateBox(a,b){
 const lo={x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),z:Math.min(a.z,b.z)};
 const hi={x:Math.max(a.x,b.x),y:Math.max(a.y,b.y),z:Math.max(a.z,b.z)};
 const dx=hi.x-lo.x+1,dy=hi.y-lo.y+1,dz=hi.z-lo.z+1;
 if([dx,dy,dz].some(n=>n>MAX_SELECTION_SPAN)||dx*dy*dz>MAX_SELECTION_CELLS)
  throw Error('selection-limit');
 const cells=[];
 for(let y=lo.y;y<=hi.y;y++)for(let z=lo.z;z<=hi.z;z++)for(let x=lo.x;x<=hi.x;x++)cells.push(copy({x,y,z}));
 return cells;
}
function enumerateLine(a,b){
 const n=Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.z-b.z));
 if(n+1>MAX_SELECTION_CELLS)throw Error('selection-limit');
 const cells=new Map();
 for(let i=0;i<=n;i++){
  const frac=n===0?0:i/n;
  const p=copy({x:Math.round(a.x+(b.x-a.x)*frac),y:Math.round(a.y+(b.y-a.y)*frac),z:Math.round(a.z+(b.z-a.z)*frac)});
  cells.set(key(p),p);
 }
 return [...cells.values()];
}
// Selection is bounded before any M4 transaction and contains only explicit integer voxels.
// Plane requires an explicit fixed coordinate; line uses integer 3D DDA sampling.
export function selectToolCells({tool,a,b,axis='y'}={}){
 if(!['fill','replace','line','plane'].includes(tool)||!validPoint(a)||!validPoint(b))throw Error('invalid-selection');
 const cells=tool==='line'?enumerateLine(a,b):enumerateBox(a,b);
 if(tool==='plane'&&(!['x','y','z'].includes(axis)||a[axis]!==b[axis]))throw Error('plane-axis-mismatch');
 return Object.freeze(sorted(cells).map(copy));
}
function createActions(state,request,cells){
 const {tool,id,sourceId,rotation=0}=request;
 if(!validID(id)||!INT(rotation)||rotation<0||rotation>3)throw Error('invalid-target');
 if(tool!=='replace')return cells.map(at=>({type:'place',id,at,rotation}));
 if(!validID(sourceId))throw Error('invalid-source');
 const selected=new Set(cells.map(key)),matches=[];
 for(const placed of state.placements){
  if(stablePlaceableKey(placed.id)!==stablePlaceableKey(sourceId))continue;
  const within=placed.cells.filter(c=>selected.has(key(c))).length;
  if(within && within!==placed.cells.length)throw Error('partial-object-selection');
  if(within===placed.cells.length){
   if(stablePlaceableKey(placed.id)===stablePlaceableKey(id)&&placed.rotation===rotation)continue;
   matches.push(placed);
  }
 }
 if(!matches.length)throw Error('no-matching-placements');
 // Anchors, not individual occupied cells, are replaced. M4 checks the complete
 // old/new shape, support, collision and authority for each atomic pair.
 matches.sort((a,b)=>a.at.y-b.at.y||a.at.z-b.at.z||a.at.x-b.at.x);
 return matches.flatMap(p=>[{type:'remove',at:p.at},{type:'place',id,at:p.at,rotation}]);
}
function lockActions(actions){return Object.freeze(actions.map(a=>Object.freeze({...a,at:copy(a.at)})));}
export function previewAdvancedTool(session,request,ctx={}){
 if(session?.abi!==HISTORY_ABI||session.state?.abi!==BUILD_ABI)throw TypeError('Invalid detached M4/M5 session');
 let cells,actions;
 try {cells=selectToolCells(request);actions=createActions(session.state,request,cells);}
 catch(e){return failure(session,e.message||'invalid-tool-selection');}
 if(!actions.length||actions.length>MAX_TOOL_ACTIONS)return failure(session,'tool-action-limit');
 const locked=lockActions(actions);
 const planned=planBuildBatch(session.state,locked,ctx);
 if(!planned.ok)return failure(session,planned.reason);
 const signature=buildFingerprint(session.state),out=buildFingerprint(planned.state);
 if(signature===out)return failure(session,'no-op-transaction');
 return Object.freeze({ok:true,abi:ADVANCED_TOOLS_ABI,session,sourceRevision:session.state.revision,
  sourceFingerprint:signature,expectedFingerprint:out,request:Object.freeze({...request,a:copy(request.a),b:copy(request.b)}),
  selectedCells:cells,actions:locked,previewPlacements:planned.state.placements,
  refreshChunks:planned.transaction.refreshChunks,changes:planned.transaction.changeCount,
  touchCount:planned.transaction.touchCount,worldCommitted:false,persisted:false});
}
// Re-executes through M5 -> M4 at commit time. A stale/forged/different preview
// or changed adapter result fails atomically with the ORIGINAL session.
export function commitAdvancedTool(session,preview,ctx={}){
 if(session?.abi!==HISTORY_ABI||session.state?.abi!==BUILD_ABI)throw TypeError('Invalid detached history');
 if(preview?.ok!==true||preview.abi!==ADVANCED_TOOLS_ABI)return failure(session,'invalid-preview');
 if(preview.sourceRevision!==session.state.revision||preview.sourceFingerprint!==buildFingerprint(session.state))
  return failure(session,'stale-preview');
 const rechecked=previewAdvancedTool(session,preview.request,ctx);
 if(!rechecked.ok||rechecked.sourceFingerprint!==preview.sourceFingerprint||
    rechecked.expectedFingerprint!==preview.expectedFingerprint||
    JSON.stringify(rechecked.actions)!==JSON.stringify(preview.actions))return failure(session,'preview-diverged');
 const performed=executeHistoryBatch(session,rechecked.actions,ctx,session.state.revision);
 if(!performed.ok)return failure(session,performed.reason);
 if(buildFingerprint(performed.session.state)!==preview.expectedFingerprint)return failure(session,'preview-diverged');
 return Object.freeze({...performed,source:'detached-m6-only',worldCommitted:false,persisted:false});
}
