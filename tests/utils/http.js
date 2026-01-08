import { Headers, Request, Response } from "node-fetch";

export function createRequest({
  url = "https://example.com",
  method = "GET",
  headers = {},
  body,
  json,
} = {}) {
  const init = { method, headers: new Headers(headers) };

  if (json !== undefined) {
    init.body = JSON.stringify(json);
    init.headers.set("Content-Type", "application/json");
  } else if (body !== undefined) {
    init.body = body;
  }

  return new Request(url, init);
}

export function createJsonResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function createTextResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(body, { status, headers });
}

export function createContext({ request, env, next } = {}) {
  return {
    request,
    env,
    next: next || (() => Promise.resolve(new Response("next"))),
  };
}

export async function readJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function readText(response) {
  return response.text();
}
