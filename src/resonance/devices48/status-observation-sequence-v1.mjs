/** D5 read-only status sequence fence; never allocates power or authorizes movement. */
const id=x=>typeof x==='string'&&/^[A-Za-z0-9:_-]{1,96}$/.test(x);
const count=x=>Number.isSafeInteger(x)&&x>=0&&x<=1_000_000_000;
const deny=reason=>Object.freeze({ok:false,reason,canActuate:false});
export function previewStatusObservationSequence({worldId,networkId,observations}={}){
 if(!id(worldId)||!id(networkId))return deny('invalid-identity');
 if(!Array.isArray(observations)||observations.length<1||observations.length>32)return deny('invalid-window');
 let lastTick=-1,lastRevision=-1,deficitFrames=0,transitions=0,previous=null;
 const frames=[];
 for(const o of observations){
  if(!o||typeof o!=='object'||Array.isArray(o))return deny('invalid-observation');
  if(o.worldId!==worldId||o.networkId!==networkId)return deny('identity-mismatch');
  if(![o.tick,o.revision,o.produced,o.used,o.stored,o.requested,o.missing].every(count))return deny('invalid-count');
  if(o.tick<=lastTick||o.revision<lastRevision)return deny('nonmonotonic-observation');
  if(o.used>o.requested||o.missing>o.requested||o.used+o.missing!==o.requested)return deny('inconsistent-demand');
  if(o.canActuate!==false)return deny('unsafe-authority');
  const deficit=o.missing>0;
  if(deficit)deficitFrames++;
  if(previous!==null&&previous!==deficit)transitions++;
  frames.push(Object.freeze({tick:o.tick,revision:o.revision,deficit,produced:o.produced,used:o.used,stored:o.stored,missing:o.missing}));
  lastTick=o.tick;lastRevision=o.revision;previous=deficit;
 }
 return Object.freeze({ok:true,reason:'display-only',schema:'resonance48.status-sequence.v1',worldId,networkId,latestTick:lastTick,latestRevision:lastRevision,deficitFrames,transitions,state:previous?'POWER LOW':'POWER OK',frames:Object.freeze(frames),canActuate:false});
}
