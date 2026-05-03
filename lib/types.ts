export type WeddingDetails = {
  partner1: string;
  partner2: string;
  date: string; // ISO yyyy-mm-dd
  guest: string;
};

export type AnswerValue = {
  /** For "choice" questions, the picked option label. For yes/no, "Yes" or "No". For text, the typed value. */
  value: string;
  /** When the user picks "Other" on a choice question, the free-text fallback. */
  other?: string;
};

export type Answers = Record<string, AnswerValue>;

export type Marks = Record<string, boolean>;

export function resolvedAnswer(a: AnswerValue | undefined, fallback: string): string {
  if (!a) return fallback;
  if (a.value === "Other") {
    const o = (a.other || "").trim();
    return o || fallback;
  }
  return (a.value || "").trim() || fallback;
}

export function formatWeddingDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
