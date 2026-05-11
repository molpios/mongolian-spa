import { fetchVerifyStatus } from "./verify-core.js";
import { getVerificationByRequestId, markVerification } from "./verify-store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const requestId = req.query?.requestId;
  const sessionId = req.query?.sessionId;
  const record = getVerificationByRequestId(requestId);
  if (!record && !sessionId) {
    res.status(404).json({ error: "Verification session not found." });
    return;
  }

  try {
    const status = await fetchVerifyStatus(record?.sessionId || sessionId);
    const expiresAt = status.expiresAt || record?.expiresAt;
    const sessionStatus = new Date(expiresAt).getTime() <= Date.now() && status.sessionStatus !== "VERIFIED"
      ? "EXPIRED"
      : status.sessionStatus;
    if (record) {
      markVerification(record, {
        sessionStatus,
        callbackStatus: status.callbackStatus,
        verifiedAt: status.verifiedAt
      });
    }

    res.status(200).json({
      requestId,
      sessionId: record?.sessionId || sessionId,
      phone: record?.phone || status.phone,
      sessionStatus,
      callbackStatus: status.callbackStatus,
      verifiedAt: status.verifiedAt,
      expiresAt,
      verified: sessionStatus === "VERIFIED"
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
