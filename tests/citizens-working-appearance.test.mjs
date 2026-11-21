import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {buildCitizenMesh, CITIZEN_VERTEX_FLOATS} from '../src/citizens/appearance.mjs';
import {createCitizen} from '../src/citizens/entity.mjs';

const waves = [
  {name:'agriculture', professions:['farmer','rancher','shepherd','gardener','greenhouse-grower','beekeeper',
    'hunter','fisherman','miller','baker','butcher','brewer'], expected:720},
  {name:'craftsmanship', professions:['miner','prospector','quarry-worker','lumberjack','forester','blacksmith',
    'armorer','carpenter','stonemason','potter','glassmaker','tailor','jeweler'], expected:780},

  {name:'commerce', professions:['general-merchant','market-vendor','caravan-trader','banker','moneychanger',
    'innkeeper','tavern-keeper','cook','stablekeeper','pet-shopkeeper','bathhouse-attendant'], expected:660},
  {name:'administration', professions:['mayor','councilor','clerk','treasurer','judge','diplomat',
    'guildmaster','town-planner','messenger'], expected:540},
];
const races = ['human','elf','dwarf','thornkin','asteri','glassborn'];
const biomes = ['temperate','desert','snow','enchanted-forest','mountain'];

for (const {name,professions,expected} of waves) test(`${name} wave builds ${expected} different meshes and distinct tool shapes`, () => {
  const signatures = new Set();
  const handSignatures = new Set();
  for (const profession of professions) for (const race of races) {
    for (const biome of biomes) for (const variant of [1,2]) {
      const citizen = createCitizen({worldSeed:179,settlementId:'gallery',slot:0,
        profession,race,biome,variant,style:'village'});
      const mesh = buildCitizenMesh(citizen);
      signatures.add(createHash('sha256').update(Buffer.from(mesh.buffer)).digest('hex'));
      if (race !== 'human' || biome !== 'temperate' || variant !== 1) continue;
      const rightHandPositions = [];
      for (let i=0; i<mesh.length; i+=CITIZEN_VERTEX_FLOATS) {
        if (mesh[i+6] === 4) rightHandPositions.push(mesh[i],mesh[i+1],mesh[i+2]);
      }
      handSignatures.add(rightHandPositions.join(','));
    }
  }
  assert.equal(signatures.size,expected);
  assert.equal(handSignatures.size,professions.length);
});
