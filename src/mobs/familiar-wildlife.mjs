export const familiarWildlife = Object.freeze({
  cow: Object.freeze({ activity: 'graze', travel: 'herd-wander', rest: 1.3, range: 2.2, tame: true }),
  sheep: Object.freeze({ activity: 'graze', travel: 'flock', rest: .9, range: 1.7 }),
  pig: Object.freeze({ activity: 'forage', travel: 'snuffle', rest: 1.1, range: 2.4 }),
  chicken: Object.freeze({ activity: 'peck', travel: 'scratch-run', rest: .4, range: 1.8, jump: .42 }),
  horse: Object.freeze({ activity: 'trot', travel: 'canter', rest: .5, range: 3.8, tame: true }),
  rabbit: Object.freeze({ activity: 'sniff', travel: 'hop', rest: .55, range: 1.65, jump: .72 }),
  fox: Object.freeze({ activity: 'scout', travel: 'explore', rest: .6, range: 3.1 }),
  'mountain-goat': Object.freeze({ activity: 'browse', travel: 'surefoot', rest: .75, range: 1.95 }),
  wolf: Object.freeze({ activity: 'scent', travel: 'patrol-pack', rest: .45, range: 3.55, bond: true })
});
