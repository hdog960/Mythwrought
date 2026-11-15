import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {loadCheckpoint007} from './current-main-loader.mjs';

const expected={
 surface:['../../../src/shape-prototypes.mjs'],
 interaction:['../../../src/voxel-shape-interactions.mjs',
  '../../../src/voxel-shape-fit.mjs',
  '../../../src/voxel-orientation-sidecar.mjs']
};
for(const mode of ['surface','interaction']){
 test('main loader correctly handles '+mode+' on raw-fork or integrated-main checkout',async()=>{
  const paths=expected[mode];
  const present=await Promise.all(paths.map(async p=>{
   try{await access(new URL(p,import.meta.url));return true}
   catch(error){if(error?.code==='ENOENT')return false;throw error}
  }));
  let reason='';
  const api=await loadCheckpoint007({skip(message){reason=message}},
   {surface:mode==='surface'});
  if(present.every(Boolean)){
   assert.equal(reason,'','present shared source must never be silently skipped');
   assert.ok(api);
   const keys=mode==='surface'?['prototypeSurfaceMesh']:
    ['validateShape','rotateShape','raycastShapes','canPlaceShape',
     'inspectBodyFit','makeOrientationSidecar','restoreOrientationSidecar'];
   for(const k of keys)assert.equal(typeof api[k],'function',k+' missing');
  }else{
   assert.equal(api,null,'absent shared source cannot fake compatibility pass');
   assert.match(reason,/Checkpoint 007 modules absent/);
  }
 });
}
