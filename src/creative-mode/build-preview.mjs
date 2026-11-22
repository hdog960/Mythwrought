// M4 separate transaction lab: synthetic fixtures, never mounts game UI.
import {createBuildState,planBuildBatch} from './build-model.mjs';
const byId=id=>document.getElementById(id);
const fixture=(id,name,kind,placementRules)=>Object.freeze({id,name,category:'synthetic-test',kind,registered:true,placeable:true,placementRules});
const stone=fixture('lab:stone','Synthetic stone','block',{requiresSupport:true});
const arch=fixture('lab:arch','Synthetic arch','object',{requiresSupport:true,footprint:[
  {dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]});
const catalog=[stone,arch];
const ports=Object.freeze({
 isRegionReady:({cell})=>Math.abs(cell.x)<=7&&Math.abs(cell.z)<=7,
 canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded===true
});
let state=createBuildState(),chosen=stone,rotation=0,lastUndo=null;
const coord=()=>({x:Number(byId('targetX').value),y:Number(byId('targetY').value),z:Number(byId('targetZ').value)});
const grid=byId('cellGrid');
for(let z=-5;z<5;z++)for(let x=-5;x<5;x++){
 const cell=document.createElement('button');cell.type='button';cell.className='cell';cell.dataset.x=String(x);cell.dataset.z=String(z);
 cell.setAttribute('aria-label',`Target fixture column X ${x} Z ${z}`);
 cell.addEventListener('click',()=>{byId('targetX').value=String(x);byId('targetZ').value=String(z);render();});
 grid.appendChild(cell);
}
function render(){
 const where=coord(),occupied=new Map();
 for(const p of state.placements)for(const c of p.cells)occupied.set(`${c.x},${c.y},${c.z}`,p);
 for(const cell of grid.children){const x=Number(cell.dataset.x),z=Number(cell.dataset.z);const p=occupied.get(`${x},0,${z}`);
  cell.dataset.occupied=String(Boolean(p));cell.dataset.object=String(p?.kind==='object');cell.dataset.target=String(x===where.x&&z===where.z);
  cell.textContent=p?(p.kind==='object'?'◆':'■'):'';
 }
 for(const [id,item] of [['chooseBlock',stone],['chooseObject',arch]])byId(id).setAttribute('aria-pressed',String(item===chosen));
 byId('rotation').textContent=String(rotation*90)+'°';
 const el=byId('buildEvidence');el.dataset.revision=String(state.revision);el.dataset.placements=String(state.placements.length);
 el.dataset.cells=String([...occupied.keys()].length);el.dataset.undo=String(Boolean(lastUndo));
}
function message(s){byId('buildStatus').textContent=s;}
function submit(actions){
 const result=planBuildBatch(state,actions,{catalog,ports});
 if(!result.ok){message(`REJECTED ${result.reason} · step ${result.atStep+1} · NO EDIT`);byId('buildEvidence').dataset.lastResult=result.reason;return;}
 state=result.state;lastUndo=result.transaction.undoCandidate;
 byId('buildEvidence').dataset.lastResult='ok';byId('buildEvidence').dataset.refresh=String(result.transaction.refreshChunks.length);
 message(`PLAN ${state.revision} · ${result.transaction.changeCount} edit(s) · ${result.transaction.refreshChunks.length} chunk refreshes · UNSAVED`);
 render();
}
byId('chooseBlock').addEventListener('click',()=>{chosen=stone;rotation=0;render();});
byId('chooseObject').addEventListener('click',()=>{chosen=arch;render();});
byId('rotateShape').addEventListener('click',()=>{rotation=(rotation+1)%4;render();});
byId('place').addEventListener('click',()=>submit([{type:'place',id:chosen.id,at:coord(),rotation}]));
byId('remove').addEventListener('click',()=>submit([{type:'remove',at:coord()}]));
byId('batch').addEventListener('click',()=>{
 const p=coord();submit(Array.from({length:3},(_,i)=>({type:'place',id:stone.id,at:{...p,x:p.x+i},rotation:0})));
});
byId('undoCandidate').addEventListener('click',()=>{message(lastUndo?`UNDO CANDIDATE: ${lastUndo.inverseActions.length} inverse step(s) · NOT APPLIED`:'NO UNDO CANDIDATE');});
byId('resetLab').addEventListener('click',()=>{state=createBuildState();lastUndo=null;message('Synthetic world reset · no game data touched');render();});
for(const id of ['targetX','targetY','targetZ'])byId(id).addEventListener('input',render);
render();
