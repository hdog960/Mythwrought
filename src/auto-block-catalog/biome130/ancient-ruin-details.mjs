// M5 physical ancient-ruin COMPONENTS #064–066; candidate-only, no world placement.
const raw=[
 {ordinal:64,name:'Individual keystones',kind:'tapered-crown-key',hardness:5,palette:['#353c45','#77787b','#b3a89a','#d5c8af','#668078'],boxes:[[.29,.05,.16,.71,.26,.84],[.23,.26,.12,.77,.58,.88],[.15,.58,.09,.85,.91,.91],[.18,.91,.15,.82,.98,.85]],attachment:'ground'},
 {ordinal:65,name:'Broken vault ribs',kind:'fractured-radial-vault-rib',hardness:6,palette:['#303d49','#5d6973','#96999b','#c4b4a2','#84726b'],boxes:[[.08,0,.34,.37,.2,.67],[.19,.2,.32,.47,.48,.68],[.32,.48,.3,.59,.72,.7],[.47,.72,.28,.7,.88,.72],[.63,.82,.36,.82,.94,.65]],attachment:'ground'},
 {ordinal:66,name:'Fractured plinth bases',kind:'sheared-stepped-plinth',hardness:6,palette:['#393b43','#6e6b72','#9b8e85','#c8b9a2','#647b73'],boxes:[[.04,0,.04,.96,.17,.96],[.12,.17,.1,.87,.35,.88],[.21,.35,.18,.76,.55,.81],[.28,.55,.24,.63,.66,.68],[.04,.17,.68,.31,.29,.91]],attachment:'ground'}
];
export const ANCIENT_RUIN_DETAILS=Object.freeze(raw.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function detailBoxes(asset,rotation=0){
 if(!ANCIENT_RUIN_DETAILS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid ruin detail or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function detailMaterial(asset,x,y,z,face=0){
 if(!ANCIENT_RUIN_DETAILS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+19,19349663)^Math.imul(z+13,83492791)^Math.imul(face+5,2654435761))>>>0;
 return asset.palette[((h>>>9)%7===0)?4:h%4];
}
export function detailMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of detailBoxes(asset,rotation))for(const face of faces){const start=vertices.length/3;for(const p of face)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Unculled isolated fixture; not live renderer.
}
export function detailEditFixture(asset,rotation=0){
 detailBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
