// Living Underworld P2 entrance planner — pure, opt-in, candidate-only.
// No writes to VoxelWorld, saves, protected surface cells or production code.
// Entrance eligibility must be established using the active biome's real terrain
// reader; a rejected proposal MUST NOT be carved into live worlds.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE} from './worldwide-network.mjs';

const integer=n=>Number.isSafeInteger(n);
const seedOK=n=>integer(n)&&n===(n|0);
function hash(seed,rx,rz,salt){
 let h=Math.imul(seed,0x9e3779b1)^Math.imul(rx,0x85ebca6b)^
   Math.imul(rz,0xc2b2ae35)^Math.imul(salt,0x27d4eb2d);
 h=Math.imul(h^(h>>>16),0x7feb352d);
 return (h^(h>>>16))>>>0;
}
const directions=Object.freeze([
 Object.freeze({dx:1,dz:0,name:'east'}),
 Object.freeze({dx:0,dz:1,name:'south'}),
 Object.freeze({dx:-1,dz:0,name:'west'}),
 Object.freeze({dx:0,dz:-1,name:'north'})
]);
const point=(x,y,z)=>Object.freeze({x,y,z});
function testTunnel(x,y,z,a,b,radius){
 const dx=b.x-a.x,dy=1.35*(b.y-a.y),dz=b.z-a.z;
 const px=x-a.x,py=1.35*(y-a.y),pz=z-a.z;
 const denom=dx*dx+dy*dy+dz*dz;
 const t=denom?Math.max(0,Math.min(1,(dx*px+dy*py+dz*pz)/denom)):0;
 const ex=px-t*dx,ey=py-t*dy,ez=pz-t*dz;
 return ex*ex+ey*ey+ez*ez<=radius*radius;
}
export function planUnderworldSurfaceEntrance(seed,rx,rz,{
 surfaceHeightAt,protectedAt=()=>false,biomeAt=()=> 'unknown',requiredBiome=null,searchStart=0,radialVariant=0,lateralVariant=0
}={}){
 if(!seedOK(seed)||![rx,rz].every(integer)||typeof surfaceHeightAt!=='function'||
   typeof protectedAt!=='function'||typeof biomeAt!=='function'||
   (requiredBiome!==null&&(typeof requiredBiome!=='string'||!requiredBiome.trim()))||
   !integer(searchStart)||searchStart<0||searchStart>3||
   !integer(radialVariant)||radialVariant<0||radialVariant>3||
   !integer(lateralVariant)||lateralVariant<0||lateralVariant>3)
   throw new TypeError('Invalid detached cave entrance inputs');
 const region=planUnderworldRegion(seed,rx,rz);
 const start=region.layers[0].hub;
 const rejections=[];
 const order=hash(seed,rx,rz,991)%4;
 const radiusOffsets=[0,-18,12,-10];
 // Variant 0 is byte-identical to all prior candidate geometry.
 const lateralOffsets=[0,-24,24,-48];
 for(let index=0;index<4;index++){
  const direction=directions[(index+order+searchStart)%4];
  const distance=76+hash(seed,rx,rz,1021+index+radialVariant*137)%13+
   radiusOffsets[radialVariant];
  const offset=lateralOffsets[lateralVariant];
  const endX=start.x+direction.dx*distance-direction.dz*offset,
    endZ=start.z+direction.dz*distance+direction.dx*offset;
  if(Math.floor(endX/UNDERWORLD_REGION_SIDE)!==rx||
    Math.floor(endZ/UNDERWORLD_REGION_SIDE)!==rz){
    rejections.push(direction.name+':outside-region');continue;
  }
  const height=surfaceHeightAt(endX,endZ);
  if(!integer(height)||height<0||height>16){
    rejections.push(direction.name+':surface-range');continue;
  }
  const biome=biomeAt(endX,endZ);
  if(typeof biome!=='string'||!biome.trim()||
    (requiredBiome!==null&&biome!==requiredBiome)){
    rejections.push(direction.name+':biome');continue;
  }
  let obstruction=false;
  for(let i=-2;i<=2&&!obstruction;i++)for(let j=-2;j<=2;j++){
   const h=surfaceHeightAt(endX+i,endZ+j);
   if(!integer(h)||Math.abs(h-height)>6){obstruction=true;break;}
   if(protectedAt(endX+i,height,endZ+j)) {obstruction=true;break;}
  }
  if(obstruction){rejections.push(direction.name+':surface-obstructed');continue;}
  const end=point(endX,height+1,endZ);
  const mid=point(
   Math.round(start.x+(end.x-start.x)*.52)+direction.dz*(hash(seed,rx,rz,2081+index+radialVariant*137)%13-6),
   Math.round(start.y+(end.y-start.y)*.52),
   Math.round(start.z+(end.z-start.z)*.52)+direction.dx*(hash(seed,rx,rz,2101+index+radialVariant*137)%13-6));
  const segments=Object.freeze([Object.freeze({a:start,b:mid,radius:3.8}),
    Object.freeze({a:mid,b:end,radius:3.8})]);
  // Candidate geometry only. An actual protected-world collision sweep and
  // player-walkability check must be performed before any future integration.
  return Object.freeze({
   ok:true,kind:'detached-surface-gallery-proposal-v1',seed,rx,rz,biome,
   direction:direction.name,searchStart,radialVariant,lateralVariant,start,mid,mouth:end,surfaceHeight:height,segments,
   protectedTerrainSurveyComplete:false,
   physicallyVerifiedInLiveWorld:false,
   rejectionHistory:Object.freeze(rejections)
  });
 }
 return Object.freeze({
  ok:false,kind:'detached-surface-gallery-proposal-v1',
  seed,rx,rz,reason:'NO_SAFE_SURFACE_CANDIDATE',rejectionHistory:Object.freeze(rejections)
 });
}
export function proposedSurfaceAirAt(proposal,x,y,z){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
  ![x,y,z].every(integer))throw new TypeError('Invalid cave entrance voxel query');
 if(y<-210||y>19)return false;
 return proposal.segments.some(({a,b,radius})=>testTunnel(x,y,z,a,b,radius));
}
export function auditProposedEntranceCenterline(proposal){
 if(!proposal||proposal.ok!==true)throw new TypeError('No detached cave entrance to audit');
 let count=0;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const length=Math.ceil(Math.hypot(dx,dy,dz)*2);
  for(let i=0;i<=length;i++){
   const t=i/length,x=Math.round(a.x+dx*t),y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(!proposedSurfaceAirAt(proposal,x,y,z))
    throw Error('Detached entrance candidate has a sealed centerline');
   count++;
  }
 }
 return Object.freeze({candidateOnly:true,centerlineSamples:count,
   connectedByProposedAir:true,worldCollisionsNotYetValidated:true});
}
