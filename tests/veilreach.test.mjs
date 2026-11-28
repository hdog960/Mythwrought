import {createVeilreachDistanceRenderer,farSkyMesh,veilreachDrawRanges,VEILREACH_DISTANCE_MAX_BYTES,VEILREACH_DISTANCE_OFFSET} from '../src/veilreach/distance.mjs';
import {VEILREACH_GRASS_ID} from '../src/veilreach/flora.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {createVeilreachSource} from '../src/veilreach/source.mjs';
import {createSkylands,SKY_FAMILIES} from '../src/veilreach/generation.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {VEILREACH_GENERATOR} from '../src/environment-ground.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {exportM2World,inspectM2WorldExport} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {saveWorldSafe} from '../src/persistence.mjs';
import {applyBlockAction} from '../src/blocks.mjs';
import {BLOCK,collides,meshChunk,raycast} from '../src/voxel.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {runtimeSectionForY,runtimeMeshKey,upperOccupancy,runtimeSectionBounds} from '../src/world-height.mjs';
import {validateUpperSectionGeometry} from '../src/world-height-budget.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../src/manual-biomes/mountain-v8-materials.mjs';

test('signed distant regions grow reproducible clusters and living surfaces',()=>{
  const families=new Set();
  for(const seed of [179,-77,2026]){
    const terrain=createSkylands(seed),reverse=createSkylands(seed);
    for(const [rx,rz] of [[0,0],[-43,26],[32,-49],[-21,-19],[61,35]]){
      const cluster=terrain.region(rx,rz);
      assert.ok(cluster.length>=7);
      families.add(cluster[0].family);
      const {x,z}=cluster[0],top=terrain.topAt(x,z);
      assert.ok(top>=70&&top<=208);
      const a=Array.from({length:44},(_,i)=>terrain.get(x,top-34+i,z));
      const b=Array.from({length:44},(_,i)=>reverse.get(x,top+9-i,z)).reverse();
      assert.deepEqual(a,b);
      assert.ok(new Set(a).size>=4);
    }
  }
  assert.equal(families.size,SKY_FAMILIES.length);
  const terrain=createSkylands(179),{x,z}=terrain.region(0,0)[0],counts=new Map();
  for(let px=x-23;px<x+24;px++)for(let pz=z-23;pz<z+24;pz++){
    const top=terrain.topAt(px,pz);
    if(top===null)continue;
    for(let y=top+1;y<=top+8;y++){
      const id=terrain.get(px,y,pz);counts.set(id,(counts.get(id)??0)+1);
    }
  }
  for(const id of [BLOCK.WOOD,BLOCK.LEAVES,M.flower,M['flower-petal'],M.heather,287,VEILREACH_GRASS_ID])
    assert.ok(counts.get(id)>0,'missing flora '+id);
});

test('registered natural source is physical, seam aware and leaves historical terrain and edits intact',()=>{
  const seed=179,source=createVeilreachSource(seed);
  const production=new FourRegionWorld(seed,fourRegionProfile(seed,VEILREACH_GENERATOR));
  const historical=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
  const world=new Pack2LiveWorld(production),{x,z}=createSkylands(seed).region(0,0)[0];
  for(const cell of [[0,0,0],[16,-35,-16],[-130,12,500],[-19,-209,-24],[0,19,0]])
    assert.equal(world.get(...cell),historical.get(...cell));
  assert.deepEqual(meshChunk(production,0,0),meshChunk(historical,0,0));
  const top=createSkylands(seed).topAt(x,z),section=runtimeSectionForY(top);
  assert.equal(historical.get(x,top,z),BLOCK.AIR);
  assert.notEqual(world.get(x,top,z),BLOCK.AIR);
  const cx=Math.floor(x/16),cz=Math.floor(z/16);
  assert.ok(upperOccupancy(world,runtimeMeshKey(cx,cz,section)));
  const empty=new Float32Array();
  for(const [i,j] of [[cx,cz],[cx-1,cz],[cx+1,cz],[cx,cz+1],[cx,cz-1]]){
    for(const s of [section-1,section,section+1]){
      const key=runtimeMeshKey(i,j,s), mesh=meshChunk(world,i,j,s);
      if(mesh.length)assert.ok(source.occupied(key));
      validateUpperSectionGeometry(mesh,empty);
    }
  }
  assert.ok(collides(world,x+.5,top+.2,z+.5));
  assert.ok(raycast(world,[x+.5,top+10,z+.5],[0,-1,0],14)?.hit?.[1]>=top);
  const storage=new class{
    data=new Map();
    getItem(key){return this.data.get(key)??null;}
    setItem(key,value){this.data.set(key,String(value));}
  };
  assert.ok(world.set(x,top,z,BLOCK.AIR));
  assert.ok(world.set(x,top+12,z,BLOCK.STONE));
  const restored=inspectM2WorldExport(exportM2World(world)).world;
  assert.equal(restored.get(x,top,z),BLOCK.AIR);
  assert.equal(restored.get(x,top+12,z),BLOCK.STONE);
  assert.equal(restored.base.upperSourceProfile.sourceVersion,source.profile.sourceVersion);
  assert.equal(saveWorldSafe(storage,world).ok,false);
  assert.equal(source.occupied(runtimeMeshKey(cx,cz,1)),false);
  assert.ok(runtimeSectionBounds(section).minY<=top);
});

