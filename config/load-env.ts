import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const root = path.resolve(__dirname, '..');

function loadIfExists(relativePath: string): void {
  const full = path.join(root, relativePath);
  if (fs.existsSync(full)) dotenv.config({ path: full });
}

/** `.env` then `.env.local` (local overrides — both gitignored). */
loadIfExists('.env');
loadIfExists('.env.local');
