// M5 #061–063 ancient ruin COMPONENTS, never assembled or placed in the world.
// Symbolic candidate identities are intentionally incompatible with current Uint8 live IDs.
const definitions=[
 {ordinal:61,name:'Cyclopean ancient stone blocks',kind:'cyclopean-offset-faces',palette:['#393e46','#65666a','#989087','#b7aa92','#5c7772'],hardness:6,boxes:[[.02,0,.04,.98,.82,.96],[.02,.82,.08,.95,.91,.94],[.12,.91,.12,.85,.97,.89],[.02,.18,.0,.28,.63,.08],[.67,.12,.92,.96,.68,1]],attachment:'ground'},
 {ordinal:62,name:'Collapsed lintel segments',kind:'sheared-lintel-fragment',palette:['#333d45','#737a7b','#b1a79b','#d3c4ad','#7e6255'],hardness:5,boxes:[[.02,.12,.08,.98,.45,.89],[.12,.45,.12,.84,.62,.78],[.04,.04,.14,.32,.12,.81],[.74,.04,.16,.93,.12,.77],[.08,.62,.19,.3,.72,.71]],attachment:'ground'},
 {ordinal:63,name:'Arch springer wedges',kind:'arch-springer-step-profile',palette:['#46434b','#77717a','#b1a7a0','#d2c1aa','#7c897e'],hardness:5,boxes:[[.02,0,.04,.98,.3,.96],[.04,.3,.07,.95,.48,.85],[.08,.48,.12,.84,.67,.72],[.14,.67,.18,.71,.83,.6],[.22,.83,.24,.58,.93,.49]],attachment:'ground'}
];
export const ANCIENT_RUIN_FOUNDATIONS=Object.freeze(definitions.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function ruinBoxes(asset,rotation=0){
 if(!ANCIENT_RUIN_FOUNDATIONS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid ruin candidate or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function ruinMaterial(asset,x,y,z,face=0){
 if(!ANCIENT_RUIN_FOUNDATIONS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+17,19349663)^Math.imul(z+11,83492791)^Math.imul(face+3,2654435761))>>>0;
 return asset.palette[((h>>>8)%7===0)?4:(h%4)];
}
export function ruinMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of ruinBoxes(asset,rotation))for(const face of faces){const start=vertices.length/3;for(const p of face)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Isolated unculled fixture; not a production renderer adapter.
}
export function ruinEditFixture(asset,rotation=0){
 ruinBoxes(asset,rotation);
 const placed={symbolicId:asset.id,rotation};
 const cells=new Map([['0,0,0',placed]]);
 const snapshot=JSON.stringify([...cells]);
 const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');
 restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
