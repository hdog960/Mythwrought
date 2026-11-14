// Mythwrought — Pack 4, Milestone 4. UNMERGED CANDIDATE / NOT IN LIVE GAME.
// Six physically selectable one-cell architectural parts, NOT completed
// chimneys, fireplaces, wells, water systems, fountains or world structures.
// Fire, smoke, light, pulleys, fluids and animation are metadata dependencies.
export const PACK4_CIVIC_IDS=Object.freeze({
  ASHEN_CHIMNEY:176, HEARTHSTONE_FIREPLACE:177, WELLSIDE_RIM:178,
  WELLHOUSE_ROOF:179, BRASS_PULLEY:180, DRY_FOUNTAIN_BASIN:181
});
export const PACK4_CIVIC_FAMILIES=Object.freeze([63,64,65,66,67,68]);
export const PACK4_CIVIC_STRIDE=10;
const pigment=Object.freeze({
  basalt:[.27,.29,.33,1], basaltEdge:[.40,.44,.48,1],
  ash:[.17,.16,.19,1], soot:[.09,.095,.105,1],
  limestone:[.67,.65,.57,1], chalk:[.82,.78,.66,1],
  carved:[.52,.53,.49,1], mortar:[.34,.33,.31,1],
  rustCopper:[.51,.34,.23,1], oxidizedCopper:[.22,.53,.49,1],
  brass:[.81,.63,.31,1], iron:[.25,.27,.30,1],
  gilt:[.94,.72,.38,1], oak:[.45,.26,.18,1],
  oakShade:[.27,.16,.13,1], oakTrim:[.69,.44,.25,1],
  burgundy:[.49,.19,.27,1], jewelTeal:[.15,.56,.59,1],
  charcoal:[.13,.12,.12,1], drySand:[.71,.64,.49,1]
});
function part(b,mat,{collision=true,selection=true}={}){
  if(!Array.isArray(b)||b.length!==6||!pigment[mat]||
     !b.every(n=>Number.isFinite(n)&&n>=0&&n<=1)||
     b.slice(0,3).some((n,i)=>n>=b[i+3]))
    throw RangeError('Invalid independent Pack 4 civic sub-box');
  return Object.freeze({bounds:Object.freeze([...b]),material:mat,collision,selection});
}
function asset({id,roster,key,name,mount,description,parts,engines}){
  return Object.freeze({id,roster,key,name,mount,description,
    parts:Object.freeze(parts),occludesWholeCell:false,
    availableRotations:Object.freeze([0,1,2,3]),
    saveState:Object.freeze({id,rotation:0}),
    engines:Object.freeze({fire:false,smoke:false,water:false,
      lighting:false,animation:false,...engines}),
    independentlySelectable:true,independentlyRemovable:true});
}
// 176 — ONE hollow flue throat COURSE: four spatially distinct walls,
// outer stone corner quoining, top projecting cap band. The center is AIR,
// not a solid cube or a full-height stack. No operational smoke emissions.
const chimney=[
  part([.13,.12,.13,.29,.91,.87],'basalt'),
  part([.71,.12,.13,.87,.91,.87],'basalt'),
  part([.29,.12,.13,.71,.91,.29],'basalt'),
  part([.29,.12,.71,.71,.91,.87],'basalt'),
  part([.10,.86,.10,.30,.96,.90],'limestone'),
  part([.70,.86,.10,.90,.96,.90],'limestone'),
  part([.30,.86,.10,.70,.96,.30],'limestone'),
  part([.30,.86,.70,.70,.96,.90],'limestone'),
  part([.31,.11,.285,.69,.135,.31],'soot',{collision:false}),
  part([.31,.11,.69,.69,.135,.715],'soot',{collision:false})
];
for(const y of [.18,.43,.68]){
  for(const [x,z] of [[.095,.095],[.755,.095],[.095,.755],[.755,.755]]){
    chimney.push(part([x,y,z,x+.15,y+.12,z+.15],y===.43?'chalk':'carved'));
  }
}
for(const y of [.34,.59]){
  chimney.push(part([.13,y,.12,.29,y+.03,.88],'mortar',{collision:false}));
  chimney.push(part([.71,y,.12,.87,y+.03,.88],'mortar',{collision:false}));
}
// 177 — ONE open-front hearth insert, not a complete house fireplace.
// Interior cavity and open mouth face -Z, real low stone slab, back,
// thick side jambs, mantle, iron grate rods and decorative dry coals.
const fireplace=[
  part([.08,.08,.12,.92,.19,.91],'basalt'),
  part([.10,.19,.81,.90,.80,.94],'ash'),
  part([.09,.19,.18,.26,.84,.85],'carved'),
  part([.74,.19,.18,.91,.84,.85],'carved'),
  part([.08,.76,.13,.92,.88,.93],'limestone'),
  part([.15,.88,.22,.85,.94,.87],'chalk'),
  part([.28,.20,.66,.72,.24,.76],'soot'),
  part([.29,.24,.67,.71,.29,.77],'charcoal',{collision:false}),
  part([.31,.24,.67,.39,.32,.77],'rustCopper',{collision:false}),
  part([.61,.24,.67,.69,.31,.77],'rustCopper',{collision:false}),
  part([.37,.35,.79,.63,.47,.81],'soot',{collision:false})
];
for(const x of [.28,.41,.54,.67])
  fireplace.push(part([x,.21,.36,x+.04,.31,.80],'iron'));
