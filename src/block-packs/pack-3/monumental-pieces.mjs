// MYTHWROUGHT Pack 3 — Milestone 5 standalone monumental voxel pieces.
// UNMERGED / NOT PLACEABLE IN LIVE GAME. These are physical candidate AABB
// unions, NOT completed monuments, fluids, light sources, or entity sculptures.
// :00 target/collision + :12 surface mesh consume the same immutable boxes.
const box=(x,y,z,X,Y,Z)=>Object.freeze([x,y,z,X,Y,Z]);
const part=(tone,...b)=>Object.freeze({tone,box:box(...b)});
const palettes=Object.freeze({
  aqueduct:Object.freeze({body:'#7f8a94',edge:'#bfc5b9',shadow:'#465b67',inlay:'#84b7ae'}),
  spire:Object.freeze({body:'#606e89',edge:'#abb7c5',shadow:'#3c4666',inlay:'#83e0e0'}),
  statue:Object.freeze({body:'#7d8790',edge:'#c2b4a0',shadow:'#465367',inlay:'#d5ac70'})
});
// Roster 76: a REAL open water-carrying trough, longitudinal in Z.
// Physically open above the floor and between two banks. This geometry alone
// cannot simulate water or hold any liquid in today's shared engine.
const CHANNEL=Object.freeze([
  part('shadow',0,0,0,1,.125,1),
  part('body',.125,.125,0,.875,.21875,1),
  part('body',0,.125,0,.21875,.671875,1),
  part('body',.78125,.125,0,1,.671875,1),
  part('edge',0,.671875,0,.25,.75,1),
  part('edge',.75,.671875,0,1,.75,1),
  part('inlay',.21875,.21875,0,.25,.3125,1),
  part('inlay',.75,.21875,0,.78125,.3125,1),
  part('edge',0,.125,.0625,.15625,.28125,.21875),
  part('edge',.84375,.125,.78125,1,.28125,.9375),
  part('shadow',.375,0,.15625,.625,.09375,.34375)
]);
// Roster 77: stone FINIAL tower-neck plus visibly different slender stepped
// aether crystal crown. Distinct from a standalone original CRYSTAL (ID 5)
// cube. The bright inlay is a palette only: emits NO engine light.
const SPIRE=Object.freeze([
  part('shadow',.125,0,.125,.875,.125,.875),
  part('body',.21875,.125,.21875,.78125,.234375,.78125),
  part('edge',.3125,.234375,.3125,.6875,.328125,.6875),
  part('body',.390625,.328125,.390625,.609375,.59375,.609375),
  part('edge',.34375,.515625,.34375,.65625,.625,.65625),
  part('shadow',.375,.625,.375,.625,.671875,.625),
  part('inlay',.3125,.671875,.3125,.6875,.78125,.6875),
  part('inlay',.390625,.78125,.390625,.609375,.875,.609375),
  part('inlay',.453125,.875,.453125,.546875,.96875,.546875),
  part('edge',.28125,.59375,.40625,.390625,.671875,.59375)
]);
// Roster 78: small independent sculptural GUARDIAN STATUE. Individual legs,
// body/arms, raised shield and helmet read as an authored silhouette at voxel
// scale, not a stone cube or a prefab landmark. All inside a single cell.
const GUARDIAN=Object.freeze([
  part('shadow',.09375,0,.09375,.90625,.109375,.90625),
  part('edge',.15625,.109375,.15625,.84375,.171875,.84375),
  part('body',.296875,.171875,.359375,.421875,.359375,.625),
  part('body',.578125,.171875,.359375,.703125,.359375,.625),
  part('body',.28125,.359375,.28125,.71875,.640625,.71875),
  part('edge',.21875,.515625,.34375,.28125,.703125,.65625),
  part('edge',.71875,.515625,.34375,.78125,.703125,.65625),
  part('body',.359375,.640625,.359375,.640625,.71875,.640625),
  part('body',.328125,.71875,.328125,.671875,.859375,.671875),
  part('edge',.375,.859375,.359375,.625,.9375,.640625),
  part('body',.125,.453125,.140625,.3125,.6875,.34375)
]);
const defs=Object.freeze([
  Object.freeze({id:123,roster:76,name:'Greywater Aqueduct Channel',slug:'aqueduct-open-trough',
    profile:'open longitudinal masonry channel with two raised banks and exposed dry trough',
    palette:palettes.aqueduct,parts:CHANNEL,
    dependency:Object.freeze({waterEngineRequired:true,fluidLevelSupported:false,flowSimulation:false,
      currentContents:'empty',futureUse:'passive channel geometry only; central fluid team owns water'})}),
  Object.freeze({id:124,roster:77,name:'Aethercrown Crystal Spire',slug:'aethercrown-finial',
    profile:'tapered stone finial topped with a separate multi-stage narrow aether crystal',
    palette:palettes.spire,parts:SPIRE,
    dependency:Object.freeze({lightEngineRequired:true,emitsLight:false,lightRadius:null,
      currentLight:'none; inlay is geometry and palette only'})}),
  Object.freeze({id:125,roster:78,name:'Sentinel of the Dawn Statue',slug:'carved-sentinel-miniature',
    profile:'standalone stone guardian with separated legs, carved helm, arms and raised shield',
    palette:palettes.statue,parts:GUARDIAN,
    dependency:Object.freeze({assemblyRequired:false,entityBehavior:false,npc:false,animation:false})})
]);
const rotate=b=>box(1-b[5],b[1],b[0],1-b[2],b[4],b[3]);
function build(d,rotation){
  let ps=d.parts;
  for(let i=0;i<rotation;i++)ps=ps.map(p=>Object.freeze({tone:p.tone,box:rotate(p.box)}));
  const parts=Object.freeze(ps),boxes=Object.freeze(parts.map(x=>x.box));
  return Object.freeze({
    id:d.id,roster:d.roster,name:d.name,slug:d.slug,profile:d.profile,
    sourcePack:3,kind:'monumental-component',status:'unmerged-candidate',
    colors:d.palette,parts,boxes,rotation,dependencies:d.dependency,
    shape:Object.freeze({boxes}),selection:Object.freeze({kind:'box-union',boxes}),
    collision:Object.freeze({kind:'box-union',boxes}),
    placement:Object.freeze({oneCell:true,defaultRotation:0,
      allowedRotations:Object.freeze([0,1,2,3])}),
    persistence:Object.freeze({liveSchema:1,liveIdRegistered:false,
      liveRotationSaved:false,previewOnly:true}),
    prototypeOnly:true,placeable:false,integrated:false
  });
}
const BY_KEY=new Map(defs.flatMap(d=>[0,1,2,3].map(r=>[d.id+':'+r,build(d,r)])));
export const PACK3_MONUMENTAL_IDS=Object.freeze(defs.map(d=>d.id));
export const PACK3_MONUMENTAL_ASSETS=Object.freeze(defs.map(d=>BY_KEY.get(d.id+':0')));
export function pack3MonumentalById(id,rotation=0){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Monument rotation must be 0..3');
  return BY_KEY.get(id+':'+rotation)??null;
}
export function pack3MonumentalShape(id,rotation=0){
  return pack3MonumentalById(id,rotation)?.shape??null;
}
export function pack3MonumentalPrototype(id,rotation=0){
  const a=pack3MonumentalById(id,rotation);
  if(!a)throw new RangeError('Unknown Pack 3 monumental candidate');
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:a.boxes});
}
