// Mythwrought — Block Pack 4, Milestone 1 (UNMERGED CANDIDATE).
// Reusable *physical* window/opening cells. Nothing here registers with live main.
export const PACK4_WINDOW_IDS = Object.freeze({
  CLEAR_GLASS:159, STAINED_SUNGLASS:160, STAINED_MOONGLASS:161,
  WOODEN_WINDOW_FRAME:162, WOODEN_SHUTTERS:163, IRON_BARS:164
});
export const PACK4_WINDOW_ID_MIN = 159;
export const PACK4_WINDOW_ID_MAX = 164;
export const PACK4_WINDOW_MESH_STRIDE = 10; // xyz + normal xyz + rgba

const MATERIALS = Object.freeze({
  clearGlass:       [0.66,0.92,0.95,0.27],
  clearGlassBevel:  [0.88,0.98,0.96,0.40],
  honeyGlass:       [0.97,0.58,0.18,0.54],
  goldGlass:        [1.00,0.78,0.30,0.55],
  coralGlass:       [0.93,0.32,0.29,0.55],
  jadeGlass:        [0.32,0.84,0.65,0.52],
  moonGlass:        [0.32,0.40,0.83,0.50],
  irisGlass:        [0.62,0.34,0.81,0.55],
  frostGlass:       [0.40,0.82,0.91,0.49],
  cobaltGlass:      [0.22,0.47,0.77,0.53],
  lead:             [0.24,0.27,0.33,1],
  gildedLead:       [0.68,0.48,0.24,1],
  oak:              [0.45,0.25,0.14,1],
  oakLight:         [0.68,0.42,0.22,1],
  oakShade:         [0.28,0.15,0.11,1],
  brass:            [0.82,0.63,0.29,1],
  wroughtIron:      [0.21,0.24,0.28,1],
  ironEdge:         [0.40,0.47,0.51,1]
});

function part(bounds,material,collision=true,selection=true){
  if(bounds.length!==6||bounds.some(n=>!Number.isFinite(n)||n<0||n>1)||
     bounds[0]>=bounds[3]||bounds[1]>=bounds[4]||bounds[2]>=bounds[5]||
     !MATERIALS[material])throw Error('Invalid Pack 4 material/box');
  return Object.freeze({bounds:Object.freeze([...bounds]),material,collision,selection});
}
function rails(pieces,material,x0,x1,y0,y1,z0,z1,width){
  pieces.push(part([x0,y0,z0,x0+width,y1,z1],material));
  pieces.push(part([x1-width,y0,z0,x1,y1,z1],material));
  pieces.push(part([x0+width,y1-width,z0,x1-width,y1,z1],material));
  pieces.push(part([x0+width,y0,z0,x1-width,y0+width,z1],material));
  return pieces;
}
const clear=[part([.045,.045,.479,.955,.955,.521],'clearGlass')];
rails(clear,'clearGlassBevel',.045,.955,.045,.955,.477,.523,.027);

// Sunset glass: physically one pane, with raised sunburst-leading and jewel tiles.
const sun=[part([.065,.065,.474,.935,.935,.526],'honeyGlass')];
sun.push(part([.09,.09,.458,.48,.48,.468],'coralGlass',false));
sun.push(part([.52,.52,.458,.91,.91,.468],'goldGlass',false));
sun.push(part([.52,.09,.458,.91,.48,.468],'jadeGlass',false));
sun.push(part([.09,.52,.458,.48,.91,.468],'goldGlass',false));
sun.push(part([.468,.075,.45,.532,.925,.55],'gildedLead'));
sun.push(part([.075,.468,.45,.925,.532,.55],'gildedLead'));
rails(sun,'lead',.065,.935,.065,.935,.456,.544,.027);
sun.push(part([.407,.407,.442,.593,.593,.557],'coralGlass',false));

// Moonlit glass uses asymmetric tall stripes and inset arc motif, not a recolor.
const moon=[part([.055,.055,.475,.945,.945,.525],'moonGlass')];
moon.push(part([.09,.08,.456,.29,.92,.466],'cobaltGlass',false));
moon.push(part([.31,.08,.456,.52,.92,.466],'irisGlass',false));
moon.push(part([.54,.08,.456,.76,.92,.466],'frostGlass',false));
moon.push(part([.78,.08,.456,.91,.92,.466],'irisGlass',false));
for(const x of [.292,.522,.762])moon.push(part([x,.065,.441,x+.024,.935,.553],'lead'));
rails(moon,'lead',.055,.945,.055,.945,.443,.557,.024);
moon.push(part([.56,.42,.435,.78,.68,.448],'frostGlass',false));
moon.push(part([.67,.49,.429,.81,.73,.447],'moonGlass',false));

