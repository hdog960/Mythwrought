// MYTHWROUGHT #291 — native ORIGINAL-source contract for an ISOLATED
// localhost-only integration experiment. Run in a real full repository
// checkout: node --test perf/issue-291/near-vao-original-main.test.mjs
// Never label these source tests as browser screenshot/performance acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {uploadChunkBuffer as sourceUploadChunkBuffer,
  validateChunkUploadBytes as sourceValidateChunkUploadBytes,
  GpuUploadRetry as SourceGpuUploadRetry,
  MAX_CHUNK_UPLOAD_BYTES as SOURCE_MAX_CHUNK_UPLOAD_BYTES} from '../../src/gpu-recovery.mjs';

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
    '90217a8133e0533af0e5facef8ebf62c9e91691a');
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
  one('result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,{rotation:selectedRotation});');
  one("const persisted=save();");
  one("const label=BLOCK_NAMES[result.block]||'block';");
  const actualMine=source.slice(source.indexOf("const near291MineStart=near291Perf&&mode==='mine'"),
    source.indexOf("  let lastStreamingCenter=",source.indexOf("const near291MineStart=near291Perf&&mode==='mine'")));
  const a=actualMine.indexOf('const persisted=save();');
  const b=actualMine.indexOf('near291RecordMine(performance.now()-near291MineStart,result,firstEditUploads);');
  const c=actualMine.indexOf("const label=BLOCK_NAMES[result.block]||'block';");
  assert.ok(a>=0&&b>a&&c>b);
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
    'result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,');
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


// Real original refreshEditedMeshes() source, injected multi-chunk GPU handles.
// The upload fails on the 3rd candidate, AFTER two complete opaque+water
// native allocations and BEFORE chunks.set() or C6 far-cache invalidation.
function originalMultiStagedCleanupCase({
  enabled=true,uploadFailureAt=3,failedNativeDeletes=[],failedBridgeIndex=0,
  failPause=false,failFatal=false,sections=[0]
}={}){
  const chunks=new Map(sections.flatMap(section=>[0,1,2].map(i=>[
    i+',0,'+section,{buffer:{id:'resident-'+i+'-'+section},count:3}
  ])));
  const originalResidents=[...chunks.values()].map(c=>c.buffer);
  const events=[],initialError=new Error('291_ORIGINAL_THIRD_GPU_UPLOAD_FAILURE');
  let uploadN=0,bridgeN=0;
  const scope={
    chunks,near291Enabled:enabled,near291Fatal:false,
    verticalEditSections:()=>sections,
    editAffectedChunks:()=>[0,1,2].map(cx=>({cx,cz:0})),
    depthMeshKey:(cx,cz,section)=>cx+','+cz+','+section,
    meshPlayableChunk:()=>new Float32Array(9),
    meshPlayableWater:()=>new Float32Array(9),
    uploadPack2Chunk:()=>{
      uploadN++;
      events.push('upload-'+uploadN);
      if(uploadN===uploadFailureAt)throw initialError;
      return {buffer:{id:'staged-'+uploadN+'-opaque'},count:3,
        waterBuffer:{id:'staged-'+uploadN+'-water'},waterCount:3};
    },
    originalDeleteChunkBuffers:({buffer})=>{
      events.push('native-'+buffer.id);
      if(failedNativeDeletes.includes(buffer.id))
        throw Error('291_NATIVE_DELETE_'+buffer.id);
    },
    deleteChunkBuffers:item=>{
      bridgeN++;
      events.push('bridge-'+item.buffer.id);
      if(bridgeN===failedBridgeIndex)throw Error('291_LEGACY_BRIDGE_CLEANUP_FAILURE');
    },
    caveSession:null,combinedWorld:()=>true,
    caveFarGpu:{invalidate:()=>{events.push('far-invalidate');}},
    editMeshBatches:0,lastEditMeshKeys:[],
    frameDriver:{pause:()=>{events.push('pause');if(failPause)throw Error('291_STOP_FAULT');}},
    fatal:()=>{events.push('fatal');if(failFatal)throw Error('291_UI_FAULT');}
  };
  let thrown=null;
  try{makeExactNearPublisher(scope)(0,0,0);}
  catch(error){thrown=error;}
  return {scope,events,initialError,thrown,originalResidents};
}

test('third original upload fault exhausts ALL four uncommitted native opaque/water deletes',()=>{
  const x=originalMultiStagedCleanupCase();
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events,[
    'upload-1','upload-2','upload-3',
    'native-staged-1-opaque','native-staged-1-water',
    'native-staged-2-opaque','native-staged-2-water'
  ]);
  assert.equal(x.scope.near291Fatal,false);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});
test('first opaque deletion fault still attempts its water buffer and every remaining handle',()=>{
  const x=originalMultiStagedCleanupCase({failedNativeDeletes:['staged-1-opaque']});
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events.slice(3,7),[
    'native-staged-1-opaque','native-staged-1-water',
    'native-staged-2-opaque','native-staged-2-water'
  ]);
  assert.deepEqual(x.events.slice(7),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});
test('transparent-water staged deletion failure cannot skip following chunks',()=>{
  const x=originalMultiStagedCleanupCase({failedNativeDeletes:['staged-1-water']});
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events.slice(3,7),[
    'native-staged-1-opaque','native-staged-1-water',
    'native-staged-2-opaque','native-staged-2-water'
  ]);
  assert.equal(x.scope.near291Fatal,true);
});
test('multiple failed staged GPU deletes still preserve originating upload error',()=>{
  const x=originalMultiStagedCleanupCase({
    failedNativeDeletes:['staged-1-opaque','staged-1-water','staged-2-water']
  });
  assert.equal(x.thrown,x.initialError);
  assert.equal(x.events.filter(e=>e.startsWith('native-')).length,4);
  assert.deepEqual(x.events.slice(-2),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
});
test('broken fatal/UI callbacks cannot mask original staged upload exception',()=>{
  const x=originalMultiStagedCleanupCase({
    failedNativeDeletes:['staged-1-opaque'],failPause:true,failFatal:true
  });
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events.slice(-2),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
});
test('first upload failure has zero completed handles and does not invent a fatal cleanup',()=>{
  const x=originalMultiStagedCleanupCase({uploadFailureAt:1});
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events,['upload-1']);
  assert.equal(x.scope.near291Fatal,false);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});
test('public control preserves its original non-exhaustive error behavior unchanged',()=>{
  const x=originalMultiStagedCleanupCase({
    enabled:false,failedBridgeIndex:1
  });
  assert.equal(x.thrown?.message,'291_LEGACY_BRIDGE_CLEANUP_FAILURE');
  assert.deepEqual(x.events,['upload-1','upload-2','upload-3',
    'bridge-staged-1-opaque']);
  assert.equal(x.scope.near291Fatal,false);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});
test('healthy public cleanup still uses original authoritative bridge without local flags',()=>{
  const x=originalMultiStagedCleanupCase({enabled:false});
  assert.equal(x.thrown,x.initialError);
  assert.deepEqual(x.events,['upload-1','upload-2','upload-3',
    'bridge-staged-1-opaque','bridge-staged-2-opaque']);
  assert.equal(x.scope.near291Fatal,false);
});
test('staged cleanup never invokes VAO ownership bridge and never invalidates C6 far cache',()=>{
  const x=originalMultiStagedCleanupCase();
  assert.ok(x.events.every(e=>!e.startsWith('bridge-')));
  assert.ok(!x.events.includes('far-invalidate'));
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});

