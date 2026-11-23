import test from 'node:test';
import assert from 'node:assert/strict';
import { previewAssemblyEnvelope } from '../src/resonance/devices48/assembly-envelope-v1.mjs';
const base = () => ({worldId:'world_1',deviceId:'gate_1',productionBound:false,
  parts:[{x:0,y:0,z:0},{x:1,y:0,z:0}],delta:{x:2,y:0,z:0}});
test('bounded preview yields sorted immutable swept cells',()=>{
  const r=previewAssemblyEnvelope(base());
  assert.equal(r.mayActuate,false); assert.equal(r.partCount,2);
  assert.equal(r.energyDemandUnits,4);
  assert.deepEqual(r.sweptCells.map(c=>c.x),[0,1,2,3]);
  assert.ok(Object.isFrozen(r.sweptCells)); assert.ok(Object.isFrozen(r.sweptCells[0]));
});
test('deterministic repeat',()=>assert.deepEqual(previewAssemblyEnvelope(base()),previewAssemblyEnvelope(base())));
test('rejects production binding',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),productionBound:true})));
test('rejects forged authority',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),authoritativeDelivery:true})));
test('rejects actuation flag',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),allowActuation:true})));
test('rejects duplicate parts',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),parts:[{x:0,y:0,z:0},{x:0,y:0,z:0}]})));
test('rejects empty parts',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),parts:[]})));
test('rejects too many parts',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),parts:Array.from({length:33},(_,i)=>({x:i,y:0,z:0}))})));
test('rejects oversized span',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),parts:[{x:0,y:0,z:0},{x:8,y:0,z:0}]})));
test('rejects zero delta',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),delta:{x:0,y:0,z:0}})));
test('rejects excessive movement',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),delta:{x:17,y:0,z:0}})));
test('rejects fractional coordinates',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),parts:[{x:.5,y:0,z:0}]})));
test('rejects malformed identity',()=>assert.throws(()=>previewAssemblyEnvelope({...base(),worldId:'../unsafe'})));
test('diagonal conservative supercover includes intermediate cells',()=>{
  const r=previewAssemblyEnvelope({...base(),parts:[{x:0,y:0,z:0}],delta:{x:2,y:1,z:0}});
  assert.ok(r.sweptCells.some(c=>c.x===1&&c.y===0));
  assert.ok(r.sweptCells.some(c=>c.x===1&&c.y===1));
});
