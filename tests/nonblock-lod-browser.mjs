import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {VoxelWorld,chunkCoord,raycast} from '../src/voxel.mjs';

const origin=process.env.NONBLOCK_LOD_ORIGIN||'http://127.0.0.1:4173';
const prior=process.env.NONBLOCK_LOD_LABEL==='before';
const undergrowth=process.env.NONBLOCK_LOD_SET==='undergrowth';
const directory='artifacts/nonblock-'+(undergrowth?'undergrowth-lod':'lod')+(prior?'-before':'');
const ids=undergrowth?['bracken-fern','moss-cushion']:['low-grass','short-fern','clover-clump','meadow-sedge'];
const layout=ids.map((id,index)=>({sceneId:'scene48:'+id,anchor:[9+index,9,7],variant:index}));
const objects=layout.map(placement=>describeCandidateObject(179,placement));
const parentIndex=undergrowth?0:1;
const parentKey=objects[parentIndex].instanceKey;
const effects=[{sceneId:'scene48:pollen',anchor:layout[parentIndex].anchor,parentKey}];
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout))+
  '&nonblock-fx='+encodeURIComponent(JSON.stringify(effects));
const fullBytes=objects.reduce((total,shape)=>total+shape.positions.length*12,0);
const farBytes=prior?fullBytes:objects.reduce((total,shape)=>total+shape.farDetail.positions.length*12,0);
const shots=[];
const observations=[];
const views=undergrowth?{
  near:{x:9.5,z:5.5,point:[9.98,9.41,7.55]},
  far:{x:20.5,z:22.5,point:[9.97,9.34,7.5]},
  boundary:{x:9.5,z:21.5,point:[9.97,9.34,7.5]}
}:{
  near:{x:10.5,z:5.5,point:[10.8,9.35,7.5]},
  far:{x:20.5,z:22.5,point:[11,9.32,7.5]},
  boundary:{x:10.5,z:21.5,point:[10.8,9.32,7.5]}
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const world=new VoxelWorld(179);
const farPlayer=findSafeSpawn(world,views.far.x,views.far.z);
const farEye=[farPlayer.x,farPlayer.feet+1.55,farPlayer.z];
assert.ok(layout.every(({anchor:[x,y,z]},index)=>{
  const targetHeight=undergrowth?(index===0?.45:.10):.32;
  const ray=[x+.5,y+targetHeight,z+.5].map((value,i)=>value-farEye[i]);
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
    const player=await page.evaluate(({x,z,point})=>{
      const player=window.__mythwroughtTest.teleport(x,z);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
      return player;
    },views[name]);
    await page.waitForFunction(({bytes,far,count,center})=>{
      const scene=document.querySelector('#scene').dataset;
      return Number(scene.nonblockGpuBytes)===bytes&&Number(scene.nonblockFarInstances??0)===far&&
        Number(scene.nonblockEffects)===1&&Number(scene.nonblockInstances)===count&&
        Number(scene.loadedChunks)===25&&Number(scene.nonblockDrawCalls)===1&&
        scene.chunkCenter===center&&Number(scene.pendingChunks)===0;
    },{bytes,far,count:ids.length,center:chunkCoord(player.x)+','+chunkCoord(player.z)},{timeout:65000});
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
  await watch('far',farBytes,prior?0:ids.length,true);
  await watch('boundary',farBytes,prior?0:ids.length);
  await watch('near',fullBytes,0);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{await browser.close();}
const paths=['src/main.mjs','src/nonblock/candidate-scene.mjs','src/nonblock-scene48/flora-phase1.mjs',
  'src/nonblock/candidate-families.mjs','src/nonblock/candidate-effects.mjs','tests/nonblock-lod-browser.mjs'];
if(undergrowth)paths.push('src/nonblock-scene48/undergrowth-phase1.mjs');
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  mode:prior?'before':'after',sourceSha256,captures:shots,observations
},null,2)+'\n');
console.log('PASS distant foliage transition, full detail return and attached effect',fullBytes,'→',farBytes,'bytes');
