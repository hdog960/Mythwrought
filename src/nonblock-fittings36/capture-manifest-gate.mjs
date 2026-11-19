// :36 evidence integrity gate. Pure Node, opt-in, never touches production saves.
import {readFile} from 'node:fs/promises';
import {join,basename} from 'node:path';
import {createHash} from 'node:crypto';
const SIZES=[[667,375],[844,390],[932,430]];
const SCENES=['signpost','hanging-chain','cloth-banner','hanging-cobweb','rope-coil'];
const STAGES=['visible','selected','removed','restored'];
export const expectedCaptureNames=()=>SIZES.flatMap(([w,h])=>SCENES.flatMap(s=>STAGES.map(t=>`fittings36-${w}x${h}-${s}-${t}.png`)));
export function auditCaptureManifest(manifest,readPng){
 if(!manifest||manifest.canvasCaptures!==60||!Array.isArray(manifest.manifest)||manifest.manifest.length!==60)
  throw Error('60 real capture records required');
 if(typeof readPng!=='function')throw TypeError('PNG reader required');
 const expected=expectedCaptureNames(),hashes=new Set(),perScene=new Map();
 return Promise.all(manifest.manifest.map(async(entry,i)=>{
  if(entry.filename!==expected[i]||basename(entry.filename)!==entry.filename)throw Error('capture ordering/name mismatch');
  const bytes=await readPng(entry.filename);
  if(!Buffer.isBuffer(bytes)||bytes.length<33||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')
   throw Error('invalid PNG bytes');
  if(bytes.toString('ascii',12,16)!=='IHDR')throw Error('missing PNG IHDR');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
  const [w,h]=SIZES[Math.floor(i/20)];
  if(width!==w||height!==h||entry.width!==w||entry.height!==h)throw Error('PNG dimensions mismatch');
  const hash=createHash('sha256').update(bytes).digest('hex');
  if(hash!==entry.sha256||entry.bytes!==bytes.length)throw Error('PNG digest/byte mismatch');
  if(hashes.has(hash))throw Error('duplicate image bytes: likely missing interaction stage');
  hashes.add(hash);
  if(!Number.isSafeInteger(entry.triangleCount)||entry.triangleCount<0||
     !Number.isSafeInteger(entry.uploadBytes)||entry.uploadBytes<0||entry.uploadBytes>4*1024*1024)
   throw Error('invalid GPU accounting');
  const stage=STAGES[i%4];
  if(entry.stage!==stage||entry.sceneId!==`scene36:${SCENES[Math.floor(i/4)%5]}`)
   throw Error('scene/stage mismatch');
  if((stage==='removed'||stage==='restored')&&entry.triangleCount!==0)
   throw Error('tombstoned object still draws triangles');
  if((stage==='visible'||stage==='selected')&&entry.triangleCount<=0)
   throw Error('live object has no geometry');
  const key=`${w}x${h}:${entry.sceneId}`;
  if(perScene.has(key)&&perScene.get(key)!==entry.instanceKey)throw Error('unstable instance identity');
  perScene.set(key,entry.instanceKey);
 })).then(()=>Object.freeze({captures:60,uniquePngHashes:hashes.size,sceneViewports:perScene.size,
  productionBreakVerified:false,productionSaveVerified:false}));
}
export async function auditCaptureDirectory(directory){
 const manifest=JSON.parse(await readFile(join(directory,'manifest.json'),'utf8'));
 return auditCaptureManifest(manifest,name=>readFile(join(directory,name)));
}
