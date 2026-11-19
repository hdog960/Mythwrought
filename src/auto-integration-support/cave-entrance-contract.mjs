// Read-only six-neighbor cave/surface handshake; fixture proof is not integration proof.
const valid=c=>c&&[c.x,c.y,c.z].every(Number.isSafeInteger);
const key=c=>[c.x,c.y,c.z].join(',');
export function inspectEntranceHandshake({surface,cave,bounds,cells,isPassable,maxSteps=4096}={}){
 const errors=[];
 if(!valid(surface)||!valid(cave))errors.push('invalid endpoint');
 if(!bounds||!Number.isSafeInteger(bounds.minY)||!Number.isSafeInteger(bounds.maxY)||bounds.minY>bounds.maxY)errors.push('invalid bounds');
 if(!Array.isArray(cells)||!cells.length)errors.push('missing cells');
 if(typeof isPassable!=='function')errors.push('missing passability predicate');
 if(!Number.isSafeInteger(maxSteps)||maxSteps<1||maxSteps>100000)errors.push('invalid budget');
 if(errors.length)return {status:'NOT_VERIFIED',errors,connected:false};
 if(surface.y<bounds.minY||surface.y>bounds.maxY||cave.y<bounds.minY||cave.y>bounds.maxY||cave.y>surface.y)errors.push('endpoint outside surface/depth contract');
 const map=new Map();
 for(const c of cells){
  if(!valid(c)||c.y<bounds.minY||c.y>bounds.maxY){errors.push('invalid route cell');break;}
  const k=key(c);if(map.has(k)){errors.push('duplicate route cell');break;}map.set(k,c);
 }
 if(errors.length)return {status:'NOT_VERIFIED',errors,connected:false};
 if(!map.has(key(surface))||!map.has(key(cave)))return {status:'NOT_VERIFIED',errors:['missing route endpoint'],connected:false};
 const passable=new Set();
 try{for(const [k,c] of map)if(isPassable(Object.freeze({...c}))===true)passable.add(k);}
 catch{return {status:'NOT_VERIFIED',errors:['passability predicate failed'],connected:false};}
 if(!passable.has(key(surface))||!passable.has(key(cave)))return {status:'NOT_VERIFIED',errors:['blocked endpoint'],connected:false};
 const queue=[surface],seen=new Set([key(surface)]);
 for(let i=0;i<queue.length;i++){
  if(i>=maxSteps)return {status:'NOT_VERIFIED',errors:['budget exhausted'],connected:false,visited:i};
  const c=queue[i];
  if(key(c)===key(cave))return {status:'FIXTURE_CONNECTED_ONLY',errors:[],connected:true,integrationVerified:false,visited:i+1};
  for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const n={x:c.x+dx,y:c.y+dy,z:c.z+dz};if(!valid(n))continue;
   const k=key(n);if(passable.has(k)&&!seen.has(k)){seen.add(k);queue.push(map.get(k));}
  }
 }
 return {status:'NOT_VERIFIED',errors:['no six-neighbor route'],connected:false,visited:queue.length};
}
