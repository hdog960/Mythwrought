import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {EFFECT_IDS} from '../src/nonblock/candidate-effects.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const base=process.env.NONBLOCK_FX_ORIGIN||'http://127.0.0.1:4173';
const seed=179;
const layouts=[{sceneId:'scene48:single-wildflower',anchor:[10,9,7]}];
const parentKey=describeCandidateObject(seed,layouts[0]).instanceKey;
const positions=[
  [10,9,7],[11,9,7],[12,9,7],[10,9,8],[11,9,8],[12,9,8],
  [13,9,8],[10,9,9],[11,9,9],[12,9,9],[13,9,9],[11,9,10]
];
const effects=EFFECT_IDS.map((sceneId,i)=>({
  sceneId,anchor:positions[i],...(i===0?{parentKey}:{})
}));
const query='nonblock-stage='+encodeURIComponent(JSON.stringify(layouts))+
  '&nonblock-fx='+encodeURIComponent(JSON.stringify(effects));
const route=base+'/?'+query;
const dir='artifacts/nonblock-effects';
await mkdir(dir,{recursive:true});
const digest=body=>createHash('sha256').update(body).digest('hex');
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[],observed=[];
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(route);
  const status=async(tab,active,physical)=>tab.waitForFunction(({active,physical})=>{
    const data=document.querySelector('#scene').dataset;
    return Number(data.nonblockEffects)===active&&Number(data.nonblockInstances)===physical&&
      Number(data.nonblockEffectVertices)>0&&Number(data.loadedChunks)===25;
  },{active,physical},{timeout:45000});
  async function capture(tab,label){
    const file=dir+'/'+label+'.png';
    const image=await tab.screenshot({path:file});
    assert.deepEqual([image.readUInt32BE(16),image.readUInt32BE(20)],[932,430]);
    captures.push({file,sha256:digest(image)});
  }
  await status(page,12,1);
  await page.evaluate(()=>{
    window.__mythwroughtTest.teleport(11.5,6.5);
    window.__mythwroughtTest.aimAtStagedPoint(11.4,9.7,8.6);
  });
  const frame=await page.locator('#scene').getAttribute('data-nonblock-effect-frame');
  await capture(page,'scene-effects-first');
  await page.waitForFunction(frame=>
    document.querySelector('#scene').dataset.nonblockEffectFrame!==frame,frame);
  await capture(page,'scene-effects-next');
  assert.notEqual(captures[0].sha256,captures[1].sha256);
  const vertexCount=Number(await page.locator('#scene').getAttribute('data-nonblock-effect-vertices'));
  assert.ok(vertexCount>0&&vertexCount<1500);
  observed.push({effects:12,vertexCount});

  await page.evaluate(()=>{
    window.__mythwroughtTest.teleport(10.5,5.5);
    window.__mythwroughtTest.aimAtStagedPoint(10.58387,9.6238,7.5254);
  });
  await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,parentKey);
  await page.locator('#dig').tap();
  await status(page,11,0);
  assert.match(await page.locator('#status').textContent(),/Scenery removed/);
  await page.close();

  const reopened=await context.newPage();
  reopened.on('pageerror',error=>errors.push(error.message));
  await reopened.goto(route);
  await status(reopened,11,0);
  const lost=await reopened.evaluate(()=>{
    const gl=document.querySelector('#scene').getContext('webgl2');
    const extension=gl.getExtension('WEBGL_lose_context');
    if(!extension)return false;
    window.stageTestContextExtension=extension;
    extension.loseContext();
    return true;
  });
  assert.equal(lost,true);
  await reopened.waitForFunction(()=>window.__mythwroughtTest.snapshot().graphics.lost);
  await reopened.waitForTimeout(180);
  await reopened.evaluate(()=>window.stageTestContextExtension.restoreContext());
  await reopened.waitForFunction(()=>window.__mythwroughtTest.snapshot().graphics.restoredCount>0);
  await status(reopened,11,0);
  await reopened.evaluate(()=>{
    window.__mythwroughtTest.teleport(11.5,6.5);
    window.__mythwroughtTest.aimAtStagedPoint(11.4,9.7,8.6);
  });
  await capture(reopened,'scene-effects-restored');
  observed.push({effects:11,afterRemovalAndContextRestore:true});
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/nonblock/candidate-effects.mjs','tests/nonblock-effects-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(dir+'/manifest.json',JSON.stringify({seed,effects,captures,observed,sourceSha256},null,2)+'\n');
console.log('PASS 12 moving render-only effects, parent removal and real WebGL context restoration');
