import { useState, useEffect, useRef } from "react";

const WA_NUMBER = "573145868426";
const IG_HANDLE = "gold.noir_";

const INITIAL_PERFUMES = [];

const QUIZ_QUESTIONS = [
  {
    id: "mood",
    question: "¿Qué sensación buscas?",
    options: [
      { label: "Dulce & cálido", value: "sweet", emoji: "🍯" },
      { label: "Fresco & limpio", value: "fresh", emoji: "🌊" },
      { label: "Intenso & misterioso", value: "intense", emoji: "🌑" },
      { label: "Floral & romántico", value: "floral", emoji: "🌹" },
    ],
  },
  {
    id: "occasion",
    question: "¿Para qué ocasión?",
    options: [
      { label: "Uso diario", value: "daily", emoji: "☀️" },
      { label: "Noche & eventos", value: "night", emoji: "🌙" },
      { label: "Trabajo / formal", value: "work", emoji: "💼" },
      { label: "Citas especiales", value: "date", emoji: "✨" },
    ],
  },
  {
    id: "style",
    question: "¿Cómo te describes?",
    options: [
      { label: "Elegante & sofisticado", value: "elegant", emoji: "👑" },
      { label: "Juvenil & moderno", value: "young", emoji: "⚡" },
      { label: "Clásico & refinado", value: "classic", emoji: "🎩" },
      { label: "Atrevido & sensual", value: "bold", emoji: "🔥" },
    ],
  },
  {
    id: "gender",
    question: "¿Para quién es?",
    options: [
      { label: "Para ella", value: "fem", emoji: "👸" },
      { label: "Para él", value: "masc", emoji: "🤴" },
      { label: "Unisex", value: "unisex", emoji: "⚜️" },
    ],
  },
  {
    id: "budget",
    question: "¿Cuál es tu presupuesto?",
    options: [
      { label: "Hasta $80.000", value: "low", emoji: "💰" },
      { label: "$80.000 – $150.000", value: "mid", emoji: "💰💰" },
      { label: "$150.000 – $250.000", value: "high", emoji: "💰💰💰" },
      { label: "Sin límite", value: "premium", emoji: "♾️" },
    ],
  },
];

const SAMPLE_RECS = [
  { name: "212 VIP Rosé", brand: "Carolina Herrera", match: 98, occasion: "Noche & eventos", gender: "Femenino" },
  { name: "Nautica Voyage", brand: "Nautica", match: 94, occasion: "Uso diario", gender: "Masculino" },
  { name: "Black Opium", brand: "YSL", match: 91, occasion: "Noches especiales", gender: "Femenino" },
];

