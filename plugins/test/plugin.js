
export class TestPlugin {
    install() {
        console.log('TestPlugin::install');
    }

    uninstall() {
        console.log('TestPlugin::uninstall');
    }

    activate() {
        console.log('TestPlugin::activate');
    }

    deactivate() {
        console.log('TestPlugin::deactivate');
    }
}
