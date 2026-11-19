import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {VoxelWorld,collides,raycast,terrainHeight} from '../src/voxel.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {inheritedStageFamilies} from '../src/nonblock/staged-inherited-families.mjs';

const seed=179;
const base=process.env.NONBLOCK_EXTRA_ORIGIN||'http://127.0.0.1:4173';
const directory='artifacts/nonblock-inherited-extra';
const world=new VoxelWorld(seed);
const deps={
  storage:{getItem:()=>null},
  blockAt:(...p)=>Boolean(world.get(...p)),
  voxelPick:(...ray)=>raycast(world,...ray)
};
const viewpoints=[
  [0,-3],[0,3],[-3,0],[3,0],[-2,-2],[2,-2],[-2,2],[2,2],
  [-2,0],[2,0],[0,-2],[0,2],[-1,0],[1,0],[0,-1],[0,1]
];
const digest=body=>createHash('sha256').update(body).digest('hex');
const samples=[];
const targetFamily=process.env.NONBLOCK_EXTRA_FAMILY;
const sceneFor=placement=>createCandidateScene(seed,'legacy',[placement],deps);
const occupied=(x,y,z)=>world.get(x,y,z)!==0;

function findView(scene,object){
  const [x,y,z]=object.anchor, points=object.positions;
  for(const [dx,dz] of viewpoints){
    for(let feet=y-3;feet<=y+1;feet++){
      if(!occupied(x+dx,feet-1,z+dz)||collides(world,x+dx+.5,feet+.01,z+dz+.5))continue;
      const eye=[x+dx+.5,feet+1.56,z+dz+.5];
      const center=object.min.map((n,i)=>(n+object.max[i])/2);
      const targets=[];
      for(let i=0;i<points.length;i+=9){
        const point=[0,1,2].map(k=>(points[i+k]+points[i+3+k]+points[i+6+k])/3);
        targets.push(point);
      }
      targets.sort((a,b)=>Math.hypot(...a.map((n,i)=>n-center[i]))-
        Math.hypot(...b.map((n,i)=>n-center[i])));
      for(const point of targets){
        if(scene.pick(eye,point.map((n,k)=>n-eye[k]))?.instanceKey===object.instanceKey)
          return {cell:[x+dx,feet,z+dz],point};
      }
    }
  }
  return null;
}

for(const [sceneId,family] of inheritedStageFamilies){
  if(targetFamily&&sceneId!==targetFamily)continue;
  const orientations=family.wall?[0,1,2,3]:[0];
  const yOrder=family.attachment==='ceiling'?[9,8,10,7,6,5,4,3,2,1,0,11,12]:
    [10,9,11,8,12,7,6,5,4,3,2,1,0,13,14];
  search:for(let x=7;x<=27;x++)for(let z=5;z<=20;z++)for(const y of yOrder){
    if(occupied(x,y,z))continue;
    if(!family.wall&&family.attachment!=='ceiling'&&!occupied(x,y-1,z))continue;
    if(family.attachment==='ceiling'&&!occupied(x,y+1,z))continue;
    for(const orientation of orientations){
      const placement={sceneId,anchor:[x,y,z],variant:2,orientation};
      const scene=sceneFor(placement);
      const [object]=scene.visible();
      if(!object)continue;
      const view=findView(scene,object);
      if(!view)continue;
      samples.push({placement,view,instanceKey:object.instanceKey,solid:object.colliders.length>0,
        triangles:object.positions.length/9,underSurface:terrainHeight(x,z,seed)-y>=3});
      break search;
    }
  }
  assert.equal(samples.at(-1)?.placement.sceneId,sceneId,'No natural support and target for '+sceneId);
}
console.log('Located natural supports for '+samples.length+' inherited families');

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const results=[];
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
  });
  const savedWorld=JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]});
  await context.addInitScript(raw=>{
    const key='mythwrought-v002-world-179';
    if(localStorage.getItem(key)===null)localStorage.setItem(key,raw);
  },savedWorld);
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const count=n=>page.waitForFunction(value=>
    Number(document.querySelector('#scene').dataset.nonblockInstances)===value,n,{timeout:45000});
  for(const sample of samples){
    const {placement,view,instanceKey}=sample;
    const route=base+'/?nonblock-stage='+encodeURIComponent(JSON.stringify([placement]));
    await page.goto(route);
    await count(1);
    await page.evaluate(cell=>window.__mythwroughtTest.teleportCave(...cell),view.cell);
    // The helper starts 0.01 above the floor. Aim after gravity settles so
    // thin authored strands are tested at the real standing eye position.
    await page.waitForFunction(y=>
      Math.abs(Number(document.querySelector('#scene').dataset.playerFeet)-y)<.002,
      view.cell[1],{timeout:15000});
    await page.evaluate(point=>window.__mythwroughtTest.aimAtStagedPoint(...point),view.point);
    try{
      await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
        instanceKey,{timeout:16000});
    }catch(error){
      const actual=await page.locator('#scene').evaluate(c=>({
        hit:c.dataset.nonblockTarget,block:c.dataset.targetBlock,
        x:c.dataset.playerX,y:c.dataset.playerFeet,z:c.dataset.playerZ,
        yaw:c.dataset.cameraYaw,pitch:c.dataset.cameraPitch
      }));
      throw Error('Gameplay target mismatch '+JSON.stringify({placement,view,actual}),{cause:error});
    }
    const filename=directory+'/'+placement.sceneId.split(':').at(-1)+'.png';
    const screenshot=await page.screenshot({path:filename});
    assert.equal(PNG.sync.read(screenshot).width,932);
    assert.equal(PNG.sync.read(screenshot).height,430);
    await page.locator('#dig').tap();
    await count(0);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    await page.reload();
    await count(0);
    results.push({...sample,filename,sha256:digest(screenshot)});
    console.log('PASS',placement.sceneId,sample.triangles);
  }
  const stored=await page.evaluate(()=>{
    return {world:localStorage.getItem('mythwrought-v002-world-179'),
      tombstones:JSON.parse(localStorage.getItem('mythwrought:nonblock-stage:v1:legacy:179')).tombstones};
  });
  assert.equal(stored.world,savedWorld);
  assert.deepEqual(stored.tombstones,samples.map(s=>s.instanceKey).sort());
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sources=['src/main.mjs','src/voxel.mjs','tests/nonblock-inherited-extra-browser.mjs'];
for(const path of ['src/nonblock','src/nonblock-environments24','src/nonblock-fittings36'])
  for(const name of (await readdir(path)).sort())if(name.endsWith('.mjs'))sources.push(path+'/'+name);
const sourceSha256=Object.fromEntries(await Promise.all(sources.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({seed,results,sourceSha256},null,2)+'\n');
console.log('PASS exact gameplay lifecycle for',results.length,'remaining inherited props');
