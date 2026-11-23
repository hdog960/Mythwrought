// D3 continuous swept unit-cell advisory, independent of engine physics.
// Inclusive slab intersections intentionally over-report boundary contacts.
const coord = (n, name) => {
  if (!Number.isSafeInteger(n) || Math.abs(n) > 1000000) throw new RangeError(name);
  return n;
};
const vec = (v, name) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new TypeError(name);
  return [coord(v.x,name+'.x'),coord(v.y,name+'.y'),coord(v.z,name+'.z')];
};
function intersects(start, delta, cell) {
  let lo=0, hi=1;
  for (let axis=0;axis<3;axis++) {
    const d=delta[axis], p=start[axis], c=cell[axis];
    // Unit cube at p(t) overlaps the unit cube at c if c-1 <= p(t) <= c+1.
    if (d===0) { if (p<c-1 || p>c+1) return false; continue; }
    const a=(c-1-p)/d, b=(c+1-p)/d;
    lo=Math.max(lo,Math.min(a,b)); hi=Math.min(hi,Math.max(a,b));
    if (lo>hi) return false;
  }
  return true;
}
export function previewContinuousAssemblySweep(input) {
  if (!input || typeof input!=='object' || Array.isArray(input)) throw new TypeError('input');
  if (input.productionBound!==false || input.allowActuation===true || input.authoritativeDelivery===true)
    throw new Error('source-only; no actuation');
  for (const key of ['worldId','deviceId'])
    if (typeof input[key]!=='string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(input[key])) throw new TypeError(key);
  if (!Array.isArray(input.parts) || input.parts.length<1 || input.parts.length>32) throw new RangeError('parts');
  const parts=input.parts.map((p,i)=>vec(p,'parts'+i));
  if (new Set(parts.map(p=>p.join(','))).size!==parts.length) throw new Error('duplicate parts');
  for (let a=0;a<3;a++) if (Math.max(...parts.map(p=>p[a]))-Math.min(...parts.map(p=>p[a]))>=8) throw new RangeError('span');
  const delta=vec(input.delta,'delta');
  if (delta.every(d=>d===0) || delta.some(d=>Math.abs(d)>16)) throw new RangeError('delta');
  const occupied=new Set();
  for (const p of parts) {
    const ranges=[0,1,2].map(a=>[
      Math.min(p[a],p[a]+delta[a])-1,
      Math.max(p[a],p[a]+delta[a])+1
    ]);
    for(let x=ranges[0][0];x<=ranges[0][1];x++)
      for(let y=ranges[1][0];y<=ranges[1][1];y++)
        for(let z=ranges[2][0];z<=ranges[2][1];z++)
          if(intersects(p,delta,[x,y,z])) occupied.add(x+','+y+','+z);
  }
  const cells=[...occupied].map(k=>k.split(',').map(Number))
    .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2])
    .map(([x,y,z])=>Object.freeze({x,y,z}));
  return Object.freeze({
    version:2,worldId:input.worldId,deviceId:input.deviceId,
    sourceOnly:true,mayActuate:false,requiresGameCollision:true,
    requiresDeliveredPowerReceipt:true,partCount:parts.length,
    energyDemandUnits:parts.length*Math.max(...delta.map(Math.abs)),
    sweptCells:Object.freeze(cells)
  });
}
