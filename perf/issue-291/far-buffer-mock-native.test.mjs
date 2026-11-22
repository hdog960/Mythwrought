import test from 'node:test';
import assert from 'node:assert/strict';
import {uploadChunkBuffer} from '../../src/gpu-recovery.mjs';
import {createMockNativeFarRollback} from './far-buffer-mock-native.mjs';
const vert=(seed,n=9)=>new Float32Array(Array.from({length:n},(_,i)=>seed+i/10));
function mockGl(){
 const live=new Map(),history=[],obj={
 __mythwrought291MockOnly:true,live,history,NO_ERROR:0,OUT_OF_MEMORY:1285,
 ARRAY_BUFFER:34962,STATIC_DRAW:35044,createCount:0,errorReads:0,bufferDatas:0,
 injectedFailure:null,staleErrors:[],contextLost:false,livePeak:0,bytesPeak:0,
 createBuffer(){const buffer={serial:++this.createCount};live.set(buffer,{bytes:0,data:null});
   history.push('create:'+buffer.serial);this.record();return buffer;},
 deleteBuffer(buffer){history.push('delete:'+buffer?.serial);live.delete(buffer);this.record();},
 bindBuffer(target,buffer){if(target!==34962||!live.has(buffer))throw Error('bind-invalid');this.bound=buffer;
   history.push('bind:'+buffer.serial);},
 bufferData(target,data){if(!this.bound||!live.has(this.bound))throw Error('data-unbound');
   this.bufferDatas++;const b=live.get(this.bound);b.data=new Float32Array(data);b.bytes=data.byteLength;
   history.push('data:'+this.bound.serial);this.record();
   if(this.injectedFailure?.at===this.bufferDatas)this.pendingError=1285;},
 getError(){this.errorReads++;history.push('getError');
  if(this.staleErrors.length)return this.staleErrors.shift();
  if(this.pendingError){const x=this.pendingError;this.pendingError=null;return x;}return 0;},
 record(){this.livePeak=Math.max(this.livePeak,live.size);
   this.bytesPeak=Math.max(this.bytesPeak,[...live.values()].reduce((n,x)=>n+x.bytes,0));}
 };return obj;
}
function setup(n=4){const gl=mockGl(),gate={blocked:false,block(){this.blocked=true;},unblock(){this.blocked=false;},isBlocked(){return this.blocked;}},
  originals=[];for(let i=0;i<n;i++){const key='far-'+i;const vertices=vert(i+1);
    const buffer=uploadChunkBuffer(gl,vertices);originals.push({key,vertices,buffer});}
  // Observe the original complete buffer pool from a fake GL, not a browser.
  const context=()=>!gl.contextLost;
  const world={id:'w291',revision:18};
  const make=(modifiedIndex=n-1,opts={})=>{
    const desired=originals.map((x,i)=>({key:x.key,vertices:i>=modifiedIndex?vert(55+i):x.vertices}));
    return createMockNativeFarRollback({gl,original:originals,desired,
      retainedKeys:originals.slice(0,modifiedIndex).map(x=>x.key),world,gate,
      contextCurrent:context,...opts});
  };return {gl,gate,world,originals,make};
}
const peak=(s)=>{assert.ok(s.nativePeakObserved<=4,'peak slots '+s.nativePeakObserved);
 assert.ok(s.peakBytesObserved<=1048576);};

