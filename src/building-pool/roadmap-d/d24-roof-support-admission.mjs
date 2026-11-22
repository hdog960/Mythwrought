/** D24: conservative roof-support admission audit. No construction, load assumptions, or world edits. */
const key = (x,z) => `${x},${z}`;
const integer = v => Number.isSafeInteger(v);
function normalize(cells, label) {
  if (!Array.isArray(cells)) throw new TypeError(`${label} must be an array`);
  const out = new Set();
  for (const p of cells) {
    if (!p || !integer(p.x) || !integer(p.z)) throw new TypeError(`${label} needs integer x,z`);
    const k = key(p.x,p.z);
    if (out.has(k)) throw new Error(`duplicate ${label} ${k}`);
    out.add(k);
  }
  return out;
}
function points(set) { return [...set].map(k => {const [x,z]=k.split(',').map(Number);return {x,z};}); }
/**
 * Computes shortest roof-only horizontal four-neighbor paths to anchors.
 * Anchors must be externally verified foundation-to-roof wall positions, not D19/D22 Pack3 previews.
 * `walkColumns` is an explicit original-authored navigation veto for every Y2-Y6 full-height pier.
 * `occupiedColumns` are columns with existing author-occupied Y2-Y6 cells and also ineligible.
 * No span or distance implies actual live:wood load capacity.
 */
export function auditRoofAdmission({roofCells, verifiedWallAnchors, walkColumns, occupiedColumns=[], maxPlanningDistance=8}) {
  if (!integer(maxPlanningDistance) || maxPlanningDistance < 0) throw new RangeError('invalid planning distance');
  const roof=normalize(roofCells,'roofCells');
  const walls=normalize(verifiedWallAnchors,'verifiedWallAnchors');
  const walking=normalize(walkColumns,'walkColumns');
  const occupied=normalize(occupiedColumns,'occupiedColumns');
  for (const k of walls) if (!roof.has(k)) throw new Error(`wall anchor outside roof ${k}`);
  for (const k of walking) if (!roof.has(k)) throw new Error(`walking column outside roof ${k}`);
  for (const k of occupied) if (!roof.has(k)) throw new Error(`occupied column outside roof ${k}`);
  const distances=new Map(), queue=[];
  for(const k of walls){distances.set(k,0);queue.push(k);}
  for(let i=0;i<queue.length;i++){
    const k=queue[i], [x,z]=k.split(',').map(Number), d=distances.get(k);
    for(const neighbor of [key(x-1,z),key(x+1,z),key(x,z-1),key(x,z+1)]){
      if(roof.has(neighbor) && !distances.has(neighbor)) { distances.set(neighbor,d+1);queue.push(neighbor); }
    }
  }
  const histogram={}, unresolved=[], candidateFullHeightPiers=[];
  let maxDistance=0, withinDistance=0;
  for(const p of roofCells){
    const k=key(p.x,p.z), d=distances.get(k);
    if(d === undefined || d > maxPlanningDistance) unresolved.push({x:p.x,z:p.z,distance:d??null});
    else withinDistance++;
    if(d !== undefined){maxDistance=Math.max(maxDistance,d);histogram[d]=(histogram[d]??0)+1;}
    if(!walking.has(k) && !occupied.has(k) && !walls.has(k)) candidateFullHeightPiers.push({...p});
  }
  const unreachable=roof.size-distances.size;
  return Object.freeze({roofCount:roof.size, anchorCount:walls.size, navigationVetoCount:walking.size,
    occupiedVetoCount:occupied.size, candidateFullHeightPiers, withinDistance,
    unresolved, unreachable, maxDistance:unreachable?null:maxDistance, distanceHistogram:histogram,
    status:'NOT_STRUCTURALLY_CERTIFIED', reason:'Only original live:wood-aware force, member, joint, clearance and movement validation can certify support',
    mutations:0});
}
/** Admission gate for a proposed beam/truss. Unknown wood ratings fail closed. */
export function admitLiveWoodTruss({roofMaterial, verifiedWoodJoint, sourceLoadPath, playerClearance, memberCapacity, appliedLoad, span, verifiedSpanLimit}) {
  const failures=[];
  if(roofMaterial!=='live:wood') failures.push('roof material is not the authored live:wood');
  if(verifiedWoodJoint!==true) failures.push('wood roof/beam physical joint unverified');
  if(sourceLoadPath!==true) failures.push('foundation-to-wood load path unverified');
  if(playerClearance!==true) failures.push('original navigation or collision clearance unverified');
  if(!Number.isFinite(memberCapacity)||memberCapacity<=0||!Number.isFinite(appliedLoad)||appliedLoad<0||memberCapacity<appliedLoad) failures.push('member capacity/load not validated');
  if(!Number.isSafeInteger(span)||span<=0||!Number.isSafeInteger(verifiedSpanLimit)||verifiedSpanLimit<=0||span>verifiedSpanLimit) failures.push('span limit not validated');
  return Object.freeze({admitted:failures.length===0,failures});
}
