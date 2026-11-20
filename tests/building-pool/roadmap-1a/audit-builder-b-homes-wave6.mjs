// INDEPENDENT exact-head CRC/SHA/PNG audit of genuine Builder B 1A source/Pack-visible-AABB Chromium artifacts.
// Runs only AFTER the original one-building WebGL2 screenshot tests; never claims real iPhone, texture or live-world approval.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {PNG} from 'pngjs';
import {getBuilderBHomesWave6} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave6.mjs';
const sourceHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),expectedHead=process.env.BUILDER_B_EXPECTED_HEAD;
if(!expectedHead||!/^[0-9a-f]{40}$/i.test(expectedHead)||sourceHead!==expectedHead)
 throw Error('Builder B 1A screenshot checkout is not exact PR HEAD');
const sha=b=>createHash('sha256').update(b).digest('hex');
const root='artifacts/builder-b-homes-wave6-willowmere';
const ids=getBuilderBHomesWave6().map(b=>b.id);
if(ids.length!==1||new Set(ids).size!==1)throw Error('Willowmere source IDs not exactly one genuinely authored building');
const views=['exterior','cutaway'],sizes=[[667,375],[844,390],[932,430]];
const allHashes=new Set(),final=[];
for(const [mode,folder,manifestName,renderer] of [
 ['cube','chromium-source-cube','source-acceptance.json','CHROMIUM_WEBGL2_AUTHORED_CELL_CUBE_DIAGNOSTIC'],
 ['pack-visible-aabb','chromium-producer-aabb','source-aabb-acceptance.json','CHROMIUM_WEBGL2_SOURCE_PACK_VISIBLE_AABB_CANDIDATE_DIAGNOSTIC']
]){
 const dir=join(root,folder),file=JSON.parse(await readFile(join(dir,manifestName),'utf8'));
 const records=file.captures;
 if(records?.length!==6||new Set(records.map(x=>x.filename)).size!==6)throw Error('Missing 6 original '+mode+' source frames');
 if(file.renderer!==renderer)throw Error('Renderer identity mismatch '+mode);
 if(mode==='cube'&&file.familyPhysicalAABBsRendered!==false)throw Error('Source-cube falsely claims physical geometry');
 if(mode==='pack-visible-aabb'&&file.sourceVisibleAABBs!==true)throw Error('Pack physical source AABB metadata invalid');
 const seen=new Set(),screens=[];
 for(const rec of records){
  if(!ids.includes(rec.id)||!views.includes(rec.view)||!sizes.some(([w,h])=>rec.viewport[0]===w&&rec.viewport[1]===h))
   throw Error('Wrong actual building/view/landscape source image '+rec.filename);
  const key=[rec.id,rec.view,...rec.viewport].join('|');
  if(seen.has(key))throw Error('Duplicate actual source screenshot '+key);
  seen.add(key);
  if(rec.renderer!==renderer)throw Error('Renderer provenance changed '+key);
  const buf=await readFile(join(dir,rec.filename)),p=PNG.sync.read(buf,{checkCRC:true});
  const [width,height]=rec.viewport;
  if(p.width!==width||p.height!==height||buf.length!==rec.bytes||buf.length<2278)
   throw Error('Empty, corrupt or wrong dimension PNG '+rec.filename);
  const hash=sha(buf);if(allHashes.has(hash))throw Error('Repeated actual screenshot image '+rec.filename);
  allHashes.add(hash);
  let foreground=0;
  for(let y=48;y<height-36;y+=4)for(let x=6;x<width-6;x+=4){
   const k=(y*width+x)*4;
   if(Math.abs(p.data[k]-18)>35||Math.abs(p.data[k+1]-28)>35||Math.abs(p.data[k+2]-41)>35)foreground++;
  }
  if(foreground<60||rec.foreground<=20)throw Error('Real GPU screenshot lacks building geometry '+rec.filename);
  screens.push({id:rec.id,view:rec.view,viewport:rec.viewport,filename:rec.filename,
   sha256:hash,bytes:buf.length,foregroundSamples:foreground});
 }
 if(seen.size!==6)throw Error('Missing unique 6 renders '+mode);
 final.push({mode,frames:screens});
}
const sources=['src/building-pool/roadmap-1a/builder-b-homes-wave6.mjs',
 'tests/building-pool/roadmap-1a/builder-b-homes-wave6-preview.mjs',
 'tests/building-pool/roadmap-1a/builder-b-homes-wave6-preview.html'];
const evidence=await Promise.all(sources.map(async path=>{const b=await readFile(path);return {path,bytes:b.length,sha256:sha(b)}}));
const report={schema:'mythwrought.builder-b.1a.original-wave6.independent-crc-sha-audit.v1',
 exactSourceHead:sourceHead,sourceFiles:evidence,realChromiumWebGL2Frames:12,types:final,
 actualIphoneTested:false,finalTexturedArtwork:false,producerCollisionAndLoadCertified:false,
 runtimeRegistered:false,productionDeployed:false,creatorAccepted:false};
await writeFile(join(root,'independent-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log('BUILDER_B_1A_EXACT_HEAD_REAL_CHROMIUM_SOURCE_AND_PACK_AABB_PNG_PASS 12/12',sourceHead);
