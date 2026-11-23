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
    'e58a35f997a97622be3130d057feed9aa376bf55');
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
  one("const persisted=save();");
  one("const label=BLOCK_NAMES[result.block]||'block';");
  const actualMine=source.slice(source.indexOf("const near291MineStart=near291Perf&&mode==='mine'"),
    source.indexOf("  let lastStreamingCenter=",source.indexOf("const near291MineStart=near291Perf&&mode==='mine'")));
  const a=actualMine.indexOf('const persisted=save();');
  const b=actualMine.indexOf('near291RecordMine(performance.now()-near291MineStart);');
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
  '\nreturn {frame:near291RecordFrame,mine:near291RecordMine,'+
  'upload:near291RecordUpload,read:near291PerfSnapshot,'+
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
    exploration:{isOpen:()=>false},graphicsLost:false,
    canvas:{clientWidth:956,clientHeight:440,width:956,height:440},
    world:{seed:179},player:{feet:-30},
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
    'const result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,',
    'if(!result.ok){message(result.reason);return;}',
    'const persisted=save();',
    "if(near291MineStart!==null&&persisted&&result.cell?.[1]<-5&&player.feet<-5)",
    'near291RecordMine(performance.now()-near291MineStart);'
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
test('hidden, context loss, and BFCache pagehide reset original measured frame epoch',()=>{
  const lines=source.split('\n');
  const positions=lines.flatMap((line,i)=>line.includes('if(near291Perf)near291Perf.prevFrame=null;')?[i]:[]);
  assert.equal(positions.length,3);
  const labels=[
    "document.addEventListener('visibilitychange',",
    "canvas.addEventListener('webglcontextlost',",
    "window.addEventListener('pagehide',"
  ];
  for(let i=0;i<labels.length;i++){
    const anchor=source.indexOf(labels[i]);
    const next=source.indexOf('if(near291Perf)near291Perf.prevFrame=null;',anchor);
    assert.ok(anchor>=0&&next>anchor);
    assert.ok(next-anchor<360,labels[i]+' must reset before background time is sampled');
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
  assert.equal(snap.protocol,'291-local-4viewport-v1');
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
