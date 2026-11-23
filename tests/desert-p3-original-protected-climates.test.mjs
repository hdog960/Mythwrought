// MYTHWROUGHT Desert P3 — ORIGINAL M7 protected cave + landmark/biome
// negative admission. Source-only: no modifications to gameplay files.
// Distinguish actual cave source overrides from generic empty source plans.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7}
 from '../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,chunkCoord} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {canBlendNaturalDesertSurface} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
import {canWarmSourceScree,canUseDesertHardpanCue} from '../src/manual-biomes/desert-bilateral-rgb.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';

const SEEDS=[179,2026,4099];
const SITES=[[179,-786,-1774],[2026,-2848,-774],[4099,302,769]];
function top(plan) {
 if(!plan?.size)return null;
 const y=Math.max(...plan.keys());
 return {y,id:plan.get(y)};
}
function canOriginalTint({id,source,climate,x,y,z,w}) {
 const edited=w.edits.has(x+','+y+','+z);
 return id===258?canBlendNaturalDesertSurface({
  id,edited,region:climate,sourceSurface:source&&{top:source.y,id:source.id},y
 }):canWarmSourceScree({id,edited,region:climate,
  sourceSurface:source&&{top:source.y,id:source.id},y});
}
function noSpuriousCue({w,x,y,z,region,plan}) {
 const src=top(plan),physical=w.get(x,y,z);
 if(!src){
  assert.equal(canOriginalTint({id:258,source:src,climate:region,x,y,z,w}),false);
  assert.equal(canOriginalTint({id:401,source:src,climate:region,x,y,z,w}),false);
  return;
 }
 if(region?.name==='snow'||region?.name==='enchanted'||!region){
  assert.equal(canOriginalTint({id:258,source:src,climate:region,x,y,z,w}),false);
  assert.equal(canOriginalTint({id:401,source:src,climate:region,x,y,z,w}),false);
 }
 if(y!==src.y){
  assert.equal(canOriginalTint({id:src.id,source:src,climate:region,x,y,z,w}),false);
 }
 if(physical===BLOCK.AIR){
  assert.ok(src.id!==BLOCK.AIR||y!==src.y||plan.size===0);
 }
}

test('actual original V7 cave entrance source overrides remain authoritative and cannot create counterfeit Desert caps',()=>{
 const all=[];
 let caveCells=0,modifiedCaveCells=0,caveVetoes=0,protectedAtEntrances=0;
 for(const seed of SEEDS){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const sites=w.environmentCaves.entranceSites;
  assert.ok(Array.isArray(sites)&&sites.length>0,
   'Actual original CaveVoxelWorld must publish verified entrance sites');
  const sample={seed,entrances:sites.map(s=>({name:s.name,mouth:s.mouth})),cells:0,
   caveOverrides:0,zeroPlan:0,actualCaveBlocks:0};
  for(const {mouth} of sites){
   assert.ok(Array.isArray(mouth)&&mouth.length===3);
   const [mx,my,mz]=mouth;
   assert.ok([mx,my,mz].every(Number.isInteger));
   // The original mouths/steps are seeded by cave original source rather
   // than chosen by this Desert test. Bound search around every actual mouth.
   for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    const x=mx+dx,z=mz+dz;
    const climate=v6BiomeAt(x,z,seed);
    const plan=w._columnPlan(x,z);
    if(!plan.size){sample.zeroPlan++;protectedAtEntrances++;}
    const surface=top(plan);
    for(let y=Math.max(-3,my-4);y<=Math.min(19,my+4);y++){
     const cave=w.environmentCaves.get(x,y,z);
     if(cave===undefined)continue;
     caveCells++;sample.cells++;
     const baseline=VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,y,z);
     const actual=w._environmentBaseline(x,y,z,baseline);
     assert.equal(actual,cave,
      'Actual generated cave cells must supersede the protected landscape baseline');
     if(cave!==baseline){modifiedCaveCells++;sample.caveOverrides++;}
     if(!plan.size){
      caveVetoes++;noSpuriousCue({w,x,y,z,region:climate,plan});
      assert.equal(w.get(x,y,z),cave,'Unplanned original cave cell must remain authoritative');
     }
     if(w.get(x,y,z)===cave)sample.actualCaveBlocks++;
     if(surface&&y<surface.y){
      assert.equal(canOriginalTint({id:401,source:surface,climate,x,y,z,w}),false,
       'Underground exposed material cannot be promoted into a surface cue');
     }
    }
   }
  }
  assert.ok(w.cachedBiomeColumns<=1024);
  assert.deepEqual(w.save().edits,[]);
  all.push(sample);
 }
 assert.ok(caveCells>0,'Must witness some REAL author-sourced cave cells near real mouths');
 assert.ok(modifiedCaveCells>0,'Must witness real cave cell precedence over terrain');
 console.log('DESERT_P3_REAL_CAVE_ENTRANCE_PROVENANCE '+JSON.stringify({
  caveCells,modifiedCaveCells,caveVetoes,protectedAtEntrances,
  originalSites:all,
  note:'Only local verified cave-mouth neighborhoods; not all original caves'
 }));
});

