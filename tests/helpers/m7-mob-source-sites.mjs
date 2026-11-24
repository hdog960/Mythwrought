// Test-only original M7 site identities. V6's null sentinel means Plains only
// after validating the exact input contract. Do not change the live classifier.
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
export const M7_MOB_SEEDS=Object.freeze([179,379,1001]);
export const M7_MOB_SURFACES=Object.freeze([
  {biome:'meadow',source:'plains',x:0,z:0},
  {biome:'desert',source:'desert',x:512,z:0},
  {biome:'snow',source:'snow',x:0,z:512},
  {biome:'alpine',source:'mountain',x:-512,z:0},
  {biome:'forest',source:'enchanted',x:0,z:-512}
].map(Object.freeze));
export function m7MobSourceBiome(x,z,seed){
  if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isInteger(seed)||seed!==(seed|0))
    return null;
  return v6BiomeAt(x,z,seed)?.name??'plains';
}
