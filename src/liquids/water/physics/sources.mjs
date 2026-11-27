// Explicit, bounded water injection adapter. Not mounted in production.
export const WATER_SOURCE_SNAPSHOT_VERSION = 1;

export function createWaterSources({
  engine, sources = [], allowRenewable = false, maxSources = 128,
  maxVisits = 16, maxUnitsPerStep = 32, snapshot = null
} = {}) {
  const int = (v, lo, hi) => Number.isSafeInteger(v) && v >= lo && v <= hi;
  if (typeof engine?.getCell !== "function" || typeof engine?.insert !== "function")
    throw new TypeError("Water sources require the shared liquid engine");
  if (typeof allowRenewable !== "boolean" || !int(maxSources, 1, 4096) ||
      !int(maxVisits, 1, 4096) || !int(maxUnitsPerStep, 1, 32768))
    throw new RangeError("Invalid water source budget");
  if (!Array.isArray(sources) || sources.length > maxSources)
    throw new RangeError("Too many water sources");
  const ids = new Set(), positions = new Set();
  const config = sources.map(s => {
    if (!s || typeof s.id !== "string" || !/^[a-z][a-z0-9-]{0,63}$/.test(s.id) ||
        ids.has(s.id) || !Number.isSafeInteger(s.x) || !int(s.y, -210, 256) ||
        !Number.isSafeInteger(s.z) || !int(s.rate, 1, 8) || !int(s.target, 1, 8) ||
        !["finite", "renewable"].includes(s.mode))
      throw new TypeError("Invalid water source descriptor");
    const pos = [s.x, s.y, s.z].join(",");
    if (positions.has(pos)) throw new TypeError("Duplicate water source position");
    if (s.mode === "renewable" && (!allowRenewable || s.initialUnits !== undefined))
      throw new TypeError("Renewable water requires explicit policy and no finite stock");
    if (s.mode === "finite" && !int(s.initialUnits, 0, Number.MAX_SAFE_INTEGER))
      throw new RangeError("Finite water requires explicit stock");
    ids.add(s.id); positions.add(pos);
    return Object.freeze({id:s.id, x:s.x, y:s.y, z:s.z, rate:s.rate,
      target:s.target, mode:s.mode, initialUnits:s.mode === "finite" ? s.initialUnits : null});
  });
  const signature = JSON.stringify({allowRenewable, maxSources, maxVisits, maxUnitsPerStep, config});
  const remaining = config.map(s => s.initialUnits);
  let cursor = 0, active = false;
  if (snapshot !== null) {
    if (!snapshot || snapshot.version !== WATER_SOURCE_SNAPSHOT_VERSION ||
        snapshot.signature !== signature || !int(snapshot.cursor, 0, Math.max(0, config.length-1)) ||
        !Array.isArray(snapshot.remaining) || snapshot.remaining.length !== config.length ||
        config.some((s,i) => s.mode === "finite"
          ? !int(snapshot.remaining[i], 0, s.initialUnits) : snapshot.remaining[i] !== null))
      throw new TypeError("Invalid or incompatible water source snapshot");
    cursor = snapshot.cursor;
    for (let i=0; i<remaining.length; i++) remaining[i]=snapshot.remaining[i];
  }
  function save() {
    if (active) throw new Error("Cannot snapshot an active water source step");
    return {version:WATER_SOURCE_SNAPSHOT_VERSION, signature, cursor, remaining:[...remaining]};
  }
  // Called once per explicit host simulation step, never on elapsed wall time.
  // A failed insert spends no stock. No liquids other than water are created.
  function step() {
    if (active) throw new Error("Reentrant water source step");
    active = true;
    let visited=0, finiteInserted=0, renewableInserted=0;
    const changed=[];
    try {
      while (visited < Math.min(maxVisits, config.length) &&
             finiteInserted + renewableInserted < maxUnitsPerStep) {
        const i=cursor, s=config[i], c=engine.getCell(s.x,s.y,s.z);
        const room = c && c.id !== "water" ? 0 : Math.max(0,s.target-(c?.units??0));
        const n=Math.min(s.rate, room, remaining[i]??s.rate,
          maxUnitsPerStep-finiteInserted-renewableInserted);
        if (n>0 && engine.insert(s.x,s.y,s.z,"water",n) === true) {
          if (s.mode === "finite") { remaining[i]-=n; finiteInserted+=n; }
          else renewableInserted+=n;
          changed.push(Object.freeze([s.x,s.y,s.z]));
        }
        cursor=(cursor+1)%config.length; visited++;
      }
      return Object.freeze({visited,finiteInserted,renewableInserted,
        inserted:finiteInserted+renewableInserted,changed:Object.freeze(changed)});
    } finally { active=false; }
  }
  return Object.freeze({step,save});
}