test('original guarded Desert junction columns vetoed by caves, landmarks or protected baseline never admit fake top colors',()=>{
 let protectedColumns=0,protectedCandidateHints=0,nonTopChecks=0;
 const bySeed=[];
 for(const [seed,centerX,centerZ] of SITES){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const witness=[];
  for(let dx=-17;dx<=17;dx++)for(let dz=-17;dz<=17;dz++){
   const x=centerX+dx,z=centerZ+dz;
   const region=v6BiomeAt(x,z,seed);
   const plan=w._columnPlan(x,z);
   if(plan.size)continue;
   protectedColumns++;
   // Read source BASELINE (not game edits) and actual environmental cave
   // override separately to avoid calling every empty column a cave.
   let caveWitness=false,nonNaturalWitness=false;
   const old=terrainHeight(x,z,seed);
   for(let y=Math.max(-3,old-2);y<=19;y++){
    const source=w.environmentCaves.get(x,y,z);
    if(source!==undefined)caveWitness=true;
    const legacy=VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,y,z);
    const prior=w._environmentBaseline(x,y,z,legacy);
    if(y>old?prior!==BLOCK.AIR:
      ![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior))
      nonNaturalWitness=true;
   }
   if(caveWitness||nonNaturalWitness)protectedCandidateHints++;
   noSpuriousCue({w,x,y:old,z,region,plan});
   const same=desertSeamEditAffectedChunks(w,x,z,old);
   assert.deepEqual(same,editAffectedChunks(x,z),
    'Protected original plan cannot introduce visual-radius neighbor updates');
   const fakeAbove=old+1;
   noSpuriousCue({w,x,y:fakeAbove,z,region,plan});
   nonTopChecks++;
   if(witness.length<3)witness.push({at:[x,old,z],region:region?.name??'plains',
    caveSourceAtColumn:caveWitness,protectedBaseline:nonNaturalWitness});
  }
  assert.ok(w.cachedBiomeColumns<=1024);
  assert.deepEqual(w.save().edits,[]);
  bySeed.push({seed,witness});
 }
 assert.ok(protectedColumns>=50,'Audit must cover many genuinely vetoed original M7 columns');
 console.log('DESERT_P3_PROTECTED_JUNCTION_VETO '+JSON.stringify({
  protectedColumns,protectedCandidateHints,nonTopChecks,examples:bySeed,
  note:'A veto does not necessarily imply an original cave; cave and baseline classified independently'
 }));
});

