// Living Underworld P2 candidate ONLY. Pure, world-coordinate-based 3D cave field.
// Never imported by the shipped world generator; does not mutate voxels or saves.
// Density, connectivity, entrances and city-scale feasibility remain UNACCEPTED.
export const UNDERWORLD_CANDIDATE_KIND='living-underworld-worldwide-probe-v1';
const mix=(a,b,t)=>a+(b-a)*t;
const fade=t=>t*t*(3-2*t);
const hash3=(x,y,z,seed)=>{
  let h=Math.imul(x|0,0x7feb352d)^Math.imul(y|0,0x846ca68b)^
    Math.imul(z|0,0x9e3779b1)^Math.imul(seed|0,0x85ebca6b);
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  return (h^(h>>>16))>>>0;
};
function valueNoise3(x,y,z,seed){
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=fade(x-ix),fy=fade(y-iy),fz=fade(z-iz);
  const v=(dx,dy,dz)=>hash3(ix+dx,iy+dy,iz+dz,seed)/2147483648-1;
  const near=mix(mix(v(0,0,0),v(1,0,0),fx),mix(v(0,1,0),v(1,1,0),fx),fy);
  const far=mix(mix(v(0,0,1),v(1,0,1),fx),mix(v(0,1,1),v(1,1,1),fx),fy);
  return mix(near,far,fz);
}
function chamber(seed,cellX,cellZ,index){
  const h=n=>hash3(cellX,cellZ,index*97+n,seed);
  const centerX=cellX*128+16+h(1)%96,centerZ=cellZ*128+16+h(2)%96;
  const centerY=-26-h(3)%158;
  const radiusX=26+h(4)%43,radiusZ=28+h(5)%43,radiusY=12+h(6)%22;
  return {centerX,centerY,centerZ,radiusX,radiusY,radiusZ};
}
export function candidateCaveAt(seed,x,y,z,{minY=-210,maxY=-4}={}){
  if(![seed,x,y,z,minY,maxY].every(Number.isSafeInteger)||
    seed!==(seed|0)||minY>=maxY)throw new TypeError('Invalid worldwide cave query');
  if(y<minY||y>maxY)return false;
  // Wide and fine noise keep the field coherent across independently loaded chunks.
  const a=valueNoise3(x/83,y/33,z/83,seed+101),
    b=valueNoise3(x/31,y/15,z/31,seed+307),
    c=valueNoise3(x/173,y/59,z/173,seed+503);
  if(a*.55+b*.30+c*.15>.13)return true;
  const tileX=Math.floor(x/128),tileZ=Math.floor(z/128);
  // Every tile has chamber candidates; no designated origin or finite world map.
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
    for(let index=0;index<2;index++){
      const room=chamber(seed,tileX+dx,tileZ+dz,index);
      const nx=(x-room.centerX)/room.radiusX,
        nz=(z-room.centerZ)/room.radiusZ,
        ny=(y-room.centerY)/room.radiusY;
      const wobble=.09*valueNoise3(x/19,y/13,z/19,seed+index+1009);
      if(nx*nx+ny*ny+nz*nz<1+wobble)return true;
    }
  }
  return false;
}

// Explicit geometric components for the *calibrated* detached candidate. No
// changes to the historic candidateCaveAt API or any active game generator.
export function candidateNoiseScoreAt(seed,x,y,z){
 if(![seed,x,y,z].every(Number.isSafeInteger)||seed!==(seed|0))
  throw new TypeError('Invalid underworld noise sample');
 const a=valueNoise3(x/83,y/33,z/83,seed+101),
   b=valueNoise3(x/31,y/15,z/31,seed+307),
   c=valueNoise3(x/173,y/59,z/173,seed+503);
 return a*.55+b*.30+c*.15;
}
export function candidateChamberAt(seed,x,y,z){
 if(![seed,x,y,z].every(Number.isSafeInteger)||seed!==(seed|0))
  throw new TypeError('Invalid underworld chamber sample');
 if(y<-210||y>-4)return false;
 const tileX=Math.floor(x/128),tileZ=Math.floor(z/128);
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let index=0;index<2;index++){
   const room=chamber(seed,tileX+dx,tileZ+dz,index);
   const nx=(x-room.centerX)/room.radiusX,
    nz=(z-room.centerZ)/room.radiusZ,
    ny=(y-room.centerY)/room.radiusY;
   const wobble=.09*valueNoise3(x/19,y/13,z/19,seed+index+1009);
   if(nx*nx+ny*ny+nz*nz<1+wobble)return true;
  }
 return false;
}
