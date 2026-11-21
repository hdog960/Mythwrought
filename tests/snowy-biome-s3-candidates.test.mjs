import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {BLOCK} from '../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';
import {SNOWY_S3_STYLES,proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';

const key=row=>row.slice(0,3).join(',');
test('S3 four genuinely distinct physical snowy tree silhouettes are bounded and deterministic',()=>{
  assert.deepEqual(SNOWY_S3_STYLES,['compact-fir','layered-spruce',
    'highland-pine','windswept-alpine']);
  const seen=new Set();
  for(const style of SNOWY_S3_STYLES){
    const a=proposedSnowTree(style,-16,8,15);
    const b=proposedSnowTree(style,-16,8,15);
    assert.deepEqual(a,b,style+' deterministic cell placement');
    assert.ok(a.cells.length>15&&a.cells.length<120,style+' voxel budget');
    assert.equal(new Set(a.cells.map(key)).size,a.cells.length,
      style+' duplicate physical cells');
    assert.ok(a.cells.every(c=>c.every(Number.isSafeInteger)));
    assert.ok(a.cells.every(c=>c[1]>8&&c[1]<=19));
    assert.ok(a.cells.every(c=>[BLOCK.WOOD,G.coldNeedles,G.snowyNeedles].includes(c[3])));
    assert.ok(a.cells.some(c=>c[3]===G.snowyNeedles),'Snow must be visible');
    assert.ok(a.cells.some(c=>c[3]===G.coldNeedles),'Cold canopy lower tier required');
    for(let dy=1;dy<=a.height;dy++)
      assert.ok(a.cells.some(([x,y,z,id])=>
        x===-16&&y===8+dy&&z===15&&id===BLOCK.WOOD),
        style+' needs full load-bearing trunk');
    const silhouette=a.cells.map(([x,y,z,id])=>[x+16,y-8,z-15,id].join(',')).join('|');
    assert.equal(seen.has(silhouette),false,style+' duplicates another actual tree');
    seen.add(silhouette);
    assert.ok(a.bounds[0]>=-19&&a.bounds[3]<=-13,'Tree footprint too wide');
    assert.ok(a.bounds[2]>=12&&a.bounds[5]<=18,'Tree footprint too wide');
  }
  assert.equal(seen.size,4);
});
test('S3 high alpine floor fail-closed; different wind creates physical directional variance',()=>{
  assert.equal(proposedSnowTree('highland-pine',0,11,0),null);
  const left=proposedSnowTree('windswept-alpine',1,6,1,{wind:-1});
  const right=proposedSnowTree('windswept-alpine',1,6,1,{wind:1});
  assert.notDeepEqual(left.cells,right.cells);
  assert.throws(()=>proposedSnowTree('unknown',0,6,0),/Unknown/);
  assert.throws(()=>proposedSnowTree('compact-fir',0,6,0,{wind:0}),/Invalid/);
});
test('S3 is genuinely detached from current M7 generation and does not mutate profile/save',()=>{
  const source=readFileSync('src/manual-biomes/environment-v7.mjs','utf8');
  const profile=readFileSync('src/manual-biomes/profile-world.mjs','utf8');
  const runtime=readFileSync('src/main.mjs','utf8');
  for(const s of [source,profile,runtime])
    assert.equal(s.includes('snowy-s3-tree-prototypes'),false,
      'Detachment is a safety requirement until S2 provenance and versioned save gate');
});
