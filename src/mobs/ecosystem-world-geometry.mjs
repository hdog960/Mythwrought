// Experimental M7 mob collision reader, never imported by live gameplay.
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
  return new Proxy(world,{
    get(target,property){
      if(property==='get')return (x,y,z)=>{
        const id=target.get(x,y,z);
        return environmentGround(id)?BLOCK.STONE:id;
      };
      const value=Reflect.get(target,property,target);
      return typeof value==='function'?value.bind(target):value;
    },
    set(){return false;},
    defineProperty(){return false;},
    deleteProperty(){return false;}
  });
}
