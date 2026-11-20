// D0 independent source-only B/C collision fence, consumes pinned static source identities.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const path=new URL('../../../docs/building-pool/roadmap-d/D0_SHARED_161_EXCLUSIVE_SOURCE_FENCE_V1.json',import.meta.url);
const ledger=JSON.parse(readFileSync(path,'utf8'));
const biomes=['temperate','desert','snow','enchanted-forest','mountain'],sizes=['small','medium','large'];
const quotas1={bathhouse:4,stable:5,'farm-barn':4,greenhouse:4,'fishing-lodge':4,'harbor-office':4,lighthouse:4};
const quotas2={'market-square':4,tailor:4,butcher:4,jeweler:4,bookshop:4,temple:5,theater:3};
const expected=(prefix,quotas,digits)=>new Set(Object.entries(quotas).flatMap(([cat,n])=>biomes.flatMap(b=>sizes.flatMap(s=>Array.from({length:n},(_,i)=>prefix+':'+cat+':'+b+':'+s+':'+String(i+1).padStart(digits,'0'))))));
const fnv64=s=>{let n=0xcbf29ce484222325n;for(let i=0;i<s.length;i++){n^=BigInt(s.charCodeAt(i));n=n*0x100000001b3n&((1n<<64n)-1n)}return n.toString(16).padStart(16,'0')};
test('Builder D exact adopted 161 ownership IDs are unique, full-quota and exclude all B/C/canonical slots',()=>{
 assert.equal(ledger.schema,'mythwrought.builder-d.source-only-shared-161-fence.v1');
 const r1=ledger.roadmap1B,r2=ledger.roadmap2B;
 assert.deepEqual([r1.protected228.length,r1.exclusiveBuilderB115.length,r1.exclusiveBuilderD92.length],[228,115,92]);
 assert.deepEqual([r2.protectedBuilderB205.length,r2.exclusiveBuilderC146.length,r2.exclusiveBuilderD69.length],[205,146,69]);
 const union1=[...r1.protected228,...r1.exclusiveBuilderB115,...r1.exclusiveBuilderD92];
 const union2=[...r2.protectedBuilderB205,...r2.exclusiveBuilderC146,...r2.exclusiveBuilderD69];
 const expected1=expected('r1',quotas1,3),expected2=expected('r2',quotas2,2);
 assert.equal(expected1.size,435);assert.equal(expected2.size,420);
 assert.equal(new Set(union1).size,435);assert.equal(new Set(union2).size,420);
 assert.deepEqual(new Set(union1),expected1);assert.deepEqual(new Set(union2),expected2);
 assert.equal(new Set([...union1,...union2]).size,855);
 assert.equal(ledger.roadmapD.totalShared,161);
 assert.deepEqual(ledger.roadmapD.ids,[...r1.exclusiveBuilderD92,...r2.exclusiveBuilderD69]);
 assert.equal(new Set(ledger.roadmapD.ids).size,161);
});
test('Builder D source freeze exactly matches immutable B/C pin blob SHA and independent checksums',()=>{
 assert.equal(ledger.pins.b1BSourceBlob,'c45b2cff7997ba88986af3de0746be3f13c669d6');
 assert.equal(ledger.pins.c2BSourceBlob,'a6a93bd10126206e1cadba1c3f11bb321ba0bea7');
 assert.equal(fnv64(ledger.roadmap1B.exclusiveBuilderD92.join('\n')),'8d01cf88aa785455');
 assert.equal(fnv64(ledger.roadmap2B.exclusiveBuilderD69.join('\n')),'6cca01ccfedf83af');
 assert.equal(fnv64(ledger.roadmapD.ids.join('\n')),'f56bd2a88da613c7');
 assert.deepEqual([ledger.roadmap1B.checksumD92FNV64,ledger.roadmap2B.checksumD69FNV64,ledger.roadmapD.checksumD161FNV64],
 ['8d01cf88aa785455','6cca01ccfedf83af','f56bd2a88da613c7']);
 assert.equal(ledger.crossCatalogUnique855,true);
 assert.deepEqual([ledger.productionRegistered,ledger.worldPlaced,ledger.savesChanged,ledger.merge,ledger.deployment],[false,false,false,false,false]);
});
test('Roadmap D shared-category quotas preserve all 1B and exclusively reserve cultural 2B source IDs',()=>{
 const cats=(ids)=>ids.reduce((o,id)=>{const c=id.split(':')[1];o[c]=(o[c]||0)+1;return o},{});
 assert.deepEqual(cats(ledger.roadmap1B.exclusiveBuilderD92),ledger.roadmap1B.dCategoryQuota);
 assert.deepEqual(cats(ledger.roadmap2B.exclusiveBuilderD69),{bookshop:12,temple:42,theater:15});
 assert.equal(ledger.roadmap1B.dCategoryQuota.stable,19);
 assert.equal(ledger.roadmap2B.exclusiveBuilderD69.some(id=>id.includes('market-square')),false);
});
