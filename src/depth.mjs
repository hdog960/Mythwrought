// Mythwrought manual engine-only depth contract.
// The old [-3,19] height envelope remains byte/seed-compatible and is one
// surface section; deep sections are isolated 16-block slices below it.
export const LEGACY_WORLD_MIN_Y=-3;
export const WORLD_MAX_Y=19;
export const LEGACY_WORLD_HEIGHT=WORLD_MAX_Y-LEGACY_WORLD_MIN_Y+1;
export const WORLD_DEPTH_MULTIPLIER=10;
export const WORLD_MIN_Y=WORLD_MAX_Y-LEGACY_WORLD_HEIGHT*WORLD_DEPTH_MULTIPLIER+1;
export const DEPTH_SECTION_HEIGHT=16;
export const LOWEST_SECTION=Math.floor((WORLD_MIN_Y-LEGACY_WORLD_MIN_Y)/DEPTH_SECTION_HEIGHT);
export const MAX_ACTIVE_SECTIONS=3;

// Deep section -1 occupies [-19,-4], -2 occupies [-35,-20], etc.
// Surface section 0 occupies the original full [-3,19] height.
export function sectionForY(y){
  if(!Number.isFinite(y)||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return null;
  return y>=LEGACY_WORLD_MIN_Y?0:Math.floor((Math.floor(y)-LEGACY_WORLD_MIN_Y)/DEPTH_SECTION_HEIGHT);
}
export function sectionBounds(section){
  if(!Number.isInteger(section)||section>0||section<LOWEST_SECTION)
    throw Error('Invalid vertical section');
  if(section===0)return {minY:LEGACY_WORLD_MIN_Y,maxY:WORLD_MAX_Y};
  return {
    minY:Math.max(WORLD_MIN_Y,LEGACY_WORLD_MIN_Y+section*DEPTH_SECTION_HEIGHT),
    maxY:LEGACY_WORLD_MIN_Y+(section+1)*DEPTH_SECTION_HEIGHT-1
  };
}
export function sectionWindow(feet){
  if(!Number.isFinite(feet))throw Error('Invalid player depth');
  const section=sectionForY(Math.max(WORLD_MIN_Y,Math.min(WORLD_MAX_Y,Math.floor(feet))));
  // At normal surface elevations preserve the original 25-chunk GPU window.
  if(section===0)return feet<3?[0,-1]:[0];
  return [section,section+1,section-1].filter(s=>s<=0&&s>=LOWEST_SECTION);
}
export function verticalEditSections(y){
  if(!Number.isInteger(y))return [];
  const section=sectionForY(y);
  if(section===null)return [];
  const bounds=sectionBounds(section),sections=[section];
  if(y===bounds.minY&&section-1>=LOWEST_SECTION)sections.push(section-1);
  if(y===bounds.maxY&&section+1<=0)sections.push(section+1);
  return sections;
}
export function depthMeshKey(cx,cz,section){
  if(![cx,cz,section].every(Number.isInteger))throw Error('Invalid mesh coordinates');
  // Maintain existing 2D surface chunk keys for browser/diagnostic compatibility.
  return section===0?cx+','+cz:cx+','+cz+','+section;
}
