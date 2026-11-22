// Read-only exact three-wide stair footprint source-ownership audit.
// This is NOT permission to carve original M7, write saves, or place steps.
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
const integer=Number.isSafeInteger;
const k=(x,y,z)=>x+','+y+','+z;
const coords=s=>s.split(',').map(Number);
const checkedBoolean=(fn,x,y,z,role)=>{
 const value=fn(x,y,z);
 if(typeof value!=='boolean')
  throw TypeError('Nonboolean original M7 stair '+role+' source');
 return value;
};
export function auditProtectedSubsurfaceStairs(proposal,{
 naturalAt,authoredAt=()=>undefined,editedAt=()=>false,
 protectedAt=()=>false,materialAllowed=isCandidateGeologyMaterial,
 maxCells=20000,minY=-210,maxY=-4,stopOnFirstUnsafe=false
}={}){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
  typeof naturalAt!=='function'||typeof authoredAt!=='function'||
  typeof editedAt!=='function'||typeof protectedAt!=='function'||
  materialAllowed!==isCandidateGeologyMaterial||!integer(maxCells)||maxCells<100||
  maxCells>100000||typeof stopOnFirstUnsafe!=='boolean'||!integer(minY)||!integer(maxY)||
  minY< -210||maxY>19||minY>=maxY)
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
  authoredAirSupport:0,existingAirSupport:0,
  authoredAirClearance:0,sourceInconsistency:0,
  preexistingAirClearance:0,preexistingSolidSupport:0};
 const examples=[];
 // Bound potentially corrupt source-ID cardinality. Counts beyond the
 // visible 32 IDs are retained in an explicit overflow, never silently
 // reported as a complete material provenance inventory.
 const unsafeMaterialIds=new Map();
 let otherUnsafeMaterialCells=0;
 const materialSummary=()=>Object.freeze({
  unsafeMaterialByBlockId:Object.freeze(Object.fromEntries(
   [...unsafeMaterialIds].sort(([a],[b])=>a-b)
    .map(([id,n])=>[String(id),n]))),
  otherUnsafeMaterialCells,
  allUnsafeMaterialIdsEnumerated:otherUnsafeMaterialCells===0
 });
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
   else if(checkedBoolean(editedAt,x,y,z,'edit')){count.edited++;reason='PLAYER_EDIT';}
   else {
    const owner=authoredAt(x,y,z);
    // A cave author's explicit AIR (0) is not 'unowned' terrain:
    // replacing it with support rock would seal a pre-existing passage.
    // An authored AIR clearance cell is preserved exactly as existing AIR.
    if(owner!==undefined&&(!integer(owner)||owner<0)){
      count.sourceInconsistency++;reason='INVALID_AUTHORED_SOURCE';
    }else if(owner!==undefined&&owner!==0){
      count.authored++;reason='AUTHORED_SOURCE';
    }else if(kind==='support'&&owner===0){
      count.authoredAirSupport++;reason='AUTHORED_AIR_SUPPORT';
    }else if(checkedBoolean(protectedAt,x,y,z,'landmark')){
      count.protected++;reason='PROTECTED_LANDMARK';
    }else{
      const material=naturalAt(x,y,z);
      if(!integer(material)||material<0)
       throw TypeError('Invalid original M7 stair material source');
      if(!materialAllowed(material,x,y,z)){
       count.unsafeMaterial++;reason='UNSAFE_MATERIAL';
       if(unsafeMaterialIds.has(material))
        unsafeMaterialIds.set(material,unsafeMaterialIds.get(material)+1);
       else if(unsafeMaterialIds.size<32)unsafeMaterialIds.set(material,1);
       else otherUnsafeMaterialCells++;
      }else if(owner===0&&material!==0){
       count.sourceInconsistency++;reason='AUTHORED_AIR_MISMATCH';
      }else if(kind==='clearance'){
       if(material===0){
        count.preexistingAirClearance++;
        if(owner===0)count.authoredAirClearance++;
       }else count.geologyExcavation++;
      }else if(material===0){
       // Do not seal any pre-existing natural cavity, even if the
       // caller did not tag it as a named authored cave cell.
       count.existingAirSupport++;reason='EXISTING_AIR_SUPPORT';
      }else count.preexistingSolidSupport++;
    }
   }
   if(reason&&examples.length<12)examples.push(Object.freeze({x,y,z,kind,reason}));
   if(reason&&stopOnFirstUnsafe)return Object.freeze({
    ok:false,reason:'PROTECTED_OR_UNSUPPORTED_SOURCE',haltedEarly:true,
    firstRefusal:reason,sourceChecks:visited.size,
    supportCells:geometry.supportCells,clearanceCells:geometry.clearanceCells,
    counts:Object.freeze({...count}),examples:Object.freeze(examples),
    ...materialSummary(),
    sourceTerrainNeverWritten:true,originalM7Edited:false,
    playerWalkingUnverified:true
   });
  }
 }
 const ok=count.authored===0&&count.edited===0&&count.protected===0&&
  count.unsafeMaterial===0&&count.bounds===0&&
  count.authoredAirSupport===0&&count.existingAirSupport===0&&
  count.sourceInconsistency===0;
 return Object.freeze({ok,reason:ok?null:'PROTECTED_OR_UNSUPPORTED_SOURCE',
  sourceChecks:visited.size,
  supportCells:geometry.supportCells,clearanceCells:geometry.clearanceCells,
  counts:Object.freeze(count),examples:Object.freeze(examples),
  ...materialSummary(),
  actualSourceIdentityNotAuthenticated:true,
  authoredAirAndNaturalCaveAirNeverFilled:true,
  candidateOnly:true,notYetWalkable:true,
  proposedExcavationOnly:true,
  existingM7GeneratorUnchanged:true,originalM7Edited:false,
  sourceTerrainNeverWritten:true});
}
