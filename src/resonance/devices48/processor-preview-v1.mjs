// D4 isolated resource-processing preview. No inventory, world edits, or power actuation.
export const PROCESSOR_CONTRACT = 'resonance48.processor.v1';
const isInt = (x) => Number.isSafeInteger(x) && x >= 0;
const validId = (s) => typeof s === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(s);
const fail = (reason) => Object.freeze({ contract: PROCESSOR_CONTRACT, accepted: false, reason, canActuate: false, outputs: Object.freeze([]), consumed: 0, proposedEnergy: 0 });
export function previewProcessing(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) return fail('invalid-request');
  const { worldId, fixtureId, ownerId, optIn, inputs, recipe, capacity, availableEnergy, tick } = request;
  if (![worldId, fixtureId, ownerId].every(validId) || optIn !== true || !isInt(tick)) return fail('unauthorized-fixture');
  if (!Array.isArray(inputs) || inputs.length > 32 || !isInt(capacity) || capacity > 256 || !isInt(availableEnergy) || availableEnergy > 100000) return fail('invalid-budget');
  if (!recipe || typeof recipe !== 'object' || !validId(recipe.inputKind) || !validId(recipe.outputKind) || !isInt(recipe.inputUnits) || recipe.inputUnits < 1 || recipe.inputUnits > 32 || !isInt(recipe.outputUnits) || recipe.outputUnits < 1 || recipe.outputUnits > 32 || !isInt(recipe.energyPerBatch) || recipe.energyPerBatch < 1 || recipe.energyPerBatch > 1000) return fail('invalid-recipe');
  const seen = new Set(); let total = 0;
  for (const item of inputs) {
    if (!item || !validId(item.id) || seen.has(item.id) || item.worldId !== worldId || item.fixtureId !== fixtureId || item.ownerId !== ownerId || item.optIn !== true || item.source !== 'fixture-drop' || item.protected === true || !isInt(item.units) || item.units > 256 || !validId(item.kind)) return fail('unsafe-input');
    seen.add(item.id);
    if (item.kind === recipe.inputKind) total += item.units;
  }
  const batches = Math.min(Math.floor(total / recipe.inputUnits), Math.floor(capacity / recipe.outputUnits), Math.floor(availableEnergy / recipe.energyPerBatch));
  if (!batches) return fail('insufficient-input-capacity-or-energy');
  const consumed = batches * recipe.inputUnits;
  let remaining = consumed;
  const consumption = [];
  for (const item of [...inputs].filter(x => x.kind === recipe.inputKind).sort((a,b)=>a.id.localeCompare(b.id,'en'))) {
    const units = Math.min(remaining, item.units);
    if (units) consumption.push(Object.freeze({id:item.id, units}));
    remaining -= units;
    if (!remaining) break;
  }
  return Object.freeze({ contract: PROCESSOR_CONTRACT, accepted: true, reason: 'preview-only', canActuate: false, worldId, fixtureId, tick, consumed, proposedEnergy: batches * recipe.energyPerBatch, outputs: Object.freeze([Object.freeze({kind:recipe.outputKind, units:batches*recipe.outputUnits})]), consumption: Object.freeze(consumption) });
}
