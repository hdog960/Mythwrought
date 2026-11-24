// Read-only Mob static ESM dependency/cache preflight. Requires Node 22
// --experimental-vm-modules. Never evaluates game code or edits workers.
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {SourceTextModule} from 'node:vm';

const ROOTS=['src/mobs/live-game.mjs','src/mobs/live-render.mjs'];
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');

function publicAssets(worker){
  const body=worker.match(/const SOURCE_ASSETS=\[([\s\S]*?)\];/)?.[1];
  if(!body)throw Error('Missing original SOURCE_ASSETS declaration');
  const paths=[...body.matchAll(/^\s*"(\.\/[^"\n]*)",?\s*$/gm)].map(m=>m[1]);
  if(!paths.length||new Set(paths).size!==paths.length)
    throw Error('Empty or duplicate public asset declarations');
  return new Set(paths);
}

export async function auditMobOffline(root){
  root=resolve(root);
  if(typeof SourceTextModule!=='function')throw Error('Run Node with --experimental-vm-modules');
  const publicList=publicAssets(await readFile(resolve(root,'sw-m5.js'),'utf8'));
  const staged=JSON.parse(await readFile(resolve(root,'nonblock-stage-assets.json'),'utf8'));
  if(!staged?.version||!staged.assets||typeof staged.assets!=='object'||Array.isArray(staged.assets))
    throw Error('Missing staged asset manifest');
  const queue=[...ROOTS],visited=new Set(),rows=[];
  while(queue.length){
    const path=queue.shift();
    if(visited.has(path))continue;
    visited.add(path);
    const absolute=resolve(root,path),bytes=await readFile(absolute);
    const mod=new SourceTextModule(bytes.toString('utf8'),{identifier:pathToFileURL(absolute).href});
    const dependencies=[];
    for(const specifier of mod.dependencySpecifiers){
      if(!specifier.startsWith('./')&&!specifier.startsWith('../'))
        throw Error('Unsupported browser module dependency: '+path+' -> '+specifier);
      const url=new URL(specifier,pathToFileURL(absolute));
      if(url.protocol!=='file:'||url.search||url.hash)
        throw Error('Unsupported browser module URL: '+specifier);
      const target=relative(root,fileURLToPath(url)).split(sep).join('/');
      if(!target||target==='..'||target.startsWith('../'))throw Error('Dependency escapes repository: '+specifier);
      dependencies.push(target);queue.push(target);
    }
    const key='./'+path,actual=sha256(bytes),expected=staged.assets[key];
    rows.push({path,dependencies:[...new Set(dependencies)].sort(),sha256:actual,
      public:publicList.has(key),stage:expected===undefined?'missing':expected===actual?'exact':'stale'});
  }
  rows.sort((a,b)=>a.path.localeCompare(b.path));
  const missingPublic=rows.filter(r=>!r.public).map(r=>r.path);
  const missingStage=rows.filter(r=>r.stage==='missing').map(r=>r.path);
  const staleStage=rows.filter(r=>r.stage==='stale').map(r=>r.path);
  return {roots:[...ROOTS],staticOnly:true,version:staged.version,modules:rows.length,
    missingPublic,missingStage,staleStage,ready:!missingPublic.length&&!missingStage.length&&!staleStage.length,rows};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  try{
    const result=await auditMobOffline(process.argv[2]??process.cwd());
    console.log(JSON.stringify(result,null,2));
    if(!result.ready)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}
