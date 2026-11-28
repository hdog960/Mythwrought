import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {chooseExpansionSpawn} from '../../src/mobs/age-of-beasts/spawn-selection.mjs';
const cat=completeBeastCandidateCatalog();
test('five actual baseline surface regions across three seeds report species-specific selection',()=>{
 const sites=[['meadow',0,0],['desert',512,0],['snow',0,512],['alpine',-512,0],['forest',0,-512]],all=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const biomeAt=(x,z)=>({mountain:'alpine',enchanted:'forest',snow:'snow',desert:'desert'})[v6BiomeAt(x,z,seed)?.name]??'meadow';
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:biomeAt(x,z),hazard:false,light:.2,dayPhase:'night'})});
  for(const [biome,cx,cz] of sites){
   const row={seed,biome,columns:0,proposals:0,admitted:[]};
   for(const d of [-8,0,8]){
    const x=cx+d,z=cz+d;if(biomeAt(x,z)!==biome)continue;row.columns++;
    let top=null;
    for(let y=19;y>=-3;y--){const id=world.get(x,y,z);if(id!==BLOCK.AIR&&id!==BLOCK.WOOD&&id!==BLOCK.LEAVES){top=y;break;}}
    if(top===null)continue;
    const candidates=cat.candidates.filter(c=>c.requirement.biome===biome);
    for(let i=0;i<candidates.length;i+=6){
     const proposals=candidates.slice(i,i+6).map(c=>({id:c.record.id,point:[x+.5,top+1,z+.5],rarityRoll:0}));row.proposals+=proposals.length;
     const selected=chooseExpansionSpawn(view,{proposals,observer:[x+8.5,top+1,z+.5],entities:[],homeChunk:[Math.floor(x/16),Math.floor(z/16),0].join(',')});
     if(selected){assert.equal(view.revision(),selected.revision);row.admitted.push(selected.id);}
    }
   }
   all.push(row);
  }
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB15 five-region actual baseline survey '+JSON.stringify(all));
 assert.equal(all.length,15);assert.ok(all.every(r=>r.columns>0));assert.ok(all.some(r=>r.admitted.length>0));
});
