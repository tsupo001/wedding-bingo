"use client";

import { useMemo, useState } from "react";
import {
  GRID_SIZE,
  QUESTIONS,
  SECTION_ORDER,
  SECTION_TITLES,
  fill,
  newCustomQuestion,
  type Question,
  type QuestionSection,
} from "@/lib/questions";
import type { Answers, WeddingDetails } from "@/lib/types";

type Props = {
  details: WeddingDetails;
  questions: Question[];
  setQuestions: (q: Question[]) => void;
  initial: Answers;
  onBack: () => void;
  onNext: (a: Answers) => void;
};

const TEXT_LIMIT = 30;
const PROMPT_LIMIT = 80;

export function PredictionsForm({
  details,
  questions,
  setQuestions,
  initial,
  onBack,
  onNext,
}: Props) {
  const [answers, setAnswers] = useState<Answers>(initial);
  const [showErrors, setShowErrors] = useState(false);

  const grouped = useMemo(() => {
    return SECTION_ORDER.map((s) => ({
      key: s,
      title: fill(SECTION_TITLES[s], details.partner1, details.partner2),
      questions: questions.filter((q) => q.section === s),
    })).filter((sec) => sec.questions.length > 0 || sec.key === "custom");
  }, [questions, details.partner1, details.partner2]);

  const setValue = (id: string, value: string) =>
    setAnswers((a) => ({ ...a, [id]: { ...a[id], value } }));

  const setOther = (id: string, other: string) =>
    setAnswers((a) => ({
      ...a,
      [id]: { ...a[id], value: a[id]?.value ?? "Other", other },
    }));

  const isAnswered = (q: Question): boolean => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.type === "text") return !!a.value.trim();
    if (q.type === "yesno") return a.value === "Yes" || a.value === "No";
    if (q.type === "choice") {
      if (!a.value) return false;
      if (a.value === "Other") return !!(a.other || "").trim();
      return true;
    }
    return false;
  };

  const totalAnswered = questions.filter(isAnswered).length;
  const correctCount = questions.length === GRID_SIZE;
  const allAnswered = correctCount && questions.every(isAnswered);

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setAnswers((a) => {
      const next = { ...a };
      delete next[id];
      return next;
    });
  };

  const addCustom = (prompt: string, type: "yesno" | "text") => {
    if (questions.length >= GRID_SIZE) return;
    setQuestions([...questions, newCustomQuestion(prompt, type)]);
  };

  const resetToDefaults = () => {
    setQuestions([...QUESTIONS]);
  };

  const submit = () => {
    if (!allAnswered) {
      setShowErrors(true);
      const firstUnanswered = questions.find((q) => !isAnswered(q));
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    onNext(answers);
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10 pb-32">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold">
            Step 2 of 3
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Your predictions
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Need exactly {GRID_SIZE} questions. Tweak the list, then answer
            them.
          </p>
        </div>
        {questions.length !== QUESTIONS.length && (
          <button
            onClick={resetToDefaults}
            className="shrink-0 text-xs text-ink/60 underline-offset-2 hover:underline"
          >
            Reset list
          </button>
        )}
      </div>

      <div className="mt-8 space-y-10">
        {grouped.map((sec) => (
          <section key={sec.key}>
            <h3 className="border-b border-ink/15 pb-2 font-serif text-xl text-ink">
              {sec.title}
            </h3>
            <div className="mt-5 space-y-6">
              {sec.questions.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  details={details}
                  answer={answers[q.id]}
                  onValue={(v) => setValue(q.id, v)}
                  onOther={(v) => setOther(q.id, v)}
                  onRemove={() => removeQuestion(q.id)}
                  showError={showErrors && !isAnswered(q)}
                />
              ))}
              {sec.key === "custom" && (
                <AddCustomForm
                  disabled={questions.length >= GRID_SIZE}
                  remaining={GRID_SIZE - questions.length}
                  onAdd={addCustom}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <button onClick={onBack} className="text-sm text-ink/70 hover:text-ink">
            Back
          </button>
          <span className="text-xs text-ink/60">
            {questions.length} / {GRID_SIZE} questions
            {correctCount && ` · ${totalAnswered} answered`}
          </span>
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="rounded-full bg-ink px-6 py-2.5 font-serif text-base text-cream transition disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            Generate card
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionRow({
  q,
  details,
  answer,
  onValue,
  onOther,
  onRemove,
  showError,
}: {
  q: Question;
  details: WeddingDetails;
  answer?: { value: string; other?: string };
  onValue: (v: string) => void;
  onOther: (v: string) => void;
  onRemove: () => void;
  showError: boolean;
}) {
  const prompt = fill(q.prompt, details.partner1, details.partner2);
  const value = answer?.value ?? "";
  const other = answer?.other ?? "";

  return (
    <div id={`q-${q.id}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[15px] text-ink">{prompt}</p>
        <button
          onClick={onRemove}
          aria-label="Remove question"
          className="shrink-0 rounded-full px-2 py-0.5 text-base leading-none text-ink/40 hover:bg-ink/5 hover:text-ink/80"
        >
          ×
        </button>
      </div>
      <div className="mt-2.5">
        {q.type === "yesno" && (
          <RadioGroup
            name={q.id}
            value={value}
            options={["Yes", "No"]}
            onChange={onValue}
          />
        )}
        {q.type === "choice" && q.choices && (
          <>
            <RadioGroup
              name={q.id}
              value={value}
              options={q.choices}
              onChange={onValue}
            />
            {value === "Other" && (
              <input
                value={other}
                onChange={(e) => onOther(e.target.value.slice(0, TEXT_LIMIT))}
                placeholder={q.placeholder || "Type your answer"}
                maxLength={TEXT_LIMIT}
                className="mt-2 w-full rounded-lg border border-ink/20 bg-white/70 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            )}
          </>
        )}
        {q.type === "text" && (
          <input
            value={value}
            onChange={(e) => onValue(e.target.value.slice(0, TEXT_LIMIT))}
            placeholder={q.placeholder || "Your answer"}
            maxLength={TEXT_LIMIT}
            className="w-full rounded-lg border border-ink/20 bg-white/70 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        )}
      </div>
      {showError && (
        <p className="mt-1 text-xs text-red-600">Please answer this one.</p>
      )}
    </div>
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
              selected
                ? "border-ink bg-ink text-cream"
                : "border-ink/25 bg-white/60 text-ink hover:border-ink/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

function AddCustomForm({
  disabled,
  remaining,
  onAdd,
}: {
  disabled: boolean;
  remaining: number;
  onAdd: (prompt: string, type: "yesno" | "text") => void;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"yesno" | "text">("yesno");

  if (disabled && !open) {
    return (
      <p className="text-xs text-ink/50">
        You have {GRID_SIZE} questions — remove one to add a different question.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-ink/30 bg-white/40 px-4 py-3 text-sm text-ink/70 transition hover:border-ink/60 hover:text-ink"
      >
        + Add a question {remaining < GRID_SIZE && `(${remaining} more to fill the card)`}
      </button>
    );
  }

  const submit = () => {
    if (!prompt.trim()) return;
    onAdd(prompt, type);
    setPrompt("");
    setType("yesno");
    setOpen(false);
  };

  return (
    <div className="rounded-lg border border-ink/20 bg-white/60 p-4">
      <label className="block text-xs font-medium text-ink/70">
        Question
        <input
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_LIMIT))}
          maxLength={PROMPT_LIMIT}
          placeholder="e.g. Will Grandma get on the dance floor?"
          className="mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold"
        />
      </label>
      <div className="mt-3">
        <p className="text-xs font-medium text-ink/70">Answer type</p>
        <div className="mt-1.5 flex gap-2">
          <TypeButton selected={type === "yesno"} onClick={() => setType("yesno")}>
            Yes / No
          </TypeButton>
          <TypeButton selected={type === "text"} onClick={() => setType("text")}>
            Free answer
          </TypeButton>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            setOpen(false);
            setPrompt("");
          }}
          className="px-3 py-1.5 text-sm text-ink/60 hover:text-ink"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!prompt.trim()}
          className="rounded-full bg-ink px-4 py-1.5 text-sm text-cream transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function TypeButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        selected
          ? "border-ink bg-ink text-cream"
          : "border-ink/25 bg-white/60 text-ink hover:border-ink/50"
      }`}
    >
      {children}
    </button>
  );
}
