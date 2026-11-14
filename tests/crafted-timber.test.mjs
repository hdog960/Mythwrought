import test from 'node:test';
import assert from 'node:assert/strict';
import {CRAFTED_TIMBER_GLSL as TIMBER,CRAFTED_TIMBER_RULES as RULES} from '../src/crafted-timber.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS} from '../src/storybook-materials.mjs';
import {VoxelWorld,BLOCK,meshChunk} from '../src/voxel.mjs';

test('refined timber remains the original editable wood block, with no new save IDs',()=>{
  assert.equal(RULES.existingBlockId,BLOCK.WOOD);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
  assert.equal(RULES.boardsAcross,3);
  assert.equal(RULES.boardsHigh,2);
  assert.equal(RULES.endGrainOnTop,true);
  const world=new VoxelWorld(179);
  assert.equal(world.set(1,17,1,BLOCK.WOOD),true);
  const restored=VoxelWorld.restore(world.save());
  assert.equal(restored.get(1,17,1),BLOCK.WOOD);
  assert.deepEqual(restored.save(),world.save());
  assert.equal(restored.save().schema,1);
  assert.equal(meshChunk(restored,0,0).length%9,0);
});

test('original single-pass opaque wood face has staggered joints and woodgrain',()=>{
  const start=FS.indexOf('}else if(vMat==4)');
  const end=FS.indexOf('}else if(vMat==5)',start);
  assert.ok(start>0&&end>start);
  const wood=FS.slice(start,end);
  assert.ok(wood.includes(TIMBER.trim()));
  for(const token of ['boardRow','horizontalJoint','verticalJoint','knotRing','fineGrain','peg','shade='])
    assert.ok(wood.includes(token),token);
  assert.match(wood,/mod\(boardRow,2\.0\)/);
  assert.match(wood,/smoothstep\(/);
  assert.doesNotMatch(wood,/sampler2D|discard;|gl_FragDepth|texture\(/);
  assert.match(FS,/if\(uArtQuality<\.5\)/);
  assert.ok(FS.indexOf('return;')<start,'Economy path must bypass detailed wood');
  assert.match(FS,/outColor=vec4\(mix\(colored,uFog,fog\),1\.0\)/);
});


test('top-facing timber receives end-grain rings while side planks retain staggered joints',()=>{
  for(const token of ['topFace=step(.59,vColor.r)','ringRadius','ringWobble','endRings','endCracks','mix(sideShade,topShade,topFace)'])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/float sideShade=.*seam/);
  assert.match(TIMBER,/float topShade=.*endRings/);
  assert.doesNotMatch(TIMBER,/texture\(|sampler2D|discard;|gl_FragDepth/);
});

test('refined boards have deterministic per-board tint, paired pegs and edge wear',()=>{
  assert.equal(RULES.perBoardTint,true);
  assert.equal(RULES.pairedJoineryPegs,true);
  for(const token of ['boardTone=hashCell(boardCell','edgeWear=','pegPair=','boardTone','peg+pegPair'])
    assert.ok(TIMBER.includes(token),token);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.existingBlockId,4);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
});
