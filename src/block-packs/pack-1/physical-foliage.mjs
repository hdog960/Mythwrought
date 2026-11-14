// MYTHWROUGHT — Manual Block Pack 1 / Milestone 4.
// These are opt-in physical, independently selectable/removable asset CANDIDATES.
// No live BLOCK registry, runtime, world generation, user saves, UI or shaders touched.
// Canonical cell boxes follow generic :00/:12 {boxes:[[x0,y0,z0,x1,y1,z1],...]}.
// Decorative/soft foliage can be passable while retaining real raycast hit geometry.
export const FOLIAGE_IDS=Object.freeze({
  YEW_HEDGE:24,
  BRIAR_BUSH:25,
  FERN_BUSH:26,
  IVY_VINE:27,
  WISTERIA_VINE:28,
  GOLDEN_FAN_LEAVES:29,
  RUBY_CURL_LEAVES:30,
  SILVER_STAR_LEAVES:31
});
const DATA=[
  [24,50,'yew-hedge','Clipped yew hedge','hedge','barrier',
   'Dense trimmed hedge with dark woody core, four stepped top crowns and a physically irregular silhouette',
   '#436b39'],
  [25,51,'briar-bush','Briar thicket','briar','soft-stem',
   'Low wide prickly brush with branching woody twigs and staggered leaf tufts, no harvestable berries',
   '#5a864b'],
  [26,51,'fern-bush','Woodland fern bush','fern','passable',
   'Tall thin central frond stalk with opposed arching feathered fronds and visible air between sprays',
   '#75a552'],
  [27,52,'ivy-vine','Climbing ivy','ivy','passable',
   'Thin face-mounted twisting ivy lattice and individually bounded heart-shaped leaves, not a wall cube',
   '#417f54'],
  [28,52,'wisteria-vine','Wisteria foliage vine','wisteria','passable',
   'Hanging curtain of drooping leaf spurs and long climbing woody runners; foliage only, no flowers',
   '#659d89'],
  [29,55,'golden-fan-leaves','Golden ornamental fan leaves','fan','passable',
   'Sculpted golden fan-leaf sprays on short stems, distinct from wild green Leaf Canopy 7',
   '#d6a953'],
  [30,55,'ruby-curl-leaves','Ruby curled ornamental leaves','curl','passable',
   'Curled crimson foliage ribbons with broken open lobes and an independent physical centerpiece',
   '#b8545b'],
  [31,55,'silver-star-leaves','Silver star ornamental leaves','star','passable',
   'Pale star-like foliage on splayed thin branches, angular airy constellation silhouette',
   '#a5bfbd']
];
export const FOLIAGE_ASSETS=Object.freeze(DATA.map(([id,roster,slug,name,kind,collision,appearance,color])=>
  Object.freeze({id,roster,slug,name,kind,collision,appearance,color,
    selectable:true,removable:true,placeable:true,independentCell:true,
    harvestable:false,craftable:false,growth:false,
    attachment:kind==='ivy'||kind==='wisteria'?'vertical-face':'none',
    save:Object.freeze({schema:1,canonicalRotation:0,
      rotatedState:'BLOCKED BY ENGINE — schema-1 rows contain no orientation'}),
    integration:'CANDIDATE — NOT MERGED / NOT DEPLOYED'})));
