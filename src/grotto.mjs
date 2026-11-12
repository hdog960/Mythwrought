// MYTHWROUGHT v0.10 Gate A — original seed-stable luminous grotto artwork.
// Fully cosmetic, noncolliding meshes only on naturally exposed, currently
// unmodified cave stone. No new blocks, saves, rooms, lighting or progression.
const INDICES=[0,1,2,0,2,3];
const MAX=24,STRIDE=9;
const COLORS={
  stems:[.29,.57,.61],
  cyan:[.29,.91,.98],
  lilac:[.71,.48,.97],
  rose:[.96,.53,.77],
  blue:[.36,.68,.99],
  prism:[.47,.91,.97],
  prismShade:[.34,.62,.87],
  gold:[.98,.81,.46]
};
function hash(x,y,z,seed,salt){
  let a=Math.imul((x|0)^Math.imul(seed|0,0x45d9f3b),0x27d4eb2d);
  a^=Math.imul((y|0)^salt,0x165667b1);
  a^=Math.imul((z|0)^0x51ed270b,0x9e3779b1);
  a^=a>>>16;a=Math.imul(a,0x85ebca6b);a^=a>>>13;
  return (a>>>0)/4294967296;
}
function triangle(out,p,q,r,color,mat){
  for(const v of [p,q,r])out.push(v[0],v[1],v[2],...color,0,0,mat);
}
function quad(out,p,q,r,t,color,mat){
  for(const idx of INDICES){
    const v=[p,q,r,t][idx],uv=[[0,0],[0,1],[1,1],[1,0]][idx];
    out.push(v[0],v[1],v[2],...color,uv[0],uv[1],mat);
  }
}
function crossed(out,x,y,z,w,h,color,mat){
  quad(out,[x-w/2,y,z],[x-w/2,y+h,z],[x+w/2,y+h,z],[x+w/2,y,z],color,mat);
  quad(out,[x,y,z-w/2],[x,y+h,z-w/2],[x,y+h,z+w/2],[x,y,z+w/2],color,mat);
}
function mushroom(out,x,y,z,u,color){
  const height=.35+u*.20,capY=y+height*.76;
  crossed(out,x,y,z,.070,height,COLORS.stems,10);
  // Four broad, low-polygon gills stand proud of the cave floor.
  crossed(out,x,capY,z,.42+u*.12,.11,color,11);
  // A small gold seed-spore head brings back warmth in darker caves.
  crossed(out,x,capY+.085,z,.10,.09,COLORS.gold,12);
}
function crystal(out,x,y,z,u){
  const h=.43+u*.31,r=.12+u*.05;
  const tip=[x,y+h,z],a=[x-r,y,z],b=[x,y,z+r],
    c=[x+r,y,z],d=[x,y,z-r];
  triangle(out,a,tip,b,COLORS.prism,11);
  triangle(out,b,tip,c,COLORS.prismShade,11);
  triangle(out,c,tip,d,COLORS.prism,11);
  triangle(out,d,tip,a,COLORS.prismShade,11);
}
// baseAt is the original seeded generator. Reject unnatural player-dug voids
// and player-built supports, so excavation cannot create free decoration.
export function grottoAccentVertices(world,cx,cz,{
  chunkSize=16,minY=-3,maxY=19,heightAt,baseAt,air=0,stone=3,ore=6
}={}){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(cx)||!Number.isInteger(cz)||
    !Number.isInteger(chunkSize)||chunkSize<1||chunkSize>64||
    !Number.isInteger(minY)||!Number.isInteger(maxY)||maxY<=minY||
    typeof heightAt!=='function'||typeof baseAt!=='function')
    throw Error('Invalid natural grotto geometry inputs');
  const out=[];
  let count=0;
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++){
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      if(count>=MAX)break;
      const h=Math.min(maxY-2,heightAt(x,z,world.seed)-3);
      for(let y=minY+2;y<=h;y++){
        if(count>=MAX)break;
        // Only the original open pocket is eligible, with 2 voxels of
        // clearance and its original stone/ore floor still physically present.
        if(baseAt(x,y,z,world.seed)!==air||world.get(x,y,z)!==air||
          world.get(x,y+1,z)!==air)continue;
        const support=baseAt(x,y-1,z,world.seed);
        if((support!==stone&&support!==ore)||world.get(x,y-1,z)!==support)continue;
        const chance=hash(x,y,z,world.seed,19);
        if(chance>.34)continue;
        const v=hash(x,y,z,world.seed,31),u=hash(x,y,z,world.seed,41);
        const xx=x+.30+u*.4,zz=z+.30+v*.4,yy=y+.006;
        if(chance<.23){
          const color=[COLORS.cyan,COLORS.lilac,COLORS.rose,COLORS.blue]
            [Math.floor(hash(x,y,z,world.seed,57)*4)];
          mushroom(out,xx,yy,zz,u,color);
        }else{
          crystal(out,xx,yy,zz,u);
        }
        count++;
      }
    }
  }
  return new Float32Array(out);
}
export const GROTTO_LIMITS=Object.freeze({
  maxAccentsPerChunk:MAX,maxVerticesPerAccent:36,stride:STRIDE,
  materialIds:Object.freeze([10,11,12])
});
