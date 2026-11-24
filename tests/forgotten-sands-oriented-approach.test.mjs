import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides,meshChunk} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {planP0OrientedApproach} from '../src/manual-biomes/forgotten-sands-oriented-approach.mjs';
const free=()=>false;
test('all four original-world exterior approaches, preserve source and walk accepted large route',()=>{
  const seed=2026,w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const job=beginP0GroundSurvey(w,{seed,x:480,z:-5,size:63,height:54},{reserved:free});
  let r;do{r=job.step();}while(r.accepted===null);assert.ok(r.accepted);
  let walked=0;
  for(let turn=0;turn<4;turn++){
    const a=planP0OrientedApproach(w,r,turn,{reserved:free});
    if(!a.accepted){console.log('P0 ORIENTED',JSON.stringify(a));continue;}
    const view={seed,get:(x,y,z)=>a.proposedBlock(x,y,z)??w.get(x,y,z)};
    // Verify original natural start and original foundation unchanged.
    assert.equal(collides(w,a.start.x,a.start.feet,a.start.z),false);
    assert.equal(collides(w,a.start.x,a.start.feet-.065,a.start.z),true);
    for(let x=r.site.minX;x<=r.site.maxX;x++)for(let z=r.site.minZ;z<=r.site.maxZ;z++)
      for(let y=r.capAt(x,z);y<r.floor;y++)assert.equal(a.proposedBlock(x,y,z),r.proposedBlock(x,y,z));
    const tx=r.site.x+.5,tz=r.site.z+.5,ux=tx-a.start.x,uz=tz-a.start.z;
    const distance=Math.hypot(ux,uz),yaw=Math.atan2(ux,uz),p={...a.start,yaw,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
    const progress=()=>((p.x-a.start.x)*ux+(p.z-a.start.z)*uz)/distance;
    let forward=0,back=0;
    while(progress()<distance&&forward++<900){stepPlayer(view,p,{forward:1},1/60);assert.equal(collides(view,p.x,p.feet,p.z),false);}
    assert.ok(progress()>=distance,'actual original physics entry');p.vX=0;p.vZ=0;
    while(progress()>.1&&back++<900){stepPlayer(view,p,{forward:-1},1/60);assert.equal(collides(view,p.x,p.feet,p.z),false);}
    assert.ok(progress()<=.1,'actual original physics return');
    walked++;
    console.log('P0 ORIENTED',JSON.stringify({accepted:true,turn,start:a.start,rows:a.rows,addedCells:a.addedCells,forward,back}));
  }
  assert.deepEqual(w.save().edits,[]);
  console.log('P0 ORIENTED SUMMARY',JSON.stringify({walked,orientations:4}));
});
