// M7 #087–090: inert, individually selectable dungeon hardware candidates.
// No runtime registration, trap logic, world placement, or persistent numeric ID writes.
const definitions=[
 {ordinal:87,name:'Recessed gate guide tracks',profile:'paired-deep-guide-rails',attachment:'floor-wall',palette:['#30363d','#68737a','#9a9180','#b6a477'],boxes:[[.06,.02,.08,.94,.14,.92],[.06,.14,.08,.23,.82,.92],[.77,.14,.08,.94,.82,.92],[.23,.14,.08,.31,.28,.92],[.69,.14,.08,.77,.28,.92]],state:{gatePosition:'fixed'},stateKeys:['gatePosition']},
 {ordinal:88,name:'Portcullis tooth segments',profile:'forked-iron-tooth',attachment:'gate',palette:['#242a30','#59626a','#9b9b91','#80684d'],boxes:[[.15,.64,.23,.85,.84,.77],[.18,.3,.28,.34,.65,.72],[.66,.3,.28,.82,.65,.72],[.21,.09,.32,.31,.3,.68],[.69,.09,.32,.79,.3,.68],[.37,.49,.32,.63,.64,.68]],state:{extended:false},stateKeys:['extended']},
 {ordinal:89,name:'Counterweight channel blocks',profile:'hollow-vertical-weight-shaft',attachment:'wall',palette:['#333038','#665d62','#a49b89','#a68c65'],boxes:[[.05,.05,.07,.23,.95,.93],[.77,.05,.07,.95,.95,.93],[.23,.05,.07,.77,.18,.93],[.23,.82,.07,.77,.95,.93],[.23,.18,.07,.32,.82,.22],[.68,.18,.07,.77,.82,.22]],state:{weightOffset:0},stateKeys:['weightOffset']},
 {ordinal:90,name:'Dungeon pivot hinges',profile:'offset-barrel-and-knuckles',attachment:'wall',palette:['#292c34','#6a7075','#b0a68b','#947451'],boxes:[[.1,.1,.72,.9,.9,.81],[.15,.16,.81,.35,.84,.94],[.65,.16,.81,.85,.84,.94],[.35,.35,.82,.65,.65,.91],[.38,.18,.87,.62,.34,.97],[.38,.66,.87,.62,.82,.97]],state:{pivotQuarterTurns:0},stateKeys:['pivotQuarterTurns']}
];
export const DUNGEON_COMPONENTS_087_090=Object.freeze(definitions.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied-boxes',rotationCount:4,opacity:'opaque',active:false,dynamic:false,damage:0,mechanism:'none',palette:Object.freeze(d.palette),boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),state:Object.freeze(d.state),stateKeys:Object.freeze(d.stateKeys)})));
export function dungeonBoxes(asset,rotation=0){
 if(!DUNGEON_COMPONENTS_087_090.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate/rotation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function dungeonMaterial(asset,x,y,z,face=0){
 if(!DUNGEON_COMPONENTS_087_090.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+11,19349663)^Math.imul(z+7,83492791)^Math.imul(face+3,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function dungeonMesh(asset,rotation=0){
 const vertices=[],indices=[],faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];
 for(const [x0,y0,z0,x1,y1,z1] of dungeonBoxes(asset,rotation)){
  const corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  for(const face of faces){const offset=vertices.length/3;for(const i of face)vertices.push(...corners[i]);indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);}
 }
 return {vertices,indices};
}
export function dungeonEditFixture(asset,rotation=0){
 dungeonBoxes(asset,rotation);
 const placed={symbolicId:asset.id,rotation,state:{...asset.state}};
 const encoded=JSON.stringify({schema:'biome130-candidate-v1',position:[0,0,0],placed});
 const decoded=JSON.parse(encoded),selected=decoded.placed;decoded.placed=null;
 return {encoded,selected,removed:decoded.placed===null};
}
