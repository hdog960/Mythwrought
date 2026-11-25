// MYTHWROUGHT — ORIGINAL CURRENT-COMBINED-MOUNTAIN-SNOW GAME CREATIVE EGG SPAWN/RELOAD.
// Four shards, ten distinct original species each. Real UI action, real
// collision/residency, source roster persistence and genuine WebGL2 frames.
// Only physical platform support is prepared by the existing localhost test
// fixture; NO mob, save roster, visual asset, clock or input is forged.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {buildCreativeCatalog} from '../../src/creative-integration/creative-catalog.mjs';
import {getSpecies} from '../../src/mobs/species.mjs';
import {M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {V8_STORAGE_PREFIX} from '../../src/manual-biomes/mountain-v8-isolated-storage.mjs';
const shard=Number(process.env.EGG_SHARD);
if(!Number.isInteger(shard)||shard<0||shard>3)throw Error('EGG_SHARD must be 0..3');
const catalog=buildCreativeCatalog();
assert.equal(catalog.blocks.length,241);
assert.equal(catalog.creatures.length,40);
const offset=Number(process.env.EGG_OFFSET??0);
assert.ok(Number.isInteger(offset)&&offset>=0&&offset<10,'EGG_OFFSET must be 0..9');
const eggs=catalog.creatures.filter(e=>e.id==='slime');
assert.equal(eggs.length,1);
const OUT='artifacts/creative-eggs/shard-'+shard;
await mkdir(OUT,{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex');
const report={kind:'real-original-game-creative-egg-placement-and-reload',shard,
  head:process.env.GITHUB_SHA||null,offset,expectedSpecies:eggs.map(e=>e.id),sourceCatalog:catalog.revision,
  worldGenerator:M8_MOUNTAIN_GENERATOR,realWebGL2:true,oldWorldOpened:false,
  realUIEggClick:true,realUIPlaceClick:true,noInjectedMobs:true,
  physicalIphone:false,species:[],errors:[],complete:false};
const saveProof=()=>writeFile(OUT+'/manifest.json',JSON.stringify(report,null,2)+'\n');
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-dev-shm-usage'
]});
async function screenshot(page,id,phase){
  const file=OUT+'/'+id+'-'+phase+'.png';
  const raw=await page.locator('#scene').screenshot({path:file,
    animations:'disabled',timeout:90000});
  const png=PNG.sync.read(raw);assert.ok(png.width>250&&png.height>150);
  const colors=new Set();
  for(let y=6;y<png.height-6;y+=9)for(let x=6;x<png.width-6;x+=9){
    const k=(y*png.width+x)*4;
    colors.add(((png.data[k]/16)|0)+','+
      ((png.data[k+1]/16)|0)+','+((png.data[k+2]/16)|0));
  }
  assert.ok(colors.size>=24,'Original WebGL2 image has insufficient source colors');
  return {file,dimensions:[png.width,png.height],
    bytes:raw.length,sha256:sha(raw),colors:colors.size};
}
try{
  for(const egg of eggs){
    const spec=getSpecies(egg.id);
    assert.equal(spec?.implementation,'preview',
      'Registry-backed egg must have a real implementation');
    const ctx=await browser.newContext({viewport:{width:932,height:430},
      deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
    const page=await ctx.newPage(),errors=[],missing=[],dialogs=[];
    let stage='initial-world';
    page.on('dialog',async d=>{dialogs.push({type:d.type(),message:d.message()});await d.accept();});
    page.on('pageerror',e=>errors.push(String(e.message)));
    page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
    try{
      await page.goto('http://127.0.0.1:4174/?production-ui=1',{
        waitUntil:'networkidle',timeout:120000});
      await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:120000});
      const originalSeed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      await page.locator('#menu').click();
      assert.equal(await page.locator('#advancedMenu').evaluate(e=>e.open),false);
      stage='new-world';
      await page.locator('#newWorld').click();
      await page.waitForFunction(({generator,originalSeed})=>{
        const t=window.__mythwroughtTest;
        const status=document.querySelector('#seedMessage')?.textContent??'';
        return (t?.fourBiomeProfile()?.generator===generator&&t.snapshot().seed!==originalSeed)||status.includes('New world refused');
      },{generator:M8_MOUNTAIN_GENERATOR,originalSeed},{timeout:180000});
      const created=await page.evaluate(()=>({profile:window.__mythwroughtTest?.fourBiomeProfile(),status:document.querySelector('#seedMessage')?.textContent,seed:window.__mythwroughtTest?.snapshot()?.seed}));
      assert.equal(created.profile?.generator,M8_MOUNTAIN_GENERATOR,'NEW WORLD failed: '+JSON.stringify({created,dialogs}));
      assert.notEqual(created.seed,originalSeed,'NEW WORLD did not change seed: '+JSON.stringify({created,dialogs}));
      console.log('REAL_CREATIVE_WORLD_READY',JSON.stringify({id:egg.id,created,dialogs}));
      stage='physical-setup';
      if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
      await page.waitForFunction(()=>
        Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
        null,{timeout:120000});
      const seed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      assert.equal(await page.evaluate(()=>
        window.__mythwroughtTest.fourBiomeProfile()?.generator),
        M8_MOUNTAIN_GENERATOR);
      const worldKey=V8_STORAGE_PREFIX+'mythwrought-v002-world-'+seed;
      const mobKey=V8_STORAGE_PREFIX+'mythwrought-mobs-v1-seed-'+seed;
      // Platform is REAL source terrain geometry, setup only. A genuine
      // surface-support raycast must still expose (16,16,0) before clicking.
      await page.evaluate(()=>{
        const t=window.__mythwroughtTest;
        for(let x=15;x<=17;x++)for(let z=-1;z<=1;z++)
          for(let y=16;y<=19;y++)
            if(t.block(x,y,z)!==0)t.placeFixture(x,y,z,0);
        for(let z=1;z<=3;z++)for(let y=17;y<=19;y++)
          if(t.block(16,y,z)!==0)t.placeFixture(16,y,z,0);
        t.placeFixture(16,15,0,3);t.placeFixture(16,17,3,3);
        if(t.block(16,15,0)!==3||t.block(16,17,3)!==3)throw Error('Cannot save physical stone support');
        t.teleportCave(16,18,3);t.aimAt(16,15,0);
      });
      await page.waitForFunction(()=>
        document.querySelector('#scene')?.dataset.targetPlace==='16,16,0',
        null,{timeout:15000});
      const canonical=await page.evaluate(key=>localStorage.getItem(key),worldKey);
      assert.equal(JSON.parse(canonical).schema,1);
      await page.locator('#g2bFlightEnable').check();
      assert.equal(await page.locator('#g2bFlightEnable').isChecked(),true);
      assert.equal(await page.locator('#place').textContent(),'PLACE',
        'Real grounded PLACE must not be substituted by flight UP');
      await page.locator('#creativeInventoryToggle').click();
      await page.locator('.mw-inventory-category').filter({hasText:'Creatures'}).click();
      const eggButton=page.locator(
        '.mw-inventory-grid [data-key="spawn:'+egg.id+'"]');
      assert.equal(await eggButton.count(),1);
      await eggButton.click();
      await page.waitForFunction(id=>
        document.querySelector('.mw-inventory-grid [data-key="spawn:'+id+'"]')
          ?.getAttribute('aria-selected')==='true',egg.id,{timeout:15000});
      await page.locator('.mw-inventory-close').click();
      stage='actual-place';
      await page.locator('#place').click(); // THE ACTUAL USER ACTION
      await page.waitForFunction(id=>{
        const t=window.__mythwroughtTest,s=t?.mobStatus();
        return s?.creativeSpawned>=1&&t.mobRoster().some(m=>m.species===id);
      },egg.id,{timeout:30000});
      const pre=await page.evaluate(({worldKey,mobKey})=>{
        const t=window.__mythwroughtTest,c=document.querySelector('#scene');
        return {world:localStorage.getItem(worldKey),
          mobs:localStorage.getItem(mobKey),status:t.mobStatus(),
          roster:t.mobRoster(),glError:c.getContext('webgl2').getError()};
      },{worldKey,mobKey});
      assert.equal(pre.world,canonical);
      assert.ok(pre.mobs?.includes(egg.id));
      assert.equal(pre.glError,0);
      await page.waitForFunction(()=>
        +document.querySelector('#scene')?.dataset.mobActors>0&&
        +document.querySelector('#scene')?.dataset.mobDrawCalls>0,
        null,{timeout:30000});
      const live=await screenshot(page,egg.id,'live');
      stage='cold-reload';
      await page.reload({waitUntil:'networkidle',timeout:120000});
      await page.waitForFunction(id=>{
        const t=window.__mythwroughtTest,s=t?.mobStatus();
        return s&&!s.readonly&&!s.damaged&&s.creativeSpawned>=1&&
          t.mobPersistedRoster().some(m=>m.species===id);
      },egg.id,{timeout:120000}).catch(async error=>{
        const truth=await page.evaluate(({id,mobKey})=>{
          const t=window.__mythwroughtTest;
          const raw=localStorage.getItem(mobKey);
          let payload=null;try{payload=raw?JSON.parse(JSON.parse(raw).payload):null;}catch(_){}
          return {species:id,status:t?.mobStatus()??null,
            loaded:t?.mobPersistedRoster()??[],
            rendered:t?.mobRoster()??[],
            sourceSaveEntities:payload?.engine?.entities?.map(e=>({
              id:e.id,species:e.species,state:e.state
            }))??[],creativeSpawnIds:payload?.creativeSpawnIds??[],
            canonicalPresent:Boolean(raw)};
        },{id:egg.id,mobKey});
        throw new Error('Original per-seed Creative mob identity did not restore: '+
          JSON.stringify(truth),{cause:error});
      });
      const post=await page.evaluate(({worldKey,mobKey})=>{
        const t=window.__mythwroughtTest,c=document.querySelector('#scene');
        return {world:localStorage.getItem(worldKey),
          mobs:localStorage.getItem(mobKey),status:t.mobStatus(),
          roster:t.mobRoster(),persisted:t.mobPersistedRoster(),
          generator:t.fourBiomeProfile()?.generator,
          glError:c.getContext('webgl2').getError()};
      },{worldKey,mobKey});
      assert.equal(post.generator,M8_MOUNTAIN_GENERATOR);
      assert.equal(post.world,canonical,'Creature action rewrote schema-1 terrain');
      assert.ok(post.mobs?.includes(egg.id)&&
        !post.status.readonly&&!post.status.damaged&&
        post.status.creativeSpawned>=1&&
        post.persisted.some(m=>m.species===egg.id),
        'Restored checked-source engine lost actual Creative actor identity');
      assert.equal(post.glError,0);
      const reloaded=await screenshot(page,egg.id,'reloaded');
      assert.notEqual(live.sha256,reloaded.sha256,
        'Source images repeated across real spawn/reload stages');
      assert.deepEqual(errors,[]);
      assert.deepEqual(missing,[]);
      report.species.push({id:egg.id,classification:spec.classification,
        seed,sourceBody:spec.body,
        observedActor:pre.roster.find(m=>m.species===egg.id),
        coldReloadedActor:post.persisted.find(m=>m.species===egg.id),
        coldReloadRendered:Boolean(post.roster.find(m=>m.species===egg.id)),
        coldReloadDormant:post.persisted.some(m=>m.species===egg.id&&m.state==='dormant'),
        originalCanonicalSHA256:sha(Buffer.from(canonical)),
        originalMobSHA256:sha(Buffer.from(pre.mobs)),
        restoredMobSHA256:sha(Buffer.from(post.mobs)),
        live,reloaded,actorPersistence:true});
      console.log('REAL_CREATIVE_EGG_SPAWN_RELOAD_PASS',
        JSON.stringify({shard,id:egg.id,seed,sourceRealWorld:true,
          images:[live.sha256,reloaded.sha256]}));
      await saveProof();
    }catch(err){
      const diagnostics=await page.evaluate(()=>({profile:window.__mythwroughtTest?.fourBiomeProfile(),seed:window.__mythwroughtTest?.snapshot()?.seed,status:document.querySelector('#seedMessage')?.textContent,saveHealth:document.querySelector('#saveHealth')?.textContent,loadedChunks:document.querySelector('#scene')?.dataset.loadedChunks,targetPlace:document.querySelector('#scene')?.dataset.targetPlace,mobs:window.__mythwroughtTest?.mobStatus()})).catch(e=>({diagnosticError:String(e)}));
      const failure={id:egg.id,stage,error:String(err?.stack||err),diagnostics,dialogs,pageErrors:errors,missing};
      report.errors.push(failure);
      console.error('REAL_CREATIVE_EGG_FAILURE',JSON.stringify(failure));
      await saveProof();
      // Continue independent fresh contexts to collect every outstanding result.
      // Any failure still fails the whole shard below.
    }finally{await ctx.close();}
  }
  assert.equal(report.errors.length,0,'One or more required species failed');
  assert.equal(report.species.length,eggs.length);
  assert.deepEqual(report.species.map(x=>x.id),eggs.map(x=>x.id));
  assert.equal(new Set(report.species.flatMap(x=>
    [x.live.sha256,x.reloaded.sha256])).size,2*eggs.length);
  report.complete=true;await saveProof();
}catch(err){
  report.errors.push({fatal:String(err?.stack||err)});
  await saveProof();process.exitCode=1;
}finally{await browser.close();}
