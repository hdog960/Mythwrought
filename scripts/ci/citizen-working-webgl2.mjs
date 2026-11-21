import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';

const origin = process.env.CITIZEN_PREVIEW_ORIGIN ?? 'http://127.0.0.1:4197';
const waves = {
  agriculture: {group:'agriculture-food', count:720},
  craftsmanship: {group:'resources-craftsmanship', count:780},
};
const wave = process.argv[2] ?? 'agriculture';
assert(Object.hasOwn(waves,wave),'Unknown citizen appearance wave');
const {group,count} = waves[wave];
const output = process.env.CITIZEN_PREVIEW_OUTPUT ?? `artifacts/citizen-${wave}`;
const browser = await chromium.launch({args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage();
  await page.goto(new URL('/citizen-preview/',origin).href);
  const result = await page.evaluate(async group => {
    const {createCitizen} = await import('/src/citizens/entity.mjs');
    const {createCitizenRenderer} = await import('/src/citizens/renderer.mjs');
    const {BIOMES,PROFESSIONS,RACES} = await import('/src/citizens/registry.mjs');
    const view = document.createElement('canvas');
    view.width=144;
    view.height=176;
    const gl = view.getContext('webgl2',{alpha:false,antialias:false});
    if (!gl) throw Error('No genuine WebGL2 context');
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(.16,.24,.25,1);
    const renderer = createCitizenRenderer(gl,{maxCachedMeshes:12});
    const pixels = new Uint8Array(view.width*view.height*4);
    const races = Object.keys(RACES);
    const occupations = Object.values(PROFESSIONS).filter(row=>row.group===group);
    const contact = document.createElement('canvas');
    contact.width=6*view.width;
    contact.height=Math.ceil(occupations.length/6)*(view.height+30);
    const sheet = contact.getContext('2d');
    sheet.fillStyle='#172b2e';
    sheet.fillRect(0,0,contact.width,contact.height);
    sheet.font='13px sans-serif';
    sheet.textAlign='center';
    const records = [];
    const pitch=.10;
    let maxCacheBytes=0;

    function render(profession,race,biome,variant,style='village') {
      const citizen = createCitizen({worldSeed:179,settlementId:'worker-gallery',slot:0,
        race,biome,style,variant,profession:profession.id});
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const stats=renderer.draw([{citizen,position:[0,0,0],heading:.32,action:'work'}],{
        eye:[0,1+3.1*Math.sin(pitch),3.1*Math.cos(pitch)],
        forward:[0,-Math.sin(pitch),-Math.cos(pitch)],right:[1,0,0],
        up:[0,Math.cos(pitch),-Math.sin(pitch)],aspect:view.width/view.height,tanHalfFov:.42,time:.18,
      });
      gl.readPixels(0,0,view.width,view.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      if (gl.getError()!==gl.NO_ERROR) throw Error('GPU error rendering '+profession.id);
      maxCacheBytes=Math.max(maxCacheBytes,stats.gpuBytes);
      let visible=0;
      for (let i=0;i<pixels.length;i+=4) {
        if (pixels[i]!==pixels[0] || pixels[i+1]!==pixels[1] || pixels[i+2]!==pixels[2]) visible++;
      }
      return visible;
    }

    for (const [index,profession] of occupations.entries()) {
      for (const race of races) for (const biome of BIOMES) for (const variant of [1,2]) {
        const visible=render(profession,race,biome,variant);
        const hash=await crypto.subtle.digest('SHA-256',pixels);
        const digest=Array.from(new Uint8Array(hash),byte=>byte.toString(16).padStart(2,'0')).join('');
        records.push({profession:profession.id,race,biome,variant,visible,digest});
      }
      render(profession,races[index%6],BIOMES[index%5],index%2+1,['village','town','city'][index%3]);
      const x=index%6*view.width, y=Math.floor(index/6)*(view.height+30);
      sheet.drawImage(view,x,y);
      sheet.fillStyle='#f0e5cd';
      sheet.fillText(profession.name,x+view.width/2,y+view.height+18,view.width-6);
    }
    renderer.dispose();
    return {records,maxCacheBytes,sheet:contact.toDataURL('image/png').split(',')[1]};
  },group);
  assert.equal(result.records.length,count);
  assert.equal(new Set(result.records.map(record=>record.digest)).size,count);
  assert(result.records.every(record=>record.visible>1000));
  await mkdir(output,{recursive:true});
  await writeFile(join(output,`${wave}-contact-sheet.png`),Buffer.from(result.sheet,'base64'));
  await writeFile(join(output,`${wave}-render-manifest.json`),JSON.stringify({
    variants:result.records.length,maxCacheBytes:result.maxCacheBytes,records:result.records,
  },null,2)+'\n');
  console.log(`${count} distinct actual WebGL2 renders · ${result.maxCacheBytes} peak cached mesh bytes`);
} finally {
  await browser.close();
}
