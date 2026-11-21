import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';

const origin=process.env.CITIZEN_PREVIEW_ORIGIN??'http://127.0.0.1:4197';
const output=process.env.CITIZEN_PREVIEW_OUTPUT??'artifacts/citizen-settlement';
const browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const mobile={viewport:{width:932,height:430},isMobile:true,hasTouch:true};

async function exerciseMixedPopulation(errors) {
  const context=await browser.newContext(mobile);
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  const url=new URL('/citizen-preview/settlement.html',origin).href;
  await page.goto(url);
  await page.locator('#style').selectOption('city');
  await page.locator('#view').selectOption('overview');
  await page.locator('#biome').selectOption('enchanted-forest');
  await page.locator('#count').selectOption('8');
  const groups=[
    ['human','farmer'],['elf',''],['dwarf','blacksmith'],
    ['thornkin',''],['asteri','guard'],['glassborn',''],
  ];
  for(const [index,[race,profession]] of groups.entries()) {
    await page.locator('#profession').selectOption(profession);
    await page.locator('#race').selectOption(race);
    await page.locator('#variant').selectOption('1');
    await page.locator('#spawn').tap();
    assert.match(await page.locator('#message').textContent(),/Spawned 8 citizens/,race);
    await page.waitForFunction(total=>Number(document.querySelector('#scene').dataset.citizens)===total,(index+1)*8);
  }
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#scene').dataset.profile??'{}').samples>=120);
  const performance=await page.locator('#scene').evaluate(canvas=>({
    ...JSON.parse(canvas.dataset.profile),visible:Number(canvas.dataset.visible),
    draws:Number(canvas.dataset.draws),gpuBytes:Number(canvas.dataset.cachedBytes),
  }));
  assert.equal(performance.visible,48);
  assert(performance.draws>=7&&performance.draws<25);
  await page.locator('#scene').screenshot({path:join(output,'city-48-mixed-citizens.png')});
  await page.locator('#save').tap();
  assert.match(await page.locator('#message').textContent(),/sidecar saved/);
  const stored=await context.storageState();
  const slot=stored.origins.flatMap(origin=>origin.localStorage)
    .find(entry=>entry.name==='mythwrought-citizens-v1:179:citizen-fixture-city-enchanted-forest');
  const rows=JSON.parse(JSON.parse(slot.value).raw).citizens;
  assert.deepEqual(rows.map(({citizen})=>[citizen.race,citizen.profession??'']),
    groups.flatMap(pair=>Array.from({length:8},()=>pair)));
  await context.close();
  const fresh=await browser.newContext({...mobile,storageState:stored});
  const restored=await fresh.newPage();
  restored.on('pageerror',error=>errors.push(error.message));
  await restored.goto(url);
  await restored.locator('#style').selectOption('city');
  await restored.locator('#biome').selectOption('enchanted-forest');
  await restored.locator('#reload').tap();
  assert.match(await restored.locator('#message').textContent(),/Loaded 48 saved citizens/);
  const ids=await restored.locator('#citizen option').evaluateAll(options=>options.map(option=>option.value));
  assert.deepEqual(ids,rows.map(({citizen})=>citizen.id));
  await fresh.close();
  return {viewport:mobile.viewport,races:6,working:24,ordinary:24,coldBrowserContext:true,restored:ids.length,performance};
}

