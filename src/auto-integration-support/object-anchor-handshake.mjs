// Candidate-only :48 object anchor handshake against supplied :24/:36 cells.
// Coordinates and occupancy are inputs, never world mutations or integration proof.
const valid = p => p && [p.x,p.y,p.z].every(Number.isSafeInteger);
const key = p => `${p.x},${p.y},${p.z}`;
const fail = (reason) => Object.freeze({ok:false,status:'NOT_VERIFIED',reason,integrationVerified:false});
export function inspectObjectAnchorHandshake({objects, surfaceAnchors, caveVoidCells=[], occupiedCells=[], reservedBlockIds=[], maxTriangles=12000}={}) {
 if (![objects,surfaceAnchors,caveVoidCells,occupiedCells,reservedBlockIds].every(Array.isArray) || !Number.isSafeInteger(maxTriangles) || maxTriangles<0) return fail('invalid-input');
 if (![...surfaceAnchors,...caveVoidCells,...occupiedCells].every(valid)) return fail('invalid-world-cell');
 if (!reservedBlockIds.every(Number.isSafeInteger)) return fail('invalid-reserved-id');
 const surfaces=new Set(surfaceAnchors.map(key)), voids=new Set(caveVoidCells.map(key)), occupied=new Set(occupiedCells.map(key));
 if (surfaces.size!==surfaceAnchors.length || voids.size!==caveVoidCells.length) return fail('duplicate-source-cell');
 const reserved=new Set(reservedBlockIds), ids=new Set(); let triangles=0, cells=0;
 for (const o of objects) {
  if (!o || typeof o.id!=='string' || !/^object:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(o.id) || ids.has(o.id) || !valid(o.anchor) ||
      !Array.isArray(o.footprint) || !o.footprint.length || !Number.isSafeInteger(o.triangles) || o.triangles<0 ||
      !['opaque','cutout','blend'].includes(o.alphaMode) || !['surface','cave'].includes(o.domain) ||
      (o.blockId!==undefined && (!Number.isSafeInteger(o.blockId) || reserved.has(o.blockId)))) return fail('invalid-object-or-id-collision');
  ids.add(o.id);
  if (o.triangles>maxTriangles-triangles) return fail('triangle-budget');
  triangles+=o.triangles;
  if (o.domain==='surface' && !surfaces.has(key(o.anchor))) return fail('missing-surface-anchor');
  if (o.domain==='cave' && !voids.has(key(o.anchor))) return fail('missing-cave-anchor');
  const local=new Set();
  for (const offset of o.footprint) {
   if (!valid(offset)) return fail('invalid-footprint-offset');
   const p={x:o.anchor.x+offset.x,y:o.anchor.y+offset.y,z:o.anchor.z+offset.z};
   if (!valid(p)) return fail('coordinate-overflow');
   const k=key(p);
   if (local.has(k)) return fail('duplicate-footprint-cell');
   local.add(k);
   if (occupied.has(k)) return fail('occupied-footprint');
   if (o.domain==='cave' && !voids.has(k)) return fail('cave-solid-footprint');
   if (o.domain==='surface' && voids.has(k)) return fail('surface-cave-void-conflict');
  }
  for (const k of local) occupied.add(k);
  cells+=local.size;
 }
 return Object.freeze({ok:true,status:'FIXTURE_COMPATIBLE_ONLY',integrationVerified:false,objects:objects.length,cells,triangles});
}
