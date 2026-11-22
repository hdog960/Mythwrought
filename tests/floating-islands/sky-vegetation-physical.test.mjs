import test from 'node:test';
import assert from 'node:assert/strict';
import {planPhysicalSkyVegetation} from '../../src/floating-islands/sky-vegetation-physical.mjs';
const tree=(kind,x=100,z=-100,y=141)=>({kind,x,y,z,group:'canopy'});
const cover=(kind,x,z,y=141)=>({kind,x,y,z,group:'ground-cover'});
const ids={'windbent-pine':{trunk:4,leaves:7},'cloudleaf-tree':{trunk:4,leaves:7},
 'starbloom-tree':{trunk:4,leaves:7},'fern-thicket':{'ground-cover':280},
 'blossom-shrub':{'ground-cover':281},'glowmoss':{'ground-cover':282},
 'skybell-flowers':{'ground-cover':283},'windgrass-tuft':{'ground-cover':284}};
const host=(placements,over={})=>({seed:179,plan:{placements},
  sourceGet:(x,y,z)=>y===140?3:0,assetFor:(kind,role)=>ids[kind]?.[role],
  isPhysicalAsset:id=>Number.isInteger(id)&&id>0&&id<=400,...over});
test('windbent canopy consists of real supported trunk plus irregular leaf voxel cells',()=>{
  const r=planPhysicalSkyVegetation(host([tree('windbent-pine')]));
  assert.equal(r.treeCount,1);assert.ok(r.edits.length>10);
  assert.ok(r.edits.some(c=>c.id===4));assert.ok(r.edits.some(c=>c.id===7));
  assert.equal(r.worldWrites,0);assert.equal(r.saveWrites,0);
  const uniq=new Set(r.edits.map(c=>`${c.x},${c.y},${c.z}`));
  assert.equal(uniq.size,r.edits.length);
});
test('three physically distinct canopies vary with seed without rendering fake geometry',()=>{
  const kinds=['windbent-pine','cloudleaf-tree','starbloom-tree'];
  const built=kinds.map(kind=>planPhysicalSkyVegetation(host([tree(kind)])));
  assert.equal(new Set(built.map(r=>JSON.stringify(r.edits))).size,3);
  assert.ok(built.every(r=>r.renderOnlyMeshes===0));
});
test('world coordinate and input order do not affect deterministic remote island vegetation',()=>{
  const placements=[tree('cloudleaf-tree',12004,-14021),
    cover('windgrass-tuft',12011,-14031),cover('skybell-flowers',12020,-14010)];
  const a=planPhysicalSkyVegetation(host(placements));
  const b=planPhysicalSkyVegetation(host([...placements].reverse()));
  assert.deepEqual(a,b);assert.ok(a.edits.every(e=>e.x>10000&&e.z< -10000));
});
test('entire tree is rejected if one crown cell intersects protected real source',()=>{
  const base=host([tree('cloudleaf-tree')]);
  const a=planPhysicalSkyVegetation({...base,isProtectedCell:(x,y,z)=>x===100&&y>=145&&z===-100});
  assert.equal(a.treeCount,0);assert.equal(a.edits.length,0);
  assert.equal(a.rejected,1);
});
test('tree above authentic sky-world top is refused without partial trunk',()=>{
  const a=planPhysicalSkyVegetation(host([tree('starbloom-tree',10,11,254)],
    {sourceGet:(x,y,z)=>y===253?3:0}));
  assert.equal(a.treeCount,0);assert.equal(a.edits.length,0);
});
test('sky mining edit and empty support prevent floating canopy placement',()=>{
  const a=planPhysicalSkyVegetation(host([tree('windbent-pine')],{sourceGet:()=>0}));
  assert.equal(a.edits.length,0);
  const b=planPhysicalSkyVegetation(host([tree('windbent-pine')],{
    sourceGet:(x,y,z)=>y===140?3:x===100&&y===142&&z===-100?4:0}));
  assert.equal(b.edits.length,0);
});
test('groundcover uses registered physical ID rather than semantic placeholder',()=>{
  const a=planPhysicalSkyVegetation(host([cover('glowmoss',4,5),cover('windgrass-tuft',6,5)]));
  assert.deepEqual(a.edits.map(c=>c.id),[282,284]);
});
test('bounded GPU/voxel candidate cap refuses overfull plan without partial tree',()=>{
  const a=planPhysicalSkyVegetation(host([tree('cloudleaf-tree')],{maxCells:2}));
  assert.equal(a.edits.length,0);assert.equal(a.rejected,1);
  const b=planPhysicalSkyVegetation(host([cover('windgrass-tuft',4,5)],{maxCells:0}));
  assert.equal(b.edits.length,0);
});
test('unsupported physical IDs, invalid returns and duplicate anchors fail closed',()=>{
  assert.throws(()=>planPhysicalSkyVegetation(host([tree('cloudleaf-tree')],{isPhysicalAsset:()=>false})),/unregistered/);
  assert.throws(()=>planPhysicalSkyVegetation(host([tree('cloudleaf-tree')],{assetFor:()=>77777})),/unregistered/);
  assert.throws(()=>planPhysicalSkyVegetation(host([tree('cloudleaf-tree')],{sourceGet:()=>-9})),/invalid original/);
  assert.throws(()=>planPhysicalSkyVegetation(host([tree('cloudleaf-tree'),tree('cloudleaf-tree')])),/duplicate/);
});
test('source layer and proposed returned records are not written or mutated',()=>{
  const src=new Map([['100,140,-100',3]]),before=new Map(src);
  const a=planPhysicalSkyVegetation(host([tree('starbloom-tree')],{
    sourceGet:(x,y,z)=>src.get(`${x},${y},${z}`)??0}));
  assert.deepEqual(src,before);assert.equal(a.worldWrites,0);
  assert.ok(Object.isFrozen(a.edits));assert.ok(Object.isFrozen(a.edits[0]));
});
