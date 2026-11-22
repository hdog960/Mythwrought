// Clean V7 bilateral source provenance and M7-only three-block visual refresh.
// The original accepted gameplay source is checked out at ../accepted;
// the previously authenticated optimized bilateral research at ../research.
// Neither source tree is edited by these tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {meshChunk as cleanMesh,chunkCoord} from '../src/voxel.mjs';
import {meshChunk as researchMesh} from '../../research/src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7,
 M6_BALANCED_GENERATOR as M6} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {desertSeamEditAffectedChunks,DESERT_SEAM_VISUAL_RADIUS}
 from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {canWarmSourceScree,canUseDesertHardpanCue}
 from '../src/manual-biomes/desert-bilateral-rgb.mjs';
const sites=[[179,-50,-111],[2026,-178,-49]];
const key=({cx,cz})=>cx+','+cz;
const keys=(list)=>list.map(key);
function topPlan(w,x,z){
 const p=w._columnPlan(x,z);
 if(!p.size)return null;
 const y=Math.max(...p.keys());
 return {y,id:p.get(y)};
}
test('clean 3-file source transplants are exact and forbidden shader history stays absent',()=>{
 const expected=['src/voxel.mjs','src/manual-biomes/desert-seam-vertex-tint.mjs',
  'src/manual-biomes/desert-bilateral-rgb.mjs'];
 for(const path of expected){
  assert.deepEqual(fs.readFileSync(new URL('../'+path,import.meta.url)),
    fs.readFileSync(new URL('../../research/'+path,import.meta.url)),
    'All three verified research source files must be byte-identical: '+path);
 }
 for(const path of ['src/storybook-materials.mjs','src/manual-biomes/profile-world.mjs',
  'src/manual-biomes/environment-v7.mjs']){
  assert.deepEqual(fs.readFileSync(new URL('../'+path,import.meta.url)),
    fs.readFileSync(new URL('../../accepted/'+path,import.meta.url)),
    'Original biome/GLSL generation source must stay untouched: '+path);
 }
 const acceptedMain=fs.readFileSync(new URL('../../accepted/src/main.mjs',import.meta.url),'utf8');
 const candidateMain=fs.readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
 assert.ok(!fs.existsSync(new URL('../src/manual-biomes/desert-seam-shader.mjs',import.meta.url)),
   'Rejected tag40 shader module must not exist on the clean branch');
 assert.ok(!candidateMain.includes('withDesertSeamTextureBlend'));
 assert.ok(!candidateMain.includes('FSTerrain'));
 assert.ok(candidateMain.includes('desertSeamEditAffectedChunks(world,x,z,y)'));
 assert.equal(candidateMain.replace(
  "import {desertSeamEditAffectedChunks} from './manual-biomes/desert-seam-invalidation.mjs';\n",'')
 .replace("    // Original surface-mesh three-block RGB cue can cross an adjacent chunk\n"+
  "    // before the edited source reaches the one-voxel physics seam. Preserve\n"+
  "    // existing depth/geometry refresh for all legacy or non-surface edits.\n"+
  "    const affected=desertSeamEditAffectedChunks(world,x,z,y);\n"+
  "    for(const section of verticalEditSections(y))\n"+
  "      for(const {cx,cz} of affected){",
  "    for(const section of verticalEditSections(y))\n"+
  "      for(const {cx,cz} of editAffectedChunks(x,z)){"),
 acceptedMain,'No main source changes besides M7-only visual edit invalidation');
 console.log('DESERT_CLEAN_PROVENANCE '+JSON.stringify({
  sourceFiles:expected.length,shaderOriginal:true,worldGenerationOriginal:true,
  rejectedShaderAbsent:true,originalChunkEditCallPreservedForLegacy:true
 }));
});
test('authentic V7 source original cap edits 2-3 cells from boundary invalidate neighbor',()=>{
 let witnessed=0,m7Additional=0;
 for(const [seed,cx,cz] of sites){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const baseX=cx*16,baseZ=cz*16;
  const samples=[];
  for(const localX of [2,13])for(let localZ=0;localZ<16;localZ++){
   const x=baseX+localX,z=baseZ+localZ,cap=topPlan(world,x,z);
   if(!cap)continue;
   if(cap.id!==401 && !(cap.id===258&&
      v6BiomeAt(x,z,seed)?.name==='desert'&&v6BiomeAt(x,z,seed)?.weight<=.5))
     continue;
   const legacy=editAffectedChunks(x,z),next=desertSeamEditAffectedChunks(world,x,z,cap.y);
   const neighbor=localX===2?{cx:cx-1,cz}:{cx:cx+1,cz};
   assert.ok(!legacy.some(p=>key(p)===key(neighbor)),'Original legacy geometry refresh did not cover 3-block cue');
   assert.ok(next.some(p=>key(p)===key(neighbor)),
    'Actual source top edit must invalidate neighboring color-producing chunk');
   assert.ok(next.some(p=>key(p)===cx+','+cz),'Keep original edited chunk');
   assert.ok(next.length<=5,'Bound at most four adjacent surface chunks plus legacy union');
   assert.deepEqual(desertSeamEditAffectedChunks(world,x,z,cap.y-1),
     legacy,'Original underground edit remains existing old refresh');
   samples.push({at:[x,cap.y,z],naturalCap:cap.id,legacy:keys(legacy),colorAffected:keys(next)});
   witnessed++;m7Additional+=next.length-legacy.length;
  }
  assert.ok(samples.length>0,'Witness source original material near a chunk edge per seed');
  assert.ok(world.cachedBiomeColumns<=1024);
  console.log('DESERT_CLEAN_SURFACE_EDGE '+JSON.stringify({
   seed,center:[cx,cz],authenticWitnesses:samples.length,
   representative:samples.slice(0,3),cachedColumns:world.cachedBiomeColumns
  }));
 }
 assert.ok(m7Additional>0);
 console.log('DESERT_CLEAN_SURFACE_EDGE_TOTAL '+JSON.stringify({
  witnesses:witnessed,totalExtraAffectedEntries:m7Additional
 }));
});
test('3-block refresh includes a diagonal at a true corner and preserves all old geometry neighbors',()=>{
 const sourceWorld={
  seed:179,generationProfile:{generator:M7},
  _columnPlan:()=>new Map([[7,401]])
 };
 const outer={base:sourceWorld,seed:179};
 assert.equal(DESERT_SEAM_VISUAL_RADIUS,3);
 for(const [x,z] of [[13,13],[2,2],[-3,-3],[-14,-14]]){
  const proposed=desertSeamEditAffectedChunks(outer,x,z,7);
  const prior=editAffectedChunks(x,z);
  for(const original of prior)
   assert.ok(proposed.some(p=>key(p)===key(original)),'Never omit geometry seam');
  assert.ok(proposed.length<=5);
  assert.equal(new Set(keys(proposed)).size,proposed.length);
  const cx=chunkCoord(x),cz=chunkCoord(z);
  if(x-cx*16===13&&z-cz*16===13){
   assert.ok(proposed.some(p=>p.cx===cx+1&&p.cz===cz+1),'Corner distance affects diagonal');
  }
 }
 const legacy=new FourRegionWorld(179,fourRegionProfile(179,M6));
 for(const [x,z,y] of [[13,13,7],[-3,-3,4],[-16,-16,0]]){
  assert.deepEqual(desertSeamEditAffectedChunks(legacy,x,z,y),editAffectedChunks(x,z));
 }
 assert.deepEqual(desertSeamEditAffectedChunks(outer,13,13,6),editAffectedChunks(13,13));
});
test('clean original-world meshes and saved edit representations match exact optimized research',()=>{
 let checked=0;
 for(const [seed,cx,cz] of sites){
  const old=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const fresh=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const before=researchMesh(old,cx,cz),after=cleanMesh(fresh,cx,cz);
  assert.deepEqual(after,before,'Source-identical clean branch must preserve all nine floats');
  assert.deepEqual(old.save().edits,[]);
  assert.deepEqual(fresh.save().edits,[]);
  checked+=after.length/9;
  console.log('DESERT_CLEAN_M7_ORIGINAL '+JSON.stringify({
   seed,chunk:[cx,cz],vertices:after.length/9,bytes:after.byteLength,sourceEqual:true,
   candidateCache:fresh.cachedBiomeColumns
  }));
 }
 const source=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const destination=new FourRegionWorld(179,fourRegionProfile(179,M7));
 for(const [x,y,z,replacement,original] of [
  [-786,4,-1774,400,401],[-786,4,-1775,257,258]
 ]){
  assert.equal(source.get(x,y,z),original);
  assert.equal(destination.get(x,y,z),original);
  assert.ok(source.set(x,y,z,replacement));
  assert.ok(destination.set(x,y,z,replacement));
 }
 assert.deepEqual(destination.save().edits,source.save().edits);
 assert.deepEqual(cleanMesh(destination,-50,-111),researchMesh(source,-50,-111));
 console.log('DESERT_CLEAN_EDIT_MESH '+JSON.stringify({
  rows:destination.save().edits.length,editedChunk:[-50,-111],equal:true,
  totalSourceVertices:checked
 }));
});
test('real Snow/Enchanted/Plains original climates and protected original veto cannot produce bilateral cues',()=>{
 let realExcluded=0,originalVeto=0;
 for(const [seed,cx,cz] of sites){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  for(let dz=-24;dz<=24;dz+=2)for(let dx=-24;dx<=24;dx+=2){
   const x=cx*16+dx,z=cz*16+dz;
   const region=v6BiomeAt(x,z,seed),cap=topPlan(world,x,z);
   if(!cap){
    originalVeto++;
    assert.equal(canWarmSourceScree({
      id:401,edited:false,region,sourceSurface:null,y:0}),false);
    assert.equal(canUseDesertHardpanCue({
      sourceSurface:null,region,edited:false,actualId:258,atY:0,sampleY:0}),false);
   }
   if(region?.name!=='desert'&&region?.name!=='mountain'){
    realExcluded++;
    assert.equal(canWarmSourceScree({
      id:401,edited:false,region,sourceSurface:{top:7,id:401},y:7}),false);
    assert.equal(canUseDesertHardpanCue({
      sourceSurface:{top:7,id:258},region,edited:false,
      actualId:258,atY:7,sampleY:7}),false);
   }
  }
  assert.ok(world.cachedBiomeColumns<=1024);
 }
 assert.ok(realExcluded>0);
 assert.ok(originalVeto>0);
 console.log('DESERT_CLEAN_NEGATIVE_V7 '+JSON.stringify({
  nonDesertOrMountainSamples:realExcluded,originalVetoColumns:originalVeto
 }));
});


