import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runQuenchPersistenceFixtures} from './quench-persistence-fixtures.mjs';
import {createLavaQuenchPersistence} from '../../../src/liquids/lava/physics/quench-persistence.mjs';
import {LAVA_DEFINITION,lavaQuantities} from '../../../src/liquids/lava/physics/definition.mjs';
import {WATER_LAVA_SETTLEMENT_RULE} from '../../../src/liquids/lava/physics/transactions.mjs';
import {createLavaVents} from '../../../src/liquids/lava/physics/vents.mjs';
import {createLavaThermalScheduler} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
if(!process.env.LIQUID_PEER_ROOT)throw new Error('Set LIQUID_PEER_ROOT to exact pinned Water A checkout');
const peer=p=>import(pathToFileURL(resolve(process.env.LIQUID_PEER_ROOT,p)).href);
const {createLiquidEngine}=await peer('src/liquids/core/engine.mjs');
const {createLiquidPersistence}=await peer('src/liquids/core/persistence.mjs');
const {createWaterSources}=await peer('src/liquids/water/physics/sources.mjs');
const {WATER_DEFINITION}=await peer('src/liquids/water/physics/definition.mjs');
const {physicalRegionAt}=await peer('src/world-height.mjs');
runQuenchPersistenceFixtures({createLiquidEngine,createLiquidPersistence,createWaterSources,physicalRegionAt,
  WATER_DEFINITION,LAVA_DEFINITION,lavaQuantities,WATER_LAVA_SETTLEMENT_RULE,createLavaVents,
  createLavaThermalScheduler,createLavaQuenchPersistence,test,assert});
