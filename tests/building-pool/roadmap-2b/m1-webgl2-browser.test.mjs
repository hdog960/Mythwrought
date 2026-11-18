import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {tmpdir} from 'node:os';
import {join,resolve,extname,sep} from 'node:path';
const invoke=promisify(execFile);
const root=process.cwd();
function findBrowser(){
 for(const name of ['chromium','google-chrome','google-chrome-stable']){
  try{return execFileSync('which',[name],{encoding:'utf8'}).trim();}catch{}
 }
 return null;
}
async function server(){
 const http=createServer(async(req,res)=>{
  const pathname=decodeURIComponent((req.url||'').split('?')[0]);
  const source=resolve(root,'.'+pathname);
  if(!source.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{
   const bytes=await readFile(source);
   res.setHeader('Content-Type',extname(source)==='.html'?'text/html; charset=utf-8':
    extname(source)==='.mjs'||extname(source)==='.js'?'text/javascript; charset=utf-8':'application/octet-stream');
   res.end(bytes);
  }catch{res.writeHead(404).end('missing source');}
 });
 await new Promise((ok,fail)=>{http.once('error',fail);http.listen(0,'127.0.0.1',ok);});
 return http;
}
// 252 real cold-start Chromium captures take longer than the prior 120-view run;
// do not truncate genuine browser work at the historic 210s test deadline.
test('genuine Chromium software WebGL2 cube-proxy screenshots use actual authored M1 source at three phone-landscape dimensions', {timeout:840000},async(t)=>{
 const browser=findBrowser();
 if(!browser){t.skip('Chromium/Chrome binary not installed: candidate WebGL2 capture unverified');return;}
 const http=await server(), temp=await mkdtemp(join(tmpdir(),'mythwrought-2b-webgl-'));
 const out=resolve('artifacts/roadmap-2b');
 await mkdir(out,{recursive:true});
 const address=http.address(), base='http://127.0.0.1:'+address.port+'/tests/building-pool/roadmap-2b/candidate-preview.html';
 // Eighteen genuine browser captures: 6 original + 12 newly authored,
 // source-imported software cube diagnostics, NOT actual producer-family meshes.
 const cases=[
  ['market-square',667,375,'exterior'],['market-square',667,375,'cutaway'],
  ['tailor',844,390,'exterior'],['tailor',844,390,'cutaway'],
  ['theater',932,430,'exterior'],['theater',932,430,'cutaway'],
  ['market-square',667,375,'exterior','desert','medium'],
  ['market-square',667,375,'cutaway','desert','medium'],
  ['tailor',844,390,'exterior','enchanted-forest','medium'],
  ['tailor',844,390,'cutaway','enchanted-forest','medium'],
  ['theater',932,430,'exterior','snow','large'],
  ['theater',932,430,'cutaway','snow','large'],
  ['jeweler',932,430,'exterior','mountain','large'],
  ['jeweler',932,430,'cutaway','mountain','large'],
  ['bookshop',844,390,'exterior','mountain','medium'],
  ['bookshop',844,390,'cutaway','mountain','medium'],
  ['butcher',667,375,'exterior','desert','large'],
  ['butcher',667,375,'cutaway','desert','large'],
  ['temple',667,375,'exterior','temperate','small',2],
  ['temple',667,375,'cutaway','temperate','small',2],
  ['temple',844,390,'exterior','desert','medium',2],
  ['temple',844,390,'cutaway','desert','medium',2],
  ['market-square',667,375,'exterior','mountain','small'],
  ['market-square',667,375,'cutaway','mountain','small'],
  ['market-square',932,430,'exterior','enchanted-forest','large'],
  ['market-square',932,430,'cutaway','enchanted-forest','large'],
  ['theater',844,390,'exterior','desert','medium'],
  ['theater',844,390,'cutaway','desert','medium'],
  ['theater',932,430,'exterior','mountain','large'],
  ['theater',932,430,'cutaway','mountain','large'],
  ['market-square',667,375,'exterior','snow','small'],
  ['market-square',667,375,'cutaway','snow','small'],
  ['tailor',667,375,'exterior','desert','small'],
  ['tailor',667,375,'cutaway','desert','small'],
  ['butcher',844,390,'exterior','snow','small'],
  ['butcher',844,390,'cutaway','snow','small'],
  ['jeweler',667,375,'exterior','enchanted-forest','small'],
  ['jeweler',667,375,'cutaway','enchanted-forest','small'],
  ['bookshop',844,390,'exterior','desert','small'],
  ['bookshop',844,390,'cutaway','desert','small'],
  ['temple',844,390,'exterior','snow','medium',2],
  ['temple',844,390,'cutaway','snow','medium',2],
  ['theater',932,430,'exterior','temperate','medium'],
  ['theater',932,430,'cutaway','temperate','medium'],
  ['theater',667,375,'exterior','enchanted-forest','small'],
  ['theater',667,375,'cutaway','enchanted-forest','small'],
  ['market-square',667,375,'exterior','temperate','medium'],
  ['market-square',667,375,'cutaway','temperate','medium'],
  ['tailor',844,390,'exterior','snow','medium'],
  ['tailor',844,390,'cutaway','snow','medium'],
  ['butcher',667,375,'exterior','enchanted-forest','small'],
  ['butcher',667,375,'cutaway','enchanted-forest','small'],
  ['jeweler',844,390,'exterior','desert','small'],
  ['jeweler',844,390,'cutaway','desert','small'],
  ['bookshop',667,375,'exterior','snow','small'],
  ['bookshop',667,375,'cutaway','snow','small'],
  ['temple',932,430,'exterior','mountain','medium',2],
  ['temple',932,430,'cutaway','mountain','medium',2],
  ['theater',932,430,'exterior','snow','small'],
  ['theater',932,430,'cutaway','snow','small'],
  ['bookshop',844,390,'exterior','temperate','medium'],
  ['bookshop',844,390,'cutaway','temperate','medium'],
  ['market-square',932,430,'exterior','temperate','large'],
  ['market-square',932,430,'cutaway','temperate','large'],
  ['market-square',932,430,'exterior','desert','large'],
  ['market-square',932,430,'cutaway','desert','large'],
  ['tailor',844,390,'exterior','desert','large'],
  ['tailor',844,390,'cutaway','desert','large'],
  ['butcher',932,430,'exterior','snow','large'],
  ['butcher',932,430,'cutaway','snow','large'],
  ['jeweler',932,430,'exterior','enchanted-forest','large'],
  ['jeweler',932,430,'cutaway','enchanted-forest','large'],
  ['bookshop',844,390,'exterior','mountain','large'],
  ['bookshop',844,390,'cutaway','mountain','large'],
  ['temple',932,430,'exterior','desert','large',2],
  ['temple',932,430,'cutaway','desert','large',2],
  ['theater',932,430,'exterior','temperate','large'],
  ['theater',932,430,'cutaway','temperate','large'],
  ['market-square',667,375,'exterior','mountain','medium'],
  ['market-square',667,375,'cutaway','mountain','medium'],
  ['market-square',844,390,'exterior','snow','medium'],
  ['market-square',844,390,'cutaway','snow','medium'],
  ['tailor',844,390,'exterior','enchanted-forest','medium',2],
  ['tailor',844,390,'cutaway','enchanted-forest','medium',2],
  ['butcher',667,375,'exterior','temperate','medium'],
  ['butcher',667,375,'cutaway','temperate','medium'],
  ['jeweler',844,390,'exterior','snow','medium'],
  ['jeweler',844,390,'cutaway','snow','medium'],
  ['bookshop',844,390,'exterior','enchanted-forest','medium'],
  ['bookshop',844,390,'cutaway','enchanted-forest','medium'],
  ['temple',932,430,'exterior','temperate','large',2],
  ['temple',932,430,'cutaway','temperate','large',2],
  ['theater',932,430,'exterior','desert','large'],
  ['theater',932,430,'cutaway','desert','large'],
  ['market-square',667,375,'exterior','mountain','small',2],
  ['market-square',667,375,'cutaway','mountain','small',2],
  ['tailor',667,375,'exterior','mountain','small'],
  ['tailor',667,375,'cutaway','mountain','small'],
  ['butcher',844,390,'exterior','mountain','small'],
  ['butcher',844,390,'cutaway','mountain','small'],
  ['jeweler',667,375,'exterior','mountain','small'],
  ['jeweler',667,375,'cutaway','mountain','small'],
  ['bookshop',844,390,'exterior','mountain','small'],
  ['bookshop',844,390,'cutaway','mountain','small'],
  ['theater',667,375,'exterior','mountain','small'],
  ['theater',667,375,'cutaway','mountain','small'],
  ['market-square',844,390,'exterior','enchanted-forest','medium'],
  ['market-square',844,390,'cutaway','enchanted-forest','medium'],
  ['theater',932,430,'exterior','snow','medium'],
  ['theater',932,430,'cutaway','snow','medium'],
  ['tailor',844,390,'exterior','temperate','medium'],
  ['tailor',844,390,'cutaway','temperate','medium'],
  ['butcher',844,390,'exterior','desert','medium'],
  ['butcher',844,390,'cutaway','desert','medium'],
  ['jeweler',844,390,'exterior','mountain','medium'],
  ['jeweler',844,390,'cutaway','mountain','medium'],
  ['bookshop',844,390,'exterior','snow','medium'],
  ['bookshop',844,390,'cutaway','snow','medium'],
  ['theater',932,430,'exterior','enchanted-forest','large'],
  ['theater',932,430,'cutaway','enchanted-forest','large'],
  ['tailor',932,430,'exterior','snow','large'],
  ['tailor',932,430,'cutaway','snow','large'],
  ['butcher',932,430,'exterior','enchanted-forest','large'],
  ['butcher',932,430,'cutaway','enchanted-forest','large'],
  ['jeweler',932,430,'exterior','desert','large'],
  ['jeweler',932,430,'cutaway','desert','large'],
  ['bookshop',932,430,'exterior','temperate','large'],
  ['bookshop',932,430,'cutaway','temperate','large'],
  ['theater',844,390,'exterior','mountain','medium'],
  ['theater',844,390,'cutaway','mountain','medium'],
  ['temple',667,375,'exterior','snow','small',2],
  ['temple',667,375,'cutaway','snow','small',2],
  ['market-square',667,375,'exterior','desert','large',2],
  ['market-square',667,375,'cutaway','desert','large',2],
  ['tailor',844,390,'exterior','mountain','medium',2],
  ['tailor',844,390,'cutaway','mountain','medium',2],
  ['butcher',667,375,'exterior','snow','medium',2],
  ['butcher',667,375,'cutaway','snow','medium',2],
  ['bookshop',844,390,'exterior','desert','medium',2],
  ['bookshop',844,390,'cutaway','desert','medium',2],
  ['theater',932,430,'exterior','temperate','large',2],
  ['theater',932,430,'cutaway','temperate','large',2],
  ['jeweler',844,390,'exterior','temperate','medium',2],
  ['jeweler',844,390,'cutaway','temperate','medium',2],
  ['jeweler',932,430,'exterior','enchanted-forest','large',2],
  ['jeweler',932,430,'cutaway','enchanted-forest','large',2],
  ['butcher',932,430,'exterior','mountain','large',2],
  ['butcher',932,430,'cutaway','mountain','large',2],
  ['tailor',844,390,'exterior','desert','medium',2],
  ['tailor',844,390,'cutaway','desert','medium',2],
  ['temple',932,430,'exterior','enchanted-forest','large',2],
  ['temple',932,430,'cutaway','enchanted-forest','large',2],
  ['theater',667,375,'exterior','desert','small',2],
  ['theater',667,375,'cutaway','desert','small',2],
  ['market-square',667,375,'exterior','snow','medium',2],
  ['market-square',667,375,'cutaway','snow','medium',2],
  ['market-square',667,375,'exterior','enchanted-forest','small',2],
  ['market-square',667,375,'cutaway','enchanted-forest','small',2],
  ['bookshop',844,390,'exterior','mountain','medium',2],
  ['bookshop',844,390,'cutaway','mountain','medium',2],
  ['bookshop',667,375,'exterior','snow','small',2],
  ['bookshop',667,375,'cutaway','snow','small',2],
  ['butcher',667,375,'exterior','desert','small',2],
  ['butcher',667,375,'cutaway','desert','small',2],
  ['tailor',932,430,'exterior','temperate','large',2],
  ['tailor',932,430,'cutaway','temperate','large',2],
  ['jeweler',844,390,'exterior','snow','small',2],
  ['jeweler',844,390,'cutaway','snow','small',2],
  ['theater',844,390,'exterior','mountain','medium',2],
  ['theater',844,390,'cutaway','mountain','medium',2],
  ['theater',932,430,'exterior','snow','large',2],
  ['theater',932,430,'cutaway','snow','large',2],
  ['temple',667,375,'exterior','desert','small',2],
  ['temple',667,375,'cutaway','desert','small',2],
  ['bookshop',932,430,'exterior','enchanted-forest','large',2],
  ['bookshop',932,430,'cutaway','enchanted-forest','large',2],
  ['tailor',844,390,'exterior','snow','medium',2],
  ['tailor',844,390,'cutaway','snow','medium',2],
  ['butcher',932,430,'exterior','enchanted-forest','large',2],
  ['butcher',932,430,'cutaway','enchanted-forest','large',2],
  ['jeweler',932,430,'exterior','desert','large',2],
  ['jeweler',932,430,'cutaway','desert','large',2],
  ['market-square',844,390,'exterior','enchanted-forest','medium',2],
  ['market-square',844,390,'cutaway','enchanted-forest','medium',2],
  ['market-square',667,375,'exterior','desert','small',2],
  ['market-square',667,375,'cutaway','desert','small',2],
  ['bookshop',844,390,'exterior','temperate','medium',2],
  ['bookshop',844,390,'cutaway','temperate','medium',2],
  ['butcher',932,430,'exterior','snow','large',2],
  ['butcher',932,430,'cutaway','snow','large',2],
  ['jeweler',667,375,'exterior','enchanted-forest','small',2],
  ['jeweler',667,375,'cutaway','enchanted-forest','small',2],
  ['theater',844,390,'exterior','temperate','medium',2],
  ['theater',844,390,'cutaway','temperate','medium',2],
  ['tailor',932,430,'exterior','mountain','large',2],
  ['tailor',932,430,'cutaway','mountain','large',2],
  ['butcher',667,375,'exterior','enchanted-forest','small',2],
  ['butcher',667,375,'cutaway','enchanted-forest','small',2],
  ['jeweler',932,430,'exterior','mountain','large',2],
  ['jeweler',932,430,'cutaway','mountain','large',2],
  ['tailor',667,375,'exterior','enchanted-forest','small',2],
  ['tailor',667,375,'cutaway','enchanted-forest','small',2],
  ['butcher',844,390,'exterior','mountain','medium',2],
  ['butcher',844,390,'cutaway','mountain','medium',2],
  ['market-square',932,430,'exterior','mountain','large',2],
  ['market-square',932,430,'cutaway','mountain','large',2],
  ['butcher',932,430,'exterior','temperate','large',2],
  ['butcher',932,430,'cutaway','temperate','large',2],
  ['jeweler',844,390,'exterior','snow','medium',2],
  ['jeweler',844,390,'cutaway','snow','medium',2],
  ['bookshop',667,375,'exterior','mountain','small',2],
  ['bookshop',667,375,'cutaway','mountain','small',2],
  ['theater',667,375,'exterior','enchanted-forest','small',2],
  ['theater',667,375,'cutaway','enchanted-forest','small',2],
  ['temple',844,390,'exterior','enchanted-forest','medium',2],
  ['temple',844,390,'cutaway','enchanted-forest','medium',2],
  ['tailor',932,430,'exterior','desert','large',2],
  ['tailor',932,430,'cutaway','desert','large',2],
  ['tailor',667,375,'exterior','snow','small',2],
  ['tailor',667,375,'cutaway','snow','small',2],
  ['jeweler',932,430,'exterior','temperate','large',2],
  ['jeweler',932,430,'cutaway','temperate','large',2],
  ['jeweler',844,390,'exterior','desert','medium',2],
  ['jeweler',844,390,'cutaway','desert','medium',2],
  ['bookshop',932,430,'exterior','snow','large',2],
  ['bookshop',932,430,'cutaway','snow','large',2],
  ['bookshop',667,375,'exterior','enchanted-forest','small',2],
  ['bookshop',667,375,'cutaway','enchanted-forest','small',2],
  ['butcher',667,375,'exterior','snow','small',2],
  ['butcher',667,375,'cutaway','snow','small',2],
  ['theater',932,430,'exterior','mountain','large',2],
  ['theater',932,430,'cutaway','mountain','large',2],
  ['temple',667,375,'exterior','mountain','small',2],
  ['temple',667,375,'cutaway','mountain','small',2],
  ['bookshop',932,430,'exterior','temperate','large',2],
  ['bookshop',932,430,'cutaway','temperate','large',2],
  ['tailor',667,375,'exterior','temperate','small',2],
  ['tailor',667,375,'cutaway','temperate','small',2],
  ['market-square',844,390,'exterior','snow','small',2],
  ['market-square',844,390,'cutaway','snow','small',2],
  ['market-square',667,375,'exterior','temperate','small',2],
  ['market-square',667,375,'cutaway','temperate','small',2],
  ['market-square',844,390,'exterior','temperate','small',2],
  ['market-square',844,390,'cutaway','temperate','small',2],
  ['market-square',932,430,'exterior','temperate','small',2],
  ['market-square',932,430,'cutaway','temperate','small',2],
  ['theater',667,375,'exterior','desert','small',3],
  ['theater',667,375,'cutaway','desert','small',3],
  ['theater',844,390,'exterior','desert','small',3],
  ['theater',844,390,'cutaway','desert','small',3],
  ['theater',932,430,'exterior','desert','small',3],
  ['theater',932,430,'cutaway','desert','small',3],
 ];
 try{
  for(let i=0;i<cases.length;i++){
   const [category,width,height,view,biome='temperate',size='small',variation=1]=cases[i];
   const id='r2:'+category+':'+biome+':'+size+':'+String(variation).padStart(2,'0');
   const params=new URLSearchParams({id,view});
   const url=base+'?'+params.toString();
   const file=join(out,category+'-'+biome+'-'+size+'-'+(variation>1?'v'+String(variation).padStart(2,'0')+'-':'')+view+'-'+width+'x'+height+'.png');
   const profile=join(temp,'profile-'+i);
   const args=[
    '--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run',
    '--disable-background-networking','--enable-webgl','--ignore-gpu-blocklist',
    '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
    '--hide-scrollbars','--user-data-dir='+profile,
    '--window-size='+width+','+height,'--virtual-time-budget=4500',
    '--timeout=10000','--dump-dom','--screenshot='+file,url
   ];
   let stdout='';
   // Some runner cold starts exit zero without producing --dump-dom text.
   // Retry ONLY empty outputs with fresh profile directories; all real DOM,
   // source identity, WebGL2 and PNG assertions remain unchanged and mandatory.
   for(let attempt=0;attempt<3;attempt++){
    args[args.findIndex(arg=>arg.startsWith('--user-data-dir='))]=
      '--user-data-dir='+profile+'-try'+attempt;
    try{
     const result=await invoke(browser,args,{timeout:22000,maxBuffer:4*1024*1024});
     stdout=result.stdout;
    }catch(e){
     throw Error(category+' '+view+' '+width+'x'+height+
       ': Chromium capture failed: '+String(e.message).slice(0,450));
    }
    if(stdout.trim())break;
    if(attempt===2)throw Error(category+' '+view+' '+width+'x'+height+
      ': Chromium returned empty --dump-dom on all three independent profiles');
   }
   assert.match(stdout,/data-ready="yes"/,category+' browser did not load source-authentic blueprint');
   assert.match(stdout,/data-webgl="WebGL2"/,category+' no real WebGL2 context');
   assert(stdout.includes('data-blueprint="'+id+'"'),category+' rendered the wrong authored model');
   assert(stdout.includes('data-view="'+view+'"'),category+' rendered the wrong cutaway option');
   const png=await readFile(file);
   assert(png.length>3500,category+' screenshot appears empty or truncated');
   assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','invalid Chromium PNG');
   assert.equal(png.readUInt32BE(16),width,'unexpected Chrome captured width');
   assert.equal(png.readUInt32BE(20),height,'unexpected Chrome captured height');
   console.log('Builder 2B REAL Chromium/WebGL2 software-cube proxy capture:',
     id,view,width+'x'+height,'PNG bytes',png.length);
  }
 }finally{
  await new Promise(ok=>http.close(ok));
  await rm(temp,{recursive:true,force:true,maxRetries:8,retryDelay:200});
 }
});
