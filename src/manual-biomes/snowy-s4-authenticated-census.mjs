// Read-only S4 engineering ledger from authentic, previously verified M7
// source-reader evidence. Never modifies natural block IDs or schema-1 saves.
// In particular, authored-column failures and detached S2 cap eligibility
// are different sets; do not infer that all un-authored columns are fixable.
const CAP_IDS=Object.freeze(['272','276','279']);
const REASONS=Object.freeze([
  'protected-old-substrate:0:original',
  'above-old-ground:3:original',
  'above-old-ground:4:original',
  'above-old-ground:7:original'
]);
const VERIFIED_ARTIFACT_SHA256='62b2561a0b7700716a2ba47caaba151854668d6867124b5ee1f5be5d0d32a750';
const VERIFIED_READER_SHA256='8975df0311467d473f814e9a268e34fb749171591b50b116cd8016a901446878';
const positive=n=>Number.isSafeInteger(n)&&n>=0;
const validSha=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const own=(obj,k)=>Object.prototype.hasOwnProperty.call(obj,k);

export function summarizeSnowS4AuthenticatedReader(evidence){
  if(evidence?.source?.artifactId!==14737638885||
    evidence.source.protectedHead!=='59e449be7e73b25f259c4c72855cfb638a056517'||
    !validSha(evidence.source.artifactSha256)||
    evidence.source.artifactSha256!==VERIFIED_ARTIFACT_SHA256||
    !validSha(evidence.source.readerMetricsSha256)||
    evidence.source.readerMetricsSha256!==VERIFIED_READER_SHA256||
    !Array.isArray(evidence.seedResults)||evidence.seedResults.length!==2)
    throw new TypeError('Unrecognized authentic M7 S4 evidence');
  const found=new Set(),rows=[],totals={interior:0,authored:0,
    unauthored:0,retainedGrass:0,ice:0,snow:0,rime:0,
    protectedOriginalAir:0,protectedOriginalStone:0,
    protectedOriginalWood:0,protectedOriginalLeaves:0};
  for(const row of evidence.seedResults){
    if(![179,2026].includes(row?.seed)||found.has(row.seed)||
      row.step!==8||!positive(row.validInterior)||row.validInterior!==1681||
      row.allSnow!==row.validInterior||
      ![row.uncoveredGrass,row.emptyColumns,row.blockedAbove,
        row.otherProtected].every(positive)||
      !row.caps||typeof row.caps!=='object'||Array.isArray(row.caps)||
      Object.keys(row.caps).sort().join(',')!==CAP_IDS.join(',')||
      !CAP_IDS.every(k=>positive(row.caps[k]))||
      !row.rejectionReasons||typeof row.rejectionReasons!=='object'||
      Array.isArray(row.rejectionReasons)||
      Object.keys(row.rejectionReasons).some(k=>!REASONS.includes(k))||
      Object.values(row.rejectionReasons).some(n=>!positive(n)))
      throw new TypeError('Invalid original M7 physical cap census');
    found.add(row.seed);
    const authored=CAP_IDS.reduce((a,id)=>a+row.caps[id],0);
    const wood=row.rejectionReasons['above-old-ground:4:original']??0;
    const stone=row.rejectionReasons['above-old-ground:3:original']??0;
    const leaves=row.rejectionReasons['above-old-ground:7:original']??0;
    const air=row.rejectionReasons['protected-old-substrate:0:original']??0;
    if(authored+row.emptyColumns!==row.validInterior||
      row.emptyColumns!==row.blockedAbove+row.otherProtected||
      air!==row.otherProtected||
      stone+wood+leaves!==row.blockedAbove||
      row.uncoveredGrass>row.emptyColumns)
      throw new TypeError('Original M7 S4 material/protection conservation failed');
    const item=Object.freeze({seed:row.seed,authored,unauthored:row.emptyColumns,
      snow:row.caps['272'],ice:row.caps['276'],rime:row.caps['279'],
      retainedGrass:row.uncoveredGrass,originalAir:air,
      originalStone:stone,originalWood:wood,originalLeaves:leaves});
    rows.push(item);
    totals.interior+=row.validInterior;totals.authored+=authored;
    totals.unauthored+=item.unauthored;totals.retainedGrass+=item.retainedGrass;
    for(const id of ['ice','snow','rime'])totals[id]+=item[id];
    totals.protectedOriginalAir+=air;totals.protectedOriginalStone+=stone;
    totals.protectedOriginalWood+=wood;totals.protectedOriginalLeaves+=leaves;
  }
  rows.sort((a,b)=>a.seed-b.seed);
  if(totals.unauthored!==totals.protectedOriginalAir+
    totals.protectedOriginalStone+totals.protectedOriginalWood+
    totals.protectedOriginalLeaves)throw new TypeError('S4 totals no longer conserved');
  return Object.freeze({kind:'detached-source-authenticated-M7-snow-S4',
    state:'read-only-no-current-world-changes',
    protectedHead:evidence.source.protectedHead,
    sourceArtifactId:evidence.source.artifactId,
    rows:Object.freeze(rows),totals:Object.freeze(totals),
    proportions:Object.freeze({authored:totals.authored/totals.interior,
      iceOfInterior:totals.ice/totals.interior,
      rockOfInterior:totals.rime/totals.interior})});
}