test('deep vertical boundary staging drains ten opaque/water handles after sixth upload fails',()=>{
  const x=originalMultiStagedCleanupCase({sections:[-1,0],uploadFailureAt:6});
  assert.equal(x.thrown,x.initialError);
  assert.equal(x.events.filter(e=>e.startsWith('upload-')).length,6);
  assert.deepEqual(x.events.slice(6),[1,2,3,4,5].flatMap(i=>[
    'native-staged-'+i+'-opaque','native-staged-'+i+'-water'
  ]));
  assert.equal(x.scope.near291Fatal,false);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
  assert.ok(!x.events.includes('far-invalidate'));
});
test('deep seam cleanup retries all ten handles after early and late native failures',()=>{
  const x=originalMultiStagedCleanupCase({sections:[-1,0],uploadFailureAt:6,
    failedNativeDeletes:['staged-1-opaque','staged-5-water']});
  assert.equal(x.thrown,x.initialError);
  assert.equal(x.events.filter(e=>e.startsWith('native-')).length,10);
  assert.deepEqual(x.events.slice(-2),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
  assert.deepEqual([...x.scope.chunks.values()].map(c=>c.buffer),x.originalResidents);
});


// ORIGINAL src/main.mjs two-buffer upload transaction, not a duplicate
// implementation. These tests execute its exact extracted function body with
// controlled upload and WebGL deletion failures. They are NOT true GPU tests.
const internalUploadStart=source.indexOf('  function uploadPack2Chunk(vertices,water){');
const internalUploadEnd=source.indexOf('\n  let editMeshBatches=0;',internalUploadStart);
assert.ok(internalUploadStart>=0&&internalUploadEnd>internalUploadStart);
const originalInternalUploadFunction=new Function('scope',
  'with(scope){\n'+source.slice(internalUploadStart,internalUploadEnd)+
  '\nreturn uploadPack2Chunk;}');
function originalInternalUploadCase({
  enabled=true,failAt=0,failNativeDeletes=[],failPause=false,
  failFatal=false,throwAfterWaterAllocation=false
}={}){
  const events=[],initiatingError=new Error('291_ORIGINAL_INTERNAL_UPLOAD_ERROR');
  let uploaded=0,waterReads=0;
  const water=throwAfterWaterAllocation?{
    get length(){
      waterReads++;
      if(waterReads>1)throw initiatingError;
      return 9;
    }
  }:{length:9};
  const scope={
    near291Enabled:enabled,near291Fatal:false,
    near291Perf:null,near291RecordUploadFailure:()=>{},
    gl:{deleteBuffer:buffer=>{
      events.push('delete-'+buffer.id);
      if(failNativeDeletes.includes(buffer.id))
        throw Error('291_NATIVE_DELETE_FAILED_'+buffer.id);
    }},
    uploadChunkBuffer:()=>{
      uploaded++;
      events.push('upload-'+uploaded);
      if(uploaded===failAt)throw initiatingError;
      return {id:'staged-'+uploaded};
    },
    frameDriver:{pause:()=>{
      events.push('pause');
      if(failPause)throw Error('PAUSE_FAILED');
    }},
    fatal:()=>{
      events.push('fatal');
      if(failFatal)throw Error('FATAL_UI_FAILED');
    }
  };
  let result=null,error=null;
  try{result=originalInternalUploadFunction(scope)(new Float32Array(9),water);}
  catch(caught){error=caught;}
  return {scope,events,initiatingError,result,error};
}

test('exact original two-buffer upload success keeps local GPU cleanup untouched',()=>{
  const x=originalInternalUploadCase();
  assert.equal(x.error,null);
  assert.equal(x.result.buffer.id,'staged-1');
  assert.equal(x.result.waterBuffer.id,'staged-2');
  assert.deepEqual(x.events,['upload-1','upload-2']);
  assert.equal(x.scope.near291Fatal,false);
});
test('first opaque allocation failure has no completed handle to delete',()=>{
  const x=originalInternalUploadCase({failAt:1});
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events,['upload-1']);
  assert.equal(x.scope.near291Fatal,false);
});
test('second water allocation failure deletes staged opaque, retains original cause',()=>{
  const x=originalInternalUploadCase({failAt:2});
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events,['upload-1','upload-2','delete-staged-1']);
  assert.equal(x.scope.near291Fatal,false);
});
test('failed native delete on second upload failure preserves cause and stops experiment',()=>{
  const x=originalInternalUploadCase({failAt:2,failNativeDeletes:['staged-1']});
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events,['upload-1','upload-2','delete-staged-1','pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
});
test('failed pause and fatal UI cannot mask initial original GPU upload exception',()=>{
  const x=originalInternalUploadCase({
    failAt:2,failNativeDeletes:['staged-1'],failPause:true,failFatal:true
  });
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events.slice(-2),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
});
test('both temporary opaque+water handles independently retire after later failure',()=>{
  const x=originalInternalUploadCase({throwAfterWaterAllocation:true});
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events.filter(v=>v.startsWith('delete-')),
    ['delete-staged-1','delete-staged-2']);
  assert.equal(x.scope.near291Fatal,false);
});
test('first deletion exception does not skip second staged water-buffer retirement',()=>{
  const x=originalInternalUploadCase({
    throwAfterWaterAllocation:true,failNativeDeletes:['staged-1']
  });
  assert.equal(x.error,x.initiatingError);
  assert.deepEqual(x.events.filter(v=>v.startsWith('delete-')),
    ['delete-staged-1','delete-staged-2']);
  assert.deepEqual(x.events.slice(-2),['pause','fatal']);
  assert.equal(x.scope.near291Fatal,true);
});
test('public original two-buffer cleanup exception behavior remains byte-for-byte',()=>{
  const x=originalInternalUploadCase({
    enabled:false,failAt:2,failNativeDeletes:['staged-1']
  });
  assert.equal(x.error.message,'291_NATIVE_DELETE_FAILED_staged-1');
  assert.deepEqual(x.events,['upload-1','upload-2','delete-staged-1']);
  assert.equal(x.scope.near291Fatal,false);
});


// Authenticate and EXECUTE the untouched original production GPU upload
// module in Node, using controlled WebGL collaborators. A test cannot claim
// a real WebGL context, but this is the real original uploader implementation
// imported normally by the native Node ESM loader (NOT an extracted copy).
function originalUploaderGl({preErrors=[],postError=0,failData=false,failDelete=false}={}){
  const calls=[];let n=0;
  const gl={
    NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,OUT_OF_MEMORY:1285,
    createBuffer(){calls.push('create');return {id:'native-original-new'};},
    getError(){calls.push('getError');n++;
      return n<=preErrors.length?preErrors[n-1]:postError;},
    bindBuffer(_target,b){calls.push('bind:'+b.id);},
    bufferData(){calls.push('bufferData');if(failData)throw Error('ORIGINAL_BUFFERDATA_FAULT');},
    deleteBuffer(b){calls.push('delete:'+b.id);
      if(failDelete)throw Error('ORIGINAL_NATIVE_DELETE_FAULT');}
  };
  return {gl,calls};
}
test('actual imported unchanged native GPU uploader and original blob verified',()=>{
  assert.equal(gitBlob(read('src/gpu-recovery.mjs')),
    '422ef73e383bda78ff94607abb858e3c8a57c2d1');
  const x=originalUploaderGl({preErrors:[0]});
  const b=sourceUploadChunkBuffer(x.gl,new Float32Array(9));
  assert.equal(b.id,'native-original-new');
  assert.deepEqual(x.calls,['create','getError','bind:native-original-new',
    'bufferData','getError']);
});
test('actual original native GPU uploader drains one stale WebGL error before upload',()=>{
  const x=originalUploaderGl({preErrors:[1285,0]});
  const b=sourceUploadChunkBuffer(x.gl,new Float32Array(9));
  assert.equal(b.id,'native-original-new');
  assert.equal(x.calls.filter(c=>c==='getError').length,3);
});
test('actual original native upload GL OOM deletes its temporary buffer',()=>{
  const x=originalUploaderGl({preErrors:[0],postError:1285});
  assert.throws(()=>sourceUploadChunkBuffer(x.gl,new Float32Array(9)),
    /WebGL buffer upload error 1285/);
  assert.deepEqual(x.calls.slice(-2),['getError','delete:native-original-new']);
});
test('actual original native bufferData JS exception deletes temporary GPU buffer',()=>{
  const x=originalUploaderGl({preErrors:[0],failData:true});
  assert.throws(()=>sourceUploadChunkBuffer(x.gl,new Float32Array(9)),
    /ORIGINAL_BUFFERDATA_FAULT/);
  assert.deepEqual(x.calls.slice(-2),
    ['bufferData','delete:native-original-new']);
});
test('document exact original native uploader cleanup-error masking UNFIXED',()=>{
  const x=originalUploaderGl({preErrors:[0],failData:true,failDelete:true});
  // This expected original behavior is the remaining unresolved source-owner
  // limitation, NOT an acceptance criterion for robust near GPU rollback.
  assert.throws(()=>sourceUploadChunkBuffer(x.gl,new Float32Array(9)),
    /ORIGINAL_NATIVE_DELETE_FAULT/);
  assert.deepEqual(x.calls.slice(-2),
    ['bufferData','delete:native-original-new']);
});
test('actual original native GPU uploader rejects bad geometry without allocation',()=>{
  const x=originalUploaderGl();
  assert.throws(()=>sourceUploadChunkBuffer(x.gl,new Float32Array(8)),
    /packed vertex data/);
  assert.deepEqual(x.calls,[]);
  assert.equal(SOURCE_MAX_CHUNK_UPLOAD_BYTES,8*1024*1024);
  assert.equal(sourceValidateChunkUploadBytes(new Float32Array(9)),36);
});
test('actual original native bounded retry rejects repeated early GPU retries',()=>{
  const retry=new SourceGpuUploadRetry({baseDelayMs:250,maxDelayMs:8000});
  assert.equal(retry.ready('original',100),true);
  const first=retry.fail('original',100,'OOM');
  assert.equal(first.until,350);
  assert.equal(retry.ready('original',349),false);
  assert.equal(retry.ready('original',350),true);
  retry.success('original');
  assert.equal(retry.stats().recovered,1);
});


// Real ORIGINAL main-module read-only A/B performance helpers extracted at
// exact source blob. They remain disabled on all public GitHub Pages/PWA
// sessions and measure only real future browser events, not fabricated FPS.
const local291PerfStart=source.indexOf('  // Independent localhost-only measurement switch');
const local291PerfEnd=source.indexOf('  let near291=null;',local291PerfStart);
assert.ok(local291PerfStart>=0&&local291PerfEnd>local291PerfStart);
const exactLocal291PerfSource=source.slice(local291PerfStart,local291PerfEnd);
const createLocal291Perf=new Function('scope','with(scope){'+
  'let near291Enabled=scope.enabled,near291Fatal=false,'+
  'near291PageSuspended=false,near291=null;'+exactLocal291PerfSource+
  '\nreturn {frame:near291RecordFrame,'+
  'mine:(duration,result,pending)=>near291RecordMine(duration,result,'+
  '(pending===undefined?{samples:[],overflow:false,faults:0}:pending)),'+
  'interrupt:near291Interrupt,noteEdit:near291NoteEdit,'+
  'auditRender:near291CheckRenderIdentity,'+
  'abortMine:near291AbortMineTrial,phase:near291RecordMinePhase,'+
  'beginEdit:()=>{near291EditPhase={meshMs:0,loadedSections:0,gpuMs:0,gpuCalls:0};'+
  'return near291EditPhase;},'+
  'endEdit:()=>{const p=near291EditPhase;near291EditPhase=null;return p;},'+
  'upload:near291RecordUpload,fail:near291RecordUploadFailure,'+
  'startFirst:()=>{near291FirstEditUploads={samples:[],overflow:false,faults:0};'+
    'return near291FirstEditUploads;},'+
  'finishFirst:()=>{const p=near291FirstEditUploads;near291FirstEditUploads=null;return p;},'+
  'read:near291PerfSnapshot,'+
  'data:near291Perf};}');
