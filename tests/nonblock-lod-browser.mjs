import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {VoxelWorld,raycast} from '../src/voxel.mjs';

const origin=process.env.NONBLOCK_LOD_ORIGIN||'http://127.0.0.1:4173';
const prior=process.env.NONBLOCK_LOD_LABEL==='before';
const directory=prior?'artifacts/nonblock-lod-before':'artifacts/nonblock-lod';
const ids=['low-grass','short-fern','clover-clump','meadow-sedge'];
const layout=ids.map((id,index)=>({sceneId:'scene48:'+id,anchor:[9+index,9,7],variant:index}));
const objects=layout.map(placement=>describeCandidateObject(179,placement));
const parentKey=objects[1].instanceKey;
const effects=[{sceneId:'scene48:pollen',anchor:layout[1].anchor,parentKey}];
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout))+
  '&nonblock-fx='+encodeURIComponent(JSON.stringify(effects));
const fullBytes=objects.reduce((total,shape)=>total+shape.positions.length*12,0);
const farBytes=prior?fullBytes:objects.reduce((total,shape)=>total+shape.farDetail.positions.length*12,0);
const shots=[];
const observations=[];
const views={
  near:{x:10.5,z:5.5,point:[10.8,9.35,7.5]},
  far:{x:20.5,z:22.5,point:[11,9.32,7.5]},
  boundary:{x:10.5,z:21.5,point:[10.8,9.32,7.5]}
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const world=new VoxelWorld(179);
const farPlayer=findSafeSpawn(world,views.far.x,views.far.z);
const farEye=[farPlayer.x,farPlayer.feet+1.55,farPlayer.z];
assert.ok(layout.every(({anchor:[x,y,z]})=>{
  const ray=[x+.5,y+.32,z+.5].map((value,i)=>value-farEye[i]);
  return !raycast(world,farEye,ray,Math.hypot(...ray));
}),'Distant plants need an unobstructed terrain view');
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
try{
  const context=await browser.newContext({viewport:{width:932,height:430},
    hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const errors=[];
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(route);
  async function watch(name,bytes,far,photo=false){
    await page.evaluate(({x,z,point})=>{
      window.__mythwroughtTest.teleport(x,z);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
    },views[name]);
    await page.waitForFunction(({bytes,far})=>{
      const scene=document.querySelector('#scene').dataset;
      return Number(scene.nonblockGpuBytes)===bytes&&Number(scene.nonblockFarInstances??0)===far&&
        Number(scene.nonblockEffects)===1&&Number(scene.nonblockInstances)===4&&
        Number(scene.loadedChunks)===25&&Number(scene.nonblockDrawCalls)===1;
    },{bytes,far},{timeout:55000});
    observations.push({name,bytes,far,drawCalls:1,terrainChunks:25,parentEffectDrawn:true});
    if(photo){
      const file=directory+'/'+name+'.png';
      const image=await page.screenshot({path:file});
      assert.deepEqual([image.readUInt32BE(16),image.readUInt32BE(20)],[932,430]);
      shots.push({file,...views[name],width:932,height:430,sha256:digest(image)});
    }
  }
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:25000});
  await watch('near',fullBytes,0,true);
  await watch('boundary',fullBytes,0);
  await watch('far',farBytes,prior?0:4,true);
  await watch('boundary',farBytes,prior?0:4);
  await watch('near',fullBytes,0);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{await browser.close();}
const paths=['src/main.mjs','src/nonblock/candidate-scene.mjs','src/nonblock-scene48/flora-phase1.mjs',
  'src/nonblock/candidate-families.mjs','src/nonblock/candidate-effects.mjs','tests/nonblock-lod-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  mode:prior?'before':'after',sourceSha256,captures:shots,observations
},null,2)+'\n');
console.log('PASS distant foliage transition, full detail return and attached effect',fullBytes,'→',farBytes,'bytes');
