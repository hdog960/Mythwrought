// :12 opt-in candidate-scene acceptance. Never imports producers or registers objects.
const HEX=/^[a-f0-9]{40}$/;
const finite3=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
const box=b=>b&&finite3(b.min)&&finite3(b.max)&&b.min.every((v,i)=>v<b.max[i]);
const overlap=(a,b)=>a.min.every((v,i)=>v<b.max[i]&&b.min[i]<a.max[i]);
const objectId=id=>typeof id==='string'&&/^nonblock:[a-z][a-z0-9-]*:[a-z0-9][a-z0-9:_-]*$/.test(id);
export function auditNonblockCandidateScene({objects,worldSeed,worldEdits=[],sourceHeads,budgets}={}){
 const errors=[];
 if(!Array.isArray(objects)||!Array.isArray(worldEdits)||typeof worldSeed!=='string'||!worldSeed||
 !sourceHeads||!['scene48','environments24','fittings36'].every(k=>HEX.test(sourceHeads[k]||''))||
 !budgets||!Number.isSafeInteger(budgets.maxTriangles)||budgets.maxTriangles<1||
 !Number.isSafeInteger(budgets.maxDrawCalls)||budgets.maxDrawCalls<1)
 return {ok:false,live:false,errors:['invalid scene evidence envelope']};
 const seenIds=new Set(),seenKeys=new Set(),accepted=[];let triangles=0,drawCalls=0;
 for(const [i,o] of objects.entries()){
  const p='object '+i;
  if(!o||!objectId(o.id))errors.push(p+': invalid namespaced ID');
  else if(seenIds.has(o.id))errors.push(p+': duplicate ID');
  else seenIds.add(o.id);
  if(!o||typeof o.instanceKey!=='string'||!o.instanceKey||seenKeys.has(o.instanceKey))errors.push(p+': missing or duplicate instance key');
  else seenKeys.add(o.instanceKey);
  if(!o||o.seed!==worldSeed)errors.push(p+': seed mismatch');
  if(!o||!['scene48','environments24','fittings36'].includes(o.owner))errors.push(p+': invalid owner');
  if(!o||!box(o.selectionAabb)||!box(o.collisionAabb))errors.push(p+': invalid AABB');
  if(!o||o.breakable!==true||o.pickable!==true||o.removable!==true||o.tombstoneKey!==o.instanceKey)
   errors.push(p+': incomplete break/removal identity');
  if(!o||!Number.isSafeInteger(o.triangles)||o.triangles<0||!Number.isSafeInteger(o.drawCalls)||o.drawCalls<0)
   errors.push(p+': invalid render budget');
  else {triangles+=o.triangles;drawCalls+=o.drawCalls;}
  if(o&&box(o.collisionAabb)){
   if(worldEdits.some(e=>box(e)&&overlap(o.collisionAabb,e)))errors.push(p+': intersects protected edit');
   for(const prev of accepted)if(overlap(o.collisionAabb,prev.collisionAabb))errors.push(p+': overlaps '+prev.id);
   accepted.push(o);
  }
 }
 if(triangles>budgets.maxTriangles)errors.push('triangle budget exceeded');
 if(drawCalls>budgets.maxDrawCalls)errors.push('draw-call budget exceeded');
 return {ok:errors.length===0,live:false,errors,totals:{objects:objects.length,triangles,drawCalls}};
}