// Solid timber pieces frame an actual empty opening, with raised tracery.
const frame=[];
rails(frame,'oak',.035,.965,.035,.965,.38,.62,.115);
frame.push(part([.478,.15,.417,.522,.85,.583],'oakLight'));
frame.push(part([.15,.47,.417,.85,.53,.583],'oakLight'));
for(const x of [.035,.885])for(const y of [.035,.885])
  frame.push(part([x,y,.355,x+.08,y+.08,.645],'brass',false));
frame.push(part([.035,.035,.36,.965,.075,.64],'oakShade',false));

// Two separately silhouetted hinged leaves with visible raised slat courses.
const shutters=[
  part([.065,.09,.43,.485,.91,.59],'oak'),
  part([.515,.09,.43,.935,.91,.59],'oak')
];
for(const x of [.065,.515]){
  for(let i=0;i<6;i++){
    const y=.135+i*.12;
    shutters.push(part([x+.017,y,.397,x+.403,y+.033,.433],'oakLight',false));
  }
  shutters.push(part([x+.03,.115,.59,x+.06,.885,.63],'oakShade',false));
  shutters.push(part([x+.36,.115,.59,x+.39,.885,.63],'oakShade',false));
}
for(const x of [.07,.905])for(const y of [.2,.73]) {
  shutters.push(part([x,y,.385,x+.025,y+.08,.645],'brass'));
  // Physical hinge pintles connect these centered leaves all the way to the
  // adjacent support wall (+Z=1), not merely to empty space at z=.645.
  shutters.push(part([x,y+.02,.59,x+.025,y+.06,1],'brass'));
}
shutters.push(part([.474,.465,.39,.526,.535,.435],'brass',false));

// Open air remains between true narrow bars. A full collision cube is incorrect.
const bars=[];
for(const x of [.11,.365,.62,.865]){
  bars.push(part([x,.055,.456,x+.048,.945,.544],'wroughtIron'));
  bars.push(part([x+.008,.10,.447,x+.021,.90,.455],'ironEdge',false));
}
for(const y of [.135,.82])bars.push(part([.07,y,.45,.93,y+.053,.55],'wroughtIron'));
for(const x of [.095,.35,.605,.85])for(const y of [.145,.83])
  bars.push(part([x,y,.428,x+.079,y+.034,.565],'brass',false));

const definitions=[
  {id:159,roster:30,key:'clear-glass',name:'Clear glass pane',family:'clear-glass',
   mount:'opening',profile:'thin transparent plane',parts:clear,lightEmission:0,
   notes:'Transparent glaze with subtle beveled highlights; physical pane and independent cell.'},
  {id:160,roster:31,key:'stained-sunglass',name:'Sunfire stained glass',family:'stained-glass',
   mount:'opening',profile:'gold-leaded four-jewel sunburst',parts:sun,lightEmission:0,
   notes:'Warm amber, coral and jade quadrants with raised cross tracery; NOT dynamic illumination.'},
  {id:161,roster:31,key:'stained-moonglass',name:'Moonveil stained glass',family:'stained-glass',
   mount:'opening',profile:'vertical silver-blue moon tracery',parts:moon,lightEmission:0,
   notes:'Cool asymmetric stripe layout and glass moon crescent; distinct physical variant.'},
  {id:162,roster:32,key:'wooden-window-frame',name:'Carved oak window frame',family:'wooden-window-frames',
   mount:'opening',profile:'open sash cross-mullions',parts:frame,lightEmission:0,
   notes:'Hollow opening, oak jambs, central timber mullions and brass corner pins.'},
  {id:163,roster:33,key:'wooden-shutters',name:'Hinged oak shutters',family:'wooden-shutters',
   mount:'wall-face',profile:'paired raised slatted leaves',parts:shutters,lightEmission:0,
   notes:'Closed two-leaf fixed candidate; animation/open-close engine behavior not provided.'},
  {id:164,roster:34,key:'wrought-iron-bars',name:'Wrought iron bars',family:'iron-bars',
   mount:'opening',profile:'four open-spaced rods with braces',parts:bars,lightEmission:0,
   notes:'Actual open spaces between iron rods; a full-cube collision hull is forbidden.'}
];

