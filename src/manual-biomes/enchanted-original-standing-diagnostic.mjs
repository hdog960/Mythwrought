// Phase 2 isolated READ-ONLY research. Mirrors originalM7PedestrianCap's
// ordered rejection guards exactly. An empty environmental-column overlay
// is not equivalent to missing historical physical terrain; separately
// inspect original world blocks, without modifying ground or claiming a
// successful route. Never import this into production or save data.
import {BLOCK,collides,terrainHeight} from '../voxel.mjs';
import {GROUND_PROBE} from '../physics.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {originalM7PedestrianCap} from './enchanted-original-pedestrian-search.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';

export const ENCHANTED_STANDING_DIAGNOSTIC_MAX_PROBES=20;
export function diagnoseOriginalM7Standing(world,x,z){
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     world.experimentalEnchantedTrees!==false||
     !Number.isSafeInteger(x)||!Number.isSafeInteger(z))
    throw Error('Invalid original M7 standing diagnostic');
  const column=world._columnPlan(x,z);
  if(!(column instanceof Map))throw Error('Unexpected original M7 column source');
  const historical=originalM7PedestrianCap(world,x,z);
  const result={x,z,overlaySize:column.size,legacyTop:terrainHeight(x,z,world.seed),
    overlayTop:null,reason:null,capFeet:null,caveAtCap:null,
    sourceCap:null,headOne:null,headTwo:null,worldCap:null,
    bodyCollision:null,groundProbe:null,
    fallback:{
      attempted:false,probes:0,groundedAt:null,
      supportedOriginalFeet:null,sourceMaterial:null,
      physicalBodyClear:null,physicalGroundContact:null,
      caveAtSupport:null
    },originalCapMatches:false};
  let why=null,surface=null;
  if(!column.size)why='empty-environment-overlay';
  else{
    surface=Math.max(...column.keys());
    result.overlayTop=surface;
    if(surface<3||surface>WORLD_MAX_Y-3)why='overlay-top-out-of-range';
    else{
      const source=y=>column.get(y)??world._environmentBaseline(x,y,z);
      result.sourceCap=source(surface);
      result.headOne=source(surface+1);
      result.headTwo=source(surface+2);
      result.caveAtCap=world.environmentCaves?.get(x,surface,z)??null;
      if(result.sourceCap===BLOCK.AIR)why='source-cap-air';
      else if(result.headOne!==BLOCK.AIR)why='source-headroom-one';
      else if(result.headTwo!==BLOCK.AIR)why='source-headroom-two';
      else{
        const feet=surface+1;
        result.capFeet=feet;
        result.worldCap=world.get(x,surface,z);
        result.bodyCollision=collides(world,x+.5,feet,z+.5);
        result.groundProbe=collides(world,x+.5,feet-GROUND_PROBE,z+.5);
        if(result.worldCap===BLOCK.AIR)why='world-ground-air';
        else if(result.bodyCollision)why='full-body-collision';
        else if(!result.groundProbe)why='ground-contact-missing';
        else why='accepted';
      }
    }
  }
  result.reason=why;
  result.originalCapMatches=(why==='accepted')===!!historical;
  if(!result.originalCapMatches)
    throw Error('Original M7 standing diagnostic disagreeing with source cap');
  // Independently read *genuine original-world* terrain at or below
  // legacy height when overlay is empty. This cannot mint walking
  // acceptance: only a real original stepPlayer route could certify that.
  if(why==='empty-environment-overlay'){
    result.fallback.attempted=true;
    const lowest=Math.max(2,result.legacyTop-ENCHANTED_STANDING_DIAGNOSTIC_MAX_PROBES);
    for(let y=Math.min(WORLD_MAX_Y-3,result.legacyTop);y>=lowest;y--){
      result.fallback.probes++;
      const material=world.get(x,y,z);
      if(material===BLOCK.AIR)continue;
      const feet=y+1;
      const clear=!collides(world,x+.5,feet,z+.5);
      const supported=collides(world,x+.5,feet-GROUND_PROBE,z+.5);
      result.fallback.groundedAt=y;
      result.fallback.sourceMaterial=material;
      result.fallback.physicalBodyClear=clear;
      result.fallback.physicalGroundContact=supported;
      result.fallback.caveAtSupport=world.environmentCaves?.get(x,y,z)??null;
      if(clear&&supported)result.fallback.supportedOriginalFeet=feet;
      // Stop at the first original-world encountered surface; a lower
      // pocket or cave roof cannot silently replace a blocked headspace.
      break;
    }
  }
  return result;
}

// Separate research-only physical standing accessor. Never treat a missing
// M7 overlay as missing physical terrain; some legacy GRASS columns have
// intentionally zero environmental writes. Require unchanged original
// cave/headroom AIR, real world.get surface, full-body collision and
// genuine original ground probe. A nonempty overlay retains EXACT older
// helper admission (no fallback through a rejected authored M7 overlay).
// This does NOT change the production world/physics, is NOT a cave bridge,
// and is not independently a real walking-route acceptance.
export function originalM7PhysicalGroundCap(world,x,z){
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     !Number.isSafeInteger(x)||!Number.isSafeInteger(z)||
     typeof world._columnPlan!=='function'||
     typeof world._environmentBaseline!=='function')
    throw Error('Invalid original M7 physical ground cap');
  const col=world._columnPlan(x,z);
  if(!(col instanceof Map))
    throw Error('Unexpected original M7 physical column source');
  if(col.size)return originalM7PedestrianCap(world,x,z);
  const y=terrainHeight(x,z,world.seed);
  if(y<3||y>WORLD_MAX_Y-3)return null;
  // Authoritative M7 original source cave/landmark preservation:
  // a source-authored AIR removes the legacy terrain or protected headroom
  // and may not be replaced by an inferred flat/solid voxel.
  if(world._environmentBaseline(x,y,z)===BLOCK.AIR||
     world._environmentBaseline(x,y+1,z)!==BLOCK.AIR||
     world._environmentBaseline(x,y+2,z)!==BLOCK.AIR)
    return null;
  const feet=y+1,px=x+.5,pz=z+.5;
  if(world.get(x,y,z)===BLOCK.AIR||
     collides(world,px,feet,pz)||
     !collides(world,px,feet-GROUND_PROBE,pz))return null;
  return Object.freeze({x,z,surface:y,feet});
}
