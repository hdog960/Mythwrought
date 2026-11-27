// Liquid Resonance B. Renderer-neutral, display-only candidate; no runtime mount.
export const RESONANCE_VISUAL = Object.freeze({id:'liquid-resonance',
  material:'resonance-filament-volume',baseRGB:Object.freeze([0.12,0.035,0.23]),
  emissionRGB:Object.freeze([0.66,0.38,1]),segmentStride:7,particleStride:5});
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const tau=2*Math.PI;
function seed(x,y,z){
  let h=Math.imul(x|0,0x9e3779b1)^Math.imul(y|0,0x85ebca6b)^Math.imul(z|0,0xc2b2ae35);
  h=Math.imul(h^(h>>>16),0x7feb352d);return ((h^(h>>>15))>>>0)/4294967296;
}
// Host supplies an ordered bounded visible-candidate list and A's pure validator.
// Segment layout: x0,y0,z0,x1,y1,z1,emission; particle: x,y,z,radius,emission.
// Coordinates are relative to origin; never allocate GPU or modify cells here.
export function buildResonanceVisualBatch({candidates,origin,readCell,readResonanceCell,isLoaded,isOpen,
  phase=0,energyScale=1024,maxCells=96,maxSegments=768,maxParticles=192}={}){
  if(!Array.isArray(candidates)||candidates.length>2048||!point(origin)||
    [readCell,readResonanceCell,isLoaded,isOpen].some(f=>typeof f!=='function')||
    !Number.isFinite(phase)||phase<0||phase>=1||!int(energyScale,1,65535)||
    !int(maxCells,0,256)||!int(maxSegments,0,4096)||!int(maxParticles,0,512))
    throw new RangeError('Invalid resonance visual input or budget');
  const segments=new Float32Array(maxSegments*7),particles=new Float32Array(maxParticles*5),seen=new Set();
  let cells=0,segmentCount=0,particleCount=0,invalid=0;
  for(const p of candidates){
    if(cells>=maxCells||(segmentCount+4>maxSegments&&particleCount>=maxParticles))break;
    if(!point(p)){invalid++;continue;}
    const [x,y,z]=p,k=p.join(',');if(seen.has(k))continue;seen.add(k);
    const lx=x-origin[0],ly=y-origin[1],lz=z-origin[2];
    if(Math.max(Math.abs(lx),Math.abs(ly),Math.abs(lz))>2048||isLoaded(x,y,z)!==true||isOpen(x,y,z)!==true)continue;
    const raw=readCell(x,y,z);if(raw?.id!==RESONANCE_VISUAL.id)continue;
    let c;try{c=readResonanceCell(raw);}catch{invalid++;continue;}
    const energy=c?.quantities?.['resonance-energy']??0;
    if(c?.id!==RESONANCE_VISUAL.id||c.x!==x||c.y!==y||c.z!==z||!int(c.units,1,8)||!int(energy,0,c.units*energyScale)){invalid++;continue;}
    const fill=c.units/8,charge=energy/(c.units*energyScale),s=seed(x,y,z),glow=0.12+0.88*charge;
    // Two internal braided filaments, not surface waves. Each has four segments.
    for(let strand=0;strand<2&&segmentCount+4<=maxSegments;strand++){
      const vertex=i=>{const t=i/4,a=tau*(s+phase+t*.75+strand*.5);
        return [lx+.5+.29*Math.cos(a),ly+fill*(.14+.72*t),lz+.5+.29*Math.sin(a)];};
      let a=vertex(0);for(let i=1;i<=4;i++){const b=vertex(i);segments.set([...a,...b,glow],segmentCount++*7);a=b;}
    }
    // Zero-energy material stays distinct but emits no motes. Motes orbit inside fill.
    const count=charge===0?0:charge>.5?2:1;
    for(let i=0;i<count&&particleCount<maxParticles;i++){
      const a=tau*(s+phase+i*.5),r=Math.min(.025,fill*.1);
      particles.set([lx+.5+.18*Math.sin(a),ly+fill*(.5+.28*Math.cos(a*1)),lz+.5+.18*Math.cos(a),r,glow],particleCount++*5);
    }
    cells++;
  }
  return Object.freeze({material:RESONANCE_VISUAL,origin:Object.freeze([...origin]),cells,invalid,segmentCount,particleCount,
    segments:segments.subarray(0,segmentCount*7),particles:particles.subarray(0,particleCount*5)});
}
