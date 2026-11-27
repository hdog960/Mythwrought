import test from 'node:test';
import assert from 'node:assert/strict';
import {featherSnowShelf,winterGroveMaterial} from '../../src/frostbound/s1-refinement.mjs';
import {FrostboundS1Candidate} from '../../src/frostbound/s1-candidate.mjs';
import {FrostboundS1Refined} from '../../src/frostbound/s1-refined-candidate.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,meshChunk} from '../../src/voxel.mjs';
import {LIVE_DISTRICT_SIZE} from '../../src/live-voxel-world.mjs';
const snow={name:'snow',weight:1};
test('feather only raised supported shelf, never fill depression or override cave/landmark',()=>{
 const p=new Map([[5,278],[6,278],[7,272]]),c={x:0,z:0,region:snow,plan:p,oldTop:5,readRaw:()=>0,caveAt:()=>undefined,neighborTop:()=>5,maxY:19};
 assert.deepEqual([...featherSnowShelf(c)],[[5,278],[6,272]]);assert.equal(p.get(7),272);
 for(const extra of [{neighborTop:()=>null},{neighborTop:()=>6},{readRaw:()=>4},{caveAt:()=>0},{region:{name:'desert',weight:1}},{oldTop:6}])assert.equal(featherSnowShelf({...c,...extra}),p);
});
test('only ordinary winter grove leaves converted; boundary and special tree preservation',()=>{
 assert.equal(winterGroveMaterial(7,snow,true,false),407);assert.equal(winterGroveMaterial(7,{name:'snow',weight:.55},true,false),406);
 for(const args of [[7,snow,false,false],[7,snow,true,true],[7,{name:'snow',weight:.47},true,false],[7,{name:'enchanted',weight:1},true,false],[4,snow,true,false]])assert.equal(winterGroveMaterial(...args),args[0]);
});
test('actual seed179 source terrain, natural leaf ownership and preserved special landmarks',()=>{
 const seed=179,a=new FrostboundS1Candidate(seed),b=new FrostboundS1Refined(seed);
 let sampled=0,feather=0,leaves=0,protectedLeaves=0,nonSnow=0,firstFeather=null,firstLeaf=null;
 for(let x=-320;x<=320;x+=4)for(let z=192;z<=832;z+=4){
  const r=v6BiomeAt(x,z,seed),p=a._columnPlan(x,z),q=b._columnPlan(x,z);sampled++;
  if(r?.name!=='snow')nonSnow++;
  if(JSON.stringify([...p])!==JSON.stringify([...q])){assert.equal(r.name,'snow');assert.equal(p.size,q.size+1);const top=Math.max(...p.keys());assert.equal(b.environmentCaves.get(x,top,z),undefined);assert.equal(b.get(x,top-1,z),q.get(top-1));feather++;firstFeather??=[x,top,z];}
  if(r?.name!=='snow')continue;
  for(let y=terrainHeight(x,z,seed)+1;y<=19;y++){
   if(a.get(x,y,z)!==7)continue;
   const actual=b.get(x,y,z),d=a.liveDistrictCache.get(Math.floor(x/LIVE_DISTRICT_SIZE)+','+Math.floor(z/LIVE_DISTRICT_SIZE));
   const match=t=>t?.cells?.some(c=>c[0]===x&&c[1]===y&&c[2]===z&&c[3]===7);
   const special=[d?.twinwood,d?.canopyGate,d?.archwood,d?.fallenGiant].some(match);
   if(special){assert.equal(actual,7);protectedLeaves++;}
   if(actual!==7){assert.ok([406,407].includes(actual));assert.ok(d?.trees.some(match));assert.ok(!special);assert.equal(b.environmentCaves.get(x,y,z),undefined);leaves++;firstLeaf??=[x,y,z];}
  }
 }
 assert.ok(feather>0&&leaves>0&&protectedLeaves>0);assert.ok(b._refinedColumns.size<=1024&&b._winterGroves.size<=48);
 const [x,y,z]=firstLeaf;assert.equal(b.set(x,y,z,0),true);assert.equal(b.get(x,y,z),0);assert.throws(()=>b.save(),/not a registered/);
 const old=meshChunk(a,0,0),next=meshChunk(b,0,0);assert.deepEqual(next,old);
 console.log('FROSTBOUND_REFINED '+JSON.stringify({sampled,feather,leaves,protectedLeaves,nonSnow,firstFeather,firstLeaf,plainsBytes:old.byteLength}));
});
