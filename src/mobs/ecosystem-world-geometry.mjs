// Explicit opt-in environmental mob collision reader for current owner-approved profiles.
// Source-established player physics treats registered M7 terrain ID 400-410
// as full-cube solid; world-query.mjs currently treats those IDs as unknown.
import {BLOCK} from '../voxel.mjs';
import {environmentGround} from '../environment-ground.mjs';
import {isEnvironmentGenerator,M8_MOUNTAIN_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {mountainV8Material} from '../manual-biomes/mountain-v8-materials.mjs';

export function createM7MobCollisionReader(world){
  if(!world||typeof world.get!=='function')
    throw new TypeError('M7 mob reader requires the original voxel world');
  const generator=world.base?.generationProfile?.generator??
    world.generationProfile?.generator;
  if(!isEnvironmentGenerator(generator))
    throw new TypeError('M7 mob reader requires an exact M7 generator or owner-approved environmental successor');
  // A deliberately small immutable *reader interface*. Never expose the
  // original world's set(), save(), base or edits mutation capabilities.
  // The original mob world-query reads only these source-backed operations.
  // Resolve the current owner layer at read time. Capturing the initial
  // layer loses late attachment/replacement; omitting target loses shaped
  // occluders even though their collision is still solid.
  const pack3View=Object.freeze({
    size:()=>world.pack3Runtime?.size?.()??1,
    playerFits:bounds=>world.pack3Runtime?.playerFits?.(bounds)??{fits:false},
    target:(...args)=>typeof world.pack3Runtime?.target==='function'?
      world.pack3Runtime.target(...args):true
  });
  const manual14View=Object.freeze({
    size:()=>world.manual14Layer?.size?.()??1,
    target:(...args)=>typeof world.manual14Layer?.target==='function'?
      world.manual14Layer.target(...args):true
  });
  const manual14Collision=bounds=>world.manual14Collision(bounds);
  const pack5Collision=bounds=>world.pack5Collision(bounds);
  return Object.freeze({
    get(x,y,z){
      const id=world.get(x,y,z);
      return environmentGround(id)?BLOCK.STONE:id;
    },
    // The V8 owner defines partial solid trunks and non-solid flora. Keep
    // their actual descriptors rather than silently treating them as cubes.
    mobMountainShape:generator===M8_MOUNTAIN_GENERATOR?mountainV8Material:undefined,
    getPack2State:typeof world.getPack2State==='function'?
      (...args)=>world.getPack2State(...args):undefined,
    rotationAt:typeof world.rotationAt==='function'?
      (...args)=>world.rotationAt(...args):undefined,
    get pack3Runtime(){return world.pack3Runtime?pack3View:undefined;},
    get manual14Layer(){return world.manual14Layer?manual14View:undefined;},
    get manual14Collision(){return typeof world.manual14Collision==='function'?
      manual14Collision:undefined;},
    get pack5Collision(){return typeof world.pack5Collision==='function'?
      pack5Collision:undefined;}
  });
}
