import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const stagedPaths=[
  "./src/nonblock/staged-habitats.mjs",
  "./src/environment-ground.mjs",
  "./src/manual-biomes/environment-v7.mjs",
  "./src/nonblock/candidate-effects.mjs",
  "./src/nonblock/candidate-families.mjs",
  "./src/nonblock/candidate-scene.mjs",
  "./src/nonblock/physical-fittings.mjs",
  "./src/nonblock/stage-offline.mjs",
  "./src/nonblock/staged-inherited-families.mjs",
  "./src/nonblock-environments24/agave-rosette.mjs",
  "./src/nonblock-environments24/branching-crystal-cluster.mjs",
  "./src/nonblock-environments24/column-cactus.mjs",
  "./src/nonblock-environments24/geode-opening.mjs",
  "./src/nonblock-environments24/mineral-encrustation.mjs",
  "./src/nonblock-environments24/prickly-pear-cactus.mjs",
  "./src/nonblock-environments24/alpine-wildflower.mjs",
  "./src/nonblock-environments24/cave-formations.mjs",
  "./src/nonblock-environments24/cave-rubble-cluster.mjs",
  "./src/nonblock-environments24/desert-bloom.mjs",
  "./src/nonblock-environments24/desert-scrub.mjs",
  "./src/nonblock-environments24/dwarf-juniper.mjs",
  "./src/nonblock-environments24/frost-fern.mjs",
  "./src/nonblock-environments24/pebble-scatter.mjs",
  "./src/nonblock-environments24/saltgrass.mjs",
  "./src/nonblock-environments24/snowgrass.mjs",
  "./src/nonblock-environments24/tumblebrush.mjs",
  "./src/nonblock-fittings36/fittings-phase1.mjs",
  "./src/nonblock-fittings36/world-props.mjs",
  "./src/nonblock-scene48/enchanted-fungi.mjs",
  "./src/nonblock-scene48/flora-phase1.mjs",
  "./src/nonblock-scene48/forest-lichen-patch.mjs",
  "./src/nonblock-scene48/forest-moss-mat.mjs",
  "./src/nonblock-scene48/forest-phase1-candidates.mjs",
  "./src/nonblock-scene48/meadow-woodland.mjs",
  "./src/nonblock-scene48/undergrowth-phase1.mjs",
  "./src/nonblock-scene48/woodland-sapling.mjs",
  "./src/nonblock-scene48/woodland-shrub.mjs",
  "./sw-nonblock-stage.js",
];

export async function buildStageCacheManifest(root) {
  const worker=await readFile(resolve(root,'sw-m5.js'),'utf8');
  const stage=await readFile(resolve(root,'sw-nonblock-stage.js'),'utf8');
  const version=stage.match(/const STAGE_VERSION='(\d{8}-v\d+)'/)?.[1];
  const common=worker.match(/const SOURCE_ASSETS=\[([\s\S]*?)\];/)?.[1];
  const release=worker.match(/const ASSET_RELEASE='([^']+)'/)?.[1];
  if(!version||!common||!release||!stage.includes("const SITE_RELEASE='"+release+"'"))
    throw new Error('Stage shell declarations missing or mismatched');
  const publicPaths=[...common.matchAll(/^\s*"([.]\/[^"]*)",?$/gm)].map(m=>m[1]);
  const paths=[...publicPaths,...stagedPaths];
  if(!paths.length||new Set(paths).size!==paths.length||paths.some(path=>
      path.includes('..')||/[?#]/.test(path)))throw new Error('Stage shell paths invalid');
  const assets=await Promise.all(paths.map(async path=>{
    const bytes=await readFile(resolve(root,path==='./'?'index.html':path));
    return [path,createHash('sha256').update(bytes).digest('hex')];
  }));
  return {version,assets:Object.fromEntries(assets)};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const root=process.cwd();
  const manifest=await buildStageCacheManifest(root);
  const output=resolve(root,'nonblock-stage-assets.json');
  const body=JSON.stringify(manifest,null,2)+'\n';
  if(process.argv.includes('--check')){
    if(await readFile(output,'utf8')!==body)throw new Error('Stage cache manifest is stale');
  }else await writeFile(output,body);
  console.log(manifest.version,Object.keys(manifest.assets).length,'source-verified cache assets');
}
