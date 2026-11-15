// Roadmap 9 M1 detached preview; never imported by the production application.
import {UX_SAMPLE_ITEMS,UX_CATEGORIES,UX_SLOT_COUNT,initialCreativeUxState,updateCreativeUx,visiblePreviewItems} from './ux-state.mjs';
import {createFlightState,enterFlight,planFlightStep,returnToGround,setFlightProfile,FLIGHT_PROFILE_NAMES} from './flight-model.mjs';
import {createInventoryState,replaceInventorySnapshot,filterInventory,inventoryCategories,updateInventoryState,stablePlaceableKey,virtualInventoryWindow} from './inventory-model.mjs';
import {makeInventoryContractFixture} from './inventory-fixture.mjs';
const byId=id=>document.getElementById(id);
let state=initialCreativeUxState();
// M3 detached contract fixture: never live-registered and cannot place or save.
let catalog=createInventoryState(),catalogActive=false,catalogLoaded=false,catalogFiltered=[];
let catalogKeyMap=new Map();
function loadFixtureOnce(){
 if(catalogLoaded)return;
 catalog=replaceInventorySnapshot(catalog,makeInventoryContractFixture(1632));
 catalogKeyMap=new Map(catalog.items.map(item=>[stablePlaceableKey(item.id),item]));
 catalogFiltered=filterInventory(catalog);catalogLoaded=true;
}
function renderVirtualCatalog(){
 if(!catalogActive||!state.inventoryOpen)return;
 const scroller=byId('catalogScroller'),spacer=byId('catalogSpacer'),container=byId('catalogViewport');
 const win=virtualInventoryWindow(catalogFiltered.length,scroller.scrollTop,scroller.clientHeight);
 spacer.style.height=win.height+'px';container.style.transform='translateY('+win.top+'px)';
 const nodes=[];
 for(let i=win.start;i<win.end;i++){
  const item=catalogFiltered[i],key=stablePlaceableKey(item.id),button=document.createElement('button');
  button.type='button';button.className='catalog-tile';button.dataset.placeableKey=key;
  button.setAttribute('aria-label','Assign synthetic '+item.name+' to hotbar slot '+(state.selectedSlot+1)+'. Not live or placeable.');
  button.setAttribute('role','listitem');
  const symbol=document.createElement('span');symbol.className='catalog-symbol';symbol.textContent=item.kind==='object'?'✦':'▦';
  const label=document.createElement('span'),name=document.createElement('b'),caption=document.createElement('small');
  name.textContent=item.name;caption.textContent=item.category+' · MOCK ONLY';label.append(name,caption);button.append(symbol,label);nodes.push(button);
 }
 container.replaceChildren(...nodes);
 scroller.dataset.totalItems=String(catalog.items.length);scroller.dataset.matches=String(catalogFiltered.length);
 scroller.dataset.rendered=String(nodes.length);
 byId('catalogStats').textContent=catalogFiltered.length+' / '+catalog.items.length+' validated synthetic records · '+nodes.length+' DOM tiles · NOT LIVE';
}
function renderCatalogSource(){
 byId('inventoryPanel').dataset.source=catalogActive?'registry-fixture':'sample';
 byId('sampleSource').setAttribute('aria-pressed',String(!catalogActive));
 byId('registryFixtureSource').setAttribute('aria-pressed',String(catalogActive));
 byId('inventoryOrigin').textContent=catalogActive?'SYNTHETIC contract fixtures · NOT LIVE / NOT PLACEABLE':'UX samples · not registered or placeable';
 byId('inventorySearch').placeholder=catalogActive?'Search synthetic contract records…':'Find a sample…';
 const desired=catalogActive?catalog.query:state.search;
 if(byId('inventorySearch').value!==desired)byId('inventorySearch').value=desired;
 byId('categories').hidden=catalogActive;byId('sampleItems').hidden=catalogActive;
 byId('catalogCategories').hidden=!catalogActive;byId('catalogScroller').hidden=!catalogActive;
 byId('catalogStats').hidden=!catalogActive;
 byId('inventoryPanel').querySelector('.inventory-footer span').textContent=catalogActive?'Synthetic IDs only · no game edits':'Assign to selected hotbar slot · never places blocks';
 if(catalogActive){
  const nav=byId('catalogCategories');const options=inventoryCategories(catalog);
  nav.replaceChildren(...options.map(category=>{
   const button=document.createElement('button');button.type='button';button.dataset.catalogCategory=category;
   button.textContent=category==='all'?'ALL':category.toUpperCase();
   button.setAttribute('aria-pressed',String(catalog.category===category));return button;
  }));
  renderVirtualCatalog();
 }
}

