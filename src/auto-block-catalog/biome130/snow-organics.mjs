// Opt-in symbolic physical voxel candidates. NOT registered or placeable in the live game.
// Coordinates are local unit-cell fractions; each box is [xmin,ymin,zmin,xmax,ymax,zmax].
const families = [
  {ordinal:28,name:'Frosted alpine turf',attachment:'ground',opaque:true,solid:true,
   colors:['#425d4a','#739184','#c5dfd6','#eef5e8'], boxes:[[0,0,0,1,.72,1],[.08,.72,.08,.92,.84,.92],[.2,.84,.22,.31,.98,.34],[.63,.84,.55,.74,.96,.68]],
   pattern:'turf-frost',textureSeed:28041},
  {ordinal:29,name:'Snow-laden evergreen boughs',attachment:'branch',opaque:false,solid:false,
   colors:['#183e37','#326458','#95bdb1','#eff7f2'], boxes:[[.4,.12,.4,.6,.88,.6],[.1,.34,.31,.9,.47,.69],[.2,.54,.19,.8,.66,.81],[.29,.72,.26,.71,.82,.74],[.12,.47,.28,.88,.54,.72]],
   pattern:'needles-snow',textureSeed:29043},
  {ordinal:30,name:'Snow-covered fallen trunks',attachment:'ground',opaque:true,solid:true,
   colors:['#493c34','#7e6450','#b7c9bf','#e7f2ed'], boxes:[[0,.19,.32,1,.66,.68],[.07,.63,.35,.93,.79,.65],[.2,.1,.4,.42,.22,.6],[.7,.12,.4,.9,.22,.6]],
   pattern:'bark-snow',textureSeed:30047}
];
export const SNOW_ORGANIC_CANDIDATES=Object.freeze(families.map(f=>Object.freeze({
 ...f,id:`biome130:${String(f.ordinal).padStart(3,'0')}`,futureId:255+f.ordinal,
 selectable:true,replaceable:true,orientationCount:4,
 boxes:Object.freeze(f.boxes.map(b=>Object.freeze(b))),colors:Object.freeze(f.colors)
})));
export function rotatedBoxes(candidate,rotation=0){
 if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('rotation 0..3');
 return candidate.boxes.map(b=>{
  let [x0,y0,z0,x1,y1,z1]=b;
  for(let i=0;i<rotation;i++) [x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));
 });
}
export function candidateFaceColor(candidate,x,y,z,face=0){
 const hash=(Math.imul((x|0)^candidate.textureSeed,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul(face|0,2654435761))>>>0;
 return candidate.colors[hash%candidate.colors.length];
}
// Only surface triangles of individual occupancy boxes; no runtime engine integration.
export function candidateMesh(candidate,rotation=0){
 const vertices=[],indices=[];
 const faces=[
  [[0,0,0],[0,0,1],[0,1,1],[0,1,0]],
  [[1,0,1],[1,0,0],[1,1,0],[1,1,1]],
  [[0,0,1],[1,0,1],[1,1,1],[0,1,1]],
  [[1,0,0],[0,0,0],[0,1,0],[1,1,0]],
  [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],
  [[0,0,0],[1,0,0],[1,0,1],[0,0,1]]
 ];
 for(const b of rotatedBoxes(candidate,rotation)){
  const offset=vertices.length/3;
  for(const quad of faces){
   for(const v of quad)vertices.push(b[0]+v[0]*(b[3]-b[0]),b[1]+v[1]*(b[4]-b[1]),b[2]+v[2]*(b[5]-b[2]));
   const q=offset+indices.length/6*4;
   indices.push(q,q+1,q+2,q,q+2,q+3);
  }
 }
 return {vertices,indices};
}
// Local symbolic fixture, deliberately not the production save/placement implementation.
export function symbolicCellRoundtrip(candidate,rotation=0){
 const payload=JSON.stringify({symbolicId:candidate.id,rotation});
 const restored=JSON.parse(payload);
 if(restored.symbolicId!==candidate.id)throw new Error('symbolic ID mismatch');
 return restored;
}
