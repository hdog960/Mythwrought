// Gate A: rare open, noncollidable pilgrim arches on naturally level ground.
// Pure geometry: no terrain edits, saved data, collision, or new block identifiers.
const hash=(x,z,s)=>{let h=Math.imul(x^s,0x9e3779b1)^Math.imul(z+s,0x85ebca6b);h^=h>>>16;return (Math.imul(h,0x7feb352d)>>>0)/4294967296;};
function tri(o,a,b,c,color,id=3){for(const p of [a,b,c])o.push(...p,...color,0,0,id);}
function quad(o,a,b,c,d,color,id=3){tri(o,a,b,c,color,id);tri(o,a,c,d,color,id);}
function prism(o,x,y,z,w,h,d,palette,id=3){
 const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d];
 const A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];
 quad(o,a,b,B,A,palette[0],id);quad(o,b,c,C,B,palette[1],id);
 quad(o,c,e,E,C,palette[2],id);quad(o,e,a,A,E,palette[3],id);quad(o,A,B,C,E,palette[4],id);
}
export function pilgrimArchVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||typeof heightAt!=='function'||typeof baseAt!=='function'||chunkSize!==16||!Number.isInteger(cx)||!Number.isInteger(cz))throw Error('Invalid pilgrim arch inputs');
 // One deterministic candidate in each distant 13x13 chunk district.
 if(((cx%13)+13)%13!==9||((cz%13)+13)%13!==3||hash(Math.floor(cx/13),Math.floor(cz/13),world.seed+1907)>.48)return new Float32Array();
 const x=cx*16+8,z=cz*16+8,h=heightAt(x,z,world.seed);
 if(h<4||h>11||baseAt(x,h,z,world.seed)!==grass)return new Float32Array();
 // Full footprint must be natural, level, unobstructed and untouched.
 for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
  const xx=x+dx,zz=z+dz,ground=heightAt(xx,zz,world.seed);
  if(Math.abs(ground-h)>1||world.get(xx,ground,zz)!==baseAt(xx,ground,zz,world.seed))return new Float32Array();
  for(let dy=1;dy<=7;dy++)if(world.get(xx,h+dy,zz)!==air)return new Float32Array();
 }
 const o=[],y=h+1.02;
 const slate=[[.55,.61,.66],[.42,.51,.58],[.38,.46,.52],[.49,.57,.62],[.69,.73,.72]];
 const pale=[[.72,.75,.70],[.56,.65,.65],[.50,.59,.60],[.63,.69,.68],[.80,.80,.73]];
 // Twin high freestanding pylons, with a walk-through gap between them.
 for(const [dx,height] of [[-2.02,5.75],[1.43,5.08]]){
  prism(o,x+dx,y,z-.42,.62,height,.85,slate);
  prism(o,x+dx-.16,y+height,z-.56,.94,.26,1.14,pale);
  prism(o,x+dx+.10,y+height+.26,z-.30,.42,.22,.61,slate);
 }
 // Fractured overhead lintel: two segments and an intentional sky notch.
 prism(o,x-1.58,y+4.91,z-.35,1.29,.48,.72,pale);
 prism(o,x+.12,y+4.91,z-.35,1.50,.38,.72,slate);
 // Staggered voussoir teeth give the broken crown a stepped silhouette.
 for(const [dx,dy,w] of [[-1.39,5.39,.48],[-.76,5.39,.31],[.45,5.29,.45],[1.02,5.29,.36]])
  prism(o,x+dx,y+dy,z-.34,w,.28,.69,slate);
 // Shallow side buttresses, never placed across the central corridor.
 prism(o,x-2.31,y,z+.55,.77,1.35,.64,pale);
 prism(o,x+1.39,y,z+.55,.79,.95,.71,slate);
 // Irregular processional paving runs through the open portal.
 for(const [dx,dz,w,d] of [[-.75,1.96,.76,.49],[.19,1.98,.65,.43],[-.44,1.23,.81,.45],[-.46,.39,.84,.42],[-.39,-.61,.77,.42],[-.55,-1.44,.71,.39]])
  prism(o,x+dx,y+.018,z+dz,w,.075,d,pale);
 // Asymmetric low stone markers suggest a lost road, not an active quest.
 prism(o,x-2.35,y,z+1.70,.50,.72,.48,slate);
 prism(o,x+1.96,y,z+1.39,.41,.47,.52,pale);
 // Facing ornament, recessed high above the central passage.
 tri(o,[x-.58,y+5.02,z-.36],[x-.10,y+5.02,z-.36],[x-.34,y+5.35,z-.36],[.90,.72,.39],6);
 tri(o,[x+.46,y+5.00,z-.365],[x+.95,y+5.00,z-.365],[x+.71,y+5.33,z-.365],[.35,.78,.73],5);
 return new Float32Array(o);
}
export const PILGRIM_ARCH_LIMITS=Object.freeze({stride:9,maxVerticesPerChunk:1300,newDrawCalls:0,newTextures:0,collidable:false});
