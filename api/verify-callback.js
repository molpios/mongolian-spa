import { fetchVerifyStatus } from "./verify-core.js";
import { getVerificationByRequestId, markVerification } from "./verify-store.js";

async function refreshStatus(record) {
  const status = await fetchVerifyStatus(record.sessionId);
  markVerification(record, {
    sessionStatus: status.sessionStatus,
    callbackStatus: status.callbackStatus,
    verifiedAt: status.verifiedAt
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const record = getVerificationByRequestId(req.query?.requestId);
  if (record) {
    refreshStatus(record).catch(() => {});
  }

  res.status(200).json({ ok: true });
}