function local291PerfFixture({
  search='?measure-291=1',hostname='localhost',enabled=false
}={}){
  const URLParams=typeof URLSearchParams==='function'?URLSearchParams:
    class {
      constructor(q){this.q=q;}
      get(k){const hit=this.q.replace(/^\?/,'').split('&')
        .find(p=>p.split('=')[0]===k);
        return hit?hit.split('=')[1]:null;}
    };
  const scope={
    enabled,URLSearchParams:URLParams,location:{hostname,search},
    document:{hidden:false},help:{hidden:true},
    exploration:{isOpen:()=>false},graphicsLost:false,g2Active:()=>false,
    renderPreset:'balanced',devicePixelRatio:2,
    canvas:{clientWidth:956,clientHeight:440,width:956,height:440},
    world:{seed:179},player:{feet:-30},BLOCK:{AIR:0},
    frameHistory:{stats:()=>({frames:4,p95Ms:18})},
    meshCadence:{stats:()=>({meshes:2})},
    chunks:new Map(),pending:new Map(),
    gpuRetry:{stats:()=>({pendingRetries:0,failures:0})},
    frameDriver:{snapshot:()=>({running:true})}
  };
  return {scope,perf:createLocal291Perf(scope)};
}
test('localhost-only instrumentation disabled by default and on public Pages',()=>{
  assert.equal(local291PerfFixture({search:''}).perf.read(),null);
  assert.equal(local291PerfFixture({hostname:'hdog960.github.io'}).perf.read(),null);
  assert.equal(local291PerfFixture({search:''}).perf.data,null);
});
test('same original baseline and local VAO capture exact frame/mine/upload p95',()=>{
  for(const enabled of [false,true]){
    const {perf}=local291PerfFixture({enabled});
    for(const f of [0,16,32,90])perf.frame(f);
    for(const m of [10,20,40])perf.mine(m);
    for(const u of [3,8,9])perf.upload(u);
    const summary=perf.read();
    assert.equal(summary.mode,enabled?'experimental-vao':'original-control');
    assert.equal(summary.frameGapsRecorded,3);
    assert.equal(summary.rollingFrameP95Ms,58);
    assert.equal(summary.trueSavedDeepMines,3);
    assert.equal(summary.miningActionP95Ms,40);
    assert.equal(summary.successfulGuardedUploads,3);
    assert.equal(summary.rollingSuccessfulUploadP95Ms,9);
    assert.equal(summary.gpuUploadFaults.pendingRetries,0);
    assert.equal(summary.releaseCertified,false);
    assert.equal(summary.nativeGpuRollbackProven,false);
  }
});
test('viewport or seed change resets every recorded sample and comparison count',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.frame(16);perf.mine(20);perf.upload(30);
  scope.canvas.clientWidth=932;
  assert.equal(perf.read().trueSavedDeepMines,0);
  assert.equal(perf.read().frameGapsRecorded,0);
  assert.equal(perf.read().successfulGuardedUploads,0);
  perf.mine(45);scope.world.seed=180;
  assert.equal(perf.read().trueSavedDeepMines,0);
});
test('foreground frame gap excludes background and paused control samples',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(10);scope.document.hidden=true;perf.frame(20);
  scope.document.hidden=false;
  perf.frame(900);perf.frame(918);
  assert.equal(perf.read().frameGapsRecorded,1);
  assert.equal(perf.read().rollingFrameP95Ms,18);
});
test('strict bounded mine and upload rings preserve lifetime counts',()=>{
  const {perf}=local291PerfFixture();
  for(let i=0;i<170;i++)perf.mine(i);
  for(let i=0;i<2120;i++)perf.upload(1);
  assert.equal(perf.read().trueSavedDeepMines,170);
  assert.equal(perf.read().maxMineSamples,128);
  assert.equal(perf.read().successfulGuardedUploads,2120);
  assert.equal(perf.read().maxUploadSamples,2048);
  assert.equal(perf.read().rollingSuccessfulUploadP95Ms,1);
});
test('exact original uploadPack2Chunk measures both unmodified guarded GL uploads',()=>{
  const {scope,perf}=local291PerfFixture();
  const start=source.indexOf('  function uploadPack2Chunk(vertices,water){');
  const end=source.indexOf('  let editMeshBatches=0;',start);
  assert.ok(start>=0&&end>start);
  const make=new Function('scope','with(scope){'+source.slice(start,end)+
    '\nreturn uploadPack2Chunk;}');
  let now=0;
  Object.assign(scope,{near291Perf:perf.data,near291RecordUpload:perf.upload,
    near291Enabled:false,performance:{now:()=>{now+=2;return now;}},
    gl:{deleteBuffer:()=>{}},
    near291RecordUploadFailure:perf.fail,
    uploadChunkBuffer:()=>({})});
  const uploaded=make(scope)(new Float32Array(9),new Float32Array(9));
  assert.equal(uploaded.count,1);
  assert.equal(perf.read().successfulGuardedUploads,2);
  assert.equal(perf.read().rollingSuccessfulUploadP95Ms,2);
});
test('original real deep mine timing is captured only after success and save',()=>{
  const start=source.indexOf("const near291MineStart=near291Perf&&mode==='mine'?performance.now():null;");
  const end=source.indexOf('  let lastStreamingCenter=',start);
  assert.ok(start>=0&&end>start);
  const actualMine=source.slice(start,end);
  const stages=[
    "const near291MineStart=near291Perf&&mode==='mine'?performance.now():null;",
    'result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,',
    'if(!result.ok){message(result.reason);return;}',
    'const persisted=save();',
    "if(near291MineStart!==null&&persisted&&result.cell?.[1]<-5&&player.feet<-5)",
    'near291RecordMine(performance.now()-near291MineStart,result,firstEditUploads);'
  ];
  let prior=-1;
  for(const stage of stages){
    const next=actualMine.indexOf(stage,prior+1);
    assert.ok(next>prior,'source-original deep mine order changed: '+stage);
    prior=next;
  }
  assert.ok(source.includes('near291RecordFrame(now); // inert unless local ?measure-291=1'));
});
test('read-only local acceptance interface cannot claim real WebGL or iPhone certification',()=>{
  one('nearPerformance291(){return near291PerfSnapshot();}');
  const snapshot=local291PerfFixture().perf.read();
  assert.equal(snapshot.readOnly,true);
  assert.equal(snapshot.browserPixelParityProven,false);
  assert.equal(snapshot.releaseCertified,false);
  assert.ok(!exactLocal291PerfSource.includes('gl.getError()'));
  assert.ok(!exactLocal291PerfSource.includes('save();'));
});

test('failed original guarded water upload is NOT counted as a successful GPU sample',()=>{
  const {scope,perf}=local291PerfFixture();
  const start=source.indexOf('  function uploadPack2Chunk(vertices,water){');
  const end=source.indexOf('  let editMeshBatches=0;',start);
  assert.ok(start>=0&&end>start);
  const make=new Function('scope','with(scope){'+source.slice(start,end)+
    '\nreturn uploadPack2Chunk;}');
  let t=0,calls=0;
  const failure=Error('291_ORIGINAL_GUARDED_WATER_UPLOAD_FAILURE');
  Object.assign(scope,{
    near291Perf:perf.data,near291RecordUpload:perf.upload,
    near291Enabled:false,performance:{now:()=>{t+=2;return t;}},
    gl:{deleteBuffer:()=>{}},
    near291RecordUploadFailure:perf.fail,
    uploadChunkBuffer:()=>{
      calls++;
      if(calls===2)throw failure;
      return {};
    }
  });
  assert.throws(()=>make(scope)(new Float32Array(9),new Float32Array(9)),
    e=>e===failure);
  assert.equal(perf.read().successfulGuardedUploads,1);
  assert.equal(perf.read().rollingSuccessfulUploadP95Ms,2);
  assert.equal(perf.read().releaseCertified,false);
});
test('hidden, context loss, and BFCache pagehide latch source interruption before recovery',()=>{
  const labels=[
    "document.addEventListener('visibilitychange',",
    "canvas.addEventListener('webglcontextlost',",
    "window.addEventListener('pagehide',"
  ];
  const sourceCalls=source.split('near291Interrupt();').length-1;
  assert.equal(sourceCalls,3);
  for(const label of labels){
    const anchor=source.indexOf(label);
    const next=source.indexOf('near291Interrupt();',anchor);
    assert.ok(anchor>=0&&next>anchor);
    assert.ok(next-anchor<360,label+' must latch before background time is sampled');
  }
});

