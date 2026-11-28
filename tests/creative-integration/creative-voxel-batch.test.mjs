import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCreativeVoxelBatch as replay} from '../../src/creative-integration/creative-voxel-batch.mjs';
const cells=[[15,3,0],[16,3,0],[16,4,0]],before=[{id:3},{id:4},{id:7}],after=before.map(()=>({id:0}));
function fixture(){
 const states=new Map(cells.map((c,i)=>[c.join(','),before[i]]));
 const f={cells,expected:before,desired:after,read:c=>states.get(c.join(',')),allowed:()=>true,write(c,s){states.set(c.join(','),s);return true;},rebuilds:0,saves:0,protected:0,rebuild(cs){assert.deepEqual(cs,cells);f.rebuilds++;},save(){f.saves++;return true;},protect(){f.protected++;}};
 return f;
}
test('one authoritative full mesh and save for a multi-cell edit',()=>{const f=fixture();assert.equal(replay(f),true);assert.deepEqual(cells.map(f.read),after);assert.equal(f.rebuilds,1);assert.equal(f.saves,1);assert.equal(replay({...f,expected:after,desired:before}),true);assert.deepEqual(cells.map(f.read),before);});
test('stale cell rejects whole batch before writes',()=>{const f=fixture();f.write(cells[1],{id:8});assert.equal(replay(f),false);assert.deepEqual(cells.map(f.read),[before[0],{id:8},before[2]]);assert.equal(f.rebuilds,0);});
test('body or support veto anywhere rejects whole batch',()=>{const f=fixture();assert.equal(replay({...f,allowed:c=>c!==cells[1]}),false);assert.deepEqual(cells.map(f.read),before);});
test('partial write failure restores all attempted cells',()=>{const f=fixture();assert.equal(replay({...f,write(c,s){f.write(c,s);return c!==cells[1]||s.id!==0;}}),false);assert.deepEqual(cells.map(f.read),before);assert.equal(f.saves,0);});
test('atomic mesh failure restores exact owner values, no save',()=>{const f=fixture();assert.equal(replay({...f,rebuild(){throw Error('GPU failure');}}),false);assert.deepEqual(cells.map(f.read),before);assert.equal(f.saves,0);assert.equal(f.protected,0);});
test('unverified rollback protects world',()=>{const f=fixture();assert.equal(replay({...f,write(c,s){if(s.id!==0)return false;return f.write(c,s);},rebuild(){throw Error('GPU failure');}}),false);assert.equal(f.protected,1);});
test('partial durable save failure is protected without fabricated rollback',()=>{const f=fixture();assert.equal(replay({...f,save:()=>false}),false);assert.deepEqual(cells.map(f.read),after);assert.equal(f.protected,1);});
test('duplicate or malformed target refuses before mutation',()=>{const f=fixture();assert.equal(replay({...f,cells:[cells[0],cells[0],cells[2]]}),false);assert.deepEqual(cells.map(f.read),before);});

test('canonical journal key order is independent of owner insertion order',()=>{
 const f=fixture(),expected=cells.map((c,i)=>({pack2:null,rotation:0,id:i+3})),desired=cells.map(()=>({id:0,rotation:0,pack2:null}));
 cells.forEach((c,i)=>f.write(c,{id:i+3,rotation:0,pack2:null}));
 assert.equal(replay({...f,expected,desired}),true);
 assert.deepEqual(cells.map(f.read),desired);
});
