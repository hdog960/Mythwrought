// :48 opt-in forest composition. Never alters seeded terrain or player edits.
// :24 owns where forests belong; callers supply a bounded region explicitly.
import {planVoxelTree, TREE_VARIANTS} from './voxel-trees.mjs';
const hash=(x,z,seed)=>{
 let h=(Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(seed,1442695041))|0;
 h=Math.imul(h^(h>>>13),1274126177);
 return (h^(h>>>16))>>>0;
};
export function planVoxelGrove(world,{minX,minZ,maxX,maxZ,spacing=9,maxTrees=12}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
  ![minX,minZ,maxX,maxZ,spacing,maxTrees].every(Number.isInteger)||
  minX>maxX||minZ>maxZ||spacing<7||spacing>32||maxTrees<1||maxTrees>64||
  (maxX-minX+1)*(maxZ-minZ+1)>65536)return null;
 const plans=[],occupied=new Set();
 // World-aligned grid makes the same candidate independent of request bounds.
 const startX=Math.ceil(minX/spacing)*spacing,startZ=Math.ceil(minZ/spacing)*spacing;
 for(let x=startX;x<=maxX;x+=spacing)for(let z=startZ;z<=maxZ;z+=spacing){
  if(plans.length>=maxTrees)break;
  const h=hash(x,z,world.seed);
  if(h%5===0)continue; // small natural clearings, deterministic
  const variant=TREE_VARIANTS[(h>>>8)%TREE_VARIANTS.length];
  const p=planVoxelTree(world,x,z,{variant});
  if(!p)continue;
  if(p.cells.some(([cx,cy,cz])=>occupied.has(cx+','+cy+','+cz)))continue;
  for(const [cx,cy,cz] of p.cells)occupied.add(cx+','+cy+','+cz);
  plans.push(p);
 }
 return {seed:world.seed,plans,treeCount:plans.length,optIn:true};
}
