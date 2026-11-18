// Opt-in, read-only cave write provenance and transition checker.
// Candidate fixture contract only: callers must authenticate producer callbacks separately.
const key = ({x,y,z}) => `${x},${y},${z}`;
const integer = n => Number.isSafeInteger(n);
export function checkCaveTransition({shallow, deep, socket, protectedCells=[], bounds={minY:-210,maxY:-3}}) {
  const errors=[];
  if (!Array.isArray(shallow)||!Array.isArray(deep)||!Array.isArray(protectedCells)||
      !socket||![socket.x,socket.y,socket.z].every(integer)) {
    return {ok:false,errors:["INVALID_INPUT"],status:"NOT_VERIFIED"};
  }
  if (!integer(bounds.minY)||!integer(bounds.maxY)||bounds.minY>bounds.maxY)
    return {ok:false,errors:["INVALID_BOUNDS"],status:"NOT_VERIFIED"};
  const protectedSet=new Set(protectedCells.map(c=>key(c)));
  const seen=new Map();
  for (const [owner, writes] of [["shallow",shallow],["deep",deep]]) {
    for (const w of writes) {
      if (!w||![w.x,w.y,w.z].every(integer)||!["AIR","SOLID"].includes(w.kind)) {
        errors.push("INVALID_WRITE");continue;
      }
      const k=key(w);
      if(w.y<bounds.minY||w.y>bounds.maxY)errors.push("OUT_OF_WORLD");
      if(w.y>=-3)errors.push("LEGACY_FLOOR");
      if(owner==="shallow"&&(w.y> -4||w.y< -45))errors.push("SHALLOW_BOUNDS");
      if(owner==="deep"&&w.y> -46 && k!==key(socket))errors.push("DEEP_UPPER_OWNERSHIP");
      if(protectedSet.has(k))errors.push("PLAYER_EDIT");
      if(seen.has(k)) {
        const old=seen.get(k);
        if(old.owner!==owner && (k!==key(socket)||w.kind!=="AIR"||old.kind!=="AIR"))
          errors.push("UNAUTHORIZED_OVERLAP");
        if(old.owner===owner&&old.kind!==w.kind)errors.push("INTERNAL_CONFLICT");
      } else seen.set(k,{owner,kind:w.kind});
    }
  }
  // No invented connector: an explicit socket must have AIR evidence from both producers.
  const socketKey=key(socket);
  const a=shallow.some(w=>key(w)===socketKey&&w.kind==="AIR");
  const b=deep.some(w=>key(w)===socketKey&&w.kind==="AIR");
  if(!a||!b)errors.push("SOCKET_NOT_JOINTLY_PROVEN");
  return {ok:errors.length===0,errors:[...new Set(errors)].sort(),status:"FIXTURE_ONLY_NOT_SOURCE_AUTHENTICATED",
    observedWrites:seen.size};
}
