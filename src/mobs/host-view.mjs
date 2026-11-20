import { sectionForY } from '../depth.mjs';
import { createWorldQuery, validPoint } from './world-query.mjs';

const biomes=new Set(['meadow','forest','wetland','alpine','desert','snow','cave','volcanic']);
const objectKinds=new Set(['door','switch','climb-surface']);
const phases=new Set(['dawn','day','dusk','night']);

export function createMobHostView(world,{resident,revision,biomeAt,skyAt,caveAt,objectsAt,overlayRayHit}={}) {
  return createWorldQuery(world,{
    resident,revision,overlayRayHit,
    observe(point) {
      const section=sectionForY(Math.floor(point[1]));
      const biome=biomeAt?.(point);
      const cave=caveAt?.(point);
      const sky=skyAt?.(point);
      if (section===null || !biomes.has(biome?.id) || biome.hazard!==false ||
          cave?.ready!==true || !Number.isFinite(sky?.light) || sky.light<0 || sky.light>1 ||
          !phases.has(sky.dayPhase)) return null;
      const objects=objectsAt?.(point);
      const permitted=Array.isArray(objects) ? objects.slice(0,16)
        .filter(object=>object?.permitted===true && objectKinds.has(object.kind) &&
          typeof object.id==='string' && object.id.length>0 && object.id.length<=64 && validPoint(object.position))
        .map(object=>({ id:object.id,kind:object.kind,position:[...object.position] })) : [];
      return {
        biome:biome.id,light:sky.light,dayPhase:sky.dayPhase,objects:permitted,
        hazard:false,climbable:biome.climbable===true || cave.climbable===true
      };
    }
  });
}
