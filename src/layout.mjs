// MYTHWROUGHT v0.05 — dedicated landscape controller layout with a protected world viewport.
// The two grip widths are equal and never chosen from unconstrained viewport percentages.
export const CONTROL_SIZES=Object.freeze(['regular','large']);
export function normalizeControlSize(value){return CONTROL_SIZES.includes(value)?value:'regular';}
export function calculateGripWidth(availableWidth,availableHeight,mode='regular'){
  if(![availableWidth,availableHeight].every(Number.isFinite)||availableWidth<=0||availableHeight<=0)throw Error('Invalid viewport dimensions');
  const size=normalizeControlSize(mode);
  const ratio=size==='large'?1.14:1;
  const ideal=Math.max(122,Math.min(174,availableWidth*.18))*ratio;
  const compressed=availableHeight<345?ideal*.94:ideal;
  const protectedWorld=Math.max(245,Math.min(390,availableWidth*.5));
  const maxGrip=Math.max(76,(availableWidth-protectedWorld)/2);
  return Math.round(Math.max(Math.min(96,maxGrip),Math.min(192,compressed,maxGrip)));
}
