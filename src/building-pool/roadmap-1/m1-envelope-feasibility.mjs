// Roadmap 1 ONLY: physical-candidate facade-envelope feasibility snapshot.
// Deliberately does not import, register, merge, or approve other pack assets.
// External candidate sources were inspected at their isolated PR heads.
// This establishes *cell volume* feasibility, not live weather sealing.
export const WALL_CORE = Object.freeze({
 temperate:'pack2:013',
 desert:'pack5:080',
 snow:'live:wood',
 'enchanted-forest':'pack2:013',
 mountain:'pack1:006'
});
export const WALL_SOURCE_EVIDENCE = Object.freeze({
 'pack2:013':Object.freeze({source:'pack-2/definitions.mjs',profile:'full 1x1x1 cube',candidateOnly:true}),
 'pack5:080':Object.freeze({source:'pack-5/architectural-surfaces.mjs',profile:'full collision cube fired masonry',candidateOnly:true}),
 'pack1:006':Object.freeze({source:'pack-1/core-masonry.mjs',profile:'full cube carved stone',candidateOnly:true}),
 'live:wood':Object.freeze({source:'current live voxel catalog',profile:'full cell',candidateOnly:false})
});
const key=(x,y,z)=>x+','+y+','+z;
const assert=(x,msg)=>{if(!x)throw new Error(msg)};
/**
 * Inspect all rendered outer-wall footprint cells, leaving known doors/windows
 * explicitly unresolved; a window-shaped hole does not prove weatherproofing.
 */
export function auditExteriorEnvelope(b){
 const [w,d]=[b.footprint.width,b.footprint.depth];
 const wallTop=4+['small','medium','large'].indexOf(b.size);
 const core=WALL_CORE[b.biome];assert(core,'unknown biome wall core');
 const occupied=new Map(b.placements.map(p=>[key(...p.at),p]));
 const portal=b.portals.find(p=>p.from==='outside');
 assert(portal&&portal.at[2]===1,'missing external entrance');
 const openings=new Map();let wallCells=0,windowCells=0,unresolvedDoorCells=0;
 const cells=new Set();
 for(let y=1;y<=wallTop;y++){
  for(let x=1;x<w-1;x++)for(const z of [1,d-2])cells.add(key(x,y,z));
  for(let z=2;z<d-2;z++)for(const x of [1,w-2])cells.add(key(x,y,z));
 }
 for(const value of cells){
  const [x,y,z]=value.split(',').map(Number);
  const isEntrance=x===portal.at[0]&&z===1&&(y===1||y===2);
  const p=occupied.get(value);
  if(isEntrance){assert(!p,b.id+': exterior entrance falsely blocked');openings.set(value,'open-doorway');continue;}
  assert(p,b.id+': unscheduled hole in outer wall '+value);
  if(p.role==='window'){
   windowCells++;openings.set(value,'window-candidate');
   assert(p.asset.startsWith('pack4:'),b.id+': not a symbolic window family');
  }else if(p.role==='door'){
   unresolvedDoorCells++;openings.set(value,'stowed-door-leaf');
   assert(p.asset==='pack2:020'&&p.doorState==='open-stowed',b.id+': invalid door shell placeholder');
  }else{
   assert(p.role==='wall',b.id+': nonstructural facade element in outer-wall cell '+value);
   assert(p.asset===core,b.id+': partial/false structural wall core '+p.asset+' at '+value);
   wallCells++;
  }
 }
 const actualWalls=b.placements.filter(p=>p.role==='wall');
 assert(actualWalls.length===wallCells,b.id+': role wall outside documented facade shell');
 assert(wallCells>40&&windowCells>=3&&unresolvedDoorCells>=1,b.id+': incomplete authored external shell');
 return Object.freeze({id:b.id,core,solidCandidateWallCells:wallCells,windowCells,unresolvedDoorCells,openEntranceCells:2,candidateOnly:WALL_SOURCE_EVIDENCE[core].candidateOnly,weatherSealApproved:false,windowSealApproved:false,doorSweepApproved:false});
}