test('real source frame slow count tracks the exact same 2048-slot p95 ring',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.frame(40); // One genuine slow frame above the original 33.4ms threshold.
  assert.equal(perf.read().rollingSlowFrames,1);
  assert.equal(perf.read().rollingFrameCount,1);
  for(let i=0;i<2048;i++)perf.frame(40+16*(i+1));
  const end=perf.read();
  assert.equal(end.frameGapsRecorded,2049);
  assert.equal(end.rollingFrameCount,2048);
  assert.equal(end.rollingSlowFrames,0);
  assert.equal(end.rollingFrameP95Ms,16);
});
test('source-original viewport/seed transitions clear accumulated slow frame evidence',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.frame(45);
  assert.equal(perf.read().rollingSlowFrames,1);
  scope.canvas.clientHeight=430;
  assert.equal(perf.read().rollingSlowFrames,0);
  assert.equal(perf.read().rollingFrameCount,0);
  perf.frame(100);perf.frame(144);
  assert.equal(perf.read().rollingSlowFrames,1);
  scope.world.seed=181;
  const snap=perf.read();
  assert.equal(snap.rollingSlowFrames,0);
  assert.equal(snap.rollingFrameCount,0);
  assert.equal(snap.protocol,'291-local-4viewport-v5');
});

test('original exact 33.4ms slow-frame threshold never drifts on ring overwrite',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.frame(33.4);
  assert.equal(perf.read().rollingSlowFrames,0,
    'exact original threshold 33.4 must not count as a slow frame');
  for(let i=1;i<=2048;i++)perf.frame(33.4+i*16);
  assert.equal(perf.read().frameGapsRecorded,2049);
  assert.equal(perf.read().rollingFrameCount,2048);
  assert.equal(perf.read().rollingSlowFrames,0,
    'overwritten Float64 frame values must preserve the exact slow threshold');
  const slow=local291PerfFixture().perf;
  slow.frame(0);slow.frame(33.4000001);
  assert.equal(slow.read().rollingSlowFrames,1);
  for(let i=1;i<=2048;i++)slow.frame(33.4000001+i*16);
  assert.equal(slow.read().rollingSlowFrames,0);
});


test('exact original saved deep MINE returns read-only ordered cell and previous material',()=>{
  const {perf}=local291PerfFixture();
  const first={cell:[12,-48,-7],previous:3,next:0};
  const second={cell:[12,-49,-7],previous:8,next:0};
  perf.mine(17.5,first);
  perf.mine(24.3,second);
  const snapshot=perf.read();
  assert.equal(snapshot.trueSavedDeepMines,2);
  assert.deepEqual(snapshot.mineWitness,[
    [12,-48,-7,3,0],[12,-49,-7,8,0]]);
  assert.equal(snapshot.mineWitnessInvalid,false);
  assert.equal(snapshot.mineWitnessOverflow,false);
  assert.equal(Object.isFrozen(snapshot.mineWitness),true);
  assert.equal(Object.isFrozen(snapshot.mineWitness[0]),true);
});
test('mutating the original result or returned witness cannot change captured mining identity',()=>{
  const {perf}=local291PerfFixture();
  const result={cell:[4,-20,11],previous:3,next:0};
  perf.mine(22,result);
  result.cell[0]=400;
  const read=perf.read();
  assert.deepEqual(read.mineWitness,[[4,-20,11,3,0]]);
  try{read.mineWitness[0][0]=500;}catch(error){assert.ok(error instanceof TypeError);}
  assert.deepEqual(perf.read().mineWitness,[[4,-20,11,3,0]]);
});
test('invalid or incomplete original source mine result poisons A/B witness only, not p95',()=>{
  const {perf}=local291PerfFixture();
  perf.mine(13,{cell:[3,-15,4],previous:2,next:0});
  perf.mine(17,{cell:[3,-12,4],previous:2,next:7});
  perf.mine(20,{cell:[1,-3,4],previous:2,next:0});
  assert.equal(perf.read().trueSavedDeepMines,3);
  assert.equal(perf.read().mineWitness.length,1);
  assert.equal(perf.read().mineWitnessInvalid,true);
  assert.equal(perf.read().mineWitnessOverflow,false);
  assert.equal(perf.read().miningActionP95Ms,20);
});
test('more than 128 genuine saved original mines is transparently marked overflowing',()=>{
  const {perf}=local291PerfFixture();
  for(let i=0;i<129;i++)perf.mine(i,{cell:[i,-30,0],previous:3,next:0});
  const summary=perf.read();
  assert.equal(summary.trueSavedDeepMines,129);
  assert.equal(summary.mineWitness.length,128);
  assert.equal(summary.mineWitnessOverflow,true);
  assert.equal(summary.mineWitnessInvalid,false);
});
test('changing CSS viewport or original world seed also resets mine witness evidence',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.mine(5,{cell:[7,-18,9],previous:3,next:0});
  scope.canvas.clientHeight=430;
  assert.equal(perf.read().mineWitness.length,0);
  assert.equal(perf.read().trueSavedDeepMines,0);
  perf.mine(7,{cell:[8,-18,9],previous:3,next:0});
  scope.world.seed=180;
  assert.equal(perf.read().mineWitness.length,0);
  assert.equal(perf.read().trueSavedDeepMines,0);
});
test('new exact source only captures real saved original deep MINE result; no synthetic writes',()=>{
  const start=source.indexOf('const near291MineStart=near291Perf&&mode');
  const end=source.indexOf('  let lastStreamingCenter=',start);
  assert.ok(start>=0&&end>start);
  const real=source.slice(start,end);
  const stages=[
    'result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,',
    'if(!result.ok){message(result.reason);return;}',
    'const persisted=save();',
    "if(near291MineStart!==null&&persisted&&result.cell?.[1]<-5&&player.feet<-5)",
    'near291RecordMine(performance.now()-near291MineStart,result,firstEditUploads);'
  ];
  let last=-1;
  for(const stage of stages){
    const pos=real.indexOf(stage,last+1);
    assert.ok(pos>last,'original saved edit witness order: '+stage);
    last=pos;
  }
  assert.ok(!real.includes('world.set('));
  assert.ok(!exactLocal291PerfSource.includes('world.set('));
  assert.ok(!exactLocal291PerfSource.includes('localStorage.'));
});

test('real source interruption history starts clean until the first eligible measured sample',()=>{
  const {perf}=local291PerfFixture();
  perf.interrupt();
  assert.equal(perf.read().interruptionCount,0);
  assert.equal(perf.read().continuousForegroundRun,true);
  perf.frame(0);perf.frame(16);
  assert.equal(perf.read().frameGapsRecorded,1);
  perf.interrupt();
  const snap=perf.read();
  assert.equal(snap.interruptionCount,1);
  assert.equal(snap.continuousForegroundRun,false);
  assert.equal(snap.frameGapsRecorded,1);
});
test('source context restoration cannot remove an existing hidden-page interruption latch',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.mine(10,{cell:[5,-21,6],previous:3,next:0});
  perf.interrupt();
  scope.graphicsLost=true;
  scope.graphicsLost=false;scope.document.hidden=false;
  assert.equal(perf.read().continuousForegroundRun,false);
  assert.equal(perf.read().interruptionCount,1);
  perf.mine(11,{cell:[6,-21,6],previous:3,next:0});
  assert.equal(perf.read().trueSavedDeepMines,2);
  assert.equal(perf.read().continuousForegroundRun,false);
});
test('source viewport/seed resets discard old interrupted A/B session, not saved world',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.mine(6,{cell:[2,-23,8],previous:3,next:0});
  perf.interrupt();
  assert.equal(perf.read().interruptionCount,1);
  scope.canvas.clientWidth=932;
  const reset=perf.read();
  assert.equal(reset.interruptionCount,0);
  assert.equal(reset.continuousForegroundRun,true);
  assert.equal(reset.mineWitness.length,0);
  assert.equal(reset.trueSavedDeepMines,0);
  perf.mine(10,{cell:[3,-23,8],previous:3,next:0});
  scope.world.seed=181;
  assert.equal(perf.read().mineWitness.length,0);
});

