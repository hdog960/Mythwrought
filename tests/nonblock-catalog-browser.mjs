import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {VoxelWorld,chunkCoord,chunkWindow,raycast} from '../src/voxel.mjs';
import {sectionWindow,sectionChunkRadius,surfaceOpeningNearby} from '../src/depth.mjs';
import {runtimeMeshKey,runtimeSectionForY,physicalBodyRegions,upperOccupancyRevision} from '../src/world-height.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {ENCHANTED_FUNGI_IDS} from '../src/nonblock-scene48/enchanted-fungi.mjs';
import {MEADOW_WOODLAND_IDS} from '../src/nonblock-scene48/meadow-woodland.mjs';
import {inheritedStageFamilies} from '../src/nonblock/staged-inherited-families.mjs';
import {candidateFamilies} from '../src/nonblock/candidate-families.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';

const world = new VoxelWorld(179);
const origin = process.env.NONBLOCK_CATALOG_ORIGIN||'http://127.0.0.1:4173';
const catalog = process.env.NONBLOCK_CATALOG_SET||'catalog';
const directory = 'artifacts/nonblock-'+catalog;
const groups = {
  catalog:{wallNames:['cloth-banner'],length:31,include:id=>
    !MEADOW_WOODLAND_IDS.includes(id)&&!ENCHANTED_FUNGI_IDS.includes(id)&&
      !inheritedStageFamilies.some(([familyId])=>familyId===id)},
  'meadow-woodland':{wallNames:['crawling-ivy','trail-vine'],length:8,
    include:id=>MEADOW_WOODLAND_IDS.includes(id)},
  'enchanted-fungi':{wallNames:['shelf-fungus','glowing-vine'],length:10,
    include:id=>ENCHANTED_FUNGI_IDS.includes(id)}
};
const group=groups[catalog];
assert.ok(group,'Unknown staged catalog set');
const classicSaveKey = 'mythwrought-v002-world-179';
const stageSaveKey = 'mythwrought:nonblock-stage:v1:legacy:179';
const digest = bytes=>createHash('sha256').update(bytes).digest('hex');
const blockAt = (x,y,z)=>Boolean(world.get(x,y,z));
const checks = [];

function sceneFor(layout) {
  return createCandidateScene(179,'legacy',layout,{
    storage:{getItem:()=>null},blockAt,voxelPick:(...ray)=>raycast(world,...ray)
  });
}

function seekView(scene,object) {
  const [ox,,oz]=object.anchor;
  const p=object.positions;
  for(const [dx,dz] of [[-1,-2],[1,-2],[0,-2],[-2,0],[2,0],[-1,2],[1,2],[0,2]]){
    const x=ox+.5+dx, z=oz+.5+dz;
    const player=findSafeSpawn(world,x,z);
    const eye=[player.x,player.feet+1.55,player.z];
    for(let i=0;i<p.length;i+=9){
      const point=[0,1,2].map(k=>(p[i+k]+p[i+3+k]+p[i+6+k])/3);
      if(scene.pick(eye,point.map((v,k)=>v-eye[k]))?.instanceKey===object.instanceKey)
        return {x,z,point};
    }
  }
  return null;
}

// Use genuine seeded floor and wall cells. The setup never places voxels or edits a save.
const layout=catalog==='catalog'?
  [{sceneId:'scene36:cloth-banner',anchor:[11,9,10],orientation:2}]:
  [{sceneId:'scene48:'+group.wallNames[0],anchor:[11,8,10],orientation:2,variant:2},
   {sceneId:'scene48:'+group.wallNames[1],anchor:[10,8,11],orientation:1,variant:1}];
let site=0;
const sites=[];
for(let z=-9;z<=13;z+=3){
  for(let x=-8;x<=13;x+=3){
    if(Math.abs(x-11)<3 && Math.abs(z-10)<3) continue;
    let y=21;
    while(y>0 && !blockAt(x,y-1,z))y--;
    sites.push([x,y,z]);
  }
}
for(const [sceneId,family] of candidateFamilies){
  if(family.wall || family.attachment || !group.include(sceneId)) continue;
  while(site<sites.length){
    const placement={sceneId,anchor:sites[site++],variant:1};
    const candidate=sceneFor([placement]);
    const [object]=candidate.visible();
    if(object && seekView(candidate,object)){
      layout.push(placement);
      break;
    }
  }
  assert.equal(layout.at(-1).sceneId,sceneId,'No suitable natural mount for '+sceneId);
}
const nativeScene=sceneFor(layout);
const objects=nativeScene.visible();
assert.equal(objects.length,group.length);
const views=objects.map(o=>{
  const aim=seekView(nativeScene,o);
  assert.ok(aim,'No unobstructed exact-triangle view for '+o.sceneId);
  return aim;
});
const distantMeshes=objects.filter(object=>object.farDetail);
const benchmark=distantMeshes.length?{
  x:distantMeshes.reduce((sum,{anchor})=>sum+anchor[0]+.5,0)/distantMeshes.length,
  z:distantMeshes.reduce((sum,{anchor})=>sum+anchor[2]+.5,0)/distantMeshes.length,
  point:views[0].point
}:views[0];
const player=findSafeSpawn(world,benchmark.x,benchmark.z);
assert.ok(distantMeshes.every(({anchor:[x,y,z]})=>
  Math.hypot(x-player.x,y-player.feet-1.55,z-player.z)<13),'Catalog measurement requires full foliage detail');
