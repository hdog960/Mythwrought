import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCreativeCatalog,filterCreativeItems,CREATIVE_CATEGORIES}
  from '../src/creative-integration/creative-catalog.mjs';
import {BUILD_MATERIALS} from '../src/blocks.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';

test('Creative auto-discovers all physically implemented production block sources once',()=>{
  const catalog=buildCreativeCatalog();
  assert.equal(catalog.blocks.length,241);
  assert.equal(catalog.creatures.length,40);
  assert.equal(catalog.records.length,281);
  assert.equal(new Set(catalog.records.map(x=>x.key)).size,281);
  assert.equal(filterCreativeItems(catalog).length,241);
  assert.equal(filterCreativeItems(catalog,{category:'creatures'}).length,40);
  for(const id of BUILD_MATERIALS)
    assert.equal(catalog.blocks.filter(x=>x.id===id).length,1,'live core/biome/pack2 '+id);
  for(const asset of MANUAL_FIVE_PACK_CATALOG)
    assert.equal(catalog.blocks.filter(x=>x.id===asset.numericId).length,1,'manual pack '+asset.numericId);
  for(const species of speciesRegistry)
    assert.equal(catalog.creatures.filter(x=>x.id===species.id).length,1,'live mob '+species.id);
});
test('Inventory searches every source, filters passive/hostile, no bogus entries',()=>{
  const c=buildCreativeCatalog(), categories=CREATIVE_CATEGORIES.map(x=>x[0]);
  assert.equal(new Set(categories).size,10);
  assert.equal(filterCreativeItems(c,{category:'creatures',classification:'passive'}).length,20);
  assert.equal(filterCreativeItems(c,{category:'creatures',classification:'hostile'}).length,20);
  assert.equal(filterCreativeItems(c,{category:'creatures',search:'Zombie'}).length,1);
  assert.equal(filterCreativeItems(c,{category:'all',search:'stone'}).every(x=>x.name.toLowerCase().includes('stone')),true);
  assert.equal(filterCreativeItems(c,{category:'all',search:'no-such-item'}).length,0);
  assert.throws(()=>filterCreativeItems(c,{category:'uninstalled'}),/filter/);
  assert.throws(()=>filterCreativeItems(c,{classification:'wrong'}),/filter/);
});
