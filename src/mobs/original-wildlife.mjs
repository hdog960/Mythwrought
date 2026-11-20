export const originalWildlife = Object.freeze(Object.fromEntries([
  ['duskhorn', { activity: 'dusk-watch', travel: 'roam', range: 3, day: 'dusk' }],
  ['moonmoth', { activity: 'hover', travel: 'seek-light', range: 2.2, medium: 'fly', height: 1.5 }],
  ['glassback', { activity: 'shell-watch', travel: 'careful-step', range: 1.9, pace: .65 }],
  ['frosthorn', { activity: 'snow-browse', travel: 'ridge-walk', range: 2.6 }],
  ['mossback', { activity: 'float', travel: 'paddle', range: 1.8, medium: 'swim', pace: .7 }],
  ['sunskipper', { activity: 'gather', travel: 'bound', range: 3.35, jump: 1 }],
  ['cloudfinch', { activity: 'perch', travel: 'flock-flight', range: 3.7, medium: 'fly', height: 2.2 }],
  ['reedwhisker', { activity: 'tread-water', travel: 'dive', range: 2.6, medium: 'swim', pace: 1 }],
  ['emberwing', { activity: 'rest-wings', travel: 'thermal-circle', range: 3.3, medium: 'fly', height: 2.5 }]
].map(([id, profile]) => [id, Object.freeze(profile)])));
