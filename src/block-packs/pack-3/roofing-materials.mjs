// MYTHWROUGHT Pack 3 — original physical roofing candidates 23–26.
// UNMERGED CANDIDATE. Not registered in live world, palette, saves or rendering.
// Each part is an actual box of occupied material, not a render-only roof shader.
// :00 shape intersection consumes {boxes}; :12 prototype surface mesh can
// consume {prototypeOnly:true,boxes} via preview adapter after approval.
const box=(x0,y0,z0,x1,y1,z1)=>Object.freeze([x0,y0,z0,x1,y1,z1]);
const piece=(tone,b)=>Object.freeze({tone,box:Object.freeze(b)});
const BASE=piece('underlay',box(0,0,0,1,.125,1));
const palette=(underlay,tile,edge)=>Object.freeze({underlay,tile,edge});
const tiles=[];
for(let row=0;row<2;row++)for(let col=0;col<4;col++){
  const x=col*.25+.015625;
  tiles.push(piece(row===0?'tile':'edge',
    box(x,.125,row*.5+.015625,x+.21875,row===0?.21875:.25,row*.5+.484375)));
}
const clay=[];
for(let col=0;col<6;col++){
  const x=col/6+.020833;
  clay.push(piece(col%2?'edge':'tile',
    box(x,.125,.03125,x+.125,.28125,.96875)));
}
const slate=[];
for(let row=0;row<2;row++)for(let col=0;col<3;col++){
  const x=col/3+.015625;
  slate.push(piece((col+row)%3===0?'edge':'tile',
    box(x,.125,row*.5+.015625,x+.296875,.1875+(row*.03125),row*.5+.484375)));
}
const straw=[];
for(let col=0;col<9;col++){
  const x=col/9+.012;
  straw.push(piece(col%3===0?'edge':'tile',
    box(x,.125,.015625,(col+1)/9-.012,.21875+(col%3)*.03125,.984375)));
}
function asset({id,roster,name,slug,style,colors,parts}){
  const fixedParts=Object.freeze([BASE,...parts]);
  const boxes=Object.freeze(fixedParts.map(p=>p.box));
  return Object.freeze({
    id,roster,name,slug,style,
    sourcePack:3,kind:'roof-surface',status:'unmerged-candidate',
    colors,parts:fixedParts,boxes,
    // Identical occupancy for contact, targeting, and visible box geometry.
    collision:Object.freeze({kind:'box-union',boxes}),
    selection:Object.freeze({kind:'box-union',boxes}),
    placement:Object.freeze({oneCell:true,replaceable:false,defaultRotation:0}),
    // Live schema-1 stores [x,y,z,id] only. No orientation is invented.
    persistence:Object.freeze({schema:1,idOnly:true,rotationState:false,integrated:false}),
    bounds:Object.freeze([0,0,0,1,1,1])
  });
}
export const PACK3_ROOFING_ASSETS=Object.freeze([
  asset({id:109,roster:23,name:'Honeywood Shingles',slug:'wooden-shingles',
    style:'overlapping hand-split cedar scales',
    colors:palette('#70452f','#c88a4b','#946037'),parts:tiles}),
  asset({id:110,roster:24,name:'Hearthclay Roof Tiles',slug:'clay-roof-tiles',
    style:'raised barrel-clay ribs and fired warm terracotta',
    colors:palette('#713930','#dc784c','#ad5238'),parts:clay}),
  asset({id:111,roster:25,name:'Moonshale Slate',slug:'slate-roof-tiles',
    style:'low overlapping blue-grey cleft slate plates',
    colors:palette('#34475c','#7b91a4','#50687d'),parts:slate}),
  asset({id:112,roster:26,name:'Sunfield Thatch',slug:'thatched-roofing',
    style:'deep golden bundles of densely layered dry grass',
    colors:palette('#745527','#dfb851','#b18435'),parts:straw})
]);
const BY_ID=new Map(PACK3_ROOFING_ASSETS.map(a=>[a.id,a]));
export const PACK3_INITIAL_IDS=Object.freeze(PACK3_ROOFING_ASSETS.map(a=>a.id));
export function pack3RoofById(id){return BY_ID.get(id)??null;}
export function pack3ShapeForId(id){
  const found=pack3RoofById(id);
  return found?Object.freeze({boxes:found.boxes}):null;
}
// Explicit adapter for the opt-in :12 mesh fixture. This does NOT run a mesher.
export function pack3PrototypeDescriptor(id){
  const found=pack3RoofById(id);
  if(!found)throw new RangeError('Unknown Pack 3 roofing ID');
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:found.boxes});
}
