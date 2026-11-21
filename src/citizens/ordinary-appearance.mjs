import {BIOMES, RACES, citizenBiome} from './registry.mjs';

const raceIds = Object.keys(RACES);
const pools = Object.fromEntries(BIOMES.map((biome,index) => {
  const alternateRaces = Array.from({length:4},(_,offset) => raceIds[(index+offset)%raceIds.length]);
  const choices = [...raceIds.map(race=>[race,1]),...alternateRaces.map(race=>[race,2])];
  return [biome,Object.freeze(choices.map(([race,variant]) => Object.freeze({
    profession:null,race,variant,biome,
  })))];
}));

export function ordinaryAppearancePool(biome) {
  return pools[citizenBiome(biome)];
}

export function ordinaryOutfit(citizen, climate) {
  return citizen.variant === 1
    ? {leather:climate.outer,trim:climate.lining,cut:'lapels',headwear:'wrap'}
    : {leather:climate.outer,trim:climate.lining,cut:'vest',headwear:'visor'};
}
