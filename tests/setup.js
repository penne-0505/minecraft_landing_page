import { Buffer } from "buffer";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

if (typeof globalThis.btoa === "undefined") {
  globalThis.btoa = (value) => Buffer.from(value, "binary").toString("base64");
}

if (typeof globalThis.atob === "undefined") {
  globalThis.atob = (value) => Buffer.from(value, "base64").toString("binary");
}
