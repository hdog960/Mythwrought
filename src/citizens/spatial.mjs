import {validPoint} from '../mobs/world-query.mjs';

const profiles = {
  human: [.29,1.95], elf:[.27,2.06], dwarf:[.35,1.68],
  thornkin:[.33,2.15], asteri:[.29,2.05], glassborn:[.34,2.04],
};
export function movementProfile(race) {
  const [radius,height] = profiles[race];
  return {
    body:{radius,height},
    movement:{capabilities:['walk'],stepHeight:.56,speed:1.38},
    riding:{eligible:false},
  };
}

export function settlementBoundary(regions) {
  if (!Array.isArray(regions) || !regions.length) throw TypeError('Citizen settlement needs safe regions');
  const bounds = regions.map(({minX,maxX,minZ,maxZ}) => {
    if (![minX,maxX,minZ,maxZ].every(Number.isFinite) || maxX-minX<.8 || maxZ-minZ<.8)
      throw RangeError('Invalid citizen region bounds');
    return {minX,maxX,minZ,maxZ};
  });
  return ([x,,z],margin=.35) => bounds.some(({minX,maxX,minZ,maxZ}) =>
    x>=minX+margin && x<=maxX-margin && z>=minZ+margin && z<=maxZ-margin);
}

export function standingAt(query,position,body) {
  return validPoint(position) && query.residentAt(position) &&
    !query.environment(position).hazard && query.grounded(position,body);
}
