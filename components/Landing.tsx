"use client";

type Props = { onStart: () => void };

export function Landing({ onStart }: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-md">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-gold">
          Wedding
        </p>
        <h1 className="mt-2 font-serif text-5xl text-ink sm:text-6xl">Bingo</h1>
        <div className="mx-auto mt-6 h-px w-24 bg-gold/60" />
        <p className="mt-6 text-base leading-relaxed text-ink/80">
          Fill in your predictions for the big day, generate a bingo card, and
          see how many you get right by the end of the night.
        </p>
        <button
          onClick={onStart}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-ink px-10 py-3 font-serif text-lg text-cream shadow-sm transition hover:bg-ink/90 active:scale-[0.98]"
        >
          Start
        </button>
      </div>
    </div>
  );
}
