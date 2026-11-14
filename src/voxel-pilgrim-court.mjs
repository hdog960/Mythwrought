// Gate A :36 — a two-gateway pilgrim court built entirely from integrated STONE voxels.
// Opt-in only: never changes seeded terrain, spawn, or saved worlds on import.
import {planVoxelRuinedArch,placeVoxelRuinedArch} from './voxel-ruined-arch.mjs';

export function planVoxelPilgrimCourt(world,x,z){
  if(!Number.isInteger(x)||!Number.isInteger(z))return null;
  // Two distinct, parallel, walk-through gates with an open nine-block approach.
  const south=planVoxelRuinedArch(world,x,z-9);
  const north=planVoxelRuinedArch(world,x,z+9);
  if(!south||!north||south.origin[1]!==north.origin[1])return null;
  const cells=[...south.cells,...north.cells];
  const keys=new Set(cells.map(([a,b,c])=>a+','+b+','+c));
  if(keys.size!==cells.length)return null;
  const h=south.origin[1];
  // The entire connecting corridor must be naturally walkable and untouched.
  for(let dz=-6;dz<=6;dz++)for(let dx=-1;dx<=1;dx++){
    const px=x+dx,pz=z+dz;
    for(let dy=0;dy<=3;dy++){
      const expected=world.get(px,h+dy,pz);
      // The route is level, with ground at h and clear headroom.
      if(dy===0 ? expected!==world.get(x,h,z) : expected!==0)return null;
    }
  }
  return Object.freeze({
    origin:[x,h,z],gates:[south,north],cells,blockCount:cells.length,
    entrance:[x,h+1,z-11],exit:[x,h+1,z+11],materialIds:[3],optIn:true
  });
}

// Revalidates both gateways and the corridor before any writes. Not atomic if
// a world.set implementation fails mid-write: integration must provide a batch
// transaction before exposing this as an interactive construction command.
export function placeVoxelPilgrimCourt(world,plan){
  if(!plan?.optIn||!Array.isArray(plan.origin)||!Array.isArray(plan.cells))return false;
  const [x,h,z]=plan.origin;
  const fresh=planVoxelPilgrimCourt(world,x,z);
  if(!fresh||fresh.origin[1]!==h||fresh.cells.length!==plan.cells.length)return false;
  if(!plan.cells.every((cell,i)=>Array.isArray(cell)&&cell.length===4&&cell.every((v,j)=>v===fresh.cells[i][j])))return false;
  if(typeof world.set!=='function')return false;
  // Each gateway is built from the already-integrated validated stone template.
  return placeVoxelRuinedArch(world,fresh.gates[0])&&placeVoxelRuinedArch(world,fresh.gates[1]);
}
