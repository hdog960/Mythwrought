import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {VoxelWorld} from '../src/voxel.mjs';
import {OWNED_FITTING_IDS,planOwnedFitting} from '../src/nonblock/physical-fittings.mjs';

const origin=process.env.NONBLOCK_OWNED_ORIGIN||'http://127.0.0.1:4173';
const target=origin+'/?nonblock-stage=%5B%5D';
const directory='artifacts/nonblock-physical-fittings';
const seed=179;
const world=new VoxelWorld(seed);
const save=JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]});
const saveKey='mythwrought-v002-world-179';
const plans=[],reserved=new Set();
for(const id of OWNED_FITTING_IDS){
  placement:for(let z=7;z<=14;z++){
    for(let x=9;x<=18;x++){
      for(let y=8;y<=13;y++){
        for(const orientation of [0,1,2,3]){
          const options={anchor:[x,y,z],orientation};
          const plan=planOwnedFitting(id,options).blueprint;
          const cells=plan.physicalAssets.flatMap(asset=>asset.occupied);
          if(cells.some(cell=>world.get(...cell)||reserved.has(cell.join(','))))continue;
          if(plan.unresolvedSupports.some(({at})=>!at||!world.get(...at)))continue;
          if(world.get(x,y-1,z)===0&&!plan.unresolvedSupports.length)continue;
          plans.push({sceneId:id,options,items:plan.physicalAssets.map(({at,numericId})=>({at,numericId}))});
          for(const cell of cells)reserved.add(cell.join(','));
          break placement;
        }
      }
    }
  }
  assert.equal(plans.at(-1)?.sceneId,id,'No natural fitting site for '+id);
}

await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const errors=[],captures=[];
let minedCell=null;
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
  });
  await context.addInitScript(({key,value})=>{
    if(localStorage.getItem(key)===null)localStorage.setItem(key,value);
  },{key:saveKey,value:save});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(target);
  await page.waitForFunction(()=>window.__mythwroughtTest&&
    Number(document.querySelector('#scene').dataset.loadedChunks)===25,null,{timeout:45000});
  for(const plan of plans){
    const result=await page.evaluate(({sceneId,options})=>window.__mythwroughtTest.placeOwnedFitting(sceneId,options),plan);
    assert.equal(result.ok,true,plan.sceneId+' '+JSON.stringify(result));
    assert.equal(result.verifiedSave,true);
    for(const {at,numericId} of plan.items)
      assert.equal(await page.evaluate(cell=>window.__mythwroughtTest.block(...cell),at),numericId);
    console.log('PASS physical placement',plan.sceneId,plan.items.map(item=>item.numericId).join(','));
  }
  const visible = await page.evaluate(()=>({
    owner2:Object.keys(localStorage).filter(key=>key.endsWith('-pack2-live-v1')),
    owner14:Object.keys(localStorage).filter(key=>key==='mythwrought.manual14.seed.179'),
    stage:Object.keys(localStorage).filter(key=>key.includes('nonblock-stage'))
  }));
  assert.equal(visible.owner2.length,1);
  assert.equal(visible.owner14.length,1);
  assert.equal(visible.stage.length,0);
  const door=plans.find(p=>p.sceneId==='scene36:double-door-pair').items[0];
  await page.evaluate(({at:[x,y,z]})=>{
    window.__mythwroughtTest.teleport(x-1.5,z-2.5);
    window.__mythwroughtTest.aimAt(x,y,z);
  },door);
  const filename=directory+'/owned-fittings-932x430.png';
  const image=await page.screenshot({path:filename});
  assert.deepEqual([image.readUInt32BE(16),image.readUInt32BE(20)],[932,430]);
  captures.push({filename,sha256:createHash('sha256').update(image).digest('hex')});
  const waitHit=cell=>page.waitForFunction(key=>
    document.querySelector('#scene').dataset.targetBlock===key,cell.join(','),{timeout:15000});
  await waitHit(door.at);
  await page.locator('#menu').tap();
  await page.locator('#pack2Materials [data-block="67"]').tap();
  await page.locator('#closeHelp').tap();
  await page.locator('#place').tap();
  const ownerState=cell=>page.evaluate(cell=>{
    const key=Object.keys(localStorage).find(name=>name.endsWith('-pack2-live-v1'));
    return JSON.parse(localStorage.getItem(key)).cells.find(row=>
      row[0]===cell[0]&&row[1]===cell[1]&&row[2]===cell[2])?.[4]??null;
  },cell);
  assert.equal((await ownerState(door.at)).open,true);
  const sibling=plans.find(p=>p.sceneId==='scene36:double-door-pair').items[1];
  assert.equal((await ownerState(sibling.at)).open,false);
  await page.evaluate(([x,y,z])=>window.__mythwroughtTest.aimAtStagedPoint(x+.15,y+.50,z+.50),door.at);
  await waitHit(door.at);
  await page.locator('#dig').tap();
  assert.equal(await ownerState(door.at),null);
  assert.equal((await ownerState(sibling.at)).id,67);
  minedCell=door.at;
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),save);
  await page.close();

  const reopened=await context.newPage();
  reopened.on('pageerror',error=>errors.push(error.message));
  await reopened.goto(target);
  await reopened.waitForFunction(()=>window.__mythwroughtTest&&
    Number(document.querySelector('#scene').dataset.loadedChunks)===25,null,{timeout:45000});
  for(const {at,numericId} of plans.flatMap(p=>p.items))
    assert.equal(await reopened.evaluate(cell=>window.__mythwroughtTest.block(...cell),at),
      at.join(',')===minedCell?.join(',')?0:numericId);
  assert.equal(await reopened.evaluate(key=>localStorage.getItem(key),saveKey),save);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sourceFiles=['src/main.mjs','src/nonblock/physical-fittings.mjs','src/pack2-world.mjs',
  'src/builder-assets/manual-five-pack.mjs','src/builder-assets/manual-five-pack-live.mjs',
  'tests/nonblock-physical-fittings-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(sourceFiles.map(async file=>
  [file,createHash('sha256').update(await readFile(file)).digest('hex')])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  seed,plans,captures,minedCell,sourceSha256,schema1SaveBytesUnchanged:true
},null,2)+'\n');
console.log('PASS physical fittings used original Pack 2 and Pack 4 placement and reload owners');
