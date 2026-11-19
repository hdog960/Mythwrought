import {createSceneMesh} from '../nonblock-scene48/flora-phase1.mjs';
import {makeDesertScrub} from '../nonblock-environments24/desert-scrub.mjs';
import {makePebbleScatter} from '../nonblock-environments24/pebble-scatter.mjs';
import {describeFitting} from '../nonblock-fittings36/fittings-phase1.mjs';

const contract = 'nonblock-object-v1';
const sidecarVersion = 'mythwrought-nonblock-removals-v1';
const maxObjects = 32;
const maxTombstones = 4096;
const families = new Map([
  ['scene48:single-wildflower',{lane:'48', palette:[
    [.24,.43,.25],[.36,.58,.30],[.31,.54,.29],[.96,.64,.32],[1,.84,.44]
  ]}],
  ['nonblock:d:desert-scrub',{lane:'24', maker:makeDesertScrub, palette:[[.54,.62,.31]]}],
  ['nonblock:e:pebble-scatter',{lane:'24', maker:makePebbleScatter, palette:[[.49,.46,.41]]}],
  ['scene36:cloth-banner',{lane:'36', wall:true, palette:[[.37,.24,.14],null,null,[.72,.25,.29]]}],
  ['scene36:rope-coil',{lane:'36', palette:[null,null,null,null,null,null,[.71,.52,.31]]}]
]);

export function readCandidateLayout(url) {
  if (!['localhost','127.0.0.1'].includes(url.hostname)) return null;
  const encoded = url.searchParams.get('nonblock-stage');
  if (encoded === null) return null;
  if (encoded.length > 4096) throw new RangeError('Nonblock staging layout too large');
  const layout = JSON.parse(encoded);
  validateLayout(layout);
  return layout;
}

function validateLayout(layout) {
  if (!Array.isArray(layout) || layout.length > maxObjects) throw new TypeError('Invalid nonblock staging layout');
}

function rotation(x,z,orientation) {
  return [[x,z],[-z,x],[-x,-z],[z,-x]][orientation];
}

function keyOf(sceneId,seed,anchor,variant,orientation,lane) {
  return 'nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant+
    (lane === '36' ? ':r'+orientation : '');
}

function validAnchor(anchor) {
  return Array.isArray(anchor) && anchor.length === 3 &&
    anchor.every(value => Number.isInteger(value) && Math.abs(value) < 10_000);
}

export function describeCandidateObject(seed, placement) {
  const {sceneId,anchor,variant=0,orientation=0} = placement ?? {};
  const family = families.get(sceneId);
  if (!family || !Number.isSafeInteger(seed) || !validAnchor(anchor) ||
      !Number.isInteger(variant) || variant < 0 || variant > 3 ||
      !Number.isInteger(orientation) || orientation < 0 || orientation > 3 ||
      (family.lane !== '36' && orientation !== 0)) throw new TypeError('Invalid nonblock staging identity');

  const instanceKey = keyOf(sceneId,seed,anchor,variant,orientation,family.lane);
  let mesh;
  if (family.lane === '36') {
    const fitting = describeFitting({sceneId,seed,anchor,variant,orientation,mount:{behind:true,below:true}});
    mesh = fitting.render.localMesh;
  } else if (family.lane === '48') {
    mesh = createSceneMesh(sceneId,seed,...anchor).mesh;
  } else {
    mesh = family.maker({seed,anchor,variant}).mesh;
  }

  const [wallX,wallZ] = rotation(0,-1,orientation);
  const origin = [anchor[0]+.5+(family.wall ? wallX*.42 : 0),anchor[1],
    anchor[2]+.5+(family.wall ? wallZ*.42 : 0)];
  const support = [anchor[0]+(family.wall ? wallX : 0),anchor[1]+(family.wall ? 1 : -1),
    anchor[2]+(family.wall ? wallZ : 0)];
  const positions = new Float32Array(mesh.positions.length);
  const min = [Infinity,Infinity,Infinity];
  const max = [-Infinity,-Infinity,-Infinity];
  for (let i=0;i<positions.length;i+=3) {
    const [x,z] = rotation(mesh.positions[i],mesh.positions[i+2],orientation);
    positions[i] = origin[0]+x;
    positions[i+1] = origin[1]+mesh.positions[i+1];
    positions[i+2] = origin[2]+z;
    for (let axis=0;axis<3;axis++) {
      min[axis] = Math.min(min[axis],positions[i+axis]);
      max[axis] = Math.max(max[axis],positions[i+axis]);
    }
  }
  return {contract,sceneId,seed,anchor:[...anchor],variant,orientation,instanceKey,support,min,max,
    positions,materials:mesh.materials,palette:family.palette};
}

