import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareWaterShade as prepare,evaluateWaterShade as evaluate,WATER_SHADING_DEFAULTS as policy,WATER_VERTEX_GLSL,WATER_FRAGMENT_GLSL} from '../../../src/liquids/water/content/water-shading.mjs';
import {WATER_MATERIAL} from '../../../src/liquids/water/content/material.mjs';
const surface=(foamMask=0,fallMask=0,exposedTop=true)=>({foamMask,fallMask,exposedTop,foamStrength:.45});
const top=[0,1,0],side=[1,0,0],bottom=[0,-1,0];
const close=(a,b)=>a.forEach((n,i)=>assert.ok(Math.abs(n-b[i])<1e-9,`${n} != ${b[i]}`));
test('calm top preserves material and alpha exactly',()=>close(evaluate(prepare({normal:top}),[.4,.5,.6]),[...WATER_MATERIAL.color,WATER_MATERIAL.alpha]));
test('all four foam bits select only the corresponding top edge',()=>{
  const positions=[[.98,.5,.5],[.5,.5,.98],[.02,.5,.5],[.5,.5,.02]];
  for(let i=0;i<4;i++){
    const s=prepare({normal:top,surface:surface(1<<i)});
    for(let j=0;j<4;j++){
      const expected=WATER_MATERIAL.color.map(c=>i===j?c+(1-c)*.45:c);
      close(evaluate(s,positions[j]),[...expected,.65]);
    }
    close(evaluate(s,[.5,.5,.5]),[...WATER_MATERIAL.color,.65]);
  }
});
test('covered tops and side/bottom faces never receive foam',()=>{
  for(const n of [side,bottom,top]){
    const a=prepare({normal:n,surface:surface(15,0,false)}),b=prepare({normal:n});
    close(evaluate(a,[.02,.5,.02]),evaluate(b,[.02,.5,.02]));
  }
  assert.equal(prepare({normal:side,surface:surface(15)}).foamMask,0);
});
test('fall stripes apply only to matching outward side and never alter alpha',()=>{
  for(const [i,n] of [[0,[1,0,0]],[1,[0,0,1]],[2,[-1,0,0]],[3,[0,0,-1]]]){
    const s=prepare({normal:n,surface:surface(0,1<<i)}),calm=prepare({normal:n});
    const p=[.125,0,.125];assert.ok(evaluate(s,p)[0]>evaluate(calm,p)[0]);
    assert.equal(evaluate(s,p)[3],.65);
    assert.equal(prepare({normal:n,surface:surface(0,1<<((i+1)%4))}).fallStrength,0);
  }
});
test('integer local origin changes preserve periodic shading including negative sections',()=>{
  for(const n of [top,side]){const s=prepare({normal:n,surface:surface(15,15)});
    close(evaluate(s,[.03125,.5,.125]),evaluate(s,[-15.96875,17.5,16.125]));}
});
test('defaults are reversible and preserve the existing blend contract',()=>{
  const p={...policy,fallStrength:0,sideShade:1,bottomShade:1};
  close(evaluate(prepare({normal:side,surface:surface(15,15),policy:p}),[.125,0,.125]),[...WATER_MATERIAL.color,.65]);
  assert.equal(WATER_MATERIAL.depthWrite,false);assert.equal(WATER_MATERIAL.blend,'straight-alpha');
  assert.ok(Object.isFrozen(prepare({normal:side}).base));
});
test('malformed signals, normals and policies fail closed',()=>{
  for(const options of [{normal:[1,1,0]},{normal:top,surface:surface(16)},{normal:top,surface:{...surface(),foamStrength:NaN}},{normal:top,policy:{...policy,foamWidth:0}}])assert.throws(()=>prepare(options));
  assert.throws(()=>evaluate(prepare({normal:top}),[NaN,0,0]));
});
test('shader exports are WebGL2 source with unchanged geometry attribute and straight alpha output',()=>{
  assert.match(WATER_VERTEX_GLSL,/^#version 300 es/);assert.match(WATER_VERTEX_GLSL,/layout\(location=0\) in vec3 position/);
  assert.match(WATER_FRAGMENT_GLSL,/^#version 300 es/);assert.match(WATER_FRAGMENT_GLSL,/base\.a/);assert.doesNotMatch(WATER_FRAGMENT_GLSL,/gl_FragDepth|discard/);
});
