import test from 'node:test';
import assert from 'node:assert/strict';
import {WildsFamilyResearchWorld,wildsRegionAt,WILDS_REGIONS} from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import {WILDS_GROUND_FAMILIES} from '../../src/manual-biomes/enchanted-wilds-ground.mjs';
import {biome130Block} from '../../src/biome130-registry.mjs';
import {BLOCK,meshChunk} from '../../src/voxel.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
test('six real ground families; actual deterministic region-owned floor placement and native edit',()=>{
 const w=new WildsFamilyResearchWorld(179),a=new Map(),ids=new Set();
 for(let cx=-8;cx<=3;cx++)for(let cz=-38;cz<=-28;cz++){
   for(const [k,id] of w.wildsSource.floraEntries(cx,cz)){
     const [x,y,z]=k.split(',').map(Number);assert.ok(!a.has(k));a.set(k,id);ids.add(id);
     assert.equal(w.get(x,y,z),id);assert.equal(v6BiomeAt(x,z,179)?.name,'enchanted');
     assert.equal(biome130Block(id).attachment,'ground');
     assert.notEqual(w.get(x,y-1,z),BLOCK.AIR);
     assert.equal(w.get(x,y+1,z),BLOCK.AIR);
   }
 }
 assert.equal(WILDS_GROUND_FAMILIES.length,6);assert.ok(a.size>20&&ids.size>=4);
 const [k,id]=a.entries().next().value,[x,y,z]=k.split(',').map(Number);
 const before=meshChunk(w,Math.floor(x/16),Math.floor(z/16));
 assert.equal(w.set(x,y,z,BLOCK.AIR),true);assert.equal(w.get(x,y,z),BLOCK.AIR);
 assert.notDeepEqual(meshChunk(w,Math.floor(x/16),Math.floor(z/16)),before);
 const cold=new WildsFamilyResearchWorld(179);
 assert.equal(cold.get(x,y,z),id);
 for(const [k,id] of a)assert.equal(cold.get(...k.split(',').map(Number)),id);
 console.log('WILDS E5 PHYSICAL FLOOR',JSON.stringify({placements:a.size,observedIDs:[...ids],families:WILDS_GROUND_FAMILIES,cache:cold.wildsSource.stats()}));
});
test('bounded natural rare-family witness search, all five internal regions',()=>{
 const found=new Map(),regions=new Set();
 let queried=0;
 for(const seed of [179,2026,-88]){
  const w=new WildsFamilyResearchWorld(seed);
  outer:for(let z=-768;z<=768;z+=32)for(let x=-768;x<=768;x+=32){
    const r=wildsRegionAt(x,z,seed);if(r===null)continue;regions.add(WILDS_REGIONS[r]);
    if(![0,2].includes(r)||v6BiomeAt(x,z,seed)?.weight<.82)continue;
    for(const p of w.wildsSource.plans(Math.floor(x/16),Math.floor(z/16))){
      if(![2,9].includes(p.id)||found.has(p.id))continue;
      const [a,b,c]=p.origin;assert.notEqual(w.get(a,b+1,c),BLOCK.AIR);
      found.set(p.id,{seed,origin:p.origin,family:p.family});
    }
    queried++;
    if(found.size===2&&regions.size===5)break outer;
  }
  if(found.size===2&&regions.size===5)break;
 }
 console.log('WILDS RARE NATURAL WITNESSES',JSON.stringify({queried,found:[...found.values()],regions:[...regions]}));
 assert.equal(found.size,2,'rare natural generation still needs witness');assert.equal(regions.size,5);
});
