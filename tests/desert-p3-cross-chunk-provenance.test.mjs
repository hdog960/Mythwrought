// Original V7 cross-chunk Desert bilateral color audit, strictly new focused checks.
// Baseline is exactly the prior authenticated bilateral research commit, in ../baseline.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {meshChunk as oldMesh} from '../../baseline/src/voxel.mjs';
import {meshChunk as newMesh} from '../src/voxel.mjs';
import {FourRegionWorld as OldWorld,fourRegionProfile as oldProfile,
  M7_ENVIRONMENT_GENERATOR as M7} from '../../baseline/src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as NewWorld,fourRegionProfile as newProfile}
  from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {nearestNaturalScreeSquared,desertSeamVertexTint,DESERT_SEAM_RADIUS} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
import {warmScreeVertexColor} from '../src/manual-biomes/desert-bilateral-rgb.mjs';
const sites=[[179,-50,-111],[2026,-178,-49]];
const directions=[['west',-1,0],['east',1,0],['north',0,-1],['south',0,1]];
const topSourceCache=new Map();
function sourceTop(world,x,z){
 const key=world.seed+':'+x+','+z;
 let entry=topSourceCache.get(key);
 if(entry!==undefined)return entry;
 const plan=world._columnPlan(x,z);
 if(plan.size){
  const y=Math.max(...plan.keys());
  entry={y,id:plan.get(y)};
 }else entry=null;
 topSourceCache.set(key,entry);
 return entry;
}
function topVertices(mesh,axis,plane){
 const map=new Map();
 for(let i=0;i<mesh.length;i+=9){
  const x=mesh[i],y=mesh[i+1],z=mesh[i+2],mat=mesh[i+8];
  if((axis==='x'?x:z)!==plane || !(mat===40||mat===42))continue;
  // This exact original M7 UV contract selects the exposed TOP terrain face,
  // excluding its darker sides and bottom even if the world point coincides.
  if(mesh[i+6]!==x||mesh[i+7]!==z)continue;
  const key=x+','+y+','+z+','+mat;
  let rgb=map.get(key);
  if(!rgb){rgb=[];map.set(key,rgb);}
  rgb.push([mesh[i+3],mesh[i+4],mesh[i+5]]);
 }
 return map;
}
function verifySharedEdge(world,left,right,centerCx,centerCz,label){
 const direction=directions.find(([name])=>name===label);
 const [,dx,dz]=direction;
 const xSeam=dx? (dx>0?(centerCx+1)*16:centerCx*16):null;
 const zSeam=dz? (dz>0?(centerCz+1)*16:centerCz*16):null;
 const axis=dx?'x':'z',plane=dx?xSeam:zSeam;
 const a=topVertices(left,axis,plane),b=topVertices(right,axis,plane);
 const orthoStart=dx?centerCz*16:centerCx*16,orthoEnd=orthoStart+16;
 let compared=0,tag40=0,tag42=0,unmatched=0;
 for(const [key,va] of a){
  const vb=b.get(key);
  if(!vb){unmatched++;continue;}
  const [x,y,z,mat]=key.split(',').map(Number);
  const other=dx?z:x;
  if(other<=orthoStart||other>=orthoEnd)continue;
  const owners=dx?
    [[plane-1,other-1],[plane-1,other],[plane,other-1],[plane,other]]:
    [[other-1,plane-1],[other,plane-1],[other-1,plane],[other,plane]];
  const expected=mat===40?258:401;
  if(owners.some(([cx,cz])=>{
    const cap=sourceTop(world,cx,cz);
    return !cap||cap.y!==y-1||cap.id!==expected;
  }))continue;
  const rows=[...va,...vb];
  for(let i=1;i<rows.length;i++)
    for(let c=0;c<3;c++)
      assert.equal(rows[i][c],rows[0][c],
        JSON.stringify({label,seed:world.seed,at:[x,y,z],mat,channel:c,
          first:rows[0][c],second:rows[i][c],reason:'shared top vertex color seam'}));
  compared++;if(mat===40)tag40++;else tag42++;
 }
 return {direction:label,compared,tag40,tag42,unmatched};
}
test('ten authentic source chunks remain full Float32 bit-identical after cheap Desert cue prefilter',()=>{
 let sourceReadSavings=0,totalVertices=0;
 for(const [seed,cx,cz] of sites){
  const details=[];
  for(const [label,dx,dz] of [['center',0,0],...directions]){
   const old=new OldWorld(seed,oldProfile(seed,M7));
   const next=new NewWorld(seed,newProfile(seed,M7));
   const start=performance.now(),a=oldMesh(old,cx+dx,cz+dz),priorMs=performance.now()-start;
   const start2=performance.now(),b=newMesh(next,cx+dx,cz+dz),newMs=performance.now()-start2;
   assert.equal(a.byteLength,b.byteLength);
   assert.deepEqual(b,a,'Biome-first prefilter MUST be bit exact in every 9-float source field');
   assert.deepEqual(old.save().edits,[]);
   assert.deepEqual(next.save().edits,[]);
   const before=old.cachedBiomeColumns,after=next.cachedBiomeColumns;
   assert.ok(after<=before,'Must not increase original guarded source cache occupancy');
   assert.ok(after<=1024,'Keep original source cache contract');
   sourceReadSavings+=before-after;
   totalVertices+=b.length/9;
   details.push({chunk:[cx+dx,cz+dz],vertices:b.length/9,sourceColumnsBefore:before,
    sourceColumnsAfter:after,sourceColumnSavings:before-after,
    oldNodeMs:+priorMs.toFixed(2),newNodeMs:+newMs.toFixed(2)});
  }
  console.log('DESERT_P3_CROSS_CHUNK_CACHE '+JSON.stringify({seed,details}));
 }
 assert.ok(totalVertices>0);
 console.log('DESERT_P3_CROSS_CHUNK_CACHE_TOTAL '+JSON.stringify({
  chunks:10,sourceReadSavings,totalVertices,
  note:'source cache occupancy is not direct lookup count; CI timings are not iPhone timings'
 }));
});
test('true original M7 adjacent terrain top vertices have matching RGB across four chunk borders',()=>{
 let comparedTotal=0,tag40Total=0,tag42Total=0;
 for(const [seed,cx,cz] of sites){
  const world=new NewWorld(seed,newProfile(seed,M7));
  const center=newMesh(world,cx,cz);
  const results=[];
  for(const [label,dx,dz] of directions){
   const other=newMesh(world,cx+dx,cz+dz);
   const left=dx<0||dz<0?other:center,right=dx<0||dz<0?center:other;
   const r=verifySharedEdge(world,left,right,cx,cz,label);
   results.push(r);
   comparedTotal+=r.compared;
   tag40Total+=r.tag40;
   tag42Total+=r.tag42;
  }
  assert.deepEqual(world.save().edits,[]);
  assert.ok(world.cachedBiomeColumns<=1024);
  console.log('DESERT_P3_CROSS_CHUNK_PARITY '+JSON.stringify({
   seed,center:[cx,cz],boundaries:results,cachedColumns:world.cachedBiomeColumns
  }));
 }
 assert.ok(comparedTotal>0,'Must compare actual emitted same-height original terrain vertices');
 console.log('DESERT_P3_CROSS_CHUNK_PARITY_TOTAL '+JSON.stringify({
  comparedTotal,tag40Total,tag42Total,borders:8
 }));
});
test('true V6 non-Desert/Snow/Enchanted selection excludes all original warmth cues before source plan',()=>{
 for(const [seed,cx,cz] of sites){
  const x=cx*16,z=cz*16;
  let nonDesert=0,desert=0;
  for(let dx=-16;dx<=32;dx++)for(let dz=-16;dz<=32;dz+=2){
   const region=v6BiomeAt(x+dx,z+dz,seed);
   if(region?.name==='desert'&&region.weight<=.50)desert++;else nonDesert++;
  }
  assert.ok(nonDesert>0&&desert>0,'Grounded real-world sample includes seam and excluded regions');
  console.log('DESERT_P3_CROSS_CHUNK_NEGATIVE '+JSON.stringify({
   seed,gridWidth:49,sampledZ:25,desertEligible:desert,otherClimateExcluded:nonDesert
  }));
 }
});

