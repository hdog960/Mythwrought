import test from 'node:test';
import assert from 'node:assert/strict';
import {previewContinuousAssemblySweep as sweep} from '../src/resonance/devices48/continuous-assembly-sweep-v2.mjs';
const base=()=>({worldId:'w1',deviceId:'d1',productionBound:false,parts:[{x:0,y:0,z:0}],delta:{x:16,y:1,z:0}});
test('long shallow diagonal includes intermediate continuous overlap',()=>{
 const r=sweep(base()); assert.equal(r.mayActuate,false);
 assert.ok(r.sweptCells.some(c=>c.x===8&&c.y===1&&c.z===0));
 assert.ok(r.sweptCells.some(c=>c.x===8&&c.y===0&&c.z===0));
});
test('stable sorted and frozen output',()=>{
 const a=sweep(base()),b=sweep(base());assert.deepEqual(a,b);
 assert.ok(Object.isFrozen(a.sweptCells)&&Object.isFrozen(a.sweptCells[0]));
 for(let i=1;i<a.sweptCells.length;i++) {
  const p=a.sweptCells[i-1],q=a.sweptCells[i];
  assert.ok(p.x<q.x||(p.x===q.x&&(p.y<q.y||(p.y===q.y&&p.z<q.z))));
 }
});
test('cross-axis boundary contact is conservatively included',()=>{
 const r=sweep({...base(),delta:{x:1,y:1,z:1}});
 assert.ok(r.sweptCells.some(c=>c.x===2&&c.y===2&&c.z===2));
});
test('zero movement rejected',()=>assert.throws(()=>sweep({...base(),delta:{x:0,y:0,z:0}})));
test('oversized movement rejected',()=>assert.throws(()=>sweep({...base(),delta:{x:17,y:0,z:0}})));
test('duplicate part rejected',()=>assert.throws(()=>sweep({...base(),parts:[base().parts[0],base().parts[0]]})));
test('oversized assembly rejected',()=>assert.throws(()=>sweep({...base(),parts:[{x:0,y:0,z:0},{x:8,y:0,z:0}]})));
test('too many parts rejected',()=>assert.throws(()=>sweep({...base(),parts:Array.from({length:33},(_,x)=>({x,y:0,z:0}))})));
test('forged production rejected',()=>assert.throws(()=>sweep({...base(),productionBound:true})));
test('forged authority rejected',()=>assert.throws(()=>sweep({...base(),authoritativeDelivery:true})));
test('forged actuation rejected',()=>assert.throws(()=>sweep({...base(),allowActuation:true})));
test('unsafe identity rejected',()=>assert.throws(()=>sweep({...base(),deviceId:'../bad'})));
test('fractional part rejected',()=>assert.throws(()=>sweep({...base(),parts:[{x:0.5,y:0,z:0}]})));
test('fractional delta rejected',()=>assert.throws(()=>sweep({...base(),delta:{x:1.5,y:0,z:0}})));
test('bounded maximum travel deterministic',()=>{
 const b={...base(),parts:[{x:0,y:0,z:0},{x:1,y:1,z:1}],delta:{x:16,y:16,z:16}};
 const r=sweep(b);assert.equal(r.energyDemandUnits,32);assert.ok(r.sweptCells.length<2000);
});
