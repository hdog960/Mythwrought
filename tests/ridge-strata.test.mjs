import test from 'node:test';
import assert from 'node:assert/strict';
import {ridgeStrataVertices} from '../src/ridge-strata.mjs';
const heightAt=(x,z)=>x<0?11:6;
const make=(edits=new Map())=>({seed:179,get(x,y,z){const k=[x,y,z].join(',');if(edits.has(k))return edits.get(k);return x<0&&y<=11?3:0;}});
test('real exposed highland wall gains bounded deterministic face strata',()=>{
 const world=make(),a=ridgeStrataVertices(world,-1,0,{heightAt});
 const b=ridgeStrataVertices(world,-1,0,{heightAt});
 assert.ok(a.length>0,'expected a visible escarpment');
 assert.deepEqual(a,b);
 assert.equal(a.length%9,0);
 assert.ok(a.length<=16*16*4*27*9);
 for(let i=0;i<a.length;i++)assert.ok(Number.isFinite(a[i]));
});
test('a filled approach hides geological face art without changing edits',()=>{
 const edits=new Map(),world=make(edits);
 const a=ridgeStrataVertices(world,-1,0,{heightAt});
 for(let z=0;z<16;z++)edits.set('0,7,'+z,3);
 const b=ridgeStrataVertices(world,-1,0,{heightAt});
 assert.ok(b.length<a.length);
 assert.equal(edits.size,16);
});
test('no false cliffs on lowland or shallow transitions',()=>{
 const a=ridgeStrataVertices(make(),0,0,{heightAt:()=>7});
 assert.equal(a.length,0);
});
