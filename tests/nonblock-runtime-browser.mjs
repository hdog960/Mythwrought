import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const origin = 'http://127.0.0.1:4173';
const layout = [
  {sceneId:'scene48:single-wildflower',anchor:[10,9,7]},
  {sceneId:'nonblock:d:desert-scrub',anchor:[11,9,7],variant:3},
  {sceneId:'nonblock:e:pebble-scatter',anchor:[12,9,7],variant:2},
  {sceneId:'scene36:cloth-banner',anchor:[11,9,10],orientation:2},
  {sceneId:'scene36:rope-coil',anchor:[11,9,8],variant:1}
];
const addresses = layout.map(placement=>describeCandidateObject(179,placement).instanceKey);
const stageUrl = origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));
const captures = [];
const sourceFiles = ['src/main.mjs','src/nonblock/candidate-scene.mjs',
  'src/nonblock-scene48/flora-phase1.mjs','src/nonblock-environments24/desert-scrub.mjs',
  'src/nonblock-environments24/pebble-scatter.mjs','src/nonblock-fittings36/fittings-phase1.mjs'];
const digest = bytes=>createHash('sha256').update(bytes).digest('hex');
const directory = 'artifacts/nonblock-runtime';
await mkdir(directory,{recursive:true});
const browser = await chromium.launch({headless:true,args:['--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

async function observe(page,instances) {
  await page.waitForFunction(count=>{
    const data=document.querySelector('#scene').dataset;
    return Number(data.nonblockInstances)===count && Number(data.loadedChunks)===25;
  },instances,{timeout:45000});
}
async function position(page,x,z,point) {
  await page.evaluate(({x,z,point})=>{
    window.__mythwroughtTest.teleport(x,z);
    window.__mythwroughtTest.aimAtStagedPoint(...point);
  },{x,z,point});
}
async function capture(page,name,width,height) {
  const path = directory+'/'+name+'.png';
  const bytes = await page.screenshot({path});
  const image = PNG.sync.read(bytes);
  assert.equal(image.width,width);
  assert.equal(image.height,height);
  const colors = new Set();
  for(let i=0;i<image.data.length;i+=64) colors.add(image.data.readUInt32BE(i));
  assert.ok(colors.size>500,'Expected a real, varied game render');
  captures.push({path,width,height,sha256:digest(bytes)});
}

try {
  for (const [width,height] of [[667,375],[844,390],[932,430]]) {
    const context = await browser.newContext({
      viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:1
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(stageUrl);
    await observe(page,5);
    await position(page,11.5,4.5,[11.5,9.75,8.5]);
    await page.waitForTimeout(400);
    await capture(page,'mixed-'+width,width,height);
    if(width===932){
      const prior = await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
      const views = [
        [10.5,5.5,[10.58387,9.6238,7.5254]],
        [11.5,6.5,[11.43766,9.08987,7.48459]],
        [12.5,6.5,[12.527,9.01833,7.56393]],
        [11.5,8.5,[11.54778,10.135,10.90487]],
        [11.5,7.5,[11.64314,9.10556,8.54205]]
      ];
      for(let i=0;i<layout.length;i++){
        await position(page,...views[i]);
        await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
          addresses[i],{timeout:8000});
        await capture(page,'target-'+layout[i].sceneId.split(':').at(-1),width,height);
        await page.locator('#dig').tap();
        await observe(page,layout.length-i-1);
        assert.match(await page.locator('#status').textContent(),/Scenery removed/);
      }
      assert.deepEqual(await page.evaluate(()=>JSON.parse(
        localStorage.getItem('mythwrought:nonblock-stage:v1:legacy:179')
      ).tombstones),[...addresses].sort());
      assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),prior);
      await page.close();
      const reopened = await context.newPage();
      await reopened.goto(stageUrl);
      await observe(reopened,0);
      assert.equal(await reopened.locator('#scene').getAttribute('data-nonblock-vertices'),'0');
      await position(reopened,11.5,4.5,[11.5,9.75,8.5]);
      await reopened.waitForTimeout(400);
      await capture(reopened,'cold-reopen-'+width,width,height);
    }
    assert.deepEqual(errors,[]);
    await context.close();
  }
} finally {
  await browser.close();
}
const sources = Object.fromEntries(await Promise.all(sourceFiles.map(async path=>
  [path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({sources,captures},null,2)+'\n');
console.log('5 source families drawn, targeted and removed via touch; all tombstones survived a new page.');
console.log('9 authentic WebGL2 screenshots and source digests were written to '+directory);
