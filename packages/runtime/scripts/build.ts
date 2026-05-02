import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const source = path.join(packageRoot, 'src', 'index.ts');
const dist = path.join(packageRoot, 'dist');

await Promise.all([
  build({
    entryPoints: [source],
    outfile: path.join(dist, 'index.mjs'),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2018'],
    minify: false,
    sourcemap: true,
  }),
  build({
    entryPoints: [source],
    outfile: path.join(dist, 'viewcontrol.js'),
    bundle: true,
    format: 'iife',
    globalName: 'ViewControlModule',
    platform: 'browser',
    target: ['es2018'],
    minify: true,
    sourcemap: true,
    banner: {
      js: '/*! ViewControl Runtime */',
    },
  }),
]);

const tscPath = path.resolve(packageRoot, '..', '..', 'node_modules', 'typescript', 'bin', 'tsc');
const typesBuild = spawnSync(process.execPath, [tscPath, '-p', path.join(packageRoot, 'tsconfig.types.json')], {
  stdio: 'inherit',
});

if (typesBuild.status !== 0) {
  process.exit(typesBuild.status ?? 1);
}

console.log('[runtime] Built packages/runtime/dist/index.mjs, viewcontrol.js, and declarations');
