// Mythwrought #291 — READ-ONLY real camera/loaded-chunk clip-space probe.
// No renderer/source changes, gl.getError, draw patch, synthesized frames,
// shader substitutions, altered error/rollback/save requirements, or acceptance changes.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const PR='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),PR,
  'Probe must be direct child of unchanged protected draft');
assert.deepEqual(execFileSync('git',['diff','--name-only',PR,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort(),[
  '.github/workflows/iphone-frustum-readonly-probe.yml',
  'scripts/ci/iphone-frustum-readonly-probe.mjs']);
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
const hash=async filename=>createHash('sha256').update(await readFile(filename)).digest('hex');
const dir='artifacts/iphone-frustum';
await mkdir(dir,{recursive:true});
const proof={kind:'ORIGINAL_GAME_FRUSTUM_READ_ONLY_DIAGNOSTIC_NO_SOURCE_CHANGES',
  prHead:PR,productionMain:MAIN,sourceHashes:{
    main:await hash('src/main.mjs'),depth:await hash('src/depth.mjs'),
    camera:await hash('src/camera.mjs'),gpu:await hash('src/gpu-recovery.mjs')},
  exactOriginalShader:{horizontalFovFromAspect:true,
    tanHalfVertical:Math.tan(72*Math.PI/360),
    glClipZ:'1.0015 * zCamera - 0.1501',
    glClipW:'zCamera',
    nearDepth:0.1501/2.0015,farDepth:0.1501/0.0015},
  noGlErrorInterference:true,shaderGeometryUnchanged:true,worldSchemaUnchanged:true,
  realIphone:false,releaseAcceptance:false,
  // +4m margins are conservative for naturally bounded 16m source cubes;
  // this read-only diagnostic does NOT certify Pack3/Pack5 protruding assets.
  aabbPaddingMeters:4,undocumentedShapeOverhangsPixelSafe:false,
  cases:[],errors:[],complete:false};
const pw=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const p95=x=>{let a=x.filter(Number.isFinite).sort((a,b)=>a-b);
  return a.length?Math.round(a[Math.floor((a.length-1)*.95)]*100)/100:null;};
async function run(width,height){
  const ctx=await pw.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
  try{
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest&&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
      null,{timeout:120000});
    const prep=await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
        for(let y=-78;y<=-76;y++){
          const result=t.placeFixture(x,y,z,0);
          if(!result.saved)throw Error('Original chamber source save failed');
        }
      t.teleportCave(1,-78,1);
      return {profile:t.fourBiomeMode(),seed:t.m5ObservedPose().seed};
    });
    await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===27,
      null,{timeout:120000});
    const e=await page.evaluate(async()=>{
      const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
      const sample=async(label,yaw,pitch)=>{
        t.setOrientation(yaw,pitch);
        await new Promise(resolve=>requestAnimationFrame(resolve));
        const pose=t.m5ObservedPose(),snap=t.snapshot();
        const aspect=scene.width/scene.height,tan=Math.tan(72*Math.PI/360);
        const eye=[pose.x,pose.feet+1.55,pose.z],
          fwd=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)],
          right=[-Math.cos(yaw),0,Math.sin(yaw)],
          up=[-Math.sin(pitch)*Math.sin(yaw),Math.cos(pitch),-Math.sin(pitch)*Math.cos(yaw)];
        const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
        const summary=[];
        for(const key of snap.chunks){
          const parts=key.split(',').map(Number);
          if(parts.length!==2&&parts.length!==3||parts.some(p=>!Number.isInteger(p)))
            throw Error('Unknown original GPU source chunk key '+key);
          const [cx,cz]=parts,sec=parts.length===3?parts[2]:0;
          const minY=sec===0?-3:-3+sec*16,
            maxY=sec===0?19:-3+(sec+1)*16-1;
          const corners=[];
          // Inflated AABB is conservative: if ALL eight padded corners are
          // strictly outside ONE original shader homogeneous clip halfspace,
          // entire source 16m section cube is outside that view.
          for(const x of [cx*16-4,cx*16+20])
            for(const y of [minY-4,maxY+5])
              for(const z of [cz*16-4,cz*16+20]){
                const d=[x-eye[0],y-eye[1],z-eye[2]],xf=dot(d,right),
                  yf=dot(d,up),zf=dot(d,fwd);
                corners.push([xf,yf,zf]);
              }
          const planes=[
            {id:'left',inside:([x,y,z])=> x+z*aspect*tan},
            {id:'right',inside:([x,y,z])=> -x+z*aspect*tan},
            {id:'bottom',inside:([x,y,z])=> y+z*tan},
            {id:'top',inside:([x,y,z])=> -y+z*tan},
            {id:'near',inside:([x,y,z])=> 2.0015*z-.1501},
            {id:'far',inside:([x,y,z])=> .1501-.0015*z}
          ];
          const rejects=planes.filter(q=>corners.every(c=>q.inside(c)<-1e-5)).map(q=>q.id);
          summary.push({key,cx,cz,section:sec,minY,maxY,
            conservativeOffscreen:rejects.length>0,rejectedBy:rejects});
        }
        return {label,yaw,pitch,eye,aspect,frameBuffer:[scene.width,scene.height],
          sceneRenderedFrames:Number(scene.dataset.renderedFrames),
          resident:summary.length,opaqueDrawCallsFromOriginalSource:summary.length,
          padMeters:4,offscreenDrawCallsUpperBound:summary.filter(s=>s.conservativeOffscreen).length,
          potentialOnscreenDrawCalls:summary.filter(s=>!s.conservativeOffscreen).length,
          totalSourceMeshVertices:Number(scene.dataset.renderedMeshVertices),
          chunks:summary};
      };
      const views=[];
      const orientations=[
        {yaw:0,pitch:0},{yaw:Math.PI/2,pitch:0},
        {yaw:Math.PI,pitch:0},{yaw:-Math.PI/2,pitch:0},
        {yaw:Math.PI/4,pitch:0},{yaw:0,pitch:-.65},
        {yaw:0,pitch:.65},{yaw:Math.PI/2,pitch:-.65},
        {yaw:Math.PI/2,pitch:.65},{yaw:0,pitch:1.2},
        {yaw:0,pitch:-1.2}];
      for(const [index,o] of orientations.entries())
        views.push(await sample('initial-'+index,o.yaw,o.pitch));
      const edits=[];
      for(let y=-79;y>=-102;y--){
        const time=performance.now();
        const u=t.placeFixture(1,y,1,0);
        if(u.saved!==true||t.block(1,y,1)!==0)
          throw Error('Source deep edit/save failed at '+y);
        t.teleportCave(1,y,1);
        edits.push({y,elapsed:performance.now()-time,
          upload:u.uploadMs,mesh:u.meshMs,save:u.saveMs,
          resident:Number(scene.dataset.loadedChunks)});
        // Original draw() refreshes actual dataset and loaded section window.
        await new Promise(resolve=>requestAnimationFrame(resolve));
        if(y===-90||y===-102)
          for(const [index,o] of orientations.entries())
            views.push(await sample('at-'+y+'-'+index,o.yaw,o.pitch));
      }
      const save=JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}');
      if(save.schema!==1)throw Error('Original schema-1 world save missing');
      return {views,edits,schema:save.schema,
        finalFeet:t.m5ObservedPose().feet,
        finalResident:Number(scene.dataset.loadedChunks),
        pending:t.snapshot().pending,
        gpuUploadFaults:t.gpuUploadFaults()};
    });
    assert.equal(e.edits.length,24);
    assert.ok(e.edits.every(x=>x.resident<=27&&x.resident>0));
    assert.ok(e.finalFeet<-100);
    assert.equal(e.schema,1);
    assert.equal(e.views.length,33);
    assert.ok(e.views.every(x=>x.resident<=27&&x.resident>0));
    await page.screenshot({path:dir+'/real-original-world-'+width+'x'+height+'.png'});
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
      'Original world data did not survive reload');
    assert.deepEqual(errors,[],'Source-original gameplay page errors');
    const c={viewport:width+'x'+height,profile:prep.profile,seed:prep.seed,
      schema:e.schema,realDeepEdits:e.edits.length,
      originalGpuResidentLimit:27,maxMeasuredResident:Math.max(...e.edits.map(y=>y.resident)),
      actionP95:p95(e.edits.map(x=>x.elapsed)),uploadP95:p95(e.edits.map(x=>x.upload)),
      genuineReload:true,realGameFrameCameraViews:e.views.length,
      sampleMinOffscreen:Math.min(...e.views.map(v=>v.offscreenDrawCallsUpperBound)),
      sampleMaxOffscreen:Math.max(...e.views.map(v=>v.offscreenDrawCallsUpperBound)),
      averageOffscreen:e.views.reduce((n,v)=>n+v.offscreenDrawCallsUpperBound,0)/e.views.length,
      views:e.views,edits:e.edits,gpuUploadFaults:e.gpuUploadFaults};
    proof.cases.push(c);
    await writeFile(dir+'/frustum-readonly.json',JSON.stringify(proof,null,2)+'\n');
    console.log('SOURCE_EXACT_FRUSTUM_RESULT',JSON.stringify({
      viewport:c.viewport,realEdits:c.realDeepEdits,sweeps:c.realGameFrameCameraViews,
      offscreenMin:c.sampleMinOffscreen,offscreenMax:c.sampleMaxOffscreen,
      offscreenMean:c.averageOffscreen,uploadP95:c.uploadP95,
      screenshot:width+'x'+height,saveReload:c.genuineReload}));
  }finally{await ctx.close();}
}
try{
  for(const [w,h] of [[844,390],[956,440]])await run(w,h);
  proof.complete=true;
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
  await writeFile(dir+'/frustum-readonly.json',JSON.stringify(proof,null,2)+'\n');
  await pw.close();
}
