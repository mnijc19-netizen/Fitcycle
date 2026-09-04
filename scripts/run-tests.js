import fs from 'fs';
import { spawnSync } from 'child_process';

const realCwd = fs.realpathSync('.');
process.chdir(realCwd);

const args = process.argv.slice(2);
const vitestCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const res = spawnSync(vitestCmd, ['vitest', 'run', ...args], {
  stdio: 'inherit',
  shell: true,
});
process.exit(res.status ?? 0);
