// Seed-stable, render-only moonbell flowers: no new blocks, collisions or saves.
// Low opaque petal geometry shares the existing terrain mesh and draw call.
const STRIDE=9, MAX_FLOWERS=7, VERTICES_PER_FLOWER=144;
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
  // Rare violet lantern fungi punctuate shaded meadow edges. Their opaque,
  // pointed four-sided caps and pale stalks contrast with squat ochre caps.
  // Both varieties remain decorative, edit-sensitive and unlit (no glow cost).
  if(hash(x,z,world.seed,661)>.67){
   const mx=px+.23,mz=pz-.19,mh=.19+hash(x,z,world.seed,663)*.08;
   const lantern=hash(x,z,world.seed,683)>.77;
   if(lantern){
    const stemTop=ground+mh+.12,capY=stemTop-.055;
    tri(out,[mx-.023,ground,mz],[mx+.023,ground,mz],[mx,stemTop,mz],[.73,.77,.67],7);
    tri(out,[mx,ground,mz-.023],[mx,ground,mz+.023],[mx,stemTop,mz],[.61,.69,.62],7);
    const tip=[mx,stemTop+.095,mz],r=.13;
    for(let k=0;k<4;k++){
     const a=turn+k*Math.PI/2,b=a+Math.PI/2;
     tri(out,[mx+Math.cos(a)*r,capY,mz+Math.sin(a)*r],
       [mx+Math.cos(b)*r,capY,mz+Math.sin(b)*r],tip,
       k%2?[.65,.49,.86]:[.82,.67,.95],7);
    }
   }else{
    const ochre=hash(x,z,world.seed,665)>.5?[.82,.48,.29]:[.93,.68,.40];
    tri(out,[mx-.10,ground+.10,mz],[mx+.10,ground+.10,mz],[mx,ground+mh,mz],ochre,7);
    tri(out,[mx,ground+.10,mz-.10],[mx,ground+.10,mz+.10],[mx,ground+mh,mz],[.95,.77,.54],7);
   }
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
  // Rare silverleaf spires mark meadow margins with a tall, readable silhouette.
  // Each is an opaque, wind-swept stem with paired silver-green blades; it
  // inherits the anchor's roof/edit suppression and costs no new draw call.
  if(hash(x,z,world.seed,691)>.89){
   const rx=px+.17,rz=pz+.16,rh=.64+hash(x,z,world.seed,697)*.16;
   const lean=(hash(x,z,world.seed,701)-.5)*.22;
   const apex=[rx+lean,ground+rh,rz-lean*.4];
   tri(out,[rx-.027,ground,rz],[rx+.027,ground,rz],apex,[.35,.54,.43],7);
   tri(out,[rx,ground,rz-.027],[rx,ground,rz+.027],apex,[.43,.61,.48],7);
   for(let j=0;j<3;j++){
    const t=.28+j*.23,level=ground+rh*t,reach=.19-j*.035;
    const mid=rx+lean*t;
    tri(out,[mid,level,rz],[mid-reach,level+.12,rz-.055],
      [mid-.035,level+.18,rz+.025],j%2?[.63,.75,.65]:[.74,.83,.73],7);
    tri(out,[mid,level,rz],[mid+reach,level+.12,rz+.055],
      [mid+.035,level+.18,rz-.025],j%2?[.54,.70,.61]:[.68,.80,.70],7);
   }
  }
  // Rare ivory seedheads create a light, upright meadow accent. Their compact
  // four-facet crown is opaque and inherits the existing grass/roof edit guard.
  if(hash(x,z,world.seed,709)>.92){
   const sx=px-.12,sz=pz-.16,sh=.48+hash(x,z,world.seed,719)*.13;
   const crown=[sx,ground+sh,sz];
   tri(out,[sx-.018,ground,sz],[sx+.018,ground,sz],crown,[.42,.56,.37],7);
   tri(out,[sx,ground,sz-.018],[sx,ground,sz+.018],crown,[.50,.62,.43],7);
   for(let k=0;k<4;k++){
    const a=turn+k*Math.PI/2,dx=Math.cos(a),dz=Math.sin(a);
    tri(out,crown,[sx+dx*.115-dz*.045,ground+sh-.07,sz+dz*.115+dx*.045],
      [sx+dx*.115+dz*.045,ground+sh-.07,sz+dz*.115-dx*.045],
      k%2?[.91,.91,.76]:[.98,.96,.85],7);
   }
  }
  // Stone-edge fan moss grows only beside real exposed solid terrain, not at
  // imaginary cave entrances. It is render-only and follows grass edits.
  const edgeDirs=[[1,0],[-1,0],[0,1],[0,-1]];
  const rockEdges=edgeDirs.filter(([dx,dz])=>{
   const b=world.get(x+dx,y+1,z+dz);
   return b===3; // Natural exposed stone only; never decorate constructed blocks.
  });
  if(rockEdges.length&&hash(x,z,world.seed,733)>.42){
   const [dx,dz]=rockEdges[Math.floor(hash(x,z,world.seed,739)*rockEdges.length)];
   const ox=px+dx*.23,oz=pz+dz*.23;
   const fanTurn=Math.atan2(dz,dx)+Math.PI;
   for(let j=0;j<5;j++){
    const a=fanTurn+(j-2)*.32,reach=.18+(2-Math.abs(j-2))*.045;
    const vx=Math.cos(a),vz=Math.sin(a);
    tri(out,[ox,ground+.045,oz],
      [ox+vx*reach-vz*.065,ground+.13+reach*.4,oz+vz*reach+vx*.065],
      [ox+vx*reach+vz*.065,ground+.13+reach*.4,oz+vz*reach-vx*.065],
      j%2?[.40,.65,.43]:[.56,.73,.49],7);
   }
  }
  // Pale cave-edge lichen drapes from genuine exposed stone beside this grass.
  // No false entrance marker: the rock must be natural stone and its front
  // face must be exposed above the same walkable ground as the anchor.
  if(rockEdges.length&&hash(x,z,world.seed,751)>.72){
   const [dx,dz]=rockEdges[0],rx=px+dx*.37,rz=pz+dz*.37;
   // Only the stone's open-facing edge gets lichen; never buried faces.
   if(world.get(x,y+1,z)===air){
    for(let k=0;k<3;k++){
     const offset=(k-1)*.095,drop=.18+hash(x+k,z,world.seed,757)*.17;
     const sidewaysX=-dz*offset,sidewaysZ=dx*offset;
     tri(out,[rx+sidewaysX,ground+.32,rz+sidewaysZ],
       [rx+sidewaysX-dx*.045,ground+.32-drop,rz+sidewaysZ-dz*.045],
       [rx+sidewaysX-dz*.035,ground+.30-drop*.65,rz+sidewaysZ+dx*.035],
       k%2?[.68,.79,.60]:[.79,.84,.68],7);
    }
   }
  }
  // Amber shelf fungi cling to genuine exposed stone facing the grass.
  // Three layered opaque caps create a broad horizontal silhouette, with no
  // lighting, particles, collisions or additional world blocks.
  if(rockEdges.length&&hash(x,z,world.seed,769)>.79){
   const [dx,dz]=rockEdges[Math.floor(hash(x,z,world.seed,773)*rockEdges.length)];
   const sideX=-dz,sideZ=dx;
   const rootX=px+dx*.40,rootZ=pz+dz*.40;
   for(let tier=0;tier<3;tier++){
    const level=ground+.15+tier*.12;
    const spread=.16-tier*.025,reach=.13-tier*.02;
    const tint=tier%2?[.86,.58,.31]:[.95,.72,.43];
    tri(out,[rootX,level,rootZ],
      [rootX-dx*reach+sideX*spread,level-.035,rootZ-dz*reach+sideZ*spread],
      [rootX-dx*reach-sideX*spread,level-.035,rootZ-dz*reach-sideZ*spread],tint,7);
   }
  }
  // Rare blue-green dew fronds lean out from genuine natural rock faces.
  // They are opaque, unlit and use the same stone adjacency and grass edit guard.
  if(rockEdges.length&&hash(x,z,world.seed,787)>.84){
   const [dx,dz]=rockEdges[Math.floor(hash(x,z,world.seed,797)*rockEdges.length)];
   const sideX=-dz,sideZ=dx,rootX=px+dx*.30,rootZ=pz+dz*.30;
   const rise=.35+hash(x,z,world.seed,809)*.16;
   const top=[rootX-dx*.12,ground+rise,rootZ-dz*.12];
   tri(out,[rootX-.025,ground+.02,rootZ],[rootX+.025,ground+.02,rootZ],
     top,[.24,.48,.48],7);
   for(let j=0;j<4;j++){
    const t=.22+j*.19,level=ground+rise*t,spread=.10+j*.016;
    const midX=rootX-dx*.12*t,midZ=rootZ-dz*.12*t;
    const tipX=midX-dx*.06,tipZ=midZ-dz*.06;
    for(const sign of [-1,1]){
     tri(out,[midX,level,midZ],
       [tipX+sideX*spread*sign,level+.075,tipZ+sideZ*spread*sign],
       [midX+sideX*.025*sign,level+.115,midZ+sideZ*.025*sign],
       j%2?[.42,.72,.67]:[.55,.80,.74],7);
    }
   }
  }
  // Frostglass rosettes are rare, unlit stone-facing cave-edge accents.
  // The layered turquoise blades read as a crystalline flower without adding
  // a block ID, transparency, dynamic lights, particles or new draw calls.
  // They only grow at exposed natural stone beside an unedited grass anchor.
  if(rockEdges.length&&hash(x,z,world.seed,823)>.91){
   const [dx,dz]=rockEdges[Math.floor(hash(x,z,world.seed,827)*rockEdges.length)];
   const sx=-dz,sz=dx,rx=px+dx*.30,rz=pz+dz*.30;
   const center=[rx-dx*.045,ground+.15,rz-dz*.045];
   for(let blade=0;blade<6;blade++){
    const angle=blade*Math.PI/3+turn;
    const lateral=Math.cos(angle),forward=Math.sin(angle);
    const reach=.12+(blade%2)*.055;
    const bx=rx+sx*lateral*reach-dx*forward*.08;
    const bz=rz+sz*lateral*reach-dz*forward*.08;
    tri(out,center,
      [bx+sx*.035,ground+.06,bz+sz*.035],
      [bx-sx*.035,ground+.06,bz-sz*.035],
      blade%2?[.54,.83,.79]:[.72,.91,.85],7);
   }
   tri(out,[rx,ground+.15,rz],
     [rx+sx*.05,ground+.29,rz+sz*.05],
     [rx-sx*.05,ground+.29,rz-sz*.05],[.88,.96,.90],7);
  }
  flowers++;
 }
 if(out.length/STRIDE>MAX_FLOWERS*VERTICES_PER_FLOWER)throw Error('Moonbell vertex budget');
 return new Float32Array(out);
}
export const MOONBELL_LIMITS=Object.freeze({maxFlowersPerChunk:MAX_FLOWERS,maxVerticesPerFlower:VERTICES_PER_FLOWER,stride:STRIDE,newDrawCalls:0,newTextures:0});
