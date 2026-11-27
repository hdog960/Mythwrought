import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const operations = ['continue', 'plan', 'evidence', 'runs', 'compatibility', 'blocker', 'release', 'registry'];
const operation = process.env.KIT_OPERATION || 'continue';
if (!operations.includes(operation)) throw new Error('Unknown report operation.');
const args = [fileURLToPath(new URL('./dev.mjs', import.meta.url)), operation];
for (const option of ['owner', 'branch', 'pr', 'base', 'head', 'gate', 'run', 'publication']) {
  const value = process.env[`KIT_${option.toUpperCase()}`];
  if (value) args.push(`--${option}`, value);
}
const checkpoint = process.env.KIT_CHECKPOINT;
let scratch;
try {
  if (checkpoint) {
    if (Buffer.byteLength(checkpoint) > 8192) throw new Error('Checkpoint exceeds 8 KiB.');
    scratch = mkdtempSync(join(tmpdir(), 'mythwrought-devkit-'));
    const checkpointPath = join(scratch, 'checkpoint.json');
    writeFileSync(checkpointPath, checkpoint, { flag: 'wx' });
    args.push('--checkpoint', checkpointPath);
  }
  const outcome = spawnSync(process.execPath, args, { stdio: 'inherit', timeout: 150_000 });
  if (outcome.error) throw outcome.error;
  process.exitCode = outcome.status ?? 1;
} finally {
  if (scratch) {
    rmSync(join(scratch, 'checkpoint.json'), { force: true });
    rmdirSync(scratch);
  }
}
