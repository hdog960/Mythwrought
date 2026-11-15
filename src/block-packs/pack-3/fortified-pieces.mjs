// MYTHWROUGHT Pack 3 M3 — three independently physical fortified components.
// UNMERGED CANDIDATE. No generated structures, central registry, or live saves.
// :00 targeting & :12 surface meshing consume these same unit-cell AABB unions.
const box=(x,y,z,X,Y,Z)=>Object.freeze([x,y,z,X,Y,Z]);
const part=(tone,...values)=>Object.freeze({tone,box:box(...values)});
const PALETTE=Object.freeze({
  ash:'#67707a',face:'#9aa0a4',trim:'#c0aa85',rune:'#79afb3'
});
// Heavy fortress masonry with an actual through-going, arrow-slit void.
// Unlike a modest boundary wall, the faceted side buttresses and deep coping
// establish a fortified segment; individual cells may be placed/removed.
const WALL=Object.freeze([
  part('ash',0,0,0,1,.21875,.875),
  part('face',0,.21875,.125,.375,.90625,.875),
  part('face',.625,.21875,.125,1,.90625,.875),
  part('ash',0,.90625,.09375,1,1,.90625),
  part('ash',.03125,.25,.03125,.28125,.859375,.125),
  // Small upper-wall masonry catches make a neighboring dentil cornice
  // physically attach at both piers. They avoid the carved runes and slit.
  part('ash',.25,.5625,0,.3125,.75,.0625),
  part('ash',.6875,.5625,0,.75,.75,.0625),
  part('ash',.71875,.25,.03125,.96875,.859375,.125),
  part('trim',0,.21875,.0625,.375,.28125,.9375),
  part('trim',.625,.21875,.0625,1,.28125,.9375),
  part('trim',.03125,.90625,.03125,.96875,.953125,.96875),
  part('rune',.109375,.625,.015625,.203125,.71875,.03125),
  part('rune',.796875,.625,.015625,.890625,.71875,.03125)
]);
// Defensive merlons: tall stone teeth with a true, open central crenel.
// Unlike Pack 2's continuous low parapet, the opening remains accessible.
const BATTLEMENT=Object.freeze([
  part('ash',0,0,.1875,1,.34375,.8125),
  part('face',.0625,.34375,.15625,.359375,.859375,.84375),
  part('face',.640625,.34375,.15625,.9375,.859375,.84375),
  part('trim',.03125,.859375,.125,.390625,.921875,.875),
  part('trim',.609375,.859375,.125,.96875,.921875,.875),
  part('ash',0,.296875,.109375,1,.34375,.890625),
  part('trim',.0625,.5,.09375,.359375,.5625,.15625),
  part('trim',.640625,.5,.09375,.9375,.5625,.15625),
  part('rune',.140625,.65625,.078125,.234375,.75,.15625),
  part('rune',.765625,.65625,.078125,.859375,.75,.15625)
]);
// A single wall-facing flying-foot buttress (NOT a tower or prefab assembly).
// Five independently tapered stone steps retreat towards the rear wall face.
const BUTTRESS=Object.freeze([
  part('ash',.0625,0,.0625,.9375,.1875,1),
  part('face',.140625,.1875,.0625,.859375,.375,.84375),
  part('face',.21875,.375,.0625,.78125,.5625,.6875),
  part('face',.296875,.5625,.0625,.703125,.75,.53125),
  part('face',.359375,.75,.0625,.640625,.90625,.390625),
  part('trim',.34375,.90625,.03125,.65625,.96875,.40625),
  part('trim',.046875,.15625,.046875,.953125,.21875,.96875),
  part('rune',.4375,.6875,.015625,.5625,.78125,.0625)
]);
const DATA=Object.freeze([
  Object.freeze({id:116,roster:69,slug:'fortress-arrow-slit-wall',
    name:'Glimmerwatch Fortress Wall',profile:'deep armored masonry with a true through-slotted arrow embrasure',parts:WALL}),
  Object.freeze({id:117,roster:70,slug:'crenel-battlement',
    name:'Sunward Crenel Battlement',profile:'paired merlon teeth, protective sill and open central crenel',parts:BATTLEMENT}),
  Object.freeze({id:118,roster:71,slug:'tapered-stone-buttress',
    name:'Moonward Stone Buttress',profile:'stepped projecting stone foot tapering toward the anchoring neck',parts:BUTTRESS})
]);
const turn=b=>box(1-b[5],b[1],b[0],1-b[2],b[4],b[3]);
function build(def,rotation){
  let parts=def.parts;
  for(let i=0;i<rotation;i++)parts=parts.map(p=>Object.freeze({tone:p.tone,box:turn(p.box)}));
  const fixed=Object.freeze(parts);
  const boxes=Object.freeze(fixed.map(p=>p.box));
  return Object.freeze({
    id:def.id,roster:def.roster,name:def.name,slug:def.slug,profile:def.profile,
    sourcePack:3,kind:'fortified-component',status:'unmerged-candidate',rotation,
    colors:PALETTE,parts:fixed,boxes,
    shape:Object.freeze({boxes}),selection:Object.freeze({kind:'box-union',boxes}),
    collision:Object.freeze({kind:'box-union',boxes}),
    placement:Object.freeze({singleCell:true,allowedRotations:Object.freeze([0,1,2,3])}),
    persistence:Object.freeze({liveSchema:1,liveIdRegistered:false,rotationSaved:false,
      candidateOnly:true}),prototypeOnly:true,placeable:false,integrated:false
  });
}
const BY_KEY=new Map(DATA.flatMap(d=>[0,1,2,3].map(rotation=>[
  d.id+':'+rotation,build(d,rotation)
])));
export const PACK3_FORTIFIED_IDS=Object.freeze(DATA.map(d=>d.id));
export const PACK3_FORTIFIED_ASSETS=Object.freeze(DATA.map(d=>BY_KEY.get(d.id+':0')));
export function pack3FortifiedById(id,rotation=0){
  // ID ownership is numeric; never coerce string, BigInt or object aliases.
  if(!Number.isInteger(id))return null;
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Fortified part rotation must be 0..3');
  return BY_KEY.get(id+':'+rotation)??null;
}
export function pack3FortifiedShape(id,rotation=0){
  return pack3FortifiedById(id,rotation)?.shape??null;
}
export function pack3FortifiedPrototype(id,rotation=0){
  const asset=pack3FortifiedById(id,rotation);
  if(!asset)throw new RangeError('Unknown Pack 3 fortified ID');
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:asset.boxes});
}
