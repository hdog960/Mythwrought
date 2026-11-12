import test from 'node:test';
import assert from 'node:assert/strict';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS,STORYBOOK_ART_RULES as RULES} from '../src/storybook-materials.mjs';
import {SKY_FRAGMENT_SHADER,SKY_VERTEX_SHADER,DISTANCE_FOG_COLOR} from '../src/sky.mjs';
import {VoxelWorld,meshChunk,BLOCK,terrainHeight} from '../src/voxel.mjs';

test('all six existing physical materials and three existing meadow IDs retain dedicated colors',()=>{
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.deepEqual(RULES.existingFloraMaterials,[7,8,9]);
 for(const id of [1,2,3,4,5,6,7,8,9]){
   assert.match(FS,new RegExp('vMat=='+id+'(?:[^0-9]|$)'),'Missing shader treatment for '+id);
 }
 assert.match(FS,/precision highp float/);
 assert.match(FS,/uniform vec3 uFog/);
 assert.match(FS,/uniform float uArtQuality/);
 assert.match(FS,/outColor=vec4/);
 assert.ok(FS.startsWith('#version 300 es'));
});
test('storybook detail fades before distant fog and uses only one original opaque material draw',()=>{
 assert.ok(RULES.detailStartDistance<RULES.detailEndDistance);
 assert.ok(RULES.fogStartDistance<RULES.fogEndDistance);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
 assert.match(FS,/smoothstep\(10\.0,38\.0,vDistance\)/);
 assert.match(FS,/smoothstep\(29\.0,68\.0,vDistance\)/);
 for(const prohibited of [/sampler2D/,/texture2D/,/discard;/,/gl_FragDepth/,/alpha.*blend/i])
   assert.doesNotMatch(FS,prohibited);
});
test('Economy mode returns physical voxel base colors without costly material-cell hashes',()=>{
 const beginning=FS.indexOf('if(uArtQuality<.5)');
 const returnAt=FS.indexOf('return;',beginning);
 const firstDetailHash=FS.indexOf('float tile=hashCell');
 assert.ok(beginning>0&&returnAt>beginning&&firstDetailHash>returnAt);
 assert.match(FS.slice(beginning,returnAt),/outColor=vec4\(mix\(vColor,uFog,distant\),1\.0\)/);
});
test('original painterly daylight sky remains a single camera-relative fullscreen pass',()=>{
 assert.match(SKY_FRAGMENT_SHADER,/vec3 warm=vec3\(.80,.81,.73\)/);
 assert.match(SKY_FRAGMENT_SHADER,/wisp/);
 assert.match(SKY_FRAGMENT_SHADER,/uYaw/);
 assert.match(SKY_FRAGMENT_SHADER,/uPitch/);
 assert.match(SKY_VERTEX_SHADER,/gl_VertexID/);
 assert.equal(DISTANCE_FOG_COLOR.length,3);
 for(const item of [...DISTANCE_FOG_COLOR])assert.ok(item>=0&&item<=1);
 assert.doesNotMatch(SKY_FRAGMENT_SHADER,/uniform float uTime|sampler2D|texture\(/);
});
test('material artwork does not change deterministic worlds, edits or original schema-1 saves',()=>{
 for(const seed of [179,-184,0]){
   const w=new VoxelWorld(seed);
   const original=JSON.stringify(w.save());
   const mesh=meshChunk(w,0,0);
   assert.equal(JSON.stringify(w.save()),original);
   assert.ok(mesh.length>0&&mesh.length%9===0);
   const x=2,z=2,y=terrainHeight(x,z,seed);
   w.set(x,y,z,BLOCK.AIR);
   const edited=JSON.stringify(w.save());
   const copy=VoxelWorld.restore(JSON.parse(edited));
   assert.equal(copy.get(x,y,z),BLOCK.AIR);
   assert.deepEqual(copy.save(),w.save());
   assert.equal(copy.save().schema,1);
   assert.equal(copy.set(3,14,3,8),false,'Visual IDs must remain uneditable');
 }
});
