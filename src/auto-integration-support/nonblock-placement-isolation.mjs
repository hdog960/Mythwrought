// Opt-in placement and edit-safety preflight. Fixture-only; never spawns or edits the world.
const validBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every(Number.isFinite)&&b.max.every(Number.isFinite)&&b.min.every((v,i)=>v<b.max[i]);
const overlaps=(a,b)=>a.min.every((v,i)=>v<b.max[i]&&b.min[i]<a.max[i]);
export function auditPlacementIsolation({objects,editedCells=[],existingObjects=[],protectedCells=[]}={}){
 const errors=[],seen=new Set();
 if(!Array.isArray(objects)||!objects.length)return {ok:false,status:'NOT_VERIFIED',errors:['NO_OBJECTS']};
 for(const [name,cells] of [['editedCells',editedCells],['protectedCells',protectedCells]]){
  if(!Array.isArray(cells)||cells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)))errors.push('INVALID_'+name);
 }
 if(!Array.isArray(existingObjects))errors.push('INVALID_EXISTING_OBJECTS');
 const occupied=new Set([...editedCells,...protectedCells].filter(c=>Array.isArray(c)&&c.length===3).map(c=>c.join(',')));
 for(const o of objects){
  if(typeof o?.instanceKey!=='string'||!o.instanceKey.startsWith('nb1:')||seen.has(o.instanceKey))errors.push('INVALID_OR_DUPLICATE_IDENTITY');
  seen.add(o?.instanceKey);
  if(o?.placement?.enabledByDefault!==false||o?.placement?.requiresWorldEditCheck!==true||o?.placement?.requiresAttachmentCheck!==true)errors.push('UNSAFE_AUTO_PLACEMENT');
  if(!Array.isArray(o?.occupiedCells)||!o.occupiedCells.length||o.occupiedCells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)))errors.push('INVALID_OCCUPIED_CELLS');
  for(const c of o?.occupiedCells??[])if(Array.isArray(c)&&occupied.has(c.join(',')))errors.push('WORLD_EDIT_OR_PROTECTED_CELL_OVERLAP');
  if(!Array.isArray(o?.collisionAabbs)||!o.collisionAabbs.every(validBox))errors.push('INVALID_COLLISION_BOUNDS');
  if(!Array.isArray(o?.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(validBox))errors.push('INVALID_SELECTION_BOUNDS');
 }
 const all=[...objects,...(Array.isArray(existingObjects)?existingObjects:[])];
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const a=all[i],b=all[j];
  if(a?.instanceKey===b?.instanceKey)errors.push('DUPLICATE_EXISTING_IDENTITY');
  for(const x of a?.collisionAabbs??[])for(const y of b?.collisionAabbs??[])if(validBox(x)&&validBox(y)&&overlaps(x,y))errors.push('COLLISION_OVERLAP');
 }
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'DECLARED_PLACEMENT_FIXTURE_ONLY_NOT_LIVE',errors:[...new Set(errors)]};
}
