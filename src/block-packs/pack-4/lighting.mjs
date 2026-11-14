// MYTHWROUGHT PACK 4 — isolated v0.10 Gate A lighting candidates.
// Four independent physical fixtures. No engine light emission or world placement.
export const PACK4_LIGHT_IDS=Object.freeze({
  HEARTH_LANTERN:165, WALL_SCONCE:166, CRYSTAL_LANTERN:167, WAYFARER_TORCH:168
});
export const PACK4_LIGHT_FAMILIES=Object.freeze([35,36,37,38]);
export const PACK4_LIGHT_STRIDE=10; // xyz, normal xyz, diffuse rgba
const palette=Object.freeze({
  forgedIron:[.19,.24,.27,1], ironRim:[.40,.47,.48,1],
  oldCopper:[.53,.32,.22,1], copperEdge:[.78,.51,.30,1],
  gold:[.83,.61,.32,1], darkOak:[.36,.21,.14,1],
  vellum:[.96,.72,.40,.54], lanternAmber:[1,.53,.19,.46],
  lanternAqua:[.31,.85,.93,.52], quartz:[.42,.90,1,.57],
  sapphire:[.21,.37,.78,.62], crystalCore:[.82,.96,1,.7],
  blueGlow:[.31,.66,.94,.37], orangeGlow:[1,.52,.12,.63],
  fireGold:[1,.83,.28,.82], fireTip:[1,.91,.67,.42],
  char:[.16,.13,.12,1], rope:[.69,.55,.33,1]
});
function box(coords,material,{solid=true,target=true}={}){
  if(!palette[material]||coords.length!==6||
    coords.some(n=>!Number.isFinite(n)||n<0||n>1)||
    coords.slice(0,3).some((n,i)=>n>=coords[i+3]))
    throw Error('Invalid fixture box/material');
  return Object.freeze({bounds:Object.freeze([...coords]),material,collision:solid,selection:target});
}
function form(parts,id,roster,key,name,mount,light,description){
  return Object.freeze({id,roster,key,name,mount,parts:Object.freeze(parts),
    light:Object.freeze({...light,rgb:Object.freeze([...light.rgb]),
      engineEnabled:false,requires:'central dynamic point-light integration'}),
    description,availableRotations:Object.freeze([0,1,2,3]),
    occludesWholeCell:false,saveState:Object.freeze({id,rotation:0})});
}
const hearth=[
  // Wide four-foot silhouette, dark iron base, warm plated roof and glass bell.
  box([.26,.09,.27,.74,.16,.73],'forgedIron'),
  box([.30,.16,.31,.70,.20,.69],'ironRim'),
  box([.31,.21,.33,.69,.66,.67],'vellum'),
  box([.35,.23,.325,.65,.63,.345],'lanternAmber',{solid:false}),
  box([.35,.23,.655,.65,.63,.675],'lanternAmber',{solid:false}),
  box([.29,.66,.29,.71,.73,.71],'oldCopper'),
  box([.36,.73,.36,.64,.78,.64],'copperEdge'),
  box([.46,.78,.46,.54,.84,.54],'oldCopper'),
  box([.47,.84,.47,.53,.92,.53],'gold'),
  box([.28,.12,.25,.35,.76,.32],'forgedIron'),
  box([.65,.12,.25,.72,.76,.32],'forgedIron'),
  box([.28,.12,.68,.35,.76,.75],'forgedIron'),
  box([.65,.12,.68,.72,.76,.75],'forgedIron'),
  box([.27,.19,.27,.73,.23,.73],'oldCopper')
];
for(const [x,z] of [[.29,.29],[.64,.29],[.29,.64],[.64,.64]])
  hearth.push(box([x,0,z,x+.07,.10,z+.07],'gold'));
