// Far-only approximation using actual original voxel palette and directional
// shading. Never modifies near mesh RGB, material identity or physical cells.
import {biome130Block} from '../biome130-registry.mjs';
const core={1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],6:[.70,.58,.33]};
const lit=[.77,.73,1,.85,.67];
function hash(x,z,seed){
 let h=Math.imul((x|0)^seed,0x27d4eb2d)^Math.imul((z|0)+seed,0x165667b1);
 h^=h>>>15;h=Math.imul(h,0x85ebca6b);h^=h>>>13;return (h>>>0)/4294967295;
}
function noise(x,z,seed){
 const a=Math.floor(x),b=Math.floor(z),u=x-a,v=z-b,s=u*u*(3-2*u),t=v*v*(3-2*v);
 const p=hash(a,b,seed)*(1-s)+hash(a+1,b,seed)*s,q=hash(a,b+1,seed)*(1-s)+hash(a+1,b+1,seed)*s;return p*(1-t)+q*t;
}
export function p0FarSourceRgb(id,d,x,y,z,seed){
 if(![id,d,x,y,z,seed].every(Number.isSafeInteger)||d<0||d>4)throw Error('Invalid far appearance witness');
 let base,shade;
 if(id>=256&&id<=264){
  const palette=biome130Block(id).palette;
  base=palette[0].map((_,i)=>palette.reduce((n,c)=>n+c[i],0)/palette.length);
  // Mean of the actual four world-space corners, not a per-vertex
  // reproduction of the native shader or biome seam cue.
  const corners=d<2?[[x+(d===0?1:0),z],[x+(d===0?1:0),z+1]]:
    d===2?[[x,z],[x+1,z],[x,z+1],[x+1,z+1]]:
    [[x,z+(d===3?1:0)],[x+1,z+(d===3?1:0)]];
  shade=corners.reduce((n,[a,b])=>n+.91+noise(a/31,b/31,seed+2401)*.15+noise(a/9,b/9,seed+2479)*.045,0)/corners.length;
 }else{
  base=core[id];if(!base)return null;
  shade=.90+noise(x/9,z/9,seed+91)*.14+hash(x+y*5,z-y*3,seed+91)*.08;
 }
 return base.map(v=>Math.max(0,Math.min(1,v*shade*lit[d])));
}
export function p0FarRecordWitness(v,i){
 const code=v[i],d=code%5,kind=Math.floor(code/5),p=v[i+1],r=Math.floor((v[i+2]+v[i+8]-1)/2),a=Math.floor((v[i+6]+v[i+7]-1)/2);
 const [x,y,z]=d<2?[p-(d===0?1:0),r,a]:d===2?[a,p-1,r]:[a,r,p-(d===3?1:0)];
 return {kind,d,x,y,z};
}
export function recolorP0FarCache(cache,world,view){
 const v=cache.copyVertices();let changed=0,unsupported=0;
 for(let i=0;i<v.length;i+=9){
  const {kind,d,x,y,z}=p0FarRecordWitness(v,i),id=(kind===0?view:world).get(x,y,z),rgb=p0FarSourceRgb(id,d,x,y,z,world.seed);
  if(!rgb){unsupported++;continue;}
  v.set(rgb,i+3);changed++;
 }
 return Object.freeze({vertices:v,changed,unsupported});
}
