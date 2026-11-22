import test from 'node:test';
import assert from 'node:assert/strict';
import {createOpaqueNearVaoRenderer,NEAR_OPAQUE_LAYOUT,NEAR_OPAQUE_VAO_LIMIT} from './opaque-near-vao.mjs';
import {uploadChunkBuffer} from '../../src/gpu-recovery.mjs';
const A={atPos:1,atColor:2,atUv:3,atMat:4};
const chunks=n=>Array.from({length:n},(_,i)=>({buffer:{id:i},count:6*(i+1)}));
function gl({vao=true,nullVao=false,throwDraw=false,throwPointer=false}={}){
 const root={a:new Map(),e:new Set()},g={FLOAT:5126,ARRAY_BUFFER:34962,TRIANGLES:4,STATIC_DRAW:35044,
 NO_ERROR:0,root,active:root,vaos:new Set(),bound:null,draws:[],calls:{ptr:0,bind:0,create:0,delete:0,error:0},
 bindBuffer(_,b){this.bound=b;this.calls.bind++;},
 enableVertexAttribArray(i){this.active.e.add(i);},
 vertexAttribPointer(i,size,_,norm,stride,offset){this.calls.ptr++;
   if(throwPointer&&this.active!==root){throwPointer=false;throw Error('setup-injected');}
   this.active.a.set(i,{id:this.bound?.id,size,norm,stride,offset});},
 drawArrays(_,first,count){if(throwDraw){throwDraw=false;throw Error('draw-injected');}
   this.draws.push({first,count,a:Object.values(A).map(i=>({enabled:this.active.e.has(i),...this.active.a.get(i)}))});},
 getError(){this.calls.error++;return this.NO_ERROR;},
 createBuffer(){return {id:99+this.calls.create};},
 bufferData(){},deleteBuffer(){}
 };if(vao)Object.assign(g,{
 createVertexArray(){this.calls.create++;if(nullVao)return null;
  const a={a:new Map(),e:new Set()};this.vaos.add(a);return a;},
 bindVertexArray(o){this.active=o||root;},
 deleteVertexArray(o){this.calls.delete++;this.vaos.delete(o);}
 });Object.values(A).forEach(i=>g.enableVertexAttribArray(i));return g;
}
function original(g,l){for(const c of l){g.bindBuffer(g.ARRAY_BUFFER,c.buffer);
 for(const [i,size,offset] of [[A.atPos,3,0],[A.atColor,3,12],[A.atUv,2,24],[A.atMat,1,32]])
 g.vertexAttribPointer(i,size,g.FLOAT,false,36,offset);
 g.drawArrays(g.TRIANGLES,0,c.count);}}
function parity(list,options={}){const b=gl(),c=gl(options),r=createOpaqueNearVaoRenderer(c);
 original(b,list);r.render(list,A);
 assert.deepEqual(c.draws,b.draws);assert.equal(c.active,c.root);
 assert.deepEqual([...c.root.a],[...b.root.a]);assert.equal(c.bound,b.bound);
 assert.equal(c.calls.error,0);return {b,c,r};}
for(const n of [0,1,2,5,25,27,34])test('exact source draw state '+n+' chunks',()=>{
 const {c}=parity(chunks(n));assert.equal(c.calls.create,n);
});
test('exact 9-float original layout',()=>assert.deepEqual(
 NEAR_OPAQUE_LAYOUT.map(x=>[x.name,x.size,x.offset]),
 [['atPos',3,0],['atColor',3,12],['atUv',2,24],['atMat',1,32]]));
