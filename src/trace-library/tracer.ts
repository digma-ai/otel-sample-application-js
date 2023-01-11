import opentelemetry from "@opentelemetry/api";

export const userServiceTracer = opentelemetry.trace.getTracer("UserService");
export const globalTracer = opentelemetry.trace.getTracer("UserService");

export async function wrappedStartSpan(spanName: string, func: Function) {
  await globalTracer.startActiveSpan(spanName, async (span) => {
    func();
    span.end();
  });
};

export function wrapMethodWithActiveSpan<R, Fn extends (...args: any []) => Promise<R> | R>(fn: Fn, customName?: string) {
    const spanName = customName || fn.name;
    return function wrapped(...args: any[]) {
      return globalTracer.startActiveSpan(spanName, async (span) => {
        try {
          return fn(...args);
        }
        finally {
          span.end();
        }
      });
    };
}
