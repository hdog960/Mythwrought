import { LocalNavigator, steerInVolume } from './navigation.mjs';
import { supportedPosition } from './movement.mjs';
import { validPoint } from './world-query.mjs';
import { familiarWildlife } from './familiar-wildlife.mjs';
import { originalWildlife } from './original-wildlife.mjs';
import { hostileTactics } from './hostile-tactics.mjs';

export const distanceTo = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const atEye = (point, height) => [point[0], point[1] + height * .72, point[2]];

export function eligibleTarget(target) {
  return typeof target?.id === 'string' && target.id.length > 0 && validPoint(target.position) &&
    Number.isFinite(target.height) && target.height > 0 && target.height <= 3.5 && target.alive !== false;
}

export function sense(world, mob, context = {}) {
  const target = eligibleTarget(context.target) ? context.target : null;
  const distance = target ? distanceTo(mob.position, target.position) : Infinity;
  const { sight, hearing } = mob.species.perception;
  const environment = world.environment(mob.position);
  const visible = distance <= sight && world.lineOfSight(atEye(mob.position, mob.species.body.height),
    atEye(target.position, target.height));
  let heard = null;
  let closest = Infinity;
  const sounds = Array.isArray(context.disturbances) ? context.disturbances : [];
  for (let i = 0; i < Math.min(8, sounds.length); i++) {
    const sound = sounds[i];
    if (!validPoint(sound?.position) || !Number.isFinite(sound.loudness) || sound.loudness <= 0) continue;
    const range = distanceTo(mob.position, sound.position);
    if (range <= Math.min(1, sound.loudness) * hearing && range < closest) {
      closest = range;
      heard = [...sound.position];
    }
  }
  return { target, distance, visible, heard, ...environment, depth: mob.position[1] };
}

function setState(memory, state) {
  if (memory.state === state) return;
  memory.state = state;
  memory.age = 0;
}

function positionNear(world, mob, center, angle, radius) {
  const position = [center[0] + Math.cos(angle) * radius, center[1], center[2] + Math.sin(angle) * radius];
  if (world.environment(position).hazard) return null;
  return supportedPosition(world, position[0], position[2],
    position[1] + .5, position[1] - .65, mob.species.body);
}

export class BehaviorController {
  #engine;
  #world;
  #navigator;
  #memory = new Map();

  constructor(engine, world) {
    this.#engine = engine;
    this.#world = world;
    this.#navigator = new LocalNavigator(world);
  }

  state(id) {
    return this.#engine.get(id)?.state === 'downed' ? 'downed' : this.#memory.get(id)?.state;
  }

  get navigationWork() {
    return this.#navigator.work;
  }

  forget(id) {
    this.#memory.delete(id);
    this.#navigator.forget(id);
  }

  #wander(mob, memory) {
    if (!memory.destination) {
      const angle = this.#engine.random(mob.id) * Math.PI * 2;
      const radius = 1.4 + this.#engine.random(mob.id) * 2;
      memory.destination = positionNear(this.#world, mob, mob.origin, angle, radius);
    }
    return memory.destination;
  }

  #passive(mob, memory, seen) {
    const looksThreatening = seen.visible &&
      (seen.target.threatening === true ||
        (mob.species.perception.threat === 'avoid' && seen.target.threatening !== false));
    if (looksThreatening && seen.distance < 6) {
      if (!['observe', 'flee'].includes(memory.state)) setState(memory, 'observe');
      if (seen.distance < 4 && memory.age >= .13) setState(memory, 'flee');
      if (memory.state === 'flee') {
        if (!memory.destination || memory.age < .06 || distanceTo(mob.position, memory.destination) < .45) {
          const angle = Math.atan2(mob.position[2] - seen.target.position[2],
            mob.position[0] - seen.target.position[0]);
          memory.destination = null;
          for (const turn of [0, .7, -.7]) {
            const point = positionNear(this.#world, mob, mob.position, angle + turn, 3.1);
            if (point) { memory.destination = point; break; }
          }
        }
        return memory.destination;
      }
      return null;
    }
    if (['observe', 'flee'].includes(memory.state)) setState(memory, 'calm-down');
    if (memory.state === 'calm-down') {
      if (memory.age >= .65) setState(memory, 'rest');
      return null;
    }
    if (seen.heard && ['idle', 'rest', 'wander'].includes(memory.state)) {
      memory.destination = seen.heard;
      setState(memory, 'investigate');
    }
    if (memory.state === 'investigate') {
      if (memory.age < 1.5 && distanceTo(mob.position, memory.destination) > .5) return memory.destination;
      setState(memory, 'rest');
    }
    if (memory.state === 'rest' && memory.age > 1.1) setState(memory, 'idle');
    if (memory.state === 'idle' && memory.age > .8) {
      memory.destination = null;
      setState(memory, 'wander');
    }
    if (memory.state === 'wander') {
      const point = this.#wander(mob, memory);
      if (point && memory.age < 2.6 && distanceTo(mob.position, point) > .35) return point;
      setState(memory, 'rest');
    }
    return null;
  }

