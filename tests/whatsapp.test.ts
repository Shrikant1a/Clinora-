import { describe, it, expect } from "vitest";
import { verifyWebhookSignature } from "../src/lib/whatsapp";
import crypto from "crypto";

describe("WhatsApp Webhook Signature Verification", () => {
  const secret = "test_meta_webhook_secret_key";
  process.env.WHATSAPP_WEBHOOK_SECRET = secret;

  it("validates authentic HMAC SHA256 signatures", () => {
    const payload = JSON.stringify({ event: "message_received", from: "919820012345" });
    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const signatureHeader = `sha256=${hmac}`;

    const isValid = verifyWebhookSignature(payload, signatureHeader);
    expect(isValid).toBe(true);
  });

  it("rejects tampered or forged payloads", () => {
    const payload = JSON.stringify({ event: "message_received", from: "919820012345" });
    const forgedHeader = "sha256=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

    const isValid = verifyWebhookSignature(payload, forgedHeader);
    expect(isValid).toBe(false);
  });
});
