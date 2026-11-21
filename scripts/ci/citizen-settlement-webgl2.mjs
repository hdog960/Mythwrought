import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';

const origin=process.env.CITIZEN_PREVIEW_ORIGIN??'http://127.0.0.1:4197';
const output=process.env.CITIZEN_PREVIEW_OUTPUT??'artifacts/citizen-settlement';
const browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
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
  await button('assign');
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

  assert.deepEqual(errors,[]);
  await writeFile(join(output,'settlement-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
