// Roadmap 9 M1 detached preview; never imported by the production application.
import {UX_SAMPLE_ITEMS,UX_CATEGORIES,UX_SLOT_COUNT,initialCreativeUxState,updateCreativeUx,visiblePreviewItems} from './ux-state.mjs';
const byId=id=>document.getElementById(id);
let state=initialCreativeUxState();
const previewByUid=new Map(UX_SAMPLE_ITEMS.map(x=>[x.uid,x]));
let restoreFocus=null;
function dispatch(action){const next=updateCreativeUx(state,action);if(next===state)return;const wasOpen=state.inventoryOpen;state=next;render();if(!wasOpen&&state.inventoryOpen){restoreFocus=document.activeElement;byId('inventorySearch').focus();}else if(wasOpen&&!state.inventoryOpen){if(restoreFocus?.isConnected)restoreFocus.focus();else byId('creativeMode').focus();restoreFocus=null;}}
function createSlot(slot){const button=document.createElement('button');button.type='button';button.className='slot';button.dataset.slot=String(slot);button.setAttribute('aria-label',`Preview hotbar slot ${slot+1}`);const glyph=document.createElement('span');glyph.className='slot-glyph';button.append(glyph);const num=document.createElement('small');num.textContent=String(slot+1);button.append(num);return button;}
const slots=Array.from({length:UX_SLOT_COUNT},(_,i)=>createSlot(i));byId('hotbar').append(...slots);
function render(){
  const creative=state.mode==='creative';byId('world').dataset.mode=state.mode;byId('world').dataset.drawer=state.inventoryOpen?'open':'closed';
  byId('exploreMode').setAttribute('aria-pressed',String(!creative));byId('creativeMode').setAttribute('aria-pressed',String(creative));
  byId('modeNote').textContent=creative?'CREATIVE · UX PREVIEW':'EXPLORE · UX PREVIEW';
  byId('inventoryButton').disabled=!creative;byId('inventoryPanel').hidden=!state.inventoryOpen;
  byId('announcement').textContent=state.announcement;
  for(let i=0;i<slots.length;i++){
    const slot=slots[i],item=previewByUid.get(state.hotbar[i]);
    slot.disabled=!creative;slot.setAttribute('aria-pressed',String(state.selectedSlot===i));
    slot.setAttribute('aria-label',`Preview hotbar slot ${i+1}${item?', '+item.name:''}`);
    slot.querySelector('.slot-glyph').textContent=item?.glyph||'·';
  }
  if(byId('inventorySearch').value!==state.search)byId('inventorySearch').value=state.search;
  for(const button of byId('categories').querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.category===state.category));
  const grid=byId('sampleItems');grid.replaceChildren();
  const items=visiblePreviewItems(state);
  if(!items.length){const empty=document.createElement('p');empty.className='empty-samples';empty.textContent='No UX samples match. This is not the registered in-game catalog.';grid.append(empty);}
  for(const item of items){
    const button=document.createElement('button');button.type='button';button.className='sample-item';button.dataset.uid=item.uid;
    button.setAttribute('aria-label',`Assign ${item.name} to preview hotbar slot ${state.selectedSlot+1}. Not placeable.`);
    const icon=document.createElement('span');icon.className='sample-icon';icon.textContent=item.glyph;
    const label=document.createElement('span');const name=document.createElement('strong');name.textContent=item.name;
    const note=document.createElement('small');note.textContent='SAMPLE · NOT PLACEABLE';label.append(name,note);button.append(icon,label);grid.append(button);
  }
}
byId('exploreMode').addEventListener('click',()=>dispatch({type:'MODE',mode:'explore'}));
byId('creativeMode').addEventListener('click',()=>dispatch({type:'MODE',mode:'creative'}));
byId('inventoryButton').addEventListener('click',()=>dispatch({type:'OPEN_INVENTORY'}));
byId('closeInventory').addEventListener('click',()=>dispatch({type:'CLOSE_INVENTORY'}));
byId('inventorySearch').addEventListener('input',event=>dispatch({type:'SEARCH',value:event.target.value}));
byId('categories').addEventListener('click',event=>{const button=event.target.closest('button[data-category]');if(button)dispatch({type:'CATEGORY',category:button.dataset.category});});
byId('sampleItems').addEventListener('click',event=>{const button=event.target.closest('button[data-uid]');if(button)dispatch({type:'ASSIGN_SAMPLE',uid:button.dataset.uid});});
byId('hotbar').addEventListener('click',event=>{const button=event.target.closest('button[data-slot]');if(button)dispatch({type:'SELECT_SLOT',slot:Number(button.dataset.slot)});});
byId('clearHotbar').addEventListener('click',()=>dispatch({type:'CLEAR_SLOT'}));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&state.inventoryOpen){event.preventDefault();dispatch({type:'CLOSE_INVENTORY'});return;}
  if(state.inventoryOpen)return;
  if(event.target?.matches('input, textarea, select, [contenteditable="true"]'))return;
  if(state.mode==='creative'&&/^[1-6]$/.test(event.key))dispatch({type:'SELECT_SLOT',slot:Number(event.key)-1});
});
function bindPad(id,readoutId){
  const pad=byId(id),knob=pad.querySelector('.pad-knob'),readout=byId(readoutId);let held=null;
  const stop=()=>{held=null;pad.classList.remove('active');knob.style.transform='translate(0px,0px)';readout.textContent='IDLE';};
  const update=e=>{if(held!==e.pointerId||state.inventoryOpen)return;const bounds=pad.getBoundingClientRect(),cx=bounds.left+bounds.width/2,cy=bounds.top+bounds.height/2;
    const dx=e.clientX-cx,dy=e.clientY-cy,max=Math.max(1,Math.min(bounds.width,bounds.height)*.28),length=Math.hypot(dx,dy),scale=length>max?max/length:1;
    const x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    readout.textContent=Math.abs(x)+Math.abs(y)<3?'CENTER':`${Math.abs(x)>Math.abs(y)?x<0?'LEFT':'RIGHT':y<0?'UP':'DOWN'} · DEMO`;
  };
  pad.addEventListener('pointerdown',e=>{if(held!==null||state.inventoryOpen||e.button!==0)return;held=e.pointerId;pad.classList.add('active');pad.setPointerCapture(e.pointerId);update(e);});
  pad.addEventListener('pointermove',update);
  for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,e=>{if(held===e.pointerId)stop();});
  return stop;
}
const stopMove=bindPad('movePad','moveReadout'),stopLook=bindPad('lookPad','lookReadout');
byId('creativeMode').addEventListener('click',()=>{stopMove();stopLook();});
byId('exploreMode').addEventListener('click',()=>{stopMove();stopLook();});
byId('inventoryButton').addEventListener('click',()=>{stopMove();stopLook();});
window.addEventListener('blur',()=>{stopMove();stopLook();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMove();stopLook();}});
render();
