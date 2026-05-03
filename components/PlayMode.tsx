"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { BingoCard } from "./BingoCard";
import { seededShuffle } from "@/lib/shuffle";
import type { Question } from "@/lib/questions";
import type { Answers, Marks, WeddingDetails } from "@/lib/types";

type Props = {
  details: WeddingDetails;
  questions: Question[];
  answers: Answers;
  marks: Marks;
  setMarks: (m: Marks) => void;
  onBack: () => void;
  onReset: () => void;
};

export function PlayMode({
  details,
  questions,
  answers,
  marks,
  setMarks,
  onBack,
  onReset,
}: Props) {
  // Recompute the same shuffled order BingoCard uses so we can detect lines.
  const ordered = useMemo<Question[]>(() => {
    const seed = `${details.guest}|${details.partner1}|${details.partner2}|${details.date}|${questions.map((q) => q.id).join(",")}`;
    return seededShuffle(questions, seed);
  }, [details.guest, details.partner1, details.partner2, details.date, questions]);

  const wins = useMemo(() => detectWins(ordered, marks), [ordered, marks]);
  const hasBingo = wins.length > 0;
  const [celebrated, setCelebrated] = useState(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    if (hasBingo && !celebrated) {
      setCelebrated(true);
      setBanner(true);
      const t = setTimeout(() => setBanner(false), 4500);
      return () => clearTimeout(t);
    }
    if (!hasBingo) setCelebrated(false);
  }, [hasBingo, celebrated]);

  const toggle = (id: string) => {
    setMarks({ ...marks, [id]: !marks[id] });
  };

  const clearAll = () => setMarks({});

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
      link.download = `${name}-bingo-progress.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const markedCount = Object.values(marks).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-lg px-5 py-10 pb-32">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold">
            Now playing
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Tap squares as they happen
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            {markedCount} marked · get four in a row for bingo
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-ink/15 bg-white/60 p-3 shadow-sm">
        <BingoCard
          details={details}
          questions={questions}
          answers={answers}
          marks={marks}
          onToggle={toggle}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full rounded-full border border-ink/30 bg-white/60 py-2.5 font-serif text-base text-ink transition hover:bg-white disabled:opacity-60"
        >
          {downloading ? "Generating…" : "Download progress as PNG"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={clearAll}
            disabled={markedCount === 0}
            className="flex-1 rounded-full border border-ink/25 bg-white/40 py-2.5 text-sm text-ink transition hover:bg-white disabled:opacity-40"
          >
            Clear marks
          </button>
          <button
            onClick={onBack}
            className="flex-1 rounded-full border border-ink/25 bg-white/40 py-2.5 text-sm text-ink transition hover:bg-white"
          >
            Back to card
          </button>
        </div>
        <button
          onClick={onReset}
          className="text-center text-xs text-ink/50 hover:text-ink/80"
        >
          Start over
        </button>
      </div>

      {banner && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-6"
        >
          <div className="rounded-full border border-gold bg-cream px-6 py-3 font-serif text-lg text-ink shadow-lg">
            <span className="tracking-[0.3em] text-gold">BINGO</span>
            <span className="ml-2 text-ink/70">— {wins[0]?.label}</span>
          </div>
        </div>
      )}

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

type Win = { label: string; cells: number[] };

function detectWins(ordered: Question[], marks: Marks): Win[] {
  if (ordered.length < 16) return [];
  const isMarked = (i: number) => !!marks[ordered[i]?.id];
  const wins: Win[] = [];
  for (let r = 0; r < 4; r++) {
    const cells = [r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3];
    if (cells.every(isMarked)) wins.push({ label: `Row ${r + 1}`, cells });
  }
  for (let c = 0; c < 4; c++) {
    const cells = [c, c + 4, c + 8, c + 12];
    if (cells.every(isMarked)) wins.push({ label: `Column ${c + 1}`, cells });
  }
  const diag1 = [0, 5, 10, 15];
  if (diag1.every(isMarked)) wins.push({ label: "Diagonal", cells: diag1 });
  const diag2 = [3, 6, 9, 12];
  if (diag2.every(isMarked)) wins.push({ label: "Diagonal", cells: diag2 });
  return wins;
}
