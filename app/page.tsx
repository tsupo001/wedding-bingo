"use client";

import { useEffect, useRef, useState } from "react";
import { Landing } from "@/components/Landing";
import { WeddingDetailsForm } from "@/components/WeddingDetailsForm";
import { PredictionsForm } from "@/components/PredictionsForm";
import { CardPreview } from "@/components/CardPreview";
import { PlayMode } from "@/components/PlayMode";
import { QUESTIONS, type Question } from "@/lib/questions";
import {
  clearState,
  loadState,
  saveState,
  type Step,
} from "@/lib/storage";
import type { Answers, Marks, WeddingDetails } from "@/lib/types";

const emptyDetails: WeddingDetails = {
  partner1: "",
  partner2: "",
  date: "",
  guest: "",
};

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("landing");
  const [details, setDetails] = useState<WeddingDetails>(emptyDetails);
  const [questions, setQuestions] = useState<Question[]>(() => [...QUESTIONS]);
  const [answers, setAnswers] = useState<Answers>({});
  const [marks, setMarks] = useState<Marks>({});

  // Load from localStorage on mount.
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setStep(saved.step);
      setDetails(saved.details);
      setQuestions(saved.questions);
      setAnswers(saved.answers);
      setMarks(saved.marks);
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  const firstSave = useRef(true);
  useEffect(() => {
    if (!hydrated) return;
    if (firstSave.current) {
      firstSave.current = false;
      // Don't write back the just-loaded state — only save real changes.
      return;
    }
    saveState({ v: 2, step, details, questions, answers, marks });
  }, [hydrated, step, details, questions, answers, marks]);

  const reset = () => {
    setDetails(emptyDetails);
    setQuestions([...QUESTIONS]);
    setAnswers({});
    setMarks({});
    setStep("landing");
    clearState();
  };

  // Avoid hydration flash: render a minimal cream background until we've read storage.
  if (!hydrated) {
    return <main className="min-h-[100dvh]" />;
  }

  return (
    <main className="min-h-[100dvh]">
      {step === "landing" && <Landing onStart={() => setStep("details")} />}
      {step === "details" && (
        <WeddingDetailsForm
          initial={details}
          onBack={() => setStep("landing")}
          onNext={(d) => {
            setDetails(d);
            setStep("predictions");
          }}
        />
      )}
      {step === "predictions" && (
        <PredictionsForm
          details={details}
          questions={questions}
          setQuestions={setQuestions}
          initial={answers}
          onBack={() => setStep("details")}
          onNext={(a) => {
            setAnswers(a);
            setStep("preview");
          }}
        />
      )}
      {step === "preview" && (
        <CardPreview
          details={details}
          questions={questions}
          answers={answers}
          marks={marks}
          onPlay={() => setStep("play")}
          onEdit={() => setStep("predictions")}
          onReset={reset}
        />
      )}
      {step === "play" && (
        <PlayMode
          details={details}
          questions={questions}
          answers={answers}
          marks={marks}
          setMarks={setMarks}
          onBack={() => setStep("preview")}
          onReset={reset}
        />
      )}
    </main>
  );
}
