// M4 mountain candidates 049-051. Symbolic-only; no live block registry or placement.
const specs=[
 {ordinal:49,name:'Shale scree formations',kind:'shale',palette:['#292f3a','#444a55','#717984','#a2a7a6'],boxes:[[.06,.03,.08,.94,.14,.84],[.12,.14,.18,.79,.24,.73],[.28,.24,.24,.86,.33,.68],[.44,.33,.31,.75,.42,.61]],hardness:2,attachment:'ground'},
 {ordinal:50,name:'Hardened mountain clay',kind:'clay',palette:['#5a4037','#80604c','#a58268','#c4a083'],boxes:[[0,0,0,1,.78,1],[.06,.78,.08,.61,.88,.87],[.62,.78,.15,.94,.83,.76]],hardness:3,attachment:'ground'},
 {ordinal:51,name:'Exposed crystal seams',kind:'seam',palette:['#333c4c','#566778','#64b7bd','#c1f3e5'],boxes:[[0,0,0,1,.83,1],[.18,.83,.2,.35,.99,.39],[.43,.83,.4,.61,.96,.63],[.69,.83,.57,.85,.99,.82]],hardness:4,attachment:'ground'}
];
export const MOUNTAIN_MATERIALS=Object.freeze(specs.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette)})));
export function materialBoxes(asset,rotation=0){
 if(!MOUNTAIN_MATERIALS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid asset or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function materialColor(asset,x,y,z,face=0){
 if(!MOUNTAIN_MATERIALS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid surface sample');
 const h=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function materialMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of materialBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Standalone uncullled prototype, not production mesher.
}
export function materialEditFixture(asset,rotation=0){
 materialBoxes(asset,rotation);
 const cell={symbolicId:asset.id,rotation},placed=new Map([['0,0,0',cell]]);
 const snapshot=JSON.stringify([...placed]),restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
