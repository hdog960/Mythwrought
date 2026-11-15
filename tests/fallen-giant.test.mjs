import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,baseBlock,terrainHeight} from '../src/voxel.mjs';
import {planFallenGiant,placeFallenGiant} from '../src/fallen-giant.mjs';
function fixture(seed=179){
 const edits=new Map(),key=(x,y,z)=>[x,y,z].join(',');
 return {seed,edits,get(x,y,z){return edits.get(key(x,y,z))??baseBlock(x,y,z,seed)},
 set(x,y,z,id){edits.set(key(x,y,z),id);return true}};
}
function site(world){
 for(let x=-180;x<=180;x+=3)for(let z=-180;z<=180;z+=3){
  const p=planFallenGiant(world,x,z);if(p)return p;
 }
 throw Error('No valid flat site found');
}
test('physical trunk and leaf forks are stable and use integrated IDs',()=>{
 const w=fixture(),p=site(w),again=planFallenGiant(w,p.origin[0],p.origin[2]);
 assert.deepEqual(p,again);
 assert.ok(p.cells.filter(c=>c[3]===BLOCK.WOOD).length>=p.length);
 assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES));
 assert.ok(p.cells.every(c=>[BLOCK.WOOD,BLOCK.LEAVES].includes(c[3])));
 assert.equal(p.optIn,true);
});
test('both orientations and chunk crossing remain absolute world voxels',()=>{
 const w=fixture(),p=site(w);
 const z=planFallenGiant(w,p.origin[0],p.origin[2],{axis:'z'});
 if(z)assert.ok(z.cells.some(c=>c[2]!==z.origin[2]));
 assert.ok(p.cells.every(c=>Number.isInteger(c[0])&&Number.isInteger(c[1])&&Number.isInteger(c[2])));
});
test('edits block placement; tampered plans and foreign seeds rejected',()=>{
 const w=fixture(),p=site(w),[a,b,c]=p.cells[0];
 w.set(a,b,c,BLOCK.CRYSTAL);
 assert.equal(placeFallenGiant(w,p),false);
 w.set(a,b,c,BLOCK.AIR);
 assert.equal(placeFallenGiant(w,{...p,cells:p.cells.slice(1)}),false);
 assert.equal(placeFallenGiant(fixture(180),p),false);
});
test('successful placement is editable and cannot be repeated',()=>{
 const w=fixture(),p=site(w);
 assert.equal(placeFallenGiant(w,p),true);
 assert.ok(p.cells.every(([a,b,c,id])=>w.get(a,b,c)===id));
 assert.equal(placeFallenGiant(w,p),false);
 const [a,b,c]=p.cells[0];w.set(a,b,c,BLOCK.AIR);
 assert.equal(w.get(a,b,c),BLOCK.AIR);
});
