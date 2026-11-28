// Liquid Resonance B: shared presentation v1 material and transient effect handoff.
import {RESONANCE_VISUAL,buildResonanceVisualBatch} from './visuals.mjs';
export const RESONANCE_MATERIAL=Object.freeze({id:RESONANCE_VISUAL.id,pass:'transparent',
  color:RESONANCE_VISUAL.baseRGB,alpha:.48,emissive:.12,depthTest:true,depthWrite:false,
  cull:false,blend:'straight-alpha'});
const int=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
const point=p=>Array.isArray(p)&&p.length===3&&int(p[0],-Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER)&&int(p[1],-210,256)&&int(p[2],-Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
const id=v=>typeof v==='string'&&v.length>0&&v.length<=128;
// Host holds a stable read lease. Epoch covers simulation, ownership, camera
// selection and cache invalidation; cache.get alone can return previous-good.
export function createResonancePresentation({physics,readCell,isLoaded,isOpen,getBatch,isBatchReady,ownsCell,readEpoch,
  maxBatches=32,maxCandidates=2048,maxCells=96,maxSegments=768,maxParticles=192}={}){
  if(!int(physics?.ENERGY_SCALE,1,65535)||typeof physics?.readResonanceCell!=='function'||
    [readCell,isLoaded,isOpen,getBatch,isBatchReady,ownsCell,readEpoch].some(f=>typeof f!=='function'))throw TypeError('Explicit presentation host required');
  if(!int(maxBatches,1,128)||!int(maxCandidates,1,2048)||!int(maxCells,0,256)||!int(maxSegments,0,4096)||!int(maxParticles,0,512))throw RangeError('Invalid effect budget');
  const frames=new WeakMap();
  const epoch=()=>{const e=readEpoch();if(!int(e,0,Number.MAX_SAFE_INTEGER))throw TypeError('Invalid view epoch');return e;};
  const ready=b=>getBatch(b.id)===b&&isBatchReady(b.id,b.revision)===true;
  function current(e,batches){return epoch()===e&&batches.every(ready)&&epoch()===e;}
  function build({selection,origin,phase=0}={}){
    if(!Array.isArray(selection)||selection.length>maxBatches||!point(origin)||!Number.isFinite(phase)||phase<0||phase>=1)throw RangeError('Invalid effect selection');
    const e=epoch(),batches=[],candidates=[],ids=new Set(),seen=new Set();
    for(const row of selection){
      const {batch:b,cells}=row??{};
      if(!id(b?.id)||ids.has(b.id)||!int(b.revision,0,Number.MAX_SAFE_INTEGER)||b.mesh?.version!==1||!Array.isArray(b.mesh.groups)||!Array.isArray(cells)||cells.length>maxCandidates-candidates.length)throw RangeError('Invalid or excessive batch selection');
      ids.add(b.id);batches.push(b);
      if(!ready(b))return null;
      for(const p of cells){
        if(!point(p)||seen.has(p.join(',')))throw TypeError('Invalid or duplicate effect cell');
        seen.add(p.join(','));
        if(ownsCell(b.id,...p)!==true)return null;
        candidates.push([...p]);
      }
    }
    // One bounded backing allocation across the entire visible selection,
    // not one allocation per owner. Geometry is optional and may be culled.
    const effects=buildResonanceVisualBatch({candidates,origin,phase,readCell,isLoaded,isOpen,
      readResonanceCell:physics.readResonanceCell,energyScale:physics.ENERGY_SCALE,maxCells,maxSegments,maxParticles});
    if(!current(e,batches))return null;
    const bindings=Object.freeze(batches.map(b=>Object.freeze({id:b.id,revision:b.revision})));
    const frame=Object.freeze({epoch:e,bindings,material:RESONANCE_MATERIAL,effects,
      allocatedBytes:effects.segments.buffer.byteLength+effects.particles.buffer.byteLength});
    frames.set(frame,batches);return frame;
  }
  function isCurrent(frame){const batches=frames.get(frame);return !!batches&&current(frame.epoch,batches);}
  return Object.freeze({build,isCurrent});
}
