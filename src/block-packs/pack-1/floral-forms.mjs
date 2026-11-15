// MYTHWROUGHT manual Block Pack 1: Milestone 5 individual flower/mushroom assets.
// Pure candidate source. No live world, renderer, shader, collision, inventory or save changes.
// Target/mesh boxes follow the unmerged :00/:12 local-unit-cell AABB contract.
// Individual flowers are soft/passable but ray-selectable; mushrooms have bounded stems.
export const FLORAL_IDS=Object.freeze({
  SKYBELL:32, EMBER_LILY:33, MOONSTAR:34, THORNROSE:35,
  AMBER_CAP:36, VIOLET_SHELF:37, PEARL_GILL:38
});
const ITEMS=[
  [32,53,'skybell','Skybell','flower','A curved stem bearing four hanging blue bells and opposing narrow leaves','blue-bell'],
  [33,53,'ember-lily','Ember lily','flower','Copper-orange lily with six upturned petals and a tall seed-bearing center','ember'],
  [34,53,'moonstar','Moonstar flower','flower','Cream-white four-point star blossom on a thin upright stem and low basal leaves','star'],
  [35,53,'thornrose','Thornrose','flower','Deep carmine tiered rose bloom with separate curled petals and branching thorny stalk','rose'],
  [36,54,'amber-cap','Amber cap mushroom','mushroom','Rounded honey-colored canopy and pale stalk with a visible gill underside','dome'],
  [37,54,'violet-shelf','Violet shelf mushroom','mushroom','Three asymmetrical purple shelf caps on a branching trunk, open spaces beneath','shelf'],
  [38,54,'pearl-gill','Pearl gill mushroom','mushroom','Elegant ivory fan cap with four distinct gill ledges and tapered stem; cosmetic pale shading only','gill']
];
export const FLORAL_CANDIDATES=Object.freeze(ITEMS.map(([id,roster,slug,name,family,appearance,shape])=>
  Object.freeze({id,roster,slug,name,family,appearance,shape,
    individuallyPlaceable:true,individuallyRemovable:true,rayTargetable:true,
    growth:false,harvest:false,craft:false,edible:false,
    lightEmission:0, // In particular, "pearl" art is NOT real light.
    collisionPolicy:family==='flower'?'passable':'stem-only',
    save:Object.freeze({schema:1,canonicalRotation:0,rotated:'BLOCKED_BY_ENGINE'}),
    status:'CANDIDATE — NOT MERGED / NOT DEPLOYED'})));
