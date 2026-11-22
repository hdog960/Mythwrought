// Roadmap 9 M6 standalone UI. All assets and ports are synthetic fixtures.
// The only commit is to the in-memory M5 history model; no game/DOM global hooks.
import {createHistorySession,undoHistory,redoHistory} from './history-model.mjs';
import {previewAdvancedTool,commitAdvancedTool} from './advanced-tools.mjs';
const el=id=>document.getElementById(id);
const fixture=(id,name,kind,placementRules)=>Object.freeze({id,name,category:'synthetic-lab',kind,registered:true,placeable:true,placementRules});
const stone=fixture('lab:stone','Synthetic stone','block',{requiresSupport:true});
const moss=fixture('lab:moss','Synthetic moss','block',{requiresSupport:true});
const arch=fixture('lab:arch','Synthetic arch','object',{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]});
const catalog=[stone,moss,arch];
const ports=Object.freeze({isRegionReady:({cell})=>Math.abs(cell.x)<=7&&Math.abs(cell.z)<=7,canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded});
const ctx={catalog,ports};
const grid=el('cellGrid');
const modes={modeFill:'fill',modeLine:'line',modePlane:'plane',modeReplace:'replace'};
const choices={chooseStone:stone,chooseMoss:moss,chooseArch:arch};
let session=createHistorySession({limit:12}),pending=null,mode='fill',chosen=stone,rotation=0,a={x:0,y:0,z:0},b={...a},phase=0;
for(let z=-5;z<5;z++)for(let x=-5;x<5;x++){
 const button=document.createElement('button');button.type='button';button.className='cell';button.dataset.x=String(x);button.dataset.z=String(z);
 button.setAttribute('aria-label',`Synthetic coordinate X ${x}, Z ${z}`);
 button.addEventListener('click',()=>{const p={x,y:0,z};if(phase===0||phase===2){a=p;b=p;phase=1;}else{b=p;phase=2;}pending=null;message('SELECTION UPDATED · PREVIEW BEFORE COMMIT','selection');render();});
 grid.appendChild(button);
}
const pickRequest=()=>({tool:mode,a,b,id:chosen.id,sourceId:stone.id,axis:'y',rotation});
function message(text,reason){el('toolStatus').textContent=text;if(reason)el('toolEvidence').dataset.lastResult=reason;}
function render(){
 const evidence=el('toolEvidence');evidence.dataset.revision=String(session.state.revision);
 evidence.dataset.placements=String(session.state.placements.length);evidence.dataset.undo=String(session.past.length);evidence.dataset.redo=String(session.future.length);
 evidence.dataset.preview=String(Boolean(pending?.ok));evidence.dataset.mode=mode;
 evidence.dataset.rotation=String(rotation);evidence.dataset.selectedId=String(chosen.id);
 evidence.dataset.previewActions=String(pending?.actions?.length||0);evidence.dataset.previewChunks=String(pending?.refreshChunks?.length||0);
 const placed=new Map(), ghost=new Map();
 for(const p of session.state.placements)for(const c of p.cells)placed.set(`${c.x},${c.y},${c.z}`,p);
 for(const p of pending?.previewPlacements||[])for(const c of p.cells)ghost.set(`${c.x},${c.y},${c.z}`,p);
 const selected=new Set((pending?.selectedCells||[]).map(p=>`${p.x},${p.y},${p.z}`));
 for(const cell of grid.children){const x=Number(cell.dataset.x),z=Number(cell.dataset.z),id=`${x},0,${z}`,p=placed.get(id),g=ghost.get(id),changed=Boolean(pending&&(!p&&g||p&&!g||p&&g&&p.id!==g.id));
  cell.dataset.occupied=String(Boolean(p));cell.dataset.moss=String(p?.id===moss.id);cell.dataset.ghost=String(changed);cell.dataset.selected=String(selected.has(id));cell.dataset.first=String(x===a.x&&z===a.z);cell.dataset.last=String(x===b.x&&z===b.z);
  cell.textContent=changed?'◇':p?(p.id===moss.id?'◆':p.kind==='object'?'▣':'■'):'';
 }
 for(const [id,tool] of Object.entries(modes))el(id).setAttribute('aria-pressed',String(mode===tool));
 for(const [id,item] of Object.entries(choices))el(id).setAttribute('aria-pressed',String(chosen===item));
 el('rotation').textContent=`${rotation*90}°`;
 el('toolReadout').textContent=`REV ${session.state.revision} · UNDO ${session.past.length} · REDO ${session.future.length}`;
 el('toolHelp').textContent=`${mode.toUpperCase()} · (${a.x},${a.z}) → (${b.x},${b.z}) · MAX 24 ACTIONS · 216 CELLS`;
}
for(const [id,tool] of Object.entries(modes))el(id).addEventListener('click',()=>{mode=tool;pending=null;if(mode==='replace')chosen=moss;message(`MODE ${tool.toUpperCase()} · SET SELECTION`, 'mode');render();});
for(const [id,item] of Object.entries(choices))el(id).addEventListener('click',()=>{chosen=item;pending=null;message(`${item.name.toUpperCase()} · SELECTION UNCHANGED`,'item');render();});
el('rotateTool').addEventListener('click',()=>{rotation=(rotation+1)%4;pending=null;message(`ROTATION ${rotation*90}° · PREVIEW AGAIN`,'rotation');render();});
el('previewTool').addEventListener('click',()=>{
 pending=previewAdvancedTool(session,pickRequest(),ctx);
 if(!pending.ok){message(`PREVIEW REJECTED: ${pending.reason} · NO EDIT`,pending.reason);pending=null;}
 else message(`ATOMIC PREVIEW · ${pending.actions.length} ACTIONS · ${pending.refreshChunks.length} CHUNK REFRESH PLANS · NOT COMMITTED`,'preview-ok');
 render();
});
el('commitTool').addEventListener('click',()=>{
 if(!pending){message('NO VALID PREVIEW · NO EDIT','no-preview');return;}
 const r=commitAdvancedTool(session,pending,ctx);pending=null;
 if(!r.ok){message(`COMMIT REJECTED: ${r.reason} · NO EDIT`,r.reason);render();return;}
 session=r.session;message(`M5 HISTORY COMMIT · REV ${session.state.revision} · NOT SAVED`,'commit-ok');render();
});
for(const [id,action] of [['undoTool',undoHistory],['redoTool',redoHistory]])el(id).addEventListener('click',()=>{
 pending=null;const r=action(session,ctx,session.state.revision);
 if(!r.ok){message(`${id==='undoTool'?'UNDO':'REDO'} REJECTED: ${r.reason}`,r.reason);render();return;}
 session=r.session;message(`${id==='undoTool'?'UNDO':'REDO'} · REV ${session.state.revision} · RAM ONLY`,'history-ok');render();
});
el('resetTool').addEventListener('click',()=>{session=createHistorySession({limit:12});mode='fill';chosen=stone;rotation=0;a={x:0,y:0,z:0};b={...a};phase=0;pending=null;message('LAB RESET · NO GAME DATA TOUCHED','reset');render();});
render();
