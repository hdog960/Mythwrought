// MYTHWROUGHT — manual four-biome M2 isolated runtime bridge CANDIDATE.
// Never imported by production main.mjs. No implicit opt-in or migration.
// One authoritative VoxelWorld base (legacy or profiled) under the SAME
// Pack2LiveWorld adapter used by player mesh, raycast, collision and editing.
import {VoxelWorld} from '../voxel.mjs';
import {worldSeedFromText} from '../seeds.mjs';
import {loadWorldSafe,saveWorldSafe,importWorldData} from '../persistence.mjs';
import {Pack2LiveWorld,loadPack2LiveWorld,savePack2LiveWorld,
  pack2ExportBundle,pack2ImportBundle} from '../pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,FOUR_REGION_GENERATOR,
  M5_EXPERIMENTAL_GENERATOR} from './profile-world.mjs';
import {loadFourRegionWorld,saveFourRegionWorld,readFourRegionProfile,
  exportFourRegionWorld,inspectFourRegionExport} from './profile-storage.mjs';

export const M2_WORLD_MODE=Object.freeze({
  OPEN:'open-existing',
  CREATE_FOUR:'create-new-four-biomes',
  CREATE_FOUR_V5:'create-new-four-biomes-experimental-v5',
  IMPORT_PROFILE:'import-verified-four-biome-profile'
});

/** Pure new-world selection gate. A settings menu can request this mode;
 * no selector may choose it implicitly from a missing save or edit count.
 * It does NOT check slot availability; activation does so again on write.
 */
export function planM2WorldChoice(seedText,mode=M2_WORLD_MODE.OPEN,
  {confirmed=false,generator=undefined}={}){
  const seed=worldSeedFromText(seedText);
  if(!Object.values(M2_WORLD_MODE).includes(mode))
    throw Error('Unsupported manual biome world choice');
  const fresh=mode!==M2_WORLD_MODE.OPEN;
  if(fresh&&confirmed!==true)
    throw Error('Biome-enabled NEW world requires explicit creator confirmation');
  if(mode!==M2_WORLD_MODE.IMPORT_PROFILE&&generator!==undefined)
    throw Error('Generator override requires inspected profile import');
  if(mode===M2_WORLD_MODE.IMPORT_PROFILE){
    // Inspection must pass before any storage mutation. Only the exact
    // generator identity from the source bundle may be written.
    const canonical=fourRegionProfile(seed,generator);
    return Object.freeze({seed,mode,confirmed:true,generator:canonical.generator});
  }
  return Object.freeze({seed,mode,confirmed:fresh});
}
function validChoice(c){
  if(!c||typeof c!=='object'||!Number.isInteger(c.seed)||
     c.seed!==(c.seed|0)||!Object.values(M2_WORLD_MODE).includes(c.mode))
    return false;
  const importing=c.mode===M2_WORLD_MODE.IMPORT_PROFILE;
  if(Object.keys(c).sort().join(',')!==
      (importing?'confirmed,generator,mode,seed':'confirmed,mode,seed'))
    return false;
  if(c.confirmed!==(c.mode!==M2_WORLD_MODE.OPEN))return false;
  if(importing){
    try{fourRegionProfile(c.seed,c.generator);}catch{return false;}
  }
  return true;
}

/** Candidate for the actual game's loadWorld() seam, not yet activated.
 * The public game must keep using its previous loader until the distinct
 * M2 integration approval. This returns the ACTUAL Pack2LiveWorld wrapper,
 * not the older read-only biome viewport or a second gameplay world.
 */
export function openM2World(storage,choice){
  if(!validChoice(choice))throw Error('Invalid/unconfirmed M2 world choice');
  const fresh=choice.mode!==M2_WORLD_MODE.OPEN;
  const newGenerator=choice.mode===M2_WORLD_MODE.CREATE_FOUR_V5?
    M5_EXPERIMENTAL_GENERATOR:choice.mode===M2_WORLD_MODE.IMPORT_PROFILE?
      choice.generator:FOUR_REGION_GENERATOR;
  const result=loadFourRegionWorld(storage,choice.seed,{
    enableNew:fresh,newGenerator
  });
  if(fresh&&(!result.created||result.mode!=='four-regions'||
     result.world.generationProfile.generator!==newGenerator))
    throw Error('New four-region world was not explicitly activated with its requested generator');
  const loaded=loadPack2LiveWorld(storage,result.world);
  if(!(loaded.world instanceof Pack2LiveWorld)||
     loaded.world.base!==result.world||
     loaded.world.seed!==choice.seed)throw Error('Pack2 base identity mismatch');
  const type=loaded.world.base instanceof FourRegionWorld?'four-regions':'legacy';
  if(type!==result.mode)throw Error('Biome profile/engine mismatch');
  return Object.freeze({
    world:loaded.world,base:result.world,mode:type,
    created:Boolean(result.created),
    recovered:Boolean(result.recovered||loaded.recovered),
    warning:loaded.warning||''
  });
}
/** Existing gameplay saves Pack 2 first, then canonical schema-1 edits.
 * The same order is used here with profile-aware base save and read-back.
 * If either step fails, do not pretend an atomic success: surface a FAILED
 * result including whether a sidecar write may already have completed.
 */
