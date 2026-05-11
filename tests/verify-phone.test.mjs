import test from "node:test";
import assert from "node:assert/strict";
import { createVerifySession, pollVerifySession } from "../api/verify-core.js";

test("verify.mn polling returns true when PENDING becomes VERIFIED", async () => {
  const statuses = ["PENDING", "VERIFIED"];
  const result = await pollVerifySession({
    sessionId: "s1",
    expiresAt: new Date(Date.now() + 10000).toISOString(),
    intervalMs: 1,
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ sessionStatus: statuses.shift(), callbackStatus: "SENT" })
    })
  });

  assert.equal(result, true);
});

test("verify.mn polling returns false after EXPIRED", async () => {
  const result = await pollVerifySession({
    sessionId: "s2",
    expiresAt: new Date(Date.now() + 10000).toISOString(),
    intervalMs: 1,
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ sessionStatus: "EXPIRED", callbackStatus: "SENT" })
    })
  });

  assert.equal(result, false);
});

test("verify.mn session creation surfaces 401 bad key", async () => {
  await assert.rejects(
    () => createVerifySession({
      phone: "95238118",
      requestId: "r1",
      req: { headers: { host: "mongolian-spa.vercel.app" } },
      env: { VERIFY_MN_API_KEY: "bad" },
      fetchImpl: async () => ({
        ok: false,
        status: 401,
        json: async () => ({ error: "bad key" })
      })
    }),
    /bad key/
  );
});
