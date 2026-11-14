// :48 opt-in forest composition. Never alters seeded terrain or player edits.
// :24 owns where forests belong; callers supply a bounded region explicitly.
import {planVoxelTree, TREE_VARIANTS} from './voxel-trees.mjs';
const hash=(x,z,seed)=>{
 let h=(Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(seed,1442695041))|0;
 h=Math.imul(h^(h>>>13),1274126177);
 return (h^(h>>>16))>>>0;
};
// Optional :24-supplied footpaths are horizontal segments. Preserve a two-block
// walking corridor at head height; overhead canopy remains welcome.
const distanceSq=(x,z,a,b)=>{
 const dx=b[0]-a[0],dz=b[1]-a[1];
 const t=dx||dz?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz))):0;
 return (x-a[0]-t*dx)**2+(z-a[1]-t*dz)**2;
};
export function planVoxelGrove(world,{minX,minZ,maxX,maxZ,spacing=9,maxTrees=12,paths=[]}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
  ![minX,minZ,maxX,maxZ,spacing,maxTrees].every(Number.isInteger)||
  minX>maxX||minZ>maxZ||spacing<7||spacing>32||maxTrees<1||maxTrees>64||
  (maxX-minX+1)*(maxZ-minZ+1)>65536||
  !Array.isArray(paths)||paths.length>8||
  paths.some(segment=>!Array.isArray(segment)||segment.length!==2||
   segment.some(p=>!Array.isArray(p)||p.length!==2||
    p.some(n=>!Number.isSafeInteger(n)))||
   segment.some(p=>p[0]<minX-16||p[0]>maxX+16||
    p[1]<minZ-16||p[1]>maxZ+16)))return null;
 const plans=[],occupied=new Set();
 // World-aligned grid makes the same candidate independent of request bounds.
 const startX=Math.ceil(minX/spacing)*spacing,startZ=Math.ceil(minZ/spacing)*spacing;
 outer: for(let x=startX;x<=maxX;x+=spacing)for(let z=startZ;z<=maxZ;z+=spacing){
  if(plans.length>=maxTrees)break outer;
  const h=hash(x,z,world.seed);
  if(h%5===0)continue; // small natural clearings, deterministic
  const variant=TREE_VARIANTS[(h>>>8)%TREE_VARIANTS.length];
  const p=planVoxelTree(world,x,z,{variant});
  if(!p)continue;
  // Reserve ground-level walking clearance, not an artificial tunnel.
  if(paths.some(([a,b])=>p.cells.some(([cx,cy,cz])=>
   cy<=p.origin[1]+3&&distanceSq(cx,cz,a,b)<=4)))continue;
  if(p.cells.some(([cx,cy,cz])=>occupied.has(cx+','+cy+','+cz)))continue;
  for(const [cx,cy,cz] of p.cells)occupied.add(cx+','+cy+','+cz);
  plans.push(p);
 }
 return {seed:world.seed,plans,treeCount:plans.length,optIn:true};
}