// Readiness and landing below are deliberately bounded DEMO fixtures. No real chunks
// are ever loaded, prefetched, edited or serialized from this preview.
const fixtureReady=p=>p.x>=-10&&p.x<=10&&p.z>=-10&&p.z<=10&&p.y>=4&&p.y<=30;
const fixtureLanding=p=>fixtureReady(p)?{x:p.x,y:4,z:p.z}:null;
let flight=createFlightState({x:0,y:6,z:0},{minY:4,maxY:30});
const flightInput={strafe:0,forward:0,vertical:0,look:0};
const heldKeys=new Set();
function stopFlightIntent(){Object.keys(flightInput).forEach(key=>flightInput[key]=0);heldKeys.clear();}
function renderFlight(){
 const creative=state.mode==='creative',locked=!creative||state.inventoryOpen;
 byId('flightDashboard').hidden=!creative;
 byId('flightToggle').disabled=locked;byId('landButton').disabled=locked||!flight.active;
 byId('ascend').disabled=locked||!flight.active;byId('descend').disabled=locked||!flight.active;
 byId('flightToggle').setAttribute('aria-pressed',String(flight.active));
 byId('flightToggle').textContent=flight.active?'FLY ON':'FLY OFF';
 for(const button of byId('flightProfiles').querySelectorAll('button')){
   button.disabled=locked;button.setAttribute('aria-pressed',String(button.dataset.speed===flight.profile));
 }
 const p=flight.position,t=byId('flightTelemetry');
 for(const key of ['x','y','z'])t.dataset[key]=p[key].toFixed(2);
 t.dataset.active=String(flight.active);t.dataset.blocked=String(flight.blocked);
 t.dataset.pending=String(flight.pending.length);
 t.textContent=`${flight.active?'HOVER':'GROUND'} · X ${p.x.toFixed(1)} Y ${p.y.toFixed(1)} Z ${p.z.toFixed(1)} · ${flight.reason}`;
 byId('world').style.setProperty('--flight-x',`${Math.max(-17,Math.min(17,p.x*2)).toFixed(1)}px`);
 byId('world').style.setProperty('--flight-y',`${Math.max(-22,Math.min(15,(6-p.y)*2)).toFixed(1)}px`);
}
const previewByUid=new Map(UX_SAMPLE_ITEMS.map(x=>[x.uid,x]));
let restoreFocus=null;
function dispatch(action){const next=updateCreativeUx(state,action);if(next===state)return;if(action.type==='SELECT_SLOT')catalog=updateInventoryState(catalog,{type:'SELECT_SLOT',slot:action.slot});const wasOpen=state.inventoryOpen;state=next;render();if(!wasOpen&&state.inventoryOpen){restoreFocus=document.activeElement;byId('inventorySearch').focus();}else if(wasOpen&&!state.inventoryOpen){if(restoreFocus?.isConnected)restoreFocus.focus();else byId('creativeMode').focus();restoreFocus=null;}}
function createSlot(slot){const button=document.createElement('button');button.type='button';button.className='slot';button.dataset.slot=String(slot);button.setAttribute('aria-label',`Preview hotbar slot ${slot+1}`);const glyph=document.createElement('span');glyph.className='slot-glyph';button.append(glyph);const num=document.createElement('small');num.textContent=String(slot+1);button.append(num);return button;}
const slots=Array.from({length:UX_SLOT_COUNT},(_,i)=>createSlot(i));byId('hotbar').append(...slots);
function render(){
  const creative=state.mode==='creative';byId('world').dataset.mode=state.mode;byId('world').dataset.drawer=state.inventoryOpen?'open':'closed';
  byId('exploreMode').setAttribute('aria-pressed',String(!creative));byId('creativeMode').setAttribute('aria-pressed',String(creative));
  byId('modeNote').textContent=creative?'CREATIVE · UX PREVIEW':'EXPLORE · UX PREVIEW';
  byId('inventoryButton').disabled=!creative;byId('inventoryPanel').hidden=!state.inventoryOpen;
  byId('announcement').textContent=state.announcement;
  for(let i=0;i<slots.length;i++){
    const slot=slots[i],item=catalogActive?catalogKeyMap.get(catalog.hotbar[i]):previewByUid.get(state.hotbar[i]);
    slot.disabled=!creative;slot.setAttribute('aria-pressed',String(state.selectedSlot===i));
    slot.setAttribute('aria-label','Preview hotbar slot '+(i+1)+(item?', '+item.name+(catalogActive?' (synthetic fixture)':''):''));
    slot.querySelector('.slot-glyph').textContent=catalogActive?(item?.kind==='object'?'✦':item?'▦':'·'):(item?.glyph||'·');
  }
  if(!catalogActive&&byId('inventorySearch').value!==state.search)byId('inventorySearch').value=state.search;
  for(const button of byId('categories').querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.category===state.category));
  const grid=byId('sampleItems');grid.replaceChildren();
  const items=visiblePreviewItems(state);
  if(!items.length){const empty=document.createElement('p');empty.className='empty-samples';empty.textContent='No UX samples match. This is not the registered in-game catalog.';grid.append(empty);}
  renderFlight();
  for(const item of items){
    const button=document.createElement('button');button.type='button';button.className='sample-item';button.dataset.uid=item.uid;
    button.setAttribute('aria-label',`Assign ${item.name} to preview hotbar slot ${state.selectedSlot+1}. Not placeable.`);
    const icon=document.createElement('span');icon.className='sample-icon';icon.textContent=item.glyph;
    const label=document.createElement('span');const name=document.createElement('strong');name.textContent=item.name;
    const note=document.createElement('small');note.textContent='SAMPLE · NOT PLACEABLE';label.append(name,note);button.append(icon,label);grid.append(button);
  }
  renderCatalogSource();
}
byId('exploreMode').addEventListener('click',()=>dispatch({type:'MODE',mode:'explore'}));
byId('creativeMode').addEventListener('click',()=>dispatch({type:'MODE',mode:'creative'}));
byId('inventoryButton').addEventListener('click',()=>dispatch({type:'OPEN_INVENTORY'}));
byId('closeInventory').addEventListener('click',()=>dispatch({type:'CLOSE_INVENTORY'}));
byId('inventorySearch').addEventListener('input',event=>{
 if(!catalogActive){dispatch({type:'SEARCH',value:event.target.value});return;}
 catalog=updateInventoryState(catalog,{type:'SEARCH',query:event.target.value});
 catalogFiltered=filterInventory(catalog);byId('catalogScroller').scrollTop=0;renderCatalogSource();
});
byId('categories').addEventListener('click',event=>{const button=event.target.closest('button[data-category]');if(button)dispatch({type:'CATEGORY',category:button.dataset.category});});
byId('sampleItems').addEventListener('click',event=>{const button=event.target.closest('button[data-uid]');if(button)dispatch({type:'ASSIGN_SAMPLE',uid:button.dataset.uid});});
byId('hotbar').addEventListener('click',event=>{
 const button=event.target.closest('button[data-slot]');if(!button)return;
 catalog=updateInventoryState(catalog,{type:'SELECT_SLOT',slot:Number(button.dataset.slot)});
 dispatch({type:'SELECT_SLOT',slot:Number(button.dataset.slot)});
});
byId('clearHotbar').addEventListener('click',()=>{
 if(!catalogActive){dispatch({type:'CLEAR_SLOT'});return;}
 catalog=updateInventoryState(catalog,{type:'CLEAR_SLOT'});render();
 byId('announcement').textContent='Synthetic hotbar slot '+(state.selectedSlot+1)+' cleared. No live game edit.';
});
byId('sampleSource').addEventListener('click',()=>{catalogActive=false;render();});
byId('registryFixtureSource').addEventListener('click',()=>{
 loadFixtureOnce();catalogActive=true;
 catalog=updateInventoryState(catalog,{type:'SELECT_SLOT',slot:state.selectedSlot});render();
});
byId('catalogCategories').addEventListener('click',event=>{
 const button=event.target.closest('button[data-catalog-category]');if(!button||!catalogActive)return;
 catalog=updateInventoryState(catalog,{type:'CATEGORY',category:button.dataset.catalogCategory});
 catalogFiltered=filterInventory(catalog);byId('catalogScroller').scrollTop=0;renderCatalogSource();
});
byId('catalogViewport').addEventListener('click',event=>{
 const button=event.target.closest('button[data-placeable-key]');if(!button||!catalogActive||state.mode!=='creative'||!state.inventoryOpen)return;
 const item=catalogKeyMap.get(button.dataset.placeableKey);if(!item)return;
 catalog=updateInventoryState(catalog,{type:'ASSIGN',id:item.id});render();
 byId('announcement').textContent=item.name+' assigned to synthetic hotbar slot '+(state.selectedSlot+1)+'. NOT LIVE / NOT PLACEABLE.';
});
byId('catalogScroller').addEventListener('scroll',()=>{if(catalogActive)renderVirtualCatalog();},{passive:true});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&state.inventoryOpen){event.preventDefault();dispatch({type:'CLOSE_INVENTORY'});return;}
  if(state.inventoryOpen)return;
  if(event.target?.matches('input, textarea, select, [contenteditable="true"]'))return;
  if(state.mode==='creative'&&/^[1-6]$/.test(event.key))dispatch({type:'SELECT_SLOT',slot:Number(event.key)-1});
});
function bindPad(id,readoutId,onVector=()=>{}){
  const pad=byId(id),knob=pad.querySelector('.pad-knob'),readout=byId(readoutId);let held=null;
  const stop=()=>{held=null;onVector(0,0);pad.classList.remove('active');knob.style.transform='translate(0px,0px)';readout.textContent='IDLE';};
  const update=e=>{if(held!==e.pointerId||state.inventoryOpen)return;const bounds=pad.getBoundingClientRect(),cx=bounds.left+bounds.width/2,cy=bounds.top+bounds.height/2;
    const dx=e.clientX-cx,dy=e.clientY-cy,max=Math.max(1,Math.min(bounds.width,bounds.height)*.28),length=Math.hypot(dx,dy),scale=length>max?max/length:1;
    const x=dx*scale,y=dy*scale;onVector(x/max,y/max);knob.style.transform=`translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    readout.textContent=Math.abs(x)+Math.abs(y)<3?'CENTER':`${Math.abs(x)>Math.abs(y)?x<0?'LEFT':'RIGHT':y<0?'UP':'DOWN'} · DEMO`;
  };
  pad.addEventListener('pointerdown',e=>{if(held!==null||state.inventoryOpen||e.button!==0)return;held=e.pointerId;pad.classList.add('active');pad.setPointerCapture(e.pointerId);update(e);});
  pad.addEventListener('pointermove',update);
  for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,e=>{if(held===e.pointerId)stop();});
  return stop;
}
const stopMove=bindPad('movePad','moveReadout',(x,y)=>{flightInput.strafe=x;flightInput.forward=-y;}),stopLook=bindPad('lookPad','lookReadout',(x,y)=>{flightInput.look=x;});
byId('creativeMode').addEventListener('click',()=>{stopMove();stopLook();});
byId('exploreMode').addEventListener('click',()=>{stopMove();stopLook();});
byId('inventoryButton').addEventListener('click',()=>{stopMove();stopLook();});
window.addEventListener('blur',()=>{stopMove();stopLook();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMove();stopLook();}});
render();

// M2 browser preview: real local UI actions, fixture-only flight physics.
function landPreview(){const result=returnToGround(flight,fixtureLanding,fixtureReady);flight=result.state;renderFlight();return result.landed;}
byId('exploreMode').addEventListener('click',event=>{
 if(flight.active&&!landPreview()){event.preventDefault();event.stopImmediatePropagation();byId('announcement').textContent=flight.reason;}
 stopFlightIntent();
},true);
byId('flightToggle').addEventListener('click',()=>{
 if(state.mode!=='creative'||state.inventoryOpen)return;
 if(flight.active)landPreview();else flight=enterFlight(flight,fixtureReady);
 stopFlightIntent();renderFlight();
});
byId('landButton').addEventListener('click',()=>{if(!state.inventoryOpen&&state.mode==='creative'){landPreview();stopFlightIntent();}});
byId('flightProfiles').addEventListener('click',event=>{
 const button=event.target.closest('button[data-speed]');
 if(!button||state.mode!=='creative'||state.inventoryOpen||!FLIGHT_PROFILE_NAMES.includes(button.dataset.speed))return;
 flight=setFlightProfile(flight,button.dataset.speed);renderFlight();
});
for(const [id,value] of [['ascend',1],['descend',-1]]){
 const button=byId(id);let held=null;
 const release=event=>{if(held===event.pointerId){held=null;flightInput.vertical=0;}};
 button.addEventListener('pointerdown',event=>{
   if(event.button!==0||held!==null||!flight.active||state.inventoryOpen||state.mode!=='creative')return;
   held=event.pointerId;flightInput.vertical=value;button.setPointerCapture(event.pointerId);
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);
}
const keyMap={KeyW:'forward',KeyS:'forward',KeyA:'strafe',KeyD:'strafe',KeyQ:'vertical',KeyE:'vertical'};
document.addEventListener('keydown',event=>{
 if(state.mode!=='creative'||state.inventoryOpen||!flight.active||event.target?.matches('input, textarea, select'))return;
 if(keyMap[event.code]){heldKeys.add(event.code);event.preventDefault();}
});
document.addEventListener('keyup',event=>{heldKeys.delete(event.code);});
window.addEventListener('blur',stopFlightIntent);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFlightIntent();});
byId('exploreMode').addEventListener('click',stopFlightIntent);
byId('creativeMode').addEventListener('click',stopFlightIntent);
byId('inventoryButton').addEventListener('click',stopFlightIntent);
let previous=performance.now();
function flightFrame(now){
 const dt=Math.max(0,Math.min(.05,(now-previous)/1000));previous=now;
 if(flight.active&&state.mode==='creative'&&!state.inventoryOpen&&!document.hidden){
   const forward=flightInput.forward+Number(heldKeys.has('KeyW'))-Number(heldKeys.has('KeyS'));
   const strafe=flightInput.strafe+Number(heldKeys.has('KeyD'))-Number(heldKeys.has('KeyA'));
   const vertical=flightInput.vertical+Number(heldKeys.has('KeyE'))-Number(heldKeys.has('KeyQ'));
   const result=planFlightStep(flight,{dt,forward,strafe,vertical,yaw:flight.yaw+flightInput.look*dt*1.7},{isRegionReady:fixtureReady});
   flight=result.state;renderFlight();
 }
 requestAnimationFrame(flightFrame);
}
requestAnimationFrame(flightFrame);
