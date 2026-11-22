// Pure read-only timing forecast for the original PopulationManager global tick.
// Does not certify clock ownership, reserve a region, or consume a source ticket.
export const SOURCE_MAX_ECOLOGY_TIME_ADVANCE=1;

export function previewSourceEcologyTick(input={}){
  const {time,next,seconds}=input??{};
  if(!Number.isFinite(time)||time<0||!Number.isFinite(next)||next<0||
     !Number.isFinite(seconds)||seconds<0)
    throw new TypeError('Invalid original ecology clock preview');
  const evaluatedTime=time+Math.min(SOURCE_MAX_ECOLOGY_TIME_ADVANCE,seconds);
  if(!Number.isFinite(evaluatedTime))
    throw new TypeError('Original ecology clock overflow');
  return Object.freeze({time:evaluatedTime,due:evaluatedTime>=next});
}
