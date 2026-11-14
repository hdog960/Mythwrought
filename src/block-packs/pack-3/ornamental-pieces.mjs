// MYTHWROUGHT Pack 3 — M4 ORIGINAL ornamental architectural voxel parts.
// ISOLATED CANDIDATE: no live block registry, world generation, or player saves.
// Box-union data conforms to pending :00 target/collision and :12 mesh contracts.
// Roster 74 is a stone ARCH SURROUND ONLY: no glazing, window frame or shutter.
const box=(x,y,z,X,Y,Z)=>Object.freeze([x,y,z,X,Y,Z]);
const part=(tone,...a)=>Object.freeze({tone,box:box(...a)});
const gilded=Object.freeze({stone:'#778a99',light:'#bcc3b5',shadow:'#4b6175',gold:'#e3bb72'});
const cornice=Object.freeze({stone:'#8e8392',light:'#d6c9b9',shadow:'#504c65',gold:'#a9bf9c'});
const windowStone=Object.freeze({stone:'#8f989d',light:'#d8c7ae',shadow:'#4b626e',gold:'#d2a56e'});
const relief=Object.freeze({stone:'#51616d',light:'#a8b4ae',shadow:'#283b52',gold:'#e4bc78'});
// Shaft + separate channeled flutes + genuinely overhanging carved volutes;
// far more ornamental than the ordinary stone pillar in Pack 1.
const COLUMN=Object.freeze([
  part('shadow',.09375,0,.09375,.90625,.125,.90625),
  part('stone',.15625,.125,.15625,.84375,.21875,.84375),
  part('stone',.328125,.21875,.328125,.671875,.765625,.671875),
  part('light',.21875,.25,.34375,.328125,.75,.65625),
  part('light',.671875,.25,.34375,.78125,.75,.65625),
  part('light',.34375,.25,.21875,.65625,.75,.328125),
  part('light',.34375,.25,.671875,.65625,.75,.78125),
  part('stone',.15625,.78125,.15625,.84375,.875,.84375),
  part('light',.0625,.875,.0625,.9375,1,.9375),
  part('gold',.109375,.84375,.0625,.265625,.921875,.1875),
  part('gold',.734375,.84375,.0625,.890625,.921875,.1875)
]);
// Deep face-mounted overhang with physical dentils and supports, not a
// color-only trim shader or a full ordinary wall cube.
const CORNICE=Object.freeze([
  part('stone',0,.546875,.78125,1,.71875,1),
  part('shadow',.015625,.71875,.59375,.984375,.78125,1),
  part('light',0,.78125,.375,1,.90625,1),
  part('gold',0,.90625,.3125,1,.953125,1),
  part('stone',.0625,.359375,.65625,.234375,.625,.96875),
  part('stone',.390625,.359375,.65625,.609375,.625,.96875),
  part('stone',.765625,.359375,.65625,.9375,.625,.96875),
  part('light',.0625,.609375,.53125,.234375,.71875,.875),
  part('light',.390625,.609375,.53125,.609375,.71875,.875),
  part('light',.765625,.609375,.53125,.9375,.71875,.875),
  part('gold',.125,.78125,.3125,.1875,.890625,.375),
  part('gold',.453125,.78125,.3125,.546875,.890625,.375),
  part('gold',.8125,.78125,.3125,.875,.890625,.375)
]);
// Genuine OPEN arched recess: paired masonry jambs + stepped voussoir stones
// and keystone, with AIR through the central opening. NO glass or frames.
const ARCH=Object.freeze([
  part('shadow',0,0,.15625,.234375,.78125,.84375),
  part('shadow',.765625,0,.15625,1,.78125,.84375),
  part('light',0,.03125,.078125,.265625,.1875,.9375),
  part('light',.734375,.03125,.078125,1,.1875,.9375),
  part('stone',.125,.71875,.15625,.34375,.84375,.84375),
  part('stone',.65625,.71875,.15625,.875,.84375,.84375),
  part('stone',.234375,.796875,.15625,.421875,.90625,.84375),
  part('stone',.578125,.796875,.15625,.765625,.90625,.84375),
  part('gold',.40625,.859375,.125,.59375,.984375,.875),
  part('light',.015625,.875,.09375,.234375,.96875,.90625),
  part('light',.765625,.875,.09375,.984375,.96875,.90625),
  part('gold',.046875,.25,.078125,.125,.375,.15625),
  part('gold',.875,.25,.078125,.953125,.375,.15625)
]);
// Physically raised two-level sun/leaf sigil on thin vertical stone plaque.
// Not a carved FULL-CUBE block, texture, or flat coplanar decal.
const RELIEF=Object.freeze([
  part('shadow',.078125,.0625,.78125,.921875,.9375,1),
  part('light',.125,.109375,.71875,.875,.890625,.8125),
  part('stone',.1875,.15625,.671875,.8125,.84375,.734375),
  part('gold',.390625,.390625,.5625,.609375,.609375,.6875),
  part('gold',.453125,.21875,.59375,.546875,.40625,.6875),
  part('gold',.453125,.59375,.59375,.546875,.78125,.6875),
  part('gold',.21875,.453125,.59375,.40625,.546875,.6875),
  part('gold',.59375,.453125,.59375,.78125,.546875,.6875),
  part('light',.296875,.296875,.625,.390625,.390625,.734375),
  part('light',.609375,.296875,.625,.703125,.390625,.734375),
  part('light',.296875,.609375,.625,.390625,.703125,.734375),
  part('light',.609375,.609375,.625,.703125,.703125,.734375)
]);
const DEFINITIONS=Object.freeze([
  Object.freeze({id:119,roster:72,slug:'gilded-fluted-column',name:'Stargrove Ornamental Column',
    style:'carved flutes, a stepped plinth and a flared gilded volute capital',palette:gilded,parts:COLUMN}),
  Object.freeze({id:120,roster:73,slug:'overhanging-dentil-cornice',name:'Twilight Dentil Cornice',
    style:'deep overhanging crown, separate bracing and raised dentil ornaments',palette:cornice,parts:CORNICE}),
  Object.freeze({id:121,roster:74,slug:'open-stone-arched-surround',name:'Dawnward Arch Window Surround',
    style:'glazing-free open masonry arch with freestanding jambs and voussoir/keystone profile',
    palette:windowStone,parts:ARCH}),
  Object.freeze({id:122,roster:75,slug:'raised-sunleaf-relief-panel',name:'Sunleaf Carved Relief',
    style:'wall-facing shallow sculptural panel with actual raised runic leaf/sun rays',
    palette:relief,parts:RELIEF})
]);
const turn=b=>box(1-b[5],b[1],b[0],1-b[2],b[4],b[3]);
function create(d,rotation){
  let parts=d.parts;
  for(let j=0;j<rotation;j++)
    parts=parts.map(p=>Object.freeze({tone:p.tone,box:turn(p.box)}));
  const fixed=Object.freeze(parts);
  const boxes=Object.freeze(fixed.map(p=>p.box));
  return Object.freeze({
    id:d.id,roster:d.roster,name:d.name,slug:d.slug,style:d.style,
    kind:'ornamental-component',sourcePack:3,status:'unmerged-candidate',rotation,
    colors:d.palette,parts:fixed,boxes,shape:Object.freeze({boxes}),
    selection:Object.freeze({kind:'box-union',boxes}),
    collision:Object.freeze({kind:'box-union',boxes}),
    placement:Object.freeze({oneCell:true,defaultRotation:0,allowedRotations:Object.freeze([0,1,2,3])}),
    persistence:Object.freeze({liveSchema:1,liveIdRegistered:false,liveRotationSaved:false,
      previewOnly:true}),prototypeOnly:true,placeable:false,integrated:false
  });
}
const BY_KEY=new Map(DEFINITIONS.flatMap(d=>[0,1,2,3].map(r=>[d.id+':'+r,create(d,r)])));
export const PACK3_ORNAMENTAL_IDS=Object.freeze(DEFINITIONS.map(d=>d.id));
export const PACK3_ORNAMENTAL_ASSETS=Object.freeze(DEFINITIONS.map(d=>BY_KEY.get(d.id+':0')));
export function pack3OrnamentalById(id,rotation=0){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Ornament rotation must be 0..3');
  return BY_KEY.get(id+':'+rotation)??null;
}
export function pack3OrnamentalShape(id,rotation=0){
  return pack3OrnamentalById(id,rotation)?.shape??null;
}
export function pack3OrnamentalPrototype(id,rotation=0){
  const a=pack3OrnamentalById(id,rotation);
  if(!a)throw new RangeError('Unknown Pack 3 ornamental ID');
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:a.boxes});
}
