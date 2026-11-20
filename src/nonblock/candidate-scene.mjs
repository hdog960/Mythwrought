import {candidateFamilies as families} from './candidate-families.mjs';

const contract = 'nonblock-object-v1';
const sidecarVersion = 'mythwrought-nonblock-removals-v1';
const maxObjects = 32;
const maxTombstones = 4096;
const farEnterDistanceSquared=16**2;
const farExitDistanceSquared=13**2;
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

function keyOf(sceneId,seed,anchor,variant,orientation,family) {
  return 'nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant+
    (family.lane==='36'||family.wall ? ':r'+orientation : '');
}

function validAnchor(anchor) {
  return Array.isArray(anchor) && anchor.length === 3 &&
    anchor.every(value => Number.isInteger(value) && Math.abs(value) < 10_000);
}

function placeMesh(mesh,origin,orientation){
  if(mesh.positions.length!==mesh.triangleCount*9||mesh.triangleCount<1||
     mesh.triangleCount>256||!mesh.positions.every(Number.isFinite))throw new TypeError('Invalid nonblock source mesh');
  const positions=new Float32Array(mesh.positions.length);
  for(let i=0;i<positions.length;i+=3){
    const [x,z]=rotation(mesh.positions[i],mesh.positions[i+2],orientation);
    positions[i]=origin[0]+x;
    positions[i+1]=origin[1]+mesh.positions[i+1];
    positions[i+2]=origin[2]+z;
  }
  return positions;
}

export function describeCandidateObject(seed, placement) {
  const {sceneId,anchor,variant=0,orientation=0} = placement ?? {};
  const family = families.get(sceneId);
  if (!family || !Number.isSafeInteger(seed) || !validAnchor(anchor) ||
      !Number.isInteger(variant) || variant < 0 || variant > (family.variantMax??3) ||
      !Number.isInteger(orientation) || orientation < 0 || orientation > 3 ||
      (family.lane !== '36' && !family.wall && orientation !== 0)) throw new TypeError('Invalid nonblock staging identity');

  const instanceKey = keyOf(sceneId,seed,anchor,variant,orientation,family);
  const options = {seed,anchor,variant,orientation};
  const source = family.build ? family.build(options) :
    {mesh:family.mesh(options),palette:family.palette,colliders:[]};
  const {mesh} = source;

  const [wallX,wallZ] = rotation(0,-1,orientation);
  const [ax,ay,az] = anchor;
  const ceiling = family.attachment==='ceiling';
  const height = ay+(ceiling?1:0);
  const wallInset = family.wall ? family.wallInset??.42 : 0;
  const origin = [ax+.5+wallX*wallInset,height,az+.5+wallZ*wallInset];
  const supports = family.wall ? [[ax+wallX,ay+(family.wallY??1),az+wallZ]] :
    ceiling ? [[ax,ay+1,az]] : [[ax,ay-1,az]];
  if (family.wall&&family.wallHeight===2) supports.push([ax+wallX,ay,az+wallZ]);
  if (family.attachment==='span') supports.push([ax,ay+3,az]);
  if (family.corner) {
    const [sideX,sideZ] = rotation(-1,0,orientation);
    supports.push([ax+sideX,ay,az+sideZ]);
  }

  const colliders = (source.colliders??[]).map(box=>{
    const [left,back] = rotation(box[0],box[2],orientation);
    const [right,front] = rotation(box[3],box[5],orientation);
    return [Math.min(left,right)+origin[0],box[1]+origin[1],Math.min(back,front)+origin[2],
      Math.max(left,right)+origin[0],box[4]+origin[1],Math.max(back,front)+origin[2]];
  });
  const positions=placeMesh(mesh,origin,orientation);
  const min = [Infinity,Infinity,Infinity];
  const max = [-Infinity,-Infinity,-Infinity];
  for(let i=0;i<positions.length;i+=3)for(let axis=0;axis<3;axis++){
    min[axis]=Math.min(min[axis],positions[i+axis]);
    max[axis]=Math.max(max[axis],positions[i+axis]);
  }
  const distantMesh=family.distantMesh?.(options);
  const farDetail=distantMesh?{
    sceneId,instanceKey,palette:source.palette,positions:placeMesh(distantMesh,origin,orientation),
    materials:distantMesh.materials,luminousMaterials:source.luminousMaterials,detail:'far'
  }:null;
  return {contract,sceneId,seed,anchor:[...anchor],variant,orientation,instanceKey,supports,min,max,colliders,
    positions,materials:mesh.materials,palette:source.palette,luminousMaterials:source.luminousMaterials,farDetail,
    climbable:source.climbable===true,embedDepth:family.embedDepth??0};
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
  if (!object.supports.every(support=>blockAt(...support)&&!editedAt(...support))) return false;
  const min = object.min.map(x=>Math.floor(x+1e-6));
  // The exposed root has a shallow buried base. Its support is still
  // protected and the exact ray cannot select geometry behind terrain.
  if (object.embedDepth && object.min[1]>=object.anchor[1]-object.embedDepth) min[1]=object.anchor[1];
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
  const match = /^nb1:([^:]+):(-?\d+):(-?\d+),(-?\d+),(-?\d+):([0-7])(?::r([0-3]))?$/.exec(key);
  if (!match || Number(match[2])!==seed) return false;
  const sceneId = [...families.keys()].find(id => encodeURIComponent(id)===match[1]);
  const family = families.get(sceneId);
  const anchor = match.slice(3,6).map(Number);
  return family && validAnchor(anchor) && Number(match[6])<=(family.variantMax??3) &&
    keyOf(sceneId,seed,anchor,Number(match[6]),Number(match[7]),family)===key;
}

