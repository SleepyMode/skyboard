
import * as path from 'path';
import * as fs from '../filesystem.js';
import YAML from 'yaml';
import {Log} from '../log/log.js';

export class PluginManager {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new PluginManager();
        }

        return this.#instance;
    }

    plugins = {};
    log = Log.getLogger('Plugin Manager');

    // TODO: Error handling
    async loadAllPlugins() {
        const pluginsPath = path.join(globalThis.sbRoot, '/plugins');
        this.log.verbose(`Loading all plugins from path: ${pluginsPath}`);

        const entries = await fs.readDir(pluginsPath, {
            withFileTypes: true
        });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                await this.loadPlugin(entry.name);
            }
        }
    }

    // TODO: Unloading
    async loadPlugin(uniqueId) {
        if (uniqueId in this.plugins) {
            this.log.verbose(`Skipping already loaded plugin ${uniqueId}`);
            return;
        }

        this.log.info(`Loading plugin ${uniqueId}`);

        const configPath = `/plugins/${uniqueId}/plugin.yaml`;

        if (!await fs.fileExists(configPath)) {
            this.log.caution(`Failed to load plugin ${uniqueId}: plugin.yaml not found.`);
            return;
        }

        const config = YAML.parse(await fs.readFile(configPath, {
            encoding: 'utf8'
        }));

        const dependencies = config.dependencies;
        if (dependencies && typeof dependencies === 'object') {
            for (let i = 0; i < dependencies.length; ++i) {
                await this.loadPlugin(dependencies[i]);
            }
        }

        const modPath = path.join('file:///', globalThis.sbRoot, `/plugins/${uniqueId}/plugin.js`);
        const pluginMod = await import(modPath);
        const mainClass = pluginMod[config['class']];
        this.plugins[uniqueId] = {
            info: config,
            instance: new mainClass()
        };

        this.plugins[uniqueId].instance.onLoad();
    }
}
