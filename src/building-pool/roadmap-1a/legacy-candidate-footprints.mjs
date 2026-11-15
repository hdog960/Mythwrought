// Shadow *planning* footprint for physically authored but UNMERGED external candidates.
// Source observed at Pack 5 PR #119, residential-furnishings.mjs:
// family pack5:082 (Beds) contains head cell [0,0,0] and foot cell [0,0,1].
// These cell offsets are evidence of candidate intent, NOT approved collision AABBs,
// runtime registration, placement APIs, or save-compatible orientation state.
export const BED_SOURCE = Object.freeze({asset:'pack5:082',source:'src/block-packs/pack-5/residential-furnishings.mjs',packPR:119,kind:'legacy-candidate-footprint',integratedCatalog:true,physicalFitCertified:false});
export function extraCandidateCells(asset,at,orientation){
 if(asset!=='pack5:082')return [];
 if(!Array.isArray(at)||at.length!==3||at.some(x=>!Number.isInteger(x)))throw Error('Candidate bed anchor must be a 3D integer cell');
 // This Roadmap only authors north-facing bed candidates. Pack5 uses +Z length
 // with rotation=0. Other rotations require explicit approved sidecar ABI.
 if(orientation!=='north')throw Error('Candidate bed is only planned for north / Pack5 rotation 0');
 return [[at[0],at[1],at[2]+1]];
}
