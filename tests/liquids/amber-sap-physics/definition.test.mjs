import test from 'node:test';
import assert from 'node:assert/strict';
import {AMBER_SAP_DEFINITION as d,sampleSapContact,sampleSapRetention,createSapSource} from '../../../src/liquids/amber-sap/physics/definition.mjs';
const cell=(units=4)=>Object.freeze({x:0,y:0,z:0,id:'amber-sap',units,quantities:Object.freeze({})});
const config={x:0,y:0,z:0,treeId:'tree:1',stock:5,rate:2};
function fixture(){let c=null,open=true;return {getCell:()=>c,insert(x,y,z,id,n){if(!open)return false;c=cell((c?.units??0)+n);return true;},set(v){c=v;},block(){open=false;}};}
test('v1 descriptor is frozen and uses minimal positive flow limits',()=>{assert.deepEqual(d,{id:'amber-sap',gravityLimit:1,lateralLimit:1});assert.ok(Object.isFrozen(d));});
test('contact is a bounded signal, never a movement mutation',()=>{const e={samplePoint:()=>({cell:cell(4)})};assert.deepEqual(sampleSapContact(e,0,0,0),{id:'amber-sap',fill:.5,stickinessPermille:250});assert.equal(sampleSapContact(e,0,0,0,{adhesionPermille:0}).stickinessPermille,0);assert.throws(()=>sampleSapContact(e,0,0,0,{adhesionPermille:1001}));});
test('foreign or absent samples are not sticky',()=>{assert.equal(sampleSapContact({samplePoint:()=>null},0,0,0),null);assert.equal(sampleSapContact({samplePoint:()=>({cell:{...cell(),id:'water'}})},0,0,0),null);});
test('support ignores unloaded faces, physical boundary and uncontacted ceiling',()=>{let reads=0;const r=sampleSapRetention({...cell(),y:-210},{isLoaded:(x,y,z)=>x!==1,isSolid:()=>{reads++;return true;}});assert.deepEqual(r.faces,['south','west','north']);assert.equal(reads,3);assert.equal(r.retained,true);});
test('partial and full sap retain genuine bottom and side contacts',()=>{
  for(const units of [1,4,8]){
    const r=sampleSapRetention(cell(units),{isLoaded:()=>true,
      isSolid:(x,y,z)=>z===0&&(x===0&&y===-1||x===1&&y===0)});
    assert.deepEqual(r,{faces:['bottom','east'],retained:true});
  }
});
test('retention rejects absent, foreign, invalid and unloaded sap or ceiling',()=>{
  let reads=0;
  const forbidden=()=>{reads++;throw Error('invalid cell must not query host');};
  for(const c of [null,{...cell(),id:'water'},{...cell(),units:0}])
    assert.equal(sampleSapRetention(c,{isLoaded:forbidden,isSolid:forbidden}),null);
  assert.equal(reads,0);
  assert.equal(sampleSapRetention(cell(8),{isLoaded:()=>false,isSolid:forbidden}),null);
  const unloadedCeiling=sampleSapRetention(cell(8),{
    isLoaded:(x,y,z)=>y!==1,isSolid:(x,y,z)=>x===0&&y===1&&z===0});
  assert.deepEqual(unloadedCeiling,{faces:[],retained:false});
  const outsideEnvelope=sampleSapRetention({...cell(8),y:256},{
    isLoaded:()=>true,isSolid:(x,y,z)=>x===0&&y===257&&z===0});
  assert.deepEqual(outsideEnvelope,{faces:[],retained:false});
});
test('finite collection debits only accepted injections',()=>{const e=fixture(),s=createSapSource(config);assert.equal(s.collect(e,()=>false),0);assert.equal(s.collect(e,()=>true),2);assert.equal(s.collect(e,()=>true),2);assert.equal(s.collect(e,()=>true),1);assert.equal(s.collect(e,()=>true),0);assert.equal(e.getCell().units+s.save().remaining,5);});
test('blocked or foreign cells preserve finite stock',()=>{const e=fixture(),s=createSapSource(config);e.set({...cell(),id:'lava'});assert.equal(s.collect(e,()=>true),0);e.set(null);e.block();assert.equal(s.collect(e,()=>true),0);assert.equal(s.save().remaining,5);});
test('target limits collection and restored stock cannot reset',()=>{const e=fixture(),opts={...config,target:3},a=createSapSource(opts);a.collect(e,()=>true);const b=createSapSource({...opts,snapshot:JSON.parse(JSON.stringify(a.save()))});assert.equal(b.collect(e,()=>true),1);assert.equal(b.collect(e,()=>true),0);assert.equal(b.save().remaining,2);assert.throws(()=>createSapSource({...opts,stock:6,snapshot:b.save()}));assert.throws(()=>createSapSource({...opts,snapshot:{...b.save(),remaining:6}}));});
test('source refuses reentrant collection and invalid physical coordinates',()=>{const e=fixture(),s=createSapSource(config);assert.throws(()=>s.collect(e,()=>s.collect(e,()=>true)));assert.equal(s.save().remaining,5);assert.throws(()=>createSapSource({...config,y:257}));});