test('natural island meshes are deferred on the ground and bounded in flight',()=>{
  const seed=179;
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,VEILREACH_GENERATOR));
  const {x,z,y}=createSkylands(seed).region(0,0)[0];
  const ground=[{cx:Math.floor(x/16),cz:Math.floor(z/16),section:0}];
  assert.deepEqual(planHeightStream(world,{x:x+.5,z:z+.5,feet:9},ground),ground);
  const high=planHeightStream(world,{x:x+.5,z:z+.5,feet:y+10},ground);
  assert.ok(high.length<=25);
  assert.ok(high.filter(c=>c.occupied).length<=8);
  assert.ok(high.some(c=>c.occupied));
});

test('natural trunks and foliage remove transactionally without overwriting player edits',()=>{
  const seed=180,plan=createSkylands(seed);
  const {x,z}=plan.region(0,0)[0];
  const base=new FourRegionWorld(seed,fourRegionProfile(seed,VEILREACH_GENERATOR));
  const world=new Pack2LiveWorld(base);
  let root=null,canopy;
  outer:for(let tx=x-12;tx<x+12;tx++)for(let tz=z-12;tz<z+12;tz++){
    const top=plan.topAt(tx,tz);
    if(base.get(tx,top+1,tz)!==BLOCK.WOOD)continue;
    const candidates=base.upperSupportedCells(tx,top+1,tz);
    if(candidates.length<12)continue;
    const hit=raycast(world,[tx-1.01,top+1.5,tz+.5],[1,0,0],2)?.hit;
    if(hit?.[0]!==tx||hit[1]!==top+1||hit[2]!==tz)continue;
    root=[tx,top+1,tz];
    canopy=candidates.filter(c=>base.get(...c)===BLOCK.LEAVES);
    break outer;
  }
  assert.ok(root&&canopy.length>2);
  assert.ok(world.set(...canopy[0],BLOCK.STONE));
  const [rx,ry,rz]=root;
  const edit=rebuild=>applyBlockAction(world,[rx-1.01,ry+.5,rz+.5],[1,0,0],'mine',
    BLOCK.STONE,{x:rx-1.01,feet:ry-1,z:rz+.5},rebuild);
  const rejected=edit(()=>{throw Error('artificial staging fault');});
  assert.equal(rejected.ok,false);
  assert.match(rejected.error,/artificial staging fault/);
  assert.equal(world.get(...root),BLOCK.WOOD);
  assert.equal(world.get(...canopy[1]),BLOCK.LEAVES);
  const removed=edit(()=>{});
  assert.ok(removed.ok,removed.reason);
  assert.ok(removed.affectedCells.length>12);
  assert.equal(world.get(...canopy[0]),BLOCK.STONE);
  assert.equal(world.get(...canopy[1]),BLOCK.AIR);
  const restored=inspectM2WorldExport(exportM2World(world)).world;
  assert.equal(restored.get(...canopy[0]),BLOCK.STONE);
  assert.equal(restored.get(...canopy[1]),BLOCK.AIR);
});

test('distance mesh leaves detailed chunk interiors clear and stays within its buffer cap',()=>{
  const terrain=createSkylands(179),crown=terrain.region(0,0)[0];
  const cx=Math.floor(crown.x/16),cz=Math.floor(crown.z/16);
  const box={min:[cx*16,30,cz*16],max:[(cx+1)*16,232,(cz+1)*16]};
  const ground=farSkyMesh(terrain,0,0);
  const clipped=farSkyMesh(terrain,crown.x,crown.z,[box]);
  assert.ok(ground.length&&clipped.length);
  assert.ok(ground.byteLength<=VEILREACH_DISTANCE_MAX_BYTES);
  assert.ok(clipped.byteLength<=VEILREACH_DISTANCE_MAX_BYTES);
  const materialTags=new Set();
  for(let i=0;i<clipped.length;i+=27){
    const commonAxes=[0,1,2].filter(axis=>clipped[i+axis]===clipped[i+9+axis]&&
      clipped[i+axis]===clipped[i+18+axis]);
    assert.equal(commonAxes.length,1,'each triangle lies on a single voxel-face plane');
    materialTags.add(clipped[i+8]-VEILREACH_DISTANCE_OFFSET);
    for(let axis=0,inside=true;axis<3;axis++){
      const k=i+axis,middle=(clipped[k]+clipped[k+9]+clipped[k+18])/3;
      inside&&=middle>box.min[axis]+1e-4&&middle<box.max[axis]-1e-4;
      if(axis===2)assert.equal(inside,false);
    }
  }
  assert.ok(materialTags.has(1)&&materialTags.has(19)&&materialTags.has(3));
});

