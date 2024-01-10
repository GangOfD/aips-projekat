"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = void 0;
function SocketEvent(eventName) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const [socket, ...otherArgs] = args;
            socket.on(eventName, (...eventArgs) => originalMethod.apply(this, [...eventArgs, ...otherArgs]));
        };
    };
}
exports.SocketEvent = SocketEvent;
