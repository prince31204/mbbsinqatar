import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const nextDir = join(process.cwd(), '.next');

async function clean() {
  if (existsSync(nextDir)) {
    try {
      await rm(nextDir, { recursive: true, force: true });
      console.log('[prebuild] Cleaned .next directory');
    } catch (err) {
      console.error('[prebuild] Failed to clean .next directory:', err);
    }
  } else {
    // console.log('[prebuild] .next directory not found, skipping clean');
  }
}

clean();
