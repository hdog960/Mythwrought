// Real Chromium screenshots of the original storybook material and sky pass.
// Synthetic mobile Chromium is not physical iPhone hardware or artwork approval.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({
  viewport:{width:932,height:430},deviceScaleFactor:2,hasTouch:true,isMobile:true
});
const page=await context.newPage();
const errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
const current=()=>page.evaluate(()=>{
 const canvas=document.querySelector('#scene'),
   left=document.querySelector('.left').getBoundingClientRect(),
   right=document.querySelector('.right').getBoundingClientRect(),
   world=canvas.getBoundingClientRect();
 return {preset:canvas.dataset.renderPreset,quality:canvas.dataset.storybookQuality,
   framebuffer:[canvas.width,canvas.height],world:[world.x,world.y,world.width,world.height],
   gaps:[world.left-left.right,right.left-world.right],
   loaded:Number(canvas.dataset.loadedChunks),
   noticeHidden:document.querySelector('#notice').hidden,
   schema1:localStorage.getItem('mythwrought-v002-world-179')};
});
const take=async path=>{
 const buffer=await page.locator('#scene').screenshot({path});
 const png=PNG.sync.read(buffer),colors=new Set();
 for(let y=1;y<=9;y++)for(let x=1;x<=15;x++){
   const px=Math.floor(png.width*x/16),py=Math.floor(png.height*y/10),i=(py*png.width+px)*4;
   colors.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
 }
 return {sha:createHash('sha256').update(buffer).digest('hex'),colors:colors.size,png};
};
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
   null,{timeout:30000});
 await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.storybookQuality==='painted-materials');
 const before=await current();
 assert.ok(before.noticeHidden,'Shader failed to initialize or WebGL was lost');
 assert.equal(before.preset,'balanced');
 assert.equal(before.loaded,25);
 assert.ok(before.gaps.every(n=>n>=-2),'Side grips overlap the central world');
 assert.ok(before.world[2]>=932*.45);
 await mkdir('artifacts',{recursive:true});
 const bright=await take('artifacts/mythwrought-v010-storybook-materials-landscape.png');
 assert.ok(bright.colors>=10,'Rendered material/sky scene visually uniform '+bright.colors);

 await page.locator('#menu').click();
 await page.locator('#renderPreset').selectOption('economy');
 await page.locator('#closeHelp').click();
 await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.storybookQuality==='base-colors');
 const economy=await current();
 const lite=await take('artifacts/mythwrought-v010-storybook-economy-landscape.png');
 assert.equal(economy.preset,'economy');
 assert.equal(economy.loaded,25);
 assert.ok(economy.framebuffer[0]<before.framebuffer[0]);
 assert.ok(economy.framebuffer[1]<before.framebuffer[1]);
 assert.deepEqual(economy.world,before.world,'Economy mode changed canvas CSS/world viewport');
 assert.deepEqual(economy.gaps,before.gaps,'Economy mode moved the grips');
 assert.ok(lite.colors>=6,'Economy scene became blank');
 assert.notEqual(lite.sha,bright.sha,'Economy mode did not change rendered GPU output');
 assert.equal(economy.schema1,before.schema1,'Visual preset changed canonical saved data');

 await page.locator('#menu').click();
 await page.locator('#renderPreset').selectOption('balanced');
 await page.locator('#closeHelp').click();
 await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.storybookQuality==='painted-materials');
 const restored=await current();
 assert.equal(restored.framebuffer[0],before.framebuffer[0]);
 assert.equal(restored.framebuffer[1],before.framebuffer[1]);
 assert.equal(restored.schema1,before.schema1);

 // Test physically compact landscape with the painted materials enabled.
 await page.setViewportSize({width:568,height:320});
 await page.waitForTimeout(200);
 const compact=await current();
 const app=await page.locator('.console').boundingBox();
 assert.ok(app.height<=321,'Artwork changed compact console height');
 assert.ok(compact.gaps.every(n=>n>=-2),'Materials encroached on compact thumb grips');
 assert.ok(compact.world[2]>=568*.45,'Compact center view collapsed');
 const smaller=await take('artifacts/mythwrought-v010-storybook-compact-landscape.png');
 assert.ok(smaller.colors>=5,'Compact landscape became visually uniform');

 // A visual pass must not change seeded terrain block mechanics or schema.
 const test=await page.evaluate(async()=>{
   const {VoxelWorld,meshChunk}=await import('./src/voxel.mjs');
   const {STORYBOOK_ART_RULES,STORYBOOK_MATERIAL_FRAGMENT_SHADER}=await import('./src/storybook-materials.mjs');
   const w=new VoxelWorld(179),before=JSON.stringify(w.save());
   const data=meshChunk(w,0,0);
   return {saveBefore:before,saveAfter:JSON.stringify(w.save()),
     vertices:data.length/9,drawCalls:STORYBOOK_ART_RULES.newDrawCalls,
     textures:STORYBOOK_ART_RULES.newTextures,
     compiledMaterial:STORYBOOK_MATERIAL_FRAGMENT_SHADER.includes('uArtQuality')};
 });
 assert.equal(test.saveBefore,test.saveAfter);
 assert.equal(test.drawCalls,0);
 assert.equal(test.textures,0);
 assert.ok(test.vertices>100);
 assert.ok(test.compiledMaterial);
 assert.deepEqual(errors,[],'Material fragment shader/runtime errors');
 assert.deepEqual(missing,[],'Missing resources');
 console.log('PASS Gate A storybook material + painterly sky: GL compile, authentic colorful screenshots, Economy shader fallback, intact canonical saves and compact external grips');
}finally{await browser.close();}
