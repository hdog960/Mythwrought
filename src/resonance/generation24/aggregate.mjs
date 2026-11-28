// Opt-in generation-only aggregation. No network, inventory, or world writes.
import { CONTRACT, evaluateGenerator, simulateTicks } from './index.mjs';
export function aggregateGenerators(entries, ticks = 1) {
  if (!Array.isArray(entries) || entries.length > CONTRACT.maxGenerators ||
      !Number.isSafeInteger(ticks) || ticks < 0 || ticks > CONTRACT.maxCatchupTicks)
    throw Error('invalid generation batch');
  const seen = new Set();
  const sources = [];
  let generated = 0, ratedCapacityPerTick = 0, availablePerTick = 0;
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') throw Error('invalid source entry');
    const { descriptor, inputs } = entry;
    const key = descriptor?.instanceKey;
    if (typeof key !== 'string' || !key || seen.has(key)) throw Error('duplicate or invalid source identity');
    const state = evaluateGenerator(descriptor, inputs);
    if (!Number.isFinite(state.availablePerTick) || !Number.isFinite(state.capacityPerTick) ||
        state.availablePerTick < 0 || state.availablePerTick > state.capacityPerTick)
      throw Error('unsafe source output');
    const result = simulateTicks(descriptor, inputs, ticks);
    seen.add(key);
    ratedCapacityPerTick += state.capacityPerTick;
    availablePerTick += state.availablePerTick;
    generated += result.generated;
    sources.push(Object.freeze({ instanceKey: key, status: result.status,
      availablePerTick: state.availablePerTick, capacityPerTick: state.capacityPerTick,
      generated: result.generated, ticks: result.ticks, fuelConsumed: result.fuelConsumed }));
  }
  return Object.freeze({ contract: CONTRACT.id, ticks, sourceCount: sources.length,
    ratedCapacityPerTick, availablePerTick, generated, sources: Object.freeze(sources) });
}
