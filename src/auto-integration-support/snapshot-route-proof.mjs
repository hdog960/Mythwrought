// Opt-in route proof; snapshots are not producer execution.
const safe=Number.isSafeInteger;
const valid=p=>p&&['x','y','z'].every(k=>safe(p[k]));
const id=p=>`${p.x},${p.y},${p.z}`;
const adjacent=(a,b)=>['x','y','z'].reduce((s,k)=>s+(BigInt(a[k])>BigInt(b[k])?BigInt(a[k])-BigInt(b[k]):BigInt(b[k])-BigInt(a[k])),0n)===1n;
export function proveSnapshotRoutes({surface,caves,minY,maxY}) {
 if(!Array.isArray(surface)||!Array.isArray(caves)||!safe(minY)||!safe(maxY)||minY>maxY) throw new TypeError('invalid route proof inputs');
 const heights=new Map(),errors=[];
 for(const s of surface){
  if(!valid(s)){errors.push('surface:invalid-cell');continue;}
  const k=`${s.x},${s.z}`;
  if(heights.has(k))errors.push('surface:duplicate-column');
  heights.set(k,s.y);
 }
 caves.forEach((c,i)=>{
  const p=`cave:${i}:`;
  if(!c||!valid(c.entrance)||!Array.isArray(c.path)||!c.path.length||!c.path.every(valid)){errors.push(p+'invalid-route');return;}
  const h=heights.get(`${c.entrance.x},${c.entrance.z}`);
  if(h===undefined)errors.push(p+'missing-surface');
  else if(c.entrance.y>h)errors.push(p+'entrance-above-surface');
  if(id(c.path[0])!==id(c.entrance))errors.push(p+'start-mismatch');
  const seen=new Set();
  c.path.forEach((cell,j)=>{
   if(cell.y<minY||cell.y>maxY)errors.push(p+'out-of-bounds');
   if(seen.has(id(cell)))errors.push(p+'revisited-cell');
   seen.add(id(cell));
   if(j&&!adjacent(c.path[j-1],cell))errors.push(p+'disconnected-step');
  });
  if(c.exit!==undefined&&(!valid(c.exit)||id(c.path.at(-1))!==id(c.exit)))errors.push(p+'exit-mismatch');
 });
 return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors),status:'SNAPSHOT-ONLY-NOT-PRODUCER-VERIFIED'});
}
