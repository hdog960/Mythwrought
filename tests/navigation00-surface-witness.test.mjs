import test from 'node:test';
import assert from 'node:assert/strict';
import {surfaceWitness,nearestVisibleMarker} from '../src/navigation00/navigation-surface-witness.mjs';
test('resident unobstructed surface is witnessed, opaque walls and unknown owners are not',()=>{
 const eye=[.5,5.5,.5],target=[10.5,5.01,.5],base={eye,target,resident:()=>true,read:()=>0};
 assert.equal(surfaceWitness(base),true);
 assert.equal(surfaceWitness({...base,read:x=>x===4?3:0}),false);
 let reads=0;assert.equal(surfaceWitness({...base,resident:x=>x<4,read:x=>{assert.ok(x<4);reads++;return 0;}}),false);assert.equal(reads,4);
});
test('witness handles negative columns and bounds work',()=>{
 const base={eye:[-.5,4.5,-.5],target:[-10.5,4.01,-.5],resident:()=>true,read:()=>0};
 assert.equal(surfaceWitness(base),true);assert.equal(surfaceWitness({...base,maxSteps:2}),false);
 assert.equal(surfaceWitness({...base,target:[-100,4,-.5]}),false);
});
test('marker hit selection respects frame and nearest actual marker, prefers pin on exact tie',()=>{
 const frame={x:0,y:0,width:320,height:320},point={x:10,y:10},pins=[{id:'p',screenX:14,screenY:10}],landmarks=[{id:'m',screenX:11,screenY:10},{id:'hidden',screenX:-1,screenY:10}];
 assert.equal(nearestVisibleMarker({point,pins,landmarks,frame}).id,'m');
 assert.equal(nearestVisibleMarker({point:{x:14,y:10},pins,landmarks,frame}).kind,'waypoint');
 assert.equal(nearestVisibleMarker({point:{x:100,y:100},pins,landmarks,frame}),null);
});

test('long flight witness uses explicit bounded range, rejects occlusion and unknown sections',()=>{
 const base={eye:[.5,256.7,.5],target:[20.5,7.01,.5],resident:()=>true,read:()=>0,maxDistance:320,maxSteps:384};
 assert.equal(surfaceWitness(base),true);
 assert.equal(surfaceWitness({...base,read:(x,y,z)=>y===140?3:0}),false);
 assert.equal(surfaceWitness({...base,resident:(x,y,z)=>y!==140}),false);
 assert.equal(surfaceWitness({...base,maxSteps:64}),false);
 assert.equal(surfaceWitness({...base,maxSteps:385}),false);
 assert.equal(surfaceWitness({...base,maxDistance:321}),false);
});
