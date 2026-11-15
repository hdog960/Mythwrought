// M3 physical enchanted flora #040-042. Isolated candidate data; no live block registration.
const specs=[
 {ordinal:40,name:'Faelight crystal clusters',kind:'crystal',seed:40019,attachment:'ground',solid:true,opacity:'translucent',emissive:.72,palette:['#173d51','#368a9b','#74e6dc','#c7fff0'],boxes:[[.18,0,.19,.45,.68,.45],[.46,0,.32,.73,.94,.6],[.31,0,.64,.55,.54,.87],[.71,0,.63,.88,.37,.84]]},
 {ordinal:41,name:'Luminous seed pods',kind:'pod',seed:41021,attachment:'ground',solid:false,opacity:'cutout',emissive:.46,palette:['#264d36','#52946c','#d6bd73','#f7e7a4'],boxes:[[.43,0,.43,.57,.53,.57],[.22,.4,.26,.49,.75,.55],[.51,.46,.43,.82,.89,.75],[.33,.2,.58,.6,.51,.85]]},
 {ordinal:42,name:'Arcane thorn growth',kind:'thorn',seed:42043,attachment:'wall',solid:false,opacity:'cutout',emissive:.18,palette:['#283744','#53627a','#a279b2','#d2b4de'],boxes:[[.09,.1,.41,.26,.81,.59],[.25,.38,.43,.56,.53,.57],[.52,.28,.42,.72,.72,.58],[.69,.61,.43,.93,.87,.57]]}
];
export const ENCHANTED_FLORA=Object.freeze(specs.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,collision:s.solid?'occupied':'none',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette)})));
export function floraBoxes(asset,rotation=0){
 if(!ENCHANTED_FLORA.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid asset or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function floraMaterial(asset,x,y,z,face=0){
 if(!ENCHANTED_FLORA.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const h=(Math.imul(x^asset.seed,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function floraMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of floraBoxes(asset,rotation))for(const face of faces){const start=vertices.length/3;for(const p of face)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Prototype unculled box mesh, not runtime performance certification.
}
export function floraEditFixture(asset,rotation=0){
 floraBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
