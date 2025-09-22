import axios from 'axios';

export interface VidLinkEpisode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  url: string;
  image?: string;
  description?: string;
  duration?: number;
}

export interface VidLinkSeries {
  id: string;
  name: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  firstAirDate: string;
  lastAirDate: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  genres: Array<{ id: number; name: string }>;
  seasons: Array<{
    id: number;
    name: string;
    seasonNumber: number;
    episodeCount: number;
    airDate: string;
    posterPath: string;
    overview: string;
  }>;
}

export interface VidLinkResponse {
  series: VidLinkSeries;
  episodes: VidLinkEpisode[];
}

/**
 * Парсит данные сериала и эпизодов с VidLink.pro
 * @param url - URL страницы сериала (например: https://vidlink.pro/tv/2190/2/5)
 * @returns Promise с данными сериала и эпизодов
 */
export async function scrapeVidLink(url: string): Promise<VidLinkResponse> {
  try {
    // Валидация URL
    if (!url.includes('vidlink.pro/tv/')) {
      throw new Error('Invalid VidLink URL. Expected format: https://vidlink.pro/tv/{id}/{season}/{episode}');
    }

    // Извлекаем ID сериала, сезон и эпизод из URL
    const urlMatch = url.match(/vidlink\.pro\/tv\/(\d+)\/(\d+)\/(\d+)/);
    if (!urlMatch) {
      throw new Error('Could not parse series ID, season, or episode from URL');
    }

    const [, seriesId, seasonNumber, episodeNumber] = urlMatch;

    // Заголовки для обхода блокировок
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
    };

    // Получаем HTML страницы
    const response = await axios.get(url, {
      headers,
      validateStatus: () => true, // Не выбрасывать ошибку на 403/404
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = response.data;
    
    // Проверяем, что получили HTML
    if (!html || html.length < 1000) {
      throw new Error('Invalid response: too short or empty HTML');
    }

    // Парсим данные из встроенного JSON в script тегах
    const seriesData = extractSeriesData(html);
    const episodes = extractEpisodes(html, parseInt(seasonNumber), parseInt(episodeNumber));

    if (!seriesData) {
      throw new Error('Could not extract series data from page');
    }

    return {
      series: seriesData,
      episodes,
    };

  } catch (error) {
    console.error('VidLink scraping error:', error);
    throw new Error(`Failed to scrape VidLink: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Извлекает данные сериала из встроенного JSON в HTML
 */
function extractSeriesData(html: string): VidLinkSeries | null {
  try {
    // Ищем JSON данные в script тегах
    const scriptMatch = html.match(/self\.__next_f\.push\(\[1,"8:\["([^"]+)"\]/);
    if (!scriptMatch) {
      console.log('No series data found in script tags');
      return null;
    }

    // Декодируем JSON данные
    const jsonData = JSON.parse(`"${scriptMatch[1]}"`);
    const data = JSON.parse(jsonData);

    if (!data || !data[0] || !data[0].data) {
      console.log('Invalid data structure');
      return null;
    }

    const seriesInfo = data[0].data;

    return {
      id: seriesInfo.id?.toString() || '',
      name: seriesInfo.name || 'Unknown Series',
      overview: seriesInfo.overview || '',
      posterPath: seriesInfo.poster_path || '',
      backdropPath: seriesInfo.backdrop_path || '',
      firstAirDate: seriesInfo.first_air_date || '',
      lastAirDate: seriesInfo.last_air_date || '',
      numberOfSeasons: seriesInfo.number_of_seasons || 0,
      numberOfEpisodes: seriesInfo.number_of_episodes || 0,
      genres: seriesInfo.genres || [],
      seasons: seriesInfo.seasons || [],
    };

  } catch (error) {
    console.error('Error extracting series data:', error);
    return null;
  }
}

/**
 * Извлекает эпизоды из HTML (пока возвращает заглушку, так как структура не ясна)
 */
function extractEpisodes(html: string, seasonNumber: number, episodeNumber: number): VidLinkEpisode[] {
  // Пока возвращаем заглушку, так как структура эпизодов в VidLink не ясна
  // В реальном парсере нужно будет найти, где хранятся данные об эпизодах
  return [
    {
      id: `episode-${seasonNumber}-${episodeNumber}`,
      title: `Episode ${episodeNumber}`,
      episodeNumber,
      seasonNumber,
      url: '', // Нужно будет извлечь из HTML
      description: '',
    }
  ];
}

/**
 * Получает прямую ссылку на видео из VidLink
 * @param seriesId - ID сериала
 * @param seasonNumber - Номер сезона
 * @param episodeNumber - Номер эпизода
 * @returns Promise с URL видео
 */
export async function getVidLinkVideoUrl(
  seriesId: string, 
  seasonNumber: number, 
  episodeNumber: number
): Promise<string> {
  try {
    const url = `https://vidlink.pro/tv/${seriesId}/${seasonNumber}/${episodeNumber}`;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': 'https://vidlink.pro/',
    };

    const response = await axios.get(url, {
      headers,
      validateStatus: () => true,
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = response.data;
    
    // Ищем URL видео в HTML (нужно будет адаптировать под реальную структуру)
    const videoUrlMatch = html.match(/(?:src|url)["\s]*[:=]["\s]*([^"'\s]+\.(?:m3u8|mp4|webm))/i);
    
    if (videoUrlMatch) {
      return videoUrlMatch[1];
    }

    // Если не нашли прямую ссылку, возвращаем URL страницы
    return url;

  } catch (error) {
    console.error('Error getting VidLink video URL:', error);
    throw new Error(`Failed to get video URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
