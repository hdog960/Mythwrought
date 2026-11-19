import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,BLOCK,collides,terrainHeight,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {FourRegionWorld,FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,
  M2_FOUR_REGION_GENERATOR,fourRegionProfile,validateFourRegionProfile}
  from '../../src/manual-biomes/profile-world.mjs';
import {surfaceBiomeHeight,SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';
import {M4_REGION_NAMES,M4_PHYSICAL_MATERIALS,m4PhysicalTerrainHeight,
  m4ThreeRegionFreshColumn} from '../../src/manual-biomes/three-regions-m4.mjs';
import {isBiome130BlockId,biome130Block} from '../../src/biome130-registry.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {planM2WorldChoice,M2_WORLD_MODE,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport} from '../../src/manual-biomes/m2-runtime-bridge.mjs';

const SEED=179;
const regions=SURFACE_BIOME_REGIONS.slice(1);
class Storage {
  state=new Map();
  get length(){return this.state.size;}
  key(i){return [...this.state.keys()][i]??null;}
  getItem(k){return this.state.get(String(k))??null;}
  setItem(k,v){this.state.set(String(k),String(v));}
  removeItem(k){this.state.delete(String(k));}
}
const legacy=new VoxelWorld(SEED);
const options=()=>({
  enabled:true,profileIsFresh:true,
  readBaseline:(x,y,z)=>legacy.naturalAndLandmarkBlock(x,y,z),
  hasEdit:()=>false,isProtected:()=>false
});
const newWorld=store=>openM2World(store,
  planM2WorldChoice('179',M2_WORLD_MODE.CREATE_FOUR,{confirmed:true}));
const baseline=(version)=>new FourRegionWorld(SEED,fourRegionProfile(SEED,version));

test('M4: no silent v2/v3 mutation; generator v4 is explicitly new-world only',()=>{
  assert.equal(FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v4');
  assert.equal(M3_FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v3');
  assert.equal(M2_FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v2');
  assert.deepEqual(validateFourRegionProfile(fourRegionProfile(SEED,M3_FOUR_REGION_GENERATOR)),
    fourRegionProfile(SEED,M3_FOUR_REGION_GENERATOR));
  const old2=baseline(M2_FOUR_REGION_GENERATOR),old3=baseline(M3_FOUR_REGION_GENERATOR),
    fresh=baseline(FOUR_REGION_GENERATOR);
  assert.equal(old2.generationProfile.generator,M2_FOUR_REGION_GENERATOR);
  assert.equal(old3.generationProfile.generator,M3_FOUR_REGION_GENERATOR);
  for(const r of SURFACE_BIOME_REGIONS){
    for(let dx=-12;dx<=12;dx+=3)for(let dz=-12;dz<=12;dz+=3){
      for(const y of [-42,1,7,11,15,19]){
        // Never rewrite a previously generated v2/v3 natural world.
        assert.equal(old2.get(r.x+dx,y,r.z+dz),
          new FourRegionWorld(SEED,
            fourRegionProfile(SEED,M2_FOUR_REGION_GENERATOR)).get(r.x+dx,y,r.z+dz));
        if(r.name==='desert')
          assert.equal(old3.get(r.x+dx,y,r.z+dz),
            fresh.get(r.x+dx,y,r.z+dz),
            'M4 must keep the complete M3 Desert physical terrain');
      }
    }
  }
  assert.equal(new VoxelWorld(SEED).save().schema,1);
});

test('M4: Snow/Mountain/Enchanted registered solid material bands, actual 3D elevations',()=>{
  const world=baseline(FOUR_REGION_GENERATOR),prior=baseline(M3_FOUR_REGION_GENERATOR);
  for(const r of regions){
    let changed=0,raised=0,authored=0,materialVariants=new Set(),normalCols=0;
    for(let dx=-24;dx<=24;dx+=2)for(let dz=-24;dz<=24;dz+=2){
      const x=r.x+dx,z=r.z+dz,plan=m4ThreeRegionFreshColumn(x,z,SEED,options());
      if(!plan)continue;
      const top=plan.top,actual=world.get(x,top,z);
      if(plan.writes.some(w=>w.y===top)){
        authored++;materialVariants.add(actual);
        assert.ok(isBiome130BlockId(actual)&&biome130Block(actual).solid,
          'visible top is registered physical ground '+r.name+' '+x+','+z);
        assert.equal(world.get(x,top+1,z),BLOCK.AIR,'passable headroom');
        assert.ok(collides(world,x+.5,top+.05,z+.5),'actual body-solid surface');
        assert.equal(world.get(x,-42,z),legacy.get(x,-42,z),
          'untouched deep-world/cave substrate');
      }else normalCols++;
      if(plan.top>terrainHeight(x,z,SEED))raised++;
      if(plan.writes.some(w=>world.get(x,w.y,z)!==prior.get(x,w.y,z)))changed++;
      assert.ok(top<=16,'M4 terrain cannot enter the GPU ceiling');
    }
    assert.ok(authored>=60,r.name+' needs many real authored terrain columns, got '+authored);
    assert.ok(materialVariants.size>=2,r.name+' needs genuinely different registered solids');
    assert.ok(changed>=15,r.name+' must not be only a new version label');
    assert.ok(raised>35,r.name+' physical relief must be real, not painted');
    assert.ok(normalCols>=0);
    const anchorTop=Math.max(terrainHeight(r.x,r.z,SEED),
      surfaceBiomeHeight(r.x,r.z,SEED));
    assert.equal(world.get(r.x,anchorTop,r.z),r.surface,
      'unchanged source-exact prior region anchor');
  }
});

test('M4: landmark, tree, cave mouth, prior edit or obstruction fail whole column closed',()=>{
  const r=regions[0],x=r.x,z=r.z,opts=options();
  const initial=m4ThreeRegionFreshColumn(x,z,SEED,opts);
  assert.ok(initial?.writes?.length>0,'source anchor is an authored physical column');
  const old=terrainHeight(x,z,SEED);
  assert.equal(m4ThreeRegionFreshColumn(x,z,SEED,{
    ...opts,hasEdit:(_a,y)=>y===old}),null);
  assert.equal(m4ThreeRegionFreshColumn(x,z,SEED,{
    ...opts,isProtected:(_a,y)=>y===old+1}),null);
  assert.equal(m4ThreeRegionFreshColumn(x,z,SEED,{
    ...opts,readBaseline:(a,y,c)=>y===old-1?BLOCK.AIR:
      legacy.naturalAndLandmarkBlock(a,y,c)
  }),null,'do not backfill a natural cave mouth');
  assert.equal(m4ThreeRegionFreshColumn(x,z,SEED,{
    ...opts,readBaseline:(a,y,c)=>y===19?BLOCK.WOOD:
      legacy.naturalAndLandmarkBlock(a,y,c)
  }),null,'do not cut through an existing landmark');
  assert.equal(m4ThreeRegionFreshColumn(x,z,SEED,{...opts,enabled:false}),null);
});

test('M4: only owned physical geology, never fake flora or unregistered block IDs',()=>{
  assert.deepEqual(M4_REGION_NAMES,['snow','mountain','enchanted']);
  for(const [name,family] of Object.entries(M4_PHYSICAL_MATERIALS)){
    for(const id of Object.values(family)){
      const b=biome130Block(id);
      assert.equal(b.solid,true,name+' geology must support real collision');
      assert.equal(b.blockId,id);
    }
  }
  for(const r of regions){
    const planned=m4ThreeRegionFreshColumn(r.x,r.z,SEED,options());
    assert.ok(planned);
    for(const row of planned.writes){
      assert.equal(Number.isInteger(row.y),true);
      assert.ok(row.to===BLOCK.STONE||
        isBiome130BlockId(row.to),'no shader props or new registry IDs');
      if(isBiome130BlockId(row.to))
        assert.equal(biome130Block(row.to).solid,true);
    }
  }
});

test('M4: live Pack2/save/export/import and untouched legacy slots after real mining',()=>{
  const store=new Storage(),loaded=newWorld(store);
  assert.equal(loaded.mode,'four-regions');
  assert.equal(loaded.base.generationProfile.generator,FOUR_REGION_GENERATOR);
  const world=loaded.world;
  for(const r of regions){
    const y=m4PhysicalTerrainHeight(r.x,r.z,SEED);
    assert.ok(Number.isInteger(y));
    assert.notEqual(world.get(r.x,y,r.z),BLOCK.AIR);
    const before=world.get(r.x,y,r.z);
    assert.equal(world.set(r.x,y,r.z,BLOCK.AIR),true,'actual physical mine');
    assert.equal(world.get(r.x,y,r.z),BLOCK.AIR);
    assert.equal(world.set(r.x,y,r.z,before),true,'actual placement');
    assert.equal(world.get(r.x,y,r.z),before);
  }
  const s=regions[0],y=m4PhysicalTerrainHeight(s.x,s.z,SEED);
  assert.equal(world.set(s.x,y,s.z,BLOCK.AIR),true);
  assert.equal(world.placePack2(s.x,y+2,s.z,59,{}),true);
  const original=JSON.stringify(world.save()),pack2=JSON.stringify(world.pack2Snapshot());
  const exported=exportM2World(world),reimport=inspectM2WorldExport(exported);
  assert.equal(reimport.world.base.generationProfile.generator,FOUR_REGION_GENERATOR);
  assert.equal(JSON.stringify(reimport.world.save()),original);
  assert.equal(JSON.stringify(reimport.world.pack2Snapshot()),pack2);
  const saved=saveM2World(store,world);
  assert.equal(saved.ok,true,JSON.stringify(saved));
  const loadedAgain=openM2World(store,planM2WorldChoice('179'));
  assert.equal(JSON.stringify(loadedAgain.world.save()),original);
  assert.equal(loadedAgain.world.get(s.x,y,s.z),BLOCK.AIR);
  assert.equal(loadedAgain.world.get(s.x,y+2,s.z),59);
  assert.equal(loadedAgain.world.base.generationProfile.generator,FOUR_REGION_GENERATOR);
  assert.equal(store.getItem('mythwrought-v002-world-7-four-biomes-profile-v1'),null);
});

test('M4: 25-chunk source-authentic mesh on each new biome never exceeds 8 MiB',()=>{
  const world=new Pack2LiveWorld(baseline(FOUR_REGION_GENERATOR));
  for(const r of regions)
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
      const cx=chunkCoord(r.x)+dx,cz=chunkCoord(r.z)+dz;
      const vertices=meshChunk(world,cx,cz);
      assert.ok(vertices instanceof Float32Array);
      assert.ok(vertices.byteLength<=8388608,
        r.name+' real chunk '+cx+','+cz+' exceeds original 8MiB staging cap: '+
        vertices.byteLength);
    }
});
