import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {prepareP0MixedGroup,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0FarShell,planP0FarSlot,P0_FAR_MAX_BYTES} from '../src/manual-biomes/forgotten-sands-far-shell.mjs';
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];
test('all four far shells are exact physical exterior faces, exclude resident owners, and never exceed shared slots',()=>{
  for(let i=0;i<4;i++){
    const {world,spec,group}=prepareP0MixedGroup(i),mid=spec.modules[1],near=p0BenchmarkWindow(Math.floor((mid.x-25)/16),Math.floor(mid.z/16),14),view=group.view;
    const nearSet=new Set(near.map(k=>k.key)),before=JSON.stringify(world.save()),shell=buildP0FarShell(world,view,spec.modules,near);
    let faces=0;
    for(const {d,p,row,a,b} of shell.rectangles)for(let v=a;v<b;v++){
      let x,y,z;if(d<2){x=p-(d===0?1:0);y=row;z=v;}else if(d===2){x=v;y=p-1;z=row;}else{x=v;y=row;z=p-(d===3?1:0);}
      const [dx,dy,dz]=dirs[d],s=y<=19?0:1+Math.floor((y-20)/16);
      assert.equal(world.get(x,y,z),BLOCK.AIR);assert.notEqual(view.get(x,y,z),BLOCK.AIR);
      assert.equal(view.get(x+dx,y+dy,z+dz),BLOCK.AIR);
      assert.equal(nearSet.has([Math.floor(x/16),Math.floor(z/16),s].join(',')),false);faces++;
    }
    assert.equal(faces,shell.sourceFaces);assert.ok(faces>0);assert.ok(shell.nearOmitted>0);assert.ok(shell.vertices.byteLength<=P0_FAR_MAX_BYTES);
    const nearBytes=near.reduce((n,k)=>n+p0BenchmarkMesh(view,k.cx,k.cz,k.s).byteLength,0);
    const plan=planP0FarSlot(near,{feet:14,nearBytes,farBytes:shell.vertices.byteLength});
    assert.equal(plan.allowed,true);assert.ok(plan.buffers<=27);
    assert.equal(planP0FarSlot(p0BenchmarkWindow(0,0,36),{feet:36,farBytes:1}).allowed,false);
    assert.equal(planP0FarSlot(near,{feet:-1,farBytes:1}).allowed,false);
    assert.equal(planP0FarSlot(near,{feet:14,shaft:true,farBytes:1}).allowed,false);
    assert.equal(JSON.stringify(world.save()),before);
    console.log('P0 FAR SHELL',JSON.stringify({index:i,faces,nearOmitted:shell.nearOmitted,rectangles:shell.rectangles.length,farBytes:shell.vertices.byteLength,nearBytes,plan,inspected:shell.inspected}));
  }
});
