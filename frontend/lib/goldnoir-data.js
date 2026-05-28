export const initialPerfumes = [
  {
    id: "goldnoir-212-vip-rose",
    name: "212 VIP Rosé",
    brand: "Carolina Herrera",
    price: 389000,
    gender: "Femenino",
    occasion: "Noche & eventos",
    duration: "6-8 horas",
    notes: "Champagne, florales, madera suave",
    inspiration: "Una fragancia vibrante para destacar con elegancia.",
    image: "",
  },
  {
    id: "goldnoir-voyage",
    name: "Voyage",
    brand: "Nautica",
    price: 289000,
    gender: "Masculino",
    occasion: "Uso diario",
    duration: "4-6 horas",
    notes: "Manzana verde, notas acuáticas, almizcle",
    inspiration: "Fresco, limpio y versátil para todos los días.",
    image: "",
  },
  {
    id: "goldnoir-black-opium",
    name: "Black Opium",
    brand: "YSL",
    price: 499000,
    gender: "Femenino",
    occasion: "Noche",
    duration: "8+ horas",
    notes: "Café, vainilla, flores blancas",
    inspiration: "Un perfil intenso y seductor para noches especiales.",
    image: "",
  },
];

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