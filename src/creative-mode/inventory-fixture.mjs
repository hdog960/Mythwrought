// M3-only synthetic contract fixtures. No IDs here exist in the game registry.
// Mock rows satisfy the same shape guards as authorized live snapshots, but
// the preview MUST visibly label them as synthetic and never allow placement.
export const FIXTURE_CATEGORY_NAMES=Object.freeze(['Stone','Timber','Decor','Mechanisms','Nature']);
export function makeInventoryContractFixture(count=1632){
  if(!Number.isSafeInteger(count)||count<0||count>20000)throw RangeError('Invalid fixture count');
  return Array.from({length:count},(_,i)=>{
    const category=FIXTURE_CATEGORY_NAMES[i%FIXTURE_CATEGORY_NAMES.length];
    const number=String(i+1).padStart(5,'0');
    return {id:'fixture:'+number,name:category+' fixture '+number,category,
      kind:category==='Decor'||category==='Mechanisms'?'object':'block',
      registered:true,placeable:true,placementRules:{requiresSupport:category==='Decor'},
      syntheticFixture:true};
  });
}
