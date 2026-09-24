"use server";

import { contactSection } from "@/data/content";
import {
  CONTACT_FIELDS,
  validateContact,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 10_000;

/** Sends the contact form through Web3Forms. The access key never leaves the server. */
export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots fill every field. Pretend it worked and send nothing.
  const botcheck = formData.get("botcheck");
  if (typeof botcheck === "string" && botcheck !== "") return { status: "success" };

  const values = Object.fromEntries(
    CONTACT_FIELDS.map((f) => {
      const v = formData.get(f);
      return [f, typeof v === "string" ? v.trim() : ""];
    }),
  ) as ContactValues;

  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    console.error("[contact] WEB3FORMS_KEY is not set");
    return { status: "error" };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: contactSection.fromName,
        botcheck: false,
        ...values,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !data?.success) {
      console.error("[contact] Web3Forms rejected the submission", res.status);
      return { status: "error" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contact] Web3Forms request failed", err);
    return { status: "error" };
  }
}
