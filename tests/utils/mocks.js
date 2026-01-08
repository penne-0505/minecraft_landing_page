import { vi } from "vitest";

export function mockFetchOnce(response) {
  const fn = vi.fn().mockResolvedValue(response);
  globalThis.fetch = fn;
  return fn;
}

export function mockFetchSequence(responses) {
  const fn = vi.fn();
  responses.forEach((response) => fn.mockResolvedValueOnce(response));
  globalThis.fetch = fn;
  return fn;
}

export function mockConsole() {
  const info = vi.spyOn(globalThis.console, "log").mockImplementation(() => {});
  const warn = vi.spyOn(globalThis.console, "warn").mockImplementation(() => {});
  const error = vi.spyOn(globalThis.console, "error").mockImplementation(() => {});
  return { info, warn, error };
}
