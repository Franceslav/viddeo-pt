const map: Record<string, string> = {
  а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y",
  к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
  х:"h", ц:"c", ч:"ch", ш:"sh", щ:"sch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya",
  " ":"-", "_":"-", "—":"-", "–":"-", "/":"-"
};

export function translitRuToLat(input: string) {
  return input
    .toLowerCase()
    .split("")
    .map(ch => map[ch] ?? ch)
    .join("");
}

export function slugify(input: string, maxLen = 70) {
  let s = translitRuToLat(input)
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (s.length > maxLen) s = s.slice(0, maxLen).replace(/-+$/,"");
  return s;
}

export const seasonSlug = (n: number) => `sezon-${String(n).padStart(2,"0")}`;
export const episodeSlug = (m: number, title: string) =>
  `seriya-${String(m).padStart(2,"0")}-${slugify(title)}`;
