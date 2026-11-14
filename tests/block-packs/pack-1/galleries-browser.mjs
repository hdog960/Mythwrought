// MYTHWROUGHT — Pack 1 genuine browser/gallery acceptance runner.
// This script is intentionally pack-owned and opt-in; the shared CI and live
// engine are NOT modified. Requires free Playwright (same dependency used by
// existing Mythwrought browser-smoke tests). Run from repository root:
//   node tests/block-packs/pack-1/galleries-browser.mjs
//
// Creates authentic screenshots of the actual committed gallery modules when
// executed. Do not claim screenshots exist merely because this source exists.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname,join,relative,sep} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(process.cwd());
const screenshots=resolve(process.env.PACK1_ARTIFACT_DIR||'artifacts/pack-1');
const galleries=[
  {name:'masonry',path:'gallery.html',count:6,place:'#place',clear:'#clear',save:'#restore',countLabel:'edits: '},
  {name:'stone-shapes',path:'stone-shape-gallery.html',count:6,place:'#place-all',clear:'#clear-all',save:'#save-check',countLabel:'Physically placed test cells: '},
  {name:'garden',path:'garden-gallery.html',count:3,place:'#all',clear:'#clear',save:'#save',countLabel:'Independent placed voxel cells: '},
  {name:'foliage',path:'foliage-gallery.html',count:8,place:'#all',clear:'#clear',save:'#save',countLabel:'Individually placed candidate cells: '},
  {name:'floral',path:'floral-gallery.html',count:7,place:'#all',clear:'#clear',save:'#save',countLabel:'Individually placed physical specimens: '}
];
const viewports=[[667,375],[844,390],[932,430]];
const mime={'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||'/', 'http://127.0.0.1');
    const path=decodeURIComponent(url.pathname);
    if(path==='/favicon.ico'){res.writeHead(204);res.end();return;}
    if(path.includes('\0'))throw new Error('Unsafe path');
    const file=resolve(root,'.'+path);
    if(file!==root&&!file.startsWith(root+sep))throw new Error('Escaping repository root');
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':(mime[extname(file)]||'application/octet-stream')+'; charset=utf-8',
      'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(bytes);
  }catch(e){
    res.writeHead(404,{'Content-Type':'text/plain'});
    res.end('Not found');
  }
});
const listen=()=>new Promise((resolveListen,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',()=>resolveListen(server.address().port));
});
const closeServer=()=>new Promise(resolveClose=>server.close(resolveClose));
const shell=async()=>{
  const port=await listen();
  let browser;
  const totals={galleries:0,viewports:0,screenshots:0,interactionChecks:0};
  await mkdir(screenshots,{recursive:true});
  try{
    browser=await chromium.launch({headless:true,
      ...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),
      args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
    for(const g of galleries){
      for(const [width,height] of viewports){
        const context=await browser.newContext({
          viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true,
          serviceWorkers:'block'
        });
        const page=await context.newPage();
        const errors=[],requests=[];
        page.on('pageerror',e=>errors.push(e.message));
        page.on('response',r=>{if(r.status()>=400)requests.push(r.url()+' HTTP '+r.status());});
        page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'+port+'/'))requests.push('Unexpected external URL '+r.url());});
        try{
          const url='http://127.0.0.1:'+port+'/src/block-packs/pack-1/'+g.path;
          const response=await page.goto(url,{waitUntil:'networkidle',timeout:20000});
          assert.equal(response?.status(),200,g.name+' gallery HTML did not load');
          await page.waitForFunction(n=>document.querySelector('#grid')?.children.length===n,
            g.count,{timeout:15000});
          const before=await page.evaluate(()=>{
            const all=[...document.querySelectorAll('#grid canvas')];
            const swatch=all.map(canvas=>{
              if(!canvas.width||!canvas.height)return 0;
              const image=canvas.getContext('2d')?.getImageData(0,0,canvas.width,canvas.height)?.data;
              if(!image)return 0;
              const colors=new Set();
              for(let i=0;i<image.length;i+=16){
                if(image[i+3]>0)colors.add([image[i],image[i+1],image[i+2]].join(','));
              }
              return colors.size;
            });
            return {cards:document.querySelector('#grid').children.length,
              richPreviews:swatch.filter(x=>x>8).length,
              pageWidth:document.documentElement.scrollWidth,
              viewportWidth:window.innerWidth,
              status:document.querySelector('#status')?.textContent,
              saves:Object.keys(localStorage)};
          });
          assert.equal(before.cards,g.count,'Gallery missing candidate card');
          assert.ok(before.richPreviews>=g.count,
            g.name+' has blank or monochrome physical preview canvas');
          assert.ok(before.pageWidth<=before.viewportWidth+2,
            g.name+' overflows mobile landscape width '+width+'x'+height);
          assert.deepEqual(before.saves,[],g.name+' changed localStorage before interaction');
          const filename=g.name+'-'+width+'x'+height;
          await page.screenshot({path:join(screenshots,filename+'-candidate.png'),fullPage:true});
          totals.screenshots++;
          const parseCount=(v)=>{
            const index=v.lastIndexOf(g.countLabel);
            if(index<0)return NaN;
            return Number(v.slice(index+g.countLabel.length).match(/^\d+/)?.[0]);
          };
          assert.equal(parseCount(before.status||''),0,'Fixture not initially empty');
          await page.locator(g.place).click();
          // All five fixture handlers update synchronously. Assert exact count
          // after the click instead of accepting unrelated digits in status.
          const afterPlace=(await page.locator('#status').textContent())||'';
          assert.equal(parseCount(afterPlace),g.count,
            g.name+' place-all did not create exactly '+g.count+' cells');
          await page.screenshot({path:join(screenshots,filename+'-placed.png'),fullPage:true});
          totals.screenshots++;
          await context.setOffline(true);
          await page.locator(g.save).click();
          const status=(await page.locator('#status').textContent())||'';
          assert.doesNotMatch(status,/ERROR|FAIL|unexpected|INVALID/i,
            g.name+' isolated canonical fixture save failed');
          assert.equal(parseCount(status),g.count,g.name+' save changed fixture count');
          await page.locator(g.clear).click();
          const cleared=(await page.locator('#status').textContent())||'';
          assert.equal(parseCount(cleared),0,g.name+' clear did not return 0 cells');
          assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[],
            g.name+' wrote to user local storage');
          assert.deepEqual(errors,[],g.name+' uncaught browser exceptions at '+width+'x'+height);
          assert.deepEqual(requests,[],g.name+' missing/external asset at '+width+'x'+height);
          totals.interactionChecks+=3;
          totals.viewports++;
          console.log('PASS '+g.name+' '+width+'x'+height+' previews, place, offline save, remove');
        }finally{await context.close();}
      }
      totals.galleries++;
    }
    console.log('PACK1_CHROMIUM_ACCEPTANCE',JSON.stringify(totals));
    console.log('Authentic screenshots:',screenshots);
  }finally{
    if(browser)await browser.close();
    await closeServer();
  }
};
await shell();
