import { submitEnquiry } from '@/lib/submitEnquiry.functions';

export interface EnquiryPayload {
  name: string;
  email?: string | undefined;
  phone?: string | undefined;
  message?: string | undefined;
  property_id?: string | undefined;
  package_id?: string | undefined;
}

/**
 * Fire-and-forget lead logging. Never blocks or breaks the WhatsApp hand-off —
 * failures are logged to the console only.
 */
export async function logEnquiry(payload: EnquiryPayload): Promise<void> {
  try {
    await submitEnquiry({
      data: {
        name: payload.name,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        message: payload.message ?? null,
        property_id: payload.property_id ?? null,
        package_id: payload.package_id ?? null,
      },
    });
  } catch (err) {
    console.error('logEnquiry failed:', err);
  }
}
