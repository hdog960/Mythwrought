import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { LANES } from './scope.mjs';

const lanes = process.argv[2]?.split(',').filter(Boolean) || [];
if (!lanes.length || new Set(lanes).size !== lanes.length || lanes.some((lane) => !LANES.includes(lane))) {
  console.error('Refusing an empty, duplicated, or unknown CI lane set.');
  process.exit(1);
}

function findTestFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...findTestFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.test.mjs')) files.push(path);
  }
  return files.sort();
}

for (const lane of lanes) {
  const directory = lane.startsWith('pack-')
    ? `tests/block-packs/${lane}`
    : `tests/building-pool/${lane}`;
  if (!existsSync(directory)) {
    console.error(`Missing expected ${lane} test directory: ${directory}`);
    process.exit(1);
  }
  const files = findTestFiles(directory);
  if (!files.length) {
    console.error(`Refusing to pass ${lane} with zero native Node test files.`);
    process.exit(1);
  }
  console.log(`CI lane ${lane}: executing ${files.length} native Node test file(s)`);
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT; // A nested invocation must run, not silently inherit its parent's test context.
  const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit', env });
  if (result.error || result.status !== 0) {
    console.error(`${lane} failed; this is not a browser, iPhone, or creator approval.`);
    process.exit(result.status || 1);
  }
}
