// Opt-in :12 evidence binding. This validates supplied bytes, not their provenance or production integration.
import { createHash } from 'node:crypto';
const hex=/^[0-9a-f]{64}$/;
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const fail=reason=>({ok:false,live:false,reason});
export function verifyRemovalCaptureBundle(bundle) {
  if (!bundle || typeof bundle!=='object' || !Array.isArray(bundle.stages) || bundle.stages.length!==4) return fail('four stages required');
  if (!Array.isArray(bundle.captures) || bundle.captures.length!==3) return fail('three captures required');
  const phases=['before','picked','removed','reloaded'];
  const dimensions=['667x375','844x390','932x430'];
  const digests=new Set();
  for (let i=0;i<4;i++){
    const stage=bundle.stages[i];
    if (!stage || stage.phase!==phases[i] || typeof stage.bytes!=='string' || !hex.test(stage.sha256||'')) return fail('stage evidence missing');
    if (sha256(Buffer.from(stage.bytes,'utf8'))!==stage.sha256) return fail('stage byte digest mismatch');
    let parsed;
    try { parsed=JSON.parse(stage.bytes); } catch { return fail('invalid stage JSON'); }
    if (!parsed || parsed.phase!==phases[i] || parsed.seed!==bundle.seed || !Array.isArray(parsed.visible) || !Array.isArray(parsed.tombstones)) return fail('stage payload mismatch');
    if (new Set(parsed.visible).size!==parsed.visible.length || new Set(parsed.tombstones).size!==parsed.tombstones.length) return fail('duplicate identity');
    if (parsed.visible.some(k=>parsed.tombstones.includes(k))) return fail('visible tombstone');
    stage.parsed=parsed;
  }
  const [before,picked,removed,reloaded]=bundle.stages.map(s=>s.parsed);
  const same=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
  const target=bundle.target;
  if (typeof target!=='string' || !target.startsWith('nb1:') || !before.visible.includes(target)) return fail('target identity missing');
  if (!same(before.visible,picked.visible) || !same(before.tombstones,picked.tombstones) || picked.pickedKey!==target) return fail('picking changed world');
  if (!same(removed.visible,before.visible.filter(k=>k!==target)) || !same(removed.tombstones,[...before.tombstones,target])) return fail('removal not isolated');
  if (!same(reloaded.visible,removed.visible) || !same(reloaded.tombstones,removed.tombstones)) return fail('reload diverged');
  if (![removed,reloaded].every(s=>s.saveSchema===1 && s.backupPreserved===true && s.saveSeed===bundle.seed)) return fail('schema-1 backup evidence missing');
  if (!same(before.worldEditKeys||[],reloaded.worldEditKeys||[])) return fail('historical edits changed');
  for(let i=0;i<3;i++){
    const c=bundle.captures[i];
    if (!c || c.dimensions!==dimensions[i] || typeof c.bytesBase64!=='string' || !hex.test(c.sha256||'')) return fail('capture evidence missing');
    const bytes=Buffer.from(c.bytesBase64,'base64');
    if (!bytes.length || bytes.toString('base64')!==c.bytesBase64 || sha256(bytes)!==c.sha256) return fail('capture bytes mismatch');
    if (bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') return fail('capture not PNG');
    if (bytes.length<24 || bytes.readUInt32BE(16)+'x'+bytes.readUInt32BE(20)!==dimensions[i]) return fail('PNG dimensions mismatch');
    if(digests.has(c.sha256)) return fail('reused screenshot');
    digests.add(c.sha256);
  }
  return {ok:true,live:false,reason:'bytes consistent only; real :00 hooks and Chromium provenance NOT VERIFIED'};
}
