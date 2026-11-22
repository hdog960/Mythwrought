import test from 'node:test';
import assert from 'node:assert/strict';
import {planCertifiedSkyOwner,stageCertifiedSkyFrame,publishCertifiedSkyFrame}
  from '../../src/floating-islands/sky-certified-owner.mjs';
import {depthMeshKey} from '../../src/depth.mjs';
import {skyIslandBodyRegions,verifySkyIslandFlightSpace}
  from '../../src/floating-islands/sky-runtime-adapter.mjs';
import {verifySkyCreativeFlightStep}
  from '../../src/floating-islands/sky-creative-bridge.mjs';
import {createG2FlightState,armG2Flight,selectG2FlightProfile}
  from '../../src/creative-integration/g2-flight.mjs';
import {createSkyPrefetchState} from '../../src/floating-islands/sky-creative-bridge.mjs';
import {planNativeG2SkyStep} from '../../src/floating-islands/sky-native-g2.mjs';

const position={x:0,feet:35.5,z:0};
const regions=skyIslandBodyRegions(position);
const candidates=regions.map(({cx,cz,section})=>({cx,cz,section}));
const wanted=Array.from({length:17},(_,i)=>depthMeshKey(i%5-2,Math.floor(i/5)-2,0));
function setup(over={}){
  let token='world-seed179',fingerprint='generator-authenticated-example',epoch=1;
  const revs=new Map(regions.map(r=>[r.key,0]));
  const chunks=new Map(wanted.map(k=>[k,{buffer:{old:k},count:36}]));
  let uploaded=0,changes=0,context='webgl2-original',failAt=0;
  const deleted=[];
  const gl={NO_ERROR:0,OUT_OF_MEMORY:1285,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    createBuffer(){return {serial:++uploaded};},bindBuffer(){},bufferData(){
      if(failAt===uploaded)throw Error('simulated upload failure');
    },getError(){return gl.NO_ERROR;},deleteBuffer:b=>deleted.push(b)};
  const source={readIdentity:()=>({worldToken:token,generatorFingerprint:fingerprint,epoch}),
    sectionRevision:k=>revs.get(k)};
  const identity=()=>({worldToken:token,rendererEpoch:11,nativeRevision:2,contextToken:context});
  function plan(more={}){
    return planCertifiedSkyOwner({source,position,nativeWanted:wanted,
      nativeChunks:chunks,skyCandidates:candidates,worldToken:token,
      rendererEpoch:11,nativeRevision:2,grant:{worldToken:token,
        rendererEpoch:11,nativeRevision:2,nativeWanted:[...wanted],skyBudgetApproved:true},...more});
  }
  const mesh=(cx,cz,section)=>{
    const key=`sky:${cx},${cz},${section}`;
    return {key,cx,cz,section,vertexCount:6,vertices:new Float32Array(54),
      sourceProof:{worldToken:token,generatorFingerprint:fingerprint,
        epoch,revision:revs.get(key)}};
  };
  function stage(p,more={}){
    return stageCertifiedSkyFrame({plan:p,source,gl,chunks,
      meshSection:mesh,readRendererIdentity:identity,contextToken:context,
      worldToken:token,rendererEpoch:11,nativeRevision:2,...more});
  }
  function publish(s,more={}){
    return publishCertifiedSkyFrame({stage:s,source,chunks,gl,
      readRendererIdentity:identity,...more});
  }
  return {source,gl,chunks,deleted,identity,plan,stage,publish,revs,
    get token(){return token},setToken:s=>{token=s},setEpoch:n=>{epoch=n},
    setFingerprint:s=>{fingerprint=s},setRevision:(k,n)=>revs.set(k,n),
    get uploaded(){return uploaded},setFailAt:n=>{failAt=n}};
}

test('first two source-backed sections publish with original upload and immutable identity stamps',()=>{
  const s=setup(),plan=s.plan();
  assert.equal(plan.skyJobs.length,2);
  assert.equal(plan.desiredKeys.length,19); // 17 ground plus only two real new sky uploads
  assert.equal(plan.canAdmitFlight,false);
  const frame=s.stage(plan);assert.equal(frame.status,'staged');
  assert.equal(s.chunks.size,17);
  const result=s.publish(frame);assert.equal(result.status,'published');
  assert.equal(s.chunks.size,19);
  for(const k of frame.stagedKeys){
    const buffer=s.chunks.get(k);
    assert.equal(buffer.skySource.worldToken,s.token);
    assert.equal(buffer.skySource.generatorFingerprint,'generator-authenticated-example');
    assert.equal(buffer.skySource.epoch,1);
    assert.equal(buffer.skySource.revision,0);
  }
});

