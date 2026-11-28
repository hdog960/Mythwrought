// Lava A proposal: couple owner ledgers to Water A persistence v1 without
// duplicating quench receipts or changing the shared/game save schema.
import {createLavaVents} from './vents.mjs';
import {createLavaThermalScheduler} from './thermal-scheduler.mjs';
import {describeQuenchReceipt} from './transactions.mjs';
import {readLavaHeat} from './definition.mjs';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const token=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(s);
const point=c=>Object.freeze([c.x,c.y,c.z]);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function shape(o,keys){
  if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))
    throw new TypeError('Unexpected lava persistence fields');
}
function receipt(r,stored=false){
  shape(r,stored?['id','product','productInputs']:['product','productInputs','changed']);
  if((stored&&!token(r.id))||(!stored&&!Array.isArray(r.changed))||!describeQuenchReceipt(r))throw new TypeError('Invalid lava quench receipt');
  const productInputs=Object.freeze(Array.from(r.productInputs,c=>{
    shape(c,['x','y','z','id','units','quantities']);
    return Object.freeze({x:c.x,y:c.y,z:c.z,id:c.id,units:c.units,quantities:Object.freeze({...c.quantities})});
  }));
  return Object.freeze({product:r.product,productInputs,changed:Object.freeze(productInputs.map(point))});
}
// No live engine, storage, terrain, or source operation. The supplied codec is
// Water A's configured v1 codec, not a competing validator/engine. Host must
// authenticate the entire prior revision and the exact private quench batch
// under its exclusive lease, then adopt both returned ledgers atomically.
export function createLavaPersistenceBridge({codec,ventOptions={},thermalOptions={},maxReceipts=1024}={}){
  if(typeof codec?.validate!=='function'||!int(maxReceipts,1,65536))throw new TypeError('Lava persistence policy');
  const inert=Object.freeze({getCell:()=>null,insert:()=>false});
  const off=()=>false;
  const ventConfig={...ventOptions,vents:(ventOptions.vents??[]).map(v=>({...v}))};
  const thermalConfig={...thermalOptions};
  function vents(snapshot){
    shape(snapshot,['version','signature','cursor','emitted']);
    const s=createLavaVents({...ventConfig,engine:inert,snapshot}).save();
    return Object.freeze({...s,emitted:Object.freeze(s.emitted)});
  }
  function thermal(snapshot){
    shape(snapshot,['version','maxTracked','maxVisits','lossPerUnit','pending']);
    const s=createLavaThermalScheduler({...thermalConfig,engine:inert,isLoaded:off,isOpen:off,canCool:off,snapshot}).save();
    return Object.freeze({...s,pending:Object.freeze(s.pending.map(p=>Object.freeze(p)))});
  }
  function restore({shared,lava}={}){
    const canonical=codec.validate(shared);
    shape(lava,['version','worldId','policyId','revision','vents','thermal']);
    if(lava.version!==1||lava.worldId!==canonical.worldId||lava.policyId!==canonical.policyId||lava.revision!==canonical.revision)
      throw new TypeError('Lava extension revision or identity mismatch');
    // Shared validation admits generic quantities; Lava A must check its own
    // heat invariant even on parked cells before accepting a restore.
    for(const s of [canonical.resident,...canonical.parked.map(p=>p.snapshot)])
      for(const c of s.cells)if(c.id==='lava'&&readLavaHeat(c)===null)throw new TypeError('Invalid persisted lava heat');
    const receipts=[];
    for(const r of canonical.products)if(r.product==='lava-quench'){
      if(receipts.length===maxReceipts)throw new RangeError('Lava receipt budget');
      receipts.push(receipt(r,true));
    }
    const extension=Object.freeze({...lava,vents:vents(lava.vents),thermal:thermal(lava.thermal)});
    return Object.freeze({shared:canonical,lava:extension,quenchState:Object.freeze({version:1,resident:canonical.resident,
      thermal:extension.thermal,receipts:Object.freeze(receipts)})});
  }
  function stageQuench({shared,lava,batch,receiptIds}={}){
    const before=restore({shared,lava});
    const prior=before.quenchState.receipts;
    const next=batch?.state;
    if(next?.version!==1||!Array.isArray(next.receipts)||next.receipts.length>maxReceipts||
      !Array.isArray(batch.newReceipts)||!batch.newReceipts.length||
      !Array.isArray(receiptIds)||receiptIds.length!==batch.newReceipts.length||
      next.receipts.length!==prior.length+batch.newReceipts.length||before.shared.revision===Number.MAX_SAFE_INTEGER)
      throw new TypeError('Invalid quench batch or receipt allocation');
    const all=Array.from(next.receipts,r=>receipt(r));
    const fresh=Array.from(batch.newReceipts,r=>receipt(r));
    if(!equal(all.slice(0,prior.length),prior)||!equal(all.slice(prior.length),fresh))
      throw new TypeError('Quench receipt prefix or suffix mismatch');
    const ids=new Set(before.shared.products.map(p=>p.id));
    const added=fresh.map((r,i)=>{
      const id=receiptIds[i];
      if(!token(id)||ids.has(id))throw new TypeError('Duplicate or invalid receipt ID');
      ids.add(id);
      return Object.freeze({id,product:r.product,productInputs:r.productInputs});
    });
    const revision=before.shared.revision+1;
    return restore({shared:{...before.shared,revision,resident:next.resident,products:[...before.shared.products,...added]},
      lava:{...before.lava,revision,thermal:next.thermal}});
  }
  return Object.freeze({restore,stageQuench});
}
