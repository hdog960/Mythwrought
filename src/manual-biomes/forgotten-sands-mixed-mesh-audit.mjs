// Original-source mixed-group resident geometry audit; offline only.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {researchP0JointGroup} from './forgotten-sands-joint-group.mjs';
import {p0BenchmarkMesh,p0BenchmarkWindow} from './forgotten-sands-second-site.mjs';
export const P0_MIXED_GROUPS=Object.freeze([
{seed:179,centers:[[377,-52,23],[377,-12,31],[377,32,31]]},
{seed:179,centers:[[504,-162,23],[504,-122,31],[504,-78,31]]},
{seed:2026,centers:[[629,-1477,23],[629,-1437,31],[629,-1393,31]]},
{seed:2026,centers:[[-900,-2095,31],[-900,-2054,31],[-900,-2011,23]]}
].map(c=>Object.freeze({seed:c.seed,axis:'z',modules:Object.freeze(c.centers.map(([x,z,size])=>Object.freeze({seed:c.seed,x,z,size,height:size===31?28:20})))})));
export function prepareP0MixedGroup(index){
  const spec=P0_MIXED_GROUPS[index];if(!spec)throw Error('Invalid group index');
  const world=new FourRegionWorld(spec.seed,fourRegionProfile(spec.seed,M7_ENVIRONMENT_GENERATOR));
  const group=researchP0JointGroup(world,spec,{reserved:()=>false,ownerRevision:()=>'quiet-research'});
  if(!group.accepted)throw Error('Joint group refused: '+group.reason);
  return Object.freeze({world,spec,group});
}
export function p0MixedAuditEnvelope(spec){
  const minX=Math.min(...spec.modules.map(m=>m.x-(m.size-1)/2))-8,maxX=Math.max(...spec.modules.map(m=>m.x+(m.size-1)/2))+8;
  const minZ=Math.min(...spec.modules.map(m=>m.z-(m.size-1)/2))-8,maxZ=Math.max(...spec.modules.map(m=>m.z+(m.size-1)/2))+8;
  // Max cap17, floor18, height28 gives top45. Section2 covers through51.
  const coords=[];
  for(let cx=Math.floor(minX/16);cx<=Math.floor(maxX/16);cx++)for(let cz=Math.floor(minZ/16);cz<=Math.floor(maxZ/16);cz++)
    for(let s=0;s<=2;s++)coords.push(Object.freeze({cx,cz,s,key:[cx,cz,s].join(',')}));
  return Object.freeze({minX,maxX,minZ,maxZ,coords:Object.freeze(coords)});
}
export function p0MixedRouteWindows(group){
  const map=new Map();
  for(const n of group.nodes){
    const cx=Math.floor(n.x/16),cz=Math.floor(n.z/16);
    for(const feet of [n.feet,20,36]){
      const key=[cx,cz,feet].join(',');if(!map.has(key))map.set(key,Object.freeze({cx,cz,feet,keys:p0BenchmarkWindow(cx,cz,feet)}));
    }
  }
  return Object.freeze([...map.values()]);
}
// Distant overview sampling: actual original mesh per chunk, no extra
// resident allocation implied. An overview cannot be declared live under
// the 27-buffer budget merely because its geometry can be generated.
export function p0MixedVistaKeys(spec){
  const env=p0MixedAuditEnvelope(spec),cx0=Math.floor(env.minX/16),cx1=Math.floor(env.maxX/16),
    cz0=Math.floor(env.minZ/16),cz1=Math.floor(env.maxZ/16),out=[];
  for(let cx=cx0;cx<=cx1;cx++)for(let cz=cz0;cz<=cz1;cz++)for(let s=1;s<=2;s++)
    out.push(Object.freeze({cx,cz,s,key:[cx,cz,s].join(',')}));
  return Object.freeze(out);
}
export {p0BenchmarkMesh};