test('original saved-mine window is idle before source-original deep block actions',()=>{
  const {perf}=local291PerfFixture();
  for(let i=0;i<200;i++)perf.frame(i*16);
  const snap=perf.read();
  assert.equal(snap.mineFrameWindow.phase,'idle');
  assert.equal(snap.mineFrameWindow.savedMines,0);
  assert.equal(snap.mineFrameWindow.frameGapsRecorded,0);
  assert.equal(snap.mineFrameWindow.frameP95Ms,null);
  assert.equal(snap.frameGapsRecorded,199);
});
test('exact original collector closes AFTER 100 saved edits plus their final RAF gap',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(8,{cell:[0,-28,0],previous:3,next:0});
  assert.equal(perf.read().mineFrameWindow.phase,'active');
  for(let i=1;i<100;i++){
    perf.frame(i*16);
    perf.mine(8,{cell:[i,-28,0],previous:3,next:0});
  }
  let win=perf.read().mineFrameWindow;
  assert.equal(win.savedMines,100);
  assert.equal(win.phase,'closing');
  assert.equal(win.frameGapsRecorded,99);
  perf.frame(1600);
  win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'closing');
  assert.equal(win.closingFramesRemaining,1);
  perf.frame(1616);
  win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'complete');
  assert.equal(win.closingFramesRemaining,0);
  assert.equal(win.frameGapsRecorded,101);
  assert.equal(win.frameP95Ms,16);
  assert.equal(win.elapsedMs,1616);
  assert.equal(win.slowFrames,0);
  assert.equal(win.overflow,false);
  assert.equal(win.interrupted,false);
  assert.equal(perf.read().mineWitness.length,100);
});
test('idle frames after 100th true source mine never dilute the closed trial p95',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(10,{cell:[0,-25,2],previous:3,next:0});
  for(let i=1;i<100;i++){
    perf.frame(i*16);
    perf.mine(10,{cell:[i,-25,2],previous:3,next:0});
  }
  perf.frame(1600);perf.frame(1616);
  const closed=perf.read().mineFrameWindow;
  for(let i=1;i<200;i++)perf.frame(1616+i*90);
  const later=perf.read();
  assert.equal(later.mineFrameWindow.frameGapsRecorded,closed.frameGapsRecorded);
  assert.equal(later.mineFrameWindow.frameP95Ms,closed.frameP95Ms);
  assert.ok(later.rollingFrameP95Ms>closed.frameP95Ms);
});
test('first and last real deep mining frame stalls both remain inside the A/B trial',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(10,{cell:[0,-20,7],previous:3,next:0});
  perf.frame(50);
  for(let i=1;i<100;i++){
    perf.mine(10,{cell:[i,-20,7],previous:3,next:0});
    perf.frame(50+i*16);
  }
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  perf.frame(1650);
  const snap=perf.read().mineFrameWindow;
  assert.equal(snap.phase,'complete');
  assert.equal(snap.savedMines,100);
  assert.equal(snap.frameGapsRecorded,101);
  assert.equal(snap.slowFrames,1);
});
test('source-hidden or WebGL/BFCache interruption forbids resumed mining trial',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[0,-40,3],previous:3,next:0});
  perf.frame(16);perf.interrupt();
  const interrupted=perf.read().mineFrameWindow;
  assert.equal(interrupted.phase,'interrupted');
  assert.equal(interrupted.interrupted,true);
  perf.frame(32);
  for(let i=1;i<100;i++)perf.mine(8,{cell:[i,-40,3],previous:3,next:0});
  assert.equal(perf.read().mineFrameWindow.phase,'interrupted');
  assert.equal(perf.read().mineFrameWindow.savedMines,1);
});
test('huge original foreground gap cannot vanish from true mining window',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(6,{cell:[0,-30,1],previous:3,next:0});
  perf.frame(1201);
  assert.equal(perf.read().mineFrameWindow.invalid,true);
  assert.equal(perf.read().mineFrameWindow.frameGapsRecorded,0);
});
test('original minetrial frame samples remain bounded even without 100 edits',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(6,{cell:[0,-28,4],previous:3,next:0});
  for(let i=1;i<=16385;i++)perf.frame(i*16);
  const win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'active');
  assert.equal(win.frameGapsRecorded,16384);
  assert.equal(win.maxFrameSamples,16384);
  assert.equal(win.overflow,true);
});
test('viewport and seed resets clear only local A/B trial evidence, never world saves',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(7,{cell:[0,-20,0],previous:3,next:0});
  perf.frame(16);
  scope.canvas.clientHeight=430;
  let snap=perf.read();
  assert.equal(snap.mineFrameWindow.phase,'idle');
  assert.equal(snap.mineFrameWindow.frameGapsRecorded,0);
  assert.equal(snap.mineFrameWindow.savedMines,0);
  perf.mine(9,{cell:[1,-20,0],previous:3,next:0});
  scope.world.seed=1001;
  snap=perf.read();
  assert.equal(snap.mineFrameWindow.phase,'idle');
  assert.equal(snap.mineFrameWindow.savedMines,0);
  assert.ok(!exactLocal291PerfSource.includes('localStorage.'));
});
test('original trial frame summary is frozen, numeric, and not release certified',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(13,{cell:[0,-19,2],previous:3,next:0});
  const snap=perf.read();
  assert.equal(Object.isFrozen(snap.mineFrameWindow),true);
  assert.equal(snap.protocol,'291-local-4viewport-v5');
  assert.equal(snap.releaseCertified,false);
  assert.equal(snap.browserPixelParityProven,false);
});

test('second post-save frame closes original A/B only after the final draw upload is observed',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(7,{cell:[0,-42,0],previous:3,next:0});
  for(let i=1;i<100;i++){
    perf.frame(i*16);
    perf.mine(7,{cell:[i,-42,0],previous:3,next:0});
  }
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  perf.frame(1600);
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  // The prior draw's original stream/upload delay shows as this next gap.
  perf.frame(1690);
  const win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'complete');
  assert.equal(win.closingFramesRemaining,0);
  assert.equal(win.frameGapsRecorded,101);
  assert.equal(win.slowFrames,1);
  assert.equal(win.overflow,false);
});
test('post-100th saved mine interruption before second frame fails closed',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(9,{cell:[0,-30,0],previous:3,next:0});
  for(let i=1;i<100;i++){
    perf.frame(i*16);
    perf.mine(9,{cell:[i,-30,0],previous:3,next:0});
  }
  perf.frame(1600);
  perf.interrupt();
  const win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'interrupted');
  assert.equal(win.interrupted,true);
  perf.frame(1616);
  assert.equal(perf.read().mineFrameWindow.phase,'interrupted');
});


test('real source upload samples before first genuine deep MINE never enter trial',()=>{
  const {perf}=local291PerfFixture();
  perf.upload(300);perf.upload(400); // old background streaming
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,0);
  perf.frame(0);
  const candidate=perf.startFirst();
  perf.upload(9);perf.upload(15);
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,0);
  assert.deepEqual(candidate.samples,[9,15]);
  perf.mine(24,{cell:[0,-38,0],previous:3,next:0},perf.finishFirst());
  const snap=perf.read();
  assert.equal(snap.mineFrameWindow.phase,'active');
  assert.equal(snap.mineFrameWindow.savedMines,1);
  assert.equal(snap.mineFrameWindow.successfulGuardedUploads,2);
  assert.equal(snap.mineFrameWindow.successfulGuardedUploadP95Ms,15);
  assert.equal(snap.rollingSuccessfulUploadP95Ms,400);
});
test('failed first mining candidate drops its staged GPU samples before true saved mine',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.startFirst();perf.upload(800);perf.fail();perf.finishFirst();
  assert.equal(perf.read().mineFrameWindow.phase,'idle');
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,0);
  const candidate=perf.startFirst();
  perf.upload(8);perf.upload(11);
  perf.mine(20,{cell:[1,-38,0],previous:3,next:0},perf.finishFirst());
  const w=perf.read().mineFrameWindow;
  assert.equal(w.successfulGuardedUploads,2);
  assert.equal(w.successfulGuardedUploadP95Ms,11);
  assert.equal(w.uploadFaults,0);
  assert.equal(candidate.overflow,false);
});
test('source native upload faults in active mine immediately invalidate A/B trial',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  const p=perf.startFirst();perf.upload(8);
  perf.mine(20,{cell:[0,-30,2],previous:3,next:0},perf.finishFirst());
  perf.upload(9);
  perf.fail();
  const snap=perf.read().mineFrameWindow;
  assert.equal(snap.uploadFaults,1);
  assert.equal(snap.successfulGuardedUploads,2);
  assert.equal(snap.successfulGuardedUploadP95Ms,9);
  assert.equal(snap.invalid,false); // comparator rejects via uploadFaults
});
test('first saved deep mine upload fault marker is retained even with good p95',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.startFirst();perf.upload(10);perf.fail();
  perf.mine(20,{cell:[0,-30,2],previous:3,next:0},perf.finishFirst());
  assert.equal(perf.read().mineFrameWindow.uploadFaults,1);
});
test('upload p95 includes real follow-up stream work until second post-save RAF',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  const pending=perf.startFirst();perf.upload(7);
  perf.mine(11,{cell:[0,-40,0],previous:3,next:0},perf.finishFirst());
  for(let i=1;i<100;i++){
    perf.frame(i*16);
    perf.upload(5);
    perf.mine(11,{cell:[i,-40,0],previous:3,next:0});
  }
  const before=perf.read().mineFrameWindow;
  assert.equal(before.phase,'closing');
  assert.equal(before.successfulGuardedUploads,100);
  perf.frame(1600);
  perf.upload(31);
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,101);
  perf.frame(1616);
  perf.upload(110); // after bounded trial, not counted
  const done=perf.read().mineFrameWindow;
  assert.equal(done.phase,'complete');
  assert.equal(done.successfulGuardedUploads,101);
  assert.equal(done.successfulGuardedUploadP95Ms,5);
  assert.equal(done.uploadOverflow,false);
});
test('first edit staged upload buffer overflow fails closed without false p95',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.startFirst();
  for(let i=0;i<4097;i++)perf.upload(1);
  const p=perf.finishFirst();
  assert.equal(p.samples.length,4096);
  assert.equal(p.overflow,true);
  perf.mine(9,{cell:[0,-42,1],previous:3,next:0},p);
  assert.equal(perf.read().mineFrameWindow.uploadOverflow,true);
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,4096);
});
test('active original-source uploader overflow marks bounded trial without wraparound',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(9,{cell:[0,-40,0],previous:3,next:0});
  for(let i=0;i<4097;i++)perf.upload(4);
  const win=perf.read().mineFrameWindow;
  assert.equal(win.successfulGuardedUploads,4096);
  assert.equal(win.uploadOverflow,true);
  assert.equal(win.maxUploadSamples,4096);
});
test('authentic original source edit arms upload pending before apply and clears on throw',()=>{
  const from=source.indexOf("const near291MineStart=near291Perf&&mode==='mine'");
  const to=source.indexOf("  let lastStreamingCenter=",from);
  assert.ok(from>=0&&to>from);
  const x=source.slice(from,to);
  const order=[
    "near291FirstEditUploads={samples:[],overflow:false,faults:0};",
    "result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,",
    "firstEditUploads=near291FirstEditUploads;",
    "near291FirstEditUploads=null;",
    "const persisted=save();",
    "near291RecordMine(performance.now()-near291MineStart,result,firstEditUploads);"
  ];
  let last=-1;
  for(const step of order){
    const at=x.indexOf(step,last+1);
    assert.ok(at>last,'original source edit/upload lifecycle stage '+step);
    last=at;
  }
  assert.ok(x.includes('}finally{'));
});
test('source guarded original uploader failure retains error and records trial fault',()=>{
  const {scope,perf}=local291PerfFixture();
  const start=source.indexOf('  function uploadPack2Chunk(vertices,water){');
  const end=source.indexOf('  let editMeshBatches=0;',start);
  const make=new Function('scope','with(scope){'+source.slice(start,end)+
    '\nreturn uploadPack2Chunk;}');
  perf.mine(10,{cell:[1,-35,2],previous:3,next:0}); // trial active
  const failure=Error('291_ORIGINAL_NATIVE_UPLOAD_FAILURE');
  let calls=0;
  Object.assign(scope,{
    near291Perf:perf.data,near291RecordUpload:perf.upload,
    near291RecordUploadFailure:perf.fail,near291Enabled:false,
    performance:{now:()=>10*++calls},
    gl:{deleteBuffer:()=>{}},
    uploadChunkBuffer:()=>{throw failure;}
  });
  assert.throws(()=>make(scope)(new Float32Array(9),new Float32Array(9)),
    e=>e===failure);
  assert.equal(perf.read().mineFrameWindow.uploadFaults,1);
  assert.equal(perf.read().mineFrameWindow.successfulGuardedUploads,0);
});
test('original trial GPU samples reset with CSS viewport/seed and cannot affect world',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(11,{cell:[1,-34,0],previous:3,next:0});
  perf.upload(22);
  scope.canvas.clientHeight=430;
  let snap=perf.read().mineFrameWindow;
  assert.equal(snap.phase,'idle');
  assert.equal(snap.successfulGuardedUploads,0);
  assert.equal(snap.uploadFaults,0);
  perf.mine(11,{cell:[2,-34,0],previous:3,next:0});
  perf.upload(5);scope.world.seed=123;
  snap=perf.read().mineFrameWindow;
  assert.equal(snap.successfulGuardedUploads,0);
  assert.equal(snap.uploadOverflow,false);
  assert.ok(!exactLocal291PerfSource.includes('world.set('));
});

