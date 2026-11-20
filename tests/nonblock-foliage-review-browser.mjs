import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {VoxelWorld,chunkCoord} from '../src/voxel.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';
import {SELECTED_SEED_KEY,worldSlotKey} from '../src/seeds.mjs';

const forest=process.env.NONBLOCK_REVIEW_SET==='forest-floor';
const undergrowth=process.env.NONBLOCK_REVIEW_SET==='undergrowth';
const undergrowthViews=[
  ['clover-patch',[-8,-6],1,[-7.5,-6.5,[-7.38826672,9.07166640,-5.48979998]]],
  ['bracken-fern',[-5,-6],1,[-4.5,-6.5,[-4.47195244,11.80928580,-5.06047614]]],
  ['moss-cushion',[-2,-6],1,[-1.5,-6.5,[-1.39176734,12.05333328,-5.44787788]]],
  ['clustered-toadstools',[1,-6],1,[1.5,-6.5,[1.76282104,12.39479987,-5.37048403]]],
  ['exposed-root',[4,-6],1,[4.5,-6.5,[4.63490343,11.19314543,-5.51245801]]],
  ['fallen-branch',[7,-6],1,[7.5,-6.5,[7.70129013,11.29172961,-5.23581823]]],
  ['woodland-sapling',[10,-6],0,[10.5,-6.5,[10.19130516,12.10166677,-5.58033991]]],
  ['woodland-shrub',[13,-6],0,[13.5,-6.5,[13.59097989,11.57333342,-5.71667401]]],
  ['forest-lichen-patch',[-8,-3],0,[-7.5,-3.5,[-7.58208179,10.03900019,-2.29490129]]],
  ['forest-moss-mat',[-5,-3],0,[-4.5,-3.5,[-4.56936677,11.08422597,-2.32560102]]]
];
const ids=undergrowth?undergrowthViews.map(([id])=>id):forest?['forest-moss-mat','forest-lichen-patch']:[
  'low-grass','short-fern','single-wildflower','button-mushroom','lavender-spike',
  'heather-sprig','clover-clump','meadow-sedge'
];
const world=new VoxelWorld(179);
const sites=undergrowth?undergrowthViews.map(([,site])=>site):forest?[[10,7],[11,7]]:
  [[9,7],[10,7],[11,7],[12,7],[9,8],[10,8],[11,8],[12,8]];
