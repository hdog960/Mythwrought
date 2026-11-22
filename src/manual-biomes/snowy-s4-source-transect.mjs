// SNOWY S4 READ-ONLY ORIGINAL TERRAIN DIAGNOSTIC, NOT A GENERATOR.
// Existing M7 baseline, caves, landmarks, and schema-1 saves never change.
// Inspect a bounded list of actual M7 columns and their immediate neighbors
// to quantify retained grass, authoritative snow caps and sharp transitions.
const M7='mythwrought-five-surface-regions-v7', AIR=0, GRASS=1;
const SNOW_CAPS=new Set([272,276,279]);
const key=(x,y,z)=>x+','+y+','+z;
const integer=n=>Number.isSafeInteger(n)&&Math.abs(n)<10000000;
export const SNOW_S4_STATUS=Object.freeze([
  'outside-snow','retained-legacy-grass','protected-legacy',
  'protected-cave','edited-surface','authored-snow',
  'authored-shoulder','authored-unsupported','authored-mismatch'
]);
export function inspectSnowS4Transect(world,columns,{biomeAt,terrainHeight}={}){
  if(world?.generationProfile?.generator!==M7||
    !(world.edits instanceof Map)||typeof world.get!=='function'||
    typeof world._columnPlan!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    typeof biomeAt!=='function'||typeof terrainHeight!=='function'||
    !Array.isArray(columns)||columns.length<1||columns.length>128)
    throw new TypeError('Original M7 world/source transect required');
  const rows=[],summary=Object.fromEntries(SNOW_S4_STATUS.map(n=>[n,0]));
  const originalSave=typeof world.save==='function'?JSON.stringify(world.save()):null;
  for(const [x,z] of columns){
    if(!integer(x)||!integer(z))throw new RangeError('Invalid S4 transect column');
    const biome=biomeAt(x,z,world.seed),old=terrainHeight(x,z,world.seed);
    if(!integer(old))throw new TypeError('Invalid original source terrain height');
    const plan=world._columnPlan(x,z);
    if(!(plan instanceof Map))throw new TypeError('Missing authoritative column plan');
    const floor=plan.size?Math.max(...plan.keys()):old;
    if(!integer(floor)||floor>19||floor<2)
      throw new TypeError('S4 authored floor exceeds original physical world');
    const chosen=plan.get(floor),block=world.get(x,floor,z),below=world.get(x,floor-1,z);
    const cave=world.environmentCaves.get(x,floor,z)!==undefined||
      world.environmentCaves.get(x,floor-1,z)!==undefined;
    const edit=world.edits.has(key(x,floor,z))||world.edits.has(key(x,floor-1,z));
    const inSnow=biome?.name==='snow';
    const status=!inSnow?'outside-snow':cave?'protected-cave':
      edit?'edited-surface':plan.size===0?
        block===GRASS?'retained-legacy-grass':'protected-legacy':
        block!==chosen?'authored-mismatch':below===AIR?'authored-unsupported':
        SNOW_CAPS.has(chosen)?'authored-snow':'authored-shoulder';
    summary[status]++;
    const neighbors=[];
    if(status==='authored-snow'){
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx=x+dx,nz=z+dz,nbiome=biomeAt(nx,nz,world.seed);
        if(nbiome?.name!=='snow')continue;
        const nplan=world._columnPlan(nx,nz);
        const ntop=nplan.size?Math.max(...nplan.keys()):terrainHeight(nx,nz,world.seed);
        const id=world.get(nx,ntop,nz);
        neighbors.push(Object.freeze({dx,dz,heightChange:ntop-floor,
          material:id,authored:nplan.size>0}));
      }
    }
    rows.push(Object.freeze({x,z,old,floor,material:block,
      planned:chosen??null,biome:biome?.name??'plains',status,
      neighbors:Object.freeze(neighbors)}));
  }
  if(originalSave!==null&&JSON.stringify(world.save())!==originalSave)
    throw new Error('S4 source diagnostic changed schema-1 world saves');
  return Object.freeze({kind:'detached-original-M7-read-only-snow-transect',
    sampled:rows.length,summary:Object.freeze(summary),rows:Object.freeze(rows)});
}
