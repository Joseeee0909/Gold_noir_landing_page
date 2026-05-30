export const initialPerfumes = [];

export const quizQuestions = [
  {
    id: "aroma",
    question: "¿Prefieres una sensación dulce o fresca?",
    options: [
      { label: "Dulce", value: "sweet", emoji: "🍯" },
      { label: "Fresco", value: "fresh", emoji: "🌊" },
    ],
  },
  {
    id: "use",
    question: "¿Lo usarías más de día o de noche?",
    options: [
      { label: "Uso diario", value: "day", emoji: "☀️" },
      { label: "Nocturno", value: "night", emoji: "🌙" },
    ],
  },
  {
    id: "style",
    question: "¿Buscas algo elegante o juvenil?",
    options: [
      { label: "Elegante", value: "elegant", emoji: "👑" },
      { label: "Juvenil", value: "young", emoji: "⚡" },
    ],
  },
  {
    id: "favorites",
    question: "¿Perfumes que ya te gustan?",
    type: "text",
  },
  {
    id: "budget",
    question: "¿Cuál es tu presupuesto?",
    options: [
      { label: "Hasta $100.000", value: "low", emoji: "💰" },
      { label: "$100.000 - $200.000", value: "mid", emoji: "💰💰" },
      { label: "$200.000 o más", value: "high", emoji: "💎" },
    ],
  },
];