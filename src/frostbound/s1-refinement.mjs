// S1 physical refinement. Only the surrounding snow shelf may be feathered;
// a protected depression itself is never filled. All reads are source-exact.
const WINTER=new Set([272,276,279]);
const SOLID=new Set([1,2,3,272,276,278,279]);
export function featherSnowShelf({x,z,region,plan,oldTop,readRaw,caveAt,neighborTop,maxY}){
 if(region?.name!=='snow'||region.weight<.65||!plan.size)return plan;
 const top=Math.max(...plan.keys()),cap=plan.get(top);
 if(top<oldTop+2||top>maxY-2||!WINTER.has(cap)||
    !plan.has(top-1)||!SOLID.has(plan.get(top-2)))return plan;
 if(![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>{
  const n=neighborTop(x+dx,z+dz);return n!==null&&top-n>=2;
 }))return plan;
 for(let y=top-2;y<=maxY;y++){
  if(caveAt(x,y,z)!==undefined)return plan;
  if(y>=top-1&&readRaw(x,y,z)!==0)return plan;
 }
 const next=new Map(plan);next.delete(top);next.set(top-1,cap);return next;
}
// Snow-owned foliage only, not trunks, non-snow cells or protected landmarks.
export function winterGroveMaterial(id,region,ordinaryGrove,protectedLandmark){
 if(id!==7||region?.name!=='snow'||region.weight<.48||!ordinaryGrove||protectedLandmark)return id;
 return region.weight>=.65?407:406;
}
