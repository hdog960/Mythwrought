// M6 #071–073: physical underground-civilization components, candidate-only.
// Shapes are isolated descriptors, never live registry IDs or world placements.
const entries = [
 {ordinal:71,name:'Cavern-cut darkstone masonry',kind:'rough-hewn-interlocking-darkstone',attachment:'ground',hardness:6,palette:['#202e3b','#354756','#526270','#7c8790','#9da5a7'],boxes:[[.03,0,.03,.97,.28,.97],[.06,.28,.07,.48,.72,.92],[.52,.28,.07,.94,.72,.92],[.13,.72,.12,.87,.94,.87],[.44,.28,.07,.56,.63,.93]]},
 {ordinal:72,name:'Luminous calcite mosaic tiles',kind:'raised-mineral-inlay',attachment:'ground',hardness:3,palette:['#324654','#668d99','#a4d7cb','#d9f4df','#f5e9b9'],boxes:[[.02,0,.02,.98,.12,.98],[.09,.12,.09,.42,.18,.42],[.58,.12,.09,.91,.2,.42],[.09,.12,.58,.42,.19,.91],[.58,.12,.58,.91,.22,.91],[.44,.12,.44,.56,.27,.56]]},
 {ordinal:73,name:'Massive cavern support ribs',kind:'tapered-bracing-rib',attachment:'ground',hardness:7,palette:['#28343e','#4b5a62','#77838a','#a2a6a2','#b0a18a'],boxes:[[.07,0,.07,.93,.17,.93],[.22,.17,.17,.78,.45,.83],[.31,.45,.24,.69,.8,.76],[.2,.8,.16,.8,.98,.84],[.08,.17,.31,.25,.58,.69],[.75,.17,.31,.92,.58,.69]]}
];
export const UNDERGROUND_CIVILIZATION_FOUNDATIONS=Object.freeze(entries.map(e=>Object.freeze({...e,id:'biome130:'+String(e.ordinal).padStart(3,'0'),prospectiveId:255+e.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(e.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(e.palette)})));
export function undergroundBoxes(asset,rotation=0){
 if(!UNDERGROUND_CIVILIZATION_FOUNDATIONS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid asset/rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function undergroundMaterial(asset,x,y,z,face=0){
 if(!UNDERGROUND_CIVILIZATION_FOUNDATIONS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const hash=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+31,19349663)^Math.imul(z+23,83492791)^Math.imul(face+11,2654435761))>>>0;
 return asset.palette[(hash>>>6)%asset.palette.length];
}
export function undergroundMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of undergroundBoxes(asset,rotation))for(const f of faces){const s=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(s,s+1,s+2,s,s+2,s+3);}
 return {vertices,indices}; // Local fixture only; not a production renderer.
}
export function undergroundEditFixture(asset,rotation=0){
 undergroundBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
