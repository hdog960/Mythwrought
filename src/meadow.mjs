// Mythwrought v0.10 Gate A: original low-poly voxel meadow accents.
// Render-only decoration: no voxel IDs, save schema, hitboxes, inventory,
// world generator or authored settlement placement is changed.
const STRIDE=9;
const MAX_ACCENTS_PER_CHUNK=56;
const FACE_INDICES=[0,1,2,0,2,3];
const STEM=[.28,.62,.32];
const GRASS_A=[.30,.62,.29];
const GRASS_B=[.47,.72,.34];
const PETALS=[
  [.99,.59,.77], // rose-pink
  [.68,.65,.99], // lilac
  [.97,.81,.46], // marigold
  [.56,.78,.99]  // cornflower
];
const GOLD=[.99,.89,.58];
function hash2(x,z,seed,salt){
  let h=Math.imul((x|0)^Math.imul(seed|0,0x45d9f3b),0x27d4eb2d);
  h^=Math.imul((z|0)^salt,0x165667b1);
  h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967296;
}
function pushQuad(out,x,y,z,dx,dz,width,height,color,mat){
  const half=width*.5,points=[
    [x-dx*half,y,z-dz*half],
    [x-dx*half,y+height,z-dz*half],
    [x+dx*half,y+height,z+dz*half],
    [x+dx*half,y,z+dz*half]
  ],uv=[[0,0],[0,1],[1,1],[1,0]];
  for(const i of FACE_INDICES){
    out.push(...points[i],...color,uv[i][0],uv[i][1],mat);
  }
}
function drawGrass(out,x,y,z,h,kind){
  const color=kind?GRASS_B:GRASS_A;
  // Crossed, low geometric tufts; no animated alpha textures or new draw call.
  pushQuad(out,x,y,z,1,0,.19,h,color,7);
  pushQuad(out,x,y,z,0,1,.19,h*.83,color,7);
}
function drawFlower(out,x,y,z,color,reach){
  const height=.48+reach*.20;
  // Two crossed stems and two crossed, deliberately chunky flower heads.
  pushQuad(out,x,y,z,1,0,.060,height*.76,STEM,7);
  pushQuad(out,x,y,z,0,1,.060,height*.76,STEM,7);
  const headY=y+height*.62;
  pushQuad(out,x,headY,z,1,0,.29,.20,color,8);
  pushQuad(out,x,headY,z,0,1,.29,.20,color,8);
  const coreY=headY+.055;
  pushQuad(out,x,coreY,z,1,0,.078,.090,GOLD,9);
  pushQuad(out,x,coreY,z,0,1,.078,.090,GOLD,9);
}
// Deterministic global coordinate placement across positive/negative seams.
// The optional biome detail sits in the EXISTING chunk buffer, never a new
// GPU buffer or draw call. The stem and petals are visual only.
export function meadowAccentVertices(world,cx,cz,{chunkSize=16,heightAt,grass=1,air=0}={}){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(cx)||!Number.isInteger(cz)||!Number.isInteger(chunkSize)||
    chunkSize<1||chunkSize>64||typeof heightAt!=='function')
    throw Error('Invalid meadow accent inputs');
  const out=[];
  let count=0;
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++){
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      if(count>=MAX_ACCENTS_PER_CHUNK)break;
      const h=heightAt(x,z,world.seed);
      // The original grass voxel is the only anchor. Mining or blocking that
      // voxel makes the accent disappear on the next existing mesh rebuild.
      if(world.get(x,h,z)!==grass||world.get(x,h+1,z)!==air)continue;
      const roll=hash2(x,z,world.seed,19);
      if(roll>=.17)continue;
      const u=.32+hash2(x,z,world.seed,27)*.36;
      const v=.32+hash2(x,z,world.seed,31)*.36;
      const jitter=hash2(x,z,world.seed,37);
      const x0=x+u,z0=z+v,y0=h+1.006;
      if(roll<.075){
        const index=Math.floor(hash2(x,z,world.seed,41)*PETALS.length);
        drawFlower(out,x0,y0,z0,PETALS[index],jitter);
      }else{
        drawGrass(out,x0,y0,z0,.24+jitter*.20,jitter>.5);
      }
      count++;
    }
  }
  return new Float32Array(out);
}
export const MEADOW_MATERIALS=Object.freeze({grass:7,petal:8,core:9,maxAccents:MAX_ACCENTS_PER_CHUNK,stride:STRIDE});
