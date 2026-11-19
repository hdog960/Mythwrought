// Existing Block Packs remain responsible for geometry, state and world saves
// for these roster slots. This adapter produces their ordinary builder inputs.
import {Pack2LiveWorld,savePack2LiveWorld} from '../pack2-world.mjs';
import {BLOCK,BODY_HEIGHT,BODY_RADIUS} from '../voxel.mjs';
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

// Stage a pair against the real Pack 2 owner and commit one owner snapshot.
// If its journal or primary write fails, restore the exact observed bytes.
export function placeOwnedDoorPair(options,{world,storage,rebuild,player}) {
  const placed=[], writes=new Map();
  let needsReplay=false;
  try {
    if (!(world instanceof Pack2LiveWorld) || !storage || typeof rebuild!=='function' ||
        ![player?.x,player?.feet,player?.z].every(Number.isFinite))
      throw new TypeError('Missing live Pack 2 placement owner');
    const {placements,blueprint}=planOwnedFitting('scene36:double-door-pair',options);
    const body=[player.x-BODY_RADIUS,player.feet,player.z-BODY_RADIUS,
      player.x+BODY_RADIUS,player.feet+BODY_HEIGHT,player.z+BODY_RADIUS];
    for(const asset of blueprint.physicalAssets){
      if(world.get(...asset.at)!==BLOCK.AIR)throw new Error('A door position is already occupied');
      if(asset.collision.some(box=>[0,1,2].every(axis=>
        box[axis]<body[axis+3]&&box[axis+3]>body[axis])))
        throw new Error('A door leaf overlaps the player');
    }
    for(const row of placements){
      if(!world.placePack2(...row.at,row.numericId,{...row.state,rotation:row.orientation}))
        throw new Error('Pack 2 declined a door leaf');
      placed.push(row.at);
    }
    for(const [x,y,z] of placed)rebuild(x,z,y);
    const trackedStorage={
      getItem:key=>storage.getItem(key),
      setItem(key,value) {
        const previous=writes.has(key)?writes.get(key).previous:storage.getItem(key);
        writes.set(key,{previous,value});
        storage.setItem(key,value);
      }
    };
    const saved=savePack2LiveWorld(trackedStorage,world);
    if(!saved.ok)throw new Error(saved.reason);
    return {ok:true,at:placed.map(cell=>[...cell]),verifiedSave:true};
  }catch(error){
    for(const cell of placed)if(!world.set(...cell,BLOCK.AIR))needsReplay=true;
    for(const [key,{previous,value}] of writes){
      try{
        const current=storage.getItem(key);
        if(current===value&&current!==previous){
          if(previous===null)storage.removeItem(key);
          else storage.setItem(key,previous);
        }
        if(storage.getItem(key)!==previous)needsReplay=true;
      }catch{
        needsReplay=true;
      }
    }
    for(const [x,y,z] of placed)try{rebuild(x,z,y);}catch{needsReplay=true;}
    return {ok:false,reason:String(error.message??error),requiresRecovery:needsReplay};
  }
}
