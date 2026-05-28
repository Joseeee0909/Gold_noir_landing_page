export function recommendPerfumes(perfumes, answers) {
  const scored = perfumes.map((perfume) => {
    let score = 55;
    const favorites = String(answers.favorites || "").toLowerCase();

    if (answers.aroma === "sweet" && /vainilla|ámbar|amber|caramelo|floral/i.test(`${perfume.notes} ${perfume.inspiration}`)) score += 16;
    if (answers.aroma === "fresh" && /acu|cítrico|bergamota|limpio|verde|marine/i.test(`${perfume.notes} ${perfume.inspiration}`)) score += 16;

    if (answers.use === "night" && /noche|intenso|sensual|eventos/i.test(`${perfume.occasion} ${perfume.inspiration}`)) score += 14;
    if (answers.use === "day" && /diario|oficina|fresco|versátil/i.test(`${perfume.occasion} ${perfume.inspiration}`)) score += 14;

    if (answers.style === "elegant" && /eleg|sofistic|lujo|refin/i.test(`${perfume.inspiration} ${perfume.notes}`)) score += 12;
    if (answers.style === "young" && /vibr|juven|moderno|fresco|versátil/i.test(`${perfume.inspiration} ${perfume.notes}`)) score += 12;

    if (favorites) {
      const tokens = favorites
        .split(/[ ,]+/)
        .filter(Boolean)
        .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      if (tokens.length > 0 && new RegExp(tokens.join("|"), "i").test(`${perfume.name} ${perfume.brand} ${perfume.notes} ${perfume.inspiration}`)) {
        score += 8;
      }
    }

    if (answers.budget === "low" && perfume.price <= 100000) score += 10;
    if (answers.budget === "mid" && perfume.price > 100000 && perfume.price <= 200000) score += 10;
    if (answers.budget === "high" && perfume.price > 200000) score += 10;

    return {
      ...perfume,
      match: Math.min(score, 99),
    };
  });

  return scored.sort((left, right) => right.match - left.match).slice(0, 3);
}