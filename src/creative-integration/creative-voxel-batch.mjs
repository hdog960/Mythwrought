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
 let attempted=0;
 try{
  for(let i=0;i<cells.length;i++){
   attempted=i+1;
   if(!write(cells[i],desired[i])||!same(read(cells[i]),desired[i]))throw Error('Voxel write refused');
  }
  rebuild(cells);
 }catch(_){
  let restored=true;
  for(let i=attempted-1;i>=0;i--){
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
