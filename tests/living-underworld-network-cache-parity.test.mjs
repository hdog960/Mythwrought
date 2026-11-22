import test from 'node:test';
import assert from 'node:assert/strict';
import {networkAirAt,planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from '../src/living-underworld/worldwide-network.mjs';
// Reference implementation of the old exact math, deliberately retained
// independently of the optimized networkAirAt.
const dist=(x,y,z,t)=>{
 const b=t.bounds;
 if(x<b.minX||x>b.maxX||y<b.minY||y>b.maxY||z<b.minZ||z>b.maxZ)
  return false;
 const dx=t.b.x-t.a.x,dy=(t.b.y-t.a.y)*1.5,dz=t.b.z-t.a.z;
 const px=x-t.a.x,py=(y-t.a.y)*1.5,pz=z-t.a.z;
 const den=dx*dx+dy*dy+dz*dz;
 const frac=den?Math.max(0,Math.min(1,(px*dx+py*dy+pz*dz)/den)):0;
 const ax=px-frac*dx,ay=py-frac*dy,az=pz-frac*dz;
 return ax*ax+ay*ay+az*az<=t.radius*t.radius;
};
const room=(x,y,z,r)=>{
 if(Math.abs(x-r.x)>r.rx||Math.abs(y-r.y)>r.ry||Math.abs(z-r.z)>r.rz)
  return false;
 const a=(x-r.x)/r.rx,b=(y-r.y)/r.ry,c=(z-r.z)/r.rz;
 return a*a+b*b+c*c<=1;
};
function uncachedNetworkAir(seed,x,y,z){
 if(y<-210||y>-4)return false;
 const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
 const local=planUnderworldRegion(seed,rx,rz);
 if(local.layers.some(l=>room(x,y,z,l.room)))return true;
 if(local.capsules.some(t=>dist(x,y,z,t)))return true;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
  const city=(dx===0&&dz===0?local:planUnderworldRegion(seed,rx+dx,rz+dz)).cityCandidate;
  if(city&&room(x,y,z,city))return true;
 }
 return false;
}
test('rare neighboring-city cache preserves exact old network voxels across negative/remote seams and evictions',()=>{
 let matched=0,cityCenters=0;
 for(const seed of [179,-17,2026,314159])for(const [rx,rz] of [
   [0,0],[-37,52],[300,-302],[-300,300],[2,0]]) {
  for(let i=0;i<240;i++){
   const x=rx*256+((i*37)%258)-1,z=rz*256+((i*67)%258)-1,
     y=-4-(i*47)%207;
   assert.equal(networkAirAt(seed,x,y,z),uncachedNetworkAir(seed,x,y,z));
   matched++;
  }
  const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
  if(city){
   for(const [x,y,z] of [[city.x,city.y,city.z],
     [city.x-20,city.y+4,city.z+20],
     [city.x+Math.floor(city.rx*.75),city.y,city.z]]) {
    assert.equal(networkAirAt(seed,x,y,z),uncachedNetworkAir(seed,x,y,z));
    matched++;cityCenters++;
   }
  }
 }
 assert.ok(matched>4800);
 assert.ok(cityCenters>=3);
});
