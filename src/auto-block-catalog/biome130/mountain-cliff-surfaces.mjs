// M4 #055–057 mountain surface geology. Isolated physical candidates; no live IDs.
const specs=[
 {ordinal:55,name:'Wind-worn cliffstone',kind:'aeolian-hollows',hardness:4,palette:['#343d49','#65727b','#a7a69a','#c8bca3'],boxes:[[.04,0,.03,.96,.75,.97],[.04,.75,.03,.24,.96,.97],[.76,.75,.03,.96,.96,.97],[.24,.75,.76,.76,.94,.97],[.35,.75,.03,.65,.83,.23]],attachment:'ground'},
 {ordinal:56,name:'Columnar cliff formations',kind:'columnar-joints',hardness:5,palette:['#292f39','#47515c','#737c83','#a8aaa3'],boxes:[[.02,0,.05,.26,.96,.29],[.27,0,.04,.51,.81,.28],[.53,0,.07,.77,.99,.31],[.78,0,.06,.98,.71,.3],[.03,0,.35,.29,.72,.61],[.34,0,.37,.61,.9,.65],[.66,0,.36,.94,.78,.64]],attachment:'ground'},
 {ordinal:57,name:'Alpine lichen rock',kind:'lichen-colonies',hardness:3,palette:['#434c51','#6e7774','#9da59b','#b8c59b','#789b78','#c4c9aa'],boxes:[[.03,0,.04,.97,.65,.95],[.11,.65,.16,.38,.78,.46],[.51,.65,.38,.85,.84,.74],[.2,.65,.69,.47,.73,.9]],patches:[[.08,.13,.32,.41],[.45,.24,.7,.53],[.71,.65,.94,.88]],attachment:'ground'}
];
export const MOUNTAIN_CLIFF_SURFACES=Object.freeze(specs.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',opacity:'opaque',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette),patches:Object.freeze((s.patches||[]).map(p=>Object.freeze(p)))})));
export function cliffBoxes(asset,rotation=0){
 if(!MOUNTAIN_CLIFF_SURFACES.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function cliffColor(asset,x,y,z,face=0){
 if(!MOUNTAIN_CLIFF_SURFACES.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 const u=(h&1023)/1024,v=((h>>>10)&1023)/1024;
 const lichen=asset.patches.some(([a,b,c,d])=>u>=a&&u<=c&&v>=b&&v<=d);
 return asset.palette[lichen?3+h%3:h%Math.min(3,asset.palette.length)];
}
export function cliffMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of cliffBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Isolated uncullled shape prototype; not a production mesher.
}
export function cliffEditFixture(asset,rotation=0){
 cliffBoxes(asset,rotation);const placed=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...placed]),restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
