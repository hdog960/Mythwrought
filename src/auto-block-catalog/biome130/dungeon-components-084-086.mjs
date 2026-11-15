// M7 #084–086: inert physical dungeon hardware; candidate-only, never world-registered.
const raw=[
 {ordinal:84,name:'Puzzle locking sockets',profile:'deep-recessed-key-socket',attachment:'wall',palette:['#34313a','#716875','#b1a18b','#d0bb79'],boxes:[[.05,.05,.69,.95,.95,.81],[.05,.05,.81,.23,.95,.96],[.77,.05,.81,.95,.95,.96],[.23,.05,.81,.77,.23,.96],[.23,.77,.81,.77,.95,.96],[.32,.32,.69,.68,.68,.74]],state:{engaged:false},stateKeys:['engaged']},
 {ordinal:85,name:'Rotating rune dials',profile:'stepped-inert-rune-wheel',attachment:'wall',palette:['#272c38','#666b81','#c1b38b','#6c91a5'],boxes:[[.11,.11,.72,.89,.89,.8],[.22,.22,.8,.78,.78,.86],[.29,.29,.86,.71,.71,.92],[.45,.16,.87,.55,.35,.96],[.45,.65,.87,.55,.84,.96],[.16,.45,.87,.35,.55,.96],[.65,.45,.87,.84,.55,.96]],state:{dialStep:0},stateKeys:['dialStep']},
 {ordinal:86,name:'Chain anchor brackets',profile:'forked-load-bearing-anchor',attachment:'wall',palette:['#292f36','#626c75','#a2a9a5','#987d57'],boxes:[[.17,.17,.72,.83,.83,.82],[.2,.2,.82,.34,.8,.95],[.66,.2,.82,.8,.8,.95],[.3,.65,.82,.7,.79,.94],[.3,.21,.82,.7,.35,.94],[.37,.37,.84,.63,.63,.91]],state:{latched:false},stateKeys:['latched']}
];
export const DUNGEON_COMPONENTS_084_086=Object.freeze(raw.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied-boxes',rotationCount:4,opacity:'opaque',active:false,dynamic:false,damage:0,mechanism:'none',palette:Object.freeze(d.palette),boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),state:Object.freeze(d.state),stateKeys:Object.freeze(d.stateKeys)})));
export function hardwareBoxes(asset,rotation=0){
 if(!DUNGEON_COMPONENTS_084_086.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate/rotation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function hardwareMaterial(asset,x,y,z,face=0){
 if(!DUNGEON_COMPONENTS_084_086.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+11,19349663)^Math.imul(z+7,83492791)^Math.imul(face+3,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function hardwareMesh(asset,rotation=0){
 const vertices=[],indices=[],faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];
 for(const [x0,y0,z0,x1,y1,z1] of hardwareBoxes(asset,rotation)){
  const corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  for(const face of faces){const offset=vertices.length/3;for(const i of face)vertices.push(...corners[i]);indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);}
 }
 return {vertices,indices};
}
export function hardwareEditFixture(asset,rotation=0){
 hardwareBoxes(asset,rotation);
 const placed={symbolicId:asset.id,rotation,state:{...asset.state}};
 const encoded=JSON.stringify({schema:'biome130-candidate-v1',position:[0,0,0],placed});
 const decoded=JSON.parse(encoded),selected=decoded.placed;decoded.placed=null;
 return {encoded,selected,removed:decoded.placed===null};
}
