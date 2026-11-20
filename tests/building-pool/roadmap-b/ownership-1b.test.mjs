import test from 'node:test';
import assert from 'node:assert/strict';
import {getBuilderBServiceOwnership,RESERVATION_COUNTS,SOURCE_HEADS,fnv64} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
test('B/D 1B exact accepted-source freeze, 115/92 no double claim',()=>{
 const a=getBuilderBServiceOwnership();
 assert.deepEqual([a.existing,a.unfilled,a.forBuilderB,a.forBuilderD],[228,207,115,92]);
 assert.equal(Object.values(RESERVATION_COUNTS).reduce((s,x)=>s+x,0),115);
 assert.equal(new Set([...a.builderBIds,...a.builderDAvailableIds]).size,207);
 assert.ok(a.builderBIds.every(x=>!a.builderDAvailableIds.includes(x)));
 assert.equal(a.allocationChecksumFNV64,fnv64(a.builderBIds.join('\n')));
 assert.equal(a.unassignedForBChecksumFNV64,fnv64(a.builderDAvailableIds.join('\n')));
 assert.equal(a.runtimeRegistered,false);assert.equal(a.productionMerged,false);
 console.log('BUILDER B RESERVED 115 EXACT IDS: '+JSON.stringify(a.builderBIds));
 console.log('BUILDER B RESERVED FNV64: '+a.allocationChecksumFNV64);
 console.log('BUILDER D REMAINING 92 EXACT IDS: '+JSON.stringify(a.builderDAvailableIds));
 console.log('BUILDER D REMAINING FNV64: '+a.unassignedForBChecksumFNV64);
 console.log('ACCEPTED SOURCE HEADS: '+JSON.stringify(SOURCE_HEADS));
});
