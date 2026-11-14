// Mythwrought Pack 4 / Milestone 3 — CANDIDATE, UNMERGED, NOT LIVE.
// Individual physical voxel furniture and market components only.
// Opaque material geometry, per-cell identity and AABB unions; NO structures,
// world placement, harvesting, inventories, furnishings systems or animation.

export const PACK4_FURNISHING_IDS=Object.freeze({
  COOPERED_BARREL:169, IRONBOUND_CRATE:170, CARVED_BENCH:171,
  TRAVELER_TABLE:172, WAYMARK_SIGN:173, HEARTH_BANNER:174,
  FESTIVAL_CANOPY:175
});
export const PACK4_FURNISHING_FAMILIES=Object.freeze([56,57,58,59,60,61,62]);
export const PACK4_FURNISHING_STRIDE=10;
const paints=Object.freeze({
  oakShadow:[.255,.137,.093,1], oak:[.54,.312,.178,1],
  oakSun:[.71,.475,.273,1], oakEdge:[.81,.585,.334,1],
  walnut:[.34,.19,.13,1], chestnut:[.48,.25,.15,1],
  iron:[.245,.279,.305,1], ironEdge:[.46,.495,.49,1],
  brass:[.79,.575,.28,1], rope:[.73,.61,.375,1],
  parchment:[.84,.705,.46,1], deepTeal:[.075,.385,.425,1],
  seaTeal:[.13,.605,.615,1], saffron:[.92,.59,.225,1],
  burgundy:[.49,.17,.27,1], rose:[.73,.27,.32,1],
  cream:[.94,.83,.59,1], indigo:[.23,.25,.50,1]
});
function piece(bounds,material,{collision=true,selection=true}={}){
  if(bounds.length!==6 || !paints[material] ||
    bounds.some(n=>!Number.isFinite(n)||n<0||n>1) ||
    bounds.slice(0,3).some((n,i)=>n>=bounds[i+3]))
    throw RangeError('Invalid Pack 4 furniture part');
  return Object.freeze({bounds:Object.freeze([...bounds]),material,collision,selection});
}
function fixture(id,roster,key,name,mount,parts,detail){
  return Object.freeze({id,roster,key,name,mount,
    parts:Object.freeze(parts),detail,
    occludesWholeCell:false,availableRotations:Object.freeze([0,1,2,3]),
    persistence:Object.freeze({id,rotation:0}),
    interactions:Object.freeze({individuallySelectable:true,
      independentlyRemovable:true,inventory:false,harvest:false})});
}
// M5 support-contact repair: floor bases/legs reach y=0, the banner header
// meets its ceiling at y=1 and the canopy wall tie meets +Z=1. These are
// physical solids, not invisible test-only placement patches.
// A coopered tapered stave silhouette: staggered vertical cedar strips,
// horizontal iron hoops, lid and inset bung, never a single recolored cube.
const barrel=[
  piece([.20,0,.20,.80,.82,.80],'oakShadow'),
  piece([.17,.25,.17,.83,.31,.83],'iron'),
  piece([.16,.65,.16,.84,.71,.84],'iron'),
  piece([.21,.79,.21,.79,.86,.79],'oakSun'),
  piece([.28,.84,.28,.72,.865,.72],'walnut'),
  piece([.46,.858,.47,.54,.87,.53],'brass',{collision:false})
];
for(let i=0;i<8;i++){
 const t=i/8*Math.PI*2;
 const x=.5+.315*Math.cos(t),z=.5+.315*Math.sin(t);
 const minX=Math.max(.08,x-.054),maxX=Math.min(.92,x+.054);
 const minZ=Math.max(.08,z-.054),maxZ=Math.min(.92,z+.054);
 barrel.push(piece([minX,.22,minZ,maxX,.74,maxZ],i%2?'oak':'chestnut'));
}
for(const y of [.265,.655]){
 for(const [x,z] of [[.19,.46],[.75,.46],[.46,.19],[.46,.75]]){
  barrel.push(piece([x,y,z,x+.06,y+.038,z+.06],'ironEdge',{collision:false}));
 }
}
// Braced transport crate with slatted sides, exposed corner ferrules and base.
const crate=[piece([.115,0,.115,.885,.18,.885],'walnut')];
for(let n=0;n<4;n++){
  const y=.22+n*.15;
  crate.push(piece([.12,y,.115,.88,y+.12,.19],n%2?'oak':'oakSun'));
  crate.push(piece([.12,y,.81,.88,y+.12,.885],n%2?'oakSun':'oak'));
  crate.push(piece([.115,y,.20,.19,y+.12,.80],'oak'));
  crate.push(piece([.81,y,.20,.885,y+.12,.80],'oakSun'));
}
for(const x of [.115,.81])for(const z of [.115,.81]){
 crate.push(piece([x,.11,z,x+.075,.84,z+.075],'iron'));
 crate.push(piece([x,.84,z,x+.075,.88,z+.075],'brass',{collision:false,selection:false}));
}
for(let n=0;n<5;n++){
 const x=.12+n*.152;
 crate.push(piece([x,.82,.12,x+.12,.87,.88],n%2?'oakSun':'walnut'));
}
for(let n=0;n<4;n++){
 const x=.17+n*.16;
 crate.push(piece([x,.20,.075,x+.07,.80,.115],'walnut',{collision:false,selection:false}));
}
// Seating surface at half cell; four feet and a backrest pushed toward +Z.
const bench=[
 piece([.08,.43,.19,.92,.51,.72],'walnut'),
 piece([.08,.51,.19,.92,.535,.32],'oakSun'),
 piece([.08,.51,.39,.92,.535,.54],'oak'),
 piece([.08,.51,.60,.92,.535,.72],'oakSun'),
 piece([.10,0,.22,.20,.44,.34],'oakShadow'),
 piece([.80,0,.22,.90,.44,.34],'oakShadow'),
 piece([.10,0,.61,.20,.44,.71],'oakShadow'),
 piece([.80,0,.61,.90,.44,.71],'oakShadow'),
 piece([.11,.52,.67,.20,.88,.75],'oak'),
 piece([.80,.52,.67,.89,.88,.75],'oak'),
 piece([.16,.73,.67,.84,.84,.76],'walnut'),
 piece([.16,.57,.67,.84,.66,.76],'oakSun'),
 piece([.18,.31,.29,.82,.365,.36],'brass',{collision:false})
];
// Four-legged tavern table with independent decorated rim and shallow top.
const table=[
 piece([.085,.72,.095,.915,.79,.905],'oak'),
 piece([.09,.79,.10,.91,.816,.30],'oakSun'),
 piece([.09,.79,.70,.91,.816,.90],'oakSun'),
 piece([.10,.79,.31,.89,.816,.69],'chestnut'),
 piece([.09,.655,.09,.91,.723,.18],'walnut'),
 piece([.09,.655,.82,.91,.723,.91],'walnut'),
 piece([.09,.655,.18,.18,.723,.82],'walnut'),
 piece([.82,.655,.18,.91,.723,.82],'walnut')
];
for(const x of [.15,.77])for(const z of [.15,.77]){
 table.push(piece([x,0,z,x+.08,.72,z+.08],'oakShadow'));
 table.push(piece([x-.015,.09,z-.015,x+.095,.155,z+.095],'brass'));
}
table.push(piece([.24,.46,.20,.76,.51,.28],'walnut'));
table.push(piece([.24,.46,.72,.76,.51,.80],'walnut'));
table.push(piece([.47,.74,.46,.53,.835,.54],'brass',{collision:false}));
// Floor-mounted writable-sign *blank*: no actual text editing or NPC UI.
const sign=[
 piece([.46,0,.46,.54,.77,.54],'walnut'),
 piece([.41,0,.41,.59,.13,.59],'oakShadow'),
 piece([.16,.58,.43,.84,.93,.57],'oakSun'),
 piece([.19,.61,.419,.81,.90,.44],'parchment',{collision:false}),
 piece([.19,.61,.56,.81,.90,.581],'oak'),
 piece([.17,.62,.410,.22,.89,.44],'walnut'),
 piece([.78,.62,.410,.83,.89,.44],'walnut'),
 piece([.205,.85,.397,.795,.89,.421],'chestnut'),
 piece([.205,.625,.397,.795,.655,.421],'chestnut'),
 piece([.295,.72,.387,.705,.752,.413],'deepTeal',{collision:false})
];
for(const x of [.18,.77])for(const y of [.65,.83])
 sign.push(piece([x,y,.393,x+.04,y+.04,.417],'brass',{collision:false}));
