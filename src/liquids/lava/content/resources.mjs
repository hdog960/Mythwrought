// Lava B: isolated resource claim proposals, not inventory or machine writes.
export const LAVA_RESOURCE_VERSION=1;
const token=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(s);
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const immutable=o=>o!==null&&typeof o==='object'&&Object.isFrozen(o);
const kinds=['cooled-rock','foundry-feedstock'];

export function createLavaResourceAdapter({describeQuenchReceipt,canClaim,allowClaims=false,
  maxReceipts=4096,maxClaims=4096}={}){
  if(typeof describeQuenchReceipt!=='function'||typeof canClaim!=='function'||typeof allowClaims!=='boolean')
    throw new TypeError('Explicit owner and host policies required');
  if(!int(maxReceipts,1,65536)||!int(maxClaims,1,maxReceipts))throw new RangeError('Resource ledger budget');
  const plans=new WeakMap();
  function inspect(shared,claims){
    if(!immutable(shared)||shared.version!==1||!token(shared.worldId)||!token(shared.policyId)||
      !int(shared.revision,0,Number.MAX_SAFE_INTEGER)||!Array.isArray(shared.products)||!immutable(shared.products)||shared.products.length>maxReceipts)
      throw new TypeError('Expected canonical immutable shared sidecar');
    const rows=new Map();
    for(const row of shared.products){
      if(!immutable(row)||!token(row.id)||rows.has(row.id)||typeof row.product!=='string'||
        !Array.isArray(row.productInputs)||!immutable(row.productInputs)||!int(row.productInputs.length,1,2)||
        row.productInputs.some(c=>!immutable(c)||!immutable(c.quantities)))throw new TypeError('Invalid receipt history');
      rows.set(row.id,row);
    }
    if(!immutable(claims)||Object.keys(claims).length!==4||claims.version!==LAVA_RESOURCE_VERSION||
      claims.worldId!==shared.worldId||claims.policyId!==shared.policyId||
      !Array.isArray(claims.claimed)||!immutable(claims.claimed)||claims.claimed.length>maxClaims)
      throw new TypeError('Invalid resource claim ledger');
    const used=new Set();
    for(const id of claims.claimed){
      const row=rows.get(id);
      if(!token(id)||used.has(id)||!row||!describeQuenchReceipt(row))throw new TypeError('Unknown or duplicate claimed receipt');
      used.add(id);
    }
    return {rows,used};
  }
  // Only for explicit new-world initialization; never reset missing saved claims.
  function emptyClaims(worldId,policyId){
    if(!token(worldId)||!token(policyId))throw new TypeError('Invalid resource ledger identity');
    return Object.freeze({version:LAVA_RESOURCE_VERSION,worldId,policyId,claimed:Object.freeze([])});
  }
  function stage({shared,claims,receiptId,kind}={}){
    if(!allowClaims)return null;
    if(!token(receiptId)||!kinds.includes(kind))throw new TypeError('Invalid resource request');
    const {rows,used}=inspect(shared,claims);
    const row=rows.get(receiptId);
    if(!row||used.has(receiptId)||used.size>=maxClaims||shared.revision===Number.MAX_SAFE_INTEGER)return null;
    const ledger=describeQuenchReceipt(row);
    if(!ledger)return null;
    // Exactly the accounted solid mass, not a block count, recipe or item price.
    const output=Object.freeze({kind,units:ledger.solidUnits,receiptId,at:ledger.at});
    if(canClaim(output,shared.revision)!==true)return null;
    const nextClaims=Object.freeze({...claims,claimed:Object.freeze([...claims.claimed,receiptId])});
    const plan=Object.freeze({expectedRevision:shared.revision,nextRevision:shared.revision+1,output,claims:nextClaims});
    plans.set(plan,{shared,claims});
    return plan;
  }
  // A one-attempt check under the host's exclusive state/inventory lease.
  // Host must atomically adopt claim ledger, output and ALL owner revisions.
  function validate(plan,{shared,claims}={}){
    const expected=plans.get(plan);
    if(!expected)return false;
    plans.delete(plan);
    if(shared!==expected.shared||claims!==expected.claims||shared.revision!==plan.expectedRevision)return false;
    return canClaim(plan.output,shared.revision)===true;
  }
  return Object.freeze({emptyClaims,stage,validate,validateClaims(shared,claims){inspect(shared,claims);return true;}});
}
