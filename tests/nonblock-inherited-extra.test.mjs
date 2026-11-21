import assert from 'node:assert/strict';
import test from 'node:test';
import {createCandidateScene,describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const profiles=[
  ['nonblock:d:prickly-pear-cactus','ground',true],
  ['nonblock:d:column-cactus','ground',true],
  ['nonblock:d:icicle-spear','ceiling',true],
  ['nonblock:e:small-stalagmite','ground',true],
  ['nonblock:e:hanging-stalactite','ceiling',true],
  ['nonblock:e:crystal-shard','ground',true],
  ['nonblock:e:branching-crystal-cluster','ground',true],
  ['nonblock:e:geode-opening','wall',true],
  ['nonblock:e:mineral-encrustation','wall',false],
  ['scene36:signpost','ground',true],
  ['scene36:hanging-chain','ceiling',false],
  ['scene36:hanging-cobweb','corner',false]
];

test('remaining original environment and fitting identities retain their real mounting and collision intent',()=>{
  const seed=179;
  const layout=profiles.map(([sceneId,attachment],i)=>({
    sceneId,anchor:[i*4,attachment==='ceiling'?3:1,0],variant:1,
    orientation:['wall','corner'].includes(attachment)?2:0
  }));
  const supports=new Set();
  for(const [i,[,attachment,solid]] of profiles.entries()){
    const object=describeCandidateObject(seed,layout[i]);
    assert.equal(object.colliders.length>0,solid,object.sceneId);
    assert.ok(object.positions.length<=256*9,object.sceneId);
    if(attachment==='corner')assert.equal(object.supports.length,2);
    const [x,y,z]=object.anchor;
    if(attachment==='ground')assert.deepEqual(object.supports[0],[x,y-1,z]);
    if(attachment==='ceiling')assert.deepEqual(object.supports[0],[x,y+1,z]);
    if(attachment==='wall')assert.equal(object.supports[0][2],z+1);
    for(const support of object.supports)supports.add(support.join(','));
  }
  const scene=createCandidateScene(seed,'legacy',layout,{
    storage:{getItem:()=>null},blockAt:(...pos)=>supports.has(pos.join(',')),voxelPick:()=>null
  });
  assert.equal(scene.visible().length,profiles.length);
  for(const object of scene.visible()){
    for(let i=0;i<object.positions.length;i+=9){
      const p=object.positions;
      assert.ok(Array.from(p.slice(i,i+9)).every(Number.isFinite));
    }
  }
  const supported=scene.visible().find(o=>o.sceneId==='scene36:hanging-cobweb');
  supports.delete(supported.supports[1].join(','));
  assert.ok(!scene.visible().some(o=>o.instanceKey===supported.instanceKey));
});

test('refined inherited stone forms restore all eight variants and eliminate degenerate faces',()=>{
  for(const sceneId of ['nonblock:d:icicle-spear','nonblock:e:small-stalagmite',
    'nonblock:e:hanging-stalactite','nonblock:e:crystal-shard']){
    const variants=new Set();
    for(let variant=0;variant<8;variant++){
      const object=describeCandidateObject(179,{sceneId,anchor:[0,4,0],variant});
      const p=object.positions;
      variants.add(p.join());
      for(let i=0;i<p.length;i+=9){
        const a=[p[i+3]-p[i],p[i+4]-p[i+1],p[i+5]-p[i+2]];
        const b=[p[i+6]-p[i],p[i+7]-p[i+1],p[i+8]-p[i+2]];
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-7);
      }
    }
    assert.equal(variants.size,8);
  }
});
