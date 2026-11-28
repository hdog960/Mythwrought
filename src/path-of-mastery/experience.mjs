// PM2 candidate curve: engineering fixture, not approved balance or gameplay XP.
import { SKILL_MAX_LEVEL } from './registry.mjs';
export function makeExperienceCurve(thresholds) {
  if (!Array.isArray(thresholds) || thresholds.length !== SKILL_MAX_LEVEL ||
      thresholds[0] !== 0 || thresholds.some((xp, i) =>
        !Number.isSafeInteger(xp) || xp < 0 || (i > 0 && xp <= thresholds[i - 1]))) {
    throw new RangeError('Invalid experience curve');
  }
  return Object.freeze([...thresholds]);
}
export const CANDIDATE_CURVE = makeExperienceCurve(Array.from(
  { length: SKILL_MAX_LEVEL }, (_, n) => 25 * n * n + 5 * n * n * n
));
function validateXp(xp) {
  if (!Number.isSafeInteger(xp) || xp < 0) throw new RangeError('Invalid experience');
}
export function experienceAtLevel(level, curve = CANDIDATE_CURVE) {
  if (!Number.isInteger(level) || level < 1 || level > SKILL_MAX_LEVEL)
    throw new RangeError('Invalid level');
  return makeExperienceCurve(curve)[level - 1];
}
export function experienceProgress(xp, curve = CANDIDATE_CURVE) {
  validateXp(xp);
  const thresholds = makeExperienceCurve(curve);
  const cap = thresholds[SKILL_MAX_LEVEL - 1];
  if (xp > cap) throw new RangeError('Experience exceeds curve cap');
  let low = 0, high = thresholds.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (thresholds[mid] <= xp) low = mid; else high = mid - 1;
  }
  const current = thresholds[low], next = thresholds[low + 1] ?? null;
  return Object.freeze({
    xp, level: low + 1, maxed: next === null, currentThreshold: current,
    nextThreshold: next, xpToNext: next === null ? 0 : next - xp,
    fraction: next === null ? 1 : (xp - current) / (next - current),
  });
}
// Pure numerical transaction. No public gameplay award authority or event identity yet.
export function calculateExperienceGain(xp, amount, curve = CANDIDATE_CURVE) {
  validateXp(amount);
  if (amount === 0) throw new RangeError('Experience gain must be positive');
  const thresholds = makeExperienceCurve(curve);
  const before = experienceProgress(xp, thresholds);
  const applied = Math.min(amount, thresholds[thresholds.length - 1] - xp);
  const after = experienceProgress(xp + applied, thresholds);
  return Object.freeze({ before, after, applied, levelsGained: after.level - before.level });
}