for(const y of [.36,.59])
  fireplace.push(part([.245,y,.19,.755,y+.04,.27],'iron'));
for(const x of [.10,.75])for(const y of [.28,.56]){
  fireplace.push(part([x,y,.17,x+.14,y+.09,.23],'basaltEdge',{collision:false}));
}
// 178 — ONE reusable 90-degree rim QUADRANT with an L-shaped stone edge,
// leaving the well's inside corner genuinely empty. Not a full ring.
const rim=[
  part([.06,.10,.06,.31,.47,.94],'carved'),
  part([.31,.10,.06,.94,.47,.31],'carved'),
  part([.045,.44,.045,.34,.53,.96],'limestone'),
  part([.34,.44,.045,.96,.53,.34],'limestone'),
  part([.09,.53,.08,.28,.56,.92],'chalk'),
  part([.29,.53,.08,.92,.56,.28],'chalk'),
  part([.20,.08,.08,.34,.16,.88],'mortar',{collision:false}),
  part([.27,.09,.26,.86,.15,.35],'mortar',{collision:false}),
  part([.055,.24,.055,.31,.27,.91],'basaltEdge',{collision:false}),
  part([.31,.24,.055,.93,.27,.31],'basaltEdge',{collision:false})
];
for(const x of [.07,.26,.45,.64,.83]){
  rim.push(part([x,.18,.055,Math.min(.95,x+.07),.22,.07],'drySand',{collision:false}));
}
for(const z of [.40,.61,.81]){
  rim.push(part([.055,.18,z,.07,.22,Math.min(.93,z+.06)],'drySand',{collision:false}));
}
// 179 — unique cantilever well-roof EAVE BRACKET, not a generic roof tile:
// supporting wall face at +Z, small carved timber corbels, roof slats,
// a low ridge hook for future hanging rope, and two dropped finials.
// It never creates a full roof, and does not duplicate Pack 3 roof shingles.
const roof=[
  part([.08,.66,.82,.92,.78,.96],'oakShade'),
  part([.11,.68,.12,.21,.82,.90],'oak'),
  part([.79,.68,.12,.89,.82,.90],'oak'),
  part([.13,.81,.17,.87,.87,.87],'oakTrim'),
  part([.17,.87,.22,.83,.94,.81],'oakShade'),
  part([.15,.78,.12,.85,.84,.22],'oak'),
  part([.15,.78,.77,.85,.84,.87],'oak'),
  part([.40,.72,.36,.60,.87,.53],'oakTrim'),
  part([.45,.70,.43,.55,.77,.51],'brass',{collision:false}),
  part([.465,.62,.45,.535,.71,.49],'iron',{collision:false})
];
for(let i=0;i<5;i++){
 const z=.19+i*.145;
 roof.push(part([.17,.86+(i%2)*.012,z,.83,.90+(i%2)*.012,z+.085],
   i%2?'rustCopper':'oxidizedCopper'));
}
for(const x of [.11,.79]){
 roof.push(part([x,.60,.15,x+.10,.70,.27],'carved'));
 roof.push(part([x,.55,.20,x+.07,.61,.27],'gilt',{collision:false}));
}
// 180 — standalone WALL pulley wheel segment, physical octagonal spoke ring
// with empty gaps, axle and mounting plate, no working mechanical rope.
const pulley=[
 part([.42,.35,.88,.58,.80,.96],'oakShade'),
 part([.46,.62,.31,.54,.70,.90],'iron'),
 part([.39,.59,.27,.61,.73,.34],'brass'),
 part([.475,.63,.21,.525,.69,.27],'iron'),
 part([.475,.24,.35,.525,.49,.41],'oakTrim',{collision:false}),
 part([.475,.14,.36,.525,.25,.40],'burgundy',{collision:false}),
 part([.33,.54,.30,.67,.58,.34],'brass'),
 part([.35,.49,.30,.39,.72,.34],'rustCopper')
];
for(let i=0;i<12;i++){
 const angle=2*Math.PI*i/12;
 const x=.50+Math.cos(angle)*.235;
 const y=.66+Math.sin(angle)*.235;
 const dx=.037,dy=.037;
 pulley.push(part([x-dx,y-dy,.235,x+dx,y+dy,.315],
   i%3?'oak':'brass'));
}
for(let i=0;i<4;i++){
 const theta=i*Math.PI/2;
 const x=.5+Math.cos(theta)*.15,y=.66+Math.sin(theta)*.15;
 pulley.push(part([Math.min(.475,x),Math.min(.635,y),.26,
   Math.max(.525,x+.025),Math.max(.685,y+.025),.30],'oakShade'));
}
// 181 — ONE DRY basin fixture corner/spout, not an assembled fountain,
// aqueduct, fluid/water block or operational fluid emitter.
const fountain=[
 part([.08,.09,.08,.92,.18,.92],'basalt'),
 part([.08,.18,.08,.24,.54,.92],'carved'),
 part([.76,.18,.08,.92,.54,.92],'carved'),
 part([.24,.18,.76,.76,.54,.92],'carved'),
 part([.24,.18,.08,.76,.43,.23],'carved'),
 part([.06,.48,.06,.27,.58,.94],'limestone'),
 part([.73,.48,.06,.94,.58,.94],'limestone'),
 part([.27,.48,.73,.73,.58,.94],'limestone'),
 part([.27,.39,.06,.73,.46,.24],'limestone'),
 part([.28,.18,.24,.72,.195,.73],'drySand',{collision:false}),
 part([.38,.56,.72,.62,.83,.87],'oxidizedCopper'),
 part([.44,.68,.67,.56,.77,.76],'brass'),
 part([.47,.63,.57,.53,.68,.71],'iron',{collision:false}),
 part([.47,.60,.50,.53,.65,.57],'jewelTeal',{collision:false}),
 part([.29,.56,.73,.36,.64,.90],'chalk',{collision:false}),
 part([.64,.56,.73,.71,.64,.90],'chalk',{collision:false})
];
for(const x of [.14,.76])for(const z of [.13,.76])
 fountain.push(part([x,.52,z,x+.09,.59,z+.09],'carved'));

