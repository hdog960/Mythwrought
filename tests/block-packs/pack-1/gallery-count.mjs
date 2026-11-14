// Strict source-only fixture count parser used by the opt-in gallery runner.
// A status line is accepted only when the exact label is followed by digits.
export function parseFixtureCount(status,label){
  if(typeof status!=='string'||typeof label!=='string'||!label.length)return NaN;
  const at=status.lastIndexOf(label);
  if(at<0)return NaN;
  const match=status.slice(at+label.length).match(/^\d+/);
  return match?Number(match[0]):NaN;
}