// Individual ceiling-hung two-tail pennant: physical header, cloth strips,
// custom swallowtail gap. Deliberately NO flag animation or wind system.
const banner=[
 piece([.14,.91,.42,.86,1,.58],'oakShadow'),
 piece([.17,.86,.43,.83,.91,.57],'brass'),
 piece([.18,.30,.465,.82,.875,.535],'burgundy'),
 piece([.22,.33,.45,.38,.84,.465],'saffron',{collision:false}),
 piece([.62,.33,.45,.78,.84,.465],'saffron',{collision:false}),
 piece([.39,.46,.449,.61,.76,.465],'cream',{collision:false}),
 piece([.475,.56,.435,.525,.70,.449],'deepTeal',{collision:false}),
 piece([.20,.15,.47,.35,.30,.53],'rose'),
 piece([.65,.15,.47,.80,.30,.53],'rose'),
 piece([.47,.23,.46,.53,.38,.54],'burgundy'),
 piece([.29,.86,.42,.34,.95,.58],'rope'),
 piece([.66,.86,.42,.71,.95,.58],'rope')
];
// A single tensioned tent-cloth roof *tile*, visibly different from Pack3
// solid tile roofs: 6 narrow pleated fabric strips and rope edge + two ribs.
// Wall-face-mounted at +Z; not a complete stall, canopy, or assembled building.
const canopy=[
 piece([.06,.685,.14,.14,.77,.94],'walnut'),
 piece([.86,.685,.14,.94,.77,.94],'walnut'),
 piece([.07,.69,.88,.93,.79,1],'oakShadow'),
 piece([.07,.71,.08,.93,.77,.16],'oakShadow'),
 piece([.11,.75,.16,.89,.80,.86],'rope',{collision:false})
];
for(let i=0;i<6;i++){
 const x=.12+i*.13,y=.80+(i%2)*.022;
 canopy.push(piece([x,y,.16,x+.13,y+.065,.85],i%2?'cream':'seaTeal'));
 canopy.push(piece([x,y-.048,.11,x+.13,y+.01,.18],i%2?'saffron':'deepTeal'));
}
for(const x of [.11,.85])
 canopy.push(piece([x,.725,.17,x+.04,.90,.87],'brass',{collision:false}));

