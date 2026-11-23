import assert from 'node:assert/strict';
import test from 'node:test';
import {previewSnowS6FreshWorldTile as preview}
  from '../src/manual-biomes/snowy-s6-fresh-world-design-preview.mjs';
import {SNOW_S6_CANDIDATE_PROFILE}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';
const M7='mythwrought-five-surface-regions-v7';
const tile={x:-16,z:512,width:8,height:8};
const req={profileProposal:SNOW_S6_CANDIDATE_PROFILE,
  intent:'fresh-new-world-research-only',allowM7SaveMigration:false};
function fixture(){
  let reads=0;const edits=new Map(),rotations=new Map();
  const world={seed:179,edits,rotations,generationProfile:{generator:M7},
    _columnPlan:()=>{reads++;return new Map()},
    environmentCaves:{get:()=>undefined},
    get:()=>{reads++;return 0},
    save:()=>({schema:1,seed:179,edits:[]})};
  const f=()=>{reads++;return null;};
  const deps={biomeAt:f,terrainHeight:f,legacyNatural:f,
    proposedSnowTree:f,planScenery:f,describeScene:f,collides:f};
  return {world,deps,reads:()=>reads,edits,rotations};
}
test('original M7 read requires explicit candidate marker and research-only intent',()=>{
  const v=fixture();
  for(const bad of [{},{...req,profileProposal:M7},
    {...req,intent:'open-saved-world'}, {...req,allowM7SaveMigration:true}])
    assert.throws(()=>preview(v.world,tile,v.deps,bad),/explicit research-only/);
  assert.equal(v.reads(),0);
});
test('existing player edits and rotations abort before touching original physical source',()=>{
  const v=fixture();
  v.edits.set('0,7,0',0);
  assert.throws(()=>preview(v.world,tile,v.deps,req),/pristine original/);
  v.edits.clear();v.rotations.set('0,7,0',1);
  assert.throws(()=>preview(v.world,tile,v.deps,req),/pristine original/);
  assert.equal(v.reads(),0);
});
test('old profile cannot be silently migrated into experimental new-world research',()=>{
  const v=fixture();
  for(const id of ['mythwrought-five-surface-regions-v6',
    SNOW_S6_CANDIDATE_PROFILE,'mythwrought-four-surface-regions-v4']){
    assert.throws(()=>preview({...v.world,generationProfile:{generator:id}},
      tile,v.deps,req),/pristine original/);
  }
});
test('tile must be bounded within one real 16x16 chunk, including negative coords',()=>{
  const v=fixture();
  for(const bad of [{...tile,width:9},{...tile,height:9},
    {...tile,width:1},{...tile,x:-4,width:8}, {...tile,z:511},
    {...tile,x:NaN},{...tile,x:100001}]){
    assert.throws(()=>preview(v.world,bad,v.deps,req),/within one bounded/);
  }
  assert.equal(v.reads(),0);
});
test('explicit complete physical source callbacks required even in research-only mode',()=>{
  const v=fixture();
  for(const name of Object.keys(v.deps))
    assert.throws(()=>preview(v.world,tile,{...v.deps,[name]:null},req),
      /full physical readers/);
});
test('nonempty or incompatible schema-1 payload is rejected without source mutation',()=>{
  const v=fixture();
  for(const bad of [{schema:2,seed:179,edits:[]},
    {schema:1,seed:2026,edits:[]},
    {schema:1,seed:179,edits:[[0,6,0,0]]},
    {schema:1,seed:179,edits:[],rotations:[[0,6,0,1]]}]){
    assert.throws(()=>preview({...v.world,save:()=>bad},tile,v.deps,req),
      /preexisting or unsupported schema-1/);
  }
  assert.equal(v.edits.size,0);
});
