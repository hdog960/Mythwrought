// Read-only proof of same-height rare-city floor separation by the exact
// original 16 three-wide horizontal pedestrian galleries. Not a graph-wide
// 3D routing impossibility and never an original M7 terrain/material audit.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compileMainGalleryPedestrianClearance}
 from './combined-stair-footprints.mjs';
const INT=Number.isSafeInteger;
const KEY=(x,z)=>x+','+z;
const OFFSETS=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
export function surveyCityGalleryFloorCutsets(seed,rx,rz,{
 maxColumns=25000,maxGeometryChecks=400000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !INT(maxColumns)||maxColumns<1||maxColumns>25000||
  !INT(maxGeometryChecks)||maxGeometryChecks<15||
  maxGeometryChecks>400000)
  throw TypeError('Invalid original city/gallery planar cut-set survey');
 const c=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!c)return Object.freeze({sitePresent:false,seed,rx,rz,
  worldChanged:false,sourceTerrainNeverRead:true});
 const floorY=c.y-8;
 const minX=Math.ceil(c.x-c.rx*.55),maxX=Math.floor(c.x+c.rx*.55),
  minZ=Math.ceil(c.z-c.rz*.55),maxZ=Math.floor(c.z+c.rz*.55);
 const ellipse=(x,z)=>((x-c.x)/(c.rx*.55))**2+
  ((z-c.z)/(c.rz*.55))**2<=1;
 let totalColumns=0;
 for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++)
  if(ellipse(x,z))totalColumns++;
 const expected=totalColumns*15;
 if(totalColumns>maxColumns||expected>maxGeometryChecks)
  return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'FLOOR_CUTSET_GEOMETRY_BUDGET',totalColumns,
   requiredGeometryChecks:expected,maxColumns,maxGeometryChecks,
   originalM7SourceChecks:0,worldChanged:false});
 const gallery=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!gallery.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:gallery.reason,seed,rx,rz,originalM7SourceChecks:0,
  worldChanged:false});
 const safe=new Map(),blocked=new Map(),byPair={};
 let geometryChecks=0;
 for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
  if(!ellipse(x,z))continue;
  let conflict=null;
  for(let y=floorY-5;y<=floorY+9;y++){
   geometryChecks++;
   const kind=y<=floorY?'support':'clearance';
   const hit=gallery.inspectCell(x,y,z,kind);
   if(hit){conflict=Object.freeze({
    x,y,z,kind,horizontalPairIndex:hit.horizontalPairIndex
   });break}
  }
  if(conflict){
   blocked.set(KEY(x,z),conflict);
   const p=conflict.horizontalPairIndex;
   byPair[p]=(byPair[p]??0)+1;
  }else safe.set(KEY(x,z),Object.freeze({x,z}));
 }
 const components=[],unseen=new Set(safe.keys()),
  landing=KEY(c.x+20,c.z+20),center=KEY(c.x,c.z);
 let landingComponent=null,centerComponent=null;
 while(unseen.size>0){
  const begin=unseen.values().next().value,queue=[begin];
  unseen.delete(begin);
  let count=0,hasLanding=false,hasCenter=false;
  let minCX=Infinity,maxCX=-Infinity,minCZ=Infinity,maxCZ=-Infinity;
  for(let i=0;i<queue.length;i++){
   const k=queue[i],v=safe.get(k);
   count++;if(k===landing)hasLanding=true;
   if(k===center)hasCenter=true;
   minCX=Math.min(minCX,v.x);maxCX=Math.max(maxCX,v.x);
   minCZ=Math.min(minCZ,v.z);maxCZ=Math.max(maxCZ,v.z);
   for(const [dx,dz] of OFFSETS){
    const q=KEY(v.x+dx,v.z+dz);
    if(unseen.delete(q))queue.push(q);
   }
  }
  const index=components.length;
  if(hasLanding)landingComponent=index;
  if(hasCenter)centerComponent=index;
  components.push(Object.freeze({
   count,containsOriginalLanding:hasLanding,
   containsOriginalCityCenter:hasCenter,
   bounds:Object.freeze({minX:minCX,maxX:maxCX,minZ:minCZ,maxZ:maxCZ})
  }));
 }
 components.sort((a,b)=>b.count-a.count);
 const size=components.reduce((n,x)=>n+x.count,0);
 if(size+blocked.size!==totalColumns)
  throw Error('Original detached floor cut-set census did not conserve columns');
 const l=components.find(x=>x.containsOriginalLanding),
  centerGroup=components.find(x=>x.containsOriginalCityCenter);
 const same=!!(l&&centerGroup&&l===centerGroup);
 return Object.freeze({ok:true,sitePresent:true,seed,rx,rz,floorY,
  totalColumns,blockedColumns:blocked.size,
  galleryConflictFreeColumns:safe.size,geometryChecks,
  potentialConnectedComponents:components.length,
  components:Object.freeze(components),
  landingComponentColumns:l?.count??0,
  cityCenterComponentColumns:centerGroup?.count??0,
  landingAndCityCenterOnSameClearFloorComponent:same,
  originalLandingColumnUnblocked:!!l,
  cityCenterColumnUnblocked:!!centerGroup,
  galleryBlockedColumnsByPair:Object.freeze({...byPair}),
  all16OriginalMainGalleryFootprintsProtected:true,
  sameElevationPlanarSeparationConfirmed:!same&&!!l&&!!centerGroup,
  multiLevelBridgeOrAlternativeUnstudied:true,
  fullEllipseCityFloorApproved:false,
  originalM7SourceChecks:0,originalM7TerrainUninspected:true,
  voxelWorldUnchanged:true,settlementPlaced:false,worldChanged:false});
}
