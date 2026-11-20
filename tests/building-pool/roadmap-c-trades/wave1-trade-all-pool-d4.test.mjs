// Independent all-pool Roadmap C duplicate/shape defense. Original B source files are
// read-only. 146 accepted original B + 59 accepted staged B compared against one C ID.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {createCDesertSmallMarket} from '../../../src/building-pool/roadmap-c-trades/wave1-desert-market.mjs';
import {createCRiverbendTailor} from '../../../src/building-pool/roadmap-c-trades/wave2-riverbend-tailor.mjs';
import {createCCopperfordButcher} from '../../../src/building-pool/roadmap-c-trades/wave3-copperford-butcher.mjs';
import {createCSilverfinchJeweler} from '../../../src/building-pool/roadmap-c-trades/wave4-silverfinch-jeweler.mjs';
import {createCWrenfieldBookshop} from '../../../src/building-pool/roadmap-c-trades/wave5-wrenfield-bookshop.mjs';

const canonicalDir=new URL('../../../src/building-pool/roadmap-2b/',import.meta.url);
const bDir=new URL('../../../src/building-pool/roadmap-b/',import.meta.url);
const ownersUrl=new URL('../../../docs/building-pool/roadmap-c-trades/C_2B_FROZEN_OWNER_WITNESS_V1.json',import.meta.url);
function gather(thing,map){
 if(!thing||typeof thing!=='object')return;
 if(Array.isArray(thing)){for(const item of thing)gather(item,map);return;}
 if(typeof thing.id==='string'&&thing.id.startsWith('r2:')&&Array.isArray(thing.voxels)){
  if(map.has(thing.id))assert.deepEqual(map.get(thing.id).voxels,thing.voxels,'duplicate source ID with differing geometry '+thing.id);
  map.set(thing.id,thing);
 }
}
async function canonical(){
 const map=new Map();
 for(const file of (await readdir(canonicalDir)).filter(x=>x.endsWith('.mjs')&&x!=='schema.mjs'&&x!=='catalog.mjs').sort()){
  const mod=await import(new URL(file,canonicalDir));
  for(const value of Object.values(mod))gather(value,map);
 }
 return map;
}
async function stageB(){
 const map=new Map();
 for(let wave=1;wave<=15;wave++){
  const src=await import(new URL('wave'+wave+'-trades-b2.mjs',bDir));
  const getter=src['getRoadmapBWave'+wave+'B2'];
  assert.equal(typeof getter,'function','B source getter missing Wave '+wave);
  gather(getter(),map);
 }
 const ironpass=await import(new URL('b2-ironpass-market.mjs',bDir));
 gather(ironpass.createIronpassHorseshoeExchange(),map);
 return map;
}
const floor=b=>b.voxels.filter(v=>v.kind==='floor').map(v=>[v.x,v.z]);
function normalize(points){
 const x=Math.min(...points.map(p=>p[0])),z=Math.min(...points.map(p=>p[1]));
 return new Set(points.map(p=>(p[0]-x)+','+(p[1]-z)));
}
function d4max(a,b){
 const B=normalize(b),totalB=B.size;
 let max=0;
 for(let mirror=0;mirror<2;mirror++)for(let n=0;n<4;n++){
  const rotated=a.map(([xx,zz])=>{
   let x=mirror?-xx:xx,z=zz;
   for(let turn=0;turn<n;turn++){const tmp=x;x=-z;z=tmp;}
   return [x,z];
  });
  const A=normalize(rotated);
  let common=0;for(const p of A)if(B.has(p))common++;
  max=Math.max(max,common/(A.size+totalB-common));
 }
 return max;
}
test('C trade imports preserve 146 canonical plus 59 staged distinct B records before any C source can be accepted',async()=>{
 const c=await canonical(),b=await stageB();
 const frozenOwners=JSON.parse(await readFile(ownersUrl,'utf8')).ownerIds;
 assert.equal(frozenOwners.B.length,205);
 assert.equal(frozenOwners.C.length,146);
 assert.equal(frozenOwners.D.length,69);
 assert.deepEqual(new Set([...frozenOwners.B,...frozenOwners.C,...frozenOwners.D]).size,420,
  'frozen owner catalog is missing IDs');
 assert.deepEqual([...c.keys(),...b.keys()].sort(),frozenOwners.B,
  'preserved Builder B exact 205 identities must match frozen fence');
 const ledger=JSON.parse(await readFile(new URL('m1-authoring-ledger.json',canonicalDir),'utf8'));
 const orig=JSON.parse(await readFile(new URL('manifest.json',canonicalDir),'utf8'));
 const expected=new Set([...ledger.originals.map(x=>x.id),...orig.inherited.map(x=>x.newId)]);
 assert.equal(expected.size,146);assert.equal(c.size,146);
 assert.deepEqual(new Set(c.keys()),expected,'canonical 2B sources drifted from 146 exact authored identities');
 assert.equal(b.size,59,'B Wave15 staged count must remain intact');
 for(const id of b.keys())assert.ok(!c.has(id),'B staged source overwrote an accepted canonical ID '+id);
 assert.ok(!c.has('r2:market-square:desert:small:01'));
 assert.ok(!b.has('r2:market-square:desert:small:01'));
 assert.ok(!c.has('r2:tailor:temperate:small:03'));
 assert.ok(!b.has('r2:tailor:temperate:small:03'));
 const fresh=[createCDesertSmallMarket(),createCRiverbendTailor(),createCCopperfordButcher(),createCSilverfinchJeweler(),createCWrenfieldBookshop()];
 for(const item of fresh){
  assert.ok(frozenOwners.C.includes(item.id),'original blueprint uses non-C-owned frozen ID '+item.id);
  assert.ok(!frozenOwners.B.includes(item.id)&&!frozenOwners.D.includes(item.id),'source ownership crossed protected B or D');
  assert.ok(!c.has(item.id)&&!b.has(item.id),'already authored protected identity reused');
 }
 assert.equal(new Set(fresh.map(x=>x.id)).size,5);
 assert.equal(new Set([...c.keys(),...b.keys()]).size,205);
});
test('all five C-owned new original trade sources are strictly D4-distinct against ALL preserved same-category 2B sources',async()=>{
 const canonicalItems=await canonical(),stagedItems=await stageB();
 const protectedItems=[...canonicalItems.values(),...stagedItems.values()];
 const newSources=[createCDesertSmallMarket(),createCRiverbendTailor(),createCCopperfordButcher(),createCSilverfinchJeweler(),createCWrenfieldBookshop()];
 assert.equal(new Set(newSources.map(s=>s.id)).size,5);
 for(const fresh of newSources){
  const points=floor(fresh),otherSources=protectedItems.filter(x=>x.category===fresh.category);
  let max=0,closest=null,count=0;
  for(const other of otherSources){
   const score=d4max(points,floor(other));
   if(score>max){max=score;closest=other.id;}
   assert.ok(score<0.85,fresh.id+' structurally mirrored '+other.id+' D4 floor IoU '+score.toFixed(8));
   count++;
  }
  assert.ok(count>=15,'not enough protected historical same-category source comparisons for '+fresh.id);
  console.log(JSON.stringify({id:fresh.id,protectedSameCategoryComparisons:count,maxD4IoU:max,nearestProtectedId:closest,sourceOnly:true}));
 }
});
