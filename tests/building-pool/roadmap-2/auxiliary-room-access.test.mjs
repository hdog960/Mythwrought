import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';

const key=(x,y,z)=>`${x},${y},${z}`;
const map=bp=>new Map(bp.voxels.map(v=>[key(v.x,v.y,v.z),v]));
function reachable(bp,blocked=[]){
  const c=map(bp),forbidden=new Set(blocked.map(d=>`${d.x},${d.z}`));
  const start=bp.openings.find(o=>o.type==='entrance'),seen=new Set(),q=[[start.x,1]];
  for(let i=0;i<q.length;i++){
    const [x,z]=q[i],point=`${x},${z}`;
    if(seen.has(point)||forbidden.has(point)||x<1||z<1||
       x>=bp.extents.x-1||z>=bp.extents.z-1||
       c.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>c.has(key(x,y,z))))continue;
    seen.add(point);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  return seen;
}
function internalTarget(bp,door){
  if(door.roomUse==='counting-office'||door.roomUse==='meditation-chapel')return [door.x+1,door.z];
  if(door.roomUse==='loading-bay'||door.roomUse==='west-chapel')return [door.x-1,door.z];
  if(door.roomUse==='east-chapel')return [door.x+1,door.z];
  throw Error(`unknown auxiliary room: ${door.roomUse}`);
}
test('all 25 auxiliary doorways are physically three-high, documented and actually accessible',()=>{
 let rooms=0,doors=0;
 for(const bp of M1_REPRESENTATIVES){
  const c=map(bp),open=reachable(bp),aux=bp.openings.filter(o=>o.role==='auxiliary-room');
  const count=bp.size==='small'?0:bp.size==='large'&&bp.category==='temple'?2:1;
  assert.equal(aux.length,count,`wrong auxiliary access count: ${bp.id}`);
  for(const door of aux){
    doors++;rooms++;
    assert.equal(door.type,'internal-doorway',bp.id);
    assert.equal(door.clearHeightCells,3,bp.id);
    assert(bp.rooms.some(room=>room.uses.includes(door.roomUse)),`missing room identity: ${bp.id}`);
    assert(bp.circulation.some(edge=>edge.to===door.roomUse),`missing room connection: ${bp.id}`);
    for(let y=door.y;y<door.y+3;y++)assert(!c.has(key(door.x,y,door.z)),
      `blocked room crossing: ${bp.id} ${door.roomUse}`);
    const [x,z]=internalTarget(bp,door);
    assert(open.has(`${x},${z}`),`room entered only through unmodeled access: ${bp.id} ${door.roomUse}`);
    assert(c.get(key(x,1,z))?.kind==='floor',`room lacks genuine walkable floor: ${bp.id}`);
  }
 }
 assert.equal(doors,25); assert.equal(rooms,25);
});
test('closing just the intended doorway isolates every auxiliary room without also blocking other chapels',()=>{
 let gated=0;
 for(const bp of M1_REPRESENTATIVES){
  const aux=bp.openings.filter(o=>o.role==='auxiliary-room');
  for(const door of aux){
    const seen=reachable(bp,[door]),[x,z]=internalTarget(bp,door);
    assert(!seen.has(`${x},${z}`),`side room has undocumented bypass: ${bp.id} ${door.roomUse}`);
    gated++;
    for(const other of aux.filter(o=>o!==door)){
      const [ox,oz]=internalTarget(bp,other);
      assert(seen.has(`${ox},${oz}`),`closing ${door.roomUse} also blocks ${other.roomUse}: ${bp.id}`);
    }
  }
 }
 assert.equal(gated,25);
});
test('side rooms use tangible floor-to-head-height end walls, not open-ended screens',()=>{
 let caps=0;
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.size==='medium'||(b.size==='large'&&b.category==='temple'))){
  const c=map(bp),w=bp.extents.x;
  if(bp.size==='medium'){
    const x=w-5,end=Math.min(bp.openings.find(o=>o.type==='internal-doorway').z-2,9);
    for(const z of [3,end+1])for(let xx=x+1;xx<=w-2;xx++)for(const y of [2,3,4]){
      assert.equal(c.get(key(xx,y,z))?.kind,'wall',`missing real office/chapel end-cap: ${bp.id}`);caps++;
    }
  }else{
    for(const [x0,x1] of [[1,3],[w-4,w-2]])for(const z of [3,12])
      for(let x=x0;x<=x1;x++)for(let y=2;y<=4;y++){
        assert.equal(c.get(key(x,y,z))?.kind,'wall',`missing votive chapel end-cap: ${bp.id}`);caps++;
      }
  }
 }
 assert(caps>=300);
});
