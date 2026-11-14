// Theoretical authored building blueprints. Never installs world voxels or alters saves.
import {assertSlot,TOTAL_DESIGNS} from './roster.mjs';

const isInt = n=>Number.isSafeInteger(n);
function fail(s){throw new Error(`Invalid Roadmap 3 blueprint: ${s}`);}
const rect = (b,what)=>{
  if(!b || !['x','y','z','width','height','depth'].every(k=>isInt(b[k])))fail(`${what} must use integral voxel AABB`);
  if(b.width<=0||b.height<=0||b.depth<=0)fail(`${what} has non-positive size`);
};
const within = (b,e)=>b.x>=e.x&&b.y>=e.y&&b.z>=e.z&&b.x+b.width<=e.x+e.width&&b.y+b.height<=e.y+e.height&&b.z+b.depth<=e.z+e.depth;
const inBox = (x,y,z,b)=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth;
const distinct = xs=>new Set(xs).size===xs.length;
function stable(obj){
  if(Array.isArray(obj))return obj.map(stable);
  if(obj&&typeof obj==='object')return Object.fromEntries(Object.keys(obj).sort().map(k=>[k,stable(obj[k])]));
  return obj;
}
export function serializeBlueprint(blueprint){return JSON.stringify(stable(blueprint));}
export function geometryFingerprint(blueprint){
  // Ignore biome, type, asset palette and labels: palette swaps cannot masquerade as new architecture.
  const cells=blueprint.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3).join(','))).sort();
  const nodeCoords=new Map(blueprint.navigation.nodes.map(n=>[n.id,`${n.x},${n.y},${n.z}`]));
  return JSON.stringify({envelope:blueprint.envelope,cells,
    openings:blueprint.openings.map(o=>[o.x,o.y,o.z,o.width,o.height,o.facing]).sort(),
    spaces:blueprint.spaces.map(s=>[s.kind,s.bounds.x,s.bounds.y,s.bounds.z,s.bounds.width,s.bounds.height,s.bounds.depth]).sort(),
    nodes:blueprint.navigation.nodes.map(n=>[n.x,n.y,n.z,n.width,n.headroom,n.kind]).sort(),
    edges:blueprint.navigation.edges.map(e=>[...([nodeCoords.get(e.from),nodeCoords.get(e.to)].sort()),e.kind]).sort()});
}
export function validateBlueprint(b, assetCatalog){
  if(!b||typeof b!=='object')fail('object missing');
  const expected=assertSlot(b.type,b.biome,b.size,b.variant);
  if(b.id!==expected||b.status!=='theoretical'||b.activated===true)fail('slot identity or theoretical status invalid');
  rect(b.envelope,'envelope');
  const env=b.envelope;
  if(!Array.isArray(b.modules)||!b.modules.length)fail('structural modules missing');
  const cellKeys=[], roles=new Set();
  for(const m of b.modules){
    if(!m||typeof m.id!=='string'||!m.id||typeof m.role!=='string'||!Array.isArray(m.cells)||!m.cells.length)fail('empty or invalid structural module');
    roles.add(m.role);
    for(const c of m.cells){
      if(!Array.isArray(c)||c.length!==4||!c.slice(0,3).every(isInt)||typeof c[3]!=='string')fail('physical cell must be [x,y,z,assetRef]');
      const [x,y,z,ref]=c;
      if(!inBox(x,y,z,env))fail('cell outside envelope');
      if(!Object.hasOwn(assetCatalog,ref))fail(`unknown physical asset family: ${ref}`);
      const asset=assetCatalog[ref];
      if(asset.kind!=='existing'&&asset.kind!=='candidate'&&asset.kind!=='planned')fail('invalid asset state');
      if(asset.kind!=='existing' && (asset.dimensions!==null || asset.persistentId!==null))fail('future asset dimensions/IDs must remain unresolved');
      cellKeys.push(`${x},${y},${z}`);
    }
  }
  if(!['foundation','floor','wall','roof'].every(r=>roles.has(r)))fail('foundation, floor, wall and roof modules required');
  if(!distinct(cellKeys))fail('two physical blocks occupy one voxel cell');
  if(!Array.isArray(b.clearances)||!b.clearances.length)fail('empty explicit clearance reservations');
  for(const c of b.clearances){
    rect(c,'clearance');if(!within(c,env))fail('clearance outside envelope');
    if(c.height<2||c.width<2)fail('passage clearance below two voxels');
    if(cellKeys.some(key=>{const [x,y,z]=key.split(',').map(Number);return inBox(x,y,z,c)}))fail('block obstructs declared clearance');
  }
  if(!Array.isArray(b.openings)||!b.openings.length)fail('entrance absent');
  for(const o of b.openings){
    if(!o||!['north','south','east','west'].includes(o.facing)||!isInt(o.x)||!isInt(o.y)||!isInt(o.z)||!isInt(o.width)||!isInt(o.height)||o.width<2||o.height<2)fail('entrance insufficient or invalid');
    if(!inBox(o.x,o.y,o.z,env)||!inBox(o.x+o.width-1,o.y+o.height-1,o.z,env))fail('entrance outside envelope');
    if(!b.clearances.some(c=>inBox(o.x,o.y,o.z,c)&&inBox(o.x+o.width-1,o.y+o.height-1,o.z,c)))fail('entrance not reserved as walkable clearance');
  }
  if(!Array.isArray(b.spaces)||!b.spaces.length)fail('rooms/working areas absent');
  if(!distinct(b.spaces.map(s=>s.id)))fail('duplicate room identity');
  for(const s of b.spaces){
    if(typeof s.id!=='string'||!s.id||typeof s.kind!=='string'||!s.kind)fail('invalid space identity or kind');
    rect(s.bounds,`space ${s.id}`);if(!within(s.bounds,env))fail('space outside envelope');
  }
  const nav=b.navigation;
  if(!nav||!Array.isArray(nav.nodes)||!Array.isArray(nav.edges)||!nav.nodes.length)fail('navigation graph missing');
  const ids=nav.nodes.map(n=>n.id);
  if(!distinct(ids)||!ids.includes(nav.entry))fail('navigation nodes/entry invalid');
  const byId=new Map(nav.nodes.map(n=>[n.id,n]));
  const links=new Map(ids.map(id=>[id,[]]));
  for(const n of nav.nodes){
    if(!isInt(n.x)||!isInt(n.y)||!isInt(n.z)||!isInt(n.width)||!isInt(n.headroom)||n.width<2||n.headroom<2||!inBox(n.x,n.y,n.z,env))fail('navigation clearance invalid');
    if(!b.clearances.some(c=>inBox(n.x,n.y,n.z,c)&&inBox(n.x+n.width-1,n.y+n.headroom-1,n.z,c)))fail('navigation node not in unobstructed corridor');
  }
  for(const e of nav.edges){
    if(!links.has(e.from)||!links.has(e.to)||e.from===e.to||!['level','stair'].includes(e.kind))fail('navigation edge invalid');
    const dy=Math.abs(byId.get(e.from).y-byId.get(e.to).y);
    if((e.kind==='level'&&dy!==0)||(e.kind==='stair'&&dy!==1))fail('stairs must rise one voxel per connected step');
    links.get(e.from).push(e.to);links.get(e.to).push(e.from);
  }
  const reached=new Set([nav.entry]),queue=[nav.entry];
  while(queue.length)for(const id of links.get(queue.shift()))if(!reached.has(id)){reached.add(id);queue.push(id);}
  if(reached.size!==ids.length)fail('interior or upper level unreachable');
  if(!b.openings.some(o=>nav.nodes.some(n=>n.id===nav.entry&&n.x===o.x&&n.y===o.y&&n.z===o.z)))fail('entry not aligned with entrance');
  if(!b.spaces.every(s=>byId.has(s.accessNode)&&reached.has(s.accessNode)&&inBox(byId.get(s.accessNode).x,byId.get(s.accessNode).y,byId.get(s.accessNode).z,s.bounds)))fail('room without traversable access');
  if(nav.edges.some(e=>e.kind==='stair')&&!roles.has('stair'))fail('stair navigation must have a physically authored stair module');
  if(['watchtower','gatehouse','city-wall'].includes(b.type)&&!nav.edges.some(e=>e.kind==='stair'))fail('fortifications require an actual stair route to upper walkways');
  if(b.type==='gatehouse'&&!b.spaces.some(s=>s.kind==='gateway'))fail('gatehouse needs passable gateway');
  if(b.type==='watchtower'&&!b.spaces.some(s=>s.kind==='observation'))fail('watchtower needs accessible observation');
  if(b.type==='city-wall'){
    if(!b.spaces.some(s=>s.kind==='battlement')||!b.spaces.some(s=>s.kind==='wall-run'))fail('combined city wall needs walkable battlements and wall-run');
    const path=b.fortification?.wallPath;
    if(!Array.isArray(path)||path.length<5||!path.every(p=>Array.isArray(p)&&p.length===2&&p.every(isInt)))fail('city wall requires a coordinate-authored connected perimeter');
    if(path[0].some((v,i)=>v!==path.at(-1)[i]))fail('city wall must close its whole settlement perimeter');
    if(new Set(path.map(p=>p.join(','))).size<4)fail('city wall perimeter has too few corners');
    for(let i=1;i<path.length;i++)if(Math.abs(path[i][0]-path[i-1][0])+Math.abs(path[i][1]-path[i-1][1])<1||
      (path[i][0]!==path[i-1][0]&&path[i][1]!==path[i-1][1]))fail('wall segments must form connected orthogonal segments');
  }
  if(!Array.isArray(b.features))fail('explicit industrial/fortification feature roster missing');
  for(const f of b.features){
    if(typeof f.name!=='string'||!f.name||!Array.isArray(f.position)||f.position.length!==3||!f.position.every(isInt)||!inBox(...f.position,env))fail('feature position invalid');
    if(f.assetRef!==null&&!Object.hasOwn(assetCatalog,f.assetRef))fail('feature asset must reference a named family or be unresolved');
    if(f.assetRef===null&&(!f.unresolvedDependency||typeof f.unresolvedDependency!=='string'))fail('unresolved fixture must name dependency');
  }
  return Object.freeze({id:b.id,cellCount:cellKeys.length,moduleCount:b.modules.length,spaceCount:b.spaces.length,geometryFingerprint:geometryFingerprint(b),notIntegrated:true});
}
export function validatePool(blueprints,assetCatalog){
  const slots=new Set(),fingerprints=new Set();
  for(const b of blueprints){
    const valid=validateBlueprint(b,assetCatalog);
    if(slots.has(valid.id))fail('duplicate allocated building identity');
    if(fingerprints.has(valid.geometryFingerprint))fail('repeated architectural geometry; palette/name changes do not count');
    slots.add(valid.id);fingerprints.add(valid.geometryFingerprint);
  }
  return Object.freeze({authored:slots.size,remaining:TOTAL_DESIGNS-slots.size});
}