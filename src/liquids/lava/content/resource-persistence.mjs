// Lava B: compose existing resource claims with the actual shared and Lava A
// persistence adapters. No live writes, inventory issuance or game save changes.
export function createLavaResourcePersistence({codec,quench,resources,maxClaims=4096}={}){
  if(typeof codec?.encode!=='function'||typeof quench?.restore!=='function'||
    typeof quench?.stage!=='function'||typeof resources?.stage!=='function'||
    typeof resources?.validate!=='function'||typeof resources?.validateClaims!=='function'||
    typeof resources?.emptyClaims!=='function'||!Number.isSafeInteger(maxClaims)||maxClaims<1||maxClaims>65536)
    throw new TypeError('Explicit persistence and resource policies required');
  const shape=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&
    Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
  function pack(shared,revision,ledger){
    if(!shape(ledger,['version','worldId','policyId','claimed'])||
      !Array.isArray(ledger.claimed)||ledger.claimed.length>maxClaims)
      throw new TypeError('Invalid resource ledger');
    const claims=Object.freeze({...ledger,claimed:Object.freeze(Array.from(ledger.claimed))});
    resources.validateClaims(shared,claims);
    return Object.freeze({version:1,revision,ledger:claims});
  }
  function restore({shared,lava,resource}={}){
    const canonical=quench.restore({shared,lava});
    if(!shape(resource,['version','revision','ledger'])||resource.version!==1||
      resource.revision!==canonical.shared.revision)
      throw new TypeError('Resource revision mismatch or missing ledger');
    return Object.freeze({shared:canonical.shared,lava:canonical.lava,
      resource:pack(canonical.shared,resource.revision,resource.ledger)});
  }
  // Host must authenticate explicit new-world creation; never repair a missing
  // resource ledger by reinitializing an existing world.
  function initialize({shared,lava}={}){
    const c=quench.restore({shared,lava});
    if(c.shared.revision!==0||c.shared.products.length!==0)
      throw new TypeError('Resource initialization requires new world');
    return Object.freeze({shared:c.shared,lava:c.lava,resource:pack(c.shared,0,
      resources.emptyClaims(c.shared.worldId,c.shared.policyId))});
  }
  function stageQuench({state,expectedRevision,pairs,receiptIds}={}){
    const before=restore(state);
    if(expectedRevision!==before.shared.revision)return null;
    const next=quench.stage({shared:before.shared,lava:before.lava,pairs,receiptIds});
    if(!next||next.status==='unchanged')return next;
    const after=restore({...next.state,resource:{...before.resource,revision:next.state.shared.revision}});
    return Object.freeze({...next,state:after});
  }
  function stageClaim({state,expectedRevision,receiptId,kind}={}){
    const before=restore(state);
    if(expectedRevision!==before.shared.revision)return null;
    const plan=resources.stage({shared:before.shared,claims:before.resource.ledger,receiptId,kind});
    if(!plan||plan.claims.claimed.length>maxClaims)return null;
    const after=restore({shared:{...before.shared,revision:plan.nextRevision},
      lava:{...before.lava,revision:plan.nextRevision},
      resource:{version:1,revision:plan.nextRevision,ledger:plan.claims}});
    const encoded=codec.encode(after.shared);
    if(!resources.validate(plan,{shared:before.shared,claims:before.resource.ledger}))return null;
    return Object.freeze({expectedRevision,output:plan.output,state:after,encoded});
  }
  // Results are proposals only. Host must authenticate the entire current
  // revision, hold exclusive world/inventory lease, and atomically persist all
  // three ledgers plus output/terrain. No independent sidecar adoption.
  return Object.freeze({initialize,restore,stageQuench,stageClaim});
}
