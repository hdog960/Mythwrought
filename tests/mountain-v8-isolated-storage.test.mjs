import test from 'node:test';import assert from 'node:assert/strict';
import {mountainV8Storage,mountainV8DatabaseFactory,V8_STORAGE_PREFIX,setMountainV8Active,V8_ACTIVE_KEY} from '../src/manual-biomes/mountain-v8-isolated-storage.mjs';
import {importWorldData} from '../src/persistence.mjs';
test('dedicated scope cannot enumerate or overwrite ordinary local keys',()=>{
 const m=new Map(),raw={get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
 raw.setItem('mythwrought-v002-world-77','ordinary');
 const scoped=mountainV8Storage(raw);scoped.setItem('mythwrought-v002-world-77','mountain');
 assert.equal(scoped.length,1);assert.equal(scoped.key(0),'mythwrought-v002-world-77');
 assert.equal(raw.getItem('mythwrought-v002-world-77'),'ordinary');
 raw.setItem('mythwrought-v002-world-77','old-tab');
 assert.equal(scoped.getItem('mythwrought-v002-world-77'),'mountain');
 setMountainV8Active(raw,true);assert.equal(raw.getItem(V8_ACTIVE_KEY),'1');assert.equal(scoped.getItem(V8_ACTIVE_KEY),null);
 setMountainV8Active(raw,false);assert.equal(raw.getItem(V8_ACTIVE_KEY),null);
 scoped.removeItem('mythwrought-v002-world-77');assert.equal(raw.getItem('mythwrought-v002-world-77'),'old-tab');
});
test('dedicated factory maps all actual database names and exposes only its inventory',async()=>{
 let names=[];const raw={open:(name,v)=>{names.push([name,v]);return {}},databases:async()=>[{name:'ordinary',version:1},{name:V8_STORAGE_PREFIX+'private',version:1}]};
 const f=mountainV8DatabaseFactory(raw);f.open('private',1);
 assert.deepEqual(names,[[V8_STORAGE_PREFIX+'private',1]]);assert.deepEqual(await f.databases(),[{name:'private',version:1}]);
});
test('ordinary flat import refuses every dedicated material ID',()=>{
 for(let id=500;id<=512;id++)assert.throws(()=>importWorldData(JSON.stringify({schema:1,seed:77,edits:[[0,0,0,id]]})),/require verified profile/);
});
