// MYTHWROUGHT Builder D: fail-closed audit of genuinely captured Chromium WebGL2 frames.
// This does not certify final physical Pack1-5 meshes, live gameplay or a real iPhone.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {ROADMAP_D_WAVE5_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave5.mjs';
const root=resolve(process.cwd());
const folder=resolve(root,'artifacts/building-pool/roadmap-d/d1-original-institutions-wave5-webgl2-cube-proxy');
const index=join(folder,'results.json');
assert.ok(existsSync(index),'48 authentic WebGL2 screenshots and results.json are required');
const manifest=JSON.parse(readFileSync(index,'utf8'));
const source=readFileSync(resolve(root,'src/building-pool/roadmap-d/d1-original-institutions-wave5.mjs'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const sourceSha=sha(source);
assert.equal(manifest.exactSourceSHA256,sourceSha,'frame source differs from checked out Builder D commit');
assert.equal(manifest.captureCount,48,'eight original designs x 2 authentic views x 3 sizes are required');
assert.equal(manifest.captures.length,48);
assert.deepEqual([manifest.physicalFamilyRendering,manifest.liveGameplay,manifest.physicalIphone],[false,false,false]);
const sizes=[[667,375],[844,390],[932,430]], expected=new Set();
for(let i=0;i<ROADMAP_D_WAVE5_BUILDINGS.length;i++)for(const [w,h] of sizes)for(const view of ['exterior','section'])
  expected.add(ROADMAP_D_WAVE5_BUILDINGS[i].id+'|'+view+'|'+w+'x'+h);
assert.equal(expected.size,48);
const found=new Set(),hashes=new Set(),records=[],byKey=new Map();
for(const c of manifest.captures){
 assert.ok(ROADMAP_D_WAVE5_BUILDINGS.some(b=>b.id===c.sourceId),'image refers to a non-owned source');
 const key=c.sourceId+'|'+c.view+'|'+c.width+'x'+c.height;
 assert.ok(expected.has(key)&&!found.has(key),'duplicate or unassigned actual frame '+key);
 found.add(key);
 assert.equal(c.renderer,'genuine-webgl2-cube-proxy');
 assert.equal(c.notPhysical,true);assert.equal(c.drawCalls,1);
 assert.equal(c.glError,0);assert.equal(c.contextLost,false);
 assert.equal(c.projectionWithinFrame,true);
 assert.ok(c.triangles>300&&c.cells>100);
 assert.ok(c.cameraFit.horizontalNdc>0&&c.cameraFit.horizontalNdc<0.86);
 assert.ok(c.cameraFit.verticalNdc>0&&c.cameraFit.verticalNdc<0.86);
 const name=String(c.png);assert.ok(/^[0-7]-[a-z-]+-(exterior|section)-(667x375|844x390|932x430)\.png$/.test(name),'unsound filename '+name);
 const buf=readFileSync(join(folder,name));
 assert.equal(buf.length,c.byteCount,'actual PNG byte count mismatch '+name);
 const img=PNG.sync.read(buf,{checkCRC:true});
 assert.deepEqual([img.width,img.height],[c.width,c.height],'decoded PNG size mismatch '+name);
 let occupied=0,minx=img.width,miny=img.height,maxx=-1,maxy=-1;
 // Real pixel check excludes the preview's known dark background (#14212e) and any label band.
 for(let y=48;y<img.height;y+=2)for(let x=0;x<img.width;x+=2){
   const k=(y*img.width+x)*4,[r,g,b]=img.data.subarray(k,k+3);
   if(r>70||g>85||b>110){occupied++;minx=Math.min(minx,x);miny=Math.min(miny,y);maxx=Math.max(maxx,x);maxy=Math.max(maxy,y);}
 }
 assert.ok(occupied>200&&maxx>minx+12&&maxy>miny+12,'empty or clipped source pixels '+name);
 const digest=sha(buf);assert.ok(!hashes.has(digest),'duplicate PNG payload '+key);hashes.add(digest);
 const record={sourceId:c.sourceId,view:c.view,width:c.width,height:c.height,png:name,sha256:digest,bytes:buf.length,
   sourceCells:c.cells,roomCount:c.roomCount,coloredPixelSamples:occupied,sourcePixelBounds:[minx,miny,maxx,maxy]};
 records.push(record);byKey.set(key,record);
}
assert.equal(found.size,48);assert.equal(hashes.size,48);
for(const b of ROADMAP_D_WAVE5_BUILDINGS)for(const [w,h] of sizes){
 const exterior=byKey.get(b.id+'|exterior|'+w+'x'+h),section=byKey.get(b.id+'|section|'+w+'x'+h);
 assert.ok(section.sourceCells<exterior.sourceCells,'cutaway does not expose interiors for '+b.id);
 assert.equal(section.roomCount,b.spaces.length);assert.equal(exterior.roomCount,b.spaces.length);
}
const result={schema:'mythwrought.roadmap-d.d5.genuine-webgl2-evidence.v1',
 gitHead:process.env.GITHUB_SHA||null,runId:process.env.GITHUB_RUN_ID||null,attempt:process.env.GITHUB_RUN_ATTEMPT||null,
 exactSourceSHA256:sourceSha,sourceCount:8,views:['exterior','section'],sizes,captureCount:48,uniquePNG:hashes.size,
 status:'PASS',realChromium:true,cubeProxy:true,physicalMeshesAccepted:false,iphoneAccepted:false,productionRegistered:false,
 captures:records.sort((a,b)=>a.sourceId.localeCompare(b.sourceId)||a.width-b.width||a.view.localeCompare(b.view))};
writeFileSync(join(folder,'audit.json'),JSON.stringify(result,null,2)+'\n');
console.log('Builder D D5 genuine-source WebGL2 gallery PASS: 48/48 decoded CRC-checked PNGs, unique hashes, three landscape sizes, real cutaways, zero GL errors');
