import assert from 'node:assert/strict';
import test from 'node:test';
import {biome130Color} from '../src/biome130-registry.mjs';
import {M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk,worldKey} from '../src/voxel.mjs';

function surface(id,{generator=M7_ENVIRONMENT_GENERATOR,edited=false,cx=0}={}){
  const world={
    seed:179,generationProfile:generator?{generator}:null,
    edits:new Map(edited?[[worldKey(0,8,0),id]]:[]),
    get:(x,y,z)=>y===8&&x>=0&&x<=17&&z>=0&&z<3?id:0
  };
  return meshChunk(world,cx,0);
}

function colorsAt(mesh,x,y,z){
  const colors=new Set();
  for(let i=0;i<mesh.length;i+=9){
    if(mesh[i]===x&&mesh[i+1]===y&&mesh[i+2]===z)
      colors.add([...mesh.slice(i+3,i+6)].map(value=>value.toFixed(6)).join(','));
  }
  return colors;
}

test('natural profiled desert faces share color at an interior grid corner',()=>{
  const mesh=surface(256);
  assert.equal(colorsAt(mesh,1,9,1).size,1);
  assert.notDeepEqual(colorsAt(mesh,1,9,1),colorsAt(mesh,12,9,1),
    'continuous terrain should still have spatial variation');
});

test('terrain texture coordinates remain in world space at adjacent chunk edges',()=>{
  for(const cx of [0,1]){
    const mesh=surface(256,{cx});
    const coordinates=[];
    for(let i=0;i<mesh.length;i+=9)
      if(mesh[i]===16&&mesh[i+1]===9&&mesh[i+2]===1)
        coordinates.push([...mesh.slice(i+6,i+9)]);
    assert.ok(coordinates.length>0);
    assert.deepEqual(coordinates,[...coordinates].fill([16,1,40]));
  }
});

test('legacy and player-placed biome materials keep their authored palette',()=>{
  const natural=surface(256),legacy=surface(256,{generator:null}),edited=surface(256,{edited:true});
  const authored=biome130Color(256,0,8,0,2).map(value=>value.toFixed(6)).join(',');
  assert.ok(colorsAt(legacy,1,9,1).has(authored));
  assert.deepEqual(surface(256,{generator:M6_BALANCED_GENERATOR}),legacy);
  assert.ok(colorsAt(edited,1,9,1).has(authored));
  assert.ok(!colorsAt(natural,1,9,1).has(authored));
});

test('a partial cliff block leaves the exposed part of its neighboring stone wall',()=>{
  function sharedFaces(neighbor){
    const mesh=meshChunk({seed:179,generationProfile:{generator:M7_ENVIRONMENT_GENERATOR},get:(x,y,z)=>{
      if(y!==8||z!==0)return 0;
      return x===0?3:x===1?neighbor:0;
    }},0,0);
    let count=0;
    for(let i=0;i<mesh.length;i+=27){
      if(mesh[i]===1&&mesh[i+9]===1&&mesh[i+18]===1&&mesh[i+8]===3)count++;
    }
    return count;
  }
  assert.equal(sharedFaces(302),2);
  assert.equal(sharedFaces(256),0);
});
