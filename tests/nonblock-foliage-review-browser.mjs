import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {VoxelWorld} from '../src/voxel.mjs';
import {createCandidateScene} from '../src/nonblock/candidate-scene.mjs';

const ids=['low-grass','short-fern','single-wildflower','button-mushroom','lavender-spike',
  'heather-sprig','clover-clump','meadow-sedge'];
const world=new VoxelWorld(179);
const sites=[[9,7],[10,7],[11,7],[12,7],[9,8],[10,8],[11,8],[12,8]];
const layout=ids.map((id,index)=>{
  const [x,z]=sites[index];
  let y=20;
  while(y>0&&!world.get(x,y-1,z))y--;
  return {sceneId:'scene48:'+id,anchor:[x,y,z],variant:index%4};
});
const scene=createCandidateScene(179,'legacy',layout,{
  storage:{getItem:()=>null},blockAt:(...p)=>Boolean(world.get(...p)),voxelPick:()=>null
});
const visible=scene.visible();
assert.equal(visible.length,8);
const origin=process.env.NONBLOCK_REVIEW_ORIGIN;
const label=process.env.NONBLOCK_REVIEW_LABEL;
const directory='artifacts/foliage-review-'+label;
if(!origin||!['before','after'].includes(label))throw Error('Expected review origin and label');
await mkdir(directory,{recursive:true});
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const digest=data=>createHash('sha256').update(data).digest('hex');
const captures=[];
try{
  const context=await browser.newContext({viewport:{width:932,height:430},
    hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const page=await context.newPage();
  await page.goto(route);
  await page.waitForFunction(()=>{
    const scene=document.querySelector('#scene').dataset;
    return Number(scene.loadedChunks)===25&&Number(scene.nonblockInstances)===8;
  },null,{timeout:45000});
  async function shot(name,x,z,point){
    await page.evaluate(({x,z,point})=>{
      window.__mythwroughtTest.teleport(x,z);
      window.__mythwroughtTest.aimAtStagedPoint(...point);
    },{x,z,point});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const filename=directory+'/'+name+'.png';
    const image=await page.screenshot({path:filename});
    captures.push({filename,x,z,point,sha256:digest(image),width:932,height:430});
  }
  await shot('mixed-front',10.5,4.5,[10.5,9.44,7.7]);
  await shot('mixed-oblique',14.5,7.5,[10.8,9.46,7.9]);
  for(const [index,id] of ids.entries()){
    const [x,y,z]=layout[index].anchor;
    await shot(id,x+.5,z-1.5,[x+.5,y+.30,z+.5]);
  }
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/nonblock/candidate-families.mjs','src/nonblock-scene48/flora-phase1.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  label,sourceSha256,captures,families:visible.map(o=>({id:o.sceneId,variant:o.variant,triangles:o.positions.length/9}))
},null,2)+'\n');
console.log('PASS original game foliage review',label,captures.length,'matched views');
