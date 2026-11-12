// MYTHWROUGHT v0.10 Gate A — original hand-authored cave-wall sigils.
// Cosmetic wall pigments only: no placed blocks, lore unlocks, collision,
// mine targets, light sources, persisted data or expensive animation.
const GOLD=[.99,.76,.39],TEAL=[.45,.92,.88];
const SEGMENTS=[
  [.50,.14,.50,.78], // trunk
  [.50,.56,.27,.81], [.50,.56,.73,.81], // fork
  [.50,.36,.24,.48], [.50,.36,.76,.48], // roots
  [.30,.16,.70,.16], // foot
  [.50,.80,.59,.88], [.59,.88,.50,.95],
  [.50,.95,.41,.88], [.41,.88,.50,.80] // star-crown
];
const FACES=[
  [1,0,0],[-1,0,0],[0,0,1],[0,0,-1]
];
const MAX_SIGILS=8,MAX_VERTICES=SEGMENTS.length*6;
function hash(x,y,z,seed,salt){
 let h=Math.imul((x|0)^(seed|0),0x27d4eb2d);
 h^=Math.imul((y|0)^salt,0x165667b1);
 h^=Math.imul((z|0),0x51ed270b);
 h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
 return (h>>>0)/4294967296;
}
function point(x,y,z,face,u,v){
 const [dx,,dz]=face,eps=.008;
 if(dx===1)return [x+1+eps,y+v,z+u];
 if(dx===-1)return [x-eps,y+v,z+1-u];
 if(dz===1)return [x+1-u,y+v,z+1+eps];
 return [x+u,y+v,z-eps];
}
function stroke(out,x,y,z,face,u1,v1,u2,v2,width,color,material){
 const du=u2-u1,dv=v2-v1,len=Math.hypot(du,dv);
 if(len===0)return;
 const pu=-dv/len*width*.5,pv=du/len*width*.5;
 const verts=[
   point(x,y,z,face,u1-pu,v1-pv),
   point(x,y,z,face,u2-pu,v2-pv),
   point(x,y,z,face,u2+pu,v2+pv),
   point(x,y,z,face,u1+pu,v1+pv)
 ],order=[0,1,2,0,2,3],uv=[[0,0],[0,1],[1,1],[1,0]];
 for(const i of order)out.push(...verts[i],...color,...uv[i],material);
}
export function caveRuneVertices(world,cx,cz,{
  chunkSize=16,minY=-3,maxY=19,heightAt,baseAt,air=0,stone=3,ore=6
}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(cx)||!Number.isInteger(cz)||!Number.isInteger(chunkSize)||
    chunkSize<1||chunkSize>64||!Number.isInteger(minY)||
    !Number.isInteger(maxY)||maxY<=minY||
    typeof heightAt!=='function'||typeof baseAt!=='function')
   throw Error('Invalid cave rune inputs');
 const out=[];let count=0;
 for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++)
  for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
   if(count>=MAX_SIGILS)break;
   const ceiling=Math.min(maxY-1,heightAt(x,z,world.seed)-3);
   for(let y=minY+2;y<=ceiling;y++){
    if(count>=MAX_SIGILS)break;
    const original=baseAt(x,y,z,world.seed);
    if((original!==stone&&original!==ore)||world.get(x,y,z)!==original)continue;
    for(let side=0;side<FACES.length;side++){
     if(count>=MAX_SIGILS)break;
     const face=FACES[side],nx=x+face[0],nz=z+face[2];
     // Only a naturally open cave side supports an original rune. Filling the
     // cave or removing its rock eliminates the glyph when the mesh rebuilds.
     if(baseAt(nx,y,nz,world.seed)!==air||world.get(nx,y,nz)!==air||
        world.get(nx,y+1,nz)!==air)continue;
     const chance=hash(x,y,z,world.seed,side+19);
     if(chance>.055)continue;
     const accent=hash(x,y,z,world.seed,side+71)>.76;
     for(const [u1,v1,u2,v2] of SEGMENTS)
      stroke(out,x,y,z,face,u1,v1,u2,v2,.036,
        accent?TEAL:GOLD,accent?14:13);
     count++;
    }
   }
  }
 return new Float32Array(out);
}
export const CAVE_RUNE_LIMITS=Object.freeze({
  maxSigilsPerChunk:MAX_SIGILS,verticesPerSigil:MAX_VERTICES,
  materials:Object.freeze([13,14]),strokeCount:SEGMENTS.length
});
