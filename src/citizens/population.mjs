import {assignWorkplace, createCitizen, workplaceCompatible} from './entity.mjs';
import {movementProfile, settlementBoundary, standingAt} from './spatial.mjs';
import {findRoute} from '../mobs/navigation.mjs';

const byId = (a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

export function planSettlementCitizens({worldSeed,settlement,requests,query}) {
  if (!Array.isArray(requests) || !Number.isSafeInteger(settlement?.populationLimit) ||
      settlement.populationLimit<0 || requests.length>settlement.populationLimit)
    throw RangeError('Requested citizen population exceeds configured capacity');
  const contains=settlementBoundary(settlement.regions);
  const localWorld={
    ...query,
    residentAt:point=>contains(point)&&query.residentAt(point),
    grounded:(point,body)=>contains(point,body.radius)&&query.grounded(point,body),
    environment:point=>contains(point)?query.environment(point):{hazard:true},
  };
  const housing=[...(settlement.housing??[])].sort(byId);
  const workplaces=[...(settlement.workplaces??[])].sort(byId);
  const occupied=new Set();
  const slots=new Set();
  return [...requests].sort((a,b)=>a.slot-b.slot).map(request=>{
    if (slots.has(request.slot)) throw RangeError('Duplicate citizen slot');
    slots.add(request.slot);
    const base={
      worldSeed,settlementId:settlement.id,slot:request.slot,race:request.race,
      biome:settlement.biome,style:settlement.type,profession:request.profession,variant:request.variant,
    };
    const citizen=createCitizen(base);
    const body=movementProfile(citizen.race).body;
    const home=housing.find(candidate=>candidate.accessible!==false &&
      (request.homeId===undefined || candidate.id===request.homeId) &&
      standingAt(localWorld,candidate.position,body) && !occupied.has(candidate.position.join(',')));
    if (!home) throw RangeError('No safe citizen housing location for '+citizen.id);
    occupied.add(home.position.join(','));
    let record=createCitizen({...base,homeId:home.id});
    if (record.profession!==null) {
      const species=movementProfile(record.race);
      const station=workplaces.find(candidate=>workplaceCompatible(record,candidate) &&
        standingAt(localWorld,candidate.position,species.body) &&
        findRoute(localWorld,species,home.position,candidate.position,{radius:14}).status==='complete');
      if (!station) throw RangeError('No accessible compatible workplace for '+record.profession);
      record=assignWorkplace(record,station);
    }
    return {citizen:record,position:[...home.position]};
  });
}