test('original source real GPU 33.04ms does NOT round into admissible 33.0ms trial upload',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  const pending=perf.startFirst();
  perf.upload(33.04);
  perf.mine(100.04,{cell:[0,-30,1],previous:3,next:0},perf.finishFirst());
  perf.frame(20.04);
  const snapshot=perf.read();
  assert.equal(snapshot.mineFrameWindow.successfulGuardedUploadP95Ms,33.04);
  assert.equal(snapshot.rollingSuccessfulUploadP95Ms,33.0);
  assert.equal(snapshot.miningActionP95Ms,100.04);
  assert.equal(snapshot.mineFrameWindow.frameP95Ms,20.04);
  assert.equal(snapshot.releaseCertified,false);
});
test('source original successful deep MINE timing preserves double precision, not Float32 rounding',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(90.00006,{cell:[1,-30,1],previous:3,next:0});
  assert.equal(perf.read().miningActionP95Ms,90.00006);
  assert.ok(perf.read().mineFrameWindow.phase==='active');
});


test('an authentic second deep MINE action has a pending admission only until saved',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(9,{cell:[1,-31,5],previous:3,next:0});
  assert.equal(perf.read().mineFrameWindow.phase,'active');
  perf.noteEdit('mine');
  assert.equal(perf.read().mineFrameWindow.editPending,true);
  perf.mine(11,{cell:[2,-31,5],previous:3,next:0});
  const trial=perf.read().mineFrameWindow;
  assert.equal(trial.editPending,false);
  assert.equal(trial.savedMines,2);
  assert.equal(trial.invalid,false);
  assert.equal(trial.invalidReason,null);
});
test('failed voxel MINE after trial admission invalidates on the next genuine RAF',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(8,{cell:[1,-25,5],previous:3,next:0});
  perf.noteEdit('mine');
  // original blocked/mob-hit/unsaved branch returns without near291RecordMine
  perf.frame(16);
  const trial=perf.read().mineFrameWindow;
  assert.equal(trial.phase,'interrupted');
  assert.equal(trial.invalid,true);
  assert.equal(trial.interrupted,true);
  assert.equal(trial.invalidReason,'unsaved-or-nondeep-edit');
  assert.equal(trial.savedMines,1);
});
test('a second attempted edit before a successful saved MINE fails closed',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(7,{cell:[1,-40,7],previous:3,next:0});
  perf.noteEdit('mine');
  perf.noteEdit('mine'); // prior unconfirmed action never reached saved completion
  const r=perf.read().mineFrameWindow;
  assert.equal(r.phase,'interrupted');
  assert.equal(r.invalidReason,'off-plan-edit');
});
test('placing a voxel or non-MINE action amid deep-mining trial invalidates parity',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(8,{cell:[2,-41,1],previous:3,next:0});
  perf.noteEdit('place');
  const trial=perf.read().mineFrameWindow;
  assert.equal(trial.phase,'interrupted');
  assert.equal(trial.invalidReason,'off-plan-edit');
  assert.equal(trial.savedMines,1);
});
test('a 101st attempted edit before final two frame gaps invalidates the closing trial',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  for(let i=0;i<100;i++){
    if(i>0)perf.noteEdit('mine');
    perf.mine(5,{cell:[i,-45,0],previous:3,next:0});
    perf.frame((i+1)*16);
  }
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  perf.noteEdit('mine');
  assert.equal(perf.read().mineFrameWindow.phase,'interrupted');
  assert.equal(perf.read().mineFrameWindow.invalidReason,'off-plan-edit');
});
test('short Settings overlay marks source mining trial invalid immediately',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-42,1],previous:3,next:0});
  perf.abortMine('settings-opened');
  const before=perf.read().mineFrameWindow;
  assert.equal(before.phase,'interrupted');
  assert.equal(before.invalidReason,'settings-opened');
  perf.frame(12); // brief interval cannot silently turn into a successful p95
  const after=perf.read().mineFrameWindow;
  assert.equal(after.phase,'interrupted');
  assert.equal(after.savedMines,1);
});
test('help overlay active on a drawn frame fails the incomplete test closed',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-42,1],previous:3,next:0});
  scope.help.hidden=false;
  perf.frame(16);
  assert.equal(perf.read().mineFrameWindow.invalidReason,'foreground-excluded');
  assert.equal(perf.read().continuousForegroundRun,false);
});
test('exploration overlay pauses mine-window admission even if less than one frame elapsed',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-42,1],previous:3,next:0});
  scope.exploration.isOpen=()=>true;
  perf.frame(8);
  assert.equal(perf.read().mineFrameWindow.phase,'interrupted');
  assert.equal(perf.read().mineFrameWindow.invalid,true);
});
test('creative flight during trial invalidates voxel mining-world comparison',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-42,1],previous:3,next:0});
  scope.g2Active=()=>true;
  perf.frame(16);
  assert.equal(perf.read().mineFrameWindow.invalidReason,'creative-flight');
});
test('source original Settings and blur handlers actively fence the experiment only',()=>{
  const menu=source.indexOf("document.getElementById('menu').onclick=()=>{");
  const close=source.indexOf("document.getElementById('closeHelp').onclick",menu);
  assert.ok(menu>0&&close>menu);
  const handler=source.slice(menu,close);
  assert.ok(handler.includes("if(near291Perf)near291AbortMineTrial('settings-opened');"));
  assert.ok(handler.includes('cancelAllPointers();help.hidden=false;'));
  const blur=source.slice(source.indexOf("window.addEventListener('blur',()=>{"));
  assert.ok(blur.startsWith("window.addEventListener('blur',()=>{"));
  assert.ok(blur.includes("if(near291Perf)near291AbortMineTrial('window-blur');"));
  assert.ok(blur.includes('cancelAllPointers();'));
  assert.ok(source.includes("if(near291Perf)near291NoteEdit(mode); // read-only trial admission only"));
});
test('invalidated source A/B is reset by viewport change without changing schema-1 saves',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-42,1],previous:3,next:0});
  perf.abortMine('window-blur');
  assert.equal(perf.read().mineFrameWindow.invalidReason,'window-blur');
  scope.canvas.clientWidth=932;
  const fresh=perf.read();
  assert.equal(fresh.mineFrameWindow.phase,'idle');
  assert.equal(fresh.mineFrameWindow.invalidReason,null);
  assert.equal(fresh.mineFrameWindow.editPending,false);
  assert.equal(fresh.trueSavedDeepMines,0);
  assert.equal(fresh.releaseCertified,false);
});

