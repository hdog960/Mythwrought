import {assignWorkplace, workplaceCompatible} from './entity.mjs';
import {PROFESSIONS} from './registry.mjs';
import {LocalNavigator} from '../mobs/navigation.mjs';
import {moveBody, supportedPosition} from '../mobs/movement.mjs';
import {validPoint} from '../mobs/world-query.mjs';

const profiles = {
  human: [.29,1.95], elf:[.27,2.06], dwarf:[.35,1.68],
  thornkin:[.33,2.15], asteri:[.29,2.05], glassborn:[.34,2.04],
};
const activeHostile = mob => mob && mob.health>0 &&
  mob.species.classification==='hostile' && ['active','idle'].includes(mob.state);
const eye = (position,height) => [position[0],position[1]+height*.72,position[2]];
const distance = (a,b) => Math.hypot(a[0]-b[0],a[2]-b[2]);
const loc = point => [Math.floor(point[0])+.5,point[1],Math.floor(point[2])+.5];

function movementProfile(race) {
  const [radius,height] = profiles[race];
  return {
    body:{radius,height},
    movement:{capabilities:['walk'],stepHeight:.56,speed:1.38},
    riding:{eligible:false},
  };
}

function settlementBoundary(regions) {
  if (!Array.isArray(regions) || !regions.length) throw TypeError('Citizen settlement needs safe regions');
  const bounds = regions.map(({minX,maxX,minZ,maxZ}) => {
    if (![minX,maxX,minZ,maxZ].every(Number.isFinite) || maxX-minX<.8 || maxZ-minZ<.8)
      throw RangeError('Invalid citizen region bounds');
    return {minX,maxX,minZ,maxZ};
  });
  return ([x,,z],margin=.35) => bounds.some(({minX,maxX,minZ,maxZ}) =>
    x>=minX+margin && x<=maxX-margin && z>=minZ+margin && z<=maxZ-margin);
}

function random(actor) {
  let seed=actor.random;
  seed ^= seed<<13;
  seed ^= seed>>>17;
  seed ^= seed<<5;
  actor.random=seed>>>0;
  return actor.random/2**32;
}

function standingAt(query,position,body) {
  return validPoint(position) && query.residentAt(position) &&
    !query.environment(position).hazard && query.grounded(position,body);
}

function safeHeight(query,from,point,body) {
  if (standingAt(query,point,body)) return point;
  if (!query.residentAt(point) || query.environment(point).hazard) return null;
  return supportedPosition(query,point[0],point[2],from[1]+.56,from[1]-.50,body);
}

function snapshot(actor, clock) {
  return {
    citizen:actor.citizen, position:[...actor.position], heading:actor.yaw,
    state:actor.state, action:actor.hurtUntil>clock?'damage':actor.action, health:actor.health,
  };
}

