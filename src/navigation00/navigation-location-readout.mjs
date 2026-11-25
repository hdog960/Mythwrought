// Opt-in, renderer-neutral world-coordinate readout. Never queries undiscovered terrain.
export const NAV00_LOCATION_READOUT_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
const directions = Object.freeze(['N','NE','E','SE','S','SW','W','NW']);
export function createNavigationLocationReadout(player, options={}) {
  if (!player || ![player.x,player.y,player.z,player.yaw].every(finite)) throw Error('Invalid player coordinates');
  if (!options || typeof options !== 'object') throw Error('Invalid readout options');
  const {surfaceY=null, headingOffset=0, decimals=0} = options;
  if (surfaceY!==null && !finite(surfaceY)) throw Error('Invalid observed surface');
  if (!finite(headingOffset) || !Number.isInteger(decimals) || decimals<0 || decimals>3) throw Error('Invalid readout formatting');
  // Heading offset is supplied by the actual game adapter; no guessed yaw convention.
  const degrees = ((player.yaw*180/Math.PI+headingOffset)%360+360)%360;
  const direction = directions[Math.floor((degrees+22.5)/45)%8];
  const format = n => (Object.is(n,-0)?0:n).toFixed(decimals);
  const depth = surfaceY===null ? null : Math.max(0,surfaceY-player.y);
  return Object.freeze({version:NAV00_LOCATION_READOUT_VERSION,
    coordinates:Object.freeze({x:player.x,y:player.y,z:player.z}),
    bearingDegrees:degrees, direction, depth,
    coordinateLabel:`X ${format(player.x)}  Y ${format(player.y)}  Z ${format(player.z)}`,
    depthLabel:depth===null?'Depth unknown':`Depth ${format(depth)}`});
}
