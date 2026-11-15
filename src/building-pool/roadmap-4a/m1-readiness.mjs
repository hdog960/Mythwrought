// Read-only quality census for Roadmap 4 theoretical structures.
// A discrete voxel path is NOT an in-engine player AABB or real stair collision test.
import {validateBlueprint} from './schema.mjs';
import {allM1} from './m1-blueprints.mjs';
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
const adjacent=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const id=([x,y,z])=>[x,y,z].join(',');
export function examineBlueprint(b){
  validateBlueprint(b);
  const blocks=new Map(b.cells.map(c=>[id(c.at),c]));
  const nav=new Map(b.navigation.map(n=>[id(n.at),n]));
  const entries=b.openings.filter(o=>o.kind==='entrance');
  if(entries.length!==1)throw Error(b.id+': one explicit exterior entrance is required by M1');
  const first=id(entries[0].at),queue=[first],dist=new Map([[first,0]]),parents=new Map();
  for(let cursor=0;cursor<queue.length;cursor++){
    const now=nav.get(queue[cursor]);if(!now)throw Error(b.id+': missing route cell');
    const [x,y,z]=now.at;
    for(const [dx,dz] of dirs)for(let dy=-1;dy<=1;dy++){
      const next=[x+dx,y+dy,z+dz],k=id(next),node=nav.get(k);
      if(!node||dist.has(k)||dy!==0&&now.mode!=='stair'&&node.mode!=='stair')continue;
      dist.set(k,dist.get(queue[cursor])+1);
      parents.set(k,queue[cursor]);queue.push(k);
    }
  }
  if(dist.size!==nav.size)throw Error(b.id+': some approved route cells cannot be reached');
  const rooms=[];
  for(const room of b.spaces){
    const key=id(room.access);
    if(!dist.has(key))throw Error(b.id+': inaccessible functional room '+room.id);
    const footprints=new Map(room.footprint.map(f=>[f.join(','),f]));
    const start=room.footprint[0],area=[start],seen=new Set([start.join(',')]);
    for(let p=0;p<area.length;p++){
      const [x,z]=area[p];
      for(const [dx,dz] of dirs){
        const candidate=[x+dx,z+dz],k=candidate.join(',');
        if(footprints.has(k)&&!seen.has(k)){seen.add(k);area.push(candidate);}
      }
    }
    if(seen.size!==room.footprint.length)throw Error(b.id+': functional room has disconnected islands '+room.id);
    let k=key,steps=0;
    while(parents.has(k)){
      const here=nav.get(k),previous=nav.get(parents.get(k));
      if(here.mode==='stair'||previous.mode==='stair')steps++;
      k=parents.get(k);
    }
    if(room.level>1&&!steps)throw Error(b.id+': upper floor room has no stair route '+room.id);
    rooms.push({id:room.id,level:room.level,tiles:room.footprint.length,fromEntrance:dist.get(key),stairEdges:steps});
  }
  let quads=0;
  for(const c of b.cells)for(const d of adjacent){
    const key=id([c.at[0]+d[0],c.at[1]+d[1],c.at[2]+d[2]]);
    if(!blocks.has(key))quads++;
  }
  // The isolated preview uses 2 triangles/quad, 6 vertices/quad,
  // position(3)+color(3) Float32 attributes = 144 bytes per exposed quad.
  const previewBufferBytes=quads*144;
  const deps=b.dependencies.map(dep=>{
    const used=b.cells.filter(c=>c.asset===dep.ref),roles=[...new Set(used.map(c=>c.role))].sort();
    if(!used.length||!dep.unresolved?.length)throw Error(b.id+': incomplete symbolic asset handoff '+dep.ref);
    return {ref:dep.ref,count:used.length,roles,orientations:[...new Set(used.map(c=>c.facing))].sort(),unresolved:dep.unresolved};
  });
  return {id:b.id,biome:b.biome,size:b.size,type:b.type,cells:b.cells.length,
    navigation:nav.size,rooms,entrances:entries.length,
    occupiedFloors:b.architecturalNotes.storyCount,exposedQuads:quads,
    previewTriangles:quads*2,previewBufferBytes,
    worldPlaced:false,physicalAssetAcceptance:false,webgl2Measured:false,
    symbolicAssets:deps};
}
export function examineAllM1(){
  const reports=allM1().map(examineBlueprint);
  const total=key=>reports.reduce((sum,r)=>sum+r[key],0);
  return {designs:reports.length,cells:total('cells'),navigation:total('navigation'),
    rooms:reports.reduce((n,r)=>n+r.rooms.length,0),exposedQuads:total('exposedQuads'),
    largestPreviewBufferBytes:Math.max(...reports.map(r=>r.previewBufferBytes)),
    longestRoomDistance:Math.max(...reports.flatMap(r=>r.rooms.map(s=>s.fromEntrance))),
    allRoomRoutesVerified:reports.every(r=>r.rooms.every(room=>room.level===1||room.stairEdges>0)),
    actualGPUFrameTime:null,webgl2Certified:false,creatorAccepted:false,
    reports};
}
