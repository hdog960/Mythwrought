// M4 #058–060 natural mountain geology. Symbolic candidates only; no world placement.
const specs=[
 {ordinal:58,name:'Natural cliff salt deposits',kind:'evaporite-shelves',hardness:2,palette:['#7e7770','#b4aaa0','#e2d8c9','#f4e9d8','#d3b9b0'],boxes:[[.06,0,.08,.94,.58,.93],[.08,.58,.12,.91,.66,.87],[.17,.66,.18,.78,.73,.81],[.12,.73,.2,.36,.8,.7],[.53,.73,.26,.81,.85,.58]],mineral:[[.08,.17,.94,.31],[.18,.47,.83,.61],[.29,.74,.91,.91]]},
 {ordinal:59,name:'Snowmelt-eroded stone',kind:'runoff-gullies',hardness:4,palette:['#354550','#667c82','#a0a9a3','#c0d1d2','#879ba4'],boxes:[[.03,0,.04,.97,.57,.96],[.03,.57,.05,.26,.9,.94],[.4,.57,.04,.6,.83,.96],[.76,.57,.06,.97,.96,.94],[.27,.57,.72,.39,.73,.93],[.62,.57,.09,.74,.72,.35]],mineral:[[.24,.05,.36,.92],[.57,.11,.7,.85]]},
 {ordinal:60,name:'Geothermal mountain rock',kind:'fumarole-porosity',hardness:5,palette:['#272b33','#46444b','#795b50','#a46c48','#d4a36a'],boxes:[[.04,0,.04,.96,.56,.96],[.05,.56,.07,.29,.9,.91],[.7,.56,.09,.95,.87,.9],[.31,.56,.71,.68,.79,.94],[.32,.56,.06,.68,.73,.28]],mineral:[[.13,.18,.31,.68],[.42,.25,.59,.83],[.74,.17,.91,.75]]}
];
export const MOUNTAIN_FINAL_GEOLOGY=Object.freeze(specs.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',attachment:'ground',opacity:'opaque',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),mineral:Object.freeze(s.mineral.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette)})));
export function finalMountainBoxes(asset,rotation=0){
 if(!MOUNTAIN_FINAL_GEOLOGY.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid asset or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function finalMountainColor(asset,x,y,z,face=0){
 if(!MOUNTAIN_FINAL_GEOLOGY.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 const u=(h&1023)/1024,v=((h>>>10)&1023)/1024;
 const mineral=asset.mineral.some(([a,b,c,d])=>u>=a&&u<=c&&v>=b&&v<=d);
 return asset.palette[mineral?2+h%3:h%2];
}
export function finalMountainMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of finalMountainBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Unculled isolated prototype; production renderer remains external.
}
export function finalMountainEditFixture(asset,rotation=0){
 finalMountainBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]),restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
