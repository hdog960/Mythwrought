import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {liveVoxelDistrict} from '../src/live-voxel-world.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';

test('012 newly activated automation discoveries are source-accurate, physical, deterministic and save-neutral',()=>{
  const world=new VoxelWorld(179),old=JSON.stringify(world.save());
  const locations=[[0,0],[-1,0],[0,-1],[-1,-1],[1,0],[0,1],[1,1],[-1,1],[1,-1]];
  const counts={west:0,gate:0,archwood:0,fallen:0,approach:0};
  for(const [dx,dz] of locations){
    const scene=liveVoxelDistrict(world.seed,dx,dz,(x,y,z)=>world.legacyBlockAt(x,y,z));
    const again=liveVoxelDistrict(world.seed,dx,dz,(x,y,z)=>world.legacyBlockAt(x,y,z));
    assert.deepEqual(scene.westGalleries,again.westGalleries);
    assert.deepEqual(scene.canopyGate,again.canopyGate);
    assert.deepEqual(scene.archwood,again.archwood);
    assert.deepEqual(scene.fallenGiant,again.fallenGiant);
    counts.west+=scene.westGalleries.length;
    for(const origin of scene.westGalleries){
      const t=11,x=origin.x+t,z=origin.z-14;
      const floor=caveRoute(world.seed,origin).floorAt(t);
      assert.equal(world.get(x,floor,z),BLOCK.STONE);
      assert.equal(world.get(x,floor+1,z),BLOCK.AIR);
      assert.equal(world.get(x,floor+2,z),BLOCK.AIR);
      assert.equal(collides(world,x+.5,floor+1,z+.5),false);
    }
    for(const [field,count] of [['canopyGate','gate'],['archwood','archwood'],
                                ['fallenGiant','fallen'],['rotundaApproach','approach']]){
      const asset=scene[field];if(!asset)continue;
      counts[count]++;
      for(const [x,y,z,id] of asset.cells){
        assert.equal(world.get(x,y,z),id,'actual physical voxel: '+field);
      }
    }
  }
  assert.ok(counts.west>0,'at least one new west cavern must be reachable in representative districts');
  assert.ok(counts.gate+counts.archwood+counts.fallen>0,
    'at least one new physical atmospheric discovery must be live');
  assert.equal(JSON.stringify(world.save()),old,'never store generated voxels as player edits');
  console.log('Incorporation 012 physical-world discovery counts:',JSON.stringify(counts));
});
