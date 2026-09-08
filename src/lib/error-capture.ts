let lastCapturedError: unknown = null;

if (typeof process !== "undefined") {
  process.on?.("uncaughtException", (err) => {
    lastCapturedError = err;
  });
  process.on?.("unhandledRejection", (reason) => {
    lastCapturedError = reason;
  });
}

export function consumeLastCapturedError(): unknown {
  const err = lastCapturedError;
  lastCapturedError = null;
  return err;
}
