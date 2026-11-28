import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {registerOwnerHandoffTests} from './owner-handoff-fixtures.mjs';
import * as definition from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
import * as sources from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import * as admission from '../../../src/liquids/liquid-resonance/physics/owner-admission.mjs';
// Water A pinned at 976ae4dd89e76401220c1f357d642b532b291750; never copy peer source into this branch.
if(!process.env.LIQUID_CORE_ROOT)throw Error('Set LIQUID_CORE_ROOT to exact Water A checkout');
const root=resolve(process.env.LIQUID_CORE_ROOT);
for(const [path,expected] of [["src/depth.mjs","b54b7fd8c422699a328b60135178f97508e277c8"],["src/floating-islands/sky-runtime-adapter.mjs","bfb423288c7005a87521d4e54a1dd222de150603"],["src/world-height.mjs","1f5fe4411967223bbfcb7e85a804ce34f91fbb90"],["src/liquids/core/engine.mjs","ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b"],["src/liquids/core/owner-handoff.mjs","e074a7e8c1d7a5b149a29306e4073f4b018be12c"]]) {
  const bytes=readFileSync(resolve(root,path));
  const actual=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(actual,expected,'Peer blob mismatch: '+path);
}
const load=path=>import(pathToFileURL(resolve(root,path)).href);
registerOwnerHandoffTests({test,assert,...await load('src/liquids/core/engine.mjs'),
  ...await load('src/liquids/core/owner-handoff.mjs'),...await load('src/world-height.mjs'),
  ...definition,...sources,...admission});
