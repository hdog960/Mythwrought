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
 'r1:lighthouse:mountain:small:001',
 'r1:bathhouse:desert:medium:001',
 'r1:stable:snow:medium:004',
 'r1:farm-barn:mountain:medium:001',
 'r1:greenhouse:mountain:large:001',
 'r1:fishing-lodge:desert:medium:001',
 'r1:harbor-office:enchanted-forest:medium:001',
 'r1:lighthouse:snow:medium:001',
 'r1:bathhouse:snow:small:001',
 'r1:bathhouse:enchanted-forest:medium:001',
 'r1:bathhouse:mountain:large:001',
 'r1:stable:desert:small:004',
 'r1:stable:mountain:large:004',
 'r1:stable:enchanted-forest:small:004',
 'r1:farm-barn:desert:large:001',
 'r1:farm-barn:snow:small:001',
 'r1:farm-barn:enchanted-forest:medium:001',
 'r1:bathhouse:temperate:medium:001',
 'r1:bathhouse:desert:small:001',
 'r1:bathhouse:snow:medium:001',
 'r1:stable:temperate:large:004',
 'r1:stable:desert:large:004',
 'r1:stable:snow:small:004',
 'r1:farm-barn:temperate:medium:001',
 'r1:farm-barn:mountain:small:001',
 'r1:farm-barn:enchanted-forest:large:001',
 'r1:bathhouse:temperate:large:001',
 'r1:bathhouse:desert:large:001',
 'r1:bathhouse:snow:large:001',
 'r1:stable:temperate:medium:004',
 'r1:stable:snow:large:004',
 'r1:stable:enchanted-forest:medium:004',
 'r1:farm-barn:temperate:large:001',
 'r1:farm-barn:desert:medium:001',
 'r1:farm-barn:snow:medium:001',
 'r1:bathhouse:enchanted-forest:small:001',
 'r1:bathhouse:enchanted-forest:large:001',
 'r1:bathhouse:mountain:small:001',
 'r1:stable:temperate:small:004',
 'r1:stable:desert:medium:004',
 'r1:stable:mountain:small:004',
 'r1:farm-barn:desert:small:001',
 'r1:farm-barn:snow:large:001',
 'r1:farm-barn:enchanted-forest:small:001',
 'r1:greenhouse:temperate:medium:001',
 'r1:greenhouse:desert:large:001',
 'r1:greenhouse:snow:small:001',
 'r1:fishing-lodge:temperate:large:001',
 'r1:fishing-lodge:mountain:medium:001',
 'r1:harbor-office:desert:small:001',
 'r1:harbor-office:snow:large:001',
 'r1:lighthouse:temperate:medium:001',
 'r1:lighthouse:enchanted-forest:large:001',
 'r1:greenhouse:mountain:medium:001',
 'r1:greenhouse:enchanted-forest:large:001',
 'r1:greenhouse:snow:large:001',
 'r1:fishing-lodge:snow:medium:001',
 'r1:fishing-lodge:enchanted-forest:medium:001',
 'r1:harbor-office:temperate:large:001',
 'r1:harbor-office:mountain:medium:001',
 'r1:lighthouse:desert:large:001',
 'r1:lighthouse:snow:large:001',
 'r1:greenhouse:temperate:large:001',
 'r1:greenhouse:desert:medium:001',
 'r1:greenhouse:mountain:small:001',
 'r1:fishing-lodge:desert:large:001',
 'r1:fishing-lodge:mountain:small:001',
 'r1:harbor-office:desert:large:001',
 'r1:harbor-office:enchanted-forest:large:001',
 'r1:lighthouse:temperate:small:001',
 'r1:lighthouse:mountain:large:001',
 'r1:greenhouse:snow:medium:001',
 'r1:greenhouse:enchanted-forest:medium:001',
 'r1:greenhouse:desert:small:001',
 'r1:fishing-lodge:snow:large:001',
 'r1:fishing-lodge:enchanted-forest:large:001',
 'r1:harbor-office:mountain:large:001',
 'r1:harbor-office:snow:small:001',
 'r1:lighthouse:desert:medium:001',
 'r1:lighthouse:enchanted-forest:medium:001',
 'r1:greenhouse:temperate:small:001',
 'r1:fishing-lodge:desert:small:001',
 'r1:fishing-lodge:mountain:large:001',
 'r1:harbor-office:snow:medium:001',
 'r1:harbor-office:enchanted-forest:small:001',
 'r1:harbor-office:desert:medium:001',
 'r1:lighthouse:snow:small:001',
 'r1:lighthouse:mountain:medium:001',
 'r1:lighthouse:temperate:large:001',
 'r1:bathhouse:mountain:medium:001',
 'r1:farm-barn:mountain:large:001',
 'r1:fishing-lodge:temperate:medium:001',
 'r1:fishing-lodge:snow:small:001',
 'r1:fishing-lodge:enchanted-forest:small:001',
 'r1:harbor-office:temperate:medium:001',
 'r1:harbor-office:mountain:small:001',
 'r1:lighthouse:desert:small:001',
 'r1:lighthouse:enchanted-forest:small:001',
 'r1:bathhouse:temperate:small:002',
 'r1:bathhouse:snow:large:002',
 'r1:farm-barn:desert:medium:002',
 'r1:farm-barn:enchanted-forest:large:002',
 'r1:greenhouse:mountain:small:002',
 'r1:greenhouse:snow:large:002',
 'r1:fishing-lodge:desert:large:002',
 'r1:harbor-office:temperate:small:002',
 'r1:lighthouse:mountain:large:002'
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
 if(records.length!==678)throw Error('Expected 113 distinct source candidates × 2 views × 3 landscapes = 678 images');
 console.log('BUILDER 1B genuine WebGL2 candidate captures PASS',JSON.stringify({images:records.length,
  ids:ids.length,viewports,output:out}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
