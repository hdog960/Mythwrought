// Strictly ephemeral memory cap for original-source reads used by the
// explicitly opted-in Enchanted Forest tree prototypes. One instance belongs
// to ONE environmentalTreesForChunk call; historical M7 never creates one.
// FIFO eviction is deterministic, bounded and safe because the true original
// cave/landmark/terrain source is immutable during a synchronous chunk plan.
// An evicted key is read from that authoritative source again, never guessed.
export const ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES=2048;

export class EnchantedCandidateSourceCache extends Map {
  constructor(limit=ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES){
    super();
    if(!Number.isInteger(limit)||limit<1||
       limit>ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES)
      throw Error('Invalid enchanted source cache capacity');
    this.limit=limit;
    this.peakEntries=0;
    this.evictions=0;
  }
  set(key,value){
    // Updating a known key does not change its original FIFO ownership.
    // Clearing only the oldest entry gives bounded O(1) insertion; an LRU
    // delete+reinsert on every read would cost extra work on the iPhone.
    if(!super.has(key)&&this.size>=this.limit){
      super.delete(this.keys().next().value);
      this.evictions++;
    }
    super.set(key,value);
    if(this.size>this.peakEntries)this.peakEntries=this.size;
    return this;
  }
}
