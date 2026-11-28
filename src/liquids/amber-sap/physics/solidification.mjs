// Amber Sap A: stage a full-cell conversion; never mutate live liquid or terrain.
export const SAP_SOLID_VERSION=1;
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=c=>[c.x,c.y,c.z];
const key=c=>point(c).join(',');
const full=c=>c?.id==='amber-sap'&&c.units===8&&Number.isSafeInteger(c.x)&&
  int(c.y,-210,256)&&Number.isSafeInteger(c.z)&&c.quantities&&
  typeof c.quantities==='object'&&!Array.isArray(c.quantities)&&Object.keys(c.quantities).length===0;
// Preserve the entire canonical snapshot emitted by the pinned core AFTER
// extraction/wakes, including optional queue and directional metadata. Do not
// reconstruct a partial schema here or copy stale metadata from the input.
function freezeSnapshot(s){
  if(s!==null&&typeof s==='object'&&!Object.isFrozen(s)){
    for(const value of Object.values(s))freezeSnapshot(value);
    Object.freeze(s);
  }
  return s;
}

// createLiquidEngine is the pinned Water A factory, injected to avoid copying
// the shared module onto this isolated branch. All callbacks are pure/stable
// under the host's exclusive edit/streaming lease.
export function createSapSolidification({createLiquidEngine,definitions,reactionRules=[],
  isLoaded,isOpen,canPlaceAmber,enabled=false,maxCells=8192,maxVisits=256,maxSolidCells=8192}={}){
  if([createLiquidEngine,isLoaded,isOpen,canPlaceAmber].some(f=>typeof f!=='function')||
    !Array.isArray(definitions)||!definitions.some(d=>d?.id==='amber-sap'))
    throw new TypeError('Explicit shared engine and amber placement policy required');
  if(typeof enabled!=='boolean'||!int(maxCells,1,65536)||!int(maxVisits,1,4096)||!int(maxSolidCells,0,65536))
    throw new RangeError('Invalid solidification policy or budget');
  const config={definitions,reactionRules,isLoaded,isOpen,maxCells,maxVisits};
  createLiquidEngine(config);
  function readLedger(ledger,resident){
    if(ledger?.version!==SAP_SOLID_VERSION||!Array.isArray(ledger.cells)||ledger.cells.length>maxSolidCells||
      !ledger.cells.every(full))throw new TypeError('Invalid amber solid ledger');
    // Reuse the shared record/coordinate/duplicate validator. Never tick it.
    const cells=createLiquidEngine({...config,maxCells:Math.max(1,maxSolidCells),
      snapshot:{version:1,cells:ledger.cells,pending:[]}}).save().cells;
    if(cells.some(c=>resident.getCell(...point(c))!==null))throw new TypeError('Amber ledger overlaps resident liquid');
    return cells;
  }
  function stage({engine,curing,proposal,solid,revision}={}){
    if(!int(revision,0,Number.MAX_SAFE_INTEGER-1)||typeof engine?.save!=='function'||
      typeof engine?.getCell!=='function'||typeof curing?.isReady!=='function'||typeof curing?.save!=='function')
      throw new TypeError('Expected live engine, paired curing and host revision');
    const c=proposal?.expected;
    if(!enabled||!full(c)||proposal.consumeSap!==8||proposal.solidUnits!==8||proposal.product!=='amber'||
      engine.getCell(...point(c))!==c||curing.isReady(proposal)!==true)return null;
    const p=point(c);
    if(isLoaded(...p)!==true||isOpen(...p)!==true||canPlaceAmber(c)!==true)return null;
    const original=engine.save();
    if(!Array.isArray(original?.cells)||original.cells.length>maxCells)throw new TypeError('Resident snapshot exceeds budget');
    const staged=createLiquidEngine({...config,snapshot:original});
    if(staged===engine)throw new TypeError('Private staging engine required');
    const ledger=readLedger(solid,staged);
    if(ledger.length>=maxSolidCells)return null;
    const current=staged.getCell(...p);
    if(!full(current)||key(current)!==key(c))return null;
    const progress=curing.save();
    // A paired snapshot must include the ready coordinate. Preserve every
    // other row in exact order; removing this row prevents stale dwell credit.
    if(progress?.version!==1||typeof progress.signature!=='string'||!Array.isArray(progress.pending)||
      progress.pending.length>65536||progress.pending.filter(r=>Array.isArray(r)&&r.length===4&&
        r[0]===p[0]&&r[1]===p[1]&&r[2]===p[2]&&int(r[3],1,1000000)).length!==1)
      throw new TypeError('Missing paired curing progress');
    // Final live token check before extracting ONLY from the private engine.
    if(engine.getCell(...p)!==c||curing.isReady(proposal)!==true)return null;
    const consumed=staged.extract(...p,8);
    if(!full(consumed))return null;
    ledger.push(consumed);
    const nextCuring=Object.freeze({version:1,signature:progress.signature,
      pending:Object.freeze(progress.pending.filter(r=>r[0]!==p[0]||r[1]!==p[1]||r[2]!==p[2])
        .map(r=>Object.freeze([...r])))});
    return Object.freeze({expectedRevision:revision,nextRevision:revision+1,
      resident:freezeSnapshot(staged.save()),curing:nextCuring,
      solid:Object.freeze({version:SAP_SOLID_VERSION,cells:Object.freeze(ledger)}),
      placement:Object.freeze({x:c.x,y:c.y,z:c.z,product:'amber',solidUnits:8}),
      changed:Object.freeze([Object.freeze(p)])});
  }
  return Object.freeze({stage});
}
