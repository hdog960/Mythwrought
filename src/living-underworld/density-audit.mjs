// Living Underworld P1 — read-only density sampling of the ACTUAL natural voxel baseline.
// No world mutations, save writes, rendering side effects or production registration.
export const UNDERWORLD_BANDS=Object.freeze([
  Object.freeze({name:'upper',minY:-40,maxY:-4}),
  Object.freeze({name:'middle',minY:-100,maxY:-41}),
  Object.freeze({name:'deep',minY:-160,maxY:-101}),
  Object.freeze({name:'lowest',minY:-210,maxY:-161})
]);
export const UNDERWORLD_AUDIT_REGIONS=Object.freeze([
  Object.freeze({name:'original',x:-128,z:-128}),
  Object.freeze({name:'historical-caves',x:0,z:0}),
  Object.freeze({name:'far-northeast',x:4096,z:-4096}),
  Object.freeze({name:'far-southwest',x:-4096,z:4096}),
  Object.freeze({name:'remote-positive',x:16384,z:16384}),
  Object.freeze({name:'remote-negative',x:-16384,z:-16384})
]);
const isInt=n=>Number.isSafeInteger(n);
function hash32(seed,x,z,salt){
  let h=Math.imul(seed,0x9e3779b1)^Math.imul(x,0x85ebca6b)^Math.imul(z,0xc2b2ae35)^salt;
  h=Math.imul(h^(h>>>16),0x7feb352d);
  h=Math.imul(h^(h>>>15),0x846ca68b);
  return (h^(h>>>16))>>>0;
}
function tally(name){return {name,air:0,total:0};}
function add(group,air){group.total++;if(air)group.air++;}
function summary(group){return {...group,percentage:group.total?100*group.air/group.total:0};}
export function measureNaturalCaveDensity({
  seed,blockAt,biomeAt=()=> 'plains',regions=UNDERWORLD_AUDIT_REGIONS,
  bands=UNDERWORLD_BANDS,columnsPerSide=8,regionWidth=256,airId=0
}={}){
  if(!isInt(seed)||seed!==(seed|0)||typeof blockAt!=='function'||
     typeof biomeAt!=='function'||!isInt(airId)||
     !isInt(columnsPerSide)||columnsPerSide<1||columnsPerSide>32||
     !isInt(regionWidth)||regionWidth<columnsPerSide||regionWidth%columnsPerSide!==0||
     !Array.isArray(regions)||!regions.length||!Array.isArray(bands)||!bands.length)
    throw new TypeError('Invalid underworld density audit options');
  for(const r of regions)if(!r||typeof r.name!=='string'||!isInt(r.x)||!isInt(r.z))
    throw new TypeError('Invalid audit region');
  for(const b of bands)if(!b||typeof b.name!=='string'||!isInt(b.minY)||
    !isInt(b.maxY)||b.minY>b.maxY)
    throw new TypeError('Invalid audit depth band');
  const total=tally('all-underground'),byDepth=new Map(),byBiome=new Map(),byRegion=new Map();
  const cellWidth=regionWidth/columnsPerSide;
  for(const band of bands)byDepth.set(band.name,tally(band.name));
  for(const region of regions){
    const regional=tally(region.name);byRegion.set(region.name,regional);
    for(let ix=0;ix<columnsPerSide;ix++)for(let iz=0;iz<columnsPerSide;iz++){
      const x=region.x+ix*cellWidth+(hash32(seed,region.x+ix,region.z+iz,0x1a2b3c4d)%cellWidth);
      const z=region.z+iz*cellWidth+(hash32(seed,region.x+ix,region.z+iz,0x5e6f7081)%cellWidth);
      const biome=biomeAt(x,z,seed)||'plains';
      if(typeof biome!=='string')throw new TypeError('Biome name must be a string or null');
      if(!byBiome.has(biome))byBiome.set(biome,tally(biome));
      for(const band of bands){
        const bandTally=byDepth.get(band.name),biomeTally=byBiome.get(biome);
        for(let y=band.minY;y<=band.maxY;y++){
          const voxel=blockAt(x,y,z);
          if(!isInt(voxel))throw new TypeError('Real natural voxel reader returned invalid block id');
          const air=voxel===airId;
          add(total,air);add(regional,air);add(bandTally,air);add(biomeTally,air);
        }
      }
    }
  }
  const rows=m=>Object.freeze([...m.values()].map(summary));
  return Object.freeze({
    schema:'living-underworld-density-audit-v1',seed,columnsPerSide,regionWidth,
    sampleMethod:'deterministic stratified integer voxel columns, natural baseline only',
    overall:summary(total),byDepth:rows(byDepth),byBiome:rows(byBiome),byRegion:rows(byRegion),
    caveConnectivity:'NOT_MEASURED',entrances:'NOT_MEASURED',cavernSizes:'NOT_MEASURED'
  });
}
