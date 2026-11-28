import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditLegacyBlacksmithSupports} from '../../../src/building-pool/roadmap-3a/legacy-physical-support-audit.mjs';
test('original PR #122 blacksmiths remain source-exact but must fail physical fireplace/chimney mounting',()=>{
 const audit=auditLegacyBlacksmithSupports();
 assert.equal(audit.blueprintCount,15);
 assert.equal(audit.missingSupports,30);
 assert.deepEqual(audit.byFamily,{'pack4:063':15,'pack4:064':15});
 assert.ok(audit.buildings.every(x=>x.missingSupportCount===2&&x.geometryPreserved&&x.unresolved.length===2));
 assert.ok(audit.buildings.every(x=>x.unresolved.every(c=>c.classification==='missing-authored-source-support')));
 assert.equal(audit.repairsApplied,false);assert.equal(audit.legacyGeometryChanged,false);
 assert.equal(audit.worldPlacementAllowed,false);
 const out=join(process.cwd(),'artifacts','building-roadmap-3a-source-review');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'PHYSICAL_SUPPORT_BLOCKERS.json'),JSON.stringify(audit,null,2)+'\n');
});
