import { BLOCK, VoxelWorld, meshChunk } from '../src/voxel.mjs';
import { meshDepthSection } from '../src/depth-mesh.mjs';
import { Pack2LiveWorld } from '../src/pack2-world.mjs';
import { pack2WaterSectionVertices } from '../src/pack2-integration.mjs';
import { createWorldQuery } from '../src/mobs/world-query.mjs';
import { MobEngine } from '../src/mobs/engine.mjs';
import { BehaviorController } from '../src/mobs/behavior.mjs';
import { DemoTarget, MobCombat, ObjectAccess } from '../src/mobs/combat.mjs';
import { CompanionManager } from '../src/mobs/companion.mjs';
import { PopulationManager, spawnEligible } from '../src/mobs/ecology.mjs';
import { AnimalInteractions } from '../src/mobs/animal-interactions.mjs';
import { getSpecies } from '../src/mobs/species.mjs';
import { familiarWildlife } from '../src/mobs/familiar-wildlife.mjs';
import { originalWildlife } from '../src/mobs/original-wildlife.mjs';
import { hostileTactics } from '../src/mobs/hostile-tactics.mjs';

const stagedWildlife = { ...familiarWildlife, ...originalWildlife };

const Y = 9;
function wildlifeFixture(id) {
  const alpine = id === 'mountain-goat';
  const forest = id === 'wolf' || id === 'fox';
  return {
    start: alpine ? [9.60, Y, 9.5] : forest ? [4.5, Y, -2.5] : [-2.5, Y, -.5],
    target: alpine ? [7.5, Y, 10.5] : forest ? [5.5, Y, -1.5] : [-.5, Y, .5],
    title: getSpecies(id).displayName,
    habitat: alpine ? 'Alpine shelf' : forest ? 'Forest margin' : 'Low meadow'
  };
}
const originals = {
  duskhorn: [-3.5,Y,2.5,'Twilight grove'],
  moonmoth: [2.5,Y,-1.5,'Lantern glade'],
  glassback: [-11.5,Y,9.5,'Dry stone bank'],
  frosthorn: [10.5,Y,11.5,'Alpine shelf'],
  mossback: [-7.5,Y+.2,10.5,'Reed pool'],
  sunskipper: [-2.5,Y,.5,'Open meadow'],
  cloudfinch: [9.5,Y,11.5,'High meadow'],
  reedwhisker: [-6.5,Y+.26,11.5,'Reed pool'],
  emberwing: [11.5,Y,9.5,'Alpine updraft']
};
function hostileFixture(id) {
  const field = {
    harpy:[[9.5,Y,12.5],[9.5,Y,9.5],'High outcrop'],
    gargoyle:[[9.5,Y,12.5],[9.5,Y,9.5],'High outcrop'],
    'giant-spider':[[-10.5,-8,1.5],[-7.2,-8,1.5],'Carved gallery'],
    stoneclaw:[[-10.5,-8,1.5],[-7.2,-8,1.5],'Carved gallery'],
    gloomcrawler:[[-10.5,-8,1.5],[-7.2,-8,1.5],'Narrow cavern'],
    thornwraith:[[4.5,Y,-2.5],[9.5,Y,-2.5],'Forest margin'],
    sandstalker:[[-11.5,Y,9.5],[-11.5,Y,12.6],'Dry stone bank'],
    frostwraith:[[12.5,Y,11.5],[12.5,Y,6.5],'Snow shelf'],
    briarlurker:[[-.5,Y,7.5],[-.5,Y,10.6],'Reed margin']
  }[id];
  const [start,target,habitat] = field ?? [
    [-11.5,-8,-2.5],[id==='skeleton' ? -5.5 : id==='voidmoth' ? -7.05 : -8.2,-8,-2.5],'Carved gallery'];
  return { start,target,title:getSpecies(id).displayName,habitat };
}
const fixtures = Object.freeze({
  ...Object.fromEntries(Object.keys(hostileTactics).map(id=>[id,hostileFixture(id)])),
  ...Object.fromEntries(Object.entries(originals).map(([id,[x,y,z,habitat]]) =>
    [id,{ start:[x,y,z], target:[x-1.45,Y,z+.55], title:getSpecies(id).displayName, habitat }])),
  ...Object.fromEntries(Object.keys(familiarWildlife).map(id => [id, wildlifeFixture(id)])),
  deer: { start: [-7.5, Y, .5], target: [-5.5, Y, 2.5], title: 'Deer', habitat: 'Woodland clearing' },
  goblin: { start: [7.5, Y, -.5], target: [8.5, Y, 3.5], title: 'Goblin', habitat: 'Timber outpost' },
  glownewt: { start: [-.5, Y, 8.5], target: [.5, Y, 8.5], title: 'Glownewt', habitat: 'Wetland edge' }
});
const doorCell = [7, Y, 0];
const door = Object.freeze({ id: 'outpost-door', kind: 'door', position: [7.5, Y, .5] });
const chunks = [];
for (const x of [-1, 0, 1]) for (const z of [-1, 0, 1]) chunks.push([x, z]);

