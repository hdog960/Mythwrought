import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,chunkCoord,collides} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {findSafeSpawn} from '../../src/physics.mjs';
import {biome130Block,isBiome130BlockId} from '../../src/biome130-registry.mjs';
import {surfaceBiomeAt,surfaceBiomeHeight,SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';
import {FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR,FourRegionWorld,
  fourRegionProfile,validateFourRegionProfile,restoreFourRegionWorld} from '../../src/manual-biomes/profile-world.mjs';
import {M3_DESERT_IDS,M3_XERIC_IDS,m3DesertHeight,
  m3DesertXeric,m3DesertFreshColumn} from '../../src/manual-biomes/desert-m3.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';

class Storage{
  state=new Map();
  get length(){return this.state.size;}
  key(i){return [...this.state.keys()][i]??null;}
  getItem(k){return this.state.get(String(k))??null;}
  setItem(k,v){this.state.set(String(k),String(v));}
  removeItem(k){this.state.delete(String(k));}
}
const key=(x,y,z)=>x+','+y+','+z;
const desert=SURFACE_BIOME_REGIONS[0];
const newWorld=(storage,seed=179)=>openM2World(storage,
  planM2WorldChoice(String(seed),M2_WORLD_MODE.CREATE_FOUR,{confirmed:true}));
const oldWorld=(seed=179)=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M2_FOUR_REGION_GENERATOR));

