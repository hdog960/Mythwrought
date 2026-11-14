/** Pack 5 M1 candidate surfaces. Source-only; never registers gameplay block IDs. */
import {validatePhysicalDescriptor,rotateLocalBox} from './fixture.mjs';
const b=(x0,y0,z0,x1,y1,z1,material)=>({box:[x0,y0,z0,x1,y1,z1],material});
const MAT=Object.freeze({
  lime:[0.89,0.86,0.74,1],chalk:[0.97,0.95,0.85,1],pearl:[0.82,0.87,0.82,1],sage:[0.55,0.67,0.57,1],
  terra:[0.69,0.30,0.21,1],baked:[0.79,0.43,0.30,1],burnt:[0.43,0.20,0.20,1],mortar:[0.71,0.59,0.47,1],
  cream:[0.89,0.81,0.60,1],teal:[0.18,0.48,0.51,1],gold:[0.80,0.60,0.26,1],ink:[0.23,0.35,0.48,1],
  grout:[0.43,0.46,0.43,1],glaze:[0.63,0.77,0.76,1]
});
export const PACK5_SURFACE_MATERIALS=MAT;
function makeParts(art,collision){
  if(art.length>64)throw Error('Surface exceeds 64 physical details');
  return [{cell:[0,0,0],boxes:art.map(x=>x.box),collisionBoxes:collision}];
}
function desc(id,name,attachment,variant,art,collision){
  const d={symbolicId:id,name,attachment,variant,parts:makeParts(art,collision),art:art.map(x=>({box:[...x.box],material:x.material})),
    numericId:undefined,integrated:false,authoring:'pack5-authored-voxel-boxes'};
  validatePhysicalDescriptor(d);return d;
}
// +Z is visible plaster face; -Z is required wall backing. All detail has positive, real volume.
const plaster=(kind)=>{
  let art=[b(.025,.025,.025,.975,.975,.105,'lime')];
  if(kind==='chalk-lime'){
    art.push(b(.055,.075,.105,.945,.945,.118,'chalk'));
    for(const y of [.12,.32,.54,.77])art.push(b(.09,y,.118,.35,y+.012,.127,'pearl'));
    art.push(b(.04,.04,.118,.96,.09,.141,'pearl'),b(.04,.91,.118,.96,.955,.141,'pearl'));
  }else if(kind==='hand-troweled'){
    art.push(b(.04,.055,.105,.96,.945,.128,'cream'));
    for(let i=0;i<8;i++){
      const y=.1+i*.105;
      art.push(b(i%2?.15:.09,y,.128,i%2?.87:.80,y+.024,.144,i%2?'chalk':'lime'));
    }
    art.push(b(.07,.07,.144,.09,.92,.164,'sage'),b(.91,.07,.144,.93,.92,.164,'sage'));
  }else throw Error('Unknown stucco variant');
  return desc('pack5:079','Plaster & Stucco','wall',kind,art,[[.025,.025,.025,.975,.975,kind==='chalk-lime'?.141:.164]]);
};
function brick(kind){
  const art=[b(0,0,0,1,1,.895,'mortar'),b(0,0,.895,1,1,.91,'mortar')];
  if(kind==='hearth-running-bond'){
    for(let r=0;r<5;r++){
      const y=.02+r*.198,offset=r%2?.24:0;
      for(let col=-1;col<4;col++){
        const x0=Math.max(.018,col*.48+offset+.014),x1=Math.min(.982,(col+1)*.48+offset-.017);
        if(x1-x0>.075)art.push(b(x0,y,.91,x1,y+.17,1,r%3===0?'baked':col%2?'terra':'burnt'));
      }
    }
    art.push(b(.055,.045,0,.945,.10,.028,'burnt'));
  }else if(kind==='kiln-soldier-course'){
    for(let col=0;col<8;col++){
      const x=.012+col*.123;
      art.push(b(x,.58,.91,x+.105,.985,1,col%3===0?'burnt':col%2?'baked':'terra'));
    }
    for(let row=0;row<3;row++)for(let col=0;col<3;col++){
      const x=.025+col*.325+(row%2?.04:0),y=.035+row*.174;
      art.push(b(x,y,.91,Math.min(.975,x+.278),y+.148,1,(row+col)%2?'terra':'baked'));
    }
    art.push(b(.01,.535,.91,.99,.563,.985,'cream'));
  }else throw Error('Unknown brick variant');
  // The interior is a solid manufactured wall core; the modeled courses are true face relief.
  return desc('pack5:080','Fired Brick Masonry','none',kind,art,[[0,0,0,1,1,1]]);
}
function tiles(kind){
  const art=[b(0,.015,0,1,.095,1,'grout')];
  if(kind==='sunburst-encaustic'){
    for(let x=0;x<2;x++)for(let z=0;z<2;z++){
      let ox=x*.5,oz=z*.5;
      art.push(b(ox+.026,.095,oz+.026,ox+.474,.125,oz+.474,'cream'));
      art.push(b(ox+.15,.125,oz+.15,ox+.35,.137,oz+.35,'gold'));
      art.push(b(ox+.222,.137,oz+.10,ox+.278,.15,oz+.40,'terra'));
      art.push(b(ox+.10,.137,oz+.222,ox+.40,.15,oz+.278,'terra'));
    }
  }else if(kind==='moonwoven-glaze'){
    for(let x=0;x<3;x++)for(let z=0;z<3;z++){
      let ox=x/3,oz=z/3;
      art.push(b(ox+.013,.095,oz+.013,ox+1/3-.013,.113,oz+1/3-.013,(x+z)%2?'teal':'glaze'));
      if((x+z)%2===0)art.push(b(ox+.095,.113,oz+.095,ox+.238,.128,oz+.238,'ink'));
    }
  }else throw Error('Unknown ceramic floor variant');
  // Walkable thin coverage: bounded thickness, not a pretend one-meter cube.
  return desc('pack5:081','Ceramic Interior Floor Tiles','floor',kind,art,[[0,.015,0,1,kind==='sunburst-encaustic'?.15:.128,1]]);
}
export const PACK5_SURFACE_VARIANTS=Object.freeze({
 'pack5:079':['chalk-lime','hand-troweled'],
 'pack5:080':['hearth-running-bond','kiln-soldier-course'],
 'pack5:081':['sunburst-encaustic','moonwoven-glaze']
});
const factories={'pack5:079':plaster,'pack5:080':brick,'pack5:081':tiles};
export function getPack5Surface(symbolicId,variant){
  if(!Object.hasOwn(factories,symbolicId)||!PACK5_SURFACE_VARIANTS[symbolicId].includes(variant))throw Error('Unknown surface identity or variant');
  return factories[symbolicId](variant);
}
export const PACK5_SURFACES=Object.freeze(Object.entries(PACK5_SURFACE_VARIANTS).flatMap(([id,variants])=>variants.map(v=>getPack5Surface(id,v))));
export const PACK5_SURFACE_FAMILIES=Object.freeze(Object.keys(PACK5_SURFACE_VARIANTS).map(id=>{
  const variants=PACK5_SURFACE_VARIANTS[id].map(v=>getPack5Surface(id,v));
  return {...variants[0],variants:variants.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))};
}));

/** Immutable, bounded color-indexed triangles from authored physical boxes; preview only. */
export function surfaceBoxMesh(descriptor,{rotation=0}={}){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid mesh rotation');
  validatePhysicalDescriptor(descriptor);
  if(!Array.isArray(descriptor.art)||descriptor.art.length!==descriptor.parts[0].boxes.length)throw Error('Invalid surface artwork');
  const faces=[
   [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], [[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
   [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], [[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
   [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
  ];
  const p=[],color=[],indices=[];let v=0;
  for(const part of descriptor.art){
    const [x0,y0,z0,x1,y1,z1]=rotateLocalBox(part.box,rotation),c=MAT[part.material];if(!c)throw Error('Unknown physical material');
    for(const quad of faces){
      for(const vertex of quad){p.push(vertex[0]?x1:x0,vertex[1]?y1:y0,vertex[2]?z1:z0);color.push(...c);}
      indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;
    }
  }
  if(v>1536)throw Error('Mobile budget exceeded');
  return {positions:new Float32Array(p),colors:new Float32Array(color),indices:new Uint16Array(indices),vertexCount:v,triangles:indices.length/3};
}
