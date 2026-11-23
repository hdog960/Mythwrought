// SNOW S6 POST-DESERT REAL GAME WEBGL2 AND PLAYER-PLACED ICE PARITY.
// This runs against a pinned, read-only *second checkout* of production
// Desert Phase 3. The ONLY color substitution is a Playwright in-memory
// module-route response. This script does NOT edit main, PWA, saves or disk.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const RELEASE='db4bbcc32156e5df311f733bcaa53d559c17313b';
const M7='mythwrought-five-surface-regions-v7';
const artifacts='artifacts/snow-s6-post-desert-real-webgl2';
const base='production-readonly';
const sha=b=>createHash('sha256').update(b).digest('hex');
await mkdir(artifacts,{recursive:true});
const voxel=await readFile(base+'/src/voxel.mjs','utf8');
const main=await readFile(base+'/src/main.mjs','utf8');
const palette=await readFile('src/manual-biomes/snowy-s6-winter-tone-proposal.mjs','utf8');
assert.ok(voxel.includes("import {v6BiomeAt} from './manual-biomes/v6-balanced-biomes.mjs';"),
  'Desert release original biome color ownership moved');
const token='const groundColor=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?BIOME_GROUND_COLORS.get(id):undefined;';
assert.equal(voxel.split(token).length-1,1,'Pinned production color source anchor changed');
const winterImport="import {previewSnowS6WinterTone as snowS6Candidate} from './manual-biomes/snowy-s6-winter-tone-proposal.mjs';\n";
const winterColor=`const snowS6Region=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))&&
  (id===272||id===276||id===279)?v6BiomeAt(x,z,world.seed):null;
const snowS6Color=snowS6Region?.name==='snow'?
  snowS6Candidate(world.seed,x,z,id,snowS6Region.weight).proposedLinearRgb:undefined;
const groundColor=snowS6Color??(unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?
  BIOME_GROUND_COLORS.get(id):undefined);`;
const alteredVoxel=winterImport+voxel.replace(token,winterColor);
assert.equal(alteredVoxel.split('snowS6Candidate(world.seed').length-1,1);
// Browser-only M7 diagnostic hook: original meshChunk against the SAME
// isolated player-edited 276 block. The helper is installed identically in
// original and candidate pages. No other runtime APIs are modified.
const hook='window.__mythwroughtTest=Object.freeze({';
const helper=`window.__mythwroughtTest=Object.freeze({
      snowS6IsolatedEditedIceMesh(x,y,z){
        if(![x,y,z].every(Number.isSafeInteger)||y<15||y>18)
          throw Error('Snow S6 edited-ice proof requires isolated upper-air voxel');
        const cx=Math.floor(x/16),cz=Math.floor(z/16),
          vertices=meshChunk(world,cx,cz),positions=[];
        for(let i=0;i<vertices.length;i+=9){
          const px=vertices[i],py=vertices[i+1],pz=vertices[i+2];
          if(px>=x&&px<=x+1&&py>=y&&py<=y+1&&pz>=z&&pz<=z+1)
            positions.push(Array.from(vertices.subarray(i,i+9)));
        }
        const editKey=x+','+y+','+z;
        return {id:world.get(x,y,z),
          edited:Boolean(world.edits?.has(editKey)||world.base?.edits?.has(editKey)),
          positions};
      },
`;
assert.equal(main.split(hook).length-1,1,'Original local-only acceptance hook moved');
const alteredMain=main.replace(hook,helper);
const candidates=[{seed:179,ice:[-144,8,528]},
  {seed:2026,ice:[-160,7,480]}];
