// Roadmap 1 standalone 3D voxel blueprint contract. No live engine imports.
export const SCHEMA='mythwrought.building-pool.roadmap-1.v1';
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
export const QUOTAS=Object.freeze({house:20,tavern:5,inn:5,bathhouse:4,stable:5,'farm-barn':4,greenhouse:4,'fishing-lodge':4,'harbor-office':4,lighthouse:4});
export const TARGET=BIOMES.length*SIZES.length*Object.values(QUOTAS).reduce((a,b)=>a+b,0);
const ROLES=new Set(['foundation','floor','wall','partition','roof','door','window','stair','support','furnishing','lighting','decoration','terrain-interface']);
const ORIENTATIONS=new Set(['north','east','south','west','up','down','none','unresolved']);
const KINDS=new Set(['full-cell','partial','pass-through','unresolved']);
const LIVE=new Set(['grass','dirt','stone','wood','crystal','ore','leaves','deepstone']);
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(n=>Number.isInteger(n)&&Math.abs(n)<=10000);
const key=p=>p.join(',');
const assert=(test,msg)=>{if(!test)throw new Error(msg);};
export function blueprintId(category,biome,size,index){
  assert(QUOTAS[category]&&BIOMES.includes(biome)&&SIZES.includes(size),'unknown blueprint classification');
  assert(Number.isInteger(index)&&index>=1&&index<=QUOTAS[category],'blueprint index outside category quota');
  return 'r1:'+category+':'+biome+':'+size+':'+String(index).padStart(3,'0');
}
export function validateBlueprint(b){
  assert(b&&b.schema===SCHEMA,'invalid schema');
  assert(b.id===blueprintId(b.category,b.biome,b.size,b.index),'noncanonical or mismatched blueprint ID');
  assert(b.status==='candidate','unapproved lifecycle status');
  assert(b.frame==='local-x-east-y-up-z-south','unresolved coordinate frame');
  const f=b.footprint;
  assert(f&&vec([f.width,f.height,f.depth])&&f.width>=3&&f.height>=3&&f.depth>=3,'invalid footprint');
  assert(Array.isArray(b.placements)&&b.placements.length>0,'no authored voxel placements');
  const occupied=new Set(),unknown=new Set();
  for(const p of b.placements){
    assert(vec(p.at)&&p.at.every((n,i)=>n>=0&&n<[f.width,f.height,f.depth][i]),'placement outside footprint');
    assert(ROLES.has(p.role),'unknown architectural role');
    assert(typeof p.asset==='string'&&/^(live:[a-z-]+|pack[1-5]:\d{3}|biome130:\d{3})$/.test(p.asset),'asset must use exact symbolic namespace');
    assert(!p.asset.startsWith('live:')||LIVE.has(p.asset.slice(5)),'unknown live voxel family');
    assert(ORIENTATIONS.has(p.orientation),'orientation must be explicit');
    assert(p.occupancy&&KINDS.has(p.occupancy.kind),'occupancy must be explicit');
    if(p.occupancy.kind==='unresolved'){
      assert(p.occupancy.bounds===null&&typeof p.occupancy.reason==='string'&&p.occupancy.reason.length>3,'unresolved dimensions need reason and null bounds');
      unknown.add(p.asset);
    }else{
      assert(Array.isArray(p.occupancy.bounds)&&p.occupancy.bounds.length===6&&p.occupancy.bounds.every(n=>typeof n==='number'&&n>=0&&n<=1),'resolved occupancy requires normalized local bounds');
      assert(p.occupancy.bounds.slice(0,3).every((v,i)=>v<p.occupancy.bounds[i+3]),'empty occupancy');
    }
    assert(!occupied.has(key(p.at)),'overlapping authored placements require explicit future subcell layering');
    occupied.add(key(p.at));
  }
  assert(Array.isArray(b.rooms)&&b.rooms.length>0,'rooms missing');
  const rooms=new Map();
  for(const r of b.rooms){
    assert(typeof r.id==='string'&&r.id.length>0&&!rooms.has(r.id),'duplicate room ID');
    assert(vec(r.min)&&vec(r.max)&&r.min.every((n,i)=>n>=0&&n<r.max[i]&&r.max[i]<=[f.width,f.height,f.depth][i]),'invalid room bounds');
    rooms.set(r.id,r);
  }
  assert(Array.isArray(b.walkable)&&b.walkable.length>0,'interior circulation missing');
  const walk=new Set();
  for(const v of b.walkable){
    assert(vec(v)&&v.every((n,i)=>n>=0&&n<[f.width,f.height,f.depth][i]),'walkable cell out of footprint');
    assert(!occupied.has(key(v)),'walkable cell is physically occupied');
    assert(!walk.has(key(v)),'duplicate walkable cell');walk.add(key(v));
  }
  const seenWalk=new Set([key(b.walkable[0])]),walkQueue=[b.walkable[0]];
  while(walkQueue.length){const v=walkQueue.shift();for(const axis of [0,1,2])for(const sign of [-1,1]){const next=[...v];next[axis]+=sign;const nk=key(next);if(walk.has(nk)&&!seenWalk.has(nk)){seenWalk.add(nk);walkQueue.push(next);}}}
  assert(seenWalk.size===walk.size,'disconnected voxel circulation');
  const outside='outside';
  assert(Array.isArray(b.portals)&&b.portals.length>0,'no entrance/room portal graph');
  const neighbors=new Map([[outside,new Set()]]);
  for(const id of rooms.keys())neighbors.set(id,new Set());
  for(const d of b.portals){
    assert(neighbors.has(d.from)&&neighbors.has(d.to)&&d.from!==d.to,'portal references unknown room');
    assert(vec(d.at)&&walk.has(key(d.at)),'portal must reference a known walkable cell');
    assert(d.passable===true,'portals must be explicitly passable');
    neighbors.get(d.from).add(d.to);neighbors.get(d.to).add(d.from);
  }
  const visited=new Set([outside]),queue=[outside];
  while(queue.length){const u=queue.shift();for(const v of neighbors.get(u))if(!visited.has(v)){visited.add(v);queue.push(v);}}
  assert(visited.size===rooms.size+1,'not every room is reachable from an exterior entrance');
  assert(Array.isArray(b.dependencies),'missing dependency ledger');
  for(const ref of unknown)assert(b.dependencies.some(d=>d.asset===ref&&d.status==='unresolved'&&Array.isArray(d.requires)&&d.requires.length>0),'unknown asset omitted from unresolved dependency ledger');
  assert(b.worldPlacement===false&&b.liveIntegration===false,'no world placement or engine integration permitted');
  return true;
}
export function stableBlueprintJSON(b){validateBlueprint(b);return JSON.stringify({
  ...b,placements:[...b.placements].sort((a,c)=>key(a.at).localeCompare(key(c.at))),
  rooms:[...b.rooms].sort((a,c)=>a.id.localeCompare(c.id)),
  walkable:[...b.walkable].sort((a,c)=>key(a).localeCompare(key(c))),
  portals:[...b.portals].sort((a,c)=>(a.from+a.to+key(a.at)).localeCompare(c.from+c.to+key(c.at))),
  dependencies:[...b.dependencies].sort((a,c)=>a.asset.localeCompare(c.asset))
});}
// Material-agnostic exact geometry check. Mirror/rotation and near-duplicate
// detection need additional formal and visual acceptance in M1–M5.
export function structuralFingerprint(b){
  validateBlueprint(b);
  const pts=b.placements.map(p=>[...p.at,p.role]).sort((a,c)=>JSON.stringify(a).localeCompare(JSON.stringify(c)));
  const rooms=b.rooms.map(r=>[r.min,r.max]).sort((a,c)=>JSON.stringify(a).localeCompare(JSON.stringify(c)));
  return JSON.stringify({footprint:b.footprint,pts,rooms,walkable:[...b.walkable].sort((a,c)=>key(a).localeCompare(key(c)))});
}
export function validatePool(blueprints){
  assert(Array.isArray(blueprints)&&blueprints.length<=TARGET,'pool quota exceeded');
  const ids=new Set(),shapes=new Set(),buckets=new Map();
  for(const b of blueprints){
    validateBlueprint(b);
    assert(!ids.has(b.id),'duplicate blueprint ID');ids.add(b.id);
    const shape=structuralFingerprint(b);
    assert(!shapes.has(shape),'identical geometry after material-only differences');shapes.add(shape);
    const bucket=[b.category,b.biome,b.size].join('/');
    const next=(buckets.get(bucket)||0)+1;
    assert(next<=QUOTAS[b.category],'per-biome, per-size category quota exceeded');buckets.set(bucket,next);
  }
  return {authored:blueprints.length,target:TARGET,remaining:TARGET-blueprints.length,buckets:Object.fromEntries(buckets)};
}
