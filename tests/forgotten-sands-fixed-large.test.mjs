import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides,meshChunk} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {beginP0GroundSurvey,inspectP0GroundColumn,defineP0Footprint} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {planP0NorthApproach} from '../src/manual-biomes/forgotten-sands-approach-probe.mjs';
import {sliceP0SurveySection} from '../src/manual-biomes/forgotten-sands-grounded-slice.mjs';
import {meshP0UpperSection,p0UpperSectionForY} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false;
function finish(job){let r;do{r=job.step();}while(r.accepted===null);return r;}
test('fixed actual 63-wide M7 site whole geometry and sampled original mesh bounds',()=>{
  const seed=2026,w=make(seed),r=finish(beginP0GroundSurvey(w,{seed,x:480,z:-5,size:63,height:54},{reserved:free}));
  assert.ok(r.accepted);assert.equal(r.capStorageBytes,3969);assert.equal(r.floor,14);assert.equal(r.maxY,67);
  const last=p0UpperSectionForY(r.maxY),chunks=[];
  for(let cx=Math.floor(r.site.minX/16);cx<=Math.floor(r.site.maxX/16);cx++)
    for(let cz=Math.floor(r.site.minZ/16);cz<=Math.floor(r.site.maxZ/16);cz++)chunks.push([cx,cz]);
  const slices=new Map();let cells=0,peak=0;
  for(const [cx,cz] of chunks)for(let s=0;s<=last;s++){
    const rows=sliceP0SurveySection(r,cx,cz,s);peak=Math.max(peak,rows.length);cells+=rows.length;
    assert.ok(rows.length<=256*(s===0?23:16));
    for(const [x,y,z,id] of rows){
      assert.equal(Math.floor(x/16),cx);assert.equal(Math.floor(z/16),cz);
      assert.equal(w.get(x,y,z),BLOCK.AIR);
      assert.equal(r.proposedBlock(x,y,z),id);
    }
    slices.set([cx,cz,s].join(','),rows.length);
  }
  for(const [cx,cz] of [...chunks].reverse())for(let s=last;s>=0;s--)
    assert.equal(sliceP0SurveySection(r,cx,cz,s).length,slices.get([cx,cz,s].join(',')));
  const view={seed,get:(x,y,z)=>r.proposedBlock(x,y,z)??w.get(x,y,z),generationProfile:w.generationProfile,_columnPlan:(x,z)=>w._columnPlan(x,z),edits:w.edits};
  const samples=[chunks[0],chunks[Math.floor(chunks.length/2)],chunks.at(-1)];
  const meshBytes=samples.map(([cx,cz])=>[meshChunk(view,cx,cz).byteLength,...Array.from({length:last},(_,i)=>meshP0UpperSection(view,cx,cz,i+1).byteLength)]);
  assert.ok(meshBytes.flat().every(n=>n<4*1024*1024));
  assert.deepEqual(w.save().edits,[]);
  console.log('P0 LARGE EXACT',JSON.stringify({cells,peak,chunks:chunks.length,sections:last+1,meshBytes}));
});
test('exterior natural start and actual stepPlayer approach and return on medium sites',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),r=finish(beginP0GroundSurvey(w,{seed,x:608,z:112,size:31,height:28},{reserved:free}));
    const a=planP0NorthApproach(w,r,{reserved:free});
    if(!a.accepted){console.log('P0 APPROACH',JSON.stringify({seed,accepted:false,reason:a.reason,detail:a.detail}));continue;}
    const view={seed,get:(x,y,z)=>a.proposedBlock(x,y,z)??r.proposedBlock(x,y,z)??w.get(x,y,z)};
    assert.equal(collides(w,a.start.x,a.start.feet,a.start.z),false);
    assert.equal(collides(w,a.start.x,a.start.feet-.065,a.start.z),true);
    const p={...a.start,yaw:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
    const target=r.site.z+.5;let frames=0,back=0;
    while(p.z<target&&frames++<500){
      stepPlayer(view,p,{forward:1},1/60);assert.equal(collides(view,p.x,p.feet,p.z),false);
    }
    assert.ok(p.z>=target,'native physics must enter chamber from actual natural terrain');
    p.vZ=0;
    while(p.z>a.start.z+.1&&back++<500)stepPlayer(view,p,{forward:-1},1/60);
    assert.ok(p.z<=a.start.z+.1,'native physics must return outside');
    assert.deepEqual(w.save().edits,[]);
    console.log('P0 APPROACH',JSON.stringify({seed,accepted:true,rows:a.rows,addedCells:a.addedCells,frames,back,start:a.start}));
  }
});
test('actual east-gallery source AIR and core desert veto, if original site intersects core',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),o=w.environmentCaves.cavePlanReport.eastGalleryOrigin;
    let air=0,desert=0,core=0,veto=null;
    for(let x=o.x-4;x<=o.x+o.length+10;x++)for(let z=o.z-20;z<=o.z+20;z++)for(let y=-3;y<=19;y++){
      if(w.environmentCaves.get(x,y,z)!==BLOCK.AIR)continue;
      air++;const b=v6BiomeAt(x,z,seed);if(b?.name!=='desert')continue;desert++;
      if(b.weight<.85)continue;core++;
      const r=inspectP0GroundColumn(w,defineP0Footprint({seed,x,z}),x,z,free);
      assert.equal(r.ok,false);
      if(r.reason==='authored-cave'&&!veto)veto={x,y,z,reader:w.environmentCaves.get(x,y,z),reason:r.reason};
    }
    assert.ok(air>0);
    console.log('P0 EAST AIR',JSON.stringify({seed,origin:o,air,desert,core,veto}));
    assert.deepEqual(w.save().edits,[]);
  }
});