test('eight true seam regions fill over four frames without ever displaying placeholder old keys',()=>{
  const s=setup();let completed=0;
  for(let pass=0;pass<4;pass++){
    const p=s.plan();assert.equal(p.skyJobs.length,2);assert.equal(p.sourceCurrent,true);
    assert.equal(p.desiredKeys.length,17+completed+2);
    const f=s.stage(p);assert.equal(s.publish(f).status,'published');completed+=2;
  }
  assert.equal(s.chunks.size,25);
  const p=s.plan();assert.equal(p.canAdmitFlight,true);
  assert.equal(p.skyJobs.length,0);assert.equal(p.desiredKeys.length,25);
  assert.ok(regions.every(r=>s.chunks.has(r.key)));
});

test('old world same-coordinates buffers never count as resident or remain in new draw list',()=>{
  const s=setup();const staleKey=regions[0].key;
  s.chunks.set(staleKey,{sky:true,buffer:{id:'previous world'},
    skySource:{worldToken:'world-seed2026',generatorFingerprint:'other',epoch:2,revision:0}});
  const p=s.plan();assert.equal(p.canAdmitFlight,false);
  assert.equal(p.sourceFilteredCount,1);assert.ok(p.skyJobs.some(j=>j.key===staleKey));
  const frame=s.stage(p);assert.equal(s.publish(frame).status,'published');
  assert.notEqual(s.chunks.get(staleKey).buffer.id,'previous world');
  assert.equal(s.deleted.filter(b=>b.id==='previous world').length,1);
});

test('stale optional sky buffer without current source metadata is evicted at safe frame publish',()=>{
  const s=setup();s.chunks.set('sky:4,3,9',{sky:true,buffer:{id:'forged visible'}});
  const p=s.plan();assert.ok(!p.desiredKeys.includes('sky:4,3,9'));
  const f=s.stage(p);assert.equal(s.publish(f).status,'published');
  assert.ok(!s.chunks.has('sky:4,3,9'));
  assert.ok(s.deleted.some(b=>b.id==='forged visible'));
});

test('source edit revises one section, invalidates only that GPU mesh and stages replacement',()=>{
  const s=setup();for(let i=0;i<4;i++)assert.equal(s.publish(s.stage(s.plan())).status,'published');
  const dirty=regions[5].key,healthy=regions[4].key,old=s.chunks.get(dirty).buffer;
  const other=s.chunks.get(healthy);
  s.setRevision(dirty,1);
  const p=s.plan();assert.equal(p.skyJobs.length,1);
  assert.equal(p.skyJobs[0].key,dirty);assert.equal(p.canAdmitFlight,false);
  assert.equal(p.desiredKeys.length,25); // dirty is replaced in its existing slot; 25 total
  const f=s.stage(p);assert.equal(s.publish(f).status,'published');
  assert.equal(s.chunks.get(dirty).skySource.revision,1);
  assert.equal(s.chunks.get(healthy),other);
  assert.ok(s.deleted.includes(old));
  assert.equal(s.plan().canAdmitFlight,true);
});

test('source revision changes during actual GPU upload, staged resources released and map remains intact',()=>{
  const s=setup(),p=s.plan(),before=[...s.chunks.entries()];let calls=0;
  const f=s.stage(p,{meshSection:(cx,cz,section)=>{
    if(++calls===2)s.setRevision(regions[0].key,1);
    const key=`sky:${cx},${cz},${section}`;
    return {key,cx,cz,section,vertexCount:6,vertices:new Float32Array(54),
      sourceProof:{worldToken:s.token,generatorFingerprint:'generator-authenticated-example',
        epoch:1,revision:s.revs.get(key)}};
  }});
  assert.equal(f.status,'stale');assert.equal(f.allocated,undefined);
  assert.deepEqual([...s.chunks.entries()],before);
  assert.equal(s.deleted.length,2);
});

test('source revision changes between stage and publish: original scene retained, staged freed',()=>{
  const s=setup(),f=s.stage(s.plan()),old=[...s.chunks.entries()];
  s.setRevision(regions[0].key,1);
  const r=s.publish(f);assert.equal(r.status,'stale');
  assert.deepEqual([...s.chunks.entries()],old);
  assert.equal(s.deleted.length,2);
});

test('generator epoch changes after staging: old world GPU map stays intact',()=>{
  const s=setup(),f=s.stage(s.plan()),old=[...s.chunks.entries()];
  s.setEpoch(2);
  assert.equal(s.publish(f).status,'stale');
  assert.deepEqual([...s.chunks.entries()],old);
});