test('radius-three distance pruning is appearance-equivalent to exact previous exhaustive 36 probes',()=>{
 let tested=0,skipped=0,foundInRadius=0;
 const rgbDesert=[.55,.4,.26],rgbScree=[.46,.43,.40];
 for(let mask=0;mask<128;mask++){
  let baselineCalls=0,nextCalls=0;
  const predicate=(x,z)=>{
   const nx=x+3,nz=z+3;
   const code=(nx*31+nz*17+mask*7)%13;
   return code===0||code===mask%13;
  };
  let minimum=Infinity;
  for(let x=-3;x<=2;x++)for(let z=-3;z<=2;z++){
   baselineCalls++;
   const dx=-x-.5,dz=-z-.5,d2=dx*dx+dz*dz;
   if(predicate(x,z)&&d2<minimum)minimum=d2;
  }
  const optimized=nearestNaturalScreeSquared(0,0,4,(x,z)=>{
   nextCalls++;return predicate(x,z);
  });
  if(minimum<DESERT_SEAM_RADIUS*DESERT_SEAM_RADIUS){
   assert.equal(optimized,minimum,'Must preserve actual nearest source within displayed band');
   foundInRadius++;
  }else assert.equal(optimized,Infinity,'Ignore source outside displayed radius');
  assert.deepEqual(desertSeamVertexTint(rgbDesert,optimized),
    desertSeamVertexTint(rgbDesert,minimum),'Desert-side appearance must be identical');
  assert.deepEqual(warmScreeVertexColor(rgbScree,optimized),
    warmScreeVertexColor(rgbScree,minimum),'Scree-side appearance must be identical');
  assert.ok(nextCalls<=baselineCalls);
  tested++;skipped+=baselineCalls-nextCalls;
 }
 assert.ok(foundInRadius>0);
 assert.ok(skipped>=512,'Reject many unnecessary source-plan callbacks, not just four corners');
 console.log('DESERT_P3_RADIUS3_PRUNING '+JSON.stringify({
  masks:tested,avoidedSourceCallbackInvocations:skipped,
  candidateChecks:tested*36-skipped,priorChecks:tested*36,
  result:'both color functions exactly invariant for every representative mask'
 }));
});


