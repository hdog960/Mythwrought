import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const own=readFileSync(new URL('./roadmap-a-pack5-original-disposable-actual-game-browser.mjs',import.meta.url),'utf8');
const main=readFileSync(new URL('../../../src/main.mjs',import.meta.url),'utf8');
const older=readFileSync(new URL('../../pack5-game-browser.mjs',import.meta.url),'utf8');

test('author-approved actual original game acceptance uses unchanged original localhost-only debug hook',()=>{
 assert.ok(main.includes("if(['localhost','127.0.0.1'].includes(location.hostname)){"));
 assert.ok(main.includes('placePack5TestFixture(x,y,z){'));
 assert.ok(main.includes("pack5Builder.layer.place('pack5:080',cell,0)"));
 assert.ok(main.includes("pack5Builder.save();"));
 assert.ok(main.includes("pack5Gpu.refresh(eye());"));
 assert.ok(main.includes("bindGameplayAction('dig',()=>edit('mine'));"));
 assert.ok(main.includes("const result=mode==='place'?"));
 assert.ok(main.includes("pack5Builder.removeFacing(eye(),facing());"));
 assert.ok(older.includes('api.placePack5TestFixture(x,y,z)'));
});
test('real browser harness uses only one 844x390 isolated 127.0.0.1 private Chromium context',()=>{
 assert.ok(own.includes("const host='http://127.0.0.1:4199/';"));
 assert.ok(own.includes("browser.newContext({viewport:{width:844,height:390}"));
 assert.ok(own.includes("deviceScaleFactor:1,serviceWorkers:'block',permissions:[]"));
 assert.ok(own.includes('await context.close()'));
 assert.ok(own.includes("const server=spawn('python3'"));
 assert.ok(!own.includes('connectOverCDP'));
 assert.ok(!own.includes('launchPersistentContext'));
 assert.ok(!own.includes('github.io'));
});
test('real game rendered pixel witness is independently rooted in ORIGINAL actual canvas screenshot bytes',()=>{
 assert.ok(own.includes("page.locator('#scene').screenshot"));
 assert.ok(own.includes('PNG.sync.read(a)'));
 assert.ok(own.includes('PNG.sync.read(b)'));
 assert.ok(own.includes('const width=x.width,height=x.height;'));
 assert.ok(own.includes('assert.equal(y.width,width);assert.equal(y.height,height)'));
 assert.ok(own.includes('actualCanvasPngDimensions:[width,height]'));
 assert.ok(!own.includes('assert.equal(x.width,844)'));
 assert.ok(!own.includes('for(let py=0;py<390;py++)'));
 assert.ok(own.includes('realCanvasRgbDifference:diff'));
 assert.ok(own.includes('diff.strongRgbDifferencePixels>=100'));
 assert.ok(own.includes('diff.centralStrongDifferencePixels>=40'));
 assert.ok(own.includes('Number(d.pack5MeshVertices)>0'));
 assert.ok(own.includes('Number(d.pack5PendingPages)===0'));
 assert.ok(own.includes('Number(d.pack5VisibleInstances)===1'));
});
test('original source selection and genuine MINE button are separate positive and aim-away negative controls',()=>{
 assert.ok(own.includes('makePack5Fixture(PACK5_BUILDER_FAMILIES)'));
 assert.ok(own.includes('source.raycast(origin,direction,6)'));
 assert.ok(own.includes("window.__mythwroughtTest.setOrientation(0,0)"));
 assert.equal((own.match(/page.locator\('#dig'\)\.click\(\)/g)||[]).length,2);
 assert.ok(own.includes('window.__mythwroughtTest.aimAt(x,y,z)'));
 assert.ok(own.includes("assert.equal(missed.instances,1"));
 assert.ok(own.includes("assert.equal(mined.instances,0"));
});
test('only temporary browser sidecar and original schema1 are allowed, original saved worlds never accessed',()=>{
 assert.ok(own.includes("assert.equal(pristine.sidecarKeys.length,0)"));
 assert.ok(own.includes("assert.equal(before.sidecarKeys.length,0)"));
 assert.ok(own.includes("assert.equal(placement.worldSchema,1"));
 assert.ok(own.includes("assert.equal(reloaded.instances,0"));
 assert.ok(own.includes('result.originalUserSavedWorldWasNeverOpened=true'));
 assert.ok(!own.includes('files__'));
 assert.ok(!own.includes('saveWorldSafe('));
 assert.ok(!own.includes("window.localStorage.clear"));
});
test('source acceptance explicitly excludes real iPhone, production merge and developer approval transfer',()=>{
 assert.ok(own.includes('actualPhysicalIphoneSafari:false'));
 assert.ok(own.includes('originalGameSourceUnmodified:true'));
 assert.ok(own.includes('deployedOrMerged:false'));
 assert.ok(own.includes('sourceA5MaterialYawAssigned:false'));
 assert.ok(own.includes('creatorAuthorized:true'));
});
