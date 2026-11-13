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

// Four low, tapered root buttresses anchor trees visually into editable ground.
// Pure mesh detail: no collision, drops, world writes or saved data changes.
function roots(out,x,y,z,variation){
  const colors=[[.43,.28,.18],[.56,.36,.22],[.64,.43,.27],[.49,.32,.20]];
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2+variation*.18,dx=Math.cos(a),dz=Math.sin(a);
    const side=[-dz,dx],spread=.47+variation*.15;
    const foot=[x+dx*spread,y+.025,z+dz*spread];
    const left=[x+side[0]*.17,y+.54,z+side[1]*.17];
    const right=[x-side[0]*.17,y+.54,z-side[1]*.17];
    tri(out,left,right,foot,colors[i],4);
  }
}
// Sparse faceted sunlit leaf tips add depth without transparent sprites.
function crownHighlights(out,x,y,z,r,variation){
  const hues=[[.61,.79,.49],[.50,.72,.42],[.70,.81,.52]];
  for(let i=0;i<4;i++){
    const a=(i+variation)*Math.PI/2;
    const dx=Math.cos(a),dz=Math.sin(a);
    tri(out,[x+dx*r*.50,y+.72,z+dz*r*.50],
      [x+dx*r*.80-dz*.13,y+.40,z+dz*r*.80+dx*.13],
      [x+dx*r*.80+dz*.13,y+.40,z+dz*r*.80-dx*.13],
      hues[i%hues.length],7);
  }
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
function evergreen(out,x,y,z,variation,beacon=false){
  // Rare golden-tipped sentinel pines are visual landmarks, not world objects.
  // Keep their original footprint and triangle count; only silhouette/colour vary.
  const height=(beacon?6.6:4.1)+variation*.8;
  const bark=[.48,.30,.19],ring=[[-.16,-.16],[.16,-.16],[.16,.16],[-.16,.16]];
  for(let i=0;i<4;i++){
    const j=(i+1)%4;
    quad(out,[x+ring[i][0],y,z+ring[i][1]],
      [x+ring[j][0],y,z+ring[j][1]],
      [x+ring[j][0]*.65,y+height*.83,z+ring[j][1]*.65],
      [x+ring[i][0]*.65,y+height*.83,z+ring[i][1]*.65],
      i%2?bark:[.59,.39,.24],4);
  }
  roots(out,x,y,z,variation);
  const needles=beacon?
    [[.25,.48,.40],[.39,.62,.43],[.58,.70,.39],[.78,.77,.45]]:
    [[.19,.43,.38],[.26,.54,.43],[.34,.61,.46],[.40,.68,.48]];
  for(let tier=0;tier<4;tier++){
    const base=y+.65+tier*(beacon?1.26:.77),rad=(beacon?1.48:1.32)-tier*.19;
    const top=base+(beacon?1.8:1.22);
    for(let i=0;i<8;i++){
      const a=(i+variation)*Math.PI/4,b=(i+1+variation)*Math.PI/4;
      const col=needles[(i+tier)%needles.length];
      tri(out,[x+Math.cos(a)*rad,base,z+Math.sin(a)*rad],
        [x+Math.cos(b)*rad,base,z+Math.sin(b)*rad],
        [x,top,z],col,7);
      // A small sun-facing facet makes layered needle tiers readable at phone scale.
      if(i%2===0)tri(out,[x+Math.cos(a)*rad*.79,base+.10,z+Math.sin(a)*rad*.79],
        [x+Math.cos(b)*rad*.79,base+.10,z+Math.sin(b)*rad*.79],
        [x,top-.15,z],needles[(i+tier+1)%needles.length],7);
    }
  }
}
// One distinctive sentinel candidate in a small fraction of wooded chunks.
// A deterministic, render-only visual marker; never persisted or harvested.
export function woodlandSentinelChunk(cx,cz,seed){
  if(!Number.isInteger(cx)||!Number.isInteger(cz)||!Number.isInteger(seed))
    throw Error('Invalid woodland sentinel coordinates');
  return hash(cx,cz,seed,211)<.075;
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
  roots(out,x,y,z,variation);
  for(let i=0;i<3;i++)branch(out,x,y+h*.62,z,.8,i*Math.PI*2/3+variation,1.05);
  crown(out,x,y+h-.35,z,1.25,variation);
  crown(out,x-.45,y+h-.85,z+.18,.83,variation+.3);
  crown(out,x+.48,y+h-.7,z-.22,.87,variation+.7);
  crownHighlights(out,x,y+h-.35,z,1.25,variation);
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
    const sentinel=count===0&&woodlandSentinelChunk(cx,cz,world.seed);
    let clear=true;
    // Tall sentinel tiers must not visually cover player-built blocks above the old six-block clearance.
    for(let dx=-2;dx<=2&&clear;dx++)for(let dz=-2;dz<=2&&clear;dz++)
      for(let dy=1;dy<=(sentinel?9:6);dy++)
        if(world.get(x+dx,h+dy,z+dz)!==air){clear=false;break;}
    if(!clear)continue;
    const style=woodlandTreeStyle(x,z,world.seed);
    (sentinel?evergreen:(style==='evergreen'?evergreen:tree))(
      out,x+.5,h+1.01,z+.5,hash(x,z,world.seed,59),sentinel);count++;
  }
  if(out.length/STRIDE>MAX_TREES*MAX_VERTICES)
    throw Error('Woodland canopy exceeded vertex budget');
  return new Float32Array(out);
}
export const CANOPY_LIMITS=Object.freeze({maxTreesPerChunk:MAX_TREES,maxVerticesPerTree:MAX_VERTICES,stride:STRIDE,newDrawCalls:0,newTextures:0});
