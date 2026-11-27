import test from 'node:test';
import assert from 'node:assert/strict';
import {FrostboundForest,surfaceTreeChoice,winterTreeMaterials} from '../../src/frostbound/s2-forest.mjs';
import {FAMILIES,treeCells} from '../../src/frostbound/s2-trees.mjs';
import {FrostboundS3Candidate,GROUND_FAMILIES} from '../../src/frostbound/s3-ground.mjs';
import {biome130Block,isBiome130BlockId} from '../../src/biome130-registry.mjs';
import {collides,meshChunk,raycast} from '../../src/voxel.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
const full=[[0,0,0,1,1,1]],boxes=id=>isBiome130BlockId(id)?biome130Block(id).boxes:full;
function contact(a,b,axis,sign){return boxes(a).some(p=>boxes(b).some(q=>p[axis+(sign>0?3:0)]===(sign>0?1:0)&&q[axis+(sign>0?0:3)]===(sign>0?0:1)&&[0,1,2].filter(k=>k!==axis).every(k=>Math.min(p[k+3],q[k+3])>Math.max(p[k],q[k]))));}
test('actual registered shape face contacts reach every trunk and branch cell, all height endpoints',()=>{
 for(const seed of [179,2026,-77])for(const [family,range] of Object.entries(FAMILIES))for(const h of range){
  const cells=winterTreeMaterials(family,treeCells(family,-8,8,8,h,seed),-8,8),map=new Map(cells.map(c=>[c.slice(0,3).join(','),c[3]]));
  const root=[-8,9,8],queue=[root],seen=new Set([root.join(',')]);
  for(let i=0;i<queue.length;i++)for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const a=queue[i],b=a.slice();b[axis]+=sign;const k=b.join(',');if(map.has(k)&&!seen.has(k)&&contact(map.get(a.join(',')),map.get(k),axis,sign)){seen.add(k);queue.push(b);}}
  assert.equal(seen.size,cells.length,`${seed} ${family} ${h}`);assert.equal(Math.max(...cells.map(c=>c[1])),8+h);
 }
 for(let floor=2;floor<=17;floor++)for(let n=0;n<100;n++){const s=surfaceTreeChoice(floor,n/100,(99-n)/100);if(s){assert.ok(s.height>=FAMILIES[s.family][0]&&s.height<=FAMILIES[s.family][1]);assert.ok(floor+s.height<=19);}}
});
test('three-seed actual ground candidates, protected source, deterministic cache eviction and real edit/mesh',()=>{
 const total={},trees={};let sampled=0,placed=0,maxMesh=0;
 for(const seed of [179,2026,-77]){
  const w=new FrostboundS3Candidate(seed),base=new FrostboundForest(seed);let first=null,firstStump=null;
  for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){
   sampled++;const t=w.forestChunk(cx,cz).site;if(t)trees[t.family]=(trees[t.family]??0)+1;
   const cells=w.groundDetails(cx,cz);for(const [k,id] of cells){const [x,y,z]=k.split(',').map(Number);placed++;total[id]=(total[id]??0)+1;assert.equal(base.get(x,y,z),0);assert.equal(w.get(x,y,z),id);assert.ok([272,276,279].includes(base.get(x,y-1,z)));assert.equal(w.environmentCaves.get(x,y,z),undefined);assert.equal(v6BiomeAt(x,z,seed).name,'snow');assert.ok(boxes(id).some(b=>b[1]===0));first??={cx,cz,cells:[...cells],p:[x,y,z],id};
    if(id===GROUND_FAMILIES.pineStump){
     assert.deepEqual([x-cx*16,z-cz*16],[12,8]);
     assert.ok(contact(base.get(x,y-1,z),id,1,1));
     assert.equal(base.get(x,y+1,z),0);
     firstStump??={cx,cz,cell:[x,y,z]};
    }
   }
  }
  assert.ok(first);assert.ok(w._groundDetails.size<=64);assert.deepEqual([...w.groundDetails(first.cx,first.cz)],first.cells);
  const a=meshChunk(base,first.cx,first.cz),b=meshChunk(w,first.cx,first.cz);assert.notDeepEqual(a,b);maxMesh=Math.max(maxMesh,b.byteLength);assert.ok(w.set(...first.p,0));assert.equal(w.get(...first.p),0);assert.ok(w.set(...first.p,first.id));assert.equal(w.edits.size,0);assert.deepEqual(meshChunk(w,0,0),meshChunk(base,0,0));assert.throws(()=>w.save(),/not a registered/);
  assert.ok(firstStump,`No natural stump for seed ${seed}`);
  const [x,y,z]=firstStump.cell,eye=[x+.5,y+1.5,z+.5];
  const intactMesh=meshChunk(w,firstStump.cx,firstStump.cz);
  assert.deepEqual(raycast(w,eye,[0,-1,0],3)?.hit,firstStump.cell);
  assert.equal(collides(w,x+.5,y+.02,z+.5),true);
  assert.ok(w.set(...firstStump.cell,0));
  assert.deepEqual(raycast(w,eye,[0,-1,0],3)?.hit,[x,y-1,z]);
  assert.equal(collides(w,x+.5,y+.02,z+.5),false);
  assert.notDeepEqual(meshChunk(w,firstStump.cx,firstStump.cz),intactMesh);
  assert.ok(w.set(...firstStump.cell, GROUND_FAMILIES.pineStump));
  assert.equal(w.edits.size,0);
  assert.deepEqual(meshChunk(w,firstStump.cx,firstStump.cz),intactMesh);
 }
 assert.equal(Object.keys(total).length,Object.keys(GROUND_FAMILIES).length);assert.equal(Object.keys(trees).length,7);console.log('S5 '+JSON.stringify({sampled,placed,total,trees,maxMesh}));
});
