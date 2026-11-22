// Minimal genuine original-game Desert P3 T-junction WebGL2 visual comparison.
// Run the SAME script against the accepted parent and exact gameplay child.
// The browser opens the actual game, not an isolated render/mock.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';
import {chunkCoord} from '../src/voxel.mjs';

const phase=process.env.DESERT_JUNCTION_PHASE;
assert.ok(['before','after'].includes(phase),'Set DESERT_JUNCTION_PHASE=before or after');
const origin=process.env.MYTHWROUGHT_TEST_ORIGIN??'http://127.0.0.1:4173/';
const output=process.env.DESERT_JUNCTION_OUTPUT??'artifacts/desert-triple-junction';
const sites=[
  {seed:179,x:-786,z:-1774,other:'enchanted'},
  {seed:2026,x:-2848,z:-774,other:'snow'}
];
const offsets=[[14,0],[-14,0],[0,14],[0,-14]];
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
await mkdir(output,{recursive:true});
const report={phase,sites:[],browserErrors:[]};
try{
  const context=await browser.newContext({viewport:{width:932,height:430},
    deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.browserErrors.push(e.message));
  page.on('dialog',d=>d.accept());
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:90000});
  const wait=(fn,arg)=>page.waitForFunction(fn,arg,{timeout:90000});
  await wait(()=>Boolean(window.__mythwroughtTest?.snapshot));
  async function switchSeed(seed){
    if((await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed))===seed)return;
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill(String(seed));
    await page.locator('#switchWorld').click();
    await wait(s=>window.__mythwroughtTest.snapshot().seed===s,seed);
    await page.locator('#closeHelp').click();
  }
  for(const site of sites){
    const {seed,x,z}=site;
    const source=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,'desert');
    assert.ok(biome.weight<=.5);
    const neighbors=offsets.map(([dx,dz])=>v6BiomeAt(x+dx,z+dz,seed)?.name??'plains');
    assert.ok(neighbors.includes('mountain')&&neighbors.includes(site.other));
    assert.equal(neighbors.find(n=>n!=='desert'&&n!=='plains'),site.other,
      'Mountain must follow the other special biome in genuine original order');
    const plan=source._columnPlan(x,z);
    assert.ok(plan.size,'Protected cave/landmark veto makes this unsuitable');
    const top=Math.max(...plan.keys()),cap=plan.get(top);
    assert.equal(cap,phase==='before'?258:G.scree,
      'Physical original source terrain must match requested before/after phase');
    assert.deepEqual(source.save().edits,[]);
    await switchSeed(seed);
    // Fix the in-game sun to the same readable phase in each worktree.
    await page.locator('#menu').click();
    await page.locator('#skySetDay').click();
    await page.locator('#closeHelp').click();
    const data=await page.evaluate(({x,z,top})=>{
      const api=window.__mythwroughtTest;
      const pose=api.teleport(x,z);
      api.aimAt(x+4,top,z+4);
      return {pose,gameBlock:api.block(x,top,z),
        gameSeed:api.snapshot().seed,
        generator:api.fourBiomeProfile()?.generator??null};
    },{x,z,top});
    assert.equal(data.gameSeed,seed);
    assert.equal(data.generator,M7_ENVIRONMENT_GENERATOR);
    assert.equal(data.gameBlock,cap,'Actual original game reader must match source plan');
    // A distant teleport can leave the previous 25 chunks resident for one
    // frame: require the NEW target center, not just a populated chunk count.
    const targetCenter=chunkCoord(data.pose.x)+','+chunkCoord(data.pose.z);
    await wait(expected=>{
      const d=document.querySelector('#scene')?.dataset;
      return d&&String(d.chunkCenter).split('|')[0]===expected&&
        Number(d.loadedChunks)>=25&&Number(d.pendingChunks)===0&&
        d.skyDrawn==='true'&&Number(d.renderedFrames)>10;
    },targetCenter);
    await page.waitForTimeout(200);
    const gl=await page.evaluate(()=>!!document.querySelector('#scene')?.getContext('webgl2'));
    assert.ok(gl,'Actual WebGL2 context required');
    const file=`${output}/${phase}-seed${seed}-desert-mountain-${site.other}-932x430.png`;
    const bytes=await page.screenshot({path:file,timeout:90000});
    const png=PNG.sync.read(bytes),colors=new Set();
    const rect=await page.locator('#scene').boundingBox();
    assert.ok(rect,'Scene canvas disappeared');
    for(let yy=2;yy<7;yy++)for(let xx=2;xx<9;xx++){
      const px=Math.floor(rect.x+rect.width*xx/10),py=Math.floor(rect.y+rect.height*yy/9);
      const i=4*(py*png.width+px);
      colors.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
    }
    assert.ok(colors.size>=4,'Actual rendered frame appears blank');
    const canvasState=await page.evaluate(()=>{
      const d=document.querySelector('#scene').dataset;
      return {chunkCenter:d.chunkCenter,loadedChunks:Number(d.loadedChunks),
        pendingChunks:Number(d.pendingChunks),daylight:Number(d.skyDaylight),
        renderedFrames:Number(d.renderedFrames)};
    });
    assert.equal(canvasState.chunkCenter.split('|')[0],targetCenter);
    assert.ok(canvasState.daylight>=.45,'Daylight must remain readable for comparison');
    report.sites.push({...site,neighbors,top,cap,data,canvasState,colorGroups:colors.size,file});
  }
  assert.deepEqual(report.browserErrors,[],'Original game emitted browser exceptions');
  console.log('DESERT_JUNCTION_VISUAL '+JSON.stringify(report));
}finally{
  await browser.close();
  await writeFile(output+'/'+phase+'-manifest.json',JSON.stringify(report,null,2)+'\n');
}