test('original source captures physical backing pixels, quality preset and DPR at first saved mine',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(12,{cell:[1,-22,3],previous:3,next:0});
  const w=perf.read().mineFrameWindow;
  assert.deepEqual(w.renderIdentity,[956,440,'balanced',2]);
  assert.equal(Object.isFrozen(w.renderIdentity),true);
  assert.equal(w.invalidReason,null);
  assert.equal(w.savedMines,1);
});
test('actual backing WebGL pixels may change while CSS viewport remains constant: fail closed',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-22,3],previous:3,next:0});
  scope.canvas.width=1000;
  perf.auditRender(); // original post-gl.viewport read-only hook
  const win=perf.read().mineFrameWindow;
  assert.equal(win.phase,'interrupted');
  assert.equal(win.invalidReason,'render-identity-changed');
  assert.equal(win.interrupted,true);
  assert.equal(win.invalid,true);
  assert.equal(win.savedMines,1);
});
test('DPR drift invalidates even when pixels have not yet been resized',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-22,3],previous:3,next:0});
  scope.devicePixelRatio=3;
  perf.frame(16); // original pre-draw RAF check catches DPR before canvas resize
  const win=perf.read().mineFrameWindow;
  assert.equal(win.invalidReason,'render-identity-changed');
  assert.equal(win.phase,'interrupted');
});
test('quality preset drift invalidates original GPU workload before next frame',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-22,3],previous:3,next:0});
  scope.renderPreset='economy';
  perf.auditRender();
  assert.equal(perf.read().mineFrameWindow.invalidReason,'render-identity-changed');
  assert.equal(perf.read().continuousForegroundRun,false);
});
test('one backing-size change during the two post-mine RAF gaps poisons comparison',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(9,{cell:[0,-24,2],previous:3,next:0});
  for(let i=1;i<100;i++){perf.frame(i*16);
    perf.mine(9,{cell:[i,-24,2],previous:3,next:0});
  }
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  perf.frame(1600);
  assert.equal(perf.read().mineFrameWindow.closingFramesRemaining,1);
  scope.canvas.height=500;
  perf.auditRender();
  const w=perf.read().mineFrameWindow;
  assert.equal(w.phase,'interrupted');
  assert.equal(w.invalidReason,'render-identity-changed');
  perf.frame(1616);
  assert.equal(perf.read().mineFrameWindow.phase,'interrupted');
});
test('original render identity resets only with CSS viewport/seed session and never touches saves',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(9,{cell:[0,-24,2],previous:3,next:0});
  scope.canvas.clientWidth=932;
  scope.canvas.width=932;
  const reset=perf.read();
  assert.equal(reset.mineFrameWindow.phase,'idle');
  assert.equal(reset.mineFrameWindow.renderIdentity,null);
  assert.equal(reset.trueSavedDeepMines,0);
  perf.mine(11,{cell:[1,-24,2],previous:3,next:0});
  assert.deepEqual(perf.read().mineFrameWindow.renderIdentity,[932,440,'balanced',2]);
  assert.ok(!exactLocal291PerfSource.includes('localStorage.'));
  assert.ok(!exactLocal291PerfSource.includes('world.set('));
});
test('original draw catches post-gl.viewport size changes and quality selector checks in source',()=>{
  const draw=source.indexOf('  function draw(now){');
  const measure=source.indexOf('      const buffer=bufferDimensions(',draw);
  const resize=source.indexOf('if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}',measure);
  const audit=source.indexOf('near291CheckRenderIdentity(); // inert on production Pages/PWA',resize);
  assert.ok(draw>=0&&measure>draw&&resize>measure&&audit>resize&&audit-resize<520);
  const selector=source.indexOf("renderSelect.addEventListener('change',()=>{");
  const preset=source.indexOf('renderPreset=normalizeRenderPreset(renderSelect.value);',selector);
  const validation=source.indexOf('if(near291Perf)near291CheckRenderIdentity(); // local trial only',preset);
  assert.ok(selector>=0&&preset>selector&&validation>preset&&validation-preset<180);
});
test('source original exact render identity never certifies production release',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(6,{cell:[1,-25,3],previous:3,next:0});
  const snap=perf.read();
  assert.equal(snap.protocol,'291-local-4viewport-v5');
  assert.equal(snap.releaseCertified,false);
  assert.equal(snap.nativeGpuRollbackProven,false);
  assert.equal(snap.browserPixelParityProven,false);
});


test('active source-saved deep MINE followed by CSS resize remains disqualified after reset',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);
  perf.mine(8,{cell:[1,-31,3],previous:3,next:0});
  scope.canvas.clientWidth=932;scope.canvas.width=932;
  const snap=perf.read();
  assert.equal(snap.trueSavedDeepMines,0);
  assert.equal(snap.mineFrameWindow.phase,'idle');
  assert.equal(snap.interruptionCount,1);
  assert.equal(snap.continuousForegroundRun,false);
  perf.mine(9,{cell:[2,-31,3],previous:3,next:0});
  assert.equal(perf.read().mineFrameWindow.savedMines,1);
  assert.equal(perf.read().continuousForegroundRun,false);
});
test('world-seed switches cannot erase previous interrupted trial across repeated resets',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(8,{cell:[1,-31,3],previous:3,next:0});
  scope.world.seed=180;
  assert.equal(perf.read().interruptionCount,1);
  perf.mine(9,{cell:[2,-31,3],previous:3,next:0});
  scope.world.seed=181;
  const snap=perf.read();
  assert.equal(snap.interruptionCount,2);
  assert.equal(snap.continuousForegroundRun,false);
  assert.equal(snap.trueSavedDeepMines,0);
});
test('CSS change during the two final genuine RAF gaps cannot restart a clean trial',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);
  for(let i=0;i<100;i++){
    perf.mine(8,{cell:[i,-24,2],previous:3,next:0});
    perf.frame((i+1)*16);
  }
  assert.equal(perf.read().mineFrameWindow.phase,'closing');
  scope.canvas.clientHeight=430;
  const reset=perf.read();
  assert.equal(reset.interruptionCount,1);
  assert.equal(reset.continuousForegroundRun,false);
  assert.equal(reset.trueSavedDeepMines,0);
});
test('a completed 100-mine source trial cannot be relabeled as uninterrupted after viewport change',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);
  for(let i=0;i<100;i++){
    perf.mine(8,{cell:[i,-24,2],previous:3,next:0});
    perf.frame((i+1)*16);
  }
  perf.frame(1616);
  assert.equal(perf.read().mineFrameWindow.phase,'complete');
  scope.canvas.clientWidth=932;
  const reset=perf.read();
  assert.equal(reset.interruptionCount,1);
  assert.equal(reset.continuousForegroundRun,false);
  assert.equal(reset.trueSavedDeepMines,0);
});
test('viewport adjustments before any original saved MINE still start a clean local trial',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);
  scope.canvas.clientWidth=932;
  const reset=perf.read();
  assert.equal(reset.mineFrameWindow.phase,'idle');
  assert.equal(reset.interruptionCount,0);
  assert.equal(reset.continuousForegroundRun,true);
  perf.mine(8,{cell:[1,-21,2],previous:3,next:0});
  assert.equal(perf.read().mineFrameWindow.savedMines,1);
});
test('prior visibility interruption cannot be laundered even by a pre-mine identity reset',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.frame(16);
  perf.interrupt();
  assert.equal(perf.read().interruptionCount,1);
  scope.canvas.clientWidth=932;
  const reset=perf.read();
  assert.equal(reset.interruptionCount,1);
  assert.equal(reset.continuousForegroundRun,false);
});


