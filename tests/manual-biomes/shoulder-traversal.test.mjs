import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK,collides} from '../../src/voxel.mjs';
import {FourRegionWorld,M2_FOUR_REGION_GENERATOR,fourRegionProfile} from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {surfaceBiomeAt} from '../../src/surface-regions/regions.mjs';
import {walkableSurfaceCell,traceDesertShoulder} from '../../src/manual-biomes/shoulder-traversal.mjs';
import {stepPlayer,COYOTE_TIME} from '../../src/physics.mjs';

const SEED=179;
const fresh=()=>new Pack2LiveWorld(new FourRegionWorld(SEED));

test('M3 traversal: actual physical AABB-safe Desert-to-legacy shoulder walking witness',()=>{
  const world=fresh(),before=JSON.stringify(world.save());
  const proof=traceDesertShoulder(world);
  assert.equal(proof.ok,true,JSON.stringify(proof));
  assert.ok(proof.path.length>=30,'must cover a genuine multi-chunk crossing');
  assert.ok(proof.start.weight>=.62,'starts in real Desert');
  assert.ok(proof.end.weight<=.24,'ends beyond the physical Desert feather');
  assert.ok(proof.start.x>=617&&proof.end.x>=677);
  assert.ok(proof.maxStep<=1.01,'cannot call an unsteppable cliff a walk');
  assert.equal(proof.withoutTerrainEdits,true);
  let chunks=new Set(),changed=0;
  for(let i=0;i<proof.path.length;i++){
    const cell=proof.path[i],p=walkableSurfaceCell(world,cell.x,cell.z);
    assert.ok(p,'all path cells require actual ground with genuine full player clearance');
    assert.equal(p.feet,cell.feet);
    assert.equal(collides(world,cell.x+.5,cell.feet,cell.z+.5),false);
    assert.equal(collides(world,cell.x+.5,cell.feet-.065,cell.z+.5),true);
    chunks.add(Math.floor(cell.x/16)+','+Math.floor(cell.z/16));
    if(i&&cell.feet!==proof.path[i-1].feet)changed++;
  }
  assert.ok(chunks.size>=4,'real route spans multiple collision-loaded chunks');
  assert.ok(changed>=2,'route must actually cross natural physical elevation changes');
  assert.equal(JSON.stringify(world.save()),before,'route proof cannot add edits or migrate world');
  assert.equal(world.base.cachedBiomeColumns<=1024,true);
});

test('M3 traversal: real stepPlayer actually moves across representative route steps',()=>{
  const world=fresh(),proof=traceDesertShoulder(world);
  assert.equal(proof.ok,true,JSON.stringify(proof));
  const pick=[0,Math.floor(proof.path.length/3),Math.floor(proof.path.length*2/3),
    Math.max(0,proof.path.length-2)];
  let successfulSteps=0;
  for(const index of pick){
    const a=proof.path[index],b=proof.path[index+1];
    assert.ok(b);
    const dx=b.x-a.x,dz=b.z-a.z,yaw=Math.atan2(dx,dz);
    const player={x:a.x+.5,z:a.z+.5,feet:a.feet,yaw,pitch:-.12,
      vX:0,vZ:0,vY:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
    const startX=player.x,startZ=player.z;
    for(let f=0;f<3;f++)stepPlayer(world,player,
      {forward:1,strafe:0,jump:false},.05);
    assert.ok(Number.isFinite(player.feet));
    assert.equal(collides(world,player.x,player.feet+.002,player.z),false,
      'actual simulated player cannot penetrate solid biome terrain');
    const along=(player.x-startX)*dx+(player.z-startZ)*dz;
    assert.ok(along>.08,'actual player must advance in a walkable corridor');
    successfulSteps++;
  }
  assert.equal(successfulSteps,4);
});

test('M3 traversal: fail closed when a protected full-height barrier blocks every route',()=>{
  const base=fresh(),unchanged=JSON.stringify(base.save());
  const blocker={
    seed:base.seed,
    get(x,y,z){return x>=647&&x<=651&&z>=-43&&z<=43&&
      y>=0&&y<=19?BLOCK.STONE:base.get(x,y,z);},
    rotationAt:(...args)=>base.rotationAt(...args),
    getPack2State:(...args)=>base.getPack2State(...args)
  };
  const result=traceDesertShoulder(blocker);
  assert.equal(result.ok,false,'proof must never tunnel or terraform through obstacles');
  assert.match(result.reason,/No naturally walkable/);
  assert.equal(result.withoutTerrainEdits,true);
  assert.equal(JSON.stringify(base.save()),unchanged);
});

test('M3 traversal: source-exact v2 worlds and legacy worlds never rewritten',()=>{
  const old=new Pack2LiveWorld(new FourRegionWorld(SEED,
    fourRegionProfile(SEED,M2_FOUR_REGION_GENERATOR)));
  const before=JSON.stringify(old.save()),profile=JSON.stringify(old.base.generationProfile);
  const tile=walkableSurfaceCell(old,620,0);
  assert.ok(tile);
  assert.equal(JSON.stringify(old.save()),before);
  assert.equal(JSON.stringify(old.base.generationProfile),profile);
  assert.ok((surfaceBiomeAt(620,0,SEED)?.weight??0)>.35);
  assert.throws(()=>walkableSurfaceCell(old,620,0,{minY:-211}),/Invalid/);
});
