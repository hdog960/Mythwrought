// PM1: immutable candidate definitions; activation requires owner-approved gameplay.
export const SKILL_REGISTRY_VERSION = 1;
export const SKILL_MAX_LEVEL = 99;
const catalog = [
  ['combat', [
    ['attack','Attack','Weapon handling, precision and offensive techniques'],
    ['defense','Defense','Blocking, mitigation and defensive mastery'],
    ['strength','Strength','Physical power and heavy attacks'],
    ['archery','Archery','Projectile handling and ranged accuracy'],
    ['sorcery','Sorcery','Spell control and offensive magic'],
    ['constitution','Constitution','Health, recovery and resilience'],
  ]],
  ['gathering', [
    ['mining','Mining','Mineral extraction, prospecting and gem discovery'],
    ['woodcutting','Woodcutting','Timber harvesting and woodland resource efficiency'],
    ['fishing','Fishing','Aquatic resource discovery and fishing proficiency'],
    ['foraging','Foraging','Natural resource identification and collection'],
    ['hunting','Hunting','Wildlife pursuit and harvesting proficiency'],
    ['excavation','Excavation','Buried resources and ancient remnants'],
  ]],
  ['exploration', [
    ['agility','Agility','Mobility efficiency and maneuverability'],
    ['survival','Survival','Environmental resilience and wilderness proficiency'],
    ['exploration','Exploration','Discovery of meaningful locations'],
    ['tracking','Tracking','Identifying and following creature activity'],
    ['climbing','Climbing','Vertical traversal proficiency'],
    ['diving','Diving','Underwater endurance and exploration'],
  ]],
  ['specialized', [
    ['resonance','Resonance','Runic energy technology proficiency'],
    ['beast-mastery','Beast Mastery','Creature knowledge and interaction'],
    ['restoration','Restoration','Healing and recovery proficiency'],
    ['mysticism','Mysticism','Supernatural knowledge and manipulation'],
    ['stealth','Stealth','Concealment and detection avoidance'],
    ['attunement','Attunement','Magical and elemental affinity'],
  ]],
];
export const SKILL_CATEGORIES = Object.freeze(catalog.map(([category]) => category));
export const SKILLS = Object.freeze(catalog.flatMap(([category, entries]) =>
  entries.map(([key, name, description]) => Object.freeze({
    id: 'pm:' + key, name, description, category,
    maxLevel: SKILL_MAX_LEVEL, availability: 'deferred',
    experienceSources: Object.freeze([]), unlockRequirements: Object.freeze([]),
    treeId: 'pm-tree:' + key, icon: null,
    metadata: Object.freeze({ designStatus: 'candidate' }),
  }))
));
const byId = new Map(SKILLS.map(skill => [skill.id, skill]));
if (byId.size !== SKILLS.length) throw Error('Duplicate skill ID');
export function getSkill(id) { return byId.get(id) ?? null; }
export function skillsInCategory(category) {
  return Object.freeze(SKILLS.filter(skill => skill.category === category));
}
