import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {raycast} from '../src/voxel.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
import {RENDER_PREF} from '../src/render-budget.mjs';
import {activateFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {planStagedHabitat} from '../src/nonblock/staged-habitats.mjs';

const origin=process.env.NONBLOCK_HABITAT_ORIGIN||'http://127.0.0.1:4173';
const directory='artifacts/nonblock-habitat';
const seed=179;
const requested=[
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
  ground:world.get(object.anchor[0],object.anchor[1]-1,object.anchor[2]),view:stagingView(object)
}));
assert.equal(samples.length,4);
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
    hasTouch:true,isMobile:true,deviceScaleFactor:1});
  await context.addInitScript(entries=>{
    for(const [key,value] of entries)if(localStorage.getItem(key)===null)localStorage.setItem(key,value);
  },fixture);
  const open=async()=>{
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(stageRoute);
    try{await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:25000});}
    catch(error){throw Error('Profiled stage failed to open. '+errors.join(' · '),{cause:error});}
    return page;
  };
  const move=(page,{pose,point})=>page.evaluate(({pose,point})=>{
    window.__mythwroughtTest.teleport(...pose);
    window.__mythwroughtTest.aimAtStagedPoint(...point);
  },{pose,point});
  const page=await open();
  for(const sample of samples){
    await move(page,sample.view);
    try{
      await observed(page,scene=>Number(scene.loadedChunks)===25,120000);
      await move(page,sample.view);
      await observed(page,scene=>scene.nonblockTarget===sample.instanceKey&&Number(scene.nonblockInstances)===1,15000);
    }catch(error){
      const data=await page.locator('#scene').evaluate(canvas=>({
        ...canvas.dataset,profile:window.__mythwroughtTest.fourBiomeProfile(),
        status:document.querySelector('#status').textContent,helpHidden:document.querySelector('#help')?.hidden
      }));
      await context.close();
      throw Error('Profiled '+sample.habitat+' did not settle at the target. '+JSON.stringify(data),{cause:error});
    }
    const file=directory+'/'+sample.habitat+'.png';
    const image=await page.screenshot({path:file});
    const decoded=PNG.sync.read(image);
    assert.deepEqual([decoded.width,decoded.height],[932,430]);
    assert.ok(new Set(decoded.data.filter((_,i)=>i%64===0)).size>32);
    captures.push({...sample,file,width:932,height:430,sha256:digest(image)});
    await page.locator('#dig').tap();
    await observed(page,scene=>Number(scene.nonblockInstances)===0,15000);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    console.log('PASS profiled',sample.habitat,'ground',sample.ground,sample.placement.sceneId);
  }
  await page.close();
  const reopened=await open();
  await move(reopened,samples.at(-1).view);
  await observed(reopened,scene=>Number(scene.loadedChunks)===25&&Number(scene.nonblockInstances)===0,120000);
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
const sourceSha256=Object.fromEntries(await Promise.all(source.map(async file=>[file,digest(await readFile(file))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  seed,generator,renderPreset:'economy',sourceSha256,captures,nonemptySchema1AndProfileBytesUnchanged:true
},null,2)+'\n');