export function createScene() {
  const base = new VoxelWorld(179);
  for (let x = -14; x <= 14; x++) {
    for (let z = -7; z <= 14; z++) {
      base.set(x, Y - 1, z, z < 0 && x > 3 ? BLOCK.STONE : BLOCK.GRASS);
      for (let y = Y; y <= 17; y++) base.set(x, y, z, BLOCK.AIR);
    }
  }
  for (const [x, z] of [[-11, -3], [-11, 4], [-9, -4], [-4, -4], [-12, 5],
    [3, -4], [10, -4], [13, 5], [-3, 11], [4, 11], [2, 12]]) {
    for (let y = Y; y < Y + 3; y++) base.set(x, y, z, BLOCK.WOOD);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++)
      base.set(x + dx, Y + 3, z + dz, BLOCK.LEAVES);
    base.set(x, Y + 4, z, BLOCK.LEAVES);
  }
  for (const [x, z] of [[-8, 2], [-9, 1], [-5, -2], [9, 1], [9, 2], [10, 2], [7, 2], [6, 2],
    [-3, 8], [2, 8], [1, 11], [0, 12]]) base.set(x, Y, z, BLOCK.STONE);
  for (const x of [6, 8]) for (let y = Y; y < Y + 2; y++) base.set(x, y, 0, BLOCK.WOOD);
  for (const [x, z] of [[-3, 9], [2, 9], [1, 12], [0, 10], [-1, 11]])
    base.set(x, Y, z, BLOCK.CRYSTAL);
  for (const y of [Y, Y + 1]) base.set(10, y, 9, BLOCK.STONE);
  for(let x=-15;x<=-2;x++) for(let z=-7;z<=5;z++) {
    base.set(x,-9,z,BLOCK.STONE);
    for(let y=-8;y<=-4;y++) base.set(x,y,z,BLOCK.AIR);
  }
  for(const x of [-11,-10]) for(const y of [-8,-7]) base.set(x,y,2,BLOCK.STONE);
  for(const [x,y,z] of [[-14,-8,-4],[-13,-8,1],[-12,-8,3],[-4,-8,-2],[-3,-8,2]])
    base.set(x,y,z,BLOCK.CRYSTAL);
  const world = new Pack2LiveWorld(base);
  for (let x=-9; x<=-5; x++) for (let z=9; z<=13; z++) {
    if (!world.placePack2(x,Y,z,76,{level:2,flow:'east'}))
      throw Error('Could not place a preview pool cell');
  }
  if (!world.placePack2(...doorCell, 67, { rotation: 0, open: false }))
    throw Error('Could not place the preview door');
  for (const [x, z] of [[-9, -2], [-10, -2], [4, 1], [5, 1], [-2, 8], [-2, 9]])
    world.placePack2(x, Y, z, 63, {});
  const baseBytes = JSON.stringify(base.save());
  const initialDoor = world.getPack2State(...doorCell);
  let revision = 0;
  const query = createWorldQuery(world, {
    resident: (cx, cz, section) => (section === 0 || (section === -1 && cx === -1)) &&
      cx >= -1 && cx <= 1 && cz >= -1 && cz <= 1,
    revision: () => revision,
    observe: ([x, y, z]) => ({
      biome: y < -3 ? 'cave' : x > 11.75 && z > 9 ? 'snow' : x > 6 && z > 8 ? 'alpine' : x < -9 && z > 6 ? 'desert' : z > 6 ? 'wetland' : x < 0 ? 'meadow' : 'forest',
      climbable: (y < -3 && x < -3) || (x > 8.5 && x < 11.5 && z > 8.5 && z < 10.5),
      light: y < -3 ? .29 : x >= 1 && x < 5 && Math.abs(z) < 2 ? .25 + x*.11 : z > 6 ? .42 : .82,
      dayPhase: 'dusk',
      hazard: (y < -3 ? y < -8.3 || x < -14.8 || x > -2.2 : y < Y - .3) || x < -14.8 || x > 13.5 || z < -6.5 || z > 13.5,
      objects: Math.hypot(x - 7.5, z - .5) < 2.6 && !world.getPack2State(...doorCell).open ? [door] : []
    })
  });
  const access = new ObjectAccess(query, (id, action) => {
    if (id !== door.id || action !== 'open' || world.getPack2State(...doorCell).open) return false;
    if (!world.updatePack2State(...doorCell, { ...initialDoor, open: true })) return false;
    revision++;
    return true;
  });

  const engine = new MobEngine(query, 179);
  const behavior = new BehaviorController(engine, query);
  const combat = new MobCombat(engine, query, behavior, access);
  const companions = new CompanionManager(engine, query, combat);
  const animals = new AnimalInteractions(engine, query);
  const ids = Object.fromEntries(['deer', 'goblin', 'glownewt'].map(id =>
    [id, engine.spawn(id, fixtures[id].start, { dormant: id !== 'deer' })]));
  if (Object.values(ids).some(id => !id)) throw Error('Invalid preview spawn');
  const target = new DemoTarget(fixtures.deer.target, { height: 1.08 });
  let species = 'deer';
  let targetVisible = false;
  let disturbance = false;
  let events = [];
  let playerSide = false;
  let nearbyEntities = [];
  let destination = null;
  let climbTrial = false;

  function select(name) {
    if (!Object.hasOwn(fixtures, name)) return false;
    if (!ids[name]) {
      const id = engine.spawn(name, fixtures[name].start, { dormant: true });
      if (!id) return false;
      ids[name] = id;
    }
    animals.dismount(target);
    destination = null;
    climbTrial = false;
    for (const id of nearbyEntities) engine.transition(id, 'removed');
    nearbyEntities = [];
    for (const [kind, id] of Object.entries(ids)) {
      const mob = engine.get(id);
      if (kind === name && mob.state === 'dormant') engine.transition(id, 'idle');
      else if (kind !== name && ['active', 'idle'].includes(mob.state)) engine.transition(id, 'dormant');
    }
    species = name;
    targetVisible = false;
    disturbance = false;
    playerSide = false;
    target.reset();
    combat.clearProjectiles();
    target.threatening = undefined;
    target.place(fixtures[name].target);
    events = [];
    return true;
  }

  function action(command) {
    const id = ids[species];
    const mob = engine.get(id);
    if (command === 'approach' || command === 'encounter') {
      target.place(fixtures[species].target);
      if (mob.species.classification === 'hostile') target.reset();
      targetVisible = true;
      target.threatening = species === 'wolf' ? true : undefined;
      disturbance = mob.species.classification === 'hostile';
      return true;
    }
    if (command === 'wall') {
      const capable = hostileTactics[species]?.climb === true;
      climbTrial = !climbTrial && capable;
      return capable;
    }
    if (command === 'withdraw') {
      climbTrial = false;
      targetVisible = false;
      disturbance = false;
      return true;
    }
    if (command === 'door') return species === 'goblin' && access.request(mob, door.id);
    const familiar = Object.hasOwn(stagedWildlife, species);
    if (!familiar && species !== 'glownewt' && !(command==='group' && hostileTactics[species]?.pack)) return false;
    if (command === 'near') {
      const [x, y, z] = mob.position;
      for (const point of [[x + .85, y, z], [x - .85, y, z], [x, y, z + .85]]) {
        if (!query.grounded(point, { radius: .22, height: target.height })) continue;
        target.place(point);
        targetVisible = true;
        return true;
      }
      return false;
    }
    if (command === 'move') {
      const point = familiar ? (playerSide ? fixtures[species].target : [6.5, Y, -2.5]) :
        (playerSide ? [.5, Y, 6.5] : [4.5, Y, 7.5]);
      playerSide = !playerSide;
      target.place(point);
      targetVisible = true;
      return true;
    }
    if (command === 'land' || command === 'fly' || command === 'bank' || command === 'pool') {
      const profile = originalWildlife[species];
      if (profile?.medium === 'fly' && ['land','fly'].includes(command)) {
        const [x,y,z] = fixtures[species].start;
        destination = command === 'land' ? [x,y,z] : [x-.55,y+profile.height,z+.75];
        return true;
      }
      if (profile?.medium === 'swim' && ['bank','pool'].includes(command)) {
        destination = command === 'bank' ? [-3.45,Y,11.5] : [...fixtures[species].start];
        return true;
      }
      return false;
    }
    if (command === 'tame') return targetVisible && animals.tame(id, target);
    if (command === 'mount') return targetVisible && animals.mount(id, target);
    if (command === 'dismount') {
      const rider = animals.riderPosition(target);
      if (!rider) return false;
      const landing = [[rider[0] + 1, mob.position[1], rider[2]], [rider[0] - 1, mob.position[1], rider[2]]]
        .find(point => query.grounded(point, { radius: .24, height: target.height }));
      if (!landing || !animals.dismount(target)) return false;
      target.place(landing);
      return true;
    }
    const steering = { walk: [1,0], run: [1,0], turn: [0,1], halt: [0,0] };
    if (Object.hasOwn(steering, command)) return animals.steer(target, steering[command], command === 'run');
    if (command === 'threat') {
      if (species !== 'wolf' || !mob.important || nearbyEntities.length !== 0) return false;
      const [x,y,z] = mob.position;
      const body = getSpecies('goblin').body;
      const point = [[x+.69,y,z], [x-.69,y,z], [x,y,z-.69]]
        .find(candidate => query.grounded(candidate, body) && !query.environment(candidate).hazard);
      if (!point) return false;
      const enemy = engine.spawn('goblin', point);
      if (!enemy) return false;
      nearbyEntities.push(enemy);
      return true;
    }
    if (command === 'breed' || command === 'group' || command === 'prey') {
      const kind = command === 'prey' ? 'rabbit' : species;
      if ((command === 'breed' && !mob.species.breeding.eligible) || nearbyEntities.length >= 3) return false;
      const [x, y, z] = mob.position;
      const body = getSpecies(kind).body;
      const point = [[x + 1.68,y,z], [x - 1.68,y,z], [x,y,z + 1.68]]
        .find(candidate => (query.grounded(candidate, body) ||
          (getSpecies(kind).movement.capabilities.includes('swim') && query.volume(candidate,body)==='clear' &&
            query.medium([candidate[0],candidate[1]+.12,candidate[2]])==='water')) && !query.environment(candidate).hazard);
      if (!point) return false;
      const member = engine.spawn(kind, point);
      if (!member) return false;
      if (command === 'breed') {
        const child = animals.breed(id, member);
        if (!child) {
          engine.transition(member, 'removed');
          return false;
        }
        nearbyEntities.push(child);
      }
      nearbyEntities.push(member);
      return true;
    }
    if (command === 'bond') return targetVisible && companions.befriend(id, target);
    if (command === 'down') return companions.hurt(id, 100);
    if (command === 'rescue') return targetVisible && companions.rescue(id, target);
    return companions.command(id, target, command);
  }

  function tick(seconds) {
    companions.advance(seconds);
    animals.advance(seconds);
    const threat = nearbyEntities.find(id => engine.get(id)?.species.id === 'goblin');
    combat.advance(seconds, targetVisible && species !== 'glownewt' ? target : null, {
      destination: mob => mob.id === ids[species] ? destination : null,
      disturbances: disturbance ? [{ position: target.position, loudness: 1 }] : [],
      override: mob => climbTrial && mob.id===ids[species] ? {
        state:'climb', heading:{direction:[0,1],climb:true,pace:.55}
      } : animals.directive(mob) ?? companions.directive(mob, targetVisible ? target : null, threat)
    });
    const rider = animals.riderPosition(target);
    if (rider) target.place(rider);
    events = [...events, ...combat.events].slice(-24);
    engine.drainEvents();
  }

  function snapshot(integrity = false) {
    const mob = engine.get(ids[species]);
    const draw = engine.all().filter(entity => entity.state !== 'dormant' && (entity.id === mob.id || nearbyEntities.includes(entity.id)))
      .map(entity => ({ ...entity, visual: behavior.state(entity.id) }));
    for (const shot of combat.projectiles) draw.push({ ...shot, species:{id:shot.visual},
      yaw:Math.atan2(shot.velocity[0],shot.velocity[2]),state:'active' });
    if (targetVisible) draw.push({ species: { id: 'target' }, position: target.position,
      yaw: 0, velocity: [0, 0, 0], state: target.alive ? 'idle' : 'downed' });
    return { species, fixture: fixtures[species], mob, draw, projectiles:combat.projectiles, state: behavior.state(mob.id) ?? mob.state,
      target: { position: target.position, health: target.health, visible: targetVisible },
      companions: companions.slots(), rider: animals.riderPosition(target), tamed: animals.isTamed(mob.id,target),
      eligibility: integrity && (Object.hasOwn(stagedWildlife, species) || Object.hasOwn(hostileTactics,species)) ? spawnEligible(query, mob.species,
        fixtures[species].start, fixtures[species].start.map((value, axis) => axis ? value : value - 6)) : undefined,
      doorOpen: world.getPack2State(...doorCell).open,
      revision, events, work: behavior.navigationWork, schema1Untouched: integrity ? JSON.stringify(base.save()) === baseBytes : undefined };
  }

  function benchmark(count) {
    const runtime = new MobEngine(query, 179, { maxActive: 16, maxEntities: 48 });
    const steering = new BehaviorController(runtime, query);
    const population = new PopulationManager(runtime, query);
    for (let n = 0, admitted = 0; n < 56 && admitted < count; n++) {
      const x = -12.5 + n % 8;
      const z = 4.5 + Math.floor(n / 8);
      const id = runtime.spawn(admitted % 5 === 0 ? 'goblin' : admitted % 3 === 0 ? 'glownewt' : 'deer',
        [x, Y, z], { dormant: admitted >= 16 });
      if (id) admitted++;
    }
    return { runtime, steering, population };
  }

  return {
    select, action, tick, snapshot, benchmark,
    cameraClear: (eye, focus) => query.volume(eye, { radius: .18, height: .24 }) === 'clear' &&
      query.lineOfSight(eye, focus) &&
      query.lineOfSight(eye, [focus[0], focus[1] + .35, focus[2]]) &&
      query.lineOfSight(eye, [focus[0], focus[1] - .15, focus[2]]),
    meshes: () => chunks.map(([cx, cz]) => meshChunk(world, cx, cz)),
    caves: () => [-1,0].map(cz=>meshDepthSection(world,-1,cz,-1)),
    waters: () => chunks.map(([cx,cz])=>pack2WaterSectionVertices(world,cx,cz,0)).filter(mesh=>mesh.length),
    dispose: () => engine.dispose()
  };
}
