import crypto from "crypto";

export const verifyPaymobHMAC = ( rawBody: Buffer | string | undefined,receivedHmac: string,secret: string): boolean => {
  
	if (!rawBody) return false; // تأمين في حالة مفيش body

  const bodyBuffer = typeof rawBody === "string" ? Buffer.from(rawBody) : rawBody;

  const generatedHmac = crypto
    .createHmac("sha512", secret)
    .update(bodyBuffer)
    .digest("hex");

  return generatedHmac === receivedHmac;
};