const report={qualification:'Chromium software WebGL2 fixture; no physical iPhone measurements',tiers:[]};
await mkdir(output,{recursive:true});
try {
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(new URL('/citizen-preview/settlement.html',origin).href);
  const scene=page.locator('#scene');
  const button=id=>page.locator('#'+id).tap();
  const choose=(id,value)=>page.locator('#'+id).selectOption(String(value));
  const wait=(condition,value)=>page.waitForFunction(condition,value,{timeout:25000});
  const data=()=>scene.evaluate(canvas=>({...canvas.dataset}));
  await wait(()=>Number(document.querySelector('#scene').dataset.frame)>5);
  await page.evaluate(()=>localStorage.setItem('mythwrought-v002-world-179','{"schema":1,"seed":179,"edits":[]}'));
  await button('spawn');
  await wait(()=>document.querySelector('#scene').dataset.citizens==='1');
  const originalWorkplace=await page.locator('#workplace').inputValue();
  const alternateWorkplace=originalWorkplace+'-1';
  await choose('workplace',alternateWorkplace);
  await button('assign');
  assert.equal(await page.locator('#workplace').inputValue(),alternateWorkplace);
  assert.match(await page.locator('#message').textContent(),/Assigned Blacksmith/);
  await button('talk');
  assert.match(await page.locator('#citizenDetails').textContent(),/Blacksmith.*Test village/);
  const initialId=await page.locator('#citizen').inputValue();
  await wait(()=>Number(document.querySelector('#scene').dataset.professions)>0);
  await button('save');
  assert.match(await page.locator('#message').textContent(),/sidecar saved/);
  await button('clear');
  await wait(()=>document.querySelector('#scene').dataset.citizens==='0');
  await button('reload');
  await wait(()=>document.querySelector('#scene').dataset.citizens==='1');
  assert.equal(await page.locator('#citizen').inputValue(),initialId);
  assert.equal(await page.locator('#workplace').inputValue(),alternateWorkplace);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),
    '{"schema":1,"seed":179,"edits":[]}');
  await context.setOffline(true);
  await button('talk');
  assert.match(await page.locator('#citizenDetails').textContent(),/Blacksmith/);
  await context.setOffline(false);
  await scene.screenshot({path:join(output,'village-blacksmith.png')});

  await button('clear');
  await choose('profession','');
  await button('spawn');
  await button('spawnHostile');
  await wait(()=>Number(document.querySelector('#scene').dataset.fleeing)>0);
  await scene.screenshot({path:join(output,'ordinary-citizen-fleeing.png')});
  await button('clear');
  await choose('profession','guard');
  await button('spawn');
  await button('spawnHostile');
  await wait(()=>Number(document.querySelector('#scene').dataset.defending)>0);
  const enemyBefore=Number((await data()).mobHealth);
  assert(enemyBefore>0);
  await wait(health=>{
    const {mobHealth}=document.querySelector('#scene').dataset;
    return !mobHealth || Number(mobHealth)<health;
  },enemyBefore);
  await scene.screenshot({path:join(output,'guard-and-hostile.png')});
  report.functional={workplace:true,interaction:true,offlineInteraction:true,previousSchema1:true,
    savedIdentity:true,ordinaryFled:true,guardDamagedRealMob:true};
  await choose('style','city');
  await choose('view','overview');
  await choose('biome','desert');
  await choose('profession','');
  for(const count of [0,1,8,24,48]) {
    await button('clear');
    if (count) {
      await choose('count',count);
      await button('spawn');
    }
    await wait(n=>Number(document.querySelector('#scene').dataset.citizens)===n,count);
    await wait(()=>{
      const profile=document.querySelector('#scene').dataset.profile;
      return profile&&JSON.parse(profile).samples>=100;
    });
    const result=await data();
    assert.equal(Number(result.visible),count);
    assert(Number(result.draws)<count+2);
    const metrics=JSON.parse(result.profile);
    report.tiers.push({citizens:count,draws:Number(result.draws),gpuBytes:Number(result.cachedBytes),
      terrainBytes:Number(result.terrainBytes),vertices:Number(result.vertices),...metrics});
    if (count===48) await scene.screenshot({path:join(output,'city-48-citizens.png')});
  }

  await button('residency');
  await wait(()=>document.querySelector('#scene').dataset.visible==='0');
  assert.equal((await data()).citizens,'48');
  await button('residency');
  await wait(()=>document.querySelector('#scene').dataset.visible==='48');
  report.functional.unloadReload=true;
  report.fixtureConfigurations=0;
  await choose('count',1);
  for (const style of ['village','town','city']) {
    await choose('style',style);
    for (const biome of ['temperate','desert','snow','enchanted-forest','mountain']) {
      await choose('biome',biome);
      await button('clear');
      await button('spawn');
      await wait(()=>document.querySelector('#scene').dataset.citizens==='1');
      report.fixtureConfigurations++;
    }
  }

  await context.close();
  report.mixedPopulation=await exerciseMixedPopulation(errors);
  assert.deepEqual(errors,[]);
  await writeFile(join(output,'settlement-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
