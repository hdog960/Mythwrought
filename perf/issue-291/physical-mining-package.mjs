// Prepare an origin-locked ONLINE ONLY diagnostic package. Never publish.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
const source='d365635eef84a87a273b53f39d75f7b875f11837';
const baseline='2168ac4d38cb1701e49963c7c4ce9f12d3c32cf0';
const sha=b=>createHash('sha256').update(b).digest('hex');
const [originArg,outArg]=process.argv.slice(2);
assert.ok(originArg&&outArg,'Explicit dedicated origin and output required');
const allowed=new URL(originArg);
assert.equal(allowed.origin,originArg);
const loopback=allowed.protocol==='http:'&&allowed.hostname==='127.0.0.1';
assert.ok(loopback||(allowed.protocol==='https:'&&/^[a-z0-9-]+\.pages\.dev$/.test(allowed.hostname)),
 'Use exact loopback or dedicated Pages.dev project origin');
assert.notEqual(allowed.hostname,'hdog960.github.io');
const root=resolve('.'),out=resolve(outArg);
assert.ok(out.startsWith(resolve(root,'artifacts')+sep),'Output must be under artifacts');
await mkdir(out,{recursive:true});assert.deepEqual(await readdir(out),[],'Output must be empty');
const git=(...args)=>execFileSync('git',args,{maxBuffer:32*1024*1024});
assert.equal(git('rev-parse','HEAD^').toString().trim(),source);
assert.equal(git('diff','--name-only',source,'HEAD','--','src','index.html','styles.css','sw-m5.js','nonblock-stage-assets.json').toString().trim(),'');
const manifest=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
const worker=await readFile('sw-m5.js','utf8');
const match=worker.match(/const SOURCE_ASSETS=\[([\s\S]*?)\];/);
assert.ok(match);
const paths=[...match[1].matchAll(/^\s*"([.]\/[^"]*)",?$/gm)].map(m=>m[1]);
assert.ok(paths.length&&new Set(paths).size===paths.length);
assert.deepEqual([...paths,'./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].sort(),Object.keys(manifest.assets).sort());
const changed=new Set(['src/main.mjs','src/gpu-recovery.mjs']);
const skip=new Set(['./','./sw-m5.js','./manifest.webmanifest']);
const transformed=new Set(['index.html','src/manual-biomes/m5-offline-registration.mjs','src/app-update.mjs']);
const output={},original={};
async function emit(path,bytes){
 assert.ok(!Object.hasOwn(output,path)&&!path.includes('..'));
 const b=Buffer.from(bytes);await mkdir(dirname(resolve(out,path)),{recursive:true});await writeFile(resolve(out,path),b);output[path]=sha(b);
}
for(const p of paths){
 assert.ok(p.startsWith('./')&&!/[?#\\]/.test(p)&&!p.includes('..'));
 const path=p==='./'?'index.html':p.slice(2);
 const bytes=await readFile(path);
 assert.deepEqual(bytes,git('show',source+':'+path),'Unexpected diagnostic source '+path);
 if(!changed.has(path))assert.equal(sha(bytes),manifest.assets[p],'Production manifest mismatch '+path);
 original[p]=sha(bytes);
 if(skip.has(p)||transformed.has(path))continue;
 await emit(path,bytes);
}
const helper=await readFile('src/mining-trace.mjs');assert.deepEqual(helper,git('show',source+':src/mining-trace.mjs'));
await emit('src/mining-trace.mjs',helper);
let html=await readFile('index.html','utf8');
const replace=(s,a,b)=>{assert.equal(s.split(a).length,2,'Nonunique package anchor '+a);return s.replace(a,b);};
html=replace(html,'<link rel="manifest" href="./manifest.webmanifest">','');
html=replace(html,'<meta name="apple-mobile-web-app-capable" content="yes">','');
html=replace(html,'<head>','<head><meta http-equiv="Content-Security-Policy" content="worker-src \'none\'; object-src \'none\'; base-uri \'none\'; connect-src \'self\'"><meta name="mw-diagnostic-source" content="'+source+'">');
html=replace(html,'<script type="module" src="./src/main.mjs?mw-release=20261125-living-ecosystem-height-v1"></script>',
 '<script type="module" src="./diagnostic-bootstrap.mjs"></script>');
await emit('index.html',html);
await emit('src/manual-biomes/m5-offline-registration.mjs',
 'export async function ensureM5OfflineCache(){return {supported:false,reason:"Diagnostic: online only"};}\n');
await emit('src/app-update.mjs',
 'export const GAME_RELEASE="20261125-living-ecosystem-height-v1";\nexport function installGameUpdater({button,status}){button.disabled=true;status.textContent="Diagnostic only: updates disabled";return Object.freeze({checkInBackground:async()=>{}});}\n');
const bootstrap=[
 'const allowed='+JSON.stringify(allowed.origin)+';',
 'const source='+JSON.stringify(source)+';',
 'const notice=document.querySelector("#notice");',
 'const reject=message=>{notice.hidden=false;notice.textContent=message;document.documentElement.dataset.diagnosticBlocked="true";};',
 'if(location.origin!==allowed||!["/","/index.html"].includes(location.pathname)){reject("Diagnostic refused: wrong isolated origin");}',
 'else if(navigator.serviceWorker?.controller||(await navigator.serviceWorker?.getRegistrations?.()??[]).length){reject("Diagnostic refused: existing service worker on this origin");}',
 'else {',
 'const u=new URL(location.href);u.search="";u.searchParams.set("mw-perf","1");u.searchParams.set("production-ui","1");history.replaceState(null,"",u);',
 'document.documentElement.dataset.diagnosticSource=source;',
 'document.title="MYTHWROUGHT — isolated mining diagnostic";',
 'await import("./src/main.mjs?mw-probe="+source);',
 '}'
].join('\n');
await emit('diagnostic-bootstrap.mjs',bootstrap);
await emit('_headers','/*\n  Cache-Control: no-store\n  X-Content-Type-Options: nosniff\n  Content-Security-Policy: worker-src \'none\'; object-src \'none\'; base-uri \'none\'; connect-src \'self\'; frame-ancestors \'none\'\n');
const expected=[...paths.filter(p=>!skip.has(p)).map(p=>p.slice(2)),'src/mining-trace.mjs','diagnostic-bootstrap.mjs','_headers'].sort();
assert.deepEqual(Object.keys(output).sort(),expected);
for(const [path,digest] of Object.entries(output))assert.equal(sha(await readFile(resolve(out,path))),digest);
const meta={diagnosticOnly:true,onlineOnly:true,published:false,physicalIphone:false,allowedOrigin:allowed.origin,source,baseline,sourceManifestVersion:manifest.version,original,transformed:[...transformed],excluded:[...skip],assets:output};
await writeFile(resolve(out,'diagnostic-assets.json'),JSON.stringify(meta,null,2)+'\n');
console.log('EXACT DIAGNOSTIC PACKAGE',source,allowed.origin,Object.keys(output).length,'assets; no worker scripts or install manifest');
