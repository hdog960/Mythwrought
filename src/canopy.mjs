// Original sculpted woodland silhouettes; render-only Gate A visual prototype.
// Trees use the existing terrain draw call and never modify saved schema-1 voxels.
// A mined anchor or obstructed crown removes the entire tree on normal remesh.
const STRIDE=9, MAX_TREES=2, MAX_VERTICES=450;
function hash(x,z,seed,salt){
  let h=Math.imul((x|0)^Math.imul(seed|0,0x45d9f3b),0x27d4eb2d);
  h^=Math.imul((z|0)^salt,0x9e3779b1);
  h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967296;
}
function tri(out,a,b,c,color,mat){
  for(const p of [a,b,c])out.push(...p,...color,0,0,mat);
}
function quad(out,a,b,c,d,color,mat){
  tri(out,a,b,c,color,mat);tri(out,a,c,d,color,mat);
}
function branch(out,x,y,z,rise,angle,reach){
  const end=[x+Math.cos(angle)*reach,y+rise,z+Math.sin(angle)*reach];
  tri(out,[x-.10,y-.1,z],[x+.10,y-.1,z],end,[.49,.31,.20],4);
  tri(out,[x,y-.1,z-.10],[x,y-.1,z+.10],end,[.61,.39,.23],4);
}
function crown(out,x,y,z,r,variation){
  const tint=[[.27,.55,.35],[.34,.65,.41],[.45,.72,.43],[.55,.76,.47]];
  // Layered faceted crown, not crossed transparent billboards.
  const rings=8, lower=[],middle=[],upper=[];
  for(let i=0;i<rings;i++){
    const a=i*Math.PI*2/rings+variation;
    lower.push([x+Math.cos(a)*r*.68,y-.38,z+Math.sin(a)*r*.68]);
    middle.push([x+Math.cos(a)*r,y+.18,z+Math.sin(a)*r]);
    upper.push([x+Math.cos(a)*r*.48,y+.82,z+Math.sin(a)*r*.48]);
  }
  for(let i=0;i<rings;i++){
    const j=(i+1)%rings,col=tint[(i+Math.floor(variation*7))%tint.length];
    quad(out,lower[i],lower[j],middle[j],middle[i],col,7);
    quad(out,middle[i],middle[j],upper[j],upper[i],tint[(i+1)%4],7);
    tri(out,upper[i],upper[j],[x,y+1.14,z],tint[(i+2)%4],7);
  }
}
// Distinct upright evergreen silhouette: stacked, faceted needle tiers.
function evergreen(out,x,y,z,variation){
  const height=4.1+variation*.8;
  const bark=[.48,.30,.19],ring=[[-.16,-.16],[.16,-.16],[.16,.16],[-.16,.16]];
  for(let i=0;i<4;i++){
    const j=(i+1)%4;
    quad(out,[x+ring[i][0],y,z+ring[i][1]],
      [x+ring[j][0],y,z+ring[j][1]],
      [x+ring[j][0]*.65,y+height*.83,z+ring[j][1]*.65],
      [x+ring[i][0]*.65,y+height*.83,z+ring[i][1]*.65],
      i%2?bark:[.59,.39,.24],4);
  }
  const needles=[[.19,.43,.38],[.26,.54,.43],[.34,.61,.46],[.40,.68,.48]];
  for(let tier=0;tier<4;tier++){
    const base=y+.65+tier*.77,rad=1.32-tier*.19;
    const top=base+1.22;
    for(let i=0;i<8;i++){
      const a=(i+variation)*Math.PI/4,b=(i+1+variation)*Math.PI/4;
      const col=needles[(i+tier)%needles.length];
      tri(out,[x+Math.cos(a)*rad,base,z+Math.sin(a)*rad],
        [x+Math.cos(b)*rad,base,z+Math.sin(b)*rad],
        [x,top,z],col,7);
    }
  }
}
export function woodlandTreeStyle(x,z,seed){
  return hash(x,z,seed,67)<.43?'evergreen':'broadleaf';
}
function tree(out,x,y,z,variation){
  const h=3.2+variation*.8, bark=[.52,.34,.23];
  const ring=[[ -.22,-.22],[.22,-.22],[.22,.22],[-.22,.22]];
  for(let i=0;i<4;i++){
    const j=(i+1)%4;
    const a=[x+ring[i][0],y,z+ring[i][1]],b=[x+ring[j][0],y,z+ring[j][1]];
    const c=[x+ring[j][0]*.6,y+h,z+ring[j][1]*.6],d=[x+ring[i][0]*.6,y+h,z+ring[i][1]*.6];
    quad(out,a,b,c,d,i%2?bark:[.63,.43,.27],4);
  }
  for(let i=0;i<3;i++)branch(out,x,y+h*.62,z,.8,i*Math.PI*2/3+variation,1.05);
  crown(out,x,y+h-.35,z,1.25,variation);
  crown(out,x-.45,y+h-.85,z+.18,.83,variation+.3);
  crown(out,x+.48,y+h-.7,z-.22,.87,variation+.7);
}
export function woodlandCanopyVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
     !Number.isInteger(cx)||!Number.isInteger(cz)||
     typeof heightAt!=='function'||typeof baseAt!=='function'||
     !Number.isInteger(chunkSize)||chunkSize<12||chunkSize>64)
    throw Error('Invalid woodland canopy inputs');
  const out=[];let count=0;
  // Candidate centers stay within each chunk: no canopy crosses a chunk seam.
  for(let i=0;i<4&&count<MAX_TREES;i++){
    const x=cx*chunkSize+3+Math.floor(hash(cx+i,cz,world.seed,19)*(chunkSize-6));
    const z=cz*chunkSize+3+Math.floor(hash(cx,cz+i,world.seed,31)*(chunkSize-6));
    if(hash(cx+i,cz-i,world.seed,43)>.45)continue;
    const h=heightAt(x,z,world.seed);
    if(baseAt(x,h,z,world.seed)!==grass||world.get(x,h,z)!==grass)continue;
    let clear=true;
    // Clear the trunk and broad crown footprint; do not visually obscure builds.
    for(let dx=-2;dx<=2&&clear;dx++)for(let dz=-2;dz<=2&&clear;dz++)
      for(let dy=1;dy<=6;dy++)
        if(world.get(x+dx,h+dy,z+dz)!==air){clear=false;break;}
    if(!clear)continue;
    const style=woodlandTreeStyle(x,z,world.seed);
    (style==='evergreen'?evergreen:tree)(out,x+.5,h+1.01,z+.5,hash(x,z,world.seed,59));count++;
  }
  if(out.length/STRIDE>MAX_TREES*MAX_VERTICES)
    throw Error('Woodland canopy exceeded vertex budget');
  return new Float32Array(out);
}
export const CANOPY_LIMITS=Object.freeze({maxTreesPerChunk:MAX_TREES,maxVerticesPerTree:MAX_VERTICES,stride:STRIDE,newDrawCalls:0,newTextures:0});
