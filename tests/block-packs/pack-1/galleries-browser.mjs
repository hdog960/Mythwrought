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
import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve,extname,join,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {parseFixtureCount,saveWasVerified} from './gallery-count.mjs';

const root=resolve(process.cwd());
const screenshots=resolve(process.env.PACK1_ARTIFACT_DIR||'artifacts/pack-1');
const galleries=[
  {name:'masonry',path:'gallery.html',count:6,place:'#place',clear:'#clear',save:'#restore',countLabel:'edits: ',saveSuccess:'save/restore verified',activeSelector:'#grid > .card.selected'},
  {name:'stone-shapes',path:'stone-shape-gallery.html',count:6,place:'#place-all',clear:'#clear-all',save:'#save-check',countLabel:'Physically placed test cells: ',saveSuccess:'PASS:',activeSelector:'#grid > .card.active'},
  {name:'garden',path:'garden-gallery.html',count:3,place:'#all',clear:'#clear',save:'#save',countLabel:'Independent placed voxel cells: ',saveSuccess:'PASS:',activeSelector:'#grid > .card.placed'},
  {name:'foliage',path:'foliage-gallery.html',count:8,place:'#all',clear:'#clear',save:'#save',countLabel:'Individually placed candidate cells: ',saveSuccess:'PASS:',activeSelector:'#grid > .card.active'},
  {name:'floral',path:'floral-gallery.html',count:7,place:'#all',clear:'#clear',save:'#save',countLabel:'Individually placed physical specimens: ',saveSuccess:'PASS:',activeSelector:'#grid > .item.active'}
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
  const evidence=[];
  let gitHead=null;
  try{gitHead=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}
  catch{console.warn('No Git HEAD available: screenshot provenance unverified');}
  if(process.env.PACK1_EXPECTED_HEAD&&gitHead!==process.env.PACK1_EXPECTED_HEAD){
    await closeServer();
    throw new Error('Candidate branch HEAD mismatch: '+gitHead+' != '+process.env.PACK1_EXPECTED_HEAD);
  }
  try{
    await mkdir(screenshots,{recursive:true});
    // Delete ONLY this runner's known output names. A failed new run must not
    // leave the previous PASS report or old screenshots looking like fresh proof.
    const stale=['acceptance-report.json'];
    for(const g of galleries)for(const [width,height] of viewports)
      for(const suffix of ['-candidate.png','-placed.png'])
        stale.push(g.name+'-'+width+'x'+height+suffix);
    await Promise.all(stale.map(name=>rm(join(screenshots,name),{force:true})));
  }
  catch(error){await closeServer();throw error;}
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
            // Inspect the FIRST canvas in EACH specimen card, not any
            // unrelated cross-section canvas. Ignore labels/ID text at top;
            // otherwise unique IDs can disguise duplicated or blank art.
            const cards=[...document.querySelector('#grid').children];
            const previewStats=cards.map(card=>{
              const canvas=card.querySelector('canvas');
              if(!canvas?.width||!canvas?.height)return {colors:0,pixels:0,hash:0};
              const {width,height}=canvas;
              const rgba=canvas.getContext('2d')?.getImageData(0,0,width,height)?.data;
              if(!rgba)return {colors:0,pixels:0,hash:0};
              const colors=new Set();
              let pixels=0,hash=2166136261;
              for(let y=Math.floor(height*.19);y<Math.ceil(height*.78);y+=2){
                for(let x=Math.floor(width*.12);x<Math.ceil(width*.88);x+=2){
                  const i=(y*width+x)*4;
                  if(rgba[i+3]<40)continue;
                  pixels++;
                  const rr=rgba[i],gg=rgba[i+1],bb=rgba[i+2];
                  colors.add(rr+','+gg+','+bb);
                  hash=Math.imul(hash^rr,16777619)>>>0;
                  hash=Math.imul(hash^gg,16777619)>>>0;
                  hash=Math.imul(hash^bb,16777619)>>>0;
                }
              }
              return {colors:colors.size,pixels,hash};
            });
            return {cards:cards.length,
              previewStats,
              pageWidth:document.documentElement.scrollWidth,
              viewportWidth:window.innerWidth,
              status:document.querySelector('#status')?.textContent,
              saves:Object.keys(localStorage)};
          });
          assert.equal(before.cards,g.count,'Gallery missing candidate card');
          assert.equal(await page.locator(g.activeSelector).count(),0,
            g.name+' initially marks a specimen as placed when fixture is empty');
          assert.ok(before.previewStats.every(p=>p.colors>=12&&p.pixels>=60),
            g.name+' includes a blank, tiny or monochrome primary specimen preview: '+
              JSON.stringify(before.previewStats));
          assert.equal(new Set(before.previewStats.map(p=>p.hash)).size,g.count,
            g.name+' has visually duplicate specimen previews inside the artwork crop');
          assert.ok(before.pageWidth<=before.viewportWidth+2,
            g.name+' overflows mobile landscape width '+width+'x'+height);
          assert.deepEqual(before.saves,[],g.name+' changed localStorage before interaction');
          const filename=g.name+'-'+width+'x'+height;
          await page.screenshot({path:join(screenshots,filename+'-candidate.png'),fullPage:true});
          totals.screenshots++;
          const parseCount=(status)=>parseFixtureCount(status,g.countLabel);
          assert.equal(parseCount(before.status||''),0,'Fixture not initially empty');
          await page.locator(g.place).click();
          // All five fixture handlers update synchronously. Assert exact count
          // after the click instead of accepting unrelated digits in status.
          const afterPlace=(await page.locator('#status').textContent())||'';
          assert.equal(parseCount(afterPlace),g.count,
            g.name+' place-all did not create exactly '+g.count+' cells');
          assert.equal(await page.locator(g.activeSelector).count(),g.count,
            g.name+' placed fixture cells are not reflected in visible card selection');
          await page.screenshot({path:join(screenshots,filename+'-placed.png'),fullPage:true});
          totals.screenshots++;
          await context.setOffline(true);
          await page.locator(g.save).click();
          const status=(await page.locator('#status').textContent())||'';
          assert.ok(saveWasVerified(status,g.saveSuccess),
            g.name+' save/restore failed or reported a safe blocker rather than success');
          assert.equal(parseCount(status),g.count,g.name+' save changed fixture count');
          assert.equal(await page.locator(g.activeSelector).count(),g.count,
            g.name+' canonical save/restore lost visible placement selections');
          await page.locator(g.clear).click();
          const cleared=(await page.locator('#status').textContent())||'';
          assert.equal(parseCount(cleared),0,g.name+' clear did not return 0 cells');
          assert.equal(await page.locator(g.activeSelector).count(),0,
            g.name+' clear did not remove the visible placement selections');
          assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[],
            g.name+' wrote to user local storage');
          assert.deepEqual(errors,[],g.name+' uncaught browser exceptions at '+width+'x'+height);
          assert.deepEqual(requests,[],g.name+' missing/external asset at '+width+'x'+height);
          totals.interactionChecks+=3;
          totals.viewports++;
          evidence.push({gallery:g.name,viewport:{width,height},candidateCount:g.count,
            previewStats:before.previewStats,
            screenshots:[filename+'-candidate.png',filename+'-placed.png'],
            canonicalOfflineSave:true,clearedAfterwards:true,
            cardSelectionChecks:{empty:0,placed:g.count,saved:g.count,cleared:0},
            errors:errors.length,failedRequests:requests.length});
          console.log('PASS '+g.name+' '+width+'x'+height+' previews, place, offline save, remove');
        }finally{await context.close();}
      }
      totals.galleries++;
    }
    // Only write the PASS evidence manifest after ALL 15 views finish cleanly.
    const report={kind:'Pack1 real Chromium candidate gallery acceptance',
      checkoutGitHead:gitHead,executedAt:new Date().toISOString(),
      playwrightChromeRealRun:true,totals,evidence};
    await writeFile(join(screenshots,'acceptance-report.json'),JSON.stringify(report,null,2)+'\n');
    console.log('PACK1_CHROMIUM_ACCEPTANCE',JSON.stringify(totals));
    console.log('Authentic screenshots:',screenshots);
  }finally{
    if(browser)await browser.close();
    await closeServer();
  }
};
await shell();
