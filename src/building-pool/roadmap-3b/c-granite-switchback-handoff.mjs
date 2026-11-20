// C7 future settlement handoff for original mountain Switchback closed ring.
// Read-only physical source data; NO active world placement, towns, saves, NPCs.
import {createRoadmapCFortificationHandoff} from './c-settlement-handoff.mjs';
import {createCGraniteSwitchbackCityWall} from './c6-granite-switchback-mountain-wall.mjs';
export function createCGraniteSwitchbackHandoff(){
 const a=createRoadmapCFortificationHandoff(createCGraniteSwitchbackCityWall());
 if(a.id!=='r3:city-wall:mountain:small:1'||
  a.defendedRampart?.length!==176||a.gateway.sourceRouteLength!==14||
  a.roadSockets?.length!==2||a.wallJoinSockets?.length!==8)
  throw Error('C7 mountain wall closed-ring source witness drift');
 return a;
}
