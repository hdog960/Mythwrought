import { BLOCK, VoxelWorld, meshChunk } from '../src/voxel.mjs';
import { Pack2LiveWorld } from '../src/pack2-world.mjs';
import { createWorldQuery } from '../src/mobs/world-query.mjs';
import { MobEngine } from '../src/mobs/engine.mjs';
import { BehaviorController } from '../src/mobs/behavior.mjs';
import { DemoTarget, MobCombat, ObjectAccess } from '../src/mobs/combat.mjs';
import { CompanionManager } from '../src/mobs/companion.mjs';
import { PopulationManager } from '../src/mobs/ecology.mjs';

const Y = 9;
const fixtures = Object.freeze({
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
  const world = new Pack2LiveWorld(base);
  if (!world.placePack2(...doorCell, 67, { rotation: 0, open: false }))
    throw Error('Could not place the preview door');
  for (const [x, z] of [[-9, -2], [-10, -2], [4, 1], [5, 1], [-2, 8], [-2, 9]])
    world.placePack2(x, Y, z, 63, {});
  const baseBytes = JSON.stringify(base.save());
  const initialDoor = world.getPack2State(...doorCell);
  let revision = 0;
  const query = createWorldQuery(world, {
    resident: (cx, cz, section) => section === 0 && cx >= -1 && cx <= 1 && cz >= -1 && cz <= 1,
    revision: () => revision,
    observe: ([x, y, z]) => ({
      biome: z > 6 ? 'wetland' : x < 0 ? 'meadow' : 'forest',
      light: z > 6 ? .42 : .82,
      hazard: y < Y - .3 || x < -13.5 || x > 13.5 || z < -6.5 || z > 13.5,
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
  const lifecycle = new PopulationManager(engine, query);
  const ids = Object.fromEntries(Object.entries(fixtures).map(([id, fixture]) =>
    [id, engine.spawn(id, fixture.start, { dormant: id !== 'deer' })]));
  if (Object.values(ids).some(id => !id)) throw Error('Invalid preview spawn');
  const target = new DemoTarget(fixtures.deer.target, { height: 1.08 });
  let species = 'deer';
  let targetVisible = false;
  let disturbance = false;
  let events = [];
  let playerSide = false;

  function select(name) {
    if (!Object.hasOwn(fixtures, name)) return false;
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
    target.place(fixtures[name].target);
    events = [];
    return true;
  }

  function action(command) {
    const id = ids[species];
    const mob = engine.get(id);
    if (command === 'approach' || command === 'encounter') {
      target.place(fixtures[species].target);
      if (species === 'goblin') target.reset();
      targetVisible = true;
      disturbance = species === 'goblin';
      return true;
    }
    if (command === 'withdraw') {
      targetVisible = false;
      disturbance = false;
      return true;
    }
    if (command === 'door') return species === 'goblin' && access.request(mob, door.id);
    if (species !== 'glownewt') return false;
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
      const point = playerSide ? [.5, Y, 6.5] : [4.5, Y, 7.5];
      playerSide = !playerSide;
      target.place(point);
      targetVisible = true;
      return true;
    }
    if (command === 'bond') return targetVisible && companions.befriend(id, target);
    if (command === 'down') return companions.hurt(id, 100);
    if (command === 'rescue') return targetVisible && companions.rescue(id, target);
    return companions.command(id, target, command);
  }

  function tick(seconds) {
    companions.advance(seconds);
    combat.advance(seconds, targetVisible && species !== 'glownewt' ? target : null, {
      disturbances: disturbance ? [{ position: target.position, loudness: 1 }] : [],
      override: mob => companions.directive(mob, targetVisible ? target : null)
    });
    events = [...events, ...combat.events].slice(-24);
    engine.drainEvents();
  }

  function snapshot(integrity = false) {
    const mob = engine.get(ids[species]);
    const draw = engine.all().filter(entity => entity.state !== 'dormant' && entity.id === mob.id)
      .map(entity => ({ ...entity, visual: behavior.state(entity.id) }));
    if (targetVisible) draw.push({ species: { id: 'target' }, position: target.position,
      yaw: 0, velocity: [0, 0, 0], state: target.alive ? 'idle' : 'downed' });
    return { species, fixture: fixtures[species], mob, draw, state: behavior.state(mob.id) ?? mob.state,
      target: { position: target.position, health: target.health, visible: targetVisible },
      companions: companions.slots(), doorOpen: world.getPack2State(...doorCell).open,
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
    dispose: () => engine.dispose()
  };
}
