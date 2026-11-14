// Standalone physical-contact audit; no Pack3 registration or live-world writes.
// Pack3 023/024/025 roof-surface candidates have a *thin* 0.125-cell base.
// Full weather sealing, structural span and partial beam intersections stay OPEN.
const k=v=>v.join(',');
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
export function roofStepTargets(b){
 const roof=new Map();
 for(const p of b.placements.filter(p=>p.role==='roof'&&!p.roofLantern)){
  const col=k([p.at[0],p.at[2]]);
  if(!roof.has(col)||roof.get(col).at[1]>p.at[1])roof.set(col,p);
 }
 const targets=new Set();
 for(const p of roof.values()){
  const [x,y,z]=p.at;
  for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const q=roof.get(k([x+dx,z+dz]));
   if(q&&q.at[1]<y)for(let h=q.at[1];h<y;h++)targets.add(k([x,h,z]));
  }
 }
 return {targets,roof};
}
export function auditRoofStepFeasibility(b){
 const {targets,roof}=roofStepTargets(b);
 const occ=new Map(b.placements.map(p=>[k(p.at),p]));
 const audit=b.architecturalIdentity.roofStepAudit;
 assert(audit&&audit.weatherSealApproved===false,b.id+': cannot certify unmerged Pack3 tile weather sealing');
 assert(audit.needed===targets.size,b.id+': roof step count differs from actual geometry');
 const unresolved=new Map((audit.unresolved??[]).map(r=>[k(r.cell),r.asset]));
 assert(unresolved.size===audit.unresolved.length,b.id+': duplicate unresolved step cell');
 let repaired=0;
 for(const cell of targets){
  const p=occ.get(cell);
  assert(p,b.id+': raw exposed gap remains below raised tile at '+cell);
  if(p.asset.startsWith('live:')){
   assert(p.roofRiser==='live-solid-step-backing'&&['live:stone','live:wood'].includes(p.asset),b.id+': fake solid step riser at '+cell);
   assert(!unresolved.has(cell),b.id+': live-filled riser still claimed as unresolved');
   repaired++;
  }else{
   assert(unresolved.get(cell)===p.asset,b.id+': pending partial-beam collision not tracked at '+cell);
   assert(p.roofFrame==='crossbeam'||p.roofFrame==='tie-post',b.id+': non-frame candidate in riser position needs fresh review');
  }
 }
 assert(repaired===audit.filled,b.id+': filled roof riser metadata not backed by physical cells');
 assert(audit.filled+audit.unresolved.length===audit.needed,b.id+': incomplete roof-step accounting');
 for(const [cell] of unresolved)assert(targets.has(cell),b.id+': ghost roof-step exception');
 // True open courtyards are not accidentally sealed by these repairs.
 if(b.architecturalIdentity.roof==='courtyard'){
  const midX=Math.floor(b.footprint.width/2),midZ=Math.floor(b.footprint.depth/2);
  for(let x=midX-1;x<=midX+1;x++)for(let z=midZ-1;z<=midZ+1;z++){
   assert(!roof.has(k([x,z])),b.id+': courtyard skylight filled by an unintended tile');
   assert(!b.placements.some(p=>p.roofRiser&&p.at[0]===x&&p.at[2]===z),b.id+': courtyard blocked by step backing');
  }
 }
 return {id:b.id,needed:targets.size,filled:repaired,unresolved:unresolved.size,weatherSealApproved:false};
}