const viewport={width:956,height:440};
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
const reports=[];
const waitStart=(page,seed)=>page.waitForFunction(expected=>{
  const api=window.__mythwroughtTest,c=document.querySelector('#scene');
  return api?.snapshot().seed===expected&&
    api.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-v7'&&
    c&&Number(c.dataset.loadedChunks)>=25&&
    Number(c.dataset.pendingChunks)===0&&
    Number(c.dataset.renderedFrames)>2;
},seed,{timeout:110000});
async function take(seed,ice,stage,preferred){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,
   isMobile:true,hasTouch:true,serviceWorkers:'block'});
 let routeVoxel=0,routeMain=0,routePalette=0;
 try{
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e?.message??e)));
  page.on('dialog',d=>d.accept());
  // Desert P3 index has a release-query main module.
  await page.route('**/src/main.mjs*',async route=>{
    routeMain++;
    const resp=await route.fetch(),body=await resp.text();
    assert.equal(resp.status(),200);
    assert.equal(sha(Buffer.from(body)),sha(Buffer.from(main)),
      'Unexpected original Desert main module from server');
    await route.fulfill({status:200,contentType:'text/javascript',body:alteredMain});
  });
  if(stage==='candidate'){
    await page.route('**/src/voxel.mjs',async route=>{
      routeVoxel++;
      const resp=await route.fetch(),body=await resp.text();
      assert.equal(resp.status(),200);
      assert.equal(sha(Buffer.from(body)),sha(Buffer.from(voxel)),
        'Unexpected original Desert voxel module from server');
      await route.fulfill({status:200,contentType:'text/javascript',body:alteredVoxel});
    });
    await page.route('**/src/manual-biomes/snowy-s6-winter-tone-proposal.mjs',
      async route=>{
        routePalette++;
        await route.fulfill({status:200,contentType:'text/javascript',body:palette});
      });
  }
  await page.goto('http://127.0.0.1:4173/',{
    waitUntil:'domcontentloaded',timeout:90000});
  await waitStart(page,179);
  if(seed!==179){
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill(String(seed));
    await page.locator('#switchWorld').click();
    await waitStart(page,seed);
    await page.locator('#closeHelp').click();
  }
  const scene=await page.evaluate(({ice,preferred})=>{
    const api=window.__mythwroughtTest;
    const original=api.block(...ice);
    if(original!==276)
      throw Error('Pinned Desert M7 original glacier witness no longer ID276: '+original);
    const [gx,gy,gz]=ice;
    const places=preferred?[preferred]:[
      [gx,17,gz-12],[gx+3,17,gz-11],[gx-4,17,gz-10],
      [gx,16,gz-8],[gx+6,18,gz-8],[gx-6,18,gz-8],
      [gx,19,gz-12],[gx-6,19,gz-10],
      [gx+6,19,gz-10],[gx,18,gz-8]
    ];
    let chosen=null,pose=null;
    for(const position of places){
      try{pose=api.teleportCave(...position);chosen=position;break;}catch{}
    }
    if(!chosen)throw Error('No original collision-safe M7 snow overlook');
    api.aimAt(...ice);
    return {seed:api.snapshot().seed,profile:api.fourBiomeProfile()?.generator,
      originalIce:original,ice,chosen,pose};
  },{ice,preferred});
  assert.equal(scene.seed,seed);assert.equal(scene.profile,M7);
  assert.equal(scene.originalIce,276);
  if(preferred)assert.deepEqual(scene.chosen,preferred);
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyS6WorldBiomeName==='snow'&&
      Number(c.dataset.loadedChunks)>=25&&
      Number(c.dataset.pendingChunks)===0;
  },null,{timeout:110000});
  const frames=await page.evaluate(()=>
    Number(document.querySelector('#scene').dataset.renderedFrames));
  await page.waitForFunction(previous=>
    Number(document.querySelector('#scene').dataset.renderedFrames)>=previous+8,
    frames,{timeout:60000});
  const gl=await page.evaluate(()=>{
    const c=document.querySelector('#scene'),g=c.getContext('webgl2');
    return {present:!!g,version:g?.getParameter(g.VERSION),
      buffer:[c.width,c.height],loaded:Number(c.dataset.loadedChunks),
      pending:Number(c.dataset.pendingChunks),
      region:c.dataset.skyS6WorldBiomeName};
  });
  assert.ok(gl.present&&gl.version.includes('WebGL 2'),'Original game WebGL2 required');
  assert.equal(gl.region,'snow');assert.equal(gl.pending,0);
  assert.deepEqual(errors,[],'Original game errors at snow camera');
  const name=stage+'-main'+RELEASE.slice(0,7)+'-seed'+seed+'-956x440.png';
  const bytes=await page.screenshot({path:artifacts+'/'+name,timeout:90000});
  const png=pngjs.PNG.sync.read(bytes);
  assert.deepEqual([png.width,png.height],[viewport.width,viewport.height]);
  assert.equal(routeMain,1);assert.equal(routeVoxel,stage==='candidate'?1:0);
  assert.equal(routePalette,stage==='candidate'?1:0);
  // AUTHENTIC player placed original ID276: place only inside a throwaway
  // browser context, AFTER the screenshot, never inside an existing user save.
  // All positions above y15 are actual AIR, isolated from other geometry.
  const edited=await page.evaluate(({ice})=>{
    const api=window.__mythwroughtTest,[gx,,gz]=ice;
    let selected=null;
    for(const y of [18,17,16])for(const dx of [0,1,-1,2,-2])
      for(const dz of [-6,-7,-8]){
        const x=gx+dx,z=gz+dz;
        if(api.block(x,y,z)!==0)continue;
        const around=[[1,0],[-1,0],[0,1],[0,-1]]
          .every(([a,b])=>api.block(x+a,y,z+b)===0);
        if(!around)continue;
        selected=[x,y,z];break;
      }
    if(!selected)throw Error('No original untouched AIR cell for edited glacier probe');
    const [x,y,z]=selected;
    api.placeFixture(x,y,z,276);
    const m=api.snowS6IsolatedEditedIceMesh(x,y,z);
    if(!m.edited||m.id!==276||m.positions.length<12)
      throw Error('Edited ice was not a real original source mesh');
    return {at:selected,...m};
  },{ice});
  assert.ok(edited.positions.every(row=>
    row.length===9&&row.every(Number.isFinite)));
  assert.deepEqual(errors,[],'Original player-ice fixture introduced JS error');
  const metadata={seed,stage,name,pngSha256:sha(bytes),scene,gl,
    originalMainSha256:sha(Buffer.from(main)),
    originalVoxelSha256:sha(Buffer.from(voxel)),
    browserCandidateVoxelSha256:stage==='candidate'?
      sha(Buffer.from(alteredVoxel)):null,
    editedIce:edited,sourceRequests:{main:routeMain,voxel:routeVoxel,
      palette:routePalette},pageErrors:errors};
  console.log('SNOW_S6_POST_DESERT_ORIGINAL_GAME_CAPTURE '+JSON.stringify({
    ...metadata,editedIce:{at:edited.at,id:edited.id,edited:edited.edited,
      meshVertices:edited.positions.length}}));
  return metadata;
 }finally{await context.close()}
}
try{
 for(const {seed,ice} of candidates){
  const original=await take(seed,ice,'original',null);
  const candidate=await take(seed,ice,'candidate',original.scene.chosen);
  assert.deepEqual(candidate.scene,original.scene,
    'Original Desert and candidate camera or glacier identity mismatch');
  assert.deepEqual(candidate.editedIce,original.editedIce,
    'Original authored player ice physical mesh changed under S6 candidate');
  const a=pngjs.PNG.sync.read(await readFile(artifacts+'/'+original.name));
  const b=pngjs.PNG.sync.read(await readFile(artifacts+'/'+candidate.name));
  const x0=Math.round(a.width*.18),x1=Math.round(a.width*.82);
  const y0=Math.round(a.height*.33),y1=Math.round(a.height*.90);
  let count=0,blueA=0,blueB=0,strong=0,total=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
    const i=(y*a.width+x)*4,A=a.data,B=b.data;
    if(A[i+2]-A[i]>18)blueA++;
    if(B[i+2]-B[i]>18)blueB++;
    const delta=Math.max(Math.abs(A[i]-B[i]),Math.abs(A[i+1]-B[i+1]),
      Math.abs(A[i+2]-B[i+2]));
    if(delta>=10)strong++;
    total+=delta;count++;
  }
  const stats={kind:'snow-s6-post-desert-actual-WebGL2-paired-glacier',
    productionCommit:RELEASE,seed,viewport,ice,scene:original.scene,
    originalSha256:original.pngSha256,
    candidateSha256:candidate.pngSha256,
    originalSourceSha256:original.originalVoxelSha256,
    editedPlayerIceExactMeshParity:true,
    editedIceVertexCount:original.editedIce.positions.length,
    originalBlueFraction:blueA/count,candidateBlueFraction:blueB/count,
    strongPixelChangeFraction:strong/count,meanMaxChannelDifference:total/count,
    roiPixels:count,notIntegratedIntoM7:true,
    noIPhoneHomeScreenAcceptance:true};
  assert.ok(stats.editedIceVertexCount>=12);
  assert.notEqual(original.pngSha256,candidate.pngSha256);
  assert.ok(stats.strongPixelChangeFraction>.005,
    'Candidate made no measurable snow color change in actual original game');
  assert.ok(stats.candidateBlueFraction<=stats.originalBlueFraction+.03,
    'Candidate significantly worsened actual cyan snow cast');
  reports.push(stats);
  console.log('SNOW_S6_POST_DESERT_REAL_WEBGL2_PAIR '+JSON.stringify(stats));
 }
}finally{await browser.close()}
assert.equal(reports.length,2);
await writeFile(artifacts+'/manifest.json',
  JSON.stringify({kind:'exact-post-desert-original-game-S6-inmemory-only',
    pinnedProductionCommit:RELEASE,isolatedSnowHead:process.env.GITHUB_SHA??null,
    reports},null,2)+'\n');
