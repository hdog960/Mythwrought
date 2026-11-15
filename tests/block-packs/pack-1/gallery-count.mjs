// Strict source-only fixture count parser used by the opt-in gallery runner.
// A status line is accepted only when the exact label is followed by digits.
export function parseFixtureCount(status,label){
  if(typeof status!=='string'||typeof label!=='string'||!label.length)return NaN;
  const at=status.lastIndexOf(label);
  if(at<0)return NaN;
  const match=status.slice(at+label.length).match(/^\d+/);
  return match?Number(match[0]):NaN;
}

// Positive confirmation is mandatory. A 'SAFE SAVE BLOCKER' status is not PASS.
export function saveWasVerified(status,successMarker){
  return typeof status==='string'&&typeof successMarker==='string'&&
    successMarker.length>0&&status.includes(successMarker)&&
    !/ERROR|FAIL|unexpected|INVALID|BLOCKED|BLOCKER/i.test(status);
}
