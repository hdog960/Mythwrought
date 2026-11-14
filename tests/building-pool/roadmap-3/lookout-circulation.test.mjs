import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';

// Strict two-wide support/clearance flood on the observation deck. The old
// route graph certified one lookout node while leaving isolated walkable
// two-wide positions along crenellated perimeter bays in two snowy towers.
function auditObservation(b){
 const occupied=new Set(b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3).join(','))));
 const {width:w,depth:d}=b.envelope,y=b.architecture.observationY;
 const clear=(x,z)=>x>=0&&x+1<w&&z>=0&&z<d&&[0,1].every(dx=>
   !occupied.has(`${x+dx},${y},${z}`)&&!occupied.has(`${x+dx},${y+1},${z}`)&&
    occupied.has(`${x+dx},${y-1},${z}`));
 const entrance=b.navigation.nodes.find(n=>n.id==='platform');
 assert.ok(clear(entrance.x,entrance.z),`${b.id}: landing obstructed`);
 const list=[[entrance.x,entrance.z]],visited=new Set([`${entrance.x},${entrance.z}`]);
 for(let h=0;h<list.length;h++){
  const [x,z]=list[h];
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=`${nx},${nz}`;
   if(!visited.has(k)&&clear(nx,nz)){visited.add(k);list.push([nx,nz]);}
  }
 }
 let all=0,missed=[];
 for(let x=0;x<w-1;x++)for(let z=0;z<d;z++)if(clear(x,z)){
  all++;if(!visited.has(`${x},${z}`))missed.push([x,z]);
 }
 return {reachable:list,walkable:all,missed,w,d};
}
const towers=createM1Pool().filter(b=>b.type==='watchtower');
test('all 15 observation floors have no unreachable supported two-wide walkable pockets',()=>{
 assert.equal(towers.length,15);
 for(const tower of towers){
  const result=auditObservation(tower);
  assert.deepEqual(result.missed,[],`${tower.id}: isolated observation deck pockets`);
  assert.equal(result.reachable.length,result.walkable,tower.id);
 }
});
test('four sides of all 15 observation decks remain accessible to the two-wide path',()=>{
 for(const tower of towers){
  const {reachable,w,d}=auditObservation(tower);
  for(const [side,fn] of Object.entries({north:([x,z])=>z<=2,south:([x,z])=>z>=d-3,
   west:([x,z])=>x<=2,east:([x,z])=>x>=w-4}))
   assert.ok(reachable.some(fn),`${tower.id}: ${side} parapet inaccessible`);
 }
});
test('snow battlement adjustments preserve all 30 designs and exact 71,293 physical slots',()=>{
 const pool=createM1Pool();
 assert.equal(pool.length,30);
 assert.equal(new Set(pool.map(b=>b.id)).size,30);
 assert.equal(pool.reduce((n,b)=>n+b.architecture.physicalCellSlots,0),71293);
 for(const tower of towers){
  const {width:w,depth:d}=tower.envelope,y=tower.architecture.observationY;
  const c=new Set(tower.modules.find(m=>m.role==='battlement').cells.map(v=>v.slice(0,3).join(',')));
  if(tower.biome==='snow'&&tower.size==='medium'){
   assert.ok(!c.has(`0,${y},1`));assert.ok(c.has(`0,${y},${d-3}`));
  }
  if(tower.biome==='snow'&&tower.size==='large'){
   assert.ok(!c.has(`${w-1},${y},1`));assert.ok(c.has(`0,${y},1`));
  }
 }
});
