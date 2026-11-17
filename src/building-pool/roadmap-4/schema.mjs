// Mythwrought Roadmap 4 — isolated, theoretical blueprint contract.
// No world writes, imported game runtime modules, persistent IDs or integration hooks.
export const SCHEMA='mythwrought.building-pool.roadmap-4.v1';
export const BIOMES=Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES=Object.freeze(['small','medium','large']);
export const PROGRAM=Object.freeze([
  {type:'civic-hall',perSizeBiome:5,milestone:2,spaces:['meeting','administration']},
  {type:'guildhall',perSizeBiome:4,milestone:2,spaces:['gathering-hall','shared-facility']},
  {type:'embassy',perSizeBiome:3,milestone:2,spaces:['formal-chamber','guest-area']},
  {type:'castle-palace',perSizeBiome:3,milestone:2,spaces:['entrance-hall','grand-chamber','tower-or-wing']},
  {type:'healers-house',perSizeBiome:5,milestone:3,spaces:['treatment','recovery']},
  {type:'library',perSizeBiome:4,milestone:3,spaces:['reading-room','collections']},
  {type:'schoolhouse',perSizeBiome:4,milestone:3,spaces:['classroom','shared-study']},
  {type:'magical-research-institute',perSizeBiome:3,milestone:4,spaces:['research-hall','secure-repository']},
  {type:'arcane-academy',perSizeBiome:3,milestone:4,spaces:['lecture-hall','study-chamber']},
  {type:'observatory',perSizeBiome:3,milestone:4,spaces:['observation-deck','instrument-room']},
  {type:'grand-archive',perSizeBiome:3,milestone:4,spaces:['records-vault','consultation-room']}
].map(x=>Object.freeze({...x,spaces:Object.freeze(x.spaces)})));
export const REGISTERED=Object.freeze({
  'base:grass':1,'base:dirt':2,'base:stone':3,'base:wood':4,
  'base:crystal':5,'base:ore':6,'base:leaves':7,'base:deepstone':8
});
const ROLE=new Set(['foundation','floor','wall','partition','roof','column','beam','stair','landing','railing','window','fixture','trim','parapet']);
const FACING=new Set(['north','east','south','west']);
const PATH_LIMIT=60000, CELL_LIMIT=250000;
const fail=m=>{throw new Error('Roadmap 4 blueprint: '+m);};
const integer=(n)=>Number.isSafeInteger(n);
const key=p=>p.join(',');
const position=(p,bounds,label)=>{
  if(!Array.isArray(p)||p.length!==3||!p.every(integer)||p.some((n,i)=>n<0||n>=bounds[i]))fail(label+' has invalid coordinates');
};
const side=(p,bounds,label)=>{
  if(!Array.isArray(p)||p.length!==2||!p.every(integer)||p[0]<0||p[0]>=bounds[0]||p[1]<0||p[1]>=bounds[2])fail(label+' has invalid floor footprint');
};
const rowsEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const compare=(a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b));
export function expectedIds(){
  const ids=[];
  for(const p of PROGRAM)for(const biome of BIOMES)for(const size of SIZES)
    for(let v=1;v<=p.perSizeBiome;v++)
      ids.push('r4:'+p.type+':'+biome+':'+size+':'+String(v).padStart(2,'0'));
  return ids;
}
export const PLANNED_TOTAL=PROGRAM.reduce((n,p)=>n+p.perSizeBiome*BIOMES.length*SIZES.length,0);
export function validateBlueprint(b){
  if(!b||typeof b!=='object'||Array.isArray(b)||b.schema!==SCHEMA)fail('schema version mismatch');
  const p=PROGRAM.find(x=>x.type===b.type);
  if(!p||!BIOMES.includes(b.biome)||!SIZES.includes(b.size)||!integer(b.variant)||b.variant<1||b.variant>p.perSizeBiome)fail('invalid type, biome, size or variant');
  const id='r4:'+b.type+':'+b.biome+':'+b.size+':'+String(b.variant).padStart(2,'0');
  if(b.id!==id)fail('unstable blueprint identity');
  const bounds=b.bounds;
  if(!Array.isArray(bounds)||bounds.length!==3||!bounds.every(integer)||bounds.some((n,i)=>n<3||n>(i===1?96:256)))fail('invalid theoretical dimensions');
  if(!Array.isArray(b.dependencies))fail('dependency manifest missing');
  const dependencies=new Map();
  for(const d of b.dependencies){
    if(!d||typeof d.ref!=='string'||dependencies.has(d.ref)||d.ref in REGISTERED)fail('duplicate or registered dependency');
    const match=/^(pack([1-5]):(\d{3})|biome130:(\d{3}))$/.exec(d.ref);
    if(!match)fail('non-catalog symbolic reference '+d.ref);
    const index=Number(match[3]||match[4]);
    const allowed=match[2]==='1' ? (index>=1&&index<=12)||(index>=47&&index<=55) :
      match[2]==='2' ? (index>=13&&index<=22)||(index>=39&&index<=46) :
      match[2]==='3' ? (index>=23&&index<=29)||(index>=69&&index<=78) :
      match[2]==='4' ? (index>=30&&index<=38)||(index>=56&&index<=68) :
      match[2]==='5' ? index>=79&&index<=96 : index>=1&&index<=130;
    if(!allowed||!['planned','candidate'].includes(d.state)||!['single-cell','partial','multi-cell'].includes(d.intendedShape)||
      !['fixed','rotatable'].includes(d.orientation)||!['none','floor','wall','ceiling','adjacent'].includes(d.attachment)||
      !Array.isArray(d.unresolved)||d.unresolved.length===0||d.unresolved.some(x=>typeof x!=='string'||!x.trim())||
      Object.hasOwn(d,'numericId'))fail('incomplete, falsely resolved or misowned symbolic dependency '+d.ref);
    dependencies.set(d.ref,d);
  }
  if(!Array.isArray(b.cells)||!b.cells.length||b.cells.length>CELL_LIMIT)fail('missing or oversized structural cells');
  const occupied=new Map(),roles=new Set(),used=new Set();
  for(const c of b.cells){
    if(!c||typeof c!=='object')fail('invalid structural cell');
    position(c.at,bounds,'structural cell');
    if(!ROLE.has(c.role)||!FACING.has(c.facing))fail('cell lacks role or orientation');
    if(!(c.asset in REGISTERED)&&!dependencies.has(c.asset))fail('unresolved cell asset '+c.asset);
    if(c.asset in REGISTERED&&c.role==='stair')fail('full-cube registered block cannot masquerade as a stair');
    const k=key(c.at);
    if(occupied.has(k))fail('overlapping occupied cells at '+k);
    occupied.set(k,c); roles.add(c.role); used.add(c.asset);
  }
  for(const d of dependencies.values())if(!used.has(d.ref))fail('orphan dependency '+d.ref);
  for(const role of ['floor','wall','roof'])if(!roles.has(role))fail('missing complete architectural role '+role);
  if(!Array.isArray(b.openings)||!b.openings.some(x=>x.kind==='entrance'))fail('at least one authored entrance opening required');
  const entries=new Set();
  for(const o of b.openings){
    if(!o||!['entrance','door','window'].includes(o.kind)||!FACING.has(o.facing))fail('invalid opening');
    position(o.at,bounds,'opening');
    if(o.kind==='window'&&occupied.has(key(o.at))&&occupied.get(key(o.at)).role!=='window')fail('window position occupied by non-window masonry');
    if(o.kind!=='window'&&occupied.has(key(o.at)))fail('doorway occupied by a solid cell');
    if(o.kind!=='window'&&(o.at[1]+1>=bounds[1]||occupied.has(key([o.at[0],o.at[1]+1,o.at[2]]))))fail('two-cell doorway has blocked headroom');
    if(o.kind==='entrance')entries.add(key(o.at));
  }
  if(!Array.isArray(b.navigation)||!b.navigation.length||b.navigation.length>PATH_LIMIT)fail('missing or oversized walkable route');
  const nav=new Map();
  for(const n of b.navigation){
    if(!n||!['walk','landing','stair'].includes(n.mode))fail('invalid navigation mode');
    position(n.at,bounds,'navigation');
    const k=key(n.at);
    if(nav.has(k)||occupied.has(k)||n.at[1]+1>=bounds[1]||occupied.has(key([n.at[0],n.at[1]+1,n.at[2]])))fail('blocked, duplicated or headless navigation cell');
    if(n.at[1]===0||!occupied.has(key([n.at[0],n.at[1]-1,n.at[2]])))fail('navigation lacks authored support');
    const below=occupied.get(key([n.at[0],n.at[1]-1,n.at[2]]));
    if(!['floor','landing','stair','foundation'].includes(below.role))fail('navigation support is not a walking surface');
    if(n.mode==='stair'&&below.role!=='stair')fail('stair path has no authored stair-tread support');
    nav.set(k,n);
  }
  for(const e of entries)if(!nav.has(e))fail('entrance missing from authored navigation');
  for(const o of b.openings)if(o.kind==='door'&&!nav.has(key(o.at)))fail('interior doorway disconnected from walkable route');
  if(!Array.isArray(b.spaces)||!b.spaces.length)fail('interior room inventory missing');
  const kinds=new Set(),roomIds=new Set(),roomFootprints=new Set(),levels=new Set();
  for(const s of b.spaces){
    if(!s||typeof s.id!=='string'||!s.id||roomIds.has(s.id)||typeof s.kind!=='string'||!integer(s.level)||s.level<1||s.level>=bounds[1]-1)fail('invalid or duplicated room');
    roomIds.add(s.id); kinds.add(s.kind); levels.add(s.level);
    position(s.access,bounds,'room access');
    if(s.access[1]!==s.level||!nav.has(key(s.access)))fail('room has no authored navigable access');
    if(!Array.isArray(s.footprint)||!s.footprint.length)fail('room needs an explicit floor plan');
    let containsAccess=false;
    for(const tile of s.footprint){
      side(tile,bounds,'room footprint');
      const rk=s.level+':'+tile.join(',');
      if(roomFootprints.has(rk))fail('overlapping interior room footprints');
      roomFootprints.add(rk);
      if(tile[0]===s.access[0]&&tile[1]===s.access[2])containsAccess=true;
      const support=occupied.get(key([tile[0],s.level-1,tile[1]]));
      if(!support||!['floor','landing','stair','foundation'].includes(support.role))fail('room footprint missing floor support');
      if(occupied.has(key([tile[0],s.level,tile[1]]))||
         occupied.has(key([tile[0],s.level+1,tile[1]])))fail('room footprint blocked at feet or head');
    }
    if(!containsAccess)fail('room access outside its footprint');
  }
  for(const kind of p.spaces)if(!kinds.has(kind))fail('required '+b.type+' interior missing: '+kind);
  // Constant-neighbor flood fill: large archives cannot afford O(pathCells squared).
  const pending=[...entries],visited=new Set(entries);
  while(pending.length){
    const here=nav.get(pending.pop());
    if(!here)continue;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [-1,0,1]){
      const point=[here.at[0]+dx,here.at[1]+dy,here.at[2]+dz],k=key(point);
      const n=nav.get(k);
      if(!n||visited.has(k)||dy!==0&&here.mode!=='stair'&&n.mode!=='stair')continue;
      visited.add(k);pending.push(k);
    }
  }
  if(visited.size!==nav.size)fail('unreachable walkable route');
  for(const s of b.spaces)if(!visited.has(key(s.access)))fail('unreachable room access');
  if(levels.size>1&&(!roles.has('stair')||!b.navigation.some(n=>n.mode==='stair')))fail('multi-level design has no stair circulation');
  return Object.freeze({id,occupiedCells:occupied.size,walkableCells:nav.size,rooms:b.spaces.length,
    unresolvedAssets:dependencies.size,levels:levels.size,theoreticalOnly:true});
}
const ordered=x=>{
  if(Array.isArray(x))return x.map(ordered);
  if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,ordered(x[k])]));
  return x;
};
export function serializeBlueprint(b){
  validateBlueprint(b);
  const copy={...b,
    cells:[...b.cells].sort((a,z)=>compare([a.at,a.role,a.asset,a.facing],[z.at,z.role,z.asset,z.facing])),
    openings:[...b.openings].sort(compare),navigation:[...b.navigation].sort(compare),
    spaces:[...b.spaces].map(s=>({...s,footprint:[...s.footprint].sort(compare)})).sort((a,z)=>a.id.localeCompare(z.id)),
    dependencies:[...b.dependencies].sort((a,z)=>a.ref.localeCompare(z.ref))};
  return JSON.stringify(ordered(copy));
}
// Structural equivalence ignores material swaps, category labels and 90-degree rotation.
// It detects recolors/rotations masquerading as distinct authored geometry.
export function geometrySignature(b){
  validateBlueprint(b);
  const signatures=[];
  for(let turn=0;turn<4;turn++){
    const rot=([x,z])=>turn===0?[x,z]:turn===1?[-z,x]:turn===2?[-x,-z]:[z,-x];
    const entries=[
      ...b.cells.map(c=>[...rot([c.at[0],c.at[2]]),c.at[1],'cell',c.role]),
      ...b.navigation.map(n=>[...rot([n.at[0],n.at[2]]),n.at[1],'nav',n.mode]),
      ...b.openings.map(o=>[...rot([o.at[0],o.at[2]]),o.at[1],'opening',o.kind]),
      ...b.spaces.flatMap(s=>s.footprint.map(f=>[...rot(f),s.level,'room',s.kind]))
    ];
    let minX=Infinity,minZ=Infinity;
    for(const entry of entries){minX=Math.min(minX,entry[0]);minZ=Math.min(minZ,entry[1]);}
    signatures.push(JSON.stringify(entries.map(([x,z,...rest])=>[x-minX,z-minZ,...rest]).sort(compare)));
  }
  return signatures.sort()[0];
}
export function validateCollection(items,{requireComplete=false}={}){
  if(!Array.isArray(items))fail('expected an array of blueprints');
  const ids=new Set(),geometries=new Set();
  for(const b of items){
    const {id}=validateBlueprint(b);
    if(ids.has(id))fail('duplicate ID '+id);
    ids.add(id);
    const geom=geometrySignature(b);
    if(geometries.has(geom))fail('repeated structure with material/rotation-only change');
    geometries.add(geom);
  }
  if(requireComplete&&(ids.size!==PLANNED_TOTAL||expectedIds().some(id=>!ids.has(id))))fail('600-design catalog incomplete');
  return Object.freeze({verified:ids.size,expected:PLANNED_TOTAL,complete:ids.size===PLANNED_TOTAL});
}
