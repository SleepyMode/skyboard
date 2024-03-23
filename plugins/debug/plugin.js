
export class DebugPlugin {
    onLoad() {
        console.log('DebugPlugin::onLoad');
    }

    onUnload() {
        console.log('DebugPlugin::deactivate');
    }
}
