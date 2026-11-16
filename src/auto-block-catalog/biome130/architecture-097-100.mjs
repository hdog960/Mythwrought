// :12 M8 physical biome architecture #097–100; isolated symbolic candidates only.
const raw=[
 {ordinal:97,name:'Rune-inlaid glade cornerstones',kind:'root-gripped-rune-cut-glade-corner',palette:['#586b57','#8b9a75','#b4c29b','#6c8b91','#c3d4ad'],attachment:'ground',hardness:5,boxes:[[.03,.02,.03,.94,.32,.94],[.05,.32,.06,.31,.94,.93],[.31,.32,.05,.93,.94,.31],[.29,.32,.29,.51,.81,.51],[.55,.32,.55,.76,.65,.77],[.06,.82,.32,.3,.94,.69],[.35,.85,.06,.7,.94,.29]]},
 {ordinal:98,name:'Mountain cliff-anchor fittings',kind:'rock-biting-offset-anchor-claws',palette:['#535c63','#88939a','#b5a995','#596a70','#c2c8c7'],attachment:'wall',hardness:6,boxes:[[.06,.18,.12,.94,.82,.37],[.14,.08,.37,.34,.92,.86],[.66,.08,.37,.86,.92,.86],[.31,.35,.37,.69,.65,.72],[.05,.02,.1,.24,.2,.49],[.76,.8,.1,.95,.98,.49],[.4,.22,.72,.6,.78,.96]]},
 {ordinal:99,name:'Alpine shelter wall modules',kind:'wind-shedding-layered-alpine-shell',palette:['#667b7b','#b1c0b6','#d8dfd0','#7f918c','#a8a38e'],attachment:'ground',hardness:4,boxes:[[.04,.03,.12,.96,.96,.85],[.02,.04,.03,.98,.24,.14],[.02,.77,.04,.98,.96,.18],[.1,.27,.04,.24,.74,.14],[.76,.27,.04,.9,.74,.14],[.12,.35,.84,.88,.44,.97],[.12,.65,.84,.88,.74,.97]]},
 {ordinal:100,name:'Volcanic heat-vent tiles',kind:'basalt-rimmed-open-geothermal-vent',palette:['#272a30','#5a4944','#a46a48','#d18b51','#43434a'],attachment:'ground',hardness:5,boxes:[[.02,.02,.02,.98,.2,.23],[.02,.02,.77,.98,.2,.98],[.02,.02,.23,.22,.2,.77],[.78,.02,.23,.98,.2,.77],[.28,.03,.24,.4,.12,.76],[.6,.03,.24,.72,.12,.76],[.23,.02,.02,.77,.28,.13],[.23,.02,.87,.77,.28,.98]]}
];
export const BIOME_ARCHITECTURE_097_100=Object.freeze(raw.map(d=>Object.freeze({...d,
 symbolicId:'biome130:'+String(d.ordinal).padStart(3,'0'),futureOnlyId:255+d.ordinal,
 selectable:true,replaceable:true,solid:true,collision:'occupied',rotationCount:4,opacity:1,
 boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)
})));
export function rotatedBoxes(asset,rotation=0){
 if(!BIOME_ARCHITECTURE_097_100.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('unknown asset or rotation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function materialSample(asset,x,y,z,face=0){
 if(!BIOME_ARCHITECTURE_097_100.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const hash=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+asset.ordinal,2654435761))>>>0;
 return asset.palette[hash%asset.palette.length];
}
export function physicalMesh(asset,rotation=0){
 const vertices=[],indices=[];
 for(const b of rotatedBoxes(asset,rotation)){
  const c=[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[0],b[4],b[2]],[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]];
  for(const f of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){
   const start=vertices.length/3;for(const i of f)vertices.push(...c[i]);indices.push(start,start+1,start+2,start,start+2,start+3];
  }
 }
 return {vertices,indices};
}
// Local symbolic test fixture only, never production save schema or numeric ID.
export function editFixture(asset,rotation=0){
 rotatedBoxes(asset,rotation);
 const placed=new Map([['2,3,4',{symbolicId:asset.symbolicId,rotation}]]);
 const saved=JSON.stringify([...placed]),restored=new Map(JSON.parse(saved));
 const selected=restored.get('2,3,4');restored.delete('2,3,4');
 return {saved,selected,removed:!restored.has('2,3,4')};
}
