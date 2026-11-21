// S6: genuine current-V6 five-region sky plus historical S6 archived source parity.
// DO NOT start a V2-V5 world; archived terrain and metadata stay read-only.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {FourRegionWorld,fourRegionProfile,FOUR_REGION_GENERATOR,
  M6_BALANCED_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {surfaceBiomeAt} from '../../src/surface-regions/regions.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {hasValidatedFourBiomeProfile,resolveS6Biome,
  S6_SKY_CONTRACT,S6_BIOME_SOURCE_HEAD} from '../../src/sky-biome-adapter.mjs';
import {hasValidatedV6SkyProfile,resolveV6SkyBiome,
  S6_V6_AUTHORITY} from '../../src/sky-v6-adapter.mjs';
const {PNG}=pngjs;
const sha=b=>createHash('sha256').update(b).digest('hex');
const HEAD=process.env.GITHUB_SHA||'UNVERIFIED';
const OUT='artifacts/sky-s6';
await mkdir(OUT,{recursive:true});
const historicSeed=179;
const legacy=new Pack2LiveWorld(new FourRegionWorld(historicSeed,
  fourRegionProfile(historicSeed,FOUR_REGION_GENERATOR)));
assert.equal(hasValidatedFourBiomeProfile(legacy),true,
  'Original S6 historical four-biome authoritative profile changed');
assert.equal(hasValidatedV6SkyProfile(legacy),false,
  'Historical V2-V5 S6 profile was silently reinterpreted as playable V6');
assert.equal(resolveV6SkyBiome(legacy,512,0),null,
  'Historical source illegally acquired new current-only sky generation');
