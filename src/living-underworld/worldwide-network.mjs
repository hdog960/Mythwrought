// The Living Underworld — Phase 2 isolated world-spanning physical AIR proposal.
// This module is NOT imported by any live game world, saved profile, renderer or PWA.
// Graph connectivity is a deterministic planning property; playable traversal,
// cavern density, actual entrances and iPhone performance are NOT yet accepted.
export const UNDERWORLD_REGION_SIDE=256;
export const UNDERWORLD_LEVELS=Object.freeze([
  Object.freeze({name:'upper',y:-27}),
  Object.freeze({name:'middle',y:-74}),
  Object.freeze({name:'deep',y:-127}),
  Object.freeze({name:'lowest',y:-179})
]);
const seedOK=s=>Number.isSafeInteger(s)&&s===(s|0);
function hash(seed,a,b,c){
  let h=Math.imul(seed|0,0x9e3779b1)^Math.imul(a|0,0x85ebca6b)^
    Math.imul(b|0,0xc2b2ae35)^Math.imul(c|0,0x27d4eb2d);
  h=Math.imul(h^(h>>>16),0x7feb352d);
  h=Math.imul(h^(h>>>15),0x846ca68b);
  return (h^(h>>>16))>>>0;
}
const point=(x,y,z)=>Object.freeze({x,y,z});
const limit=(v,min,max)=>Math.max(min,Math.min(max,v));
function edge(seed,rx,rz,axis,level){
  const salt=level*401+(axis==='x'?17:29);
  const along=72+hash(seed,rx,rz,salt)%112;
  const y=UNDERWORLD_LEVELS[level].y+hash(seed,rx,rz,salt+1)%9-4;
  return axis==='x'?point((rx+1)*UNDERWORLD_REGION_SIDE,y,rz*UNDERWORLD_REGION_SIDE+along):
    point(rx*UNDERWORLD_REGION_SIDE+along,y,(rz+1)*UNDERWORLD_REGION_SIDE);
}
function tube(a,b,radius){
  return Object.freeze({a,b,radius,
    bounds:Object.freeze({
      minX:Math.min(a.x,b.x)-radius,maxX:Math.max(a.x,b.x)+radius,
      minY:Math.min(a.y,b.y)-radius,maxY:Math.max(a.y,b.y)+radius,
      minZ:Math.min(a.z,b.z)-radius,maxZ:Math.max(a.z,b.z)+radius
    })
  });
}
function inTube(x,y,z,t){
  const b=t.bounds;if(x<b.minX||x>b.maxX||y<b.minY||y>b.maxY||z<b.minZ||z>b.maxZ)return false;
  const dx=t.b.x-t.a.x,dy=(t.b.y-t.a.y)*1.5,dz=t.b.z-t.a.z;
  const px=x-t.a.x,py=(y-t.a.y)*1.5,pz=z-t.a.z;
  const denom=dx*dx+dy*dy+dz*dz;
  const fraction=denom?limit((px*dx+py*dy+pz*dz)/denom,0,1):0;
  const ax=px-fraction*dx,ay=py-fraction*dy,az=pz-fraction*dz;
  return ax*ax+ay*ay+az*az<=t.radius*t.radius;
}
function inRoom(x,y,z,r){
  if(Math.abs(x-r.x)>r.rx||Math.abs(y-r.y)>r.ry||Math.abs(z-r.z)>r.rz)return false;
  const a=(x-r.x)/r.rx,b=(y-r.y)/r.ry,c=(z-r.z)/r.rz;
  return a*a+b*b+c*c<=1;
}
const cache=new Map(),MAX_CACHED_REGIONS=48;
export function planUnderworldRegion(seed,rx,rz){
  if(!seedOK(seed)||![rx,rz].every(Number.isSafeInteger))
    throw new TypeError('Invalid underworld region coordinates');
  const key=seed+':'+rx+':'+rz;
  if(cache.has(key))return cache.get(key);
  const layers=[],capsules=[];
  for(let i=0;i<UNDERWORLD_LEVELS.length;i++){
    const level=UNDERWORLD_LEVELS[i];
    const hub=point(rx*UNDERWORLD_REGION_SIDE+102+hash(seed,rx,rz,100+i)%53,
      level.y+hash(seed,rx,rz,200+i)%9-4,
      rz*UNDERWORLD_REGION_SIDE+102+hash(seed,rx,rz,300+i)%53);
    const room=Object.freeze({x:hub.x,y:hub.y,z:hub.z,
      rx:17+hash(seed,rx,rz,400+i)%12,
      ry:8+hash(seed,rx,rz,500+i)%5,
      rz:17+hash(seed,rx,rz,600+i)%12});
    const portals=Object.freeze({
      west:edge(seed,rx-1,rz,'x',i),
      east:edge(seed,rx,rz,'x',i),
      north:edge(seed,rx,rz-1,'z',i),
      south:edge(seed,rx,rz,'z',i)
    });
    for(const [j,direction] of ['west','east','north','south'].entries()){
      const destination=portals[direction],bend=hash(seed,rx,rz,700+i*7+j);
      const mid=point(
        Math.round((hub.x+destination.x)/2)+(bend%25)-12,
        Math.round((hub.y+destination.y)/2)+(Math.floor(bend/25)%5)-2,
        Math.round((hub.z+destination.z)/2)+(Math.floor(bend/125)%25)-12);
      const width=4.6+(bend%3);
      capsules.push(tube(hub,mid,width),tube(mid,destination,width));
    }
    layers.push(Object.freeze({name:level.name,hub,room,portals}));
    if(i>0)capsules.push(tube(layers[i-1].hub,hub,5.6));
  }
  // The physical access socket stops immediately UNDER the protected -3 surface.
  // A future biome-aware surface planner must decide how to cut the actual mouth.
  const socket=point(layers[0].hub.x,-4,layers[0].hub.z);
  capsules.push(tube(layers[0].hub,socket,4.6));
  let cityCandidate=null;
  if(hash(seed,rx,rz,9187)%13===0){
    const level=layers[2+hash(seed,rx,rz,9188)%2];
    cityCandidate=Object.freeze({x:level.hub.x+5,y:level.hub.y,z:level.hub.z-5,
      rx:100+hash(seed,rx,rz,9189)%70,
      ry:18+hash(seed,rx,rz,9190)%11,
      rz:100+hash(seed,rx,rz,9191)%62,
      status:'geometry-candidate-only'});
  }
  const result=Object.freeze({
    seed,rx,rz,regionSide:UNDERWORLD_REGION_SIDE,
    layers:Object.freeze(layers),capsules:Object.freeze(capsules),
    surfaceSocket:socket,cityCandidate
  });
  cache.set(key,result);
  if(cache.size>MAX_CACHED_REGIONS)cache.delete(cache.keys().next().value);
  return result;
}
// Immutable 3x3 rare-cavern neighborhood cache, bounded independently of
// region graph cache. Stores site metadata only, NEVER voxel answers or edits.
// No change to planned region topology, saves, mining or player collision.
const rareCityNeighborhoods=new Map(),MAX_RARE_NEIGHBORHOODS=48;
function nearbyRareCities(seed,rx,rz){
  const key=seed+':'+rx+':'+rz;
  let sites=rareCityNeighborhoods.get(key);
  if(sites===undefined){
    const found=[];
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
      const city=planUnderworldRegion(seed,rx+dx,rz+dz).cityCandidate;
      if(city)found.push(city);
    }
    sites=Object.freeze(found);
    rareCityNeighborhoods.set(key,sites);
    if(rareCityNeighborhoods.size>MAX_RARE_NEIGHBORHOODS)
      rareCityNeighborhoods.delete(rareCityNeighborhoods.keys().next().value);
  }
  return sites;
}
export function networkAirAt(seed,x,y,z){
  if(!seedOK(seed)||![x,y,z].every(Number.isSafeInteger))
    throw new TypeError('Invalid underground voxel coordinates');
  if(y<-210||y>-4)return false;
  const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
  const local=planUnderworldRegion(seed,rx,rz);
  if(local.layers.some(layer=>inRoom(x,y,z,layer.room)))return true;
  if(local.capsules.some(t=>inTube(x,y,z,t)))return true;
  // Rare city candidates can cross region seams, but querying the *same*
  // region repeatedly no longer requires nine plan/cache lookups per voxel.
  for(const city of nearbyRareCities(seed,rx,rz))
    if(inRoom(x,y,z,city))return true;
  return false;
}
export function auditUnderworldRegionGraph(seed,rx,rz){
  const here=planUnderworldRegion(seed,rx,rz);
  const east=planUnderworldRegion(seed,rx+1,rz);
  const south=planUnderworldRegion(seed,rx,rz+1);
  const north=planUnderworldRegion(seed,rx,rz-1);
  const west=planUnderworldRegion(seed,rx-1,rz);
  const joins=here.layers.map((l,i)=>Object.freeze({
    depth:l.name,
    west:JSON.stringify(l.portals.west)===JSON.stringify(west.layers[i].portals.east),
    east:JSON.stringify(l.portals.east)===JSON.stringify(east.layers[i].portals.west),
    north:JSON.stringify(l.portals.north)===JSON.stringify(north.layers[i].portals.south),
    south:JSON.stringify(l.portals.south)===JSON.stringify(south.layers[i].portals.north)
  }));
  return Object.freeze({
    seed,rx,rz,
    joins:Object.freeze(joins),
    passed:joins.every(j=>j.west&&j.east&&j.north&&j.south),
    caveMouthConnectedToSurface:false,
    traversableTraversalVerified:false,
    citySiteBuildabilityVerified:false
  });
}
