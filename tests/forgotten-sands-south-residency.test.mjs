import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {BLOCK,meshChunk,worldKey} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {planP0OrientedApproach} from '../src/manual-biomes/forgotten-sands-oriented-approach.mjs';
import {beginP0DetachedResearch} from '../src/manual-biomes/forgotten-sands-detached-research.mjs';
import {auditP0ApproachEdits,P0_APPROACH_EDIT_LOOKUP_MAX} from '../src/manual-biomes/forgotten-sands-approach-edit-audit.mjs';
import {meshP0UpperSection,planP0VerticalResidence} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const seed=2026,site={seed,x:480,z:-5,size:63,height:54},free=()=>false;
const make=()=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
function finish(job){let r;do{r=job.step();}while(r.accepted===null);assert.equal(r.accepted,true,JSON.stringify(r));return r;}
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
test('south-oriented detached exact 63 site: all 80 section hashes plus complete neighboring residency',()=>{
  const w=make(),before=JSON.stringify(w.save()),job=beginP0DetachedResearch(w,site,{reserved:free});finish(job);
  const d=job.researchView({approach:true,turn:2});assert.ok(d.accepted);assert.equal(d.approach.addedCells,8);
  assert.equal(d.approach.editLookups,2070);
  const view=d.view;
  // North wall is closed after rotation, south entry is open. Avoid
  // accidental null-coalescing fallback to the old north geometry.
  assert.equal(view.get(480,d.floor+1,-36),BLOCK.STONE);
  assert.equal(view.get(480,d.floor+1,26),BLOCK.AIR);
  const original=finish(beginP0GroundSurvey(w,site,{reserved:free}));
  const direct=planP0OrientedApproach(w,original,2,{reserved:free});assert.ok(direct.accepted);
  const directView={seed,get:(x,y,z)=>direct.proposedBlock(x,y,z)??w.get(x,y,z),
    generationProfile:w.generationProfile,_columnPlan:(x,z)=>w._columnPlan(x,z),edits:w.edits};
  const mesh=(v,cx,cz,s)=>s===0?meshChunk(v,cx,cz):meshP0UpperSection(v,cx,cz,s);
  const data=new Map(),times=[],siteKeys=[];
  function get(cx,cz,s){
    const k=[cx,cz,s].join(',');
    if(!data.has(k)){const t=performance.now(),v=mesh(view,cx,cz,s);times.push(performance.now()-t);
      assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);
      data.set(k,{hash:sha(v),bytes:v.byteLength});}
    return data.get(k);
  }
  for(let cx=28;cx<=31;cx++)for(let cz=-3;cz<=1;cz++)for(let s=0;s<=3;s++){
    siteKeys.push([cx,cz,s]);const m=get(cx,cz,s);
    assert.equal(m.hash,sha(mesh(directView,cx,cz,s)));
  }
  assert.equal(siteKeys.length,80);
  for(const [cx,cz,s] of [...siteKeys].reverse())assert.equal(sha(mesh(view,cx,cz,s)),get(cx,cz,s).hash);
  let maxBytes=0,maxBuffers=0,maxAt=null,windows=0;
  // Every neighbor in every selected section is generated; no omitted chunk
  // defaults to zero. Include apron and one chunk around monument footprint.
  for(let cx=27;cx<=32;cx++)for(let cz=-4;cz<=2;cz++)for(const feet of [15,20,36,52,67]){
    const p=planP0VerticalResidence(feet,{nearUpperSite:true});let bytes=0,n=0;
    for(const {section,radius} of p.allocations)
      for(let x=cx-radius;x<=cx+radius;x++)for(let z=cz-radius;z<=cz+radius;z++){
        bytes+=get(x,z,section).bytes;n++;
      }
    assert.equal(n,p.residentBufferLimit);assert.ok(n<=27);maxBuffers=Math.max(maxBuffers,n);
    if(bytes>maxBytes){maxBytes=bytes;maxAt={cx,cz,feet};}windows++;
  }
  const selected=siteKeys.map(c=>get(...c).bytes);
  assert.equal(JSON.stringify(w.save()),before);assert.equal(d.placementAuthority,false);
  console.log('P0 SOUTH RESIDENCY',JSON.stringify({siteHashes:80,siteBytes:selected.reduce((a,b)=>a+b,0),
    siteNonempty:selected.filter(n=>n>0).length,uniqueMeshes:data.size,windows,maxBytes,maxBuffers,maxAt,
    maxSingle:Math.max(...[...data.values()].map(v=>v.bytes)),meshP95:times.sort((a,b)=>a-b)[Math.ceil(times.length*.95)-1]}));
});
test('original edited terrain RGB parity and immutable detached metadata outside footprint',()=>{
  const w=make();let chosen=null;
  for(let x=529;x<=540&&!chosen;x++)for(let z=0;z<8;z++){
    const p=w._columnPlan(x,z);if(!p.size)continue;
    const y=Math.max(...p.keys()),id=w.get(x,y,z);
    if(id>=256&&id<=261){chosen=[x,y,z,id===256?257:256];break;}
  }
  assert.ok(chosen);assert.equal(w.set(...chosen),true);
  const [x,y,z,id]=chosen,k=worldKey(x,y,z),cx=Math.floor(x/16),cz=Math.floor(z/16);
  const job=beginP0DetachedResearch(w,site,{reserved:free});finish(job);
  const d=job.researchView({approach:true,turn:2}),v=d.view;assert.ok(d.accepted);
  assert.equal(v.edits.has(k),true);assert.equal(v.edits.get(k),id);assert.equal(v.edits.size,1);
  assert.equal(v.edits.set,undefined);assert.equal(v.edits.delete,undefined);assert.equal(v.edits.clear,undefined);
  assert.equal(v.edits instanceof Map,false);assert.ok(Object.isFrozen(v.edits));
  const expected=sha(meshChunk(w,cx,cz));
  assert.equal(sha(meshChunk(v,cx,cz)),expected);
  const missing={...v,edits:undefined};assert.notEqual(sha(meshChunk(missing,cx,cz)),expected,'exercise actual source RGB metadata distinction');
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);assert.equal(v.edits.get(k),id);
  assert.equal(sha(meshChunk(v,cx,cz)),expected);assert.equal(d.sourceSnapshotUnchanged(),false);
  console.log('P0 EDIT RGB',JSON.stringify({chosen,chunk:[cx,cz],hash:expected}));
});
test('bounded direct approach edit audit catches deep and maximum-height rows without iterating unrelated map',()=>{
  const w=make(),r=finish(beginP0GroundSurvey(w,site,{reserved:free})),a=planP0OrientedApproach(w,r,2,{reserved:free});assert.ok(a.accepted);
  assert.equal(P0_APPROACH_EDIT_LOOKUP_MAX,5520);
  assert.equal(a.editLookups,2070);
  // Actual original saved deep edit, at first proposed apron row.
  assert.equal(w.set(480,-210,27,BLOCK.AIR),true);
  const deny=planP0OrientedApproach(w,r,2,{reserved:free});assert.equal(deny.accepted,false);assert.equal(deny.reason,'player-edit-approach');
  assert.equal(deny.detail.key,'480,-210,27');assert.equal(w.get(480,-210,27),BLOCK.AIR);
  const fixture={edits:{has:k=>k==='9,19,9',keys(){throw Error('unbounded iteration');}}};
  assert.deepEqual(auditP0ApproachEdits(fixture,[[9,9]]),{ok:false,key:'9,19,9',lookups:230});
  assert.throws(()=>auditP0ApproachEdits(fixture,Array.from({length:25},(_,i)=>[i,0])));
  console.log('P0 BOUNDED AUDIT',JSON.stringify({max:P0_APPROACH_EDIT_LOOKUP_MAX,actual:a.editLookups,deepVeto:deny.detail}));
});
