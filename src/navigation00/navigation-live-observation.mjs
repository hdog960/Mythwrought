// Live player observation only. No map-pan, fog or generation authority.
export function navigationPose(player){
 const y=player?.feet??player?.y;
 if(![player?.x,y,player?.z,player?.yaw].every(Number.isFinite))throw Error('Invalid live navigation pose');
 return Object.freeze({x:player.x,y,z:player.z,yaw:player.yaw});
}
export function observeNavigationSurface({world,player,residentAt,minSurfaceY,maxY}){
 const p=navigationPose(player),x=Math.floor(p.x),z=Math.floor(p.z);
 const unknown=kind=>Object.freeze({kind,surfaceY:null,x,z});
 if(!Number.isInteger(minSurfaceY)||!Number.isInteger(maxY)||maxY<minSurfaceY||maxY-minSurfaceY>1024||typeof residentAt!=='function')return unknown('unknown');
 if(p.y<minSurfaceY)return unknown('underground');
 if(p.y>maxY+2)return unknown('unknown');
 // Inspect only the current live column, never an arbitrary map coordinate.
 // No source access for a missing resident vertical section.
 for(let y=maxY;y>=minSurfaceY;y--){
   if(!residentAt(x,y,z))return unknown('unknown');
   const id=world.get(x,y,z);
   if(!Number.isInteger(id)||id<0)return unknown('unknown');
   if(id!==0){
     const surfaceY=y+1;
     return Object.freeze({kind:surfaceY>p.y+1.55?'covered':'surface',surfaceY,x,z});
   }
 }
 return unknown('unknown');
}
export function eligibleSurfaceDiscovery(observation,player){
 const p=navigationPose(player);
 return observation?.kind==='surface'&&observation.x===Math.floor(p.x)&&observation.z===Math.floor(p.z);
}
