// Builder 1A M0-only quota and inheritance contract. No live game or legacy imports.
// These records identify legacy candidates; they are NOT migrated 3D geometry.
export const SCHEMA='mythwrought.building-pool.roadmap-1a.v1';
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
export const PER_BIOME_SIZE=Object.freeze({house:20,tavern:5,inn:5});
export const TARGET=450;
export const LEGACY_ORIGIN=Object.freeze({
  pr:121,head:'88a9e410a0eda7cf961cb6b624241666eb3a48a1',
  source:'src/building-pool/roadmap-1/m1-buildings.mjs',
  generatorBlob:'7187753ae344217d7fa81da296b9122b68f3ca97',
  designBlob:'f9d45b0b17cbc217fd24cba5f684eb54aa572cd5',
  schemaBlob:'ea1cb53b48dd7f4c51c8da69bf59531d1226aad2'
});
function check(value,condition,message){if(!condition)throw Error(message);return value;}
export function candidateId(category,biome,size,index){
  check(category,Object.hasOwn(PER_BIOME_SIZE,category),'category outside Builder 1A');
  check(biome,BIOMES.includes(biome),'unsupported biome');
  check(size,SIZES.includes(size),'unsupported size');
  check(index,Number.isInteger(index)&&index>=1&&index<=PER_BIOME_SIZE[category],'invalid ordinal');
  return 'r1:'+category+':'+biome+':'+size+':'+String(index).padStart(3,'0');
}
// All 450 slots are identities, NOT authored/committed voxel buildings.
export function allocatedIdentities(){
  const out=[];
  for(const category of Object.keys(PER_BIOME_SIZE))
    for(const biome of BIOMES)for(const size of SIZES)
      for(let index=1;index<=PER_BIOME_SIZE[category];index++)
        out.push(candidateId(category,biome,size,index));
  return out;
}
// Original Roadmap 1 compiled one house/tavern per biome×size, with ordinal
// small=001, medium=002, large=003. Stable belongs exclusively to Builder 1B.
export function pendingLegacyImports(){
  const out=[];
  for(const category of ['house','tavern'])for(const biome of BIOMES)
    for(const [zeroBased,size] of SIZES.entries()){
      out.push(Object.freeze({
        originalId:candidateId(category,biome,size,zeroBased+1),
        destinationCategory:category,biome,size,
        sourcePR:LEGACY_ORIGIN.pr,sourceHead:LEGACY_ORIGIN.head,
        generatorBlob:LEGACY_ORIGIN.generatorBlob,designBlob:LEGACY_ORIGIN.designBlob,
        geometryImported:false,geometryFingerprint:null,
        status:'pending-source-exact-coordinate-extraction'
      }));
    }
  return Object.freeze(out);
}
export function verifyM0Roster(){
  const ids=allocatedIdentities(),inherited=pendingLegacyImports();
  check(ids,ids.length===TARGET&&new Set(ids).size===TARGET,'quota/duplicate failure');
  check(inherited,inherited.length===30&&new Set(inherited.map(x=>x.originalId)).size===30,'legacy identity collision');
  for(const r of inherited)
    check(r.originalId,ids.includes(r.originalId)&&!r.geometryImported&&r.geometryFingerprint===null,'unverified inherited geometry');
  return Object.freeze({target:TARGET,legacyAvailable:inherited.length,legacyMigrated:0,newAuthored:0,creatorApproved:0,integrated:0});
}
