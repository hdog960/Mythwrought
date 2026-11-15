// M5 #067–070 individually selectable ruin fragments. Candidate-only, no world placement.
const raw=[
 {ordinal:67,name:'Eroded wall capstones',kind:'weather-scoured-overhang',hardness:5,attachment:'ground',palette:['#42464a','#77766e','#aca392','#d2c5ab','#6c8075'],boxes:[[.05,.08,.11,.95,.29,.89],[.02,.29,.05,.98,.44,.95],[.09,.44,.12,.87,.55,.84],[.15,.55,.18,.71,.64,.78],[.72,.08,.18,.91,.29,.51]]},
 {ordinal:68,name:'Masonry rubble clusters',kind:'dislocated-masonry-shards',hardness:4,attachment:'ground',palette:['#343c43','#6d6e6b','#a49a8b','#c5b69c','#766c61'],boxes:[[.04,.02,.08,.35,.29,.43],[.39,.01,.13,.84,.21,.48],[.18,.03,.56,.55,.44,.92],[.65,.02,.54,.96,.33,.89],[.48,.21,.25,.69,.48,.52],[.1,.29,.65,.34,.55,.83]]},
 {ordinal:69,name:'Angular debris wedges',kind:'sheared-wedge-fragments',hardness:4,attachment:'ground',palette:['#363a44','#6b7177','#aaa394','#d0c0a7','#806e62'],boxes:[[.03,.01,.12,.91,.13,.91],[.07,.13,.19,.76,.28,.79],[.14,.28,.25,.57,.43,.68],[.22,.43,.32,.42,.58,.56],[.71,.01,.16,.96,.19,.45]]},
 {ordinal:70,name:'Root-penetrated ruin joints',kind:'root-split-masonry-seam',hardness:5,attachment:'ground',palette:['#343f43','#747b75','#ada796','#d0c4a9','#71563f','#9a8057'],boxes:[[.04,.01,.06,.43,.83,.94],[.57,.01,.06,.96,.79,.94],[.39,.01,.35,.61,.22,.63],[.42,.22,.41,.58,.61,.57],[.34,.61,.42,.51,.94,.54],[.51,.58,.45,.69,.76,.57]]}
];
export const ANCIENT_RUIN_FRAGMENTS=Object.freeze(raw.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function fragmentBoxes(asset,rotation=0){
 if(!ANCIENT_RUIN_FRAGMENTS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid fragment or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function fragmentMaterial(asset,x,y,z,face=0){
 if(!ANCIENT_RUIN_FRAGMENTS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+29,19349663)^Math.imul(z+17,83492791)^Math.imul(face+7,2654435761))>>>0;
 return asset.palette[(h>>>5)%asset.palette.length];
}
export function fragmentMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of fragmentBoxes(asset,rotation))for(const f of faces){const s=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(s,s+1,s+2,s,s+2,s+3);}
 return {vertices,indices}; // Isolated fixture, not live renderer.
}
export function fragmentEditFixture(asset,rotation=0){
 fragmentBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
