import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const stagedPaths=[
  "./src/nonblock/stage-offline.mjs",
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
