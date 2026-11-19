// Immutable, seed-driven V6 surface distribution: 30% Plains, 17.5% each
// Mountain, Desert, Snow and Enchanted. Never called for legacy/v2/v3/v4/v5.
// Every complete 8x5 macrocell group has exactly 12/7/7/7/7 equal-area slots.
export const V6_BIOME_FRACTIONS=Object.freeze({
  plains:.30,mountain:.175,desert:.175,snow:.175,enchanted:.175
});
export const V6_BIOME_TILE_SIZE=512;
const WIDTH=8,HEIGHT=5;
const LABELS=Object.freeze([...Array(12).fill('plains'),
  ...Array(7).fill('mountain'),...Array(7).fill('desert'),
  ...Array(7).fill('snow'),...Array(7).fill('enchanted')]);
const cache=new Map();
const smooth=t=>t*t*(3-2*t);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hash(x,z,seed,salt=0){
  let h=Math.imul(x|0,0x7feb352d)^Math.imul(z|0,0x846ca68b)^
    Math.imul(seed|0,0x9e3779b1)^Math.imul(salt|0,0x85ebca6b);
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  return (h^(h>>>16))>>>0;
}
function noise(x,z,seed){
  const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
  const n=(ix,iz)=>hash(ix,iz,seed)/4294967296;
  return (n(a,b)*(1-u)+n(a+1,b)*u)*(1-v)+
    (n(a,b+1)*(1-u)+n(a+1,b+1)*u)*v;
}
function supertile(seed,sx,sz){
  const key=seed+':'+sx+':'+sz;
  if(cache.has(key))return cache.get(key);
  const a=LABELS.slice();
  for(let i=a.length-1;i>0;i--){
    const j=hash(sx*41+i,sz*83-i,seed,907+i)%(i+1);
    [a[i],a[j]]=[a[j],a[i]];
  }
  function promote(i,name){
    if(a[i]===name)return;
    const j=a.indexOf(name);
    [a[i],a[j]]=[a[j],a[i]];
  }
  // Spawn remains Plains; all four distinctive biomes are discoverable
  // near their familiar cardinal directions. Swaps do not alter quotas.
  if(sx===0&&sz===0){
    promote(0,'plains');promote(1,'desert');promote(WIDTH,'snow');
  }
  if(sx===-1&&sz===0)promote(WIDTH-1,'mountain');
  if(sx===0&&sz===-1)promote((HEIGHT-1)*WIDTH,'enchanted');
  const result=Object.freeze(a);
  cache.set(key,result);
  if(cache.size>128)cache.delete(cache.keys().next().value);
  return result;
}
export function v6BiomeAt(x,z,seed=179){
  if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isInteger(seed)||
    seed!==(seed|0))return null;
  // Continuous coordinate warp creates organic, seamless borders without
  // noise-confetti, grid seam cracks or multiplying region densities.
  const wx=x+(noise(x/224,z/224,seed+1401)-.5)*144;
  const wz=z+(noise(x/224,z/224,seed+1811)-.5)*144;
  const tx=Math.floor((wx+V6_BIOME_TILE_SIZE/2)/V6_BIOME_TILE_SIZE);
  const tz=Math.floor((wz+V6_BIOME_TILE_SIZE/2)/V6_BIOME_TILE_SIZE);
  const sx=Math.floor(tx/WIDTH),sz=Math.floor(tz/HEIGHT);
  const ix=tx-sx*WIDTH,iz=tz-sz*HEIGHT;
  const name=supertile(seed,sx,sz)[iz*WIDTH+ix];
  if(name==='plains')return null; // Use original, untouched grass voxels.
  const dx=wx-tx*V6_BIOME_TILE_SIZE,dz=wz-tz*V6_BIOME_TILE_SIZE;
  const edge=V6_BIOME_TILE_SIZE/2-Math.max(Math.abs(dx),Math.abs(dz));
  const weight=.350001+.649999*smooth(clamp(edge/36,0,1));
  return Object.freeze({name,weight,center:Object.freeze([
    tx*V6_BIOME_TILE_SIZE,tz*V6_BIOME_TILE_SIZE
  ])});
}
