import crypto from "crypto";

export interface IWhatsAppAdapter {
  isMock(): boolean;
  sendTextMessage(to: string, message: string): Promise<boolean>;
  sendInteractiveButtons(to: string, header: string, body: string, buttons: Array<{ id: string; title: string }>): Promise<boolean>;
  sendTemplateMessage(to: string, templateName: string, languageCode: string, components: any[]): Promise<boolean>;
}

export class MockWhatsAppAdapter implements IWhatsAppAdapter {
  isMock(): boolean {
    return true;
  }

  async sendTextMessage(to: string, message: string): Promise<boolean> {
    console.log(`[WhatsApp Mock to ${to}]: ${message}`);
    return true;
  }

  async sendInteractiveButtons(
    to: string,
    header: string,
    body: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    console.log(`[WhatsApp Interactive to ${to}] Header: ${header} | Body: ${body} | Buttons:`, buttons);
    return true;
  }

  async sendTemplateMessage(to: string, templateName: string, languageCode: string, components: any[]): Promise<boolean> {
    console.log(`[WhatsApp Template to ${to}] Template: ${templateName} (${languageCode})`, components);
    return true;
  }
}

export class MetaCloudWhatsAppAdapter implements IWhatsAppAdapter {
  private token: string;
  private phoneNumberId: string;

  constructor() {
    this.token = process.env.WHATSAPP_API_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  isMock(): boolean {
    return false;
  }

  async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.token || !this.phoneNumberId) return false;
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""),
          type: "text",
          text: { preview_url: false, body: message },
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("[WhatsApp Cloud API Error]:", err);
      return false;
    }
  }

  async sendInteractiveButtons(
    to: string,
    header: string,
    body: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    if (!this.token || !this.phoneNumberId) return false;
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""),
          type: "interactive",
          interactive: {
            type: "button",
            header: header ? { type: "text", text: header } : undefined,
            body: { text: body },
            action: {
              buttons: buttons.map((b) => ({
                type: "reply",
                reply: { id: b.id, title: b.title.slice(0, 20) },
              })),
            },
          },
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("[WhatsApp Cloud API Error]:", err);
      return false;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, languageCode: string, components: any[]): Promise<boolean> {
    if (!this.token || !this.phoneNumberId) return false;
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/[^0-9]/g, ""),
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("[WhatsApp Template Error]:", err);
      return false;
    }
  }
}

export function verifyWebhookSignature(rawBody: string, signatureHeader?: string): boolean {
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!secret) return true; // dev bypass if secret is not set
  if (!signatureHeader) return false;

  const [algo, signature] = signatureHeader.split("=");
  if (algo !== "sha256" || !signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export function getWhatsAppAdapter(): IWhatsAppAdapter {
  if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return new MetaCloudWhatsAppAdapter();
  }
  return new MockWhatsAppAdapter();
}
