// D6 fossilized Worldwyrm proposal built from the existing Desert fossil bed.
import { BLOCK, worldKey } from '../voxel.mjs';
import { M3_DESERT_IDS as rock } from './desert-m3.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const dry = new Set([rock.red, rock.pale, rock.hardpan, rock.salt, rock.sandstone, rock.fossil, rock.banded]);
const ribs = [-10, -6, -2, 2, 6, 10];

export function surveyDesertWorldwyrm(world, { x, z, axis, reservedAt = () => false }) {
  if (![x, z].every(Number.isSafeInteger) || !['x', 'z'].includes(axis) || typeof reservedAt !== 'function') {
    throw new TypeError('Invalid Worldwyrm survey');
  }
  const at = (along, across) => axis === 'x' ? [x + along, z + across] : [x + across, z + along];
  const protectedAt = (a, y, b) => reservedAt(a, y, b) || world.edits.has(worldKey(a, y, b)) ||
    world.environmentCaves.get(a, y, b) !== undefined;
  function cap(a, b) {
    const biome = v6BiomeAt(a, b, world.seed);
    if (biome?.name !== 'desert' || biome.weight < .91 || world._oasisNear(a, b, 2, biome)) return null;
    const column = world._columnPlan(a, b), floor = Math.max(...column.keys());
    if (floor < 3 || floor > 12 || !dry.has(column.get(floor)) || world.get(a, floor, b) !== column.get(floor) ||
        protectedAt(a, floor, b) || protectedAt(a, floor - 1, b) || world.get(a, floor - 1, b) === BLOCK.AIR) return null;
    return floor;
  }
  const floor = cap(x, z);
  if (floor === null) return null;
  const cells = new Map(), eligibleColumns = new Set(), footings = [], route = [];
  function bone(run, width, y, id = rock.fossil) {
    const [a, b] = at(run, width);
    const column = a + ',' + b;
    if (!eligibleColumns.has(column)) {
      if (cap(a, b) === null) return false;
      eligibleColumns.add(column);
    }
    if (world.get(a, y, b) !== BLOCK.AIR || protectedAt(a, y, b)) return false;
    const key = worldKey(a, y, b);
    if (!cells.has(key)) cells.set(key, [a, y, b, id]);
    return true;
  }
  for (let run = -12; run <= 12; run++) {
    const [a, b] = at(run, 0), ground = cap(a, b);
    if (ground === null || Math.abs(ground - floor) > 1) return null;
    for (let y = ground + 1; y <= ground + 2; y++) {
      if (world.get(a, y, b) !== BLOCK.AIR || protectedAt(a, y, b)) return null;
    }
    if (route.length && Math.abs(route.at(-1)[1] - ground - 1) > 1) return null;
    route.push([a, ground + 1, b]);
  }
  for (const run of ribs) for (let width = -4; width <= 4; width++) {
    const step = 5 - Math.abs(width), [a, b] = at(run, width);
    let bottom = floor + step;
    if (Math.abs(width) === 4) {
      const ground = cap(a, b);
      if (ground === null || Math.abs(ground - floor) > 1) return null;
      bottom = ground + 1;
      footings.push([a, ground, b]);
    }
    for (let y = bottom; y <= floor + step + 1; y++) if (!bone(run, width, y)) return null;
  }
  for (let run = -13; run <= 15; run++) {
    if (!bone(run, 0, floor + 6, run % 2 === 0 ? rock.fossil : rock.banded)) return null;
  }
  for (let run = 12; run <= 15; run++) for (const width of [-1, 1]) {
    if (!bone(run, width, floor + 6) || !bone(run, width, floor + 5)) return null;
    if (run >= 14 && !bone(run, width, floor + 4, rock.banded)) return null;
  }
  for (const run of [12, 13, 14]) if (!bone(run, 0, floor + 7)) return null;
  return { name: 'Fossilized Worldwyrm', origin: [x, floor, z], axis, cells: [...cells.values()], footings, route };
}

export function openDesertWorldwyrmWitness(world, formation) {
  const fossils = new Map(formation.cells.map(([x, y, z, id]) => [worldKey(x, y, z), id]));
  return Object.create(world, {
    get: { value: (x, y, z) => {
      const key = worldKey(x, y, z);
      return !world.edits.has(key) && fossils.has(key) ? fossils.get(key) : world.get(x, y, z);
    } },
    naturalAndLandmarkBlock: { value: (x, y, z) => fossils.get(worldKey(x, y, z)) ?? world.naturalAndLandmarkBlock(x, y, z) },
    set: { value() { throw Error('Read-only Worldwyrm witness'); } },
    save: { value() { throw Error('Worldwyrm research requires a separate profile'); } }
  });
}
