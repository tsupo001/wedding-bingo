import type { Question } from "./questions";
import type { Answers, Marks, WeddingDetails } from "./types";

export type Step = "landing" | "details" | "predictions" | "preview" | "play";

export type StoredState = {
  v: 2;
  step: Step;
  details: WeddingDetails;
  questions: Question[];
  answers: Answers;
  marks: Marks;
};

const KEY = "wedding-bingo:v2";

export function loadState(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 2) return null;
    return parsed as StoredState;
  } catch {
    return null;
  }
}

export function saveState(state: StoredState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // out of quota or denied — ignore, user just loses persistence
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
