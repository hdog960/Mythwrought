import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../../../',import.meta.url);
const script=readFileSync(new URL('./roadmap-a-pack5-original-game-rotated-edge-browser.mjs',import.meta.url),'utf8');
const main=readFileSync(new URL('src/main.mjs',root),'utf8');
const bridge=readFileSync(new URL('src/builder-assets/manual-five-pack-live.mjs',root),'utf8');
const layer=readFileSync(new URL('src/pack5-integration/construction-layer.mjs',root),'utf8');

test('original live builder debug source retains exact research-only Pack5 variant + yaw world ownership',()=>{
 assert.ok(main.includes("placeBuilderAsset(row){return fivePackBuilder.place(row);}"));
 assert.ok(bridge.includes("asset:getAsset(record)")===false);
 assert.ok(bridge.includes("bridge.layer.place(asset.symbol,at,asset.orientation,asset.variant,"));
 assert.ok(bridge.includes("bridge.save();rebuild()"));
 assert.ok(layer.includes('return into.place(id,anchor,rotation,asset.variant);'));
 assert.ok(main.includes("pack5Gpu.refresh(eye());"));
});
test('one original-game 844x390 browser viewport with no user profile or deployed GitHub Pages',()=>{
 assert.ok(script.includes("const host='http://127.0.0.1:4206/';"));
 assert.ok(script.includes('browser.newContext({viewport:{width:844,height:390}'));
 assert.ok(script.includes("serviceWorkers:'block',permissions:[]"));
 assert.ok(script.includes('if(context)await context.close()'));
 assert.ok(!script.includes('launchPersistentContext'));
 assert.ok(!script.includes('connectOverCDP'));
 assert.ok(!script.includes('github.io'));
});
test('research-only source version kiln soldier yaw2 is explicit and is not registered in production buildings',()=>{
 assert.ok(script.includes("testOnlyVariant:'kiln-soldier-course'"));
 assert.ok(script.includes('testOnlyRotation:2'));
 assert.ok(script.includes("fixture.place('pack5:080',cell,2,'kiln-soldier-course')"));
 assert.ok(script.includes("orientation:2,variant:'kiln-soldier-course'"));
 assert.ok(script.includes('productionA5VariantYawChosen:false'));
 assert.ok(script.includes('sidecarContainsExactOriginalVariant:true')===false);
});
test('actual original camera source ray comes from game player pose instead of invented foot location',()=>{
 assert.ok(script.includes('Number(d.playerFeet)+1.55'));
 assert.ok(script.includes('Number(d.cameraYaw)'));
 assert.ok(script.includes("import('/src/camera.mjs')"));
 assert.ok(script.includes('sourceRayTriangleDistance'));
 assert.ok(script.includes('fixture.raycast(eye,ray,6)'));
 assert.ok(script.includes('originalPoseSourceRayCount:study.scan.rayProbes'));
});
test('actual source triangle-only near-edge MINE tests fail closed and never delete through raycast helper',()=>{
 assert.ok(script.includes("study.edge?.classification==='triangle-only'"));
 assert.ok(script.includes("await page.locator('#dig').click();await sleep(320)"));
 assert.ok(script.includes("assert.equal(edgeOutcome.pack5Instances,1"));
 assert.ok(script.includes("actualGpuEdgePixelCoverageNotYetCertified:true"));
 assert.ok(script.includes("original real MINE"));
 assert.ok(!script.includes('layer.remove('));
 assert.ok(!script.includes('removeFacing('));
});
test('real renderer pixels, positive game MINE and negative aim-away controls must pass',()=>{
 assert.ok(script.includes("page.locator('#scene').screenshot"));
 assert.ok(script.includes('PNG.sync.read(a)'));
 assert.ok(script.includes('PNG.sync.read(b)'));
 assert.ok(script.includes("pixels.strongDiffPixels>=100&&pixels.centralStrongPixels>=40"));
 assert.ok(script.includes("await orient(0,0)"));
 assert.ok(script.includes("assert.equal(away.pack5Instances,1"));
 assert.ok(script.includes("await orient(study.center.yaw,study.center.pitch)"));
 assert.ok(script.includes("assert.equal(mined.pack5Instances,0"));
});
test('schema1 and changed source sidecar must stay inside private context and clean reload',()=>{
 assert.ok(script.includes("assert.equal(placed.worldSchema,1)"));
 assert.ok(script.includes("assert.equal(placed.verifiedSave,true)"));
 assert.ok(script.includes("assert.equal(sidecarHasOriginalVariant,true"));
 assert.ok(script.includes("await page.reload({waitUntil:'load'})"));
 assert.ok(script.includes("assert.equal(reloaded.pack5Instances,0)"));
 assert.ok(script.includes("assert.equal(reloaded.editorEnabled,false)"));
 assert.ok(script.includes('userWorldAccessed:false'));
 assert.ok(script.includes('userSaveAccessed:false'));
});
test('real Chromium test does not imply real iPhone acceptance or broad release authority',()=>{
 assert.ok(script.includes('realIphoneSafari:false'));
 assert.ok(script.includes('deployedOrMerged:')===false);
 assert.ok(script.includes('originalGameCodeModified:false'));
 assert.ok(script.includes('productionA5VariantYawChosen:false'));
 assert.ok(script.includes('originalSchema1Preserved:true'));
});
