// Source-native M7 regression: classify the EXACT 52 failed original-world
// admission probes from the prior accepted checkpoint without changing
// caves, environment columns, source terrain, or old physics.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,collides,terrainHeight} from '../../src/voxel.mjs';
import {GROUND_PROBE} from '../../src/physics.mjs';
import {originalM7PedestrianCap} from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';
import {diagnoseOriginalM7Standing,
  ENCHANTED_STANDING_DIAGNOSTIC_MAX_PROBES}
  from '../../src/manual-biomes/enchanted-original-standing-diagnostic.mjs';

const make=(seed,experimental=false)=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:experimental});
const biome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const directions=(seed,x,z)=>{
 const rows=[];
 for(const [dir,dx,dz] of [['west',-1,0],['east',1,0],
                           ['north',0,-1],['south',0,1]]){
  for(let step=1;step<=16;step++){
   if(biome(x+dx*step,z+dz*step,seed)==='plains'){
    rows.push({dir,distance:step});break;
   }
  }
 }
 return rows.sort((a,b)=>a.distance-b.distance||
  a.dir.localeCompare(b.dir))[0]??null;
};
const HISTORIC_ANCHORS=[[-266,-588],[252,-600]];
const LATITUDE_OFFSETS=[0,-4,4,-8,8,-12,12];

test('the exact prior 52 original seed -88 Enchanted border rejection sites are independently classified',()=>{
 const seed=-88,world=make(seed),alternative=make(seed,true);
 const records=[],groups=[],reasons={};let plausiblePhysicalLegacy=0;
 let noEnvironmentalOverlay=0,actualCaveOverrides=0,missingOverlayPhysicalOriginal=0;
 for(const [baseX,baseZ] of HISTORIC_ANCHORS){
  const near=directions(seed,baseX,baseZ);
  assert.ok(near&&['west','east'].includes(near.dir));
  const step=near.dir==='east'?1:-1;
  const group={anchor:[baseX,baseZ],rows:0,sites:0,reasonCounts:{}};
  for(const dz of LATITUDE_OFFSETS){
   const z=baseZ+dz;
   let boundary=null;
   for(let d=1;d<=16;d++)
    if(biome(baseX+step*d,z,seed)==='plains'){
     boundary=baseX+step*d;break;
    }
   if(boundary===null)continue;
   group.rows++;
   for(const distance of [1,2,3,4]){
    const x=boundary-step*distance;
    if(biome(x,z,seed)!=='enchanted')continue;
    const original=originalM7PedestrianCap(world,x,z);
    assert.equal(original,null,'exact prior near-edge original cap was rejected');
    const d=diagnoseOriginalM7Standing(world,x,z);
    assert.equal(d.originalCapMatches,true);
    // The diagnostic deliberately refuses experimental worlds. Their
    // ORIGINAL column plan still must match historical M7 exactly,
    // without treating opt-in candidate collision as the same admission.
    assert.deepEqual([...alternative._columnPlan(x,z)],
      [...world._columnPlan(x,z)],
      'experimental candidate must never rewrite original M7 source overlay');
    assert.equal(d.legacyTop,terrainHeight(x,z,seed));
    assert.ok(d.fallback.probes<=ENCHANTED_STANDING_DIAGNOSTIC_MAX_PROBES+1);
    assert.ok(d.reason!=='accepted');
    reasons[d.reason]=(reasons[d.reason]??0)+1;
    group.reasonCounts[d.reason]=(group.reasonCounts[d.reason]??0)+1;
    if(d.reason==='empty-environment-overlay'){
      noEnvironmentalOverlay++;
      const y=d.legacyTop,raw=world.get(x,y,z);
      assert.ok(Number.isInteger(raw));
      if(raw!==BLOCK.AIR)missingOverlayPhysicalOriginal++;
    }
    if(d.fallback.supportedOriginalFeet!==null){
      plausiblePhysicalLegacy++;
      assert.equal(d.fallback.physicalBodyClear,true);
      assert.equal(d.fallback.physicalGroundContact,true);
      assert.equal(collides(world,x+.5,
        d.fallback.supportedOriginalFeet,z+.5),false);
      assert.equal(collides(world,x+.5,
        d.fallback.supportedOriginalFeet-GROUND_PROBE,z+.5),true);
    }
    if(d.caveAtCap!==null||d.fallback.caveAtSupport!==null)
      actualCaveOverrides++;
    records.push({x,z,from:[baseX,baseZ],boundary,
      reason:d.reason,overlaySize:d.overlaySize,
      overlayTop:d.overlayTop,legacyTop:d.legacyTop,
      baselineCap:d.sourceCap,head1:d.headOne,head2:d.headTwo,
      originalAtLegacyTop:d.fallback.sourceMaterial,
      originalSupportedFeet:d.fallback.supportedOriginalFeet,
      physicalBodyClear:d.fallback.physicalBodyClear,
      groundProbe:d.fallback.physicalGroundContact,
      caveAtCap:d.caveAtCap,caveAtFallback:d.fallback.caveAtSupport});
    group.sites++;
   }
  }
  groups.push(group);
 }
 assert.deepEqual(groups.map(g=>g.rows),[7,6]);
 assert.deepEqual(groups.map(g=>g.sites),[28,24]);
 assert.equal(records.length,52);
 assert.equal(Object.values(reasons).reduce((s,n)=>s+n,0),52);
 assert.deepEqual(world.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>alternative.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 EXACT 52 ORIGINAL STANDING REJECTION AUDIT '+
   JSON.stringify({seed,groups,reasons,
     noEnvironmentalOverlay,missingOverlayPhysicalOriginal,
     plausiblePhysicalLegacy,actualCaveOverrides,
     records,sameSourceForCandidate:true,
     fallbackIsReadOnlyNotRouteAcceptance:true,
     physicalIphoneNotMeasured:true}));
});

test('original standing diagnosis agrees with certified Desert/Snow walks, rejects candidate world and preserves old M7 saved bytes',()=>{
 const positions=[
  {seed:7919,spots:[[225,-592],[225,-595],[229,-596]]},
  {seed:179,spots:[[268,-600],[271,-592]]},
  {seed:-88,spots:[[-266,-588],[-264,-592],[252,-600],[250,-596],[-266,-584]]}
 ];
 const rows=[];
 for(const {seed,spots} of positions){
  const world=make(seed);
  for(const [x,z] of spots){
   const d=diagnoseOriginalM7Standing(world,x,z);
   const approved=originalM7PedestrianCap(world,x,z);
   assert.equal(d.originalCapMatches,true);
   assert.equal(d.reason==='accepted',!!approved);
   assert.ok(d.fallback.probes<=ENCHANTED_STANDING_DIAGNOSTIC_MAX_PROBES+1);
   rows.push({seed,x,z,reason:d.reason,
     originalFoot:approved?.feet??null,
     originalBaseFallback:d.fallback.supportedOriginalFeet});
  }
  assert.deepEqual(world.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>diagnoseOriginalM7Standing(make(seed,true),
    spots[0][0],spots[0][1]),/Invalid original M7/);
 }
 assert.equal(rows.length,10);
 assert.ok(rows.some(r=>r.reason==='accepted'));
 console.log('# ENCHANTED M7 HISTORICAL STANDING ACCEPTANCE DIAGNOSTIC '+
   JSON.stringify({rows,sourceExactGuardParity:true}));
});