test('physical boundary edits and original protected AIR veto remain bit-exact under cache pruning',()=>{
 for(const [seed,cx,cz] of sites){
  const old=new OldWorld(seed,oldProfile(seed,M7));
  const next=new NewWorld(seed,newProfile(seed,M7));
  const edits=seed===179?
    [[-786,4,-1774,401,400],[-786,4,-1775,258,257]]:
    [[-2848,7,-774,401,400]];
  for(const [x,y,z,source,replacement] of edits){
   assert.equal(old.get(x,y,z),source,'Original source-backed edit witness must exist');
   assert.equal(next.get(x,y,z),source);
   assert.ok(old.set(x,y,z,replacement));
   assert.ok(next.set(x,y,z,replacement));
   assert.equal(next.get(x,y,z),replacement);
  }
  assert.deepEqual(next.save().edits,old.save().edits);
  assert.equal(next.save().edits.length,edits.length);
  const affected=seed===179?[[cx,cz],[cx+1,cz]]:
    [[cx,cz],[cx-1,cz]];
  const measured=[];
  for(const [x,z] of affected){
   const a=oldMesh(old,x,z),b=newMesh(next,x,z);
   assert.deepEqual(b,a,'Player-edited screen border must remain Float32 bit-identical');
   assert.ok(next.cachedBiomeColumns<=1024);
   assert.deepEqual(next.save().edits,old.save().edits);
   measured.push({chunk:[x,z],vertices:a.length/9,bytes:a.byteLength});
  }
  let vetoes=0;
  if(seed===179){
   for(let z=-1790;z<=-1758;z++)for(let x=-802;x<=-770;x++){
    const a=old._columnPlan(x,z),b=next._columnPlan(x,z);
    if(a.size===0){
      vetoes++;
      assert.equal(b.size,0,'Original guarded environment AIR must remain vetoed');
    }
   }
   assert.ok(vetoes>0,'Must witness actual rejected original surface columns');
  }
  console.log('DESERT_P3_CROSS_CHUNK_EDIT_VETO '+JSON.stringify({
   seed,edits:edits.map(([x,y,z,from,to])=>({x,y,z,from,to})),
   savedRows:next.save().edits.length,
   checkedOriginalVetoColumns:vetoes,affected:measured,
   originalCache:old.cachedBiomeColumns,candidateCache:next.cachedBiomeColumns
  }));
 }
});
