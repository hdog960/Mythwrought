// MYTHWROUGHT Pack 1: six independent stone-shape assets. PURE CANDIDATE MODULE.
// IDs 15..20 do not exist in the live engine. These occupancy definitions use the
// :12/:00 contract: {boxes:[[x0,y0,z0,x1,y1,z1], ...]}; all values local to a unit cell.
// No UI, renderer, world generation, saves or generic engine internals are modified.
import {masonryTexture} from './core-masonry.mjs';

export const STONE_SHAPE_IDS=Object.freeze({
  SLAB:15, STAIR:16, WALL:17, PILLAR:18, ARCH:19, RAILING:20
});
const full=[0,0,0,1,1,1];
const DATA=[
  [15,7,'stone-slab','Stone slab','slab',13,'Honed stone with a cut front lip and level half-height walkable surface'],
  [16,8,'stone-stair','Stone stair','stairs',10,'Two-riser warm limestone stair with dressed tread edges'],
  [17,9,'stone-wall','Stone wall','wall',9,'Rough fieldstone wall segment with a distinct broad coping cap'],
  [18,10,'stone-pillar','Stone pillar','pillar',14,'Square plinth, narrow fluted shaft and dressed stone capital'],
  [19,11,'stone-arch','Stone arch','arch',10,'Single-cell shallow decorative arch with two piers and true void beneath its vault'],
  [20,12,'stone-railing','Stone railing','railing',14,'Open narrow balustrade with three balusters and continuous top handrail']
];
export const STONE_SHAPES=Object.freeze(DATA.map(([id,roster,slug,name,kind,baseMaterialId,appearance])=>
  Object.freeze({id,roster,slug,name,kind,baseMaterialId,appearance,
    geometry:'union-of-unit-cell-AABBs',
    independentCell:true,selectable:true,removable:true,placeable:true,
    integration:'candidate-only',
    save:Object.freeze({schema:1,canonicalOnly:true,
      rotatedState:'BLOCKED BY ENGINE — schema-1 has no rotation/variant field'}),
    prerequisites:Object.freeze([':12 generic shape surface mesher',':00 shape-aware raycast/collision/save state'])
  })));
const LOOKUP=new Map(STONE_SHAPES.map(d=>[d.id,d]));
export function stoneShapeDefinition(id){return LOOKUP.get(id)??null;}
function box(...v){return Object.freeze(v);}
function baseBoxes(kind,variant){
  if(kind==='slab')return [box(0,variant==='upper'?.5:0,0,1,variant==='upper'?1:.5,1)];
  if(kind==='stairs')return variant==='upper'
    ?[box(0,.5,0,1,1,1),box(0,0,.5,1,.5,1)]
    :[box(0,0,0,1,.5,1),box(0,.5,.5,1,1,1)];
  if(kind==='wall')return [
    box(0,0,.365,1,.83,.635),
    box(0,.83,.29,1,1,.71)
  ];
  if(kind==='pillar')return [
    box(.16,0,.16,.84,.16,.84),
    box(.305,.16,.305,.695,.82,.695),
    box(.225,.82,.225,.775,1,.775)
  ];
  if(kind==='arch')return [
    box(.06,0,.31,.265,.78,.69),
    box(.735,0,.31,.94,.78,.69),
    box(.06,.78,.31,.94,1,.69),
    box(.235,.70,.31,.355,.79,.69),
    box(.645,.70,.31,.765,.79,.69),
    box(.31,.75,.31,.69,.81,.69)
  ];
  if(kind==='railing')return [
    box(0,0,.39,1,.13,.61),
    box(0,.77,.32,1,.92,.68),
    box(.07,.13,.425,.19,.77,.575),
    box(.44,.13,.425,.56,.77,.575),
    box(.81,.13,.425,.93,.77,.575)
  ];
  throw new RangeError('Unsupported stone shape kind');
}
function round(n){return Math.round(n*1e6)/1e6;}
function rotateBox(b,r){
  const xy=[[b[0],b[2]],[b[0],b[5]],[b[3],b[2]],[b[3],b[5]]].map(([x,z])=>{
    for(let i=0;i<r;i++){const q=x;x=1-z;z=q;}return [round(x),round(z)];
  });
  return box(Math.min(...xy.map(p=>p[0])),b[1],Math.min(...xy.map(p=>p[1])),
    Math.max(...xy.map(p=>p[0])),b[4],Math.max(...xy.map(p=>p[1])));
}
// A shape ID has exactly one default persisted form (rotation 0/lower).
// Alternate orientations are previewable prototypes, NOT silently serializable.
export function stoneShapeDescriptor(id,{rotation=0,variant='lower'}={}){
  const asset=stoneShapeDefinition(id);
  if(!asset)throw new RangeError('Unknown Pack 1 stone-shape ID');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Rotation must be an integer quarter-turn 0..3');
  if(!['lower','upper'].includes(variant))throw new RangeError('Unknown variant');
  if(variant==='upper'&&!['slab','stairs'].includes(asset.kind))
    throw new RangeError('Upper variant only valid for slab and stair');
  const boxes=Object.freeze(baseBoxes(asset.kind,variant).map(b=>rotateBox(b,rotation)));
  const oriented=rotation!==0||variant!=='lower';
  return Object.freeze({
    id,kind:asset.kind,rotation,variant,boxes,
    bounds:Object.freeze([...full]),
    prototypeOnly:true,placeable:false,units:'voxel',orientation:'quarter-turn-y',
    occupancy:'union-of-axis-aligned-boxes',
    orientationRequiresEngineSave:oriented,
    saveState:null
  });
}
export function stoneShapeOccupies(id,point,options={}){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Expected local [x,y,z] point');
  return stoneShapeDescriptor(id,options).boxes.some(
    b=>point.every((v,i)=>v>=b[i]&&v<b[i+3])
  );
}
export function stoneShapeTexture(id,face='north',size=24){
  const asset=stoneShapeDefinition(id);
  if(!asset)throw new RangeError('Unknown Pack 1 stone-shape ID');
  const base=masonryTexture(asset.baseMaterialId,face,size);
  const pixels=new Uint8Array(base.pixels);
  // Original motif overlays; the independent 3D volume, not tint, defines the asset.
  const h=base.height,w=base.width;
  function darken(x,y,k){
    const i=(y*w+x)*4;
    for(let c=0;c<3;c++)pixels[i+c]=Math.max(0,Math.min(255,Math.round(pixels[i+c]*k)));
  }
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const u=(x+.5)/w,v=(y+.5)/h;
    let dim=1;
    if(asset.kind==='slab'&&(v<.075||v>.88))dim=.65;
    if(asset.kind==='stairs'&&(Math.abs(v-.2)<.035||Math.abs(v-.72)<.035))dim=.62;
    if(asset.kind==='wall'&&v<.18)dim=.67;
    if(asset.kind==='pillar'&&Math.abs(Math.sin(u*Math.PI*10))>.93)dim=.59;
    if(asset.kind==='arch'&&Math.abs(Math.hypot((u-.5)*1.25,v-.65)-.35)<.042)dim=.55;
    if(asset.kind==='railing'&&(Math.abs(u-.13)<.028||Math.abs(u-.5)<.028||Math.abs(u-.87)<.028))dim=.67;
    if(dim!==1)darken(x,y,dim);
  }
  return Object.freeze({id,face,width:w,height:h,pixels});
}
