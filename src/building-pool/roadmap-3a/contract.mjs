// Strict theoretical-blueprint boundary. M0 ships no blueprint generator.
import {assertSlot,slotId} from './roster.mjs';
const fail=(s)=>{throw Error('Builder 3A invalid candidate: '+s);};
const integer=Number.isSafeInteger;
function box(b){
  return b&&['x','y','z','width','height','depth'].every(k=>integer(b[k]))&&
    b.width>0&&b.height>0&&b.depth>0;
}
function inside(x,y,z,e){
  return x>=e.x&&y>=e.y&&z>=e.z&&x<e.x+e.width&&y<e.y+e.height&&z<e.z+e.depth;
}
function refOk(ref){return typeof ref==='string'&&
  (/^pack[1-5]:\d{3}$/.test(ref)||/^biome130:\d{3}$/.test(ref)||/^live:[a-z][a-z0-9-]*$/.test(ref));}
export function validateBlueprint(b){
  if(!b||typeof b!=='object')fail('missing blueprint');
  assertSlot(b.type,b.biome,b.size,b.variant);
  if(b.id!==slotId(b.type,b.biome,b.size,b.variant))fail('identity mismatch');
  if(b.status!=='theoretical'||b.activated!==false||b.worldPlaced===true)fail('must remain theoretical');
  if(!box(b.envelope))fail('invalid envelope');
  const e=b.envelope;
  if(!Array.isArray(b.modules)||!b.modules.length)fail('coordinate-authored modules required');
  const occupied=new Set(),roles=new Set(),moduleIds=new Set();
  for(const m of b.modules){
    if(!m||typeof m.id!=='string'||!m.id||moduleIds.has(m.id)||
       typeof m.role!=='string'||!Array.isArray(m.cells)||!m.cells.length)fail('module');
    moduleIds.add(m.id);roles.add(m.role);
    for(const c of m.cells){
      if(!Array.isArray(c)||c.length<4||c.length>5||
         !c.slice(0,3).every(integer)||!refOk(c[3])||!inside(c[0],c[1],c[2],e))fail('voxel coordinate or symbolic family');
      if(c.length===5&&(!c[4]||typeof c[4]!=='object'||!['north','east','south','west'].includes(c[4].orientation)))fail('orientation metadata');
      const key=c.slice(0,3).join(',');
      if(occupied.has(key))fail('occupied-cell overlap');
      occupied.add(key);
    }
  }
  if(!['foundation','floor','wall','roof'].every(r=>roles.has(r)))fail('structural system incomplete');
  if(!Array.isArray(b.openings)||!b.openings.some(o=>o&&o.kind==='entrance'&&Number.isSafeInteger(o.x)&&Number.isSafeInteger(o.y)&&Number.isSafeInteger(o.z)&&inside(o.x,o.y,o.z,e)))fail('real entrance required');
  if(!Array.isArray(b.spaces)||!b.spaces.length||
     b.spaces.some(s=>!s||!s.id||!s.kind||!box(s.bounds)))fail('named usable rooms required');
  const nav=b.navigation;
  if(!nav||!Array.isArray(nav.nodes)||!Array.isArray(nav.edges)||nav.nodes.length<2)fail('circulation required');
  const ids=new Set(nav.nodes.map(n=>n.id));
  if(!nav.entry||ids.size!==nav.nodes.length||!ids.has(nav.entry))fail('navigation identity');
  const edges=new Map([...ids].map(id=>[id,new Set()]));
  for(const n of nav.nodes)if(!n||!integer(n.x)||!integer(n.y)||!integer(n.z)||
     !inside(n.x,n.y,n.z,e)||!integer(n.width)||n.width<2||!integer(n.headroom)||n.headroom<2)fail('clearance node');
  for(const link of nav.edges){
    if(!edges.has(link.from)||!edges.has(link.to)||link.from===link.to||!['level','stair'].includes(link.kind))fail('navigation link');
    edges.get(link.from).add(link.to);edges.get(link.to).add(link.from);
  }
  const visited=new Set([nav.entry]),queue=[nav.entry];
  for(let i=0;i<queue.length;i++)for(const dest of edges.get(queue[i]))if(!visited.has(dest)){visited.add(dest);queue.push(dest);}
  if(visited.size!==ids.size||b.spaces.some(s=>!visited.has(s.accessNode)))fail('unreachable room');
  if(!Array.isArray(b.dependencies))fail('dependency handoff missing');
  if(b.numericPersistentIds||b.productionRegistered===true)fail('no invented persistent IDs or runtime registration');
  return Object.freeze({id:b.id,coordinateCells:occupied.size,rooms:b.spaces.length,live:false});
}
export function validateAuthoredPool(blueprints){
  if(!Array.isArray(blueprints))fail('blueprint array required');
  const ids=new Set(),results=[];
  for(const b of blueprints){
    const v=validateBlueprint(b);
    if(ids.has(v.id))fail('duplicate blueprint identity');
    ids.add(v.id);results.push(v);
  }
  return Object.freeze({authored:results.length,ids:Object.freeze([...ids].sort())});
}
