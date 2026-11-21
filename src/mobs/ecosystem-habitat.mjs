// Experimental Phase 2: habitat-first selection, not wired into live game.
// Deterministic candidate pooling avoids global 40-species lottery rejections.
import {speciesRegistry} from './species.mjs';

export const ACTIVE_HABITATS=Object.freeze([
  'meadow','forest','alpine','desert','snow','cave'
]);

export function eligibleHabitatPool(environment,registry=speciesRegistry){
  const {biome,light,feet}=environment??{};
  if(!ACTIVE_HABITATS.includes(biome)||!Number.isFinite(light)||
      light<0||light>1||!Number.isFinite(feet)||
      !Array.isArray(registry))throw new TypeError('Invalid habitat selection input');
  return Object.freeze(registry.filter(creature=>
    creature?.implementation==='preview'&&creature.lifecycle.replenishes&&
    creature.habitat.biomes.includes(biome)&&
    feet>=creature.habitat.depth[0]&&feet<=creature.habitat.depth[1]&&
    light>=creature.habitat.light[0]&&light<=creature.habitat.light[1]));
}

// Weighted pick preserves source rarity and eligible registry ordering.
// This does not bypass the actual per-region population limit, ground, water,
// occupancy, residency, or physics checks (future integration gates).
export function chooseHabitatSpecies(pool,roll){
  if(!Array.isArray(pool)||!Number.isFinite(roll)||roll<0||roll>=1)
    throw new TypeError('Invalid habitat draw');
  if(!pool.length)return null;
  let total=0;
  for(const creature of pool){
    if(!Number.isFinite(creature.population.rarity)||
        creature.population.rarity<=0)throw new TypeError('Invalid habitat weight');
    total+=creature.population.rarity;
  }
  let target=roll*total;
  for(const creature of pool){
    target-=creature.population.rarity;
    if(target<0)return creature;
  }
  return pool[pool.length-1];
}

export function deterministicHabitatRoll(seed,cx,cz,section,attempt){
  if(![seed,cx,cz,section,attempt].every(Number.isSafeInteger))
    throw new TypeError('Invalid habitat draw seed');
  let n=(seed|0)^Math.imul(cx,0x9e3779b9)^Math.imul(cz,0x85ebca6b)^
    Math.imul(section,0xc2b2ae35)^Math.imul(attempt,0x27d4eb2d);
  n=Math.imul(n^(n>>>16),0x7feb352d);
  n=Math.imul(n^(n>>>15),0x846ca68b);
  return ((n^(n>>>16))>>>0)/4294967296;
}
