// Opt-in producer dependency manifest validation; never fetches or imports producer code.
// This is provenance/coverage preflight, NOT proof of runtime integration.
const SHA=/^[0-9a-f]{40}$/;
const DIGEST=/^[0-9a-f]{64}$/;
const SAFE_PATH=/^(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+$/;
const LANES=['surface','caves','objects'];
export function validateProducerDependencyManifest(manifest) {
  const errors=[];
  if (!manifest || typeof manifest!=='object' || Array.isArray(manifest)) return Object.freeze({ok:false,errors:['manifest must be an object'],integrationVerified:false,browserVerified:false});
  const producers=manifest.producers;
  if (!producers || typeof producers!=='object' || Array.isArray(producers)) return Object.freeze({ok:false,errors:['producers must be an object'],integrationVerified:false,browserVerified:false});
  for (const lane of LANES) {
    const p=producers[lane];
    if (!p || typeof p!=='object' || Array.isArray(p)) {errors.push(lane+': missing producer');continue;}
    if (!SHA.test(p.head??'')) errors.push(lane+': invalid exact commit');
    if (!Number.isSafeInteger(p.pr)||p.pr<1) errors.push(lane+': invalid PR number');
    if (!Array.isArray(p.files)||!p.files.length) {errors.push(lane+': no pinned source files');continue;}
    const paths=new Set();
    for (const f of p.files) {
      if (!f || typeof f!=='object' || !SAFE_PATH.test(f.path??'') || f.path.includes('..') || f.path.startsWith('/')) {errors.push(lane+': unsafe source path');continue;}
      if (paths.has(f.path)) errors.push(lane+': duplicate source path '+f.path);
      paths.add(f.path);
      if (!DIGEST.test(f.sha256??'')) errors.push(lane+': missing SHA-256 for '+f.path);
    }
  }
  for (const key of Object.keys(producers)) if (!LANES.includes(key)) errors.push('unexpected producer lane '+key);
  if (manifest.evidence?.browserVerified===true || manifest.evidence?.integrationVerified===true) errors.push('manifest cannot self-certify integration/browser evidence');
  return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors),integrationVerified:false,browserVerified:false,provenanceOnly:true});
}
