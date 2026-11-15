import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BLOCK,collides} from '../src/voxel.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
const source=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
const page=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const w=()=>({seed:8,get(){return BLOCK.AIR;}});
test('opt-in adds exact furniture collisions without occupying an entire legacy cube',()=>{
  const world=w(),adapter=createPack5LiveAdapter(world);
  assert.equal(adapter.layer.place('pack5:080',[0,4,0]).ok,true);
  assert.equal(collides(world,.5,4.1,.5),false);
  world.pack5Collision=box=>adapter.collision(box);
  assert.equal(collides(world,.5,4.1,.5),true);
  assert.equal(world.get(0,4,0),BLOCK.AIR);
  assert.equal(collides(world,10,4,10),false);
});
test('game builder mode is explicit, never silently extends legacy block buttons',()=>{
  for(const id of ['pack5Enabled','pack5Family','pack5Variant','pack5Rotation','pack5Status'])
    assert.match(page,new RegExp('id="'+id+'"'));
  assert.match(source,/pack5Enabled\.addEventListener\('change'/);
  assert.match(source,/pack5Mode&&pack5Builder/);
  assert.match(source,/pack5Gpu\.draw/);
  assert.match(source,/resetPack5ForWorld\(\)/);
  assert.match(source,/pack5Builder\.importJson/);
  assert.match(page,/id="pack5Import"/);
  assert.match(page,/id="pack5ImportFile"/);
});
