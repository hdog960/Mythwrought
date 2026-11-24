// AUTHENTIC pinned Desert-main M7 source MATERIAL + physically visible
// winter-cap census, not a synthetic camera or a committed shader change.
// It proves original material-tag attribution BEFORE another browser test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
 restoreFourRegionWorld} from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {meshChunk,collides,BLOCK} from '../production-readonly/src/voxel.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {snowS9PigmentAtVisibleOriginalCap as pigment}
 from '../src/manual-biomes/snowy-s9-mesh-resident-pigment.mjs';
const winter=new Set([272,276,279]);
const getTop=plan=>{
 let top=-Infinity,id=0;
 for(const [y,block] of plan)if(y>top){top=y;id=block;}
 return {top,id};
};
const topFace=(mesh,x,y,z)=>{
 const tags=[];
 for(let i=0;i<mesh.length;i+=27){
  let matches=true;
  for(const p of [i,i+9,i+18]){
   const xx=mesh[p],yy=mesh[p+1],zz=mesh[p+2];
   if(Math.abs(yy-y-1)>1e-5||xx<x-1e-5||xx>x+1+1e-5||
      zz<z-1e-5||zz>z+1+1e-5){matches=false;break;}
  }
  if(matches){
   const a=mesh[i+8],b=mesh[i+17],c=mesh[i+26];
   assert.equal(a,b,'Actual triangle material tag changed within face');
   assert.equal(a,c,'Actual triangle material tag changed within face');
   tags.push(a);
  }
 }
 return tags;
};
test('actual material-41 snow/rime and material-0 glacier top faces, seeds179/2026',()=>{
 for(const [seed,zone] of [[179,[512,544]],[2026,[480,512]]]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const old=JSON.stringify(world.save());
  const cache=new Map(),counts=new Map(),witnesses=[],sourceCounts={};
  for(let z=zone[0];z<zone[1];z++)
   for(let x=-160;x<-128;x++){
    const {top:y,id}=getTop(world._columnPlan(x,z));
    if(!winter.has(id)||world.get(x,y,z)!==id||
       world.get(x,y+1,z)!==BLOCK.AIR||
       world.edits.has(x+','+y+','+z)||
       v6BiomeAt(x,z,seed)?.name!=='snow')continue;
    sourceCounts[id]=(sourceCounts[id]??0)+1;
    const cx=Math.floor(x/16),cz=Math.floor(z/16),key=cx+','+cz;
    if(!cache.has(key))cache.set(key,meshChunk(world,cx,cz));
    const faces=topFace(cache.get(key),x,y,z);
    if(!faces.length)continue;
    const expected=id===276?0:41;
    for(const tag of faces)assert.equal(tag,expected,
      'Original exact source winter surface shader tag mismatch for block '+id);
    const witness=pigment({
      seed,x,y,z,id,sourceSurface:{top:y,id},
      observed:world.get(x,y,z),below:world.get(x,y-1,z),
      above:world.get(x,y+1,z),
      editedCap:world.edits.has(x+','+y+','+z),
      editedSupport:world.edits.has(x+','+(y-1)+','+z),
      caveCap:world.environmentCaves.get(x,y,z),
      caveSupport:world.environmentCaves.get(x,y-1,z),
      biomeAt:v6BiomeAt
    });
    const tag=faces[0];
    counts.set(id,(counts.get(id)??0)+1);
    if(witness&&witnesses.filter(w=>w.id===id).length<4)
      witnesses.push({id,x,y,z,shaderMaterial:tag,triangles:faces.length,
        originalM7CandidateRgb:witness});
  }
  assert.ok((counts.get(272)??0)+(counts.get(279)??0)>0,
    'No physically visible REAL original natural snow/rime material41 found in accepted snow zone');
  assert.ok((counts.get(276)??0)>0,
    'No physically visible REAL original natural glacier material0 found in accepted snow zone');
  assert.equal(JSON.stringify(world.save()),old);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  assert.ok(cache.size<=4);
  console.log('SNOW_S9_ORIGINAL_VISIBLE_MATERIAL_ROUTE '+JSON.stringify({
    seed,sourceRegion:{x:[-160,-129],z:[zone[0],zone[1]-1]},
    originalAuthoredSourceCounts:sourceCounts,
    actualVisibleTopFacesById:Object.fromEntries(counts),
    genuineOriginalMeshChunks:cache.size,
    expectedOriginalShaders:{'272':41,'276':0,'279':41},
    sourceWitnesses:witnesses,
    oldWorldSaveUnchanged:true,
    physicalCameraSiteNotYetBrowserVerified:true}));
 }
});
