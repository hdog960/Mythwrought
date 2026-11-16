// Opt-in, read-only composition preflight. No producer or production runtime imports.
import {normalizeSurfaceFeatures,validateCaveHandshake,validateObjectAnchors} from './contracts.mjs';
import {createEditIntentLedger} from './edit-intent.mjs';
const safe = Number.isSafeInteger;
const point = p => p && ['x','y','z'].every(k=>safe(p[k]));
const key = p => `${p.x},${p.y},${p.z}`;
export function preflightWorldComposition({
  naturalCells, surfaceFeatures, playerEdits, caveRoutes, objects, registeredIds,
  depthMinY, depthMaxY, maxTriangles = 12000
}) {
  if (![naturalCells,surfaceFeatures,playerEdits,caveRoutes,objects,registeredIds].every(Array.isArray) ||
      !safe(depthMinY) || !safe(depthMaxY) || depthMinY>depthMaxY)
    throw new TypeError('invalid preflight inputs');
  const allowed=new Set([0,...registeredIds]);
  if (!registeredIds.every(id=>safe(id)&&id>0)) throw new TypeError('invalid registry');
  const natural=new Map();
  for (const cell of naturalCells) {
    if (!point(cell)||!allowed.has(cell.blockId)||natural.has(key(cell)))
      throw new TypeError('invalid or duplicate natural cell');
    natural.set(key(cell),cell.blockId);
  }
  const overlay=normalizeSurfaceFeatures(surfaceFeatures,{registeredIds});
  const overlays=new Map(overlay.map(f=>[key(f),f.blockId]));
  const ledger=createEditIntentLedger(playerEdits,{registeredIds});
  const resolved=[];
  for (const [k,naturalId] of natural) {
    const [x,y,z]=k.split(',').map(Number);
    const result=ledger.resolve({x,y,z},{naturalId,overlayId:overlays.get(k)??null});
    resolved.push(Object.freeze({x,y,z,...result}));
  }
  for (const f of overlay) if (!natural.has(key(f)))
    return Object.freeze({ok:false,reason:'overlay-without-natural-cell',cell:key(f)});
  for (const edit of ledger.records) if (!natural.has(key(edit)))
    return Object.freeze({ok:false,reason:'edit-without-natural-cell',cell:key(edit)});
  for (const route of caveRoutes) {
    if (!route || !point(route.entrance) || !natural.has(key(route.entrance)))
      return Object.freeze({ok:false,reason:'cave-entrance-without-surface'});
    const surfaceY=route.surfaceY;
    const check=validateCaveHandshake({...route,surfaceY,depthMinY,depthMaxY,entranceY:route.entrance.y,requireSimplePath:true});
    if (!check.ok) return Object.freeze({ok:false,reason:`cave-${check.reason}`});
    if (route.entrance.y>surfaceY) return Object.freeze({ok:false,reason:'cave-above-surface'});
  }
  const occupied=resolved.filter(c=>c.id!==0).map(({x,y,z})=>({x,y,z}));
  const obj=validateObjectAnchors(objects,{occupiedCells:occupied,maxTriangles});
  if (!obj.ok) return Object.freeze({ok:false,reason:`object-${obj.reason}`});
  resolved.sort((a,b)=>a.x-b.x||a.y-b.y||a.z-b.z);
  return Object.freeze({ok:true,cells:Object.freeze(resolved),caves:caveRoutes.length,objects:obj.objectCount,triangles:obj.triangles});
}
