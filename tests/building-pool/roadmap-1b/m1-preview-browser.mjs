// Standalone read-only browser capture runner for Builder 1B's actual native JS modules.
// Run from repository root after: npm install --no-save playwright@1.58.2
//    node tests/building-pool/roadmap-1b/m1-preview-browser.mjs
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,dirname,sep} from 'node:path';
const root=process.cwd(),out=resolve(root,'artifacts/roadmap-1b');
const mime={'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try{const local=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+local);
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  const body=await readFile(path);
  res.writeHead(200,{'Content-Type':mime[extname(path)]??'application/octet-stream'});res.end(body);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port,records=[];
let browser;
const ids=[
 'r1:stable:temperate:small:001',
 'r1:bathhouse:temperate:small:001',
 'r1:farm-barn:temperate:small:001',
 'r1:greenhouse:enchanted-forest:small:001',
 'r1:fishing-lodge:temperate:small:001',
 'r1:harbor-office:temperate:small:001',
 'r1:lighthouse:mountain:small:001'
],viewports=[[667,375],[844,390],[932,430]];
try{
 await mkdir(out,{recursive:true});
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const id of ids)for(const [width,height] of viewports)for(const view of ['exterior','cutaway']){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  const url='http://127.0.0.1:'+port+'/tests/building-pool/roadmap-1b/m1-preview.html?candidate='+encodeURIComponent(id)+'&view='+view;
  await page.goto(url,{waitUntil:'load',timeout:45000});
  await page.waitForFunction('window.__M1_PREVIEW?.ready===true',{timeout:45000});
  const evidence=await page.evaluate(()=>window.__M1_PREVIEW);
  if(pageErrors.length||!evidence.webgl2||evidence.id!==id||evidence.view!==view||
   evidence.viewport[0]!==width||evidence.viewport[1]!==height||
   evidence.sourceCells<300||evidence.proxyCells<100||evidence.triangles<600||
   evidence.glError!==0)throw Error('Invalid genuine browser candidate evidence '+id+' '+view+': '+JSON.stringify({evidence,pageErrors}));
  const file=id.replaceAll(':','-')+'-'+view+'-'+width+'x'+height+'.png';
  await page.screenshot({path:resolve(out,file)});
  records.push({...evidence,file,physicalIPhone:false,finalPhysicalFamilyMesh:false});
  await page.close();
 }
 await writeFile(resolve(out,'M1_WEBGL2_CAPTURE_MANIFEST.json'),
  JSON.stringify({kind:'actual-authored-source-WebGL2-proxy',physicalIPhone:false,physicalFamilyMeshes:false,
   screenshots:records.length,records},null,2));
 if(records.length!==42)throw Error('Expected 7 distinct source candidates × 2 views × 3 landscapes = 42 images');
 console.log('BUILDER 1B genuine WebGL2 candidate captures PASS',JSON.stringify({images:records.length,
  ids:ids.length,viewports,output:out}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
