// Opt-in acceptance-only evidence gate. Never imported by the game.
export function auditSiblingRemovalWitness(w) {
  const errors=[];
  const fail=(code)=>errors.push(code);
  if (!w || typeof w!=="object") return {accepted:false,live:false,errors:["missing-witness"]};
  if(w.productionEnabled!==false) fail("production-enabled");
  if(w.schema!==1) fail("schema-not-one");
  if(typeof w.seed!=="string"||!w.seed) fail("missing-seed");
  if(!Array.isArray(w.before)||!Array.isArray(w.after)||!Array.isArray(w.reloaded)) fail("missing-snapshots");
  if(!Array.isArray(w.tombstonesBefore)||!Array.isArray(w.tombstonesAfter)||!Array.isArray(w.tombstonesReloaded)) fail("missing-tombstones");
  if(errors.length) return {accepted:false,live:false,errors};
  const snapshot=(a,label)=>{
    const map=new Map();
    for(const o of a) {
      if(!o||typeof o.key!=="string"||!o.key.startsWith("nonblock:")||typeof o.family!=="string"||!o.family||o.seed!==w.seed) {fail(label+"-invalid-object");continue;}
      if(map.has(o.key)) fail(label+"-duplicate-key");
      if(typeof o.anchor!=="string"||!o.anchor||!Array.isArray(o.aabb)||o.aabb.length!==6||o.aabb.some(n=>!Number.isFinite(n))||o.aabb.slice(0,3).some((n,i)=>n>=o.aabb[i+3])) fail(label+"-invalid-geometry");
      map.set(o.key,JSON.stringify(o));
    }
    return map;
  };
  const before=snapshot(w.before,"before"),after=snapshot(w.after,"after"),reload=snapshot(w.reloaded,"reload");
  const target=w.targetKey;
  if(typeof target!=="string"||!before.has(target)) fail("target-not-in-before");
  if(after.has(target)||reload.has(target)) fail("target-respawned");
  for(const [key,value] of before) {
    if(key===target) continue;
    if(after.get(key)!==value||reload.get(key)!==value) fail("sibling-mutated:"+key);
  }
  if(after.size!==Math.max(0,before.size-1)||reload.size!==after.size) fail("object-count-drift");
  const tomb=(a,label)=>{const s=new Set();for(const k of a){if(typeof k!=="string"||!k.startsWith("nonblock:")||s.has(k))fail(label+"-invalid-tombstone");s.add(k);}return s;};
  const old=tomb(w.tombstonesBefore,"before"),post=tomb(w.tombstonesAfter,"after"),restored=tomb(w.tombstonesReloaded,"reload");
  if(old.has(target)||!post.has(target)||!restored.has(target)) fail("target-tombstone-invalid");
  for(const k of old)if(!post.has(k)||!restored.has(k))fail("historical-tombstone-lost");
  if(post.size!==old.size+1||restored.size!==post.size||[...post].some(k=>!restored.has(k)))fail("tombstone-set-drift");
  if(typeof w.editsBefore!=="string"||w.editsBefore!==w.editsAfter||w.editsBefore!==w.editsReloaded)fail("world-edits-changed");
  if(typeof w.backupBefore!=="string"||!w.backupBefore||w.backupBefore!==w.backupAfter)fail("backup-changed");
  if(w.pick?.key!==target||w.break?.key!==target||w.remove?.key!==target||w.reload?.seed!==w.seed)fail("lifecycle-identity-mismatch");
  if(!Array.isArray(w.sourceHeads)||w.sourceHeads.length!==4||new Set(w.sourceHeads.map(x=>x?.lane)).size!==4||["00","24","36","48"].some(l=>!w.sourceHeads.some(x=>x?.lane===l&&/^[a-f0-9]{40}$/.test(x.sha))))fail("missing-source-heads");
  return {accepted:errors.length===0,live:false,errors};
}
