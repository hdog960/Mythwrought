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
 assert.ok(a.length<=16*16*4*8*3*9);
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
 // Tall exposed walls carry six bedding triangles plus two talus triangles.
 assert.equal(vertices.length%(8*3*9),0);
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

test('talus foothill details require a real exposed stone foot and open approach',()=>{
 const baseline=ridgeStrataVertices(make(),-1,0,{heightAt});
 assert.ok(baseline.length>0);
 const filled=new Map();
 for(let z=0;z<16;z++)filled.set('0,7,'+z,3);
 const blocked=ridgeStrataVertices(make(filled),-1,0,{heightAt});
 assert.ok(blocked.length<baseline.length,'filled approach suppresses talus');
 const short=ridgeStrataVertices(make(),-1,0,{heightAt:(x,z)=>x<0?11:8});
 assert.ok(short.length<baseline.length,'short cliff has no lower talus');
 assert.equal(baseline.length%(8*27),0,'eight triangles per eligible tall face');
});

test('tall highland adds a second tier only where its face remains open',()=>{
 const tall=(x,z)=>x<0?15:6;
 const world={seed:179,get(x,y,z){return x<0&&y<=15?3:0;}};
 const original=ridgeStrataVertices(world,-1,0,{heightAt:tall});
 assert.ok(original.length>0);
 // Each eligible face has eight base triangles, two upper-tier triangles and two crest fractures.
 assert.equal(original.length%(12*27),0);
 const edits=new Map();
 for(let z=0;z<16;z++)edits.set('0,8,'+z,3);
 const modified={seed:179,get(x,y,z){
   const k=[x,y,z].join(',');
   return edits.has(k)?edits.get(k):(x<0&&y<=15?3:0);
 }};
 const after=ridgeStrataVertices(modified,-1,0,{heightAt:tall});
 assert.ok(after.length<original.length,'upper band must respect filled exterior edits');
 assert.deepEqual(ridgeStrataVertices(modified,-1,0,{heightAt:tall}),after);
 assert.equal(edits.size,16,'render-only art never mutates saved edits');
});

test('crest fractures appear only on tall exposed stone and respect exterior edits',()=>{
 const tall=(x,z)=>x<0?15:6;
 const edits=new Map();
 const world={seed:179,get(x,y,z){
  const key=[x,y,z].join(',');
  return edits.has(key)?edits.get(key):(x<0&&y<=15?3:0);
 }};
 const before=ridgeStrataVertices(world,-1,0,{heightAt:tall});
 assert.ok(before.length>0);
 for(let z=0;z<16;z++)edits.set('0,9,'+z,3);
 const after=ridgeStrataVertices(world,-1,0,{heightAt:tall});
 assert.ok(after.length<before.length,'closed crest exterior hides fracture');
 assert.deepEqual(ridgeStrataVertices(world,-1,0,{heightAt:tall}),after);
 assert.equal(edits.size,16,'saved world edits are never mutated');
});

test('valley contour seams follow real exposed dirt and disappear after edits',()=>{
 const heights=(x,z)=>x<0?8:6;
 const edits=new Map();
 const world={seed:179,get(x,y,z){
   const key=[x,y,z].join(',');
   if(edits.has(key))return edits.get(key);
   const h=heights(x,z);
   return y>h?0:y===h?1:y>=h-3?2:3;
 }};
 const before=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.ok(before.length>0,'exposed valley-facing slope must have visible contours');
 assert.equal(before.length%9,0);
 assert.ok(before.length<=16*16*4*12*27,'bounded mobile geometry');
 assert.deepEqual(before,ridgeStrataVertices(world,-1,0,{heightAt:heights}));
 for(let z=0;z<16;z++)edits.set('0,7,'+z,3);
 const blocked=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.equal(blocked.length,0,'placed blocks cover contour seams');
 assert.equal(edits.size,16,'rendering never rewrites edits');
 const flat=ridgeStrataVertices(world,-1,0,{heightAt:()=>8});
 assert.equal(flat.length,0,'flat ground has no valley contour');
});

test('steep grass valleys receive continuous sediment terraces without changing edits',()=>{
 const heights=(x,z)=>x<0?12:7;
 const edits=new Map();
 const world={seed:179,get(x,y,z){
  const key=[x,y,z].join(',');
  if(edits.has(key))return edits.get(key);
  const h=heights(x,z);
  return y>h?0:y===h?1:y>=h-3?2:3;
 }};
 const original=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.ok(original.length>0,'steep valley should have terrain bands');
 assert.deepEqual(original,ridgeStrataVertices(world,-1,0,{heightAt:heights}));
 const highYs=[];
 for(let i=0;i<original.length;i+=9)highYs.push(original[i+1]);
 assert.ok(highYs.some(y=>y>10&&y<11),'terrace must follow exposed dirt at y=top-2');
 for(let z=0;z<16;z++)edits.set('0,10,'+z,3);
 const blocked=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.ok(blocked.length<original.length,'covering terrace exterior hides bands');
 assert.equal(edits.size,16,'decorations never rewrite saved edits');
 const flat=ridgeStrataVertices(world,-1,0,{heightAt:()=>12});
 assert.equal(flat.length,0,'no fake terraces on flat terrain');
});

test('amphitheatre contour tiers trace exposed valley dirt and honor saved wall edits',()=>{
 const heights=(x,z)=>x<0?13:7;
 const edits=new Map();
 const world={seed:179,get(x,y,z){
  const key=[x,y,z].join(',');
  if(edits.has(key))return edits.get(key);
  const h=heights(x,z);
  return y>h?0:y===h?1:y>=h-3?2:3;
 }};
 const original=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.ok(original.length>0);
 const levels=new Set();
 for(let i=0;i<original.length;i+=9)levels.add(Math.floor(original[i+1]));
 assert.ok(levels.has(11)&&levels.has(10),'two distinct dirt depths receive contours');
 assert.deepEqual(original,ridgeStrataVertices(world,-1,0,{heightAt:heights}));
 for(let z=0;z<16;z++){edits.set('0,11,'+z,3);edits.set('0,10,'+z,3);}
 const covered=ridgeStrataVertices(world,-1,0,{heightAt:heights});
 assert.ok(covered.length<original.length,'covering the approach suppresses bands');
 assert.equal(edits.size,32);
 assert.equal(ridgeStrataVertices(world,-1,0,{heightAt:()=>13}).length,0);
 assert.ok(original.length<16*16*4*20*27,'mobile geometry remains bounded');
});
