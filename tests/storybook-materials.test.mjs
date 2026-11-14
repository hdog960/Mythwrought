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
test('native rocky cliffs show natural striations, not artificial masonry block lines',()=>{
 const stoneStart=FS.indexOf('}else if(vMat==3)');
 const timberStart=FS.indexOf('}else if(vMat==4)');
 assert.ok(stoneStart>0&&timberStart>stoneStart);
 const stone=FS.slice(stoneStart,timberStart);
 assert.match(stone,/float strata=/);
 assert.match(stone,/float crease=/);
 assert.match(stone,/float mica=/);
 assert.doesNotMatch(stone,/blockLine|mortar|p\.x\+=\.5\*mod/);
 // Painterly stone remains inside the quality branch. Economy still returns first.
 assert.ok(FS.indexOf('return;')<stoneStart);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
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

test('natural geology has four original bounded shader detail families without new block IDs',()=>{
 assert.deepEqual(RULES.naturalDetailFamilies,[
   'sediment-shelves','slate-limestone-strata','raw-crystal-cleavage','gold-bearing-veins'
 ]);
 for(const [id,next,terms] of [
   [2,3,['shelf','silt','pebble','root']],
   [3,4,['strata','crease','mica','slate','limestone']],
   [5,6,['facet','cleavage','glint']],
   [6,7,['trace','vein','gold']]
 ]){
   const start=FS.indexOf('}else if(vMat=='+id+')');
   const end=FS.indexOf('}else if(vMat=='+next+')',start);
   assert.ok(start>=0&&end>start,'dedicated natural material '+id);
   const shader=FS.slice(start,end);
   for(const term of terms)assert.match(shader,new RegExp('float '+term+'='));
   assert.doesNotMatch(shader,/sampler2D|discard;|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
});

test('natural surface accents use bounded opaque shader details and stable existing material IDs',()=>{
 assert.deepEqual(RULES.secondaryNaturalAccents,[
  'grass-moss-pollen','soil-clay-lenses','stone-quartz-seams','crystal-chevron-prisms','ore-branch-veins'
 ]);
 const cases=[[1,2,['moss','pollen']],[2,3,['clay']],[3,4,['quartz']],[5,6,['prism']],[6,7,['branch']]];
 for(const [id,next,terms] of cases){
  const start=FS.indexOf(id===1?'if(vMat==1)':'else if(vMat=='+id+')');
  const end=FS.indexOf('else if(vMat=='+next+')',start);
  assert.ok(start>=0&&end>start,'material face '+id);
  const part=FS.slice(start,end);
  for(const term of terms){
   assert.match(part,new RegExp('float '+term+'='));
   assert.match(part,/near/);
  }
  assert.doesNotMatch(part,/discard;|sampler2D|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
 assert.ok(FS.indexOf('return;')<FS.indexOf('float moss='));
});

test('mineral geodes and oxidized ore remain opaque, distance-faded and use existing IDs',()=>{
 assert.deepEqual(RULES.mineralInclusions,['crystal-indigo-core','crystal-frost-inclusions','ore-oxidized-seams']);
 for(const [id,next,terms] of [[5,6,['inclusion','core']],[6,7,['oxidation']]]){
  const start=FS.indexOf('}else if(vMat=='+id+')');
  const end=FS.indexOf('}else if(vMat=='+next+')',start);
  assert.ok(start>=0&&end>start);
  const part=FS.slice(start,end);
  for(const term of terms)assert.match(part,new RegExp('float '+term+'='));
  assert.match(part,/near/);
  assert.doesNotMatch(part,/discard;|sampler2D|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newTextures,0);
 assert.equal(RULES.newDrawCalls,0);
});


test('cold natural geology accents remain opaque, near-faded, and save-neutral',()=>{
 assert.deepEqual(RULES.coldGeologyAccents,['stone-frost-quartz-ridges','stone-cold-pockets','crystal-glacial-cleavage']);
 for(const [id,next,terms] of [[3,4,['frostRidge','coldPocket']],[5,6,['iceRim','blueFacet']]]){
  const start=FS.indexOf('}else if(vMat=='+id+')');
  const end=FS.indexOf('}else if(vMat=='+next+')',start);
  assert.ok(start>=0&&end>start);
  const part=FS.slice(start,end);
  for(const term of terms)assert.match(part,new RegExp('float '+term+'='));
  assert.match(part,/\*near/);
  assert.doesNotMatch(part,/sampler2D|discard;|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
});

test('weathered sediment fans and exposed erosion scars are distance-faded opaque natural faces',()=>{
 assert.deepEqual(RULES.weatheredStrataAccents,[
  'soil-ochre-sediment-fans','soil-damp-pockets','stone-erosion-scars'
 ]);
 for(const [id,next,terms] of [[2,3,['fan','fanEdge','damp']],[3,4,['erosion','scar']]]){
  const start=FS.indexOf('}else if(vMat=='+id+')');
  const end=FS.indexOf('}else if(vMat=='+next+')',start);
  assert.ok(start>=0&&end>start);
  const part=FS.slice(start,end);
  for(const term of terms)assert.match(part,new RegExp('float '+term+'='));
  assert.match(part,/\*near/);
  assert.doesNotMatch(part,/discard;|sampler2D|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
});

test('fragment shader contains no escaped source newlines and retains valid bounded mineral lenses',()=>{
 assert.doesNotMatch(FS,/\\n/,'literal escaped newlines break GLSL compilation');
 assert.deepEqual(RULES.ironstoneAccents,['stone-ironstone-lenses','stone-pale-mineral-rims']);
 const stone=FS.slice(FS.indexOf('}else if(vMat==3)'),FS.indexOf('}else if(vMat==4)'));
 for(const term of ['ironLens','rim'])assert.match(stone,new RegExp('float '+term+'='));
 assert.match(stone,/vec3\(\.64,\.38,\.27\),\.20\*ironLens\*near/);
 assert.match(stone,/vec3\(\.86,\.72,\.53\),\.07\*rim\*near/);
 assert.equal(RULES.newTextures,0);
 assert.equal(RULES.newDrawCalls,0);
});

test('agate crystal and hematite ore retain bounded opaque near-faded natural pigment',()=>{
 assert.deepEqual(RULES.agateHematiteAccents,[
  'crystal-nested-agate-bands','crystal-indigo-growth-core',
  'ore-hematite-host-plates','ore-pale-plate-boundaries'
 ]);
 for(const [id,next,names] of [[5,6,['bandPhase','agateBand','agateCore']],[6,7,['hematite','plate','plateEdge']]]){
  const start=FS.indexOf('}else if(vMat=='+id+')');
  const end=FS.indexOf('}else if(vMat=='+next+')',start);
  assert.ok(start>=0&&end>start);
  const material=FS.slice(start,end);
  for(const name of names)assert.match(material,new RegExp('float '+name+'='));
  assert.match(material,/\*near/);
  assert.doesNotMatch(material,/sampler2D|discard;|texture\(/);
 }
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newTextures,0);
 assert.equal(RULES.newDrawCalls,0);
 assert.doesNotMatch(FS,/\\\\n/);
});

test('calcite limestone shelves retain deterministic opaque mobile-friendly shading',()=>{
 assert.deepEqual(RULES.limestoneShelfAccents,['stone-sweeping-calcite','stone-blue-shale-shelves']);
 const stone=FS.slice(FS.indexOf('}else if(vMat==3)'),FS.indexOf('}else if(vMat==4)'));
 for(const term of ['calciteFlow','calcite','shaleShelf'])
   assert.match(stone,new RegExp('float '+term+'='));
 assert.match(stone,/vec3\(\.91,\.86,\.71\),\.21\*calcite\*near/);
 assert.match(stone,/vec3\(\.34,\.42,\.47\),\.12\*shaleShelf\*\(1\.0-calcite\)\*near/);
 assert.doesNotMatch(stone,/sampler2D|discard;|texture\(|uTime/);
 assert.equal(RULES.newTextures,0);
 assert.equal(RULES.newDrawCalls,0);
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
});

test('forest floor has deterministic leaf silhouettes and exposed branching roots without new IDs',()=>{
 assert.deepEqual(RULES.forestFloorMaterialAccents,[
  'grass-fallen-leaf-clusters','soil-branching-exposed-roots'
 ]);
 const grass=FS.slice(FS.indexOf('if(vMat==1)'),FS.indexOf('}else if(vMat==2)'));
 const soil=FS.slice(FS.indexOf('}else if(vMat==2)'),FS.indexOf('}else if(vMat==3)'));
 for(const name of ['litterUv','litterSeed','litterRot','fallenLeaf'])
  assert.match(grass,new RegExp('float '+name+'=|vec2 '+name+'='));
 for(const name of ['rootTrunk','rootBranch','rootNetwork'])
  assert.match(soil,new RegExp('float '+name+'='));
 assert.match(grass,/\.28\*fallenLeaf\*near/);
 assert.match(soil,/\.24\*rootNetwork\*near/);
 for(const material of [grass,soil])assert.doesNotMatch(material,/sampler2D|discard;|texture\(/);
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newTextures,0);
 assert.equal(RULES.newDrawCalls,0);
 assert.doesNotMatch(FS,/uniform float uTime/);
});


test('raw ore copper halos are near-faded, opaque and do not allocate block IDs',()=>{
 assert.deepEqual(RULES.copperOreAccents,[
  'ore-malachite-halos','ore-copper-boundaries','ore-host-rock-fractures'
 ]);
 const ore=FS.slice(FS.indexOf('}else if(vMat==6)'),FS.indexOf('}else if(vMat==7)'));
 for(const name of ['copperField','copperHalo','copperEdge','hostFracture'])
  assert.match(ore,new RegExp('float '+name+'='));
 for(const name of ['copperHalo','copperEdge','hostFracture'])
  assert.match(ore,new RegExp(name+'[^;]*\\*near'));
 assert.match(ore,/\(1\.0-gold\)/);
 assert.doesNotMatch(ore,/sampler2D|discard;|texture\(|uTime/);
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
});

test('woodland dew and fern litter remain opaque near-faded details on existing grass ID',()=>{
 assert.deepEqual(RULES.woodlandDewAccents,['grass-morning-dew','grass-fern-litter-streaks']);
 const grass=FS.slice(FS.indexOf('if(vMat==1)'),FS.indexOf('}else if(vMat==2)'));
 for(const term of ['dewField','dew','fernLitter'])assert.match(grass,new RegExp('float '+term+'='));
 assert.match(grass,/vec3\\(\\.42,\\.73,\\.69\\),\\.13\\*dew\\*near/);
 assert.match(grass,/vec3\\(\\.57,\\.43,\\.25\\),\\.08\\*fernLitter\\*near/);
 assert.doesNotMatch(grass,/sampler2D|discard;|texture\\(/);
 assert.deepEqual(RULES.existingSolidMaterials,[1,2,3,4,5,6]);
 assert.equal(RULES.newDrawCalls,0);
 assert.equal(RULES.newTextures,0);
});