export const PACK4_FURNISHING_ASSETS=Object.freeze([
 fixture(169,56,'coopered-barrel','Copperhoop coopered barrel','floor',barrel,
   'Eight stepped curved timber staves, iron hoops, dressed lid and a brass bung.'),
 fixture(170,57,'ironbound-crate','Ironbound supply crate','floor',crate,
   'Interlocking plank sides, iron corner straps, split top planks and raised battens.'),
 fixture(171,58,'carved-bench','Hearthwood two-person bench','floor',bench,
   'Gapped half-height timber seat, four legs, high back and low cross-brace.'),
 fixture(172,59,'traveler-table','Wayfarer tavern table','floor',table,
   'Raised oak plank surface, brass-capped legs, open under-table volume and rim.'),
 fixture(173,60,'waymark-sign','Village waymark sign','floor',sign,
   'Floor-anchored carved wood post, oversized writable-blank panel and brass studs.'),
 fixture(174,61,'hearth-banner','Burgundy hearth banner','ceiling',banner,
   'Suspended heraldic fabric with cream emblem and split swallowtail lower points.'),
 fixture(175,62,'festival-canopy','Seaglass market canopy panel','wall-face',canopy,
   'Single scalloped fabric tile with rope ridge, structural ribs and alternating pleats.')
]);
export function furnishingAsset(id){return PACK4_FURNISHING_ASSETS.find(a=>a.id===id)??null;}
function checkOrientation(rotation){
 if(!Number.isInteger(rotation)||rotation<0||rotation>3)
  throw RangeError('Pack 4 furnishing rotation must be integer 0..3');
}
function rotate(b,r){
 let [x0,y0,z0,x1,y1,z1]=b;
 for(let j=0;j<r;j++) [x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
 return [x0,y0,z0,x1,y1,z1].map(n=>Math.round(n*1e6)/1e6);
}
export function furnishingShape(id,rotation=0){
 checkOrientation(rotation);
 const a=furnishingAsset(id);
 if(!a)throw RangeError('Unknown Pack 4 furnishing ID');
 const parts=Object.freeze(a.parts.map(p=>Object.freeze({...p,bounds:Object.freeze(rotate(p.bounds,rotation))})));
 return Object.freeze({
   id,rotation,mount:a.mount,occludesWholeCell:false,visible:parts,
   selection:Object.freeze(parts.filter(p=>p.selection).map(p=>p.bounds)),
   collision:Object.freeze(parts.filter(p=>p.collision).map(p=>p.bounds)),
   renderPass:'opaque'
 });
}
export function furnishingMountOffset(id,rotation=0){
 checkOrientation(rotation);
 const a=furnishingAsset(id);
 if(!a)throw RangeError('Unknown Pack 4 furnishing ID');
 if(a.mount==='floor')return Object.freeze([0,-1,0]);
 if(a.mount==='ceiling')return Object.freeze([0,1,0]);
 return Object.freeze([[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]][rotation]);
}
export function furnishingSaveState(id,rotation=0){
 furnishingShape(id,rotation);
 return Object.freeze({id,rotation});
}
export function restoreFurnishingSaveState(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||
   !Object.hasOwn(s,'id')||!Object.hasOwn(s,'rotation'))
   throw TypeError('Truncated Pack 4 furniture save');
 return furnishingSaveState(s.id,s.rotation);
}
const faces=[
 {n:[1,0,0],l:.81,q:b=>[[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]],[b[3],b[1],b[5]]]},
 {n:[-1,0,0],l:.75,q:b=>[[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]],[b[0],b[1],b[2]]]},
 {n:[0,1,0],l:1,q:b=>[[b[0],b[4],b[5]],[b[3],b[4],b[5]],[b[3],b[4],b[2]],[b[0],b[4],b[2]]]},
 {n:[0,-1,0],l:.56,q:b=>[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]],[b[0],b[1],b[5]]]},
 {n:[0,0,1],l:.90,q:b=>[[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]],[b[0],b[1],b[5]]]},
 {n:[0,0,-1],l:.80,q:b=>[[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]],[b[3],b[1],b[2]]]}
];
export function furnishingPreviewMesh(id,rotation=0){
 const s=furnishingShape(id,rotation),out=[];
 for(const p of s.visible){
  const rgba=paints[p.material];
  for(const face of faces){
   const quad=face.q(p.bounds);
   for(const i of [0,1,2,0,2,3])out.push(...quad[i],...face.n,
    rgba[0]*face.l,rgba[1]*face.l,rgba[2]*face.l,rgba[3]);
  }
 }
 return Object.freeze({opaque:new Float32Array(out),translucent:new Float32Array(0),
  stride:PACK4_FURNISHING_STRIDE,
  note:'Independent solid-subbox candidate, not linked to live world generation'});
}