test('4 original +1 replacement: retire old suffix first, real original uploader, peak 4',()=>{
 const {gl,gate,make}=setup();const startErrors=gl.errorReads;
 const tx=make(3);const s=tx.run();assert.equal(s.status,'ready-for-world-commit');peak(s);
 assert.equal(gl.live.size,4);assert.equal(gl.errorReads-startErrors,2);
 assert.equal(gate.isBlocked(),true);assert.deepEqual(s.releasedKeys,['far-3']);
 assert.equal(tx.getMockBuffers(),null);assert.equal(tx.confirmWorld({id:'w291',revision:19,saveVerified:true}).status,'committed-mock');
 assert.equal(gate.isBlocked(),false);assert.equal(tx.getMockBuffers().length,4);
});
test('4 original +3 replacements: retire three, no 5th transient native buffer',()=>{
 const {gl,make}=setup();const old=gl.createCount;const tx=make(1),s=tx.run();peak(s);
 assert.equal(s.status,'ready-for-world-commit');assert.equal(gl.live.size,4);
 assert.equal(gl.createCount-old,3);assert.deepEqual(s.releasedKeys,['far-1','far-2','far-3']);
});
test('failing original WebGL post-check discards candidate then restores old source bytes',()=>{
 const {gl,gate,make,originals}=setup();gl.injectedFailure={at:gl.bufferDatas+1};
 const start=gl.errorReads;const tx=make(3),s=tx.run();peak(s);
 assert.equal(s.status,'old-gpu-restored-awaiting-world-rollback');
 assert.equal(gl.errorReads-start,4);
 assert.deepEqual(s.restoredKeys,['far-3']);assert.equal(gl.live.size,4);
 assert.equal(gate.isBlocked(),true);
 assert.equal(tx.confirmWorld({id:'w291',revision:19,saveVerified:true}).status,'blocked');
 // A separate instance proves that explicit authentic *old world* rollback
 // attestation is the only route to unblock after GPU reconstruction.
 const fresh=setup();fresh.gl.injectedFailure={at:fresh.gl.bufferDatas+1};const t=fresh.make(3);
 assert.equal(t.run().status,'old-gpu-restored-awaiting-world-rollback');
 assert.equal(t.confirmWorld({id:'w291',revision:18,editRolledBack:true}).status,'restored-mock');
 assert.equal(fresh.gate.isBlocked(),false);
 const newLast=t.getMockBuffers()[3];
 assert.deepEqual([...fresh.gl.live.get(newLast.buffer).data],[...fresh.originals[3].vertices]);
});
test('failed first replacement in 3-suffix sequence restores exact original order',()=>{
 const {gl,make,originals}=setup();gl.injectedFailure={at:gl.bufferDatas+1};
 const t=make(1),s=t.run();peak(s);
 assert.equal(s.status,'old-gpu-restored-awaiting-world-rollback');
 assert.deepEqual(s.restoredKeys,['far-1','far-2','far-3']);
 assert.equal(gl.live.size,4);
 assert.equal(t.confirmWorld({id:'w291',revision:18,editRolledBack:true}).status,'restored-mock');
 assert.deepEqual(t.getMockBuffers().map(x=>x.key),originals.map(x=>x.key));
});
test('failure after one successful staging upload deletes staged and restores all old',()=>{
 const {gl,make}=setup();gl.injectedFailure={at:gl.bufferDatas+2};
 const t=make(1),s=t.run();peak(s);
 assert.equal(s.status,'old-gpu-restored-awaiting-world-rollback');
 assert.deepEqual(s.stagedKeys,['far-1']);assert.equal(s.restoredKeys.length,3);
 assert.equal(gl.live.size,4);assert.ok(gl.history.some(x=>x.startsWith('delete:')));
});
test('if original rollback upload fails, fail closed and do not publish buffer list',()=>{
 const {gl,gate,make}=setup();const original=gl.bufferData.bind(gl);
 const first=gl.bufferDatas+1;gl.bufferData=function(target,data){original(target,data);
    if(this.bufferDatas===first||this.bufferDatas===first+1)this.pendingError=1285;};
 const t=make(3),s=t.run();peak(s);
 assert.equal(s.status,'blocked');assert.match(s.reason,/original-GPU-restore-failed/);
 assert.equal(gate.isBlocked(),true);assert.equal(t.getMockBuffers(),null);
});
test('without early retirement, failed staging leaves old buffers untouched',()=>{
 const {gl,gate,originals,world}=setup(3);const desired=[...originals.map(x=>({key:x.key,vertices:x.vertices})),{key:'far-3',vertices:vert(7)}];
 gl.injectedFailure={at:gl.bufferDatas+1};const t=createMockNativeFarRollback({gl,original:originals,desired,
 retainedKeys:originals.map(x=>x.key),world,gate,contextCurrent:()=>true});
 const s=t.run();peak(s);assert.equal(s.status,'old-gpu-restored-awaiting-world-rollback');
 assert.deepEqual(s.restoredKeys,[]);assert.deepEqual(s.releasedKeys,[]);
 assert.equal(gl.live.size,3);
});
test('guarded upload retains original one pre and one post error call without stale errors',()=>{
 const {gl,make}=setup();const pre=gl.errorReads;make(3).run();assert.equal(gl.errorReads-pre,2);
 const trace=gl.history.slice(-5);assert.ok(trace.filter(x=>x==='getError').length>=1);
});
test('bounded stale-error drain consumes 3 originals then mandatory post check',()=>{
 const {gl,make}=setup();gl.staleErrors=[1280,1281,0];const pre=gl.errorReads;
 const s=make(3).run();assert.equal(s.status,'ready-for-world-commit');
 assert.equal(gl.errorReads-pre,4);peak(s);
});
test('eight un-cleared original stale errors abort and restore old native bytes',()=>{
 const {gl,make}=setup();gl.staleErrors=Array(8).fill(1280);
 const pre=gl.errorReads;const s=make(3).run();peak(s);
 assert.equal(s.status,'old-gpu-restored-awaiting-world-rollback');
 assert.equal(gl.errorReads-pre,10); // 8 pre + restored 1 pre/1 post
});
test('a WebGL context loss after first stage never attempts unsafe native recovery',()=>{
 const {gl,gate,make}=setup();const prior=gl.bufferData.bind(gl);
 gl.bufferData=function(t,data){prior(t,data);this.contextLost=true;};
 const t=make(3),s=t.run();assert.equal(s.status,'blocked');
 assert.match(s.reason,/context-lost/);
 assert.equal(gate.isBlocked(),true);
 assert.equal(t.confirmWorld({id:'w291',revision:19,saveVerified:true}).status,'blocked');
});
test('real native WebGL object without mock-only marker is rejected before any GL call',()=>{
 const {gl,gate,originals,world}=setup();delete gl.__mythwrought291MockOnly;
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,desired:originals,
  retainedKeys:originals.map(x=>x.key),world,gate}),/MOCK_ONLY/);
});
test('final bytes cannot exceed original C6 1MiB before release',()=>{
 const {gl,gate,originals,world}=setup();const giant=new Float32Array(9*32000);
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,
 desired:originals.map((x,i)=>({key:x.key,vertices:i===3?giant:x.vertices})),
 retainedKeys:originals.slice(0,3).map(x=>x.key),world,gate}),/SOURCE_ORDER|GPU_BUDGET/);
 assert.equal(gate.isBlocked(),false);assert.equal(gl.live.size,4);
});
test('reordered retained prefix is rejected with no native deletion',()=>{
 const {gl,gate,originals,world}=setup();const before=gl.live.size;
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,
 desired:[originals[1],originals[0],...originals.slice(2)],
 retainedKeys:[originals[0].key],world,gate}),/SOURCE_ORDER/);
 assert.equal(gl.live.size,before);
});
test('unexpected third-party buffer in mock context disallows native ownership guess',()=>{
 const {gl,make}=setup();gl.createBuffer();
 assert.throws(()=>make(3),/UNKNOWN_NATIVE_RESOURCE_OWNER/);
});
test('invalid packed source geometry is blocked before retirement',()=>{
 const {gl,gate,originals,world}=setup();const desired=originals.map((x,i)=>({key:x.key,vertices:i===3?new Float32Array(10):x.vertices}));
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,desired,
  retainedKeys:originals.slice(0,3).map(x=>x.key),world,gate}),/SOURCE_ORDER/);
 assert.equal(gl.live.size,4);
});
test('no repeated run, no early world-confirm, no fake snapshot unlock',()=>{
 const {gl,gate,make}=setup();const t=make(3);
 assert.equal(t.run().status,'ready-for-world-commit'); // real run is synchronous
 assert.throws(()=>t.run(),/ALREADY_STARTED/);
 assert.equal(t.confirmWorld({id:'other',revision:19,saveVerified:true}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});

test('a retained source whose vertex bytes changed cannot be declared reusable',()=>{
 const {gl,gate,originals,world}=setup();const desired=originals.map((x,i)=>({key:x.key,
  vertices:i===0?vert(900):x.vertices}));
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,desired,
   retainedKeys:originals.slice(0,3).map(x=>x.key),world,gate}),/INVALID_FINAL/);
 assert.equal(gl.live.size,4);assert.equal(gate.isBlocked(),false);
});
test('native CPU backup bytes must exactly match old buffer contents',()=>{
 const {gl,gate,originals,world}=setup();const fake=originals.map(x=>({...x}));
 fake[1].vertices=new Float32Array(fake[1].vertices);
 fake[1].vertices[0]+=100;
 assert.throws(()=>createMockNativeFarRollback({gl,original:fake,
  desired:originals,retainedKeys:originals.slice(0,3).map(x=>x.key),world,gate}),/SOURCE_ORDER/);
});
test('after successful staging, external invalidation of staged handle blocks commit',()=>{
 const {gl,gate,make}=setup();const t=make(3);assert.equal(t.run().status,'ready-for-world-commit');
 const entry=[...gl.live.keys()].at(-1);gl.deleteBuffer(entry);
 assert.equal(t.confirmWorld({id:'w291',revision:19,saveVerified:true}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});
test('after successful staging, context loss before confirmation blocks commit',()=>{
 const {gl,gate,make}=setup();const t=make(3);t.run();gl.contextLost=true;
 assert.equal(t.confirmWorld({id:'w291',revision:19,saveVerified:true}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});
test('external draw-gate tampering prevents confirmation and leaves transaction blocked',()=>{
 const {gate,make}=setup();const t=make(3);t.run();gate.unblock();
 const s=t.confirmWorld({id:'w291',revision:19,saveVerified:true});
 assert.equal(s.status,'blocked');assert.equal(s.drawBlocked,true);
 assert.equal(gate.isBlocked(),true);
});
test('invalid new-world commit revision cannot unblock prior native buffers',()=>{
 const {gate,make}=setup();const t=make(3);t.run();
 assert.equal(t.confirmWorld({id:'w291',revision:20,saveVerified:true}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});
test('commit requires explicit save attestation even after mocked GL success',()=>{
 const {gate,make}=setup();const t=make(3);t.run();
 assert.equal(t.confirmWorld({id:'w291',revision:19,saveVerified:false}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});
test('rollback requires explicit original world state, not unverified flag',()=>{
 const {gl,gate,make}=setup();gl.injectedFailure={at:gl.bufferDatas+1};
 const t=make(3);assert.equal(t.run().status,'old-gpu-restored-awaiting-world-rollback');
 assert.equal(t.confirmWorld({id:'w291',revision:18,editRolledBack:false}).status,'blocked');
 assert.equal(gate.isBlocked(),true);
});
test('failed renderer draw-gate initialization stops before deleting native buffer',()=>{
 const {gl,gate,originals,world}=setup();const owned=gl.live.size;
 const badGate={...gate,block(){throw Error('cannot-block-render-loop')},isBlocked(){return false}};
 const t=createMockNativeFarRollback({gl,original:originals,
  desired:originals.map(x=>({key:x.key,vertices:vert(60)})),
  retainedKeys:[],world,gate:badGate});
 assert.throws(()=>t.run(),/cannot-block/);assert.equal(gl.live.size,owned);
});
test('post-check fault does not change original upload function source or numeric code semantics',()=>{
 const {gl,make}=setup();gl.injectedFailure={at:gl.bufferDatas+1};
 const s=make(3).run();assert.match(s.reason,/1285/);
 assert.equal(gl.OUT_OF_MEMORY,1285);
 const mandatory=gl.history.filter(x=>x==='getError').length;
 assert.ok(mandatory>=2);
});
test('caller mutation of source vertex arrays after creation cannot alter upload snapshot',()=>{
 const {gl,gate,originals,world}=setup();const target=originals.map((x,i)=>({key:x.key,vertices:i===3?vert(71):x.vertices}));
 const t=createMockNativeFarRollback({gl,original:originals,desired:target,
  retainedKeys:originals.slice(0,3).map(x=>x.key),world,gate});
 target[3].vertices.fill(12345);const s=t.run();assert.equal(s.status,'ready-for-world-commit');
 const newest=[...gl.live.values()].at(-1).data;
 assert.equal(newest[0],71);assert.notEqual(newest[0],12345);
});
test('test-only native adapter excludes real renderer even when it has production GL methods',()=>{
 const {gl,gate,originals,world}=setup();
 gl.__mythwrought291MockOnly=false;
 assert.throws(()=>createMockNativeFarRollback({gl,original:originals,desired:originals,
  retainedKeys:originals.map(x=>x.key),world,gate}),/MOCK_ONLY/);
});
