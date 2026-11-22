import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const file=new URL('./webgl2-preview.mjs',import.meta.url);
const source=readFileSync(file,'utf8');
const expectedDirections=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

test('source-exact candidate WebGL2 module passes real Node ECMAScript syntax check',()=>{
  execFileSync(process.execPath,['--check',file.pathname],{stdio:'pipe'});
});
test('WebGL2 full-cube and candidate AABB face arrays use four outward-wound vertices each',()=>{
  const start=source.indexOf('const FACES=');
  const end=source.indexOf('\n];',start)+3;
  assert.ok(start>=0&&end>start);
  const faces=new Function(source.slice(start,end)+'\nreturn FACES;')();
  assert.equal(faces.length,6);
  for(let i=0;i<6;i++){
    const [direction,quad]=faces[i];
    assert.deepEqual(direction,expectedDirections[i]);
    assert.equal(quad.length,4,'every face must have exactly four corners');
    const normal=cross(subtract(quad[1],quad[0]),subtract(quad[2],quad[0]));
    assert.deepEqual(normal.map(v=>v===0?0:v),direction,'wrong face orientation / winding');
  }
});
test('WebGL2 reviewer draws reusable instanced shapes and refuses to silently label Canvas2D as GPU',()=>{
  assert.match(source,/getContext\('webgl2'/);
  assert.match(source,/drawArraysInstanced/);
  assert.match(source,/candidatePreviewShape/);
  assert.match(source,/candidateBatchedPreviewBudget/);
  assert.match(source,/if\(!gl\).*WebGL2 context unavailable/);
  assert.match(source,/actualFrameTimeMs:null/);
  assert.match(source,/liveAssetIntegration:false/);
  assert.doesNotMatch(source,/getContext\('2d'/);
});
