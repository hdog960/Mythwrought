// M5 detached interactive evidence. Every world tile is a synthetic fixture.
// The store is in-memory ONLY and never touches production schema-1 saves.
import {createHistorySession,executeHistoryBatch,undoHistory,redoHistory} from './history-model.mjs';
import {createDetachedMemoryStore,DETACHED_SAVE_KEYS,saveDetachedCheckpoint,loadDetachedCheckpoint} from './save-compat.mjs';
const byId=id=>document.getElementById(id);
const fixture=(id,name,kind,placementRules)=>Object.freeze({id,name,category:'synthetic-fixture',kind,registered:true,placeable:true,placementRules});
const stone=fixture('lab:stone','Lab stone','block',{requiresSupport:true});
const arch=fixture('lab:arch','Lab arch','object',{requiresSupport:true,footprint:[
 {dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]});
const catalog=[stone,arch];
const ports=Object.freeze({isRegionReady:({cell})=>Math.abs(cell.x)<=7&&Math.abs(cell.z)<=7,
 canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded===true});
const ctx={catalog,ports};
const storage=createDetachedMemoryStore();
let session=createHistorySession({limit:8}),chosen=stone,rotation=0;
const coord=()=>({x:Number(byId('targetX').value),y:Number(byId('targetY').value),z:Number(byId('targetZ').value)});
const grid=byId('cellGrid');
for(let z=-5;z<5;z++)for(let x=-5;x<5;x++){
 const cell=document.createElement('button');cell.type='button';cell.className='cell';cell.dataset.x=String(x);cell.dataset.z=String(z);
 cell.setAttribute('aria-label',`Synthetic target X ${x} Z ${z}`);
 cell.addEventListener('click',()=>{byId('targetX').value=String(x);byId('targetZ').value=String(z);render();});
 grid.appendChild(cell);
}
function render(){
 const where=coord(),occupied=new Map();
 for(const p of session.state.placements)for(const c of p.cells)occupied.set(`${c.x},${c.y},${c.z}`,p);
 for(const cell of grid.children){const x=Number(cell.dataset.x),z=Number(cell.dataset.z),p=occupied.get(`${x},0,${z}`);
  cell.dataset.occupied=String(Boolean(p));cell.dataset.object=String(p?.kind==='object');cell.dataset.target=String(x===where.x&&z===where.z);
  cell.textContent=p?(p.kind==='object'?'◆':'■'):'';
 }
 for(const [id,item] of [['chooseBlock',stone],['chooseObject',arch]])byId(id).setAttribute('aria-pressed',String(item===chosen));
 byId('rotation').textContent=String(rotation*90)+'°';
 byId('historyReadout').textContent=`REV ${session.state.revision} · UNDO ${session.past.length} · REDO ${session.future.length}`;
 const el=byId('historyEvidence');el.dataset.revision=String(session.state.revision);
 el.dataset.placements=String(session.state.placements.length);el.dataset.undo=String(session.past.length);
 el.dataset.redo=String(session.future.length);el.dataset.cells=String(occupied.size);
}
function message(s,reason=''){byId('historyStatus').textContent=s;byId('historyEvidence').dataset.lastResult=reason;}
function accept(result,label){
 if(!result.ok){message(`${label} REJECTED: ${result.reason} · NO EDIT`,result.reason);return;}
 session=result.session;message(`${label} · REV ${session.state.revision} · ${result.transaction.refreshChunks.length} refresh plans · UNSAVED`,'ok');render();
}
function submit(actions){accept(executeHistoryBatch(session,actions,ctx,session.state.revision),'EDIT');}
byId('chooseBlock').addEventListener('click',()=>{chosen=stone;rotation=0;render();});
byId('chooseObject').addEventListener('click',()=>{chosen=arch;render();});
byId('rotateShape').addEventListener('click',()=>{rotation=(rotation+1)%4;render();});
byId('place').addEventListener('click',()=>submit([{type:'place',id:chosen.id,at:coord(),rotation}]));
byId('remove').addEventListener('click',()=>submit([{type:'remove',at:coord()}]));
byId('batch').addEventListener('click',()=>{const p=coord();submit(Array.from({length:3},(_,i)=>({type:'place',id:stone.id,at:{...p,x:p.x+i},rotation:0})));});
byId('undoHistory').addEventListener('click',()=>accept(undoHistory(session,ctx,session.state.revision),'UNDO'));
byId('redoHistory').addEventListener('click',()=>accept(redoHistory(session,ctx,session.state.revision),'REDO'));
byId('staleRevision').addEventListener('click',()=>accept(undoHistory(session,ctx,Math.max(-1,session.state.revision-1)),'STALE'));
byId('saveHistory').addEventListener('click',()=>{
 const result=saveDetachedCheckpoint(storage,session);
 message(result.ok?`DETACHED SAVE REV ${result.revision} · MEMORY ONLY`:`SAVE FAILED: ${result.reason} · ${result.stage}`,result.ok?'saved':result.reason);
});
byId('reloadHistory').addEventListener('click',()=>{
 const result=loadDetachedCheckpoint(storage,ctx);
 if(!result.ok){message(`LOAD FAILED: ${result.reason}`,result.reason);return;}
 session=result.session;byId('historyEvidence').dataset.saveSource=result.source;
 message(`RELOADED ${result.source.toUpperCase()} · REV ${session.state.revision}${result.recovered?' · RECOVERED':''}`,'loaded');render();
});
byId('simulateQuota').addEventListener('click',()=>{
 const failStore={read:k=>storage.read(k),remove:k=>storage.remove(k),write:()=>{throw Error('simulated quota exceeded');}};
 const result=saveDetachedCheckpoint(failStore,session);
 message(result.ok?'UNEXPECTED QUOTA SUCCESS':`QUOTA SIMULATED: ${result.stage} · CHECKPOINT PRESERVED`,result.ok?'unexpected':'quota');
});
byId('corruptPrimary').addEventListener('click',()=>{
 storage.write(DETACHED_SAVE_KEYS.primary,'{"interrupted":');
 message('SIMULATED PRIMARY CORRUPTION · RELOAD FOR BACKUP','corrupt');
});
byId('resetLab').addEventListener('click',()=>{session=createHistorySession({limit:8});message('RAM WORLD RESET · STORED CHECKPOINT PRESERVED','reset');render();});
for(const id of ['targetX','targetY','targetZ'])byId(id).addEventListener('input',render);
render();
