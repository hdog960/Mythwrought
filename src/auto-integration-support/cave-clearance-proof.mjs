// Candidate-only clearance preflight; requires source-authenticated writes from both owners.
const valid=p=>p&&['x','y','z'].every(k=>Number.isSafeInteger(p[k]));
const key=p=>[p.x,p.y,p.z].join(',');
export function inspectCaveClearance({upper,deep,route,sourceHeads,protectedCells=[]}={}){
 const errors=[];
 if(!sourceHeads||!['upper','deep'].every(k=>/^[a-f0-9]{40}$/.test(sourceHeads[k]||'')))errors.push('missing producer heads');
 if(!Array.isArray(upper)||!upper.length||!Array.isArray(deep)||!deep.length)errors.push('missing source writes');
 if(!Array.isArray(route)||route.length<2||route.some(p=>!valid(p)))errors.push('invalid route');
 if(!Array.isArray(protectedCells)||protectedCells.some(p=>!valid(p)))errors.push('invalid protected cells');
 if(errors.length)return {ok:false,status:'NOT_VERIFIED',errors};
 const occupied=new Map(),edits=new Set(protectedCells.map(key));
 for(const [owner,cells] of [['upper',upper],['deep',deep]])for(const p of cells){
  if(!valid(p)||!['AIR','SOLID'].includes(p.kind)){errors.push('invalid voxel');continue;}
  if(owner==='upper'&&(p.y < -45||p.y > -4))errors.push('upper ownership violation');
  if(p.y>=-3)errors.push('legacy layer modification');
  const k=key(p);
  if(edits.has(k))errors.push('player edit collision');
  if(occupied.has(k))errors.push('unapproved overlapping writes');
  else occupied.set(k,{kind:p.kind,owner});
 }
 let crossed=false;
 for(let i=0;i<route.length;i++){
  const p=route[i];
  if(p.y < -210||p.y > -4)errors.push('out of world bounds');
  if(i){
   const q=route[i-1],d=Math.abs(p.x-q.x)+Math.abs(p.y-q.y)+Math.abs(p.z-q.z);
   if(d!==1)errors.push('disconnected route');
   if((p.y===-45&&q.y===-46)||(p.y===-46&&q.y===-45))crossed=true;
  }
  for(let dx=-1;dx<=1;dx++){
   for(let dy=0;dy<4;dy++){
    const k=key({x:p.x+dx,y:p.y+dy,z:p.z});
    if(occupied.get(k)?.kind!=='AIR')errors.push('unproven 3-wide 4-high clearance');
    if(edits.has(k))errors.push('protected clearance edit');
   }
   const floor=key({x:p.x+dx,y:p.y-1,z:p.z});
   if(occupied.get(floor)?.kind!=='SOLID')errors.push('unproven supporting floor');
   if(edits.has(floor))errors.push('protected floor edit');
  }
 }
 if(!crossed)errors.push('missing -45/-46 transition');
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'FIXTURE_CLEARANCE_ONLY',errors:[...new Set(errors)],integrationVerified:false};
}
