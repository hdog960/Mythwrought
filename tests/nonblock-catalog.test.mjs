import assert from 'node:assert/strict';
import test from 'node:test';
import {createCandidateScene,describeCandidateObject,candidateVertices} from '../src/nonblock/candidate-scene.mjs';

const flora = ['low-grass','short-fern','single-wildflower','lavender-spike','heather-sprig',
  'clover-clump','meadow-sedge','button-mushroom','clover-patch','bracken-fern',
  'moss-cushion','clustered-toadstools','exposed-root','fallen-branch','woodland-sapling',
  'woodland-shrub','forest-lichen-patch','forest-moss-mat'].map(name=>'scene48:'+name);
const environments = ['agave-rosette','alpine-wildflower','desert-bloom','desert-scrub','dwarf-juniper',
  'frost-fern','saltgrass','snowgrass','tumblebrush'].map(name=>'nonblock:d:'+name);
const ids = [...flora,...environments,'nonblock:e:pebble-scatter','nonblock:e:cave-rubble-cluster',
  'scene36:rope-coil'];
const seed = 179;

test('ground catalog retains exact producer family IDs and has bounded deterministic meshes',()=>{
  for(const [index,sceneId] of ids.entries()){
    const anchor=[index*2,1,0];
    const layout={sceneId,anchor,variant:1};
    const first=describeCandidateObject(seed,layout);
    const second=describeCandidateObject(seed,layout);
    assert.equal(first.instanceKey,second.instanceKey);
    assert.match(first.instanceKey,new RegExp('^nb1:'+encodeURIComponent(sceneId)+':'));
    assert.deepEqual(first.positions,second.positions);
    assert.ok(first.positions.length>0 && first.positions.length<=256*9,sceneId);
    const vertices=candidateVertices([first]);
    assert.equal(vertices.length,first.positions.length*3);
    assert.ok(vertices.every(Number.isFinite),sceneId);
  }
});

test('every registered ground family uses exact visible triangles and an isolated tombstone',()=>{
  const storage = {
    data:new Map(),
    getItem(key){return this.data.get(key)??null;},
    setItem(key,value){this.data.set(key,value);},
    removeItem(key){this.data.delete(key);}
  };
  const layout=ids.map((sceneId,index)=>({sceneId,anchor:[index*3,1,0],variant:1}));
  const create = ()=>createCandidateScene(seed,'legacy',layout,{
    storage,blockAt:(_x,y)=>y===0,voxelPick:()=>null});
  const scene=create();
  for(const [index,placement] of layout.entries()){
    const object=describeCandidateObject(seed,placement);
    const eye=[placement.anchor[0]+1.3,2.68,-1];
    let hit, facing;
    for(let i=0;i<object.positions.length;i+=9) {
      const p=object.positions;
      facing=eye.map((n,j)=>(p[i+j]+p[i+3+j]+p[i+6+j])/3-n);
      hit=scene.pick(eye,facing);
      if(hit?.instanceKey===object.instanceKey) break;
    }
    assert.equal(hit?.instanceKey,object.instanceKey,placement.sceneId);
    assert.equal(scene.breakHit(hit,eye,facing),true,placement.sceneId);
    assert.equal(scene.visible().length,layout.length-index-1);
  }
  assert.deepEqual(create().visible(),[]);
});
