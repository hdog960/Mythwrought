import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../../src/mobs/species.mjs';
import {APPROVED,BIOMES,ORIGINAL_IDS,validateApprovedRoster,composeCompleteRoster,matchesRequiredTime} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
const structuralFixtures=()=>APPROVED.map(x=>({id:x.id,displayName:x.displayName,classification:x.classification,implementation:'preview',render:{model:x.id},habitat:{biomes:[x.biome]}}));
test('exact approved quotas and immutable catalog, original 40 untouched',()=>{
 assert.equal(validateApprovedRoster(),true);
 assert.deepEqual(speciesRegistry.map(x=>x.id),ORIGINAL_IDS);
 assert.equal(new Set(APPROVED.map(x=>x.id)).size,60);
 for(const b of BIOMES)for(const c of ['passive','hostile'])assert.equal(APPROVED.filter(x=>x.biome===b&&x.classification===c).length,5);
 assert.ok(APPROVED.every(x=>Object.isFrozen(x)&&Object.isFrozen(x.habitat)&&Object.isFrozen(x.abilities)));
 assert.throws(()=>validateApprovedRoster([{...APPROVED[0],biome:'cave'},...APPROVED.slice(1)]));
});
test('structural composition preserves all original references and refuses incomplete or wrong additions',()=>{
 const fixtures=structuralFixtures();const result=composeCompleteRoster(speciesRegistry,fixtures);
 assert.equal(result.length,100);assert.ok(Object.isFrozen(result));
 for(let i=0;i<40;i++)assert.equal(result[i],speciesRegistry[i]);
 assert.throws(()=>composeCompleteRoster(speciesRegistry,fixtures.slice(1)));
 assert.throws(()=>composeCompleteRoster(speciesRegistry,[...fixtures.slice(0,59),fixtures[0]]));
 for(const mutation of [{implementation:'definition'},{classification:'hostile'},{habitat:{biomes:['desert']}},{render:{model:'unassigned'}}]){
 assert.throws(()=>composeCompleteRoster(speciesRegistry,[{...fixtures[0],...mutation},...fixtures.slice(1)]));
 }
 assert.equal(speciesRegistry.length,40);
});
test('hard time gates are distinct from activity preferences',()=>{
 const byId=id=>APPROVED.find(x=>x.id===id);
 assert.equal(matchesRequiredTime(byId('werewolf'),'day',true),false);
 assert.equal(matchesRequiredTime(byId('werewolf'),'night',true),true);
 assert.equal(matchesRequiredTime(byId('dire-hound'),'dusk',false),true);
 assert.equal(matchesRequiredTime(byId('mummy'),'day',true),true);
 assert.equal(matchesRequiredTime(byId('mummy'),'day',false),false);
 assert.equal(matchesRequiredTime(byId('jerboa'),'day',false),true);
 assert.equal(matchesRequiredTime(byId('honeybee'),'night',false),false);
 assert.equal(matchesRequiredTime(byId('bison'),null,false),false);
});
