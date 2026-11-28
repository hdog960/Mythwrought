// Water B: prepare water uniforms once for each producing voxel at rebuild.
import {prepareLiquidFaceStyles} from '../../presentation/styled-draw.mjs';
import {describeWaterSurface} from './features.mjs';
import {prepareWaterShade} from './water-shading.mjs';
export function prepareWaterBatchStyles({batch,engine,isLoaded,isOpen,foamStrength,policy,maxFaces}={}){
  const cache=new Map();
  return prepareLiquidFaceStyles({batch,maxFaces,styleForFace:({cell,normal,liquid})=>{
    if(liquid!=='water')return null;
    const key=cell.join(',');
    if(!cache.has(key))cache.set(key,describeWaterSurface({engine,isLoaded,isOpen,x:cell[0],y:cell[1],z:cell[2],foamStrength}));
    const surface=cache.get(key);if(!surface)throw Error('Water face no longer has a loaded water owner');
    const s=prepareWaterShade({normal,surface,policy});
    return [...s.base,s.shade,s.foamMask,s.foamStrength,s.foamWidth,s.fallStrength,s.tangentAxis];
  }});
}

// Surface hints also read the cell below each horizontal neighbor. Reverse
// that dependency, including diagonal-up owners across chunk boundaries.
export function expandWaterStyleDirty(changed,{maxChanged=256,maxDirty=2816}={}){
  const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
  const valid=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger)&&int(p[1],-210,256);
  if(!int(maxChanged,1,4096)||!int(maxDirty,1,45056)||!Array.isArray(changed)||changed.length>maxChanged)throw RangeError('Water style dirty budget');
  const offsets=[[0,0,0],[0,-1,0],[0,1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[1,1,0],[0,1,1],[-1,1,0],[0,1,-1]];
  const out=new Map();
  for(const p of changed){
    if(!valid(p))throw RangeError('Invalid water style dirty point');
    for(const d of offsets){const q=p.map((n,i)=>n+d[i]);if(!valid(q))continue;out.set(q.join(','),q);if(out.size>maxDirty)throw RangeError('Water style dirty output budget');}
  }
  return [...out.values()];
}
