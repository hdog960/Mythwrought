import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { LANES } from './scope.mjs';

const lanes = process.argv[2]?.split(',').filter(Boolean) || [];
if (!lanes.length || new Set(lanes).size !== lanes.length || lanes.some((lane) => !LANES.includes(lane))) {
  console.error('Refusing an empty, duplicated, or unknown CI lane set.');
  process.exit(1);
}

for (const lane of lanes) {
  const directory = lane.startsWith('pack-')
    ? `tests/block-packs/${lane}`
    : `tests/building-pool/${lane}`;
  if (!existsSync(directory)) {
    console.error(`Missing expected ${lane} test directory: ${directory}`);
    process.exit(1);
  }
  const files = readdirSync(directory).filter((name) => name.endsWith('.test.mjs')).sort()
    .map((name) => join(directory, name));
  if (!files.length) {
    console.error(`Refusing to pass ${lane} with zero native Node test files.`);
    process.exit(1);
  }
  console.log(`CI lane ${lane}: executing ${files.length} native Node test file(s)`);
  const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`${lane} failed; this is not a browser, iPhone, or creator approval.`);
    process.exit(result.status || 1);
  }
}
