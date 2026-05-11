import { createRequestId, createVerifySession, normalizePhone } from "./verify-core.js";
import { saveVerification } from "./verify-store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const phone = normalizePhone(req.body?.phone);
    const requestId = createRequestId();
    const session = await createVerifySession({ phone, requestId, req });
    saveVerification({
      requestId,
      sessionId: session.sessionId,
      phone,
      userId: phone,
      sessionStatus: "PENDING",
      callbackStatus: "PENDING",
      expiresAt: session.expiresAt,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({
      requestId,
      sessionId: session.sessionId,
      phone: session.phone,
      shortcode: session.shortcode,
      smsUri: session.smsUri,
      displayInstruction: session.displayInstruction,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
