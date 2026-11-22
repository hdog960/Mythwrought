import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';

const cellKey=(x,y,z)=>`${x},${y},${z}`;
const map=b=>new Map(b.voxels.map(v=>[cellKey(v.x,v.y,v.z),v]));
function reachable(bp){
 const c=map(bp),start=bp.openings.find(o=>o.type==='entrance'),seen=new Set(),queue=[[start.x,1]];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],key=`${x},${z}`;
  if(seen.has(key)||x<1||z<1||x>=bp.extents.x-1||z>=bp.extents.z-1||
     c.get(cellKey(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>c.has(cellKey(x,y,z))))continue;
  seen.add(key);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
test('all ten medium stores and temples have a walled accessible lateral counting/meditation office',()=>{
 const models=M1_REPRESENTATIVES.filter(b=>b.size==='medium');assert.equal(models.length,10);
 for(const bp of models){
  const c=map(bp),screenX=bp.extents.x-5,seen=reachable(bp);
  for(const z of [4,5,7,8])for(const y of [2,3,4])
   assert.equal(c.get(cellKey(screenX,y,z))?.kind,'wall',`missing lateral screen: ${bp.id} ${screenX},${y},${z}`);
  for(const y of [2,3,4])assert(!c.has(cellKey(screenX,y,6)),`blocked actual lateral doorway: ${bp.id}`);
  assert(seen.has(`${screenX+1},6`),`lateral chamber inaccessible from front door: ${bp.id}`);
  assert.equal(c.get(cellKey(bp.extents.x-3,2,7))?.kind,'fixture',`no chamber equipment: ${bp.id}`);
  const key=bp.category==='temple'?'meditation-chapel':'counting-office';
  assert(bp.rooms.some(room=>room.uses.includes(key)),`chamber not authored as room: ${bp.id}`);
  assert(bp.circulation.some(edge=>edge.to===key),`chamber not connected in circulation contract: ${bp.id}`);
 }
});
test('all five large general stores have genuinely separated rear loading bays and accessible doors',()=>{
 const shops=M1_REPRESENTATIVES.filter(b=>b.size==='large'&&b.category==='general-store');assert.equal(shops.length,5);
 for(const bp of shops){
  const c=map(bp),seen=reachable(bp),part=bp.openings.find(o=>o.type==='internal-doorway').z;
  for(const z of [part+1,part+3])for(const y of [2,3,4])
   assert.equal(c.get(cellKey(4,y,z))?.kind,'wall',`large shop missing delivery partition ${bp.id}`);
  for(const y of [2,3,4])assert(!c.has(cellKey(4,y,part+2)),`blocked delivery partition door: ${bp.id}`);
  assert(seen.has(`3,${part+2}`),`delivery bay unreachable: ${bp.id}`);
  assert(bp.rooms.some(room=>room.uses.includes('loading-bay')));
  assert(bp.circulation.some(edge=>edge.from==='storage'&&edge.to==='loading-bay'));
 }
});
test('all five large temples have two physical side chapels accessible from the main nave',()=>{
 const temples=M1_REPRESENTATIVES.filter(b=>b.size==='large'&&b.category==='temple');assert.equal(temples.length,5);
 for(const bp of temples){
  const c=map(bp),seen=reachable(bp),w=bp.extents.x;
  for(const wallX of [4,w-5]){
   for(const z of [4,5,7,8,9,10,11])for(const y of [2,3,4])
    assert.equal(c.get(cellKey(wallX,y,z))?.kind,'wall',`missing chapel partition: ${bp.id} ${wallX},${y},${z}`);
   for(const y of [2,3,4])assert(!c.has(cellKey(wallX,y,6)),`blocked chapel crossing: ${bp.id}`);
  }
  for(const x of [3,w-4])assert(seen.has(`${x},6`),`side chapel inaccessible ${bp.id} x${x}`);
  for(const use of ['west-chapel','east-chapel']){
   assert(bp.rooms.some(room=>room.uses.includes(use)),`missing chapel room: ${bp.id} ${use}`);
   assert(bp.circulation.some(edge=>edge.to===use),`missing nave-to-chapel circulation: ${bp.id} ${use}`);
  }
  for(const x of [2,w-3])assert.equal(c.get(cellKey(x,2,8))?.material,'pack5:093',`side altar missing: ${bp.id}`);
 }
});
test('fifteen symbolic temple stairs declare z-forward rises between supported lower and upper landings',()=>{
 const temples=M1_REPRESENTATIVES.filter(b=>b.category==='temple');assert.equal(temples.length,15);
 for(const bp of temples){
  const c=map(bp),z=bp.extents.z-4,cx=Math.floor(bp.extents.x/2);
  for(const x of [cx-2,cx+2]){
   const stair=c.get(cellKey(x,2,z));assert.equal(stair?.material,'pack1:008');
   assert.equal(stair.intendedFacing,'+z');
   assert.deepEqual(stair.lowerLanding,{x,y:1,z:z-1});
   assert.deepEqual(stair.upperLanding,{x,y:2,z:z+1});
   assert.equal(stair.shapeRotationStatus,'unresolved-symbolic');
   assert.equal(c.get(cellKey(x,1,z-1))?.kind,'floor');
   assert.equal(c.get(cellKey(x,2,z+1))?.kind,'fixture');
  }
 }
});
