// Existing Block Packs remain responsible for geometry, state and world saves
// for these roster slots. This adapter produces their ordinary builder inputs.
import {planManualFivePackBlueprint} from '../builder-assets/manual-five-pack.mjs';

const definitions = new Map([
  ['scene36:hinged-door-leaf',{asset:'pack2:020',numericId:67,hinge:true}],
  ['scene36:double-door-pair',{asset:'pack2:020',numericId:67,hinge:true,pair:true}],
  ['scene36:trapdoor',{asset:'pack2:021',numericId:68,hinge:true,variant:'lower'}],
  ['scene36:swinging-gate',{asset:'pack2:019',numericId:66,hinge:true}],
  ['scene36:window-shutters',{asset:'pack4:033',numericId:163}],
  ['scene36:hinged-hatch',{asset:'pack2:021',numericId:68,hinge:true,variant:'upper'}],
  ['scene36:fence-rail',{asset:'pack2:018',numericId:65}],
  ['scene36:fabric-awning',{asset:'pack4:062',numericId:175}],
  ['scene36:wall-torch-bracket',{asset:'pack4:038',numericId:168}],
  ['scene36:direction-sign',{asset:'pack4:060',numericId:173}],
  ['scene36:pennant-flag',{asset:'pack4:061',numericId:174}]
]);
export const OWNED_FITTING_IDS=Object.freeze([...definitions.keys()]);

export function planOwnedFitting(sceneId,{anchor,orientation=0,open=false}={}) {
  const definition=definitions.get(sceneId);
  if(!definition||!Array.isArray(anchor)||anchor.length!==3||
    !anchor.every(Number.isSafeInteger)||!Number.isInteger(orientation)||
    orientation<0||orientation>3||typeof open!=='boolean'||open&&!definition.hinge)
    throw new TypeError('Invalid source-owned fitting');

  const state=definition.hinge?{open}:null;
  if(definition.variant)state.variant=definition.variant;
  if(state)Object.freeze(state);
  const entry=(at,yaw)=>Object.freeze({
    asset:definition.asset,numericId:definition.numericId,at:Object.freeze(at),orientation:yaw,
    ...(state?{state}:{})
  });
  const placements=[entry([...anchor],orientation)];
  if(definition.pair){
    const [x,z]=[[1,0],[0,1],[-1,0],[0,-1]][orientation];
    const second=[anchor[0]+x,anchor[1],anchor[2]+z];
    if(!second.every(Number.isSafeInteger))throw new RangeError('Paired door coordinates exceed safe range');
    placements.push(entry(second,(orientation+2)%4));
  }
  return Object.freeze({
    sceneId,placements:Object.freeze(placements),
    blueprint:planManualFivePackBlueprint(placements)
  });
}
