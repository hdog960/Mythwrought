import test from 'node:test';import assert from 'node:assert/strict';
import {mountainV8Material,mountainV8FoliageFaceCovered} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {meshChunk,BLOCK} from '../../src/voxel.mjs';
import {meshDepthSection} from '../../src/depth-mesh.mjs';
test('layered dedicated crown forms continuous symmetric cell contacts, never culls a different ID or uncovered underside',()=>{
 const b=mountainV8Material(512).boxes;
 assert.equal(b.length,4);assert.deepEqual(b[0],[0,0,0,1,.34,1]);
 for(let i=1;i<b.length;i++){
  assert.equal(b[i][1],b[i-1][4]);assert.ok(b[i][0]>=b[i-1][0]&&b[i][2]>=b[i-1][2]&&b[i][3]<=b[i-1][3]&&b[i][5]<=b[i-1][5]);
  assert.ok(Math.abs(b[i][0]+b[i][3]-1)<1e-9&&Math.abs(b[i][2]+b[i][5]-1)<1e-9);
 }
 assert.equal(b.at(-1)[4],1);
 for(const [x,y,z] of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0]])assert.equal(mountainV8FoliageFaceCovered(512,512,x,y,z),true);
 assert.equal(mountainV8FoliageFaceCovered(512,512,0,-1,0),false);
 for(const other of [0,3,370,379,511])assert.equal(mountainV8FoliageFaceCovered(512,other,1,0,0),false);
 assert.equal(mountainV8Material(512).solid,false);
});
test('actual surface renderer emits fewer triangles for joined needle cells than separate ones',()=>{
 const pair=(joined)=>({seed:179,get(x,y,z){return y===10&&z===8&&(x===6||x===(joined?7:10))?512:BLOCK.AIR;}});
 const a=meshChunk(pair(true),0,0),b=meshChunk(pair(false),0,0);
 assert.ok(a.length>0&&a.length<b.length);assert.equal(a.length%9,0);
 console.log('joined vs separated leaf mesh vertices',a.length/9,b.length/9);
});
