// Detached orchestrator integrating the existing original-compatible sky
// flight sweep, dual-world body collision and bounded namespaced prefetch.
// Original G2 must independently approve every move; NEVER call this instead
// of planG2FlightStep or publish player coordinates from this object alone.
import {planSweptSkyFlight} from './sky-flight-sweep.mjs';
import {verifySkyCreativeFlightStep,planSkyCreativePrefetch}
  from './sky-creative-bridge.mjs';
const fail=s=>{throw new TypeError('Sky G2 orchestrator: '+s);};
const point=p=>p&&[p.x,p.y,p.z].every(Number.isFinite);
const snap=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
export function planOriginalG2SkyGate({from,to,worldToken,expectedWorldToken,
  readCurrentWorldToken,originalG2Approved,originalG2DeniedBySkyResidency=false,
  prefetchState,intentToken,
  isBaseRegionReady,isBaseBodyClear,isSkyResident,isSkyBodyClear}={}){
  if(!point(from)||!point(to)||typeof originalG2Approved!=='boolean'||
     !prefetchState||typeof originalG2DeniedBySkyResidency!=='boolean'||
     typeof intentToken!=='string'||!intentToken||
     typeof isBaseRegionReady!=='function'||typeof isBaseBodyClear!=='function'||
     typeof isSkyResident!=='function'||typeof isSkyBodyClear!=='function')
    fail('original G2 result, source-backed dual body readers and stream required');
  const identityNow=typeof readCurrentWorldToken==='function'?readCurrentWorldToken():worldToken;
  const stale=identityNow!==expectedWorldToken||worldToken!==expectedWorldToken;
  const prefetch=(points,observedToken=identityNow)=>planSkyCreativePrefetch(prefetchState,{
    worldToken:observedToken,intentToken,points,isSkyResident});
  if(stale){
    const stream=prefetch([]);
    return Object.freeze({approved:false,position:snap(from),reason:'World changed; G2 held',
      stream,physicalSamples:0,worldWrites:0});
  }
  if(!originalG2Approved){
    // The original G2 may be blocked *because* the real upper region is
    // unloaded. Only an explicit source reason permits upper prefetch here.
    const stream=prefetch(originalG2DeniedBySkyResidency?[to]:[]);
    return Object.freeze({approved:false,position:snap(from),reason:'Original G2 did not approve movement',
      stream,physicalSamples:0,worldWrites:0});
  }
  const sweep=planSweptSkyFlight({from,to,worldToken,expectedWorldToken,
    readCurrentWorldToken,certifyPoint:p=>verifySkyCreativeFlightStep(p,{
      worldToken,expectedWorldToken,isBaseRegionReady,isBaseBodyClear,
      isSkyResident,isSkyBodyClear})});
  const observedAfter=typeof readCurrentWorldToken==='function'?
    readCurrentWorldToken():worldToken;
  const stillSame=observedAfter!==expectedWorldToken;
  const stream=prefetch(stillSame?[]:(sweep.approved?[]:[to]),observedAfter);
  return Object.freeze({approved:sweep.approved&&!stillSame,
    position:sweep.approved&&!stillSame?snap(to):snap(from),
    reason:stillSame?'World changed during G2 planning':sweep.reason,
    stream,physicalSamples:sweep.samples,worldWrites:0});
}
