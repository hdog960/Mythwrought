// Opt-in west gallery extension: physical AIR/STONE voxels through the normal world reader.
// Does not alter default world generation, vertical contracts, or saved edits.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey, collides, BODY_HEIGHT, BODY_RADIUS} from './voxel.mjs';
import {CAVE_CANDIDATE, caveRoute} from './experimental-cave-route.mjs';
import {branchedCaveWorld} from './branched-cave-world.mjs';

export function westGalleryWorld(world, origin=CAVE_CANDIDATE) {
  const previous=branchedCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  return {
    seed:world.seed, edits:world.edits,
    get(x,y,z) {
      if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
      if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)return previous.get(x,y,z);
      const t=x-origin.x,d=z-origin.z;
      // Existing west gallery reaches d=-4; the throat continues to -7.
      // A wider terminal chamber has a genuinely connected 3-block-wide approach.
      const throat=t>=12&&t<=14&&d>=-7&&d<=-4;
      const chamber=t>=9&&t<=17&&d>=-11&&d<=-7;
      // A second vaulted room turns east from the first, with an overlapping
      // four-wide connector: a genuine explorable destination, not a sealed void.
      const eastLink=t>=16&&t<=20&&d>=-10&&d<=-8;
      const eastHall=t>=19&&t<=25&&d>=-14&&d<=-7;
      // Return passage joins the primary eastbound corridor near its chamber.
      // This makes the west vault a traversable loop, not a dead-end room.
      const returnPassage=t>=23&&t<=25&&d>=-7&&d<=0;
      // A third, sheltered side cavern beyond the first chamber's north wall.
      // The overlap at d=-11 makes this an actual branch, not a detached void.
      const northAlcove=t>=9&&t<=13&&d>=-16&&d<=-11;
      // A fourth chamber branches north from the eastern vault. The corridor
      // overlaps the vault at d=-14 and reaches the room at d=-17.
      const northSpur=t>=21&&t<=23&&d>=-17&&d<=-13;
      const lanternRoom=t>=19&&t<=26&&d>=-22&&d<=-17;
      if(!throat&&!chamber&&!eastLink&&!eastHall&&!returnPassage&&!northAlcove&&!northSpur&&!lanternRoom)return previous.get(x,y,z);
      const floor=floorAt(t);
      if(y===floor)return BLOCK.STONE;
      if(y>floor&&y<=floor+(eastHall||lanternRoom?6:northAlcove?5:4))return BLOCK.AIR;
      return previous.get(x,y,z);
    }
  };
}

export function westGalleryTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin), t=13,x=origin.x+t;
  const floor=caveRoute(world.seed,origin).floorAt(t);
  const samples=[];
  for(let d=0;d>=-10;d--) {
    const z=origin.z+d, feet=floor+1;
    const supported=reader.get(x,floor,z)!==BLOCK.AIR;
    const headClear=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
    const bodyClear=!collides(reader,x+.5,feet,z+.5);
    samples.push({x,y:feet,z,supported,headClear,bodyClear});
  }
  const failures=samples.filter(s=>!s.supported||!s.headClear||!s.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}

/** Return route through the second hall to the original eastbound cave.
 * Every centerline step must have support and two free head blocks.
 * The path is opt-in and does not change seeded production terrain.
 */
export function westLoopTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin),floorAt=caveRoute(world.seed,origin).floorAt;
  const path=[];
  for(let d=-13;d<=-9;d++)path.push([24,d]);
  for(let d=-8;d<=0;d++)path.push([24,d]);
  const samples=path.map(([t,d])=>{
    const x=origin.x+t,z=origin.z+d,floor=floorAt(t),feet=floor+1;
    const supported=reader.get(x,floor,z)!==BLOCK.AIR;
    const headClear=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
    const bodyClear=!collides(reader,x+.5,feet,z+.5);
    return {x,y:feet,z,supported,headClear,bodyClear};
  });
  const failures=samples.filter(p=>!p.supported||!p.headClear||!p.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}

/** Player-body route from the west gallery into the second vaulted room.
 * Samples every voxel step along the actual connecting centerline.
 */
export function westVaultTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin),floorAt=caveRoute(world.seed,origin).floorAt;
  const path=[];
  for(let d=0;d>=-9;d--)path.push([13,d]);
  for(let t=14;t<=22;t++)path.push([t,-9]);
  for(let d=-10;d>=-13;d--)path.push([22,d]);
  const samples=path.map(([t,d])=>{
    const x=origin.x+t,z=origin.z+d, floor=floorAt(t),feet=floor+1;
    const supported=reader.get(x,floor,z)!==BLOCK.AIR;
    const headClear=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
    const bodyClear=!collides(reader,x+.5,feet,z+.5);
    return {x,y:feet,z,supported,headClear,bodyClear};
  });
  const failures=samples.filter(p=>!p.supported||!p.headClear||!p.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}

/** Fixed-seed player-body trace into the third, north alcove cavern. */
export function northAlcoveTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin),floorAt=caveRoute(world.seed,origin).floorAt;
  const t=11,x=origin.x+t,samples=[];
  for(let d=-9;d>=-15;d--){
    const z=origin.z+d,floor=floorAt(t),feet=floor+1;
    const supported=reader.get(x,floor,z)!==BLOCK.AIR;
    const headClear=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
    const bodyClear=!collides(reader,x+.5,feet,z+.5);
    samples.push({x,y:feet,z,supported,headClear,bodyClear});
  }
  const failures=samples.filter(p=>!p.supported||!p.headClear||!p.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}

/** Full player-body route from the east vault into the fourth north chamber.
 * This is an opt-in voxel reader, not a default seeded-world placement.
 */
export function northSpurTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin),floorAt=caveRoute(world.seed,origin).floorAt;
  const t=22,x=origin.x+t,samples=[];
  for(let d=-12;d>=-21;d--){
    const z=origin.z+d,floor=floorAt(t),feet=floor+1;
    samples.push({
      x,y:feet,z,
      supported:reader.get(x,floor,z)!==BLOCK.AIR,
      headClear:reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR,
      bodyClear:!collides(reader,x+.5,feet,z+.5)
    });
  }
  const failures=samples.filter(p=>!p.supported||!p.headClear||!p.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}
