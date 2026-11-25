import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {prepareP0MixedGroup,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista,p0CompressPlanes,planP0FarSlot} from '../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];
test('exact 2D plane compression preserves holes and material ownership',()=>{
  const r=p0CompressPlanes([{kind:0,id:3,d:2,p:8,row:0,a:0,b:3},{kind:0,id:3,d:2,p:8,row:1,a:0,b:2},{kind:0,id:3,d:2,p:8,row:2,a:0,b:3},{kind:1,id:256,d:2,p:8,row:1,a:2,b:3}]);
  const set=new Set();for(const q of r)for(let v=q.row;v<q.end;v++)for(let u=q.a;u<q.b;u++){const k=[q.kind,q.id,v,u].join(',');assert.ok(!set.has(k));set.add(k);}
  assert.equal(set.size,9);assert.ok(!set.has('0,3,1,2'));assert.ok(set.has('1,256,1,2'));
});
test('all four actual original groups: grounded exact exposed faces, near ownership and shared byte budget at moving windows',()=>{
  for(let i=0;i<4;i++){
    const {world,spec,group}=prepareP0MixedGroup(i),mid=spec.modules[1],before=JSON.stringify(world.save()),results=[];
    for(const distance of [48,32,25,16]){
      const eye=[mid.x-distance,17,mid.z],near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15),owned=new Set(near.map(k=>k.key));
      const s=buildP0GroundedVista(world,group.view,spec.modules,near,{eye});
      let ground=0,monument=0;const seen=new Set();
      for(const q of s.rectangles)for(let row=q.row;row<q.end;row++)for(let a=q.a;a<q.b;a++){
        const {d,p,kind,id}=q;let x,y,z;if(d<2){x=p-(d===0?1:0);y=row;z=a;}else if(d===2){x=a;y=p-1;z=row;}else{x=a;y=row;z=p-(d===3?1:0);}
        const [dx,dy,dz]=dirs[d],original=world.get(x,y,z),actual=group.view.get(x,y,z),k=[d,x,y,z].join(',');
        assert.ok(!seen.has(k));seen.add(k);assert.equal(group.view.get(x+dx,y+dy,z+dz),BLOCK.AIR);
        assert.equal(owned.has([Math.floor(x/16),Math.floor(z/16),y<=19?0:1+Math.floor((y-20)/16)].join(',')),false);
        if(kind===0){assert.equal(original,BLOCK.AIR);assert.notEqual(actual,BLOCK.AIR);monument++;}
        else{assert.equal(actual,id);assert.equal(original,id);ground++;}
      }
      assert.equal(ground,s.groundFaces);assert.equal(monument,s.monumentFaces);assert.ok(ground>0&&monument>0);assert.ok(s.monumentRects<=s.oldMonumentRects);
      const nearBytes=near.reduce((n,k)=>n+p0BenchmarkMesh(group.view,k.cx,k.cz,k.s).byteLength,0),plan=planP0FarSlot(near,{feet:15,nearBytes,farBytes:s.vertices.byteLength});
      assert.equal(plan.allowed,true);assert.equal(plan.buffers,19);
      results.push({distance,ground,monument,groundColumns:s.groundColumns,nearOmitted:s.monumentNearOmitted,oldRects:s.oldMonumentRects,monumentRects:s.monumentRects,terrainRects:s.terrainRects,farBytes:s.vertices.byteLength,nearBytes,plan});
    }
    assert.equal(JSON.stringify(world.save()),before);assert.equal(group.publicationStatus().authorized,false);
    console.log('P0 GROUNDED NATIVE',JSON.stringify({index:i,seed:spec.seed,results}));
  }
});
