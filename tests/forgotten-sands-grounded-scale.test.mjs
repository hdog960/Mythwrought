import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,meshChunk} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {beginP0GroundSurvey,createP0FootprintIndex} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {sliceP0SurveySection} from '../src/manual-biomes/forgotten-sands-grounded-slice.mjs';
import {meshP0UpperSection,p0UpperSectionForY} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false; // external reservation fixture only; not real owner admission
function survey(world,site,columns=32){
  const job=beginP0GroundSurvey(world,site,{reserved:free});
  let prior=0,steps=0,r;
  do {
    r=job.step({columns});
    assert.ok(r.scannedColumns-prior<=columns);
    prior=r.scannedColumns;steps++;
    assert.ok(steps<2000);
  }while(r.accepted===null);
  return {r,steps};
}
test('real M7 medium-to-colossal footprint survey retains bounded steps and section-local extraction',()=>{
  let medium=0;
  for(const seed of [179,2026]){
    const w=make(seed),before=JSON.stringify(w.save());
    let good=null;
    for(const [x,z] of [[384,-160],[416,-160],[608,112],[640,-112],[448,160]]){
      const {r,steps}=survey(w,{seed,x,z,size:31,height:28});
      console.log('P0 medium survey',JSON.stringify({seed,x,z,size:31,accepted:r.accepted,reason:r.reason,detail:r.detail,columns:r.scannedColumns,steps}));
      if(r.accepted){good=r;break;}
    }
    if(good){
      medium++;
      assert.equal(good.scannedColumns,961);
      const r=good,index=createP0FootprintIndex([r.site]),chunks=[];
      for(let cx=Math.floor(r.site.minX/16);cx<=Math.floor(r.site.maxX/16);cx++)
        for(let cz=Math.floor(r.site.minZ/16);cz<=Math.floor(r.site.maxZ/16);cz++){
          assert.equal(index.forChunk(seed,cx,cz).length,1);chunks.push([cx,cz]);
        }
      const last=p0UpperSectionForY(r.maxY),seen=new Set(),slices=new Map();
      let total=0,peak=0;
      for(const [cx,cz] of chunks)for(let s=0;s<=last;s++){
        const rows=sliceP0SurveySection(r,cx,cz,s);
        const k=[cx,cz,s].join(',');
        slices.set(k,rows);total+=rows.length;peak=Math.max(peak,rows.length);
        assert.ok(rows.length<=256*(s===0?23:16));
        for(const [x,y,z,id] of rows){
          const k=[x,y,z].join(',');
          assert.ok(!seen.has(k));seen.add(k);
          assert.equal(w.get(x,y,z),BLOCK.AIR);
          assert.equal(r.proposedBlock(x,y,z),id);
          assert.ok(y>r.capAt(x,z));
        }
      }
      for(const [cx,cz] of [...chunks].reverse())for(let s=last;s>=0;s--)
        assert.deepEqual(sliceP0SurveySection(r,cx,cz,s),slices.get([cx,cz,s].join(',')));
      assert.deepEqual(sliceP0SurveySection(r,999,999,1),[]);
      // Native surface and upper meshing using the same surveyed world reads.
      const view={seed,get:(x,y,z)=>r.proposedBlock(x,y,z)??w.get(x,y,z),
        generationProfile:w.generationProfile,_columnPlan:(x,z)=>w._columnPlan(x,z),edits:w.edits};
      const cx=Math.floor(r.site.x/16),cz=Math.floor(r.site.z/16);
      const meshes=[meshChunk(view,cx,cz),...Array.from({length:last},(_,i)=>meshP0UpperSection(view,cx,cz,i+1))];
      assert.ok(meshes[0].length>0);assert.ok(meshes.slice(1).some(v=>v.length>0));
      for(const v of meshes){assert.equal(v.length%27,0);assert.ok(v.byteLength<4*1024*1024);}
      console.log('P0 medium physical',JSON.stringify({seed,site:r.site,minCap:r.minCap,maxCap:r.maxCap,
        floor:r.floor,maxY:r.maxY,chunks:chunks.length,sections:last+1,totalCells:total,peakSliceCells:peak,
        centralMeshBytes:meshes.reduce((a,v)=>a+v.byteLength,0)}));
      assert.throws(()=>sliceP0SurveySection({accepted:null},cx,cz,1));
    }
    for(const [size,height] of [[63,54],[111,90]]){
      const {r,steps}=survey(w,{seed,x:384,z:-160,size,height});
      console.log('P0 colossal diagnostic',JSON.stringify({seed,size,height,accepted:r.accepted,reason:r.reason,detail:r.detail,
        columns:r.scannedColumns,steps,maxY:r.maxY}));
      assert.ok(r.scannedColumns<=size*size);
      if(r.accepted)assert.equal(r.scannedColumns,size*size);
      else assert.throws(()=>sliceP0SurveySection(r,24,-10,1));
    }
    assert.equal(JSON.stringify(w.save()),before);
  }
  assert.ok(medium>0,'at least one original-source medium footprint is required');
});
