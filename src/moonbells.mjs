// Seed-stable, render-only moonbell flowers: no new blocks, collisions or saves.
// Low opaque petal geometry shares the existing terrain mesh and draw call.
const STRIDE=9, MAX_FLOWERS=7, VERTICES_PER_FLOWER=30;
function hash(x,z,seed,salt){
 let n=Math.imul((x|0)^seed^salt,0x9e3779b1)^Math.imul((z|0)+salt,0x85ebca6b);
 n^=n>>>16;n=Math.imul(n,0x7feb352d);n^=n>>>15;return (n>>>0)/4294967296;
}
function tri(out,a,b,c,color,mat=7){for(const p of [a,b,c])out.push(...p,...color,0,0,mat);}
export function moonbellVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
 !Number.isInteger(cx)||!Number.isInteger(cz)||typeof heightAt!=='function'||
 typeof baseAt!=='function'||chunkSize!==16)throw Error('Invalid moonbell scene');
 const out=[];let flowers=0;
 // Sparse clustered blooms create a recognisable patch, not random pixel noise.
 const cluster=hash(Math.floor(cx/3),Math.floor(cz/3),world.seed,613);
 if(cluster>.43)return new Float32Array();
 for(let i=0;i<14&&flowers<MAX_FLOWERS;i++){
  const x=cx*16+2+Math.floor(hash(cx*17+i,cz,world.seed,619)*12);
  const z=cz*16+2+Math.floor(hash(cx,cz*19+i,world.seed,631)*12);
  if(hash(x,z,world.seed,641)>.58)continue;
  const y=heightAt(x,z,world.seed);
  if(baseAt(x,y,z,world.seed)!==grass||world.get(x,y,z)!==grass)continue;
  // An edited/roofed space or cliff face is not a flower meadow.
  if(world.get(x,y+1,z)!==air||world.get(x,y+2,z)!==air)continue;
  const h=.36+hash(x,z,world.seed,647)*.22,turn=hash(x,z,world.seed,653)*Math.PI*2;
  const px=x+.5,pz=z+.5,ground=y+1.015;
  const tip=[px,ground+h,pz],base=[px,ground,pz];
  tri(out,[px-.035,ground,pz], [px+.035,ground,pz],tip,[.31,.53,.33],7);
  tri(out,[px,ground,pz-.035],[px,ground,pz+.035],tip,[.43,.65,.36],7);
  const tint=hash(x,z,world.seed,659)>.5?[[.74,.68,.94],[.89,.80,.98]]:[[.64,.79,.94],[.82,.91,.98]];
  // Four downward bell petals, visible from every walking direction.
  for(let k=0;k<4;k++){
   const a=turn+k*Math.PI/2,dx=Math.cos(a),dz=Math.sin(a);
   const side=[-dz,dx],r=.17;
   tri(out,tip,[px+dx*r+side[0]*.095,ground+h-.20,pz+dz*r+side[1]*.095],
      [px+dx*r-side[0]*.095,ground+h-.20,pz+dz*r-side[1]*.095],tint[k%2],7);
  }
  // Two ground-level leaves keep flowers legible without transparent quads.
  for(let k=0;k<2;k++){
   const a=turn+k*Math.PI,dx=Math.cos(a),dz=Math.sin(a);
   tri(out,base,[px+dx*.20-dz*.065,ground+.045,pz+dz*.20+dx*.065],
     [px+dx*.20+dz*.065,ground+.045,pz+dz*.20-dx*.065],[.33,.59,.35],7);
  }
  flowers++;
 }
 if(out.length/STRIDE>MAX_FLOWERS*VERTICES_PER_FLOWER)throw Error('Moonbell vertex budget');
 return new Float32Array(out);
}
export const MOONBELL_LIMITS=Object.freeze({maxFlowersPerChunk:MAX_FLOWERS,maxVerticesPerFlower:VERTICES_PER_FLOWER,stride:STRIDE,newDrawCalls:0,newTextures:0});
