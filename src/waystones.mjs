// Gate A render-only navigation silhouettes: rare original three-sided waystones.
// No collision, voxel writes, interactions, saved state, textures or draw calls.
const STRIDE=9;
function hash(x,z,seed){let h=Math.imul(x^seed,0x9e3779b1)^Math.imul(z+seed,0x85ebca6b);h^=h>>>16;h=Math.imul(h,0x7feb352d);return (h>>>0)/4294967296;}
function triangle(out,a,b,c,color,mat=3){for(const p of [a,b,c])out.push(...p,...color,0,0,mat);}
export function waystoneVertices(world,cx,cz,{chunkSize=16,heightAt,baseAt,grass=1,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||!Number.isInteger(cx)||!Number.isInteger(cz)||typeof heightAt!=='function'||typeof baseAt!=='function'||chunkSize!==16)throw Error('Invalid waystone inputs');
 // One rare landmark in each 4x4-chunk neighborhood, with a clear sightline around it.
 if(((cx%4)+4)%4!==1||((cz%4)+4)%4!==2)return new Float32Array();
 const chance=hash(Math.floor(cx/4),Math.floor(cz/4),world.seed);
 if(chance>.72)return new Float32Array();
 const x=cx*16+7,z=cz*16+8,h=heightAt(x,z,world.seed);
 if(baseAt(x,h,z,world.seed)!==grass||world.get(x,h,z)!==grass)return new Float32Array();
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let dy=1;dy<=4;dy++)if(world.get(x+dx,h+dy,z+dz)!==air)return new Float32Array();
 const out=[],px=x+.5,pz=z+.5,y=h+1.015;
 const foot=[[px-.55,y,pz-.40],[px+.55,y,pz-.40],[px+.38,y,pz+.52],[px-.48,y,pz+.52]];
 const shoulder=[[px-.33,y+1.7,pz-.25],[px+.31,y+1.75,pz-.23],[px+.27,y+1.68,pz+.32],[px-.30,y+1.73,pz+.29]];
 const cap=[[px-.23,y+2.65,pz-.15],[px+.18,y+2.72,pz-.12],[px+.16,y+2.63,pz+.21],[px-.18,y+2.68,pz+.18]];
 const stone=[[.40,.49,.57],[.51,.58,.62],[.35,.46,.53],[.59,.62,.61]];
 for(let i=0;i<4;i++){let j=(i+1)%4;triangle(out,foot[i],foot[j],shoulder[j],stone[i]);triangle(out,foot[i],shoulder[j],shoulder[i],stone[i]);triangle(out,shoulder[i],shoulder[j],cap[j],stone[(i+1)%4]);triangle(out,shoulder[i],cap[j],cap[i],stone[(i+1)%4]);}
 triangle(out,cap[0],cap[1],cap[2],[.67,.70,.68]);triangle(out,cap[0],cap[2],cap[3],[.67,.70,.68]);
 // Large contrasting carved-gold chevron faces the approach from both directions.
 const gold=[.95,.76,.34],glow=[.39,.83,.83];
 triangle(out,[px-.24,y+1.64,pz-.258],[px+.24,y+1.64,pz-.258],[px,y+1.15,pz-.30],gold,6);
 triangle(out,[px-.21,y+1.64,pz+.33],[px,y+1.15,pz+.36],[px+.21,y+1.64,pz+.33],glow,5);
 // Contrasting inset side facets make the landmark readable when approached east-west.
 // These hand-shaped shards do not create interactive blocks or collision.
 const amber=[.89,.64,.27],jade=[.25,.70,.61];
 triangle(out,[px+.327,y+1.52,pz-.13],[px+.318,y+1.52,pz+.18],[px+.35,y+.93,pz+.01],amber,6);
 triangle(out,[px-.323,y+1.52,pz+.16],[px-.33,y+1.52,pz-.12],[px-.36,y+.93,pz+.01],jade,5);
 // Raised irregular crown fins and dark contrasting ledges give the silhouette
 // a recognizable profile against either bright sky or dense canopy.
 triangle(out,[px-.28,y+2.58,pz-.20],[px-.13,y+3.12,pz-.10],[px+.01,y+2.70,pz-.14],[.73,.76,.70]);
 triangle(out,[px+.03,y+2.70,pz+.20],[px+.22,y+3.02,pz+.11],[px+.26,y+2.58,pz+.23],[.33,.44,.50]);
 triangle(out,[px-.45,y+.62,pz-.32],[px+.42,y+.57,pz-.34],[px+.28,y+.49,pz-.39],[.25,.35,.39]);
 triangle(out,[px-.42,y+.61,pz+.39],[px+.42,y+.55,pz+.39],[px+.30,y+.46,pz+.43],[.29,.40,.44]);
 // Asymmetric moss footing, not a repeated tree or block-stack stamp.
 triangle(out,[px-.65,y+.03,pz+.28],[px-.16,y+.06,pz+.57],[px-.41,y+.35,pz+.33],[.27,.54,.36],1);
 triangle(out,[px+.19,y+.04,pz-.54],[px+.61,y+.02,pz-.17],[px+.30,y+.28,pz-.24],[.38,.62,.42],1);
 return new Float32Array(out);
}
export const WAYSTONE_LIMITS=Object.freeze({maxVerticesPerChunk:84,stride:STRIDE,newDrawCalls:0,newTextures:0});
