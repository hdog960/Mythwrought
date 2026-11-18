// Opt-in source-write preflight. Never mutates producers or the world.
const valid=c=>c&&['x','y','z'].every(k=>Number.isSafeInteger(c[k]));
const key=c=>[c.x,c.y,c.z].join(',');
export function inspectCaveSocketConflicts({upper,deep,socket,protectedCells=[],sourceHeads}={}){
 const errors=[];
 if(!sourceHeads||!['upper','deep'].every(k=>/^[a-f0-9]{40}$/.test(sourceHeads[k]||'')))errors.push('missing exact producer heads');
 if(!Array.isArray(upper)||!upper.length||!Array.isArray(deep)||!deep.length)errors.push('missing source-backed writes');
 if(!valid(socket)||socket.y!==-45)errors.push('invalid transition socket');
 if(!Array.isArray(protectedCells))errors.push('invalid protected cells');
 if(errors.length)return {status:'NOT_VERIFIED',compatible:false,errors};
 const edits=new Set();
 for(const p of protectedCells){if(!valid(p))errors.push('invalid protected coordinate');else edits.add(key(p));}
 const writes=new Map(),s=key(socket);
 for(const [owner,cells] of [['upper',upper],['deep',deep]])for(const w of cells){
  if(!valid(w)||!['AIR','SOLID'].includes(w.kind)){errors.push('invalid write');continue;}
  if(owner==='upper'&&(w.y < -45||w.y > -4))errors.push('upper out of bounds');
  if(owner==='deep'&&w.y > -4)errors.push('deep legacy-layer write');
  if(w.y>=-3)errors.push('protected legacy layer');
  const k=key(w);
  if(edits.has(k))errors.push('player edit collision');
  const prior=writes.get(k);
  if(prior){if(prior.owner===owner)errors.push('duplicate producer write');else if(prior.kind!==w.kind)errors.push('AIR-solid conflict');else if(k!==s)errors.push('unapproved shared voxel');}
  else writes.set(k,{owner,kind:w.kind});
 }
 if(!upper.some(w=>valid(w)&&key(w)===s&&w.kind==='AIR')||!deep.some(w=>valid(w)&&key(w)===s&&w.kind==='AIR'))errors.push('missing mutual AIR socket');
 for(const w of upper){if(!valid(w))continue;for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
  const k=key({x:w.x+dx,y:w.y+dy,z:w.z+dz}),other=writes.get(k);
  if(other?.owner==='deep'&&other.kind!==w.kind&&key(w)!==s&&k!==s)errors.push('cross-owner safety-buffer conflict');
 }}
 return {status:errors.length?'NOT_VERIFIED':'FIXTURE_SOCKET_CONSISTENT_ONLY',compatible:errors.length===0,errors:[...new Set(errors)],integrationVerified:false,checkedWrites:upper.length+deep.length};
}
