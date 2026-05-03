"use client";

import { useState } from "react";
import type { WeddingDetails } from "@/lib/types";

type Props = {
  initial: WeddingDetails;
  onBack: () => void;
  onNext: (d: WeddingDetails) => void;
};

export function WeddingDetailsForm({ initial, onBack, onNext }: Props) {
  const [partner1, setPartner1] = useState(initial.partner1);
  const [partner2, setPartner2] = useState(initial.partner2);
  const [date, setDate] = useState(initial.date);
  const [guest, setGuest] = useState(initial.guest);
  const [showErrors, setShowErrors] = useState(false);

  const valid = partner1.trim() && partner2.trim() && date;

  const submit = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    onNext({
      partner1: partner1.trim(),
      partner2: partner2.trim(),
      date,
      guest: guest.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <Header step={1} title="Wedding details" />
      <div className="mt-8 space-y-5">
        <Field
          label="Bride's name"
          required
          error={showErrors && !partner1.trim() ? "Required" : undefined}
        >
          <input
            value={partner1}
            onChange={(e) => setPartner1(e.target.value)}
            placeholder="e.g. Sarah"
            className="input"
            autoComplete="off"
          />
        </Field>
        <Field
          label="Groom's name"
          required
          error={showErrors && !partner2.trim() ? "Required" : undefined}
        >
          <input
            value={partner2}
            onChange={(e) => setPartner2(e.target.value)}
            placeholder="e.g. Alex"
            className="input"
            autoComplete="off"
          />
        </Field>
        <Field
          label="Wedding date"
          required
          error={showErrors && !date ? "Required" : undefined}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Your name" hint="Optional — appears on the card">
          <input
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            placeholder="e.g. Tod"
            className="input"
            autoComplete="off"
          />
        </Field>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost">
          Back
        </button>
        <button onClick={submit} className="btn-primary">
          Continue
        </button>
      </div>

      <FormStyles />
    </div>
  );
}

function Header({ step, title }: { step: number; title: string }) {
  return (
    <div>
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold">
        Step {step} of 3
      </p>
      <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{title}</h2>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-gold"> *</span>}
        </span>
        {hint && <span className="text-xs text-ink/50">{hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function FormStyles() {
  return (
    <style jsx global>{`
      .input {
        width: 100%;
        border: 1px solid rgba(42, 38, 34, 0.18);
        background: #fffdf9;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 16px;
        color: #2a2622;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .input:focus {
        border-color: #b89868;
        box-shadow: 0 0 0 3px rgba(184, 152, 104, 0.18);
      }
      .btn-primary {
        background: #2a2622;
        color: #faf6ef;
        border-radius: 999px;
        padding: 10px 28px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 17px;
        transition: background 0.15s, transform 0.05s;
      }
      .btn-primary:hover { background: #3a342f; }
      .btn-primary:active { transform: scale(0.98); }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .btn-ghost {
        color: #2a2622;
        opacity: 0.7;
        padding: 10px 16px;
        font-size: 15px;
      }
      .btn-ghost:hover { opacity: 1; }
    `}</style>
  );
}
