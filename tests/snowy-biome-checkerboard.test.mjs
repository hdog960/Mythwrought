import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK,meshChunk} from '../src/voxel.mjs';
import {M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';

// Synthetic world only: no saved world, profile, biome distribution, or
// placement rules are changed. This probes the actual exposed WebGL mesh data.
const ICE=276;
const CAP=272;
function snowFixture(generator,{playerEdited=false}={}){
  const edits=new Map();
  if(playerEdited)
    for(let x=4;x<12;x++)for(let z=4;z<12;z++)
      edits.set(x+',3,'+z,ICE);
  return {
    seed:179,generationProfile:{generator},edits,
    get(x,y,z){
      if(x<0||x>=16||z<0||z>=16)return BLOCK.AIR;
      if(y===2)return BLOCK.STONE;
      if(y===3)return x>=4&&x<12&&z>=4&&z<12?ICE:CAP;
      return BLOCK.AIR;
    }
  };
}
function interiorTopVertices(world){
  const mesh=meshChunk(world,0,0),result=[];
  for(let i=0;i<mesh.length;i+=9){
    const [x,y,z]=[mesh[i],mesh[i+1],mesh[i+2]];
    // Exclude material borders: sample only the middle of the blue ice patch.
    if(y===4&&x>=5&&x<=11&&z>=5&&z<=11)
      result.push({r:mesh[i+3],g:mesh[i+4],b:mesh[i+5],material:mesh[i+8]});
  }
  return result;
}
test('natural M7 glacier ice is smoothly tinted instead of checkerboard palette sampled',()=>{
  const samples=interiorTopVertices(snowFixture(M7_ENVIRONMENT_GENERATOR));
  const ice=samples.filter(v=>v.material===41);
  assert.ok(ice.length>30,'Expected genuine exposed blue-ice top-face vertices');
  const reds=ice.map(v=>v.r);
  assert.ok(Math.max(...reds)-Math.min(...reds)<.18,
    'Natural blue ice should have smooth world-space shade, not random per-cell blues/whites');
});
test('older V6 profiles keep their original glacier shading',()=>{
  const samples=interiorTopVertices(snowFixture(M6_BALANCED_GENERATOR));
  assert.ok(samples.length>30);
  assert.equal(samples.some(v=>v.material===41),false);
});
test('player-edited blue ice retains ordinary block palette shading',()=>{
  const samples=interiorTopVertices(snowFixture(M7_ENVIRONMENT_GENERATOR,{playerEdited:true}));
  assert.ok(samples.length>30);
  assert.equal(samples.some(v=>v.material===41),false);
});
