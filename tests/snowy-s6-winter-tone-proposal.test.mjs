import assert from 'node:assert/strict';
import test from 'node:test';
import {SNOW_S6_CANDIDATE_PROFILE,previewSnowS6WinterTone as tone}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';

test('S6 proposed profile is a separate never-live opt-in identity',()=>{
  assert.equal(SNOW_S6_CANDIDATE_PROFILE,
    'mythwrought-five-surface-regions-v8-snow-optin-research');
  assert.notEqual(SNOW_S6_CANDIDATE_PROFILE,'mythwrought-five-surface-regions-v7');
});
test('three original snow source materials retain separate physical IDs',()=>{
  const rows=[272,276,279].map(id=>tone(179,-160,520,id,.92));
  assert.deepEqual(rows.map(r=>r.sourceCapId),[272,276,279]);
  assert.ok(rows.every(r=>r.currentM7MaterialUnchanged&&r.draftOnly));
  assert.ok(rows.every(r=>r.proposedLinearRgb.every(n=>n>0&&n<1)));
  assert.notDeepEqual(rows[0].proposedLinearRgb,rows[1].proposedLinearRgb);
  assert.notDeepEqual(rows[1].proposedLinearRgb,rows[2].proposedLinearRgb);
});
test('same-material world-space adjacent shade has no random per-block checker',()=>{
  for(const id of [272,276,279]){
    for(const seed of [179,2026]){
      const a=tone(seed,-160,520,id,.9),b=tone(seed,-159,520,id,.9);
      assert.ok(a.proposedLinearRgb.every((n,i)=>
        Math.abs(n-b.proposedLinearRgb[i])<.003),
        'Adjacent absolute world-space shade must vary smoothly');
      assert.deepEqual(tone(seed,-160,520,id,.9),a);
      assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.proposedLinearRgb));
    }
  }
});
test('neighbor material proposals are subdued neutrals, not saturated blue squares',()=>{
  for(const id of [272,276,279]){
    const a=tone(179,32,512,id,.9).proposedLinearRgb;
    assert.ok(Math.max(...a)-Math.min(...a)<.105);
    assert.ok(Math.max(...a)<.92);
  }
});
test('source climate changes smoothly without changing original material identity',()=>{
  const a=tone(2026,47,528,276,.1),b=tone(2026,47,528,276,.99);
  assert.equal(a.sourceCapId,276);
  assert.equal(b.sourceCapId,276);
  assert.ok(a.proposedLinearRgb.every((n,i)=>Math.abs(n-b.proposedLinearRgb[i])<.01));
});
test('no unknown block, noninteger coordinate, invalid seed or forged weight accepted',()=>{
  for(const args of [[179,0,0,1,.9],[179,0,0,4,.9],
    [179,0,0,407,.9],[179,0,0,276,-.1],[179,0,0,272,1.01],
    [179,0.1,0,272,.5],[2**32,0,0,272,.5],[179,100001,0,272,.5],
    [179,0,0,272,Number.NaN]])
    assert.throws(()=>tone(...args),/genuine bounded/);
});
