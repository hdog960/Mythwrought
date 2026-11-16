// Opt-in integration-preparation contracts. No production world writes.
// All coordinates are integer world cells; caller supplies registered IDs.
const integer = (n) => Number.isSafeInteger(n);
const key = (x,y,z) => `${x},${y},${z}`;
export function normalizeSurfaceFeatures(features, {registeredIds = []} = {}) {
  const allowed = new Set(registeredIds);
  if (!Array.isArray(features)) throw new TypeError('features must be an array');
  const seen = new Set();
  return features.map((f) => {
    if (!f || !['x','y','z'].every(k => integer(f[k])) || !integer(f.blockId) || !allowed.has(f.blockId))
      throw new TypeError('feature must have integer coordinates and an actually registered material');
    const cell = key(f.x,f.y,f.z);
    if (seen.has(cell)) throw new Error('duplicate surface feature cell');
    seen.add(cell);
    return Object.freeze({x:f.x,y:f.y,z:f.z,blockId:f.blockId});
  }).sort((a,b)=>a.x-b.x || a.y-b.y || a.z-b.z);
}
// An explicit edit must mask procedural overlay even when its value equals natural terrain.
// Absence of an edit is different from a recorded edit restoring the natural block.
export function composeSurfaceCell({naturalId, overlayId = null, hasPlayerEdit = false, playerEditId = null, registeredIds = []}) {
  const allowed = new Set([0,...registeredIds]);
  if (!allowed.has(naturalId) || (overlayId !== null && !allowed.has(overlayId)))
    throw new RangeError('unregistered natural/overlay material');
  if (hasPlayerEdit) {
    if (!allowed.has(playerEditId)) throw new RangeError('unregistered edited material');
    return Object.freeze({id:playerEditId,source:'player-edit'});
  }
  return Object.freeze({id:overlayId ?? naturalId,source:overlayId === null ? 'natural' : 'overlay'});
}
export function validateCaveHandshake({surfaceY,entranceY,depthMinY,depthMaxY,path,entrance = null,exit = null,requireSimplePath = false}) {
  if (![surfaceY,entranceY,depthMinY,depthMaxY].every(integer) || depthMinY > depthMaxY ||
      entranceY > surfaceY || entranceY < depthMinY || entranceY > depthMaxY)
    return Object.freeze({ok:false,reason:'invalid-bounds'});
  if (!Array.isArray(path) || path.length === 0) return Object.freeze({ok:false,reason:'missing-path'});
  if (entrance !== null && (!entrance || !['x','y','z'].every(k=>integer(entrance[k])) || entrance.y!==entranceY))
    return Object.freeze({ok:false,reason:'invalid-entrance-anchor'});
  if (exit !== null && (!exit || !['x','y','z'].every(k=>integer(exit[k]))))
    return Object.freeze({ok:false,reason:'invalid-exit-anchor'});
  const seen=new Set();
  for (let i=0;i<path.length;i++) {
    const p=path[i];
    if (!p || !['x','y','z'].every(k=>integer(p[k])) || p.y<depthMinY || p.y>depthMaxY)
      return Object.freeze({ok:false,reason:'invalid-path-cell'});
    if (i && Math.abs(p.x-path[i-1].x)+Math.abs(p.y-path[i-1].y)+Math.abs(p.z-path[i-1].z)!==1)
      return Object.freeze({ok:false,reason:'disconnected-path'});
    const cell=key(p.x,p.y,p.z);
    if (requireSimplePath && seen.has(cell)) return Object.freeze({ok:false,reason:'revisited-path-cell'});
    seen.add(cell);
  }
  if (path[0].y!==entranceY || (entrance && key(path[0].x,path[0].y,path[0].z)!==key(entrance.x,entrance.y,entrance.z)))
    return Object.freeze({ok:false,reason:'entrance-mismatch'});
  const last=path[path.length-1];
  if (exit && key(last.x,last.y,last.z)!==key(exit.x,exit.y,exit.z))
    return Object.freeze({ok:false,reason:'exit-mismatch'});
  return Object.freeze({ok:true,visitedCells:seen.size});
}
export function validateObjectAnchors(objects,{occupiedCells=[],maxTriangles=12000}={}) {
  if (!Array.isArray(objects) || !Array.isArray(occupiedCells) || !integer(maxTriangles) || maxTriangles<0)
    throw new TypeError('invalid object budget or anchors');
  const blocked=new Set(occupiedCells.map(p=>key(p.x,p.y,p.z)));
  const identities=new Set(); let triangles=0;
  for (const o of objects) {
    if (!o || typeof o.id!=='string' || !/^object:[a-z0-9][a-z0-9-]*$/.test(o.id) ||
        !['x','y','z'].every(k=>integer(o.anchor?.[k])) ||
        !Array.isArray(o.footprint) || o.footprint.length===0 ||
        !integer(o.triangles) || o.triangles<0 || !['opaque','cutout','blend'].includes(o.alphaMode))
      return Object.freeze({ok:false,reason:'invalid-object'});
    if (identities.has(o.id)) return Object.freeze({ok:false,reason:'duplicate-object-id'});
    identities.add(o.id); triangles+=o.triangles;
    for (const offset of o.footprint) {
      if (!offset || !['x','y','z'].every(k=>integer(offset[k])))
        return Object.freeze({ok:false,reason:'invalid-footprint'});
      const x=o.anchor.x+offset.x, y=o.anchor.y+offset.y, z=o.anchor.z+offset.z;
      // Reject coordinate overflow rather than silently aliasing distinct world cells.
      if (![x,y,z].every(integer)) return Object.freeze({ok:false,reason:'footprint-coordinate-overflow'});
      const cell=key(x,y,z);
      if (blocked.has(cell)) return Object.freeze({ok:false,reason:'occupied-footprint'});
      blocked.add(cell);
    }
  }
  if (triangles>maxTriangles) return Object.freeze({ok:false,reason:'triangle-budget'});
  return Object.freeze({ok:true,triangles,objectCount:objects.length});
}
