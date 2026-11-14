// Mythwrought Pack 3 — reusable, standalone roof-profile voxel candidates.
// CANDIDATE ONLY: this file does not register new game blocks or generate roofs.
// Geometric contract: :00 and :12 consume local unit-cell box unions. The
// profiles/quarter-turns below are ASSET data, not a competing shape engine.
const B=(x,y,z,X,Y,Z)=>Object.freeze([x,y,z,X,Y,Z]);
const P=(tone,box)=>Object.freeze({tone,box});
const TILE=Object.freeze({body:'#a14f37',edge:'#dc8556',crest:'#f0b878'});
// Roster 27: a steep four-course roof pitch with projecting stepped eaves.
// Unlike generic walking stairs, all four rises bear roof-specific tile caps.
const SLOPE=Object.freeze([
  P('body',B(0,0,0,1,.1875,.25)),
  P('body',B(0,0,.25,1,.375,.5)),
  P('body',B(0,0,.5,1,.5625,.75)),
  P('body',B(0,0,.75,1,.75,1)),
  P('edge',B(0,.1875,0,1,.234375,.25)),
  P('edge',B(0,.375,.25,1,.421875,.5)),
  P('edge',B(0,.5625,.5,1,.609375,.75)),
  P('edge',B(0,.75,.75,1,.796875,1)),
  P('crest',B(0,.234375,0,.0625,.28125,.25)),
  P('crest',B(.9375,.234375,0,1,.28125,.25)),
  P('crest',B(0,.421875,.25,.0625,.46875,.5)),
  P('crest',B(.9375,.421875,.25,1,.46875,.5)),
  P('crest',B(0,.609375,.5,.0625,.65625,.75)),
  P('crest',B(.9375,.609375,.5,1,.65625,.75)),
  P('crest',B(0,.796875,.75,.0625,.84375,1)),
  P('crest',B(.9375,.796875,.75,1,.84375,1))
]);
// Roster 28: a genuine hip-corner profile, stepping upward along BOTH axes.
// It cannot be substituted by a generic straight roof stair.
const HIP=Object.freeze([
  P('body',B(0,0,0,1,.15625,1)),
  P('body',B(.1875,.15625,.1875,1,.34375,1)),
  P('body',B(.375,.34375,.375,1,.53125,1)),
  P('body',B(.5625,.53125,.5625,1,.71875,1)),
  P('edge',B(.1875,.34375,.1875,1,.390625,1)),
  P('edge',B(.375,.53125,.375,1,.578125,1)),
  P('crest',B(.5625,.71875,.5625,1,.765625,1)),
  P('crest',B(.1875,.390625,.1875,.25,.4375,.25)),
  P('crest',B(.375,.578125,.375,.4375,.625,.4375))
]);
// Roster 29: a longitudinal ridge with wide shoulders, raised spine and
// capped ends. Its x/z symmetry intentionally repeats after a half turn.
const RIDGE=Object.freeze([
  P('body',B(0,0,0,1,.125,1)),
  P('body',B(.09375,.125,0,.90625,.296875,1)),
  P('edge',B(.28125,.296875,0,.71875,.453125,1)),
  P('crest',B(.40625,.453125,.09375,.59375,.625,.90625)),
  P('crest',B(.34375,.40625,0,.65625,.5625,.109375)),
  P('crest',B(.34375,.40625,.890625,.65625,.5625,1))
]);
const DEFINITIONS=Object.freeze([
  Object.freeze({id:113,roster:27,slug:'clay-roof-slope',name:'Hearthclay Pitched Roof Stair',
    profile:'steep roof pitch, four raised staggered ceramic courses',parts:SLOPE}),
  Object.freeze({id:114,roster:28,slug:'clay-hip-corner',name:'Hearthclay Hip Corner',
    profile:'four diagonal stepped hip tiers, rising toward a single corner',parts:HIP}),
  Object.freeze({id:115,roster:29,slug:'clay-roof-ridge',name:'Hearthclay Crown Ridge',
    profile:'paired shoulders, elevated continuous crest and end fittings',parts:RIDGE})
]);
const BASE_BY_ID=new Map(DEFINITIONS.map(a=>[a.id,a]));
export const PACK3_GEOMETRY_IDS=Object.freeze(DEFINITIONS.map(a=>a.id));
// Equivalent to the :00 90-degree Y-turn convention; rotation state lives
// ONLY in this opt-in fixture pending the central team's persistence contract.
function quarterTurn(box,rotation){
  let [x,y,z,X,Y,Z]=box;
  for(let i=0;i<rotation;i++) [x,z,X,Z]=[1-Z,x,1-z,X];
  return B(x,y,z,X,Y,Z);
}
function descriptor(def,rotation){
  const parts=Object.freeze(def.parts.map(p=>P(p.tone,quarterTurn(p.box,rotation))));
  const boxes=Object.freeze(parts.map(p=>p.box));
  return Object.freeze({
    id:def.id,roster:def.roster,slug:def.slug,name:def.name,profile:def.profile,
    sourcePack:3,kind:'roof-geometry',materialSourceId:110,
    colors:TILE,parts,boxes,rotation,
    shape:Object.freeze({boxes}), // :00 validateShape/raycastShapes/canPlaceShape
    collision:Object.freeze({kind:'box-union',boxes}),
    selection:Object.freeze({kind:'box-union',boxes}),
    placement:Object.freeze({singleCell:true,defaultRotation:0,allowedRotations:Object.freeze([0,1,2,3])}),
    persistence:Object.freeze({liveSchema:1,rotationSidecar:'candidate-only',
      liveIdRegistered:false,liveRotationSaved:false}),
    prototypeOnly:true,placeable:false, // :12 prototypeSurfaceMesh opt-in only
    integrated:false
  });
}
const VARIANTS=new Map(DEFINITIONS.flatMap(def=>[0,1,2,3].map(r=>[
  def.id+':'+r,descriptor(def,r)
])));
export const PACK3_ROOF_GEOMETRY=Object.freeze(DEFINITIONS.map(d=>VARIANTS.get(d.id+':0')));
export function pack3GeometryById(id,rotation=0){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Roof geometry rotation must be 0..3');
  return VARIANTS.get(id+':'+rotation)??null;
}
export function pack3GeometryShape(id,rotation=0){
  return pack3GeometryById(id,rotation)?.shape??null;
}
export function pack3PrototypeGeometry(id,rotation=0){
  const asset=pack3GeometryById(id,rotation);
  if(!asset)throw new RangeError('Unknown Pack 3 roof geometry ID');
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:asset.boxes});
}
