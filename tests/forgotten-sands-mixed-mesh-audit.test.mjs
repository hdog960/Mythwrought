import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {prepareP0MixedGroup,p0MixedAuditEnvelope,p0MixedRouteWindows,p0MixedVistaKeys,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0OuterCapWindows} from '../src/manual-biomes/forgotten-sands-outer-cap-search.mjs';
import {beginP0ReliefWindow} from '../src/manual-biomes/forgotten-sands-relief-search.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex'),free=()=>false;
test('all four joint mixed groups: complete native envelope reverse mesh hashes and every route residency window',()=>{
  for(let i=0;i<4;i++){
    const {world,spec,group}=prepareP0MixedGroup(i),before=JSON.stringify(world.save()),env=p0MixedAuditEnvelope(spec),cache=new Map(),times=[];
    function mesh(k){const t=performance.now(),v=p0BenchmarkMesh(group.view,k.cx,k.cz,k.s);times.push(performance.now()-t);
      assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);return {hash:sha(v),bytes:v.byteLength};}
    function get(k){if(!cache.has(k.key))cache.set(k.key,mesh(k));return cache.get(k.key);}
    for(const k of env.coords)get(k);
    for(const k of [...env.coords].reverse())assert.deepEqual(mesh(k),get(k));
    let maxBytes=0,maxBuffers=0,at=null;
    const windows=p0MixedRouteWindows(group);
    for(const w of windows){let bytes=0;for(const k of w.keys)bytes+=get(k).bytes;assert.ok(w.keys.length<=27);maxBuffers=Math.max(maxBuffers,w.keys.length);
      if(bytes>maxBytes){maxBytes=bytes;at=[w.cx,w.cz,w.feet];}}
    const vista=p0MixedVistaKeys(spec),nonempty=vista.filter(k=>get(k).bytes>0);
    const vistaBytes=nonempty.reduce((n,k)=>n+get(k).bytes,0),envelopeBytes=env.coords.reduce((n,k)=>n+get(k).bytes,0);
    assert.equal(JSON.stringify(world.save()),before);assert.equal(group.publicationStatus().authorized,false);
    console.log('P0 MIXED MESH',JSON.stringify({index:i,seed:spec.seed,turns:group.turns,proposedCells:group.proposedCells,hashes:env.coords.length,uniqueMeshes:cache.size,
      windows:windows.length,maxBytes,maxBuffers,at,envelopeBytes,vistaKeys:vista.length,vistaNonempty:nonempty.length,vistaBytes,meshP95:times.sort((a,b)=>a-b)[Math.ceil(times.length*.95)-1]}));
  }
});
test('new outer-ring actual-cap-ranked source windows with unchanged 63 and 111 admission',()=>{
  for(const seed of [179,2026]){
    const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)),rank=p0OuterCapWindows(w,{reserved:free}),results=[],found={63:null,111:null};
    assert.equal(rank.windows.length,16);
    for(const win of rank.windows){
      assert.ok(Math.max(Math.abs(win.tx),Math.abs(win.tz))>5);
      const j=beginP0ReliefWindow(w,win,{reserved:free});let r;do{r=j.step();}while(!r.done);
      results.push({x:win.x,z:win.z,best:r.bestSquare,clear:r.clearSquares,veto:r.reliefVeto,rankClear:win.clear,rankRelief:win.relief});
      for(const size of [63,111])if(!found[size]&&r.candidates[size].length){
        const q=beginP0GroundSurvey(w,r.candidates[size][0],{reserved:free,maxRelief:8});let a;do{a=q.step();}while(a.accepted===null);
        assert.equal(a.accepted,true);assert.ok(a.maxCap-a.minCap<=8);found[size]={site:a.site,min:a.minCap,max:a.maxCap,floor:a.floor,top:a.maxY};
      }
    }
    assert.deepEqual(w.save().edits,[]);
    console.log('P0 OUTER CAPS',JSON.stringify({seed,samples:rank.samples,tiles:rank.tiles,observations:rank.windows.length*16129,results,found}));
  }
});
