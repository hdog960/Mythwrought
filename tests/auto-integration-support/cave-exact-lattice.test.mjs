import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCaveHandshake} from '../../src/auto-integration-support/contracts.mjs';

const min=Number.MIN_SAFE_INTEGER, max=Number.MAX_SAFE_INTEGER;
const check=(path)=>validateCaveHandshake({
 surfaceY:0, entranceY:0, depthMinY:min, depthMaxY:max, path
});

test('exact lattice connectivity accepts a single step at safe-integer boundaries',()=>{
 assert.equal(check([{x:max-1,y:0,z:0},{x:max,y:0,z:0}]).ok,true);
 assert.equal(check([{x:min+1,y:0,z:0},{x:min,y:0,z:0}]).ok,true);
});
test('extreme distant cells never alias a neighboring step',()=>{
 const result=check([{x:min,y:0,z:0},{x:max,y:0,z:0}]);
 assert.deepEqual(result,{ok:false,reason:'disconnected-path'});
});
test('three-axis extreme differences cannot masquerade as unit adjacency',()=>{
 const result=check([{x:min,y:0,z:min},{x:max,y:1,z:max}]);
 assert.equal(result.ok,false);
 assert.equal(result.reason,'disconnected-path');
});
test('invalid unsafe world coordinates remain rejected',()=>{
 assert.equal(check([{x:0,y:0,z:0},{x:max+1,y:0,z:0}]).reason,'invalid-path-cell');
});
