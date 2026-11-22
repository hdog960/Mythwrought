// Experimental Enchanted Forest only: immutable V6 site classification
// memo across neighboring sequential tree chunks of ONE FourRegionWorld.
// It stores NO terrain, cave, root, landmark, player edit or tree voxel data.
// Those provenance checks remain authoritative on every chunk build.
// FIFO with explicit cap; including seed in each key rejects accidental
// cross-seed aliasing. No singleton and never serialized to schema-1 saves.
export const ENCHANTED_SITE_BIOME_CACHE_LIMIT=128;

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
  getOrRead(x,z,seed,readBiome){
    if(![x,z,seed].every(Number.isInteger)||seed!==(seed|0)||
       typeof readBiome!=='function')
      throw Error('Invalid Enchanted immutable site biome lookup');
    const key=seed+':'+x+','+z;
    if(super.has(key)){
      this.hits++;
      return super.get(key); // null (Plains) is a real cached value
    }
    const biome=readBiome(x,z,seed);
    // V6 biomeAt returns a frozen biome object or null. Do not retain an
    // unknown mutable object that might be changed after this chunk.
    if(biome!==null&&(
       !biome||!Object.isFrozen(biome)||typeof biome.name!=='string'||
       !Number.isFinite(biome.weight)))
      throw Error('Unstable Enchanted site biome result');
    this.misses++;
    if(this.size>=this.limit){
      super.delete(this.keys().next().value);
      this.evictions++;
    }
    super.set(key,biome);
    if(this.size>this.peakEntries)this.peakEntries=this.size;
    return biome;
  }
}
