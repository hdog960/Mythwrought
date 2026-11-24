// Detached S15: use EXISTING neutral shader fallback tag 0 only on
// certified snow-laden (407) preview cells. No new ID or shared GLSL edit.
const START='const newGround=environmentGround(id);';
const END='u,v,terrain?terrainArtMaterial(id):id===408?4:18);';
export function composeSnowS15CertifiedNeedleMesh(original){
 if(typeof original!=='string'||original.split(START).length!==2||
    original.split(END).length!==2||
    !original.includes('const sourceWorld=world.base?.generationProfile?world.base:world;'))
  throw Error('Exact original M7 mesh anchors required');
 return original.replace(START,START+'\n        const snowS15NeutralNeedle=unifiedTerrain&&id===407&&newGround&&world.snowS15CertifiedNeedleAt?.(x,y,z)===407&&!hasEdit(x,y,z)&&sourceWorld.environmentCaves?.get(x,y,z)===undefined;')
 .replace(END,'u,v,terrain?terrainArtMaterial(id):id===408?4:snowS15NeutralNeedle?0:18);');
}
export function createSnowS15NeedleReader(original,manifest){
 if(manifest?.seed!==original.seed||
    manifest.profile!==original.generationProfile?.generator||
    !Array.isArray(manifest.cells)||manifest.cells.length>1536||
    typeof original.environmentCaves?.get!=='function'||!(original.edits instanceof Map))
  throw Error('Original certified forest required');
 const needles=new Set();
 for(const row of manifest.cells){
  if(!Array.isArray(row)||row.length!==4||!row.every(Number.isSafeInteger))
   throw Error('Invalid certified cell');
  const [x,y,z,id]=row,k=x+','+y+','+z;
  if(id!==407)continue;
  if(needles.has(k)||y<1||y>19||original.get(x,y,z)!==0||
     original.edits.has(k)||original.environmentCaves.get(x,y,z)!==undefined)
   throw Error('Original certified needle veto '+k);
  needles.add(k);
 }
 return (x,y,z)=>{
  const k=x+','+y+','+z;
  if(needles.has(k)&&!original.edits.has(k)&&
     original.environmentCaves.get(x,y,z)===undefined&&original.get(x,y,z)===0)
   return 407;
 };
}
