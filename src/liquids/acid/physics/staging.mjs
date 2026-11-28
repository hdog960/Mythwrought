// Acid A: snapshot-only boundary staging. No live engine, terrain or storage writes.
import {createAcidReactionScheduler} from './reaction-scheduler.mjs';
import {createAcidCorrosion} from './corrosion.mjs';

const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function freezeTree(value){
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){
    for(const v of Object.values(value))freezeTree(v);
    Object.freeze(value);
  }
  return value;
}

// Input is a host-staged resident snapshot at ONE observed dirty boundary,
// with its matching acid ledgers. It is not the complete shared save envelope.
// The host must hold the exclusive edit/streaming lease, use the authentic
// shared engine constructor, and CAS the complete world state on adoption.
export function stageAcidBoundary({state,expectedRevision,readRevision,createLiquidEngine,
  engineOptions,reactionOptions={},corrosionOptions={},changed=[],reactionVisits=0,
  corrosionVisits=0,maxStageCells=8192,maxOutputChanged=768}={}){
  if(!object(state)||state.version!==1||!int(state.revision,0,Number.MAX_SAFE_INTEGER-1)||
    Object.keys(state).sort().join(',')!=='corrosion,engine,revision,scheduler,version'||
    !object(state.engine)||!object(state.scheduler)||!object(state.corrosion)||
    !object(engineOptions)||!object(reactionOptions)||!object(corrosionOptions)||
    typeof readRevision!=='function'||typeof createLiquidEngine!=='function')
    throw new TypeError('Complete acid stage and explicit host required');
  if(!int(expectedRevision,0,Number.MAX_SAFE_INTEGER-1)||!int(maxStageCells,1,65536)||
    !int(maxOutputChanged,1,8192)||!int(reactionVisits,0,reactionOptions.maxVisits??32)||
    !int(corrosionVisits,0,corrosionOptions.maxVisits??32))throw new RangeError('Invalid acid stage budget');
  const maxChanged=reactionOptions.maxChanged??256;
  if(!int(maxChanged,1,4096)||reactionVisits>0&&maxChanged<2||
    !Array.isArray(changed)||changed.length>maxChanged||!changed.every(point))
    throw new RangeError('Invalid acid stage dirty input');
  const reject=reason=>Object.freeze({status:'rejected',reason,expectedRevision});
  if(state.revision!==expectedRevision||readRevision()!==expectedRevision)return reject('stale-revision');
  if(!Array.isArray(state.engine.cells)||state.engine.cells.length>maxStageCells)
    return reject('resident-staging-budget');
  const {isLoaded,isOpen}=engineOptions;
  const engine=createLiquidEngine({...engineOptions,snapshot:state.engine});
  const scheduler=createAcidReactionScheduler({...reactionOptions,engine,isLoaded,isOpen,snapshot:state.scheduler});
  const corrosion=createAcidCorrosion({...corrosionOptions,engine,isLoaded,isOpen,snapshot:state.corrosion});
  const output=new Map();
  function admit(points){
    for(const p of points)output.set(p.join(','),[...p]);
    if(output.size>maxOutputChanged)return 'output-dirty-budget';
    if(!scheduler.trackChanges(points))return 'reaction-backpressure';
    if(!corrosion.trackChanges(points,{maxChanged}))return 'corrosion-backpressure';
    return null;
  }
  let reason=admit(changed);
  if(reason)return reject(reason);
  let reactions=0,waterUnits=0,reactionVisited=0,corrosionVisited=0;
  if(reactionVisits){
    const batch=scheduler.step(reactionVisits);reactionVisited=batch.visited;
    for(const plan of batch.plans){
      const receipt=engine.commitReaction(plan);
      if(!receipt)return reject('stale-reaction');
      if(receipt.product!=='acid-dilution'||receipt.productInputs.length!==0)
        throw new Error('Unexpected acid settlement receipt');
      // Reconcile after EACH successful settlement, not only the final union.
      // All changes are private until the entire candidate is adopted.
      reason=admit(receipt.changed);
      if(reason)return reject(reason);
      reactions++;waterUnits+=plan.proposal.consumeB;
    }
  }
  const corrosionPreviews=[];
  if(corrosionVisits){
    const batch=corrosion.step(corrosionVisits);corrosionVisited=batch.visited;
    for(const p of batch.proposals){
      if(!corrosion.revalidateProposal(p))return reject('stale-corrosion');
      // No transient token or cell references escape this engine instance.
      // These are informational; host must obtain fresh authority for terrain.
      corrosionPreviews.push({target:[...p.target],material:p.material,revision:p.revision,
        progress:p.progress,peakStrength:p.peakStrength});
    }
  }
  const next=freezeTree({version:1,revision:expectedRevision+1,engine:engine.save(),
    scheduler:scheduler.save(),corrosion:corrosion.save()});
  if(readRevision()!==expectedRevision)return reject('stale-revision');
  return freezeTree({status:'staged',expectedRevision,next,changed:[...output.values()],
    reactions,waterUnits,reactionVisited,corrosionVisited,corrosionPreviews});
}
