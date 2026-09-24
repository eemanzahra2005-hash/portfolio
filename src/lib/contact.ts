import { contactSection } from "@/data/content";

export const CONTACT_FIELDS = ["name", "email", "subject", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactState {
  status: "idle" | "success" | "error";
  /** Server-side validation errors, keyed by field. */
  fieldErrors?: ContactErrors;
}

const RULES: Record<ContactField, { min: number; max: number }> = {
  name: { min: 1, max: 100 },
  email: { min: 1, max: 200 },
  subject: { min: 1, max: 150 },
  message: { min: 10, max: 5000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim();
  const label = contactSection.form.fields[field];
  const { errors } = contactSection.form;
  const { min, max } = RULES[field];

  if (!value) return errors.required(label);
  if (value.length < min) return errors.tooShort(label, min);
  if (value.length > max) return errors.tooLong(label, max);
  if (field === "email" && !EMAIL_RE.test(value)) return errors.email;
  return undefined;
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function contactMaxLength(field: ContactField) {
  return RULES[field].max;
}
