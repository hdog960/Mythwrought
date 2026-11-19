export const hostileTactics = Object.freeze(Object.fromEntries([
  ['zombie', { attack: 'melee', reach: 1.29, windup: .78, cooldown: 1.32, pace: .81 }],
  ['skeleton', { attack: 'ranged', reach: 4.9, windup: .65, cooldown: 1.45, standoff: 2.1 }],
  ['giant-spider', { attack: 'lunge', reach: 1.48, windup: .32, cooldown: .95, climb: true, pace: 1.16 }],
  ['slime', { attack: 'contact', reach: 1.08, windup: .24, cooldown: .84, jump: .8 }],
  ['wraith', { attack: 'aerial', reach: 1.55, windup: .48, cooldown: 1.4, medium: 'fly', height: .62 }],
  ['troll', { attack: 'heavy', reach: 1.86, windup: 1.04, cooldown: 1.7, pace: .73 }],
  ['harpy', { attack: 'aerial', reach: 1.54, windup: .41, cooldown: 1.17, medium: 'fly', height: 1.28 }],
  ['mimic', { attack: 'ambush', reach: 1.38, windup: .31, cooldown: 1.31, sleep: 'disguise', wake: 'reveal', approach: 3.8 }],
  ['gargoyle', { attack: 'aerial', reach: 1.58, windup: .74, cooldown: 1.51, medium: 'fly', height: .9,
    sleep: 'perched', wake: 'awaken', approach: 5.8 }]
].map(([id, tactics]) => [id,Object.freeze(tactics)])));
