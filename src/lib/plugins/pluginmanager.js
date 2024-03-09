
import * as path from 'path';
import * as fs from 'fs/promises';
import YAML from 'yaml';

export class PluginManager {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new PluginManager();
        }

        return this.#instance;
    }

    plugins = {};

    // TODO: Error handling
    async loadAllPlugins() {
        const pluginsPath = path.join(globalThis.sbRoot, '/plugins');
        console.log(pluginsPath);
        const entries = await fs.readdir(pluginsPath, {
            withFileTypes: true
        });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                await this.loadPlugin(entry.name);
            }
        }
    }

    // TODO: Resolve dependencies
    async loadPlugin(uniqueId) {
        if (uniqueId in this.plugins) {
            // TODO: log?
            return;
        }

        const configPath = path.join(globalThis.sbRoot, `/plugins/${uniqueId}/plugin.yaml`);

        // TODO: Error handling
        try {
            await fs.access(configPath, fs.constants.R_OK);
            const configFile = await fs.readFile(configPath, {
                encoding: 'utf8'
            });
            const config = YAML.parse(configFile);

            const modPath = path.join('file:///', globalThis.sbRoot, `/plugins/${uniqueId}/plugin.js`);
            const pluginMod = await import(modPath);
            const mainClass = pluginMod[config['class']];
            this.plugins[uniqueId] = {
                info: config,
                instance: new mainClass()
            };
        } catch {
        }
    }
}