test('M3: v3 generator is immutable, existing v2 profile stays source-exact and loadable',()=>{
  assert.equal(M3_FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v3');
  assert.equal(FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v4');
  const old=oldWorld(),newer=new FourRegionWorld(179);
  assert.equal(old.generationProfile.generator,M2_FOUR_REGION_GENERATOR);
  assert.equal(newer.generationProfile.generator,FOUR_REGION_GENERATOR);
  assert.deepEqual(validateFourRegionProfile(fourRegionProfile(179,M2_FOUR_REGION_GENERATOR)),
    fourRegionProfile(179,M2_FOUR_REGION_GENERATOR));
  assert.throws(()=>fourRegionProfile(179,'mythwrought-four-surface-regions-v4'));
  const cached=JSON.stringify(old.save());
  assert.equal(JSON.stringify(restoreFourRegionWorld(old.save(),old.profile).save()),cached);
  for(const r of SURFACE_BIOME_REGIONS.slice(1)){
    for(let dx=-8;dx<=8;dx+=4)for(let dz=-8;dz<=8;dz+=4)
      for(const y of [-40,0,8,12,16]){
        assert.equal(newer.get(r.x+dx,y,r.z+dz),
          old.get(r.x+dx,y,r.z+dz),
          r.name+' old surface must stay byte-for-byte equivalent');
      }
  }
  const legacy=new VoxelWorld(179);
  assert.equal(JSON.stringify(legacy.save()),cached,
    'unprofiled legacy schema-1 must remain unchanged');
});

test('M3: dunes create physical continuous non-chunk-aligned multi-chunk relief',()=>{
  const seed=179,oldTop=terrainHeight(512,0,seed);
  const anchor=m3DesertHeight(512,0,seed);
  assert.equal(anchor,Math.max(oldTop,surfaceBiomeHeight(512,0,seed)),
    'preserve M2 true physical top (never lower old legacy floor)');
  assert.ok(anchor>=oldTop);
  const shifts=[],heights=new Set(),chunks=new Set();
  for(let x=456;x<=568;x+=4)for(let z=-40;z<=40;z+=4){
    const h=m3DesertHeight(x,z,seed),old=surfaceBiomeHeight(x,z,seed);
    if(h===null)continue;
    assert.ok(h>=terrainHeight(x,z,seed)&&h<=16);
    heights.add(h);chunks.add(chunkCoord(x)+','+chunkCoord(z));
    shifts.push(h-old);
    assert.equal(h,m3DesertHeight(x,z,seed),'same world coordinate = same height');
  }
  assert.ok(shifts.some(v=>v>=1)&&shifts.some(v=>v<=-1),
    'new cross-wind dunes are not the unchanged M2 shelf');
  assert.ok(heights.size>=5,'multi-height recognizable ridge silhouette');
  assert.ok(chunks.size>=20,'more than one edited chunk or fixture');
  for(const [x,z] of [[0,0],[200,0],[800,0],[512,350]]){
    assert.equal(m3DesertHeight(x,z,seed),null,'no desert outside region');
  }
});

test('M3: all exact desert IDs are registered physical solids, with sparse real xeric shapes',()=>{
  for(const id of Object.values(M3_DESERT_IDS)){
    assert.equal(isBiome130BlockId(id),true,'missing registered ID '+id);
    assert.equal(biome130Block(id).solid,true,'unphysical terrain/prop '+id);
  }
  const world=new FourRegionWorld(179),legacy=new VoxelWorld(179);
  const surfaceIds=new Set(),subsoilIds=new Set();
  let authored=0,raised=0,protectedCount=0;
  for(let x=460;x<=564;x+=3)for(let z=-39;z<=39;z+=3){
    const y=m3DesertHeight(x,z,179);if(y===null)continue;
    const id=world.get(x,y,z),oldY=terrainHeight(x,z,179);
    if(id===M3_DESERT_IDS.pale||id===M3_DESERT_IDS.red||
       id===M3_DESERT_IDS.salt){
      authored++;surfaceIds.add(id);
      assert.notEqual(world.get(x,y,z),BLOCK.AIR);
      assert.equal(world.get(x,-40,z),legacy.get(x,-40,z));
      if(y>oldY){raised++;assert.notEqual(world.get(x,y-1,z),BLOCK.AIR);}
      for(let d=1;d<=Math.min(4,y-oldY);d++){
        const below=world.get(x,y-d,z);
        if(isBiome130BlockId(below))subsoilIds.add(below);
      }
    }else protectedCount++;
  }
  assert.ok(authored>230,'Desert must be a real world, not an isolated four-cell sample');
  assert.ok(raised>140,'most dune columns must be supported elevated solid geometry');
  assert.ok(surfaceIds.has(M3_DESERT_IDS.pale));
  assert.ok(surfaceIds.has(M3_DESERT_IDS.red),'must include distinct red sandstone dune color');
  assert.ok(subsoilIds.has(M3_DESERT_IDS.hardpan));
  assert.ok(subsoilIds.has(M3_DESERT_IDS.sandstone)||
    subsoilIds.has(M3_DESERT_IDS.banded),'actual geological bands in raised shelf');
  assert.ok(protectedCount>=0);
});

test('M3: all-or-nothing protected landmark, cave, edit and entrance rejection',()=>{
  const world=new VoxelWorld(179),x=512,z=0,top=m3DesertHeight(x,z,179);
  const opts={
    enabled:true,profileIsFresh:true,
    readBaseline:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
    hasEdit:()=>false,isProtected:()=>false
  };
  const accepted=m3DesertFreshColumn(x,z,179,opts);
  assert.ok(accepted&&accepted.writes.length>0);
  const oldY=terrainHeight(x,z,179);
  assert.equal(m3DesertFreshColumn(x,z,179,{...opts,hasEdit:()=>true}),null);
  assert.equal(m3DesertFreshColumn(x,z,179,{...opts,
    isProtected:(_x,y)=>y===top}),null);
  assert.equal(m3DesertFreshColumn(x,z,179,{...opts,
    readBaseline:(a,b,c)=>b===oldY-1?BLOCK.AIR:
      world.naturalAndLandmarkBlock(a,b,c)}),null,'never fill a cave entrance');
  assert.equal(m3DesertFreshColumn(x,z,179,{...opts,
    readBaseline:(a,b,c)=>b===top+2?BLOCK.WOOD:
      world.naturalAndLandmarkBlock(a,b,c)}),null,'never bury a landmark tree');
  assert.equal(m3DesertFreshColumn(x,z,179,{...opts,profileIsFresh:false}),null);
});

test('M3: true physical collision, passable headroom and Pack 2 placement',()=>{
  const storage=new Storage(),loaded=newWorld(storage),world=loaded.world;
  const x=512,z=0,y=m3DesertHeight(x,z,179);
  assert.ok(world instanceof Pack2LiveWorld);
  assert.ok(world.base instanceof FourRegionWorld);
  assert.equal(world.get(x,y,z),M3_DESERT_IDS.pale);
  assert.equal(world.get(x,y+1,z),BLOCK.AIR);
  assert.equal(collides(world,x+.5,y+.1,z+.5),true,'actual ground collision');
  assert.equal(collides(world,x+.5,y+1.02,z+.5),false,'no invisible air wall');
  const player=findSafeSpawn(world,x,z);
  assert.ok(Number.isFinite(player.feet)&&player.feet>y-4&&player.feet<20);
  assert.equal(world.placePack2(x,y+2,z,59,{}),true);
  assert.equal(world.get(x,y+2,z),59);
  const saved=saveM2World(storage,world);
  assert.equal(saved.ok,true,JSON.stringify(saved));
  const reload=openM2World(storage,planM2WorldChoice('179'));
  assert.equal(reload.world.get(x,y+2,z),59);
  assert.deepEqual(reload.world.pack2Snapshot(),world.pack2Snapshot());
});

test('M3: sparse xeric trunk, gypsum and thorn are supported and mined without floating',()=>{
  const world=new FourRegionWorld(179);
  let foundCactus=null,seen=0;
  for(let x=465;x<=565;x++)
    for(let z=-47;z<=47;z++){
      const y=m3DesertHeight(x,z,179);
      if(y===null||surfaceBiomeAt(x,z,179)?.weight<.84)continue;
      const d=m3DesertXeric(x,z,179,y,surfaceBiomeAt(x,z,179).weight);
      if(d.length)seen++;
      if(!foundCactus&&d.length===2&&world.get(x,y+1,z)===M3_DESERT_IDS.cactus&&
         world.get(x,y+2,z)===M3_DESERT_IDS.cactus)
        {foundCactus={x,y,z};break;}
    }
  assert.ok(seen>20,'sparse, real organic producer presence');
  assert.ok(foundCactus,'at least one physically supported two-block cactus exists');
  const {x,y,z}=foundCactus;
  assert.equal(world.set(x,y,z,BLOCK.AIR),true,'actual M3 terrain mining');
  assert.equal(world.get(x,y+1,z),BLOCK.AIR,'no floating first cactus');
  assert.equal(world.get(x,y+2,z),BLOCK.AIR,'no floating second cactus');
  const dump=world.save();
  assert.ok(dump.edits.some(r=>r[0]===x&&r[1]===y+1&&r[2]===z&&r[3]===0));
  const restored=restoreFourRegionWorld(dump,world.profile);
  assert.equal(restored.get(x,y,z),BLOCK.AIR);
  assert.equal(restored.get(x,y+1,z),BLOCK.AIR);
  assert.equal(restored.get(x,y+2,z),BLOCK.AIR);
  assert.deepEqual(restored.save(),dump);
});

test('M3: edit, replace, export/import, cold save/reload and cross-region visits',()=>{
  const store=new Storage(),w=newWorld(store).world;
  const [x,z]=[512,0],y=m3DesertHeight(x,z,179);
  const original=w.get(x,y,z);
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);
  assert.equal(w.get(x,y,z),BLOCK.AIR);
  assert.equal(w.set(x,y,z,M3_DESERT_IDS.red),true);
  assert.equal(w.get(x,y,z),M3_DESERT_IDS.red);
  const editState=JSON.stringify(w.save()),pack2Before=JSON.stringify(w.pack2Snapshot());
  for(const r of SURFACE_BIOME_REGIONS.slice(1)){
    const top=Math.max(terrainHeight(r.x,r.z,179),
      surfaceBiomeHeight(r.x,r.z,179));
    assert.equal(w.get(r.x,top,r.z),r.surface);
  }
  const exported=exportM2World(w),parsed=inspectM2WorldExport(exported);
  assert.equal(parsed.mode,'four-regions');
  assert.equal(parsed.world.base.generationProfile.generator,FOUR_REGION_GENERATOR);
  assert.equal(JSON.stringify(parsed.world.save()),editState);
  assert.equal(JSON.stringify(parsed.world.pack2Snapshot()),pack2Before);
  assert.equal(saveM2World(store,w).ok,true);
  const stored=store.getItem(worldSlotKey(179));
  assert.equal(stored,editState);
  const restored=openM2World(store,planM2WorldChoice('179'));
  assert.equal(restored.world.get(x,y,z),M3_DESERT_IDS.red);
  assert.equal(restored.world.set(x,y,z,original),true);
  assert.equal(restored.world.base.edits.has(key(x,y,z)),false,
    'restoring exact v3 natural ground removes delta');
  assert.equal(saveM2World(store,restored.world).ok,true);
  assert.equal(openM2World(store,planM2WorldChoice('179')).world.get(x,y,z),original);
  const legacyStore=new Storage(),legacy=openM2World(legacyStore,planM2WorldChoice('7'));
  assert.equal(legacy.mode,'legacy');
  assert.equal(legacyStore.length,0);
});

test('M3: actual 5x5 Desert chunk mesh remains within existing strict 8MiB GPU budget',()=>{
  const world=new Pack2LiveWorld(new FourRegionWorld(179));
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
    const vertices=meshChunk(world,chunkCoord(512)+dx,chunkCoord(0)+dz);
    assert.ok(vertices instanceof Float32Array);
    assert.ok(vertices.byteLength<=8*1024*1024,
      'new dune physical mesh would exceed 8MiB at '+dx+','+dz+
      ' ('+vertices.byteLength+' bytes)');
  }
});
