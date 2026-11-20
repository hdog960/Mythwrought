// Genuine G2B browser acceptance against actual playable WebGL2 source.
// Required localhost: http://127.0.0.1:4174 unless G2B_BROWSER_ORIGIN overrides.
// Test file lives strictly within G2B ownership; never replays real user saves.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {inspectReadOnlyGameArchive} from '../../src/creative-integration/world-safety.mjs';
import {chromium} from 'playwright';
const origin=process.env.G2B_BROWSER_ORIGIN||'http://127.0.0.1:4174';
const sizes=[[568,320],[667,375],[844,390],[932,430],[956,440],[1180,520]];
const browser=await chromium.launch({headless:true,args:['--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const touch=(id,x,y)=>({id,x:Math.round(x),y:Math.round(y)});
const center=rect=>({x:rect.x+rect.width/2,y:rect.y+rect.height/2});
mkdirSync('artifacts',{recursive:true});
try{
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,
    isMobile:true,deviceScaleFactor:1,acceptDownloads:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
   // A real empty browser has no accepted world: confirm V6 without bypasses.
   await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
   page.once('dialog',dialog=>dialog.accept());
   await page.getByRole('button',{name:/NEW WORLD/}).click();
   await page.locator('#help').waitFor({state:'hidden',timeout:30000});
   assert.equal(await page.locator('#help').isVisible(),false,
     'V6 must save before completing protected new-world entry');
   await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
     undefined,{timeout:40000});
   const state=await page.evaluate(()=>{
     const r=id=>{const x=document.querySelector(id).getBoundingClientRect();
       return {left:x.left,right:x.right,top:x.top,bottom:x.bottom,width:x.width,height:x.height};};
     const el=document.querySelector('#scene'),world=r('.viewport'),map=r('#miniMapButton');
     return {left:r('.grip.left'),right:r('.grip.right'),world,map,
       canvas:r('#scene'),gl:!!el.getContext('webgl2'),off:el.dataset.g2bFlight,
       loaded:Number(el.dataset.loadedChunks),notice:document.querySelector('#notice').hidden,
       savedSeed:localStorage.getItem('mythwrought-v002-selected-seed'),
       save:localStorage.getItem('mythwrought-v002-world-'+
           localStorage.getItem('mythwrought-v002-selected-seed'))};
   });
   assert.ok(state.gl,'G2B requires actual WebGL2');
   assert.ok(state.notice,'G2B production renderer failed');
   assert.equal(state.off,'false','Flight must start disabled');
   assert.ok(state.left.right<=state.canvas.left+3&&
     state.right.left>=state.canvas.right-3,'Grip overlaps world');
   assert.ok(state.map.right<=state.world.right+3&&
     state.map.right>=state.world.right-30&&
     state.map.top>=state.world.top-3,'Minimap must remain upper-right');
   assert.equal(await page.locator('#dig').textContent(),'MINE');
   assert.equal(await page.locator('#place').textContent(),'PLACE');
   assert.equal(await page.locator('#jump').textContent(),'JUMP');
   await page.locator('#miniMapButton').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),true);
   await page.locator('#closeExploration').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),false);
   // Exercise the real iPhone-sized three-row menu and dynamic Creative
   // inventory without mocked selectors or a second app-rendering harness.
   if(width===956){
     await page.locator('#menu').click();
     assert.equal(await page.locator('#help').isVisible(),true);
     assert.equal(await page.locator('#playerMenu .player-menu-row').count(),3,
       'The user-facing menu must contain only Test Code, time and New World');
     const menuGeometry=await page.evaluate(()=>{
       const n=document.querySelector('#playerMenu'),r=n.getBoundingClientRect();
       return {scroll:n.scrollHeight,client:n.clientHeight,
         left:r.left,right:r.right,top:r.top,bottom:r.bottom};
     });
     assert.ok(menuGeometry.scroll<=menuGeometry.client+1,
       'Main menu started scrolling in iPhone landscape: '+JSON.stringify(menuGeometry));
     assert.ok(menuGeometry.left>=0&&menuGeometry.right<=width+1&&
       menuGeometry.top>=0&&menuGeometry.bottom<=height+1,
       'Main menu escapes real landscape viewport');
     await page.screenshot({path:'artifacts/mythwrought-creative-settings-'+width+'x'+height+'.png'});
     await page.locator('.player-menu-safety-link').click();
     assert.equal(await page.locator('#playerSafety').isVisible(),true,
       'Opt-in backup drawer must remain accessible without cluttering normal settings');
     assert.equal(await page.locator('#vaultBackup').isVisible(),true,
       'Original device-vault controls vanished from recovery drawer');
     await page.screenshot({path:'artifacts/mythwrought-creative-recovery-'+width+'x'+height+'.png'});
     // GitHub Pages shares origin storage across games. The real local archive
     // must not leak another project's storage or modify the verified world.
     await page.evaluate(()=>localStorage.setItem('unwritten-realms-owned','exclude-foreign-save'));
     const archivePromise=page.waitForEvent('download',{timeout:20000});
     await page.locator('.player-safety-archive').click();
     const downloaded=await archivePromise;
     assert.match(downloaded.suggestedFilename(),/^mythwrought-local-saves-\d{4}-\d{2}-\d{2}\.json$/);
     const archive=inspectReadOnlyGameArchive(readFileSync(await downloaded.path(),'utf8'));
     const records=new Map(archive.entries);
     assert.equal(records.get('mythwrought-v002-world-'+state.savedSeed),state.save,
       'Archive lost original selected schema-1 world bytes');
     assert.ok(records.has('mythwrought-v002-world-'+state.savedSeed+'-four-biomes-profile-v1'),
       'Archive omitted original current-generation profile');
     assert.equal(records.has('unwritten-realms-owned'),false,
       'Shared-origin archive accidentally exported another game');
     await page.evaluate(()=>localStorage.removeItem('unwritten-realms-owned'));
     await page.locator('.player-safety-back').click();
     assert.equal(await page.locator('#playerSafety').isVisible(),false,
       'Backup panel did not return to compact settings');
     await page.getByRole('button',{name:'RETURN TO GAME'}).click();
     await page.locator('#creativeToggle').click();
     assert.equal(await page.locator('#creativeInventoryToggle').isVisible(),true);
     await page.locator('#creativeInventoryToggle').click();
     assert.equal(await page.locator('#creativeInventory').isVisible(),true);
     assert.equal(await page.locator('.mw-inventory-category').count(),10);
     assert.equal(await page.locator('.mw-inventory-grid button').count(),48,
       'Source-driven inventory must use bounded initial rendering');
     await page.screenshot({path:'artifacts/mythwrought-creative-items-'+width+'x'+height+'.png'});
     await page.locator('.mw-inventory-category').filter({hasText:'Creatures'}).click();
     assert.equal(await page.locator('.mw-inventory-grid button').count(),40,
       'All 40 genuine live creature spawn sigils must be present');
     await page.screenshot({path:'artifacts/mythwrought-creative-eggs-'+width+'x'+height+'.png'});
     await page.locator('.mw-inventory-grid [data-key="spawn:horse"]').click();
     assert.match(await page.locator('.mw-inventory-preview').textContent(),/Horse/);
     await page.locator('.mw-inventory-close').click();
     assert.equal(await page.locator('#creativeInventory').isVisible(),false);
     await page.locator('#creativeToggle').click();
     assert.equal(await page.locator('#creativeToggle').getAttribute('aria-pressed'),'false');
   }
   // Genuine CDP touchstart/touchend makes a precise double-tap even when
   // software WebGL2 is slow; Playwright locator.tap() can insert long layout
   // waits *between* taps that are not part of an actual user's double-tap.
   const jumpTouchSession=await context.newCDPSession(page);
   const jumpXY=center(await page.locator('#jump').boundingBox());
   let jumpTouchId=501;
   await page.evaluate(()=>{
     window.__flightJumpTouchEvents=[];
     const jump=document.getElementById('jump');
     for(const type of ['pointerdown','pointerup','pointercancel','click'])
       jump.addEventListener(type,e=>window.__flightJumpTouchEvents.push({
         type,pointerType:e.pointerType||null,detail:e.detail,stamp:e.timeStamp
       }),{passive:true});
   });
   const jumpTouchProof=()=>page.evaluate(()=>({
     flight:window.__mythwroughtTest.flightInfo(),
     status:document.getElementById('g2bFlightStatus').textContent,
     footer:document.getElementById('status').textContent,
     touchEvents:window.__flightJumpTouchEvents
   }));
   // Chromium's genuine CDP touch path records the physical event timestamp.
   // SwiftShader may stall commands longer than the user's intended tap gap.
   // No synthetic DOM PointerEvents, mocked game callbacks or fake movement.
   async function tapJumpTouch(atSeconds=Date.now()/1000){
     const point=touch(jumpTouchId++,jumpXY.x,jumpXY.y);
     await jumpTouchSession.send('Input.dispatchTouchEvent',{type:'touchStart',
       touchPoints:[point],timestamp:atSeconds});
     await jumpTouchSession.send('Input.dispatchTouchEvent',{type:'touchEnd',
       touchPoints:[],timestamp:atSeconds+.075});
   }
   async function doubleTapJumpTouch(){
     const prior=await page.evaluate(()=>window.__flightJumpTouchEvents.length);
     const start=Date.now()/1000;
     await tapJumpTouch(start);
     await tapJumpTouch(start+.30);
     const received=await page.evaluate(offset=>window.__flightJumpTouchEvents.slice(offset),prior);
     const downs=received.filter(x=>x.type==='pointerdown');
     const ups=received.filter(x=>x.type==='pointerup');
     assert.equal(downs.length,2,'Not two genuine touch pointerdowns: '+JSON.stringify(received));
     assert.equal(ups.length,2,'Not two genuine touch pointerups: '+JSON.stringify(received));
     assert.ok(downs.every(x=>x.pointerType==='touch')&&ups.every(x=>x.pointerType==='touch'),
       'Test must use real browser touch events');
     const gap=downs[1].stamp-ups[0].stamp;
     assert.ok(gap>=50&&gap<=650,
       'Touch interval was not a valid double-tap: '+JSON.stringify({gap,received}));
     return gap;
   }
   // No Creative activation, no matter how quickly the player double-taps.
   await doubleTapJumpTouch();
   let beforeCreative=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(beforeCreative.creativeEnabled,false,'Creative must begin disabled');
   assert.equal(beforeCreative.active,false,'Double-tap cannot fly in Explore mode');
   await page.waitForTimeout(900);
   assert.equal(await page.locator('#creativeToggle').getAttribute('aria-pressed'),'false');
   await page.locator('#creativeToggle').click();
   let enabled=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(enabled.creativeEnabled,true,'Creative toggle did not enable mode');
   assert.equal(enabled.active,false,'Enabling Creative must NOT automatically enter flight');
   assert.equal(await page.locator('#creativeToggle').getAttribute('aria-pressed'),'true');
   await tapJumpTouch();
   assert.equal((await page.evaluate(()=>window.__mythwroughtTest.flightInfo())).active,false,
     'One JUMP touch must not enable flight');
   await page.waitForTimeout(900);
   const firstDoubleGap=await doubleTapJumpTouch();
   let info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(info.active,true,'Double-tap JUMP did not enable flight: '+JSON.stringify(await jumpTouchProof()));
   await page.waitForTimeout(900);
   await tapJumpTouch();
   assert.equal((await page.evaluate(()=>window.__mythwroughtTest.flightInfo())).active,true,
     'One LAND touch must not end flight');
   await page.waitForTimeout(900);
   await doubleTapJumpTouch();
   info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   if(info.active){
     // The real collision host can refuse landing safely; this is NOT a
     // gesture failure, but the refusal must be observable (not a lost tap).
     const note=await page.locator('#status').textContent();
     assert.match(note,/No verified landing|Landing stale|unsafe|Landing blocked/,
       'Double-tap LAND was ignored instead of refusing an unsafe landing: '+JSON.stringify(await jumpTouchProof()));
   }else{
     await page.waitForTimeout(900);
     await doubleTapJumpTouch();
     info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
     assert.equal(info.active,true,'Repeat double-tap JUMP did not re-enable flight: '+JSON.stringify(await jumpTouchProof()));
   }
   assert.equal(await page.locator('#creativeToggle').getAttribute('aria-pressed'),'true');
   assert.equal(info.creativeEnabled,true,'Creative should remain enabled in flight');
   assert.equal(info.bodyClear,true);
   assert.equal(info.resident,true);
   assert.ok(info.maxY>=60,'Sky flight ceiling must permit useful ascent above the surface');
   assert.equal(await page.locator('#g2bFlightProfile').isDisabled(),true);
   assert.equal(info.profile,'travel','The real flight speed must remain 15');
   await page.evaluate(()=>{
    const field=document.getElementById('g2bFlightProfile');
    field.value='precision';field.dispatchEvent(new Event('change',{bubbles:true}));
   });
   info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(info.profile,'travel','Spoofed lower speed must be blocked');
   await page.waitForTimeout(250); // paused controls may resume only after the next safe GPU frame.
   assert.equal(await page.locator('#dig').textContent(),'DOWN');
   assert.equal(await page.locator('#place').textContent(),'UP');
   assert.equal(await page.locator('#jump').textContent(),'LAND ×2');
   const before=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   // Focus the real world, then wait for actual simulated movement instead of
   // assuming SwiftShader renders a deterministic number of frames in 340ms.
   await page.locator('#scene').focus();
   await page.keyboard.down('w');
   let after=before,moved=0;
   try{
     for(let sample=0;sample<20;sample++){
       await page.waitForTimeout(200);
       after=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
       moved=Math.hypot(after.position.x-before.position.x,
         after.position.z-before.position.z);
       if(moved>.025)break;
     }
   }finally{await page.keyboard.up('w');}
   assert.ok(moved>.025,'Source-driven flight did not move through resident world '+
     width+' · '+JSON.stringify({before,after,moved}));
   assert.equal(after.bodyClear,true,'Flight entered a real physical collision');
   assert.equal(after.resident,true,'Flight outran GPU-resident chunks');
   // Regression: real brief touch taps must move vertically even when
   // pointerdown and pointerup happen before the next render frame.
   const preUp=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   await page.locator('#place').tap();
   const postUp=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.ok(postUp.position.y>preUp.position.y+.035,
     'UP tap failed to climb: '+JSON.stringify({preUp,postUp}));
   await page.locator('#dig').tap();
   const postDown=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.ok(postDown.position.y<postUp.position.y-.035,
     'DOWN tap failed to descend: '+JSON.stringify({postUp,postDown}));
   assert.equal(postDown.bodyClear,true);
   assert.equal(postDown.resident,true);
   // A held button must sustain altitude changes over real draw frames;
   // passing its one-time pointerdown nudge is NOT enough.
   const holdSession=await context.newCDPSession(page);
   let holdId=800;
   async function proveHold(selector,sign){
     const rect=await page.locator(selector).boundingBox();
     assert.ok(rect,'Missing vertical hold button '+selector);
     const xy=center(rect),point=touch(holdId++,xy.x,xy.y);
     const previous=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
     await holdSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
     let immediate,held=previous,extra=0;
     try{
       immediate=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
       assert.ok(sign*(immediate.position.y-previous.position.y)>.035,
         'Pointerdown failed initial altitude step: '+JSON.stringify({selector,previous,immediate}));
       for(let sample=0;sample<24;sample++){
         await page.waitForTimeout(140);
         held=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
         extra=sign*(held.position.y-immediate.position.y);
         if(extra>.05)break;
       }
     }finally{
       await holdSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
     }
     assert.ok(extra>.05,'Held button never moved after initial nudge: '+
       JSON.stringify({selector,previous,immediate,held,extra}));
     assert.equal(held.bodyClear,true,'Held vertical movement collided');
     assert.equal(held.resident,true,'Held vertical movement lost GPU residency');
     return extra;
   }
   const heldUp=await proveHold('#place',1);
   const heldDown=await proveHold('#dig',-1);
   // Genuine independent three-touch CDP input: MOVE + LOOK + UP held together.
   const cdp=await context.newCDPSession(page);
   const beforeThree=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   const left=center(await page.locator('#movePad').boundingBox());
   const right=center(await page.locator('#lookPad').boundingBox());
   const up=center(await page.locator('#place').boundingBox());
   const t1=touch(101,left.x,left.y-25),t2=touch(102,right.x+12,right.y+7);
   const t3=touch(103,up.x,up.y);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',
     touchPoints:[touch(101,left.x,left.y),touch(102,right.x,right.y)]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[t1,t2]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[t1,t2,t3]});
   // Verify real altitude AND forward movement while all three touches
   // remain held. The old test only checked non-collision after the gesture,
   // which could pass even if every input was silently ignored.
   await page.waitForTimeout(520);
   const duringThree=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   const threeMoved=Math.hypot(duringThree.position.x-beforeThree.position.x,
     duringThree.position.z-beforeThree.position.z);
   assert.ok(threeMoved>.035,'Three-touch MOVE did not move the player: '+
     JSON.stringify({beforeThree,duringThree,threeMoved}));
   assert.ok(duringThree.position.y>beforeThree.position.y+.035,
     'Three-touch UP did not climb: '+JSON.stringify({beforeThree,duringThree}));
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[t1,t2]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForTimeout(100);
   const touched=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(touched.bodyClear,true);
   assert.equal(touched.resident,true);
   assert.ok(touched.pendingPlans<=6,'G2B exceeds six G2A prefetch proposals');
   assert.ok(touched.residentChunks<=34,'G2B expanded original GPU chunk limit');
   // Map must remain accessible while airborne and cancel held controls.
   await page.locator('#miniMapButton').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),true);
   await page.locator('#closeExploration').click();
   await page.waitForTimeout(100);
   assert.equal(await page.locator('#scene').getAttribute('data-g2b-flight'),'true');
   // Returning to Explore never occurs without verified ground and clear body.
   await tapJumpTouch();
   assert.equal((await page.evaluate(()=>window.__mythwroughtTest.flightInfo())).active,true,
     'One LAND tap must not toggle flight');
   await page.waitForTimeout(900);
   await doubleTapJumpTouch();
   await page.waitForTimeout(160);
   const landed=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(landed.creativeEnabled,true,'Landing should not disable Creative Mode');
   if(!landed.active){
     assert.equal(landed.bodyClear,true);
     assert.equal(await page.locator('#jump').textContent(),'JUMP');
     const vy=Number(await page.locator('#scene').getAttribute('data-player-velocity-y'));
     assert.ok(!Number.isFinite(vy)||vy<3,'Landing tap synthesized a second Explore jump');
   }else{
     assert.equal(await page.locator('#jump').textContent(),'LAND ×2');
     const note=await page.locator('#status').textContent();
     assert.match(note,/No verified landing|Landing stale|unsafe|Landing blocked/,
       'A double LAND tap must report a verified safety refusal: '+JSON.stringify(await jumpTouchProof()));
   }
   await page.screenshot({path:'artifacts/mythwrought-g2b-'+width+'x'+height+'.png'});
   assert.deepEqual(errors,[],'Uncaught real-game runtime exceptions');
   const still=await page.evaluate(()=>{
     const seed=localStorage.getItem('mythwrought-v002-selected-seed');
     return {seed,save:localStorage.getItem('mythwrought-v002-world-'+seed)};
   });
   assert.equal(still.seed,state.savedSeed,'Flight changed the current-world identity');
   assert.equal(still.save,state.save,'Flight changed the existing canonical world save bytes');
   console.log('PASS G2B real Chromium WebGL2 flight and two-thumb safety '+width+'x'+height+
     ' · moved '+moved.toFixed(3)+' · gap '+firstDoubleGap.toFixed(0)+'ms'+
     ' · held up '+heldUp.toFixed(3)+' / down '+heldDown.toFixed(3)+
     ' · landing '+(landed.active?'safe refusal':'success'));
  }finally{await context.close();}
 }
}finally{await browser.close();}