function sub(a,b) { return a.map((value,i)=>value-b[i]); }
function cross(a,b) { return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
function dot(a,b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }

function triangleDistance(p,i,origin,unit) {
  const a = p.subarray(i,i+3);
  const edge1 = sub(p.subarray(i+3,i+6),a);
  const edge2 = sub(p.subarray(i+6,i+9),a);
  const perpendicular = cross(unit,edge2);
  const determinant = dot(edge1,perpendicular);
  if (Math.abs(determinant)<1e-10) return Infinity;
  const offset = sub(origin,a);
  const u = dot(offset,perpendicular)/determinant;
  if (u<0 || u>1) return Infinity;
  const q = cross(offset,edge1);
  const v = dot(unit,q)/determinant;
  if (v<0 || u+v>1) return Infinity;
  const distance = dot(edge2,q)/determinant;
  return distance>=0 ? distance : Infinity;
}

function intersectsBounds(object,origin,unit,max) {
  let near=0, far=max;
  for (let i=0;i<3;i++) {
    if (Math.abs(unit[i])<1e-10) {
      if (origin[i]<object.min[i] || origin[i]>object.max[i]) return false;
      continue;
    }
    const a=(object.min[i]-origin[i])/unit[i], b=(object.max[i]-origin[i])/unit[i];
    near=Math.max(near,Math.min(a,b));
    far=Math.min(far,Math.max(a,b));
    if (near>far) return false;
  }
  return true;
}

function canAttach(object,blockAt,editedAt) {
  if (!blockAt(...object.support) || editedAt(...object.support)) return false;
  const min = object.min.map(x=>Math.floor(x+1e-6));
  const max = object.max.map((x,i)=>Math.max(min[i],Math.ceil(x-1e-6)-1));
  for (let x=min[0];x<=max[0];x++) {
    for (let y=min[1];y<=max[1];y++) {
      for (let z=min[2];z<=max[2];z++) {
        if (blockAt(x,y,z) || editedAt(x,y,z)) return false;
      }
    }
  }
  return true;
}

function validateTombstone(key,seed) {
  if (typeof key !== 'string') return false;
  const match = /^nb1:([^:]+):(-?\d+):(-?\d+),(-?\d+),(-?\d+):([0-3])(?::r([0-3]))?$/.exec(key);
  if (!match || Number(match[2])!==seed) return false;
  const sceneId = [...families.keys()].find(id => encodeURIComponent(id)===match[1]);
  const family = families.get(sceneId);
  const anchor = match.slice(3,6).map(Number);
  return family && validAnchor(anchor) &&
    keyOf(sceneId,seed,anchor,Number(match[6]),Number(match[7]),family.lane)===key;
}

export function createCandidateScene(seed,worldId,layout,{storage,blockAt,voxelPick,editedAt=()=>false}) {
  validateLayout(layout);
  const objects = layout.map(placement=>describeCandidateObject(seed,placement));
  if (new Set(objects.map(o=>o.anchor.join(','))).size !== objects.length)
    throw new TypeError('Duplicate nonblock staging anchor');
  const key = 'mythwrought:nonblock-stage:v1:'+encodeURIComponent(worldId)+':'+seed;
  let raw = storage.getItem(key);
  if (raw !== null && raw.length > 600_000) throw new TypeError('Oversized nonblock sidecar');
  const expected = {version:sidecarVersion,seed,worldId};
  const snapshot = raw === null ? {...expected,tombstones:[]} : JSON.parse(raw);
  if (snapshot?.version!==expected.version || snapshot.seed!==seed || snapshot.worldId!==worldId ||
      !Array.isArray(snapshot.tombstones) || snapshot.tombstones.length>maxTombstones ||
      snapshot.tombstones.some(k=>!validateTombstone(k,seed)) ||
      new Set(snapshot.tombstones).size!==snapshot.tombstones.length) throw new TypeError('Invalid nonblock sidecar');

  const removed = new Set(snapshot.tombstones);
  const issued = new WeakSet();
  let uncertain = false;
  let epoch = 0;
  function visible() {
    return objects.filter(object=>!removed.has(object.instanceKey) && canAttach(object,blockAt,editedAt));
  }
  function pick(origin,direction,max=6) {
    if (uncertain || !Array.isArray(origin) || origin.length!==3 ||
        !Array.isArray(direction) || direction.length!==3 ||
        ![...origin,...direction,max].every(Number.isFinite) || max<=0 || max>6) return null;
    const length = Math.hypot(...direction);
    if (length<1e-9) return null;
    const unit = direction.map(n=>n/length);
    const voxel = voxelPick(origin,unit,max);
    let best = null;
    let limit = voxel ? voxel.distance-1e-8 : max;
    for (const o of visible()) {
      if (!intersectsBounds(o,origin,unit,limit)) continue;
      for (let i=0;i<o.positions.length;i+=9) {
        const distance=triangleDistance(o.positions,i,origin,unit);
        if (distance<=limit && (!best || distance<limit || o.instanceKey<best.instanceKey)) {
          best={instanceKey:o.instanceKey,sceneId:o.sceneId,distance,epoch};
          limit=distance;
        }
      }
    }
    if (!best) return null;
    Object.freeze(best);
    issued.add(best);
    return best;
  }
  function breakHit(hit,origin,direction) {
    if (!issued.has(hit) || hit.epoch!==epoch || uncertain || removed.size>=maxTombstones) return false;
    const current = pick(origin,direction);
    if (current?.instanceKey!==hit.instanceKey || Math.abs(current.distance-hit.distance)>1e-7) return false;
    const next = JSON.stringify({...expected,tombstones:[...removed,hit.instanceKey].sort()});
    let attempted = false;
    try {
      if (storage.getItem(key)!==raw) {uncertain=true; return false;}
      attempted = true;
      storage.setItem(key,next);
      if (storage.getItem(key)!==next) throw new Error('Nonblock sidecar readback mismatch');
    } catch {
      try {
        // Restore only a value this attempt wrote. Never override another tab's data.
        if (attempted && storage.getItem(key)===next) {
          if (raw===null) storage.removeItem(key);
          else storage.setItem(key,raw);
        }
        uncertain = storage.getItem(key)!==raw;
      } catch {uncertain=true;}
      return false;
    }
    raw=next;
    removed.add(hit.instanceKey);
    epoch++;
    return true;
  }
  return Object.freeze({visible,pick,breakHit});
}

export function candidateVertices(objects) {
  const packed = new Float32Array(objects.reduce((n,o)=>n+o.positions.length*3,0));
  let offset = 0;
  for (const o of objects) {
    for (let i=0;i<o.positions.length;i+=9) {
      const p = o.positions;
      const normal = cross(sub(p.subarray(i+3,i+6),p.subarray(i,i+3)),
        sub(p.subarray(i+6,i+9),p.subarray(i,i+3)));
      const shade = .72+.28*Math.abs(dot(normal,[.35,.84,.4]))/(Math.hypot(...normal)||1);
      const color = o.palette[o.materials?.[i/9]??0] ?? o.palette[0];
      for (let j=i;j<i+9;j+=3) {
        packed.set([p[j],p[j+1],p[j+2],...color.map(n=>n*shade),0,0,21],offset);
        offset+=9;
      }
    }
  }
  return packed;
}
