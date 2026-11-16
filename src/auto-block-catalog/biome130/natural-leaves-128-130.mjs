// Issue #117 M11. Three independent, opt-in natural foliage cells; never world-populated.
const entries=[
 {ordinal:128,name:'Redwood needle whorls',profile:'radial layered short-needle whorls on stout twig',palette:['#183f34','#2a6046','#467c56','#71966a'],stem:[.46,.12,.46,.54,.92,.54],lobes:[[.10,.25,.40,.90,.33,.60],[.18,.43,.14,.82,.52,.86],[.08,.62,.43,.92,.70,.57],[.28,.75,.17,.72,.84,.83]],density:.90},
 {ordinal:129,name:'Blackwood thornleaf canopies',profile:'stiff asymmetrical spear-leaf clusters with exposed thorn tips',palette:['#172b28','#294238','#405b43','#64704c'],stem:[.45,.08,.45,.55,.89,.55],lobes:[[.05,.34,.35,.41,.46,.64],[.60,.47,.17,.97,.58,.49],[.19,.57,.62,.43,.70,.97],[.55,.19,.55,.84,.32,.86],[.38,.77,.08,.62,.96,.41]],density:.74},
 {ordinal:130,name:'Moonwillow silverleaf curtains',profile:'long cascading separated silverleaf strands with luminous pale tips',palette:['#416b65','#6c9c90','#9fc4ae','#d2e4ce'],stem:[.46,.67,.46,.54,.99,.54],lobes:[[.08,.10,.13,.22,.87,.26],[.29,.04,.42,.42,.92,.57],[.57,.08,.19,.70,.89,.34],[.78,.12,.59,.91,.94,.75],[.34,.24,.72,.48,.84,.89]],density:.57}
];
const freezeBoxes=arr=>Object.freeze(arr.map(b=>Object.freeze([...b])));
export const NATURAL_LEAVES_128_130=Object.freeze(entries.map(e=>Object.freeze({...e,
 symbolicId:'biome130:'+String(e.ordinal).padStart(3,'0'),futureOnlyId:255+e.ordinal,
 selectable:true,replaceable:true,solid:false,collision:'none',selection:'occupied-boxes',
 attachment:'wood-face',rotationCount:4,transparent:true,alpha:'cutout',
 stem:Object.freeze([...e.stem]),lobes:freezeBoxes(e.lobes),palette:Object.freeze([...e.palette])
})));
const requireFamily=a=>{if(!NATURAL_LEAVES_128_130.includes(a))throw new TypeError('unknown leaf family');};
const requireRotation=r=>{if(!Number.isInteger(r)||r<0||r>3)throw new RangeError('rotation 0..3');};
function rotateBox(box,r){let [x,y,z,X,Y,Z]=box;for(let i=0;i<r;i++)[x,z,X,Z]=[1-Z,x,1-z,X];return [x,y,z,X,Y,Z];}
export function leafBoxes(a,r=0){requireFamily(a);requireRotation(r);return [a.stem,...a.lobes].map(b=>rotateBox(b,r));}
export function leafMaterial(a,x,y,z,face=0){requireFamily(a);
 if(![x,y,z,face].every(Number.isInteger))throw new TypeError('integer sample required');
 const h=(Math.imul(x+a.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+17,2654435761))>>>0;
 return {color:a.palette[h%a.palette.length],visible:h%1000<Math.round(a.density*1000)};
}
export function leafMesh(a,r=0){const vertices=[],indices=[];
 for(const [x,y,z,X,Y,Z] of leafBoxes(a,r)){
  const p=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
  for(const face of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){
   const start=vertices.length/3;for(const i of face)vertices.push(...p[i]);
   indices.push(start,start+1,start+2,start,start+2,start+3);
  }
 }
 return {vertices,indices,alphaMode:a.alpha,collision:a.collision};
}
// Symbolic opt-in edit/save fixture only; never touches production world or schema-1.
export function leafEditFixture(a,r=0){leafBoxes(a,r);
 const cells=new Map([['2,3,4',{symbolicId:a.symbolicId,rotation:r}]]);
 const saved=JSON.stringify([...cells]);const restored=new Map(JSON.parse(saved));
 const selected=restored.get('2,3,4');restored.delete('2,3,4');
 return {saved,selected,removed:!restored.has('2,3,4')};
}
