import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, SKILL_CATEGORIES, getSkill, skillsInCategory } from '../src/path-of-mastery/registry.mjs';
import { CANDIDATE_CURVE, makeExperienceCurve, experienceAtLevel, experienceProgress, calculateExperienceGain } from '../src/path-of-mastery/experience.mjs';

test('24 unique immutable candidates, six per category and no active sources', () => {
  assert.equal(SKILLS.length, 24);
  assert.equal(new Set(SKILLS.map(s => s.id)).size, 24);
  assert.equal(new Set(SKILLS.map(s => s.treeId)).size, 24);
  for (const category of SKILL_CATEGORIES) assert.equal(skillsInCategory(category).length, 6);
  for (const skill of SKILLS) {
    assert.equal(getSkill(skill.id), skill);
    assert.equal(skill.maxLevel, 99);
    assert.equal(skill.availability, 'deferred');
    assert.deepEqual(skill.experienceSources, []);
    assert.ok(Object.isFrozen(skill) && Object.isFrozen(skill.experienceSources));
  }
  assert.equal(getSkill('pm:crafting'), null);
  assert.throws(() => SKILLS.push({}), TypeError);
});
test('all 99 exact thresholds and all 98 immediately preceding boundaries', () => {
  for (let level = 1; level <= 99; level++) {
    const xp = experienceAtLevel(level);
    assert.equal(experienceProgress(xp).level, level);
    if (level > 1) assert.equal(experienceProgress(xp - 1).level, level - 1);
  }
  assert.equal(experienceProgress(0).fraction, 0);
  assert.equal(experienceProgress(CANDIDATE_CURVE[98]).fraction, 1);
});
test('gains cross levels and saturate without overflow', () => {
  const gain = calculateExperienceGain(0, experienceAtLevel(10));
  assert.equal(gain.levelsGained, 9);
  const capped = calculateExperienceGain(1, Number.MAX_SAFE_INTEGER);
  assert.equal(capped.after.level, 99);
  assert.equal(capped.after.xp, CANDIDATE_CURVE[98]);
  assert.equal(calculateExperienceGain(CANDIDATE_CURVE[98], 10).applied, 0);
});
test('invalid xp, amounts and levels fail closed', () => {
  for (const x of [-1, NaN, Infinity, 1.5, '1', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => experienceProgress(x), RangeError);
    assert.throws(() => calculateExperienceGain(0, x), RangeError);
  }
  assert.throws(() => calculateExperienceGain(0, 0), RangeError);
  assert.throws(() => experienceProgress(CANDIDATE_CURVE[98] + 1), RangeError);
  for (const level of [0, 100, 1.5, '2']) assert.throws(() => experienceAtLevel(level), RangeError);
});
test('configurable curves validated, cloned and immutable', () => {
  const linear = Array.from({ length: 99 }, (_, i) => i * 10);
  const curve = makeExperienceCurve(linear);
  linear[1] = 999;
  assert.equal(experienceProgress(49, curve).level, 5);
  assert.equal(experienceProgress(49, curve).xpToNext, 1);
  assert.ok(Object.isFrozen(curve));
  for (const invalid of [[], null, linear, Array(99).fill(0)])
    assert.throws(() => makeExperienceCurve(invalid), RangeError);
});
