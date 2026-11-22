// Resonance generation24 candidate v1. No production imports or world mutation.
export const CONTRACT = Object.freeze({ id: 'resonance-power-v1', unit: 'resonance-units-per-tick', tickMs: 1000, maxCatchupTicks: 60, maxGenerators: 128 });
export const MODELS = Object.freeze({
  hand: Object.freeze({kind:'manual', capacity:2, rate:1, acquisition:'starter', requires:'operator'}),
  crystal: Object.freeze({kind:'continuous', capacity:4, rate:3, acquisition:'rare', requires:'crystal'}),
  waterwheel: Object.freeze({kind:'environment', capacity:6, rate:5, requires:'flow'}),
  windmill: Object.freeze({kind:'environment', capacity:6, rate:5, requires:'exposure'}),
  heat: Object.freeze({kind:'fuelled', capacity:8, rate:7, requires:'heat-and-fuel'})
});
const validNum = n => Number.isFinite(n) && n >= 0;
const clamp01 = n => Math.max(0,Math.min(1,n));
export function describeGenerator({id, model, seed, anchor, level=0}) {
  if (!/^[a-z0-9_-]{1,64}$/.test(id) || !Object.hasOwn(MODELS,model) ||
      !Number.isSafeInteger(seed) || !Array.isArray(anchor) || anchor.length!==3 ||
      !anchor.every(Number.isSafeInteger) || !Number.isSafeInteger(level) || level<0 || level>3)
    throw Error('invalid generator descriptor');
  const spec=MODELS[model];
  return Object.freeze({contract:CONTRACT.id, id, model, seed, anchor:Object.freeze([...anchor]),
    level, capacity:spec.capacity+level*2, ratedOutput:spec.rate+level,
    sourceKind:spec.kind, acquisition:spec.acquisition??'constructed',
    instanceKey:`resonance:g24:${seed}:${anchor.join(',')}:${id}`});
}
export function evaluateGenerator(descriptor, inputs={}) {
  if (descriptor?.contract!==CONTRACT.id || !Object.hasOwn(MODELS,descriptor.model) ||
      !/^[a-z0-9_-]{1,64}$/.test(descriptor.id) ||
      !Number.isSafeInteger(descriptor.seed) ||
      !Array.isArray(descriptor.anchor) || descriptor.anchor.length!==3 ||
      !descriptor.anchor.every(Number.isSafeInteger) ||
      descriptor.instanceKey!==`resonance:g24:${descriptor.seed}:${descriptor.anchor.join(',')}:${descriptor.id}` ||
      descriptor.sourceKind!==MODELS[descriptor.model].kind ||
      descriptor.acquisition!==(MODELS[descriptor.model].acquisition??'constructed') ||
      !Number.isSafeInteger(descriptor.level) || descriptor.level<0 || descriptor.level>3 ||
      descriptor.capacity!==MODELS[descriptor.model].capacity+descriptor.level*2 ||
      descriptor.ratedOutput!==MODELS[descriptor.model].rate+descriptor.level)
    throw Error('incompatible generator');
  const {model}=descriptor;
  const ok = model==='hand' ? inputs.operator===true :
    model==='crystal' ? inputs.crystalPresent===true :
    model==='waterwheel' ? inputs.waterPresent===true && validNum(inputs.flow) && inputs.flow>=0.4 :
    model==='windmill' ? inputs.exposed===true && validNum(inputs.wind) && inputs.wind>=0.3 :
    inputs.heatPresent===true && validNum(inputs.fuelUnits) && inputs.fuelUnits>=1;
  const factor = model==='waterwheel' ? clamp01(inputs.flow??0) :
    model==='windmill' ? clamp01(inputs.wind??0) : 1;
  const available=ok ? Math.min(descriptor.capacity,descriptor.ratedOutput*factor) : 0;
  return Object.freeze({contract:CONTRACT.id, instanceKey:descriptor.instanceKey,
    status:ok?'available':'blocked', availablePerTick:available, capacityPerTick:descriptor.capacity,
    fuelCostPerTick:ok && model==='heat'?1:0, consumesFuel:model==='heat',
    reason:ok?'ready':MODELS[model].requires});
}
export function simulateTicks(descriptor, inputs, ticks) {
  if (!Number.isSafeInteger(ticks) || ticks<0 || ticks>CONTRACT.maxCatchupTicks) throw Error('unsafe tick count');
  const output=evaluateGenerator(descriptor,inputs);
  const actualTicks=output.status!=='available' ? 0 : output.consumesFuel ? Math.min(ticks,Math.floor(inputs.fuelUnits)) : ticks;
  return Object.freeze({...output, ticks:actualTicks, generated:output.availablePerTick*actualTicks,
    fuelConsumed:output.fuelCostPerTick*actualTicks});
}
