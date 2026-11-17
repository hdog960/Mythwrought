// Candidate-only decoded schema-1 fixture boundary. No live save access or migration.
const bad=reason=>Object.freeze({ok:false,status:'NOT_VERIFIED',reason,saveSchemaVerified:false,integrationVerified:false});
const valid=p=>p&&[p.x,p.y,p.z].every(Number.isSafeInteger);
const key=p=>[p.x,p.y,p.z].join(',');
export function inspectSchema1EditIntent({before,after,ledger,seed}={}){
 if(typeof seed!=='string'||!seed||seed.length>128||!before||!after||!Array.isArray(ledger))return bad('invalid-input');
 if(before.schema!==1||after.schema!==1)return bad('schema-mismatch');
 if(before.seed!==seed||after.seed!==seed)return bad('seed-mismatch');
 if(!Array.isArray(before.cells)||!Array.isArray(after.cells))return bad('missing-cells');
 const scan=cells=>{const m=new Map();for(const c of cells){if(!valid(c)||!Number.isSafeInteger(c.blockId)||c.blockId<0||m.has(key(c)))return null;m.set(key(c),c.blockId)}return m};
 const a=scan(before.cells),b=scan(after.cells);if(!a||!b)return bad('invalid-or-duplicate-cells');
 const edits=new Map();for(const e of ledger){if(!valid(e)||e.intent!=='player'||!Number.isSafeInteger(e.blockId)||e.blockId<0)return bad('invalid-edit-provenance');if(edits.has(key(e)))return bad('duplicate-edit');edits.set(key(e),e.blockId)}
 if(a.size!==b.size||[...a].some(([k,v])=>b.get(k)!==v))return bad('snapshot-drift');
 if([...edits].some(([k,v])=>a.get(k)!==v||b.get(k)!==v))return bad('edit-not-replayed');
 if(!Array.isArray(before.restoredNaturalKeys)||!Array.isArray(after.restoredNaturalKeys))return bad('missing-restoration-witness');
 const witness=keys=>keys.every(k=>typeof k==='string'&&edits.has(k))&&new Set(keys).size===keys.length;
 if(!witness(before.restoredNaturalKeys)||!witness(after.restoredNaturalKeys)||JSON.stringify([...before.restoredNaturalKeys].sort())!==JSON.stringify([...after.restoredNaturalKeys].sort()))return bad('restoration-intent-lost');
 return Object.freeze({ok:true,status:'DECODED_FIXTURE_MATCH_ONLY',editCount:edits.size,restoredNaturalCount:before.restoredNaturalKeys.length,saveSchemaVerified:false,integrationVerified:false,browserVerified:false});
}
