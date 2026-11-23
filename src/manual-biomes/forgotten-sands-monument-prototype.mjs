// MYTHWROUGHT Forgotten Sands, isolated Phase 0 geometry research.
// NOT imported by gameplay. No world writes, registry edits, or live height changes.
// All cells are ordinary integer world coordinates and existing block IDs.
const AIR = 0, STONE = 3, ORE = 6;
const CHUNK_SIZE = 16;
const safeInt = Number.isSafeInteger;

export function definePrototypePyramid({seed, x, z, baseY, size = 63, height = 54}) {
  if (![seed,x,z,baseY,size,height].every(safeInt) || size < 15 ||
      size > 127 || size % 2 !== 1 || height < 12 || height > size) {
    throw Error('Invalid isolated pyramid prototype');
  }
  const radius = (size-1)/2;
  return Object.freeze({
    seed,x,z,baseY,size,height,radius,
    minX:x-radius,maxX:x+radius,minZ:z-radius,maxZ:z+radius,
    minY:baseY-2,maxY:baseY+height-1
  });
}

// null means this landmark proposes NO cell. AIR is reserved for the engine's
// own ground/cave and player-edit layers; this prototype never emits AIR edits.
export function prototypePyramidBlock(site,x,y,z) {
  if (![x,y,z].every(safeInt) || !site ||
      x<site.minX || x>site.maxX || z<site.minZ || z>site.maxZ ||
      y<site.minY || y>site.maxY) return null;
  const dx=x-site.x, dz=z-site.z;
  if (y<site.baseY) return STONE;
  const level=y-site.baseY;
  const radius=site.radius-Math.floor(level/2);
  if (radius<0 || Math.max(Math.abs(dx),Math.abs(dz))>radius) return null;
  // The prototype demonstrates a fully physical interior and walk-in passage.
  // A Phase 5 authored pyramid needs substantially more architectural design.
  const chamber=level>=1 && level<=10 && Math.abs(dx)<=5 && Math.abs(dz)<=5;
  const entrance=level>=1 && level<=4 && Math.abs(dx)<=1 && dz<=-5;
  if (chamber || entrance) return null;
  // Seed-preserving, coordinate-anchored erosion/accent sample, no RNG calls.
  const rim=Math.max(Math.abs(dx),Math.abs(dz))===radius;
  const mark=((Math.imul(x,73856093)^Math.imul(y,19349663)^
    Math.imul(z,83492791)^site.seed)>>>0)%37;
  return rim && mark===0 ? ORE : STONE;
}

// Each queried chunk computes only its own bounded slice from one global site.
// No neighboring chunk needs to load first; no Map of the entire structure.
export function prototypePyramidChunk(site,cx,cz) {
  if (![cx,cz].every(safeInt) || !site) throw Error('Invalid prototype chunk');
  const minX=Math.max(site.minX,cx*CHUNK_SIZE);
  const maxX=Math.min(site.maxX,cx*CHUNK_SIZE+CHUNK_SIZE-1);
  const minZ=Math.max(site.minZ,cz*CHUNK_SIZE);
  const maxZ=Math.min(site.maxZ,cz*CHUNK_SIZE+CHUNK_SIZE-1);
  if (minX>maxX || minZ>maxZ) return [];
  const result=[];
  for(let x=minX;x<=maxX;x++) for(let z=minZ;z<=maxZ;z++)
    for(let y=site.minY;y<=site.maxY;y++) {
      const id=prototypePyramidBlock(site,x,y,z);
      if(id!==null)result.push([x,y,z,id]);
    }
  return result;
}

export function prototypePyramidChunkBounds(site) {
  if(!site)throw Error('Missing prototype site');
  return Object.freeze({
    minCX:Math.floor(site.minX/CHUNK_SIZE),maxCX:Math.floor(site.maxX/CHUNK_SIZE),
    minCZ:Math.floor(site.minZ/CHUNK_SIZE),maxCZ:Math.floor(site.maxZ/CHUNK_SIZE)
  });
}

export const PROTOTYPE_BLOCK_IDS=Object.freeze({AIR,STONE,ORE});
