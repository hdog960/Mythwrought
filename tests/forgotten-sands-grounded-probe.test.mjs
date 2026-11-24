import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides,raycast} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {defineP0Footprint,createP0FootprintIndex,inspectP0GroundColumn,beginP0GroundSurvey,
  P0_MAX_COLUMNS_PER_STEP,P0_MAX_EDIT_ROWS_PER_STEP} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {meshP0UpperSection} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false; // Test-owned reservation fixture, NOT a live external-owner clearance.
function finish(job){
  for(let n=0;n<3000;n++){const r=job.step();if(r.accepted!==null)return r;}
  throw Error('survey did not terminate');
}
function findGround(world){
  const rejects={};
  for(const x of [384,416,448,480,544,576,608,640,672])
    for(const z of [-160,-112,-64,64,112,160]){
      const input={seed:world.seed,x,z,size:15,height:24};
      // Valid research footprint height <= width, so use 15 for proof.
      input.height=15;
      const r=finish(beginP0GroundSurvey(world,input,{reserved:free}));
      if(r.accepted)return r;
      rejects[r.reason]=(rejects[r.reason]??0)+1;
    }
  console.log('P0 rejected candidate tally',JSON.stringify(rejects));
  return null;
}
test('bounded compact index is deterministic, negative-safe and rejects overlap',()=>{
  const a=defineP0Footprint({seed:179,x:-16,z:15,size:111,height:90});
  const b=defineP0Footprint({seed:179,x:150,z:15,size:15,height:15});
  const p=createP0FootprintIndex([a,b]),q=createP0FootprintIndex([b,a]);
  for(let cx=-5;cx<=10;cx++)assert.deepEqual(p.forChunk(179,cx,0),q.forChunk(179,cx,0));
  assert.equal(p.forChunk(179,-1,0).length,1);
  assert.equal(p.forChunk(2026,-1,0).length,0);
  assert.throws(()=>createP0FootprintIndex([a,{...b,x:42}]),/Overlapping/);
  assert.throws(()=>defineP0Footprint({...a,size:113}));
});
test('actual original M7 terrain column survey is bounded, with explicit reservation and profile vetoes',()=>{
  const w=make(179),site=defineP0Footprint({seed:179,x:512,z:100,size:15,height:15});
  const job=beginP0GroundSurvey(w,site,{reserved:()=>true});
  assert.throws(()=>job.step({columns:P0_MAX_COLUMNS_PER_STEP+1}));
  assert.throws(()=>job.step({editRows:P0_MAX_EDIT_ROWS_PER_STEP+1}));
  const r=job.step();
  assert.equal(r.accepted,false);
  assert.equal(r.scannedColumns,1);
  assert.equal(r.reason,'reserved-column');
  assert.throws(()=>beginP0GroundSurvey(w,site),/Invalid/);
  const old=new FourRegionWorld(179,fourRegionProfile(179,M6_BALANCED_GENERATOR));
  assert.throws(()=>beginP0GroundSurvey(old,site,{reserved:free}),/Invalid/);
  assert.deepEqual(w.save().edits,[]);
});
test('real original M7 authored cave AIR exists and is never treated as vacant source ground',()=>{
  const w=make(179);
  let found=null;
  for(const {mouth} of w.environmentCaves.entranceSites){
    for(let dx=-4;dx<=4&&!found;dx++)for(let dz=-4;dz<=4&&!found;dz++)
      for(let y=-3;y<=19;y++)if(w.environmentCaves.get(mouth.x+dx,y,mouth.z+dz)===BLOCK.AIR){
        found=[mouth.x+dx,y,mouth.z+dz];break;
      }
    if(found)break;
  }
  assert.ok(found,'must find real authored cave AIR');
  assert.equal(w.get(...found),BLOCK.AIR);
  const [x,,z]=found,site=defineP0Footprint({seed:179,x,z,size:15,height:15});
  const r=inspectP0GroundColumn(w,site,x,z,free);
  assert.equal(r.ok,false);
  // Many genuine portals lie outside Desert. Either native veto is valid;
  // do not claim Desert cave-specific veto coverage unless actually exercised.
  assert.ok(['non-core-desert','oasis-reservation','authored-cave'].includes(r.reason),JSON.stringify(r));
  console.log('P0 actual source AIR',JSON.stringify({found,reason:r.reason,biome:v6BiomeAt(x,z,179)?.name??'plains'}));
  assert.deepEqual(w.save().edits,[]);
});
test('native grounded whole-site search, physical proposals and reverse chunk reads on real M7',()=>{
  let positive=0;
  for(const seed of [179,2026]){
    const w=make(seed),before=JSON.stringify(w.save()),r=findGround(w);
    if(!r){console.log('P0 no safe bounded candidate seed',seed);continue;}
    positive++;
    assert.equal(r.scannedColumns,225);
    assert.ok(r.maxY>19);
    assert.ok(r.maxCap-r.minCap<=8);
    for(let x=r.site.minX;x<=r.site.maxX;x++)for(let z=r.site.minZ;z<=r.site.maxZ;z++){
      const cap=r.capAt(x,z);
      assert.notEqual(w.get(x,cap,z),BLOCK.AIR);
      assert.equal(r.proposedBlock(x,cap,z),null);
      for(let y=cap+1;y<=r.floor;y++){
        assert.equal(w.get(x,y,z),BLOCK.AIR);
        assert.notEqual(r.proposedBlock(x,y,z),null);
      }
    }
    const view={seed,get:(x,y,z)=>r.proposedBlock(x,y,z)??w.get(x,y,z)};
    const at=[r.site.x+.5,r.floor,r.site.z+.5];
    assert.equal(collides(view,...at),true);
    const hit=raycast(view,[at[0],r.floor+1.5,at[2]],[0,-1,0],6);
    assert.equal(hit.hit[1],r.floor);
    const chunks=[];
    for(let cx=Math.floor(r.site.minX/16);cx<=Math.floor(r.site.maxX/16);cx++)
      for(let cz=Math.floor(r.site.minZ/16);cz<=Math.floor(r.site.maxZ/16);cz++)chunks.push([cx,cz]);
    const first=chunks.map(([cx,cz])=>meshP0UpperSection(view,cx,cz,1));
    assert.ok(first.some(v=>v.length));
    for(let i=chunks.length-1;i>=0;i--)assert.deepEqual(meshP0UpperSection(view,...chunks[i],1),first[i]);
    assert.equal(JSON.stringify(w.save()),before);
    console.log('P0 grounded evidence',JSON.stringify({seed,site:r.site,min:r.minCap,max:r.maxCap,
      floor:r.floor,maxY:r.maxY,chunks:chunks.length,meshBytes:first.reduce((a,v)=>a+v.byteLength,0)}));
    // The same real source with one unrelated deep footprint edit cannot
    // pass the final whole-site edit audit, including edits after step one.
    const job=beginP0GroundSurvey(w,r.site,{reserved:free});
    assert.equal(job.step({columns:1}).accepted,null);
    assert.equal(w.set(r.site.x,-100,r.site.z,BLOCK.AIR),true);
    const rejected=finish(job);
    assert.equal(rejected.accepted,false);
    assert.equal(rejected.reason,'player-edit');
    assert.equal(w.get(r.site.x,-100,r.site.z),BLOCK.AIR);
  }
  assert.ok(positive>0,'at least one authentic whole-footprint positive required; otherwise hold gate');
});
