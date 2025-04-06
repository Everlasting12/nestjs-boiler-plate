import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function runSeeds() {
  const seedDir = join(__dirname, 'seed');

  const seedFiles = readdirSync(seedDir)
    .filter((file) => /^\d+.*\.mjs$/.test(file)) // match files starting with numbers
    .sort(); // ensures order like 001 -> 002 -> ...

  for (const file of seedFiles) {
    const filePath = join(seedDir, file);
    console.log(`🟡 Running seed: ${file} ${filePath}`);

    try {
      execSync(`node "${filePath}"`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`❌ Error running ${file}:`, error);
      process.exit(1);
    }
  }

  console.log('🎉 All seed files executed successfully!');
}

runSeeds();
