
function freezeVulnerablePrototypes() {
    const vulnerablePrototypes = [
        Object, Object.prototype,
        Function, Function.prototype,
        Array, Array.prototype,
        String, String.prototype,
        Number, Number.prototype,
        Boolean, Boolean.prototype
    ];

    vulnerablePrototypes.forEach(Object.freeze);
}

function addFunctionWarning(funcName) {
    const oldFunc = globalThis[funcName]
    globalThis[funcName] = function(...args) {
        console.warn(`Using high-risk function '${funcName}'!`);
        oldFunc(...args);
    }
}

export function init() {
    freezeVulnerablePrototypes();
    addFunctionWarning('eval');
}
