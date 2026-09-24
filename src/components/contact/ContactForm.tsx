"use client";

import clsx from "clsx";
import { ArrowRight, Check, CircleAlert, CircleCheck, LoaderCircle, RotateCw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  startTransition,
  useActionState,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { sendContact } from "@/app/actions/contact";
import { EASE } from "@/components/motion/SmoothScroll";
import { contactSection, profile } from "@/data/content";
import {
  CONTACT_FIELDS,
  contactMaxLength,
  validateContact,
  validateField,
  type ContactField,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";

const { form: copy } = contactSection;
const INITIAL: ContactState = { status: "idle" };
const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };

const FIELD_META: Record<ContactField, { type?: string; autoComplete: string; multiline?: boolean }> = {
  name: { autoComplete: "name" },
  email: { type: "email", autoComplete: "email" },
  subject: { autoComplete: "off" },
  message: { autoComplete: "off", multiline: true },
};

type ButtonState = "idle" | "pending" | "success" | "error";

export function ContactForm() {
  const reduce = useReducedMotion() ?? false;
  const [state, formAction, pending] = useActionState(sendContact, INITIAL);
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  // Server result is shown until the user edits the form again.
  const [showResult, setShowResult] = useState(false);
  const [lastState, setLastState] = useState(state);

  // React to a new action result during render (no effect needed).
  if (state !== lastState) {
    setLastState(state);
    setShowResult(true);
    if (state.status === "success") {
      setValues(EMPTY);
      setTouched({});
    }
  }

  const clientErrors = validateContact(values);
  const serverErrors = showResult ? state.fieldErrors : undefined;
  const errorFor = (f: ContactField) =>
    (touched[f] ? clientErrors[f] : undefined) ?? serverErrors?.[f];

  const buttonState: ButtonState = pending
    ? "pending"
    : showResult && state.status !== "idle" && !state.fieldErrors
      ? state.status
      : "idle";

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as ContactField;
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setShowResult(false);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as ContactField;
    // Don't nag about empty fields the user merely tabbed through.
    if (e.target.value.trim() || touched[field]) setTouched((t) => ({ ...t, [field]: true }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = CONTACT_FIELDS.find((f) => validateField(f, values[f]));
    if (firstInvalid) {
      const el = form.elements.namedItem(firstInvalid);
      if (el instanceof HTMLElement) el.focus();
      return;
    }
    const data = new FormData(form);
    startTransition(() => formAction(data));
  };

  const fade = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: reduce ? { duration: 0 } : { duration: 0.3, ease: EASE },
  };

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-label={copy.label}
      className="relative rounded-3xl border border-border bg-surface p-5 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map((field) => {
          const meta = FIELD_META[field];
          const error = errorFor(field);
          const id = `contact-${field}`;
          const errorId = `${id}-error`;
          const inputProps = {
            id,
            name: field,
            value: values[field],
            onChange,
            onBlur,
            required: true,
            placeholder: " ",
            autoComplete: meta.autoComplete,
            maxLength: contactMaxLength(field),
            readOnly: pending,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? errorId : undefined,
            className: clsx(
              "peer block w-full resize-none rounded-xl border bg-surface px-4 pt-6 pb-2 text-base text-foreground",
              "transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus:ring-4",
              error
                ? "border-red-600 focus:ring-red-600/15"
                : "border-border hover:border-muted/50 focus:border-accent focus:ring-accent/15",
            ),
          };

          return (
            <div
              key={field}
              className={clsx(field === "subject" || meta.multiline ? "sm:col-span-2" : undefined)}
            >
              <div className="relative">
                {meta.multiline ? (
                  <textarea rows={5} {...inputProps} />
                ) : (
                  <input type={meta.type ?? "text"} {...inputProps} />
                )}
                <label
                  htmlFor={id}
                  className={clsx(
                    "pointer-events-none absolute top-4 left-4 origin-left text-base leading-6 transition-transform duration-300 ease-out-soft motion-reduce:transition-none",
                    "peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75",
                    error ? "text-red-700" : "text-muted peer-focus:text-accent",
                  )}
                >
                  {copy.fields[field]}
                </label>
              </div>
              <AnimatePresence initial={false}>
                {error && (
                  <motion.p
                    key={error}
                    id={errorId}
                    {...fade}
                    className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700"
                  >
                    <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-botcheck">{copy.honeypot}</label>
        <input id="contact-botcheck" type="text" name="botcheck" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-6">
        <SubmitButton state={buttonState} reduce={reduce} />
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" className="mt-4">
        <AnimatePresence initial={false}>
          {buttonState === "success" && (
            <ResultCard key="success" reduce={reduce} tone="success">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">{copy.successTitle}</p>
                <p className="mt-0.5 text-sm text-muted">{copy.successBody}</p>
              </div>
            </ResultCard>
          )}
          {buttonState === "error" && (
            <ResultCard key="error" reduce={reduce} tone="error">
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-700" aria-hidden="true" />
              <p className="text-sm text-foreground">
                {copy.errorText}{" "}
                <a
                  href={`mailto:${profile.email}`}
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {copy.errorLink}
                </a>
              </p>
            </ResultCard>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

const BUTTON_CONTENT: Record<ButtonState, { label: string; Icon: typeof ArrowRight }> = {
  idle: { label: copy.submit, Icon: ArrowRight },
  pending: { label: copy.pending, Icon: LoaderCircle },
  success: { label: copy.success, Icon: Check },
  error: { label: copy.retry, Icon: RotateCw },
};

function SubmitButton({ state, reduce }: { state: ButtonState; reduce: boolean }) {
  const { label, Icon } = BUTTON_CONTENT[state];
  return (
    <button
      type="submit"
      disabled={state === "pending"}
      className={clsx(
        "group inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-medium text-surface transition-colors duration-300 sm:w-auto sm:min-w-48",
        state === "success" ? "bg-accent" : "bg-foreground hover:bg-accent",
        "disabled:cursor-wait",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          className="inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
        >
          {label}
          <Icon
            aria-hidden="true"
            className={clsx(
              "size-4",
              state === "pending" && "motion-safe:animate-spin",
              state === "idle" &&
                "transition-transform duration-300 ease-out-soft motion-safe:group-hover:translate-x-0.5",
            )}
          />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function ResultCard({
  children,
  reduce,
  tone,
}: {
  children: ReactNode;
  reduce: boolean;
  tone: "success" | "error";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      className={clsx(
        "flex items-start gap-3 rounded-2xl border p-4",
        tone === "success" ? "border-accent/25 bg-accent-soft" : "border-red-200 bg-red-50",
      )}
    >
      {children}
    </motion.div>
  );
}
