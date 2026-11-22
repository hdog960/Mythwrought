// Builder B isolated Waves9-33 twenty-five-original source-specific Chromium WebGL2 proof; not final Pack meshes or live game.
// Run with pinned playwright@1.58.2 and pngjs@7.0.0 in a separate source acceptance job; no live world.
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const gitCheckoutHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(process.env.BUILDER_B_EXPECTED_HEAD && gitCheckoutHead!==process.env.BUILDER_B_EXPECTED_HEAD)
 throw Error('Not exact-head source checkout: '+gitCheckoutHead+' != '+process.env.BUILDER_B_EXPECTED_HEAD);
const cwd=process.cwd(),dir='artifacts/builder-b-essentials-wave9-33-source-webgl2',records=[];
const ids=['r1:lighthouse:temperate:small:002','r1:fishing-lodge:desert:small:002','r1:farm-barn:enchanted-forest:small:002','r1:stable:desert:small:002','r1:greenhouse:enchanted-forest:small:002','r1:harbor-office:desert:small:002','r1:harbor-office:snow:small:002','r1:fishing-lodge:snow:small:002','r1:greenhouse:desert:small:002','r1:bathhouse:snow:small:002','r1:greenhouse:snow:small:003','r1:stable:temperate:medium:001','r1:lighthouse:desert:small:002','r1:farm-barn:desert:large:002','r1:greenhouse:snow:medium:002','r1:bathhouse:temperate:medium:002','r1:stable:snow:small:003','r1:fishing-lodge:temperate:medium:002','r1:harbor-office:desert:medium:002','r1:fishing-lodge:snow:medium:003','r1:greenhouse:enchanted-forest:medium:003','r1:lighthouse:temperate:medium:002','r1:greenhouse:temperate:large:003','r1:harbor-office:temperate:medium:002','r1:stable:desert:medium:003'];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const files=['src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave15.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave25.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave27.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave28.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave32.mjs','src/building-pool/roadmap-b/builder-b-essentials-wave33.mjs','src/building-pool/roadmap-1b/m2-community-structures.mjs','src/building-pool/roadmap-1b/schema.mjs','docs/building-pool/roadmap-b/BUILDER_BD_EXCLUSIVE_1B_FREEZE.json'];
await mkdir(dir,{recursive:true});
const sourceEvidence=[];
for(const path of files){
 const data=await readFile(path);
 sourceEvidence.push({path,sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length});
}
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(cwd,'.'+path);
  if(!file.startsWith(cwd+sep))throw Error('Cannot resolve outside repo');
  const content=await readFile(file);
  res.writeHead(200,{'Content-Type':extname(file)==='.html'?'text/html; charset=utf-8':
   extname(file)==='.mjs'||extname(file)==='.js'?'text/javascript; charset=utf-8':'application/octet-stream'});
  res.end(content);
 }catch(e){res.writeHead(404).end(String(e));}
});
await new Promise(resolve=>server.listen(4259,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox',
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader'
 ]});
 for(const id of ids)for(const [width,height] of sizes)for(const view of views){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  const preview=['builder-b-essentials-wave9-preview.html','builder-b-essentials-wave10-preview.html','builder-b-essentials-wave11-preview.html','builder-b-essentials-wave12-preview.html','builder-b-essentials-wave13-preview.html','builder-b-essentials-wave14-preview.html','builder-b-essentials-wave15-preview.html','builder-b-essentials-wave16-preview.html','builder-b-essentials-wave17-preview.html','builder-b-essentials-wave18-preview.html','builder-b-essentials-wave19-preview.html','builder-b-essentials-wave20-preview.html','builder-b-essentials-wave21-preview.html','builder-b-essentials-wave22-preview.html','builder-b-essentials-wave23-preview.html','builder-b-essentials-wave24-preview.html','builder-b-essentials-wave25-preview.html','builder-b-essentials-wave26-preview.html','builder-b-essentials-wave27-preview.html','builder-b-essentials-wave28-preview.html','builder-b-essentials-wave29-preview.html','builder-b-essentials-wave30-preview.html','builder-b-essentials-wave31-preview.html','builder-b-essentials-wave32-preview.html','builder-b-essentials-wave33-preview.html'][ids.indexOf(id)];
  const url='http://127.0.0.1:4259/tests/building-pool/roadmap-b/'+preview+'?id='+
   encodeURIComponent(id)+'&view='+view;
  await page.goto(url,{waitUntil:'load',timeout:30000});
  await page.waitForFunction(()=>window.__ROADMAP_B?.ready===true,{timeout:45000});
  const evidence=await page.evaluate(()=>window.__ROADMAP_B);
  if(pageErrors.length||!evidence.webgl2||evidence.error||evidence.id!==id||
    evidence.view!==view||evidence.dimensions[0]!==width||evidence.dimensions[1]!==height||
    evidence.sourceCells<1000||evidence.visibleCells<200)
   throw Error('Invalid source-specific WebGL2 witness '+id+' '+view+': '+JSON.stringify({evidence,pageErrors}));
  const buf=await page.screenshot({type:'png'});
  const png=PNG.sync.read(buf);
  if(png.width!==width||png.height!==height)throw Error('Incorrect exact screenshot dimensions');
  let colored=0,minX=width,minY=height,maxX=0,maxY=0;
  for(let y=48;y<height;y+=2)for(let x=0;x<width;x+=2){
   const i=(y*width+x)*4,r=png.data[i],g=png.data[i+1],b=png.data[i+2];
   if(r>70||g>85||b>110){colored++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  }
  if(colored<250)throw Error('Empty or missing building in screenshot: '+id+' '+view+' '+colored);
  const name=id.replaceAll(':','_')+'__'+view+'__'+width+'x'+height+'.png';
  await writeFile(dir+'/'+name,buf);
  records.push({id,view,width,height,file:name,bytes:buf.length,
   sha256:createHash('sha256').update(buf).digest('hex'),
   sourceCells:evidence.sourceCells,visibleCells:evidence.visibleCells,
   coloredPixelSamples:colored,sourcePixelBounds:[minX,minY,maxX,maxY],
   context:'real Chromium software-WebGL2 source-geometry point-voxel proxy; no producer AABB approval'});
  console.log('PASS WebGL2 '+id+' '+view+' '+width+'x'+height+' '+buf.length+' bytes');
  await page.close();
 }
 const keys=new Set(records.map(x=>x.sha256));
 if(records.length!==150||keys.size!==150)throw Error('Two new original source buildings require 150 unique authentic frames');
 for(const id of ids)for(const [width,height] of sizes){
  const p=records.find(r=>r.id===id&&r.width===width&&r.height===height&&r.view==='exterior');
  const q=records.find(r=>r.id===id&&r.width===width&&r.height===height&&r.view==='cutaway');
  if(!p||!q||q.visibleCells>=p.visibleCells)throw Error('Cutaway not source-backed '+id);
 }
 await writeFile(dir+'/manifest.json',JSON.stringify({schema:'mythwrought.builder-b-essentials-wave9-33-original.webgl2.v1',
  gitHead:gitCheckoutHead,expectedGitHead:process.env.BUILDER_B_EXPECTED_HEAD||null,
  exactHeadVerified:Boolean(process.env.BUILDER_B_EXPECTED_HEAD&&gitCheckoutHead===process.env.BUILDER_B_EXPECTED_HEAD),
  countedAsProductionBuilds:false,producerPackAABBsApproved:false,actualPhysicalIPhone:false,
  sourceEvidence,records},null,2));
 console.log('ROADMAP B GENUINE SOURCE WEBGL2 PASS: '+records.length+'/150 with 150 distinct PNG SHA-256');
}finally{await browser?.close();server.close();}
