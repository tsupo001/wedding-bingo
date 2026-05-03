"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { fill, type Question } from "@/lib/questions";
import { seededShuffle } from "@/lib/shuffle";
import {
  formatWeddingDate,
  resolvedAnswer,
  type Answers,
  type Marks,
  type WeddingDetails,
} from "@/lib/types";

const SIZE = 1200;

type Props = {
  details: WeddingDetails;
  questions: Question[];
  answers: Answers;
  marks?: Marks;
  /** When provided, cells become tappable. */
  onToggle?: (id: string) => void;
  /** Render at the high-res 1200x1200 size used for export. When false, scales to its container. */
  exportSize?: boolean;
};

/**
 * The inner card always renders at 1200x1200 so the PNG export is high-res.
 * On screen we wrap it in a container and scale via CSS transform so it fits mobile.
 * The forwarded ref points at the inner (1200px) node — that's what `html-to-image` snapshots.
 */
export const BingoCard = forwardRef<HTMLDivElement, Props>(function BingoCard(
  { details, questions, answers, marks, onToggle, exportSize = false },
  ref
) {
  const ordered = useMemo<Question[]>(() => {
    const seed = `${details.guest}|${details.partner1}|${details.partner2}|${details.date}|${questions.map((q) => q.id).join(",")}`;
    return seededShuffle(questions, seed);
  }, [details.guest, details.partner1, details.partner2, details.date, questions]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (exportSize) return;
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / SIZE);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [exportSize]);

  const wrapperStyle: React.CSSProperties = exportSize
    ? { width: SIZE, height: SIZE }
    : { width: "100%", height: `${SIZE * scale}px`, position: "relative", overflow: "hidden" };

  const innerStyle: React.CSSProperties = exportSize
    ? {}
    : {
        position: "absolute",
        top: 0,
        left: 0,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div ref={ref} style={innerStyle}>
        <CardInner
          ordered={ordered}
          answers={answers}
          marks={marks}
          onToggle={onToggle}
          details={details}
        />
      </div>
    </div>
  );
});

function CardInner({
  ordered,
  answers,
  marks,
  onToggle,
  details,
}: {
  ordered: Question[];
  answers: Answers;
  marks?: Marks;
  onToggle?: (id: string) => void;
  details: WeddingDetails;
}) {
  const dateLabel = formatWeddingDate(details.date);
  const couple = `${details.partner1 || "Partner 1"} & ${
    details.partner2 || "Partner 2"
  }`;
  const guestLine = details.guest ? `${details.guest}'s card` : "";

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        background: "#faf6ef",
        boxSizing: "border-box",
        padding: 60,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#2a2622",
        border: "2px solid #b89868",
      }}
    >
      <div style={{ textAlign: "center", paddingBottom: 24 }}>
        <div
          style={{
            fontSize: 18,
            letterSpacing: 10,
            color: "#b89868",
            fontFamily: "'Playfair Display', Georgia, serif",
            textTransform: "uppercase",
          }}
        >
          Wedding Bingo
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 56,
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.05,
          }}
        >
          {couple}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            color: "#2a2622",
            opacity: 0.7,
            letterSpacing: 2,
          }}
        >
          {dateLabel}
        </div>
        <div
          style={{
            margin: "20px auto 0",
            width: 80,
            height: 1,
            background: "#b89868",
            opacity: 0.6,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          border: "1px solid #b89868",
        }}
      >
        {ordered.map((q, idx) => (
          <Cell
            key={q.id}
            q={q}
            answers={answers}
            details={details}
            marked={!!marks?.[q.id]}
            onToggle={onToggle}
            row={Math.floor(idx / 4)}
            col={idx % 4}
          />
        ))}
      </div>

      <div
        style={{
          paddingTop: 22,
          textAlign: "center",
          fontSize: 18,
          color: "#2a2622",
          opacity: 0.7,
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: 1,
          minHeight: 28,
        }}
      >
        {guestLine}
      </div>
    </div>
  );
}

function Cell({
  q,
  answers,
  details,
  marked,
  onToggle,
  row,
  col,
}: {
  q: Question;
  answers: Answers;
  details: WeddingDetails;
  marked: boolean;
  onToggle?: (id: string) => void;
  row: number;
  col: number;
}) {
  const label = fill(q.shortLabel, details.partner1, details.partner2);
  const fallback = q.placeholder || "—";
  const answer = resolvedAnswer(answers[q.id], fallback);
  const interactive = !!onToggle;

  const baseBg = (row + col) % 2 === 0 ? "#fdfaf3" : "#faf6ef";
  const bg = marked ? "rgba(184, 152, 104, 0.32)" : baseBg;

  return (
    <div
      onClick={interactive ? () => onToggle!(q.id) : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle!(q.id);
              }
            }
          : undefined
      }
      style={{
        position: "relative",
        borderRight: col < 3 ? "1px solid rgba(184, 152, 104, 0.6)" : "none",
        borderBottom: row < 3 ? "1px solid rgba(184, 152, 104, 0.6)" : "none",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        background: bg,
        boxSizing: "border-box",
        overflow: "hidden",
        cursor: interactive ? "pointer" : "default",
        transition: "background 0.15s",
        outline: "none",
      }}
    >
      <div
        style={{
          fontSize: labelFontSize(label),
          textTransform: "uppercase",
          letterSpacing: 1.4,
          color: marked ? "#7a6440" : "#b89868",
          lineHeight: 1.2,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: answerFontSize(answer),
          lineHeight: 1.1,
          color: "#2a2622",
          padding: "0 4px",
          wordBreak: "break-word",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: marked ? 0.55 : 1,
          textDecoration: marked ? "line-through" : "none",
          textDecorationColor: "#7a6440",
          textDecorationThickness: 2,
        }}
      >
        {answer}
      </div>
      {marked && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "#b89868",
            color: "#faf6ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}

function answerFontSize(text: string): number {
  const len = text.length;
  if (len <= 4) return 56;
  if (len <= 8) return 46;
  if (len <= 14) return 38;
  if (len <= 20) return 30;
  if (len <= 28) return 26;
  return 22;
}

function labelFontSize(text: string): number {
  const len = text.length;
  if (len <= 14) return 18;
  if (len <= 22) return 16;
  if (len <= 30) return 14;
  return 12;
}