const expectedVertices=objects.reduce((sum,object)=>sum+object.positions.length/3,0);
const url=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
let counts,storageSummary,frameSamples;
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);
  const canvas=page.locator('#scene');
  const waitForVisible=(currentPage,count)=>currentPage.waitForFunction(value=>{
    const data=document.querySelector('#scene').dataset;
    return Number(data.nonblockInstances)===value && Number(data.loadedChunks)===25;
  },count,{timeout:45000});
  await waitForVisible(page,layout.length);
  const setView=aim=>page.evaluate(({x,z,point})=>{
    const at=window.__mythwroughtTest.teleport(x,z);
    window.__mythwroughtTest.aimAtStagedPoint(...point);
    return at;
  },aim);
  // The original horizontal-only assertion rejects the correct shared-height
  // center at feet >=16, even if all 25 expected owners have settled. Derive
  // both sides of the exact floor boundary from the real legacy fixture; do
  // not alter camera position, gameplay, timeout or the 25-owner budget.
  function expectedTerrain(pose){
    const {x,feet,z}=pose, horizontal=chunkCoord(x)+','+chunkCoord(z);
    const sections=sectionWindow(feet,feet<3&&surfaceOpeningNearby(world,x,z));
    const base=sections.length===1&&sections[0]===0?horizontal:horizontal+'|'+sections.join(',');
    const occupancy=upperOccupancyRevision(world);
    const body=(physicalBodyRegions(pose)??[]).map(r=>r.key);
    const active=runtimeSectionForY(feet)??0;
    const center=base+(feet>=16||feet>=3&&occupancy!=='0:0:0:0:0:0'?
      '|height:'+active+':'+Number(feet>=16)+':'+occupancy+':'+body.join(';')+':'+[x,feet,z].map(v=>Math.floor(v/2)).join(','):'');
    const legacy=sections.flatMap(section=>chunkWindow(x,z,sectionChunkRadius(section,sections[0])).map(c=>({...c,section})));
    const owners=planHeightStream(world,pose,legacy).map(c=>runtimeMeshKey(c.cx,c.cz,c.section)).sort();
    assert.equal(owners.length,25,'Original catalog owner budget');
    return {center,owners};
  }
  const waitForTerrain=async(pose)=>{
    const {x,z,feet}=pose;
    // Ground contact may settle a tiny fraction below the integer debug
    // spawn height. Enumerate exact expected signatures on either side.
    const options=[0,-.00001,-.001,.00001,.001].map(d=>expectedTerrain({x,z,feet:feet+d}));
    const expected={pose,options};
    try{
      await page.waitForFunction(({pose,options})=>{
        const d=document.querySelector('#scene').dataset,s=window.__mythwroughtTest.snapshot();
        return Math.abs(Number(d.playerX)-pose.x)<.001&&Math.abs(Number(d.playerZ)-pose.z)<.001&&
          Math.abs(Number(d.playerFeet)-pose.feet)<.01&&d.playerGrounded==='true'&&d.playerColliding==='false'&&
          Number(d.loadedChunks)===25&&Number(d.pendingChunks)===0&&s.pending.length===0&&
          options.some(o=>d.chunkCenter===o.center&&JSON.stringify([...s.chunks].sort())===JSON.stringify(o.owners));
      },expected,{timeout:45000});
    }catch(error){
      const actual=await page.evaluate(()=>({dataset:{...document.querySelector('#scene').dataset},snapshot:window.__mythwroughtTest.snapshot()}));
      await writeFile(directory+'/terrain-timeout.json',JSON.stringify({expected,actual,errors},null,2));
      throw Error('Exact height-aware terrain readiness mismatch '+JSON.stringify({expected,actual,errors}),{cause:error});
    }
    if(feet>=16)console.log('HEIGHT_AWARE_CATALOG_TERRAIN',JSON.stringify(await page.evaluate(()=>({center:document.querySelector('#scene').dataset.chunkCenter,feet:document.querySelector('#scene').dataset.playerFeet,owners:window.__mythwroughtTest.snapshot().chunks}))));
  };
  await waitForTerrain(await setView(benchmark));
  await page.waitForFunction(expected=>{
    const data=document.querySelector('#scene').dataset;
    return Number(data.nonblockVertices)===expected&&Number(data.nonblockFarInstances??0)===0;
  },expectedVertices,{timeout:15000});
  const before=await page.evaluate(key=>localStorage.getItem(key),classicSaveKey);
  counts=await canvas.evaluate(c=>({
    instances:Number(c.dataset.nonblockInstances),vertices:Number(c.dataset.nonblockVertices),
    gpuBytes:Number(c.dataset.nonblockGpuBytes),drawCalls:Number(c.dataset.nonblockDrawCalls),
    terrainChunks:Number(c.dataset.loadedChunks)
  }));
  assert.equal(counts.vertices,expectedVertices);
  assert.equal(counts.gpuBytes,counts.vertices*36);
  assert.equal(counts.drawCalls,1);
  assert.equal(counts.terrainChunks,25);
  const sampleFrames=()=>page.evaluate(async()=>{
    const elapsed=[];
    let last=await new Promise(resolve=>requestAnimationFrame(resolve));
    for(let i=0;i<24;i++){
      const next=await new Promise(resolve=>requestAnimationFrame(resolve));
      elapsed.push(next-last);
      last=next;
    }
    elapsed.sort((a,b)=>a-b);
    return {count:elapsed.length,medianMs:(elapsed[11]+elapsed[12])/2,p95Ms:elapsed[22]};
  });
  frameSamples={softwareRenderer:'Chromium SwiftShader',withScenery:await sampleFrames()};
  for(const [i,object] of objects.entries()){
    await waitForTerrain(await setView(views[i]));
    try{
      await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
        object.instanceKey,{timeout:8000});
    }catch(error){
      const status=await canvas.evaluate(c=>({x:c.dataset.playerX,z:c.dataset.playerZ,
        feet:c.dataset.playerFeet,target:c.dataset.nonblockTarget,block:c.dataset.targetBlock}));
      throw Error('In-game target mismatch for '+object.sceneId+' '+JSON.stringify(status),{cause:error});
    }
    const name=object.sceneId.split(':').at(-1);
    const file=directory+'/'+name+'.png';
    const image=await page.screenshot({path:file});
    const png=PNG.sync.read(image);
    assert.deepEqual([png.width,png.height],[932,430]);
    assert.ok(new Set(png.data.filter((_,k)=>k%64===0)).size>=32);
    await page.locator('#dig').tap();
    await waitForVisible(page,objects.length-i-1);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    checks.push({sceneId:object.sceneId,instanceKey:object.instanceKey,
      triangles:object.positions.length/9,file,sha256:digest(image)});
    console.log('PASS',object.sceneId,object.positions.length/9,'triangles');
  }
  await waitForTerrain(await setView(benchmark));
  await waitForVisible(page,0);
  frameSamples.withoutScenery=await sampleFrames();
  const tombstones=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).tombstones,stageSaveKey);
  assert.deepEqual(tombstones,[...objects.map(o=>o.instanceKey)].sort());
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),classicSaveKey),before);
  await page.close();
  const reopened=await context.newPage();
  reopened.on('pageerror',error=>errors.push(error.message));
  await reopened.goto(url);
  await waitForVisible(reopened,0);
  assert.equal(await reopened.locator('#scene').getAttribute('data-nonblock-vertices'),'0');
  assert.deepEqual(errors,[]);
  storageSummary={tombstones:tombstones.length,schema1SaveBytesUnchanged:true,reopenedVisibleCount:0};
  await context.close();
}finally{
  await browser.close();
}
const sourceDirectories=['src/nonblock','src/nonblock-environments24','src/nonblock-scene48','src/nonblock-fittings36'];
const sourceFiles=['src/main.mjs','src/voxel.mjs','src/physics.mjs','tests/nonblock-catalog-browser.mjs'];
for(const directory of sourceDirectories){
  for(const path of (await readdir(directory)).filter(name=>name.endsWith('.mjs')).sort())sourceFiles.push(directory+'/'+path);
}
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({counts,frameSamples,storageSummary,checks,sourceSha256},null,2)+'\n');
console.log('PASS all',checks.length,'families in the shared renderer, MINE action and cold reopen');
console.log(JSON.stringify({counts,frameSamples,storageSummary}));
