// Read-only source-authored U-courtyard weather, deep-open-air and Pack5 footprint preflight.
// Not physical renderer approval, world placement, actual structural engineering or saves.
import {M1_U_COURT_SHOPS,M1_U_COURT_PROFILES} from './m1-u-court-shops.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
const key=(x,y,z)=>[x,y,z].join(',');
export function inspect2AUFootprints(books=M1_U_COURT_SHOPS,profiles=M1_U_COURT_PROFILES){
 if(!Array.isArray(books)||!Array.isArray(profiles)||books.length!==profiles.length||!books.length)throw Error('matched authored U courtyard blueprints required');
 let removedRearColumns=0,removedFrontColumns=0,roofCapWallColumns=0,physicalPenOccupiedCells=0,bankGateOccupiedCells=0,accessibleRooms=0;
 const results=[];
 for(let n=0;n<books.length;n++){
  const b=books[n],p=profiles[n],c=p.openRearCourt,f=p.frontWingSetback;
  const cells=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  if(cells.size!==b.voxels.length||b.courtyardGeometry?.length!==2)throw Error('duplicate or missing original U geometry '+b.id);
  const zstart=p.d-c.depth,roofY=p.h+1;
  const assertVoid=(x,z)=>{for(let y=0;y<b.extents.y;y++)if(cells.has(key(x,y,z)))throw Error('U courtyard open-air column blocked '+key(x,y,z));};
  const assertWall=(x,z,role)=>{
   if(cells.get(key(x,1,z))?.kind!=='floor')throw Error('weather leg has no floor support '+key(x,1,z));
   if(cells.get(key(x,roofY,z))?.kind!=='roof')throw Error('weather leg lacks roof cap '+key(x,roofY,z));
   for(let y=2;y<=p.h;y++){const v=cells.get(key(x,y,z));if(v?.kind!=='wall'||v.architecturalRole!==role)throw Error('U weather leg not sealed '+key(x,y,z));}
   roofCapWallColumns++;
  };
  for(let x=c.x0;x<=c.x1;x++)for(let z=zstart;z<p.d;z++){assertVoid(x,z);removedRearColumns++;}
  for(let z=zstart;z<p.d;z++){assertWall(c.x0-1,z,c.role+'-west-inner-wall');assertWall(c.x1+1,z,c.role+'-east-inner-wall');}
  for(let x=c.x0;x<=c.x1;x++)assertWall(x,zstart-1,c.role+'-inner-return-wall');
  const west=f.side==='west',innerX=west?f.width:p.w-f.width-1;
  for(let x=west?0:p.w-f.width;x<(west?f.width:p.w);x++)for(let z=0;z<f.depth;z++){assertVoid(x,z);removedFrontColumns++;}
  for(let z=0;z<f.depth;z++)assertWall(innerX,z,f.role+'-offset-facade');
  for(let x=west?0:p.w-f.width;x<(west?f.width:p.w);x++)assertWall(x,f.depth,f.role+'-facade-return');
  const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  const used=new Set();
  for(const v of b.voxels.filter(v=>v.physicalVariant==='oak-stall-divider')){
   const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing});
   if(shape.occupiedOffsets.length!==2)throw Error('producer oak divider not two-cell');
   for(const [dx,dy,dz] of shape.occupiedOffsets){const loc=key(v.x+dx,v.y+dy,v.z+dz);if(used.has(loc))throw Error('two-cell physical stall collision '+loc);
    if(cells.get(loc)?.kind==='wall')throw Error('real oak pen second cell intersects source wall '+loc);
    used.add(loc);blocked.add((v.x+dx)+','+(v.z+dz));physicalPenOccupiedCells++;}
  }
  for(const gate of b.openings.filter(v=>v.role==='vault-threshold')){
   const shape=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   if(shape.occupiedOffsets.length!==2)throw Error('incorrect real two-leaf vault footprint');
   const secondary=b.openings.find(o=>o.role==='vault-wide-secondary');if(!secondary)throw Error('vault lacks second opening');
   const destinations=shape.occupiedOffsets.map(([dx,dy,dz])=>key(gate.x+dx,gate.y+dy,gate.z+dz));
   if(!destinations.includes(key(secondary.x,secondary.y,secondary.z)))throw Error('vault physical yaw differs from two-wide opening');
   for(const [dx,dy,dz] of shape.occupiedOffsets){for(let step=0;step<3;step++)if(cells.has(key(gate.x+dx,gate.y+dy+step,gate.z+dz)))throw Error('actual bank leaf meets occupied wall');bankGateOccupiedCells++;}
  }
  const entry=b.openings.find(o=>o.type==='entrance'),q=[[entry.x,1]],seen=new Set();
  for(let i=0;i<q.length;i++){const [x,z]=q[i],k=x+','+z;
   if(seen.has(k)||blocked.has(k)||x<1||z<1||x>=p.w-1||z>=p.d-1||cells.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>cells.has(key(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  if(b.rooms.length!==4)throw Error('U courtyard lacks individually-authored fourth room');
  for(const room of b.rooms){if(!seen.has(room.access.join(',')))throw Error('physical producer-aware walking blocked '+b.id+': '+room.name);accessibleRooms++;}
  const annex=b.openings.find(o=>o.role==='new-independent-west-annex');
  if(!annex||[0,1,2].some(y=>cells.has(key(annex.x,annex.y+y,annex.z))))throw Error('fourth wing door not three-high source-cleared');
  results.push({id:b.id,openRearCells:(c.x1-c.x0+1)*c.depth,asymmetricFrontCells:f.width*f.depth,rooms:b.rooms.length,actualVoxelCells:b.voxels.length,physicalMeshApproved:false});
 }
 return Object.freeze({models:books.length,removedRearColumns,removedFrontColumns,roofCapWallColumns,physicalPenOccupiedCells,bankGateOccupiedCells,accessibleRooms,results,physicalFamilyMeshRendered:false,windowMountApproved:false,roofLoadCertified:false,creatorApproved:false,integrated:false});
}
