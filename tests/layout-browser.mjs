// MYTHWROUGHT v0.05 mobile layout acceptance: real Chromium pixels and DOM bounds.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const sizes=[[568,320],[667,375],[844,390],[932,430],[1180,520]];
const inspect=async()=>page.evaluate(()=>{
  const bounds=sel=>document.querySelector(sel).getBoundingClientRect();
  const left=bounds('.grip.left'),right=bounds('.grip.right'),world=bounds('#scene');
  const app=bounds('.console');
  const parts=['#menu','#movePad','#jump','#dig','#place','#lookPad','#precision','[data-block="3"]','[data-block="4"]','[data-block="5"]'];
  return {left:{x:left.x,y:left.y,right:left.right,bottom:left.bottom},right:{x:right.x,y:right.y,right:right.right,bottom:right.bottom},
    world:{x:world.x,y:world.y,right:world.right,bottom:world.bottom,width:world.width,height:world.height},
    app:{x:app.x,y:app.y,right:app.right,bottom:app.bottom,width:app.width,height:app.height},
    windowHeight:window.innerHeight,visualHeight:window.visualViewport?.height,bodyScrollHeight:document.body.scrollHeight,
    loaded:document.querySelector('#scene').dataset.loadedChunks,
    gripWidth:Number(document.querySelector('#scene').dataset.gripWidth),
    rotate:getComputedStyle(document.querySelector('#rotate')).display,
    parts:parts.map(sel=>{const b=bounds(sel);return {sel,x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};})
  };
});
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=20,{timeout:20000});
  // The old archaic rune codepoints became empty tofu squares with several
  // mobile/system fonts. CSS-drawn diamonds must remain visible without fonts.
  const identity=await page.evaluate(()=>({
    titles:[...document.querySelectorAll('.grip .emblem')].map(e=>e.textContent.trim()),
    marks:[...document.querySelectorAll('.grip .emblem-mark')].map(e=>({
      width:e.getBoundingClientRect().width,
      border:getComputedStyle(e).borderTopStyle,
      hidden:e.getAttribute('aria-hidden')
    })),
    ornaments:[...document.querySelectorAll('.grip .ornament')].map(e=>e.textContent)
  }));
  assert.deepEqual(identity.titles,['MOVE','ACTION']);
  assert.equal(identity.marks.length,2);
  assert.ok(identity.marks.every(m=>m.width>=3&&m.border==='solid'&&m.hidden==='true'));
  assert.ok(identity.ornaments.every(s=>!/[ᚠ-ᛪ]/u.test(s)),'Unsupported runes leaked into controller header');
  await mkdir('artifacts',{recursive:true});
  for(const [width,height] of sizes){
    await page.setViewportSize({width,height});
    await page.waitForTimeout(160);
    const d=await inspect();
    assert.equal(d.rotate,'none',`Unexpected landscape rotate overlay at ${width}x${height}`);
    assert.ok(d.app.bottom<=height+1,`Console extends below physical screen at ${width}x${height}: ${JSON.stringify(d)}`);
    assert.ok(d.app.height<=height+1,`Console height exceeds mobile viewport at ${width}x${height}`);
    assert.ok(d.world.width>=245,`World collapsed at ${width}x${height}`);
    assert.ok(d.world.width>=width*.45,`World too narrow at ${width}x${height}`);
    assert.ok(d.left.right<=d.world.x+3&&d.right.x>=d.world.right-3,`Controls overlap gameplay at ${width}x${height}`);
    assert.ok(Math.abs(d.left.right-d.world.x)<6&&Math.abs(d.right.x-d.world.right)<6,'Broken grip/world boundaries');
    assert.ok(d.left.x>=-1&&d.right.right<=d.app.right+1,'Grip extends beyond device');
    assert.ok(d.left.bottom<=height+1&&d.right.bottom<=height+1,`Grips clipped below screen at ${width}x${height}: ${JSON.stringify(d)}`);
    const footer=await page.locator('.bezel.foot').boundingBox();
    assert.ok(footer.y+footer.height<=height+1,`Footer clipped off-screen at ${width}x${height}`);
    for(const b of d.parts){
      const parent=['#menu','#movePad','#jump'].includes(b.sel)?d.left:d.right;
      assert.ok(b.x>=parent.x-3&&b.right<=parent.right+3,`${b.sel} escapes horizontal grip at ${width}x${height}`);
      assert.ok(b.y>=parent.y-3&&b.bottom<=parent.bottom+3,`${b.sel} escapes vertical grip at ${width}x${height}`);
      assert.ok(b.width>=28&&b.height>=28,`${b.sel} touch target too small at ${width}x${height}`);
    }
    if(width===568){
      // Reproduce the actual merged-main race: under slow GPU work the JS
      // resize handler may still hold the old 430px console/grip dimensions.
      // CSS must hard-cap both axes *before* another JS resize event arrives.
      await page.evaluate(()=>{
        const el=document.querySelector('.console');
        el.style.setProperty('--console-height','430px');
        el.style.setProperty('--grip-width','168px');
      });
      const stale=await inspect();
      assert.ok(stale.app.bottom<=height+1,'Stale JS height clipped compact landscape controls');
      assert.ok(stale.world.width>=245&&stale.world.width>=width*.45,
        'Stale JS grip width covered too much of compact world');
      assert.ok(stale.left.bottom<=height+1&&stale.right.bottom<=height+1,
        'Compact grips clipped when stale JS resize values persisted');
      await page.evaluate(()=>window.dispatchEvent(new Event('resize')));
      await page.screenshot({path:'artifacts/mythwrought-v005-small-landscape.png'});
    }
    if(width===932)await page.screenshot({path:'artifacts/mythwrought-v005-regular-landscape.png'});
  }
  // Enlarged controllers must persist and not cover world on subsequent reloads.
  await page.setViewportSize({width:932,height:430});
  const before=await inspect();
  await page.locator('#menu').click();
  await page.locator('#controlSize').selectOption('large');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v005-control-size')),'large');
  await page.locator('#closeHelp').click();
  await page.waitForTimeout(120);
  const expanded=await inspect();
  assert.ok(expanded.gripWidth>before.gripWidth,'Large grip setting made no difference');
  assert.ok(expanded.world.width>=932*.45,'Large grip obstructed center viewport');
  await page.screenshot({path:'artifacts/mythwrought-v005-large-landscape.png'});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  await page.locator('#menu').click();
  assert.equal(await page.locator('#controlSize').inputValue(),'large','Grip setting not remembered');
  await page.locator('#closeHelp').click();
  // Simulate landscape safe insets: responsive width calculation must respect CSS padding.
  await page.addStyleTag({content:'.console{padding-left:22px!important;padding-right:28px!important}'});
  await page.evaluate(()=>window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(80);
  const inset=await inspect();
  assert.ok(inset.left.x>=21,'Left controller ignored safe inset');
  assert.ok(inset.right.right<=932-27,'Right controller ignored safe inset');
  assert.ok(inset.world.width>350,'Safe inset collapsed world');
  assert.deepEqual(errors,[],'Browser exceptions');
  console.log('PASS v0.05 device-size grip layouts, art treatment and control accessibility');
}finally{await browser.close();}
