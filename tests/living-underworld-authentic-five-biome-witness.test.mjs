import test from 'node:test';
import assert from 'node:assert/strict';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';

// Exact historical original-M7 source-safe surface mouths in authenticated
// GitHub Actions artifact #14733859064, parent HEAD f7de8cfe6c4e055e.
// Surface-only prior evidence; not current deep-walking/source approval.
const SEED=179;
const SITES=Object.freeze([
 Object.freeze({name:'plains',rx:-9,rz:0,x:-2149,z:181}),
 Object.freeze({name:'desert',rx:-3,rz:-9,x:-547,z:-2150}),
 Object.freeze({name:'snow',rx:-6,rz:3,x:-1428,z:785}),
 Object.freeze({name:'mountain',rx:6,rz:9,x:1669,z:2346}),
 Object.freeze({name:'enchanted',rx:-9,rz:-6,x:-2182,z:-1463})
]);

test('all five historical actual M7 safe mouths retain original biome identity',()=>{
 assert.equal(new Set(SITES.map(x=>x.name)).size,5);
 for(const s of SITES){
  assert.equal(Math.floor(s.x/256),s.rx);
  assert.equal(Math.floor(s.z/256),s.rz);
  assert.equal(v6BiomeAt(s.x,s.z,SEED)?.name??'plains',s.name);
 }
});
test('do not infer a biome just from its named underworld region center',()=>{
 const actual=SITES.map(x=>v6BiomeAt(x.x,x.z,SEED)?.name??'plains');
 assert.deepEqual(actual,SITES.map(x=>x.name));
});
