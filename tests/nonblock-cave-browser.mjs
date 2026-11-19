import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {VoxelWorld,collides,raycast,terrainHeight} from '../src/voxel.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';

const seed=179;
const origin='http://127.0.0.1:4173';
const directory='artifacts/nonblock-caves';
const world=new VoxelWorld(seed);
const setups=[
  ['nonblock:e:giant-stalagmite-spire','ground',true],
  ['nonblock:e:clustered-dripstone','ceiling',false],
  ['nonblock:e:limestone-cave-column','span',true],
  ['nonblock:e:flowstone-curtain','ceiling',false]
];
const deps={
  storage:{getItem:()=>null},
  blockAt:(...pos)=>Boolean(world.get(...pos)),
  voxelPick:(...ray)=>raycast(world,...ray)
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const surface=(x,z)=>terrainHeight(x,z,seed);

function aimFromCave(scene,object) {
  const [x,y,z]=object.anchor;
  for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1],[-2,0],[2,0],[0,-2],[0,2]]){
    for(let floor=y-3;floor<=y;floor++){
      if(surface(x+dx,z+dz)-floor<3 || !world.get(x+dx,floor-1,z+dz) ||
         collides(world,x+dx+.5,floor+.01,z+dz+.5)) continue;
      const eye=[x+dx+.5,floor+1.56,z+dz+.5];
      for(let i=0;i<object.positions.length;i+=9){
        const p=object.positions;
        const point=[0,1,2].map(k=>(p[i+k]+p[i+3+k]+p[i+6+k])/3);
        if(scene.pick(eye,point.map((v,k)=>v-eye[k]))?.instanceKey===object.instanceKey)
          return {cell:[x+dx,floor,z+dz],point};
      }
    }
  }
  return null;
}

const samples=[];
for(const [sceneId,attachment,solid] of setups){
  search:for(let x=14;x<=42;x++)for(let z=-15;z<=22;z++)for(let y=-1;y<=5;y++){
    if(surface(x,z)-y<3 || world.get(x,y,z) ||
        samples.some(({placement:{anchor:[px,,pz]}})=>Math.hypot(px-x,pz-z)<3)) continue;
    if(attachment==='ceiling'?!world.get(x,y+1,z):!world.get(x,y-1,z)) continue;
    if(attachment==='span'&&!world.get(x,y+3,z)) continue;
    const placement={sceneId,anchor:[x,y,z],variant:7};
    if(solid&&collides(world,x+.5,y+.01,z+.5)) continue;
    const scene=createCandidateScene(seed,'legacy',[placement],deps);
    const [object]=scene.visible();
    if(!object)continue;
    const view=aimFromCave(scene,object);
    if(!view)continue;
    samples.push({placement,instanceKey:object.instanceKey,solid,view,
      triangles:object.positions.length/9});
    break search;
  }
  assert.equal(samples.at(-1)?.placement.sceneId,sceneId,'No natural cave site for '+sceneId);
}
console.log('Located four natural cave sites',JSON.stringify(samples.map(s=>s.placement.anchor)));

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[];
const errors=[];
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
  });
  for(const sample of samples){
    const {placement,instanceKey,view,solid}=sample;
    const url=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify([placement]));
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url);
    const count=(tab,n)=>tab.waitForFunction(value=>
      Number(document.querySelector('#scene').dataset.nonblockInstances)===value,n,{timeout:45000});
    await count(page,1);
    if(solid){
      assert.equal(await page.evaluate(cell=>{
        try{window.__mythwroughtTest.teleportCave(...cell);return false;}
        catch(error){return error.message.includes('Unsafe');}
      },placement.anchor),true,'Solid candidate was not present in the game collision path');
    }
    await page.evaluate(({cell,point})=>{
      window.__mythwroughtTest.teleportCave(...cell);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
    },view);
    await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
      instanceKey,{timeout:16000});
    const file=directory+'/'+placement.sceneId.split(':').at(-1)+'.png';
    const image=await page.screenshot({path:file});
    const png=PNG.sync.read(image);
    assert.deepEqual([png.width,png.height],[932,430]);
    assert.ok(new Set(png.data.filter((_,i)=>i%64===0)).size>32);
    await page.locator('#dig').tap();
    await count(page,0);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    if(solid){
      const entered=await page.evaluate(cell=>window.__mythwroughtTest.teleportCave(...cell),placement.anchor);
      assert.equal(entered.x,placement.anchor[0]+.5);
    }
    await page.close();
    const reopened=await context.newPage();
    reopened.on('pageerror',error=>errors.push(error.message));
    await reopened.goto(url);
    await count(reopened,0);
    assert.equal(await reopened.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),null);
    await reopened.close();
    captures.push({...sample,file,sha256:digest(image)});
    console.log('PASS',placement.sceneId,solid?'solid collision released':'ceiling pass-through');
  }
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/voxel.mjs','src/nonblock/candidate-scene.mjs',
  'src/nonblock/candidate-families.mjs','src/nonblock-environments24/cave-formations.mjs',
  'tests/nonblock-cave-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({seed,sourceSha256,captures},null,2)+'\n');
