// Source-authentic live-game WebGL2 acceptance for both manual Packs 1 and 4.
// This script runs in a free GitHub Actions Chromium runner, not a physical iPhone.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const out='artifacts/manual14-live';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader','--disable-dev-shm-usage'
]});
const sizes=[[956,440],[844,390],[667,375]];
try{
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},
   deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest&&
    Number(document.querySelector('#scene')?.dataset?.renderedFrames)>0),
    {timeout:45000});
  const scene=await page.evaluate(()=>{
   const t=window.__mythwroughtTest;
   if(!document.getElementById('manual14Select')||
      !document.getElementById('manual14Rotate')||
      !document.getElementById('manual14Upper'))
    throw Error('Pack 1/4 live construction controls are missing');
   t.teleport(501,500);
   const first=[500,19,500],second=[501,19,500];
   if(t.block(...first)!==0||t.block(...second)!==0)
    throw Error('Test terrain does not expose empty cells for authored fixtures');
   const before=t.snapshot();
   const p1=t.placeManual14Fixture(...first,9,0,'lower');
   const p4=t.placeManual14Fixture(...second,159,0,'lower');
   t.aimAt(...first);
   const after=t.snapshot();
   if(t.block(...first)!==9||t.block(...second)!==159)
    throw Error('Physical Pack1/Pack4 registration not exposed in local gameplay bridge');
   return {first,second,p1,p4,before:before.manual14PhysicalBlocks,
     after:after.manual14PhysicalBlocks,
     meshBatches:after.editMeshBatches-before.editMeshBatches,
     schema:p4.worldSchema,loadedChunks:after.chunks.length};
  });
  assert.equal(scene.schema,1);
  assert.equal(scene.after,2);
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.manual14MeshVertices)>0,
    null,{timeout:60000});
  const canvas=await page.$('#scene');
  const status=await page.evaluate(()=>{
   const c=document.querySelector('#scene'),m=document.querySelector('#movePad').getBoundingClientRect(),
     r=document.querySelector('#lookPad').getBoundingClientRect();
   return {count:Number(c.dataset.manual14PhysicalCount),
    vertices:Number(c.dataset.renderedMeshVertices),
    manual14MeshVertices:Number(c.dataset.manual14MeshVertices),
    manual14VisibleInstances:Number(c.dataset.manual14VisibleInstances),
    width:innerWidth,height:innerHeight,separateRails:m.right<r.left,
    selectedLabel:document.querySelector('#manual14Select')?.options?.length??0};
  });
  assert.equal(status.count,2);
  assert.ok(status.vertices>0,'No genuine WebGL2 terrain/chunk vertices');
  assert.ok(status.manual14MeshVertices>0,'No physical Pack 1/4 triangles resident in rendered GPU chunks');
  assert.ok(status.manual14VisibleInstances>=2,'Pack 1/4 source assets not both resident in streamed chunks');
  assert.ok(status.separateRails,'Touch rails overlap at '+width+'×'+height);
  assert.ok(status.selectedLabel>=54,'Missing 53 source-owned numeric candidates');
  await canvas.screenshot({path:out+'/pack1-pack4-'+width+'x'+height+'.png'});
  // Reload the actual served game: persisted sidecar and real GPU meshes must
  // restore without fabricating IDs in the schema-1 VoxelWorld serialization.
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot?.().manual14PhysicalBlocks===2&&
    Number(document.querySelector('#scene')?.dataset.manual14MeshVertices)>0,
    null,{timeout:60000});
  const reloaded=await page.evaluate(([p1,p4])=>({
   ids:[window.__mythwroughtTest.block(...p1),window.__mythwroughtTest.block(...p4)],
   sidecar:JSON.parse(localStorage.getItem('mythwrought.manual14.seed.179')),
   gpu:document.querySelector('#scene').dataset.manual14PhysicalCount
  }),[scene.first,scene.second]);
  assert.deepEqual(reloaded.ids,[9,159]);
  assert.equal(reloaded.sidecar.format,'mythwrought.manual-block-packs-1-and-4.v1');
  assert.equal(reloaded.sidecar.entries.length,2);
  assert.equal(Number(reloaded.gpu),2);
  assert.deepEqual(errors,[],'JavaScript exception during actual game render/reload');
  console.log(JSON.stringify({size:width+'x'+height,scene,status,reloaded:reloaded.ids,
    pageErrors:errors.length}));
  await context.close();
 }
}finally{await browser.close();}
