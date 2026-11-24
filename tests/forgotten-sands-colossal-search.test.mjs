import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {BLOCK,collides,meshChunk} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {beginP0GroundSurvey,inspectP0GroundColumn,defineP0Footprint} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {p0SearchWindows,beginP0ClearanceWindow} from '../src/manual-biomes/forgotten-sands-colossal-search.mjs';
import {sliceP0SurveySection} from '../src/manual-biomes/forgotten-sands-grounded-slice.mjs';
import {meshP0UpperSection,p0UpperSectionForY} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false;
function finish(job,limit=32){let r;do{r=job.step({columns:limit});}while(r.accepted===null);return r;}
function quantile(a,p){return a.slice().sort((x,y)=>x-y)[Math.ceil(a.length*p)-1];}
test('original M7 deterministic bounded core clearance census and actual colossal admission attempt',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),before=JSON.stringify(w.save()),windows=p0SearchWindows(seed);
    assert.deepEqual(windows,p0SearchWindows(seed));
    const times=[],totals={},results=[],admitted={63:null,111:null};
    // Fixed limit: nine windows in the guaranteed Desert tile. No cherry-picking.
    for(const win of windows.slice(0,9)){
      const job=beginP0ClearanceWindow(w,win,{reserved:free});let r,prior=0;
      do{const t=performance.now();r=job.step();times.push(performance.now()-t);
        assert.ok(r.columns-prior<=32);prior=r.columns;
      }while(!r.done);
      assert.equal(r.columns,127*127);assert.equal(r.scratchBytes,254);
      for(const [k,n] of Object.entries(r.counts))totals[k]=(totals[k]??0)+n;
      results.push({x:win.x,z:win.z,best:r.bestSquare,bestAt:r.bestAt,candidates63:r.candidates[63].length,candidates111:r.candidates[111].length});
      for(const size of [63,111])for(const c of r.candidates[size]){
        if(admitted[size])break;
        const q=finish(beginP0GroundSurvey(w,c,{reserved:free}));
        if(!q.accepted)continue;
        assert.equal(q.capStorageBytes,size*size);
        const cx=Math.floor(c.x/16),cz=Math.floor(c.z/16),last=p0UpperSectionForY(q.maxY);
        const slice=sliceP0SurveySection(q,cx,cz,last);
        assert.ok(slice.length<=4096);
        const view={seed,get:(x,y,z)=>q.proposedBlock(x,y,z)??w.get(x,y,z),generationProfile:w.generationProfile,_columnPlan:(x,z)=>w._columnPlan(x,z),edits:w.edits};
        const mesh=meshP0UpperSection(view,cx,cz,last);
        assert.ok(mesh.byteLength<4*1024*1024);
        admitted[size]={site:q.site,floor:q.floor,maxY:q.maxY,capBytes:q.capStorageBytes,slice:slice.length,meshBytes:mesh.byteLength};
      }
    }
    assert.ok(results.length>=9);
    assert.equal(Object.values(totals).reduce((a,b)=>a+b,0),9*127*127);
    assert.equal(JSON.stringify(w.save()),before);
    console.log('P0 CLEARANCE',JSON.stringify({seed,results,totals,admitted,stepSamples:times.length,p95Ms:quantile(times,.95),maxMs:Math.max(...times)}));
  }
});
test('original M7 compact cap bytes and real player movement through interior doorway, exterior access separately assessed',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),r=finish(beginP0GroundSurvey(w,{seed,x:608,z:112,size:31,height:28},{reserved:free}));
    assert.ok(r.accepted);assert.equal(r.capStorageBytes,961);
    assert.equal(r.capAt(r.site.minX-1,r.site.minZ),undefined);
    assert.equal(r.capAt(r.site.x+.5,r.site.z),undefined);
    const view={seed,get:(x,y,z)=>r.proposedBlock(x,y,z)??w.get(x,y,z)};
    const x=r.site.x+.5,feet=r.floor+1,z0=r.site.minZ+.5;
    assert.equal(collides(view,x,feet,z0),false);
    assert.equal(collides(view,x,feet-.065,z0),true);
    const player={x,z:z0,feet,yaw:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
    const dt=1/60;let frames=0;
    while(player.z<r.site.z+.5&&frames++<400){
      stepPlayer(view,player,{forward:1},dt);assert.equal(collides(view,player.x,player.feet,player.z),false);
    }
    assert.ok(player.z>=r.site.z+.5,'actual stepPlayer must reach chamber');
    assert.ok(Math.abs(player.feet-feet)<.02);
    let back=0;player.vZ=0;
    while(player.z>z0+.1&&back++<400)stepPlayer(view,player,{forward:-1},dt);
    assert.ok(player.z<=z0+.1);
    const outsideZ=r.site.minZ-1;let exteriorTop=null;
    for(let y=19;y>=-3;y--)if(w.get(r.site.x,y,outsideZ)!==BLOCK.AIR){exteriorTop=y;break;}
    console.log('P0 WALK',JSON.stringify({seed,frames,back,feet,exteriorTop,entranceRise:r.floor-exteriorTop,capBytes:r.capStorageBytes,exteriorCertified:false}));
    assert.deepEqual(w.save().edits,[]);
  }
});
test('authentic combined cave source AIR diagnostic across original entrance sites, no fabricated desert cave',()=>{
  for(const seed of [179,2026]){
    const w=make(seed);let air=0,coreAir=0,otherDesertAir=0,veto=null;
    for(const {mouth} of w.environmentCaves.entranceSites){
      for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++)for(let y=-3;y<=19;y++){
        const x=mouth.x+dx,z=mouth.z+dz;
        if(w.environmentCaves.get(x,y,z)!==BLOCK.AIR)continue;
        air++;const biome=v6BiomeAt(x,z,seed);
        if(biome?.name==='desert'){
          if(biome.weight>=.85){coreAir++;const r=inspectP0GroundColumn(w,defineP0Footprint({seed,x,z}),x,z,free);assert.equal(r.ok,false);if(r.reason==='authored-cave')veto={x,y,z,reason:r.reason};}
          else otherDesertAir++;
        }
      }
    }
    assert.ok(air>0);
    console.log('P0 CAVE AIR',JSON.stringify({seed,air,coreAir,otherDesertAir,veto}));
    assert.deepEqual(w.save().edits,[]);
  }
});
