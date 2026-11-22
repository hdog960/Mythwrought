// Experimental Enchanted Forest only: immutable V6 site classification
// memo across neighboring sequential tree chunks of ONE FourRegionWorld.
// It stores NO terrain, cave, root, landmark, player edit or tree voxel data.
// Those provenance checks remain authoritative on every chunk build.
// FIFO with explicit cap; including seed in each key rejects accidental
// cross-seed aliasing. No singleton and never serialized to schema-1 saves.
export const ENCHANTED_SITE_BIOME_CACHE_LIMIT=128;

// A nested mutable center defeats an Object.freeze on the outer biome:
// changing its coordinates after insertion could corrupt later generation.
// Validate even direct Map.set calls, not only the normal getOrRead path.
const siteKey=/^-?(?:0|[1-9][0-9]*):-?(?:0|[1-9][0-9]*),-?(?:0|[1-9][0-9]*)$/;
const classificationNames=new Set(['mountain','desert','snow','enchanted']);
function canonicalKey(key){
  if(typeof key!=='string'||!siteKey.test(key))
    return false;
  const match=key.match(/^(-?[0-9]+):(-?[0-9]+),(-?[0-9]+)$/);
  return !!match&&match.slice(1).every(n=>Number.isSafeInteger(Number(n)));
}
function immutableV6Result(biome){
  return biome===null||(
    !!biome&&typeof biome==='object'&&Object.isFrozen(biome)&&
    classificationNames.has(biome.name)&&
    Number.isFinite(biome.weight)&&biome.weight>=0&&biome.weight<=1&&
    Array.isArray(biome.center)&&biome.center.length===2&&
    Object.isFrozen(biome.center)&&
    biome.center.every(Number.isFinite)
  );
}

export class EnchantedSiteBiomeCache extends Map {
  constructor(limit=ENCHANTED_SITE_BIOME_CACHE_LIMIT){
    super();
    if(!Number.isInteger(limit)||limit<1||limit>ENCHANTED_SITE_BIOME_CACHE_LIMIT)
      throw Error('Invalid Enchanted site biome cache capacity');
    this.limit=limit;
    this.hits=0;
    this.misses=0;
    this.evictions=0;
    this.peakEntries=0;
  }
  set(key,biome){
    // A corrupt/mutable entry must never survive in a world-persistent
    // source classification cache. Check BEFORE eviction or mutation.
    if(!canonicalKey(key)||!immutableV6Result(biome))
      throw Error('Unstable or invalid Enchanted immutable site biome entry');
    // Enforce the cap on ALL writes, not only getOrRead.
    if(!super.has(key)&&this.size>=this.limit){
      super.delete(this.keys().next().value);
      this.evictions++;
    }
    super.set(key,biome);
    this.peakEntries=Math.max(this.peakEntries,this.size);
    return this;
  }
  getOrRead(x,z,seed,readBiome){
    if(!Number.isSafeInteger(x)||!Number.isSafeInteger(z)||
       !Number.isInteger(seed)||seed!==(seed|0)||
       typeof readBiome!=='function')
      throw Error('Invalid Enchanted immutable site biome lookup');
    const key=seed+':'+x+','+z;
    if(super.has(key)){
      this.hits++;
      return super.get(key); // null (Plains) is a real cached value
    }
    const biome=readBiome(x,z,seed);
    // Check the full immutable V6 result, including its nested center.
    // An invalid callback must fail BEFORE a cache miss is recorded.
    if(!immutableV6Result(biome))
      throw Error('Unstable Enchanted site biome result');
    this.misses++;
    this.set(key,biome);
    return biome;
  }
}
