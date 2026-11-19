// :00 opt-in non-block host bridge. No production registration or schema-1 writes.
// Admits exact source revisions; producer descriptors remain owned by :48/:24/:36.
export const HOST_BRIDGE_VERSION = 'voxel-nonblock-host-v1';
export const PRODUCER_SOURCES = Object.freeze({
  '48': '33ee82e68be152586548bc0975cd11d0cca5dffa',
  '24': '6cfff08a2ae7815b6af9dff197d09d1cba439f01',
  '36': '562e360b259f5aca00ab8ce859bb5b8e2f09bc36'
});
const safe = Number.isSafeInteger;
const vec = a => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const coords = a => vec(a) && a.every(safe);
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const canonical = n => String(n) === n.toString() && safe(n);
const bounds = b => b && vec(b.min) && vec(b.max) && b.min.every((n,i)=>n<b.max[i]);
const key48 = o => 'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
const key24 = o => [o.seed,o.anchor.x,o.anchor.y,o.anchor.z,o.sceneId,o.variant].join(':');
const key36 = o => key48(o)+':r'+o.orientation;
function identity(o, lane) {
  if (!o || !safe(o.seed) || typeof o.sceneId !== 'string' || !o.sceneId ||
      !safe(o.variant) || o.variant<0 || o.variant>(lane==='24'?7:3)) return false;
  if(lane==='24') return o.contract==='nonblock-object-v1-proposal-24' &&
    o.anchor && [o.anchor.x,o.anchor.y,o.anchor.z].every(safe) &&
    o.instanceKey===key24(o) && o.removal?.tombstoneKey==='nonblock:'+o.instanceKey &&
    o.removal?.action==='break' && Array.isArray(o.selection) && o.selection.length>0 &&
    o.selection.every(bounds);
  return o.contract==='nonblock-object-v1' && coords(o.anchor) &&
    (lane!=='36' || (safe(o.orientation)&&o.orientation>=0&&o.orientation<=3)) &&
    o.instanceKey===(lane==='36'?key36(o):key48(o)) &&
    o.breakIntent?.targetKey===o.instanceKey && o.breakIntent?.action==='remove-object' &&
    Array.isArray(o.selectionAabbs) && o.selectionAabbs.length>0 &&
    o.selectionAabbs.every(bounds);
}
function worldBounds(o,lane) {
  if(lane!=='24') return o.selectionAabbs;
  const a=[o.anchor.x,o.anchor.y,o.anchor.z];
  return o.selection.map(b=>({min:b.min.map((v,i)=>v+a[i]),max:b.max.map((v,i)=>v+a[i])}));
}
function rayBox(origin,d,b,max) {
  let near=0,far=max;
  for(let i=0;i<3;i++){
    if(Math.abs(d[i])<1e-12){if(origin[i]<b.min[i]||origin[i]>b.max[i])return null;}
    else {const x=(b.min[i]-origin[i])/d[i],y=(b.max[i]-origin[i])/d[i];
      near=Math.max(near,Math.min(x,y));far=Math.min(far,Math.max(x,y));}
  }
  return near<=far?near:null;
}
export function createNonblockHostBridge({seed,objects,attest,voxelPick,eligible,readSidecar,writeSidecar}) {
  if(!safe(seed)||!Array.isArray(objects)||typeof voxelPick!=='function' ||
     typeof eligible!=='function'||typeof readSidecar!=='function'||typeof writeSidecar!=='function' ||
     !attest || typeof attest!=='object')throw new TypeError('missing authoritative host dependency');
  const registry=new Map();
  for(const entry of objects){
    const lane=entry?.lane, o=entry?.descriptor;
    if(!own(PRODUCER_SOURCES,lane)||attest[lane]!==PRODUCER_SOURCES[lane] ||
       !identity(o,lane)||o.seed!==seed||registry.has(o.instanceKey))throw new TypeError('unauthenticated object');
    registry.set(o.instanceKey,{lane,object:o,bounds:worldBounds(o,lane)});
  }
  const validateSnapshot=s=>{
    if(!s||s.version!==HOST_BRIDGE_VERSION||s.seed!==seed||!Array.isArray(s.tombstones)||
       s.tombstones.length>100000)throw new TypeError('invalid sidecar');
    const set=new Set();
    for(const k of s.tombstones){
      if(typeof k!=='string'||!registry.has(k)||set.has(k))throw new TypeError('foreign or duplicate tombstone');
      set.add(k);
    }
    return set;
  };
  let removed=validateSnapshot(readSidecar());
  let epoch=0;
  // Capability receipts are issued by this exact host instance only. Reconstructed,
  // cloned or cross-world hits cannot authorize removal even if fields match.
  const issuedHits=new WeakSet();
  const visible=()=>[...registry.values()].filter(e=>!removed.has(e.object.instanceKey)&&eligible(e.object,e.lane));
  const pick=(origin,direction,maxDistance=6)=>{
    if(!vec(origin)||!vec(direction)||!Number.isFinite(maxDistance)||maxDistance<=0||maxDistance>12)throw new TypeError('invalid bounded ray');
    const len=Math.hypot(...direction);if(len<1e-9)throw new TypeError('zero ray');
    const d=direction.map(v=>v/len);
    const voxel=voxelPick(origin,d,maxDistance);
    if(voxel!==null && (typeof voxel!=='object'||!Number.isFinite(voxel.distance)||
      voxel.distance<0||voxel.distance>maxDistance))throw new TypeError('invalid voxel host hit');
    let best=null;
    for(const e of visible())for(const b of e.bounds){
      const distance=rayBox(origin,d,b,maxDistance);
      if(distance!==null && (!best||distance<best.distance-1e-9||
        (Math.abs(distance-best.distance)<1e-9&&e.object.instanceKey<best.instanceKey)))
        best={kind:'nonblock',instanceKey:e.object.instanceKey,lane:e.lane,distance};
    }
    // Existing voxel target wins exact ties: no stealing legacy block clicks.
    if(voxel && (!best||voxel.distance<=best.distance+1e-9))return {kind:'voxel',hit:voxel,distance:voxel.distance};
    if(!best)return null;
    const receipt=Object.freeze({...best,seed,epoch});
    issuedHits.add(receipt);
    return receipt;
  };
  const snapshot=()=>({version:HOST_BRIDGE_VERSION,seed,tombstones:[...removed].sort()});
  const breakHit=(hit,origin,direction,maxDistance=6)=>{
    if(!hit || typeof hit!=='object' || !issuedHits.has(hit) ||
       hit.kind!=='nonblock'||hit.seed!==seed||hit.epoch!==epoch||
       typeof hit.instanceKey!=='string'||!registry.has(hit.instanceKey))return false;
    const current=pick(origin,direction,maxDistance);
    if(current?.kind!=='nonblock'||current.instanceKey!==hit.instanceKey||
       current.lane!==hit.lane||Math.abs(current.distance-hit.distance)>1e-7)return false;
    if(removed.has(hit.instanceKey))return false;
    const next=new Set(removed);next.add(hit.instanceKey);
    const value={version:HOST_BRIDGE_VERSION,seed,tombstones:[...next].sort()};
    // Commit and verify storage BEFORE making object disappear. A failed write
    // or readback must never create a visually removed but respawning object.
    try {writeSidecar(value);if(JSON.stringify(value)!==JSON.stringify(readSidecar()))return false;}
    catch{return false;}
    removed=next;epoch++;return true;
  };
  return Object.freeze({pick,breakHit,visible:()=>visible().map(e=>e.object),snapshot});
}
