import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {FourRegionWorld,fourRegionProfile,ENCHANTED_P2_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK,meshChunk} from '../../src/voxel.mjs';
import {WORLD_MAX_Y,WORLD_MIN_Y,sectionBounds} from '../../src/depth.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {touchesEnchantedForest,rejectWildsLegacyTree,wildsTreeStyleRoll} from '../../src/manual-biomes/enchanted-wilds-identity.mjs';
import {enchantedTreeCandidateKind} from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
const original=await import(pathToFileURL(resolve(process.env.WILDS_ORIGINAL_ROOT,'src/manual-biomes/profile-world.mjs')).href);
const seed=179, profile=fourRegionProfile(seed,ENCHANTED_P2_GENERATOR);
const old=new original.FourRegionWorld(seed,profile), current=new FourRegionWorld(seed,profile),
  wilds=new FourRegionWorld(seed,profile,{experimentalEnchantedWilds:true});
test('E1 deterministic species rebalance, whole footprint veto, mixed structure retention',()=>{
 const counts={};
 for(let i=0;i<10000;i++){
  const kind=enchantedTreeCandidateKind(wildsTreeStyleRoll((i+.5)/10000));
  counts[kind]=(counts[kind]??0)+1;
 }
 assert.deepEqual(counts,{'ancient-giant':2200,starspire:6600,moonwillow:1200});
 const forest=(x,z)=>x===3?{name:'enchanted'}:null;
 assert.equal(touchesEnchantedForest(seed,[[2,4,0,1],[3,6,0,2]], [2,3,0],forest),true);
 assert.equal(touchesEnchantedForest(seed,[[2,4,0,1]],null,forest),false);
 assert.equal(rejectWildsLegacyTree(seed,{origin:[-40,9,-520],cells:[[-40,10,-520,BLOCK.STONE]]},BLOCK.WOOD,BLOCK.LEAVES),false);
 assert.equal(v6BiomeAt(-40,-520,seed)?.name,'enchanted');
 assert.equal(rejectWildsLegacyTree(seed,{origin:[-40,9,-520],cells:[[-40,10,-520,BLOCK.WOOD]]},BLOCK.WOOD,BLOCK.LEAVES),true);
 console.log('WILDS STYLE DISTRIBUTION',JSON.stringify(counts));
});
test('research cannot save or become an old profile; original depth contract intact',()=>{
 assert.equal(WORLD_MAX_Y,19);assert.equal(WORLD_MIN_Y,-210);
 assert.equal(sectionBounds(0).maxY,19);
 assert.throws(()=>wilds.save(),/distinct durable generator/);
 assert.throws(()=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),{experimentalEnchantedWilds:true}),/explicit P2 opt-in/);
 assert.throws(()=>fourRegionProfile(seed,'mythwrought-enchanted-wilds-e1-research'),/Unknown biome generator/);
 assert.equal(wilds.experimentalEnchantedWilds,true);
 assert.equal(current.experimentalEnchantedWilds,false);
 assert.equal(Object.getOwnPropertyDescriptor(wilds,'experimentalEnchantedWilds').writable,false);
 assert.deepEqual(current.save(),old.save());
});
test('real P2 historical voxel parity, Wilds desert exact parity, actual enchanted source delta',()=>{
 let sampled=0,forestChanges=0,removedOrdinary=0;
 for(const [cx,cz] of [[-3,-33],[-2,-33],[-1,-33],[31,-1],[0,0]]){
  const forest=v6BiomeAt(cx*16+8,cz*16+8,seed)?.name==='enchanted';
  for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++)
   for(let y=-3;y<=WORLD_MAX_Y;y++){
    const a=old.get(x,y,z), b=current.get(x,y,z), c=wilds.get(x,y,z);
    assert.equal(b,a,'historical P2 changed '+[x,y,z]);
    if(!forest)assert.equal(c,a,'outside forest changed '+[x,y,z]);
    else if(c!==a){forestChanges++;if([BLOCK.WOOD,BLOCK.LEAVES].includes(a)&&c!==a)removedOrdinary++;}
    sampled++;
   }
 }
 assert.ok(forestChanges>0,'actual E1 natural forest must change');
 const desertOld=meshChunk(old,31,-1), desertNew=meshChunk(wilds,31,-1);
 assert.deepEqual(desertNew,desertOld);
 assert.equal(wilds.get(-40,-20,-520),old.get(-40,-20,-520));
 const mesh=meshChunk(wilds,-3,-33);assert.ok(mesh.length>0&&mesh.every(Number.isFinite));
 console.log('WILDS REAL SOURCE',JSON.stringify({sampled,forestChanges,removedOrdinary,desertMeshBytes:desertNew.byteLength,forestMeshBytes:mesh.byteLength}));
});
test('real naturally seeded district trees are suppressed as a whole when present, protected non-tree geometry retained',()=>{
 let acceptedPlans=0,visibleOriginal=0,removed=0,protectedCells=0;
 for(const [x,z] of [[-64,-512],[64,-512],[-64,-640],[64,-640]]){
  current.get(x,12,z);
  const district=current.liveDistrictCache.get(Math.floor(x/128)+','+Math.floor(z/128));
  assert.ok(district);
  for(const tree of [...district.trees,district.twinwood,district.canopyGate,district.archwood,district.fallenGiant]){
   if(!rejectWildsLegacyTree(seed,tree,BLOCK.WOOD,BLOCK.LEAVES))continue;
   acceptedPlans++;
   for(const [a,b,c,id] of tree.cells){
    const before=current._environmentBaseline(a,b,c);
    if(before!==id)continue;
    visibleOriginal++;
    assert.equal(wilds._environmentBaseline(a,b,c),BLOCK.AIR);
    removed++;
   }
  }
  for(const plan of [district.court,district.rotunda,district.rotundaApproach]){
   for(const [a,b,c,id] of plan?.cells??[]){
    if(id===BLOCK.WOOD||id===BLOCK.LEAVES)continue;
    assert.equal(wilds._environmentBaseline(a,b,c),current._environmentBaseline(a,b,c));
    protectedCells++;
   }
  }
 }
 assert.ok(acceptedPlans>0&&visibleOriginal>0&&removed===visibleOriginal,'require real visible wrong-tree witness');
 console.log('WILDS LEGACY TREE WITNESSES',JSON.stringify({acceptedPlans,visibleOriginal,removed,protectedCells}));
});