function readSidecar(raw,{version,seed,worldId}) {
  if(raw===null||raw.length>600_000)return null;
  let snapshot;
  try {snapshot=JSON.parse(raw);} catch {return null;}
  if(snapshot?.version!==version||snapshot.seed!==seed||snapshot.worldId!==worldId||
      !Array.isArray(snapshot.tombstones)||snapshot.tombstones.length>maxTombstones||
      snapshot.tombstones.some(key=>!validateTombstone(key,seed))||
      new Set(snapshot.tombstones).size!==snapshot.tombstones.length)return null;
  return snapshot;
}

export function createCandidateScene(seed,worldId,layout,{storage,blockAt,voxelPick,editedAt=()=>false}) {
  validateLayout(layout);
  const objects = layout.map(placement=>describeCandidateObject(seed,placement));
  if (new Set(objects.map(o=>o.anchor.join(','))).size !== objects.length)
    throw new TypeError('Duplicate nonblock staging anchor');
  const key = 'mythwrought:nonblock-stage:v1:'+encodeURIComponent(worldId)+':'+seed;
  const backupKey = key+':previous-good';
  const records = [key,backupKey].map(key=>({key,raw:storage.getItem(key)}));
  const expected = {version:sidecarVersion,seed,worldId};
  const primary = readSidecar(records[0].raw,expected);
  const backup = primary ? null : readSidecar(records[1].raw,expected);
  const recovered = backup!==null;
  const snapshot = primary??backup;
  if(!snapshot&&records.some(record=>record.raw!==null))throw new TypeError('Invalid nonblock sidecar');

  const removed = new Set(snapshot?.tombstones??[]);
  const solid = objects.filter(o=>o.colliders.length>0);
  const ladders = objects.filter(o=>o.climbable);
  const issued = new WeakSet();
  const distantObjects=new Set();
  let uncertain = false;
  let epoch = 0;
  const mounted=object=>!removed.has(object.instanceKey)&&canAttach(object,blockAt,editedAt);
  function visible(){return objects.filter(mounted);}
  function pickFrom(origin,direction,max,checkedObjects=null) {
    if (uncertain || !Array.isArray(origin) || origin.length!==3 ||
        !Array.isArray(direction) || direction.length!==3 ||
        ![...origin,...direction,max].every(Number.isFinite) || max<=0 || max>6) return null;
    const length = Math.hypot(...direction);
    if (length<1e-9) return null;
    const unit = direction.map(n=>n/length);
    const voxel = voxelPick(origin,unit,max);
    let best = null;
    let limit = voxel ? voxel.distance-1e-8 : max;
    for (const o of checkedObjects??objects) {
      if (!intersectsBounds(o,origin,unit,limit)||(!checkedObjects&&!mounted(o))) continue;
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
  function pick(origin,direction,max=6){return pickFrom(origin,direction,max);}
  function frame(origin,direction){
    const [x,y,z]=origin;
    const nearby=[],drawn=[];
    for(const object of objects){
      const [a,b,c]=object.anchor;
      const distanceSquared=(a-x)**2+(b-y)**2+(c-z)**2;
      if(distanceSquared>=32**2||!mounted(object))continue;
      nearby.push(object);
      const threshold=distantObjects.has(object)?farExitDistanceSquared:farEnterDistanceSquared;
      if(object.farDetail&&distanceSquared>threshold){
        distantObjects.add(object);
        drawn.push(object.farDetail);
      }else{
        distantObjects.delete(object);
        drawn.push(object);
      }
    }
    return {objects:drawn,hit:direction?pickFrom(origin,direction,6,nearby):null};
  }
  function breakHit(hit,origin,direction) {
    if (!issued.has(hit) || hit.epoch!==epoch || recovered || uncertain || removed.size>=maxTombstones) return false;
    const current = pick(origin,direction);
    if (current?.instanceKey!==hit.instanceKey || Math.abs(current.distance-hit.distance)>1e-7) return false;
    const next = JSON.stringify({...expected,tombstones:[...removed,hit.instanceKey].sort()});
    const attempted = [];
    try {
      if(records.some(({key,raw})=>storage.getItem(key)!==raw)){uncertain=true;return false;}
      for(const record of records){
        if(storage.getItem(record.key)!==record.raw)throw new Error('Nonblock sidecar changed during write');
        attempted.push(record);
        storage.setItem(record.key,next);
      }
      if(records.some(({key})=>storage.getItem(key)!==next))throw new Error('Nonblock sidecar readback mismatch');
    } catch {
      for(const {key,raw} of attempted.reverse()){
        try {
          if(storage.getItem(key)!==next)continue;
          if (raw===null) storage.removeItem(key);
          else storage.setItem(key,raw);
        } catch {uncertain=true;}
      }
      try {uncertain ||= records.some(({key,raw})=>storage.getItem(key)!==raw);}
      catch {uncertain=true;}
      return false;
    }
    for(const record of records)record.raw=next;
    removed.add(hit.instanceKey);
    epoch++;
    return true;
  }
  function bodyIntersects(body) {
    const epsilon = 1e-5;
    return solid.some(o=>!removed.has(o.instanceKey)&&o.colliders.some(box=>
      body[0]<box[3]-epsilon && body[3]>box[0]+epsilon &&
      body[1]<box[4]-epsilon && body[4]>box[1]+epsilon &&
      body[2]<box[5]-epsilon && body[5]>box[2]+epsilon
    )&&canAttach(o,blockAt,editedAt));
  }
  function climbableAt({x,feet,z}) {
    return ladders.some(o=>!removed.has(o.instanceKey)&&
      x>=o.min[0]-.20&&x<=o.max[0]+.20&&z>=o.min[2]-.28&&z<=o.max[2]+.28&&
      feet+1.10>o.min[1]&&feet<o.max[1]+.18&&canAttach(o,blockAt,editedAt));
  }
  return Object.freeze({visible,pick,frame,breakHit,bodyIntersects,climbableAt,recovered});
}

export function candidateVertices(objects) {
  const packed = new Float32Array(objects.reduce((n,o)=>n+o.positions.length*3,0));
  let offset = 0;
  for (const o of objects) {
    for (let i=0;i<o.positions.length;i+=9) {
      const p = o.positions;
      const pigment=o.materials?.[i/9]??0;
      const luminous=o.luminousMaterials?.includes(pigment)===true;
      let shade=1;
      if(!luminous){
        const normal=cross(sub(p.subarray(i+3,i+6),p.subarray(i,i+3)),
          sub(p.subarray(i+6,i+9),p.subarray(i,i+3)));
        shade=.72+.28*Math.abs(dot(normal,[.35,.84,.4]))/(Math.hypot(...normal)||1);
      }
      const color=(o.palette[pigment]??o.palette[0]).map(n=>n*shade);
      for (let j=i;j<i+9;j+=3) {
        // The existing opaque grotto material keeps selected pigments bright.
        packed.set([p[j],p[j+1],p[j+2],...color,0,0,luminous?11:21],offset);
        offset+=9;
      }
    }
  }
  return packed;
}
