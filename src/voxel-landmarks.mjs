// Real, deterministic, editable VOXEL replacements for the five original
// render-only landmark families. No meshes, new block IDs, world edits, or saves
// are produced here: VoxelWorld reads this immutable baseline through get().
// Each site uses the legacy district grid, RNG, location and terrain clearance;
// player edits always take precedence over individual generated blocks.
const mod=(n,m)=>((n%m)+m)%m;
const hash=(x,z,seed)=>{
  let h=Math.imul(x^seed,0x9e3779b1)^Math.imul(z+seed,0x85ebca6b);
  h^=h>>>16;
  return (Math.imul(h,0x7feb352d)>>>0)/4294967296;
};
export const VOXEL_LANDMARK_KINDS=Object.freeze(['waystone','watchtower','shrine','arch','causeway']);
export const VOXEL_LANDMARK_CACHE_LIMIT=96;

// Coordinates are world-space integral cells. Footprints lie strictly inside
// their own 16x16 chunks, so adjacent chunk streaming cannot split a template.
export function voxelLandmarksForChunk(cx,cz,seed,{heightAt,baseAt,maxY=19,grass=1,air=0,stone=3,wood=4,crystal=5,ore=6}={}){
  if(!Number.isInteger(cx)||!Number.isInteger(cz)||!Number.isInteger(seed)||
    typeof heightAt!=='function'||typeof baseAt!=='function')
    throw Error('Invalid voxel landmark generator inputs');
  const blocks=new Map(),sites=[];
  const key=(x,y,z)=>x+','+y+','+z;
  const add=(x,y,z,id)=>{
    if(x<cx*16||x>=cx*16+16||z<cz*16||z>=cz*16+16||y>maxY||y<0)return;
    // Never replace naturally generated land or cut artificial caves. Existing
    // user edits are layered on top by VoxelWorld.get, not checked here.
    if(baseAt(x,y,z,seed)!==air)return;
    blocks.set(key(x,y,z),id);
  };
  const site=(kind,{period,dx,dz,salt,prob,minH=2,maxH=12,rx=0,rz=0,grade=0,clear=4,below=0,localClear=false},draw)=>{
    if(mod(cx,period)!==dx||mod(cz,period)!==dz)return;
    if(hash(Math.floor(cx/period),Math.floor(cz/period),seed+salt)>prob)return;
    const x=cx*16+(kind==='waystone'?7:8),z=cz*16+8,h=heightAt(x,z,seed);
    if(h<minH||h>maxH||baseAt(x,h,z,seed)!==grass)return;
    for(let ox=-rx;ox<=rx;ox++)for(let oz=-rz;oz<=rz;oz++){
      const xx=x+ox,zz=z+oz,ground=heightAt(xx,zz,seed);
      if(Math.abs(ground-h)>grade)return;
      if(baseAt(xx,ground,zz,seed)!==grass)return;
      const checkY=localClear?ground:h;
      for(let dy=1;dy<=clear;dy++)if(baseAt(xx,checkY+dy,zz,seed)!==air)return;
      for(let dy=1;dy<=below;dy++)if(baseAt(xx,ground-dy,zz,seed)===air)return;
    }
    const before=blocks.size;
    draw(x,h,z);
    if(blocks.size>before)sites.push(Object.freeze({kind,x,z,groundY:h,voxelCount:blocks.size-before}));
  };
  site('waystone',{period:4,dx:1,dz:2,salt:0,prob:.72,rx:1,rz:1,grade:3,clear:4},(x,h,z)=>{
    // Solid, mineable stone marker with actual crystal and gold in its crown.
    add(x,h+1,z,stone);add(x,h+2,z,stone);
    add(x,h+3,z,crystal);add(x,h+4,z,ore);
    for(const [ox,oz] of [[-1,0],[1,0],[0,-1],[0,1]])
      add(x+ox,h+1,z+oz,stone);
  });
  site('watchtower',{period:12,dx:5,dz:7,salt:0,prob:.54,minH:3,maxH:12,rx:2,rz:2,grade:2,clear:7},(x,h,z)=>{
    // Four irregular buttresses, a fragmented upper gallery and a walkable
    // entrance through the middle; built from genuine full cubes.
    const columns=[[-2,-2,5],[2,-2,4],[-2,2,4],[2,2,6]];
    for(const [ox,oz,top] of columns){
      const ground=heightAt(x+ox,z+oz,seed);
      for(let y=ground+1;y<=h+top;y++)add(x+ox,y,z+oz,stone);
      add(x+ox,h+top+1,z+oz,ore);
    }
    for(let ox=-1;ox<=1;ox++)add(x+ox,h+5,z-2,ox===0?ore:stone);
    for(let ox=-2;ox<=-1;ox++)add(x+ox,h+5,z+2,stone);
    for(let oz=-1;oz<=0;oz++)add(x+2,h+4,z+oz,stone);
    // Broken courses and low scattered masonry belong to the same voxel grid.
    add(x-2,h+1,z,stone);add(x+2,h+1,z+1,stone);
    add(x-1,h+1,z+2,stone);add(x+1,h+1,z-2,stone);
    add(x-2,h+3,z+1,crystal);
  });
  site('shrine',{period:10,dx:2,dz:4,salt:739,prob:.47,minH:3,maxH:11,rx:3,rz:3,grade:1,clear:5},(x,h,z)=>{
    // Two separated altar pillars, open center aisle and an unmistakable
    // chipped lintel: every piece is a real, editable block.
    for(const ox of [-2,2])for(let y=h+1;y<=h+(ox<0?4:3);y++)add(x+ox,y,z-1,stone);
    for(const ox of [-2,-1,1,2])add(x+ox,h+5,z-1,stone);
    add(x-2,h+5,z-1,ore);add(x+2,h+4,z-1,ore);
    add(x,h+1,z+2,stone);add(x,h+2,z+2,crystal);
    add(x-2,h+1,z+1,stone);add(x+2,h+1,z+1,wood);
  });
  site('arch',{period:13,dx:9,dz:3,salt:1907,prob:.48,minH:4,maxH:11,rx:3,rz:3,grade:1,clear:7},(x,h,z)=>{
    for(const ox of [-2,2])for(let y=h+1;y<=h+(ox<0?6:5);y++)add(x+ox,y,z,stone);
    for(const ox of [-1,1])add(x+ox,h+6,z,stone);
    add(x-2,h+7,z,ore);add(x+2,h+6,z,ore);
    add(x-3,h+1,z+1,stone);add(x+3,h+1,z-1,stone);
    // No voxels in the central 2x2x3 walking corridor.
  });
  site('causeway',{period:17,dx:11,dz:6,salt:3191,prob:.48,minH:3,maxH:11,rx:3,rz:4,grade:1,clear:6,below:2,localClear:true},(x,h,z)=>{
    // A broken road of solid, mineable stone cubes follows natural terrace
    // grades. Sparse parapet fragments remain outside its middle walkway.
    for(let oz=-4;oz<=3;oz++){
      for(const ox of [-1,0]){
        if(mod(oz*3+ox,7)===0)continue; // genuine missing paving
        const ground=heightAt(x+ox,z+oz,seed);
        add(x+ox,ground+1,z+oz,oz===-3||oz===2?ore:stone);
      }
    }
    for(const oz of [-3,-2,1,2]){
      const yy=heightAt(x-3,z+oz,seed)+1;
      add(x-3,yy,z+oz,stone);
      if(oz!==-2)add(x-3,yy+1,z+oz,stone);
    }
    for(const oz of [-2,0,3])add(x+2,heightAt(x+2,z+oz,seed)+1,z+oz,stone);
    add(x+2,h+2,z+3,crystal);
  });
  return {blocks,sites};
}
