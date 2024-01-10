export function SocketEvent(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        const [socket, ...otherArgs] = args;
        socket.on(eventName, (...eventArgs: any[]) => originalMethod.apply(this, [...eventArgs, ...otherArgs]));
      };
    };
  }
  