  #familiar(mob, memory, seen, peers, profile) {
    const id = mob.species.id;
    const hazard = seen.hazard || !mob.species.habitat.biomes.includes(seen.biome);
    const threat = seen.visible && seen.distance < 5 && seen.target.threatening !== false;
    if (threat && id === 'rabbit' && ['hide', 'flee'].includes(memory.state)) {
      if (memory.state !== 'hide') {
        const angle = Math.atan2(mob.position[2] - seen.target.position[2], mob.position[0] - seen.target.position[0]);
        const candidates = [0, -.6, .6, -1.1, 1.1].map(turn =>
          positionNear(this.#world, mob, mob.position, angle + turn, 2.4)).filter(Boolean);
        const observer = atEye(seen.target.position, seen.target.height);
        memory.destination = candidates.find(point =>
          !this.#world.lineOfSight(observer, atEye(point, mob.species.body.height))) ?? candidates[0];
        setState(memory, 'hide');
      }
      return memory.destination && this.#navigator.steer(mob, memory.destination) || [0, 0];
    }
    if (threat && id === 'wolf' && seen.target.threatening === true) {
      setState(memory, 'hold-ground');
      const delta = seen.target.position.map((value, axis) => value - mob.position[axis]);
      if (seen.distance > 2.2) return this.#navigator.steer(mob, seen.target.position);
      return seen.distance < 1 ? { direction: [-delta[0], -delta[2]], pace: .85 } : [0, 0];
    }
    if (threat || hazard || ['observe', 'flee', 'calm-down'].includes(memory.state)) {
      const destination = this.#passive(mob, memory, seen);
      const direction = destination ? this.#navigator.steer(mob, destination) : [0, 0];
      return { direction, pace: memory.state === 'flee' ? 1.45 : 1, jump: profile.jump };
    }
    if (id === 'mountain-goat' && seen.climbable) {
      for (const [dx, dz] of [[1,0], [-1,0], [0,1], [0,-1]]) {
        const [x, y, z] = mob.position;
        const face = [x + dx * .38, y, z + dz * .38];
        if (this.#world.volume(face, mob.species.body) === 'solid') {
          setState(memory, 'climb');
          return { direction: [dx, dz], climb: true, pace: .65 };
        }
      }
    }
    if (id === 'fox') {
      const prey = peers.find(other => (other.species.id === 'rabbit' || other.species.id === 'chicken') &&
        other.state !== 'dormant' && distanceTo(other.position, mob.position) < 5 &&
        this.#world.lineOfSight(atEye(mob.position, mob.species.body.height),
          atEye(other.position, other.species.body.height)));
      if (prey) {
        setState(memory, 'stalk');
        if (distanceTo(prey.position, mob.position) < .9) return [0,0];
        return { direction: this.#navigator.steer(mob, prey.position), pace: .45 };
      }
    }
    const leader = peers.find(other => other.id !== mob.id && other.id < mob.id &&
      other.species === mob.species && other.state !== 'dormant' &&
      distanceTo(other.position, mob.position) < 6);
    if (leader && distanceTo(leader.position, mob.position) > 1.65) {
      setState(memory, profile.travel);
      return { direction: this.#navigator.steer(mob, leader.position), pace: .82, jump: profile.jump };
    }

    if (memory.state === 'idle' || ![profile.activity, profile.travel].includes(memory.state)) {
      memory.destination = null;
      setState(memory, profile.activity);
    }
    if (memory.state === profile.activity && memory.age < profile.rest) {
      if (id === 'horse') return { direction: [.45, .2], pace: .6 };
      return [0, 0];
    }
    if (memory.state === profile.activity) {
      const angle = this.#engine.random(mob.id) * Math.PI * 2;
      memory.destination = positionNear(this.#world, mob, mob.origin, angle, profile.range);
      setState(memory, profile.travel);
    }
    if (!memory.destination || memory.age >= 2.2 || distanceTo(mob.position, memory.destination) < .3) {
      memory.destination = null;
      setState(memory, profile.activity);
      return [0, 0];
    }
    return {
      direction: this.#navigator.steer(mob, memory.destination),
      pace: profile.pace ?? (id === 'horse' ? 1.36 : id === 'pig' ? .7 : 1), jump: profile.jump
    };
  }

  #original(mob, memory, seen, peers, profile, requestedPoint) {
    if (!mob.species.habitat.biomes.includes(seen.biome) || seen.hazard) return [0, 0];
    const [x, y, z] = mob.position;
    const [ox, oy, oz] = mob.origin;
    const threatened = seen.visible && seen.distance < 4 && seen.target.threatening !== false;
    const angle = threatened ? Math.atan2(z-seen.target.position[2],x-seen.target.position[0]) :
      (memory.patternAngle ??= this.#engine.random(mob.id) * Math.PI * 2);
    if (profile.medium === 'fly') {
      if (validPoint(requestedPoint)) {
        const requested = [...requestedPoint];
        requested[1] = Math.max(oy, Math.min(oy+4, requested[1]));
        const landing = requested[1] <= oy + .01;
        setState(memory,landing ? 'land' : profile.travel);
        if (landing && distanceTo(mob.position,requested) < .14) return [0,0];
        return steerInVolume(this.#world,mob,requested,'fly');
      }
      if (threatened) {
        setState(memory, 'air-escape');
        return steerInVolume(this.#world,mob,[ox+Math.cos(angle)*2.9,oy+profile.height,oz+Math.sin(angle)*2.9],'fly');
      }
      const cycle = (memory.cycle = (memory.cycle ?? 0) + memory.dt) % 6.4;
      if (cycle < .64) {
        setState(memory, profile.activity);
        return [0,0];
      }
      if (cycle < 1.72) {
        setState(memory, 'takeoff');
        return steerInVolume(this.#world,mob,[x,oy+profile.height,z],'fly');
      }
      if (cycle > 5.0) {
        setState(memory,'land');
        if (distanceTo(mob.position,mob.origin) < .14) return [0,0];
        return steerInVolume(this.#world,mob,[ox,oy,oz],'fly');
      }
      const turn = angle + cycle * (mob.species.id === 'emberwing' ? 1.2 : .77);
      let goal = [ox+Math.cos(turn)*profile.range*.63,oy+profile.height,oz+Math.sin(turn)*profile.range*.63];
      if (mob.species.id === 'moonmoth') {
        const lit = [goal,[x+.65,y,z],[x-.65,y,z],[x,y,z+.65],[x,y,z-.65]]
          .filter(point=>distanceTo(point,mob.origin) <= 5);
        const score = point => {
          const sample=this.#world.environment(point);
          return sample.hazard || !Number.isFinite(sample.light) ? -Infinity : sample.light;
        };
        goal = lit.reduce((best,point)=>score(point)>score(best) ? point : best,goal);
        if (cycle < 2.08) {
          setState(memory,'hover');
          return {direction:[0,0],vertical:0,mode:'fly'};
        }
      }
      if (mob.species.id === 'cloudfinch') {
        const lead = peers.find(other => other.id < mob.id && other.species === mob.species &&
          other.motionMode === 'fly' && distanceTo(mob.position,other.position) < 5);
        if (lead) goal = [lead.position[0]-.7,lead.position[1]-.14,lead.position[2]-.55];
      }
      setState(memory,profile.travel);
      return steerInVolume(this.#world,mob,goal,'fly');
    }

    if (profile.medium === 'swim') {
      const wet = this.#world.medium([x,y+Math.min(.18,mob.species.body.height*.3),z]) === 'water';
      const cycle = (memory.cycle = (memory.cycle ?? 0) + memory.dt) % 4.4;
      if (validPoint(requestedPoint)) {
        setState(memory, wet ? 'swim-to-bank' : 'shore-walk');
        if (!wet && this.#world.grounded(requestedPoint,mob.species.body))
          return this.#navigator.steer(mob,requestedPoint);
        return steerInVolume(this.#world,mob,requestedPoint,'swim');
      }
      if (cycle < .75 && !threatened) {
        setState(memory, profile.activity);
        return { direction:[0,0],vertical:0,mode:'swim' };
      }
      const turn = threatened ? angle : angle + cycle * .82;
      const point = [ox+Math.cos(turn)*profile.range*.65,
        Math.max(oy-.24, oy + (mob.species.id==='reedwhisker'?-.23:.06)),oz+Math.sin(turn)*profile.range*.65];
      setState(memory,profile.travel);
      return { ...steerInVolume(this.#world,mob,point,'swim'),pace:profile.pace };
    }

    if (threatened && mob.species.id === 'glassback') {
      if (memory.state !== 'shell-retreat') memory.destination = positionNear(this.#world,mob,mob.position,angle,1.65);
      setState(memory,'shell-retreat');
      return { direction: memory.destination ? this.#navigator.steer(mob,memory.destination) : [0,0], pace:.58 };
    }
    if (profile.day && seen.dayPhase !== profile.day && seen.dayPhase !== 'night' && !threatened) {
      setState(memory,'day-rest');
      return [0,0];
    }
    return this.#familiar(mob,memory,seen,peers,{ rest:.7, ...profile });
  }

  #movesForHostile(mob, memory, seen, tactic, destination, peers) {
    if (tactic.medium === 'fly') {
      if (!destination) {
        const flying = ['detect','acquire','prepare-attack','attack','recover'].includes(memory.state);
        if (!flying) return [0,0];
        if (['detect','acquire'].includes(memory.state) && mob.position[1] < mob.origin[1]+tactic.height-.08)
          return steerInVolume(this.#world,mob,[mob.position[0],mob.origin[1]+tactic.height,mob.position[2]],'fly');
        return { direction:[0,0],vertical:0,mode:'fly' };
      }
      const [x,y,z] = destination;
      const height = memory.state === 'return' ? 0 :
        memory.state === 'pursue' && seen.distance < 2.8 ? .38 : tactic.height;
      if (memory.state === 'return' && distanceTo(mob.position,destination) < .14) return [0,0];
      return steerInVolume(this.#world,mob,[x,y+height,z],'fly');
    }
    if (!destination) {
      if (tactic.attack === 'lunge' && seen.visible && memory.state === 'attack') {
        const dx=seen.target.position[0]-mob.position[0], dz=seen.target.position[2]-mob.position[2];
        const scale=Math.hypot(dx,dz)||1;
        return {direction:[dx/scale,dz/scale],pace:1.62};
      }
      return [0,0];
    }
    if (seen.visible && tactic.standoff && seen.distance < tactic.standoff) {
      const dx = mob.position[0]-seen.target.position[0];
      const dz = mob.position[2]-seen.target.position[2];
      const distance=Math.hypot(dx,dz)||1;
      const [x,y,z]=mob.position;
      const step=positionNear(this.#world,mob,[x,y,z],Math.atan2(dz,dx),1.3);
      if (step) return { direction:this.#navigator.steer(mob,step),pace:.86 };
      return { direction:[dx/distance,dz/distance],pace:.65 };
    }
    if (tactic.pack && seen.visible && seen.distance > 2.25 && memory.state === 'pursue') {
      const leader = peers.find(other=>other.id<mob.id && other.species===mob.species &&
        other.state==='active' && distanceTo(other.position,mob.position)<4.4);
      if (leader) {
        const dx=seen.target.position[0]-mob.position[0], dz=seen.target.position[2]-mob.position[2];
        const angle=Math.atan2(dz,dx)+Math.PI*.65;
        destination=positionNear(this.#world,mob,destination,angle,1.45) ?? destination;
      }
    }
    const heading = this.#navigator.steer(mob,destination);
    if (tactic.climb && seen.climbable && !heading.some(Boolean) && memory.state === 'pursue') {
      const [x,y,z] = mob.position;
      const angle = Math.atan2(destination[2]-z,destination[0]-x);
      const probe = [x+Math.cos(angle)*.38,y,z+Math.sin(angle)*.38];
      if (this.#world.volume(probe,mob.species.body)==='solid')
        return { direction:[Math.cos(angle),Math.sin(angle)],climb:true,pace:.66 };
    }
    return { direction:heading,pace:tactic.pace??1,jump:tactic.jump };
  }

  #hostile(mob, memory, seen, context, tactic) {
    const { combat, behavior } = mob.species;
    if (tactic?.sleep && !memory.awake) {
      if (memory.state === tactic.wake) {
        if (memory.age < .35) return null;
        memory.awake = true;
        setState(memory,'idle');
      } else {
        if (memory.state !== tactic.sleep) setState(memory,tactic.sleep);
        if (seen.visible && seen.distance < tactic.approach && memory.age >= .12) setState(memory,tactic.wake);
        return null;
      }
    }
    const territory = distanceTo(mob.position, mob.origin) <= behavior.territory;
    const canSee = seen.visible && territory &&
      distanceTo(seen.target.position, mob.origin) <= behavior.territory;
    const inReach = canSee && seen.distance <= combat.reach &&
      (!tactic?.standoff || seen.distance >= tactic.standoff*.75) &&
      (tactic?.medium !== 'fly' || mob.position[1] >= seen.target.position[1] + .22);
    if (canSee) {
      memory.lastSeen = [...seen.target.position];
      memory.lost = 0;
    } else if (seen.heard && territory && distanceTo(seen.heard, mob.origin) <= behavior.territory) {
      memory.lastSeen = [...seen.heard];
      memory.lost = 0;
    } else {
      memory.lost += memory.dt;
    }

    if (memory.state === 'attack') {
      setState(memory, 'recover');
      return null;
    }
    if (memory.state === 'prepare-attack') {
      if (!inReach) setState(memory, 'pursue');
      else if (memory.age >= combat.windup) {
        setState(memory, 'attack');
        context.onAttack?.(mob, seen.target);
      }
      return null;
    }
    if (memory.state === 'recover') {
      if (memory.age >= combat.cooldown) setState(memory, 'pursue');
      return null;
    }
    if (memory.state === 'disengage') {
      if (memory.age >= .3) setState(memory, 'return');
      return null;
    }
    if (memory.state === 'return') {
      if (distanceTo(mob.position, mob.origin) > .45 && memory.age < 8) return mob.origin;
      setState(memory, 'idle');
      if (tactic?.sleep) memory.awake=false;
      return null;
    }
    if (['detect', 'acquire', 'pursue', 'investigate'].includes(memory.state)) {
      if (!territory || memory.lost >= 1.25 || memory.engaged >= 16) {
        setState(memory, 'disengage');
        return null;
      }
      memory.engaged += memory.dt;
      if (memory.state === 'detect' && canSee && memory.age >= .12) setState(memory, 'acquire');
      else if (memory.state === 'acquire' && memory.age >= .12) setState(memory, 'pursue');
      else if (memory.state === 'investigate' && canSee) setState(memory, 'detect');
      if (memory.state === 'pursue' && inReach) {
        setState(memory, 'prepare-attack');
        return null;
      }
      return ['pursue', 'investigate'].includes(memory.state) ? memory.lastSeen : null;
    }
    if (canSee || seen.heard) {
      memory.engaged = 0;
      memory.lost = 0;
      if (!canSee) memory.lastSeen = seen.heard;
      setState(memory, canSee ? 'detect' : 'investigate');
      return null;
    }
    if (memory.state === 'idle' && memory.age > 1.15) {
      memory.destination = null;
      setState(memory, 'patrol');
    }
    if (memory.state === 'patrol') {
      const point = this.#wander(mob, memory);
      if (point && memory.age < 3 && distanceTo(mob.position, point) > .35) return point;
      setState(memory, 'idle');
    }
    return null;
  }

  advance(seconds, context = {}) {
    const peers = this.#engine.all();
    const alive = new Set(peers.map(mob => mob.id));
    for (const id of this.#memory.keys()) if (!alive.has(id)) this.forget(id);
    this.#navigator.beginTick();
    return this.#engine.advance(seconds, (mob, dt) => {
      let memory = this.#memory.get(mob.id);
      if (!memory) {
        memory = { state: 'idle', age: 0, dt, lost: 0, engaged: 0 };
        this.#memory.set(mob.id, memory);
      }
      memory.age += dt;
      const seen = sense(this.#world, mob, context);
      const override = context.override?.(mob, seen);
      if (override) {
        setState(memory, override.state);
        return override.heading ?? (override.destination ? this.#navigator.steer(mob, override.destination) : [0, 0]);
      }
      const profile = Object.hasOwn(familiarWildlife, mob.species.id) ? familiarWildlife[mob.species.id] : null;
      if (profile) return this.#familiar(mob, memory, seen, peers, profile);
      if (Object.hasOwn(originalWildlife, mob.species.id))
        return this.#original(mob,memory,seen,peers,originalWildlife[mob.species.id],context.destination?.(mob));
      const tactic = Object.hasOwn(hostileTactics,mob.species.id) ? hostileTactics[mob.species.id] : null;
      const destination = mob.species.classification === 'hostile' ?
        this.#hostile(mob, memory, seen, context,tactic) : this.#passive(mob, memory, seen);
      if (tactic) return this.#movesForHostile(mob,memory,seen,tactic,destination,peers);
      if (!destination) return [0, 0];
      const heading = this.#navigator.steer(mob, destination);
      if (mob.species.classification === 'hostile' && ['pursue', 'investigate'].includes(memory.state) &&
          !heading.some(Boolean)) context.onBlocked?.(mob, seen);
      return heading;
    });
  }
}
