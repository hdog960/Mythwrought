// Roadmap 9 M3: detached catalog logic. Never imports a game registry or enables edits.
// The ONLY eligibility source is the approved M0 registered-placeables guard.
import {validateRegisteredPlaceables} from './adapter-contract.mjs';
export const INVENTORY_SLOT_COUNT=6;
export const VIRTUAL_ROW_HEIGHT=48;
export const VIRTUAL_OVERSCAN=3;
export function stablePlaceableKey(id) {return typeof id+":"+String(id);}
function frozenState(s){return Object.freeze({...s,hotbar:Object.freeze([...s.hotbar])});}
export function createInventoryState(){return frozenState({items:Object.freeze([]),query:'',category:'all',selectedSlot:0,hotbar:Array(INVENTORY_SLOT_COUNT).fill(null)});}
export function replaceInventorySnapshot(state,snapshot){
  const items=validateRegisteredPlaceables(snapshot);
  const keys=new Set(items.map(x=>stablePlaceableKey(x.id)));
  const categories=new Set(items.map(x=>x.category));
  return frozenState({...state,items,category:state.category==='all'||categories.has(state.category)?state.category:'all',
    hotbar:state.hotbar.map(key=>keys.has(key)?key:null)});
}
export async function readLiveRegisteredPort(registry){
  if(!registry || registry.provenance!=='live-registered-placeables' || typeof registry.listPlaceables!=='function')
    throw Error('Live registered-placeables adapter not connected');
  return validateRegisteredPlaceables(await registry.listPlaceables());
}
export function inventoryCategories(state){return Object.freeze(['all',...new Set(state.items.map(item=>item.category))]);}
export function filterInventory(state){
  const q=state.query.trim().toLocaleLowerCase();
  return state.items.filter(item=>(state.category==='all'||item.category===state.category)&&(!q||
    item.name.toLocaleLowerCase().includes(q)||item.category.toLocaleLowerCase().includes(q)||
    String(item.id).toLocaleLowerCase().includes(q)));
}
export function updateInventoryState(state,action){
  if(!state||!action||typeof action.type!=='string')throw TypeError('Invalid inventory action');
  const next={...state,hotbar:[...state.hotbar]};
  switch(action.type){
    case 'SEARCH': if(typeof action.query!=='string')return state;next.query=action.query.slice(0,80);break;
    case 'CATEGORY': if(!inventoryCategories(state).includes(action.category))return state;next.category=action.category;break;
    case 'SELECT_SLOT': if(!Number.isInteger(action.slot)||action.slot<0||action.slot>=INVENTORY_SLOT_COUNT)return state;next.selectedSlot=action.slot;break;
    case 'ASSIGN': {
      const key=stablePlaceableKey(action.id);
      if(!state.items.some(item=>stablePlaceableKey(item.id)===key))return state;
      next.hotbar[state.selectedSlot]=key;break;
    }
    case 'CLEAR_SLOT': next.hotbar[state.selectedSlot]=null;break;
    default:return state;
  }
  return frozenState(next);
}
export function selectedInventoryPlaceable(state){
  const key=state.hotbar[state.selectedSlot];
  return state.items.find(item=>stablePlaceableKey(item.id)===key)||null;
}
export function virtualInventoryWindow(count,scrollTop,viewportHeight,{columns=2,rowHeight=VIRTUAL_ROW_HEIGHT,overscan=VIRTUAL_OVERSCAN}={}){
  if(!Number.isSafeInteger(count)||count<0||![scrollTop,viewportHeight,rowHeight].every(Number.isFinite)||
     scrollTop<0||viewportHeight<0||rowHeight<=0||!Number.isSafeInteger(columns)||columns<1||
     !Number.isSafeInteger(overscan)||overscan<0)throw RangeError('Invalid virtual inventory dimensions');
  const rows=Math.ceil(count/columns);
  const maxScroll=Math.max(0,rows*rowHeight-viewportHeight);
  const top=Math.min(scrollTop,maxScroll);
  const first=Math.min(rows,Math.max(0,Math.floor(top/rowHeight)-overscan));
  const last=Math.min(rows,Math.ceil((top+viewportHeight)/rowHeight)+overscan);
  return Object.freeze({firstRow:first,lastRow:last,start:first*columns,end:Math.min(count,last*columns),
    top:first*rowHeight,height:rows*rowHeight,rendered:Math.max(0,Math.min(count,last*columns)-first*columns)});
}