test('real original M7 source-cap mining demonstrably changes nearby unrefreshed chunk RGB',()=>{
 let found=null,examined=0;
 for(const [seed,centerCx,centerCz] of sites){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const oldUnedited=new Map();
  const options=[];
  for(const [orient,localFixed] of [['east',13],['west',2],['south',13],['north',2]]){
   for(let local=0;local<16;local++){
    const x=centerCx*16+(orient==='east'||orient==='west'?localFixed:local);
    const z=centerCz*16+(orient==='north'||orient==='south'?localFixed:local);
    const top=topPlan(world,x,z);
    if(!top||!(top.id===401||top.id===258))continue;
    if(world.get(x,top.y,z)!==top.id)continue;
    if(top.id===258){
      const r=v6BiomeAt(x,z,seed);
      if(r?.name!=='desert'||r.weight>.5)continue;
    }
    const {cx,cz}=orient==='east'?{cx:centerCx+1,cz:centerCz}:
      orient==='west'?{cx:centerCx-1,cz:centerCz}:
      orient==='south'?{cx:centerCx,cz:centerCz+1}:{cx:centerCx,cz:centerCz-1};
    const legacy=editAffectedChunks(x,z);
    if(legacy.some(v=>v.cx===cx&&v.cz===cz))continue;
    const expanded=desertSeamEditAffectedChunks(world,x,z,top.y);
    if(!expanded.some(v=>v.cx===cx&&v.cz===cz))continue;
    options.push({seed,x,y:top.y,z,id:top.id,replacement:top.id===401?400:257,
      recipient:[cx,cz],orient});
   }
  }
  for(const option of options){
    examined++;
    const [cx,cz]=option.recipient,k=cx+','+cz;
    let before=oldUnedited.get(k);
    if(!before){before=cleanMesh(world,cx,cz);oldUnedited.set(k,before);}
    assert.ok(world.set(option.x,option.y,option.z,option.replacement));
    const after=cleanMesh(world,cx,cz);
    assert.equal(after.length,before.length,'Source edit outside recipient may not alter recipient geometry');
    let changedRGB=0;
    for(let i=0;i<before.length;i+=9){
      for(const j of [0,1,2,6,7,8])
        assert.equal(after[i+j],before[i+j],
          'Only original source-owned neighbor terrain RGB can react to edit');
      if(before[i+3]!==after[i+3]||before[i+4]!==after[i+4]||
         before[i+5]!==after[i+5]){
        assert.ok(before[i+8]===40||before[i+8]===42);
        changedRGB++;
      }
    }
    assert.ok(world.set(option.x,option.y,option.z,option.id));
    assert.deepEqual(world.save().edits,[],'Source edit restored cleanly');
    if(changedRGB>0){found={...option,changedRGB,vertices:after.length/9};break;}
  }
  if(found)break;
 }
 console.log('DESERT_CLEAN_ACTUAL_NEIGHBOR_RGB_EDIT '+JSON.stringify({examined,found}));
 assert.ok(found,
   'Original M7 edit within visual halo must demonstrate a real changed recipient RGB under the new invalidation rule');
});
