// MYTHWROUGHT Desert Phase 2 — genuine source-world + Chromium WebGL2 proof.
// Separate test-only branch based on isolated Phase 2 candidate; NEVER deploy or change saves.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {BLOCK,chunkCoord,terrainHeight} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {findSafeSpawn} from '../../src/physics.mjs';

const SOURCE_HEAD='ce8dad9d3796821f77df0f78c0184a75f6fb707c';
const actualHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
execFileSync('git',['merge-base','--is-ancestor',SOURCE_HEAD,actualHead]);
const differences=execFileSync('git',['diff','--name-only',SOURCE_HEAD,actualHead],
  {encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=new Set(['scripts/ci/desert-v7-border-visual-browser.mjs',
  '.github/workflows/desert-v7-border-visual.yml']);
assert.ok(differences.length>=1&&differences.every(p=>allowed.has(p)),
  'Visual proof is not based on the exact untouched protected Desert source');

const SEEDS=[179,2026],NEIGHBORS=['plains','snow','mountain','enchanted'];
const output='artifacts/desert-v7-border-visual';
const origin='http://127.0.0.1:4173/';
const label=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const foliage=new Set([BLOCK.LEAVES,G.coldNeedles,G.snowyNeedles,
  G.aetherBark,G.aetherLeaves,G.moonLeaves]);

function findFourRealBorders(seed){
  const results=new Map();
  const step=48,radius=1800;
  for(let z=-radius;z<=radius;z+=step)
    for(let x=-radius;x<=radius;x+=step){
      const a=label(x,z,seed);
      for(const [sx,sz] of [[step,0],[0,step]]){
        const b=label(x+sx,z+sz,seed);
        if(a===b||a!=='desert'&&b!=='desert')continue;
        const neighbor=a==='desert'?b:a;
        if(!NEIGHBORS.includes(neighbor))continue;
        let previous=a;
        for(let delta=1;delta<=step;delta++){
          const px=x+(sx?delta-1:0),pz=z+(sz?delta-1:0);
          const nx=x+(sx?delta:0),nz=z+(sz?delta:0);
          const current=label(nx,nz,seed);
          if(current===previous)continue;
          if([previous,current].includes('desert')&&
             [previous,current].includes(neighbor)){
            const desert=previous==='desert'?[px,pz]:[nx,nz];
            const outside=previous==='desert'?[nx,nz]:[px,pz];
            const old=results.get(neighbor);
            const score=Math.abs(desert[0])+Math.abs(desert[1]);
            if(!old||score<old.score)results.set(neighbor,{neighbor,desert,outside,score});
          }
          break;
        }
      }
    }
  for(const name of NEIGHBORS){
    const border=results.get(name);
    assert.ok(border,'No genuine Desert/'+name+' boundary in seed '+seed);
    assert.equal(label(...border.desert,seed),'desert');
    assert.equal(label(...border.outside,seed),name);
    assert.equal(Math.abs(border.desert[0]-border.outside[0])+
      Math.abs(border.desert[1]-border.outside[1]),1);
  }
  return results;
}

function interior(seed){
  if(seed===179){
    assert.equal(label(512,0,seed),'desert');
    return [512,0];
  }
  const sites=[];
  for(let z=-2048;z<=2048;z+=128)
    for(let x=-2048;x<=2048;x+=128){
      const region=v6BiomeAt(x,z,seed);
      if(region?.name==='desert'&&region.weight>.98)
        sites.push({x,z,score:Math.abs(x)+Math.abs(z)});
    }
  sites.sort((a,b)=>a.score-b.score||a.z-b.z||a.x-b.x);
  assert.ok(sites.length,'No genuine interior Desert for seed '+seed);
  return [sites[0].x,sites[0].z];
}

function safeDesertCamera(world,site){
  const seed=world.seed;
  const d=site.desert,o=site.outside;
  const dx=o?d[0]-o[0]:0,dz=o?d[1]-o[1]:0;
  for(const offset of o?[12,18,8,5,2,0]:[0,4,8]){
    const x=d[0]+offset*dx,z=d[1]+offset*dz;
    if(label(x,z,seed)!=='desert')continue;
    try{
      const pose=findSafeSpawn(world,x,z);
      if(label(Math.floor(pose.x),Math.floor(pose.z),seed)==='desert')
        return pose;
    }catch{/* Try another actual Desert-side landing. */}
  }
  throw Error('No physical, true Desert-side camera near '+seed+' '+site.neighbor+
    ' '+site.desert);
}

function sourceDesertCensus(world,desert,neighbor){
  const [px,pz]=desert,seed=world.seed;
  let columns=0,reads=0;
  const observed={};
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
    const x=px+dx,z=pz+dz;
    if(label(x,z,seed)!=='desert')continue;
    columns++;
    for(let y=Math.max(2,terrainHeight(x,z,seed)-2);y<=WORLD_MAX_Y;y++){
      const id=world.naturalAndLandmarkBlock(x,y,z);
      // A real V7 desert source column must contain no naturally generated
      // grass even at a very thin border or above protected cave air.
      assert.notEqual(id,BLOCK.GRASS,
        'V7 Phase 2 natural Desert grass leaked at '+JSON.stringify({seed,neighbor,x,y,z,id}));
      assert.equal(foliage.has(id),false,
        'Natural Desert tree foliage in physical V7 world: '+
        JSON.stringify({seed,neighbor,x,y,z,id}));
      observed[id]=(observed[id]??0)+1;
      reads++;
    }
  }
  assert.ok(columns>0&&reads>0,'No actual Desert columns were sampled');
  return {columns,reads,observed};
}

await mkdir(output,{recursive:true});
const sourceDigests={};
for(const file of ['src/manual-biomes/environment-v7.mjs',
  'src/manual-biomes/profile-world.mjs','src/manual-biomes/v6-balanced-biomes.mjs']){
  sourceDigests[file]=sha(await readFile(file));
}
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
const evidence=[],errors=[],viewport={width:844,height:390};
try{
  const context=await browser.newContext({viewport,deviceScaleFactor:1,
    hasTouch:true,isMobile:true,serviceWorkers:'block'});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('dialog',dialog=>dialog.accept());
  const waitProfile=seed=>page.waitForFunction(({seed,generator})=>{
    const api=window.__mythwroughtTest;
    return api?.snapshot()?.seed===seed&&
      api?.fourBiomeProfile()?.generator===generator;
  },{seed,generator:M7_ENVIRONMENT_GENERATOR},{timeout:95000});
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:95000});
  await waitProfile(179);

  for(const seed of SEEDS){
    if(seed!==179){
      await page.locator('#menu').click();
      await page.locator('#seedInput').fill(String(seed));
      await page.locator('#switchWorld').click();
      await waitProfile(seed);
      await page.locator('#closeHelp').click();
    }
    const world=new FourRegionWorld(seed,
      fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const borders=findFourRealBorders(seed);
    const sites=[{neighbor:'interior',desert:interior(seed),outside:null},
      ...NEIGHBORS.map(name=>borders.get(name))];
    for(const site of sites){
      const desired=safeDesertCamera(world,site);
      const source=sourceDesertCensus(world,site.desert,site.neighbor);
      const outside=site.outside;
      const aim=outside?[
        outside[0]+12*(outside[0]-site.desert[0]),
        terrainHeight(outside[0],outside[1],seed)+2,
        outside[1]+12*(outside[1]-site.desert[1])
      ]:[desired.x+10,terrainHeight(desired.x+10,desired.z+10,seed)+2,
        desired.z+10];
      const actual=await page.evaluate(({desired,aim})=>{
        const api=window.__mythwroughtTest;
        const pose=api.teleport(desired.x,desired.z);
        api.aimAt(...aim);
        return pose;
      },{desired,aim});
      assert.equal(label(Math.floor(actual.x),Math.floor(actual.z),seed),'desert',
        'Chromium camera left Desert while testing '+seed+' '+site.neighbor);
      assert.ok(Math.hypot(actual.x-desired.x,actual.z-desired.z)<=9,
        'Real-game collision/position disagreed with canonical V7 landing');
      const expectedCenter=chunkCoord(actual.x)+','+chunkCoord(actual.z);
      await page.waitForFunction(({center,seed})=>{
        const api=window.__mythwroughtTest,d=document.querySelector('#scene')?.dataset;
        return d?.chunkCenter===center&&Number(d.loadedChunks)===25&&
          Number(d.pendingChunks)===0&&Number(d.renderedFrames)>10&&
          d.skyDrawn==='true'&&d.skyS6WorldBiomeName==='desert'&&
          api?.snapshot()?.seed===seed;
      },{center:expectedCenter,seed},{timeout:150000,polling:300});
      const graphics=await page.evaluate(()=>{
        const canvas=document.querySelector('#scene');
        const gl=canvas.getContext('webgl2');
        return {hasWebGL2:!!gl,contextLost:gl?.isContextLost(),
          glError:gl?.getError(),loadedChunks:Number(canvas.dataset.loadedChunks),
          pendingChunks:Number(canvas.dataset.pendingChunks),
          renderedFrames:Number(canvas.dataset.renderedFrames),
          biome:canvas.dataset.skyS6WorldBiomeName};
      });
      assert.equal(graphics.hasWebGL2,true);
      assert.equal(graphics.contextLost,false);
      assert.equal(graphics.glError,0);
      const file=output+'/seed-'+seed+'-'+site.neighbor+'-844x390.png';
      const bytes=await page.screenshot({path:file,timeout:95000});
      const png=PNG.sync.read(bytes);
      assert.deepEqual([png.width,png.height],[viewport.width,viewport.height]);
      const colors=new Set();
      for(let i=0;i<png.data.length;i+=256)
        colors.add(png.data[i]+','+png.data[i+1]+','+png.data[i+2]);
      assert.ok(colors.size>=50,
        'The real Chromium view is visually empty: '+file+' colors='+colors.size);
      const proof={seed,neighbor:site.neighbor,borderDesert:site.desert,
        borderOutside:outside,pose:actual,source,graphics,
        png:file,sha256:sha(bytes),bytes:bytes.length,
        dimensions:[png.width,png.height],sampledColors:colors.size};
      evidence.push(proof);
      console.log('DESERT_V7_REAL_WEBGL2_PROOF '+JSON.stringify({
        seed,neighbor:site.neighbor,sourceReads:source.reads,
        sourceColumns:source.columns,renderedFrames:graphics.renderedFrames,
        glError:graphics.glError,filename:file,sha256:proof.sha256
      }));
    }
    assert.equal(world.save().edits.length,0,'V7 source proof modified player edits');
  }
  assert.deepEqual(errors,[],'Original-game JavaScript errors during real V7 proof');
  assert.equal(evidence.length,SEEDS.length*(1+NEIGHBORS.length));
  assert.equal(new Set(evidence.map(x=>x.sha256)).size,evidence.length,
    'All genuine V7 screenshots must be distinct');
  const result={sourceHead:SOURCE_HEAD,probeHead:actualHead,
    sourceDiff:differences,sourceDigests,renderer:'Chromium SwiftShader WebGL2',
    evidence,jsErrors:errors,noProductionOrPlayerSaveWrites:true};
  await writeFile(output+'/report.json',JSON.stringify(result,null,2)+'\n');
  console.log('DESERT_V7_REAL_WEBGL2_SUCCESS '+JSON.stringify({
    sourceHead:SOURCE_HEAD,probeHead:actualHead,images:evidence.length,
    seeds:SEEDS,neighborTypes:NEIGHBORS,
    sourceReads:evidence.reduce((sum,x)=>sum+x.source.reads,0),
    distinctPNGHashes:new Set(evidence.map(x=>x.sha256)).size,
    pageErrors:errors.length
  }));
}finally{await browser.close();}
