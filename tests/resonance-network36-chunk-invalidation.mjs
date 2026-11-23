import test from 'node:test';
import assert from 'node:assert/strict';
import {planChunkInvalidation as plan} from '../src/resonance/network36/chunk-invalidation.mjs';
const c=(key,epoch,loaded=true)=>({key,epoch,loaded});
test('unchanged cold snapshot is stable',()=>assert.equal(plan({previous:[c('a',1)],current:[c('a',1)]}).changed,false));
test('edits and loads are sorted independent of input order',()=>{
 const r=plan({previous:[c('z',1)],current:[c('z',2),c('a',0)]});
 assert.deepEqual(r.changes,[{key:'a',reason:'load'},{key:'z',reason:'edit'}]);
});
test('unload invalidates old connectivity',()=>{
 assert.deepEqual(plan({previous:[c('a',1)],current:[]}).changes,[{key:'a',reason:'unload'}]);
});
test('unloaded to loaded is an explicit admission',()=>{
 assert.equal(plan({previous:[c('a',1,false)],current:[c('a',1,true)]}).changes[0].reason,'load');
});
test('stale epoch, duplicates and malformed descriptors fail closed',()=>{
 assert.throws(()=>plan({previous:[c('a',2)],current:[c('a',1)]}));
 assert.throws(()=>plan({current:[c('a',1),c('a',1)]}));
 assert.throws(()=>plan({current:[{key:'a',epoch:1,loaded:1}]}));
});
test('overflow never publishes a partial change set',()=>{
 const r=plan({current:[c('a',1),c('b',1)],maxChanges:1});
 assert.equal(r.admitted,false);assert.deepEqual(r.changes,[]);assert.equal(r.required,2);
});
test('maximum 25 chunk envelope enforced',()=>{
 assert.throws(()=>plan({current:Array.from({length:26},(_,i)=>c(String(i),1))}));
});
