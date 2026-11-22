// DETACHED snowy S3 *proposal*, never imported by M7 or the live game.
// Stable absolute 8x8 site keys let overlapping 16x16 chunk surveys agree.
// Physical cells are supplied by the existing S3 tree prototype at review
// time. This code neither mutates world data nor creates saved-world profiles.
export const SNOW_S3_SITE_SIZE=8;
export const SNOW_S3_MAX_Y=19;
export const SNOW_S3_STYLES=Object.freeze([
  'compact-fir','layered-spruce','highland-pine','windswept-alpine'
]);
const M7='mythwrought-five-surface-regions-v7';
const SNOW_GROUND=new Set([272,276,279]);
const TREE_BLOCKS=new Set([4,406,407]);
// Genuine heights of the four detached prototypes. Their top snowy needles
// occupy one EXTRA layer, which must also fit inside the old Y=19 roof.
const STYLE_HEIGHTS=Object.freeze([5,7,9,6]);
const valid32=n=>Number.isInteger(n)&&n===(n|0);
const validSite=n=>Number.isSafeInteger(n)&&Math.abs(n)<=250000;
function hash(seed,sx,sz,salt){
  let h=Math.imul(seed,0x9e3779b1)^Math.imul(sx,0x7feb352d)^
    Math.imul(sz,0x846ca68b)^Math.imul(salt,0x85ebca6b);
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  return (h^(h>>>16))>>>0;
}
const unit=n=>n/4294967296;
function siteForGrid(seed,sx,sz){
  if(!valid32(seed)||!validSite(sx)||!validSite(sz))
    throw new RangeError('Invalid S3 seed or site coordinates');
  // Density stays sparse. No placement or chance depends on chunk request order.
  if(unit(hash(seed,sx,sz,7))>=.36)return null;
  const x=sx*8+2+(hash(seed,sx,sz,11)%4);
  const z=sz*8+2+(hash(seed,sx,sz,13)%4);
  return Object.freeze({key:sx+','+sz,x,z,wind:hash(seed,sx,sz,17)%2?1:-1,
    styleRoll:unit(hash(seed,sx,sz,19))});
}
// Avoid competing future tree footprints in neighboring 8-cell grids. A
// total priority order, computed from GLOBAL grid coordinates, makes exactly
// the same winner in every chunk regardless of build order. No mutable
// accepted-site list and no dependence on which chunks happened to load.
function stableSite(seed,sx,sz){
  const current=siteForGrid(seed,sx,sz);
  if(!current)return null;
  const priority=hash(seed,sx,sz,23);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
    if(dx===0&&dz===0)continue;
    const neighbor=siteForGrid(seed,sx+dx,sz+dz);
    if(!neighbor||Math.abs(neighbor.x-current.x)>6||
      Math.abs(neighbor.z-current.z)>6)continue;
    const rival=hash(seed,sx+dx,sz+dz,23);
    if(rival>priority||rival===priority&&
      (sx+dx<sx||sx+dx===sx&&sz+dz<sz))return null;
  }
  return current;
}
export function snowS3SitesForChunk(seed,cx,cz){
  if(!valid32(seed)||!validSite(cx)||!validSite(cz))
    throw new RangeError('Invalid S3 chunk coordinates');
  const x0=cx*16-3,z0=cz*16-3,x1=cx*16+18,z1=cz*16+18;
  const proposed=[];
  for(let sx=Math.floor((x0-5)/8);sx<=Math.floor((x1-2)/8);sx++)
    for(let sz=Math.floor((z0-5)/8);sz<=Math.floor((z1-2)/8);sz++){
      const site=stableSite(seed,sx,sz);
      if(site&&site.x>=x0&&site.x<=x1&&site.z>=z0&&site.z<=z1)
        proposed.push(site);
    }
  return Object.freeze(proposed);
}
export function snowS3StyleAt(site,floor){
  if(!site||typeof site.key!=='string'||
    !Number.isSafeInteger(site.x)||!Number.isSafeInteger(site.z)||
    ![1,-1].includes(site.wind)||!Number.isFinite(site.styleRoll)||
    site.styleRoll<0||site.styleRoll>=1||
    !Number.isInteger(floor)||floor<2||floor>SNOW_S3_MAX_Y)
    return null;
  // Real world top is Y=19. A highland pine (9+1 layers) cannot stand on
  // floor 10 or above; do not select a tree that is guaranteed to fail. Tall
  // trees belong on lower, genuinely open slopes. Exposed high sites select
  // compact or wind-shaped forms where actual vertical headroom permits.
  const weights=floor>=11?[.18,.20,.10,.52]:[.38,.31,.22,.09];
  const room=SNOW_S3_MAX_Y-floor-1;
  const viable=weights.map((w,i)=>STYLE_HEIGHTS[i]<=room?w:0);
  const total=viable.reduce((a,b)=>a+b,0);
  if(total<=0)return null;
  let roll=site.styleRoll*total;
  for(let i=0;i<viable.length;i++){
    if(viable[i]===0)continue;
    roll-=viable[i];
    if(roll<0)return SNOW_S3_STYLES[i];
  }
  return SNOW_S3_STYLES[viable.findLastIndex(v=>v>0)];
}
export function proposeSnowS3PhysicalSite(site,{inspect,readCell,isEdited,isProtected,makeTree}={}){
  if(!site||!Number.isSafeInteger(site.x)||!Number.isSafeInteger(site.z)||
    ![1,-1].includes(site.wind)||typeof inspect!=='function'||
    typeof readCell!=='function'||typeof isEdited!=='function'||
    typeof isProtected!=='function'||typeof makeTree!=='function')return null;
  const surface=inspect(site.x,site.z);
  if(surface?.generator!==M7||surface.biome!=='snow'||
    !Number.isFinite(surface.weight)||surface.weight<.8||
    !Number.isInteger(surface.floor)||surface.floor<2||
    surface.floor>SNOW_S3_MAX_Y-6||!SNOW_GROUND.has(surface.ground)||
    readCell(site.x,surface.floor,site.z)!==surface.ground||
    readCell(site.x,surface.floor-1,site.z)===0||
    isEdited(site.x,surface.floor,site.z)||
    isEdited(site.x,surface.floor-1,site.z)||
    isProtected(site.x,surface.floor,site.z)||
    isProtected(site.x,surface.floor-1,site.z))return null;
  const style=snowS3StyleAt(site,surface.floor);
  if(!style)return null;
  let tree;
  try{tree=makeTree(style,site.x,surface.floor,site.z,{wind:site.wind});}
  catch{return null;}
  if(!tree||tree.style!==style||
    tree.height!==STYLE_HEIGHTS[SNOW_S3_STYLES.indexOf(style)]||
    !Array.isArray(tree.cells)||tree.cells.length<16||tree.cells.length>119)
    return null;
  const occupied=new Set();
  for(const cell of tree.cells){
    if(!Array.isArray(cell)||cell.length!==4||!cell.every(Number.isSafeInteger))return null;
    const [x,y,z,id]=cell,key=x+','+y+','+z;
    if(!TREE_BLOCKS.has(id)||y<=surface.floor||y>SNOW_S3_MAX_Y||
      Math.abs(x-site.x)>3||Math.abs(z-site.z)>3||occupied.has(key)||
      readCell(x,y,z)!==0||isEdited(x,y,z)||isProtected(x,y,z))return null;
    occupied.add(key);
  }
  // The existing S3 tree factory owns the continuous original WOOD trunk;
  // a missing trunk invalidates the whole proposal instead of painting one.
  for(let dy=1;dy<=tree.height;dy++)
    if(!occupied.has(site.x+','+(surface.floor+dy)+','+site.z)||
      !tree.cells.some(([x,y,z,id])=>x===site.x&&
        y===surface.floor+dy&&z===site.z&&id===4))return null;
  // A frozen exact physical certificate prevents the preview from asking
  // the tree factory to create a DIFFERENT shape after safety inspection.
  // Important for protected AIR, live edits and old groves at chunk seams.
  const cells=Object.freeze(tree.cells.map(c=>Object.freeze([...c])));
  return Object.freeze({key:site.key,x:site.x,z:site.z,style,
    wind:site.wind,floor:surface.floor,voxelCount:cells.length,cells,
    kind:'detached-s3-physically-checked-proposal'});
}
