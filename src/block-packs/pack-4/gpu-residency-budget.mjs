/**
 * Mythwrought Pack 4 opt-in physical-asset GPU residency BUDGET PLANNER.
 * This does not allocate GPU buffers, install blocks, edit a world, run a
 * renderer, cull the actual game, modify saves or measure iPhone FPS.
 * Candidate costs come from the ORIGINAL Pack 4 opaque/translucent typed meshes.
 * The final five-pack integrator must prove the actual renderer separately.
 */
export const PACK4_STAGING_LIMITS=Object.freeze({
  maxCandidates:4096,
  maxVisible:256,
  maxResidentBytes:2*1024*1024,
  maxPageBytes:384*1024,
  maxPages:8
});
function goodCell(value){
  return Array.isArray(value)&&value.length===3&&value.every(Number.isSafeInteger);
}
function compareNumber(a,b){return a<b?-1:a>b?1:0;}
function checkInt(value,min,max,name){
  if(!Number.isSafeInteger(value)||value<min||value>max)
    throw new RangeError('Invalid Pack 4 '+name);
}
function validateLimits(limits){
  if(!limits||typeof limits!=='object'||Array.isArray(limits))
    throw new TypeError('Invalid Pack 4 GPU planner limits');
  const v={...PACK4_STAGING_LIMITS,...limits};
  checkInt(v.maxCandidates,1,4096,'candidate limit');
  checkInt(v.maxVisible,1,4096,'visibility limit');
  checkInt(v.maxResidentBytes,1,2*1024*1024,'resident byte limit');
  checkInt(v.maxPageBytes,1,v.maxResidentBytes,'page byte limit');
  checkInt(v.maxPages,1,8,'page count limit');
  return v;
}
function bytesFor(asset){
  const mesh=asset?.previewMesh;
  if(!mesh||mesh.stride!==10||
     !(mesh.opaque instanceof Float32Array)||
     !(mesh.translucent instanceof Float32Array)||
     mesh.opaque.length%10||mesh.translucent.length%10)
    throw new TypeError('Pack 4 GPU budget requires original 10-float mesh streams');
  const bytes=mesh.opaque.byteLength+mesh.translucent.byteLength;
  if(!Number.isSafeInteger(bytes)||bytes<=0)
    throw new TypeError('Invalid Pack 4 original GPU mesh byte size');
  return bytes;
}
/**
 * @param {Array<{at:number[], candidateId:number, rotation:number}>} placements
 * @param {(id:number, rotation:number)=>{previewMesh:object}} sourceAsset
 * @param {{viewerCell?:number[],limits?:object}} options
 * @returns Frozen, deterministic, inspection-only page/overflow descriptor.
 */
export function planPack4StagingBudget(placements,sourceAsset,{viewerCell=[0,0,0],limits={}}={}){
  if(!Array.isArray(placements)||!goodCell(viewerCell)||typeof sourceAsset!=='function')
    throw new TypeError('Invalid Pack 4 GPU staging request');
  const conf=validateLimits(limits);
  if(placements.length>conf.maxCandidates)
    throw new RangeError('Pack 4 staging candidate input exceeds cap');
  const keys=new Set();
  const candidates=placements.map((p)=>{
    if(!p||typeof p!=='object'||!goodCell(p.at))
      throw new TypeError('Invalid Pack 4 construction placement');
    checkInt(p.candidateId,159,181,'candidate ID');
    checkInt(p.rotation,0,3,'rotation');
    const key=p.at.join(',');
    if(keys.has(key))throw new TypeError('Duplicate physical Pack 4 construction cell');
    keys.add(key);
    const distance=Math.hypot(...p.at.map((v,i)=>v-viewerCell[i]));
    return {at:[...p.at],candidateId:p.candidateId,
      rotation:p.rotation,distance};
  }).sort((a,b)=>compareNumber(a.distance,b.distance)||
      compareNumber(a.at[0],b.at[0])||compareNumber(a.at[1],b.at[1])||
      compareNumber(a.at[2],b.at[2])||
      compareNumber(a.candidateId,b.candidateId)||
      compareNumber(a.rotation,b.rotation));
  const pages=[],excluded=[];
  let used=0,accepted=0;
  for(const candidate of candidates){
    if(accepted>=conf.maxVisible){
      excluded.push(Object.freeze({...candidate,reason:'visible-cap'}));
      continue;
    }
    const asset=sourceAsset(candidate.candidateId,candidate.rotation);
    if(asset?.id!==undefined&&asset.id!==candidate.candidateId)
      throw new TypeError('Pack 4 GPU source returned mismatched physical ID');
    if(asset?.rotation!==undefined&&asset.rotation!==candidate.rotation)
      throw new TypeError('Pack 4 GPU source returned mismatched orientation');
    const bytes=bytesFor(asset);
    const row=Object.freeze({at:Object.freeze(candidate.at),
      candidateId:candidate.candidateId,rotation:candidate.rotation,
      distance:candidate.distance,bytes});
    if(bytes>conf.maxPageBytes){excluded.push(Object.freeze({...row,reason:'oversize'}));continue;}
    if(used+bytes>conf.maxResidentBytes){
      excluded.push(Object.freeze({...row,reason:'resident-byte-cap'}));continue;
    }
    const last=pages.at(-1);
    let page=last&&last.bytes+bytes<=conf.maxPageBytes?last:null;
    if(!page){
      if(pages.length>=conf.maxPages){
        excluded.push(Object.freeze({...row,reason:'page-cap'}));continue;
      }
      page={index:pages.length,bytes:0,items:[]};pages.push(page);
    }
    page.bytes+=bytes;page.items.push(row);
    accepted++;used+=bytes;
  }
  return Object.freeze({
    mode:'review-only-not-runtime',
    memoryBudgetIsActualIphoneMeasurement:false,
    allWorldItemsPreservedOutsideThisView:true,
    candidateCount:candidates.length,selectedCount:accepted,
    excludedCount:excluded.length,residentBytes:used,
    budgets:Object.freeze({...conf}),
    pages:Object.freeze(pages.map(p=>Object.freeze({
      index:p.index,bytes:p.bytes,items:Object.freeze(p.items)
    }))),
    excluded:Object.freeze(excluded)
  });
}