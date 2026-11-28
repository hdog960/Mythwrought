// Detached stair-supported entry gallery. Neither carves an existing world
// nor changes original biome terrain. Produces a physical voxel-level proposal
// for supported three-wide steps and three-high player clearance.
const int=Number.isSafeInteger;
export function auditSupportedEntranceStairs(proposal,{maxCells=20000}={}){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
   !int(maxCells)||maxCells<100||maxCells>200000)
  throw new TypeError('Invalid supported gallery proposal');
 const support=new Set(),clearance=new Set(),walk=[];
 const key=(x,y,z)=>x+','+y+','+z;
 const failures=[];
 let maximumStepRise=0,diagonalSteps=0;
 let previous=null;
 for(const {a,b} of proposal.segments){
  if(![a.x,a.y,a.z,b.x,b.y,b.z].every(int)){
   failures.push('INVALID_ENDPOINTS');break;
  }
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const horizontal=Math.max(Math.abs(dx),Math.abs(dz));
  if(horizontal<1||Math.abs(dy)>horizontal){
   failures.push('UNSUPPORTED_GRADE');break;
  }
  const primaryX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=horizontal;i++){
   const t=i/horizontal;
   const x=Math.round(a.x+dx*t),y=Math.round(a.y+dy*t),
    z=Math.round(a.z+dz*t);
   if(previous&&previous.x===x&&previous.z===z){
    if(previous.y!==y)failures.push('VERTICAL_ONLY_STEP');
    continue;
   }
   if(previous){
    const rise=Math.abs(y-previous.y);
    const ax=Math.abs(x-previous.x),az=Math.abs(z-previous.z);
    maximumStepRise=Math.max(maximumStepRise,rise);
    if(rise>1||ax>1||az>1||(!ax&&!az)){
     failures.push('NONWALKABLE_STEP');break;
    }
    if(ax&&az)diagonalSteps++;
   }
   const offsets=primaryX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]];
   for(const [ox,oz] of offsets){
    const sx=x+ox,sz=z+oz;
    if(y-1< -210||y+2>19){failures.push('WORLD_BOUNDS');break;}
    support.add(key(sx,y-1,sz));
    for(let h=0;h<3;h++)clearance.add(key(sx,y+h,sz));
   }
   walk.push(Object.freeze({x,y,z}));
   previous={x,y,z};
   if(support.size+clearance.size>maxCells){
    failures.push('VOXEL_BUDGET_EXCEEDED');break;
   }
  }
  if(failures.length)break;
 }
 let conflict=0;const examples=[];
 for(const k of support)if(clearance.has(k)){
  conflict++;if(examples.length<6)examples.push(k);
 }
 const start=walk[0],last=walk.at(-1),first=proposal.segments[0].a,
  terminal=proposal.segments.at(-1).b;
 const endpointMatch=start&&last&&start.x===first.x&&start.y===first.y&&start.z===first.z&&
   last.x===terminal.x&&last.y===terminal.y&&last.z===terminal.z;
 if(!endpointMatch)failures.push('ENDPOINT_MISMATCH');
 if(conflict)failures.push('FLOOR_CEILING_CONFLICT');
 return Object.freeze({ok:failures.length===0,
  length:walk.length,maximumStepRise,diagonalSteps,
  supportCells:support.size,clearanceCells:clearance.size,
  conflictCells:conflict,conflictExamples:Object.freeze(examples),
  first,last,failures:Object.freeze([...new Set(failures)]),
  threeWide:true,threeHigh:true,
  model:'candidate blocks required for stair deck; not physical M7 terrain',
  worldCarved:false,playerPhysicsVerified:false,
  sourceTerrainProtectionPending:true});
}
