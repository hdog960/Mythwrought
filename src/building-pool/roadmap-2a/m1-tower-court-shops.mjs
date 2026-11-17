// Builder 2A M1 original vertical architecture: supported tower courts and differentiated roof silhouettes.
// Source-only theoretical blueprints; this module registers nothing in the live game.
import {M1_TOWER_COURT_SPECS} from './m1-tower-court-specs.mjs';
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export {M1_TOWER_COURT_SPECS};
const K=(x,y,z)=>x+','+y+','+z;
function roofRise(style,x,z,rect){
 const [x0,x1,z0,z1]=rect,cx=(x0+x1)/2,cz=(z0+z1)/2,
  dx=Math.abs(x-cx),dz=Math.abs(z-cz),
  rx=Math.max(1,(x1-x0)/2),rz=Math.max(1,(z1-z0)/2);
 const u=dx/rx,v=dz/rz;
 if(style==='pitched')return Math.max(0,5-Math.floor(dx/1.45));
 if(style==='dome')return Math.max(0,Math.round(6*Math.sqrt(Math.max(0,1-(u*u+v*v)*.52))));
 if(style==='octagon')return Math.max(0,6-Math.ceil(Math.max(u,v)*4+Math.min(u,v)*1.8));
 if(style==='crown')return (dx>=rx-1&&dz>=rz-1)?6:(dx>=rx-1||dz>=rz-1)?3:1;
 if(style==='crenel')return (x===x0||x===x1||z===z0||z===z1)?(x+z)%3===0?3:1:0;
 throw Error('unsupported independently authored tower roof form '+style);
}
export function author2ATowerCourt(s){
 const base=author2ALandmark(s),
  vox=new Map(base.voxels.map(v=>[K(v.x,v.y,v.z),{...v}])),
  windows=[...base.openings],masses=[],vents=[];
 if(!Array.isArray(s.masses)||s.masses.length<2)throw Error('original skyline requires two independently designed massings');
 for(const [i,m] of s.masses.entries()){
  const [x0,x1,z0,z1]=m.rect;
  if(!m.name||x0<0||z0<0||x1>=s.w||z1>=s.d||x1-x0<4||z1-z0<4||
   !Number.isInteger(m.height)||m.height<12||m.height>26||!['pitched','crown','crenel','dome','octagon'].includes(m.roof))
   throw Error('invalid monumental mass specification '+i);
  const wallTop=s.h+m.height,cap=wallTop+1,roofEdges=[];
  let converted=0,newWalls=0,roofed=0,highest=cap;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(vox.get(K(x,s.h+1,z))?.kind!=='roof')throw Error('tower has no real source roof foundation '+m.name+' '+x+','+z);
   for(let y=s.h+2;y<=wallTop;y++){
    const at=K(x,y,z),prior=vox.get(at);
    if(prior&&prior.kind!=='roof')throw Error('tower intersects non-roof owned source '+m.name+' '+at);
    if(prior)converted++;else newWalls++;
    vox.set(at,{x,y,z,kind:'wall',material:s.wall,
     architecturalRole:'solid-tower-wall-'+m.name,
     supportIntent:'continuous solid masonry over source-owned roof plate; live producer load unapproved'});
   }
   if(vox.has(K(x,cap,z)))throw Error('monumental roof cap collision '+m.name);
   vox.set(K(x,cap,z),{x,y:cap,z,kind:'roof',material:s.roof,roofBearing:'continuous-source-wall-column',
    architecturalRole:'source-structural-cap-'+m.name});roofed++;
   const rise=roofRise(m.roof,x,z,m.rect);
   for(let j=1;j<=rise;j++){
    const y=cap+j,at=K(x,y,z);
    if(vox.has(at))throw Error('tower roof collides with another independently authored peak '+at);
    if(vox.get(K(x,y-1,z))?.kind!=='roof')throw Error('floating monumental crown '+at);
    vox.set(at,{x,y,z,kind:'roof',material:s.roof,
     architecturalRole:'source-geometry-'+m.roof+'-'+m.name,roofBearing:'contiguous-lower-roof-cell'});
    roofed++;highest=Math.max(highest,y);
   }
  }
  if(m.window){
   // Two genuinely unoccupied, high-mounted air vents on the tower's side.
   // They are deliberately NOT falsely claimed to be mounted glazing.
   const z=Math.floor((z0+z1)/2),x=x0;
   for(const y of [wallTop-6,wallTop-5]){
    const at=K(x,y,z);
    if(vox.get(at)?.kind!=='wall')throw Error('tower vent is not carved from actual solid wall '+at);
    vox.delete(at);vents.push({x,y,z,role:'open-air-high-tower-vent',notGlazing:true,mass:m.name});
   }
  }
  if(roofed<(x1-x0+1)*(z1-z0+1)+16||converted+newWalls<500)
   throw Error('tower is a nominal label rather than substantial source geometry '+m.name);
  masses.push(Object.freeze({name:m.name,roof:m.roof,rect:m.rect,
   height:m.height,cap,highest,
   convertedExistingRoofToTowerWallCells:converted,newSupportedTowerWallCells:newWalls,
   sourceRoofCells:roofed,upperFloorAccessible:false,finalLoadApproved:false}));
 }
 const voxels=[...vox.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
   output={...base,voxels,openings:windows,
    extents:{...base.extents,y:Math.max(...voxels.map(v=>v.y))+1},
    architecturalSignature:base.architecturalSignature+' / source-founded monumental multi-height façade '+masses.map(x=>x.name+'/'+x.roof).join(' + '),
    roof:{...base.roof,form:'multi-height rooted monumental tower/pavilion roof geometry with individually shaped caps'},
    skylineMassing:Object.freeze(masses),openAirHighVents:Object.freeze(vents),
    features:[...base.features,'true 3D monument silhouettes with open-air vent cells, independently shaped source roofs'],
    // All earlier source dependencies remain explicit; no 130-block, runtime or live asset substitution.
    unresolvedDependencies:base.unresolvedDependencies,worldPlaced:false,numericIdsAssigned:false};
 validateBlueprint(output);return Object.freeze(output);
}
export const M1_TOWER_COURT_SHOPS=Object.freeze(M1_TOWER_COURT_SPECS.map(author2ATowerCourt));
