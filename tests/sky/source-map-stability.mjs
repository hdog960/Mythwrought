// Browser acceptance helper: read actual current-world discovery map bytes.
// Never prefill fog, alter saves, seed a world, or substitute fake screenshots.
import assert from 'node:assert/strict';
export async function waitForRealStableMap(page,seed){
  assert.ok(Number.isInteger(seed),'Expected genuine admitted world seed');
  const key='mythwrought-exploration-v1-'+seed;
  await page.waitForFunction(({key,seed})=>{
    const raw=localStorage.getItem(key);
    if(!raw)return false;
    try{
      const parsed=JSON.parse(raw);
      return parsed.version===1&&parsed.seed===seed&&parsed.cellSize===4&&
        Array.isArray(parsed.cells)&&parsed.cells.length>=25&&
        new Set(parsed.cells).size===parsed.cells.length;
    }catch{return false;}
  },{key,seed},{timeout:20000});
  // The real exploration map is saved asynchronously. Check stabilization
  // without writing storage, otherwise a delayed natural write looks like
  // a sky control mutation and gives misleading false positives.
  let previous=await page.evaluate(key=>localStorage.getItem(key),key);
  let stable=false;
  for(let attempt=0;attempt<8;attempt++){
    await page.waitForTimeout(350);
    const next=await page.evaluate(key=>localStorage.getItem(key),key);
    if(previous===next){stable=true;break;}
    previous=next;
  }
  assert.ok(stable,'Source discovery map never settled to durable bytes');
  return Object.freeze({key,raw:previous,cells:JSON.parse(previous).cells.length});
}
