// Candidate-only deterministic player-edit overlay arbitration. No save writes.
const valid = Number.isSafeInteger;
const key = p => `${p.x},${p.y},${p.z}`;
const coordinate = p => p && [p.x,p.y,p.z].every(valid);
const fail = reason => Object.freeze({ok:false,status:'NOT_VERIFIED',reason,integrationVerified:false});
export function arbitrateNaturalOverlay({natural,overlay,edits,registry}={}) {
  if (![natural,overlay,edits].every(Array.isArray) || !Array.isArray(registry)) return fail('invalid-input');
  const known=new Set(registry);
  if (known.size!==registry.length || !registry.every(x=>valid(x)&&x>=0)) return fail('invalid-registry');
  const maps=[];
  for (const [label,items] of [['natural',natural],['overlay',overlay],['edits',edits]]) {
    const m=new Map();
    for (const entry of items) {
      if (!entry || !coordinate(entry) || !valid(entry.blockId) || !known.has(entry.blockId)) return fail('invalid-'+label+'-entry');
      const k=key(entry);
      if (m.has(k)) return fail('duplicate-'+label+'-cell');
      if (label==='edits' && entry.intent!=='player') return fail('missing-durable-player-intent');
      m.set(k,entry.blockId);
    }
    maps.push(m);
  }
  const [base,features,player]=maps;
  for (const k of features.keys()) if (!base.has(k)) return fail('overlay-without-natural-cell');
  for (const k of player.keys()) if (!base.has(k)) return fail('edit-without-natural-cell');
  const cells=[...base].sort(([a],[b])=>a.localeCompare(b)).map(([k,id])=>Object.freeze({
    key:k,blockId:player.has(k)?player.get(k):features.has(k)?features.get(k):id,
    source:player.has(k)?'player':features.has(k)?'overlay':'natural'
  }));
  return Object.freeze({ok:true,status:'FIXTURE_COMPATIBLE_ONLY',integrationVerified:false,cells:Object.freeze(cells)});
}
