// Cave Roadmap #240 source-exact genuine Chromium WebGL2 evidence.
// Authored cave cells + real production meshDepthSection; NOT live Home Screen.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,sep,extname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs,head=process.env.CAVE_EXPECTED_HEAD||'';
assert.match(head,/^[0-9a-f]{40}$/,'Exact source SHA required');
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);
const scenes=['olddeep','switchback','whisper','windcut','vault','entrance'];
const viewports=[[667,375],[844,390],[932,430]];
const dir=resolve('artifacts/cave-roadmap-source-webgl2'),root=resolve('.');
await mkdir(dir,{recursive:true});
const report={kind:'real-cave-source-mesher-WebGL2-preview-not-game',
 head,live:false,homeScreenReady:false,iPhoneTested:false,status:'BLOCKED',
 scenes,viewports,screenshots:[],errors:[]};
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try{
  const file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+sep)||!mime[extname(file)])throw Error('Blocked request');
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)],'Cache-Control':'no-store'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found')}
});
let browser;
function inspect(raw,width,height){
 const p=PNG.sync.read(raw);assert.equal(p.width,width);assert.equal(p.height,height);
 let bright=0;const colors=new Set();
 for(let y=Math.floor(height*.33);y<Math.floor(height*.86);y+=8)
  for(let x=Math.floor(width*.24);x<Math.floor(width*.76);x+=8){
   const i=(y*p.width+x)*4;
   colors.add([p.data[i]>>4,p.data[i+1]>>4,p.data[i+2]>>4].join(','));
   if(p.data[i]>36||p.data[i+1]>36||p.data[i+2]>36)bright++;
  }
 return {width,height,paletteBins:colors.size,brightSamples:bright,
  sha256:createHash('sha256').update(raw).digest('hex')};
}
try{
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 browser=await chromium.launch({headless:true,args:['--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const url='http://127.0.0.1:'+server.address().port+'/src/manual-caves/preview.html';
 for(const [width,height] of viewports){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   hasTouch:true,isMobile:true,serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',err=>errors.push('pageerror: '+err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push('console: '+msg.text())});
  page.on('requestfailed',req=>errors.push('requestfailed: '+req.url()));
  page.on('response',resp=>{if(resp.status()>=400)errors.push('HTTP '+resp.status()+' '+resp.url())});
  try{
   assert.equal((await page.goto(url,{waitUntil:'networkidle',timeout:30000}))?.status(),200);
   await page.waitForFunction(()=>window.CAVE_PREVIEW_READY===true,null,{timeout:30000});
   assert.equal(await page.evaluate(()=>window.CAVE_PREVIEW.status()),null,
    'New cave world MUST require explicit selection');
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),null);
   await page.locator('#create').click();
   await page.waitForFunction(()=>window.CAVE_PREVIEW.status()?.vertices>100,
    null,{timeout:90000});
   const hashes=new Set();
   for(const name of scenes){
    const evidence=await page.evaluate(name=>window.CAVE_PREVIEW.show(name),name);
    assert.equal(evidence.scene,name);
    assert.equal(evidence.sourceCount,5);
    assert.ok(evidence.realVoxelMesher&&evidence.webgl2);
    assert.equal(evidence.registeredInHomeScreen,false);
    assert.deepEqual(evidence.canvas,[width,height]);
    assert.ok(evidence.vertices>100);
    const path=join(dir,'cave-'+name+'-'+width+'x'+height+'.png');
    const png=await page.screenshot({path,fullPage:true});
    const stats=inspect(png,width,height);
    assert.ok(stats.paletteBins>=3,'Blank GPU scene '+name+' '+width+'x'+height);
    hashes.add(stats.sha256);
    report.screenshots.push({scene:name,...stats,vertices:evidence.vertices,
     triangles:evidence.triangles,sourceHead:head});
   }
   assert.equal(hashes.size,scenes.length,'Identical physical scene screenshots');
   if(width===667){
    await page.evaluate(()=>window.CAVE_PREVIEW.show('olddeep'));
    const mined=await page.evaluate(()=>window.CAVE_PREVIEW.mine());
    assert.equal(mined.after,0,'Actual voxel mine failed');
    assert.equal((await page.evaluate(()=>window.CAVE_PREVIEW.save())).schema,1);
    assert.equal(await page.evaluate(()=>localStorage.getItem(window.CAVE_PREVIEW.oldSaveKey)),null);
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.CAVE_PREVIEW_READY===true,null,{timeout:30000});
    assert.equal(await page.evaluate(()=>window.CAVE_PREVIEW.status()),null,
      'Cave profile activated itself after reload');
    await page.locator('#load').click();
    await page.waitForFunction(()=>window.CAVE_PREVIEW.status()?.editCount>=1,
      null,{timeout:90000});
    assert.equal(await page.evaluate(()=>localStorage.getItem(window.CAVE_PREVIEW.oldSaveKey)),null);
   }
   assert.deepEqual(errors,[],'Browser errors '+width+'x'+height);
   console.log('PASS CAVE SOURCE WEBGL2 '+width+'x'+height+' · '+scenes.length+
    ' real source meshes; '+hashes.size+' screenshots; HEAD '+head);
  }finally{await context.close()}
 }
 assert.equal(report.screenshots.length,scenes.length*viewports.length);
 report.status='SOURCE_EXACT_WEBGL2_PREVIEW_PASS';
}catch(e){
 report.status='BLOCKED';report.errors.push(String(e?.stack||e));
 console.error('CAVE SOURCE WEBGL2 BLOCKED',e);
 process.exitCode=1;
}finally{
 await writeFile(join(dir,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
