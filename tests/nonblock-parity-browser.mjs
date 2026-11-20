import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {chunkCoord,raycast} from '../src/voxel.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
import {FrameHistory} from '../src/preflight.mjs';
import {RENDER_PREF} from '../src/render-budget.mjs';
import {activateFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {planStagedHabitat} from '../src/nonblock/staged-habitats.mjs';

const landscapeSizes={'667x375':[667,375],'844x390':[844,390],'932x430':[932,430]};
const viewport=process.env.NONBLOCK_PARITY_VIEWPORT??'932x430';
assert.ok(Object.hasOwn(landscapeSizes,viewport),'Unknown landscape parity viewport');
const seed=179,[width,height]=landscapeSizes[viewport];
const origin=process.env.NONBLOCK_PARITY_ORIGIN||'http://127.0.0.1:4173';
const directory='artifacts/nonblock-parity'+(viewport==='932x430'?'':'-'+viewport);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixtures=[
  {habitat:'meadow',pose:[9.5,4.5],point:[9.8,10.6,7.9],sites:[
    ['scene48:low-grass',8,7],['scene48:buttercup-bunch',9,7],
    ['scene48:short-fern',10,7],['scene48:meadow-fescue',11,7],
    ['scene48:clover-clump',8,8],['scene48:grass-plume',9,8],
    ['scene48:seedhead-meadow-mix',10,8],['scene48:meadow-sedge',11,8]
  ]},
  {habitat:'desert',pose:[510.5,-2.5],point:[510.7,10.2,.8],sites:[
    ['nonblock:d:desert-bloom',509,0],['nonblock:d:agave-rosette',510,0],
    ['nonblock:d:saltgrass',511,0],['nonblock:d:prickly-pear-cactus',512,0],
    ['nonblock:d:column-cactus',509,1],['nonblock:d:tumblebrush',510,1],
    ['nonblock:d:desert-scrub',511,1]
  ]},
  {habitat:'snow',pose:[.5,508.5],point:[.15,11.05,511.8],sites:[
    ['nonblock:d:frost-fern',-2,511],['nonblock:d:snowgrass',-1,511],
    ['nonblock:d:alpine-wildflower',0,511],['nonblock:d:dwarf-juniper',1,511]
  ]},
  {habitat:'mountain',pose:[-512.5,-3.5],point:[-512.2,14.1,-.1],sites:[
    ['nonblock:d:dwarf-juniper',-514,-1],['nonblock:d:alpine-wildflower',-513,-1],
    ['nonblock:e:pebble-scatter',-512,-1],['nonblock:d:dwarf-juniper',-511,0],
    ['nonblock:d:alpine-wildflower',-513,0],['nonblock:e:pebble-scatter',-512,0]
  ]},
  {habitat:'enchanted',pose:[.5,-516.5],point:[.1,10.14,-513.1],sites:[
    ['scene48:lantern-mushroom',-2,-514],['scene48:moss-cushion',-1,-514],
    ['scene48:enchanted-flower',0,-514],['scene48:starpetal',1,-514],
    ['scene48:woodland-shrub',-2,-513],['scene48:ringed-morel',-1,-513],
    ['scene48:inkcap-cluster',0,-513],['scene48:woodland-sapling',1,-513]
  ]},
  {habitat:'fittings',pose:[9.5,4.5],point:[9.9,10.6,7.7],sites:[
    ['scene36:signpost',8,7],['scene36:campfire-fuel-stack',9,7],
    ['scene36:brazier',10,7],['scene36:freestanding-torch',11,7],
    ['scene36:broken-pottery-scatter',9,8],['scene48:meadow-fescue',10,8]
  ]},
  {habitat:'cave',pose:[16,3,4],point:[17.18393257,4.41,7.42099919],sites:[
    ['flowstone-curtain',17,4,5],['geode-opening',16,5,6,3],
    ['mineral-encrustation',16,3,6,2],['clustered-dripstone',18,4,6],
    ['branching-crystal-cluster',16,4,7],['crystal-shard',18,3,7],
    ['giant-stalagmite-spire',17,3,7],['small-stalagmite',17,4,8],['cave-rubble-cluster',15,4,8]
  ]}

];

const initial=new Map();
const world=activateFourRegionProfile({
  getItem:key=>initial.get(key)??null,
  setItem:(key,bytes)=>initial.set(key,bytes),
  length:0,key:()=>null
},seed,{explicitNewWorld:true});
const generator=world.generationProfile.generator, stageKey='mythwrought:nonblock-stage:v1:'+generator+':'+seed;
initial.set(worldSlotKey(seed),JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]}));
initial.set(SELECTED_SEED_KEY,String(seed));
initial.set(RENDER_PREF,'economy');
const documentedStorage=[...initial];

