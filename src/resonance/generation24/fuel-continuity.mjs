// Opt-in continuity checkpoint for generator fuel windows; never touches inventory or saves.
import { CONTRACT } from './index.mjs';
import { evaluateFuelWindow } from './fuel-window.mjs';
const integer = n => Number.isSafeInteger(n) && n >= 0;
export function createFuelCheckpoint(descriptor, nextTick, fuelRemaining) {
  if (descriptor?.contract !== CONTRACT.id || typeof descriptor.instanceKey !== 'string' ||
      !descriptor.instanceKey.startsWith('resonance:g24:') ||
      !integer(nextTick) || !integer(fuelRemaining)) throw Error('invalid fuel checkpoint');
  return Object.freeze({contract:CONTRACT.id, instanceKey:descriptor.instanceKey,
    nextTick, fuelRemaining});
}
export function advanceFuelCheckpoint(descriptor, checkpoint, observations) {
  if (checkpoint?.contract !== CONTRACT.id || checkpoint.instanceKey !== descriptor?.instanceKey ||
      !integer(checkpoint.nextTick) || !integer(checkpoint.fuelRemaining) ||
      !Array.isArray(observations) || observations.length === 0 ||
      observations.length > CONTRACT.maxCatchupTicks ||
      !Number.isSafeInteger(checkpoint.nextTick + observations.length))
    throw Error('incompatible or unsafe fuel continuation');
  // Exact observed ticks and verified environment are enforced by evaluateFuelWindow.
  const window = evaluateFuelWindow(descriptor, observations, checkpoint.nextTick, checkpoint.fuelRemaining);
  return Object.freeze({window, checkpoint:createFuelCheckpoint(descriptor, window.endTick, window.remainingFuel)});
}
