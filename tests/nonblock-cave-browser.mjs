import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {VoxelWorld,chunkCoord,collides,raycast,terrainHeight} from '../src/voxel.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {planStagedHabitat} from '../src/nonblock/staged-habitats.mjs';
import {SELECTED_SEED_KEY,worldSlotKey} from '../src/seeds.mjs';

const seed=179;
const origin=process.env.NONBLOCK_CAVE_ORIGIN||'http://127.0.0.1:4173';
const comparison=process.env.NONBLOCK_CAVE_COMPARISON;
if(comparison&&!['before','after'].includes(comparison))throw Error('Invalid cave comparison label');
const comparisonSet=process.env.NONBLOCK_CAVE_SET||'art';
if(comparison&&!['art','wall'].includes(comparisonSet))throw Error('Invalid cave comparison set');
const directory=comparison?'artifacts/nonblock-cave-'+comparisonSet+'-'+comparison:'artifacts/nonblock-caves';
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
if(comparison){
  const reviewSites=comparisonSet==='wall'?[
    ['cave-rubble-cluster',false,[16,3,4],[17,2,4],[16.38792229,3.06679996,4.49265099]],
    ['mineral-encrustation',false,[15,4,5],[16,3,5],[15.46344471,4.61557706,5.02500010],0,true]
  ]:[
    ['branching-crystal-cluster',true,[16,3,4],[17,2,4],[16.65722402,3.21666670,4.40342363]],
    ['pebble-scatter',false,[16,3,4],[17,2,4],[16.56195704,3.01833328,4.48225021]],
    ['geode-opening',true,[15,4,6],[16,3,6],[15.01000023,4.86240371,6.575],3,true]
  ];
  for(const [name,solid,anchor,cell,point,orientation=0,wall=false] of reviewSites){
    const sceneId='nonblock:e:'+name;
    const [placement]=planStagedHabitat(world,[{sceneId,habitat:'cave',anchor,variant:2,orientation}]);
    assert.ok(placement,sceneId+' requires a natural rock anchor');
    const scene=createCandidateScene(seed,'legacy',[placement],deps);
    const [object]=scene.visible();
    assert.ok(object);
    assert.equal(object.colliders.length>0,solid);
    const eye=[cell[0]+.5,cell[1]+1.56,cell[2]+.5];
    assert.equal(scene.pick(eye,point.map((value,index)=>value-eye[index]))?.instanceKey,object.instanceKey);
    samples.push({placement,instanceKey:object.instanceKey,solid,wall,view:{cell,point},triangles:object.positions.length/9});
  }
}else for(const [sceneId,attachment,solid] of setups){
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
console.log('Located natural cave sites',JSON.stringify(samples.map(s=>s.placement.anchor)));

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[];
const errors=[];
const slot=worldSlotKey(seed),stageKey='mythwrought:nonblock-stage:v1:legacy:'+seed;
const savedWorld=comparison?JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]}):null;
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1,
    ...(comparison?{storageState:{cookies:[],origins:[{origin,localStorage:[
      {name:SELECTED_SEED_KEY,value:String(seed)},{name:slot,value:savedWorld}
    ]}]}}:{})
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
    if(comparison&&!solid&&!sample.wall){
      const entered=await page.evaluate(cell=>window.__mythwroughtTest.teleportCave(...cell),placement.anchor);
      assert.equal(entered.x,placement.anchor[0]+.5);
    }
    const probeSolid=solid&&!sample.wall;
    if(probeSolid){
      assert.equal(await page.evaluate(cell=>{
        try{window.__mythwroughtTest.teleportCave(...cell);return false;}
        catch(error){return error.message.includes('Unsafe');}
      },placement.anchor),true,'Solid candidate was not present in the game collision path');
    }
    await page.evaluate(({cell,point})=>{
      window.__mythwroughtTest.teleportCave(...cell);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
    },view);
    if(comparison){
      await page.waitForFunction(center=>{
        const d=document.querySelector('#scene').dataset;
        return d.chunkCenter===center&&Number(d.loadedChunks)===25&&Number(d.pendingChunks)===0;
      },chunkCoord(view.cell[0])+','+chunkCoord(view.cell[2]),{timeout:60000});
      await page.evaluate(point=>window.__mythwroughtTest.aimAtStagedPoint(...point),view.point);
    }
    await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,
      instanceKey,{timeout:16000});
    const rendererState=comparison?await page.locator('#scene').evaluate(canvas=>{
      const d=canvas.dataset;
      return {gpuBytes:Number(d.nonblockGpuBytes),drawCalls:Number(d.nonblockDrawCalls),
        terrainChunks:Number(d.loadedChunks)};
    }):null;
    if(comparison)assert.deepEqual(rendererState,{gpuBytes:sample.triangles*108,drawCalls:1,terrainChunks:25});
    const file=directory+'/'+placement.sceneId.split(':').at(-1)+'.png';
    const image=await page.screenshot({path:file});
    const png=PNG.sync.read(image);
    assert.deepEqual([png.width,png.height],[932,430]);
    assert.ok(new Set(png.data.filter((_,i)=>i%64===0)).size>32);
    await page.locator('#dig').tap();
    await count(page,0);
    assert.match(await page.locator('#status').textContent(),/Scenery removed/);
    if(probeSolid){
      const entered=await page.evaluate(cell=>window.__mythwroughtTest.teleportCave(...cell),placement.anchor);
      assert.equal(entered.x,placement.anchor[0]+.5);
    }
    await page.close();
    const reopened=await context.newPage();
    reopened.on('pageerror',error=>errors.push(error.message));
    await reopened.goto(url);
    await count(reopened,0);
    assert.equal(await reopened.evaluate(key=>localStorage.getItem(key),slot),savedWorld);
    if(comparison){
      const storage=await reopened.evaluate(key=>({
        primary:localStorage.getItem(key),backup:localStorage.getItem(key+':previous-good')
      }),stageKey);
      assert.equal(storage.primary,storage.backup);
      assert.ok(JSON.parse(storage.primary).tombstones.includes(instanceKey));
    }
    await reopened.close();
    captures.push({...sample,...(comparison?{rendererState,bodyProbe:sample.wall?'site-collision':probeSolid?'released':'pass-through'}:{}),file,sha256:digest(image)});
    console.log('PASS',placement.sceneId,probeSolid?'solid collision released':sample.wall?'wall-mounted removal':'pass-through');
  }
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/voxel.mjs','src/nonblock/candidate-scene.mjs',
  'src/nonblock/candidate-families.mjs','src/nonblock-environments24/cave-formations.mjs',
  'tests/nonblock-cave-browser.mjs'];
if(comparison)sourceFiles.push('src/nonblock/staged-habitats.mjs','src/nonblock/staged-inherited-families.mjs',
  ...samples.map(({placement})=>'src/nonblock-environments24/'+placement.sceneId.split(':').at(-1)+'.mjs'));
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({seed,sourceSha256,captures,
  ...(comparison?{label:comparison,removalAndColdReopen:true,nonemptySchema1SaveBytesUnchanged:true}:{})
},null,2)+'\n');
