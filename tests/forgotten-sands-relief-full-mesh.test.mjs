import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {BLOCK,collides,meshChunk} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {p0ReliefWindows,beginP0ReliefWindow} from '../src/manual-biomes/forgotten-sands-relief-search.mjs';
import {planP0NorthApproach} from '../src/manual-biomes/forgotten-sands-approach-probe.mjs';
import {beginP0DetachedResearch} from '../src/manual-biomes/forgotten-sands-detached-research.mjs';
import {meshP0UpperSection,p0UpperSectionForY,planP0VerticalResidence} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false;
function finish(job){let r;do{r=job.step();}while(r.accepted===null);return r;}
function quantile(a,p){return a.slice().sort((x,y)=>x-y)[Math.ceil(a.length*p)-1];}
test('relief ranked exhaustive endpoints in bounded broader authentic desert windows',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),wins=p0ReliefWindows(seed),found={63:null,111:null},observed=[],times=[],rankTimes=[];
    assert.deepEqual(wins,p0ReliefWindows(seed));assert.equal(wins.length,15);
    for(const win of wins){
      const job=beginP0ReliefWindow(w,win,{reserved:free});let r,prior=0,rank=0;
      do{const start=performance.now(),next=job.step();const ms=performance.now()-start;
        assert.ok(next.columns-prior<=32);assert.ok(next.rankCursor-rank<=8);
        (next.columns>prior?times:rankTimes).push(ms);prior=next.columns;rank=next.rankCursor;r=next;
      }while(!r.done);
      assert.equal(r.columns,16129);assert.equal(r.rankCursor,16129);
      assert.equal(r.scratchBytes,32512);
      observed.push({x:win.x,z:win.z,best:r.bestSquare,clear:r.clearSquares,reliefVeto:r.reliefVeto,ranked:[r.candidates[63].length,r.candidates[111].length]});
      for(const size of [63,111])for(const c of r.candidates[size]){
        if(found[size])break;
        assert.ok(c.relief<=8);
        const q=finish(beginP0GroundSurvey(w,c,{reserved:free}));
        assert.equal(q.accepted,true,JSON.stringify({c,reason:q.reason}));
        assert.equal(q.minCap,c.minCap);assert.equal(q.maxCap,c.maxCap);
        found[size]={site:q.site,relief:c.relief,floor:q.floor,maxY:q.maxY,capBytes:q.capStorageBytes};
      }
    }
    assert.deepEqual(w.save().edits,[]);
    console.log('P0 RELIEF',JSON.stringify({seed,observations:wins.length*16129,observed,found,
      surveyP95:quantile(times,.95),surveyMax:Math.max(...times),rankP95:quantile(rankTimes,.95),rankMax:Math.max(...rankTimes)}));
  }
});
test('all 80 native mesh section outputs on accepted large site, reverse SHA256 and proposed residency',()=>{
  const seed=2026,w=make(seed),q=finish(beginP0GroundSurvey(w,{seed,x:480,z:-5,size:63,height:54},{reserved:free}));
  assert.ok(q.accepted);
  const view={seed,get:(x,y,z)=>q.proposedBlock(x,y,z)??w.get(x,y,z),generationProfile:w.generationProfile,
    _columnPlan:(x,z)=>w._columnPlan(x,z),edits:w.edits};
  const coords=[],last=p0UpperSectionForY(q.maxY),bytes=new Map(),times=[];
  for(let cx=Math.floor(q.site.minX/16);cx<=Math.floor(q.site.maxX/16);cx++)
    for(let cz=Math.floor(q.site.minZ/16);cz<=Math.floor(q.site.maxZ/16);cz++)
      for(let s=0;s<=last;s++)coords.push([cx,cz,s]);
  const digest=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
  const first=new Map(),mesh=([cx,cz,s])=>s===0?meshChunk(view,cx,cz):meshP0UpperSection(view,cx,cz,s);
  for(const c of coords){const start=performance.now(),v=mesh(c);times.push(performance.now()-start);
    assert.equal(v.length%27,0);assert.ok(v.byteLength<4*1024*1024);assert.ok(v.every(Number.isFinite));
    first.set(c.join(','),digest(v));bytes.set(c.join(','),v.byteLength);
  }
  assert.equal(coords.length,80);
  for(const c of [...coords].reverse())assert.equal(digest(mesh(c)),first.get(c.join(',')));
  let maxResidentKnownBytes=0;
  for(let cx=28;cx<=31;cx++)for(let cz=-3;cz<=1;cz++)for(const feet of [15,20,36,52,67]){
    const plan=planP0VerticalResidence(feet,{nearUpperSite:true});let sum=0;
    assert.ok(plan.residentBufferLimit<=27);
    for(const {section,radius} of plan.allocations)
      for(let x=cx-radius;x<=cx+radius;x++)for(let z=cz-radius;z<=cz+radius;z++)sum+=bytes.get([x,z,section].join(','))??0;
    maxResidentKnownBytes=Math.max(maxResidentKnownBytes,sum);
  }
  console.log('P0 FULL MESH',JSON.stringify({outputs:coords.length,nonempty:[...bytes.values()].filter(n=>n>0).length,
    totalBytes:[...bytes.values()].reduce((a,b)=>a+b,0),maxBytes:Math.max(...bytes.values()),
    maxResidentKnownBytes,meshP95Ms:quantile(times,.95),meshMaxMs:Math.max(...times)}));
  assert.deepEqual(w.save().edits,[]);
});
test('actual large exterior route and original stepPlayer both directions',()=>{
  const seed=2026,w=make(seed),q=finish(beginP0GroundSurvey(w,{seed,x:480,z:-5,size:63,height:54},{reserved:free}));
  assert.ok(q.accepted);
  const a=planP0NorthApproach(w,q,{reserved:free});
  if(!a.accepted){console.log('P0 LARGE WALK',JSON.stringify({accepted:false,reason:a.reason,detail:a.detail}));return;}
  const view={seed,get:(x,y,z)=>a.proposedBlock(x,y,z)??q.proposedBlock(x,y,z)??w.get(x,y,z)};
  assert.equal(collides(w,a.start.x,a.start.feet,a.start.z),false);
  assert.equal(collides(w,a.start.x,a.start.feet-.065,a.start.z),true);
  const p={...a.start,yaw:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
  let forward=0,back=0;
  while(p.z<q.site.z+.5&&forward++<900){stepPlayer(view,p,{forward:1},1/60);assert.equal(collides(view,p.x,p.feet,p.z),false);}
  assert.ok(p.z>=q.site.z+.5);
  p.vZ=0;
  while(p.z>a.start.z+.1&&back++<900){stepPlayer(view,p,{forward:-1},1/60);assert.equal(collides(view,p.x,p.feet,p.z),false);}
  assert.ok(p.z<=a.start.z+.1);
  console.log('P0 LARGE WALK',JSON.stringify({accepted:true,start:a.start,rows:a.rows,addedCells:a.addedCells,forward,back}));
});
test('detached original snapshot refuses live placement and remains independent after source edit',()=>{
  const w=make(179),site={seed:179,x:608,z:112,size:31,height:28};
  const job=beginP0DetachedResearch(w,site,{reserved:free});
  assert.throws(()=>job.researchView(),/Complete detached/);
  assert.equal(finish(job).accepted,true);
  const r=job.researchView({approach:true});assert.equal(r.accepted,true);assert.equal(r.placementAuthority,false);
  assert.equal(typeof r.view.set,'undefined');assert.equal(typeof r.view.save,'undefined');
  assert.equal(r.sourceSnapshotUnchanged(),true);
  const before=r.view.get(site.x,r.floor,site.z);
  assert.equal(w.set(site.x,r.floor,site.z,BLOCK.WOOD),true);
  assert.equal(w.get(site.x,r.floor,site.z),BLOCK.WOOD);
  assert.equal(r.sourceSnapshotUnchanged(),false);
  assert.equal(r.view.get(site.x,r.floor,site.z),before);
  const rejected=beginP0DetachedResearch(w,site,{reserved:free});assert.equal(finish(rejected).accepted,false);
  assert.throws(()=>rejected.researchView(),/Complete detached/);
});
