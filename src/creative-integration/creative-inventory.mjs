// Original MYTHWROUGHT Creative inventory: touch-safe, virtualized producer
// catalog presentation; never owns voxel edits or saved species identities.
import {CREATIVE_CATEGORIES,filterCreativeItems}
  from './creative-catalog.mjs';
const el=(tag,className,text)=>{
  const n=document.createElement(tag);
  if(className)n.className=className;
  if(text!==undefined)n.textContent=text;
  return n;
};
export function installCreativeInventory({catalog,onSelect,onOpen,onClose}={}){
  if(!catalog?.records||typeof onSelect!=='function'||typeof onOpen!=='function'||
     typeof onClose!=='function')throw TypeError('Creative inventory requires live item authority');
  const overlay=el('div','mw-inventory');
  overlay.id='creativeInventory';overlay.hidden=true;
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Creative building inventory');
  const header=el('header','mw-inventory-heading');
  const title=el('strong','', '✦ THE MAKER’S SATCHEL');
  const close=el('button','mw-inventory-close','✕ CLOSE');close.type='button';
  header.append(title,close);
  const description=el('p','mw-inventory-subheading','Choose a material or creature sigil.');
  const search=el('input','mw-inventory-search');
  search.type='search';search.placeholder='Search blocks, objects, creatures…';
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
  const panel=el('section','mw-inventory-panel');
  panel.append(header,description,search,categories,sub,grid,preview,hotbar);
  overlay.append(panel);document.body.append(overlay);
  let category='all',classification='all',selected=null,loaded=0;
  let found=[],visible=false,pending=false;
  const slots=Array(5).fill(null);slots[0]=catalog.blocks[0]??null;
  let activeSlot=0;
  const categoryButtons=new Map();
  function syncTabs(){
    for(const [key,b] of categoryButtons)b.setAttribute('aria-pressed',String(key===category));
    sub.hidden=category!=='creatures';
  }
  function renderSlots(){
    hotbar.replaceChildren();
    for(let i=0;i<slots.length;i++){
      const b=el('button','mw-inventory-slot'+(activeSlot===i?' active':''),slots[i]?.glyph??'＋');
      b.type='button';b.title=slots[i]?.name??'Empty slot';
      b.setAttribute('aria-label','Hotbar slot '+(i+1)+': '+(slots[i]?.name??'Empty'));
      const index=el('small','',String(i+1));b.append(index);
      b.addEventListener('click',()=>{
        activeSlot=i;
        if(slots[i])void select(slots[i],false);
        else if(selected){slots[i]=selected;renderSlots();}
        else renderSlots();
      });
      hotbar.append(b);
    }
  }
  async function select(item,assign=true){
    if(pending)return;
    pending=true;
    try{
      await onSelect(item);
      selected=item;if(assign)slots[activeSlot]=item;
      preview.textContent=item.name+' · '+(item.kind==='spawn'?
        (item.classification+' creature sigil'):'Ready for placement');
      renderSlots();
      for(const button of grid.querySelectorAll('button[data-key]'))
        button.setAttribute('aria-selected',String(button.dataset.key===item.key));
    }catch(err){preview.textContent='Cannot select '+item.name+': '+String(err?.message||err);}
    finally{pending=false;}
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
      b.append(el('span','mw-inventory-icon',item.glyph),el('small','',item.name));
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
  renderSlots();refresh();
  return Object.freeze({
    open:openInventory,close:closeInventory,isOpen:()=>visible,
    catalog,selected:()=>selected,slot:()=>slots[activeSlot],
    setCategory:key=>{if(!categoryButtons.has(key))return false;category=key;refresh();return true;}
  });
}
