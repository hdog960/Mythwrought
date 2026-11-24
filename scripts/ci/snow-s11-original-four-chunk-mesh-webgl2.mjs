// SNOW S11 FOUR ADJACENT EXACT ORIGINAL SEED2026 M7 CHUNKS, 16 MESH BUILDS EACH.
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
const artifacts='artifacts/snow-s11-multichunk-original-mesh';
const base='production-readonly';
const sha=b=>createHash('sha256').update(b).digest('hex');
await mkdir(artifacts,{recursive:true});
const voxel=await readFile(base+'/src/voxel.mjs','utf8');
const main=await readFile(base+'/src/main.mjs','utf8');
const pigmentSource=await readFile('src/manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs','utf8');
assert.ok(voxel.includes("import {v6BiomeAt} from './manual-biomes/v6-balanced-biomes.mjs';"),
  'Desert release original biome color ownership moved');
const token='const groundColor=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?BIOME_GROUND_COLORS.get(id):undefined;';
assert.equal(voxel.split(token).length-1,1,'Pinned production color source anchor changed');
const originalFaceColor="const color=groundColor??biome130Color(id,x,y,z,face);";
const originalGround="const groundColor=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?BIOME_GROUND_COLORS.get(id):undefined;";
const originalVisible="if(!checkedVisibleHardpan&&groundColor&&id===258){";
for(const [name,needle] of [['face',originalFaceColor],['ground',originalGround],['visible',originalVisible]])
  assert.equal(voxel.split(needle).length-1,1,'Pinned original source '+name+' anchor moved');
const originalMesh="const unifiedTerrain=profile?.generator===M7_ENVIRONMENT_GENERATOR;";
assert.equal(voxel.split(originalMesh).length-1,1,'Original exact M7 mesh entry changed');
const snowImport="import {createSnowS10MeshResidentPigment} from './manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs';\n";
const newVisible="if(!snowS10Checked&&snowS10Mesh&&(id===272||id===276||id===279)){\nsnowS10Checked=true;\nconst sourceSurface=originalSurface(x,z);\nsnowS10Rgb=snowS10Mesh.colorAt(x,y,z,id,sourceSurface,\nblockAt(x,y,z),blockAt(x,y-1,z),blockAt(x,y+1,z),\nhasEdit(x,y,z),hasEdit(x,y-1,z),\nsourceWorld.environmentCaves?.get(x,y,z),\nsourceWorld.environmentCaves?.get(x,y-1,z));\n}\nif(!checkedVisibleHardpan&&groundColor&&id===258){";
const alteredVoxel=snowImport+voxel
  .replace(originalMesh,originalMesh+"\n  const snowS10Mesh=unifiedTerrain?createSnowS10MeshResidentPigment(world.seed,v6BiomeAt):null;")
  .replace(originalGround,originalGround+"\n          let snowS10Rgb,snowS10Checked=false;")
  .replace(originalVisible,newVisible)
  .replace(originalFaceColor,'const color=snowS10Rgb??groundColor??biome130Color(id,x,y,z,face);');
assert.equal(alteredVoxel.split('snowS10Mesh.colorAt(').length-1,1);
assert.equal(alteredVoxel.split(originalFaceColor).length-1,0);
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
      snowS8MeshBuildTimings(cx,cz,repetitions=8){
        if(![cx,cz,repetitions].every(Number.isSafeInteger)||
           repetitions<4||repetitions>16)throw Error('Invalid Snow S8 isolated mesh audit');
        const timings=[];
        let count=null,signature=null,bytes=null;
        for(let n=0;n<repetitions;n++){
          const start=performance.now();
          const mesh=meshChunk(world,cx,cz);
          const duration=performance.now()-start;
          if(!(mesh instanceof Float32Array)||mesh.length%9)
            throw Error('Original Snow S8 source mesh must be full Float32 vertices');
          if(count===null){
            count=mesh.length/9;bytes=mesh.byteLength;
            let h=2166136261>>>0;
            const bits=new Uint32Array(mesh.buffer,mesh.byteOffset,mesh.length);
            for(let v=0;v<bits.length;v+=9)
              for(const offset of [0,1,2,6,7,8])
                h=Math.imul(h^bits[v+offset],16777619)>>>0;
            signature=h;
          }else if(count!==mesh.length/9)
            throw Error('Original mesh vertex count changed within timed trials');
          timings.push(Math.round(duration*1000)/1000);
        }
        const ordered=timings.slice().sort((a,b)=>a-b);
        return {cx,cz,repetitions,vertices:count,bytes,
          geometryHash:signature,
          p50Ms:ordered[Math.floor((repetitions-1)*.5)],
          p95Ms:ordered[Math.ceil(repetitions*.95)-1],
          minMs:ordered[0],maxMs:ordered[ordered.length-1],
          samplesMs:timings};
      },
