import test from 'node:test';
import assert from 'node:assert/strict';
import {MAP_CELL_SIZE,MAP_REVEAL_RADIUS,mapCell,mapStorageKey,loadExploration,paintExploration}
  from '../src/exploration-map.mjs';
const store=()=>{
  const data=new Map();
  return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,v),data};
};
test('exploration starts unknown and reveals only nearby cells, including negative coordinates',()=>{
  const storage=store(),map=loadExploration(storage,179);
  assert.equal(map.seen.size,0);
  assert.equal(map.has(0,0),false);
  assert.equal(mapCell(-.01,-4.01),'-1,-2');
  assert.equal(MAP_CELL_SIZE,4);
  assert.equal(MAP_REVEAL_RADIUS,3);
  assert.equal(map.reveal(0,0),29);
  assert.equal(map.seen.size,29);
  assert.equal(map.has(0,0),true);
  assert.equal(map.has(100,0),false);
  assert.equal(map.reveal(.5,.5),0,'standing still cannot unveil more land');
  assert.equal(map.reveal(400,400),29,'exploring a distant area reveals a separate patch');
  assert.equal(map.has(200,200),false,'undiscovered gap stays hidden');
});
test('exploration persists independently per seed without altering canonical voxel saves',()=>{
  const storage=store();
  storage.setItem('mythwrought-v002-world-179','original world bytes');
  const a=loadExploration(storage,179);
  a.reveal(0,0);a.reveal(100,100);
  assert.equal(a.dirty,true);
  assert.equal(a.flush(),true);
  assert.equal(a.dirty,false);
  assert.equal(storage.getItem('mythwrought-v002-world-179'),'original world bytes');
  const reloaded=loadExploration(storage,179);
  assert.equal(reloaded.seen.size,a.seen.size);
  assert.equal(reloaded.has(100,100),true);
  const other=loadExploration(storage,555);
  assert.equal(other.seen.size,0,'no cross-seed exploration leak');
  assert.notEqual(mapStorageKey(179),mapStorageKey(555));
  other.reveal(-120,-120);assert.equal(other.flush(),true);
  assert.equal(loadExploration(storage,179).has(-120,-120),false);
});
test('corrupted map bytes are protected without reset or overwrite',()=>{
  for(const payload of ['{bad',JSON.stringify({version:1,seed:179,cellSize:4,cells:['1,2','1,2']}),
    JSON.stringify({version:1,seed:180,cellSize:4,cells:[]})]){
    const storage=store(),key=mapStorageKey(179);
    storage.setItem(key,payload);
    const map=loadExploration(storage,179);
    assert.equal(map.readOnly,true);
    assert.match(map.warning,/protected/);
    map.reveal(0,0);
    assert.equal(map.flush(),false);
    assert.equal(storage.getItem(key),payload);
  }
});
test('storage failures keep unsaved exploration in memory for later retry',()=>{
  let fail=true;const data=new Map();
  const storage={getItem:k=>data.has(k)?data.get(k):null,
    setItem:(k,v)=>{if(fail)throw Error('quota exceeded');data.set(k,v);}};
  const map=loadExploration(storage,179);
  map.reveal(0,0);assert.equal(map.flush(),false);
  assert.equal(map.dirty,true);
  assert.match(map.warning,/not saved/);
  fail=false;assert.equal(map.flush(),true);
  assert.equal(map.dirty,false);
  assert.equal(loadExploration(storage,179).has(0,0),true);
});
test('painting never queries or discloses undiscovered terrain',()=>{
  let inspected=0,filled=0;
  const context={fillStyle:'',strokeStyle:'',lineWidth:1,imageSmoothingEnabled:true,
    fillRect(){filled++;},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},fillText(){}};
  const canvas={width:80,height:80,getContext:()=>context};
  const world={seed:179,get(){inspected++;return 1;}};
  const player={x:0,z:0,yaw:0};
  const map=loadExploration(store(),179);
  paintExploration(canvas,map,world,player);
  assert.equal(inspected,0,'hidden land must never be sampled by map renderer');
  assert.equal(filled,1,'unknown map must be one opaque background');
  map.reveal(0,0);paintExploration(canvas,map,world,player);
  assert.ok(inspected>0);
  const before=inspected;
  player.x=10000;player.z=10000;
  paintExploration(canvas,map,world,player);
  assert.equal(inspected,before,'faraway unknown terrain must stay unqueried');
});
