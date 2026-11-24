import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {beginP0GroundSurvey,p0FootprintContains} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
import {defineP0ModularSpan} from '../src/manual-biomes/forgotten-sands-modular-span.mjs';
import {planP0OrientedApproach} from '../src/manual-biomes/forgotten-sands-oriented-approach.mjs';
import {beginP0NaturalConnection,walkP0NaturalConnection} from '../src/manual-biomes/forgotten-sands-natural-connection.mjs';
const free=()=>false;
function finish(j){let r;do{r=j.step();}while(r.accepted===null);return r;}
test('actual disjoint modular site exterior connections preserve every original gap cell',()=>{
  for(const spec of [{seed:179,x:392,z:0,axis:'x',size:15},{seed:2026,x:588,z:-1428,axis:'z',size:15}]){
    const w=new FourRegionWorld(spec.seed,fourRegionProfile(spec.seed,M7_ENVIRONMENT_GENERATOR)),before=JSON.stringify(w.save());
    const group=defineP0ModularSpan(spec),reports=group.modules.map(m=>finish(beginP0GroundSurvey(w,m,{reserved:free})));
    assert.ok(reports.every(r=>r.accepted));
    const all=reports.map(r=>[0,1,2,3].map(turn=>planP0OrientedApproach(w,r,turn,{reserved:free})).filter(a=>a.accepted));
    const excluded=(x,z)=>group.modules.some(m=>p0FootprintContains(m,x,z));
    const connections=[];
    for(let i=0;i<2;i++){
      const attempts=[];let found=null;
      const pairs=all[i].flatMap(a=>all[i+1].map(b=>[a,b])).sort((p,q)=>p[0].addedCells+p[1].addedCells-q[0].addedCells-q[1].addedCells);
      for(const [a,b] of pairs){
        const from={x:Math.floor(a.start.x),z:Math.floor(a.start.z)},to={x:Math.floor(b.start.x),z:Math.floor(b.start.z)};
        // Natural connector endpoints; no approach overlay or modified gaps.
        const r=finish(beginP0NaturalConnection(w,from,to,{reserved:free,excluded}));
        if(!r.accepted){attempts.push(r.reason);continue;}
        assert.equal(r.addedCells,0);assert.equal(r.placementAuthority,false);
        assert.ok(r.nodes.every(n=>!excluded(n.x,n.z)));
        const f=walkP0NaturalConnection(w,r.nodes),back=walkP0NaturalConnection(w,[...r.nodes].reverse());
        if(!f.ok||!back.ok){attempts.push({reason:f.reason??back.reason,firstFailure:!f.ok?f:back});continue;}
        found={turns:[a.turn,b.turn],nodes:r.nodes.length,forward:f.frames,back:back.frames,from,to};break;
      }
      connections.push({pair:[i,i+1],attempts,found});
    }
    assert.equal(JSON.stringify(w.save()),before);
    console.log('P0 NATURAL CONNECTION',JSON.stringify({seed:spec.seed,approaches:all.map(a=>a.map(x=>x.turn)),connections}));
  }
});
