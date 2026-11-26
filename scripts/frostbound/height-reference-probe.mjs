import assert from 'node:assert/strict';
import {createUpperNaturalRegistry} from '../../src/world-height-natural-contract.mjs';
import {VersionedUpperWorld} from '../../src/world-height-profile-world.mjs';
import {physicalRegionAt,PHYSICAL_MAX_Y,runtimeSectionForY} from '../../src/world-height.mjs';
import {meshChunk,collides,terrainHeight} from '../../src/voxel.mjs';
import {validateUpperSectionGeometry,admitUpperGpuBatch} from '../../src/world-height-budget.mjs';
const seed=179,x=8,z=8,base=terrainHeight(x,z,seed),top=base+60,cells=new Map(),owners=new Set();
const put=(x,y,z,id)=>{if(y<20)return;cells.set(`${x},${y},${z}`,id);owners.add(physicalRegionAt(x,y,z).key);};
for(let y=base+1;y<=top;y++)put(x,y,z,4);
for(let y=base+17;y<=top;y+=4){const r=Math.max(1,Math.floor((top-y)/10));for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++)if(Math.abs(dx)+Math.abs(dz)<=r&&!(dx===0&&dz===0))put(x+dx,y,z+dz,407);}
const registry=createUpperNaturalRegistry(),generator='mythwrought-upper-frostbound-feasibility',sourceVersion='fixture-v1';registry.register(generator,sourceVersion,p=>({...p,get:(x,y,z)=>cells.get(`${x},${y},${z}`)??0,occupied:k=>owners.has(k),revision:()=>0}));
const profile={kind:'mythwrought-upper-source-profile',version:1,seed,generator,sourceVersion};const w=new VersionedUpperWorld(registry,profile);
assert.equal(PHYSICAL_MAX_Y,256);assert.equal(w.get(x,top,z),4);assert.ok(collides(w,x+.5,top+.01,z+.5));
let batches=[];for(const key of owners){const [cx,cz,section]=key.slice(4).split(',').map(Number),vertices=meshChunk(w,cx,cz,section+1),water=new Float32Array();validateUpperSectionGeometry(vertices,water);batches.push({key,section:section+1,vertices,water});}
const admission=admitUpperGpuBatch(new Map(),batches);assert.equal(w.set(x,top,z,0),true);assert.equal(w.get(x,top,z),0);const restored=VersionedUpperWorld.restorePortable(registry,w.portable());assert.equal(restored.get(x,top,z),0);assert.equal(restored.get(x,top-1,z),4);
console.log(JSON.stringify({base,top,physicalMax:PHYSICAL_MAX_Y,upperCells:cells.size,owners:owners.size,bytes:batches.map(b=>[b.key,b.vertices.byteLength]),admission,portableEdit:true}));
