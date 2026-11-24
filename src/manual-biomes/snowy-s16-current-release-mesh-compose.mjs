// Snow S16 current-release renderer composition, DETACHED source only.
// A future generator identity MUST be supplied by an explicit authorized
// integration. This module never creates a generator, registers a profile,
// saves a world, edits a block or imports itself into the live renderer.
// The historical M7 and released Enchanted P2 renderer remain untouched.
const anchors=Object.freeze({
 unified:'const unifiedTerrain=isEnvironmentGenerator(profile?.generator);',
 ground:'const groundColor=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?BIOME_GROUND_COLORS.get(id):undefined;',
 visible:'if(!checkedVisibleHardpan&&groundColor&&id===258){',
 face:'const color=groundColor??biome130Color(id,x,y,z,face);',
 natural:'const newGround=environmentGround(id);',
 tag:'u,v,terrain?terrainArtMaterial(id):id===408?4:18);'
});
export function composeSnowS16FutureProfileMesh(source,{futureGenerator}={}){
 if(typeof source!=='string'||
    typeof futureGenerator!=='string'||
    !/^mythwrought-five-surface-regions-v7-snow-[a-z0-9-]{1,48}$/.test(futureGenerator))
  throw Error('Explicit unregistered future Snow identity required');
 for(const [name,anchor] of Object.entries(anchors))
  if(source.split(anchor).length!==2)throw Error('Current source anchor changed: '+name);
 if(!source.includes('const sourceWorld=world.base?.generationProfile?world.base:world;')||
    !source.includes('function originalSurface(x,z)')||
    !source.includes('const hasEdit=(x,y,z)=>'))
  throw Error('Current source provenance contract missing');
 // The supplied string is ONLY a renderer guard. It is not a generator ID
 // allocation, registry mutation or promise of world-profile compatibility.
 const id=JSON.stringify(futureGenerator);
 return "import {createSnowS14EdgePigment} from './manual-biomes/snowy-s14-edge-pigment.mjs';\n"+source
  .replace(anchors.unified,`const snowS16Future=profile?.generator===${id};
  const unifiedTerrain=isEnvironmentGenerator(profile?.generator)||snowS16Future;
  const snowS16Pigment=snowS16Future?createSnowS14EdgePigment(world.seed,v6BiomeAt):null;`)
  .replace(anchors.ground,anchors.ground+'\n          let snowS16Rgb,snowS16Checked=false;')
  .replace(anchors.visible,`if(!snowS16Checked&&snowS16Pigment&&(id===272||id===276||id===279)){
              snowS16Checked=true;
              snowS16Rgb=snowS16Pigment.colorAt(x,y,z,id,originalSurface(x,z),
                blockAt(x,y,z),blockAt(x,y-1,z),blockAt(x,y+1,z),
                hasEdit(x,y,z),hasEdit(x,y-1,z),sourceWorld.environmentCaves?.get(x,y,z),
                sourceWorld.environmentCaves?.get(x,y-1,z));
            }
            ${anchors.visible}`)
  .replace(anchors.face,'const color=snowS16Rgb??groundColor??biome130Color(id,x,y,z,face);')
  .replace(anchors.natural,anchors.natural+'\n        const snowS16NeutralNeedle=snowS16Future&&id===407&&newGround&&world.snowS15CertifiedNeedleAt?.(x,y,z)===407&&!hasEdit(x,y,z)&&sourceWorld.environmentCaves?.get(x,y,z)===undefined;')
  .replace(anchors.tag,'u,v,terrain?terrainArtMaterial(id):id===408?4:snowS16NeutralNeedle?0:18);');
}
