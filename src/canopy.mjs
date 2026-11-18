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
  const colors=[[.43,.29,.19],[.50,.34,.23],[.54,.37,.26],[.46,.31,.21]];
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2+variation*.28,dx=Math.cos(a),dz=Math.sin(a);
    const side=[-dz,dx],spread=.33+variation*.10;
    // Short, earth-contact buttresses: the old .54-high, .6-wide paper
    // triangles looked like detached red spikes around a narrow trunk.
    // Both upper corners meet inside the existing trunk silhouette, while
    // each lower root rests 0.016 above the grass top, with no extra faces.
    const foot=[x+dx*spread,y+.016,z+dz*spread];
    const left=[x+dx*.13+side[0]*.12,y+.31,z+dz*.13+side[1]*.12];
    const right=[x+dx*.13-side[0]*.12,y+.31,z+dz*.13-side[1]*.12];
    tri(out,left,right,foot,colors[i],4);
  }
}
// Low-poly fern fans, forest-floor amber leaves and mossy stones give each
// woodland anchor a grounded clearing. These are decorative render vertices,
// not new blocks: mining the anchor removes the whole composition on remesh.
function woodlandFloor(out,x,y,z,variation){
  const greens=[[.28,.55,.37],[.40,.64,.39],[.51,.69,.40]];
  for(let fan=0;fan<3;fan++){
    // Ferns gather into a readable sunward patch instead of an even ring.
    const a=variation*Math.PI*2+fan*.42-.42,dx=Math.cos(a),dz=Math.sin(a);
    const reach=.57+(fan%2)*.17,side=[-dz,dx];
    const center=[x+dx*.20,y+.08,z+dz*.20];
    const tip=[x+dx*reach,y+.20+(fan%2)*.10,z+dz*reach];
    tri(out,center,
      [tip[0]+side[0]*.15,tip[1]-.08,tip[2]+side[1]*.15],
      [tip[0]-side[0]*.15,tip[1]-.08,tip[2]-side[1]*.15],
      greens[fan%greens.length],7);
  }
  const amber=[[.80,.52,.25],[.70,.39,.23],[.88,.67,.32]];
  for(let i=0;i<3;i++){
    // Leaf litter collects on the opposite side of the trunk.
    const a=variation*Math.PI*2+Math.PI+(i-1)*.52,dx=Math.cos(a),dz=Math.sin(a);
    const px=x+dx*.72,pz=z+dz*.72;
    tri(out,[px-.10,y+.035,pz-.08],[px+.12,y+.038,pz-.04],
      [px+.01,y+.04,pz+.12],amber[i],7);
  }
  // One low stone offsets the fern patch without extra GPU allocation.
  for(let i=0;i<1;i++){
    const a=variation*Math.PI*2+Math.PI*.62,dx=Math.cos(a),dz=Math.sin(a);
    const px=x+dx*.88,pz=z+dz*.88;
    const grey=i?[.47,.53,.43]:[.55,.59,.47];
    tri(out,[px-.17,y+.035,pz-.12],[px+.15,y+.035,pz-.12],
      [px,y+.22,pz+.04],grey,3);
    tri(out,[px+.15,y+.035,pz-.12],[px+.08,y+.035,pz+.15],
      [px,y+.22,pz+.04],grey,3);
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
  // The former three perfectly level octagons produced stacked tabletop
  // edges when several crowns overlapped. Keep identical triangle/vertex
  // counts, but scallop all three rings with deterministic, connected facets.
  const rings=8,lower=[],middle=[],upper=[];
  for(let i=0;i<rings;i++){
    const a=i*Math.PI*2/rings+variation;
    const ca=Math.cos(a),sa=Math.sin(a);
    const l=.65+.065*Math.sin(a*3+variation*6);
    const m=.90+.095*Math.cos(a*3-variation*4);
    const u=.44+.06*Math.sin(a*5+variation*3);
    lower.push([x+ca*r*l,y-.38+.095*Math.sin(a*2+variation),z+sa*r*l]);
    middle.push([x+ca*r*m,y+.14+.155*Math.cos(a*2-variation),z+sa*r*m]);
    upper.push([x+ca*r*u,y+.76+.13*Math.sin(a*3+variation),z+sa*r*u]);
  }
  const apex=[x+Math.cos(variation*6)*r*.08,y+1.14,z+Math.sin(variation*6)*r*.08];
  for(let i=0;i<rings;i++){
    const j=(i+1)%rings,col=tint[(i+Math.floor(variation*7))%tint.length];
    quad(out,lower[i],lower[j],middle[j],middle[i],col,7);
    quad(out,middle[i],middle[j],upper[j],upper[i],tint[(i+1)%4],7);
    tri(out,upper[i],upper[j],apex,tint[(i+2)%4],7);
  }
}
// Distinct upright evergreen silhouette: stacked, faceted needle tiers.
function evergreen(out,x,y,z,variation,beacon=false,profile='mixed'){
  // Rare golden-tipped sentinel pines are visual landmarks, not world objects.
  // Keep their original footprint and triangle count; only silhouette/colour vary.
  const height=(beacon?6.6:profile==='grove'?4.75:profile==='open'?3.55:4.1)+variation*.8;
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
  woodlandFloor(out,x,y,z,variation);
  const needles=beacon?
    [[.25,.48,.40],[.39,.62,.43],[.58,.70,.39],[.78,.77,.45]]:
    [[.19,.43,.38],[.26,.54,.43],[.34,.61,.46],[.40,.68,.48]];
  // M2 A/B visual correction: the uninterrupted six-ring fir was too tall
  // and read as a single smooth traffic cone. Keep its JOINED ring vertices
  // (no detached hats), but shorten the crown, widen its lower shoulders and
  // root eight uneven, downward-sweeping boughs onto the exact perimeter.
  // All shapes are render-only; physical leaves, seed sites and saves remain
  // byte-identical. Opaque facets reuse the current terrain draw call.
  const canopyHeight=beacon?4.65:Math.min(4.15,height*.85);
  const maxRadius=beacon?1.43:profile==='grove'?1.38:profile==='open'?1.09:1.29;
  const levels=[0,.18,.37,.56,.76,.96];
  const radii=[.90,1.04,.87,.73,.52,.16];
  const boughRings=[];
  for(let level=0;level<levels.length;level++){
    const t=levels[level],verts=[];
    for(let i=0;i<8;i++){
      const a=(i+variation)*Math.PI/4+t*(.07+variation*.09);
      const wave=Math.sin(i*2.37+level*1.63+variation*5.1);
      const rad=maxRadius*radii[level]*(.92+.12*wave);
      const bend=t*t*.085;
      verts.push([
        x+Math.cos(a)*rad+Math.sin(variation*6)*bend,
        y+.46+t*canopyHeight+.055*Math.sin(i*2.2+level+variation*4),
        z+Math.sin(a)*rad+Math.cos(variation*5)*bend
      ]);
    }
    boughRings.push(verts);
  }
  // Shared vertices on both sides of every band guarantee contiguous foliage
  // and reject the previous detached triangle/cone silhouette.
  for(let level=0;level<boughRings.length-1;level++){
    const lower=boughRings[level],upper=boughRings[level+1];
    for(let i=0;i<8;i++){
      const j=(i+1)%8;
      quad(out,lower[i],lower[j],upper[j],upper[i],
        needles[(i+level)%needles.length],7);
    }
  }
  const cap=boughRings[boughRings.length-1];
  const peak=[x+Math.sin(variation*6)*.12,
    y+.46+canopyHeight+.07,z+Math.cos(variation*5)*.12];
  for(let i=0;i<8;i++){
    const j=(i+1)%8;
    tri(out,cap[i],cap[j],peak,
      beacon?[[.78,.82,.45],[.88,.82,.50]][i%2]:
        needles[(i+2)%needles.length],7);
  }
  // Eight seed-varied bough lobes extend the joined silhouette beyond the
  // smooth cone side. Each lobe is TWO attached triangles reaching a tip
  // below its branch origin. No leaf hangs free: the three shared vertices
  // are already occupied by the continuous live canopy mesh. Maximum source
  // evergreen: 444 vertices including sentinel halo/band/star (<450 limit).
  for(let level=0;level<4;level++)for(let fork=0;fork<2;fork++){
    const i=(Math.floor(variation*8)+level*2+fork*4)%8,j=(i+1)%8;
    const p=boughRings[level][i],q=boughRings[level][j],
      upper=boughRings[level+1][i];
    const angle=(i+.5+variation)*Math.PI/4;
    const reach=maxRadius*(.19+.055*(1-level/4)+.035*Math.sin(variation*11+i));
    const tip=[
      (p[0]+q[0])*.5+Math.cos(angle)*reach,
      (p[1]+q[1])*.5-.18-.045*(level%2),
      (p[2]+q[2])*.5+Math.sin(angle)*reach
    ];
    tri(out,p,q,tip,needles[(i+level+1)%needles.length],7);
    tri(out,upper,p,tip,needles[(i+level+2)%needles.length],7);
  }
  if(beacon){
    // Grounded eight-sided moss-and-amber root halo: a readable landmark
    // footprint at eye level even when the tall crown is outside the frame.
    // All points remain within the two-block checked crown footprint.
    for(let i=0;i<8;i++){
      const a=(i+variation)*Math.PI/4,b=(i+1+variation)*Math.PI/4;
      const outerA=[x+Math.cos(a)*1.35,y+.08,z+Math.sin(a)*1.35];
      const outerB=[x+Math.cos(b)*1.35,y+.08,z+Math.sin(b)*1.35];
      tri(out,[x,y+.13,z],outerA,outerB,
        i%2?[.52,.62,.31]:[.66,.54,.27],7);
    }
  }
  if(beacon){
    // Mid-canopy gold facets form a second, lower landmark band that stays
    // visible when the top crown-star is clipped by a compact phone viewport.
    // Opaque geometry only; no new draw calls or persistent voxel changes.
    for(let i=0;i<8;i++){
      const a=(i+variation)*Math.PI/4;
      const b=(i+1+variation)*Math.PI/4;
      tri(out,[x+Math.cos(a)*1.06,y+3.05,z+Math.sin(a)*1.06],
        [x+Math.cos(b)*1.06,y+3.05,z+Math.sin(b)*1.06],
        [x,y+3.63,z],i%2?[.92,.77,.39]:[.72,.84,.43],7);
    }
  }
  if(beacon){
    // A small eight-pointed crown-star makes the rare landmark legible against
    // the sky. These are opaque mesh facets in the existing draw call.
    // Keep all points inside the checked nine-block vertical clearance.
    const crownY=y+6.35;
    for(let i=0;i<8;i++){
      const angle=i*Math.PI/4+variation*.15;
      const dx=Math.cos(angle),dz=Math.sin(angle);
      const outer=[x+dx*.60,crownY+.12,z+dz*.60];
      const left=[x+Math.cos(angle-.32)*.20,crownY-.22,z+Math.sin(angle-.32)*.20];
      const right=[x+Math.cos(angle+.32)*.20,crownY-.22,z+Math.sin(angle+.32)*.20];
      tri(out,left,outer,right,i%2?[.96,.80,.43]:[.76,.91,.58],7);
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
// Broad connected woodland districts create readable groves and open vistas.
// Districts are 4x4 chunks and change only canopy placement, never terrain.
export function woodlandDistrict(cx,cz,seed){
  if(!Number.isInteger(cx)||!Number.isInteger(cz)||!Number.isInteger(seed))
    throw Error('Invalid woodland district');
  const v=hash(Math.floor(cx/4),Math.floor(cz/4),seed,317);
  return v<.28?'open':v<.68?'grove':'mixed';
}
// Districts alter real tree silhouettes, not just the chance of placing trees.
// Open glades favor broad, low crowns; groves rise into taller layered canopies.
export function woodlandTreeProfile(cx,cz,seed){
  return woodlandDistrict(cx,cz,seed);
}
export function woodlandTreeStyle(x,z,seed){
  return hash(x,z,seed,67)<.43?'evergreen':'broadleaf';
}
function tree(out,x,y,z,variation,profile='mixed'){
  const h=(profile==='grove'?3.85:profile==='open'?2.85:3.2)+variation*.8, bark=[.52,.34,.23];
  const spread=profile==='open'?1.19:profile==='grove'?.92:1;
  const ring=[[ -.22,-.22],[.22,-.22],[.22,.22],[-.22,.22]];
  for(let i=0;i<4;i++){
    const j=(i+1)%4;
    const a=[x+ring[i][0],y,z+ring[i][1]],b=[x+ring[j][0],y,z+ring[j][1]];
    const c=[x+ring[j][0]*.6,y+h,z+ring[j][1]*.6],d=[x+ring[i][0]*.6,y+h,z+ring[i][1]*.6];
    quad(out,a,b,c,d,i%2?bark:[.63,.43,.27],4);
  }
  roots(out,x,y,z,variation);
  woodlandFloor(out,x,y,z,variation);
  for(let i=0;i<3;i++)branch(out,x,y+h*.62,z,.8,i*Math.PI*2/3+variation,1.05);
  crown(out,x,y+h-.35,z,1.25*spread,variation);
  crown(out,x-.45,y+h-.85,z+.18,.83*spread,variation+.3);
  crown(out,x+.48,y+h-.7,z-.22,.87*spread,variation+.7);
  crownHighlights(out,x,y+h-.35,z,1.25*spread,variation);
}
export function naturalCaveApproach(baseAt,heightAt,x,z,seed,air=0){
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
    if(dx*dx+dz*dz>25)continue;
    const px=x+dx,pz=z+dz,h=heightAt(px,pz,seed);
    for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const outsideH=heightAt(px+ax,pz+az,seed);
      for(let y=Math.max(0,outsideH+1);y<=h-4;y++){
        if(baseAt(px,y,pz,seed)!==air||baseAt(px,y+1,pz,seed)!==air)continue;
        if(baseAt(px,y-1,pz,seed)===air)continue;
        if(baseAt(px-ax,y,pz-az,seed)!==air||
           baseAt(px-ax,y+1,pz-az,seed)!==air)continue;
        if(baseAt(px+ax,y,pz+az,seed)!==air||
           baseAt(px+ax,y+1,pz+az,seed)!==air)continue;
        return true;
      }
    }
  }
  return false;
}

export function woodlandCanopyVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
     !Number.isInteger(cx)||!Number.isInteger(cz)||
     typeof heightAt!=='function'||typeof baseAt!=='function'||
     !Number.isInteger(chunkSize)||chunkSize<12||chunkSize>64)
    throw Error('Invalid woodland canopy inputs');
  const out=[];let count=0;
  const district=woodlandTreeProfile(cx,cz,world.seed);
  // A winding open-air sightline passes through each four-chunk district.
  // Grove interiors remain thick on either side; open districts keep wider
  // breathing room. Chunk-local sampling makes the vista seed-repeatable.
  const localX=((cx%4)+4)%4,localZ=((cz%4)+4)%4;
  const bend=hash(Math.floor(cx/4),Math.floor(cz/4),world.seed,389)*1.5-.75;
  const distance=Math.abs(localX-(1.5+bend+.32*Math.sin((localZ+.5)*1.2)));
  const vista=distance<(district==='open'?1.15:.53);
  const baseChance=district==='open'?.27:district==='grove'?.83:.56;
  const chance=vista?baseChance*.23:baseChance;
  // Never mask a naturally traversable hillside opening with a decorative tree.
// This only suppresses render-only foliage; terrain, cave coordinates and saves
// remain untouched. A mouth needs two natural air cells, a solid floor and a
// genuinely open exterior approach (not a player-dug artificial opening).

  // Candidate centers stay within each chunk: no canopy crosses a chunk seam.
  for(let i=0;i<4&&count<MAX_TREES;i++){
    const x=cx*chunkSize+3+Math.floor(hash(cx+i,cz,world.seed,19)*(chunkSize-6));
    const z=cz*chunkSize+3+Math.floor(hash(cx,cz+i,world.seed,31)*(chunkSize-6));
    // Keep a contiguous four-chunk-wide vista or denser grove, rather than
    // scattering decorative differences independently in every chunk.
    if(hash(cx+i,cz-i,world.seed,43)>chance)continue;
    // Keep the real hillside opening visible from the forest approach.
    // Scan only selected tree anchors, never every voxel in the chunk.
    if(naturalCaveApproach(baseAt,heightAt,x,z,world.seed,air))continue;
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
    const beforeTree=out.length;
    const variation=hash(x,z,world.seed,59);
    if(sentinel||style==='evergreen')evergreen(out,x+.5,h+1.01,z+.5,variation,sentinel,district);
    else tree(out,x+.5,h+1.01,z+.5,variation,district);
    // A dense tree must not borrow capacity from the other tree's budget.
    if((out.length-beforeTree)/STRIDE>MAX_VERTICES)
      throw Error('Woodland tree exceeded per-tree vertex budget');
    count++;
  }
  if(out.length/STRIDE>MAX_TREES*MAX_VERTICES)
    throw Error('Woodland canopy exceeded vertex budget');
  return new Float32Array(out);
}
export const CANOPY_LIMITS=Object.freeze({maxTreesPerChunk:MAX_TREES,maxVerticesPerTree:MAX_VERTICES,stride:STRIDE,newDrawCalls:0,newTextures:0});
