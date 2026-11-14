// Gate A :36 — optional ruined bridge geometry for verified natural crossings.
// No world writes, new block IDs, collision changes, or terrain fabrication.
const EMPTY=()=>new Float32Array();
const hash=(x,z,s)=>{let h=Math.imul(x^s,0x9e3779b1)^Math.imul(z+s,0x85ebca6b);h^=h>>>16;return Math.imul(h,0x7feb352d)>>>0;};
function triangle(out,a,b,c,color,id=3){for(const p of [a,b,c])out.push(...p,...color,0,0,id);}
function quad(out,a,b,c,d,color,id=3){triangle(out,a,b,c,color,id);triangle(out,a,c,d,color,id);}
function block(out,x,y,z,w,h,d,color){
 const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d];
 const A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];
 quad(out,a,b,B,A,color);quad(out,b,c,C,B,color);quad(out,c,e,E,C,color);
 quad(out,e,a,A,E,color);quad(out,A,B,C,E,color);
}
// Crossing must be supplied by the terrain-owning lane and must describe an
// ACTUAL naturally occurring channel with firm banks. Until connected to that
// verified signal, no bridge is emitted (never fabricate a river).
export function ruinedBridgeVertices(world,cx,cz,{crossingAt,baseAt,air=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||!Number.isInteger(cx)||!Number.isInteger(cz))throw Error('Invalid bridge world/chunk');
 if(typeof crossingAt!=='function'||typeof baseAt!=='function')return EMPTY();
 const crossing=crossingAt(cx,cz,world.seed);
 if(!crossing||crossing.natural!==true||!Number.isInteger(crossing.width)||crossing.width<2||crossing.width>5||
    !Number.isInteger(crossing.x)||!Number.isInteger(crossing.z)||
    !Number.isInteger(crossing.bankY)||!['x','z'].includes(crossing.axis))return EMPTY();
 const {x,z,bankY,axis,width}=crossing;
 if(x<cx*16+4||x>cx*16+11||z<cz*16+4||z>cz*16+11||bankY<2||bankY>30)return EMPTY();
 if((hash(cx,cz,world.seed+7391)%5)!==0)return EMPTY();
 const along=(t)=>axis==='x'?[x+t,z]:[x,z+t];
 // A terrain-lane hint is not proof by itself. Independently inspect the
 // entire two-block-wide span against the seeded, unedited base terrain.
 // Require a real depression with lower natural ground, clear headroom and
 // stable, matching-height banks. Any edited cell suppresses the bridge.
 const across=(t,side)=>axis==='x'?[x+t,z+side]:[x+side,z+t];
 for(let side=-1;side<=1;side++){
  for(let t=-width-2;t<=width+2;t++){
   const [px,pz]=across(t,side);
   const bank=Math.abs(t)>=width+1;
   const natural=baseAt(px,bankY,pz,world.seed);
   const current=world.get(px,bankY,pz);
   if(current!==natural)return EMPTY();
   if(bank ? natural===air : natural!==air)return EMPTY();
   if(!bank&&(baseAt(px,bankY-1,pz,world.seed)===air||\n      world.get(px,bankY-1,pz)!==baseAt(px,bankY-1,pz,world.seed)))return EMPTY();
   for(let dy=1;dy<=3;dy++){
    if(baseAt(px,bankY+dy,pz,world.seed)!==air||
       world.get(px,bankY+dy,pz)!==air)return EMPTY();
   }
  }
 }
 const out=[],stone=[.49,.57,.62],light=[.69,.73,.70],deckY=bankY+1.02;
 // Deliberately interrupted masonry walkway: only rendered over a
 // verified channel, with open air beneath and a clear central passage.
 for(let t=-width-1;t<=width+1;t++){
  if(t===1)continue; // missing stone shows age, not an invisible wall
  const [px,pz]=along(t);
  if(axis==='x')block(out,px-.47,deckY,pz-.95,.94,.22,1.9,t%3===0?light:stone);
  else block(out,px-.95,deckY,pz-.47,1.9,.22,.94,t%3===0?light:stone);
 }
 for(const side of [-1,1])for(const t of [-width-1,0,width+1]){
  const [px,pz]=along(t);
  const bx=axis==='x'?px-.35:px+side*1.02-.2;
  const bz=axis==='x'?pz+side*1.02-.2:pz-.35;
  block(out,bx,deckY,bz,axis==='x'?.7:.4,1.1+(Math.abs(t)%2)*.65,axis==='x'?.4:.7,stone);
 }
 return new Float32Array(out);
}
export const RUINED_BRIDGE_LIMITS=Object.freeze({stride:9,maxVerticesPerChunk:1800,newDrawCalls:0,newTextures:0,collidable:false,requiresVerifiedCrossing:true});
