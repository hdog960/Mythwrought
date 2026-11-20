// Independent all-pool Roadmap C duplicate/shape defense. Original B source files are
// read-only. 146 accepted original B + 59 accepted staged B compared against one C ID.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {createCDesertSmallMarket} from '../../../src/building-pool/roadmap-c-trades/wave1-desert-market.mjs';

const canonicalDir=new URL('../../../src/building-pool/roadmap-2b/',import.meta.url);
const bDir=new URL('../../../src/building-pool/roadmap-b/',import.meta.url);
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
 const ledger=JSON.parse(await readFile(new URL('m1-authoring-ledger.json',canonicalDir),'utf8'));
 const orig=JSON.parse(await readFile(new URL('manifest.json',canonicalDir),'utf8'));
 const expected=new Set([...ledger.originals.map(x=>x.id),...orig.inherited.map(x=>x.newId)]);
 assert.equal(expected.size,146);assert.equal(c.size,146);
 assert.deepEqual(new Set(c.keys()),expected,'canonical 2B sources drifted from 146 exact authored identities');
 assert.equal(b.size,59,'B Wave15 staged count must remain intact');
 for(const id of b.keys())assert.ok(!c.has(id),'B staged source overwrote an accepted canonical ID '+id);
 assert.ok(!c.has('r2:market-square:desert:small:01'));
 assert.ok(!b.has('r2:market-square:desert:small:01'));
 assert.equal(new Set([...c.keys(),...b.keys()]).size,205);
});
test('first C market is physically non-cloned against every preserved same-category 2B source under all eight D4 symmetries',async()=>{
 const c=await canonical(),b=await stageB(),fresh=createCDesertSmallMarket(),f=floor(fresh);
 let count=0,max=0,closest=null;
 for(const other of [...c.values(),...b.values()].filter(x=>x.category===fresh.category)){
  const score=d4max(f,floor(other));
  if(score>max){max=score;closest=other.id;}
  assert.ok(score<0.85,fresh.id+' mirrored '+other.id+' eight-way floor IoU '+score.toFixed(8));
  count++;
 }
 assert.ok(count>=29,'expected all historically protected market square sources');
 console.log(JSON.stringify({id:fresh.id,comparisons:count,maxD4IoU:max,nearest:closest,sourceOnly:true}));
});