test('a distant forest contains trunks at resolved source anchors before physical streaming',()=>{
  const terrain=createSkylands(180);
  const mesh=farSkyMesh(terrain,16,16);
  const woodXZ=new Set();
  let canopyVertices=0;
  for(let i=0;i<mesh.length;i+=9){
    const tag=mesh[i+8]-VEILREACH_DISTANCE_OFFSET;
    if(tag===4)woodXZ.add(mesh[i]+','+mesh[i+2]);
    if(tag===18)canopyVertices++;
  }
  const source=terrain.vegetationCells(3,2).filter(({cell,id})=>
    id===BLOCK.WOOD&&terrain.get(...cell)===id);
  assert.ok(source.length>0);
  assert.ok(source.every(({cell:[x,,z]})=>woodXZ.has(x+','+z)));
  assert.ok(canopyVertices>500);
});

test('visual ownership changes only change draw ranges, retaining the staged section data',()=>{
  const owners=[{key:'a',first:0,count:6},{key:'b',first:6,count:18},{key:'c',first:24,count:6}];
  assert.deepEqual(veilreachDrawRanges(owners,new Set()),[{first:0,count:30}]);
  assert.deepEqual(veilreachDrawRanges(owners,new Set(['b'])),[{first:0,count:6},{first:24,count:6}]);
  assert.deepEqual(veilreachDrawRanges(owners,new Set(['a','b'])),[{first:24,count:6}]);
  assert.deepEqual(veilreachDrawRanges(owners,new Set(['a','b','c'])),[]);
  assert.deepEqual(veilreachDrawRanges(owners,new Set()),[{first:0,count:30}]);
});

test('distance publication keeps the previous buffer if a replacement upload fails',()=>{
  let current=null,error=0,reject=false,failures=0,largestTransfer=0;
  const deleted=new Set(),drawn=[];
  const gl={
    canvas:{dataset:{}},ARRAY_BUFFER:1,STATIC_DRAW:2,TRIANGLES:3,FLOAT:4,NO_ERROR:0,
    isContextLost:()=>false,createBuffer:()=>({}),
    bindBuffer:(_target,buffer)=>{current=buffer;},
    bufferData:(_target,size)=>assert.equal(typeof size,'number'),
    bufferSubData:(_target,_offset,piece)=>{
      largestTransfer=Math.max(largestTransfer,piece.byteLength);
      if(reject){error=1285;failures++;}
    },
    getError:()=>{const result=error;error=0;return result;},
    deleteBuffer:buffer=>deleted.add(buffer),vertexAttribPointer:()=>{},
    drawArrays:()=>drawn.push(current)
  };
  const world=new FourRegionWorld(180,fourRegionProfile(180,VEILREACH_GENERATOR));
  const renderer=createVeilreachDistanceRenderer(gl);
  const player={x:.5,feet:100,z:.5};
  const draw=()=>renderer.draw({world,player,chunks:new Map(),caveShade:0,
    atPos:0,atColor:1,atUv:2,atMat:3});
  for(let i=0;i<800;i++){
    draw();
    if(JSON.parse(gl.canvas.dataset.veilreachAtlas).pending===false)break;
  }
  const before=JSON.parse(gl.canvas.dataset.veilreachAtlas);
  assert.equal(before.pending,false);
  assert.ok(before.bytes>0&&before.bytes<=VEILREACH_DISTANCE_MAX_BYTES);
  const visible=drawn.at(-1);
  assert.ok(visible&&!deleted.has(visible));
  player.x=90;
  reject=true;
  for(let i=0;i<800&&!failures;i++)draw();
  assert.equal(failures,1);
  assert.equal(largestTransfer,65536);
  assert.equal(drawn.at(-1),visible);
  assert.equal(deleted.has(visible),false);
  assert.equal(JSON.parse(gl.canvas.dataset.veilreachAtlas).rebuilds,before.rebuilds);
  renderer.invalidate();
  assert.equal(deleted.has(visible),true);
});
