import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,raycast} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M3_FOUR_REGION_GENERATOR,FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR,M6_BALANCED_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {applyBlockAction} from '../../src/blocks.mjs';
import {replayCreativeVoxelBatch} from '../../src/creative-integration/creative-voxel-batch.mjs';
function findStack(base){
 for(let x=465;x<=565;x++)for(let z=-47;z<=47;z++)
 for(let y=8;y<=17;y++){
   if(base.get(x,y,z)===0)continue;
   const cells=base.historicalXericSupportedCells(x,y,z);
   if(cells.length<2)continue;
   for(const dir of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){
    const origin=[x+.5-dir[0]*.6,y+.5,z+.5-dir[2]*.6];
    if(raycast(base,origin,dir,6)?.hit?.join(',')===[x,y,z].join(','))
      return {cell:[x,y,z],cells:[[x,y,z],...cells],origin,dir};
   }
 }
 throw Error('No actual historical stack with physical ray '+base.profile.generator);
}
for(const generator of [M3_FOUR_REGION_GENERATOR,FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR,M6_BALANCED_GENERATOR]){
 test(generator+' exact natural stack footprint, original setter parity, GPU failure, veto, redo and cold save',()=>{
  const base=new FourRegionWorld(179,fourRegionProfile(179,generator)),world=new Pack2LiveWorld(base);
  const {cell,cells,origin,dir}=findStack(base);
  const read=c=>({id:world.get(...c),rotation:world.rotationAt(...c)});
  const before=cells.map(read),raw=JSON.stringify(world.save()),after=cells.map(()=>({id:0,rotation:0}));
  const oldSetter=new FourRegionWorld(179,base.profile);assert.ok(oldSetter.set(...cell,0));
  const act=(rebuild,allowAffectedCell)=>applyBlockAction(world,origin,dir,'mine',BLOCK.STONE,{x:cell[0]-3,feet:cell[1],z:cell[2]+.5},rebuild,{allowAffectedCell});
  assert.equal(act(()=>{throw Error('must not rebuild');},c=>c.join(',')!==cells.at(-1).join(',')).ok,false);
  assert.equal(JSON.stringify(world.save()),raw);
  const rejected=act(()=>{throw Error('injected GPU failure');});
  assert.equal(rejected.ok,false);assert.equal(rejected.requiresRecovery,false);
  assert.deepEqual(cells.map(read),before);assert.equal(JSON.stringify(world.save()),raw);
  let count=0;const success=act((x,z,y,cs)=>{assert.deepEqual(cs,cells);count++;});
  assert.equal(success.ok,true);assert.deepEqual(success.affectedCells,cells);assert.equal(count,1);
  assert.deepEqual(cells.map(read),after);const mined=JSON.stringify(world.save());
  assert.equal(mined,JSON.stringify(oldSetter.save()),'existing recursive setter parity');
  const replay=(expected,desired,rebuild)=>replayCreativeVoxelBatch({cells,expected,desired,read,
   allowed:(c,d)=>d.id!==0||base.historicalXericSupportedCells(...c).every(p=>cells.some(q=>p.join(',')===q.join(','))),
   write:(c,d)=>world.set(...c,d.id,d.rotation),rebuild,save:()=>true,protect:()=>{throw Error('unexpected recovery');}});
  assert.ok(replay(after,before,()=>{}));assert.equal(JSON.stringify(world.save()),raw);
  assert.equal(replay(before,after,()=>{throw Error('injected GPU failure');}),false);
  assert.equal(JSON.stringify(world.save()),raw);
  assert.ok(replay(before,after,()=>{}));assert.equal(JSON.stringify(world.save()),mined);
  assert.equal(JSON.stringify(restoreFourRegionWorld(world.save(),base.profile).save()),mined);
  console.log('HISTORICAL XERIC WITNESS',JSON.stringify({generator,cell,cells,ids:before.map(x=>x.id)}));
 });
}