`;
assert.equal(main.split(hook).length-1,1,'Original local-only acceptance hook moved');
const alteredMain=main.replace(hook,helper);
const candidates=[{seed:2026,ice:[-144,9,504]}];
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
 let routeVoxel=0,routeMain=0,routePigment=0;
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
  if(stage!=='original'){
    await page.route('**/src/voxel.mjs',async route=>{
      routeVoxel++;
      const resp=await route.fetch(),body=await resp.text();
      assert.equal(resp.status(),200);
      assert.equal(sha(Buffer.from(body)),sha(Buffer.from(voxel)),
        'Unexpected original Desert voxel module from server');
      await route.fulfill({status:200,contentType:'text/javascript',body:alteredVoxel});
    });
    await page.route('**/src/manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs',
      async route=>{
        routePigment++;
        await route.fulfill({status:200,contentType:'text/javascript',body:pigmentSource});
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
  assert.equal(routeMain,1);assert.equal(routeVoxel,stage==='original'?0:1);
  assert.equal(routePigment,stage==='original'?0:1);
  // Isolated per-original game synchronous source mesh timing. Any
  // block edit happens only AFTER this real read-only benchmark.
  const meshTimes=await page.evaluate(()=>{
    const api=window.__mythwroughtTest;
    // Four REAL original chunks, shared edges; do not compare synthetic source.
    const chunks=[[-10,30],[-9,30],[-10,31],[-9,31]];
    return chunks.map(([cx,cz])=>
      api.snowS8MeshBuildTimings(cx,cz,16));
  });
  assert.equal(meshTimes.length,4);
  assert.ok(meshTimes.every(m=>m.vertices>0&&m.bytes>0&&
    m.samplesMs.length===16&&m.samplesMs.every(Number.isFinite)));
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
    browserCandidateVoxelSha256:stage!=='original'?
      sha(Buffer.from(alteredVoxel)):null,
    editedIce:edited,meshTimes,sourceRequests:{main:routeMain,voxel:routeVoxel,
      pigment:routePigment},pageErrors:errors};
  console.log('SNOW_S11_FOUR_ORIGINAL_CHUNKS_ORIGINAL_GAME_CAPTURE '+JSON.stringify({
    ...metadata,editedIce:{at:edited.at,id:edited.id,edited:edited.edited,
      meshVertices:edited.positions.length},meshTimes}));
  return metadata;
 }finally{await context.close()}
}
try{
 for(const {seed,ice} of candidates){
  const original=await take(seed,ice,'original',null);
  const candidate=await take(seed,ice,'s10',original.scene.chosen);
  const multiChunk=[];
  assert.equal(original.meshTimes.length,4);
  assert.equal(candidate.meshTimes.length,4);
  for(let n=0;n<4;n++){
    const base=original.meshTimes[n],test=candidate.meshTimes[n];
    assert.deepEqual([test.cx,test.cz],[base.cx,base.cz],
      'original and candidate source chunk identity changed');
    assert.equal(test.vertices,base.vertices,
      'S10 may not change any actual source chunk vertex count');
    assert.equal(test.bytes,base.bytes,
      'S10 may not change any original GPU buffer byte count');
    assert.equal(test.geometryHash,base.geometryHash,
      'S10 cannot modify any original geometry, UV or shader material tag');
    multiChunk.push({chunk:[base.cx,base.cz],vertices:base.vertices,
      bytes:base.bytes,geometryHash:base.geometryHash,
      originalP50Ms:base.p50Ms,s10P50Ms:test.p50Ms,
      originalP95Ms:base.p95Ms,s10P95Ms:test.p95Ms,
      sourceP50Within15Percent:test.p50Ms<=base.p50Ms*1.15,
      sourceP95Within15Percent:test.p95Ms<=base.p95Ms*1.15});
  }
  assert.deepEqual(candidate.scene,original.scene,
    'Original Desert and candidate camera or glacier identity mismatch');
  assert.deepEqual(candidate.editedIce,original.editedIce,
    'Original authored player ice physical mesh changed under S10 candidate');
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
  const stats={kind:'snow-s11-seed2026-four-native-original-chunk-mesh',
    productionCommit:RELEASE,seed,viewport,ice,scene:original.scene,
    originalSha256:original.pngSha256,
    candidateSha256:candidate.pngSha256,
    meshTimings:{original:original.meshTimes,s10:candidate.meshTimes},
    originalFourChunkComparison:multiChunk,
    geometryAndEditedIceParity:true,
    measuredMeshNoRegression:multiChunk.every(v=>v.sourceP50Within15Percent&&v.sourceP95Within15Percent),
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
  assert.ok(stats.candidateBlueFraction<stats.originalBlueFraction*.5,
    'Candidate significantly worsened actual cyan snow cast');
  reports.push(stats);
  console.log('SNOW_S11_FOUR_ORIGINAL_CHUNKS_REAL_WEBGL2_PAIR '+JSON.stringify(stats));
  assert.equal(stats.measuredMeshNoRegression,true,
    'S10 failed strict 15% p50 or p95 research budget on at least one original chunk');
 }
}finally{await browser.close()}
assert.equal(reports.length,1);
await writeFile(artifacts+'/manifest.json',
  JSON.stringify({kind:'exact-post-desert-original-game-S11-four-real-source-chunk-mesh',
    pinnedProductionCommit:RELEASE,isolatedSnowHead:process.env.GITHUB_SHA??null,
    reports},null,2)+'\n');
