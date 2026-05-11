import crypto from "node:crypto";

const VERIFY_BASE_URL = "https://api.verify.mn";

export function requireVerifyApiKey(env = process.env) {
  const apiKey = env.VERIFY_MN_API_KEY;
  if (!apiKey) {
    throw new Error("VERIFY_MN_API_KEY is not configured.");
  }
  return apiKey;
}

export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!/^\d{8,16}$/.test(digits)) {
    throw new Error("Phone must contain 8-16 digits.");
  }
  return digits;
}

export function createSmsCode() {
  return String(crypto.randomInt(100000, 1000000));
}

export function createRequestId() {
  return crypto.randomUUID();
}

export function callbackUrlForRequest(req, requestId, env = process.env) {
  const configured = env.VERIFY_MN_CALLBACK_URL;
  const base = configured || `https://${req.headers.host}/api/verify-callback`;
  const url = new URL(base);
  url.searchParams.set("requestId", requestId);
  return url.toString();
}

export async function createVerifySession({ phone, requestId, fetchImpl = fetch, req, env = process.env }) {
  const apiKey = requireVerifyApiKey(env);
  const normalizedPhone = normalizePhone(phone);
  const text = createSmsCode();
  const callback = callbackUrlForRequest(req, requestId, env);

  const response = await fetchImpl(`${VERIFY_BASE_URL}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: normalizedPhone,
      text,
      callback
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || `verify.mn session failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return {
    ...data,
    phone: normalizedPhone,
    text
  };
}

export async function fetchVerifyStatus(sessionId, fetchImpl = fetch) {
  const response = await fetchImpl(`${VERIFY_BASE_URL}/sessions/${encodeURIComponent(sessionId)}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || `verify.mn status failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function pollVerifySession({ sessionId, expiresAt, fetchImpl = fetch, intervalMs = 3000 }) {
  const expires = new Date(expiresAt).getTime();
  while (Date.now() < expires) {
    const status = await fetchVerifyStatus(sessionId, fetchImpl);
    if (status.sessionStatus === "VERIFIED") {
      return true;
    }
    if (status.sessionStatus === "EXPIRED") {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}
