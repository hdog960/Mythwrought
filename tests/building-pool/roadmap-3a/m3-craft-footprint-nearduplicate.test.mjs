import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {createM3CraftSecondPool} from '../../../src/building-pool/roadmap-3a/m3-craft-second-variants.mjs';

// Foundation sets are ACTUAL 2D construction masks, not metadata, colors,
// names, roof pigments or arbitrary model parameters. Compare under all
// eight D4 rotations/reflections and translation to reject near-reskins.
function ground(b){
 const floor=b.modules.find(m=>m.role==='foundation');
 assert.ok(floor&&floor.cells.length>100,b.id+' lacks true ground voxels');
 return floor.cells.map(c=>[c[0],c[2]]);
}
function nearSimilarity(a,b){
 const A=ground(a),B=ground(b),minA=[Math.min(...A.map(v=>v[0])),Math.min(...A.map(v=>v[1]))];
 const aa=new Set(A.map(([x,z])=>[x-minA[0],z-minA[1]].join(',')));
 let best=0;
 for(let rotation=0;rotation<4;rotation++)for(const mirror of [false,true]){
  const transformed=B.map(([x,z])=>{
   if(mirror)x=-x;
   for(let i=0;i<rotation;i++){const t=-z;z=x;x=t;}
   return [x,z];
  });
  const minB=[Math.min(...transformed.map(v=>v[0])),Math.min(...transformed.map(v=>v[1]))];
  const bb=new Set(transformed.map(([x,z])=>[x-minB[0],z-minB[1]].join(',')));
  let common=0;for(const k of aa)if(bb.has(k))common++;
  const jaccard=common/(aa.size+bb.size-common);
  best=Math.max(best,jaccard);
 }
 return best;
}
test('30 M3 new craft structures reject near-identical oriented footprints and old variant-1 reskins at <94% D4-normalized intersection/union',()=>{
 const earlier=[...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool()];
 const newer=createM3CraftSecondPool();
 assert.equal(newer.length,30);
 const comparisons=[];
 for(const a of newer){
  const prior=earlier.find(x=>x.type===a.type&&x.biome===a.biome&&x.size===a.size&&x.variant===1);
  assert.ok(prior,'missing true prior source geometry '+a.id);
  assert.equal(a.spaces.length,4);
  assert.equal(prior.spaces.length,2);
  const similarity=nearSimilarity(a,prior);
  comparisons.push({a:a.id,b:prior.id,similarity,kind:'old-variant'});
  assert.ok(similarity<0.94,'near-duplicate old architected footprint '+a.id+' '+similarity);
 }
 for(let i=0;i<newer.length;i++)for(let j=i+1;j<newer.length;j++){
  const a=newer[i],b=newer[j];
  if(a.type!==b.type||a.size!==b.size)continue;
  const similarity=nearSimilarity(a,b);
  comparisons.push({a:a.id,b:b.id,similarity,kind:'inter-biome'});
  assert.ok(similarity<0.94,'near-duplicate category-size architecture '+a.id+' / '+b.id+' '+similarity);
 }
 assert.ok(comparisons.length>=80);
 const max=Math.max(...comparisons.map(x=>x.similarity));
 assert.ok(max<0.94);
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m3-second');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'M3_NEAR_DUPLICATE_REJECTION.json'),JSON.stringify({
  method:'physical-foundation-ground-mask, D4 rotations/reflections, translation-normalized Jaccard',
  thresholdExclusive:0.94,comparisons:comparisons.length,maxSimilarity:max,
  rejectedAtOrAboveThreshold:0,allArchitecturesHaveActualCells:true,
  details:comparisons.sort((a,b)=>b.similarity-a.similarity)
 },null,2)+'\n');
 console.log('M3 original near-duplicate architecture scan '+comparisons.length+' pairs; peak '+max.toFixed(4)+' <0.94, zero near-reskins accepted');
});
