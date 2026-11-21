import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';

const origin = process.env.CITIZEN_PREVIEW_ORIGIN ?? 'http://127.0.0.1:4197';
const output = process.env.CITIZEN_PREVIEW_OUTPUT ?? 'artifacts/citizen-rig';
const browser = await chromium.launch({args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir(output,{recursive:true});
const reports = [];

function silhouettes(bytes, count) {
  const {width,height,data} = PNG.sync.read(bytes);
  const sample = (width*5+Math.floor(width/2))*4;
  const background = data.subarray(sample,sample+3);
  const pixels = Array(count).fill(0);
  for (let y=4; y<height-4; y++) for (let x=4; x<width-4; x++) {
    const offset = (y*width+x)*4;
    if (Math.abs(data[offset]-background[0])+Math.abs(data[offset+1]-background[1])+
        Math.abs(data[offset+2]-background[2]) > 12) {
      pixels[Math.floor(x*count/width)]++;
    }
  }
  assert(pixels.every(coverage => coverage > 200), `Missing actual rendered model: ${pixels.join(', ')}`);
  return pixels;
}

try {
  for (const size of [{width:844,height:390},{width:1280,height:640}]) {
    const page = await browser.newPage({viewport:size,hasTouch:true});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(new URL('/citizen-preview/',origin).href);
    const canvas = page.locator('canvas');
    await page.waitForFunction(()=>Number(document.querySelector('canvas').dataset.frame)>5);
    assert.equal(await canvas.getAttribute('data-draw-calls'),'6');
    await page.locator('#action').selectOption('walk');
    const walk = await canvas.screenshot();
    const coverage = silhouettes(walk,6);
    await writeFile(join(output,`six-races-walk-${size.width}.png`),walk);
    const gpuBytes = Number(await canvas.getAttribute('data-gpu-bytes'));

    const frame = Number(await canvas.getAttribute('data-frame'));
    await page.waitForFunction(start=>Number(document.querySelector('canvas').dataset.frame)>start+7,frame);
    assert.notDeepEqual(await canvas.screenshot(),walk);
    await page.locator('#race').selectOption('glassborn');
    await page.locator('#biome').selectOption('snow');
    await page.locator('#style').selectOption('city');
    await page.locator('#variant').selectOption('2');
    await page.locator('#action').selectOption('idle');
    await page.waitForFunction(()=>document.querySelector('canvas').dataset.drawCalls==='1');
    const winter = await canvas.screenshot();
    silhouettes(winter,1);
    await writeFile(join(output,`glassborn-city-snow-${size.width}.png`),winter);
    assert.deepEqual(errors,[]);
    reports.push({viewport:size,races:6,drawCalls:6,gpuBytes,coverage,walkFramesDiffer:true});
    await page.close();
  }
  await writeFile(join(output,'report.json'),JSON.stringify(reports,null,2)+'\n');
  console.log(JSON.stringify(reports));
} finally {
  await browser.close();
}
