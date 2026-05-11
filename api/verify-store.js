const store = globalThis.__VERIFY_MN_STORE__ || {
  byRequestId: new Map(),
  bySessionId: new Map()
};

globalThis.__VERIFY_MN_STORE__ = store;

export function saveVerification(record) {
  store.byRequestId.set(record.requestId, record);
  if (record.sessionId) {
    store.bySessionId.set(record.sessionId, record);
  }
  return record;
}

export function getVerificationByRequestId(requestId) {
  return store.byRequestId.get(requestId);
}

export function getVerificationBySessionId(sessionId) {
  return store.bySessionId.get(sessionId);
}

export function markVerification(record, updates) {
  const next = { ...record, ...updates, updatedAt: new Date().toISOString() };
  return saveVerification(next);
}
