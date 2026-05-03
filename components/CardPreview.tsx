"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { BingoCard } from "./BingoCard";
import type { Question } from "@/lib/questions";
import type { Answers, Marks, WeddingDetails } from "@/lib/types";

type Props = {
  details: WeddingDetails;
  questions: Question[];
  answers: Answers;
  marks: Marks;
  onPlay: () => void;
  onEdit: () => void;
  onReset: () => void;
};

export function CardPreview({
  details,
  questions,
  answers,
  marks,
  onPlay,
  onEdit,
  onReset,
}: Props) {
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setDownloading(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#faf6ef",
      });
      const link = document.createElement("a");
      const safe = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const name =
        [details.partner1, details.partner2, details.guest]
          .filter(Boolean)
          .map(safe)
          .join("-") || "wedding-bingo";
      link.download = `${name}-bingo.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Sorry, the card couldn't be generated. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold">
        Your card
      </p>
      <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
        Ready for the big day
      </h2>
      <p className="mt-2 text-sm text-ink/70">
        Download the PNG to share, or start playing to mark squares as they
        happen.
      </p>

      <div className="mt-6 rounded-xl border border-ink/15 bg-white/60 p-3 shadow-sm">
        <BingoCard details={details} questions={questions} answers={answers} marks={marks} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onPlay}
          className="w-full rounded-full bg-ink py-3 font-serif text-lg text-cream transition hover:bg-ink/90"
        >
          Start playing
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full rounded-full border border-ink/30 bg-white/60 py-3 font-serif text-lg text-ink transition hover:bg-white disabled:opacity-60"
        >
          {downloading ? "Generating…" : "Download PNG"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 rounded-full border border-ink/25 bg-white/40 py-2.5 text-sm text-ink transition hover:bg-white"
          >
            Edit answers
          </button>
          <button
            onClick={onReset}
            className="flex-1 rounded-full border border-ink/25 bg-white/40 py-2.5 text-sm text-ink transition hover:bg-white"
          >
            Start over
          </button>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <BingoCard
          ref={exportRef}
          details={details}
          questions={questions}
          answers={answers}
          marks={marks}
          exportSize
        />
      </div>
    </div>
  );
}