export const PACK4_WINDOW_ASSETS=Object.freeze(definitions.map(entry=>{
  const all=Object.freeze([...entry.parts]);
  const transparent=all.some(p=>MATERIALS[p.material][3]<1);
  return Object.freeze({...entry,parts:all,transparent,occludesWholeCell:false,
    availableRotations:Object.freeze([0,1,2,3]),
    saveState:Object.freeze({id:entry.id,rotation:0})});
}));
export const PACK4_WINDOW_FAMILIES=Object.freeze([30,31,32,33,34]);
export function windowAsset(id){
  return PACK4_WINDOW_ASSETS.find(asset=>asset.id===id)??null;
}
function checkTurn(rotation){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw RangeError('Pack 4 orientation must be an integer 0..3');
}
function rotatedBounds(b,rotation){
  let [x0,y0,z0,x1,y1,z1]=b;
  for(let i=0;i<rotation;i++){
    [x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  }
  return [x0,y0,z0,x1,y1,z1].map(n=>Math.round(n*1e6)/1e6);
}
export function windowShape(id,rotation=0){
  checkTurn(rotation);
  const asset=windowAsset(id);
  if(!asset)throw RangeError('Unknown Pack 4 window block ID');
  const parts=asset.parts.map(p=>Object.freeze({...p,bounds:Object.freeze(rotatedBounds(p.bounds,rotation))}));
  return Object.freeze({
    id,rotation,mount:asset.mount,renderPass:asset.transparent?'split-opaque-translucent':'opaque',
    occludesWholeCell:false,
    visible:Object.freeze(parts),
    selection:Object.freeze(parts.filter(p=>p.selection).map(p=>p.bounds)),
    collision:Object.freeze(parts.filter(p=>p.collision).map(p=>p.bounds))
  });
}
export function windowSaveState(id,rotation=0){
  windowShape(id,rotation);
  return Object.freeze({id,rotation});
}
export function restoreWindowSaveState(saved){
  if(!saved||typeof saved!=='object'||Array.isArray(saved)||
     !Object.hasOwn(saved,'id')||!Object.hasOwn(saved,'rotation'))
    throw TypeError('Invalid window cell state');
  return windowSaveState(saved.id,saved.rotation);
}
export function windowMountOffset(id,rotation=0){
  const shape=windowShape(id,rotation);
  if(shape.mount!=='wall-face')return null;
  // In local north-facing orientation the mounting wall is directly behind (+Z).
  const offsets=[[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]];
  return Object.freeze([...offsets[rotation]]);
}
const FACES=[
  {n:[1,0,0],light:.82,quad:b=>[[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]],[b[3],b[1],b[5]]]},
  {n:[-1,0,0],light:.75,quad:b=>[[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]],[b[0],b[1],b[2]]]},
  {n:[0,1,0],light:1,quad:b=>[[b[0],b[4],b[5]],[b[3],b[4],b[5]],[b[3],b[4],b[2]],[b[0],b[4],b[2]]]},
  {n:[0,-1,0],light:.57,quad:b=>[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]],[b[0],b[1],b[5]]]},
  {n:[0,0,1],light:.91,quad:b=>[[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]],[b[0],b[1],b[5]]]},
  {n:[0,0,-1],light:.80,quad:b=>[[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]],[b[3],b[1],b[2]]]}
];
export function windowPreviewMesh(id,rotation=0){
  const shape=windowShape(id,rotation);
  const opaque=[],translucent=[];
  for(const p of shape.visible){
    const rgba=MATERIALS[p.material];
    const output=rgba[3]<1?translucent:opaque;
    for(const face of FACES){
      const q=face.quad(p.bounds);
      for(const i of [0,1,2,0,2,3]){
        const xyz=q[i];
        output.push(...xyz,...face.n,rgba[0]*face.light,rgba[1]*face.light,rgba[2]*face.light,rgba[3]);
      }
    }
  }
  return Object.freeze({opaque:new Float32Array(opaque),
    translucent:new Float32Array(translucent),stride:PACK4_WINDOW_MESH_STRIDE,
    note:'Opt-in unmerged preview mesh; actual engine translucent depth handling remains an integration dependency.'});
}
