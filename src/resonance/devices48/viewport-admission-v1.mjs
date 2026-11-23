/** Source-only D6 deterministic landscape viewport admission. Never grants game authority. */
export const VIEWPORTS48 = Object.freeze([[667,375],[844,390],[932,430]].map(([width,height])=>Object.freeze({width,height})));
const integer = n => Number.isSafeInteger(n) && n >= 0;
export function admitResonanceHud48({viewport, panel, reservedRects, revision}) {
  if (!viewport || !integer(viewport.width) || !integer(viewport.height) || !VIEWPORTS48.some(v=>v.width===viewport.width&&v.height===viewport.height)) throw Error('unsupported-viewport');
  if (!integer(revision)) throw Error('invalid-revision');
  if (!Array.isArray(reservedRects) || reservedRects.length>32) throw Error('invalid-reservations');
  const validate = r => {
    if (!r || !['x','y','width','height'].every(k=>integer(r[k])) || !r.width || !r.height || r.x+r.width>viewport.width || r.y+r.height>viewport.height) throw Error('invalid-rectangle');
    return {x:r.x,y:r.y,width:r.width,height:r.height};
  };
  const p=validate(panel), rs=reservedRects.map(validate);
  const intersects=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;
  const blockers=rs.flatMap((r,i)=>intersects(p,r)?[i]:[]);
  return Object.freeze({schema:'resonance48-hud-admission-v1',revision,viewport:Object.freeze({...viewport}),admitted:blockers.length===0,blockers:Object.freeze(blockers),authority:'display-only'});
}
