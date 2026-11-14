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

test('crafted timber has deterministic planed relief and sparse carved ornaments',()=>{
  assert.equal(RULES.handPlanedBevel,true);
  assert.equal(RULES.rareEngravedDiamond,true);
  for(const token of ['boardLocal=fract','float bevel=smoothstep','innerBorder=','etchedDiamond=','ornamentCell=step(.79','sideShade +=','topBevel='])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/hashCell\(boardCell\+vec2\(59\.0,23\.0\)\)/);
  assert.match(TIMBER,/ornament=etchedDiamond\*ornamentCell\*near/);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.saveSchemaChanged,false);
});

test('crafted structural braces and mortises remain opaque face-local art',()=>{
  assert.equal(RULES.sparseDiagonalJoinery,true);
  assert.equal(RULES.pairedMortises,true);
  for(const token of ['braceCell=step(.90','braceSlope=','braceBand=','braceHighlight=','mortiseX=','mortiseY=','mortise='])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/braceBand=.*bevel\*braceCell/);
  assert.match(TIMBER,/mortiseX\*mortiseY\*\(1\.0-seam\)/);
  assert.doesNotMatch(TIMBER,/texture\(|sampler2D|discard;|gl_FragDepth/);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
});

test('framed timber panels use deterministic inset joinery without extra mesh or save IDs',()=>{
  assert.equal(RULES.framedPanels,true);
  assert.equal(RULES.cornerBosses,true);
  for(const token of ['frameX=','frameY=','cornerBoss=','inlayLine=','frameCell=','craftedFrame='])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/hashCell\(boardCell\+vec2\(97\.0,31\.0\)\)/);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
});

test('rare carpenter arches stay inside framed boards and fade at distance',()=>{
  assert.equal(RULES.archedLatticePanels,true);
  for(const token of ['latticeCell=step(.87','archRadius=','archBand=','archPillar=','latticeCell*panel*near','latticeEdge=','-.15*lattice'])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/hashCell\(boardCell\+vec2\(121\.0,67\.0\)\)/);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.existingBlockId,BLOCK.WOOD);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
});

test('rare carved sunwheels are broad opaque panel-local ornaments with deterministic placement',()=>{
  assert.equal(RULES.rareSunwheelCarving,true);
  for(const token of ['sunCell=step(.945','sunRadius=','sunRing=','sunRays=','sunCore=','sunEmblem=','sunCell*panel*near','-.13*sunEmblem'])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/hashCell\(boardCell\+vec2\(143\.0,89\.0\)\)/);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.existingBlockId,BLOCK.WOOD);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
});

test('rare double-door timber carving uses opaque face-local details and no new IDs',()=>{
  assert.equal(RULES.rareDoubleDoorCarving,true);
  for(const token of ['doorCell=step(.965','doorBody=','doorStile=','doorRecess=',
    'doorHinges=','pullRing=','doorCell*doorBody*near','doorCarving'])
    assert.ok(TIMBER.includes(token),token);
  assert.match(TIMBER,/hashCell\(boardCell\+vec2\(173\.0,103\.0\)\)/);
  assert.doesNotMatch(TIMBER,/sampler2D|texture\(|discard;|gl_FragDepth/);
  assert.equal(RULES.existingBlockId,BLOCK.WOOD);
  assert.equal(RULES.extraTextures,0);
  assert.equal(RULES.extraDrawCalls,0);
  assert.equal(RULES.saveSchemaChanged,false);
});
