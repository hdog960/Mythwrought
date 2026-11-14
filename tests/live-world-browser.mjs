// Checkpoint 008: genuine in-engine WebGL2 screenshots of newly LIVE voxel features.
// This script uses the actual shipped main.mjs renderer, player teleport and voxel reader.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {liveVoxelDistrict} from '../src/live-voxel-world.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';

const world=new VoxelWorld(179);
const make=(dx,dz)=>liveVoxelDistrict(world.seed,dx,dz,(x,y,z)=>world.legacyBlockAt(x,y,z));
const districts=[[0,0],[-1,0],[0,-1],[-1,-1]].map(([dx,dz])=>make(dx,dz));
const tree=districts[0].trees[0],court=districts.find(d=>d.court)?.court;
const cave=districts[0].caves[0];
assert.ok(tree&&court&&cave,'real live forest, courtyard and cave site required');
const trunk=tree.cells.find(c=>c[3]===BLOCK.WOOD);
const leaf=tree.cells.find(c=>c[3]===BLOCK.LEAVES);
assert.ok(trunk&&leaf);

const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const page=await browser.newPage({viewport:{width:932,height:430},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
const loaded=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25 &&
  Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:40000});
const aim=async(x,z,tx,ty,tz)=>{
  await page.evaluate(({x,z,tx,ty,tz})=>{
    window.__mythwroughtTest.teleport(x,z);
    window.__mythwroughtTest.aimAt(tx,ty,tz);
  },{x,z,tx,ty,tz});
  await loaded();
  assert.equal(await page.evaluate(()=>!!document.querySelector('#scene')?.getContext('webgl2')),true);
  assert.ok(await page.evaluate(()=>Number(document.querySelector('#scene')?.dataset.renderedMeshVertices)>1000));
};
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await loaded();
  await mkdir('artifacts',{recursive:true});
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),trunk.slice(0,3)),BLOCK.WOOD);
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),leaf.slice(0,3)),BLOCK.LEAVES);
  await aim(tree.origin[0]-5,tree.origin[2]+8,tree.origin[0],tree.origin[1]+4,tree.origin[2]);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
    await page.setViewportSize({width:w,height:h});
    await page.waitForTimeout(200);
    const rails=await page.evaluate(()=>{
      const c=document.querySelector('#scene').getBoundingClientRect();
      const l=document.querySelector('.left').getBoundingClientRect();
      const r=document.querySelector('.right').getBoundingClientRect();
      return [c.left-l.right,r.left-c.right];
    });
    assert.ok(rails.every(n=>n>=-2),'iPhone side grips must not overlay view');
    await page.screenshot({path:'artifacts/live-008-physical-trees-'+w+'x'+h+'.png'});
  }
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),trunk.slice(0,3)),BLOCK.WOOD);
  const [x,h,z]=court.origin;
  await page.evaluate(p=>{
    const d=window.__mythwroughtTest;
    // The court route is known to be clear; stand at walking height instead of
    // landing on a nearby treetop when using a generic surface teleport.
    d.teleportCave(p.x,p.h+1,p.z+11);
    d.aimAt(p.x,p.h+4,p.z+9);
  },{x,h,z});
  await loaded();
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),court.gates[0].cells[0].slice(0,3)),BLOCK.STONE);
  await page.screenshot({path:'artifacts/live-008-explorable-pilgrim-court-932x430.png'});
  const {floorAt}=caveRoute(179,cave);
  await aim(cave.x-4,cave.z+7,cave.x+3,floorAt(3)+2,cave.z);
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),[cave.x+3,floorAt(3)+2,cave.z]),BLOCK.AIR);
  await page.screenshot({path:'artifacts/live-008-open-cave-branch-932x430.png'});
  await page.evaluate(p=>{
    const d=window.__mythwroughtTest;
    d.teleportCave(p.x+14,p.floor+1,p.z);
    d.aimAt(p.x+14,p.floor+2,p.z-7);
  },{x:cave.x,z:cave.z,floor:floorAt(14)});
  await loaded();
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),
    [cave.x+14,floorAt(14)+1,cave.z-7]),BLOCK.AIR);
  await page.screenshot({path:'artifacts/live-008-underground-north-wing-932x430.png'});
  // A generated object is a real editable voxel, with unchanged schema-one persistence.
  await page.evaluate(p=>window.__mythwroughtTest.placeFixture(...p,0),trunk.slice(0,3));
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),trunk.slice(0,3)),BLOCK.AIR);
  await page.reload({waitUntil:'networkidle'});
  await loaded();
  assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),trunk.slice(0,3)),BLOCK.AIR);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}'));
  assert.equal(saved.schema,1);
  assert.deepEqual(errors,[]);
  assert.deepEqual(failed,[]);
  console.log('PASS checkpoint 008 real WebGL2 trees/court/cave; three device sizes; mine/reload schema-1 save');
}finally{await browser.close();}