const STATS_MOCK = {
  visits: 1247,
  contacts: 89,
  catalog: 0,
  conversion: "7.1%",
  topGender: "Femenino",
  topOccasion: "Noche & eventos",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: #8B6914;
    --black: #0A0A0A;
    --black2: #111111;
    --black3: #1A1A1A;
    --charcoal: #222222;
    --gray: #888;
    --gray-light: #CCCCCC;
    --white: #F5F0E8;
    --off-white: #EDE8DF;
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Jost', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    font-weight: 300;
    overflow-x: hidden;
  }

  .gn-app { min-height: 100vh; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 3rem;
    transition: background 0.4s, backdrop-filter 0.4s;
  }
  .nav.scrolled {
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(201,168,76,0.2);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 300;
    letter-spacing: 0.3em;
    color: var(--gold);
    cursor: pointer;
    text-transform: uppercase;
  }
  .nav-links {
    display: flex; gap: 2.5rem; list-style: none;
  }
  .nav-links a {
    color: var(--gray-light);
    text-decoration: none;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 400;
    transition: color 0.3s;
    cursor: pointer;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 0.5rem 1.4rem;
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 400;
  }
  .nav-cta:hover { background: var(--gold); color: var(--black); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 60%);
  }
  .hero-ornament {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    border: 1px solid rgba(201,168,76,0.06);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero-ornament::before {
    content: '';
    position: absolute; inset: 40px;
    border: 1px solid rgba(201,168,76,0.04);
    border-radius: 50%;
  }
  .hero-label {
    font-size: 0.65rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.5rem;
    font-weight: 400;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(4rem, 10vw, 8rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: 0.05em;
    color: var(--white);
    margin-bottom: 0.3rem;
  }
  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }
  .hero-subtitle {
    font-size: 0.8rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gray);
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .hero-divider {
    width: 60px; height: 1px;
    background: var(--gold);
    margin: 1.5rem auto;
    opacity: 0.6;
  }
  .hero-desc {
    max-width: 480px;
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--gray-light);
    margin: 0 auto 2.5rem;
    font-weight: 300;
  }
  .hero-btns {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  }
  .btn-primary {
    background: var(--gold);
    color: var(--black);
    border: none;
    padding: 0.9rem 2.5rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-ghost {
    background: transparent;
    color: var(--white);
    border: 1px solid rgba(245,240,232,0.3);
    padding: 0.9rem 2.5rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 400;
    transition: all 0.3s;
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
  .hero-scroll {
    position: absolute; bottom: 2.5rem;
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem;
    font-size: 0.6rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gray);
    animation: bounce 2s infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
  .scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--gold), transparent);
  }

  /* SECTION COMMON */
  .section {
    padding: 7rem 3rem;
    max-width: 1300px;
    margin: 0 auto;
  }
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  .section-eyebrow {
    font-size: 0.65rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1rem;
    display: block;
    font-weight: 400;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 4vw, 3.5rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--white);
  }
  .section-title em { font-style: italic; color: var(--gold); }
  .section-line {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 1.5rem auto 0;
    opacity: 0.5;
  }

  /* CATALOG */
  .catalog-tabs {
    display: flex; justify-content: center; gap: 0;
    margin-bottom: 3rem;
    border: 1px solid rgba(201,168,76,0.2);
    width: fit-content;
    margin-left: auto; margin-right: auto;
  }
  .catalog-tab {
    padding: 0.7rem 2.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    color: var(--gray);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.3s;
    font-weight: 400;
  }
  .catalog-tab.active {
    background: var(--gold);
    color: var(--black);
    font-weight: 500;
  }
  .catalog-tab:not(.active):hover { color: var(--gold); }

  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5px;
  }
  .perfume-card {
    background: var(--black2);
    border: 1px solid rgba(201,168,76,0.08);
    padding: 2rem;
    cursor: pointer;
    transition: all 0.35s;
    position: relative;
    overflow: hidden;
  }
  .perfume-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.35s;
  }
  .perfume-card:hover { background: var(--black3); border-color: rgba(201,168,76,0.25); }
  .perfume-card:hover::before { transform: scaleX(1); }

  .perfume-img {
    width: 100%; height: 220px;
    background: var(--charcoal);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .perfume-img img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .perfume-img-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: rgba(201,168,76,0.3);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .perfume-img-icon { font-size: 2.5rem; opacity: 0.4; }
  .perfume-gender-badge {
    position: absolute; top: 0.8rem; right: 0.8rem;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border: 1px solid rgba(201,168,76,0.4);
    color: var(--gold);
    background: rgba(10,10,10,0.8);
  }
  .perfume-brand {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.3rem;
    font-weight: 400;
  }
  .perfume-name {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--white);
    margin-bottom: 0.8rem;
    line-height: 1.2;
  }
  .perfume-tags {
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    margin-bottom: 1rem;
  }
  .perfume-tag {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    background: rgba(201,168,76,0.05);
    border: 1px solid rgba(201,168,76,0.15);
    color: var(--gray-light);
  }
  .perfume-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 1.2rem;
  }
  .perfume-price {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--gold);
  }
  .perfume-price span {
    font-family: var(--font-body);
    font-size: 0.7rem;
    color: var(--gray);
    margin-left: 0.3rem;
  }
  .btn-wa {
    background: transparent;
    border: 1px solid #25D366;
    color: #25D366;
    padding: 0.5rem 1rem;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.3s;
    font-weight: 400;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .btn-wa:hover { background: #25D366; color: var(--black); }
  .catalog-empty {
    text-align: center;
    padding: 5rem 2rem;
    color: var(--gray);
    grid-column: 1/-1;
  }
  .catalog-empty-icon { font-size: 3rem; opacity: 0.2; margin-bottom: 1rem; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    backdrop-filter: blur(4px);
  }
  .modal-box {
    background: var(--black2);
    border: 1px solid rgba(201,168,76,0.2);
    max-width: 700px; width: 100%;
    max-height: 85vh;
    overflow-y: auto;
  }
  .modal-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 2rem 2rem 0;
  }
  .modal-close {
    background: none; border: none;
    color: var(--gray); font-size: 1.5rem;
    cursor: pointer; line-height: 1; padding: 0;
    transition: color 0.2s;
  }
  .modal-close:hover { color: var(--gold); }
  .modal-body { padding: 1.5rem 2rem 2rem; }
  .modal-img {
    width: 100%; height: 280px;
    background: var(--charcoal);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
  }
  .modal-img img { width: 100%; height: 100%; object-fit: cover; }
  .modal-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem; margin: 1.5rem 0;
  }
  .modal-detail {
    border-left: 2px solid rgba(201,168,76,0.3);
    padding-left: 0.8rem;
  }
  .modal-detail-label {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 0.2rem;
    font-weight: 400;
  }
  .modal-detail-value { font-size: 0.9rem; color: var(--white); }
  .modal-wa-btn {
    width: 100%;
    background: #25D366; border: none;
    color: white;
    padding: 1rem;
    font-family: var(--font-body);
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 1.5rem;
    font-weight: 500;
    transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .modal-wa-btn:hover { opacity: 0.9; }

  /* QUIZ */
  .quiz-wrap {
    background: var(--black2);
    border: 1px solid rgba(201,168,76,0.1);
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem;
  }
  .quiz-progress {
    display: flex; gap: 0.3rem; margin-bottom: 2.5rem;
  }
  .quiz-bar {
    flex: 1; height: 2px;
    background: rgba(201,168,76,0.1);
    transition: background 0.4s;
  }
  .quiz-bar.done { background: var(--gold); }
  .quiz-question {
    font-family: var(--font-display);
    font-size: 1.8rem; font-weight: 300;
    margin-bottom: 2rem; color: var(--white);
  }
  .quiz-options {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  .quiz-option {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.12);
    padding: 1.2rem;
    cursor: pointer;
    font-family: var(--font-body);
    text-align: left;
    transition: all 0.25s;
    color: var(--gray-light);
    font-size: 0.9rem;
    font-weight: 300;
  }
  .quiz-option:hover { border-color: var(--gold); color: var(--white); background: rgba(201,168,76,0.04); }
  .quiz-option.selected { border-color: var(--gold); background: rgba(201,168,76,0.08); color: var(--gold); }
  .quiz-option-emoji { font-size: 1.2rem; margin-bottom: 0.4rem; display: block; }
  .quiz-nav {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 2rem;
  }
  .quiz-step {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gray);
  }

  /* RESULTS */
  .quiz-results { text-align: center; }
  .quiz-result-title {
    font-family: var(--font-display);
    font-size: 2.2rem; font-weight: 300;
    color: var(--gold); margin-bottom: 0.5rem;
  }
  .quiz-result-sub {
    font-size: 0.85rem; color: var(--gray);
    margin-bottom: 2.5rem;
  }
  .result-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; text-align: left;
  }
  .result-card {
    background: var(--black3);
    border: 1px solid rgba(201,168,76,0.15);
    padding: 1.5rem;
    position: relative;
  }
  .result-match {
    position: absolute; top: -1px; right: -1px;
    background: var(--gold); color: var(--black);
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.1em;
    padding: 0.25rem 0.6rem;
  }
  .result-brand-sm {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 0.3rem;
  }
  .result-name {
    font-family: var(--font-display);
    font-size: 1.2rem; font-weight: 400;
    margin-bottom: 0.5rem;
  }
  .result-meta {
    font-size: 0.7rem; color: var(--gray); margin: 0.15rem 0;
  }
  .result-wa-btn {
    width: 100%; margin-top: 1rem;
    background: transparent;
    border: 1px solid #25D366;
    color: #25D366;
    padding: 0.6rem;
    font-family: var(--font-body);
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    font-weight: 400;
  }
  .result-wa-btn:hover { background: #25D366; color: var(--black); }
  .quiz-retry {
    margin-top: 2rem;
    background: none;
    border: 1px solid rgba(201,168,76,0.2);
    color: var(--gray);
    padding: 0.7rem 2rem;
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    font-weight: 400;
  }
  .quiz-retry:hover { border-color: var(--gold); color: var(--gold); }

  /* CONTACT BAND */
  .contact-band {
    border-top: 1px solid rgba(201,168,76,0.1);
    border-bottom: 1px solid rgba(201,168,76,0.1);
    padding: 4rem 3rem;
    background: var(--black2);
  }
  .contact-inner {
    max-width: 900px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 2rem; flex-wrap: wrap;
  }
  .contact-text h2 {
    font-family: var(--font-display);
    font-size: 2.5rem; font-weight: 300;
  }
  .contact-text h2 em { font-style: italic; color: var(--gold); }
  .contact-text p {
    font-size: 0.9rem; color: var(--gray);
    margin-top: 0.5rem;
  }
  .contact-btns {
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .btn-wa-large {
    background: #25D366; border: none;
    color: white;
    padding: 1rem 2rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .btn-wa-large:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-ig {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--white);
    padding: 1rem 2rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 400;
    transition: all 0.3s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .btn-ig:hover { border-color: var(--gold); color: var(--gold); }

  /* ADMIN */
  .admin-wrap {
    background: var(--black2);
    border: 1px solid rgba(201,168,76,0.1);
    padding: 2.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  .admin-tabs {
    display: flex; gap: 0; margin-bottom: 2.5rem;
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .admin-tab {
    background: none; border: none;
    color: var(--gray);
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0.8rem 1.5rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.25s;
    font-weight: 400;
  }
  .admin-tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }
  .admin-tab:not(.active):hover { color: var(--gray-light); }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem; margin-bottom: 2rem;
  }
  .stat-card {
    background: var(--black3);
    border: 1px solid rgba(201,168,76,0.08);
    padding: 1.5rem;
  }
  .stat-label {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gray);
    margin-bottom: 0.5rem; font-weight: 400;
  }
  .stat-value {
    font-family: var(--font-display);
    font-size: 2.2rem; font-weight: 300;
    color: var(--gold);
  }
  .stat-sub {
    font-size: 0.7rem; color: var(--gray);
    margin-top: 0.2rem;
  }
  .admin-chart-mock {
    background: var(--black3);
    border: 1px solid rgba(201,168,76,0.08);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .chart-title {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 1.2rem; font-weight: 400;
  }
  .bar-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 120px; }
  .bar-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  }
  .bar { width: 100%; background: rgba(201,168,76,0.2); position: relative; transition: all 0.5s; }
  .bar::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px; background: var(--gold);
  }
  .bar-label { font-size: 0.55rem; color: var(--gray); text-align: center; }

  /* ADD PERFUME FORM */
  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .form-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-field.full { grid-column: 1/-1; }
  .form-label {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 400;
  }
  .form-input, .form-select, .form-textarea {
    background: var(--black3);
    border: 1px solid rgba(201,168,76,0.15);
    color: var(--white);
    padding: 0.7rem 0.9rem;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 300;
    outline: none;
    transition: border-color 0.25s;
    width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: rgba(201,168,76,0.5);
  }
  .form-select option { background: var(--black2); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .btn-add {
    background: var(--gold); border: none;
    color: var(--black);
    padding: 0.9rem 2rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.25s;
  }
  .btn-add:hover { background: var(--gold-light); }
  .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

  .perfume-list { margin-top: 1.5rem; }
  .perfume-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid rgba(201,168,76,0.07);
    background: var(--black3);
    margin-bottom: 0.3rem;
    gap: 1rem;
  }
  .perfume-row-info { flex: 1; }
  .perfume-row-name {
    font-family: var(--font-display);
    font-size: 1.1rem; font-weight: 400; margin-bottom: 0.2rem;
  }
  .perfume-row-meta { font-size: 0.7rem; color: var(--gray); }
  .perfume-row-price {
    font-family: var(--font-display);
    font-size: 1.3rem; color: var(--gold);
  }
  .btn-delete {
    background: none; border: 1px solid rgba(255,80,80,0.2);
    color: rgba(255,80,80,0.5);
    padding: 0.4rem 0.7rem;
    font-size: 0.7rem;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.25s;
    font-weight: 400;
  }
  .btn-delete:hover { background: rgba(255,80,80,0.1); border-color: rgba(255,80,80,0.5); color: #ff5050; }

  /* FOOTER */
  .footer {
    border-top: 1px solid rgba(201,168,76,0.1);
    padding: 3rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1.5rem;
  }
  .footer-logo {
    font-family: var(--font-display);
    font-size: 1.5rem; font-weight: 300;
    letter-spacing: 0.3em; color: var(--gold);
    text-transform: uppercase;
  }
  .footer-text {
    font-size: 0.7rem; color: var(--gray);
    letter-spacing: 0.1em;
  }
  .footer-socials { display: flex; gap: 1rem; }
  .footer-social {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gray);
    text-decoration: none;
    transition: color 0.25s; cursor: pointer;
    background: none; border: none; font-family: var(--font-body);
  }
  .footer-social:hover { color: var(--gold); }

  /* FLOATING WA */
  .float-wa {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 50;
    background: #25D366;
    border: none;
    width: 58px; height: 58px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(37,211,102,0.3);
    transition: transform 0.25s, box-shadow 0.25s;
    font-size: 1.5rem;
  }
  .float-wa:hover { transform: scale(1.08); box-shadow: 0 6px 25px rgba(37,211,102,0.4); }

  /* ADMIN GATE */
  .admin-gate {
    text-align: center;
    padding: 3rem;
  }
  .admin-gate-title {
    font-family: var(--font-display);
    font-size: 1.8rem; font-weight: 300;
    margin-bottom: 1.5rem; color: var(--white);
  }
  .admin-gate-form {
    display: flex; flex-direction: column; gap: 1rem;
    max-width: 300px; margin: 0 auto;
  }

  /* TOAST */
  .toast {
    position: fixed; bottom: 5rem; left: 50%;
    transform: translateX(-50%);
    background: var(--charcoal);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold);
    padding: 0.8rem 2rem;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    z-index: 300;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    font-weight: 400;
  }
  .toast.show { opacity: 1; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); }

  @media (max-width: 768px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .section { padding: 5rem 1.5rem; }
    .quiz-options { grid-template-columns: 1fr; }
    .result-cards { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .modal-detail-grid { grid-template-columns: 1fr; }
    .contact-inner { flex-direction: column; }
    .footer { flex-direction: column; text-align: center; }
    .hero-title { font-size: 3.5rem; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function igLink() {
  return `https://instagram.com/${IG_HANDLE}`;
}
function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Components ───────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return <div className={`toast ${msg ? "show" : ""}`}>{msg}</div>;
}

function PerfumeModal({ perfume, onClose }) {
  if (!perfume) return null;
  const waMsg = `Hola, me interesa el perfume *${perfume.name}* de ${perfume.brand}. ¿Está disponible?`;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="perfume-brand">{perfume.brand}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300 }}>{perfume.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-img">
            {perfume.image
              ? <img src={perfume.image} alt={perfume.name} />
              : <div className="perfume-img-placeholder"><span className="perfume-img-icon">🫧</span><span>Sin imagen</span></div>}
          </div>
          {perfume.inspiration && (
            <p style={{ fontSize: "0.9rem", color: "var(--gray-light)", lineHeight: 1.7, marginBottom: "1rem" }}>
              <em style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}>Inspirado en:</em> {perfume.inspiration}
            </p>
          )}
          <div className="modal-detail-grid">
            {perfume.notes && <div className="modal-detail"><p className="modal-detail-label">Notas</p><p className="modal-detail-value">{perfume.notes}</p></div>}
            {perfume.duration && <div className="modal-detail"><p className="modal-detail-label">Duración</p><p className="modal-detail-value">{perfume.duration}</p></div>}
            {perfume.occasion && <div className="modal-detail"><p className="modal-detail-label">Ocasión</p><p className="modal-detail-value">{perfume.occasion}</p></div>}
            {perfume.gender && <div className="modal-detail"><p className="modal-detail-label">Para</p><p className="modal-detail-value">{perfume.gender}</p></div>}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1rem" }}>
            <span className="perfume-price">${Number(perfume.price).toLocaleString("es-CO")}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--gray)" }}>COP</span>
          </div>
          <button className="modal-wa-btn" onClick={() => openLink(waLink(waMsg))}>
            <span>💬</span> Quiero este perfume
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogSection({ perfumes }) {
  const [tab, setTab] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const genders = ["Todos", "Femenino", "Masculino", "Unisex"];
  const filtered = tab === "Todos" ? perfumes : perfumes.filter((p) => p.gender === tab);

  return (
    <section className="section" id="catalogo">
      <div className="section-header">
        <span className="section-eyebrow">Colección exclusiva</span>
        <h2 className="section-title">Nuestro <em>Catálogo</em></h2>
        <div className="section-line" />
      </div>
      <div className="catalog-tabs">
        {genders.map((g) => (
          <button key={g} className={`catalog-tab ${tab === g ? "active" : ""}`} onClick={() => setTab(g)}>{g}</button>
        ))}
      </div>
      <div className="catalog-grid">
        {filtered.length === 0 ? (
          <div className="catalog-empty">
            <div className="catalog-empty-icon">✦</div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.5rem" }}>
              Catálogo en preparación
            </p>
            <p style={{ fontSize: "0.85rem" }}>Pronto agregaremos nuestras fragancias exclusivas.</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div key={i} className="perfume-card" onClick={() => setSelected(p)}>
              <div className="perfume-img">
                {p.image
                  ? <img src={p.image} alt={p.name} />
                  : <div className="perfume-img-placeholder"><span className="perfume-img-icon">🫧</span><span>Ver detalles</span></div>}
                {p.gender && <span className="perfume-gender-badge">{p.gender}</span>}
              </div>
              <p className="perfume-brand">{p.brand}</p>
              <h3 className="perfume-name">{p.name}</h3>
              <div className="perfume-tags">
                {p.occasion && <span className="perfume-tag">{p.occasion}</span>}
                {p.duration && <span className="perfume-tag">{p.duration}</span>}
              </div>
              <div className="perfume-footer">
                <div>
                  <span className="perfume-price">${Number(p.price).toLocaleString("es-CO")}</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--gray)", marginLeft: "0.3rem" }}>COP</span>
                </div>
                <button
                  className="btn-wa"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLink(waLink(`Hola, me interesa el perfume *${p.name}* de ${p.brand}. ¿Está disponible?`));
                  }}
                >
                  <span>💬</span> Pedir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function QuizSection({ perfumes }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);

  function selectOption(questionId, value) {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  }

  function next() {
    if (step < QUIZ_QUESTIONS.length - 1) setStep((s) => s + 1);
    else finalize();
  }

  function finalize() {
    let recs;
    if (perfumes.length > 0) {
      // Score perfumes from catalog
      const scored = perfumes.map((p) => {
        let score = 60 + Math.floor(Math.random() * 30);
        if (answers.gender === "fem" && p.gender === "Femenino") score += 10;
        if (answers.gender === "masc" && p.gender === "Masculino") score += 10;
        if (answers.gender === "unisex" && p.gender === "Unisex") score += 10;
        if (answers.occasion === "night" && p.occasion?.toLowerCase().includes("noche")) score += 5;
        if (answers.occasion === "daily" && p.occasion?.toLowerCase().includes("diario")) score += 5;
        return { ...p, match: Math.min(score, 99) };
      });
      recs = scored.sort((a, b) => b.match - a.match).slice(0, 3);
    } else {
      recs = SAMPLE_RECS;
    }
    setResults(recs);
    setDone(true);
  }

  function reset() {
    setStep(0); setAnswers({}); setDone(false); setResults([]);
  }

  const q = QUIZ_QUESTIONS[step];
  const answered = answers[q?.id];

  if (done) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-results">
          <p className="quiz-result-title">Tu fragancia ideal</p>
          <p className="quiz-result-sub">Basado en tu perfil, estas son nuestras recomendaciones</p>
          <div className="result-cards">
            {results.map((r, i) => (
              <div key={i} className="result-card">
                <span className="result-match">{r.match}% match</span>
                <p className="result-brand-sm">{r.brand}</p>
                <p className="result-name">{r.name}</p>
                {r.occasion && <p className="result-meta">✦ {r.occasion}</p>}
                {r.gender && <p className="result-meta">✦ {r.gender}</p>}
                {r.price && <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--gold)", marginTop: "0.5rem" }}>${Number(r.price).toLocaleString("es-CO")}</p>}
                <button
                  className="result-wa-btn"
                  onClick={() => openLink(waLink(`Hola, el quiz me recomendó *${r.name}*. ¿Está disponible?`))}
                >
                  💬 Me interesa este
                </button>
              </div>
            ))}
          </div>
          <button className="quiz-retry" onClick={reset}>Repetir quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className={`quiz-bar ${i < step || (i === step && answered) ? "done" : ""}`} />
        ))}
      </div>
      <p className="quiz-question">{q.question}</p>
      <div className="quiz-options">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            className={`quiz-option ${answered === opt.value ? "selected" : ""}`}
            onClick={() => selectOption(q.id, opt.value)}
          >
            <span className="quiz-option-emoji">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>
      <div className="quiz-nav">
        <button className="quiz-retry" onClick={reset} style={{ marginTop: 0, padding: "0.5rem 1rem" }}>
          ← Reiniciar
        </button>
        <span className="quiz-step">{step + 1} / {QUIZ_QUESTIONS.length}</span>
        <button
          className="btn-primary"
          onClick={next}
          disabled={!answered}
          style={{ opacity: answered ? 1 : 0.4, cursor: answered ? "pointer" : "not-allowed" }}
        >
          {step < QUIZ_QUESTIONS.length - 1 ? "Siguiente →" : "Ver resultados ✦"}
        </button>
      </div>
    </div>
  );
}

