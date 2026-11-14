// Gate A: rare roofless roadside shrines; render-only, deterministic, save-neutral.
const hash=(x,z,s)=>{let h=Math.imul(x^s,0x9e3779b1)^Math.imul(z+s,0x85ebca6b);h^=h>>>16;return (Math.imul(h,0x7feb352d)>>>0)/4294967296;};
function tri(o,a,b,c,col,id=3){for(const p of [a,b,c])o.push(...p,...col,0,0,id);}
function quad(o,a,b,c,d,col,id=3){tri(o,a,b,c,col,id);tri(o,a,c,d,col,id);}
function block(o,x,y,z,w,h,d,col,id=3){
 const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d],A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];
 quad(o,a,b,B,A,col[0],id);quad(o,b,c,C,B,col[1],id);quad(o,c,e,E,C,col[2],id);quad(o,e,a,A,E,col[3],id);quad(o,A,B,C,E,col[4],id);
}
export function roadsideShrineVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||typeof heightAt!=='function'||typeof baseAt!=='function'||chunkSize!==16||!Number.isInteger(cx)||!Number.isInteger(cz))throw Error('Invalid shrine inputs');
 // Districts deliberately offset from watchtowers; a rare landmark, not clutter.
 if(((cx%10)+10)%10!==2||((cz%10)+10)%10!==4||hash(Math.floor(cx/10),Math.floor(cz/10),world.seed+739)>.47)return new Float32Array();
 const x=cx*16+8,z=cz*16+8,h=heightAt(x,z,world.seed);
 if(h<3||h>11||baseAt(x,h,z,world.seed)!==grass)return new Float32Array();
 // The whole structure must sit on unchanged, naturally exposed terrain.
 for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
  const xx=x+dx,zz=z+dz,ground=heightAt(xx,zz,world.seed);
  if(Math.abs(ground-h)>1||world.get(xx,ground,zz)!==baseAt(xx,ground,zz,world.seed))return new Float32Array();
  for(let dy=1;dy<=5;dy++)if(world.get(xx,h+dy,zz)!==air)return new Float32Array();
 }
 const o=[],y=h+1.018;
 const stone=[[.49,.56,.60],[.39,.47,.54],[.36,.44,.50],[.45,.53,.58],[.66,.70,.68]];
 const pale=[[.66,.70,.68],[.52,.62,.65],[.47,.58,.61],[.58,.66,.66],[.78,.78,.71]];
 // Uneven concentric stepping stones form an approach from the south.
 for(const [dx,dz,w,d] of [[-.85,1.85,.74,.50],[.20,1.91,.64,.45],[-.48,1.20,.80,.43],[-.63,.55,1.28,.39]])
  block(o,x+dx,y+.018,z+dz,w,.08,d,stone);
 // Two open pillars and a broken arch make a clear distant shrine silhouette.
 for(const [dx,t] of [[-1.42,3.72],[1.03,3.25]]){
  block(o,x+dx,y,z-.88,.46,t,.56,stone);
  block(o,x+dx-.14,y+t,z-1.03,.74,.20,.84,pale);
 }
 block(o,x-1.45,y+3.26,z-.93,2.68,.34,.56,pale);
 // Split stepped crown, with the missing middle open to sky.
 block(o,x-1.45,y+3.60,z-.92,.82,.45,.56,stone);
 block(o,x+.62,y+3.60,z-.92,.60,.26,.56,stone);
 // A low votive plinth and asymmetrical side benches; central approach open.
 block(o,x-.62,y,z-1.65,1.23,.68,.62,stone);
 block(o,x-.39,y+.68,z-1.47,.78,.17,.30,pale);
 block(o,x-2.05,y+.04,z-.15,.77,.43,1.25,stone);
 block(o,x+1.42,y+.04,z+.02,.58,.31,1.04,pale);
 // Inlaid gold-and-jade geometry on the forward face of the raised altar.
 tri(o,[x-.28,y+.96,z-1.474],[x+.28,y+.96,z-1.474],[x,y+1.34,z-1.474],[.90,.70,.34],6);
 tri(o,[x-.15,y+.93,z-1.48],[x+.15,y+.93,z-1.48],[x,y+.69,z-1.48],[.34,.80,.70],5);
 return new Float32Array(o);
}
export const SHRINE_LIMITS=Object.freeze({stride:9,maxVerticesPerChunk:900,newDrawCalls:0,newTextures:0,collidable:false});