function nearTarget(scene,object){
  const [x,,z]=object.anchor;
  for(const [dx,dz] of [[0,-1],[-1,0],[1,0],[0,1],[0,-2],[1,-1],[-1,-1],[0,2]]){
    const pose=[x+dx+.5,z+dz+.5],player=findSafeSpawn(world,...pose);
    const eye=[player.x,player.feet+1.55,player.z],positions=object.positions;
    for(let i=0;i<positions.length;i+=9){
      const point=[0,1,2].map(axis=>(positions[i+axis]+positions[i+axis+3]+positions[i+axis+6])/3);
      if(scene.pick(eye,point.map((value,index)=>value-eye[index]))?.instanceKey===object.instanceKey)
        return {pose,point};
    }
  }
  throw Error('No unobstructed field target for '+object.sceneId);
}

const selected=process.env.NONBLOCK_PARITY_HABITATS?.split(',');
const plans=fixtures.filter(({habitat})=>!selected||selected.includes(habitat)).map(({habitat,pose,point,sites})=>{
  const requests=sites.map(([sceneId,x,z,caveZ,orientation],index)=>habitat==='cave'?
    {habitat,sceneId:'nonblock:e:'+sceneId,anchor:[x,z,caveZ],orientation,variant:2}:
    {habitat:habitat==='fittings'?'meadow':habitat,
      sceneId:sceneId.startsWith('scene36:')?'scene48:meadow-fescue':sceneId,
      column:[x,z],variant:index%4});
  const planned=planStagedHabitat(world,requests);
  assert.equal(planned.length,sites.length,habitat+' is missing a natural mount');
  const layout=habitat==='fittings'?planned.map((entry,index)=>({...entry,sceneId:sites[index][0]})):planned;
  const scene=createCandidateScene(seed,generator,layout,{
    storage:{getItem:()=>null},blockAt:(...cell)=>Boolean(world.get(...cell)),
    voxelPick:(...ray)=>raycast(world,...ray)
  });
  const objects=scene.visible();
  assert.equal(objects.length,sites.length);
  const target=objects[0];
  const focus=habitat==='cave'?{
    pose,point:[17.12795703,4.92287588,5.55060673]
  }:nearTarget(scene,target);
  if(habitat==='cave'){
    const eye=[pose[0]+.5,pose[1]+1.55,pose[2]+.5];
    const ray=focus.point.map((value,index)=>value-eye[index]);
    assert.equal(scene.pick(eye,ray)?.instanceKey,target.instanceKey);
  }
  return {habitat,overview:{pose,point},layout,target:target.instanceKey,focus,
    expectedBytes:objects.reduce((sum,object)=>sum+object.positions.length*12,0)};
});
assert.ok(plans.length&&(!selected||selected.length===plans.length),'Unknown parity habitat');

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const errors=[],captures=[],removals=[],observations=[];
try{
  const context=await browser.newContext({
    viewport:{width,height},deviceScaleFactor:1,hasTouch:true,isMobile:true,
    storageState:{cookies:[],origins:[{origin,localStorage:documentedStorage.map(([name,value])=>({name,value}))}]}
  });
  const open=async route=>{
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(route);
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
    return page;
  };
  async function move(page,{pose,point},count,target){
    const player=await page.evaluate(({pose,point})=>{
      const api=window.__mythwroughtTest;
      const p=pose.length===3?api.teleportCave(...pose):api.teleport(...pose);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
      return p;
    },{pose,point});
    await page.waitForFunction(({center,count})=>{
      const d=document.querySelector('#scene').dataset;
      return d.chunkCenter===center&&Number(d.loadedChunks)===25&&Number(d.pendingChunks)===0&&
        Number(d.nonblockInstances)===count&&Number(d.renderedMeshVertices)>0;
    },{center:chunkCoord(player.x)+','+chunkCoord(player.z),count},{timeout:120000,polling:350});
    if(target){
      await page.evaluate(point=>window.__mythwroughtTest.aimAtStagedPoint(...point),point);
      await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
        target,{timeout:18000});
    }
  }
  async function capture(page,plan,label){
    const render=await page.locator('#scene').evaluate(canvas=>{
      const d=canvas.dataset;
      return {instances:Number(d.nonblockInstances),gpuBytes:Number(d.nonblockGpuBytes),
        drawCalls:Number(d.nonblockDrawCalls),terrainChunks:Number(d.loadedChunks)};
    });
    assert.deepEqual(render,{instances:plan.layout.length,gpuBytes:plan.expectedBytes,drawCalls:1,terrainChunks:25});
    const filename=directory+'/'+plan.habitat+'-'+label+'.png';
    const image=await page.screenshot({path:filename,timeout:90000});
    const png=PNG.sync.read(image);
    assert.deepEqual([png.width,png.height],[width,height]);
    assert.ok(new Set(png.data.filter((_,index)=>index%64===0)).size>32);
    captures.push({habitat:plan.habitat,view:plan[label],render,
      placement:plan.layout,filename,sha256:digest(image),width,height});
  }

  async function sampleOverviewFrames(page,habitat){
    const timestamps=await page.evaluate(async()=>{
      const result=[];
      for(let i=0;i<19;i++)result.push(await new Promise(resolve=>requestAnimationFrame(resolve)));
      return result;
    });
    const history=new FrameHistory(18);
    for(const timestamp of timestamps)history.frame(timestamp,true);
    const stats=history.stats();
    assert.ok(stats.frames>=12,'Expected a warm frame sample for '+habitat);
    observations.push({habitat,softwareRenderer:'Chromium SwiftShader',...stats});
  }

  for(const plan of plans){
    const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(plan.layout));
    const page=await open(route);
    await move(page,plan.overview,plan.layout.length);
    await capture(page,plan,'overview');
    await sampleOverviewFrames(page,plan.habitat);
    await move(page,plan.focus,plan.layout.length,plan.target);
    await capture(page,plan,'focus');
    await page.locator('#dig').tap();
    await page.waitForFunction(count=>Number(document.querySelector('#scene').dataset.nonblockInstances)===count,
      plan.layout.length-1,{timeout:15000});
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    await page.close();
    const reopened=await open(route);
    await move(reopened,plan.focus,plan.layout.length-1);
    const storage=await reopened.evaluate(({documentedStorage,key})=>({
      ordinary:documentedStorage.map(([name])=>localStorage.getItem(name)),
      primary:localStorage.getItem(key),backup:localStorage.getItem(key+':previous-good')
    }),{documentedStorage,key:stageKey});
    removals.push(plan.target);
    assert.deepEqual(storage.ordinary,documentedStorage.map(([,bytes])=>bytes));
    assert.equal(storage.primary,storage.backup);
    assert.deepEqual(JSON.parse(storage.primary).tombstones,[...removals].sort());
    await reopened.close();
    console.log('PASS mixed',plan.habitat,plan.layout.length,'families',plan.expectedBytes,'GPU bytes');
  }
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const paths=['src/main.mjs','src/voxel.mjs','src/nonblock/candidate-scene.mjs','src/nonblock/staged-habitats.mjs',
  'src/nonblock/candidate-families.mjs','src/preflight.mjs','nonblock-stage-assets.json','tests/nonblock-parity-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async name=>[name,digest(await readFile(name))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  seed,generator,sourceSha256,captures,observations,removals,nonemptySchema1AndProfileBytesUnchanged:true
},null,2)+'\n');
