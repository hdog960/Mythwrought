// MYTHWROUGHT #291 — native ORIGINAL-source contract for an ISOLATED
// localhost-only integration experiment. Run in a real full repository
// checkout: node --test perf/issue-291/near-vao-original-main.test.mjs
// Never label these source tests as browser screenshot/performance acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const here=(p)=>new URL('../../'+p,import.meta.url);
const read=p=>readFileSync(here(p));
const source=read('src/main.mjs').toString('utf8');
const originalProtected={
  'src/gpu-recovery.mjs':'422ef73e383bda78ff94607abb858e3c8a57c2d1',
  'src/gpu-pipeline.mjs':'9620576c3edb4a7ef273956f8038c0792c1c6bb3',
  'src/manual-caves/c6-far-wall-gpu.mjs':'a27d9759fd00f8969aae3b8fca2016f4f50ac4ed',
  'src/depth.mjs':'b54b7fd8c422699a328b60135178f97508e277c8',
  'src/chunks.mjs':'e35a3fe7bdea34a8fad4eaa0c58aee4969aa86ad'
};
const gitBlob=buffer=>createHash('sha1').update(
  Buffer.from('blob '+buffer.length+'\0')).update(buffer).digest('hex');
const one=(needle)=>{const n=source.split(needle).length-1;
  assert.equal(n,1,'expected exactly one true-source anchor: '+needle.slice(0,64));};
const inOrder=(...pieces)=>{let p=-1;for(const piece of pieces){
  const i=source.indexOf(piece);assert.ok(i>p,'out of original order: '+piece.slice(0,70));
  p=i;
}};

