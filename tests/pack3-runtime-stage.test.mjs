import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../src/voxel.mjs';
import {createPack3RuntimeStage,meshPack3PhysicalAsset,PACK3_RUNTIME_FORMAT,PACK3_RUNTIME_LIVE} from '../src/builder-assets/pack3-runtime.mjs';
import {PACK3_BUILDER_SYMBOLS} from '../src/builder-assets/pack3.mjs';
const empty=(seed=179)=>({seed,edits:new Map(),get:()=>BLOCK.AIR});

test('all 56 approved physical orientations produce exposed, nondegenerate nine-float vertices',()=>{
  let total=0;
  for(const symbol of PACK3_BUILDER_SYMBOLS){
    const turns=Number(symbol.slice(-3))<=26?[0]:[0,1,2,3];
    for(const yaw of turns){
      const m=meshPack3PhysicalAsset(symbol,yaw);
      assert.ok(m.exposedQuads>0);
      assert.equal(m.vertexCount,m.exposedQuads*6);
      assert.equal(m.triangleCount,m.exposedQuads*2);
      assert.ok(m.vertexCount<=30000);
      assert.equal(m.vertices.length%9,0);
      for(let i=0;i<m.vertices.length;i+=9){
        assert.ok([...m.vertices.slice(i,i+3)].every(v=>v>=0&&v<=1),'local vertex outside cell');
        assert.ok([...m.vertices.slice(i,i+9)].every(Number.isFinite),'non-finite physical vertex');
        assert.equal(m.vertices[i+8],3);
      }
      total++;
    }
  }
  assert.equal(total,56);
});

test('builder facade places rotated physical block, picks its surface and keeps an empty legacy save unchanged',()=>{
  const saved=new VoxelWorld(179).save(),w=empty(),runtime=createPack3RuntimeStage(w,{worldId:'village-preview'});
  assert.equal(runtime.placeMany([{at:[1,12,1],asset:'pack3:069',orientation:'east'}]),1);
  assert.equal(runtime.get([1,12,1]).id,116);
  assert.equal(runtime.get([1,12,1]).yaw,1);
  assert.ok(runtime.readShape(1,12,1).boxes.length>1);
  assert.ok(runtime.target([1.1,12.5,-2],[0,0,1],6));
  assert.equal(runtime.size(),1);
  assert.equal(runtime.liveGameRegistered,false);
  assert.equal(PACK3_RUNTIME_LIVE,false);
  assert.deepEqual(new VoxelWorld(179).save(),saved);
});

test('real shaped collision differs from the full-cube placeholder for an arched or slit opening',()=>{
  const rt=createPack3RuntimeStage(empty());
  rt.placeMany([{at:[0,10,0],asset:'pack3:069',orientation:0}]);
  const voidBody=[.45,10.45,.35,.55,10.70,.65];
  const pierBody=[.16,10.45,.35,.25,10.70,.65];
  assert.equal(rt.playerFits(voidBody).fits,true,'slit should be empty');
  assert.equal(rt.playerFits(pierBody).fits,false,'stone pier must be solid');
});

test('construction plan is atomic and never overwrites existing player saves or world edit cells',()=>{
  const w=empty();w.edits.set('3,10,3',0);
  const rt=createPack3RuntimeStage(w,{maxCells:3});
  assert.throws(()=>rt.placeMany([{at:[0,10,0],asset:'pack3:023'},{at:[3,10,3],asset:'pack3:027'}]),/Occupied/);
  assert.equal(rt.size(),0);
  assert.throws(()=>rt.placeMany([{at:[1,10,1],asset:'pack3:023'},{at:[1,10,1],asset:'pack3:027'}]),/Duplicate/);
  assert.equal(rt.size(),0);
  assert.equal(rt.placeMany([{at:[0,10,0],asset:'pack3:023'}]),1);
  assert.throws(()=>rt.placeMany([{at:[0,10,0],asset:'pack3:024'}]),/Occupied/);
  assert.equal(rt.get([0,10,0]).id,109);
  assert.equal(rt.remove([0,10,0]),true);
  assert.equal(rt.size(),0);
});

test('4-turn orientation persists independently of unchanged schema-1 world edits',()=>{
  const w=empty(19);w.edits.set('99,10,99',BLOCK.STONE);
  const rt=createPack3RuntimeStage(w,{worldId:'town:02'});
  rt.placeMany([{at:[-1,10,2],asset:'pack3:027',orientation:'west'},
                {at:[1,11,2],asset:'pack3:077',orientation:'east'}]);
  const raw=rt.serialize(),doc=JSON.parse(raw);
  assert.equal(doc.format,PACK3_RUNTIME_FORMAT);
  assert.deepEqual(doc.entries.map(x=>x.orientation),[3,1]);
  const next=createPack3RuntimeStage(w,{worldId:'town:02'});
  assert.equal(next.restore(raw),2);
  assert.deepEqual(next.entries(),rt.entries());
  assert.equal(w.edits.get('99,10,99'),BLOCK.STONE);
  assert.throws(()=>createPack3RuntimeStage(empty(21),{worldId:'town:02'}).restore(raw),/Foreign/);
  assert.throws(()=>createPack3RuntimeStage(w,{worldId:'another'}).restore(raw),/Foreign/);
});

test('mesh emissions preserve actual shaped geometry, chunk ownership and nine-float shader format',()=>{
  const rt=createPack3RuntimeStage(empty());
  rt.placeMany([{at:[16,10,0],asset:'pack3:027',orientation:2},
                {at:[16,-8,0],asset:'pack3:076',orientation:0}]);
  const surface=rt.chunkMesh(1,0,0),depth=rt.chunkMesh(1,0,-1);
  assert.ok(surface.length>0&&depth.length>0);
  assert.equal(surface.length%9,0);
  assert.equal(depth.length%9,0);
  assert.equal(rt.chunkMesh(0,0,0).length,0);
  for(let i=0;i<surface.length;i+=9){
    assert.ok(surface[i]>=16&&surface[i]<=17);
    assert.ok(surface[i+1]>=10&&surface[i+1]<=11);
  }
});

test('failing validation never spills into legacy save schema or claims live deployment',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  const rt=createPack3RuntimeStage(w);
  assert.throws(()=>rt.placeMany([{at:[0,300,0],asset:'pack3:023'}]),RangeError);
  assert.throws(()=>rt.placeMany([{at:[0,16,0],asset:'pack3:023',orientation:3}]),RangeError);
  assert.throws(()=>rt.restore('malformed'),TypeError);
  assert.equal(JSON.stringify(w.save()),before);
  assert.equal(rt.size(),0);
});