test('original-source diagnostic phases exist only in the localhost opt-in window',()=>{
  const main=source.slice(source.indexOf('  const near291Measure='),source.indexOf('  let near291=null;'));
  assert.ok(main.includes('meshCpuMs:new Float64Array(100)'));
  assert.ok(main.includes('saveCpuMs:new Float64Array(100)'));
  assert.ok(main.includes('loadedSections:new Uint16Array(100)'));
  assert.equal(local291PerfFixture({search:''}).perf.read(),null);
  assert.equal(local291PerfFixture({hostname:'hdog960.github.io'}).perf.read(),null);
});
test('original source times real synchronous mesh CPU before upload and preserves original stage order',()=>{
  const begin=source.indexOf('  function refreshEditedMeshes(x,z,y=0){');
  const finish=source.indexOf('  function refreshPhysicalChunk(',begin);
  const body=source.slice(begin,finish);
  const a=body.indexOf('const near291MeshStarted=near291EditPhase?performance.now():null;');
  const b=body.indexOf('const vertices=meshPlayableChunk(cx,cz,section);');
  const c=body.indexOf('near291EditPhase.meshMs+=Math.max(0,performance.now()-near291MeshStarted);');
  const d=body.indexOf('ready.push({...item,...uploadPack2Chunk(item.vertices,item.water)});');
  assert.ok(a>=0&&b>a&&c>b&&d>c);
  assert.ok(body.includes('near291EditPhase.loadedSections+=batch.length;'));
  assert.ok(body.includes('deleteChunkBuffers(old);'));
});
test('original source clears edit scratch in original finally and logs only after save success',()=>{
  const begin=source.indexOf("    const near291MineStart=near291Perf&&mode==='mine'?performance.now():null;");
  const finish=source.indexOf('  let lastStreamingCenter=',begin);
  const body=source.slice(begin,finish);
  const a=body.indexOf('near291EditPhase={meshMs:0,loadedSections:0};');
  const b=body.indexOf('result=applyBlockAction(');
  const c=body.indexOf('near291EditPhase=null;');
  const d=body.indexOf('const persisted=save();');
  const e=body.indexOf('near291RecordMine(performance.now()-near291MineStart,result,firstEditUploads);');
  const f=body.indexOf('near291RecordMinePhase({');
  assert.ok(a>=0&&b>a&&c>b&&d>c&&e>d&&f>e);
  assert.ok(body.includes('if(near291MineStart!==null&&persisted&&result.cell?.[1]<-5&&player.feet<-5)'));
});
test('mesh and schema-save phase histograms are genuine bounded 100-source-mine diagnostics',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);
  for(let i=1;i<=100;i++){
    perf.mine(10,{cell:[i,-31,2],previous:3,next:0});
    perf.phase({meshMs:i,saveMs:i/10,gpuMs:1,gpuCalls:1,loadedSections:i%4});
    perf.frame(i*16);
  }
  const w=perf.read().mineFrameWindow;
  assert.equal(w.savedMines,100);
  assert.equal(w.phaseMines,100);
  assert.equal(w.meshGenerationP95Ms,95);
  assert.equal(w.schemaSaveP95Ms,9.5);
  assert.equal(w.maxRebuiltLoadedSections,3);
  assert.equal(w.invalid,false);
});
test('unsaved or unrelated phase outside a source-MINE trial is never admitted',()=>{
  const {perf}=local291PerfFixture();
  perf.phase({meshMs:7,saveMs:3,gpuMs:1,gpuCalls:1,loadedSections:2});
  assert.equal(perf.read().mineFrameWindow.phaseMines,0);
  assert.equal(perf.read().mineFrameWindow.meshGenerationP95Ms,null);
  perf.frame(0);
  perf.mine(12,{cell:[1,-31,2],previous:3,next:0});
  perf.phase({meshMs:9,saveMs:2,gpuMs:1,gpuCalls:1,loadedSections:1});
  assert.equal(perf.read().mineFrameWindow.phaseMines,1);
});
test('missing negative or infinite source phase marks the trial invalid, never fabricates CPU time',()=>{
  for(const invalid of [null,{meshMs:-1,saveMs:2,gpuMs:1,gpuCalls:1,loadedSections:1},
    {meshMs:Infinity,saveMs:2,gpuMs:1,gpuCalls:1,loadedSections:1},
    {meshMs:1,saveMs:NaN,gpuMs:1,gpuCalls:1,loadedSections:1},
    {meshMs:1,saveMs:2,gpuMs:1,gpuCalls:1,loadedSections:-1}]){
    const {perf}=local291PerfFixture();
    perf.frame(0);perf.mine(12,{cell:[1,-31,2],previous:3,next:0});
    perf.phase(invalid);
    const w=perf.read().mineFrameWindow;
    assert.equal(w.invalid,true);
    assert.equal(w.invalidReason,'phase-invalid');
    assert.equal(w.phaseMines,0);
  }
});
test('duplicated per-mine phase can never overwrite the first saved original sample',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-31,2],previous:3,next:0});
  perf.phase({meshMs:11,saveMs:4,gpuMs:1,gpuCalls:1,loadedSections:2});
  perf.phase({meshMs:3,saveMs:1,gpuMs:1,gpuCalls:1,loadedSections:1});
  const w=perf.read().mineFrameWindow;
  assert.equal(w.invalid,true);
  assert.equal(w.invalidReason,'phase-count-mismatch');
  assert.equal(w.phaseMines,1);
  assert.equal(w.meshGenerationP95Ms,11);
});
test('CSS or seed session reset clears phase histories but preserves interruption veto',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-31,2],previous:3,next:0});
  perf.phase({meshMs:11,saveMs:4,gpuMs:1,gpuCalls:1,loadedSections:2});
  scope.canvas.clientWidth=932;
  const reset=perf.read();
  assert.equal(reset.mineFrameWindow.phaseMines,0);
  assert.equal(reset.mineFrameWindow.meshGenerationP95Ms,null);
  assert.equal(reset.interruptionCount,1);
  assert.equal(reset.continuousForegroundRun,false);
});
test('phase measurements cannot certify original GPU rollback, pixel parity or PWA release',()=>{
  const {perf}=local291PerfFixture();
  perf.frame(0);perf.mine(12,{cell:[1,-31,2],previous:3,next:0});
  perf.phase({meshMs:11,saveMs:4,gpuMs:1,gpuCalls:1,loadedSections:2});
  const snap=perf.read();
  assert.equal(snap.releaseCertified,false);
  assert.equal(snap.nativeGpuRollbackProven,false);
  assert.equal(snap.browserPixelParityProven,false);
  assert.ok(!exactLocal291PerfSource.includes('localStorage.'));
});


test('exact original opaque+water source GPU upload hooks accumulate edit-only time',()=>{
  const {scope,perf}=local291PerfFixture();
  const a=source.indexOf('  function uploadPack2Chunk(vertices,water){');
  const b=source.indexOf('  let editMeshBatches=0;',a);
  assert.ok(a>=0&&b>a);
  const fn=new Function('scope','with(scope){'+source.slice(a,b)+'\nreturn uploadPack2Chunk;}');
  let tick=0,calls=0;const phase=perf.beginEdit();
  Object.assign(scope,{near291Perf:perf.data,near291Enabled:false,
    near291RecordUpload:perf.upload,near291RecordUploadFailure:perf.fail,
    performance:{now:()=>++tick*3},gl:{deleteBuffer:()=>{}},
    uploadChunkBuffer:()=>{calls++;return {};}});
  const result=fn(scope)(new Float32Array(9),new Float32Array(9));
  perf.endEdit();
  assert.equal(result.count,1);
  assert.equal(calls,2);
  assert.equal(phase.gpuMs,6);
  assert.equal(phase.gpuCalls,2);
});
test('first original saved MINE includes original pre-save opaque and water uploads',()=>{
  const {perf}=local291PerfFixture();perf.frame(0);
  const edit=perf.beginEdit(),pending=perf.startFirst();
  perf.upload(17);perf.upload(21);
  const capture=perf.finishFirst();perf.endEdit();
  assert.equal(pending,capture);
  perf.mine(42,{cell:[1,-30,2],previous:3,next:0},capture);
  perf.phase({meshMs:2,saveMs:3,gpuMs:edit.gpuMs,gpuCalls:edit.gpuCalls,loadedSections:1});
  const w=perf.read().mineFrameWindow;
  assert.equal(w.successfulGuardedUploads,2);
  assert.equal(w.perMineNativeUploadSumP95Ms,38);
  assert.equal(w.maxNativeUploadCallsPerMine,2);
});
test('unrelated stream GPU work does not raise original per-mine upload sum',()=>{
  const {perf}=local291PerfFixture();perf.frame(0);
  const edit=perf.beginEdit();perf.upload(9);perf.endEdit();
  perf.mine(20,{cell:[1,-30,2],previous:3,next:0});
  perf.phase({meshMs:2,saveMs:3,gpuMs:edit.gpuMs,gpuCalls:edit.gpuCalls,loadedSections:1});
  perf.upload(200);perf.upload(300);
  const w=perf.read().mineFrameWindow;
  assert.equal(w.perMineNativeUploadSumP95Ms,9);
  assert.equal(w.maxNativeUploadCallsPerMine,1);
  assert.equal(w.successfulGuardedUploads,2);
});
test('100 accepted mine phases use full-precision nearest-rank summed native GPU p95',()=>{
  const {perf}=local291PerfFixture();perf.frame(0);
  for(let i=1;i<=100;i++){
    perf.mine(80,{cell:[i,-31,3],previous:3,next:0});
    perf.phase({meshMs:15,saveMs:4,gpuMs:i,gpuCalls:i%4,loadedSections:1});
    perf.frame(i*16);
  }
  const w=perf.read().mineFrameWindow;
  assert.equal(w.phaseMines,100);
  assert.equal(w.perMineNativeUploadSumP95Ms,95);
  assert.equal(w.maxNativeUploadCallsPerMine,3);
  assert.equal(w.meshGenerationP95Ms,15);
  assert.equal(w.schemaSaveP95Ms,4);
});
test('nonnumeric or excessive per-mine GPU diagnostics poison the trial',()=>{
  for(const extra of [{gpuMs:NaN,gpuCalls:1},{gpuMs:-1,gpuCalls:1},
    {gpuMs:Infinity,gpuCalls:1},{gpuMs:1,gpuCalls:-1},
    {gpuMs:1,gpuCalls:1.5},{gpuMs:1,gpuCalls:4097}]){
    const {perf}=local291PerfFixture();
    perf.frame(0);perf.mine(10,{cell:[1,-31,2],previous:3,next:0});
    perf.phase({meshMs:2,saveMs:3,loadedSections:1,...extra});
    const w=perf.read().mineFrameWindow;
    assert.equal(w.invalid,true);
    assert.equal(w.invalidReason,'phase-invalid');
    assert.equal(w.phaseMines,0);
  }
});
test('seed changes discard old GPU sums but cannot reset interruption count',()=>{
  const {scope,perf}=local291PerfFixture();
  perf.frame(0);perf.mine(10,{cell:[1,-31,2],previous:3,next:0});
  perf.phase({meshMs:3,saveMs:2,gpuMs:11,gpuCalls:2,loadedSections:1});
  scope.world.seed=180;
  const s=perf.read();
  assert.equal(s.mineFrameWindow.perMineNativeUploadSumP95Ms,null);
  assert.equal(s.mineFrameWindow.maxNativeUploadCallsPerMine,null);
  assert.equal(s.interruptionCount,1);
  assert.equal(s.continuousForegroundRun,false);
});
test('per-mine GPU diagnostic never certifies native GPU rollback or physical release',()=>{
  const {perf}=local291PerfFixture();
  const s=perf.read();
  assert.equal(s.releaseCertified,false);
  assert.equal(s.nativeGpuRollbackProven,false);
  assert.equal(s.browserPixelParityProven,false);
  assert.equal(s.mineFrameWindow.perMineNativeUploadSumP95Ms,null);
});
