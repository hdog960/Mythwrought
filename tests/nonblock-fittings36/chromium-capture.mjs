// :36 opt-in genuine Chromium/WebGL2 capture executor. No production imports or saves.
// Usage: node tests/nonblock-fittings36/chromium-capture.mjs [output-directory]
// Requires a locally installed Chromium executable. Never runs during npm test by default.
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const out=resolve(process.argv[2]||'fittings36-chromium-evidence');
const chrome=process.env.CHROMIUM_BIN||'chromium';
const page=`<!doctype html><html><head><meta charset="utf-8"></head><body><pre id="result">PENDING</pre><script type="module">
import {runFittingsBrowserArtifacts} from '/src/nonblock-fittings36/browser-artifact-runner.mjs';
try {
 const captures=[];
 const result=runFittingsBrowserArtifacts({documentRef:document,
 writeArtifact:(filename,data,metadata)=>captures.push({filename,data,metadata}),
 recordMetadata:metadata=>window.__fittingsMetadata=metadata});
 document.getElementById('result').textContent=JSON.stringify({ok:true,result,captures,metadata:window.__fittingsMetadata});
} catch(error){document.getElementById('result').textContent=JSON.stringify({ok:false,error:String(error?.stack||error)});}
</script></body></html>`;
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end(page);return;}
  if(!url.pathname.startsWith('/src/nonblock-fittings36/')||!url.pathname.endsWith('.mjs'))throw Error('forbidden');
  const path=resolve(root,'.'+url.pathname);
  if(!path.startsWith(join(root,'src','nonblock-fittings36')+sep))throw Error('path escape');
  const body=await readFile(path);
  res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});res.end(body);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
let stdout='',stderr='';
try{
 const args=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--virtual-time-budget=60000','--dump-dom',`http://127.0.0.1:${port}/`];
 const child=spawn(chrome,args,{stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',b=>stdout+=b);
 child.stderr.on('data',b=>stderr+=b);
 const exit=await new Promise((done,reject)=>{child.on('error',reject);child.on('close',done);setTimeout(()=>{child.kill('SIGKILL');reject(Error('Chromium timed out'));},120000).unref();});
 if(exit!==0)throw Error(`Chromium exit ${exit}: ${stderr.slice(-1500)}`);
 const match=stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
 if(!match||match[1]==='PENDING')throw Error('Chromium fixture did not complete');
 const unescape=s=>s.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
 const payload=JSON.parse(unescape(match[1]));
 if(!payload.ok)throw Error(payload.error);
 if(payload.captures.length!==60)throw Error('expected 60 genuine canvas captures');
 await mkdir(out,{recursive:true});
 const manifest=[];
 for(const capture of payload.captures){
  if(!/^fittings36-[a-z0-9x-]+\.png$/.test(capture.filename))throw Error('invalid filename');
  const prefix='data:image/png;base64:';
  if(!capture.data.startsWith(prefix))throw Error('invalid PNG URL');
  const bytes=Buffer.from(capture.data.slice(prefix.length),'base64');
  if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('PNG signature mismatch');
  await writeFile(join(out,capture.filename),bytes);
  manifest.push({...capture.metadata,filename:capture.filename,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 const report={sourceHead:process.env.GITHUB_SHA||null,chromiumExecutable:chrome,chromiumExit:exit,canvasCaptures:manifest.length,productionBreakVerified:false,productionSaveVerified:false,manifest};
 await writeFile(join(out,'manifest.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({output:out,captures:manifest.length,uniqueHashes:new Set(manifest.map(x=>x.sha256)).size}));
}finally{await new Promise(r=>server.close(r));}
