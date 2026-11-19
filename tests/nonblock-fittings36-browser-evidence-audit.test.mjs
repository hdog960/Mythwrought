import test from 'node:test';
import assert from 'node:assert/strict';
import {auditFittingBrowserEvidence,LANDSCAPE_VIEWPORTS,REQUIRED_STAGES} from '../src/nonblock-fittings36/browser-evidence-audit.mjs';
const sha='b650a20fcd47f011a61898470933e011476bbea3';
import {deflateSync} from 'node:zlib';
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const payload=Buffer.concat([name,data]);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(payload));return Buffer.concat([len,payload,crc]);}
function png(w,h){const header=Buffer.alloc(13);header.writeUInt32BE(w,0);header.writeUInt32BE(h,4);header[8]=8;header[9]=2;const raw=Buffer.alloc(h*(w*3+1));return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
const all=()=>LANDSCAPE_VIEWPORTS.flatMap(v=>REQUIRED_STAGES.map(stage=>({
 ...v,stage,sourceSha:sha,webgl2:true,contextLost:false,glErrors:0,fixtureOnly:true,productionAuthorized:false,
 png:png(v.width,v.height),instanceKey:'scene36:signpost:seed179',selectedKey:'scene36:signpost:seed179',
 visibleAfter:stage==='visible'||stage==='selected',tombstonePresent:stage==='removed'||stage==='restored',
 drawCalls:2,uploadBytes:2048
})));
test('complete 3-viewport 4-stage source-exact browser manifest remains fixture-only',()=>{
 const result=auditFittingBrowserEvidence({sourceSha:sha,captures:all()});
 assert.equal(result.captureCount,12);assert.equal(result.productionIntegrationReady,false);
});
test('missing, duplicate, mismatched SHA and invalid PNG dimensions fail closed',()=>{
 const captures=all();
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures:captures.slice(1)}),/12/);
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures:[...captures.slice(0,11),captures[0]]}),/duplicate/);
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures:captures.map((c,i)=>i===0?{...c,sourceSha:'0'.repeat(40)}:c)}),/source-exact/);
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures:captures.map((c,i)=>i===0?{...c,png:png(1,1)}:c)}),/dimension/);
});
test('fake WebGL, missing break witness and GPU budget excess fail closed',()=>{
 for(const mutation of [{webgl2:false},{productionAuthorized:true},{glErrors:1},{uploadBytes:4*1024*1024+1}]){
  const captures=all();captures[0]={...captures[0],...mutation};
  assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures}));
 }
 const captures=all();const i=captures.findIndex(c=>c.stage==='restored');
 captures[i]={...captures[i],tombstonePresent:false};
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures}),/witness/);
});

test('header-only PNGs cannot pass as authentic browser pixels',()=>{
 const captures=all();
 const header=new Uint8Array(33);header.set([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82]);
 new DataView(header.buffer).setUint32(16,667);new DataView(header.buffer).setUint32(20,375);
 captures[0]={...captures[0],png:header};
 assert.throws(()=>auditFittingBrowserEvidence({sourceSha:sha,captures}),/PNG|chunk|IEND|truncated|CRC/i);
});
