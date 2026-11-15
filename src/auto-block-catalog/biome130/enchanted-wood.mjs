// M3 #043–045: isolated physical enchanted wood candidate assets, no live registry.
const specs=[
{ordinal:43,name:'Ancient aetherwood knots',kind:'knot',attachment:'trunk',solid:true,opacity:'opaque',seed:43071,palette:['#292c45','#504368','#776083','#ae92a8','#e1c4a5'],boxes:[[.17,.12,.17,.83,.84,.83],[.04,.35,.31,.35,.68,.72],[.65,.28,.29,.97,.65,.75],[.33,.81,.31,.69,.98,.69]]},
{ordinal:44,name:'Woven magical branch lattices',kind:'lattice',attachment:'wall',solid:false,opacity:'cutout',seed:44083,palette:['#233c35','#416951','#6f9a75','#b0cfa4','#d5e9b8'],boxes:[[.06,.05,.42,.22,.95,.58],[.78,.05,.42,.94,.95,.58],[.06,.17,.42,.94,.29,.58],[.06,.71,.42,.94,.83,.58],[.24,.27,.45,.38,.71,.55],[.62,.29,.45,.74,.72,.55]]},
{ordinal:45,name:'Enchanted bark growth',kind:'bark',attachment:'wall',solid:false,opacity:'cutout',seed:45097,palette:['#242b39','#3d4954','#6d6b71','#9a8e83','#d0bca2'],boxes:[[.09,.06,.36,.91,.94,.55],[.16,.16,.55,.32,.86,.7],[.43,.07,.55,.57,.95,.77],[.72,.21,.55,.87,.78,.68],[.28,.36,.69,.72,.51,.81]]}
];
export const ENCHANTED_WOOD=Object.freeze(specs.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,collision:s.solid?'occupied':'none',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette)})));
export function woodBoxes(asset,rotation=0){
if(!ENCHANTED_WOOD.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate/rotation');
return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function woodSurface(asset,x,y,z,face=0){
if(!ENCHANTED_WOOD.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
const hash=(Math.imul(x^asset.seed,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
return asset.palette[hash%asset.palette.length];
}
export function woodMesh(asset,rotation=0){
const vertices=[],indices=[];
const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
for(const b of woodBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
return {vertices,indices}; // Isolated unculled prototype, not runtime GPU certification.
}
export function woodEditFixture(asset,rotation=0){
woodBoxes(asset,rotation);
const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
const selected=restored.get('0,0,0');restored.delete('0,0,0');
return {snapshot,selected,removed:!restored.has('0,0,0')};
}
