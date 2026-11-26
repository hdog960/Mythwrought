import test from 'node:test';
import assert from 'node:assert/strict';
import {planShatteredPeakColumn,createShatteredPeakRegistry,shatteredPeakResearchProfile} from '../src/manual-biomes/shattered-peaks-sp1.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {physicalSectionBounds,physicalMeshKey} from '../src/world-height.mjs';
import {MOUNTAIN_V8_MATERIAL_IDS} from '../src/manual-biomes/mountain-v8-materials.mjs';
const seeds=[179,2026,-42];
test('real V6 source: bounded core peaks and unchanged neighbor ownership',()=>{
 for(const seed of seeds){
  let count=0,max=0;
  for(let x=-800;x<=100;x+=4)for(let z=-300;z<=300;z+=4){
   const p=planShatteredPeakColumn(x,z,seed);if(!p)continue;
   assert.equal(v6BiomeAt(x,z,seed).name,'mountain');
   assert.ok(p.topY>=20&&p.topY<=240);assert.equal(p.bridgeY,19);
   assert.deepEqual(p,planShatteredPeakColumn(x,z,seed));
   max=Math.max(max,p.topY);count++;
  }
  assert.ok(count>0);assert.ok(max>100);
 }
});
test('exact registry identity, explicit basal veto and historical exclusion',()=>{
 assert.throws(()=>createShatteredPeakRegistry());
 const profile=shatteredPeakResearchProfile(179),r=createShatteredPeakRegistry(()=>false);
 const p=r.open(profile);assert.equal(p.get(-512,20,0),0);
 assert.equal(p.occupied('sky:-32,0,0'),false);
 assert.throws(()=>r.open({...profile,generator:'mythwrought-five-surface-regions-mountain-v8'}));
 assert.throws(()=>r.open({...profile,sourceVersion:'wrong'}));
});
test('admitted research fixture uses actual registered IDs and exact section occupancy',()=>{
 const profile=shatteredPeakResearchProfile(179);
 // Explicit fixture only; NOT evidence of the original lower-world connection.
 const p=createShatteredPeakRegistry(()=>true).open(profile);
 for(const [cx,cz] of [[-32,0],[-33,-1],[-31,0],[0,0],[-16,0]]){
  for(let s=0;s<15;s++){
   const region={kind:'upper',section:s},b=physicalSectionBounds(region);
   let has=false;
   for(let z=cz*16;z<cz*16+16;z++)for(let x=cx*16;x<cx*16+16;x++){
    const id=p.get(x,b.minY,z);
    if(id){assert.ok(MOUNTAIN_V8_MATERIAL_IDS.includes(id));has=true;}
   }
   assert.equal(p.occupied(physicalMeshKey(cx,cz,region)),has);
  }
 }
 assert.equal(p.get(-512,19,0),0);assert.equal(p.get(-512,257,0),0);
 assert.equal(p.revision(),0);
});
test('cache eviction does not change source identity or cell bytes',()=>{
 const p=createShatteredPeakRegistry(()=>true).open(shatteredPeakResearchProfile(179));
 const before=Array.from({length:237},(_,i)=>p.get(-512,i+20,0));
 assert.ok(before.some(Boolean));
 for(let c=-100;c<-25;c++)p.occupied('sky:'+c+',0,0');
 assert.deepEqual(Array.from({length:237},(_,i)=>p.get(-512,i+20,0)),before);
});
