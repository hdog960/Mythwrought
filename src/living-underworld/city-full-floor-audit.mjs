// Exhaustive (not sparse) plateau footprint census in the detached candidate.
// Full 2-D BFS tests one contiguous buildable floor with nine clear headroom
// voxels and six supported blocks. This is not future settlement placement.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {cityFloorAt} from './city-floor-proposal.mjs';
import {detachedCalibratedUnderworldAirAt} from './depth-calibrated-proposal.mjs';
const int=Number.isSafeInteger;
export function auditFullCityCandidate(seed,rx,rz,{maxColumns=40000}={}){
 if(!int(seed)||seed!==(seed|0)||![rx,rz].every(int)||!int(maxColumns)||
   maxColumns<1||maxColumns>40000)throw new TypeError('Invalid full city floor audit');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz});
 const minX=Math.ceil(city.x-city.rx*.55),maxX=Math.floor(city.x+city.rx*.55),
  minZ=Math.ceil(city.z-city.rz*.55),maxZ=Math.floor(city.z+city.rz*.55);
 const width=maxX-minX+1,depth=maxZ-minZ+1,total=width*depth;
 if(total>maxColumns)return Object.freeze({sitePresent:true,ok:false,
  reason:'COLUMN_BUDGET_EXCEEDED',total,maxColumns});
 const footprint=new Uint8Array(total),usable=new Uint8Array(total);
 const floorY=city.y-8;
 let footprintCount=0,usableCount=0,unusableCount=0;
 for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
  const ix=x-minX,iz=z-minZ,index=iz*width+ix,
   nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz>1)continue;
  footprint[index]=1;footprintCount++;
  let good=true;
  for(let y=floorY-5;y<=floorY&&good;y++)good=cityFloorAt(seed,x,y,z);
  for(let y=floorY+1;y<=floorY+9&&good;y++)
   good=detachedCalibratedUnderworldAirAt(seed,x,y,z);
  if(good){usable[index]=1;usableCount++;}
  else unusableCount++;
 }
 const visited=new Uint8Array(total),queue=new Int32Array(total);
 let largest=0,components=0;
 for(let i=0;i<total;i++){
  if(!usable[i]||visited[i])continue;
  components++;
  let start=0,end=1;queue[0]=i;visited[i]=1;
  while(start<end){
   const at=queue[start++],row=Math.floor(at/width),col=at%width;
   const neighbors=[col>0?at-1:-1,col<width-1?at+1:-1,
    row>0?at-width:-1,row<depth-1?at+width:-1];
   for(const n of neighbors){
    if(n<0||!usable[n]||visited[n])continue;
    visited[n]=1;queue[end++]=n;
   }
  }
  if(end>largest)largest=end;
 }
 return Object.freeze({sitePresent:true,ok:unusableCount===0&&
  largest===footprintCount&&components===1,
  seed,rx,rz,cityX:city.x,cityY:city.y,cityZ:city.z,
  floorY,footprintCount,usableCount,unusableCount,
  largestContiguousFloor:largest,connectedFloorComponents:components,
  fullyExhaustiveWithinCandidateFootprint:true,
  allNineAirHeadroomCellsChecked:true,sixSolidSupportLayersChecked:true,
  naturalWorldM7Modified:false,settlementsPlaced:false,
  actualPlayerPhysicsVerified:false});
}
