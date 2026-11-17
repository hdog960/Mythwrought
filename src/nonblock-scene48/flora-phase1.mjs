// :48 non-block visual-only scene geometry. No block IDs, world writes or automatic placement.
export const SCENE_FAMILIES = Object.freeze({
  'scene48:low-grass': Object.freeze({attachment:'ground', footprint:[0.75,0.42,0.75], collision:'pass-through', tier:'dense', biome:['temperate','meadow'], status:'SOURCE_READY'}),
  'scene48:short-fern': Object.freeze({attachment:'ground', footprint:[0.9,0.7,0.9], collision:'pass-through', tier:'medium', biome:['temperate','enchanted-forest'], status:'SOURCE_READY'}),
  'scene48:single-wildflower': Object.freeze({attachment:'ground', footprint:[0.42,0.82,0.42], collision:'pass-through', tier:'medium', biome:['temperate','meadow'], status:'SOURCE_READY'}),
  'scene48:button-mushroom': Object.freeze({attachment:'ground', footprint:[0.5,0.46,0.5], collision:'pass-through', tier:'medium', biome:['forest','enchanted-forest'], status:'SOURCE_READY'})
});
const mix = n => { n = Math.imul(n ^ n >>> 16, 0x7feb352d); n = Math.imul(n ^ n >>> 15, 0x846ca68b); return (n ^ n >>> 16) >>> 0; };
export function sceneVariant(seed, x, y, z, id) {
  if (!Object.hasOwn(SCENE_FAMILIES,id)) throw new RangeError('unknown scene family');
  if (![seed,x,y,z].every(Number.isSafeInteger)) throw new TypeError('integer seed and coordinates required');
  let h=mix(seed ^ Math.imul(x,73856093) ^ Math.imul(y,19349663) ^ Math.imul(z,83492791));
  for (let i=0;i<id.length;i++) h=mix(h ^ id.charCodeAt(i));
  return {yaw:(h&3)*Math.PI/2, scale:0.88+((h>>>4)&15)/100, bend:((h>>>8)&7)/70-0.05, variant:(h>>>12)&3};
}
// Each triangle has 3 positions (xyz) and a palette index; no textures, alpha sorting or draw-per-leaf.
function builder(){const positions=[],materials=[];return {positions,materials,tri(a,b,c,m){positions.push(...a,...b,...c);materials.push(m);},quad(a,b,c,d,m){this.tri(a,b,c,m);this.tri(a,c,d,m);},finish(){return {positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length};}};}
function leaf(b,x,y,z,dx,dy,dz,w,m){
  const p=[x,y,z], tip=[x+dx,y+dy,z+dz], side=[-dz*w,0,dx*w];
  b.tri(p,[x+dx*.48+side[0],y+dy*.46,z+dz*.48+side[2]],tip,m);
  b.tri(p,tip,[x+dx*.48-side[0],y+dy*.46,z+dz*.48-side[2]],m);
}
function grass(b,v){for(let i=0;i<5;i++){const a=i*Math.PI*2/5+v.bend,r=.09+(i%2)*.045;leaf(b,Math.cos(a)*r,0,Math.sin(a)*r,Math.cos(a)*.26,.27+(i%3)*.07,Math.sin(a)*.26,.16,0);}}
function fern(b,v){for(let f=0;f<3;f++){const a=f*Math.PI*2/3+v.bend,dx=Math.cos(a),dz=Math.sin(a);for(let i=1;i<=4;i++){const t=i/5;for(const s of [-1,1])leaf(b,dx*t*.26,.06+t*.42,dz*t*.26,dx*.11+s*(-dz)*.17*(1-t),.07,dz*.11+s*dx*.17*(1-t),.07,1);}}}
function flower(b,v){const z=v.bend;b.quad([-.018,0,z],[.018,0,z],[.018,.58,z],[ -.018,.58,z],2);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;leaf(b,0,.58,z,Math.cos(a)*.17,.09,Math.sin(a)*.17,.07,3);}b.tri([-.05,.59,z],[.05,.59,z],[0,.65,z],4);}
function mushroom(b,v){const sides=8,r=.19;for(let i=0;i<sides;i++){const a=i*Math.PI*2/sides,c=(i+1)*Math.PI*2/sides;b.quad([Math.cos(a)*.035,0,Math.sin(a)*.035],[Math.cos(c)*.035,0,Math.sin(c)*.035],[Math.cos(c)*.047,.25,Math.sin(c)*.047],[Math.cos(a)*.047,.25,Math.sin(a)*.047],5);b.tri([0,.4,0],[Math.cos(a)*r,.25,Math.sin(a)*r],[Math.cos(c)*r,.25,Math.sin(c)*r],6);b.tri([0,.24,0],[Math.cos(c)*r,.25,Math.sin(c)*r],[Math.cos(a)*r,.25,Math.sin(a)*r],7);}}
const makers={'scene48:low-grass':grass,'scene48:short-fern':fern,'scene48:single-wildflower':flower,'scene48:button-mushroom':mushroom};
export function createSceneMesh(id,seed,x,y,z){
 const v=sceneVariant(seed,x,y,z,id),b=builder();makers[id](b,v);const mesh=b.finish();
 // Rotation and variation happen at instance level, not in shared mesh geometry.
 return {id,anchor:[x,y,z],variant:v,mesh,attachment:SCENE_FAMILIES[id].attachment,collision:'pass-through'};
}
export function makeSceneBatch(instances){
 const batches=new Map();
 for(const item of instances){if(!item || !Object.hasOwn(SCENE_FAMILIES,item.id))throw new RangeError('invalid scene instance');const key=item.id;let batch=batches.get(key);if(!batch){batch={id:key,mesh:createSceneMesh(key,0,0,0,0).mesh,instances:[]};batches.set(key,batch);}const {seed,x,y,z}=item;batch.instances.push({anchor:[x,y,z],...sceneVariant(seed,x,y,z,key)});}
 return [...batches.values()];
}
