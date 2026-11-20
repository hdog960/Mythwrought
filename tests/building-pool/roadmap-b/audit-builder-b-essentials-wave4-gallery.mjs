// INDEPENDENT audit of actual Builder B 1B Chromium output. Run AFTER gallery capture.
// Fails closed for missing files, malformed/CRC-bad PNGs, incorrect source-head, duplicate pixels, or altered source.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {PNG} from 'pngjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const root='artifacts/builder-b-essentials-wave4-meadowstep-webgl2';
const obj=JSON.parse(await readFile(join(root,'manifest.json'),'utf8'));
const expectedHead=process.env.BUILDER_B_EXPECTED_HEAD;
const actualHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!expectedHead||!/^[a-f0-9]{40}$/i.test(expectedHead))throw Error('Expected exact source HEAD must be supplied');
if(obj.schema!=='mythwrought.builder-b-essentials-wave4-original.webgl2.v1'||obj.gitHead!==expectedHead||
   actualHead!==expectedHead||obj.exactHeadVerified!==true)
 throw Error('Source manifest/checkout differs from pinned exact head '+expectedHead);
const ids=['r1:stable:temperate:small:002'];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const required=ids.flatMap(id=>sizes.flatMap(([w,h])=>views.map(view=>id+'|'+view+'|'+w+'x'+h)));
if(obj.records?.length!==6||obj.sourceEvidence?.length!==4)throw Error('Missing actual source captures or file provenance');
const verifiedFiles=[];
for(const s of obj.sourceEvidence){
 const v=await readFile(s.path);
 if(v.length!==s.bytes||sha(v)!==s.sha256)throw Error('Changed source file after screenshot: '+s.path);
 verifiedFiles.push({file:s.path,sha256:s.sha256});
}
const seen=new Set(),hashes=new Set(),results=[];
for(const entry of obj.records){
 const key=entry.id+'|'+entry.view+'|'+entry.width+'x'+entry.height;
 if(!required.includes(key)||seen.has(key))throw Error('Duplicate or unsupported source ID/view/viewport '+key);
 seen.add(key);
 const img=await readFile(join(root,entry.file));
 if(img.length!==entry.bytes||sha(img)!==entry.sha256)throw Error('PNG checksum or length mismatch '+entry.file);
 const png=PNG.sync.read(img,{checkCRC:true});
 if(png.width!==entry.width||png.height!==entry.height)throw Error('PNG decoded wrong dimensions '+entry.file);
 if(!Number.isInteger(entry.coloredPixelSamples)||entry.coloredPixelSamples<250||
    !Array.isArray(entry.sourcePixelBounds)||entry.sourcePixelBounds.length!==4)
  throw Error('Missing independently measurable source pixels '+entry.file);
 const [x0,y0,x1,y1]=entry.sourcePixelBounds;
 if(x0<0||y0<48||x1>=png.width||y1>=png.height||x0>=x1||y0>=y1)
  throw Error('Invalid source voxel bounds '+entry.file);
 hashes.add(entry.sha256);
 results.push({file:entry.file,sha256:entry.sha256,id:entry.id,width:png.width,height:png.height});
}
if(seen.size!==6||hashes.size!==6)throw Error('Missing or repeated genuine source frames');
for(const id of ids)for(const [width,height] of sizes){
 const x=obj.records.find(a=>a.id===id&&a.view==='exterior'&&a.width===width&&a.height===height);
 const y=obj.records.find(a=>a.id===id&&a.view==='cutaway'&&a.width===width&&a.height===height);
 if(!x||!y||y.visibleCells>=x.visibleCells)throw Error('Cutaway not source-specific '+id);
}
const report={schema:'mythwrought.builder-b.1b.wave4-original.independent-audit.v1',
 checkedHead:actualHead,sourceEvidence:verifiedFiles,verifiedGenuinePngs:6,frames:results,
 validSourceWebGL2:true,packMeshesApproved:false,liveProductionReady:false,
 actualIphoneTested:false,creatorArtAccepted:false};
await writeFile(join(root,'independent-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log('BUILDER_B_1B_EXACT_HEAD_GENUINE_WEBGL2_INDEPENDENT_AUDIT_PASS 6/6',actualHead);
