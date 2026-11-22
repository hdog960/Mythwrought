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
  // meshChunk emits TRIANGLES: selecting individual y=4 vertices also pulls
  // in vertical side faces whose upper corners reach y=4. Those faces have
  // different intentional face lighting. Only compare planar, upward faces.
  assert.equal(mesh.length%27,0,'Expected genuine 3-vertex mesh triangles');
  for(let i=0;i<mesh.length;i+=27){
    const offsets=[i,i+9,i+18];
    if(!offsets.every(k=>mesh[k+1]===4&&
        mesh[k]>=5&&mesh[k]<=11&&mesh[k+2]>=5&&mesh[k+2]<=11))continue;
    for(const k of offsets)
      result.push({r:mesh[k+3],g:mesh[k+4],b:mesh[k+5],material:mesh[k+8]});
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

function topFlatSurface(world,{minX,maxX,minZ,maxZ}){
  const mesh=meshChunk(world,0,0),samples=[];
  assert.equal(mesh.length%27,0);
  for(let i=0;i<mesh.length;i+=27){
    const offsets=[i,i+9,i+18];
    if(offsets.every(k=>mesh[k+1]===4&&mesh[k]>=minX&&mesh[k]<=maxX&&
        mesh[k+2]>=minZ&&mesh[k+2]<=maxZ))
      for(const k of offsets)samples.push({r:mesh[k+3],g:mesh[k+4],b:mesh[k+5],
        material:mesh[k+8]});
  }
  return samples.filter(v=>v.material===41);
}
const mean=(items,key)=>items.reduce((sum,v)=>sum+v[key],0)/items.length;
function internalBlueIceSideTriangles(world){
  const mesh=meshChunk(world,0,0);let count=0;
  for(let i=0;i<mesh.length;i+=27){
    const offsets=[i,i+9,i+18],plane=offsets.map(k=>[mesh[k],mesh[k+1],mesh[k+2]]);
    if(plane.every(([x,y,z])=>x===4&&y>=3&&y<=4&&z>=5&&z<=11)&&
       plane.some(([,y])=>y===3)&&plane.some(([,y])=>y===4))count++;
  }
  return count;
}
test('M7 natural blue ice cap uses snow-dusted tint with no harsh adjacent blue/white contrast',()=>{
  const world=snowFixture(M7_ENVIRONMENT_GENERATOR);
  const ice=topFlatSurface(world,{minX:5,maxX:11,minZ:5,maxZ:11});
  const snow=topFlatSurface(world,{minX:1,maxX:3,minZ:5,maxZ:11});
  assert.ok(ice.length>30&&snow.length>20,'Expected genuine ice and snow top-face triangles');
  // Adjacent cap blocks are physical distinct materials, but a natural frozen
  // landscape must not become a saturated-blue/white tiled chessboard.
  // This checks RGB contrast of actual source mesh, not a text-code assertion.
  const gap=Math.max(...['r','g','b'].map(c=>Math.abs(mean(ice,c)-mean(snow,c))));
  assert.ok(gap<.075,'Adjacent natural glacier and snow cap colors contrast too sharply: '+gap);
});
test('M7 culls internal ice/snow side walls while old profiles and edited ice retain authored geometry',()=>{
  const natural=snowFixture(M7_ENVIRONMENT_GENERATOR);
  assert.equal(internalBlueIceSideTriangles(natural),0,
    'Opaque natural M7 snow and glacier must not expose internal checker tile walls');
  const older=snowFixture(M6_BALANCED_GENERATOR),edited=snowFixture(M7_ENVIRONMENT_GENERATOR,{playerEdited:true});
  assert.ok(internalBlueIceSideTriangles(older)>0,
    'Older V6 ice translucency must remain unchanged');
  assert.ok(internalBlueIceSideTriangles(edited)>0,
    'Player-edited ice translucency must remain unchanged');
});
