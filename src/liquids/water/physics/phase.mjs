// Water A: isolated phase-transition staging. No terrain or live engine writes.
import {createLiquidEngine,CELL_CAPACITY,LIQUID_CONTRACT_VERSION} from '../../core/engine.mjs';
import {WATER_DEFINITION} from './definition.mjs';

export const WATER_PHASE_VERSION=1;
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const point=c=>[c.x,c.y,c.z];
const valid=(x,y,z)=>Number.isSafeInteger(x)&&integer(y,-210,256)&&Number.isSafeInteger(z);
const immutableSnapshot=s=>Object.freeze({version:s.version,cells:Object.freeze(s.cells),
  pending:Object.freeze(s.pending.map(p=>Object.freeze(p))),
  ...(s.capacityBlocked?{capacityBlocked:Object.freeze(s.capacityBlocked.map(p=>Object.freeze(p)))}:{}),
  ...(s.lateralPhases?{lateralPhases:Object.freeze(s.lateralPhases.map(p=>Object.freeze(p)))}:{})});

// Frozen entries are conserved water records, NOT another liquid identity or
// a block ID. Only a host-confirmed, full cell may transition. The host owns
// the physical ice representation, owner lease and atomic state adoption.
export function createWaterPhaseTransitions({definitions=[WATER_DEFINITION],reactionRules=[],
  isLoaded,isOpen,temperatureAt,canFreeze,canThaw,allowFreeze=false,allowThaw=false,
  freezeAt=0,thawAt=2,maxCells=8192,maxVisits=256,maxFrozenCells=8192}={}){
  if([isLoaded,isOpen,temperatureAt,canFreeze,canThaw].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit water phase host callbacks required');
  if(typeof allowFreeze!=='boolean'||typeof allowThaw!=='boolean'||
     !Number.isFinite(freezeAt)||!Number.isFinite(thawAt)||freezeAt>=thawAt||
     !integer(maxCells,1,65536)||!integer(maxVisits,1,4096)||!integer(maxFrozenCells,0,65536))
    throw new RangeError('Invalid water phase policy or budget');
  const config={definitions,reactionRules,isLoaded,isOpen,maxCells,maxVisits};
  createLiquidEngine(config);
  if(!definitions.some(d=>d.id==='water'))throw new TypeError('Water definition required');
  function read(state){
    if(state?.version!==WATER_PHASE_VERSION||!Array.isArray(state.frozen)||
       state.frozen.length>maxFrozenCells||!state.resident||
       !Array.isArray(state.resident.cells)||state.resident.cells.length>maxCells||
       !Array.isArray(state.resident.pending)||state.resident.pending.length>state.resident.cells.length)
      throw new TypeError('Invalid or over-budget water phase state');
    if(state.frozen.some(c=>c?.id!=='water'||c.units!==CELL_CAPACITY))
      throw new TypeError('Frozen ledger requires full water records');
    const engine=createLiquidEngine({...config,snapshot:state.resident});
    // Reuse exact core record validation, including quantities, bounds and
    // duplicate coordinates; this temporary validator never runs a flow tick.
    const frozen=createLiquidEngine({...config,maxCells:Math.max(1,maxFrozenCells),
      snapshot:{version:LIQUID_CONTRACT_VERSION,cells:state.frozen,pending:[]}}).save().cells;
    if(frozen.some(c=>engine.getCell(...point(c))!==null))
      throw new TypeError('Frozen water overlaps resident liquid');
    return {engine,frozen};
  }
  const makeState=(engine,frozen)=>Object.freeze({version:WATER_PHASE_VERSION,
    resident:immutableSnapshot(engine.save()),frozen:Object.freeze(frozen)});
  function validate(state){const {engine,frozen}=read(state);return makeState(engine,frozen);}
  // This is a read-only stage operation on a private engine reconstructed
  // from the supplied snapshot. No automatic scan, clock or live tick.
  function stage({state,x,y,z,mode}={}){
    if(!valid(x,y,z)||!['freeze','thaw'].includes(mode))throw new RangeError('Invalid water phase request');
    const {engine,frozen}=read(state);
    if(!(mode==='freeze'?allowFreeze:allowThaw)||isLoaded(x,y,z)!==true||isOpen(x,y,z)!==true)return null;
    const temperature=temperatureAt(x,y,z);
    if(!Number.isFinite(temperature))return null;
    const i=frozen.findIndex(c=>c.x===x&&c.y===y&&c.z===z);
    let water;
    if(mode==='freeze'){
      const c=engine.getCell(x,y,z);
      if(temperature>freezeAt||i!==-1||frozen.length>=maxFrozenCells||
         c?.id!=='water'||c.units!==CELL_CAPACITY||canFreeze(c)!==true)return null;
      water=engine.extract(x,y,z,CELL_CAPACITY);
      if(!water)return null;
      frozen.push(water);
    }else{
      if(temperature<thawAt||i===-1||engine.getCell(x,y,z)!==null)return null;
      water=frozen[i];
      if(canThaw(water)!==true||!engine.insert(x,y,z,'water',water.units,water.quantities))return null;
      frozen.splice(i,1);
    }
    return Object.freeze({state:makeState(engine,frozen),mode,water,
      changed:Object.freeze([Object.freeze([x,y,z])])});
  }
  return Object.freeze({validate,stage});
}
