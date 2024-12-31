"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodBinder = void 0;
class MethodBinder {
    static bind(controller) {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller));
        methods.forEach((method) => {
            if (method !== 'constructor' &&
                typeof controller[method] === 'function') {
                controller[method] = controller[method].bind(controller);
            }
        });
    }
}
exports.MethodBinder = MethodBinder;
