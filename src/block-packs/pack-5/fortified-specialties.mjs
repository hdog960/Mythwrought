/** Pack 5 M5 ORIGINAL physically authored construction candidates; not runtime registry/logic. */
import {validatePhysicalDescriptor,rotateLocalBox,rotateCellOffset} from './fixture.mjs';
const b=(x0,y0,z0,x1,y1,z1,material)=>({box:[x0,y0,z0,x1,y1,z1],material});
export const SPECIALTY_PALETTE=Object.freeze({
  oak:[.52,.30,.18,1],ebony:[.26,.19,.18,1],cedar:[.68,.43,.27,1],iron:[.34,.38,.42,1],
  steel:[.53,.59,.63,1],bronze:[.77,.57,.28,1],gold:[.88,.71,.38,1],stone:[.67,.64,.58,1],
  soot:[.21,.23,.25,1],linen:[.89,.80,.60,1],jade:[.29,.58,.51,1],crystal:[.55,.74,.89,1],
  ruby:[.73,.31,.30,1],waterless:[.23,.25,.25,1]
});
function physical(symbolicId,name,variant,attachment,records){
  const parts=records.map(p=>({cell:[...p.cell],boxes:p.art.map(x=>[...x.box]),collisionBoxes:p.art.map(x=>[...x.box])}));
  const d={symbolicId,name,variant,attachment,parts,
    art:records.map(p=>({cell:[...p.cell],details:p.art.map(x=>({box:[...x.box],material:x.material}))})),
    integrated:false,numericId:undefined,sourceOnly:true,opening:false,lighting:false,water:false,inventory:false,animals:false};
  validatePhysicalDescriptor(d);
  if(parts.some(p=>p.boxes.length>64))throw Error('Excessive physical boxes per voxel');
  return d;
}
function heavyGate(variant){
  if(!['citadel-ironbound-leaves','falling-portcullis-grille'].includes(variant))throw Error('Unknown heavy gate candidate');
  const barred=variant==='falling-portcullis-grille',records=[];
  for(let i=0;i<2;i++){
    const a=[];
    // Two actual occupied side-by-side floor cells, not a wall-painted gate texture.
    for(const x of [.055,.875])a.push(b(x,.04,.29,x+.07,.98,.73,barred?'steel':'ebony'));
    a.push(b(.045,.06,.23,.955,.14,.81,barred?'stone':'oak'));
    a.push(b(.045,.91,.23,.955,.99,.81,barred?'steel':'ebony'));
    if(barred){
      // Open bar slots are actual empty air; vertical spiked steel and two crossmembers.
      for(let k=0;k<5;k++){
        const x=.105+k*.185;
        a.push(b(x,.15,.44,x+.052,.84,.57,'iron'));
        a.push(b(x-.012,.84,.43,x+.066,.92,.58,'steel'));
        a.push(b(x+.01,.86,.41,x+.042,.985,.59,'steel'));
      }
      for(const y of [.28,.64])a.push(b(.07,y,.43,.94,y+.057,.58,'bronze'));
      a.push(b(.07,.14,.40,.93,.19,.61,'soot'));
    }else{
      // Massive overlapping timber leaves, actual physical plank grain/reinforcing hardware.
      for(let k=0;k<5;k++){
        const x=.07+k*.177;
        a.push(b(x,.13,.39,x+.156,.90,.64,k%2?'cedar':'oak'));
        a.push(b(x+.06,.13,.64,x+.087,.90,.675,'ebony'));
      }
      for(const y of [.20,.69]){
        a.push(b(.05,y,.32,.95,y+.078,.72,'iron'));
        for(const x of [.15,.43,.73])a.push(b(x,y+.025,.72,x+.047,y+.064,.756,'bronze'));
      }
      // Opposing solid meeting-edge hinges and central lock/rivets.
      if(i===0)a.push(b(.855,.46,.70,.96,.58,.77,'steel'));
      else a.push(b(.04,.46,.70,.16,.58,.77,'steel'));
    }
    records.push({cell:[i,0,0],art:a});
  }
  return physical('pack5:094','Heavy Gates & Portcullis Panels',variant,'floor',records);
}
function chandelier(variant){
  if(!['suncrown-eightarm','prismatic-starrack'].includes(variant))throw Error('Unknown chandelier candidate');
  const crystal=variant==='prismatic-starrack',a=[];
  // Ceiling hung from the actual block directly ABOVE the candidate anchor.
  a.push(b(.45,.79,.45,.55,1,.55,crystal?'steel':'bronze'));
  for(const y of [.80,.91])a.push(b(.40,y,.40,.60,y+.035,.60,'gold'));
  a.push(b(.455,.40,.455,.545,.81,.545,'iron'));
  if(crystal){
    // Distinct branching radial crystal suspension with real glass-like geometry, no light emitters.
    for(const x of [.19,.73])for(const z of [.19,.73]){
      a.push(b(Math.min(x,.45),.39,z+.029,Math.max(x+.075,.55),.445,z+.07,'steel'));
      a.push(b(x,.28,z,x+.09,.40,z+.09,'jade'));
      a.push(b(x+.021,.14,z+.021,x+.069,.30,z+.069,'crystal'));
    }
    a.push(b(.23,.36,.455,.77,.425,.545,'bronze'));
    a.push(b(.455,.36,.23,.545,.425,.77,'bronze'));
    a.push(b(.41,.13,.41,.59,.24,.59,'ruby'));
  }else{
    // Two nested open square halos, individually solid arms and eight unlit candle sockets.
    for(const [min,max,y] of [[.20,.80,.36],[.31,.69,.29]]){
      a.push(b(min,y,min,max,y+.055,min+.055,'bronze'));
      a.push(b(min,y,max-.055,max,y+.055,max,'bronze'));
      a.push(b(min,y,min+.055,min+.055,y+.055,max-.055,'bronze'));
      a.push(b(max-.055,y,min+.055,max,y+.055,max-.055,'bronze'));
    }
    // Eight individual unlit candle arms: four corners and four mid-side
    // positions around the outer halo (a true eight-arm crown, not six).
    const sockets=[[.205,.205],[.47,.205],[.735,.205],
      [.205,.47],[.735,.47],
      [.205,.735],[.47,.735],[.735,.735]];
    for(const [x,z] of sockets){
      a.push(b(x,.36,z,x+.061,.43,z+.061,'gold'));
      a.push(b(x+.016,.43,z+.016,x+.046,.52,z+.046,'linen'));
    }
    a.push(b(.37,.27,.37,.63,.32,.63,'ebony'));
  }
  return physical('pack5:095','Chandeliers',variant,'ceiling',[{cell:[0,0,0],art:a}]);
}
function stable(variant){
  if(!['oak-stall-divider','stone-feed-trough'].includes(variant))throw Error('Unknown stable candidate');
  if(variant==='oak-stall-divider'){
    const cells=[];
    for(let i=0;i<2;i++){
      const a=[];
      for(const z of [.075,.845]){
        a.push(b(.40,.04,z,.60,.94,z+.08,'oak'));
        a.push(b(.38,.055,z-.01,.62,.11,z+.09,'iron'));
        a.push(b(.38,.82,z-.01,.62,.88,z+.09,'bronze'));
      }
      for(const y of [.30,.58,.78]){
        a.push(b(.435,y,.14,.565,y+.065,.86,'cedar'));
        a.push(b(.42,y+.012,.135,.58,y+.038,.19,'bronze'));
      }
      // Stable-specific lower kickboard: opaque body below the upper open rails,
      // different from Pack 2's low open outdoor fence. Hoof clearance stays near ground.
      for(let n=0;n<3;n++){
        const z0=.16+n*.22;
        a.push(b(.42,.13,z0,.58,.405,z0+.21,n%2?'cedar':'oak'));
        a.push(b(.40,.16,z0+.198,.60,.35,z0+.214,'iron'));
      }
      // A reinforced diagonal approximation on the stall-facing side, independent segments.
      for(let n=0;n<3;n++){
        const z0=.19+n*.19, y0=.38+n*.12;
        a.push(b(.405,y0,z0,.45,y0+.13,z0+.075,'bronze'));
      }
      a.push(b(.405,.13,.09,.595,.24,.18,'ebony'));
      cells.push({cell:[0,0,i],art:a});
    }
    return physical('pack5:096','Stable Stall Partitions & Troughs',variant,'floor',cells);
  }
  const a=[];
  // A real dry feeding trough, open middle, supported base with low lip and side grain.
  a.push(b(.16,.065,.16,.84,.15,.84,'stone'));
  for(const x of [.16,.735]){
    a.push(b(x,.15,.16,x+.105,.63,.84,'stone'));
    a.push(b(x-.015,.60,.145,x+.12,.67,.855,'bronze'));
  }
  for(const z of [.16,.735]){
    a.push(b(.265,.15,z,.735,.63,z+.105,'stone'));
    a.push(b(.245,.60,z-.015,.755,.67,z+.12,'bronze'));
  }
  for(const x of [.19,.735])for(const z of [.19,.735])a.push(b(x,.025,z,x+.073,.17,z+.073,'oak'));
  a.push(b(.27,.13,.27,.73,.18,.73,'waterless'));
  // Wooden trough weatherboards, visible over the pale masonry face: not a well or block tub.
  for(const z of [.20,.37,.54,.71]){
    a.push(b(.11,.245,z,.19,.36,z+.12,'cedar'));
    a.push(b(.81,.245,z,.89,.36,z+.12,'cedar'));
    a.push(b(.17,.245,z,.21,.29,z+.07,'bronze'));
  }
  for(const z of [.19,.72]){
    a.push(b(.12,.42,z,.88,.46,z+.065,'oak'));
    a.push(b(.12,.50,z,.88,.545,z+.06,'iron'));
  }
  for(const x of [.23,.72]){
    a.push(b(x,.60,.11,x+.05,.69,.18,'bronze'));
    a.push(b(x,.60,.82,x+.05,.69,.89,'bronze'));
  }
  return physical('pack5:096','Stable Stall Partitions & Troughs',variant,'floor',[{cell:[0,0,0],art:a}]);
}
export const SPECIALTY_VARIANTS=Object.freeze({
 'pack5:094':['citadel-ironbound-leaves','falling-portcullis-grille'],
 'pack5:095':['suncrown-eightarm','prismatic-starrack'],
 'pack5:096':['oak-stall-divider','stone-feed-trough']
});
const factory={'pack5:094':heavyGate,'pack5:095':chandelier,'pack5:096':stable};
export function getSpecialtyFixture(id,variant){
 if(!Object.hasOwn(factory,id)||!SPECIALTY_VARIANTS[id].includes(variant))throw Error('Unknown M5 specialty identity');
 return factory[id](variant);
}
export const SPECIALTY_FIXTURES=Object.freeze(Object.entries(SPECIALTY_VARIANTS).flatMap(([id,vs])=>vs.map(v=>getSpecialtyFixture(id,v))));
export const SPECIALTY_FAMILIES=Object.freeze(Object.keys(SPECIALTY_VARIANTS).map(id=>{
 const variants=SPECIALTY_VARIANTS[id].map(v=>getSpecialtyFixture(id,v));
 return {...variants[0],variants:variants.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))};
}));
const faces=[
 [[1,0,0],[1,1,0],[1,1,1],[1,0,1]],[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
 [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
 [[1,0,1],[1,1,1],[0,1,1],[0,0,1]],[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
];
export function specialtyBoxMesh(d,{rotation=0}={}){
 validatePhysicalDescriptor(d);if(!Number.isInteger(rotation)||rotation<0||rotation>3||!Array.isArray(d.art)||d.art.length!==d.parts.length)throw Error('Bad specialty preview rotation/descriptor');
 const positions=[],colors=[],indices=[];let v=0;
 for(const part of d.art){const offset=rotateCellOffset(part.cell,rotation);
  for(const detail of part.details){const box=rotateLocalBox(detail.box,rotation),c=SPECIALTY_PALETTE[detail.material];if(!c)throw Error('Missing specialty palette');
   for(const face of faces){for(const q of face){positions.push((q[0]?box[3]:box[0])+offset[0],(q[1]?box[4]:box[1])+offset[1],(q[2]?box[5]:box[2])+offset[2]);colors.push(...c)}
    indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;}
  }
 }
 if(v>6144)throw Error('M5 candidate preview vertex budget');
 return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices:new Uint16Array(indices),vertexCount:v,triangles:indices.length/3};
}
