// Verified bounded Creative voxel batch. No direct storage or renderer ownership.
// All cells are checked before mutation; failures restore the attempted cells
// via the authoritative setter. Durable partial failure is protected, not hidden.
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?
 Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
export function replayCreativeVoxelBatch({cells,desired,expected,read,allowed,write,rebuild,save,protect}){
 if(!Array.isArray(cells)||!cells.length||cells.length>512||
    !Array.isArray(desired)||!Array.isArray(expected)||desired.length!==cells.length||expected.length!==cells.length||
    !cells.every(c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger))||
    new Set(cells.map(c=>c.join(','))).size!==cells.length)return false;
 if(![read,allowed,write,rebuild,save,protect].every(f=>typeof f==='function'))return false;
 try{
  for(let i=0;i<cells.length;i++)if(!same(read(cells[i]),expected[i])||
    !allowed(cells[i],desired[i],expected[i]))return false;
 }catch(_){return false;}
 // Top-down writes prevent the legacy AIR setter from implicitly
 // removing a not-yet-written supported cell. Restore every admitted cell
 // on failure, even when a setter changed a neighbor before throwing.
 const order=states=>cells.map((_,i)=>i).sort((a,b)=>
   Number(states[b]?.id===0)-Number(states[a]?.id===0)||
   (states[a]?.id===0?cells[b][1]-cells[a][1]:cells[a][1]-cells[b][1]));
 try{
  for(const i of order(desired)){
   if(!write(cells[i],desired[i])||!same(read(cells[i]),desired[i]))throw Error('Voxel write refused');
  }
  if(cells.some((c,i)=>!same(read(c),desired[i])))throw Error('Full footprint changed during write');
  rebuild(cells);
 }catch(_){
  let restored=true;
  for(const i of order(expected)){
   try{if(!same(read(cells[i]),expected[i])&&!write(cells[i],expected[i]))restored=false;}
   catch(_){restored=false;}
  }
  try{if(cells.some((c,i)=>!same(read(c),expected[i])))restored=false;}catch(_){restored=false;}
  if(!restored)protect();
  return false;
 }
 try{if(save()===true)return true;}catch(_){}
 // Mesh publication may already have succeeded and independent durable
 // sidecars may have committed. Never pretend this is a verified rollback.
 protect();return false;
}
