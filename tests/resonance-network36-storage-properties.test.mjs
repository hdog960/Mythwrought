import test from 'node:test';
import assert from 'node:assert/strict';
import { settleStorage } from '../src/resonance/network36/storage-ledger.mjs';
const make = (id, capacity, charge, maxInput, maxOutput) => ({id,capacity,charge,maxInput,maxOutput});
test('exhaustive small-state conservation, bounds, and deterministic ordering', () => {
  let cases = 0;
  for (let production=0;production<=5;production++) for(let consumption=0;consumption<=5;consumption++)
  for(let chargeA=0;chargeA<=3;chargeA++) for(let chargeB=0;chargeB<=3;chargeB++) {
    const stores=[make('a',3,chargeA,2,2),make('b',3,chargeB,1,1)];
    const r=settleStorage({production,consumption,stores});
    const reverse=settleStorage({production,consumption,stores:[...stores].reverse()});
    assert.deepEqual(r,reverse);
    assert.equal(r.storedAfter-r.storedBefore,r.storedSurplus-r.usedFromStores);
    assert.equal(r.supplied+r.unmet,consumption);
    assert.ok(r.supplied>=0 && r.supplied<=consumption);
    assert.ok(r.curtailed>=0);
    assert.equal(r.storedSurplus,Math.min(Math.max(0,production-consumption),Math.min(2,3-chargeA)+Math.min(1,3-chargeB)));
    for(const s of stores) {
      assert.ok(r.nextCharges[s.id]>=0 && r.nextCharges[s.id]<=s.capacity);
      assert.ok(r.charged[s.id]<=s.maxInput);
      assert.ok(r.discharged[s.id]<=s.maxOutput);
      assert.equal(r.charged[s.id]*r.discharged[s.id],0);
    }
    cases++;
  }
  assert.equal(cases,576);
});
test('source-only ledger never mutates frozen caller objects',()=>{
 const stores=Object.freeze([Object.freeze(make('a',5,3,2,2))]);
 assert.doesNotThrow(()=>settleStorage({production:1,consumption:2,stores}));
 assert.equal(stores[0].charge,3);
});
