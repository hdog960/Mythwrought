// Frostbound S1, isolated successor terrain. No production imports or registration.
// Only physical, already registered snow/permafrost cells; no new material IDs.
const AIR=0,GRASS=1,SNOW=272,PERMAFROST=278,RIME=279;
const WINTER=new Set([272,276,279]);
const unit=v=>Math.max(0,Math.min(1,v));
const ease=v=>{const t=unit(v);return t*t*(3-2*t);};
export function frostboundWindField(x,z,seed){
 const p=(seed%223)*.19;
 const broad=.5+.5*Math.sin(x*.071+z*.037+p+1.2*Math.sin(z*.039));
 const lee=.5+.5*Math.sin(x*.043-z*.092-p+.8*Math.sin(x*.031));
 return .68*broad+.32*lee;
}
// Inputs are the original combined-world column, exact raw legacy/landmark
// and authored cave readers. Never mutate input maps or edit saved profiles.
export function planFrostboundColumn({x,z,seed,region,original,oldTop,readRaw,caveAt,maxY}){
 if(region?.name!=='snow'||region.weight<.65)return original;
 const field=frostboundWindField(x,z,seed);
 const top=original.size?Math.max(...original.keys()):oldTop;
 if(top<oldTop||top>maxY-2)return original;
 // Failed original raised-column admission can leave visible legacy grass
 // beneath protected vegetation or above original cave AIR. Change ONLY the
 // actual ordinary grass cap, never occupy any other source cell.
 if(original.size===0){
  if(readRaw(x,oldTop,z)!==GRASS||caveAt(x,oldTop,z)!==undefined)return original;
  return new Map([[oldTop,field>.78?RIME:SNOW]]);
 }
 if(!WINTER.has(original.get(top)))return original;
 // Rounded lee drifts: at most one physical layer above existing qualified
 // winter shelves. Preserve low-weight shoulder material and every authored
 // cell. Keep two free vertical cells within the existing surface ceiling.
 if(top>=maxY-2||field*ease((region.weight-.65)/.35)<.79)return original;
 if(caveAt(x,top,z)!==undefined||caveAt(x,top+1,z)!==undefined||
    readRaw(x,top+1,z)!==AIR||original.has(top+1))return original;
 // Refuse anything above the new drift (legacy tree/landmark overhang or
 // explicitly authored cave), and do not replace the existing foundation.
 for(let y=top+2;y<=maxY;y++)
  if(readRaw(x,y,z)!==AIR||caveAt(x,y,z)!==undefined)return original;
 const support=original.get(top-1)??readRaw(x,top-1,z);
 if(![GRASS,2,3,SNOW,PERMAFROST,RIME].includes(support)||
    caveAt(x,top-1,z)!==undefined)return original;
 const next=new Map(original);
 next.set(top,PERMAFROST);
 next.set(top+1,SNOW);
 return next;
}
