import test from 'node:test';
import assert from 'node:assert/strict';
import {SCHEMA,BIOMES,SIZES,QUOTAS,TARGET,blueprintId,validateBlueprint,stableBlueprintJSON,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1/schema.mjs';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-1/manifest.json',import.meta.url),'utf8'));
const full={kind:'full-cell',bounds:[0,0,0,1,1,1]};
function sample(){return {schema:SCHEMA,id:blueprintId('house','temperate','small',1),index:1,category:'house',biome:'temperate',size:'small',status:'candidate',frame:'local-x-east-y-up-z-south',footprint:{width:7,height:5,depth:7},worldPlacement:false,liveIntegration:false,
  placements:[{at:[0,0,0],role:'foundation',asset:'live:stone',orientation:'none',occupancy:full},{at:[2,1,2],role:'furnishing',asset:'pack4:059',orientation:'north',occupancy:{kind:'unresolved',bounds:null,reason:'candidate requires approved physical bounds'}}],
  rooms:[{id:'common',min:[1,1,1],max:[6,4,6]}],walkable:[[1,1,1],[1,1,2],[1,1,3]],portals:[{from:'outside',to:'common',at:[1,1,1],passable:true}],
  dependencies:[{asset:'pack4:059',status:'unresolved',requires:['approved occupancy dimensions','collision/selection interface','state/rotation ABI']}]
};}
function mutate(fn){const b=sample();fn(b);return b;}
test('exact quota matrix is 885 with 300 houses and all five biomes/three sizes',()=>{assert.equal(TARGET,885);assert.equal(QUOTAS.house*BIOMES.length*SIZES.length,300);assert.equal(Object.values(QUOTAS).reduce((a,b)=>a+b,0),59);assert.deepEqual(manifest.designsPerSizePerBiome,QUOTAS);assert.ok(manifest.authoredBlueprintCount>=0&&manifest.authoredBlueprintCount<=TARGET);assert.equal(manifest.authoredBlueprintCount,manifest.candidateBlueprintCount??manifest.authoredBlueprintCount);});
test('canonical scoped IDs and quota boundaries',()=>{assert.equal(blueprintId('lighthouse','mountain','large',4),'r1:lighthouse:mountain:large:004');assert.throws(()=>blueprintId('house','temperate','small',21));});
test('real coordinate-based fixture, walkable room and symbolic furnishing passes',()=>{assert.equal(validateBlueprint(sample()),true);assert.equal(validatePool([sample()]).remaining,884);});
test('stable serialization does not depend on placements input order',()=>{const b=sample();const c=sample();c.placements.reverse();assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(c));});
test('geometry fingerprint ignores material/asset repainting',()=>{const b=sample(),c=sample();c.placements[0].asset='live:wood';assert.equal(structuralFingerprint(b),structuralFingerprint(c));assert.throws(()=>validatePool([b,c]),/duplicate blueprint ID/);c.index=2;c.id=blueprintId('house','temperate','small',2);assert.throws(()=>validatePool([b,c]),/identical geometry/);});
test('reject invalid persistent numeric reference',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.placements[0].asset='255';})),/asset must use/));
test('reject unexplained placeholder dimensions',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.placements[1].occupancy.reason='';})),/unresolved dimensions/));
test('reject unresolved candidate omitted from dependency ledger',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.dependencies=[];})),/dependency ledger/));
test('reject occupied walkable passage',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.walkable.push([0,0,0]);})),/physically occupied/));
test('reject disconnected interior',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.rooms.push({id:'bedroom',min:[2,1,2],max:[4,4,4]});})),/not every room/));
test('reject floating entry portal outside circulation',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.portals[0].at=[5,3,5];})),/known walkable/));
test('reject overlapping placed voxels',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.placements.push({...b.placements[0]});})),/overlapping/));
test('no world placement or live engine integration allowed',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.worldPlacement=true;})),/no world placement/));
test('reject mismatched category and index',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.category='tavern';})),/noncanonical/));
test('reject disconnected walkable voxel island',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.walkable.push([5,1,5]);})),/disconnected voxel circulation/));
test('reject unregistered live asset',()=>assert.throws(()=>validateBlueprint(mutate(b=>{b.placements[0].asset='live:imaginary';})),/unknown live voxel family/));

test('unintegrated candidate cannot masquerade as a resolved full-cell physical asset',()=>{
 assert.throws(()=>validateBlueprint(mutate(b=>{b.placements[1].occupancy=full;})),/future asset requires unresolved/);
});
test('duplicate or ghost placeholder dependency cannot silently pass substitution validation',()=>{
 assert.throws(()=>validateBlueprint(mutate(b=>{b.dependencies.push({...b.dependencies[0]});})),/duplicate or invalid asset dependency/);
 assert.throws(()=>validateBlueprint(mutate(b=>{b.dependencies.push({asset:'pack5:095',status:'unresolved',requires:['bounds']});})),/dependency refers to no unresolved placement/);
});
test('placeholder dependency must state at least one concrete unresolved requirement',()=>{
 assert.throws(()=>validateBlueprint(mutate(b=>{b.dependencies[0].requires=[' '];})),/incomplete unresolved dependency contract/);
});
