import {VEILREACH_GENERATOR} from '../environment-ground.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
import {createSkylands} from './generation.mjs';

const sourceVersion='veilreach-natural-v1';
export function createVeilreachSource(seed){
  const terrain=createSkylands(seed),registry=createUpperNaturalRegistry();
  registry.register(VEILREACH_GENERATOR,sourceVersion,profile=>({
    ...profile,get:terrain.get,occupied(key){
      const [cx,cz,section]=key.slice(4).split(',').map(Number);
      return Boolean(terrain.sectionMask(cx,cz)&1<<section);
    },revision:()=>1
  }));
  const source=registry.open({kind:'mythwrought-upper-source-profile',version:1,
    generator:VEILREACH_GENERATOR,seed,sourceVersion});
  return Object.freeze({...source,supportedCells:terrain.supportedCells});
}
