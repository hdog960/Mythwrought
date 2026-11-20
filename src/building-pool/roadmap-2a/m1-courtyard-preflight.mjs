// Separate read-only courtyard-bearing, weather-return, and Pack5 cell audit.
// All conclusions are conceptual source/producer checks, NOT physical game placement.
import {M1_COURTYARD_SHOPS,M1_COURTYARD_PROFILES} from './m1-courtyard-shops.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
const at=(x,y,z)=>[x,y,z].join(',');
export function inspect2ACourtyardPreflight(books=M1_COURTYARD_SHOPS,profiles=M1_COURTYARD_PROFILES){
 if(!Array.isArray(books)||!Array.isArray(profiles)||books.length!==profiles.length||!books.length)throw TypeError('matched source courtyard blueprints required');
 let emptyCourtyardColumns=0,fullWallColumns=0,physicalStallCells=0,realBankGateCells=0,reachableRoomTargets=0;
 const evidence=[];
 for(let i=0;i<books.length;i++){
  const b=books[i],p=profiles[i],cells=new Map(b.voxels.map(v=>[at(v.x,v.y,v.z),v]));
  if(!p.cornerCourtyards?.length||b.courtyardGeometry?.length!==p.cornerCourtyards.length)throw Error('missing occupied-cell courtyard program '+b.id);
  const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  const ranges=[];
  for(const c of p.cornerCourtyards){
   const west=c.side==='west',sideX=west?c.width:b.extents.x-c.width-1,startZ=b.extents.z-c.depth;
   for(let z=startZ;z<b.extents.z;z++)for(let x=west?0:sideX+1;x<(west?c.width:b.extents.x);x++){
    for(let y=0;y<b.extents.y;y++)if(cells.has(at(x,y,z)))throw Error('courtyard is not genuinely open '+b.id+' '+at(x,y,z));
    emptyCourtyardColumns++;
   }
   const checkWall=(x,z,role)=>{
    if(cells.get(at(x,1,z))?.kind!=='floor')throw Error('courtyard bearing lacks actual floor '+at(x,1,z));
    if(cells.get(at(x,p.h+1,z))?.kind!=='roof')throw Error('courtyard inner wall has no cap roof '+at(x,p.h+1,z));
    for(let y=2;y<=p.h;y++){
     const v=cells.get(at(x,y,z));if(v?.kind!=='wall'||v.architecturalRole!==c.role+'-'+role)throw Error('courtyard open interior or missing return wall '+b.id+' '+at(x,y,z));
    }
    fullWallColumns++;
   };
   for(let z=startZ;z<b.extents.z;z++)checkWall(sideX,z,'sidewall');
   for(let x=west?0:sideX+1;x<(west?c.width:b.extents.x);x++)checkWall(x,startZ-1,'endwall');
   ranges.push({side:c.side,width:c.width,depth:c.depth,innerX:sideX,innerZ:startZ-1});
  }
  const occupied=new Set();
  for(const fixture of b.voxels.filter(v=>v.physicalVariant==='oak-stall-divider')){
   const pack=resolveManualFivePackAsset(fixture.material,{variant:fixture.physicalVariant,orientation:fixture.intendedFacing});
   if(pack.occupiedOffsets.length!==2)throw Error('real Pack5 oak divider not two cells');
   for(const [dx,dy,dz] of pack.occupiedOffsets){
    const pos=at(fixture.x+dx,fixture.y+dy,fixture.z+dz);
    if(occupied.has(pos))throw Error('real multi-cell Pack5 fixture overlaps another '+pos);
    if(cells.get(pos)&&cells.get(pos).kind==='wall')throw Error('physical stall collides with weather wall');
    occupied.add(pos);blocked.add((fixture.x+dx)+','+(fixture.z+dz));physicalStallCells++;
   }
  }
  for(const gate of b.openings.filter(x=>x.role==='vault-threshold')){
   const pack=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   if(pack.occupiedOffsets.length!==2)throw Error('physical vault leaf not two cells');
   for(const [dx,dy,dz] of pack.occupiedOffsets){
    const x=gate.x+dx,y=gate.y+dy,z=gate.z+dz;
    for(let k=0;k<3;k++)if(cells.has(at(x,y+k,z)))throw Error('vault security gate obstructed '+at(x,y+k,z));
    realBankGateCells++;
   }
  }
  const front=b.openings.find(x=>x.type==='entrance'),q=[[front.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],key=x+','+z;
   if(seen.has(key)||blocked.has(key)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
      cells.get(at(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>cells.has(at(x,y,z))))continue;
   seen.add(key);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){if(!seen.has(room.access.join(',')))throw Error('producer-based 2A room blocked '+b.id+' '+room.name);reachableRoomTargets++;}
  evidence.push({id:b.id,courtyards:ranges,actualCells:b.voxels.length,rooms:b.rooms.length,physicalFootprintApproved:false,saveWritten:false});
 }
 return Object.freeze({buildings:books.length,emptyCourtyardColumns,fullWallColumns,physicalStallCells,realBankGateCells,reachableRoomTargets,evidence,creatorApproved:false,physicalStructuralSpanCertified:false,physicalFamilyRendered:false,integrated:false});
}
