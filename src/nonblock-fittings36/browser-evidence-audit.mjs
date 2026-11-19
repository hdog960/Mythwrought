// :36 fail-closed independent Chromium evidence audit. Never fabricates browser proof.
export const LANDSCAPE_VIEWPORTS=Object.freeze([[667,375],[844,390],[932,430]].map(([width,height])=>Object.freeze({width,height})));
export const REQUIRED_STAGES=Object.freeze(['visible','selected','removed','restored']);
const PNG_HEADER=[137,80,78,71,13,10,26,10];
function pngSize(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<33||PNG_HEADER.some((n,i)=>bytes[i]!==n))throw new Error('missing authentic PNG bytes');
 if(bytes[12]!==73||bytes[13]!==72||bytes[14]!==68||bytes[15]!==82)throw new Error('PNG missing IHDR');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(view.getUint32(8)!==13)throw new Error('invalid PNG IHDR length');
 return {width:view.getUint32(16),height:view.getUint32(20)};
}
export function auditFittingBrowserEvidence({sourceSha,captures}){
 if(!/^[a-f0-9]{40}$/.test(sourceSha||''))throw new Error('exact source SHA required');
 if(!Array.isArray(captures)||captures.length!==LANDSCAPE_VIEWPORTS.length*REQUIRED_STAGES.length)throw new Error('all 12 browser captures required');
 const seen=new Set(),records=[];
 for(const c of captures){
  if(c.sourceSha!==sourceSha||c.webgl2!==true||c.contextLost!==false||c.glErrors!==0)throw new Error('source-exact healthy WebGL2 required');
  if(c.fixtureOnly!==true||c.productionAuthorized!==false)throw new Error('fixture scope must be explicit');
  if(!REQUIRED_STAGES.includes(c.stage)||!LANDSCAPE_VIEWPORTS.some(v=>v.width===c.width&&v.height===c.height))throw new Error('unknown viewport or stage');
  const key=`${c.width}x${c.height}:${c.stage}`;
  if(seen.has(key))throw new Error('duplicate browser capture');seen.add(key);
  const size=pngSize(c.png);
  if(size.width!==c.width||size.height!==c.height)throw new Error('PNG dimension mismatch');
  if(typeof c.instanceKey!=='string'||!c.instanceKey||c.selectedKey!==c.instanceKey)throw new Error('object identity missing');
  if(c.stage==='removed'||c.stage==='restored'){
   if(c.visibleAfter!==false||c.tombstonePresent!==true)throw new Error('break/restore witness missing');
  }else if(c.visibleAfter!==true)throw new Error('visible mesh witness missing');
  if(!Number.isFinite(c.drawCalls)||c.drawCalls<0||!Number.isFinite(c.uploadBytes)||c.uploadBytes<0||c.uploadBytes>4*1024*1024)throw new Error('GPU evidence missing or over budget');
  records.push(Object.freeze({key,drawCalls:c.drawCalls,uploadBytes:c.uploadBytes}));
 }
 return Object.freeze({sourceSha,captureCount:records.length,records:Object.freeze(records),productionIntegrationReady:false});
}
