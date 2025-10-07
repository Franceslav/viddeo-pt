// Транслитерация русских символов в латиницу для URL
const transliterationMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  
  // Заглавные буквы
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
}

// Функция для транслитерации текста
export function transliterate(text: string): string {
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('')
}

// Функция для создания URL-дружественной строки
export function createSlug(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
}

// Функция для создания SEO-дружественного URL сезона
export function createSeasonUrl(seasonNumber: number): string {
  return `/south-park/season-${seasonNumber}`
}

// Функция для создания SEO-дружественного URL эпизода
export function createEpisodeUrl(episodeId: string): string {
  return `/gallery/episode/${episodeId}`
}

// Функция для создания SEO-дружественного URL эпизода с данными
export function createEpisodeSeoUrl(episode: { id: string; title: string; seasonNumber: number; episodeNumber: number }): string {
  const slug = createSlug(episode.title)
  return `/yuzhnyy-park/sezon-${episode.seasonNumber}/seria-${episode.episodeNumber}-${slug}`
}

// Функция для создания URL эпизода с названием сезона
export function createEpisodeUrlWithSeason(episodeId: string): string {
  return `/gallery/episode/${episodeId}`
}

// Примеры использования:
// createSeasonUrl(1, "Сезон 1") -> "/south-park/seasons/season-1"
// createSeasonUrl(1, "Первый сезон") -> "/south-park/seasons/season-1-pervyy-sezon"
// createEpisodeUrl(1, 1, "Картман и анальный зонд") -> "/south-park/seasons/season-1/episodes/episode-1-kartman-i-analnyy-zond"
