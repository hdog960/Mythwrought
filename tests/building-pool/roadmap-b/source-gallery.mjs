// Independent exact-source Chromium WebGL2 point-voxel witness; not an engine producer-mesh approval.
// Run only in Roadmap B's separate PR-scoped workflow after playwright@1.58.2 and pngjs@7.0.0.
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const cwd=process.cwd(),dir='artifacts/roadmap-b-waves123-webgl2',records=[];
const ids=[
 'r1:farm-barn:desert:large:004','r1:greenhouse:snow:medium:004','r1:harbor-office:enchanted-forest:large:004',
 'r2:tailor:desert:large:04','r2:butcher:enchanted-forest:large:04','r2:bookshop:snow:medium:04',
 'r1:lighthouse:desert:large:004','r1:fishing-lodge:snow:large:004','r1:bathhouse:enchanted-forest:large:004',
 'r2:jeweler:mountain:large:04','r2:market-square:desert:large:04','r2:theater:snow:medium:03',
 'r1:greenhouse:mountain:large:004','r1:harbor-office:snow:medium:004','r1:farm-barn:enchanted-forest:medium:004','r1:lighthouse:temperate:large:004',
 'r2:theater:enchanted-forest:large:03','r2:bookshop:desert:large:04','r2:market-square:mountain:large:04','r2:tailor:snow:medium:04'
];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const files=['src/building-pool/roadmap-b/wave1-community-b1.mjs','src/building-pool/roadmap-b/wave1-trades-b2.mjs',
 'src/building-pool/roadmap-b/wave2-community-b1.mjs','src/building-pool/roadmap-b/wave2-trades-b2.mjs',
 'src/building-pool/roadmap-b/wave3-community-b1.mjs','src/building-pool/roadmap-b/wave3-trades-b2.mjs',
 'src/building-pool/roadmap-1b/m2-community-structures.mjs','src/building-pool/roadmap-1b/legacy-stable-schema.mjs',
 'src/building-pool/roadmap-1b/schema.mjs','src/building-pool/roadmap-2b/schema.mjs','src/building-pool/roadmap-2b/catalog.mjs'];
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
await new Promise(resolve=>server.listen(4189,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox',
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader'
 ]});
 for(const id of ids)for(const [width,height] of sizes)for(const view of views){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  const url='http://127.0.0.1:4189/tests/building-pool/roadmap-b/source-preview.html?id='+
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
 if(records.length!==120||keys.size!==120)throw Error('36 source captures not unique and complete');
 for(const id of ids)for(const [width,height] of sizes){
  const p=records.find(r=>r.id===id&&r.width===width&&r.height===height&&r.view==='exterior');
  const q=records.find(r=>r.id===id&&r.width===width&&r.height===height&&r.view==='cutaway');
  if(!p||!q||q.visibleCells>=p.visibleCells)throw Error('Cutaway not source-backed '+id);
 }
 await writeFile(dir+'/manifest.json',JSON.stringify({schema:'mythwrought.roadmap-b-waves123.webgl2.v1',
  gitHead:process.env.ROADMAP_B_EXACT_HEAD||null,
  countedAsProductionBuilds:false,producerPackAABBsApproved:false,actualPhysicalIPhone:false,
  sourceEvidence,records},null,2));
 console.log('ROADMAP B GENUINE SOURCE WEBGL2 PASS: '+records.length+'/120 with 120 distinct PNG SHA-256');
}finally{await browser?.close();server.close();}