const BAR_DATA = [
  { label: "Lun", h: 45 }, { label: "Mar", h: 62 }, { label: "Mié", h: 38 },
  { label: "Jue", h: 80 }, { label: "Vie", h: 95 }, { label: "Sáb", h: 100 },
  { label: "Dom", h: 70 },
];

function AdminSection({ perfumes, setPerfumes, showToast }) {
  const [adminTab, setAdminTab] = useState("stats");
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [form, setForm] = useState({
    name: "", brand: "", price: "", gender: "Femenino",
    occasion: "", duration: "", notes: "", inspiration: "", image: "",
  });

  function login() {
    if (pw === "goldnoir2024") setAuthed(true);
    else showToast("Contraseña incorrecta");
  }

  function addPerfume() {
    if (!form.name || !form.brand || !form.price) { showToast("Completa nombre, marca y precio"); return; }
    setPerfumes((prev) => [...prev, { ...form }]);
    setForm({ name: "", brand: "", price: "", gender: "Femenino", occasion: "", duration: "", notes: "", inspiration: "", image: "" });
    showToast("Perfume agregado al catálogo ✦");
  }

  function deletePerfume(i) {
    setPerfumes((prev) => prev.filter((_, idx) => idx !== i));
    showToast("Eliminado del catálogo");
  }

  const stats = { ...STATS_MOCK, catalog: perfumes.length };

  if (!authed) {
    return (
      <div className="admin-gate">
        <p className="admin-gate-title">Acceso al panel</p>
        <div className="admin-gate-form">
          <input
            type="password"
            className="form-input"
            placeholder="Contraseña de administrador"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button className="btn-add" onClick={login}>Ingresar →</button>
          <p style={{ fontSize: "0.7rem", color: "var(--gray)", marginTop: "0.5rem" }}>Contraseña demo: goldnoir2024</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-tabs">
        {[["stats", "Estadísticas"], ["add", "Agregar perfume"], ["list", "Catálogo actual"]].map(([id, label]) => (
          <button key={id} className={`admin-tab ${adminTab === id ? "active" : ""}`} onClick={() => setAdminTab(id)}>{label}</button>
        ))}
        <button className="admin-tab" style={{ marginLeft: "auto" }} onClick={() => setAuthed(false)}>Salir</button>
      </div>

      {adminTab === "stats" && (
        <div>
          <div className="stats-grid">
            <div className="stat-card"><p className="stat-label">Visitas del mes</p><p className="stat-value">{stats.visits.toLocaleString()}</p><p className="stat-sub">+12% vs mes anterior</p></div>
            <div className="stat-card"><p className="stat-label">Contactos WhatsApp</p><p className="stat-value">{stats.contacts}</p><p className="stat-sub">Leads este mes</p></div>
            <div className="stat-card"><p className="stat-label">Perfumes en catálogo</p><p className="stat-value">{stats.catalog}</p><p className="stat-sub">Activos</p></div>
            <div className="stat-card"><p className="stat-label">Tasa de contacto</p><p className="stat-value">{stats.conversion}</p><p className="stat-sub">Visitas → WhatsApp</p></div>
            <div className="stat-card"><p className="stat-label">Género top</p><p className="stat-value" style={{ fontSize: "1.2rem", marginTop: "0.3rem" }}>{stats.topGender}</p><p className="stat-sub">Más visitado</p></div>
            <div className="stat-card"><p className="stat-label">Ocasión popular</p><p className="stat-value" style={{ fontSize: "1rem", marginTop: "0.4rem" }}>{stats.topOccasion}</p><p className="stat-sub">Quiz resultado #1</p></div>
          </div>
          <div className="admin-chart-mock">
            <p className="chart-title">Visitas por día (esta semana)</p>
            <div className="bar-chart">
              {BAR_DATA.map((b) => (
                <div key={b.label} className="bar-item">
                  <div className="bar" style={{ height: `${b.h}%` }} />
                  <span className="bar-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--gray)", textAlign: "center" }}>
            * Estadísticas de ejemplo. Conecta Google Analytics para datos reales.
          </p>
        </div>
      )}

      {adminTab === "add" && (
        <div>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nombre del perfume *</label>
              <input className="form-input" placeholder="Ej: Nautica Voyage" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Marca *</label>
              <input className="form-input" placeholder="Ej: Nautica" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Precio (COP) *</label>
              <input className="form-input" type="number" placeholder="Ej: 120000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Género</label>
              <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Femenino</option><option>Masculino</option><option>Unisex</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Ocasión</label>
              <input className="form-input" placeholder="Ej: Noche & eventos" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Duración</label>
              <input className="form-input" placeholder="Ej: 6-8 horas" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="form-field full">
              <label className="form-label">Notas del perfume</label>
              <input className="form-input" placeholder="Ej: Bergamota, ámbar, madera de cedro" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="form-field full">
              <label className="form-label">Inspirado en (opcional)</label>
              <input className="form-input" placeholder="Ej: Diseñado para el hombre aventurero..." value={form.inspiration} onChange={(e) => setForm({ ...form, inspiration: e.target.value })} />
            </div>
            <div className="form-field full">
              <label className="form-label">URL de imagen (opcional)</label>
              <input className="form-input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
          </div>
          <button className="btn-add" onClick={addPerfume} disabled={!form.name || !form.brand || !form.price}>
            Agregar al catálogo ✦
          </button>
        </div>
      )}

      {adminTab === "list" && (
        <div className="perfume-list">
          {perfumes.length === 0
            ? <p style={{ color: "var(--gray)", textAlign: "center", padding: "2rem" }}>No hay perfumes en el catálogo aún.</p>
            : perfumes.map((p, i) => (
              <div key={i} className="perfume-row">
                <div className="perfume-row-info">
                  <p className="perfume-row-name">{p.name}</p>
                  <p className="perfume-row-meta">{p.brand} · {p.gender} · {p.occasion || "—"}</p>
                </div>
                <span className="perfume-row-price">${Number(p.price).toLocaleString("es-CO")}</span>
                <button className="btn-delete" onClick={() => deletePerfume(i)}>Eliminar</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function GoldNoir() {
  const [perfumes, setPerfumes] = useState(INITIAL_PERFUMES);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const toastRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2500);
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "quiz", label: "Quiz" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="gn-app">
        {/* NAV */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo" onClick={() => scrollTo("inicio")}>GoldNoir</div>
          <ul className="nav-links">
            {sections.map((s) => (
              <li key={s.id}><a onClick={() => scrollTo(s.id)}>{s.label}</a></li>
            ))}
          </ul>
          <button className="nav-cta" onClick={() => openLink(waLink("Hola, me gustaría conocer más sobre GoldNoir"))}>
            Contactar
          </button>
        </nav>

        {/* HERO */}
        <section className="hero" id="inicio">
          <div className="hero-bg" />
          <div className="hero-ornament" />
          <p className="hero-label">Perfumería de lujo · Colombia</p>
          <h1 className="hero-title">Gold<em>Noir</em></h1>
          <div className="hero-divider" />
          <p className="hero-subtitle">Fragancias de diseñador · Elegancia sin igual</p>
          <p className="hero-desc">
            Descubre nuestra colección de perfumes de diseñador reconocidos mundialmente. 
            Cada fragancia es una historia, una sensación, una identidad.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo("catalogo")}>Ver catálogo ✦</button>
            <button className="btn-ghost" onClick={() => scrollTo("quiz")}>Encontrar mi aroma</button>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />
            <span>Descubrir</span>
          </div>
        </section>

        {/* CATALOG */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <CatalogSection perfumes={perfumes} />
        </div>

        {/* QUIZ */}
        <div style={{ background: "var(--black2)", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <section className="section" id="quiz">
            <div className="section-header">
              <span className="section-eyebrow">Descubre tu aroma ideal</span>
              <h2 className="section-title">Quiz de <em>recomendación</em></h2>
              <div className="section-line" />
              <p style={{ marginTop: "1rem", color: "var(--gray)", fontSize: "0.9rem" }}>
                5 preguntas · Resultados personalizados · Sin IA — solo instinto
              </p>
            </div>
            <QuizSection perfumes={perfumes} />
          </section>
        </div>

        {/* CONTACT BAND */}
        <div className="contact-band">
          <div className="contact-inner">
            <div className="contact-text">
              <h2>Hablemos de <em>fragancias</em></h2>
              <p>Estamos a un mensaje de distancia. Escríbenos por WhatsApp o visítanos en Instagram.</p>
            </div>
            <div className="contact-btns">
              <button className="btn-wa-large" onClick={() => openLink(waLink("Hola! Me gustaría conocer más sobre los perfumes de GoldNoir 🖤"))}>
                <span>💬</span> WhatsApp
              </button>
              <button className="btn-ig" onClick={() => openLink(igLink())}>
                <span>📸</span> @gold.noir_
              </button>
            </div>
          </div>
        </div>

        {/* ADMIN */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <section className="section" id="admin">
            <div className="section-header">
              <span className="section-eyebrow">Gestión del negocio</span>
              <h2 className="section-title">Panel de <em>administración</em></h2>
              <div className="section-line" />
            </div>
            <div className="admin-wrap">
              <AdminSection perfumes={perfumes} setPerfumes={setPerfumes} showToast={showToast} />
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">GoldNoir</div>
          <p className="footer-text">© 2025 GoldNoir · Perfumería de diseñador · Colombia</p>
          <div className="footer-socials">
            <button className="footer-social" onClick={() => openLink(waLink("Hola GoldNoir!"))}>WhatsApp</button>
            <button className="footer-social" onClick={() => openLink(igLink())}>Instagram</button>
          </div>
        </footer>

        {/* FLOATING WA */}
        <button
          className="float-wa"
          title="Contactar por WhatsApp"
          onClick={() => openLink(waLink("Hola GoldNoir, me interesa conocer más sobre sus perfumes 🖤"))}
        >
          💬
        </button>

        <Toast msg={toast} />
      </div>
    </>
  );
}
