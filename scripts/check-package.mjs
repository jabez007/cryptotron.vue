// Packs the package, installs the tarball into a throwaway project, and checks
// what CommonJS and ESM consumers get from it: at runtime through require() and
// import, and at compile time through tsc under node16, nodenext, and bundler.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { name, peerDependencies } = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const tscPath = join(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc');

// The package's one export is a Vue plugin. Installing it adds the CryptoTron
// routes to the router it's given. require() gets the plugin itself, the same
// object the UMD build puts on window.CryptoTronApp.
const pluginCheck = (how) => `
const how = ${JSON.stringify(how)};
if (typeof plugin?.install !== 'function') throw new Error(how + ': install is missing');
if (typeof plugin.app !== 'function') throw new Error(how + ': app is missing');
const router = createRouter({ history: createMemoryHistory(), routes: [] });
plugin.install(null, { router });
if (router.getRoutes().length === 0) throw new Error(how + ': install added no routes');
`;
const requireCheck = `
const { createRouter, createMemoryHistory } = require('vue-router');
const plugin = require('${name}');
${pluginCheck('require')}
require.resolve('${name}/style.css');
`;
const importCheck = `
import { createRouter, createMemoryHistory } from 'vue-router';
const api = await import('${name}');
if (Object.keys(api).join() !== 'default') throw new Error('import: exports are ' + Object.keys(api).join());
const plugin = api.default;
${pluginCheck('import')}
`;
// vue-router ships only ESM types, which node16 CommonJS code can't import, so
// the fixture takes the router type from the plugin's install signature
const typeFixture = `
import { createApp } from 'vue';
import cryptotron from '${name}';
type Options = Parameters<typeof cryptotron.install>[1];
declare const router: Options['router'];
createApp({}).use(cryptotron, { router, parentRouteName: 'tools' });
`;
// The peer dependencies a Vue app already has, at the versions the package supports
const consumerTypes = Object.entries(peerDependencies).map(([peer, range]) => `${peer}@${range}`);
// [config name, fixture file, module, moduleResolution, declaration tsc must pick]
const typeChecks = [
  ['node16', 'node16.cts', 'Node16', 'Node16', 'types/index.d.cts'],
  ['nodenext', 'nodenext.mts', 'NodeNext', 'NodeNext', 'lib/types/index.d.ts'],
  ['bundler', 'bundler.ts', 'ESNext', 'Bundler', 'lib/types/index.d.ts'],
];

const temporaryRoot = await mkdtemp(join(tmpdir(), 'check-package-'));
const run = (command, args, cwd, capture = false) => execFileSync(command, args, {
  cwd,
  encoding: capture ? 'utf8' : undefined,
  stdio: capture ? 'pipe' : 'inherit',
});
// On Windows npm is a .cmd launcher, which execFileSync can't start. npm run
// sets npm_execpath to npm's own script, which node can run anywhere.
const npm = (args, cwd) => (process.env.npm_execpath
  ? run(process.execPath, [process.env.npm_execpath, ...args], cwd)
  : run('npm', args, cwd));

try {
  let tarballPath = process.argv[2] ? resolve(process.argv[2]) : null;
  if (!tarballPath) {
    const packDirectory = join(temporaryRoot, 'package');
    await mkdir(packDirectory);
    npm(['pack', '--pack-destination', packDirectory], projectRoot);
    const tarballs = (await readdir(packDirectory)).filter((file) => file.endsWith('.tgz'));
    if (tarballs.length !== 1) throw new Error(`Expected one tarball, found ${tarballs.length}.`);
    tarballPath = join(packDirectory, tarballs[0]);
  }

  const consumerRoot = join(temporaryRoot, 'consumer');
  await mkdir(consumerRoot);
  await writeFile(join(consumerRoot, 'package.json'), JSON.stringify({ private: true }, null, 2));
  npm([
    'install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', tarballPath,
    ...consumerTypes,
  ], consumerRoot);

  run(process.execPath, ['--input-type=commonjs', '--eval', requireCheck], consumerRoot);
  run(process.execPath, ['--input-type=module', '--eval', importCheck], consumerRoot);

  for (const [config, source, module, moduleResolution, expected] of typeChecks) {
    await writeFile(join(consumerRoot, source), typeFixture);
    const configPath = join(consumerRoot, `tsconfig.${config}.json`);
    await writeFile(configPath, JSON.stringify({
      compilerOptions: { target: 'ES2022', module, moduleResolution, strict: true, noEmit: true },
      files: [source],
    }, null, 2));
    run(process.execPath, [tscPath, '-p', configPath], consumerRoot);
    const trace = run(process.execPath, [tscPath, '-p', configPath, '--traceResolution'], consumerRoot, true);
    const resolved = trace.match(new RegExp(`Module name '${name}' was successfully resolved to '([^']+)'`));
    if (!resolved?.[1].endsWith(`/${expected}`)) {
      throw new Error(`${config} resolved ${resolved?.[1] ?? 'nothing'}, expected ${expected}.`);
    }
  }

  console.log(`${name}: require, import, and types verified for node16, nodenext, and bundler`);
} finally {
  if (process.env.KEEP_PACKAGE_TEST_TEMP) {
    console.log(`Package test files kept at ${temporaryRoot}`);
  } else {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
}
