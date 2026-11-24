import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {BLOCK,meshChunk,raycast,collides,worldKey} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {prototypeSurfaceMesh} from '../src/shape-prototypes.mjs';
import {validateShape} from '../src/voxel-shape-interactions.mjs';
import {MOUNTAIN_V8_MATERIAL_IDS as ids,MOUNTAIN_V8_MATERIAL as M,mountainV8Material as mat,assertMountainV8Namespace} from '../src/manual-biomes/mountain-v8-materials.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../src/biome130-registry.mjs';
import {ENVIRONMENT_GROUND} from '../src/environment-ground.mjs';
import {MANUAL_FIVE_PACK_NUMERIC_IDS} from '../src/builder-assets/manual-five-pack.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS} from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {applyBlockAction,BLOCK_NAMES} from '../src/blocks.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
const seed=179,profile=fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR);
const newWorld=()=>new FourRegionWorld(seed,profile);
test('thirteen exclusive definitions retain all original 258 known IDs; real source mesh ABI',()=>{
 const known=[...Object.values(BLOCK),...MANUAL_FIVE_PACK_NUMERIC_IDS,...BIOME130_REGISTERED_IDS,...Object.values(ENVIRONMENT_GROUND),255,65535];
 assert.equal(known.length,258);assert.equal(new Set(known).size,258);
 assert.equal(assertMountainV8Namespace(known),true);
 assert.throws(()=>assertMountainV8Namespace([508]),/claims/);
 assert.deepEqual(ids,Array.from({length:13},(_,i)=>500+i));
 assert.equal(BIOME130_REGISTERED_IDS.length,130);assert.equal(biome130Block(370).name,'Pine logs');
 for(const id of ids){
  const a=mat(id);assert.ok(validateShape(a));assert.equal(BLOCK_NAMES[id],a.name);
  const mesh=prototypeSurfaceMesh({prototypeOnly:true,boxes:a.boxes});
  assert.ok(mesh.indices.length>0&&mesh.indices.length<=12000);
  assert.ok(a.palette.flat().every(v=>v>=0&&v<=1));
  assert.equal(a.terrain,id<=506);assert.equal(a.solid,id<=506||id===511);
  if(id>506)assert.ok(!a.boxes.some(b=>b.join(',')==='0,0,0,1,1,1'));
 }
});
test('actual natural seed179 dedicated pine, cap, precise ray and source mining rollback',()=>{
 const base=newWorld(),w=new Pack2LiveWorld(base),x=-470,y=13,z=5;
 assert.equal(w.get(x,y-1,z),M['alpine-grass']);
 const cells=MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'].map(([dx,dy,dz,k])=>[[x+dx,y-1+dy,z+dz],M[k]]);
 for(const [cell,id] of cells)assert.equal(w.get(...cell),id,cell.join(','));
 assert.equal(base.mountainV8SupportedTreeCells(x,y,z).length,13);
 const hit=raycast(w,[x+.001,y+.5,z+.5],[1,0,0],1);
 assert.deepEqual(hit?.hit,[x,y,z]);assert.ok(hit.distance>.1&&hit.distance<1);
 const mesh=meshChunk(w,-30,0);assert.ok(mesh.byteLength>0&&mesh.byteLength<=8*1024*1024);
 const before=JSON.stringify(w.save());
 const act=cb=>applyBlockAction(w,[x+.001,y+.5,z+.5],[1,0,0],'mine',BLOCK.STONE,{x:x-3,feet:y,z:z+.5},cb);
 assert.equal(act(()=>{throw Error('injected edit failure')}).ok,false);
 assert.equal(JSON.stringify(w.save()),before);
 for(const [cell,id] of cells)assert.equal(w.get(...cell),id);
 const result=act(()=>{});assert.equal(result.ok,true);assert.equal(result.affectedCells.length,13);
 assert.ok(cells.every(([cell])=>w.get(...cell)===BLOCK.AIR));
 const restored=restoreFourRegionWorld(w.save(),profile);assert.deepEqual(restored.save(),w.save());
 console.log('dedicated pine',JSON.stringify({root:[x,y,z],meshBytes:mesh.byteLength,removed:result.affectedCells.length}));
});
test('actual world produces complete flower and heather cells on selected real meadow roots',()=>{
 const w=newWorld(),found=new Map();
 for(let ring=0;ring<=10&&found.size<2;ring++)
 for(let cz=-ring;cz<=ring&&found.size<2;cz++)for(let cx=-30-ring;cx<=-30+ring&&found.size<2;cx++){
  if(Math.max(Math.abs(cx+30),Math.abs(cz))!==ring||v6BiomeAt(cx*16+8,cz*16+8,seed).name!=='mountain')continue;
  w._mountainV8ConiferAt(cx*16+8,19,cz*16+8);
  const cells=w._mountainV8ConiferChunks.get(cx+','+cz);
  for(const [key,id] of cells??[]){
   const kind=id===M.flower?'alpine-flower':id===M.heather?'low-heather':null;
   if(!kind||found.has(kind))continue;
   const [x,y,z]=key.split(',').map(Number);
   const pattern=MOUNTAIN_V8_PLANT_PATTERNS[kind];
   for(const [dx,dy,dz,k] of pattern)assert.equal(w.get(x+dx,y-1+dy,z+dz),M[k]);
   assert.equal(w.get(x,y-1,z),M['alpine-grass']);
   assert.equal(w.mountainV8SupportedTreeCells(x,y,z).length,2);
   assert.equal(w.mountainV8SupportedTreeCells(x,y-1,z).length,2);
   found.set(kind,{x,y,z,cx,cz});
  }
 }
 assert.equal(found.size,2,JSON.stringify([...found]));
 assert.deepEqual(w.save().edits,[]);
 console.log('actual alpine plants',JSON.stringify([...found]));
});
test('new material edits use exact schema-1 restore; non-V8 profile rejects dedicated IDs',()=>{
 const w=newWorld();
 for(let i=0;i<ids.length;i++)assert.equal(w.set(100+i,-20,100,ids[i]),true);
 const raw=w.save(),reopened=restoreFourRegionWorld(raw,profile);
 assert.deepEqual(reopened.save(),raw);for(let i=0;i<ids.length;i++)assert.equal(reopened.get(100+i,-20,100),ids[i]);
 assert.ok(meshDepthSection(reopened,6,6,-2).length>0);
 const old=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 assert.equal(old.set(100,-20,100,M.stone),false);assert.deepEqual(old.save().edits,[]);
});
test('historical M7 and P2 changed renderer comparison against exact previous source',async()=>{
 const root=process.env.MOUNTAIN_PRIOR_ROOT;assert.ok(root);
 const previous=await import(pathToFileURL(path.join(root,'src/manual-biomes/profile-world.mjs')).href);
 const previousVox=await import(pathToFileURL(path.join(root,'src/voxel.mjs')).href);
 const bytes=m=>Buffer.from(m.buffer,m.byteOffset,m.byteLength);
 for(const gen of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  const a=new FourRegionWorld(seed,fourRegionProfile(seed,gen)),b=new previous.FourRegionWorld(seed,previous.fourRegionProfile(seed,gen));
  assert.deepEqual(a.save(),b.save());
  for(const [cx,cz] of [[-30,0],[-3,-33]])assert.deepEqual(bytes(meshChunk(a,cx,cz)),bytes(previousVox.meshChunk(b,cx,cz)));
 }
});
test('exact staged manifest and worker closure',()=>{
 const m=JSON.parse(readFileSync(new URL('../nonblock-stage-assets.json',import.meta.url)));
 assert.equal(m.version,'20261124-v39-mountain11');
 for(const [p,h] of Object.entries(m.assets)){
  const bytes=readFileSync(new URL('../'+(p==='./'?'index.html':p.slice(2)),import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),h,p);
 }
 assert.ok(m.assets['./src/manual-biomes/mountain-v8-materials.mjs']);
 const worker=readFileSync(new URL('../sw-m5.js',import.meta.url),'utf8');
 assert.ok(worker.includes('20261124-mountain-v8-candidate-11')&&worker.includes('./src/manual-biomes/mountain-v8-materials.mjs'));
 console.log('manifest assets',Object.keys(m.assets).length);
});
