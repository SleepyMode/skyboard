
export class TestPlugin {
    onLoad() {
        console.log('TestPlugin::onLoad');
    }

    onUnload() {
        console.log('TestPlugin::deactivate');
    }
}
