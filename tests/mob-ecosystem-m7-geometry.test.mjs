import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {createM7MobCollisionReader}
  from '../src/mobs/ecosystem-world-geometry.mjs';
import {environmentGround} from '../src/environment-ground.mjs';
import {collides,BLOCK} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';

test('actual M7 mountain and enchanted ground is solid for player but unknown for mobs',()=>{
  const seed=179;
  const base=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const world=new Pack2LiveWorld(base);
  const saved=JSON.stringify(base.save());
  const original=createWorldQuery(world,{resident:()=>true});
  const adapter=createM7MobCollisionReader(world);
  const corrected=createWorldQuery(adapter,{resident:()=>true});
  const sites=[
    {name:'mountain',x:-512,z:0,low:400,high:402},
    {name:'enchanted',x:0,z:-512,low:403,high:405}
  ];
  for(const site of sites){
    assert.equal(v6BiomeAt(site.x,site.z,seed)?.name,site.name);
    let cell=null;
    outer:for(let dx=-3;dx<=3;dx++)
      for(let dz=-3;dz<=3;dz++){
        const x=site.x+dx,z=site.z+dz;
        for(let y=19;y>=-3;y--){
          const id=world.get(x,y,z);
          if(id>=site.low&&id<=site.high){
            cell={x,y,z,id};
            break outer;
          }
        }
      }
    assert.ok(cell,'Missing real M7 ground at '+site.name);
    assert.ok(environmentGround(cell.id),'Unknown source environmental material');
    assert.equal(world.get(cell.x,cell.y,cell.z),cell.id);
    assert.equal(adapter.get(cell.x,cell.y,cell.z),BLOCK.STONE);
    const position=[cell.x+.5,cell.y+.2,cell.z+.5];
    const body={radius:.1,height:.2};
    assert.equal(collides(world,...position),true,'Actual player physics must see solid');
    assert.equal(original.volume(position,body),'unknown',
      'Original production mob reader fails closed on the real M7 block');
    assert.equal(corrected.volume(position,body),'solid',
      'Experimental reader matches genuine player physical solidity');
  }
  assert.equal(JSON.stringify(base.save()),saved,
    'No observational mob collision probe may change player saves');
});

test('M7 adapter rejects mismatched generation, cannot mutate and preserves ordinary voxels',()=>{
  const seed=179;
  const base=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const world=new Pack2LiveWorld(base);
  const reader=createM7MobCollisionReader(world);
  assert.throws(()=>createM7MobCollisionReader({get:()=>BLOCK.AIR}),
    /exact M7 generator/);
  assert.throws(()=>createM7MobCollisionReader(null),/original voxel world/);
  assert.equal(reader.get(0,22,0),world.get(0,22,0));
  assert.equal(reader.get(0,0,0),world.get(0,0,0));
  assert.equal(Reflect.set(reader,'seed',999),false);
  assert.equal(world.seed,seed);
});
