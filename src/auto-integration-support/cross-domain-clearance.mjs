// Candidate-only cross-domain object clearance; no world mutation or production registration.
const integer = Number.isSafeInteger;
const cell = p => p && [p.x,p.y,p.z].every(integer);
const key = p => `${p.x},${p.y},${p.z}`;
const reject = reason => Object.freeze({ok:false,status:'NOT_VERIFIED',reason,integrationVerified:false});
export function inspectCrossDomainClearance({objects,solidCells,voidCells,surfaceAnchors,protectedCells=[],maxCells=4096}={}) {
 if (![objects,solidCells,voidCells,surfaceAnchors,protectedCells].every(Array.isArray) || !integer(maxCells) || maxCells<1) return reject('invalid-input');
 if (![...solidCells,...voidCells,...surfaceAnchors,...protectedCells].every(cell)) return reject('invalid-cell');
 const solids=new Set(solidCells.map(key)), voids=new Set(voidCells.map(key)), surfaces=new Set(surfaceAnchors.map(key)), protectedSet=new Set(protectedCells.map(key));
 if (solids.size!==solidCells.length || voids.size!==voidCells.length || surfaces.size!==surfaceAnchors.length || protectedSet.size!==protectedCells.length) return reject('duplicate-source-cell');
 for (const k of solids) if (voids.has(k)) return reject('contradictory-world-occupancy');
 const reserved=new Set(), identities=new Set(); let checked=0;
 for (const object of objects) {
  if (!object || typeof object.id!=='string' || !/^object:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(object.id) || identities.has(object.id) || !cell(object.anchor) || !['surface','cave'].includes(object.domain) || !Array.isArray(object.footprint) || object.footprint.length===0 || !['ground','ceiling','wall','free'].includes(object.attachment)) return reject('invalid-object');
  identities.add(object.id);
  if (object.domain==='surface' && !surfaces.has(key(object.anchor))) return reject('missing-surface-anchor');
  if (object.domain==='cave' && !voids.has(key(object.anchor))) return reject('missing-cave-anchor');
  if (checked+object.footprint.length>maxCells) return reject('cell-budget');
  const local=new Set();
  for (const offset of object.footprint) {
   if (!cell(offset)) return reject('invalid-offset');
   const p={x:object.anchor.x+offset.x,y:object.anchor.y+offset.y,z:object.anchor.z+offset.z};
   if (!cell(p)) return reject('coordinate-overflow');
   const k=key(p);
   if (local.has(k) || reserved.has(k)) return reject('object-overlap');
   local.add(k);
   if (solids.has(k) || protectedSet.has(k)) return reject('occupied-or-protected');
   if (object.domain==='cave' && !voids.has(k)) return reject('unproven-cave-clearance');
   if (object.domain==='surface' && voids.has(k)) return reject('surface-void-conflict');
  }
  const a=object.anchor;
  const support=object.attachment==='ground'?{x:a.x,y:a.y-1,z:a.z}:object.attachment==='ceiling'?{x:a.x,y:a.y+1,z:a.z}:null;
  if (support && (!cell(support) || !solids.has(key(support)))) return reject('missing-attachment-support');
  if (object.attachment==='wall') {
   const neighbors=[{x:a.x+1,y:a.y,z:a.z},{x:a.x-1,y:a.y,z:a.z},{x:a.x,y:a.y,z:a.z+1},{x:a.x,y:a.y,z:a.z-1}];
   if (!neighbors.some(p=>cell(p)&&solids.has(key(p)))) return reject('missing-wall-support');
  }
  for (const k of local) reserved.add(k);
  checked+=local.size;
 }
 return Object.freeze({ok:true,status:'FIXTURE_COMPATIBLE_ONLY',integrationVerified:false,objects:objects.length,cells:checked});
}
