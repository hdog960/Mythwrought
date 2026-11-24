// Living Underworld Phase 32: original-M7 MODULE-OWNED source readers.
// Unlike caller-supplied callbacks, this factory itself imports and creates
// ORIGINAL FourRegionWorld and VoxelWorld objects from game modules.
// No world edits, construction placements, extra terrain reads or saves.
// Runtime attestation certifies constructor/instance/method identity only;
// real world physics, generated terrain safety and release remain UNPROVEN.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock} from '../voxel.mjs';

const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const issued=new WeakMap();
const refusal=(reason,extra={})=>Object.freeze({
 ok:false,reason,...extra,
 originalWorldConstructorVerified:false,
 actualOriginalWorldSiteSafetyVerified:false,
 originalWorldSourceQueriesDuringAttestation:0,
 worldChanged:false,noWorldWrites:true
});
const key=(x,y,z)=>x+','+y+','+z;
const seedValid=seed=>Number.isSafeInteger(seed)&&seed===(seed|0);

export function createOriginalM7ReadOnlySource(seed=179){
 if(!seedValid(seed))
  throw TypeError('Invalid original M7 source seed');
 // FourRegionWorld validates by CONSTRUCTING a NEW frozen profile object.
 // Capture the canonical profile from the real instance; its identity is
 // not supposed to equal the originally passed requested-profile object.
 const requestedProfile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
 const world=new FourRegionWorld(seed,requestedProfile);
 const profile=world.profile;
 const original=new VoxelWorld(seed);
 const cave=world.environmentCaves;
 if(Object.getPrototypeOf(world)!==FourRegionWorld.prototype||
    Object.getPrototypeOf(original)!==VoxelWorld.prototype||
    world.constructor!==FourRegionWorld||
    original.constructor!==VoxelWorld||
    world.seed!==seed||original.seed!==seed||
    world.profile!==profile||profile.seed!==seed||
    profile.kind!=='mythwrought-generation-profile'||profile.version!==1||
    profile.generator!==M7_ENVIRONMENT_GENERATOR||
    !Object.isFrozen(profile)||!(world.edits instanceof Map)||
    !(original.edits instanceof Map)||
    world.edits.size!==0||original.edits.size!==0||
    !cave||typeof cave.get!=='function'||
    world.naturalAndLandmarkBlock!==
     FourRegionWorld.prototype.naturalAndLandmarkBlock||
    original.naturalAndLandmarkBlock!==
     VoxelWorld.prototype.naturalAndLandmarkBlock)
  throw Error('ORIGINAL_M7_NATIVE_SOURCE_CONSTRUCTOR_REFUSED');

 const worldNatural=world.naturalAndLandmarkBlock;
 const oldNatural=original.naturalAndLandmarkBlock;
 const caveGet=cave.get,edits=world.edits,originalEdits=original.edits;
 const source=Object.freeze({
  naturalAt:(x,y,z)=>worldNatural.call(world,x,y,z),
  authoredAt:(x,y,z)=>caveGet.call(cave,x,y,z),
  editedAt:(x,y,z)=>Map.prototype.has.call(edits,key(x,y,z)),
  protectedAt:(x,y,z)=>oldNatural.call(original,x,y,z)!==
   baseBlock(x,y,z,seed)
 });
 issued.set(source,Object.freeze({
  seed,world,original,profile,cave,edits,originalEdits,
  worldNatural,oldNatural,caveGet,
  readers:Object.freeze(Object.fromEntries(ROLES.map(role=>
   [role,source[role]])))
 }));
 return source;
}

export function inspectOriginalM7ReadOnlySource(source,{seed}={}){
 if(!source||typeof source!=='object')
  return refusal('ORIGINAL_M7_SOURCE_OBJECT_INVALID');
 const record=issued.get(source);
 if(!record)return refusal('ORIGINAL_M7_SOURCE_NOT_ISSUED_BY_NATIVE_FACTORY');
 const expected=seed===undefined?record.seed:seed;
 if(!seedValid(expected)||expected!==record.seed)
  return refusal('ORIGINAL_M7_SOURCE_SEED_MISMATCH');
 if(!Object.isFrozen(source)||ROLES.some(role=>
    source[role]!==record.readers[role]))
  return refusal('ORIGINAL_M7_SOURCE_READER_FUNCTION_CHANGED');
 const {world,original,profile,cave,edits,originalEdits}=record;
 if(Object.getPrototypeOf(world)!==FourRegionWorld.prototype||
    Object.getPrototypeOf(original)!==VoxelWorld.prototype||
    world.constructor!==FourRegionWorld||
    original.constructor!==VoxelWorld||
    world.seed!==expected||original.seed!==expected||
    world.profile!==profile||
    profile.seed!==expected||
    profile.kind!=='mythwrought-generation-profile'||profile.version!==1||
    profile.generator!==M7_ENVIRONMENT_GENERATOR||
    !Object.isFrozen(profile)||
    world.environmentCaves!==cave||
    world.naturalAndLandmarkBlock!==record.worldNatural||
    original.naturalAndLandmarkBlock!==record.oldNatural||
    cave.get!==record.caveGet||
    world.edits!==edits||original.edits!==originalEdits||
    !(edits instanceof Map)||!(originalEdits instanceof Map))
  return refusal('ORIGINAL_M7_NATIVE_WORLD_IDENTITY_CHANGED');
 if(edits.size!==0||originalEdits.size!==0)
  return refusal('ORIGINAL_M7_EXISTING_PLAYER_EDIT_MUTATION');
 return Object.freeze({
  ok:true,reason:null,
  originalWorldConstructorVerified:true,
  originalWorldClassExact:true,
  originalLegacyWorldClassExact:true,
  originalM7ProfileGeneratorExact:true,
  originalM7SeedExact:true,
  originalWorldMethodsStable:true,
  originalCaveReaderBindingStable:true,
  originalWorldEditMapInstancesStable:true,
  originalWorldEditMapsEmpty:true,
  fourNativeReaderFunctionsFactoryIssued:true,
  originalWorldSourceQueriesDuringAttestation:0,
  actualOriginalWorldSiteSafetyVerified:false,
  syntheticFuturePlayerMotionIsNotLiveWalking:true,
  worldChanged:false,noWorldWrites:true
 });
}
