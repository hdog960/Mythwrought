import {CATEGORIES,BIOMES,SIZES,plannedSlots} from "./catalog.mjs";
export const SCHEMA="mythwrought.building-pool.roadmap-2.v1";
export const ALLOWED_NAMESPACE=/^(pack[1-5]:\d{3}|biome130:\d{3})$/;
const BANDS={pack1:[[1,12],[47,55]],pack2:[[13,22],[39,46]],pack3:[[23,29],[69,78]],pack4:[[30,38],[56,68]],pack5:[[79,96]],biome130:[[1,130]]};
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
export function validateSymbol(ref){
 if(!ALLOWED_NAMESPACE.test(ref))return false;
 const [pack,id]=ref.split(":");
 return BANDS[pack].some(([a,b])=>+id>=a&&+id<=b);
}
export function validateBlueprint(bp){
 check(bp&&bp.schema===SCHEMA,"schema");
 check(plannedSlots().some(s=>s.id===bp.id),"unreserved blueprint identity");
 check(CATEGORIES.some(c=>c.key===bp.category)&&BIOMES.includes(bp.biome)&&SIZES.includes(bp.size),"category, size or biome");
 check(bp.id.startsWith("r2:"+bp.category+":"+bp.biome+":"+bp.size+":"),"identity mismatch");
 check(bp.status==="authored-candidate"&&bp.isolated===true&&bp.worldPlaced===false&&bp.numericIdsAssigned===false,"unsafe integration state");
 check(["x","y","z"].every(k=>Number.isInteger(bp.extents?.[k])&&bp.extents[k]>=4),"invalid bounds");
 check(Array.isArray(bp.voxels)&&bp.voxels.length>=50,"missing actual geometry");
 check(Array.isArray(bp.rooms)&&bp.rooms.length>=2,"missing rooms");
 check(Array.isArray(bp.openings)&&bp.openings.some(o=>o.type==="entrance")&&bp.openings.some(o=>o.type==="window"),"missing entrance/windows");
 check(Array.isArray(bp.circulation)&&bp.circulation.length>0,"missing circulation");
 check(Array.isArray(bp.unresolvedDependencies)&&bp.unresolvedDependencies.length>0&&bp.unresolvedDependencies.every(d=>validateSymbol(d.ref)&&d.issue),"unresolved asset ABI must be explicit");
 const occupied=new Set(),kinds=new Set();
 for(const v of bp.voxels){
   check(["x","y","z"].every(k=>Number.isInteger(v[k])&&v[k]>=0&&v[k]<bp.extents[k]),"out of bounds");
   check(validateSymbol(v.material),"unknown symbolic roster material");
   const coord=[v.x,v.y,v.z].join(",");
   check(!occupied.has(coord),"overlapping voxel");
   occupied.add(coord);kinds.add(v.kind);
 }
 for(const kind of ["foundation","floor","wall","roof","fixture","decor"])check(kinds.has(kind),"missing architectural element: "+kind);
 const category=CATEGORIES.find(c=>c.key===bp.category);
 for(const name of category.requirements)check(bp.rooms.some(r=>r.uses?.includes(name))||bp.features?.includes(name),"missing functional space: "+name);
 // Circulation is category-dependent: temples, theaters and public squares do not
 // require a shop stockroom. All named rooms must connect from the exterior.
 const roomUses=new Set(bp.rooms.flatMap(room=>room.uses||[]));
 check(bp.rooms.every(room=>Array.isArray(room.uses)&&room.uses.length>0),"room must declare uses");
 const graph=new Map();
 for(const edge of bp.circulation){
   check(typeof edge.from==="string"&&typeof edge.to==="string"&&typeof edge.via==="string"&&edge.via.length>0,"incomplete circulation edge");
   check(edge.from==="exterior"||roomUses.has(edge.from),"circulation origin not a room use");
   check(roomUses.has(edge.to),"circulation destination not a room use");
   if(!graph.has(edge.from))graph.set(edge.from,new Set());
   graph.get(edge.from).add(edge.to);
 }
 const reached=new Set(["exterior"]),queue=["exterior"];
 while(queue.length){
   const at=queue.shift();
   for(const next of graph.get(at)||[])if(!reached.has(next)){reached.add(next);queue.push(next);}
 }
 check(bp.rooms.every(room=>room.uses.some(use=>reached.has(use))),"inaccessible room in circulation graph");
 for(const o of bp.openings){
   check(["x","y","z"].every(k=>Number.isInteger(o[k])&&o[k]>=0&&o[k]<bp.extents[k]),"opening out of bounds");
   if(o.type==="entrance"){
     const height=o.clearHeightCells??1;
     check(Number.isInteger(height)&&height>=1&&o.y+height<=bp.extents.y,"invalid entrance clearance");
     for(let dy=0;dy<height;dy++)check(!occupied.has([o.x,o.y+dy,o.z].join(",")),"blocked entrance");
   }
 }
 check(kinds.has("window"),"missing physical window geometry");
 return {valid:true,voxels:bp.voxels.length,uniqueCells:occupied.size,rooms:bp.rooms.length};
}
// Rotate and reflect an architecture; ignore materials, names, metadata and translations.
// This detects exact recolors, rotations and mirrored clones. It does not certify artistic originality.
export function structuralFingerprint(bp){
 const options=[];
 for(let mirror=0;mirror<2;mirror++)for(let r=0;r<4;r++){
   const points=bp.voxels.map(v=>{
     let x=mirror?-v.x:v.x,z=v.z;
     for(let j=0;j<r;j++){const tmp=x;x=-z;z=tmp;}
     return {x,y:v.y,z,kind:v.kind};
   });
   const lx=Math.min(...points.map(p=>p.x)),ly=Math.min(...points.map(p=>p.y)),lz=Math.min(...points.map(p=>p.z));
   options.push(points.map(p=>[p.x-lx,p.y-ly,p.z-lz,p.kind].join(",")).sort().join(";"));
 }
 return options.sort()[0];
}
export function assertDistinctArchitecture(items){
 const used=new Map(),ids=new Set();
 for(const bp of items){
   validateBlueprint(bp);check(!ids.has(bp.id),"duplicate blueprint id");ids.add(bp.id);
   const key=structuralFingerprint(bp);
   check(!used.has(key),"mirrored / recolored architecture duplicate of "+used.get(key));
   used.set(key,bp.id);
 }
 return {authored:items.length,distinctArchitectures:used.size};
}
