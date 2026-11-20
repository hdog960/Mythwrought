// Full solid terrain for the explicit environmental world profile.
// The 130 authored Builder families retain their existing IDs and shapes.
export const ENVIRONMENT_GROUND=Object.freeze({
  slate:400,scree:401,gneiss:402,woodlandLoam:403,woodlandPeat:404,woodlandMoss:405
});
const materials=new Map([
  [ENVIRONMENT_GROUND.slate, ['Mountain slate',[.36,.40,.43]]],
  [ENVIRONMENT_GROUND.scree, ['Weathered scree',[.46,.43,.40]]],
  [ENVIRONMENT_GROUND.gneiss, ['Pale ridge gneiss',[.56,.54,.51]]],
  [ENVIRONMENT_GROUND.woodlandLoam, ['Aether woodland loam',[.29,.23,.34]]],
  [ENVIRONMENT_GROUND.woodlandPeat, ['Deep woodland peat',[.25,.19,.29]]],
  [ENVIRONMENT_GROUND.woodlandMoss, ['Moonlit woodland moss',[.28,.37,.32]]]
].map(([id,[name,color]])=>[id,Object.freeze({name,color:Object.freeze(color)})]));
export const environmentGround=id=>materials.get(id);