const layout=ids.map((id,index)=>{
  const [x,z]=sites[index];
  let y=20;
  while(y>0&&!world.get(x,y-1,z))y--;
  return {sceneId:'scene48:'+id,anchor:[x,y,z],variant:undergrowth?undergrowthViews[index][2]:forest?index+1:index%4};
});
const scene=createCandidateScene(179,'legacy',layout,{
  storage:{getItem:()=>null},blockAt:(...p)=>Boolean(world.get(...p)),voxelPick:()=>null
});
const visible=scene.visible();
assert.equal(visible.length,ids.length);
const origin=process.env.NONBLOCK_REVIEW_ORIGIN;
const label=process.env.NONBLOCK_REVIEW_LABEL;
const directory='artifacts/'+(undergrowth?'undergrowth-review':forest?'forest-floor-review':'foliage-review')+'-'+label;
if(!origin||!['before','after'].includes(label))throw Error('Expected review origin and label');
await mkdir(directory,{recursive:true});
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const digest=data=>createHash('sha256').update(data).digest('hex');
const captures=[];
const saved=JSON.stringify({schema:1,seed:179,edits:[[100,12,100,3]]});
const slot=worldSlotKey(179),stageKey='mythwrought:nonblock-stage:v1:legacy:179';
let rendererState;
try{
  const context=await browser.newContext({viewport:{width:932,height:430},
    hasTouch:true,isMobile:true,deviceScaleFactor:1,
    ...(undergrowth?{storageState:{cookies:[],origins:[{origin,localStorage:[
      {name:SELECTED_SEED_KEY,value:'179'},{name:slot,value:saved}
    ]}]}}:{})
  });
  const page=await context.newPage();
  await page.goto(route);
  await page.waitForFunction(expected=>{
    const scene=document.querySelector('#scene').dataset;
    return Number(scene.loadedChunks)===25&&Number(scene.nonblockInstances)===expected;
  },ids.length,{timeout:45000});
  async function aim(x,z,point){
    return page.evaluate(({x,z,point})=>{
      const player=window.__mythwroughtTest.teleport(x,z);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
      return player;
    },{x,z,point});
  }
  async function target(key){
    await page.waitForFunction(expected=>document.querySelector('#scene').dataset.nonblockTarget===expected,
      key,{timeout:15000});
  }
  async function shot(name,x,z,point,key){
    const player=await aim(x,z,point);
    await page.waitForFunction(center=>{
      const scene=document.querySelector('#scene').dataset;
      return scene.chunkCenter===center&&Number(scene.loadedChunks)===25&&Number(scene.pendingChunks)===0;
    },chunkCoord(player.x)+','+chunkCoord(player.z),{timeout:55000});
    if(key)await target(key);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const filename=directory+'/'+name+'.png';
    const image=await page.screenshot({path:filename});
    captures.push({filename,x,z,point,sha256:digest(image),width:932,height:430});
  }
  if(forest||undergrowth){
    if(forest)await shot('mixed-oblique',10.5,6.5,[10.9,9.04,7.5]);
    const viewpoints=undergrowth?undergrowthViews.map(([, , ,view])=>view):[
      [10.5,6.5,[10.23666636,9.02915001,7.43416659]],
      [11.5,6.5,[11.47336451,9.02699979,7.71423737]]
    ];
    for(const [index,id] of ids.entries())await shot(id,...viewpoints[index],visible[index].instanceKey);
    if(undergrowth){
      rendererState=await page.locator('#scene').evaluate(canvas=>{
        const d=canvas.dataset;
        return {instances:Number(d.nonblockInstances),vertices:Number(d.nonblockVertices),
          gpuBytes:Number(d.nonblockGpuBytes),drawCalls:Number(d.nonblockDrawCalls),
          terrainChunks:Number(d.loadedChunks)};
      });
      assert.deepEqual(rendererState,{
        instances:ids.length,vertices:visible.reduce((sum,object)=>sum+object.positions.length/3,0),
        gpuBytes:visible.reduce((sum,object)=>sum+object.positions.length*12,0),drawCalls:1,terrainChunks:25
      });
    }
    for(const [index,viewpoint] of viewpoints.entries()){
      await aim(...viewpoint);
      await target(visible[index].instanceKey);
      await page.locator('#dig').tap();
      await page.waitForFunction(count=>Number(document.querySelector('#scene').dataset.nonblockInstances)===count,
        ids.length-index-1,{timeout:15000});
    }
    let reopened=page;
    if(undergrowth){
      await page.close();
      reopened=await context.newPage();
      await reopened.goto(route);
    }else{
      await page.reload();
    }
    await reopened.waitForFunction(()=>{
      const scene=document.querySelector('#scene').dataset;
      return Number(scene.loadedChunks)===25&&Number(scene.nonblockInstances)===0;
    },null,{timeout:45000});
    if(undergrowth){
      const storage=await reopened.evaluate(({slot,stageKey})=>({
        ordinary:localStorage.getItem(slot),primary:localStorage.getItem(stageKey),
        backup:localStorage.getItem(stageKey+':previous-good')
      }),{slot,stageKey});
      assert.equal(storage.ordinary,saved);
      assert.equal(storage.backup,storage.primary);
      assert.deepEqual(JSON.parse(storage.primary).tombstones,visible.map(object=>object.instanceKey).sort());
    }
  }else{
    await shot('mixed-front',10.5,4.5,[10.5,9.44,7.7]);
    await shot('mixed-oblique',14.5,7.5,[10.8,9.46,7.9]);
    for(const [index,id] of ids.entries()){
      const [x,y,z]=layout[index].anchor;
      await shot(id,x+.5,z-1.5,[x+.5,y+.30,z+.5]);
    }
  }
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/nonblock/candidate-families.mjs',...(undergrowth?[
  'src/nonblock/candidate-scene.mjs','src/nonblock-scene48/undergrowth-phase1.mjs',
  'src/nonblock-scene48/forest-phase1-candidates.mjs','src/nonblock-scene48/woodland-sapling.mjs',
  'src/nonblock-scene48/woodland-shrub.mjs','src/nonblock-scene48/forest-moss-mat.mjs',
  'src/nonblock-scene48/forest-lichen-patch.mjs','tests/nonblock-foliage-review-browser.mjs'
]:forest?[
  'src/nonblock-scene48/forest-moss-mat.mjs','src/nonblock-scene48/forest-lichen-patch.mjs'
]:['src/nonblock-scene48/flora-phase1.mjs'])];
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  label,sourceSha256,captures, ...((forest||undergrowth)?{removalAndColdReopen:true}:{}),
  ...(undergrowth?{rendererState,nonemptySchema1SaveBytesUnchanged:true}:{}),
  families:visible.map(o=>({id:o.sceneId,variant:o.variant,triangles:o.positions.length/9}))
},null,2)+'\n');
console.log('PASS original game foliage review',label,captures.length,'matched views');
