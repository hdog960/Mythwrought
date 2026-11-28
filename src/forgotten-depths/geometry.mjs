// FD4 detached symbolic voxel source. No material registration, runtime mount, world edits or new renderer.
import {validateGraph} from './graph.mjs';
const SPACE=30, HALF=11, LEVEL=12, MAX_BUCKETS=2048, MAX_BUCKET_REFS=12000, MAX_LOCAL_REFS=32;
export const CELLS=Object.freeze({outside:0,masonry:1,air:2});
function box(x0,y0,z0,x1,y1,z1){return Object.freeze({x0,y0,z0,x1,y1,z1});}

function inside(b,x,y,z){return x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1&&z>=b.z0&&z<=b.z1;}

function section(y){return Math.floor((y+3)/16);}

function sectionKey(x,y,z){return `${Math.floor(x/16)},${Math.floor(z/16)},${section(y)}`;}

function compileGeometry(candidate,graph){
 if(candidate?.id!==graph?.dungeonId||candidate?.seed!==graph?.seed||candidate?.floors!==graph?.floors?.length||!candidate.bounds)throw Error("geometry identity mismatch");
 const b=candidate.bounds;
 if(![b.minX,b.maxX,b.minY,b.maxY,b.minZ,b.maxZ].every(Number.isSafeInteger)||b.minY< -210||b.maxY> -4||b.maxY-b.minY+1!==LEVEL*candidate.floors||b.maxX-b.minX+1<192||b.maxX-b.minX+1>256||b.maxZ-b.minZ+1<192||b.maxZ-b.minZ+1>256)throw Error("geometry reservation bounds");
 if(!Array.isArray(graph.rooms)||graph.rooms.length<80||graph.rooms.length>180||!Array.isArray(graph.edges)||graph.edges.length>540)throw Error("geometry graph budget");
 const rooms=[],corridors=[],stairs=[],roomById=new Map(),slots=new Set(),buckets=new Map(),primitives=[];let refs=0;
 const reservation=box(b.minX,b.minY,b.minZ,b.maxX,b.maxY,b.maxZ);
 function register(p){
  if(!inside(reservation,p.outer.x0,p.outer.y0,p.outer.z0)||!inside(reservation,p.outer.x1,p.outer.y1,p.outer.z1))throw Error("primitive outside reservation");
  const i=primitives.length;primitives.push(p);
  for(let cz=Math.floor(p.outer.z0/16);cz<=Math.floor(p.outer.z1/16);cz++)for(let cx=Math.floor(p.outer.x0/16);cx<=Math.floor(p.outer.x1/16);cx++)for(let sy=section(p.outer.y0);sy<=section(p.outer.y1);sy++){
   const k=`${cx},${cz},${sy}`;let a=buckets.get(k);if(!a){a=[];buckets.set(k,a);}a.push(i);refs++;
   if(buckets.size>MAX_BUCKETS||refs>MAX_BUCKET_REFS||a.length>MAX_LOCAL_REFS)throw Error("geometry index budget");
  }
 }
 for(const q of graph.rooms){
  if(![q.floor,q.x,q.z].every(Number.isInteger)||q.floor<0||q.floor>=candidate.floors||q.x<0||q.x>=6||q.z<0||q.z>=5||roomById.has(q.id)||slots.has(`${q.floor},${q.x},${q.z}`))throw Error("room slot conflict");
  slots.add(`${q.floor},${q.x},${q.z}`);
  const x=b.minX+16+SPACE*q.x,z=b.minZ+16+SPACE*q.z,y=b.maxY-11-LEVEL*q.floor;
  // Wider boss, hub and stair rooms; variable smaller wings. All retain safe central sockets.
  const half=["boss","hub","descent","landing","entrance"].includes(q.role)?HALF:9+(q.x+q.z+q.floor)%3;
  const outer=box(x-half,y,z-half,x+half,y+11,z+half),inner=box(x-half+1,y+1,z-half+1,x+half-1,y+8,z+half-1);
  const row=Object.freeze({id:q.id,floor:q.floor,role:q.role,x,y,z,half,outer,inner});rooms.push(row);roomById.set(q.id,row);register(Object.freeze({kind:"room",outer,inner,id:q.id}));
 }
 const pairs=new Set(),stairFloors=new Set();
 for(const e of graph.edges){
  const a=roomById.get(e.a),d=roomById.get(e.b),pair=[e.a,e.b].sort().join("|");
  if(!a||!d||a===d||pairs.has(pair))throw Error("invalid geometry edge");pairs.add(pair);
  if(e.kind==="stair"){
   const upper=a.y>d.y?a:d,lower=a.y>d.y?d:a;
   if(upper.y-lower.y!==LEVEL||upper.x!==lower.x||upper.z!==lower.z||upper.half<9||lower.half<9||stairFloors.has(upper.floor))throw Error("invalid stair alignment");
   stairFloors.add(upper.floor);
   const x=lower.x,z=lower.z+5,y=lower.y,outer=box(x-7,y+1,z-1,x+5,y+LEVEL+3,z+1);
   const row=Object.freeze({id:e.id,a:e.a,b:e.b,keyId:e.keyId,kind:"stair",x,y,z,outer,lower:lower.id,upper:upper.id});stairs.push(row);register(row);
  }else{
   if(a.y!==d.y||Math.abs(a.x-d.x)+Math.abs(a.z-d.z)!==SPACE||!["passage","loop","hidden"].includes(e.kind))throw Error("non-cardinal corridor");
   const axis=a.x!==d.x?"x":"z",x0=Math.min(a.x,d.x),x1=Math.max(a.x,d.x),z0=Math.min(a.z,d.z),z1=Math.max(a.z,d.z),y=a.y;
   const outer=axis==="x"?box(x0,y,z0-2,x1,y+5,z0+2):box(x0-2,y,z0,x0+2,y+5,z1);
   const inner=axis==="x"?box(x0,y+1,z0-1,x1,y+4,z0+1):box(x0-1,y+1,z0,x0+1,y+4,z1);
   const row=Object.freeze({id:e.id,a:e.a,b:e.b,kind:e.kind,axis,outer,inner,gate:e.kind==="hidden"?Object.freeze([Math.floor((x0+x1)/2),y+1,Math.floor((z0+z1)/2)]):null});
   corridors.push(row);register(row);
  }
 }
 const entry=roomById.get(graph.entrance);
 if(!entry||entry.floor!==0||entry.role!=="entrance")throw Error("missing geometry entrance");
 // Exterior is deliberately sealed. Owner-qualified cave adapter must open exactly this socket (or version a relocation).
 const entrySocket=Object.freeze({room:entry.id,face:"west",cell:Object.freeze([entry.x-entry.half,entry.y+1,entry.z]),width:3,height:3});
 function cell(x,y,z){
  if(![x,y,z].every(Number.isSafeInteger)||!inside(reservation,x,y,z))return CELLS.outside;
  const list=buckets.get(sectionKey(x,y,z));if(!list)return CELLS.outside;
  let air=false,solid=false;
  for(const i of list){
   const p=primitives[i];if(!inside(p.outer,x,y,z))continue;
   if(p.kind==="stair"){
    const support=p.y+x-(p.x-7);
    if(y<=support)return CELLS.masonry;
    if(y<=support+3)return CELLS.air;
    // Higher cells retain their underlying room/roof classification.
   }else if(inside(p.inner,x,y,z))air=true;else solid=true;
  }
  return air?CELLS.air:solid?CELLS.masonry:CELLS.outside;
 }
 function page(cx,cz,sy){
  if(![cx,cz,sy].every(Number.isSafeInteger)||sy> -1||sy< -13||!Number.isSafeInteger(cx*16+15)||!Number.isSafeInteger(cz*16+15))throw Error("invalid physical section");
  const k=`${cx},${cz},${sy}`,bytes=new Uint8Array(4096),y0=sy*16-3;
  if(buckets.has(k))for(let ly=0;ly<16;ly++)for(let lz=0;lz<16;lz++)for(let lx=0;lx<16;lx++){
   const y=y0+ly;if(y>=-210)bytes[ly*256+lz*16+lx]=cell(cx*16+lx,y,cz*16+lz);
  }
  return bytes;
 }
 const stats=Object.freeze({rooms:rooms.length,corridors:corridors.length,stairs:stairs.length,indexedSections:buckets.size,primitiveRefs:refs,maxLocalRefs:Math.max(0,...[...buckets.values()].map(a=>a.length)),pageBytes:4096});
 return Object.freeze({version:1,dungeonId:graph.dungeonId,layoutDigest:graph.digest,reservation,rooms:Object.freeze(rooms),corridors:Object.freeze(corridors),stairs:Object.freeze(stairs),entrySocket,stats,cell,page});
}

