// Builder 4B M0: isolated theoretical building contract. No world, save or engine writes.
// Original Roadmap 4 category IDs are deliberately preserved; none are inherited from PR #123.
export const SCHEMA = 'mythwrought.building-pool.roadmap-4b.v1';
export const BIOMES = Object.freeze(['temperate','desert','snow','enchanted-forest','mountain']);
export const SIZES = Object.freeze(['small','medium','large']);
export const PROGRAM = Object.freeze([
  {type:'healers-house', perCombination:5, milestone:2, rooms:['treatment','recovery']},
  {type:'library', perCombination:4, milestone:2, rooms:['reading-room','collections']},
  {type:'schoolhouse', perCombination:4, milestone:3, rooms:['classroom','shared-study']},
  {type:'magical-research-institute', perCombination:3, milestone:3, rooms:['research-hall','secure-repository']},
  {type:'arcane-academy', perCombination:3, milestone:4, rooms:['lecture-hall','study-chamber']}
].map(p=>Object.freeze({...p, rooms:Object.freeze(p.rooms)})));
export const PLANNED_TOTAL = PROGRAM.reduce((s,p)=>s+p.perCombination*15,0);
const ROLES = new Set(['foundation','floor','wall','partition','roof','column','beam','stair','landing','railing','window','fixture','trim','parapet']);
const FACING = new Set(['north','east','south','west']);
const WALK_SUPPORT = new Set(['floor','foundation','stair','landing']);
const LIVE = new Set(['live:grass','live:dirt','live:stone','live:wood','live:crystal','live:ore','live:leaves','live:deepstone']);
const LIMIT_CELLS = 250000, LIMIT_NAV = 60000;
const fail = s=>{throw new Error('Builder 4B: '+s);};
const integer = Number.isSafeInteger;
const key = a=>a.join(',');
const compare = (a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b));
const ranges = Object.freeze({pack1:[[1,12],[47,55]],pack2:[[13,22],[39,46]],pack3:[[23,29],[69,78]],pack4:[[30,38],[56,68]],pack5:[[79,96]],biome130:[[1,130]]});
function pos(p,b,label) {
  if(!Array.isArray(p)||p.length!==3||!p.every(integer)||p.some((n,i)=>n<0||n>=b[i]))fail(label+' outside integer bounds');
}
function symbolic(ref) {
  const m=/^(pack[1-5]|biome130):([0-9]{3})$/.exec(ref);
  return !!m && ranges[m[1]].some(([lo,hi])=>+m[2]>=lo&&+m[2]<=hi);
}
export function expectedIds(){
  const out=[];
  for(const p of PROGRAM)for(const biome of BIOMES)for(const size of SIZES)
    for(let i=1;i<=p.perCombination;i++)
      out.push('r4:'+p.type+':'+biome+':'+size+':'+String(i).padStart(2,'0'));
  return Object.freeze(out);
}
export function validateBlueprint(b) {
  if(!b||Array.isArray(b)||typeof b!=='object'||b.schema!==SCHEMA)fail('schema mismatch');
  const p=PROGRAM.find(x=>x.type===b.type);
  if(!p||!BIOMES.includes(b.biome)||!SIZES.includes(b.size)||!integer(b.variant)||b.variant<1||b.variant>p.perCombination)fail('invalid allocated slot');
  const id='r4:'+b.type+':'+b.biome+':'+b.size+':'+String(b.variant).padStart(2,'0');
  if(b.id!==id)fail('unstable original-category ID');
  const dim=b.bounds;
  if(!Array.isArray(dim)||dim.length!==3||!dim.every(integer)||dim.some((v,i)=>v<3||v>(i===1?96:256)))fail('invalid theoretical bounds');
  if(b.worldPlaced!==false||b.creatorApproved!==false||b.integrated!==false)fail('candidate must not claim acceptance or deployment');
  if(!Array.isArray(b.dependencies))fail('missing dependency ledger');
  const deps=new Map();
  for(const d of b.dependencies){
    if(!d||typeof d.ref!=='string'||!symbolic(d.ref)||deps.has(d.ref)||Object.hasOwn(d,'numericId'))fail('invalid, duplicated or numeric symbolic dependency');
    if(d.source!==(d.ref.startsWith('biome130:')?'biome130':'manual-five-pack')||!['catalog-provisional','unregistered-symbolic'].includes(d.status)||
       !['single-cell','partial','multi-cell','unknown'].includes(d.shape)||!['fixed','rotatable','unknown'].includes(d.orientation)||
       !Array.isArray(d.unresolved)||!d.unresolved.length||d.unresolved.some(s=>typeof s!=='string'||!s.trim()))
      fail('missing source/shape/orientation/unresolved dependency contract');
    deps.set(d.ref,d);
  }
  if(!Array.isArray(b.cells)||b.cells.length===0||b.cells.length>LIMIT_CELLS)fail('missing/oversized physical coordinate cells');
  const occupied=new Map(), used=new Set(), roles=new Set();
  for(const c of b.cells){
    if(!c||!Array.isArray(c.at)||!ROLES.has(c.role)||!FACING.has(c.facing)||typeof c.asset!=='string')fail('invalid coordinate cell');
    pos(c.at,dim,'cell');
    if(!LIVE.has(c.asset)&&!deps.has(c.asset))fail('cell asset missing from verified base or typed ledger: '+c.asset);
    const at=key(c.at);
    if(occupied.has(at))fail('two physical cells overlap: '+at);
    occupied.set(at,c);used.add(c.asset);roles.add(c.role);
    if(c.reservations!==undefined){
      if(!Array.isArray(c.reservations)||!c.reservations.length||LIVE.has(c.asset))fail('invalid multicell reservations');
      for(const r of c.reservations){pos(r,dim,'reserved cell');const rk=key(r);if(rk===at||occupied.has(rk))fail('reservation overlaps occupied cell');}
    }
  }
  const reserved=new Set();
  for(const c of b.cells)for(const r of c.reservations||[]){
    const rk=key(r);
    if(reserved.has(rk)||occupied.has(rk))fail('multicell reservation collision');
    reserved.add(rk);
  }
  for(const d of deps.values())if(!used.has(d.ref))fail('unused dependency '+d.ref);
  for(const r of ['foundation','floor','wall','roof'])if(!roles.has(r))fail('missing architectural '+r);
  if(!Array.isArray(b.openings)||!b.openings.some(o=>o.kind==='entrance'))fail('entrance opening missing');
  const entrances=new Set();
  for(const o of b.openings){
    if(!o||!['entrance','door','window'].includes(o.kind)||!FACING.has(o.facing))fail('invalid opening');
    pos(o.at,dim,'opening');
    if(o.kind==='window')continue;
    if(o.at[1]+1>=dim[1]||occupied.has(key(o.at))||occupied.has(key([o.at[0],o.at[1]+1,o.at[2]]))||
       reserved.has(key(o.at))||reserved.has(key([o.at[0],o.at[1]+1,o.at[2]])))fail('doorway blocked at feet or head');
    if(o.kind==='entrance')entrances.add(key(o.at));
  }
  if(!Array.isArray(b.navigation)||!b.navigation.length||b.navigation.length>LIMIT_NAV)fail('no bounded walkable coordinate path');
  const nav=new Map();
  for(const n of b.navigation){
    if(!n||!['walk','stair','landing'].includes(n.mode))fail('navigation mode invalid');
    pos(n.at,dim,'walk path');
    const k=key(n.at);
    if(nav.has(k)||n.at[1]===0||n.at[1]+1>=dim[1]||occupied.has(k)||reserved.has(k)||
       occupied.has(key([n.at[0],n.at[1]+1,n.at[2]]))||reserved.has(key([n.at[0],n.at[1]+1,n.at[2]])))fail('walk path blocked or lacks headroom');
    const support=occupied.get(key([n.at[0],n.at[1]-1,n.at[2]]));
    if(!support||!WALK_SUPPORT.has(support.role)||(n.mode==='stair'&&support.role!=='stair'))fail('walk surface unsupported');
    nav.set(k,n);
  }
  for(const e of entrances)if(!nav.has(e))fail('entrance not on circulation path');
  for(const o of b.openings)if(o.kind==='door'&&!nav.has(key(o.at)))fail('interior doorway missing route');
  if(!Array.isArray(b.spaces)||!b.spaces.length)fail('missing room footprints');
  const kinds=new Set(), ids=new Set(), floorPositions=new Set(), levels=new Set();
  for(const room of b.spaces){
    if(!room||typeof room.id!=='string'||!room.id||ids.has(room.id)||typeof room.kind!=='string'||
       !integer(room.level)||room.level<1||room.level>=dim[1]-1)fail('invalid room identity/level');
    ids.add(room.id);kinds.add(room.kind);levels.add(room.level);
    pos(room.access,dim,'room access');
    if(room.access[1]!==room.level||!nav.has(key(room.access)))fail('room missing explicit walkable access');
    if(!Array.isArray(room.footprint)||!room.footprint.length)fail('room has no authored footprint');
    let contains=false;
    for(const tile of room.footprint){
      if(!Array.isArray(tile)||tile.length!==2||!tile.every(integer)||tile[0]<0||tile[0]>=dim[0]||tile[1]<0||tile[1]>=dim[2])fail('room tile invalid');
      const rk=room.level+':'+key(tile);
      if(floorPositions.has(rk))fail('overlapping room floor allocations');
      floorPositions.add(rk);
      if(tile[0]===room.access[0]&&tile[1]===room.access[2])contains=true;
      const below=occupied.get(key([tile[0],room.level-1,tile[1]]));
      if(!below||!WALK_SUPPORT.has(below.role)||occupied.has(key([tile[0],room.level,tile[1]]))||
         occupied.has(key([tile[0],room.level+1,tile[1]])))fail('room tile unsupported or occupied');
    }
    if(!contains)fail('room access outside room footprint');
  }
  for(const kind of p.rooms)if(!kinds.has(kind))fail('required functional room missing: '+kind);
  const visited=new Set(entrances), todo=[...entrances];
  while(todo.length){
    const n=nav.get(todo.pop());
    if(!n)continue;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [-1,0,1]){
      const at=[n.at[0]+dx,n.at[1]+dy,n.at[2]+dz], k=key(at),next=nav.get(k);
      if(!next||visited.has(k)||(dy!==0&&n.mode!=='stair'&&next.mode!=='stair'))continue;
      visited.add(k);todo.push(k);
    }
  }
  if(visited.size!==nav.size||b.spaces.some(room=>!visited.has(key(room.access))))fail('unreachable room or circulation segment');
  if(levels.size>1&&(!roles.has('stair')||!b.navigation.some(n=>n.mode==='stair')))fail('upper floors lack stair circulation');
  return Object.freeze({id,physicalCells:occupied.size,walkableCells:nav.size,rooms:b.spaces.length,unresolvedAssets:deps.size,theoreticalOnly:true});
}
// Invariant under translation, 90-degree rotation, reflection and material recoloring.
export function geometrySignature(b){
  validateBlueprint(b);
  const forms=[];
  for(const mirror of [false,true])for(let t=0;t<4;t++){
    const turn=([x,z])=>{const a=mirror?-x:x;return t===0?[a,z]:t===1?[-z,a]:t===2?[-a,-z]:[z,-a];};
    const rows=[
      ...b.cells.map(c=>[...turn([c.at[0],c.at[2]]),c.at[1],'cell',c.role]),
      ...b.navigation.map(n=>[...turn([n.at[0],n.at[2]]),n.at[1],'nav',n.mode]),
      ...b.openings.map(o=>[...turn([o.at[0],o.at[2]]),o.at[1],'opening',o.kind]),
      ...b.spaces.flatMap(s=>s.footprint.map(tile=>[...turn(tile),s.level,'room',s.kind]))
    ];
    let x0=Infinity, z0=Infinity;
    for(const row of rows){if(row[0]<x0)x0=row[0];if(row[1]<z0)z0=row[1];}
    forms.push(JSON.stringify(rows.map(([x,z,...rest])=>[x-x0,z-z0,...rest]).sort(compare)));
  }
  return forms.sort()[0];
}
export function validateCollection(items,{requireComplete=false}={}){
  if(!Array.isArray(items))fail('collection must be array');
  const ids=new Set(),shapes=new Set();
  for(const item of items){
    const {id}=validateBlueprint(item),shape=geometrySignature(item);
    if(ids.has(id))fail('duplicate blueprint ID: '+id);
    if(shapes.has(shape))fail('duplicate architecture after mirror/turn/recolor');
    ids.add(id);shapes.add(shape);
  }
  if(requireComplete){
    if(ids.size!==PLANNED_TOTAL)fail('not all 285 designs authored');
    for(const id of expectedIds())if(!ids.has(id))fail('missing quota slot: '+id);
  }
  return Object.freeze({authored:ids.size,remaining:PLANNED_TOTAL-ids.size,creatorApproved:0,integrated:0});
}
