// Read-only exact three-wide stair footprint source-ownership audit.
// This is NOT permission to carve original M7, write saves, or place steps.
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
const integer=Number.isSafeInteger;
const k=(x,y,z)=>x+','+y+','+z;
const coords=s=>s.split(',').map(Number);
export function auditProtectedSubsurfaceStairs(proposal,{
 naturalAt,authoredAt=()=>undefined,editedAt=()=>false,
 protectedAt=()=>false,materialAllowed=isCandidateGeologyMaterial,
 maxCells=20000,minY=-210,maxY=-4
}={}){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
  typeof naturalAt!=='function'||typeof authoredAt!=='function'||
  typeof editedAt!=='function'||typeof protectedAt!=='function'||
  typeof materialAllowed!=='function'||!integer(maxCells)||maxCells<100||
  maxCells>100000||!integer(minY)||!integer(maxY)||minY>=maxY)
  throw new TypeError('Invalid source-preserving staircase survey');
 const geometry=auditSupportedEntranceStairs(proposal,{maxCells:Math.max(maxCells,20000)});
 if(!geometry.ok)return Object.freeze({ok:false,
  reason:'UNSUPPORTED_STAIR_GEOMETRY',failures:geometry.failures,
  sourceChecks:0,worldChanged:false});
 const support=new Set(),air=new Set();
 let last=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const horizontal=Math.max(Math.abs(dx),Math.abs(dz));
  const acrossX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=horizontal;i++){
   const t=i/horizontal,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(last&&last.x===x&&last.z===z)continue;
   const offsets=acrossX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]];
   for(const [ox,oz] of offsets){
    support.add(k(x+ox,y-1,z+oz));
    for(let h=0;h<3;h++)air.add(k(x+ox,y+h,z+oz));
   }
   last={x,y,z};
  }
 }
 if(support.size!==geometry.supportCells||air.size!==geometry.clearanceCells)
  throw Error('Independent footprint disagrees with strict source stair auditor');
 if([...support].some(p=>air.has(p)))
  throw Error('Strict original stair auditor missed support-air overlap');
 const visited=new Set(),count={authored:0,edited:0,protected:0,
  unsafeMaterial:0,bounds:0,geologyExcavation:0,supportPlacement:0,
  preexistingAirClearance:0,preexistingSolidSupport:0};
 const examples=[];
 for(const [kind,set] of [['clearance',air],['support',support]]){
  for(const key of set){
   if(visited.has(key))continue;visited.add(key);
   if(visited.size>maxCells)return Object.freeze({
    ok:false,reason:'SOURCE_QUERY_BUDGET_EXCEEDED',
    sourceChecks:visited.size,limit:maxCells,
    worldChanged:false,originalM7Edited:false});
   const [x,y,z]=coords(key);
   let reason=null;
   if(y<minY||y>maxY){count.bounds++;reason='BOUNDS';}
   else if(editedAt(x,y,z)){count.edited++;reason='PLAYER_EDIT';}
   else {const owner=authoredAt(x,y,z);
    if(owner!==undefined&&owner!==0){
     count.authored++;reason='AUTHORED_SOURCE';
    }else if(protectedAt(x,y,z)){
     count.protected++;reason='PROTECTED_LANDMARK';
    }else{
     const material=naturalAt(x,y,z);
     if(!materialAllowed(material,x,y,z)){
      count.unsafeMaterial++;reason='UNSAFE_MATERIAL';
     }else if(kind==='clearance'){
      if(material===0)count.preexistingAirClearance++;
      else count.geologyExcavation++;
     }else{
      if(material===0)count.supportPlacement++;
      else count.preexistingSolidSupport++;
     }
    }
   }
   if(reason&&examples.length<12)examples.push(Object.freeze({x,y,z,kind,reason}));
  }
 }
 const ok=count.authored===0&&count.edited===0&&count.protected===0&&
  count.unsafeMaterial===0&&count.bounds===0;
 return Object.freeze({ok,reason:ok?null:'PROTECTED_OR_UNSUPPORTED_SOURCE',
  sourceChecks:visited.size,
  supportCells:geometry.supportCells,clearanceCells:geometry.clearanceCells,
  counts:Object.freeze(count),examples:Object.freeze(examples),
  actualSourceIdentityNotAuthenticated:true,
  candidateOnly:true,notYetWalkable:true,
  proposedExcavationOnly:true,
  existingM7GeneratorUnchanged:true,originalM7Edited:false,
  sourceTerrainNeverWritten:true});
}
