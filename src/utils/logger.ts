// VayuShield Central Logger Utility
// Encapsulates all console logging behind structured methods

const isProduction = import.meta.env.PROD;

export const logger = {
  info(message: string, ...args: unknown[]): void {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.info(`[VayuShield] ${message}`, ...args);
    }
  },
  warn(message: string, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.warn(`[VayuShield] ${message}`, ...args);
  },
  error(message: string, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.error(`[VayuShield] ${message}`, ...args);
  },
};