test('genuine Snow, Enchanted, Plains and distant Mountain source plans never admit reciprocal Desert colors',()=>{
 const classes=['snow','enchanted','plains','mountain'];
 const results={};let total=0,positivePlans=0;
 const w=new FourRegionWorld(179,fourRegionProfile(179,M7));
 for(const name of classes){
  let seen=0,originalPlans=0,blocked=0,examples=[];
  // Seek real, sufficiently deep original biome interiors. 512-step tiles,
  // no spoofed weather/biome objects. Plains is the authentic null region.
  for(let z=-2304;z<=2304&&seen<7;z+=128)
    for(let x=-2304;x<=2304&&seen<7;x+=128){
      const region=v6BiomeAt(x,z,179);
      if((region?.name??'plains')!==name)continue;
      if(region&&region.weight<.8)continue;
      const plan=w._columnPlan(x,z),cap=top(plan);
      seen++;total++;
      if(cap){
       positivePlans++;originalPlans++;
       for(const y of [cap.y,cap.y-1,cap.y+1]){
        // The real original cap and source provenance are used directly.
        noSpuriousCue({w,x,y,z,region,plan});
        const fake={top:cap.y,id:cap.id};
        if(name==='snow'||name==='enchanted'||name==='plains'){
         assert.equal(canBlendNaturalDesertSurface({
          id:258,edited:false,region,sourceSurface:fake,y:cap.y}),false);
         assert.equal(canWarmSourceScree({
          id:401,edited:false,region,sourceSurface:fake,y:cap.y}),false);
         blocked++;
        }else if(region?.weight>.55){
         assert.equal(canWarmSourceScree({
          id:401,edited:false,region,sourceSurface:{top:cap.y,id:401},y:cap.y}),false);
         blocked++;
        }
       }
      }else {
       noSpuriousCue({w,x,y:7,z,region,plan});blocked++;
      }
      if(examples.length<2)examples.push({x,z,cap:cap?.id??null,
       y:cap?.y??null,weight:region?.weight??null});
    }
  assert.ok(seen>=2,'Original climate must have genuine sampled sites: '+name);
  assert.ok(blocked>0,'Original climate must be excluded: '+name);
  results[name]={seen,originalPlans,blocked,examples};
 }
 assert.ok(positivePlans>0);
 assert.ok(w.cachedBiomeColumns<=1024);
 assert.deepEqual(w.save().edits,[]);
 console.log('DESERT_P3_ORIGINAL_NON_DESERT_NEGATIVES '+JSON.stringify({total,positivePlans,classes:results}));
});

test('actual edited hardpan and scree source caps cannot act as ORIGINAL cue until source edit is restored',()=>{
 const w=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const src=[[-786,4,-1774,401,400],[-786,4,-1775,258,257]];
 const examples=[];
 for(const [x,y,z,original,replacement] of src){
  assert.equal(w.get(x,y,z),original);
  const plan=w._columnPlan(x,z),cap=top(plan),region=v6BiomeAt(x,z,w.seed);
  assert.equal(cap?.y,y);assert.equal(cap?.id,original);
  assert.ok(w.set(x,y,z,replacement));
  assert.equal(w.get(x,y,z),replacement);
  assert.ok(w.edits.has(x+','+y+','+z));
  assert.equal(canOriginalTint({id:original,source:cap,climate:region,x,y,z,w}),false);
  assert.equal(canUseDesertHardpanCue({sourceSurface:{top:y,id:258},region:{
   name:'desert',weight:.4},edited:true,actualId:258,atY:y,sampleY:y}),false);
  assert.ok(w.set(x,y,z,original));
  assert.equal(w.edits.has(x+','+y+','+z),false);
  examples.push({x,y,z,original,replacement,restored:true});
 }
 assert.deepEqual(w.save().edits,[]);
 const mesh=meshChunk(w,chunkCoord(-786),chunkCoord(-1774));
 assert.ok(mesh instanceof Float32Array&&mesh.length%9===0);
 assert.ok(w.cachedBiomeColumns<=1024);
 console.log('DESERT_P3_SOURCE_EDIT_RECOVERY '+JSON.stringify({
  examples,restoredRows:0,originalMeshVertices:mesh.length/9
 }));
});
