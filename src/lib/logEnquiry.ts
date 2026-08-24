import { supabase } from '@/integrations/supabase/client';

export interface EnquiryPayload {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  property_id?: string;
  package_id?: string;
}

/**
 * Fire-and-forget lead logging. Never blocks or breaks the WhatsApp hand-off —
 * failures are logged to the console only.
 */
export async function logEnquiry(payload: EnquiryPayload): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('submit-enquiry', { body: payload });
    if (error) console.error('logEnquiry failed:', error);
  } catch (err) {
    console.error('logEnquiry failed:', err);
  }
}
