import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAssembly,advanceAssembly} from '../src/resonance/devices48/assembly-v1.mjs';
const base={seed:12,energyPerTick:4,travel:2,clearance:true,parts:[{id:'arm',offset:[0,0,0],playerPlaced:false,assetApproved:true}]};
test('eligible does not impersonate production movement',()=>{const a=validateAssembly(base);assert.deepEqual(advanceAssembly(a,{allocation:4,clearance:true}),{state:'eligible',positionChanged:false,productionBound:false});});
test('shortage and missing clearance stop safely',()=>{const a=validateAssembly(base);assert.equal(advanceAssembly(a,{allocation:3,clearance:true}).state,'stopped');assert.equal(advanceAssembly(a,{allocation:4,clearance:false}).state,'stopped');});
test('reject player blocks and unapproved assets',()=>{assert.throws(()=>validateAssembly({...base,parts:[{...base.parts[0],playerPlaced:true}]}));assert.throws(()=>validateAssembly({...base,parts:[{...base.parts[0],assetApproved:false}]}));});
test('reject duplicate and oversized assemblies',()=>{assert.throws(()=>validateAssembly({...base,parts:[base.parts[0],base.parts[0]]}));assert.throws(()=>validateAssembly({...base,energyPerTick:65}));assert.throws(()=>validateAssembly({...base,travel:5}));});
