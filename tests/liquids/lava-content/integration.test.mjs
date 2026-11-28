import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runLavaIntegration} from './integration-fixtures.mjs';

// Build a temporary read-only overlay from these exact peer refs; never copy
// peer files into the Lava B branch. All ten modules are authenticated first.
const pins={
  formations:['src/liquids/lava/content/formations.mjs','f881132da55f769ee25f744ee552f4dab1135d1c'],
  material:['src/liquids/lava/content/material.mjs','cfe40c0b49f7f3b0277dc126d9ff983f1ca5afbc'],
  steam:['src/liquids/lava/content/steam.mjs','19c0d570e306676c7c0a75f5f4f80fe2865c307f'],
  core:['src/liquids/core/engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b'],
  water:['src/liquids/water/physics/definition.mjs','78bb5be0317698b0a7e2c27ad69f13d58d2bb054'],
  lava:['src/liquids/lava/physics/definition.mjs','93f6559d51ec1c1b6b2ac9aa4776129903fc3e96'],
  transactions:['src/liquids/lava/physics/transactions.mjs','1f5dcc886bbf2adcf2bc6d2d69a88c77115d569f'],
  mesh:['src/liquids/presentation/mesh.mjs','6eec04c065623b7046750e28fdb34cfc4908ec9a'],
  draw:['src/liquids/presentation/draw-plan.mjs','b5487f525bdc1f494cbdbffa1f0d7d9f66d7b51d'],
  waterMaterial:['src/liquids/water/content/material.mjs','2f51898e6f9ecd0bdbb4ec11fd8798575dd75b9a']
};
const root=process.env.LAVA_INTEGRATION_ROOT;
if(!root)throw Error('LAVA_INTEGRATION_ROOT must point to a temporary exact-source overlay');
const paths={};
for(const [name,[relative,expected]] of Object.entries(pins)){
  const file=resolve(root,relative),bytes=readFileSync(file);
  const hash=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  if(hash!==expected)throw Error('Peer/owned blob mismatch: '+relative);
  paths[name]=file;
}
const modules={};
for(const [name,file] of Object.entries(paths))modules[name]=await import(pathToFileURL(file).href);
runLavaIntegration(modules,test);