export function createCitizenSimulation({query,settlement,mobEngine=null,maxHealth=24}) {
  if (typeof query?.volume !== 'function' || typeof settlement?.id !== 'string')
    throw TypeError('Citizen simulation needs shared physics and a settlement');
  if (!Number.isFinite(maxHealth) || maxHealth<=0)
    throw RangeError('Invalid citizen health');
  const contains=settlementBoundary(settlement.regions);
  const localQuery={
    ...query,
    volume:(point,body)=>contains(point,body.radius)?query.volume(point,body):'unknown',
    grounded:(point,body)=>contains(point,body.radius)&&query.grounded(point,body),
    residentAt:point=>contains(point)&&query.residentAt(point),
    environment:point=>contains(point)?query.environment(point):{hazard:true},
  };
  const gathering=(settlement.gathering??[]).filter(point=>validPoint(point)&&contains(point)).map(point=>[...point]);
  const workplaces=new Map();
  for (const workplace of settlement.workplaces ?? []) {
    if (!validPoint(workplace.position) || !contains(workplace.position) ||
        workplace.settlementId!==settlement.id || typeof workplace.id!=='string' ||
        !Array.isArray(workplace.tags) || workplaces.has(workplace.id))
      throw RangeError('Invalid citizen workplace');
    workplaces.set(workplace.id,{...workplace,position:[...workplace.position],tags:[...workplace.tags]});
  }
  const navigator=new LocalNavigator(localQuery);
  const returnNavigator=new LocalNavigator(query);
  const actors=new Map();
  let rotation=0;
  let clock=0;
  let refreshedThreats=0;
  let threats=[];

  function stop(actor,state='idle') {
    navigator.forget(actor.id);
    returnNavigator.forget(actor.id);
    actor.state=state;
    actor.action='idle';
    actor.target=null;
    actor.ready=clock+.45+random(actor)*1.9;
  }

  function seek(actor,point,state) {
    actor.state=state;
    actor.target=point;
    actor.deadline=clock+14;
  }

  function wander(actor) {
    const home=actor.position;
    const choices=Array.from({length:6},()=>{
      const angle=random(actor)*Math.PI*2;
      const length=1.7+random(actor)*3.8;
      return loc([home[0]+Math.cos(angle)*length,home[1],home[2]+Math.sin(angle)*length]);
    });
    const goal=choices.map(point=>safeHeight(localQuery,home,point,actor.species.body))
      .find(point=>point&&distance(home,point)>1);
    if (goal) seek(actor,goal,'wander');
    else stop(actor);
  }

  function returnHome(actor) {
    const nearest=[...gathering,actor.spawn].sort((a,b)=>distance(actor.position,a)-distance(actor.position,b))
      .find(point=>distance(actor.position,point)<=12 && standingAt(query,point,actor.species.body));
    if (nearest) seek(actor,nearest,'return-to-settlement');
    else stop(actor,'displaced');
  }

  function moveToward(actor,dt,pace=1) {
    const outside=actor.state==='return-to-settlement';
    const terrain=outside?query:localQuery;
    const heading=(outside?returnNavigator:navigator).steer(actor,actor.target);
    actor.action='idle';
    if (Math.hypot(...heading)<.007) return;
    const previous=actor.position;
    const projected=[
      previous[0]+heading[0]*actor.species.movement.speed*dt*pace,previous[1],
      previous[2]+heading[1]*actor.species.movement.speed*dt*pace,
    ];
    if (!safeHeight(terrain,previous,projected,actor.species.body)) return;
    moveBody(terrain,actor,heading,dt,{pace});
    actor.action=distance(previous,actor.position)>.004?(actor.state==='flee'?'flee':'walk'):'idle';
  }

  function visible(actor,mob) {
    return query.residentAt(mob.position) &&
      query.lineOfSight(eye(actor.position,actor.species.body.height),
        eye(mob.position,mob.species.body.height));
  }

  function threatNear(actor) {
    if (clock<actor.nextSense) {
      const retained=actor.threatId?mobEngine.get(actor.threatId):null;
      return activeHostile(retained)&&query.residentAt(retained.position)&&
        (!actor.defender||contains(retained.position,0)) ? retained : null;
    }
    actor.nextSense=clock+.35;
    const limit=actor.threatId?9:7;
    let nearest=null;
    let best=limit;
    for (const mob of threats) {
      const range=Math.hypot(distance(actor.position,mob.position),actor.position[1]-mob.position[1]);
      if (range>=best || (actor.defender&&!contains(mob.position,0)) || !visible(actor,mob)) continue;
      nearest=mob;
      best=range;
    }
    actor.threatId=nearest?.id??null;
    return nearest;
  }

  function flee(actor, threat, dt) {
    if (actor.state!=='flee') {
      stop(actor,'flee');
      actor.nextThreatRoute=clock;
    }
    if (clock>=actor.nextThreatRoute && (!actor.target || clock>=actor.deadline ||
        distance(actor.position,actor.target)<.25)) {
      const [x,y,z]=actor.position;
      const angle=Math.atan2(z-threat.position[2],x-threat.position[0]);
      const rotated=[0,.45,-.45,.9,-.9,1.48,-1.48];
      const target=rotated.map(turn=>loc([x+Math.cos(angle+turn)*4,y,z+Math.sin(angle+turn)*4]))
        .map(point=>safeHeight(localQuery,actor.position,point,actor.species.body))
        .find(point=>point&&distance(point,threat.position)>distance(actor.position,threat.position)+.35);
      if (target) seek(actor,target,'flee');
      else stop(actor,'flee');
      actor.deadline=clock+3;
      actor.nextThreatRoute=clock+1.2;
    }
    if (actor.target) moveToward(actor,dt,1.4);
  }

  function defend(actor, threat, dt) {
    if (actor.state!=='defend') {
      stop(actor,'defend');
      actor.nextThreatRoute=clock;
    }
    actor.action=actor.attackUntil>clock?'attack':'idle';
    if (Math.hypot(distance(actor.position,threat.position),actor.position[1]-threat.position[1])<=1.37 &&
        visible(actor,threat)) {
      actor.target=null;
      actor.yaw=Math.atan2(threat.position[0]-actor.position[0],threat.position[2]-actor.position[2]);
      if (clock>=actor.nextAttack && mobEngine.damage(threat.id,4)) {
        actor.nextAttack=clock+.88;
        actor.attackUntil=clock+.28;
        actor.action='attack';
      }
      return;
    }
    if (clock>=actor.nextThreatRoute) {
      const point=loc([threat.position[0],actor.position[1],threat.position[2]]);
      actor.target=safeHeight(localQuery,actor.position,point,actor.species.body);
      actor.nextThreatRoute=clock+.65;
    }
    if (actor.target) moveToward(actor,dt,1.12);
  }

  function respond(actor,dt) {
    if (!mobEngine) return false;
    const threat=threatNear(actor);
    if (!threat) {
      if (actor.state==='flee' || actor.state==='defend') stop(actor);
      return false;
    }
    if (actor.defender) defend(actor,threat,dt);
    else flee(actor,threat,dt);
    return true;
  }

  function update(actor,dt) {
    if (!query.residentAt(actor.position) || !actor.health) return;
    if (contains(actor.position) && respond(actor,dt)) return;
    if (!contains(actor.position) && actor.state!=='return-to-settlement') {
      if (actor.state==='displaced') return;
      returnHome(actor);
    }
    if (actor.target && distance(actor.position,actor.target)<.19 && Math.abs(actor.position[1]-actor.target[1])<.18) {
      if (actor.state==='move-to-workplace') {
        stop(actor,'perform-job');
        actor.action='work';
        return;
      }
      stop(actor);
    }
    if (actor.target && clock>=actor.deadline) {
      if (actor.state==='move-to-workplace') actor.workRetry=clock+8;
      stop(actor,actor.state==='return-to-settlement'&&!contains(actor.position)?'displaced':'idle');
    }
    if (actor.target) {
      moveToward(actor,dt);
      return;
    }
    if (clock<actor.ready || actor.state==='displaced') return;
    let workplace=workplaces.get(actor.citizen.workplaceId);
    if (!workplace && actor.autoWork && actor.citizen.profession && clock>=actor.workRetry) {
      workplace=[...workplaces.values()]
        .filter(candidate=>workplaceCompatible(actor.citizen,candidate)&&distance(actor.position,candidate.position)<9)
        .sort((a,b)=>distance(actor.position,a.position)-distance(actor.position,b.position))
        .find(candidate=>standingAt(localQuery,candidate.position,actor.species.body));
      if (workplace) actor.citizen=assignWorkplace(actor.citizen,workplace);
      else actor.workRetry=clock+8;
    }
    if (workplace && clock>=actor.workRetry && actor.state!=='perform-job') {
      if (standingAt(localQuery,workplace.position,actor.species.body)) {
        seek(actor,workplace.position,'move-to-workplace');
        return;
      }
      actor.workRetry=clock+8;
    }
    if (actor.state==='perform-job') {
      actor.workRetry=clock+5;
      stop(actor);
    }
    wander(actor);
  }

  return {
    add(citizen,position) {
      if (actors.has(citizen.id)) throw Error('Duplicate citizen identity');
      const species=movementProfile(citizen.race);
      if (citizen.settlementId!==settlement.id || !standingAt(localQuery,position,species.body))
        throw RangeError('Unsafe citizen spawn position');
      const savedWorkplace=workplaces.get(citizen.workplaceId);
      const record=workplaceCompatible(citizen,savedWorkplace)?citizen:assignWorkplace(citizen,null);
      const actor={
        id:citizen.id,citizen:record,species,position:[...position],spawn:[...position],velocity:[0,0,0],
        yaw:0,grounded:true,state:'idle',action:'idle',target:null,deadline:0,ready:clock,
        health:maxHealth, hurtUntil:0, attackUntil:0, nextAttack:0, nextSense:clock, nextThreatRoute:clock,
        threatId:null, defender:PROFESSIONS[record.profession]?.threatResponse==='defend',
        workRetry:0,autoWork:true,random:citizen.appearanceSeed || 1,
      };
      actors.set(citizen.id,actor);
      return snapshot(actor,clock);
    },
    assign(id,workplaceId) {
      const actor=actors.get(id);
      if (!actor) throw RangeError('Unknown citizen');
      const workplace=workplaceId===null?null:workplaces.get(workplaceId);
      actor.citizen=assignWorkplace(actor.citizen,workplace);
      actor.autoWork=workplaceId!==null;
      stop(actor);
      actor.workRetry=0;
      actor.ready=clock;
      return snapshot(actor,clock);
    },
    relocate(id,position) {
      const actor=actors.get(id);
      if (!actor || !standingAt(query,position,actor.species.body)) throw RangeError('Unsafe citizen relocation');
      actor.position=[...position];
      actor.velocity=[0,0,0];
      stop(actor);
      return snapshot(actor,clock);
    },
    combatTarget(id) {
      const actor=actors.get(id);
      if (!actor) return null;
      return Object.freeze({
        id, height:actor.species.body.height, threatening:actor.defender,
        get position() { return [...actor.position]; },
        get health() { return actor.health; },
        get alive() { return actors.get(id)===actor && actor.health>0 && query.residentAt(actor.position); },
        damage(amount) {
          if (!this.alive || !Number.isFinite(amount) || amount<=0 || clock<actor.hurtUntil) return false;
          actor.health=Math.max(0,actor.health-amount);
          actor.hurtUntil=clock+.37;
          if (!actor.health) stop(actor,'incapacitated');
          return true;
        },
      });
    },
    removeWorkplace(id) {
      if (!workplaces.delete(id)) return false;
      for (const actor of actors.values()) {
        if (actor.citizen.workplaceId!==id) continue;
        actor.citizen=assignWorkplace(actor.citizen,null);
        stop(actor);
      }
      return true;
    },
    remove(id) {
      navigator.forget(id);
      returnNavigator.forget(id);
      return actors.delete(id);
    },
    step(dt) {
      if (!Number.isFinite(dt) || dt<=0) throw RangeError('Invalid citizen time step');
      const seconds=Math.min(dt,.1);
      clock+=seconds;
      if (mobEngine && clock>=refreshedThreats && actors.size) {
        threats=mobEngine.all().filter(activeHostile);
        refreshedThreats=clock+.25;
      }
      navigator.beginTick();
      returnNavigator.beginTick();
      const current=[...actors.values()];
      for (let index=0;index<current.length;index++) update(current[(index+rotation)%current.length],seconds);
      if (current.length) rotation=(rotation+1)%current.length;
      return current.map(actor=>snapshot(actor,clock));
    },
    get navigationWork() { return navigator.work+returnNavigator.work; },
  };
}
