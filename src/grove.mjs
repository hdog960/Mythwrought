// MYTHWROUGHT v0.10 Gate A — hand-shaped original surface garden groves.
// Deterministic patches of ferns, flowering herbs and rounded groundcover.
// Non-solid, non-interactive render-only triangles in the EXISTING chunk buffer.
// They grow only above NATURAL exposed grass and disappear on edit/remesh;
// no seed generation, physics, inventories, save keys or block IDs change.
const STRIDE=9, MAX_CLUMPS=24, MAX_VERTICES=66;
const PATCH_SIZE=8, TWO_PI=Math.PI*2;
const LEAVES=[
  [.24,.60,.37], // emerald green
  [.40,.70,.39], // fresh leaf
  [.50,.72,.32], // sunlit lime
  [.30,.53,.44]  // blue-green shade
];
const BLOOMS=[
  [.99,.66,.78], // coral-pink
  [.73,.64,.96], // lilac
  [.97,.80,.52], // amber
  [.60,.79,.98]  // pale sky blue
];
const GOLD=[.98,.86,.56];
function hash(x,z,seed,salt){
  let h=Math.imul((x|0)^Math.imul(seed|0,0x45d9f3b),0x27d4eb2d);
  h^=Math.imul((z|0)^Math.imul(salt|0,0x165667b1),0x9e3779b1);
  h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967296;
}
function tri(out,a,b,c,color,material){
  for(const v of [a,b,c])out.push(...v,...color,0,0,material);
}
function polar(x,y,z,r,angle,rise=0){
  return [x+Math.cos(angle)*r,y+rise,z+Math.sin(angle)*r];
}
function fern(out,x,y,z,variation){
  const turn=variation*TWO_PI,spread=.32+variation*.09;
  // Six swept, sculpted 3D fronds, not flat crossed billboard sprites.
  for(let i=0;i<6;i++){
    const a=turn+i*TWO_PI/6,col=LEAVES[(i+Math.floor(variation*4))%4];
    const base=polar(x,y+.09,z,.035,a),
      tip=polar(x,y+.10+variation*.14,z,spread,a),
      mid=polar(x,y+.38+variation*.11,z,spread*.55,a);
    const left=polar(x,y+.23,z,spread*.53,a-.36),
      right=polar(x,y+.23,z,spread*.53,a+.36);
    tri(out,base,left,mid,col,7);
    tri(out,base,mid,right,col,7);
    tri(out,mid,left,tip,LEAVES[(i+1)%4],7);
  }
  tri(out,[x-.06,y+.20,z],[x,y+.46,z],[x+.06,y+.20,z],LEAVES[2],7);
}
function blossom(out,x,y,z,variation){
  const turn=variation*TWO_PI;
  const centerY=y+.39+variation*.10;
  // A radial leaf bowl holds a sculpted flower cluster above the ground.
  for(let i=0;i<6;i++){
    const a=turn+i*TWO_PI/6,near=polar(x,y+.08,z,.06,a),
      far=polar(x,y+.16,z,.38,a),left=polar(x,y+.25,z,.23,a-.27),
      right=polar(x,y+.25,z,.23,a+.27);
    tri(out,near,left,far,LEAVES[i%4],7);
    tri(out,near,far,right,LEAVES[(i+1)%4],7);
  }
  const petal=BLOOMS[Math.floor(variation*BLOOMS.length)];
  for(let i=0;i<5;i++){
    const a=turn+i*TWO_PI/5,side=polar(x,centerY,z,.07,a),
      tip=polar(x,centerY+.22,z,.20,a),
      side2=polar(x,centerY,z,.07,a+.67);
    tri(out,side,tip,side2,petal,8);
  }
  tri(out,[x-.07,centerY+.055,z],[x,centerY+.15,z],[x+.07,centerY+.055,z],GOLD,9);
}
function moss(out,x,y,z,variation){
  const turn=variation*TWO_PI;
  for(let i=0;i<9;i++){
    const a=turn+i*TWO_PI/9,base=polar(x,y+.045,z,.03,a),
      left=polar(x,y+.16,z,.35,a-.17),
      right=polar(x,y+.16,z,.35,a+.17);
    tri(out,base,left,right,LEAVES[i%4],7);
  }
  // A small scatter of pale buds adds form without collision or fake lighting.
  for(let i=0;i<3;i++){
    const a=turn+i*TWO_PI/3,c=polar(x,y+.18,z,.18,a);
    tri(out,[c[0]-.04,c[1],c[2]],[c[0],c[1]+.09,c[2]],[c[0]+.04,c[1],c[2]],BLOOMS[i],8);
  }
}
function patchStrength(x,z,seed){
  const px=Math.floor(x/PATCH_SIZE),pz=Math.floor(z/PATCH_SIZE);
  let closest=0;
  // Neighboring cells ensure a grove connects naturally across x/z chunk seams.
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
    const gx=px+dx,gz=pz+dz;
    const cx=gx*PATCH_SIZE+1+hash(gx,gz,seed,77)*6,
      cz=gz*PATCH_SIZE+1+hash(gx,gz,seed,83)*6;
    const d=Math.hypot(x+.5-cx,z+.5-cz);
    closest=Math.max(closest,Math.max(0,1-d/4.1));
  }
  return closest;
}
export function storybookGroveVertices(world,cx,cz,{
  chunkSize=16,heightAt,baseAt,grass=1,air=0
}={}){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
     !Number.isInteger(cx)||!Number.isInteger(cz)||
     !Number.isInteger(chunkSize)||chunkSize<1||chunkSize>64||
     typeof heightAt!=='function'||typeof baseAt!=='function')
    throw Error('Invalid storybook grove inputs');
  const out=[];let count=0;
  for(let x=cx*chunkSize;x<(cx+1)*chunkSize;x++){
    for(let z=cz*chunkSize;z<(cz+1)*chunkSize;z++){
      if(count>=MAX_CLUMPS)break;
      const h=heightAt(x,z,world.seed);
      // No sprouts on a mined floor, filled pocket, artificial structure or
      // freshly placed grass above a different original voxel.
      if(baseAt(x,h,z,world.seed)!==grass||world.get(x,h,z)!==grass||
        world.get(x,h+1,z)!==air||world.get(x,h+2,z)!==air)continue;
      const strength=patchStrength(x,z,world.seed);
      if(strength<.19||hash(x,z,world.seed,97)>=.43*strength)continue;
      const v=hash(x,z,world.seed,103),
        u=.50+(hash(x,z,world.seed,109)-.5)*.17,
        w=.50+(hash(x,z,world.seed,113)-.5)*.17;
      const xx=x+u,zz=z+w,yy=h+1.008;
      if(v<.45)fern(out,xx,yy,zz,v*2.1);
      else if(v<.79)blossom(out,xx,yy,zz,(v-.45)/.34);
      else moss(out,xx,yy,zz,(v-.79)/.21);
      count++;
    }
  }
  if(out.length/STRIDE>MAX_CLUMPS*MAX_VERTICES)
    throw Error('Surface art exceeded per-chunk vertex budget');
  return new Float32Array(out);
}
export const GROVE_LIMITS=Object.freeze({
  maxClumpsPerChunk:MAX_CLUMPS,maxVerticesPerClump:MAX_VERTICES,
  maxHeight:.8,materialIds:Object.freeze([7,8,9]),stride:STRIDE,
  newDrawCalls:0,newTextures:0
});
