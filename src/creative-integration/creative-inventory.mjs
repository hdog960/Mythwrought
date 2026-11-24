// Original MYTHWROUGHT Creative inventory: touch-safe, virtualized producer
// catalog presentation; never owns voxel edits or saved species identities.
import {CREATIVE_CATEGORIES,filterCreativeItems}
  from './creative-catalog.mjs';
import {makeCreativeThumbnail} from './creative-thumbnails.mjs';
const el=(tag,className,text)=>{
  const n=document.createElement(tag);
  if(className)n.className=className;
  if(text!==undefined)n.textContent=text;
  return n;
};
export function installCreativeInventory({catalog,onSelect,onOpen,onClose,onRotate,onVariant,includeCreatures=true}={}){
  if(!catalog?.records||[onSelect,onOpen,onClose,onRotate,onVariant].some(fn=>typeof fn!=='function'))
    throw TypeError('Creative inventory requires live item authority and context handlers');
  const overlay=el('div','mw-inventory');
  overlay.id='creativeInventory';overlay.hidden=true;
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Creative building inventory');
  const header=el('header','mw-inventory-heading');
  const title=el('strong','', '✦ THE MAKER’S SATCHEL');
  const close=el('button','mw-inventory-close','✕ CLOSE');close.type='button';
  header.append(title,close);
  const description=el('p','mw-inventory-subheading',includeCreatures?'Choose a material or creature sigil.':'Choose a building material.');
  const search=el('input','mw-inventory-search');
  search.type='search';search.placeholder=includeCreatures?'Search blocks, objects, creatures…':'Search building materials…';
  search.setAttribute('aria-label','Search Creative inventory');
  const categories=el('nav','mw-inventory-categories');
  categories.setAttribute('aria-label','Creative item categories');
  const sub=el('nav','mw-inventory-species');
  sub.setAttribute('aria-label','Creature types');sub.hidden=true;
  const grid=el('div','mw-inventory-grid');
  grid.setAttribute('role','listbox');grid.setAttribute('aria-label','Available Creative items');
  const preview=el('div','mw-inventory-preview','Select an item');
  preview.setAttribute('role','status');preview.setAttribute('aria-live','polite');
  const hotbar=el('div','mw-inventory-hotbar');hotbar.setAttribute('aria-label','Creative quick slots');
  const controls=el('div','mw-inventory-context');
  const rotation=el('button','mw-inventory-context-action','↻ ROTATE');
  const variant=el('button','mw-inventory-context-action','◈ VARIANT');
  rotation.type=variant.type='button';controls.append(rotation,variant);
  const quickbar=el('div','mw-creative-quickbar');quickbar.id='creativeQuickbar';
  quickbar.hidden=true;quickbar.setAttribute('aria-label','Selected Creative quick items');
  const viewport=document.querySelector('.viewport');
  if(!viewport)throw TypeError('Creative viewport missing');
  viewport.append(quickbar);
  const panel=el('section','mw-inventory-panel');
  panel.append(header,description,search,categories,sub,grid,preview,controls,hotbar);
  overlay.append(panel);document.body.append(overlay);
  let category='all',classification='all',selected=null,loaded=0;
  let found=[],visible=false,pending=false,selectionEpoch=0;
  const slots=Array(5).fill(null);slots[0]=catalog.blocks[0]??null;
  let activeSlot=0;
  const categoryButtons=new Map();
  function syncTabs(){
    for(const [key,b] of categoryButtons)b.setAttribute('aria-pressed',String(key===category));
    sub.hidden=category!=='creatures';
  }
  function renderSlots(){
    hotbar.replaceChildren();quickbar.replaceChildren();
    for(const host of [hotbar,quickbar]){
      for(let i=0;i<slots.length;i++){
        const b=el('button','mw-inventory-slot'+(activeSlot===i?' active':''),slots[i]?.glyph??'＋');
        b.type='button';b.title=slots[i]?.name??'Empty slot';
        b.setAttribute('aria-label','Hotbar slot '+(i+1)+': '+(slots[i]?.name??'Empty'));
        const index=el('small','',String(i+1));b.append(index);
        b.addEventListener('click',()=>{
          // An async producer activation must finish in the slot it started in.
          if(pending)return;
          // Switching occupied slots requires the original production owner
          // to accept the material. Until then, retain the live active slot.
          if(slots[i])void select(slots[i],false,i);
          else if(selected){activeSlot=i;slots[i]=selected;renderSlots();}
          else {activeSlot=i;renderSlots();}
        });
        host.append(b);
      }
      const rotateButton=el('button','mw-inventory-context-action','↻');
      rotateButton.type='button';rotateButton.title='Rotate selected building piece';
      rotateButton.setAttribute('aria-label','Rotate selected Creative material');
      rotateButton.addEventListener('click',()=>void contextAction(onRotate));
      host.append(rotateButton);
    }
  }
  async function contextAction(handler){
    if(pending)return; // Never rotate a different item during async activation.
    const item=selected??slots[activeSlot];
    if(!item)return;
    const epoch=selectionEpoch;
    try{
      const result=await handler(item);
      if(epoch===selectionEpoch&&result)preview.textContent=result;
    }catch(error){
      if(epoch===selectionEpoch)
        preview.textContent='No change: '+String(error?.message||error);
    }
  }
  rotation.addEventListener('click',()=>void contextAction(onRotate));
  variant.addEventListener('click',()=>void contextAction(onVariant));
  async function select(item,assign=true,requestedSlot=activeSlot){
    if(pending)return;
    pending=true;
    const epoch=selectionEpoch;
    try{
      await onSelect(item);
      // A world switch/Creative OFF may invalidate this request while the
      // original Pack 5 provider is awaiting its real physical sidecar.
      if(epoch!==selectionEpoch)return;
      selected=item;activeSlot=requestedSlot;
      if(assign)slots[requestedSlot]=item;
      preview.textContent=item.name+' · '+(item.kind==='spawn'?
        (item.classification+' creature sigil'):'Ready for placement');
      renderSlots();
      for(const button of grid.querySelectorAll('button[data-key]'))
        button.setAttribute('aria-selected',String(button.dataset.key===item.key));
    }catch(err){
      if(epoch===selectionEpoch)
        preview.textContent='Cannot select '+item.name+': '+String(err?.message||err);
    }finally{
      if(epoch===selectionEpoch)pending=false;
    }
  }
  function resetSession(){
    // Hotbar belongs to the Creative session, not the old world or a
    // previous creature spawn selection. Never write a voxel/save here.
    selectionEpoch++;
    pending=false;selected=null;activeSlot=0;
    slots.fill(null);
    preview.textContent='Select an item';
    renderSlots();
    for(const button of grid.querySelectorAll('button[data-key]'))
      button.setAttribute('aria-selected','false');
  }
  function renderBatch(){
    const max=Math.min(found.length,loaded+48);
    const fragment=document.createDocumentFragment();
    for(;loaded<max;loaded++){
      const item=found[loaded];
      const b=el('button','mw-inventory-item');
      b.type='button';b.dataset.key=item.key;
      b.setAttribute('role','option');b.setAttribute('aria-selected',String(selected?.key===item.key));
      b.setAttribute('aria-label',item.name);
      b.append(makeCreativeThumbnail(item),el('small','',item.name));
      b.addEventListener('click',()=>void select(item));
      fragment.append(b);
    }
    grid.append(fragment);
  }
  function refresh(){
    found=filterCreativeItems(catalog,{category,search:search.value,classification});
    loaded=0;grid.replaceChildren();grid.scrollTop=0;
    if(!found.length)grid.append(el('p','mw-inventory-empty','No matching items'));
    else renderBatch();
    syncTabs();
  }
  for(const [key,name] of CREATIVE_CATEGORIES){
    if(key==='creatures'&&!includeCreatures)continue;
    const button=el('button','mw-inventory-category',name);
    button.type='button';button.setAttribute('aria-pressed',String(key===category));
    button.addEventListener('click',()=>{category=key;refresh();});
    categories.append(button);categoryButtons.set(key,button);
  }
  const typeButtons=new Map();
  for(const [key,name] of [['all','ALL'],['passive','PASSIVE'],['hostile','HOSTILE']]){
    const button=el('button','mw-inventory-type',name);
    button.type='button';button.setAttribute('aria-pressed',String(key==='all'));
    button.addEventListener('click',()=>{
      classification=key;
      for(const [id,b] of typeButtons)b.setAttribute('aria-pressed',String(id===key));
      refresh();
    });
    sub.append(button);typeButtons.set(key,button);
  }
  search.addEventListener('input',refresh);
  grid.addEventListener('scroll',()=>{
    if(grid.scrollTop+grid.clientHeight>=grid.scrollHeight-180&&loaded<found.length)
      renderBatch();
  },{passive:true});
  function closeInventory(){
    if(!visible)return;
    // Dismissal ends the pending inventory transaction, even when the
    // original Pack 5 provider has not yet returned. Reopen can select anew.
    selectionEpoch++;pending=false;
    overlay.hidden=true;visible=false;onClose();
  }
  function openInventory(){
    if(visible)return;
    if(onOpen()===false)return;
    overlay.hidden=false;visible=true;refresh();
  }
  close.addEventListener('click',closeInventory);
  overlay.addEventListener('pointerdown',event=>{
    if(event.target===overlay)closeInventory();
  });
  document.addEventListener('keydown',event=>{
    if(event.code==='Escape'&&visible){event.preventDefault();closeInventory();}
  });
  renderSlots();
  return Object.freeze({
    open:openInventory,close:closeInventory,isOpen:()=>visible,
    setEnabled(value){
      quickbar.hidden=!value;
      if(!value){resetSession();closeInventory();}
    },
    resetSession,
    catalog,selected:()=>selected,slot:()=>slots[activeSlot],
    setCategory:key=>{if(!categoryButtons.has(key))return false;category=key;refresh();return true;}
  });
}
