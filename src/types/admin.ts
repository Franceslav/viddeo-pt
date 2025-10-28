export interface Like {
  id: string
  userId: string
  videoId: string | null
  episodeId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Season {
  id: string
  title: string
  description: string | null
  seasonNumber: number
  isActive: boolean
  image: string | null
  episodes: Episode[]
  createdAt: Date
  updatedAt: Date
}

export interface Episode {
  id: string
  title: string
  description: string
  url: string
  episodeNumber: number
  image: string | null
  seasonId: string
  season: Season
  userId: string
  user: {
    name: string | null
    email: string | null
  }
  views: number
  likes: Like[]
  createdAt: Date
  updatedAt: Date
}

// Типы для TRPC ответов (без циклических зависимостей)
export interface SeasonBasic {
  id: string
  title: string
  description: string | null
  seasonNumber: number
  isActive: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SeasonWithEpisodes {
  id: string
  title: string
  description: string | null
  seasonNumber: number
  isActive: boolean
  image: string | null
  episodes: EpisodeBasic[]
  createdAt: Date
  updatedAt: Date
}

export interface EpisodeBasic {
  id: string
  title: string
  description: string | null
  url: string
  episodeNumber: number
  image: string | null
  seasonId: string
  userId: string
  views: number
  createdAt: Date
  updatedAt: Date
}

// Типы для данных, возвращаемых роутерами
export interface SeasonWithEpisodesFromRouter {
  id: string
  title: string
  description: string | null
  seasonNumber: number
  isActive: boolean
  image: string | null
  episodes: EpisodeBasic[]
  createdAt: Date
  updatedAt: Date
}

export interface EpisodeWithSeasonFromRouter {
  id: string
  title: string
  description: string | null
  url: string
  episodeNumber: number
  image: string | null
  seasonId: string
  season: SeasonBasic
  userId: string
  user: {
    name: string | null
    email: string | null
  }
  views: number
  likes: Like[]
  createdAt: Date
  updatedAt: Date
}

export interface EpisodeWithSeason {
  id: string
  title: string
  description: string | null
  url: string
  episodeNumber: number
  image: string | null
  seasonId: string
  season: SeasonBasic
  userId: string
  user: {
    name: string | null
    email: string | null
  }
  views: number
  likes: Like[]
  createdAt: Date
  updatedAt: Date
}
