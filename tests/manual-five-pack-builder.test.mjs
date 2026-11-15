import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME130_REGISTERED_IDS} from '../src/biome130-registry.mjs';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';
import {
 MANUAL_FIVE_PACK_CATALOG,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 MANUAL_FIVE_PACK_NUMERIC_IDS,MANUAL_FIVE_PACK_COUNTS,
 manualFivePackVariants,resolveManualFivePackAsset,planManualFivePackBlueprint
} from '../src/builder-assets/manual-five-pack.mjs';

const pack5Variants=new Map(PACK5_BUILDER_CATALOG.map(x=>[x.symbolicId,x.variants[0]]));
const config=row=>({numericId:row.numericId,orientation:0,
 ...(row.pack===5?{variant:pack5Variants.get(row.symbol)}:{})});
test('exact five-owner inventory: 96 unique roster families and 106 distinct numeric variants',()=>{
 assert.deepEqual(MANUAL_FIVE_PACK_COUNTS,{packs:5,families:96,numericVariants:106,
  productionRegistered:false,worldPlaced:false,requiresCombinedRuntimeAcceptance:true});
 assert.equal(MANUAL_FIVE_PACK_CATALOG.length,106);
 assert.equal(MANUAL_FIVE_PACK_FAMILY_SYMBOLS.length,96);
 assert.equal(new Set(MANUAL_FIVE_PACK_NUMERIC_IDS).size,106);
 for(const [pack,count] of [[1,30],[2,18],[3,17],[4,23],[5,18]])
  assert.equal(MANUAL_FIVE_PACK_CATALOG.filter(row=>row.pack===pack).length,count);
 assert.deepEqual(MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===5).map(x=>x.numericId),
  Array.from({length:18},(_,i)=>209+i));
});
test('manual reserved IDs never collide with existing biome130, 255, or legacy IDs',()=>{
 const protectedIds=new Set([0,1,2,3,4,5,6,7,8,255,...BIOME130_REGISTERED_IDS]);
 for(const id of MANUAL_FIVE_PACK_NUMERIC_IDS)assert.equal(protectedIds.has(id),false);
});
test('all 106 physically authored numeric assets resolve through one builder API',()=>{
 for(const row of MANUAL_FIVE_PACK_CATALOG){
  const asset=resolveManualFivePackAsset(row.symbol,config(row));
  assert.equal(asset.numericId,row.numericId,row.symbol);
  assert.equal(asset.sourcePack,row.pack,row.symbol);
  assert.equal(asset.physical,true,row.symbol);
  assert.equal(asset.builderResolvable,true,row.symbol);
  assert.equal(asset.livePlaceable,false,row.symbol);
  assert.equal(asset.saveWritten,false,row.symbol);
  assert.ok(asset.occupiedOffsets.length>0,row.symbol);
  assert.ok(asset.visibleBoxes.length>0,row.symbol);
  assert.ok(asset.selectionBoxes.length>0,row.symbol);
  for(const box of [...asset.visibleBoxes,...asset.collisionBoxes,...asset.selectionBoxes]){
    assert.equal(box.length,6,row.symbol);
    assert.ok(box.every(Number.isFinite),row.symbol);
  }
 }
});
test('ambiguous same-family Pack 1 and Pack 4 assets cannot silently choose wrong variant',()=>{
 for(const pack of [1,4]){
  const groups=MANUAL_FIVE_PACK_FAMILY_SYMBOLS.filter(s=>s.startsWith('pack'+pack+':'));
  const symbol=groups.find(s=>manualFivePackVariants(s).length>1);
  assert.ok(symbol,'expected multi-ID family for Pack '+pack);
  assert.throws(()=>resolveManualFivePackAsset(symbol),/Ambiguous/);
  for(const row of manualFivePackVariants(symbol)){
   const item=resolveManualFivePackAsset(symbol,config(row));
   assert.equal(item.numericId,row.numericId);
  }
 }
});
test('Pack 5 must select an authored variant; no silent default state',()=>{
 const symbol='pack5:082';
 assert.throws(()=>resolveManualFivePackAsset(symbol),/explicit authored variant/);
 assert.throws(()=>resolveManualFivePackAsset(symbol,{variant:'invented'}),/variant/);
 const sample=resolveManualFivePackAsset(symbol,{variant:pack5Variants.get(symbol)});
 assert.equal(sample.sourcePack,5);
 assert.ok(sample.occupiedOffsets.length>=1);
});
test('mixed five-pack physical plans stay read-only and preserve source ownership',()=>{
 const chosen=[1,2,3,4,5].map(pack=>MANUAL_FIVE_PACK_CATALOG.find(x=>x.pack===pack));
 const placements=chosen.map((row,i)=>({at:[i*8,4,0],asset:row.symbol,...config(row)}));
 const plan=planManualFivePackBlueprint(placements);
 assert.equal(plan.instances,5);
 assert.equal(plan.physicalAssets.length,5);
 assert.deepEqual(plan.physicalAssets.map(x=>x.sourcePack),[1,2,3,4,5]);
 assert.ok(plan.occupiedCellCount>=5);
 assert.equal(plan.readyForWorldPlacement,false);
 assert.equal(plan.worldPlaced,false);
 assert.equal(plan.saveWritten,false);
 assert.ok(plan.physicalAssets.every(x=>x.collision.length>=0));
});
test('overlapping physical placements and illegal builder options fail closed',()=>{
 const row=MANUAL_FIVE_PACK_CATALOG.find(x=>x.pack===3);
 const a={asset:row.symbol,at:[3,4,5],numericId:row.numericId};
 assert.throws(()=>planManualFivePackBlueprint([a,a]),/Overlapping/);
 assert.throws(()=>planManualFivePackBlueprint([{...a,at:[1.5,4,5]}]),/Invalid/);
 assert.throws(()=>resolveManualFivePackAsset('biome130:001'),/Unknown/);
 assert.throws(()=>resolveManualFivePackAsset(row.symbol,{numericId:255}),/does not belong/);
 assert.throws(()=>resolveManualFivePackAsset(row.symbol,{orientation:'diagonal'}),/orientation/);
});
test('rotations and authored support metadata survive builder bridge without writing saves',()=>{
 const row=MANUAL_FIVE_PACK_CATALOG.find(x=>x.pack===4&&x.numericId===166);
 const shape=resolveManualFivePackAsset(row.symbol,{numericId:row.numericId,orientation:'west'});
 assert.equal(shape.orientation,3);
 assert.equal(shape.supportOffsets.length,1);
 const plan=planManualFivePackBlueprint([{asset:row.symbol,at:[0,5,0],
  numericId:row.numericId,orientation:'west'}]);
 assert.equal(plan.unresolvedSupports.length,1);
 assert.equal(plan.unresolvedSupports[0].reason,'requires-certified-world-support');
});
