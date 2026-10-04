// Types for require(). The UMD build sets module.exports to the plugin itself.
import type plugin from '../lib/types/index.js' with { 'resolution-mode': 'import' };

declare const cryptotron: typeof plugin;
export = cryptotron;
