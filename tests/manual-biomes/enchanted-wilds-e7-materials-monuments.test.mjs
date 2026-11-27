import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWildsFamily,WILDS_FAMILIES} from '../../src/manual-biomes/enchanted-wilds-families.mjs';
import {WILDS_MATERIALS,wildsFamilyPalette,bindWildsMaterialIds} from '../../src/manual-biomes/enchanted-wilds-materials.mjs';
import {WILDS_MONUMENTS,buildWildsMonument} from '../../src/manual-biomes/enchanted-wilds-monuments.mjs';
import {WILDS_LANDMARKS} from '../../src/manual-biomes/enchanted-wilds-landmarks.mjs';
import {meshChunk,VoxelWorld,raycast,BLOCK} from '../../src/voxel.mjs';
import {physicalRegionAt} from '../../src/world-height.mjs';
import {validateUpperSectionGeometry} from '../../src/world-height-budget.mjs';
const key=(...p)=>p.join(',');
test('dedicated material authoring has stable symbols, actual per-voxel roles, refuses conflicting numeric bindings',()=>{
 const symbols=new Set(WILDS_MATERIALS.map(m=>m.symbol));assert.equal(symbols.size,16);
 for(const m of WILDS_MATERIALS){assert.equal(m.shape,'full-cube');assert.equal(m.solid,true);assert.ok(m.rgb.every(n=>n>=0&&n<=1));}
 const used=new Set();
 for(const f of WILDS_FAMILIES)for(let v=0;v<4;v++){
  const p=buildWildsFamily(f.id,-64,10,-544,179,v);
  const palette=wildsFamilyPalette(f.id),own=new Set(Object.values(palette).map(m=>m.symbol));
  assert.equal(p.cells.length,p.materialSymbols.length);
  for(const symbol of p.materialSymbols){assert.ok(symbols.has(symbol)&&own.has(symbol));used.add(symbol);}
  assert.ok(p.materialSymbols.includes(palette.stem.symbol));assert.ok(p.materialSymbols.includes(palette.crown.symbol));
 }
 assert.equal(used.size,16);
 // Synthetic non-persisted test binding. Never registered with VoxelWorld.
 const mapping=Object.fromEntries(WILDS_MATERIALS.map((m,i)=>[m.symbol,60000+i]));
 assert.equal(bindWildsMaterialIds(mapping,()=>false).size,16);
 assert.throws(()=>bindWildsMaterialIds(mapping,n=>n===60000),/conflicting/);
 const conflict={...mapping,[WILDS_MATERIALS[1].symbol]:60000};
 assert.throws(()=>bindWildsMaterialIds(conflict,()=>false),/conflicting/);
 assert.throws(()=>bindWildsMaterialIds({},()=>false),/Complete/);
 console.log('WILDS MATERIAL ROLES',JSON.stringify({symbols:[...used],registeredIds:0,variants:40}));
});
test('all eight monumental plans across four rotations: grounded components, clear 3-wide routes and genuine upper ownership',()=>{
 assert.equal(WILDS_LANDMARKS.length+WILDS_MONUMENTS.length,20);
 const census=[];
 for(const m of WILDS_MONUMENTS)for(let turn=0;turn<4;turn++){
  const p=buildWildsMonument(m.id,-16,10,-32,turn);
  assert.deepEqual(p,buildWildsMonument(m.id,-16,10,-32,turn));
  const cells=new Map(p.cells.map(r=>[key(...r.slice(0,3)),r]));
  assert.equal(cells.size,p.cells.length);assert.ok(p.cells.length>=40&&p.cells.length<=2400);
  assert.ok(p.approach.every(a=>!cells.has(key(...a))));
  const queue=p.footprint.map(([x,z])=>[x,11,z]),seen=new Set(queue.map(p=>key(...p)));
  for(let i=0;i<queue.length;i++){const [x,y,z]=queue[i];for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
    const n=[x+dx,y+dy,z+dz],k=key(...n);if(cells.has(k)&&!seen.has(k)){seen.add(k);queue.push(n);}
  }}
  assert.equal(seen.size,cells.size,m.name+' ungrounded geometry');
  const owners=new Set(p.cells.map(([x,y,z])=>physicalRegionAt(x,y,z).key));
  assert.ok(owners.size>1);
  if(turn===0)census.push({name:m.name,cells:p.cells.length,owners:owners.size,height:m.height,approach:p.approach.length});
 }
 console.log('WILDS MONUMENT GEOMETRY',JSON.stringify(census));
});
test('largest fungal sanctuary on original native physical edit/mesh ABI, bounded upper geometry and ray selection',()=>{
 const p=buildWildsMonument(18,0,80,0),w=new VoxelWorld(179),owners=new Map();
 // Explicit high-air specimen only; not natural placement or a terrain support claim.
 for(const [x,y,z,id] of p.cells){assert.equal(w.get(x,y,z),BLOCK.AIR);assert.ok(w.set(x,y,z,id));const o=physicalRegionAt(x,y,z);owners.set(o.key,o);}
 let bytes=0;
 for(const o of owners.values()){
   const mesh=meshChunk(w,o.cx,o.cz,o.section+1);
   assert.ok(mesh.length>0&&mesh.every(Number.isFinite));
   validateUpperSectionGeometry(mesh,new Float32Array());bytes+=mesh.byteLength;
 }
 const row=p.cells.find(([x,y,z])=>x===-5&&y===81&&z===-5);assert.ok(row);
 const hit=raycast(w,[-4.5,81.5,-7],[0,0,1],7);assert.deepEqual(hit?.hit,row.slice(0,3));
 assert.ok(w.set(...row.slice(0,3),BLOCK.AIR));assert.equal(w.get(...row.slice(0,3)),BLOCK.AIR);
 const cold=VoxelWorld.restore(w.save());assert.equal(cold.get(...row.slice(0,3)),BLOCK.AIR);
 console.log('WILDS MONUMENT NATIVE SPECIMEN',JSON.stringify({cells:p.cells.length,owners:owners.size,bytes}));
});