export function verifyGeometry(geo){
 const {cell,rooms,corridors,stairs}=geo,byId=new Map(rooms.map(q=>[q.id,q]));let stations=0,roomPairs=0;
 const check=(x,s,z)=>{if(cell(x,s,z)!==CELLS.masonry||cell(x,s+1,z)!==CELLS.air||cell(x,s+2,z)!==CELLS.air)throw Error(`unsupported geometry station ${x},${s},${z}`);stations++;};
 for(const q of rooms){check(q.x,q.y,q.z);for(const [dx,dz] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
  const x=q.x+dx*q.half,z=q.z+dz*q.half;if(cell(x,q.y+1,z)!==CELLS.masonry||cell(x,q.y+9,z)!==CELLS.masonry)throw Error("room corner shell");
 }}
 for(let i=0;i<rooms.length;i++)for(let j=i+1;j<rooms.length;j++){const a=rooms[i].outer,b=rooms[j].outer;roomPairs++;if(a.x0<=b.x1&&a.x1>=b.x0&&a.y0<=b.y1&&a.y1>=b.y0&&a.z0<=b.z1&&a.z1>=b.z0)throw Error("overlapping room envelopes");}
 for(const e of corridors){const a=byId.get(e.a),b=byId.get(e.b),dx=Math.sign(b.x-a.x),dz=Math.sign(b.z-a.z);
  // Test the full shared gap and doorway, not a path through the furnished interior.
  for(let i=a.half-1;i<=SPACE-b.half+1;i++)for(let side=-1;side<=1;side++)check(a.x+dx*i+dz*side,a.y,a.z+dz*i+dx*side);
 }
 for(const s of stairs){
  for(let i=0;i<=LEVEL;i++)for(let side=-1;side<=1;side++)check(s.x-7+i,s.y+i,s.z+side);
  check(s.x+6,s.y+LEVEL,s.z);
  // Bidirectional entry/exit approach around the stair's support columns.
  for(let z=s.z-5;z<=s.z;z++){check(s.x-8,s.y,z);check(s.x+6,s.y+LEVEL,z);}
  for(let x=s.x-8;x<=s.x;x++)check(x,s.y,s.z-5);
  for(let x=s.x;x<=s.x+6;x++)check(x,s.y+LEVEL,s.z-5);
 }
 const [x,y,z]=geo.entrySocket.cell;
 for(let dy=0;dy<3;dy++)for(let dz=-1;dz<=1;dz++)if(cell(x,y+dy,z+dz)!==CELLS.masonry)throw Error("unapproved entrance open");
 return {stations,roomPairs,rooms:rooms.length,corridors:corridors.length,stairs:stairs.length};
}
export function buildDungeonGeometry(candidate,graph){validateGraph(graph);return compileGeometry(candidate,graph);}
