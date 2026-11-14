// Opt-in, allocation-free-at-callsite shape targeting. No world, renderer or save mutations.
// Descriptor contract for :12: { boxes: [[minX,minY,minZ,maxX,maxY,maxZ], ...] }
// Coordinates are local to the integer voxel cell; bounds inclusive within [0,1].
const EPS = 1e-9;
export function validateShape(shape) {
  if (!shape || !Array.isArray(shape.boxes) || !shape.boxes.length || shape.boxes.length > 32) return false;
  return shape.boxes.every(b => Array.isArray(b) && b.length === 6 &&
    b.every(Number.isFinite) && b.slice(0,3).every((v,i) => v >= 0 && v < b[i+3]) &&
    b.slice(3).every(v => v <= 1));
}
export const FULL_CUBE = Object.freeze({boxes: Object.freeze([[0,0,0,1,1,1]])});

// Rotation around the vertical cell axis. 0,1,2,3 represent quarter turns.
export function rotateShape(shape, turns=0) {
  if (!validateShape(shape) || !Number.isInteger(turns)) throw new TypeError('Invalid shape or rotation');
  const n=((turns%4)+4)%4;
  return {boxes:shape.boxes.map(b=>{
    let [x,y,z,X,Y,Z]=b;
    for(let i=0;i<n;i++) [x,z,X,Z]=[1-Z,x,1-z,X];
    return [x,y,z,X,Y,Z];
  })};
}
function intersect(origin,dir,min,max,limit) {
  let enter=-Infinity, exit=Infinity, axis=-1, sign=0;
  for(let a=0;a<3;a++) {
    if(Math.abs(dir[a])<EPS) {
      if(origin[a]<min[a]-EPS || origin[a]>max[a]+EPS) return null;
      continue;
    }
    let t1=(min[a]-origin[a])/dir[a], t2=(max[a]-origin[a])/dir[a];
    const near=Math.min(t1,t2), far=Math.max(t1,t2);
    if(near>enter) {enter=near;axis=a;sign=t1<t2?-1:1;}
    exit=Math.min(exit,far);
    if(enter>exit+EPS) return null;
  }
  if(exit < -EPS || enter>limit+EPS) return null;
  const distance=Math.max(0,enter);
  const normal=[0,0,0];
  if(enter>=0 && axis>=0) normal[axis]=sign;
  return {distance,normal};
}
// getShape(x,y,z) returns null for air, FULL_CUBE for legacy solids, or a descriptor.
// No implicit full cube for missing/unknown shapes: empty space must remain targetable through.
export function raycastShapes(origin,direction,getShape,maxDistance=6) {
  if(!Array.isArray(origin)||!Array.isArray(direction)||origin.length!==3||direction.length!==3||
    !origin.every(Number.isFinite)||!direction.every(Number.isFinite)||
    !Number.isFinite(maxDistance)||maxDistance<0||typeof getShape!=='function') throw new TypeError('Invalid ray');
  const length=Math.hypot(...direction);
  if(length<EPS) throw new RangeError('Zero direction');
  const d=direction.map(v=>v/length), cell=origin.map(Math.floor);
  const step=d.map(v=>Math.sign(v));
  const delta=d.map(v=>Math.abs(v)<EPS?Infinity:Math.abs(1/v));
  const next=d.map((v,a)=>Math.abs(v)<EPS?Infinity:((step[a]>0?cell[a]+1:cell[a])-origin[a])/v);
  let travel=0, best=null;
  // At most three boundary crossings per unit per axis; bounded to avoid untrusted huge rays.
  const budget=Math.min(100000,Math.ceil(maxDistance*3)+6);
  for(let i=0;i<budget && travel<=maxDistance+EPS;i++) {
    const shape=getShape(...cell);
    if(shape) {
      if(!validateShape(shape)) throw new TypeError('Invalid registered shape');
      for(const b of shape.boxes) {
        const hit=intersect(origin,d,b.slice(0,3).map((v,a)=>v+cell[a]),
          b.slice(3).map((v,a)=>v+cell[a]),maxDistance);
        if(hit && hit.distance>=travel-EPS && (!best || hit.distance<best.distance-EPS))
          best={cell:[...cell],distance:hit.distance,normal:hit.normal,
            point:origin.map((v,a)=>v+d[a]*hit.distance)};
      }
    }
    const boundary=Math.min(...next);
    if(best && best.distance<=boundary+EPS) return best;
    if(!Number.isFinite(boundary)||boundary>maxDistance+EPS) break;
    // Advance all tied axes to handle edge/corner crossing without skipping a cell.
    for(let a=0;a<3;a++) if(next[a]<=boundary+EPS) {cell[a]+=step[a];next[a]+=delta[a];}
    travel=boundary;
  }
  return best;
}
// Placement validation only: prevents overlaps with occupied selection/collision boxes.
// A host may additionally reject protected terrain, player intersection and saved edits.
export function canPlaceShape(shape,cell,getShape) {
  if(!validateShape(shape)||!Array.isArray(cell)||cell.length!==3||
    !cell.every(Number.isInteger)||typeof getShape!=='function') throw new TypeError('Invalid placement');
  const other=getShape(...cell);
  if(!other) return true;
  if(!validateShape(other)) throw new TypeError('Invalid registered shape');
  return shape.boxes.every(a=>other.boxes.every(b=>[0,1,2].some(i=>a[i+3]<=b[i]+EPS||b[i+3]<=a[i]+EPS)));
}
