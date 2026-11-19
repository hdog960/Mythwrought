import {createHash} from 'node:crypto';
export const gitBlobSha = bytes => { const b=Buffer.from(bytes); return createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'); };
const owners={scene48:'src/nonblock-scene48/',environments24:'src/nonblock-environments24/',fittings36:'src/nonblock-fittings36/'};
export function reconcileSourceEvidence(evidence) {
 const errors=[];
 for(const [owner,prefix] of Object.entries(owners)) {
  const producer=evidence?.producers?.[owner];
  if(!producer || !/^[a-f0-9]{40}$/.test(producer.head||'') || !producer.files?.length) {errors.push(owner+': missing exact HEAD/files');continue;}
  for(const file of producer.files) {
   if(typeof file.path!=='string'||!file.path.startsWith(prefix)||file.path.includes('..')) errors.push(owner+': forbidden path');
   if(typeof file.bytes!=='string'||gitBlobSha(file.bytes)!==file.blobSha) errors.push(owner+': blob mismatch');
  }
 }
 const keys=new Set();
 for(const obj of evidence?.objects||[]) {
  if(!obj.key||keys.has(obj.key)) errors.push('duplicate/empty instance key');
  keys.add(obj.key);
  if(!owners[obj.owner]) errors.push('invalid owner');
  if(obj.numericBlockId!==undefined||obj.defaultSpawn===true) errors.push('numeric block ID/default spawning');
  if(obj.pickable!==true||obj.breakable!==true||obj.removable!==true||obj.tombstoneKey!==obj.key) errors.push('unbreakable individual instance');
  const a=obj.selectionAabb;
  if(!Array.isArray(a)||a.length!==6||!a.every(Number.isFinite)||!a.slice(0,3).every((v,i)=>v<a[i+3])) errors.push('invalid selection AABB');
  if(obj.seed!==evidence.seed||obj.protectedEdit===true) errors.push('seed/edit violation');
  if(obj.kind==='fx'&&obj.ambient!==true&&!(obj.parentKey&&obj.parentRemovalAware)) errors.push('orphan FX');
 }
 if(!keys.size) errors.push('no object instances');
 const l=evidence?.lifecycle;
 if(l?.source!=='real-00'||!['pick','break','tombstone','reload','neighborPreserved','schema1BackupPreserved'].every(k=>l[k]===true)) errors.push('real :00 lifecycle unverified');
 if(!['667x375','844x390','932x430'].every(k=>evidence?.chromium?.[k]?.webgl2===true&&/^[a-f0-9]{64}$/.test(evidence.chromium[k].pngSha256||''))) errors.push('Chromium evidence incomplete');
 return {ok:errors.length===0,live:false,breakabilityReady:false,errors};
}
