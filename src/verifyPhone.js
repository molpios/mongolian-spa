const pollDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function startPhoneVerification(phone) {
  const response = await fetch("/api/verify-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Phone verification failed with status ${response.status}.`);
  }
  return data;
}

export async function checkPhoneVerification(requestId, sessionId) {
  const params = new URLSearchParams({ requestId });
  if (sessionId) {
    params.set("sessionId", sessionId);
  }
  const response = await fetch(`/api/verify-status?${params.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Phone verification status failed with status ${response.status}.`);
  }
  return data;
}

export async function verifyPhone(phone, options = {}) {
  const session = await startPhoneVerification(phone);
  options.onSession?.(session);

  const expiresAt = new Date(session.expiresAt).getTime();
  while (Date.now() < expiresAt) {
    if (options.signal?.aborted) {
      return false;
    }
    const status = await checkPhoneVerification(session.requestId, session.sessionId);
    options.onStatus?.(status);
    if (status.sessionStatus === "VERIFIED") {
      return true;
    }
    if (status.sessionStatus === "EXPIRED") {
      return false;
    }
    await pollDelay(options.intervalMs || 3000);
  }

  return false;
}
