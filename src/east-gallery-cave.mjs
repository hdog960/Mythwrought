// :24 optional east-facing side chamber off the existing south gallery.
// This is NOT enabled in liveVoxelDistrict; preserve all seeded baseline voxels.
// No new IDs, engine-Y edits, player edits, or persistent save changes.
import {BLOCK,WORLD_MIN_Y,WORLD_MAX_Y,worldKey,collides} from './voxel.mjs';
import {caveRoute,CAVE_CANDIDATE} from './experimental-cave-route.mjs';
import {southGalleryCaveWorld} from './south-gallery-cave.mjs';

export function eastGalleryCaveWorld(world,origin=CAVE_CANDIDATE){
  if(origin.length<24)throw Error('Cave too short for east gallery');
  const prior=southGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9, floor=floorAt(anchor);
  return {seed:world.seed,edits:world.edits,get(x,y,z){
    if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
    const t=x-origin.x,d=z-origin.z;
    // One-block throat plus 7x5 chamber, connected to south gallery at d=8.
    const throat=t>=anchor&&t<=anchor+2&&d>=7&&d<=9;
    const room=t>=anchor+2&&t<=anchor+8&&d>=6&&d<=10;
    if(!(throat||room)||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return prior.get(x,y,z);
    if(y===floor)return BLOCK.STONE;
    if(y>floor&&y<=floor+4)return BLOCK.AIR;
    return prior.get(x,y,z);
  }};
}
export function eastGalleryTrace(world,origin=CAVE_CANDIDATE){
  const reader=eastGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9,floor=floorAt(anchor);
  const samples=[];
  for(let t=anchor;t<=anchor+8;t++){
    const x=origin.x+t,z=origin.z+8,feet=floor+1;
    samples.push({x,z,feet,supported:reader.get(x,floor,z)!==BLOCK.AIR,
      headroom:reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR,
      bodyClear:!collides(reader,x+.5,feet,z+.5)});
  }
  const transitions=[];
  for(let i=1;i<samples.length;i++){
    const a=samples[i-1],b=samples[i];
    transitions.push({from:i-1,to:i,
      stepValid:Math.abs(a.feet-b.feet)<=1,
      bodyClear:!collides(reader,(a.x+b.x)/2+.5,Math.max(a.feet,b.feet),(a.z+b.z)/2+.5)});
  }
  const failures=samples.filter(p=>!p.supported||!p.headroom||!p.bodyClear);
  const blockedTransitions=transitions.filter(p=>!p.stepValid||!p.bodyClear);
  return {samples,transitions,failures,blockedTransitions,
    walkable:failures.length===0&&blockedTransitions.length===0,
    anchor:{x:origin.x+anchor,y:floor+1,z:origin.z+8},
    chamber:{x:origin.x+anchor+8,y:floor+1,z:origin.z+8}};
}

// Check the *whole* chamber, not merely its centerline. A valid center route
// can conceal a sealed side pocket or a saved-edit obstruction near a wall.
// Samples are voxel centers; swept midpoint checks use the production body
// collider and never mutate the base seeded world.
export function eastGalleryChamberTrace(world,origin=CAVE_CANDIDATE){
  const reader=eastGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9, floor=floorAt(anchor), feet=floor+1;
  const cells=[],edges=[];
  for(let t=anchor+2;t<=anchor+8;t++){
    for(let d=6;d<=10;d++){
      const x=origin.x+t,z=origin.z+d;
      const supported=reader.get(x,floor,z)!==BLOCK.AIR;
      const headroom=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
      const bodyClear=!collides(reader,x+.5,feet,z+.5);
      cells.push({t,d,x,z,supported,headroom,bodyClear,passable:supported&&headroom&&bodyClear});
    }
  }
  const byKey=new Map(cells.map(c=>[c.t+','+c.d,c]));
  const start=byKey.get((anchor+2)+',8');
  const visited=new Set(),queue=start?.passable?[start]:[];
  if(queue.length)visited.add(start.t+','+start.d);
  for(let i=0;i<queue.length;i++){
    const a=queue[i];
    for(const [dt,dd] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const b=byKey.get((a.t+dt)+','+(a.d+dd));
      if(!b?.passable)continue;
      const key=b.t+','+b.d;
      const clear=!collides(reader,(a.x+b.x)/2+.5,feet,(a.z+b.z)/2+.5);
      edges.push({from:[a.t,a.d],to:[b.t,b.d],clear});
      if(clear&&!visited.has(key)){visited.add(key);queue.push(b);}
    }
  }
  const unreachable=cells.filter(c=>!visited.has(c.t+','+c.d));
  return {cells,edges,unreachable,reachableCount:visited.size,
    walkable:unreachable.length===0&&cells.length===35,
    entry:{x:origin.x+anchor+2,y:feet,z:origin.z+8}};
}

// Verify a continuous player-body route from the south gallery's central aisle
// into the east chamber. This is still an opt-in collision reader, not live terrain.
export function eastGalleryConnectionTrace(world,origin=CAVE_CANDIDATE){
  const reader=eastGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9;
  const route=[
    ...Array.from({length:6},(_,i)=>({t:anchor-2,d:3+i})),
    {t:anchor-1,d:8},
    ...Array.from({length:9},(_,i)=>({t:anchor+i,d:8}))
  ];
  const samples=route.map(({t,d})=>{
    const x=origin.x+t,z=origin.z+d,feet=floorAt(anchor)+1;
    const floor=feet-1;
    return {x,z,feet,
      supported:reader.get(x,floor,z)!==BLOCK.AIR,
      headroom:reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR,
      bodyClear:!collides(reader,x+.5,feet,z+.5)};
  });
  const transitions=[];
  for(let i=1;i<samples.length;i++){
    const a=samples[i-1],b=samples[i];
    transitions.push({from:i-1,to:i,
      cardinal:Math.abs(a.x-b.x)+Math.abs(a.z-b.z)===1,
      clear:!collides(reader,(a.x+b.x)/2+.5,Math.max(a.feet,b.feet),(a.z+b.z)/2+.5)});
  }
  return {samples,transitions,
    walkable:samples.every(s=>s.supported&&s.headroom&&s.bodyClear)&&
      transitions.every(t=>t.cardinal&&t.clear)};
}
