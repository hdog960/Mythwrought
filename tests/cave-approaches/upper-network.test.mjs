import test from 'node:test';
import assert from 'node:assert/strict';
import {upperCaveCells,upperCaveOverlay,UPPER_SITES} from '../../src/cave-approaches/upper-network.mjs';
import {worldKey,BLOCK} from '../../src/voxel.mjs';
const options=(site,seed)=>({site,seed,descentReservation:new Map([[worldKey(192,-30,192),BLOCK.AIR]]),
 protectedCells:new Set(),editedCells:new Set(),legacyCells:()=>null});
test('fails closed without source-exact :36 mask and protected history',()=>{
 assert.equal(upperCaveCells().reason,'SOURCE_RESERVATION_OR_EDIT_HISTORY_MISSING');
});
for(const seed of [179,1,2026,-77])for(const site of UPPER_SITES){
 test(`upper network ${seed} ${site.name} is deterministic and below legacy floor`,()=>{
  const a=upperCaveCells(options(site,seed)),b=upperCaveCells(options(site,seed));
  assert.equal(a.ok,true,a.reason);
  assert.deepEqual([...a.cells],[...b.cells]);
  assert.ok(a.cells.size>1000);
  assert.equal(a.route.length,121);
  assert.equal(a.openingProposal.requiresManualApproval,true);
  assert.equal(a.handoffProposal.connectedTo36,false);
  for(const k of a.cells.keys()){
   const [,y]=k.split(',').map(Number);
   assert.ok(y<-3&&y>=-45,k);
  }
  const world={getBlock:()=>BLOCK.DEEPSTONE};
  const overlay=upperCaveOverlay(world,options(site,seed));
  assert.equal(overlay.ok,true,overlay.reason);
  assert.equal(overlay.getBlock(site.x,-2,site.z),BLOCK.DEEPSTONE);
 });
}
test('source exact protected reservation blocks an intersecting candidate',()=>{
 const o=options(UPPER_SITES[0],179);
 o.descentReservation.set(worldKey(UPPER_SITES[0].x+40,-15,UPPER_SITES[0].z),BLOCK.AIR);
 assert.equal(upperCaveCells(o).ok,false);
});
test('player edit history blocks candidate rather than overwriting',()=>{
 const o=options(UPPER_SITES[0],179);
 o.editedCells.add(worldKey(UPPER_SITES[0].x,-8,UPPER_SITES[0].z));
 assert.equal(upperCaveCells(o).ok,false);
});

test('overlapping galleries retain supported 3-wide route with four-cell clearance',()=>{
 const o=options(UPPER_SITES[0],179),a=upperCaveCells(o);
 assert.equal(a.ok,true,a.reason);
 for(const p of a.route){
  for(let dz=-1;dz<=1;dz++){
   const z=p.z+dz;
   // Neighboring route slices can raise the floor by at most one step.
   const candidates=[p.floor,p.floor+1];
   const support=candidates.find(y=>a.cells.get(worldKey(p.x,y,z))===BLOCK.DEEPSTONE);
   assert.notEqual(support,undefined,'missing supported floor at '+p.x+','+z);
   for(let h=1;h<=3;h++)
    assert.equal(a.cells.get(worldKey(p.x,support+h,z)),BLOCK.AIR,'blocked route headroom');
  }
 }
});
test('legacy terrain and edits fail closed even at an overlapping alcove',()=>{
 const o=options(UPPER_SITES[1],-77);
 o.legacyCells=(x,y,z)=>x===UPPER_SITES[1].x+48&&y===-16?BLOCK.DEEPSTONE:null;
 assert.equal(upperCaveCells(o).ok,false);
});

for(const site of UPPER_SITES)for(const seed of [179,1,2026,-77]){
 test(`lateral mineral vault is connected, supported and four-high: ${site.name} seed ${seed}`,()=>{
  const a=upperCaveCells(options(site,seed));
  assert.equal(a.ok,true,a.reason);
  // Source-specific junction moved to the three-wide level floor at d=110.
  const d=110,x=site.x+d,floor=-8-Math.floor(d/6);
  const base=site.z+Math.round(3*Math.sin(d/13));
  const direction=site.x<0?-1:1;
  for(let step=0;step<=34;step++){
   const z=base+direction*step;
   for(let dx=-1;dx<=1;dx++){
    assert.equal(a.cells.get(worldKey(x+dx,floor,z)),BLOCK.DEEPSTONE,
      'missing supported branch floor at '+(x+dx)+','+z);
    for(let h=1;h<=4;h++)
     assert.equal(a.cells.get(worldKey(x+dx,floor+h,z)),BLOCK.AIR,
       'branch clearance at '+(x+dx)+','+z+','+h);
   }
  }
  const endZ=base+direction*34;
  assert.equal(a.cells.get(worldKey(x,floor,endZ)),BLOCK.DEEPSTONE);
  for(let h=1;h<=8;h++)
   assert.equal(a.cells.get(worldKey(x,floor+h,endZ)),BLOCK.AIR);
  assert.equal(a.cells.has(worldKey(x,-3,endZ)),false);
 });
}