export function saveM2World(storage,world){
  if(!(world instanceof Pack2LiveWorld)||
     !(world.base instanceof VoxelWorld)||world.seed!==world.base.seed)
    throw Error('Expected real Pack2LiveWorld with VoxelWorld base');
  const profiled=world.base instanceof FourRegionWorld;
  const metadata=readFourRegionProfile(storage,world.seed);
  if(profiled&&!metadata)throw Error('Missing biome profile: save refused');
  if(profiled&&JSON.stringify(metadata.profile)!==
      JSON.stringify(world.base.generationProfile))
    throw Error('Biome profile mismatch: save refused');
  if(!profiled&&metadata)throw Error('Refusing legacy save over profiled world');
  const p2=savePack2LiveWorld(storage,world);
  if(!p2.ok)return Object.freeze({ok:false,stage:'pack2',
    partialCommit:false,reason:p2.reason});
  let base;
  try{base=profiled?saveFourRegionWorld(storage,world.base):
    saveWorldSafe(storage,world);}
  catch(e){return Object.freeze({ok:false,stage:'base',
    partialCommit:!p2.unchanged,reason:String(e)});}
  if(!base?.ok)return Object.freeze({ok:false,stage:'base',
    partialCommit:!p2.unchanged,reason:base?.detail||base?.reason||'Save failed'});
  try{
    const reopened=openM2World(storage,planM2WorldChoice(String(world.seed)));
    if(JSON.stringify(reopened.world.save())!==JSON.stringify(world.save())||
       JSON.stringify(reopened.world.pack2Snapshot())!==
       JSON.stringify(world.pack2Snapshot())||
       reopened.mode!==(profiled?'four-regions':'legacy'))
      throw Error('Saved profile/Pack2/edits differ on verified reload');
  }catch(e){return Object.freeze({ok:false,stage:'verify',
    partialCommit:true,reason:String(e)});}
  return Object.freeze({ok:true,mode:profiled?'four-regions':'legacy',
    pack2Unchanged:Boolean(p2.unchanged)});
}

/** Profile-bearing export is NEVER silently flattened to plain schema-1.
 * Include Pack2 physical shapes even when empty, and validate on inspection.
 * This candidate does not commit imports; existing production IMPORT, vault
 * and mirror code must be upgraded or gated before M2 is integrated.
 */
export function exportM2World(world){
  if(!(world instanceof Pack2LiveWorld)||!(world.base instanceof VoxelWorld))
    throw Error('Invalid M2 export world');
  if(world.base instanceof FourRegionWorld){
    const bundle=JSON.parse(exportFourRegionWorld(world.base));
    return JSON.stringify({...bundle,pack2:world.pack2Snapshot()});
  }
  return JSON.stringify(pack2ExportBundle(world));
}
export function inspectM2WorldExport(raw){
  if(typeof raw!=='string'||raw.length>20*1024*1024)
    throw Error('Invalid or oversized M2 world export');
  const record=JSON.parse(raw);
  if(!record||typeof record!=='object'||Array.isArray(record))
    throw Error('Malformed world export');
  if(record.kind==='mythwrought-four-biomes-export'){
    if(Object.keys(record).sort().join(',')!=='kind,pack2,profile,version,world')
      throw Error('Incomplete biome export: profile and Pack 2 required');
    const {pack2,...baseBundle}=record;
    const base=inspectFourRegionExport(JSON.stringify(baseBundle));
    const world=pack2ImportBundle({pack2},base);
    return Object.freeze({mode:'four-regions',world,seed:base.seed});
  }
  if(Object.hasOwn(record,'profile')||Object.hasOwn(record,'kind'))
    throw Error('Profile-bearing export cannot be treated as legacy');
  const base=importWorldData(raw),world=pack2ImportBundle(record,base);
  return Object.freeze({mode:'legacy',world,seed:base.seed});
}
