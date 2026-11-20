import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {chunkCoord,raycast} from '../src/voxel.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
import {RENDER_PREF} from '../src/render-budget.mjs';
import {activateFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {planStagedHabitat} from '../src/nonblock/staged-habitats.mjs';

const origin=process.env.NONBLOCK_HABITAT_ORIGIN||'http://127.0.0.1:4173';
const comparison=process.env.NONBLOCK_HABITAT_COMPARISON;
if(comparison&&!['before','after'].includes(comparison))throw Error('Invalid habitat comparison label');
const comparisons={
  tumblebrush:[{habitat:'desert',column:[512,0],sceneId:'nonblock:d:tumblebrush',variant:1,
    view:{pose:[512.5,-.5],point:[512.41583252,9.30278524,.53196516]},source:'tumblebrush.mjs'}],
  'dwarf-juniper':[{habitat:'mountain',column:[-512,0],sceneId:'nonblock:d:dwarf-juniper',variant:2,
    view:{pose:[-511.5,-.5],point:[-511.68595378,13.16605028,.43378700]},source:'dwarf-juniper.mjs'}],
  'prickly-pear':[{habitat:'desert',column:[512,0],sceneId:'nonblock:d:prickly-pear-cactus',variant:2,
    view:{pose:[512.5,-.5],point:[512.61600749,9.77522405,.79790874]},source:'prickly-pear-cactus.mjs'}],
  'succulent-alpine':[
    {habitat:'desert',column:[512,0],sceneId:'nonblock:d:agave-rosette',variant:2,
      view:{pose:[512.5,-.5],point:[512.43902588,9.16833305,.71542436]},source:'agave-rosette.mjs'},
    {habitat:'mountain',column:[-512,0],sceneId:'nonblock:d:alpine-wildflower',variant:1,
      view:{pose:[-511.5,-.5],point:[-511.53002930,13.36666648,.42061684]},source:'alpine-wildflower.mjs'}
  ],
  arid:[
    {habitat:'desert',column:[512,0],sceneId:'nonblock:d:desert-scrub',variant:2,
      view:{pose:[512.5,-.5],point:[512.62782796,9.24603335,.42638499]},source:'desert-scrub.mjs',
      file:'desert-scrub'},
    {habitat:'desert',column:[561,0],sceneId:'nonblock:d:column-cactus',variant:2,
      view:{pose:[561.5,-.5],point:[561.52925618,6.82999992,.52871178]},source:'column-cactus.mjs',
      file:'column-cactus',checkSolid:true}
  ],
  grasses:[
    {habitat:'desert',column:[512,0],sceneId:'nonblock:d:saltgrass',variant:2,
      view:{pose:[512.5,-.5],point:[512.60579427,9.33146636,.51460687]},source:'saltgrass.mjs'},
    {habitat:'snow',column:[0,512],sceneId:'nonblock:d:snowgrass',variant:1,
      view:{pose:[.5,511.5],point:[.56369885,10.15166664,512.50976563]},source:'snowgrass.mjs'}
  ],
  'biome-flora':[
    {habitat:'desert',column:[512,0],sceneId:'nonblock:d:desert-bloom',variant:2,
      view:{pose:[512.5,-.5],point:[512.40311686,9.27933311,.52881004]},source:'desert-bloom.mjs'},
    {habitat:'snow',column:[0,512],sceneId:'nonblock:d:frost-fern',variant:1,
      view:{pose:[.5,511.5],point:[.67367985,10.35231654,512.71217855]},source:'frost-fern.mjs'}
  ]
};
const sampleName=process.env.NONBLOCK_HABITAT_SAMPLE||'biome-flora';
if(comparison&&!Object.hasOwn(comparisons,sampleName))throw Error('Invalid habitat comparison sample');
const directory=comparison?'artifacts/nonblock-'+sampleName+'-'+comparison:'artifacts/nonblock-habitat';
const seed=179;
const requested=comparison?comparisons[sampleName]:[
  {habitat:'desert',column:[512,0],sceneId:'nonblock:d:agave-rosette',variant:2},
  {habitat:'snow',column:[0,512],sceneId:'nonblock:d:frost-fern',variant:1},
  {habitat:'mountain',column:[-512,0],sceneId:'nonblock:d:alpine-wildflower'},
  {habitat:'enchanted',column:[0,-512],sceneId:'scene48:enchanted-flower',variant:2}
];
const profileStorage=new Map();
const world=activateFourRegionProfile({
  getItem:key=>profileStorage.get(key)??null,
  setItem:(key,bytes)=>profileStorage.set(key,bytes),
  length:0,key:()=>null
},seed,{explicitNewWorld:true});
const generator=world.generationProfile.generator;
const layout=planStagedHabitat(world,requested);
assert.equal(layout.length,requested.length);
const scene=createCandidateScene(seed,generator,layout,{
  storage:{getItem:()=>null},blockAt:(...point)=>Boolean(world.get(...point)),
  voxelPick:(...ray)=>raycast(world,...ray)
});
const stageRoute=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));
const stageKey='mythwrought:nonblock-stage:v1:'+generator+':'+seed;
const saved=JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]});
profileStorage.set(worldSlotKey(seed),saved);
profileStorage.set(SELECTED_SEED_KEY,String(seed));
profileStorage.set(RENDER_PREF,'economy');
const fixture=[...profileStorage];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
function stagingView(object){
  const [x,,z]=object.anchor;
  for(const [dx,dz] of [[0,-2],[-2,0],[2,0],[0,2],[-2,-1],[2,1],[1,-2],[-1,2]]){
    const pose=[x+dx+.5,z+dz+.5];
    const player=findSafeSpawn(world,...pose);
    const eye=[player.x,player.feet+1.55,player.z];
    const positions=object.positions;
    for(let i=0;i<positions.length;i+=9){
      const point=[0,1,2].map(k=>(positions[i+k]+positions[i+3+k]+positions[i+6+k])/3);
      const hit=scene.pick(eye,point.map((coord,k)=>coord-eye[k]));
      if(hit?.instanceKey===object.instanceKey)return {pose,point};
    }
  }
  throw Error('No natural camera for '+object.sceneId);
}
const samples=scene.visible().map((object,index)=>({
  habitat:requested[index].habitat,placement:layout[index],instanceKey:object.instanceKey,
  ground:world.get(object.anchor[0],object.anchor[1]-1,object.anchor[2]),
  triangles:object.positions.length/9,collisionParts:object.colliders.length,view:requested[index].view??stagingView(object)
}));
assert.equal(samples.length,requested.length);
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[],errors=[];
async function observed(page,condition,timeout){
  const deadline=Date.now()+timeout;
  do{
    const state=await page.evaluate(()=>({...document.querySelector('#scene').dataset}));
    if(condition(state))return;
    await delay(450);
  }while(Date.now()<deadline);
  throw Error('Expected staged state did not appear');
}
try{
  const context=await browser.newContext({viewport:{width:932,height:430},
    hasTouch:true,isMobile:true,deviceScaleFactor:1,
    storageState:{cookies:[],origins:[{origin,localStorage:fixture.map(([name,value])=>({name,value}))}]}
  });
  const open=async()=>{
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(stageRoute);
    try{await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:25000});}
    catch(error){throw Error('Profiled stage failed to open. '+errors.join(' · '),{cause:error});}
    return page;
  };
  const move=(page,{pose,point})=>page.evaluate(({pose,point})=>{
    const player=window.__mythwroughtTest.teleport(...pose);
    window.__mythwroughtTest.aimAtStagedPoint(...point);
    return player;
  },{pose,point});
  const settled=({x,z})=>scene=>Number(scene.loadedChunks)===25&&Number(scene.pendingChunks)===0&&
    scene.chunkCenter===chunkCoord(x)+','+chunkCoord(z)&&Number(scene.renderedMeshVertices)>0;
  const page=await open();
  for(const sample of samples){
    const player=await move(page,sample.view);
    const terrainReady=settled(player);
    try{
      await observed(page,terrainReady,120000);
      await move(page,sample.view);
      await observed(page,scene=>terrainReady(scene)&&scene.nonblockTarget===sample.instanceKey&&
        Number(scene.nonblockInstances)===1,15000);
    }catch(error){
      const data=await page.locator('#scene').evaluate(canvas=>({
        ...canvas.dataset,profile:window.__mythwroughtTest.fourBiomeProfile(),
        status:document.querySelector('#status').textContent,helpHidden:document.querySelector('#help')?.hidden
      }));
      await context.close();
      throw Error('Profiled '+sample.habitat+' did not settle at the target. '+JSON.stringify(data),{cause:error});
    }
    const rendererState=await page.locator('#scene').evaluate(canvas=>{
      const d=canvas.dataset;
      return {instances:Number(d.nonblockInstances),vertices:Number(d.nonblockVertices),
        gpuBytes:Number(d.nonblockGpuBytes),drawCalls:Number(d.nonblockDrawCalls),
        terrainChunks:Number(d.loadedChunks)};
    });
    assert.deepEqual(rendererState,{
      instances:1,vertices:sample.triangles*3,gpuBytes:sample.triangles*108,drawCalls:1,terrainChunks:25
    });
    const needsBodyProbe=requested.find(request=>request.sceneId===sample.placement.sceneId)?.checkSolid;
    const atBody=()=>page.evaluate(anchor=>{
      try{return window.__mythwroughtTest.teleportCave(...anchor).x;}
      catch(error){if(error.message.includes('Unsafe'))return null;throw error;}
    },sample.placement.anchor);
    if(needsBodyProbe)assert.equal(await atBody(),null);
    const name=requested.find(request=>request.sceneId===sample.placement.sceneId)?.file??sample.habitat;
    const file=directory+'/'+name+'.png';
    const image=await page.screenshot({path:file,timeout:90000});
    const decoded=PNG.sync.read(image);
    assert.deepEqual([decoded.width,decoded.height],[932,430]);
    assert.ok(new Set(decoded.data.filter((_,i)=>i%64===0)).size>32);
    await page.locator('#dig').tap();
    await observed(page,scene=>Number(scene.nonblockInstances)===0,15000);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    if(needsBodyProbe)assert.equal(await atBody(),sample.placement.anchor[0]+.5);
    captures.push({...sample,rendererState,file,width:932,height:430,sha256:digest(image),
      ...(needsBodyProbe?{bodyCollisionReleased:true}:{})
    });
    console.log('PASS profiled',sample.habitat,'ground',sample.ground,sample.placement.sceneId);
  }
  await page.close();
  const reopened=await open();
  const reopenedAt=await move(reopened,samples.at(-1).view);
  const reopenedTerrain=settled(reopenedAt);
  await observed(reopened,scene=>reopenedTerrain(scene)&&Number(scene.nonblockInstances)===0,120000);
  const check=await reopened.evaluate(({fixture,stageKey})=>({
    ordinary:fixture.map(([key])=>localStorage.getItem(key)),
    primary:localStorage.getItem(stageKey),backup:localStorage.getItem(stageKey+':previous-good')
  }),{fixture,stageKey});
  assert.deepEqual(check.ordinary,fixture.map(([,value])=>value));
  assert.equal(check.backup,check.primary);
  assert.deepEqual(JSON.parse(check.primary).tombstones,samples.map(sample=>sample.instanceKey).sort());
  assert.deepEqual(errors,[]);
  await context.close();
}finally{await browser.close();}
const source=['src/main.mjs','src/nonblock/staged-habitats.mjs','src/nonblock/candidate-scene.mjs',
  'src/nonblock/candidate-families.mjs','src/manual-biomes/profile-world.mjs',
  'src/manual-biomes/desert-m3.mjs','src/manual-biomes/three-regions-m4.mjs','src/render-budget.mjs',
  'tests/nonblock-habitat-browser.mjs'];
if(comparison)source.push(...requested.map(sample=>'src/nonblock-environments24/'+sample.source));
if(comparison&&['prickly-pear','arid'].includes(sampleName))source.push('src/nonblock/staged-inherited-families.mjs');
const sourceSha256=Object.fromEntries(await Promise.all(source.map(async file=>[file,digest(await readFile(file))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  seed,generator,renderPreset:'economy',sourceSha256,captures,nonemptySchema1AndProfileBytesUnchanged:true
},null,2)+'\n');