const LOOKUP=new Map(FOLIAGE_ASSETS.map(a=>[a.id,a]));
export function foliageDefinition(id){return LOOKUP.get(id)??null;}
const B=(role,x0,y0,z0,x1,y1,z1)=>Object.freeze({role,box:Object.freeze([x0,y0,z0,x1,y1,z1])});
// Each candidate deliberately has a DIFFERENT topology, not a shared cube with
// a material swap. Every box is a bounded, editable partial-cell occupancy part.
function partsFor(kind) {
  if(kind==='hedge')return [
    B('twig',.39,0,.40,.61,.85,.60),
    B('leaf',.08,.22,.18,.42,.79,.83), B('leaf',.34,.22,.08,.68,.88,.92),
    B('leaf',.62,.24,.17,.94,.78,.83), B('leaf',.12,.49,.12,.37,.91,.47),
    B('leaf',.37,.51,.09,.64,.99,.43), B('leaf',.65,.49,.13,.89,.90,.51),
    B('leaf',.19,.46,.57,.44,.91,.89), B('leaf',.46,.48,.64,.76,.96,.91)
  ];
  if(kind==='briar')return [
    B('twig',.46,0,.46,.54,.53,.54),
    B('twig',.24,.22,.47,.48,.35,.55),B('twig',.52,.24,.46,.81,.36,.55),
    B('twig',.45,.25,.24,.55,.37,.49),B('twig',.46,.23,.52,.55,.38,.81),
    B('leaf',.08,.29,.34,.37,.59,.66),B('leaf',.28,.37,.12,.58,.67,.42),
    B('leaf',.58,.31,.23,.91,.65,.53),B('leaf',.56,.33,.55,.84,.73,.87),
    B('leaf',.25,.39,.57,.53,.77,.91),B('leaf',.37,.55,.37,.65,.86,.65)
  ];
  if(kind==='fern')return [
    B('twig',.475,0,.475,.525,.79,.525),
    B('leaf',.18,.30,.42,.48,.41,.58),B('leaf',.52,.30,.42,.84,.42,.58),
    B('leaf',.10,.45,.44,.49,.53,.56),B('leaf',.51,.45,.44,.91,.53,.56),
    B('leaf',.23,.60,.22,.49,.68,.46),B('leaf',.51,.60,.22,.77,.68,.46),
    B('leaf',.23,.60,.54,.49,.68,.78),B('leaf',.51,.60,.54,.77,.68,.78),
    B('leaf',.43,.74,.34,.57,.96,.66)
  ];
  if(kind==='ivy')return [
    B('twig',.44,.02,.055,.50,.97,.112),
    B('twig',.26,.21,.055,.45,.27,.11),B('twig',.50,.49,.055,.79,.55,.11),
    B('twig',.25,.74,.055,.47,.80,.11),
    B('leaf',.12,.13,.026,.37,.35,.14),B('leaf',.36,.34,.020,.60,.53,.15),
    B('leaf',.64,.44,.025,.87,.66,.15),B('leaf',.12,.68,.025,.38,.88,.15),
    B('leaf',.43,.78,.023,.68,.99,.16)
  ];
  if(kind==='wisteria')return [
    B('twig',.15,.84,.052,.88,.92,.13),
    B('twig',.20,.47,.052,.27,.85,.12),B('twig',.49,.19,.052,.56,.85,.12),
    B('twig',.75,.37,.052,.82,.85,.12),
    B('leaf',.10,.55,.02,.37,.71,.17),B('leaf',.14,.28,.02,.34,.48,.17),
    B('leaf',.40,.47,.02,.68,.65,.16),B('leaf',.42,.14,.02,.64,.39,.16),
    B('leaf',.67,.55,.02,.91,.77,.16),B('leaf',.68,.26,.02,.88,.48,.17)
  ];
  if(kind==='fan')return [
    B('twig',.44,.03,.43,.56,.52,.57),
    B('leaf',.13,.38,.35,.38,.58,.65),B('leaf',.23,.54,.27,.46,.80,.73),
    B('leaf',.39,.66,.24,.61,.94,.76),B('leaf',.54,.54,.28,.79,.83,.72),
    B('leaf',.68,.38,.34,.89,.60,.66),B('leaf',.35,.40,.13,.64,.65,.38),
    B('leaf',.31,.42,.62,.69,.69,.88)
  ];
  if(kind==='curl')return [
    B('twig',.45,.06,.43,.55,.67,.55),
    B('leaf',.20,.30,.39,.39,.76,.62),B('leaf',.20,.66,.34,.53,.84,.65),
    B('leaf',.40,.72,.34,.78,.91,.64),B('leaf',.65,.43,.35,.80,.80,.65),
    B('leaf',.42,.37,.14,.68,.65,.35),B('leaf',.34,.46,.63,.63,.73,.87),
    B('leaf',.36,.20,.33,.65,.40,.67)
  ];
  if(kind==='star')return [
    B('twig',.47,.04,.45,.53,.69,.55),
    B('twig',.32,.43,.47,.69,.50,.53),
    B('leaf',.38,.67,.41,.62,.99,.59),B('leaf',.12,.56,.43,.43,.71,.57),
    B('leaf',.58,.56,.43,.90,.71,.57),B('leaf',.24,.30,.25,.47,.57,.43),
    B('leaf',.53,.30,.57,.76,.59,.77),B('leaf',.36,.53,.12,.64,.65,.39),
    B('leaf',.36,.53,.63,.64,.65,.91)
  ];
  throw new RangeError('Unknown foliage profile');
}
const snap=n=>Math.round(n*1e6)/1e6;
function rotateBox(b,turns){
  const corners=[[b[0],b[2]],[b[0],b[5]],[b[3],b[2]],[b[3],b[5]]].map(([X,Z])=>{
    let x=X,z=Z;for(let i=0;i<turns;i++){const old=x;x=1-z;z=old;}
    return [snap(x),snap(z)];
  });
  return Object.freeze([
    Math.min(...corners.map(c=>c[0])),b[1],Math.min(...corners.map(c=>c[1])),
    Math.max(...corners.map(c=>c[0])),b[4],Math.max(...corners.map(c=>c[1]))
  ]);
}
function collidablePart(asset,part){
  if(asset.collision==='barrier')return true;
  if(asset.collision==='soft-stem')return part.role==='twig';
  return false;
}
// Collision boxes may intentionally be empty for soft, walk-through plants.
// Targeting ALWAYS uses real positive occupancy boxes, never decorative-only mesh.
export function foliageDescriptor(id,{rotation=0}={}){
  const asset=foliageDefinition(id);
  if(!asset)throw new RangeError('Unknown Pack 1 foliage candidate ID');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Rotation must be quarter-turn 0..3');
  const parts=Object.freeze(partsFor(asset.kind).map(p=>
    Object.freeze({role:p.role,box:rotateBox(p.box,rotation)})));
  const boxes=Object.freeze(parts.map(p=>p.box));
  const collisions=Object.freeze(parts.filter(p=>collidablePart(asset,p)).map(p=>p.box));
  return Object.freeze({
    id,kind:asset.kind,rotation,prototypeOnly:true,placeable:false,
    bounds:Object.freeze([0,0,0,1,1,1]),units:'voxel',
    occupancy:'union-of-axis-aligned-boxes',orientation:'quarter-turn-y',
    boxes,parts,
    selection:Object.freeze({boxes,individual:true}),
    collision:Object.freeze({kind:asset.collision,boxes:collisions}),
    transparency:asset.collision==='barrier'?'cutout':'cutout-passable',
    attachment:asset.attachment,orientationRequiresEngineSave:rotation!==0,saveState:null
  });
}
export function foliageOccupies(id,point,{rotation=0,mode='selection'}={}){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Expected local finite XYZ position');
  const d=foliageDescriptor(id,{rotation});
  if(!['selection','collision'].includes(mode))throw new RangeError('Unknown occupancy mode');
  const boxes=mode==='selection'?d.selection.boxes:d.collision.boxes;
  return boxes.some(b=>point.every((x,i)=>x>=b[i]&&x<b[i+3]));
}
const FACE=Object.freeze(['north','south','east','west','top','bottom']);
const COLORS=Object.freeze({
  24:[61,105,55],25:[87,135,66],26:[124,164,82],27:[58,138,87],
  28:[91,153,136],29:[220,170,78],30:[172,71,85],31:[174,201,194]
});
const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
function hash(x,y,s){
  let h=Math.imul((x|0)+s*19,374761393)^Math.imul((y|0)+s*11,668265263);
  h=Math.imul(h^(h>>>13),1274126177);
  return ((h^(h>>>16))>>>0)/4294967295;
}
function pattern(id,role,u,v,face,n){
  const seed=id*47+FACE.indexOf(face)*17;
  const g=hash(Math.floor(u*n),Math.floor(v*n),seed);
  const seedCell=hash(Math.floor(u*13),Math.floor(v*13),seed+9);
  if(role==='twig'){
    const grain=Math.sin(u*33+Math.sin(v*17)*1.4);
    const m=.70+.26*g+.13*grain;
    return [94,68,42].map((t,i)=>clamp(t*m+(i===0?10:0)));
  }
  const base=COLORS[id];
  let scale=.73+.36*g+.14*seedCell;
  const vein=Math.abs(Math.sin((u*.9+v*.24)*29+Math.sin(v*12+seed)*.85));
  const diagonal=Math.abs(Math.sin((u-v*.65)*23+seed*.07));
  if(id===24)scale+=.10*Math.sin((u+v)*38);
  if(id===25)scale+=.18*Math.sin(u*17-v*8);
  if(id===26)scale+=.22*Math.cos((u+v)*34);
  if(id===27)scale+=.12*Math.sin(u*27+v*13);
  if(id===28)scale+=.20*Math.cos(u*16-v*22);
  if(id===29)scale+=.28*Math.sin(u*12-v*19);
  if(id===30)scale+=.19*Math.cos(u*30+v*8);
  if(id===31)scale+=.21*Math.sin((u-v)*26);
  let out=base.map(t=>clamp(t*scale));
  if(vein<(.056+(id===26?.05:0)))out=base.map((t,i)=>clamp(t*(id===29?1.29:.58)+(i===0?13:0)));
  if(diagonal<.045&&id>=29)out=base.map(t=>clamp(t*1.18));
  if(seedCell>.955)out=base.map(t=>clamp(t*1.25));
  return out;
}
// Deterministic original pixel art per PART role. Identity/outline is geometry,
// not a skin alias for integrated LEAVES ID 7 or :12's natural leaf species.
export function foliageTexture(id,face='north',size=24,role='leaf'){
  const asset=foliageDefinition(id);
  if(!asset)throw new RangeError('Unknown foliage candidate ID');
  if(!FACE.includes(face))throw new RangeError('Unknown foliage face');
  if(!['leaf','twig'].includes(role))throw new RangeError('Unknown material role');
  if(!Number.isInteger(size)||size<8||size>128)throw new RangeError('Invalid texture size');
  const pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const p=(y*size+x)*4;
    const rgb=pattern(id,role,(x+.5)/size,(y+.5)/size,face,size);
    pixels[p]=rgb[0];pixels[p+1]=rgb[1];pixels[p+2]=rgb[2];pixels[p+3]=255;
  }
  return Object.freeze({id,face,width:size,height:size,role,pixels});
}
