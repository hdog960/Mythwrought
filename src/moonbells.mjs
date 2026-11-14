// Seed-stable, render-only moonbell flowers: no new blocks, collisions or saves.
// Low opaque petal geometry shares the existing terrain mesh and draw call.
const STRIDE=9, MAX_FLOWERS=7, VERTICES_PER_FLOWER=60;
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
  // A second, uncommon wildflower silhouette brings pale-gold starblooms to
  // the same meadow without changing world blocks, anchors or distribution.
  // Their six pointed petals and lifted centers read differently from bells.
  const starbloom=hash(x,z,world.seed,673)>.76;
  const tint=starbloom
   ? [[.97,.86,.54],[.99,.94,.73]]
   : hash(x,z,world.seed,659)>.5
     ? [[.74,.68,.94],[.89,.80,.98]]
     : [[.64,.79,.94],[.82,.91,.98]];
  const petalCount=starbloom?6:4;
  for(let k=0;k<petalCount;k++){
   const a=turn+k*Math.PI*2/petalCount,dx=Math.cos(a),dz=Math.sin(a);
   const side=[-dz,dx],r=starbloom?.22:.17;
   const droop=starbloom?-.055:-.20;
   const spread=starbloom?.065:.095;
   tri(out,tip,[px+dx*r+side[0]*spread,ground+h+droop,pz+dz*r+side[1]*spread],
      [px+dx*r-side[0]*spread,ground+h+droop,pz+dz*r-side[1]*spread],tint[k%2],7);
  }
  // Two ground-level leaves keep flowers legible without transparent quads.
  for(let k=0;k<2;k++){
   const a=turn+k*Math.PI,dx=Math.cos(a),dz=Math.sin(a);
   tri(out,base,[px+dx*.20-dz*.065,ground+.045,pz+dz*.20+dx*.065],
     [px+dx*.20+dz*.065,ground+.045,pz+dz*.20-dx*.065],[.33,.59,.35],7);
  }
  // Occasional tiny amber forest-floor mushroom beside the bellflower.
  // Both cap triangles are opaque and anchored to the same unedited grass cell.
  if(hash(x,z,world.seed,661)>.67){
   const mx=px+.23,mz=pz-.19,mh=.19+hash(x,z,world.seed,663)*.08;
   const ochre=hash(x,z,world.seed,665)>.5?[.82,.48,.29]:[.93,.68,.40];
   tri(out,[mx-.10,ground+.10,mz],[mx+.10,ground+.10,mz],[mx,ground+mh,mz],ochre,7);
   tri(out,[mx,ground+.10,mz-.10],[mx,ground+.10,mz+.10],[mx,ground+mh,mz],[.95,.77,.54],7);
  }
  // A few shaded meadow edges grow a fern beside the flower. Each frond is
  // opaque, double-facing in silhouette, and shares this anchor's edit rules.
  if(hash(x,z,world.seed,667)>.82){
   // Rare copperberry understory shrubs form a broad, tiered silhouette.
   // Eight opaque leaf/berry facets fit the same per-anchor mesh budget as ferns.
   const sx=px-.23,sz=pz+.18,sh=.30+hash(x,z,world.seed,677)*.14;
   const dark=[.25,.43,.28],light=[.39,.58,.33],berry=[.78,.34,.23];
   for(let tier=0;tier<2;tier++){
    const y0=ground+sh*(tier?.52:.18),wide=tier?.13:.23;
    for(let side=0;side<4;side++){
     const a=side*Math.PI/2+turn,dx=Math.cos(a),dz=Math.sin(a);
     const tint=tier===1&&side===0?berry:(side%2?light:dark);
     tri(out,[sx,y0+sh*.37,sz],
       [sx+dx*wide-dz*.07,y0,sz+dz*wide+dx*.07],
       [sx+dx*wide+dz*.07,y0,sz+dz*wide-dx*.07],tint,7);
    }
   }
  }else if(hash(x,z,world.seed,667)>.48){
   const fx=px-.23,fz=pz+.18,fh=.42+hash(x,z,world.seed,669)*.16;
   const stem=[fx,ground+fh,fz];
   tri(out,[fx-.024,ground,fz],[fx+.024,ground,fz],stem,[.27,.47,.29],7);
   tri(out,[fx,ground,fz-.024],[fx,ground,fz+.024],stem,[.36,.57,.31],7);
   // Three paired leaflets widen toward the base for a recognisable fern shape.
   for(let j=0;j<3;j++){
    const t=.28+j*.23,level=ground+fh*(1-t),reach=.13+t*.15;
    const green=j%2?[.38,.62,.35]:[.30,.54,.32];
    tri(out,[fx,level,fz],[fx-reach,level-.09,fz-.065],[fx-.025,level+.045,fz+.025],green,7);
    tri(out,[fx,level,fz],[fx+reach,level-.09,fz+.065],[fx+.025,level+.045,fz-.025],green,7);
   }
  }
  flowers++;
 }
 if(out.length/STRIDE>MAX_FLOWERS*VERTICES_PER_FLOWER)throw Error('Moonbell vertex budget');
 return new Float32Array(out);
}
export const MOONBELL_LIMITS=Object.freeze({maxFlowersPerChunk:MAX_FLOWERS,maxVerticesPerFlower:VERTICES_PER_FLOWER,stride:STRIDE,newDrawCalls:0,newTextures:0});
