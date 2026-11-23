// Explicit opt-in M7 mob collision reader, used only for exact M7 live worlds.
// Source-established player physics treats registered M7 terrain ID 400-410
// as full-cube solid; world-query.mjs currently treats those IDs as unknown.
import {BLOCK} from '../voxel.mjs';
import {environmentGround,M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';

export function createM7MobCollisionReader(world){
  if(!world||typeof world.get!=='function')
    throw new TypeError('M7 mob reader requires the original voxel world');
  const generator=world.base?.generationProfile?.generator??
    world.generationProfile?.generator;
  if(generator!==M7_ENVIRONMENT_GENERATOR)
    throw new TypeError('M7 mob reader requires the exact M7 generator');
  // A deliberately small immutable *reader interface*. Never expose the
  // original world's set(), save(), base or edits mutation capabilities.
  // The original mob world-query reads only these source-backed operations.
  const pack3=world.pack3Runtime;
  const shapeOverlay=pack3?.size&&pack3?.playerFits?
    Object.freeze({
      size:()=>pack3.size(),
      playerFits:bounds=>pack3.playerFits(bounds)
    }):undefined;
  return Object.freeze({
    get(x,y,z){
      const id=world.get(x,y,z);
      return environmentGround(id)?BLOCK.STONE:id;
    },
    getPack2State:typeof world.getPack2State==='function'?
      (...args)=>world.getPack2State(...args):undefined,
    rotationAt:typeof world.rotationAt==='function'?
      (...args)=>world.rotationAt(...args):undefined,
    pack3Runtime:shapeOverlay,
    manual14Collision:typeof world.manual14Collision==='function'?
      bounds=>world.manual14Collision(bounds):undefined,
    pack5Collision:typeof world.pack5Collision==='function'?
      bounds=>world.pack5Collision(bounds):undefined
  });
}