test('27 warm chunks reduce 108 original attrib calls to 4',()=>{
 const l=chunks(27),b=gl(),c=gl(),r=createOpaqueNearVaoRenderer(c);
 original(b,l);r.render(l,A);let old=b.calls.ptr,now=c.calls.ptr;
 original(b,l);const x=r.render(l,A);
 assert.equal(b.calls.ptr-old,108);assert.equal(c.calls.ptr-now,4);
 assert.equal(x.frameHits,27);assert.deepEqual(c.draws,b.draws);
});
test('reverse insertion draw order preserved',()=>parity(chunks(7).reverse()));
test('later far/water default vertex-array state remains same',()=>{
 const l=chunks(25),b=gl(),c=gl(),r=createOpaqueNearVaoRenderer(c);
 original(b,l);r.render(l,A);original(b,chunks(2));original(c,chunks(2));
 assert.deepEqual(c.draws,b.draws);
});
test('new buffer evicts old VAO',()=>{
 const l=chunks(3),c=gl(),r=createOpaqueNearVaoRenderer(c);r.render(l,A);
 l[1]={...l[1],buffer:{id:42}};r.render(l,A);
 assert.equal(c.vaos.size,3);assert.equal(c.calls.delete,1);
});
test('immediate forget before original buffer delete',()=>{
 const l=chunks(2),c=gl(),r=createOpaqueNearVaoRenderer(c);r.render(l,A);
 assert.equal(r.forgetBuffer(l[0].buffer),true);
 assert.equal(r.forgetBuffer(l[0].buffer),false);assert.equal(c.vaos.size,1);
});
test('streaming evicts inactive resident VAOs',()=>{
 const l=chunks(34),c=gl(),r=createOpaqueNearVaoRenderer(c);
 r.render(l,A);r.render(l.slice(10),A);assert.equal(c.vaos.size,24);
});
test('bounded cache above quota falls back to original drawing',()=>{
 const l=chunks(34),c=gl(),b=gl(),r=createOpaqueNearVaoRenderer(c,{maxEntries:3});
 original(b,l);const s=r.render(l,A);assert.deepEqual(c.draws,b.draws);
 assert.equal(s.frameFallbacks,31);
});
test('VAO unsupported falls back without skipped geometry',()=>parity(chunks(4),{vao:false}));
test('VAO allocation returns null and source falls back',()=>parity(chunks(4),{nullVao:true}));
test('context loss forbids drawing and invalid-object deletion',()=>{
 const c=gl(),r=createOpaqueNearVaoRenderer(c),l=chunks(3);r.render(l,A);
 r.resetForLostContext();assert.equal(c.calls.delete,0);
 assert.equal(r.forgetBuffer(l[0].buffer),false);
 assert.throws(()=>r.render(l,A),/LOST_CONTEXT/);
 r.restored();assert.equal(r.render(l,A).frameCreates,3);
});
test('attribute program relocation rebuilds VAOs',()=>{
 const l=chunks(2),c=gl(),r=createOpaqueNearVaoRenderer(c);r.render(l,A);
 r.render(l,{atPos:5,atColor:6,atUv:7,atMat:8});
 assert.equal(c.calls.delete,2);
});
test('partial VAO setup failure restores default and disposes incomplete VAO',()=>{
 const c=gl({throwPointer:true}),r=createOpaqueNearVaoRenderer(c);
 assert.throws(()=>r.render(chunks(1),A),/setup-injected/);
 assert.equal(c.active,c.root);assert.equal(c.vaos.size,0);
});
test('draw exception propagates without reordering or double draw',()=>{
 const c=gl({throwDraw:true}),r=createOpaqueNearVaoRenderer(c);
 assert.throws(()=>r.render(chunks(2),A),/draw-injected/);
 assert.equal(c.draws.length,0);assert.equal(c.active,c.root);
});
test('invalid chunk and duplicate attributes fail closed',()=>{
 const c=gl(),r=createOpaqueNearVaoRenderer(c);
 assert.throws(()=>r.render([{count:3}],A),/INVALID_ORIGINAL_CHUNK/);
 assert.throws(()=>r.render(chunks(1),{...A,atMat:1}),/DUPLICATE/);
});
test('budget and integer validation',()=>{
 assert.equal(NEAR_OPAQUE_VAO_LIMIT,34);
 for(const maxEntries of [0,-1,35,1.5])assert.throws(
 ()=>createOpaqueNearVaoRenderer(gl(),{maxEntries}),/BAD_GPU_OR_LIMITS/);
});
test('dispose releases cached VAOs',()=>{
 const c=gl(),r=createOpaqueNearVaoRenderer(c),l=chunks(3);
 r.render(l,A);r.dispose();assert.equal(c.vaos.size,0);
});
test('original zero-count draw remains a draw',()=>{
 const l=chunks(2);l[0].count=0;
 assert.equal(parity(l).c.draws.length,2);
});
test('original guarded uploader keeps exactly two original getError calls per upload',()=>{
 const c=gl(),r=createOpaqueNearVaoRenderer(c);
 const buffer=uploadChunkBuffer(c,new Float32Array(9));assert.equal(c.calls.error,2);
 r.render([{buffer,count:3}],A);assert.equal(c.calls.error,2);
 uploadChunkBuffer(c,new Float32Array(9));assert.equal(c.calls.error,4);
});
