import {PROFESSIONS, RACES, SETTLEMENT_STYLES, citizenBiome} from './registry.mjs';
import {saveFingerprint} from '../persistence.mjs';

const validId = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(value);

export function createCitizen({
  worldSeed, settlementId, slot, race, biome, style, profession = null, variant, homeId = null,
}) {
  if (!Number.isInteger(worldSeed) || worldSeed !== (worldSeed | 0)) throw new RangeError('Invalid citizen world seed');
  if (!validId(settlementId)) throw new RangeError('Invalid citizen settlement ID');
  if (!Number.isSafeInteger(slot) || slot < 0) throw new RangeError('Invalid citizen slot');
  if (typeof race !== 'string' || !Object.hasOwn(RACES, race)) throw new RangeError('Unknown citizen race');
  if (profession !== null &&
      (typeof profession !== 'string' || !Object.hasOwn(PROFESSIONS, profession))) throw new RangeError('Unknown citizen profession');
  if (!SETTLEMENT_STYLES.includes(style)) throw new RangeError('Unknown citizen settlement style');
  if (homeId !== null && !validId(homeId)) throw new RangeError('Invalid citizen home ID');

  const id = `citizen:${worldSeed}:${settlementId}:${slot}`;
  const appearanceBiome = citizenBiome(biome);
  const appearanceInput = JSON.stringify([id, race, profession, appearanceBiome]);
  const appearanceRoll = hashAppearance(appearanceInput);
  const appearanceVariant = variant === undefined ? (appearanceRoll & 1) + 1 : variant;
  if (appearanceVariant !== 1 && appearanceVariant !== 2) throw new RangeError('Invalid citizen appearance variant');

  return Object.freeze({
    id, worldSeed, settlementId, slot, race, biome: appearanceBiome, style,
    type: profession === null ? 'ordinary' : 'worker', profession,
    variant: appearanceVariant,
    appearanceSeed: hashAppearance(`${appearanceInput}:${appearanceVariant}`),
    homeId, workplaceId: null,
  });
}

function hashAppearance(text) {
  return Number.parseInt(saveFingerprint(text), 16);
}

export function workplaceCompatible(citizen, workplace) {
  const profession = Object.hasOwn(PROFESSIONS, citizen.profession) ? PROFESSIONS[citizen.profession] : null;
  return Boolean(profession && workplace && validId(workplace.id) &&
    workplace.settlementId === citizen.settlementId &&
    Array.isArray(workplace.tags) &&
    workplace.tags.some(tag => profession.workplaceTags.includes(tag)));
}

export function assignWorkplace(citizen, workplace) {
  if (workplace !== null && !workplaceCompatible(citizen, workplace)) {
    throw new RangeError('Incompatible citizen workplace');
  }
  const workplaceId = workplace === null ? null : workplace.id;
  return workplaceId === citizen.workplaceId ? citizen : Object.freeze({...citizen, workplaceId});
}