const wall=[
  // Sconce backplate on +Z face: visible bracket projects forward into room (-Z).
  box([.35,.30,.87,.65,.83,1],'forgedIron'),
  box([.40,.36,.83,.60,.79,.88],'oldCopper'),
  box([.475,.51,.32,.525,.59,.91],'gold'),
  box([.35,.46,.32,.65,.51,.42],'oldCopper'),
  box([.37,.39,.26,.63,.45,.49],'forgedIron'),
  box([.39,.45,.29,.61,.72,.48],'lanternAmber'),
  box([.39,.45,.29,.61,.72,.31],'copperEdge'),
  box([.39,.45,.46,.61,.72,.49],'copperEdge'),
  box([.36,.70,.27,.64,.75,.50],'oldCopper'),
  box([.43,.75,.34,.57,.83,.44],'gold'),
  box([.48,.82,.36,.52,.87,.42],'forgedIron')
];
const crystal=[
  // Bright suspended rune-cage structure with stacked multifaceted crystals.
  box([.29,0,.29,.71,.14,.71],'forgedIron'),
  box([.38,.14,.38,.62,.22,.62],'copperEdge'),
  box([.39,.22,.39,.61,.64,.61],'quartz'),
  box([.44,.25,.43,.56,.69,.57],'sapphire',{solid:false}),
  box([.46,.29,.46,.54,.63,.54],'crystalCore',{solid:false}),
  box([.36,.64,.36,.64,.71,.64],'oldCopper'),
  box([.42,.71,.42,.58,.76,.58],'gold'),
  box([.47,.76,.47,.53,.87,.53],'ironRim'),
  box([.46,.87,.46,.54,.92,.54],'oldCopper'),
  box([.26,.23,.24,.33,.69,.34],'forgedIron'),
  box([.67,.23,.24,.74,.69,.34],'forgedIron'),
  box([.26,.23,.66,.33,.69,.76],'forgedIron'),
  box([.67,.23,.66,.74,.69,.76],'forgedIron'),
  box([.25,.40,.36,.33,.46,.64],'gold',{solid:false}),
  box([.67,.40,.36,.75,.46,.64],'gold',{solid:false}),
  box([.36,.40,.25,.64,.46,.33],'gold',{solid:false}),
  box([.36,.40,.67,.64,.46,.75],'gold',{solid:false})
];
const torch=[
  // Bracket (+Z wall), tapered timber shaft, charcoal bowl, layered flame.
  box([.39,.20,.88,.61,.70,1],'forgedIron'),
  box([.47,.32,.54,.53,.43,.92],'ironRim'),
  box([.46,.23,.47,.54,.65,.59],'darkOak'),
  box([.43,.63,.43,.57,.70,.63],'rope'),
  box([.38,.69,.40,.62,.75,.66],'forgedIron'),
  box([.42,.75,.44,.58,.80,.62],'char'),
  box([.45,.80,.45,.55,.90,.56],'orangeGlow',{solid:false}),
  box([.46,.87,.48,.54,.96,.53],'fireGold',{solid:false}),
  box([.48,.94,.49,.52,1,.52],'fireTip',{solid:false}),
  box([.42,.82,.41,.46,.91,.46],'orangeGlow',{solid:false}),
  box([.54,.82,.58,.58,.93,.63],'fireGold',{solid:false})
];
export const PACK4_LIGHT_ASSETS=Object.freeze([
  form(hearth,165,35,'hearth-lantern','Hearthbound lantern','floor',
    {rgb:[1,.66,.32],radius:6,intensity:1.4},
    'Copper-capped iron lantern with four freestanding legs and warm frosted glass.'),
  form(wall,166,36,'wall-sconce','Hawthorn wall lantern','wall-face',
    {rgb:[1,.73,.39],radius:5,intensity:1.15},
    'Carved iron wall plate and forward arched brass lamp bracket.'),
  form(crystal,167,37,'crystal-lantern','Aetherglass crystal lantern','floor',
    {rgb:[.28,.75,1],radius:7,intensity:1.75},
    'Turquoise and sapphire inner crystal held inside a four-post rune cage.'),
  form(torch,168,38,'wayfarer-torch','Wayfarer wall torch','wall-face',
    {rgb:[1,.51,.19],radius:5,intensity:1.3},
    'Oak-handled metal torch and mounting bracket with individually faceted fire.')
]);
export function lightingAsset(id){return PACK4_LIGHT_ASSETS.find(x=>x.id===id)??null;}
function orientation(rotation){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw RangeError('Pack 4 lighting rotation must be 0..3');
}
function rotateBounds(b,r){
  let [x0,y0,z0,x1,y1,z1]=b;
  for(let i=0;i<r;i++) [x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  return [x0,y0,z0,x1,y1,z1].map(n=>Math.round(n*1e6)/1e6);
}
export function lightingShape(id,rotation=0){
  orientation(rotation);
  const asset=lightingAsset(id);
  if(!asset)throw RangeError('Unknown Pack 4 lighting ID');
  const parts=asset.parts.map(p=>Object.freeze({...p,bounds:Object.freeze(rotateBounds(p.bounds,rotation))}));
  return Object.freeze({id,rotation,mount:asset.mount,occludesWholeCell:false,
    visible:Object.freeze(parts),
    selection:Object.freeze(parts.filter(p=>p.selection).map(p=>p.bounds)),
    collision:Object.freeze(parts.filter(p=>p.collision).map(p=>p.bounds)),
    renderPass:'split-opaque-translucent'});
}
export function lightingMountOffset(id,rotation=0){
  const asset=lightingAsset(id);
  orientation(rotation);
  if(!asset)throw RangeError('Unknown Pack 4 lighting ID');
  if(asset.mount==='floor')return Object.freeze([0,-1,0]);
  // Local 0 wall is behind in +Z; rotated support wall tracks footprint.
  return Object.freeze([[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]][rotation]);
}
export function lightingSaveState(id,rotation=0){
  lightingShape(id,rotation);
  return Object.freeze({id,rotation});
}
export function restoreLightingSaveState(payload){
  if(!payload||typeof payload!=='object'||Array.isArray(payload)||
    !Object.hasOwn(payload,'id')||!Object.hasOwn(payload,'rotation'))
    throw TypeError('Invalid Pack 4 lighting state');
  return lightingSaveState(payload.id,payload.rotation);
}
const faces=[
 {normal:[1,0,0],light:.83,quad:b=>[[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]],[b[3],b[1],b[5]]]},
 {normal:[-1,0,0],light:.70,quad:b=>[[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]],[b[0],b[1],b[2]]]},
 {normal:[0,1,0],light:1,quad:b=>[[b[0],b[4],b[5]],[b[3],b[4],b[5]],[b[3],b[4],b[2]],[b[0],b[4],b[2]]]},
 {normal:[0,-1,0],light:.57,quad:b=>[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]],[b[0],b[1],b[5]]]},
 {normal:[0,0,1],light:.88,quad:b=>[[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]],[b[0],b[1],b[5]]]},
 {normal:[0,0,-1],light:.78,quad:b=>[[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]],[b[3],b[1],b[2]]]}
];
export function lightingPreviewMesh(id,rotation=0){
  const fixture=lightingShape(id,rotation);
  const opaque=[],translucent=[];
  for(const p of fixture.visible){
    const color=palette[p.material],dest=color[3]<1?translucent:opaque;
    for(const face of faces){
      const verts=face.quad(p.bounds);
      for(const i of [0,1,2,0,2,3]){
        const v=verts[i];
        dest.push(...v,...face.normal,
          color[0]*face.light,color[1]*face.light,color[2]*face.light,color[3]);
      }
    }
  }
  return Object.freeze({opaque:new Float32Array(opaque),
    translucent:new Float32Array(translucent),stride:PACK4_LIGHT_STRIDE,
    note:'Preview shows colors only: no working light emission or production transparency sorting.'});
}
