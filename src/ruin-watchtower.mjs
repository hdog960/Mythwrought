// Gate A: rare, unpopulated skyline ruins, render-only and save-neutral.
// These are distant visual discoveries, not collidable buildings or new blocks.
const STRIDE=9;
const hash=(x,z,seed)=>{let h=Math.imul(x^seed,0x9e3779b1)^Math.imul(z+seed,0x85ebca6b);h^=h>>>16;return (Math.imul(h,0x7feb352d)>>>0)/4294967296;};
function tri(out,a,b,c,color,id=3){for(const p of [a,b,c])out.push(...p,...color,0,0,id);}
function quad(out,a,b,c,d,color,id=3){tri(out,a,b,c,color,id);tri(out,a,c,d,color,id);}
function prism(out,x,y,z,w,h,d,shade){
 const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d];
 const A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];
 quad(out,a,b,B,A,shade[0]);quad(out,b,c,C,B,shade[1]);quad(out,c,e,E,C,shade[2]);quad(out,e,a,A,E,shade[3]);quad(out,A,B,C,E,shade[4]);
}
export function ruinWatchtowerVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||typeof heightAt!=='function'||typeof baseAt!=='function'||!Number.isInteger(cx)||!Number.isInteger(cz)||chunkSize!==16)throw Error('Invalid watchtower inputs');
 // Exactly one candidate per 12x12 chunk district; seed-gated to be genuinely rare.
 if(((cx%12)+12)%12!==5||((cz%12)+12)%12!==7||hash(Math.floor(cx/12),Math.floor(cz/12),world.seed)>.54)return new Float32Array();
 const x=cx*16+8,z=cz*16+8,h=heightAt(x,z,world.seed);
 if(h<3||h>12||baseAt(x,h,z,world.seed)!==grass)return new Float32Array();
 // Restrict to stable, flat, untouched ground and empty air; never cover caves or edits.
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
  const xx=x+dx,zz=z+dz;
  if(Math.abs(heightAt(xx,zz,world.seed)-h)>2||world.get(xx,heightAt(xx,zz,world.seed),zz)!==baseAt(xx,heightAt(xx,zz,world.seed),zz,world.seed))return new Float32Array();
  for(let dy=1;dy<=7;dy++)if(world.get(xx,h+dy,zz)!==air)return new Float32Array();
 }
 const out=[],y=h+1.025,stone=[[.48,.54,.59],[.39,.47,.54],[.34,.42,.48],[.43,.51,.56],[.61,.65,.63]];
 // Four broken buttresses frame an open, readable central passage.
 for(const [dx,dz,t] of [[-2,-2,5.6],[2,-2,4.7],[-2,2,4.4],[2,2,6.2]]){
  prism(out,x+dx,y,z+dz,.85,t,.85,stone);
  prism(out,x+dx-.13,y+t,z+dz-.13,1.11,.25,1.11,stone);
 }
 // A surviving lintel and a second collapsed span: deliberate irregular ruin.
 prism(out,x-1.2,y+4.05,z-2,3.4,.62,.72,stone);
 prism(out,x+1.9,y+3.55,z-.9,.66,.55,2.9,stone);
 // Ruined upper gallery: irregular projecting stone courses and three
 // deliberately open window bays. No solid wall is placed across the center.
 // Each piece is authored in world coordinates rather than rotated copies.
 const trim=[[.66,.70,.69],[.51,.59,.63],[.46,.55,.59],[.58,.64,.65],[.73,.76,.72]];
 for(const [dx,dz,t] of [[-2,-2,5.6],[2,-2,4.7],[-2,2,4.4],[2,2,6.2]]){
   const crown=y+t+.25;
   // Broken, alternating ashlar caps make the silhouette legible at a distance.
   prism(out,x+dx-.24,crown,z+dz-.24,1.34,.20,1.34,trim);
   prism(out,x+dx+.12,crown+.20,z+dz+.12,.58,.18,.58,stone);
 }
 // A high fractured west parapet and a shorter rear fragment.
 prism(out,x-2.06,y+4.95,z-.95,.54,.34,1.18,trim);
 prism(out,x-.85,y+4.95,z+2.01,1.13,.32,.49,trim);
 // Two staggered low masonry shelves suggest a vanished spiral stair without
 // blocking the ground-level gap or claiming a walkable staircase.
 prism(out,x-1.9,y+.83,z+.96,.72,.24,.65,stone);
 prism(out,x-1.87,y+1.44,z+.25,.66,.23,.67,trim);
 prism(out,x-1.85,y+2.08,z-.42,.60,.22,.63,stone);
 // Carved arch spandrels leave a clearly readable opening beneath the lintel.
 tri(out,[x-1.18,y+4.06,z-2.04],[x-.65,y+3.57,z-2.04],[x-.14,y+4.06,z-2.04],trim[1]);
 tri(out,[x+.56,y+4.06,z-2.04],[x+1.05,y+3.60,z-2.04],[x+1.46,y+4.06,z-2.04],trim[2]);
 // Colored inset masonry and a readable ancient sigil facing the approach.
 const gold=[.91,.70,.32],jade=[.34,.78,.70];
 tri(out,[x-.8,y+4.12,z-2.03],[x+.1,y+4.12,z-2.03],[x-.35,y+4.58,z-2.03],gold,6);
 tri(out,[x+.3,y+4.14,z-2.035],[x+1.2,y+4.14,z-2.035],[x+.75,y+4.55,z-2.035],jade,5);
 // Broken diagonal rubble is sculpted, not a uniform repeated column stamp.
 tri(out,[x-2.3,y+.05,z+.4],[x-1.1,y+.08,z+.7],[x-1.6,y+.85,z+.25],stone[1]);
 tri(out,[x+.8,y+.04,z+2.4],[x+1.9,y+.05,z+2.3],[x+1.3,y+.76,z+1.8],stone[2]);
 return new Float32Array(out);
}
export const WATCHTOWER_LIMITS=Object.freeze({stride:STRIDE,maxVerticesPerChunk:1600,newDrawCalls:0,newTextures:0,collidable:false});
