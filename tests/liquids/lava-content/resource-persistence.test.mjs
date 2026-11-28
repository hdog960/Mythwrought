import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {resourcePersistenceFixtures} from './resource-persistence-fixtures.mjs';
import {createLavaResourcePersistence} from '../../../src/liquids/lava/content/resource-persistence.mjs';
const pins={
  "src/liquids/core/engine.mjs": "48269883882fd04020bf3856ac1350a607f842a7",
  "src/liquids/core/persistence.mjs": "40c32c04ead92c02d895eb8d8aea6f5c9cc1c566",
  "src/liquids/core/owner-handoff.mjs": "f82d956cb406121bf561f13a622a5817af7228a4",
  "src/world-height.mjs": "1f5fe4411967223bbfcb7e85a804ce34f91fbb90",
  "src/depth.mjs": "b54b7fd8c422699a328b60135178f97508e277c8",
  "src/floating-islands/sky-runtime-adapter.mjs": "bfb423288c7005a87521d4e54a1dd222de150603",
  "src/liquids/water/physics/sources.mjs": "61b63656d80ea30071f75423ad69b48a1000784a",
  "src/liquids/water/physics/definition.mjs": "78bb5be0317698b0a7e2c27ad69f13d58d2bb054",
  "src/liquids/lava/physics/quench-persistence.mjs": "3f055cb12b00a7875c045c40e615a9bd0aa23e57",
  "src/liquids/lava/physics/persistence-bridge.mjs": "166aab758a25b697b879293fa288e6cf204e966e",
  "src/liquids/lava/physics/quench-batch.mjs": "d206dc726feea1402279a97bf8a1286388faf7c0",
  "src/liquids/lava/physics/transactions.mjs": "1f5dcc886bbf2adcf2bc6d2d69a88c77115d569f",
  "src/liquids/lava/physics/definition.mjs": "93f6559d51ec1c1b6b2ac9aa4776129903fc3e96",
  "src/liquids/lava/physics/thermal-scheduler.mjs": "5bbb9687b82dd87893cf1740cf52464e80158c1b",
  "src/liquids/lava/physics/vents.mjs": "999ea397a5fd9bafc2dd73dda7a4612c328e3025",
  "src/liquids/lava/content/resources.mjs": "88b45582181079b49bc70725b7f25935c0caf2dc"
};
const root=process.env.LAVA_PERSISTENCE_ROOT;
if(!root)throw new Error('LAVA_PERSISTENCE_ROOT must point to exact peer source overlay');
for(const [path,sha] of Object.entries(pins)){
  const bytes=readFileSync(resolve(root,path));
  const actual=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(actual,sha,path);
}
const modules={};
for(const path of Object.keys(pins))Object.assign(modules,await import(pathToFileURL(resolve(root,path)).href));
resourcePersistenceFixtures({...modules,createLavaResourcePersistence,test,assert});
