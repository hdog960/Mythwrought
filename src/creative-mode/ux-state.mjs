// Roadmap 9 M1: isolated UX state. Intentionally no production game or registry imports.
export const UX_SAMPLE_ITEMS = Object.freeze([
  Object.freeze({uid:'ux-sample-a',name:'Sample tile A',category:'blocks',glyph:'▦',previewOnly:true,registered:false,placeable:false}),
  Object.freeze({uid:'ux-sample-b',name:'Sample tile B',category:'blocks',glyph:'▥',previewOnly:true,registered:false,placeable:false}),
  Object.freeze({uid:'ux-sample-c',name:'Sample tile C',category:'objects',glyph:'✦',previewOnly:true,registered:false,placeable:false}),
  Object.freeze({uid:'ux-sample-d',name:'Sample tile D',category:'objects',glyph:'◇',previewOnly:true,registered:false,placeable:false})
]);
export const UX_CATEGORIES = Object.freeze(['all','blocks','objects']);
export const UX_SLOT_COUNT = 6;

function checkedState(state) {
  return Object.freeze({...state,hotbar:Object.freeze([...state.hotbar])});
}
export function initialCreativeUxState() {
  return checkedState({mode:'explore',inventoryOpen:false,search:'',category:'all',selectedSlot:0,
    hotbar:Array(UX_SLOT_COUNT).fill(null),announcement:'Explore mode. Standalone interface preview.'});
}
export function visiblePreviewItems(state) {
  const query=state.search.trim().toLowerCase();
  return UX_SAMPLE_ITEMS.filter(item=>(state.category==='all'||state.category===item.category)&&
    item.name.toLowerCase().includes(query));
}
export function updateCreativeUx(state,action) {
  if(!state || !action || typeof action.type!=='string')throw TypeError('Invalid UX action');
  const next={...state,hotbar:[...state.hotbar]};
  switch(action.type){
    case 'MODE': {
      if(!['explore','creative'].includes(action.mode))return state;
      next.mode=action.mode;next.inventoryOpen=false;
      next.announcement=action.mode==='creative'?'Creative UI preview. Building and flight are not connected.':
        'Explore UI preview. Ordinary game controls are not connected.';
      break;
    }
    case 'OPEN_INVENTORY':
      if(state.mode!=='creative')return state;
      next.inventoryOpen=true;next.announcement='Sample inventory opened. No real placeables are connected.';
      break;
    case 'CLOSE_INVENTORY':
      next.inventoryOpen=false;next.announcement='Sample inventory closed.';break;
    case 'SEARCH':
      if(typeof action.value!=='string')return state;
      next.search=action.value.slice(0,80);break;
    case 'CATEGORY':
      if(!UX_CATEGORIES.includes(action.category))return state;
      next.category=action.category;break;
    case 'SELECT_SLOT':
      if(!Number.isInteger(action.slot)||action.slot<0||action.slot>=UX_SLOT_COUNT)return state;
      next.selectedSlot=action.slot;
      next.announcement=`Preview hotbar slot ${action.slot+1} selected.`;break;
    case 'ASSIGN_SAMPLE': {
      if(state.mode!=='creative'||!state.inventoryOpen)return state;
      const item=UX_SAMPLE_ITEMS.find(x=>x.uid===action.uid);
      if(!item||!item.previewOnly||item.registered||item.placeable)return state;
      next.hotbar[state.selectedSlot]=item.uid;
      next.announcement=`${item.name} added to preview slot ${state.selectedSlot+1}. Not placeable.`;
      break;
    }
    case 'CLEAR_SLOT':
      if(state.mode!=='creative')return state;
      next.hotbar[state.selectedSlot]=null;
      next.announcement=`Preview slot ${state.selectedSlot+1} cleared.`;break;
    default:return state;
  }
  return checkedState(next);
}
