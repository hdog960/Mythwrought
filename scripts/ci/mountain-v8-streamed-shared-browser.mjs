// Current isolated candidate: complete surface streaming and shared shaped renderer.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=path.join(root,'artifacts/mountain-v8-streamed-shared');
await mkdir(out,{recursive:true});
const release='20261124-mountain-v8-candidate-09',seed=179;
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
let requests=0,offline=false;
const afterCutoff=[];
const server=createServer(async(req,res)=>{
 requests++;if(offline)afterCutoff.push(req.url);
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/fixture'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>isolated fixture</title>');return;}
  const resolved=path.resolve(root,'.'+pathname);
  if(resolved!==root&&!resolved.startsWith(root+path.sep))throw Error('bad path');
  const file=resolved===root?path.join(root,'index.html'):resolved;
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
    'Cache-Control':pathname==='/sw-m5.js'?'public, max-age=300':'no-store'});res.end(bytes);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
let browser,ctx;
const report={release,seed,realChromium:true,physicalIphone:false,softwareWebGL2:true,checks:[],screens:[],errors:[],finished:false};
const persist=()=>writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
const check=(name,ok,info={})=>{report.checks.push({name,ok:Boolean(ok),...info});console.log('V8 '+name,JSON.stringify({ok:Boolean(ok),...info}));assert.ok(ok,name);};
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 ctx=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,serviceWorkers:'allow'});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 // Isolated existing V8 fixture at historically known seed179. This is
 // explicitly not public new-world admission and never uses real user storage.
 await page.goto(origin+'/fixture');
 await page.evaluate(async()=>{
  const {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const {saveFingerprint,saveWorldSafe}=await import('/src/persistence.mjs');
  const {worldSlotKey}=await import('/src/seeds.mjs');
  const profile=fourRegionProfile(179,M8_MOUNTAIN_GENERATOR),raw=JSON.stringify(profile);
  const record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
  const key=worldSlotKey(179)+'-four-biomes-profile-v1';
  localStorage.setItem(key,record);localStorage.setItem(key+'-journal',record);
  const result=saveWorldSafe(localStorage,new FourRegionWorld(179,profile));
  if(!result.ok)throw Error(JSON.stringify(result));
 });
 await page.goto(origin+'/index.html',{waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8',null,{timeout:90000});

 // Never infer completeness from a single resident chunk or a count alone.
 // The source stream() surface contract is exactly the 5x5 window.
 const fullyStreamed=async(label)=>{
  const getExpected=()=>page.evaluate(async()=>{
   const t=window.__mythwroughtTest,p=t.m5ObservedPose();
   const {chunkWindow}=await import('/src/voxel.mjs');
   const {sectionWindow,sectionChunkRadius,depthMeshKey}=await import('/src/depth.mjs');
   if(sectionWindow(p.feet,false).join(',')!=='0')throw Error('Camera is not in surface section');
   return chunkWindow(p.x,p.z,sectionChunkRadius(0,0)).map(c=>depthMeshKey(c.cx,c.cz,0)).sort();
  });
  const expected=await getExpected();
  assert.equal(expected.length,25,'Original surface window');
  await page.waitForFunction(expected=>{
   const t=window.__mythwroughtTest,s=t.snapshot();
   return s.graphics.shaderReady&&!s.graphics.lost&&s.pending.length===0&&
    s.gpuRetry.pendingRetries===0&&s.chunks.slice().sort().join('|')===expected.join('|');
  },expected,{timeout:180000,polling:250});
  // Two completed animation frames after publication, then recheck exact keys.
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const data=await page.evaluate(()=>{
   const t=window.__mythwroughtTest,s=t.snapshot(),gl=document.querySelector('#scene').getContext('webgl2');
   return {pose:t.m5ObservedPose(),chunks:s.chunks.slice().sort(),pending:s.pending,
    graphics:s.graphics,retries:s.gpuRetry,glError:gl.getError(),
    renderedFrames:Number(document.querySelector('#scene').dataset.renderedFrames)};
  });
  check(label+'-full-surface-window',JSON.stringify(data.chunks)===JSON.stringify(expected)&&
   JSON.stringify(await getExpected())===JSON.stringify(expected)&&data.pending.length===0&&
   data.retries.failures===0&&data.retries.pendingRetries===0&&data.glError===0&&
   data.graphics.shaderReady&&!data.graphics.lost&&data.renderedFrames>0,data);
  const file=label+'.png',png=await page.screenshot({path:path.join(out,file),timeout:90000});
  report.screens.push({file,bytes:png.length,sha256:createHash('sha256').update(png).digest('hex')});
  await persist();
 };
 // Real seed179 source, no artificial geometry in the landscape screenshots.
 const core=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,p=t.teleport(-473.5,5.5);
  t.aimAt(-470,15,5);
  return {p,tree:[13,14,15].map(y=>t.block(-470,y,5))};
 });
 check('natural-core-source',core.tree.every(id=>id===370),core);
 await fullyStreamed('core-natural');
 await page.evaluate(()=>{const t=window.__mythwroughtTest;t.teleport(-270,-180);t.setOrientation(Math.PI/2,-.14);});
 await fullyStreamed('shoulder-natural');
 // Return to core for shared renderer tests, separate from visual captures.
 await page.evaluate(()=>{const t=window.__mythwroughtTest;t.teleport(-473.5,5.5);t.aimAt(-470,15,5);});
 await fullyStreamed('core-return');
 const shared=await page.evaluate(async()=>{
  const t=window.__mythwroughtTest,gl=document.querySelector('#scene').getContext('webgl2');
  const {MANUAL_FIVE_PACK_CATALOG,resolveManualFivePackAsset}=await import('/src/builder-assets/manual-five-pack.mjs');
  const manual=MANUAL_FIVE_PACK_CATALOG.find(row=>(row.pack===1||row.pack===4)&&
   resolveManualFivePackAsset(row.symbol,{numericId:row.numericId,variant:row.pack===1?'lower':null}).supportPolicy==='none'&&
   resolveManualFivePackAsset(row.symbol,{numericId:row.numericId,variant:row.pack===1?'lower':null}).supportOffsets.length===0);
  const pack3=MANUAL_FIVE_PACK_CATALOG.find(row=>row.pack===3);
  if(!manual||!pack3)throw Error('No original independent fixture material');
  const air=[];
  for(let x=-480;x<=-477;x++)for(let z=10;z<=14;z++)for(let y=17;y>=14;y--)
   if(t.block(x,y,z)===0)air.push([x,y,z]);
  if(air.length<3)throw Error('No genuine distinct AIR cells');
  const [water,a,b]=air;
  t.placeFixture(...water,76);
  const canonical='mythwrought-v002-world-179',pkey='mythwrought-pack3-construction-v1:179',mkey='mythwrought.manual14.seed.179';
  const baseline=localStorage.getItem(canonical);
  const fault=(action,at,key)=>{
   const prior=localStorage.getItem(key),priorSnap=t.snapshot();
   const create=gl.createBuffer.bind(gl),del=gl.deleteBuffer.bind(gl),upload=gl.bufferData.bind(gl);
   const made=[],deleted=[];let calls=0,rejected=false,reason='';
   gl.createBuffer=function(){const h=create();made.push(h);return h;};
   gl.deleteBuffer=function(h){deleted.push(h);return del(h);};
   gl.bufferData=function(...args){if(++calls===1)throw Error('V8 shared renderer injected upload failure');return upload(...args);};
   try{action();}catch(e){rejected=true;reason=String(e);}
   finally{gl.createBuffer=create;gl.deleteBuffer=del;gl.bufferData=upload;}
   const after=t.snapshot();
   return {calls,rejected,reason,firstCandidateRetired:made.length>0&&deleted.includes(made[0]),
    absent:t.block(...at)===0,primaryUnchanged:localStorage.getItem(key)===prior,
    canonicalUnchanged:localStorage.getItem(canonical)===baseline,water:t.block(...water),
    pack3CountUnchanged:after.pack3PhysicalBlocks===priorSnap.pack3PhysicalBlocks,
    manualCountUnchanged:after.manual14PhysicalBlocks===priorSnap.manual14PhysicalBlocks};
  };
  const pFault=fault(()=>t.placePack3Fixture(...a,pack3.numericId),a,pkey);
  t.placePack3Fixture(...a,pack3.numericId);
  const mFault=fault(()=>t.placeManual14Fixture(...b,manual.numericId),b,mkey);
  t.placeManual14Fixture(...b,manual.numericId);
  const placed={pack3:t.block(...a),manual:t.block(...b),water:t.block(...water),
   canonicalUnchanged:baseline===localStorage.getItem(canonical),
   pRaw:localStorage.getItem(pkey),mRaw:localStorage.getItem(mkey),glError:gl.getError()};
  return {water,a,b,pack3:pack3.numericId,manual:manual.numericId,pFault,mFault,placed,baseline};
 });
 const goodFault=x=>x.calls>0&&x.rejected&&x.reason.includes('injected upload failure')&&
  x.firstCandidateRetired&&x.absent&&x.primaryUnchanged&&x.canonicalUnchanged&&x.water===76&&
  x.pack3CountUnchanged&&x.manualCountUnchanged;
 check('actual-pack3-staged-upload-rollback',goodFault(shared.pFault),shared.pFault);
 check('actual-manual14-staged-upload-rollback',goodFault(shared.mFault),shared.mFault);
 check('actual-shared-renderer-place-and-canonical-preservation',
  shared.placed.pack3===shared.pack3&&shared.placed.manual===shared.manual&&shared.placed.water===76&&
  shared.placed.canonicalUnchanged&&shared.placed.pRaw!==null&&shared.placed.mRaw!==null&&shared.placed.glError===0,
  {pack3:shared.pack3,manual:shared.manual,water:shared.water,a:shared.a,b:shared.b});
 await page.reload({waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8',null,{timeout:90000});
 const reopened=await page.evaluate(s=>{
  const t=window.__mythwroughtTest;
  return {pack3:t.block(...s.a),manual:t.block(...s.b),water:t.block(...s.water),
   canonical:localStorage.getItem('mythwrought-v002-world-179')===s.baseline,
   pack3Bytes:localStorage.getItem('mythwrought-pack3-construction-v1:179')===s.placed.pRaw,
   manualBytes:localStorage.getItem('mythwrought.manual14.seed.179')===s.placed.mRaw};
 },shared);
 check('actual-shared-sidecar-reopen',reopened.pack3===shared.pack3&&reopened.manual===shared.manual&&
  reopened.water===76&&reopened.canonical&&reopened.pack3Bytes&&reopened.manualBytes,reopened);
 check('no-browser-errors',errors.length===0,{errors});
 report.finished=true;await persist();
}catch(e){report.errors.push(String(e));await persist();throw e;}
finally{await ctx?.close();await browser?.close();await new Promise(r=>server.close(r));}
