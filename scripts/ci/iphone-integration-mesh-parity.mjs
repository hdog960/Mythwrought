// Mythwrought #291: original merged-main environment-aware byte-parity + CPU-only probe.
// Never commits source changes, WebGL calls, graphics, save data or shader edits.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const MAIN='7016e14cd6289f45eaf7fc6a79a362b47996df65';
const DRAFT='82f8828945b464acf0a71faddfe2d18ffa4df245';
const OUT='artifacts/iphone-integration-mesh-parity';
await mkdir(OUT,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),MAIN);
assert.equal(execFileSync('git',['-C','baseline-draft','rev-parse','HEAD'],{encoding:'utf8'}).trim(),DRAFT);
assert.deepEqual(execFileSync('git',['diff','--name-only',MAIN,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort(),
 ['.github/workflows/iphone-integration-mesh-parity.yml',
  'scripts/ci/iphone-integration-mesh-parity.mjs']);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const original=await readFile('src/depth-mesh.mjs','utf8'),
  main=await readFile('src/main.mjs','utf8'),
  recovery=await readFile('src/gpu-recovery.mjs','utf8'),
  oldRecovery=await readFile('baseline-draft/src/gpu-recovery.mjs','utf8');
assert.ok(original.includes("import {environmentGround} from './environment-ground.mjs';"));
assert.ok(original.includes('const naturalGround=environmentGround(id);'));
assert.ok(!recovery.includes('uploadEditedChunkBuffersAtomic'));
assert.ok(oldRecovery.includes('uploadEditedChunkBuffersAtomic'));
const report={
 kind:'ISOLATED_CURRENT_MERGED_MAIN_EXACT_MESH_GEOMETRY_PARITY_CPU_DIAGNOSTIC',
 productionMain:MAIN,frozenDraft:DRAFT,gameSourceOnGitUnchanged:true,
 integratedEnvironmentGroundUnchanged:true,
 sources:{meshSHA256:hash(original),mainSHA256:hash(main),gpuSHA256:hash(recovery)},
 noGLQueriesOrChangedVisuals:true,notPhysicalIphone:true,notReleaseAcceptance:true,
 comparisons:[],error:null,complete:false
};
const replaceUnique=(source,needle,change)=>{
 assert.equal(source.split(needle).length,2,'Original source anchor not unique: '+needle.slice(0,95));
 return source.replace(needle,change);
};
const PREFACE="\nconst __columns=new WeakMap();\nconst __EMPTY=new Float32Array(0);\nconst __MAX_SECTIONS=36,__MAX_BYTES=12*1024*1024;\nconst __key=(cx,cz,section)=>cx+','+cz+','+section;\nfunction __saveColumns(world,key,columns){\n let cache=__columns.get(world);\n if(!cache){cache=new Map();__columns.set(world,cache);}\n const bytes=columns.reduce((n,c)=>n+(c?.byteLength??0),0);\n cache.delete(key);\n if(bytes>__MAX_BYTES)return;\n cache.set(key,{columns,bytes});\n let total=0;for(const row of cache.values())total+=row.bytes;\n while(cache.size>__MAX_SECTIONS||total>__MAX_BYTES){\n  const oldest=cache.keys().next().value;\n  total-=cache.get(oldest).bytes;cache.delete(oldest);\n }\n}\nfunction __join(columns){\n const length=columns.reduce((n,c)=>n+c.length,0);\n const result=new Float32Array(length);\n let p=0;for(const c of columns){result.set(c,p);p+=c.length;}\n return result;\n}\nexport function discardDepthMeshCache(world){if(world)__columns.delete(world);}\nexport function meshDepthSection(world,cx,cz,section){\n return __update(world,cx,cz,section,null).vertices;\n}\nexport function meshDepthSectionUpdate(world,cx,cz,section,editedCell){\n if(!Array.isArray(editedCell)||editedCell.length!==3||\n    !editedCell.every(Number.isInteger))\n  throw Error('Invalid incremental cell');\n return __update(world,cx,cz,section,editedCell);\n}\nfunction __update(world,cx,cz,section,editedCell){\n const key=__key(cx,cz,section),prev=__columns.get(world)?.get(key);\n let dirty=null;\n if(prev&&editedCell){\n  dirty=new Set();\n  for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){\n   const ix=editedCell[0]+dx-cx*CHUNK_SIZE,\n     iz=editedCell[2]+dz-cz*CHUNK_SIZE;\n   if(ix>=0&&ix<CHUNK_SIZE&&iz>=0&&iz<CHUNK_SIZE)\n    dirty.add(ix*CHUNK_SIZE+iz);\n  }\n  if(!dirty.size)dirty=null;\n }\n const next=__meshCore(world,cx,cz,section,dirty);\n if(dirty&&prev){\n  const combined=prev.columns.slice();let changed=false;\n  for(const index of dirty){\n   const old=combined[index],fresh=next.columns[index];\n   if(old.length!==fresh.length)changed=true;\n   else {\n    const a=new Uint8Array(old.buffer,old.byteOffset,old.byteLength);\n    const b=new Uint8Array(fresh.buffer,fresh.byteOffset,fresh.byteLength);\n    for(let j=0;j<a.length;j++)if(a[j]!==b[j]){changed=true;break;}\n   }\n   combined[index]=fresh;\n  }\n  if(changed)__saveColumns(world,key,combined);\n  return {vertices:__join(combined),changed};\n }\n __saveColumns(world,key,next.columns);\n return {vertices:next.vertices,changed:true};\n}\nfunction __meshCore(world,cx,cz,section,dirty){\n";
const LOOP_OLD="  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)\n    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++)\n      for(let y=bounds.minY;y<=bounds.maxY;y++){",LOOP_NEW="  const columns=new Array(CHUNK_SIZE*CHUNK_SIZE);\n  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)\n    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++){\n      const index=(x-cx*CHUNK_SIZE)*CHUNK_SIZE+z-cz*CHUNK_SIZE;\n      if(dirty&&!dirty.has(index))continue;\n      const start=length;\n      for(let y=bounds.minY;y<=bounds.maxY;y++){";
const END_OLD="      }\n  return vertices.slice(0,length);\n}",END_NEW="      }\n      columns[index]=length===start?__EMPTY:vertices.slice(start,length);\n    }\n  return {vertices:vertices.slice(0,length),columns};\n}";
let candidate=replaceUnique(original,'export function meshDepthSection(world,cx,cz,section){',PREFACE);
candidate=replaceUnique(candidate,LOOP_OLD,LOOP_NEW);
candidate=replaceUnique(candidate,END_OLD,END_NEW);
assert.equal(candidate.split('const naturalGround=environmentGround(id);').length,2);
report.candidateSHA256=hash(candidate);
const tmp='src/depth-mesh-parity-runner-only-291.mjs';
await writeFile(tmp,candidate,'utf8');
const p95=x=>{
 const a=x.filter(Number.isFinite).sort((l,r)=>l-r);
 return a.length?Math.round(a[Math.floor((a.length-1)*.95)]*100)/100:null;
};
const eq=(a,b,label)=>{
 assert.equal(a.byteLength,b.byteLength,'Source float-array size mismatch '+label);
 const x=Buffer.from(a.buffer,a.byteOffset,a.byteLength),
  y=Buffer.from(b.buffer,b.byteOffset,b.byteLength);
 assert.ok(x.equals(y),'Integrated main source triangle byte mismatch '+label);
 return hash(x);
};
try{
 const [voxel,deep,incremental,depth,environment]=await Promise.all([
  import('../../src/voxel.mjs'),import('../../src/depth-mesh.mjs'),
  import(pathToFileURL(resolve(tmp)).href+'?same-main='+MAIN),
  import('../../src/depth.mjs'),import('../../src/environment-ground.mjs')
 ]);
 const world=new voxel.VoxelWorld(179),sizes=[-4,-5,-6,-7];
 for(const section of sizes){
  for(const [cx,cz] of [[0,0],[-1,0],[0,-1],[1,0]]){
   const x=deep.meshDepthSection(world,cx,cz,section),
    y=incremental.meshDepthSection(world,cx,cz,section);
   report.comparisons.push({stage:'initial',section,cx,cz,vertexCount:x.length,
    sha: eq(x,y,'baseline '+cx+','+cz+','+section)});
  }
 }
 const edits=[];
 for(let y=-79;y>=-102;y--)edits.push([1,y,1,0]);
 for(const x of [-1,0,15,16])
  for(const y of [-79,-83,-95,-99])edits.push([x,y,1,0]);
 let originalTime=0,candidateTime=0,originalSamples=[],candidateSamples=[];
 for(const [i,edit] of edits.entries()){
  const [x,y,z,id]=edit;
  assert.ok(world.set(x,y,z,id),'Original VoxelWorld.set rejected edit '+i);
  for(const section of depth.verticalEditSections(y)){
   for(const [dx,dz] of [[0,0],[-1,0],[1,0],[0,-1],[0,1]]){
    const cx=Math.floor(x/16)+dx,cz=Math.floor(z/16)+dz;
    const start=performance.now(),expected=deep.meshDepthSection(world,cx,cz,section),
     ms1=performance.now()-start;
    const again=performance.now(),
     actual=incremental.meshDepthSectionUpdate(world,cx,cz,section,[x,y,z]),
     ms2=performance.now()-again;
    originalSamples.push(ms1);candidateSamples.push(ms2);
    report.comparisons.push({stage:'real-source-edit',step:i,edit,section,cx,cz,
     vertices:expected.length,changed:actual.changed,meshOriginalMs:ms1,
     meshCandidateMs:ms2,sha:eq(expected,actual.vertices,'edit '+i+' section '+section)});
   }
  }
 }
 // Exercise the merge-only environment IDs, including plant materials,
 // against precisely the ORIGINAL merged-main full mesher (no faked frames).
 const materialIds=Object.values(environment.ENVIRONMENT_GROUND);
 for(const materialId of materialIds){
  const materialWorld={get(x,y,z){
    if(x===1&&z===1&&y===-79)return materialId;
    return world.get(x,y,z);
  },seed:world.seed};
  const expected=deep.meshDepthSection(materialWorld,0,0,-5),
   actual=incremental.meshDepthSection(materialWorld,0,0,-5);
  report.comparisons.push({stage:'merged-main-environment-material',materialId,
   vertices:expected.length,sha:eq(expected,actual,'original ground material '+materialId)});
 }
 report.complete=true;
 report.summary={sourceExact:true,realNativeWorldSeed:179,editableRealVoxelCells:edits.length,
  exactByteParityCases:report.comparisons.length,environmentGroundMaterialIDs:materialIds,
  originalCpuP95:p95(originalSamples),candidateCpuP95:p95(candidateSamples),
  originalCpuTotalMs:originalSamples.reduce((n,v)=>n+v,0),
  candidateCpuTotalMs:candidateSamples.reduce((n,v)=>n+v,0),
  note:'Original game engine native voxel mesher source, CPU-only; no WebGL CPU/GPU-upload gain or full V6 visual certification implied'};
 console.log('INTEGRATED_MAIN_NATIVE_GEOMETRY_PARITY',JSON.stringify(report.summary));
}catch(e){report.error=String(e?.stack||e);throw e;}
finally{
 await writeFile(OUT+'/integrated-mesh-geometry-parity.json',JSON.stringify(report,null,2)+'\n');
 await unlink(tmp).catch(()=>{});
}
