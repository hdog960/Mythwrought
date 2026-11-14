// Independent source-derived Pack 4 candidate geometry fit. This is not live
// placement, rain sealing, runtime sidecar persistence, or collision approval.
// Pack 4 PR #115 `windows.mjs`: 030=clear pane, 031=sun/moon stained
// transparent glazing, 032=hollow frame, 033=wall-mounted shutters.
export const PANE_FAMILIES=Object.freeze(['pack4:030','pack4:031']);
export const CANDIDATE_YAW=Object.freeze({north:0,east:1,south:2,west:3});
export const REGIONAL_GLAZING=Object.freeze({
  temperate:'pack4:030',desert:'pack4:031',snow:'pack4:030',
  'enchanted-forest':'pack4:031',mountain:'pack4:030'
});
const at=(x,y,z)=>[x,y,z].join(',');
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
export function auditCandidateGlazing(b){
 const {width:w,depth:d}=b.footprint;
 const cells=new Map(b.placements.map(p=>[at(...p.at),p]));
 const perimeterWindows=b.placements.filter(p=>p.role==='window'&&!p.roofLantern);
 assert(perimeterWindows.length===4,b.id+': expected four actual glazed facade openings');
 for(const p of perimeterWindows){
  const [x,y,z]=p.at;
  assert(y===2&&(x===1||x===w-2||z===1||z===d-2),b.id+': window misplaced outside wall aperture');
  const facing=x===1?'west':x===w-2?'east':z===d-2?'south':'north';
  assert(p.orientation===facing,b.id+': pane yaw incompatible with actual wall facing');
  assert(p.asset===REGIONAL_GLAZING[b.biome]&&PANE_FAMILIES.includes(p.asset),b.id+': facade uses an unglazed frame/shutter or unexpected pane');
  assert(p.mount==='opening'&&p.glazingApproved===false,b.id+': window must remain unresolved glazing candidate');
  // Side wall remains a real architectural wall on both sides of the window.
  const cross=x===1||x===w-2?[[x,y,z-1],[x,y,z+1]]:[[x-1,y,z],[x+1,y,z]];
  assert(cross.some(v=>cells.get(at(...v))?.role==='wall'),b.id+': window has no adjacent wall context');
 }
 const panes=b.placements.filter(p=>p.role==='window'&&p.roofLantern);
 if(b.architecturalIdentity.feature==='skylight'){
  assert(panes.length===1,b.id+': candidate roof lantern lacks physical vertical glazed face');
  const p=panes[0],[x,y,z]=p.at;
  assert(p.roofLantern==='vertical-glazing'&&p.orientation==='north'&&p.asset==='pack4:030',b.id+': roof glazing must be a physically possible vertical plane');
  const side=[x-1,x+1].map(px=>cells.get(at(px,y,z)));
  assert(side.every(s=>s?.role==='support'&&s.roofLantern==='side-post'&&s.asset==='pack2:022'),b.id+': raised glass lacks physical vertical posts');
  assert(cells.get(at(x,y+1,z))?.roofLantern==='cap',b.id+': roof lantern has no overhead cap');
  assert(cells.get(at(x,y-1,z))?.role==='roof',b.id+': roof lantern missing underlying roofing');
  assert(p.glazingApproved===false,b.id+': candidate lantern prematurely approved');
 }else assert(panes.length===0,b.id+': unnecessary roof lantern');
 assert(b.placements.every(p=>p.role!=='window'||Object.hasOwn(CANDIDATE_YAW,p.orientation)),b.id+': illegal horizontal-glass orientation');
 return {id:b.id,perimeter:perimeterWindows.length,roofLantern:PANE_FAMILIES.includes(panes[0]?.asset)?1:0,
  windowSealApproved:false,waterproofRoofLanternApproved:false,rotationStateIntegrated:false};
}
