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
 assert.ok(a.length<=16*16*4*54*9);
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

test('connected shale shoulders add distinct lower bands without fake cave faces',()=>{
 const world=make(),vertices=ridgeStrataVertices(world,-1,0,{heightAt});
 assert.ok(vertices.length>0);
 // Each eligible exposed wall receives six triangles (three original, three
 // connected shoulder); the geometry remains in the original 9-float format.
 assert.equal(vertices.length%(6*3*9),0);
 const ys=[],colors=new Set();
 for(let i=0;i<vertices.length;i+=9){
   ys.push(vertices[i+1]);
   colors.add([vertices[i+3],vertices[i+4],vertices[i+5]].join(','));
 }
 assert.ok(Math.max(...ys)-Math.min(...ys)>.6,'layered wall should have vertical depth');
 assert.ok(colors.size>=4,'separate shale, shadow and mineral bands');
 const hidden={seed:179,get(){return 3;}};
 assert.equal(ridgeStrataVertices(hidden,-1,0,{heightAt}).length,0,'no face artwork behind filled rock');
});
