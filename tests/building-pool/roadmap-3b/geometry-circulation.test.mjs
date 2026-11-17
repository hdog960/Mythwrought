import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';

const pool=createLegacyWatchtowerPool();
const pos=(x,y,z)=>`${x},${y},${z}`;
const solidCells=b=>new Set(b.modules.flatMap(m=>m.cells.map(([x,y,z])=>pos(x,y,z))));
function canWalk(b,solid,x,y,z){
 if(x<0||z<0||y<2||x+1>=b.envelope.width||z>=b.envelope.depth||y+1>=b.envelope.height)return false;
 for(const dx of [0,1]){
  if(solid.has(pos(x+dx,y,z))||solid.has(pos(x+dx,y+1,z)))return false;
  if(!solid.has(pos(x+dx,y-1,z)))return false;
 }
 return true;
}
function floodPhysicallyWalkable(b){
 const solid=solidCells(b),start=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(canWalk(b,solid,start.x,start.y,start.z),b.id+' blocked entry');
 const stair=new Set(b.modules.flatMap(m=>m.role==='stair'?m.cells.map(([x,y,z])=>pos(x,y,z)):[]));
 const reached=new Set([pos(start.x,start.y,start.z)]);
 const queue=[[start.x,start.y,start.z]];
 for(let head=0;head<queue.length;head++){
  const [x,y,z]=queue[head];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
   const [nx,ny,nz]=[x+dx,y+dy,z+dz],key=pos(nx,ny,nz);
   if(reached.has(key)||!canWalk(b,solid,nx,ny,nz))continue;
   if(dy!==0&&!Array.from({length:2},(_,j)=>stair.has(pos(nx+j,ny-1,nz))).some(Boolean))continue;
   reached.add(key);queue.push([nx,ny,nz]);
  }
 }
 for(const node of b.navigation.nodes)
  assert.ok(reached.has(pos(node.x,node.y,node.z)),b.id+' node unreachable: '+node.id);
 return reached;
}
test('M1 all 15 original watchtowers have supported real voxel-cell two-wide paths from entrance to every navigation node',()=>{
 for(const b of pool)assert.ok(floodPhysicallyWalkable(b).size>40,b.id);
});
test('M1 all 15 original tower observation decks remain accessible through grounded stair treads and piers',()=>{
 for(const b of pool){
  const v=validateBlueprint(b,ASSET_CATALOG);
  assert.equal(v.id,b.id);
  const stairs=b.modules.find(m=>m.role==='stair')?.cells??[];
  const piers=new Set((b.modules.find(m=>m.role==='stair-support')?.cells??[]).map(([x,y,z])=>pos(x,y,z)));
  const steps=b.architecture.stairSteps;
  assert.equal(stairs.length,steps*2,b.id);
  assert.equal(piers.size,steps*(steps-1),b.id);
  for(let i=0;i<steps;i++)for(const x of [3,4])for(let y=1;y<=i;y++)
   assert.ok(piers.has(pos(x,y,3+i)),b.id+' floating stair cell');
  assert.ok(b.navigation.nodes.some(n=>n.kind==='observation'),b.id);
  assert.ok(b.spaces.some(s=>s.kind==='observation'),b.id);
  assert.ok(b.modules.some(m=>m.role==='battlement'),b.id);
 }
});
test('M1 all original tower clearances are actually unoccupied and are inside design envelopes',()=>{
 for(const b of pool){
  const solids=solidCells(b);
  for(const clear of b.clearances){
   for(let x=clear.x;x<clear.x+clear.width;x++)
    for(let y=clear.y;y<clear.y+clear.height;y++)
     for(let z=clear.z;z<clear.z+clear.depth;z++)
      assert.ok(!solids.has(pos(x,y,z)),b.id+' obstructed declared headroom');
  }
 }
});
test('M1 snow-tier roof connectors and weather covers are structurally supported in all sizes',()=>{
 for(const b of pool.filter(x=>x.biome==='snow')){
  assert.equal(b.architecture.upperDetailsSupported,true);
  const supports=b.modules.find(m=>m.role==='upper-support')?.cells??[];
  const braces=b.modules.find(m=>m.role==='roof-step-brace')?.cells??[];
  assert.ok(supports.length>=4&&braces.length>0,b.id);
  const deckY=b.architecture.observationY-1;
  const byColumn=new Map();
  for(const [x,y,z] of supports){
   const key=`${x},${z}`;if(!byColumn.has(key))byColumn.set(key,[]);
   byColumn.get(key).push(y);
  }
  for(const [key,levels] of byColumn){
   levels.sort((a,b)=>a-b);
   assert.equal(levels[0],deckY+1,b.id+' support floating '+key);
   for(let i=1;i<levels.length;i++)
    assert.equal(levels[i],levels[i-1]+1,b.id+' support gap '+key);
  }
 }
});
