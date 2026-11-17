// M7 #081-083: inert physical dungeon components. Candidate-only; no trap logic.
const definitions = [
  {ordinal:81,name:'Mechanical pressure plates',profile:'depressed-plate',attachment:'floor',palette:['#363a43','#737b80','#a7a391','#c2a66f'],boxes:[[.04,0,.04,.96,.13,.96],[.13,.13,.13,.87,.19,.87],[.19,.19,.19,.81,.23,.81],[.07,.13,.07,.18,.25,.18],[.82,.13,.82,.93,.25,.93]],state:{pressed:false},stateKeys:['pressed']},
  {ordinal:82,name:'Retractable spike tiles',profile:'inert-recessed-spike-carrier',attachment:'floor',palette:['#292e37','#56616b','#90999c','#c6bda4'],boxes:[[.02,0,.02,.98,.14,.98],[.06,.14,.06,.94,.2,.19],[.06,.14,.81,.94,.2,.94],[.06,.14,.19,.19,.2,.81],[.81,.14,.19,.94,.2,.81],[.28,.14,.28,.38,.32,.38],[.62,.14,.62,.72,.32,.72]],state:{extended:false},stateKeys:['extended']},
  {ordinal:83,name:'Concealed wall panels',profile:'recessed-wall-panel',attachment:'wall',palette:['#343840','#5a6169','#92928b','#c1b7a1'],boxes:[[.04,.04,.69,.96,.96,.86],[.08,.08,.86,.92,.92,.93],[.12,.12,.93,.88,.88,.98],[.04,.04,.63,.17,.96,.69],[.83,.04,.63,.96,.96,.69]],state:{open:false},stateKeys:['open']}
];
export const DUNGEON_COMPONENTS=Object.freeze(definitions.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied-boxes',rotationCount:4,opacity:'opaque',active:false,dynamic:false,damage:0,mechanism:'none',palette:Object.freeze(d.palette),boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),state:Object.freeze(d.state),stateKeys:Object.freeze(d.stateKeys)})));
export function dungeonBoxes(asset,rotation=0){
 if(!DUNGEON_COMPONENTS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate/rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function dungeonMaterial(asset,x,y,z,face=0){
 if(!DUNGEON_COMPONENTS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const hash=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+11,19349663)^Math.imul(z+7,83492791)^Math.imul(face+3,2654435761))>>>0;
 return asset.palette[hash%asset.palette.length];
}
export function dungeonMesh(asset,rotation=0){
 const vertices=[],indices=[],faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];
 for(const [x0,y0,z0,x1,y1,z1] of dungeonBoxes(asset,rotation)){
  const corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  for(const face of faces){const offset=vertices.length/3;for(const index of face)vertices.push(...corners[index]);indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);}
 }
 return {vertices,indices}; // isolated fixture, not shared renderer
}
export function dungeonEditFixture(asset,rotation=0){
 dungeonBoxes(asset,rotation);
 const record={schema:'biome130-candidate-v1',position:[0,0,0],placed:{symbolicId:asset.id,rotation,state:{...asset.state}}};
 const encoded=JSON.stringify(record),decoded=JSON.parse(encoded);
 const selected=decoded.placed;decoded.placed=null;
 return {encoded,selected,removed:decoded.placed===null};
}
