// MYTHWROUGHT — all 241 original installed physical building producers,
// per-ID source placement and genuine save/restore; current V6 generator only.
// Uses actual production core VoxelWorld/biome130 + all original five-pack
// runtime owners, collision/attachment validation and checksummed sidecars.
// This native provider contract complements, but does not falsely substitute
// for, separate genuine original-game WebGL2 and click/touch acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {BLOCK} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,
  M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld,loadPack2LiveWorld} from '../src/pack2-world.mjs';
import {saveWorldSafe} from '../src/persistence.mjs';
import {worldSlotKey} from '../src/seeds.mjs';
import {buildCreativeCatalog} from '../src/creative-integration/creative-catalog.mjs';
import {createManual14SavedBridge} from '../src/builder-assets/manual14-layer.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
import {createManualFivePackLiveBuilder} from '../src/builder-assets/manual-five-pack-live.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
function device(){
  const data=new Map();
  return {getItem:k=>data.get(k)??null,
    setItem:(k,v)=>data.set(k,String(v)),
    removeItem:k=>data.delete(k),keys:()=>[...data.keys()]};
}
function mounted(base,storage){
  const world=loadPack2LiveWorld(storage,base).world;
  const pack3=createPack3LiveBridge(world,storage);
  const manual14=createManual14SavedBridge(world,storage);
  world.manual14Layer=manual14.layer;
  world.manual14Collision=box=>manual14.collision(box);
  const pack5=createPack5LiveAdapter(world,{storage});
  world.pack5Layer=pack5.layer;
  world.pack5Collision=box=>pack5.collision(box);
  const counts={pack2:0,pack3:0,pack5:0};
  const player={x:1000000,feet:18,z:1000000};
  const builder=createManualFivePackLiveBuilder({
    getWorld:()=>world,getManual14:()=>manual14,getPack3:()=>pack3,
    getPack5:()=>pack5,getPlayer:()=>player,storage,canEdit:()=>true,
    rebuildPack2:()=>{counts.pack2++},
    rebuildPack3:()=>{counts.pack3++},
    rebuildPack5:()=>{counts.pack5++}
  });
  return {world,pack3,manual14,pack5,builder,counts};
}
test('Every one of 241 Creative block IDs physically places and survives original V6 schema-1/owner-specific reload',async()=>{
  const seed=77531,storage=device(),catalog=buildCreativeCatalog();
  assert.equal(catalog.blocks.length,241);
  assert.equal(catalog.creatures.length,40);
  const counts=Object.fromEntries(
    [...new Set(catalog.blocks.map(x=>x.owner))]
      .map(owner=>[owner,catalog.blocks.filter(x=>x.owner===owner).length]));
  assert.deepEqual(counts,{core:5,biome130:130,pack2:18,pack1:30,
    pack3:17,pack4:23,pack5:18});
  const fresh=()=>new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  const {world,pack3,manual14,pack5,builder}=mounted(fresh(),storage);
  assert.equal(world.base.generationProfile.generator,M6_BALANCED_GENERATOR);
  // Pack2 Creative uses the already-registered numeric ID. Cross-check
  // its original authored family symbol rather than inventing one or
  // changing production inventory IDs.
  const pack2Symbols=new Map(MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===2)
    .map(x=>[x.numericId,x.symbol]));
  assert.equal(pack2Symbols.size,18,'Original Pack2 source family registry incomplete');
  const records=[];
  for(const [i,item] of catalog.blocks.entries()){
    const at=[1000+i*8,15,1000],owner=item.owner;
    // Local in-memory fixture: exact current-V6 source setter; choose 241
    // nonoverlapping actual editable cells. Support cells are real STONE
    // blocks, never an injected success flag or invisible mounting override.
    if(world.get(...at)!==BLOCK.AIR)
      assert.equal(world.set(...at,BLOCK.AIR),true);
    let result,shape=null,supportAt=null;
    if(owner==='core'||owner==='biome130'){
      result={ok:world.set(...at,item.id),verifiedSave:false,
        sourceExact:true};
    }else{
      const sourceSymbol=owner==='pack2'?pack2Symbols.get(item.id):item.symbol;
      assert.match(sourceSymbol,/^pack[1-5]:[0-9]{3}$/,
        'Physical builder lacks original source symbol for '+item.key);
      shape=builder.resolve(sourceSymbol,{
        numericId:item.id,orientation:0,
        variant:owner==='pack5'?item.variants?.[0]??null:null,state:{}
      });
      assert.equal(shape.physical,true,'Missing genuine physical source '+item.key);
      assert.ok(shape.selectionBoxes.length||shape.visibleBoxes.length,
        'No original physical bounds for '+item.key);
      const supports=[...shape.supportOffsets.map(offset=>
        at.map((v,axis)=>v+offset[axis]))];
      if(shape.supportPolicy==='vertical-face'){
        supportAt=[at[0]+1,at[1],at[2]];
        supports.push(supportAt);
      }
      for(const backing of supports){
        assert.ok(backing[1]>=-210&&backing[1]<=19,
          'Source authored support outside world height '+item.key);
        if(world.get(...backing)!==BLOCK.STONE)
          assert.equal(world.set(...backing,BLOCK.STONE),true,
            'Could not create authentic structural support '+item.key);
      }
      result=await builder.place({
        asset:sourceSymbol,numericId:item.id,at,orientation:0,
        ...(owner==='pack5'?{variant:item.variants[0]}:{}),
        ...(supportAt?{supportAt}:{})
      });
    }
    assert.equal(result.ok,true,
      item.key+' source physical placement failed: '+result.reason);
    let seen;
    if(owner==='pack1'||owner==='pack4')
      seen=manual14.layer.get(at)?.numericId;
    else if(owner==='pack3')
      seen=pack3.getAt(...at)?.id;
    else if(owner==='pack5')
      seen=pack5.layer.list().find(row=>
        row.anchor?.every((v,j)=>v===at[j]))?.symbolicId;
    else seen=world.get(...at);
    assert.equal(seen,owner==='pack5'?item.symbol:item.id,
      item.key+' physical owner did not materialize source asset');
    records.push({key:item.key,owner,id:item.id,
      symbol:owner==='pack2'?pack2Symbols.get(item.id):item.symbol??null,
      at,sourcePhysical:true,backing:supportAt});
  }
  assert.equal(records.length,241);
  const written=saveWorldSafe(storage,world);
  assert.equal(written.ok,true,'Original strict schema-1 primary save failed');
  const canonical=storage.getItem(worldSlotKey(seed));
  assert.equal(JSON.parse(canonical).schema,1);
  assert.equal(JSON.parse(canonical).seed,seed);
  assert.equal(storage.keys().some(x=>x.includes('pack2-live')),true);
  assert.equal(storage.keys().some(x=>x.includes('pack3-construction')),true);
  assert.equal(storage.keys().some(x=>x.includes('manual14.seed')),true);
  assert.equal(storage.keys().some(x=>x.includes('pack5.builder')),true);
  // Real V6 generator re-initialized from SAVED canonical row bytes, then
  // exact original pack sidecar constructors run all their physical validation
  // against restored blocks; do NOT manufacture a saved layer or skip checks.
  const loadedBase=fresh();
  for(const edit of JSON.parse(canonical).edits)
    assert.equal(loadedBase.set(...edit),true);
  const restored=mounted(loadedBase,storage);
  assert.equal(JSON.stringify(restored.world.save()),canonical);
  assert.equal(restored.world.base.generationProfile.generator,M6_BALANCED_GENERATOR);
  for(const item of records){
    const at=item.at;
    let id;
    if(item.owner==='pack1'||item.owner==='pack4')
      id=restored.manual14.layer.get(at)?.numericId;
    else if(item.owner==='pack3')id=restored.pack3.getAt(...at)?.id;
    else if(item.owner==='pack5')id=restored.pack5.layer.list()
      .find(row=>row.anchor?.every((v,j)=>v===at[j]))?.symbolicId;
    else id=restored.world.get(...at);
    assert.equal(id,item.owner==='pack5'?item.symbol:item.id,
      item.key+' source physical save/reload lost installed geometry');
    item.reloadedSourceExact=true;
  }
  assert.equal(restored.manual14.layer.size(),53);
  assert.equal(restored.pack3.runtime.size(),17);
  assert.equal(restored.pack5.layer.count(),18);
  assert.equal(restored.world.pack2Cells.size,18);
  assert.equal(storage.getItem(worldSlotKey(seed)),canonical,
    'Source sidecar reload changed original canonical V6 save bytes');
  await mkdir('artifacts/creative-241',{recursive:true});
  await writeFile('artifacts/creative-241/physical-source-manifest.json',
    JSON.stringify({kind:'all-241-real-current-v6-production-source-physical-owners',
      sourceCommit:process.env.GITHUB_SHA||null,seed,generator:M6_BALANCED_GENERATOR,
      status:'ALL_241_PHYSICAL_PROVIDERS_PLACED_AND_RELOADED',
      count:records.length,owners:counts,canonicalSHA256:sha(canonical),
      archivedPlayable:false,sourceNativeOwnersOnly:true,
      fullOriginalGameWebGL2PerIdUIClickNotCertified:true,
      iPhoneHardwareCertified:false,
      records},null,2)+'\n');
  console.log('CREATIVE_PHYSICAL_ALL_241_NATIVE_SOURCE_OWNERS_RELOADED',
    JSON.stringify({count:records.length,owners:counts,
      canonicalSHA256:sha(canonical)}));
});
