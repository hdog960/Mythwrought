// C7 read-only source handoff for original C5 Sunbarrow 3-wide caravan gate.
// Future settlement builders get geometry and road sockets, NOT spawn permissions.
import {createRoadmapCFortificationHandoff} from './c-settlement-handoff.mjs';
import {createCSunbarrowCaravanGatehouse} from './c5-sunbarrow-desert-gatehouse.mjs';
export function createCSunbarrowFortificationHandoff(){
 const p=createRoadmapCFortificationHandoff(createCSunbarrowCaravanGatehouse());
 if(p.id!=='r3:gatehouse:desert:small:1'||p.gateway.width!==3||
  p.gateway.height!==3||p.gateway.sourceRouteLength!==34||p.roadSockets.length!==2)
  throw Error('Sunbarrow source sockets corrupted');
 return p;
}
