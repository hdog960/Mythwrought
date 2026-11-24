// SKY S6 controlled V6 compatibility: READ ONLY biome authority.
// Original V2–V5 sky adapter remains byte-identical to accepted PR #269.
// V6 terrain remains wholly owned by src/manual-biomes/v6-balanced-biomes.mjs.
import {v6BiomeAt,V6_BIOME_TILE_SIZE} from './manual-biomes/v6-balanced-biomes.mjs';
import {M6_BALANCED_GENERATOR,isEnvironmentGenerator} from './manual-biomes/profile-world.mjs';
const NAMES=Object.freeze(['mountain','desert','snow','enchanted']);
const smooth=t=>{const u=Math.max(0,Math.min(1,t));return u*u*(3-2*u);};
function verifiedV6(world){
  const p=world?.base?.generationProfile;
  return Boolean(p&&typeof p==='object'&&!Array.isArray(p)&&
    Object.keys(p).sort().join(',')==='generator,kind,seed,version'&&
    p.kind==='mythwrought-generation-profile'&&p.version===1&&
    [M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR].includes(p.generator)&&Number.isInteger(p.seed)&&
    p.seed===(p.seed|0)&&Number.isInteger(world?.seed)&&
    world.seed===(world.seed|0)&&world.seed===p.seed&&
    world.base?.seed===p.seed);
}
export const hasValidatedV6SkyProfile=world=>verifiedV6(world);
export function resolveV6SkyBiome(world,x,z){
  if(!verifiedV6(world)||!Number.isFinite(x)||!Number.isFinite(z))return null;
  // Authority is the exact production generator, never a hand-authored V6 map.
  const region=v6BiomeAt(x,z,world.seed);
  if(region===null)return null; // Plains: exact unmodified S0–S5 atmosphere.
  if(!region||!NAMES.includes(region.name)||
    !Number.isFinite(region.weight)||region.weight<.35||region.weight>1||
    !Array.isArray(region.center)||region.center.length!==2||
    !region.center.every(n=>Number.isInteger(n)&&n%V6_BIOME_TILE_SIZE===0))
    return null;
  return Object.freeze({name:region.name,
    strength:smooth((region.weight-.35)/.60),weight:region.weight,
    generator:world.base.generationProfile.generator,seed:world.seed,
    center:Object.freeze({x:region.center[0],z:region.center[1]})});
}
export const S6_V6_AUTHORITY=Object.freeze({
  source:'src/manual-biomes/v6-balanced-biomes.mjs',
  generator:M6_BALANCED_GENERATOR,biomes:Object.freeze(['plains',...NAMES]),
  plains:'neutral-exact-S5',otherBiomes:'original-S6-bounded-accents',
  additionalDrawCalls:0,persistentWrites:0,terrainChanges:0});
