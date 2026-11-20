// Separate actual-player mining acceptance: no teleport between actions.
// Localhost fixtures ONLY prepare an underground cavity. The player then
// mines successive floor blocks using the production MINE button and falls
// under the original stepPlayer physics, rendering with real WebGL2.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
    '--enable-unsafe-swiftshader']});
const result={viewport:'956x440',actions:[],realInput:true,naturalDescent:true};
try{
  await mkdir('artifacts',{recursive:true});
  const context=await browser.newContext({viewport:{width:956,height:440},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest &&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
      null,{timeout:120000});
    const prepared=await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      // 3x3x3 seed-authentic chamber; no mining is mocked during acceptance.
      for(let x=5;x<=7;x++)for(let z=5;z<=7;z++)
        for(let y=-78;y<=-76;y++){
          const r=t.placeFixture(x,y,z,0);
          if(!r?.saved)throw Error('Chamber preparation was not saved');
        }
      return t.teleportCave(6,-78,6);
    });
    result.startFeet=prepared.feet;
    await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===27,
      null,{timeout:120000});
    for(let y=-79;y>=-90;y--){
      const target='6,'+y+',6';
      await page.evaluate(y=>window.__mythwroughtTest.aimAt(6,y,6),y);
      await page.waitForFunction(key=>
        document.querySelector('#scene')?.dataset.targetBlock===key,
        target,{timeout:30000});
      const before=Number(await page.locator('#scene').getAttribute('data-player-feet'));
      await page.locator('#dig').click();
      const cell=await page.evaluate(y=>window.__mythwroughtTest.block(6,y,6),y);
      assert.equal(cell,0,'Real MINE control failed to excavate '+target);
      await page.waitForFunction(limit=>
        Number(document.querySelector('#scene')?.dataset.playerFeet)<limit,
        y+.3,{timeout:15000});
      const after=Number(await page.locator('#scene').getAttribute('data-player-feet'));
      assert.ok(after<before-.1,'No real gravity descent after mining '+target);
      const resident=Number(await page.locator('#scene').getAttribute('data-loaded-chunks'));
      assert.ok(resident<=27,'Underground resident GPU budget exceeded');
      result.actions.push({target,before,after,resident,actualMineClick:true});
    }
    result.finalFeet=result.actions.at(-1).after;
    assert.equal(result.actions.length,12);
    assert.ok(result.finalFeet<-88,'Player did not naturally descend 12 block levels');
    const save=await page.evaluate(()=>JSON.parse(
      localStorage.getItem('mythwrought-v002-world-179')||'{}'));
    assert.equal(save.schema,1,'Original schema-1 world save not persisted');
    assert.ok(save.edits.some(e=>e[0]===6&&e[1]===-90&&e[2]===6&&e[3]===0),
      'Last actual player MINE edit missing in saved world');
    await page.screenshot({path:'artifacts/rapid-dig-real-player-956x440.png',fullPage:true});
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(6,-90,6)),0,
      'Last real MINE edit disappeared after browser reload');
    assert.deepEqual(errors,[],'Actual-player WebGL2 runtime errors');
    result.saveReloadVerified=true;
    await writeFile('artifacts/rapid-dig-real-player-metrics.json',JSON.stringify(result,null,2)+'\n');
    console.log('PASS ACTUAL PLAYER INPUT + PHYSICAL DESCENT',JSON.stringify(result));
  }finally{await context.close();}
}finally{await browser.close();}
