// Balanced worldwide M7 five-biome survey selector. Explicitly separates
// near, middle and remote regions so a scan's first matches cannot crowd into
// one border strip. Does not access or change natural blocks or saves.
export const UNDERWORLD_DISTRIBUTED_BIOMES=Object.freeze(
 ['plains','desert','snow','mountain','enchanted']);
export const UNDERWORLD_SAMPLE_AXIS=Object.freeze(
 [-300,-128,-64,-32,-16,-12,-9,-6,-3,0,3,6,9,12,16,32,64,128,300]);
const regionsPerTier=2;
function rank(seed,rx,rz){
 let h=Math.imul(seed,0x9e3779b1)^Math.imul(rx,0x85ebca6b)^
   Math.imul(rz,0xc2b2ae35);
 h=Math.imul(h^(h>>>16),0x7feb352d);
 h=Math.imul(h^(h>>>15),0x846ca68b);
 return (h^(h>>>16))>>>0;
}
function tier(rx,rz){
 const reach=Math.max(Math.abs(rx),Math.abs(rz));
 return reach<=10?'near':reach<=64?'middle':'remote';
}
export function selectDistributedUnderworldRegions(seed,biomeAt){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
   typeof biomeAt!=='function')throw new TypeError('Invalid distributed survey inputs');
 const pool=Object.fromEntries(UNDERWORLD_DISTRIBUTED_BIOMES.map(b=>
  [b,{near:[],middle:[],remote:[]}]));
 for(const rx of UNDERWORLD_SAMPLE_AXIS)for(const rz of UNDERWORLD_SAMPLE_AXIS){
  const biome=biomeAt(rx*256+128,rz*256+128,seed);
  if(!(biome in pool))throw new TypeError('Unknown M7 regional biome '+biome);
  const area=tier(rx,rz);
  pool[biome][area].push(Object.freeze({
   rx,rz,tier:area,regionCenterBiome:biome,hashRank:rank(seed,rx,rz)}));
 }
 const selected={};
 for(const biome of UNDERWORLD_DISTRIBUTED_BIOMES){
  const rows=[];
  for(const area of ['near','middle','remote']){
   const candidates=pool[biome][area].sort((a,b)=>
     a.hashRank-b.hashRank||a.rx-b.rx||a.rz-b.rz);
   if(candidates.length<regionsPerTier)
    throw Error('Insufficient authentic '+biome+' '+area+' M7 regions');
   rows.push(...candidates.slice(0,regionsPerTier).map(c=>Object.freeze({
    rx:c.rx,rz:c.rz,tier:area,regionCenterBiome:biome
   })));
  }
  selected[biome]=Object.freeze(rows);
 }
 return Object.freeze(selected);
}
