export type QuestionType = "yesno" | "choice" | "text";

export type QuestionSection = "partner1" | "partner2" | "look" | "reception" | "custom";

export type Question = {
  id: string;
  section: QuestionSection;
  /** Full question text. Use {p1}/{p2} placeholders to substitute partner names. */
  prompt: string;
  /** Short label that appears at the top of each bingo cell. Same placeholders. */
  shortLabel: string;
  type: QuestionType;
  /** Choices for "choice" type. Including "Other" enables a free-text fallback. */
  choices?: string[];
  /** Default placeholder so the cell never renders empty. */
  placeholder?: string;
  /** True for user-added questions. Built-ins are false/undefined. */
  isCustom?: boolean;
};

export const QUESTIONS: Question[] = [
  // Partner 1
  {
    id: "p1_cries_vows",
    section: "partner1",
    prompt: "{p1} cries during vows?",
    shortLabel: "{p1} cries during vows",
    type: "yesno",
  },
  {
    id: "p1_first_words",
    section: "partner1",
    prompt: "{p1}'s first words at the altar",
    shortLabel: "{p1}'s first words",
    type: "choice",
    choices: ["Wow", "You look beautiful", "Hi", "Other"],
    placeholder: "...",
  },
  {
    id: "p1_forgets_line",
    section: "partner1",
    prompt: "{p1} forgets a line in vows or speech?",
    shortLabel: "{p1} forgets a line",
    type: "yesno",
  },
  {
    id: "p1_sports",
    section: "partner1",
    prompt: "{p1} mentions sports in their speech?",
    shortLabel: "{p1} mentions sports",
    type: "yesno",
  },

  // Partner 2
  {
    id: "p2_cries_aisle",
    section: "partner2",
    prompt: "{p2} cries walking down the aisle?",
    shortLabel: "{p2} cries on aisle",
    type: "yesno",
  },
  {
    id: "p2_first_words",
    section: "partner2",
    prompt: "{p2}'s first words to {p1}",
    shortLabel: "{p2}'s first words",
    type: "choice",
    choices: ["Hi", "I love you", "A joke", "Other"],
    placeholder: "...",
  },
  {
    id: "p2_parents",
    section: "partner2",
    prompt: "{p2} mentions their parents in vows/speech?",
    shortLabel: "{p2} mentions parents",
    type: "yesno",
  },
  {
    id: "p2_outfit_change",
    section: "partner2",
    prompt: "{p2} changes outfits during the reception?",
    shortLabel: "{p2} changes outfit",
    type: "yesno",
  },

  // The Look
  {
    id: "outfit_style",
    section: "look",
    prompt: "Outfit style",
    shortLabel: "Outfit style",
    type: "choice",
    choices: [
      "Open back",
      "Mermaid",
      "Ballgown",
      "Minimalist",
      "Two-piece",
      "Suit",
      "Other",
    ],
    placeholder: "...",
  },
  {
    id: "hair",
    section: "look",
    prompt: "Hair",
    shortLabel: "Hair",
    type: "choice",
    choices: ["Up", "Down", "Half-up", "Other"],
    placeholder: "...",
  },
  {
    id: "second_outfit",
    section: "look",
    prompt: "Suit / second outfit color",
    shortLabel: "Second outfit",
    type: "choice",
    choices: ["Black", "Navy", "Grey", "Cream", "Patterned", "Other"],
    placeholder: "...",
  },
  {
    id: "florist",
    section: "look",
    prompt: "Bouquet brand or florist",
    shortLabel: "Florist",
    type: "text",
    placeholder: "Florist or brand",
  },

  // Reception
  {
    id: "walk_in_song",
    section: "reception",
    prompt: "Walk-in song (title or artist)",
    shortLabel: "Walk-in song",
    type: "text",
    placeholder: "Song or artist",
  },
  {
    id: "first_dance",
    section: "reception",
    prompt: "First dance song (title or artist)",
    shortLabel: "First dance",
    type: "text",
    placeholder: "Song or artist",
  },
  {
    id: "long_speech",
    section: "reception",
    prompt: "First speech goes over 5 minutes?",
    shortLabel: "Speech > 5 min",
    type: "yesno",
  },
  {
    id: "surprise",
    section: "reception",
    prompt: "Surprise performance (someone sings/dances/plays)?",
    shortLabel: "Surprise act",
    type: "yesno",
  },
];

export const SECTION_ORDER: QuestionSection[] = [
  "partner1",
  "partner2",
  "look",
  "reception",
  "custom",
];

export const SECTION_TITLES: Record<QuestionSection, string> = {
  partner1: "{p1}",
  partner2: "{p2}",
  look: "The Look",
  reception: "Reception",
  custom: "Your own",
};

export function fill(template: string, p1: string, p2: string): string {
  return template.replaceAll("{p1}", p1 || "Bride").replaceAll("{p2}", p2 || "Groom");
}

export const GRID_SIZE = 16;

export function newCustomQuestion(prompt: string, type: "yesno" | "text"): Question {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const trimmed = prompt.trim();
  return {
    id,
    section: "custom",
    prompt: trimmed,
    shortLabel: trimmed,
    type,
    placeholder: type === "text" ? "..." : undefined,
    isCustom: true,
  };
}
