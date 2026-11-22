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
    '14510803189ce7acad3953275d2c7aa530f90613');
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
test('the exact original near opaque draw loop survives as the A/B control',()=>{
  one('else for(const c of chunks.values()){\n        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);');
  for(const line of [
    'gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);',
    'gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);',
    'gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);',
    'gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);'
  ])one(line);
  one('if(near291)near291.render(chunks.values());');
  one('gl.drawArrays(gl.TRIANGLES,0,c.count);');
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
    'if(near291Enabled){','near291=createOpaqueNearLifecycle({gl,',
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
