// Phase 2 physical root safety gate. This pure source helper is intentionally
// separate from M7 terrain and cave generators: no global height changes,
// no random draws, no edits, and no save/profile mutation.
// Checks ALL 2x2 giant roots, including seam-crossing cells, against the
// same actual baseline readers used by the original world tree planner.
export function enchantedTreeFootingsSupported(x,floor,z,footprint,readColumn,readCell,air=0){
  if(![x,floor,z,air].every(Number.isInteger)||!Array.isArray(footprint)||
    footprint.length<1||footprint.length>4||
    typeof readColumn!=='function'||typeof readCell!=='function')
    throw Error('Invalid enchanted tree footing probe');
  for(const offset of footprint){
    if(!Array.isArray(offset)||offset.length!==2||
      !offset.every(Number.isInteger))
      throw Error('Invalid enchanted tree footing offset');
    const px=x+offset[0],pz=z+offset[1];
    const column=readColumn(px,pz);
    // A landmark roof or cave shelf can look superficially solid even when
    // it is NOT the real M7 ground cap for this adjacent root column.
    if(!(column instanceof Map)||!column.has(floor))return false;
    const cap=column.get(floor);
    if(cap===air||readCell(px,floor,pz)!==cap)return false;
    // The entire root pad must be supported by physical subsoil. A hidden
    // gallery or cave void directly under one corner is not a usable footing.
    if(readCell(px,floor-1,pz)===air)return false;
    // Refuse a slope, pre-existing pillar, or landmark above the cap. The
    // trunk must never overlay a protected block or bridge a step change.
    if(readCell(px,floor+1,pz)!==air)return false;
  }
  return true;
}
