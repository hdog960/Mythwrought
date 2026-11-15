import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CREATIVE_ADAPTER_ABI, CREATIVE_ENABLED_BY_DEFAULT, REQUIRED_CREATIVE_PORTS,
  inspectCreativePorts, validateRegisteredPlaceables
} from '../../src/creative-mode/adapter-contract.mjs';

const makePorts = () => Object.fromEntries(Object.entries(REQUIRED_CREATIVE_PORTS)
  .map(([name, methods]) => [name, Object.fromEntries(methods.map(m => [m, () => { throw Error('must not be called by M0'); }]))]));
const placeable = (id, kind='block') => ({id, name:'Test asset', category:'testing', kind,
  registered:true, placeable:true, placementRules:{requiresSupport:false}});

test('M0 stays inert and has an explicit versioned adapter ABI', () => {
  assert.equal(CREATIVE_ENABLED_BY_DEFAULT, false);
  assert.equal(CREATIVE_ADAPTER_ABI, 'mythwrought.creative.adapters.v1');
  assert.ok(Object.isFrozen(REQUIRED_CREATIVE_PORTS));
  for (const methods of Object.values(REQUIRED_CREATIVE_PORTS)) assert.ok(Object.isFrozen(methods));
});
test('absent adapters fail closed, without invoking or changing a host', () => {
  const result = inspectCreativePorts(null);
  assert.equal(result.shapeValid, false);
  assert.equal(result.runtimeIntegrated, false);
  assert.equal(result.enabled, false);
  assert.ok(result.missing.includes('registry.listPlaceables'));
  assert.ok(result.missing.includes('saves.worldSchema=1'));
  assert.ok(result.missing.includes('registry.provenance=live-registered-placeables'));
  assert.ok(Object.isFrozen(result));
});
test('complete mock ports are only shape-valid, not live or enabled', () => {
  const ports = makePorts();
  ports.saves.worldSchema = 1;
  ports.registry.provenance = 'live-registered-placeables';
  const result = inspectCreativePorts(ports);
  assert.equal(result.shapeValid, true);
  assert.deepEqual(result.missing, []);
  assert.equal(result.runtimeIntegrated, false);
  assert.equal(result.enabled, false);
});
test('missing save schema and registry authority fail closed', () => {
  const ports = makePorts();
  assert.equal(inspectCreativePorts(ports).shapeValid, false);
  ports.saves.worldSchema = 2;
  ports.registry.provenance = 'draft-catalog';
  assert.equal(inspectCreativePorts(ports).shapeValid, false);
});
test('live placeable snapshots preserve stable IDs and accept shaped objects', () => {
  const rows = validateRegisteredPlaceables([placeable(3), placeable('shaped:door','object')]);
  assert.deepEqual(rows.map(row => row.id), [3,'shaped:door']);
  assert.ok(Object.isFrozen(rows));
  assert.ok(Object.isFrozen(rows[0]));
  assert.ok(Object.isFrozen(rows[0].placementRules));
});
test('duplicate or invalid IDs are rejected rather than silently relabelled', () => {
  assert.throws(() => validateRegisteredPlaceables([placeable(3), placeable(3)]), /Duplicate/);
  for (const id of [0,-1,1.25,Infinity,'','bad id','../escape',null])
    assert.throws(() => validateRegisteredPlaceables([placeable(id)]), /ID/);
});
test('draft, scenic-only, and non-placeable records cannot leak into inventory', () => {
  for (const field of ['registered','placeable']) {
    const row=placeable(9); row[field]=false;
    assert.throws(() => validateRegisteredPlaceables([row]), /Unregistered/);
  }
  assert.throws(() => validateRegisteredPlaceables([{...placeable(9), scenicOnly:true}]), /scenic-only/);
});
test('incomplete metadata, wrong kind or non-array snapshot are rejected', () => {
  assert.throws(() => validateRegisteredPlaceables({}), /array/);
  assert.throws(() => validateRegisteredPlaceables([null]), /Malformed/);
  assert.throws(() => validateRegisteredPlaceables([{...placeable(9),kind:'scenery'}]), /metadata/);
  assert.throws(() => validateRegisteredPlaceables([{...placeable(9),placementRules:null}]), /metadata/);
});
