// D2 advisory lift stop preflight. No physics, energy, or movement authority.
const nat = n => Number.isSafeInteger(n) && n >= 0;
const ident = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
const bounds = b => b && ['minX','minY','minZ','maxX','maxY','maxZ'].every(k => Number.isFinite(b[k]) && Math.abs(b[k]) <= 4096) && b.minX < b.maxX && b.minY < b.maxY && b.minZ < b.maxZ;
const overlap = (a,b) => a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY && a.minZ < b.maxZ && a.maxZ > b.minZ;
export function preflightLiftStop({worldId,fromTick,toTick,platform,deltaY,actors,obstacles,energyCandidate=false}={}) {
  if (!ident(worldId) || !nat(fromTick) || !nat(toTick) || toTick !== fromTick+1 || !bounds(platform) ||
      !Number.isFinite(deltaY) || Math.abs(deltaY)>2 || !Array.isArray(actors) || !Array.isArray(obstacles) ||
      actors.length>64 || obstacles.length>128 || energyCandidate !== false) throw new TypeError('invalid lift preview');
  const moved = {...platform,minY:platform.minY+deltaY,maxY:platform.maxY+deltaY};
  if (!bounds(moved)) throw new TypeError('invalid destination');
  const swept = {...platform,minY:Math.min(platform.minY,moved.minY),maxY:Math.max(platform.maxY,moved.maxY)};
  const seen = new Set(); const hits=[];
  for (const [kind,entries] of [['actor',actors],['obstacle',obstacles]]) {
    for (const entry of entries) {
      if (!entry || !ident(entry.id) || seen.has(kind+':'+entry.id) || !bounds(entry.box)) throw new TypeError('invalid occupancy');
      seen.add(kind+':'+entry.id);
      if (overlap(swept,entry.box)) hits.push(Object.freeze({kind,id:entry.id}));
    }
  }
  hits.sort((a,b)=>a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id));
  return Object.freeze({contract:'resonance48-lift-stop-preflight-v1',worldId,fromTick,toTick,
    clearCandidate:hits.length===0,blocked:Object.freeze(hits),advisoryOnly:true,
    authoritativeDelivery:false,movementAuthorized:false,productionBound:false});
}
