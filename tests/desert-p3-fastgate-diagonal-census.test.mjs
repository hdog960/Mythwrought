// Genuine source-born Desert V7 visual-halo cache and mutation gates.
// Tested against EXACT previous branch, never a synthetic world implementation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7,
  M6_BALANCED_GENERATOR as M6}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {meshChunk,BLOCK,chunkCoord} from '../src/voxel.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {verticalEditSections} from '../src/depth.mjs';
import {validateChunkUploadBytes,MAX_CHUNK_UPLOAD_BYTES}
  from '../src/gpu-recovery.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {desertSeamEditAffectedChunks as previous}
  from '../../baseline/src/manual-biomes/desert-seam-invalidation.mjs';
import {desertSeamEditAffectedChunks as optimized}
  from '../src/manual-biomes/desert-seam-invalidation.mjs';
const places=[[179,-50,-111],[2026,-178,-49]];
function top(world,x,z){
 const p=world._columnPlan(x,z);
 if(!p.size)return null;
 const y=Math.max(...p.keys());
 return {y,id:p.get(y)};
}
function watched(world){
 let plans=0;
 const original=world._columnPlan.bind(world);
 world._columnPlan=(...args)=>{plans++;return original(...args);};
 return ()=>plans;
}
const keys=a=>a.map(({cx,cz})=>cx+','+cz);

