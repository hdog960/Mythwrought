// Gate A: rare broken roadside causeways, visual-only and save-neutral.
// They sit on natural grass terraces, not over invented rivers or caves.
const hash=(x,z,s)=>{let h=Math.imul(x^s,0x9e3779b1)^Math.imul(z+s,0x85ebca6b);h^=h>>>16;return (Math.imul(h,0x7feb352d)>>>0)/4294967296;};
function tri(o,a,b,c,color,id=3){for(const p of [a,b,c])o.push(...p,...color,0,0,id);}
function quad(o,a,b,c,d,color,id=3){tri(o,a,b,c,color,id);tri(o,a,c,d,color,id);}
function prism(o,x,y,z,w,h,d,p,id=3){
 const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d],A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];
 quad(o,a,b,B,A,p[0],id);quad(o,b,c,C,B,p[1],id);quad(o,c,e,E,C,p[2],id);quad(o,e,a,A,E,p[3],id);quad(o,A,B,C,E,p[4],id);
}
export function ruinedCausewayVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||typeof heightAt!=='function'||typeof baseAt!=='function'||chunkSize!==16||!Number.isInteger(cx)||!Number.isInteger(cz))throw Error('Invalid causeway inputs');
 // Offset from towers, shrines and arches; rare districts prevent clutter.
 if(((cx%17)+17)%17!==11||((cz%17)+17)%17!==6||hash(Math.floor(cx/17),Math.floor(cz/17),world.seed+3191)>.48)return new Float32Array();
 const x=cx*16+8,z=cz*16+8,h=heightAt(x,z,world.seed);
 if(h<3||h>11||baseAt(x,h,z,world.seed)!==grass)return new Float32Array();
 // Ground clearance includes both approaches. Existing edits suppress the
 // entire landmark; never paint over a player-made path or a cave opening.
 for(let dx=-3;dx<=3;dx++)for(let dz=-4;dz<=4;dz++){
  const xx=x+dx,zz=z+dz,g=heightAt(xx,zz,world.seed);
  if(Math.abs(g-h)>1||world.get(xx,g,zz)!==baseAt(xx,g,zz,world.seed))return new Float32Array();
  for(let dy=1;dy<=5;dy++)if(world.get(xx,h+dy,zz)!==air)return new Float32Array();
 }
 const o=[],y=h+1.018;
 const slate=[[.51,.58,.62],[.40,.48,.55],[.36,.43,.49],[.46,.54,.59],[.66,.70,.69]];
 const pale=[[.70,.73,.69],[.55,.63,.65],[.48,.57,.60],[.62,.68,.67],[.78,.79,.73]];
 // A lost stone road with broken, staggered paving and an uninterrupted
 // central sightline. This is NOT a bridge over an unsupported water feature.
 for(let iz=-4;iz<=3;iz++){
  const offset=(iz%2===0?.13:-.16);
  prism(o,x-1.05+offset,y+.012,z+iz+.12,.94,.085,.73,iz%3===0?pale:slate);
  prism(o,x+.08+offset,y+.014,z+iz+.07,.92,.075,.77,iz%3===1?pale:slate);
 }
 // Four ruined balustrade piers and a single fractured overhead gateway
 // make a recognizable silhouette without sealing the path.
 for(const [dx,dz,t] of [[-2.10,-2.35,2.6],[1.60,-2.35,3.3],[-2.10,2.15,3.8],[1.60,2.15,2.45]]){
  prism(o,x+dx,y,z+dz,.51,t,.57,slate);
  prism(o,x+dx-.13,y+t,z+dz-.12,.77,.18,.80,pale);
 }
 prism(o,x-1.63,y+3.00,z+2.19,1.05,.42,.48,pale);
 prism(o,x+.24,y+3.00,z+2.19,1.78,.34,.48,slate);
 // Shattered roadside rails deliberately stop short of the open approaches.
 for(const [dx,dz,len] of [[-2.08,-.98,1.11],[1.72,-.76,.90],[-2.08,.65,.81],[1.72,.84,.67]])
  prism(o,x+dx,y+.25,z+dz,.38,.38,len,slate);
 // Distinct gold and jade keystones: decorative existing material channels.
 tri(o,[x-.55,y+3.07,z+2.18],[x-.06,y+3.07,z+2.18],[x-.31,y+3.42,z+2.18],[.90,.71,.37],6);
 tri(o,[x+.62,y+3.06,z+2.175],[x+1.10,y+3.06,z+2.175],[x+.86,y+3.40,z+2.175],[.34,.79,.72],5);
 return new Float32Array(o);
}
export const CAUSEWAY_LIMITS=Object.freeze({stride:9,maxVerticesPerChunk:1500,newDrawCalls:0,newTextures:0,collidable:false});
