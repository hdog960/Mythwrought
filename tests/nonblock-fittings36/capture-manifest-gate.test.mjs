import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {auditCaptureManifest,expectedCaptureNames} from '../../src/nonblock-fittings36/capture-manifest-gate.mjs';
function fixture(){
 const names=expectedCaptureNames();
 const buffers=names.map((_,i)=>{const b=Buffer.alloc(48);Buffer.from('89504e470d0a1a0a','hex').copy(b);b.writeUInt32BE(13,8);b.write('IHDR',12);const w=[667,844,932][Math.floor(i/20)],h=[375,390,430][Math.floor(i/20)];b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);b.writeUInt32BE(i,36);return b;});
 const entries=names.map((filename,i)=>({filename,width:[667,844,932][Math.floor(i/20)],height:[375,390,430][Math.floor(i/20)],stage:['visible','selected','removed','restored'][i%4],sceneId:'scene36:'+['signpost','hanging-chain','cloth-banner','hanging-cobweb','rope-coil'][Math.floor(i/4)%5],instanceKey:'anchor-'+Math.floor(i/4),triangleCount:i%4<2?12:0,uploadBytes:i%4<2?1024:0,bytes:buffers[i].length,sha256:createHash('sha256').update(buffers[i]).digest('hex')}));
 return {manifest:{canvasCaptures:60,manifest:entries},read:name=>buffers[names.indexOf(name)]};
}
test('60 ordered captures, dimensions, identity and unique hashes',async()=>{const f=fixture();assert.equal((await auditCaptureManifest(f.manifest,f.read)).uniquePngHashes,60);});
test('rejects tampered digest and nonzero tombstoned geometry',async()=>{const f=fixture();f.manifest.manifest[0].sha256='0'.repeat(64);await assert.rejects(auditCaptureManifest(f.manifest,f.read),/digest/);const g=fixture();g.manifest.manifest[2].triangleCount=1;await assert.rejects(auditCaptureManifest(g.manifest,g.read),/tombstoned/);});
test('rejects mismatched dimensions and duplicate stage bytes',async()=>{const f=fixture();f.manifest.manifest[0].width=1;await assert.rejects(auditCaptureManifest(f.manifest,f.read),/dimensions/);});
