// Render-only stone and moss thresholds for genuinely open, traversable natural caves.
// No voxel writes, cave generation changes, collision, persistence or draw calls.
const STRIDE=9;
const DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1]];
const stone=[.43,.48,.54],shadow=[.19,.25,.31],moss=[.27,.48,.32],light=[.65,.63,.53];
function tri(out,a,b,c,rgb,mat=3){for(const p of [a,b,c])out.push(...p,...rgb,0,0,mat);}
function hash(x,y,z,seed){let n=Math.imul(x^seed,73856093)^Math.imul(y+seed,19349663)^Math.imul(z-seed,83492791);n^=n>>>13;return n>>>0;}
export function caveThresholdVertices(world,cx,cz,{heightAt,baseAt,air=0,stoneId=3,chunkSize=16,minY=-3,maxY=19}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||typeof heightAt!=='function'||typeof baseAt!=='function'||chunkSize!==16)throw Error('Invalid cave threshold inputs');
 const out=[];let mouths=0;
 // A real opening must have a natural exterior approach, a 2-block-high
 // air passage at the threshold and at least two air cells into the hillside.
 // Only decorate one candidate per distinct chunk; never advertise solid cliffs.
 for(let x=cx*16+2;x<cx*16+14&&mouths<2;x++)
 for(let z=cz*16+2;z<cz*16+14&&mouths<2;z++){
  const h=heightAt(x,z,world.seed);
  for(let y=Math.max(minY+3,h-7);y<=h-3&&mouths<2;y++){
   if(y<1||y+2>maxY||world.get(x,y,z)!==air||world.get(x,y+1,z)!==air)continue;
   for(const [dx,dz] of DIRECTIONS){
    const ox=x+dx,oz=z+dz,ix=x-dx,iz=z-dz;
    if(heightAt(ox,oz,world.seed)>=y||heightAt(ox+dx,oz+dz,world.seed)>=y)continue;
    if(world.get(ox,y,oz)!==air||world.get(ox,y+1,oz)!==air||
       world.get(ix,y,iz)!==air||world.get(ix,y+1,iz)!==air||
       world.get(ix-dx,y,iz-dz)!==air||world.get(ix-dx,y+1,iz-dz)!==air)continue;
    // Do not ornament a player-mined opening: all key passage cells must
    // still match deterministic natural terrain at this seed.
    const cells=[[x,y,z],[x,y+1,z],[ix,y,iz],[ix,y+1,iz],[ix-dx,y,iz-dz],[ox,y,oz]];
    if(cells.some(([a,b,c])=>world.get(a,b,c)!==baseAt(a,b,c,world.seed)))continue;
    // Ground at the exterior must be naturally solid and walkable.
    if(world.get(ox,y-1,oz)===air||world.get(ox+dx,y-1,oz+dz)===air)continue;
    const tangent=[-dz,dx],cx0=x+.5+dx*.48,cz0=z+.5+dz*.48;
    const p=(u,v,depth=0)=>[cx0+tangent[0]*u+dx*depth,y+v,cz0+tangent[1]*u+dz*depth];
    const variant=hash(x,y,z,world.seed)%3;
    const top=2.10+(variant*.12),w=0.55;
    // Fractured asymmetric arch: dark recess, alternating rock shoulders,
    // bright chipped lintel and moss crown. Geometry stays in the same
    // chunk as the source opening and does not fill its traversable center.
    tri(out,p(-w,0),p(-w,top-.35),p(-.38,top),stone);
    tri(out,p(w,0),p(.38,top-.12),p(w,top-.40),stone);
    tri(out,p(-.38,top),p(.38,top-.12),p(.1,top+.18),light);
    tri(out,p(-w,.15),p(-w,1.4),p(-.47,.78),shadow);
    tri(out,p(w,.2),p(.47,1.25),p(w,1.65),shadow);
    tri(out,p(-.44,top-.08),p(-.06,top+.22),p(.24,top+.07),moss,1);
    tri(out,p(.38,.32),p(.62,.09),p(.54,.58),moss,1);
    tri(out,p(-.62,.06),p(-.40,.45),p(-.30,.08),variant===1?light:moss,1);
    mouths++;break;
   }
  }
 }
 return new Float32Array(out);
}
export const CAVE_THRESHOLD_LIMITS=Object.freeze({maxMouthsPerChunk:2,maxVerticesPerChunk:48,stride:STRIDE,newDrawCalls:0,newTextures:0});
