// Exact source-network topology admission for three proposed interlevel
// pedestrian connectors. This is optional and READ-ONLY. Neither a safe
// footprint nor matching metadata by itself proves actual original M7 AIR.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';

const INT=Number.isSafeInteger;
const INDICES=Object.freeze([16,25,34]);
const xyz=p=>p&&[p.x,p.y,p.z].every(INT);
const same=(a,b)=>xyz(a)&&xyz(b)&&
 a.x===b.x&&a.y===b.y&&a.z===b.z;
const inside=(p,rx,rz)=>xyz(p)&&
 Math.floor(p.x/UNDERWORLD_REGION_SIDE)===rx&&
 Math.floor(p.z/UNDERWORLD_REGION_SIDE)===rz&&
 p.y>=-210&&p.y<=-4;

export function auditSelectedInterlevelTopology(seed,rx,rz,proposals,{
 maxCells=50000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !Array.isArray(proposals)||proposals.length>3||
  !INT(maxCells)||maxCells<1000||maxCells>60000)
  throw TypeError('Invalid source-network interlevel topology');
 if(proposals.length!==3)return Object.freeze({
  ok:false,reason:'THREE_DEEP_LINKS_REQUIRED',
  selectedCount:proposals.length,requiredCount:3,
  worldChanged:false,playerWalkingUnverified:true});
 const region=planUnderworldRegion(seed,rx,rz);
 const links=[];let totalCells=0;
 for(let i=0;i<3;i++){
  const p=proposals[i],start=region.layers[i].hub,
   end=region.layers[i+1].hub;
  if(!p||p.ok!==true||p.index!==INDICES[i]||
   p.seed!==seed||p.rx!==rx||p.rz!==rz||
   !same(p.from,start)||!same(p.to,end)||
   !Array.isArray(p.segments)||p.segments.length<1||
   !same(p.segments[0]?.a,start)||
   !same(p.segments.at(-1)?.b,end))
   return Object.freeze({ok:false,reason:'INTERLEVEL_ENDPOINT_OR_PROVENANCE_MISMATCH',
    linkIndex:INDICES[i],worldChanged:false,playerWalkingUnverified:true});
  for(let j=0;j<p.segments.length;j++){
   const s=p.segments[j];
   if(!s||!inside(s.a,rx,rz)||!inside(s.b,rx,rz)||
    (j>0&&!same(p.segments[j-1].b,s.a)))
    return Object.freeze({ok:false,reason:'INTERLEVEL_ROUTE_DISCONTINUITY_OR_BOUNDS',
     linkIndex:INDICES[i],segmentIndex:j,worldChanged:false,
     playerWalkingUnverified:true});
  }
  const grade=auditSupportedEntranceStairs(p,{maxCells:20000});
  if(!grade.ok)return Object.freeze({ok:false,reason:'INTERLEVEL_GRADE_UNSAFE',
   linkIndex:INDICES[i],failures:grade.failures,
   worldChanged:false,playerWalkingUnverified:true});
  totalCells+=grade.supportCells+grade.clearanceCells;
  if(totalCells>maxCells)return Object.freeze({
   ok:false,reason:'INTERLEVEL_TOTAL_GEOMETRY_BUDGET',
   linkIndex:INDICES[i],totalCells,maxCells,worldChanged:false});
  links.push(Object.freeze({index:INDICES[i],fromLevel:region.layers[i].name,
   toLevel:region.layers[i+1].name,sourceCellFootprint:
    grade.supportCells+grade.clearanceCells,
   exactHubEndpoints:true,contiguousSegments:true,
   candidateGradeSafe:true}));
 }
 return Object.freeze({ok:true,seed,rx,rz,verifiedLinks:3,
  totalCells,links:Object.freeze(links),
  completeFourHubTopology:true,
  historicalOriginalM7CellsUnverified:true,
  playerWalkingUnverified:true,
  nothingCarvedOrPlaced:true,worldChanged:false});
}
