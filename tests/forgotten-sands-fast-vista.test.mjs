import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {createP0CachedVista} from '../src/manual-biomes/forgotten-sands-cached-vista.mjs';
import {createP0FastVista,coalesceP0VisibleRanges} from '../src/manual-biomes/forgotten-sands-fast-vista.mjs';
test('optimized cold original source reads preserve exact packed bytes and coalesced partial draws',()=>{
 for(const index of [0,1,2,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),mid=spec.modules[1],eye=[mid.x-48,17,mid.z];
  let reads=0;const wrap=w=>({get(...a){reads++;return w.get(...a);}});
  const opts={eye,snapshotCurrent:group.snapshotCurrent};
  const original=createP0CachedVista(wrap(world),wrap(group.view),spec.modules,opts),baselineReads=reads;reads=0;
  const fast=createP0FastVista(wrap(world),wrap(group.view),spec.modules,opts),fastReads=reads;
  assert.deepEqual(fast.copyVertices(),original.copyVertices());assert.deepEqual(fast.ranges,original.ranges);
  assert.deepEqual(fast.bounds,original.bounds);assert.ok(fastReads<baselineReads*.65);
  let peakBefore=0,peakAfter=0,states=0;const resident=new Set();
  function check(){
   const expected=fast.select([...resident]).ranges,merged=coalesceP0VisibleRanges(fast.ranges,resident);
   const expand=rs=>rs.flatMap(r=>Array.from({length:r.count},(_,i)=>r.start+i));
   assert.deepEqual(expand(merged),expand(expected));
   peakBefore=Math.max(peakBefore,expected.length);peakAfter=Math.max(peakAfter,merged.length);states++;
  }
  for(const distance of [48,40,32,25,16,25,48]){
   const wanted=new Set(p0BenchmarkWindow(Math.floor((mid.x-distance)/16),Math.floor(mid.z/16),15).map(k=>k.key));
   for(const k of resident)if(!wanted.has(k)){resident.delete(k);check();}
   for(const k of wanted)if(!resident.has(k)){resident.add(k);check();}
  }
  assert.ok(peakAfter<peakBefore);assert.equal(reads,fastReads);
  console.log('P0 FAST VISTA',JSON.stringify({index,seed:spec.seed,baselineReads,fastReads,baselineMs:original.stats.buildMs,fastMs:fast.stats.buildMs,bytes:fast.stats.bytes,states,peakBefore,peakAfter}));
 }
});
