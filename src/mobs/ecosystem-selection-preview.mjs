// Pure, source-shaped regional selection before a certified global clock is
// consumed. It never writes a source record, mutates a world, or issues a ticket.
// Original PopulationManager uses the first 64 entries, an incrementing cursor,
// and first stale record in Map insertion order for capacity eviction.
export const SOURCE_ECOLOGY_MAX_REGIONS=64;
export const SOURCE_ECOLOGY_REPLENISH_SECONDS=12;

export function previewSourceEcologyRegion({
  regions,cursor,time,records,isValidRegion
}={}){
  if(!Array.isArray(regions)||!Array.isArray(records)||
     !Number.isSafeInteger(cursor)||cursor<0||
     !Number.isFinite(time)||time<0||
     typeof isValidRegion!=='function'||
     records.length>SOURCE_ECOLOGY_MAX_REGIONS)
    throw new TypeError('Invalid original regional selection preview');
  if(!regions.length)
    return Object.freeze({reason:'empty',nextCursor:cursor,
      key:null,region:null,record:null,evictKey:null});
  if(cursor===Number.MAX_SAFE_INTEGER)
    throw new TypeError('Original regional cursor overflow');
  const width=Math.min(regions.length,SOURCE_ECOLOGY_MAX_REGIONS);
  const picked=regions[cursor%width],nextCursor=cursor+1;
  const valid=isValidRegion(picked);
  if(typeof valid!=='boolean')
    throw new TypeError('Unverified original region validity');
  if(!valid)
    return Object.freeze({reason:'invalid-region',nextCursor,
      key:null,region:null,record:null,evictKey:null});
  const key=[picked.cx,picked.cz,picked.section].join(',');
  const known=records.find(([name])=>name===key);
  let evictKey=null;
  if(!known&&records.length===SOURCE_ECOLOGY_MAX_REGIONS){
    const stale=records.find(([,record])=>
      record?.next<=time-SOURCE_ECOLOGY_REPLENISH_SECONDS);
    if(!stale)
      return Object.freeze({reason:'capacity',nextCursor,
        key:null,region:null,record:null,evictKey:null});
    evictKey=stale[0];
  }
  return Object.freeze({reason:'selected',nextCursor,key,
    region:Object.freeze({
      cx:picked.cx,cz:picked.cz,section:picked.section,feet:picked.feet
    }),record:known?.[1]??null,evictKey});
}
