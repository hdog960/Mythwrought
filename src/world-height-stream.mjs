// Renderer-owned bounded selection. No voxel reads or GPU allocation.
import {runtimeSectionForY,runtimeMeshKey,runtimeSectionBounds,upperOccupancy,UPPER_SECTION_COUNT,physicalBodyRegions} from './world-height.mjs';
import {UPPER_GPU_OWNERS} from './world-height-budget.mjs';
export function planHeightStream(world,{x,feet,z},legacy){
 const active=runtimeSectionForY(feet)??0,cx=Math.floor(x/16),cz=Math.floor(z/16);
 if(active<0||feet<3)return legacy;
 const near=feet>=16,natural=feet>=32,upper=[],ground=legacy.filter(c=>c.section===0);
 const body=new Set((physicalBodyRegions({x,feet,z})??[]).map(r=>r.key));
 const distance=(v,lo,hi)=>Math.max(lo-v,0,v-hi);
 for(let s=1;s<=UPPER_SECTION_COUNT;s++)for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++){
  const nearby=near&&Math.max(Math.abs(a-cx),Math.abs(b-cz))<=1&&Math.abs(s-active)<=1;
  const key=runtimeMeshKey(a,b,s),required=body.has(key);
  const occupied=upperOccupancy(world,key,{natural:natural||nearby||required});
  if(!required&&!nearby&&!occupied)continue;
  const y=runtimeSectionBounds(s);
  const score=distance(x,a*16,(a+1)*16)**2+distance(z,b*16,(b+1)*16)**2+
    distance(feet+.89,y.minY,y.maxY+1)**2;
  upper.push({cx:a,cz:b,section:s,required,occupied,score});
 }
 if(!upper.length)return legacy;
 upper.sort((a,b)=>Number(b.required)-Number(a.required)||a.score-b.score||a.section-b.section||a.cz-b.cz||a.cx-b.cx);
 const chosen=[],keys=new Set();let occupiedCount=0;
 const insert=c=>{
  const k=runtimeMeshKey(c.cx,c.cz,c.section);
  if(chosen.length>=25||keys.has(k)||c.section>0&&c.occupied&&occupiedCount>=UPPER_GPU_OWNERS)return;
  chosen.push(c);keys.add(k);if(c.section>0&&c.occupied)occupiedCount++;
 };
 for(const c of upper.filter(c=>c.required))insert(c);
 for(const c of ground.filter(c=>body.has(runtimeMeshKey(c.cx,c.cz,c.section))))insert(c);
 if(feet<=52)for(const c of ground.filter(c=>Math.max(Math.abs(c.cx-cx),Math.abs(c.cz-cz))<=1))insert(c);
 for(const c of upper)insert(c);
 for(const c of ground)insert(c);
 return chosen;
}
