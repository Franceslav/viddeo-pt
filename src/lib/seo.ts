export function seasonMeta(n: number, year?: number) {
  return {
    title: `Южный парк — Сезон ${n}: все серии${year ? ` (${year})` : ""}`,
    description: `Сезон ${n} «Южного парка»: список серий, даты выхода, описание и персонажи.`,
    h1: `Южный парк: сезон ${n}`,
  };
}

export function episodeMeta(n: number, m: number, title: string, synopsis?: string) {
  return {
    title: `Южный парк — Сезон ${n}, Серия ${m}: ${title} (смотреть, описание)`,
    description: synopsis?.slice(0,150) ?? `Серия ${m} сезона ${n} «Южного парка».`,
    h1: `${title} — сезон ${n}, серия ${m}`,
  };
}

export function personMeta(name: string) {
  return {
    title: `${name} — персонаж «Южный парк»: биография, серии`,
    description: `${name}: биография и эпизоды с участием персонажа «Южный парк».`,
    h1: name,
  };
}

export function jsonLd(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}
