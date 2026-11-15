// M4 #052–054 raw mountain ore-bearing geology. Isolated candidates, never live IDs.
const entries=[
 {ordinal:52,name:'Rust-streaked iron-bearing rock',kind:'iron-oxidation',seed:52017,hardness:4,palette:['#343e46','#58616a','#8d5841','#bb7850','#d5a37b'],boxes:[[0,0,0,1,.82,1],[.07,.82,.12,.31,.91,.88],[.43,.82,.09,.61,.97,.76],[.74,.82,.18,.94,.9,.91]],veins:[[.13,.18,.84,.29],[.46,.53,.8,.61],[.78,.12,.92,.86]]},
 {ordinal:53,name:'Copper-stained rock',kind:'copper-patina',seed:53029,hardness:4,palette:['#3a4249','#66706b','#a36a43','#4d9c89','#8bc3aa'],boxes:[[.02,0,.02,.98,.77,.98],[.12,.77,.17,.42,.95,.41],[.55,.77,.44,.88,.99,.77],[.36,.77,.71,.62,.88,.94]],veins:[[.09,.31,.34,.83],[.42,.12,.67,.74],[.73,.22,.9,.92]]},
 {ordinal:54,name:'Quartz-veined outcrops',kind:'quartz-vein',seed:54041,hardness:5,palette:['#343947','#586070','#9696a1','#d5d4df','#f2eaf1'],boxes:[[.04,0,.05,.95,.62,.96],[.17,.62,.15,.47,.93,.39],[.51,.62,.42,.82,.99,.68],[.29,.62,.69,.54,.85,.91]],veins:[[.18,.13,.3,.86],[.49,.22,.63,.91],[.78,.09,.88,.72]]}
];
export const MOUNTAIN_ORE_GEOLOGY=Object.freeze(entries.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',attachment:'ground',opacity:'opaque',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),veins:Object.freeze(s.veins.map(v=>Object.freeze(v))),palette:Object.freeze(s.palette)})));
export function oreBoxes(asset,rotation=0){
 if(!MOUNTAIN_ORE_GEOLOGY.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function oreSurface(asset,x,y,z,face=0){
 if(!MOUNTAIN_ORE_GEOLOGY.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x^asset.seed,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 const u=(h&1023)/1024,v=((h>>>10)&1023)/1024;
 const mineral=asset.veins.some(([a,b,c,d])=>u>=a&&u<=c&&v>=b&&v<=d);
 return asset.palette[mineral?2+(h%3):h%2];
}
export function oreMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of oreBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Isolated uncullled prototype, not live mesher.
}
export function oreEditFixture(asset,rotation=0){
 oreBoxes(asset,rotation);
 const placed=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...placed]),restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
