import test from "node:test";
import assert from "node:assert/strict";
import {pack3CandidateShape} from "../../../src/block-packs/pack-3/catalog.mjs";

// The dry aqueduct is a modular, pass-through channel, not a solid water cube.
// Two cells must have real masonry contact while keeping an uninterrupted
// central trough and banks, even as the authored channel rotates by 90°.
test('adjoining Greywater aqueduct channels preserve continuous dry trough and supporting banks at four yaws',()=>{
  const steps=[[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]];
  const transverse=[[1,0,0],[0,0,1],[1,0,0],[0,0,1]];
  const within=(boxes,point)=>boxes.some(b=>[0,1,2].every(i=>point[i]>b[i]+1e-10&&point[i]<b[i+3]-1e-10));
  for(let yaw=0;yaw<4;yaw++){
    const shape=pack3CandidateShape(123,yaw);
    const step=steps[yaw],side=transverse[yaw];
    const next=shape.boxes.map(b=>b.map((v,i)=>v+step[i%3]));
    const occupied=p=>within(shape.boxes,p)||within(next,p);
    const point=(t,s,y)=>[
      .5+step[0]*(t-.5)+side[0]*(s-.5),y,
      .5+step[2]*(t-.5)+side[2]*(s-.5)
    ];
    let contactArea=0;
    const axis=step[0]?0:2;
    for(const a of shape.boxes)for(const b of next){
      if(step[axis]>0
        ? Math.abs(a[axis+3]-1)>1e-10||Math.abs(b[axis]-1)>1e-10
        : Math.abs(a[axis])>1e-10||Math.abs(b[axis+3])>1e-10)continue;
      const other=[0,1,2].filter(i=>i!==axis);
      contactArea+=other.map(i=>Math.max(0,Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])))
        .reduce((x,y)=>x*y,1);
    }
    assert.ok(contactArea>.3,`No substantial adjoining-channel masonry contact at yaw ${yaw}`);
    for(const t of [.05,.26,.74,.95,1.05,1.26,1.74,1.95]){
      for(const s of [.38,.5,.62])for(const y of [.35,.48,.61])
        assert.equal(occupied(point(t,s,y)),false,
          `Dry watercourse blocked at yaw ${yaw}, station ${t}, transverse ${s}, elevation ${y}`);
      for(const s of [.1,.9])
        assert.equal(occupied(point(t,s,.48)),true,
          `Masonry bank interrupted at yaw ${yaw}, station ${t}, side ${s}`);
      assert.equal(occupied(point(t,.5,.15)),true,
        `Channel floor unsupported at yaw ${yaw}, station ${t}`);
    }
  }
});