export const PACK4_CIVIC_ASSETS=Object.freeze([
 asset({id:176,roster:63,key:'ashen-chimney-course',
 name:'Ashenwatch hollow chimney course',mount:'floor',parts:chimney,
 description:'A single smoke-darkened hollow flue block with four real interior-clear walls, stone quoins and capped rim.',
 engines:{smoke:false}}),
 asset({id:177,roster:64,key:'hearthstone-fireplace',
 name:'Hearthstone open fireplace insert',mount:'wall-face',parts:fireplace,
 description:'Open-front hearth cavity with two solid jambs, a short mantle, ash bed and an iron grate; no functional flame.',
 engines:{fire:false,smoke:false,lighting:false}}),
 asset({id:178,roster:65,key:'wellside-quarter-rim',
 name:'Wellside carved rim quarter',mount:'floor',parts:rim,
 description:'A single L-shaped ninety-degree stone well-rim corner segment, never an entire sealed well.',
 engines:{water:false}}),
 asset({id:179,roster:66,key:'wellhouse-eave-bracket',
 name:'Wellhouse corbel-and-eave roof piece',mount:'wall-face',parts:roof,
 description:'A carved cantilever support, short peaked cover slats, rope hook and pendants, not Pack 3 generic roofing.',
 engines:{animation:false}}),
 asset({id:180,roster:67,key:'brass-pulley-bracket',
 name:'Old brass pulley bracket',mount:'wall-face',parts:pulley,
 description:'One mounted pulley wheel and open-spaced twelve-stud ring with axle, rope tail and independent plate.',
 engines:{animation:false}}),
 asset({id:181,roster:68,key:'dry-fountain-basin',
 name:'Dawnward dry fountain basin segment',mount:'floor',parts:fountain,
 description:'One low carved stone basin fixture with open dry center and ornamental spout, not functioning water.',
 engines:{water:false}})
]);
export function civicAsset(id){return PACK4_CIVIC_ASSETS.find(x=>x.id===id)??null;}
function validateRotation(r){
 if(!Number.isInteger(r)||r<0||r>3)throw RangeError('Pack 4 civic orientation must be 0..3');
}
function turn(b,r){
 let [x0,y0,z0,x1,y1,z1]=b;
 for(let k=0;k<r;k++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
 return [x0,y0,z0,x1,y1,z1].map(v=>Math.round(v*1e6)/1e6);
}
export function civicShape(id,rotation=0){
 validateRotation(rotation);
 const a=civicAsset(id);
 if(!a)throw RangeError('Unknown Pack 4 civic block ID');
 const parts=Object.freeze(a.parts.map(p=>Object.freeze({...p,bounds:Object.freeze(turn(p.bounds,rotation))})));
 return Object.freeze({id,rotation,mount:a.mount,
   occludesWholeCell:false,renderPass:'opaque',visible:parts,
   selection:Object.freeze(parts.filter(p=>p.selection).map(p=>p.bounds)),
   collision:Object.freeze(parts.filter(p=>p.collision).map(p=>p.bounds))});
}
export function civicMountOffset(id,rotation=0){
 validateRotation(rotation);
 const a=civicAsset(id);
 if(!a)throw RangeError('Unknown Pack 4 civic block ID');
 return Object.freeze(a.mount==='floor'?[0,-1,0]:
  [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]][rotation]);
}
export function civicSaveState(id,rotation=0){
 civicShape(id,rotation);return Object.freeze({id,rotation});
}
export function restoreCivicSaveState(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||
   !Object.hasOwn(s,'id')||!Object.hasOwn(s,'rotation'))
  throw TypeError('Invalid Pack 4 civic cell state');
 return civicSaveState(s.id,s.rotation);
}
const faces=[
 {n:[1,0,0],l:.82,q:b=>[[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]],[b[3],b[1],b[5]]]},
 {n:[-1,0,0],l:.73,q:b=>[[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]],[b[0],b[1],b[2]]]},
 {n:[0,1,0],l:1,q:b=>[[b[0],b[4],b[5]],[b[3],b[4],b[5]],[b[3],b[4],b[2]],[b[0],b[4],b[2]]]},
 {n:[0,-1,0],l:.56,q:b=>[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]],[b[0],b[1],b[5]]]},
 {n:[0,0,1],l:.9,q:b=>[[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]],[b[0],b[1],b[5]]]},
 {n:[0,0,-1],l:.79,q:b=>[[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]],[b[3],b[1],b[2]]]}
];
export function civicPreviewMesh(id,rotation=0){
 const s=civicShape(id,rotation);
 const opaque=[];
 for(const p of s.visible){
  const c=pigment[p.material];
  for(const face of faces){
   const q=face.q(p.bounds);
   for(const i of [0,1,2,0,2,3])
    opaque.push(...q[i],...face.n,c[0]*face.l,c[1]*face.l,c[2]*face.l,c[3]);
  }
 }
 return Object.freeze({opaque:new Float32Array(opaque),translucent:new Float32Array(0),
  stride:PACK4_CIVIC_STRIDE,note:'Physical candidate preview. No fire, smoke or water simulations.'});
}
