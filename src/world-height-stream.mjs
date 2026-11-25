// Renderer-owned bounded selection. No voxel reads or GPU allocation.
import {runtimeSectionForY,runtimeMeshKey,upperOccupancy,UPPER_SECTION_COUNT} from './world-height.mjs';
export function planHeightStream(world,{x,feet,z},legacy){
  const active=runtimeSectionForY(feet)??0,cx=Math.floor(x/16),cz=Math.floor(z/16);
  if(active<0||feet<3)return legacy;
  const near=feet>=16,upper=[],ground=legacy.filter(c=>c.section===0);
  for(let s=1;s<=UPPER_SECTION_COUNT;s++)for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++){
    const required=near&&Math.max(Math.abs(a-cx),Math.abs(b-cz))<=1&&Math.abs(s-active)<=1;
    if(required||upperOccupancy(world,runtimeMeshKey(a,b,s)))
      upper.push({cx:a,cz:b,section:s,required,score:(a-cx)**2+(b-cz)**2+Math.abs(s-active)*3});
  }
  if(!upper.length)return legacy;
  upper.sort((a,b)=>Number(b.required)-Number(a.required)||a.score-b.score||a.section-b.section||a.cz-b.cz||a.cx-b.cx);
  const core=active<=1?ground.filter(c=>Math.max(Math.abs(c.cx-cx),Math.abs(c.cz-cz))<=1):[];
  const chosen=[...core],keys=new Set(core.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
  const insert=c=>{const k=runtimeMeshKey(c.cx,c.cz,c.section);if(chosen.length<25&&!keys.has(k)){chosen.push(c);keys.add(k);}};
  for(const c of upper.filter(c=>c.required))insert(c);
  for(const c of upper.filter(c=>!c.required).slice(0,8))insert(c);
  for(const c of ground)insert(c);
  return chosen;
}