assert.equal(S6_SKY_CONTRACT.count,4);
assert.equal(S6_SKY_CONTRACT.legacyBehavior,'identical-S5');
assert.equal(S6_V6_AUTHORITY.generator,M6_BALANCED_GENERATOR);
const historicalAnchors=[
  {name:'desert',x:512,z:0},{name:'snow',x:0,z:512},
  {name:'mountain',x:-512,z:0},{name:'enchanted',x:0,z:-512}
];
for(const a of historicalAnchors){
  const historical=surfaceBiomeAt(a.x,a.z,historicSeed);
  const accepted=resolveS6Biome(legacy,a.x,a.z,surfaceBiomeAt);
  assert.equal(historical?.name,a.name,'Original historical source biome changed');
  assert.equal(accepted?.name,a.name,'Historical S6 read-only source contract changed');
}
const originalSourceHashes={};
for(const path of ['src/sky-biome-adapter.mjs','src/surface-regions/regions.mjs']){
  originalSourceHashes[path]=sha(await readFile(path));
}
const manifest={stage:'S6_HISTORICAL_SOURCE_AND_CURRENT_V6_REAL_WEBGL2',
  sourceHead:HEAD,originalS6SourceHead:S6_BIOME_SOURCE_HEAD,
  originalSourceSha256:originalSourceHashes,legacyPlayable:false,
  realCurrentV6:true,hardwareIphoneCertified:false,
  originalGlobalSkyUnchanged:true,originalS6ArchivePreserved:true,
  viewports:[],images:[],errors:[]};
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const worlds=[
  {name:'plains',x:0,z:0},
  {name:'desert',x:512,z:0},
  {name:'snow',x:0,z:512},
  {name:'mountain',x:-512,z:0},
  {name:'enchanted',x:0,z:-512}
];
async function waitRendered(page,region){
  await page.waitForFunction(name=>{
    const c=document.querySelector('#scene'),d=c?.dataset;
    return !!d&&d.skyDrawn==='true'&&+d.loadedChunks===25&&
      +d.pendingChunks===0&&+d.renderedMeshVertices>800&&
      d.skyS6SourceStatus==='authoritative-v6-biome-source'&&
      d.skyS6WorldBiomeName===name&&
      d.skyS6WorldBiomeCount==='5'&&
      +d.skyMoonCount===3&&
      document.querySelector('#notice')?.hidden===true;
  },region.name,{timeout:90000});
  const start=await page.evaluate(()=>+document.querySelector('#scene').dataset.renderedFrames);
  await page.waitForFunction(n=>+document.querySelector('#scene').dataset.renderedFrames>=n+4,
    start,{timeout:30000});
}
async function state(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),d=c.dataset,gl=c.getContext('webgl2');
    const value=k=>{try{return JSON.parse(d[k]);}catch{return null;}};
    return {source:d.skyS6SourceStatus,worldBiome:d.skyS6WorldBiomeName,
      biome:d.skyS6BiomeName,biomeCount:+d.skyS6WorldBiomeCount,
      historicCount:+d.skyS6BiomeCount,strength:+d.skyS6BiomeStrength,
      profile:d.skyS6Profile,horizon:value('skyS6Horizon'),fog:value('skyFog'),
      moonCount:+d.skyMoonCount,moonPhases:value('skyMoonPhases'),
      event:+d.skyS5EventType,stars:+d.skyS4StarVisibility,
      daylight:+d.skyDaylight,phase:+d.skyClockPhaseMs,
      chunks:+d.loadedChunks,pending:+d.pendingChunks,
      vertices:+d.renderedMeshVertices,glError:gl.getError(),
      glNoError:gl.NO_ERROR,buffer:[c.width,c.height]};
  });
}
async function time(page,clock){
  await page.locator('#menu').click();
  await page.locator('#playerMenu .player-menu-times button')
    .nth(clock==='night'?1:0).click();
  await page.locator('.player-menu-close').click();
  await page.waitForFunction(time=>{
    const d=document.querySelector('#scene')?.dataset;
    if(!d)return false;
    const phase=+d.skyClockPhaseMs,light=+d.skyDaylight;
    return time==='night'?phase<18000&&light<.01:
      phase>=720000&&phase<738000&&light>.99;
  },clock,{timeout:30000});
}
async function snap(page,w,h,name,clock,canvas){
  const file=OUT+'/s6-v6-'+w+'x'+h+'-'+name+'-'+clock+'-'+(canvas?'canvas':'full')+'.png';
  const bytes=await (canvas?page.locator('#scene'):page).screenshot({
    path:file,animations:'disabled',timeout:90000});
  const png=PNG.sync.read(bytes);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  if(!canvas)assert.deepEqual([png.width,png.height],[w,h]);
  const hash=sha(bytes);
  manifest.images.push({file,sha256:hash,bytes:bytes.length,width:png.width,
    height:png.height,region:name,clock,canvas});
  return hash;
}
try{
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width:w,height:h},
      deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[],bad=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
    page.on('dialog',d=>d.accept());
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await page.locator('#playerMenu').waitFor({state:'visible',timeout:45000});
      assert.equal(await page.locator('#help').isVisible(),true,
        'Historical worlds must not bypass current-only admission');
      await page.getByRole('button',{name:/NEW WORLD/}).click();
      await page.locator('#help').waitFor({state:'hidden',timeout:45000});
      const seed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      assert.equal(await page.evaluate(()=>
        window.__mythwroughtTest.fourBiomeProfile()?.generator),
        M6_BALANCED_GENERATOR);
      assert.notEqual(seed,historicSeed,'An archived world became playable');
      const worldKey='mythwrought-v002-world-'+seed;
      const originalWorld=await page.evaluate(key=>localStorage.getItem(key),worldKey);
      assert.equal(JSON.parse(originalWorld)?.schema,1);
      const proof=[];
      for(const p of worlds){
        const source=v6BiomeAt(p.x,p.z,seed);
        assert.equal(source?.name??'plains',p.name,
          'Authoritative V6 source coordinate changed');
        await page.evaluate(({x,z})=>window.__mythwroughtTest.teleport(x,z),p);
        await waitRendered(page,p);
        for(const clock of ['night','day']){
          await time(page,clock);
          await waitRendered(page,p);
          const shown=await state(page);
          assert.equal(shown.source,'authoritative-v6-biome-source');
          assert.equal(shown.worldBiome,p.name);
          assert.equal(shown.biomeCount,5);
          assert.equal(shown.historicCount,4,
            'Original historical S6 read-only source contract changed');
          assert.equal(shown.moonCount,3);
          assert.equal(shown.glError,shown.glNoError);
          if(clock==='night')assert.ok(shown.stars>.90&&shown.daylight<.01);
          else assert.ok(shown.daylight>.99&&shown.stars===0);
          if(p.name==='plains'){
            assert.equal(shown.biome,'none');
            assert.equal(shown.strength,0);
            assert.equal(shown.profile,'none');
          }else{
            assert.equal(shown.biome,p.name);
            assert.equal(shown.profile,M6_BALANCED_GENERATOR);
            assert.ok(shown.strength>.50,'V6 accent too weak or not rendered');
          }
          const full=await snap(page,w,h,p.name,clock,false);
          const canvas=await snap(page,w,h,p.name,clock,true);
          proof.push({name:p.name,clock,sourceWeight:source?.weight??0,
            ...shown,full,canvas});
          const saved=await page.evaluate(key=>localStorage.getItem(key),worldKey);
          assert.equal(saved,originalWorld,
            'Sky accent/camera modified canonical current V6 schema-1 world bytes');
        }
      }
      const names=new Set(proof.map(p=>p.name));
      assert.equal(names.size,5);
      const night=proof.filter(p=>p.clock==='night');
      assert.equal(new Set(night.map(p=>p.canvas)).size,5,
        'Current V6 biome night skies must be physically distinct GPU PNGs');
      for(const accented of night.filter(p=>p.name!=='plains')){
        const neutral=night.find(p=>p.name==='plains');
        assert.ok(accented.horizon.some((x,i)=>Math.abs(x-neutral.horizon[i])>.004),
          'V6 biome horizon accent indistinguishable from neutral real GPU sky: '+
          accented.name);
      }
      assert.equal(proof.length,10);
      assert.deepEqual(errors,[],'Current V6 S6 browser JavaScript errors');
      assert.deepEqual(bad,[],'Current V6 S6 HTTP errors');
      manifest.viewports.push({w,h,seed,proof,archivedSeedNeverPlayed:true,
        canonicalWorldSha256:sha(Buffer.from(originalWorld))});
      console.log('SKY_S6_CURRENT_V6_REAL_WEBGL2_PASS',JSON.stringify({
        head:HEAD,w,h,sourceSeed:seed,biomes:proof.length,distinctNight:5,
        moons:3,originalArchivePreserved:true}));
    }finally{await context.close();}
  }
  assert.equal(manifest.images.length,60,'S6 original-game all five V6 biome day/night full+canvas PNG gate');
  assert.equal(new Set(manifest.images.map(i=>i.sha256)).size,60,
    'S6 genuine full and canvas WebGL2 screenshots repeat');
}catch(error){
  manifest.errors.push(String(error?.stack||error));
  console.error('SKY_S6_CURRENT_V6_REAL_WEBGL2_FAIL',String(error?.stack||error));
  process.exitCode=1;
}finally{
  await browser.close();
  await writeFile(OUT+'/s6-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