const BY_ID=new Map(FLORAL_CANDIDATES.map(v=>[v.id,v]));
export const floralDefinition=id=>BY_ID.get(id)??null;
const Q=8;
const bound=(v,ceil=false)=>(ceil?Math.ceil(v*Q):Math.floor(v*Q))/Q;
const part=(role,x,y,z,X,Y,Z)=>{
  const box=Object.freeze([bound(x),bound(y),bound(z),bound(X,true),bound(Y,true),bound(Z,true)]);
  return Object.freeze({role,box});
};
function rawParts(id){
  // Authored silhouettes occupy one full voxel coordinate frame, not a cube skin.
  switch(id){
  case 32:return [
    part('stem',.47,.03,.46,.54,.77,.54),
    part('stem',.30,.60,.46,.49,.68,.54),part('stem',.52,.53,.46,.73,.62,.55),
    part('leaf',.17,.24,.40,.46,.36,.60),part('leaf',.54,.38,.40,.85,.50,.60),
    part('petal',.17,.40,.34,.35,.61,.66),part('petal',.30,.46,.34,.48,.65,.66),
    part('petal',.62,.32,.34,.79,.52,.66),part('petal',.74,.31,.35,.88,.49,.65),
    part('center',.29,.42,.43,.36,.50,.57)
  ];
  case 33:return [
    part('stem',.45,.04,.45,.56,.73,.55),
    part('leaf',.20,.25,.38,.47,.35,.62),part('leaf',.54,.33,.36,.81,.45,.64),
    part('petal',.17,.67,.37,.40,.91,.62),part('petal',.60,.66,.37,.83,.91,.62),
    part('petal',.37,.70,.12,.63,.94,.39),part('petal',.37,.70,.61,.63,.94,.87),
    part('petal',.27,.70,.29,.46,.99,.47),part('petal',.54,.70,.53,.73,.99,.71),
    part('center',.43,.68,.43,.57,.91,.57)
  ];
  case 34:return [
    part('stem',.46,.05,.46,.54,.76,.54),
    part('leaf',.24,.20,.43,.49,.31,.57),part('leaf',.51,.28,.42,.78,.40,.58),
    part('petal',.40,.68,.39,.60,1,.61),part('petal',.16,.77,.40,.47,.91,.60),
    part('petal',.53,.77,.40,.84,.91,.60),part('petal',.40,.77,.16,.60,.92,.44),
    part('petal',.40,.77,.56,.60,.92,.84),
    part('center',.43,.79,.43,.57,.91,.57)
  ];
  case 35:return [
    part('stem',.44,.06,.44,.55,.70,.55),
    part('stem',.31,.29,.46,.46,.38,.54),part('stem',.54,.43,.46,.69,.52,.54),
    part('leaf',.13,.23,.42,.36,.38,.58),part('leaf',.64,.38,.41,.87,.52,.59),
    part('petal',.29,.65,.29,.70,.84,.72),
    part('petal',.26,.76,.38,.48,.96,.64),part('petal',.52,.76,.38,.74,.96,.64),
    part('petal',.38,.76,.25,.63,.96,.45),part('petal',.38,.76,.55,.63,.96,.77),
    part('center',.43,.80,.43,.57,.96,.57)
  ];
  case 36:return [
    part('stem',.43,.03,.41,.57,.67,.59),
    part('gill',.22,.58,.23,.78,.70,.77),
    part('cap',.27,.69,.27,.73,.87,.73),
    part('cap',.18,.64,.37,.82,.82,.63),
    part('cap',.37,.64,.18,.63,.82,.82),
    part('cap',.34,.79,.34,.66,.94,.66)
  ];
  case 37:return [
    part('stem',.46,.02,.43,.57,.82,.58),
    part('stem',.34,.32,.43,.48,.43,.57),part('stem',.55,.53,.43,.74,.64,.57),
    part('gill',.12,.40,.34,.49,.48,.66),part('cap',.08,.48,.28,.51,.56,.72),
    part('gill',.49,.67,.33,.89,.74,.69),part('cap',.49,.74,.27,.93,.83,.73),
    part('gill',.28,.82,.34,.66,.88,.66),part('cap',.25,.88,.27,.70,.96,.73)
  ];
  case 38:return [
    part('stem',.44,.04,.44,.56,.70,.56),
    part('stem',.39,.58,.40,.61,.77,.60),
    part('gill',.16,.63,.39,.84,.70,.61),
    part('gill',.31,.70,.24,.69,.76,.76),
    part('gill',.23,.72,.31,.77,.80,.69),
    part('cap',.14,.78,.33,.86,.85,.67),
    part('cap',.33,.80,.14,.67,.87,.86),
    part('cap',.27,.84,.27,.73,.99,.73)
  ];
  default:throw new RangeError('Unknown physical flower/mushroom ID');
  }
}
function rotate(box,turns){
  const pts=[[box[0],box[2]],[box[0],box[5]],[box[3],box[2]],[box[3],box[5]]].map(([xx,zz])=>{
    let x=xx,z=zz;for(let i=0;i<turns;i++){const t=x;x=1-z;z=t;}
    return [Math.round(x*Q)/Q,Math.round(z*Q)/Q];
  });
  return Object.freeze([Math.min(...pts.map(v=>v[0])),box[1],Math.min(...pts.map(v=>v[1])),
    Math.max(...pts.map(v=>v[0])),box[4],Math.max(...pts.map(v=>v[1]))]);
}
export function floralDescriptor(id,{rotation=0}={}){
  const def=floralDefinition(id);
  if(!def)throw new RangeError('Unknown floral candidate');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('Rotation 0..3 required');
  const parts=Object.freeze(rawParts(id).map(({role,box})=>Object.freeze({role,box:rotate(box,rotation)})));
  const boxes=Object.freeze(parts.map(p=>p.box));
  return Object.freeze({id,kind:def.family,rotation,prototypeOnly:true,placeable:false,
    units:'voxel',bounds:Object.freeze([0,0,0,1,1,1]),orientation:'quarter-turn-y',
    occupancy:'union-of-axis-aligned-boxes',
    parts,boxes,selection:Object.freeze({boxes,individual:true}),
    collision:Object.freeze({kind:def.collisionPolicy,
      boxes:Object.freeze(parts.filter(p=>def.collisionPolicy==='stem-only'&&p.role==='stem').map(p=>p.box))}),
    cutout:true,transparency:'alpha-cutout-contract',
    lightEmission:0,orientationRequiresEngineSave:rotation!==0,saveState:null});
}
export function floralOccupies(id,p,{rotation=0,mode='selection'}={}){
  if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new TypeError('Invalid local point');
  const d=floralDescriptor(id,{rotation});
  if(!['selection','collision'].includes(mode))throw new RangeError('Unknown occupancy mode');
  return d[mode].boxes.some(box=>p.every((v,i)=>v>=box[i]&&v<box[i+3]));
}
const FACE=Object.freeze(['north','south','east','west','top','bottom']);
const PALETTES={
  32:{stem:[74,123,81],leaf:[70,135,102],petal:[79,131,218],center:[225,197,102]},
  33:{stem:[91,112,66],leaf:[107,152,65],petal:[237,117,49],center:[251,203,88]},
  34:{stem:[80,132,111],leaf:[102,155,124],petal:[235,233,196],center:[234,189,83]},
  35:{stem:[67,108,63],leaf:[78,137,75],petal:[156,48,85],center:[213,136,71]},
  36:{stem:[197,177,132],gill:[165,122,91],cap:[211,143,62]},
  37:{stem:[101,83,134],gill:[148,112,178],cap:[112,67,163]},
  38:{stem:[202,202,184],gill:[164,186,180],cap:[218,224,210]}
};
function noise(x,y,s){
  let k=Math.imul((x|0)+s*23,374761393)^Math.imul((y|0)-s*29,668265263);
  k=Math.imul(k^(k>>>13),1274126177);return ((k^(k>>>16))>>>0)/4294967295;
}
const clamp=x=>Math.round(Math.max(0,Math.min(255,x)));
export function floralTexture(id,role='petal',face='north',size=24){
  const def=floralDefinition(id);
  if(!def)throw new RangeError('Unknown floral candidate');
  if(!PALETTES[id][role])throw new RangeError('Invalid floral part role');
  if(!FACE.includes(face))throw new RangeError('Invalid face');
  if(!Number.isInteger(size)||size<8||size>128)throw new RangeError('Texture size 8..128');
  const pixels=new Uint8Array(size*size*4),seed=id*19+FACE.indexOf(face)*31;
  const base=PALETTES[id][role];
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=(x+.5)/size,v=(y+.5)/size;
    const grain=noise(x,y,seed),coarse=noise(Math.floor(u*11),Math.floor(v*11),seed+49);
    const rib=Math.sin(u*Math.PI*12+Math.sin(v*12)*1.2),curl=Math.cos(v*22+u*7);
    let m=.78+.24*grain+.13*coarse+.09*rib;
    if(role==='gill')m+=.23*Math.cos(u*52);
    if(role==='cap')m+=.20*curl;
    if(role==='stem')m+=.08*Math.sin(v*36);
    const speck=noise(Math.floor(u*26),Math.floor(v*26),seed+17);
    if(role==='cap'&&speck>.972)m*=1.29;
    const p=(y*size+x)*4;
    for(let k=0;k<3;k++)pixels[p+k]=clamp(base[k]*m+(role==='petal'&&k===0?3:0));
    pixels[p+3]=255;
  }
  return Object.freeze({id,role,face,width:size,height:size,pixels});
}