test('exact isolated original-main integration blob, no unrelated modifications',()=>{
  assert.equal(gitBlob(read('src/main.mjs')),
    'f134d5cbd642789849587cff7f1486780a82d0bd');
});
test('the authentic modified complete src/main.mjs passes native Node module syntax',()=>{
  execFileSync(process.execPath,['--check',here('src/main.mjs').pathname],{stdio:'pipe'});
});
test('original C6 cave / GL error / GPU pipeline / depth / chunks modules untouched',()=>{
  for(const [p,expected] of Object.entries(originalProtected))
    assert.equal(gitBlob(read(p)),expected,p);
});
test('opt-in only on localhost and 127.0.0.1; public Pages always original control',()=>{
  one("const near291Enabled=['localhost','127.0.0.1'].includes(location.hostname)&&");
  one("new URLSearchParams(location.search).get('near-vao-291')==='1';");
  one('let near291=null;');
});
test('public Pages never imports the experimental module into its offline dependency graph',()=>{
  assert.equal(source.includes("import {createOpaqueNearLifecycle}"),false);
  one("import('../perf/issue-291/opaque-near-lifecycle.mjs')");
  inOrder('function armNear291(){',
    "import('../perf/issue-291/opaque-near-lifecycle.mjs')",
    'if(graphicsLost||document.hidden)',
    'near291=createOpaqueNearLifecycle({gl,');
});
test('the exact original near opaque draw loop survives as the A/B control',()=>{
  const start=source.indexOf('if(near291)near291.render(chunks.values());');
  const end=source.indexOf('canvas.dataset.c6FarDrawn=',start);
  assert.ok(start>=0&&end>start);
  const near=source.slice(start,end);
  assert.ok(near.includes('else for(const c of chunks.values()){\n        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);'));
  for(const line of [
    'gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);',
    'gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);',
    'gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);',
    'gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);'
  ])assert.equal(near.split(line).length-1,1);
  assert.equal(near.split('gl.drawArrays(gl.TRIANGLES,0,c.count);').length-1,1);
  one('if(near291)near291.render(chunks.values());');
});
test('original near-buffer ownership and water retirement never displaced',()=>{
  inOrder('function originalDeleteChunkBuffers(chunk){',
    'gl.deleteBuffer(chunk.buffer);','if(chunk.waterBuffer)gl.deleteBuffer(chunk.waterBuffer);',
    'function deleteChunkBuffers(chunk){',
    'return near291?near291.deleteChunkBuffers(chunk):originalDeleteChunkBuffers(chunk);');
  one('return near291?near291.deleteChunkBuffers(chunk):originalDeleteChunkBuffers(chunk);');
});
test('single authoritative original deleteChunkBuffers hook covers every existing callsite',()=>{
  assert.equal((source.match(/function deleteChunkBuffers\(chunk\)/g)||[]).length,1);
  // One extra definition + one experiment invocation, original source's
  // edit/stream/world/import physical callsites are left in place.
  assert.ok((source.match(/\bdeleteChunkBuffers\(/g)||[]).length>=14);
});
test('candidate initialized only after original frame driver exists',()=>{
  inOrder('const frameDriver=new ForegroundFrameDriver(',
    'function armNear291(){','near291=createOpaqueNearLifecycle({gl,',
    'originalDeleteChunkBuffers,stopRenderLoop:reason=>{',
    'frameDriver.pause();');
});
test('native graphics context lost is forwarded without deletion',()=>{
  inOrder("canvas.addEventListener('webglcontextlost',",
    'graphicsLost=true;graphicsLossCount++;',
    'near291?.contextLost(); // no invalid GL deletion',
    'caveFarGpu?.resetForLostContext();');
});
test('restored shader program and attributes precede near cache and mob recovery',()=>{
  const start=source.indexOf("canvas.addEventListener('webglcontextrestored',");
  assert.ok(start>=0);
  const end=source.indexOf("window.addEventListener('pagehide',",start);
  assert.ok(end>start);
  const restoreHandler=source.slice(start,end);
  const pieces=['initializeGpuPipeline();',
    'near291?.contextRestored({atPos,atColor,atUv,atMat},program);',
    'restartMobRenderer();'];
  const offsets=pieces.map(x=>restoreHandler.indexOf(x));
  assert.ok(offsets.every((v,i)=>v>=0&&(i===0||v>offsets[i-1])));
});
test('original terrain draw order remains before C6/water/other passes',()=>{
  inOrder('if(near291)near291.render(chunks.values());',
    'canvas.dataset.c6FarDrawn=String(caveFarGpu?.draw(',
    'const waterChunks=[...chunks.values()].filter(c=>c.waterBuffer);');
});
test('NO original WebGL error check site added or removed',()=>{
  assert.equal((source.match(/\bgl\.getError\s*\(/g)||[]).length,1);
  assert.equal(source.includes('gl.getError()'),true);
});
test('local-only original test interface reports bounded experiment status',()=>{
  inOrder("if(['localhost','127.0.0.1'].includes(location.hostname)){",
    'window.__mythwroughtTest=Object.freeze({',
    'nearOpaque291(){return near291?.status()??null;}');
});
test('original source save, mine and mandatory GPU upload remain unchanged',()=>{
  one('const result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,{rotation:selectedRotation});');
  one("const persisted=save();\n    const label=BLOCK_NAMES[result.block]||'block';");
  one('buffer=uploadChunkBuffer(gl,vertices);');
});

test('all FIVE original frameDriver.resume sites share the fatal/pagehide gate',()=>{
  const lines=source.split('\n');
  const hits=lines.flatMap((line,index)=>line.includes('frameDriver.resume()')?[index]:[]);
  assert.equal(hits.length,5);
  for(const index of hits){
    const preceding=lines.slice(Math.max(0,index-4),index+1).join('\n');
    assert.ok(preceding.includes('near291CanResume()'),'unguarded resume at '+(index+1));
  }
  one("const near291CanResume=()=>!near291PageSuspended&&!near291Fatal&&");
  one("(!near291Enabled||near291?.status().phase==='ready');");
});
test('pagehide cancels old dynamic imports and retires VAOs before the unchanged save path',()=>{
  const start=source.indexOf("window.addEventListener('pagehide',");
  const end=source.indexOf("window.addEventListener('pageshow',",start);
  assert.ok(start>=0&&end>start);
  const body=source.slice(start,end);
  const steps=['near291PageSuspended=true;','near291LoadEpoch++;',
    'near291Pending=false;','frameDriver.pause();','near291.dispose();',
    'if(changed&&!storageReadOnly)save();'];
  let previous=-1;
  for(const part of steps){
    const at=body.indexOf(part);
    assert.ok(at>previous, 'bad pagehide lifecycle order: '+part);
    previous=at;
  }
});
test('BFCache pageshow cannot revive a fatal VAO and can rearm only valid localhost sessions',()=>{
  const start=source.indexOf("window.addEventListener('pageshow',");
  const end=source.indexOf("if(['localhost','127.0.0.1'].includes(location.hostname))",start);
  assert.ok(start>=0&&end>start);
  const body=source.slice(start,end);
  assert.ok(body.includes('near291PageSuspended=false;'));
  assert.ok(body.includes('if(!document.hidden&&!graphicsLost){'));
  assert.ok(body.includes('if(near291CanResume()){'));
  assert.ok(body.includes('armNear291();'));
  assert.ok(body.includes('frameDriver.resume();'));
});
test('active async initialization failures latch fatal and cannot be undone by stale import',()=>{
  one('const epoch=++near291LoadEpoch;');
  one('if(epoch!==near291LoadEpoch||near291PageSuspended||near291Fatal)return;');
  one('if(epoch!==near291LoadEpoch||near291PageSuspended)return;');
  assert.ok(source.includes('near291Pending=false;'));
  assert.ok(source.includes('near291Fatal=true;\n        frameDriver.pause();'));
  assert.ok(source.includes('if(epoch===near291LoadEpoch)near291Pending=false;'));
});

test('native original async arming does not admit a baseline frame as local opt-in',()=>{
  inOrder('const frameDriver=new ForegroundFrameDriver(',
    'function armNear291(){',
    "import('../perf/issue-291/opaque-near-lifecycle.mjs')",
    'near291=createOpaqueNearLifecycle({gl,',
    '// Only this certified-ready async completion may wake',
    'if(!document.hidden&&!graphicsLost&&near291CanResume()){',
    'lastFrame=performance.now();',
    'frameDriver.resume();');
  const start=source.indexOf("import('../perf/issue-291/opaque-near-lifecycle.mjs')");
  const end=source.indexOf('.catch(error=>',start);
  assert.ok(start>=0&&end>start);
  const region=source.slice(start,end);
  assert.equal((region.match(/frameDriver\.resume\(\)/g)||[]).length,1);
});

test('the EXACT original-source resume gate executes correctly for all lifecycle states',()=>{
  const match=source.match(/const near291CanResume=\(\)=>[^\n]*\n\s*\([^\n]*\);/);
  assert.ok(match,'original local gate could not be extracted');
  const gate=new Function('near291PageSuspended','near291Fatal',
    'near291Enabled','near291',match[0]+'\nreturn near291CanResume();');
  const ready={status:()=>({phase:'ready'})};
  const lost={status:()=>({phase:'lost'})};
  const blocked={status:()=>({phase:'blocked'})};
  for(const [name,args,expect] of [
    ['public startup',[false,false,false,null],true],
    ['local import pending',[false,false,true,null],false],
    ['local ready',[false,false,true,ready],true],
    ['local lost',[false,false,true,lost],false],
    ['local blocked',[false,false,true,blocked],false],
    ['local page suspended',[true,false,true,ready],false],
    ['local fatal latch',[false,true,true,ready],false],
    ['public pagehide',[true,false,false,null],false],
    ['public pageshow',[false,false,false,null],true]
  ])assert.equal(gate(...args),expect,name);
});

test('startup hidden tab defers local VAO module before referencing graphicsLost',()=>{
  const start=source.indexOf('function armNear291(){');
  const end=source.indexOf('  armNear291();',start);
  assert.ok(start>=0&&end>start);
  const arm=source.slice(start,end);
  assert.ok(arm.includes('near291PageSuspended||near291Fatal||document.hidden)return;'));
  assert.ok(arm.indexOf('document.hidden)return;')<arm.indexOf('const epoch=++near291LoadEpoch;'));
  assert.ok(arm.indexOf('const epoch=++near291LoadEpoch;')<
    arm.indexOf("import('../perf/issue-291/opaque-near-lifecycle.mjs')"));
});

test('normal hidden or lost-context async import is deferred, not a fatal fault',()=>{
  const start=source.indexOf("import('../perf/issue-291/opaque-near-lifecycle.mjs')");
  const end=source.indexOf('.catch(error=>',start);
  assert.ok(start>=0&&end>start);
  const region=source.slice(start,end);
  assert.ok(region.includes('if(graphicsLost||document.hidden)return;'));
  assert.ok(!region.includes('Graphics suspended before local VAO experiment armed'));
  assert.ok(region.indexOf('if(graphicsLost||document.hidden)return;')<
    region.indexOf('near291=createOpaqueNearLifecycle({gl,'));
  const finallyStart=source.indexOf('.finally(()=>{',end);
  assert.ok(finallyStart>end);
  assert.ok(source.slice(finallyStart,finallyStart+110).includes('near291Pending=false;'));
});

test('visibility/context restoration and BFCache can rearm before readiness, never resume before readiness',()=>{
  const visibility=source.slice(source.indexOf("document.addEventListener('visibilitychange',"),
    source.indexOf("const lookModeSelect=",source.indexOf("document.addEventListener('visibilitychange',")));
  const contextRestored=source.slice(source.indexOf("canvas.addEventListener('webglcontextrestored',"),
    source.indexOf("window.addEventListener('pagehide',"));
  const pageshow=source.slice(source.indexOf("window.addEventListener('pageshow',"),
    source.indexOf("if(['localhost','127.0.0.1'].includes(location.hostname))",source.indexOf("window.addEventListener('pageshow',")));
  for(const [name,region] of [['visibility',visibility],['contextRestored',contextRestored],['pageshow',pageshow]]){
    const arm=region.lastIndexOf('armNear291();');
    const gate=region.lastIndexOf('near291CanResume()');
    const resume=region.lastIndexOf('frameDriver.resume()');
    assert.ok(arm>=0&&gate>arm&&resume>gate,name+' must rearm, check readiness, then resume');
  }
  assert.ok(visibility.includes('}else if(!graphicsLost){'));
  assert.ok(contextRestored.includes('graphicsLost=false;graphicsRestoreCount++;'));
  assert.ok(pageshow.includes('near291PageSuspended=false;'));
});

test('fatal local VAO is stopped BEFORE every original edit-side effect',()=>{
  const start=source.indexOf('  function edit(mode){');
  const end=source.indexOf("    if(mode==='mine'&&mobRenderer",start);
  assert.ok(start>=0&&end>start);
  const prologue=source.slice(start,end);
  const fence=prologue.indexOf('if(near291Enabled&&near291Fatal){');
  const oldEditGate=prologue.indexOf('if(!help.hidden||exploration.isOpen()');
  assert.ok(fence>=0&&fence<oldEditGate);
  assert.ok(prologue.includes("message('Local VAO 291 graphics stopped; edits blocked until reload');return;"));
  inOrder('if(near291Enabled&&near291Fatal){',
    "if(mode==='mine'&&mobRenderer&&!mobRuntimeError)",
    "if(pack5Mode&&pack5Builder){",
    'const result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,');
});

test('a queued frame cannot advance player time after local fatal GPU loss',()=>{
  const start=source.indexOf('  function draw(now){');
  const end=source.indexOf('    const dt=Math.min(.035,Math.max(0,(now-lastFrame)/1000));',start);
  assert.ok(start>=0&&end>start);
  const entry=source.slice(start,end);
  assert.ok(entry.includes('if(near291Enabled&&near291Fatal)return;'));
  const originalFence=entry.slice(entry.indexOf('if(near291Enabled&&near291Fatal)return;')).trim();
  const fn=new Function('near291Enabled','near291Fatal',originalFence+"\nreturn 'continue';");
  assert.equal(fn(true,true),undefined);
  assert.equal(fn(true,false),'continue');
  assert.equal(fn(false,true),'continue');
});

test('fatal stream retirement aborts IN-FLIGHT frame before original mobs/C6/water',()=>{
  const begin=source.indexOf('      stream();\n',source.indexOf('  function draw(now){'));
  const end=source.indexOf('      if(help.hidden&&!exploration.isOpen()&&mobSession',begin);
  assert.ok(begin>=0&&end>begin);
  const snippet=source.slice(begin,end);
  assert.ok(snippet.includes('if(near291Enabled&&near291Fatal)return;'));
  assert.ok(snippet.indexOf('stream();')<snippet.indexOf('if(near291Enabled&&near291Fatal)return;'));
  assert.ok(snippet.indexOf('if(near291Enabled&&near291Fatal)return;')<
    snippet.indexOf('mobEnvironment=atmosphere;'));
  const run=new Function('enabled','fatalFromStream',`
    let near291Enabled=enabled,near291Fatal=false,mobEnvironment=null;
    const atmosphere={marker:'original-atmosphere'};
    const stream=()=>{near291Fatal=fatalFromStream;};
    `+snippet+`
    return mobEnvironment?.marker??null;
  `);
  assert.equal(run(true,true),undefined,'local native retirement fatal must abort this frame');
  assert.equal(run(true,false),'original-atmosphere','healthy local rendering still proceeds');
  assert.equal(run(false,true),'original-atmosphere','public control unchanged by opt-in fence');
});


// Exact ORIGINAL source execution of refreshEditedMeshes, not a copied
// alternative renderer/transaction model. Full checkout native Node tests
// remain necessary; controlled collaborators here inject failure boundaries.
const nearPublishStart=source.indexOf('  function refreshEditedMeshes(');
const nearPublishEnd=source.indexOf('\n  function refreshPhysicalChunk',nearPublishStart);
assert.ok(nearPublishStart>=0&&nearPublishEnd>nearPublishStart);
const exactNearPublish=source.slice(nearPublishStart,nearPublishEnd);
const makeExactNearPublisher=new Function('scope',
  'with(scope){\n'+exactNearPublish+'\nreturn refreshEditedMeshes;}');
function originalNearPublishCase({
  enabled=true,loaded=true,failUpload=false,failRetire=false,failFar=false,
  needFar=true,failPause=false,failAlert=false
}={}){
  const old={buffer:{id:'original-old'},count:3};
  const next={buffer:{id:'original-new'},count:3,waterBuffer:null,waterCount:0};
  const chunks=new Map(loaded?[['0,0,0',old]]:[]);
  const calls=[],reason='291_ORIGINAL_PUBLISH_FAULT';
  const scope={
    near291Enabled:enabled,near291Fatal:false,chunks,
    verticalEditSections:()=>[0],editAffectedChunks:()=>[{cx:0,cz:0}],
    depthMeshKey:()=> '0,0,0',
    meshPlayableChunk:()=>new Float32Array(9),
    meshPlayableWater:()=>new Float32Array(0),
    uploadPack2Chunk:()=>{calls.push('upload');
      if(failUpload)throw Error(reason);return next;},
    deleteChunkBuffers:()=>{calls.push('retire');
      if(failRetire)throw Error(reason);},
    caveSession:null,combinedWorld:()=>needFar,
    caveFarGpu:{invalidate:()=>{calls.push('far');
      if(failFar)throw Error(reason);}},
    editMeshBatches:0,lastEditMeshKeys:[],
    frameDriver:{pause:()=>{calls.push('pause');if(failPause)throw Error('pause callback failed');}},
    fatal:()=>{calls.push('fatal');if(failAlert)throw Error('fatal UI failed');}
  };
  let error=null;
  try{makeExactNearPublisher(scope)(0,0,0);}
  catch(caught){error=caught;}
  return {scope,old,next,calls,error,reason};
}

test('exact original near+far success publishes once with no fatal latch',()=>{
  const x=originalNearPublishCase();
  assert.equal(x.error,null);
  assert.equal(x.scope.near291Fatal,false);
  assert.equal(x.scope.chunks.get('0,0,0').buffer.id,'original-new');
  assert.deepEqual(x.calls,['upload','retire','far']);
});
test('staged upload error before near publication retains old GPU mapping',()=>{
  const x=originalNearPublishCase({failUpload:true});
  assert.equal(x.error?.message,x.reason);
  assert.equal(x.scope.near291Fatal,false);
  assert.equal(x.scope.chunks.get('0,0,0').buffer.id,'original-old');
  assert.deepEqual(x.calls,['upload']);
});
test('native old-buffer retirement failure after publication latches fatal',()=>{
  const x=originalNearPublishCase({failRetire:true});
  assert.equal(x.error?.message,x.reason);
  assert.equal(x.scope.near291Fatal,true);
  assert.equal(x.scope.chunks.get('0,0,0').buffer.id,'original-new');
  assert.deepEqual(x.calls,['upload','retire','pause','fatal']);
});
test('near+far invalidation exception cannot silently resume after voxel rollback',()=>{
  const x=originalNearPublishCase({failFar:true});
  assert.equal(x.error?.message,x.reason);
  assert.equal(x.scope.near291Fatal,true);
  assert.deepEqual(x.calls,['upload','retire','far','pause','fatal']);
});
test('far-only invalidation exception without a loaded near chunk still latches fatal',()=>{
  const x=originalNearPublishCase({loaded:false,failFar:true});
  assert.equal(x.error?.message,x.reason);
  assert.equal(x.scope.near291Fatal,true);
  assert.deepEqual(x.calls,['far','pause','fatal']);
});
test('broken stop/UI callbacks never mask the original native retirement error',()=>{
  const x=originalNearPublishCase({failRetire:true,failPause:true,failAlert:true});
  assert.equal(x.error?.message,x.reason);
  assert.equal(x.scope.near291Fatal,true);
  assert.deepEqual(x.calls,['upload','retire','pause','fatal']);
});
test('unchanged public path rethrows original native fault without a local-only latch',()=>{
  for(const opts of [{failRetire:true},{failFar:true}]){
    const x=originalNearPublishCase({...opts,enabled:false});
    assert.equal(x.error?.message,x.reason);
    assert.equal(x.scope.near291Fatal,false);
    assert.ok(!x.calls.includes('pause'));
    assert.ok(!x.calls.includes('fatal'));
  }
});
