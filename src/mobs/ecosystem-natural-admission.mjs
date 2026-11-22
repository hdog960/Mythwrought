// Read-only proof that an independently engine-admitted entity retains the
// ORIGINAL PopulationManager + MobEngine.spawn initial natural-birth state.
// This module never calls spawn(), transitions creatures, or writes saves.
export const ORIGINAL_NATURAL_ACTIVE_RADIUS=18;

function pointEquals(actual,expected){
  return Array.isArray(actual)&&actual.length===3&&
    expected.every((number,i)=>Object.is(number,actual[i]));
}
export function verifyOriginalNaturalMobAdmission({
  entity,proposal,observer,regionKey,spawnedId
}={}){
  const species=proposal?.species,point=proposal?.point;
  if(!entity||!species||!species.combat||
     !Array.isArray(point)||point.length!==3||
     !Array.isArray(observer)||observer.length!==3||
     ![...point,...observer].every(Number.isFinite)||
     typeof regionKey!=='string'||!regionKey||
     typeof spawnedId!=='string'||!spawnedId)
    throw new TypeError('Invalid original natural admission witness');
  // The source manager sets dormant=true when a successful position is >18
  // Euclidean blocks away; the engine can also use dormant at its active cap.
  // A close newborn can therefore be either idle or dormant, but NEVER active.
  const far=Math.hypot(...point.map((v,i)=>v-observer[i]))>
    ORIGINAL_NATURAL_ACTIVE_RADIUS;
  const expectedHealth=species.combat.health;
  if(entity.id!==spawnedId||entity.species!==species||
     entity.homeChunk!==regionKey||entity.important!==false||
     entity.juvenile!==false||entity.motionMode!=='walk'||
     entity.yaw!==0||entity.health!==expectedHealth||
     typeof entity.grounded!=='boolean'||
     !['idle','dormant'].includes(entity.state)||
     (far&&entity.state!=='dormant')||
     !pointEquals(entity.position,point)||
     !pointEquals(entity.origin,point)||
     !pointEquals(entity.velocity,[0,0,0]))
    throw new TypeError('Original natural spawn admission state mismatch');
  return true;
}