test('sky source changes during GPU publication identity callback: native CAS rolls back old buffers',()=>{
  const s=setup(),f=s.stage(s.plan()),old=[...s.chunks.entries()];let reads=0;
  const r=s.publish(f,{readRendererIdentity:()=>{
    if(++reads===2)s.setRevision(regions[0].key,3);
    return s.identity();
  }});
  assert.equal(r.status,'stale');assert.deepEqual([...s.chunks.entries()],old);
  assert.equal(s.deleted.length,2);
});

test('lost WebGL context after upload avoids unsafe buffer disposal on source change',()=>{
  const s=setup(),p=s.plan();
  const frame=s.stage(p);s.setEpoch(3);
  const result=s.publish(frame,{readRendererIdentity:()=>({...s.identity(),contextToken:'lost'})});
  assert.equal(result.status,'stale');assert.equal(result.abandonedOnContextLoss,true);
  assert.equal(s.deleted.length,0);
});

test('missing authoritative section revision is refused rather than accepted from a key',()=>{
  const s=setup();s.revs.delete(regions[0].key);
  assert.throws(()=>s.plan(),/missing current physical sky section revision/);
});

test('physical body head cannot cross Y256 ceiling even if feet remain inside',()=>{
  assert.equal(verifySkyIslandFlightSpace({x:0,feet:255,z:0},
    {isSkySectionLoaded:()=>true,isBodyClear:()=>true}).ready,false);
  assert.equal(verifySkyCreativeFlightStep({x:0,y:255,z:0},{worldToken:'one',expectedWorldToken:'one',
    isBaseRegionReady:()=>true,isBaseBodyClear:()=>true,
    isSkyResident:()=>true,isSkyBodyClear:()=>true}).safe,false);
});

test('source-certified owner rejects head overflow and does not request GPU work',()=>{
  const s=setup();const p=s.plan({position:{x:0,feet:255,z:0}});
  assert.equal(p.readyForStage,false);assert.equal(p.skyJobs.length,0);
});

test('actual original G2 module refuses lateral motion with head outside upper source',()=>{
  const worldToken='world-seed179';const sourcePoint={x:0,y:255,z:0};
  const start=createG2FlightState({position:sourcePoint,
    heightBounds:{minFeet:-210,maxFeet:256},worldToken});
  const state=selectG2FlightProfile(armG2Flight(start,{
    enabled:true,isRegionReady:()=>true,isBodyClear:()=>true}),'travel');
  const r=planNativeG2SkyStep({g2State:state,intent:{dt:.05,strafe:1},
    skyPrefetchState:createSkyPrefetchState(worldToken),worldToken,
    readCurrentWorldToken:()=>worldToken,isBaseRegionReady:()=>true,
    isBaseBodyClear:()=>true,isSkyResident:()=>true,isSkyBodyClear:()=>true});
  assert.equal(r.approved,false);assert.equal(r.position.y,255);
});

test('native cave renderer retains 27-slot ownership below sky without source sky staging',()=>{
  const s=setup(),underground=Array.from({length:27},(_,i)=>depthMeshKey(i%3-1,Math.floor(i/3)%3-1,-1-Math.floor(i/9)));
  const p=s.plan({position:{x:0,feet:-10,z:0},nativeWanted:underground,
    nativeChunks:new Map(underground.map(k=>[k,{buffer:{key:k}}])),grant:null});
  assert.equal(p.mode,'native-depth-pass-through');assert.equal(p.desiredKeys.length,27);
});

test('unproven geometry cannot be mislabeled as freshly minted original source',()=>{
  const s=setup(),p=s.plan();
  assert.throws(()=>s.stage(p,{meshSection:(cx,cz,section)=>({
    key:`sky:${cx},${cz},${section}`,cx,cz,section,
    vertexCount:6,vertices:new Float32Array(54)})}),/lacks exact current/);
  assert.equal(s.chunks.size,17);assert.equal(s.uploaded,0);
});

test('a cached old-edit mesh proof is refused before original GPU uploads',()=>{
  const s=setup(),p=s.plan();
  const oldKey=p.skyJobs[0].key;
  assert.throws(()=>s.stage(p,{meshSection:(cx,cz,section)=>({
    key:`sky:${cx},${cz},${section}`,cx,cz,section,vertexCount:6,
    vertices:new Float32Array(54),sourceProof:{worldToken:s.token,
      generatorFingerprint:'generator-authenticated-example',epoch:1,
      revision:(oldKey===`sky:${cx},${cz},${section}`?-1:0)}})}),
    /lacks exact current/);
  assert.equal(s.uploaded,0);
});