test('original V7 16x16 grids: exact same batch for every surface, subsoil and deep edit with fewer source plans',()=>{
 let callsBefore=0,callsAfter=0,probes=0,interior=0,underground=0,veto=0;
 for(const [seed,cx,cz] of places){
  const selection=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const oldWorld=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const newWorld=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const before=watched(oldWorld),after=watched(newWorld);
  for(let lx=0;lx<16;lx++)for(let lz=0;lz<16;lz++){
   const x=cx*16+lx,z=cz*16+lz;
   const natural=top(selection,x,z);
   if(!natural)veto++;
   if(lx>=3&&lx<=12&&lz>=3&&lz<=12)interior++;
   for(const y of [natural?.y??4,(natural?.y??4)-1,-32]){
    const reference=previous(oldWorld,x,z,y),candidate=optimized(newWorld,x,z,y);
    assert.deepEqual(candidate,reference,
      'Real V7 biome, scree and underground edits must choose identical chunks');
    assert.ok(candidate.length<=5);
    for(const item of editAffectedChunks(x,z))
      assert.ok(keys(candidate).includes(item.cx+','+item.cz));
    if(y===-32){
      underground++;
      assert.deepEqual(candidate,editAffectedChunks(x,z));
    }
    probes++;
   }
  }
  callsBefore+=before();callsAfter+=after();
  assert.deepEqual(oldWorld.save().edits,[]);
  assert.deepEqual(newWorld.save().edits,[]);
  assert.ok(oldWorld.cachedBiomeColumns<=1024);
  assert.ok(newWorld.cachedBiomeColumns<=1024);
 }
 assert.equal(probes,1536);
 assert.ok(interior>0&&underground>0&&veto>0);
 assert.ok(callsAfter<callsBefore);
 console.log('DESERT_INNER_FASTGATE_REAL_M7 '+JSON.stringify({
  sourceLocations:places.length,authenticProbeCases:probes,
  interiorPositions:interior,deepEditCases:underground,
  protectedOrEmptyColumns:veto,
  previousSourcePlanCalls:callsBefore,optimizedSourcePlanCalls:callsAfter,
  callsAvoided:callsBefore-callsAfter,
  output:'all selected chunks byte-for-byte equal'
 }));
});
test('original M7 Pack2 wrapper and legacy M6 never plan an irrelevant deep/interior surface column',()=>{
 const seed=179,base=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
 const wrapped=new Pack2LiveWorld(base);
 const old=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M7)));
 let calls=0;
 const read=base._columnPlan.bind(base);
 base._columnPlan=(...args)=>{calls++;return read(...args);};
 const cases=[
  [-781,4,-1771], // interior, near original Desert triple junction
  [-781,-35,-1771],[-781,-4,-1771],[-786,-35,-1774],
  [-800,-65,-1760],[-800,-4,-1760]
 ];
 for(const [x,y,z] of cases){
  assert.deepEqual(optimized(wrapped,x,z,y),previous(old,x,z,y));
 }
 assert.equal(calls,0,'Real guarded original source plans must never run on irrelevant edits');
 const legacy=new FourRegionWorld(seed,fourRegionProfile(seed,M6));
 let legacyCalls=watched(legacy);
 for(const [x,y,z] of cases)
  assert.deepEqual(optimized(legacy,x,z,y),editAffectedChunks(x,z));
 assert.equal(legacyCalls(),0);
 console.log('DESERT_INNER_FASTGATE_WRAPPERS '+JSON.stringify({
  sourceExact:true,pack2WrappedCases:cases.length,
  m7SourcePlanCalls:calls,m6SourcePlanCalls:legacyCalls(),
  originalDeepSection:verticalEditSections(-35)
 }));
});
test('actual source-veto and unrelated climate cells keep old original refresh decisions unchanged',()=>{
 let protectedCases=0,nonDesert=0,originalScree=0;
 for(const [seed,cx,cz] of places){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  for(let dx=-16;dx<=16;dx++)for(let dz=-16;dz<=16;dz++){
   const x=cx*16+dx,z=cz*16+dz;
   const natural=top(w,x,z);
   const biome=v6BiomeAt(x,z,seed);
   if(!natural){
    protectedCases++;
    assert.deepEqual(optimized(w,x,z,4),previous(w,x,z,4));
    assert.deepEqual(optimized(w,x,z,-12),editAffectedChunks(x,z));
   }else if(biome?.name!=='desert'&&biome?.name!=='mountain'){
    nonDesert++;
    assert.deepEqual(optimized(w,x,z,natural.y),previous(w,x,z,natural.y));
   }else if(natural.id===401){
    originalScree++;
    assert.deepEqual(optimized(w,x,z,natural.y),previous(w,x,z,natural.y));
   }
  }
  assert.ok(w.cachedBiomeColumns<=1024);
  assert.deepEqual(w.save().edits,[]);
 }
 assert.ok(protectedCases>0&&nonDesert>0&&originalScree>0);
 console.log('DESERT_INNER_NEGATIVE_M7 '+JSON.stringify({
  protectedCases,nonDesert,originalScree,
  rule:'identical original source selection, no player edits'
 }));
});
test('actual original M7 diagonal recipient is evaluated after authentic edit, not inferred from a square',()=>{
 let eligible=0,actualColorWitnesses=0,zeroChangeWinners=0,examined=0;
 const found=[];
 for(const [seed,centerCx,centerCz] of places){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const uneditedMeshes=new Map();
  outer:
  for(let dcx=-1;dcx<=1;dcx++)for(let dcz=-1;dcz<=1;dcz++){
   const cx=centerCx+dcx,cz=centerCz+dcz;
   for(const lx of [1,2,13,14])for(const lz of [1,2,13,14]){
    const x=cx*16+lx,z=cz*16+lz,natural=top(w,x,z);
    if(!natural||(natural.id!==401&&natural.id!==258))continue;
    if(w.get(x,natural.y,z)!==natural.id)continue;
    if(natural.id===258){
      const biome=v6BiomeAt(x,z,seed);
      if(biome?.name!=='desert'||biome.weight>.50)continue;
    }
    const tx=cx+(lx<=2?-1:1),tz=cz+(lz<=2?-1:1);
    if(!optimized(w,x,z,natural.y).some(p=>p.cx===tx&&p.cz===tz))continue;
    if(editAffectedChunks(x,z).some(p=>p.cx===tx&&p.cz===tz))continue;
    eligible++;
    // The neighbor is a REAL original world chunk. No synthetic color props.
    const key=tx+','+tz;
    let unedited=uneditedMeshes.get(key);
    if(!unedited){unedited=meshChunk(w,tx,tz);uneditedMeshes.set(key,unedited);}
    assert.ok(w.set(x,natural.y,z,BLOCK.AIR));
    const changed=meshChunk(w,tx,tz);
    examined++;
    assert.equal(changed.length,unedited.length,
      'Edit outside diagonal chunk must not change its source triangle count');
    let rgbChanged=0;
    for(let i=0;i<changed.length;i+=9){
      for(const field of [0,1,2,6,7,8])
        assert.equal(changed[i+field],unedited[i+field],
          'Diagonal visible color must never change geometry, UVs, material');
      if(changed[i+3]!==unedited[i+3]||changed[i+4]!==unedited[i+4]||
         changed[i+5]!==unedited[i+5]){
        rgbChanged++;
        assert.ok(changed[i+8]===40||changed[i+8]===42);
      }
    }
    assert.ok(w.set(x,natural.y,z,natural.id));
    assert.deepEqual(w.save().edits,[]);
    if(rgbChanged) {
      actualColorWitnesses++;
      found.push({seed,source:[x,natural.y,z,natural.id],recipient:[tx,tz],
        rgbChanged,recipientVertices:changed.length/9});
      if(actualColorWitnesses>=2)break outer;
    } else zeroChangeWinners++;
    if(examined>=120)break outer;
   }
  }
  assert.ok(w.cachedBiomeColumns<=1024);
 }
 assert.ok(eligible>0&&examined>0);
 console.log('DESERT_INNER_REAL_DIAGONAL_RGB '+JSON.stringify({
  authenticEligible:eligible,actuallyRemeshed:examined,actualColorWitnesses,
  candidatesThatDidNotChangeRGB:zeroChangeWinners,witnesses:found,
  limitation:'two previously authenticated seed regions only'
 }));
});
test('real source geometry quantifies bounded M7 edit upload surface vertex bytes and depth-section fallback',()=>{
 let maximum=0,maximumChunks=0,events=0;
 const cache=new Map();
 for(const [seed,cx,cz] of places){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  for(const lx of [0,1,2,13,14,15])for(const lz of [0,1,2,13,14,15]){
   const x=cx*16+lx,z=cz*16+lz,cap=top(world,x,z);
   if(!cap)continue;
   const affected=optimized(world,x,z,cap.y);
   const sections=verticalEditSections(cap.y);
   assert.ok(affected.length<=5);
   let sum=0;
   for(const p of affected){
     const key=seed+':'+p.cx+','+p.cz;
     let mesh=cache.get(key);
     if(!mesh){mesh=meshChunk(world,p.cx,p.cz);cache.set(key,mesh);}
     assert.equal(validateChunkUploadBytes(mesh),mesh.byteLength);
     assert.ok(mesh.byteLength<=MAX_CHUNK_UPLOAD_BYTES);
     sum+=mesh.byteLength;
   }
   assert.ok(sections.length<=2);
   events++;
   if(sum>maximum){maximum=sum;maximumChunks=affected.length;}
  }
  assert.ok(world.cachedBiomeColumns<=1024);
 }
 assert.ok(events>0);
 console.log('DESERT_INNER_ACTUAL_UPLOAD_BUDGET '+JSON.stringify({
  authenticSurfaceEditCases:events,maximumSurfaceBatchBytes:maximum,
  chunksAtMaximum:maximumChunks,
  maxSingleChunkUploadBytes:MAX_CHUNK_UPLOAD_BYTES,
  testDoesNotInclude:'Pack2 water and Pack3/manual14 overlays or physical GPU allocation',
  note:'actual source mesh byte counts; NOT iPhone upload-time or p95'
 }));
});
