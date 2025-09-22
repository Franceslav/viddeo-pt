# API Endpoints для Video Platform

## 🎬 Видео API

### Добавить видео
```http
POST /api/videos
Content-Type: application/json

{
  "title": "Название видео",
  "description": "Описание видео",
  "url": "https://example.com/video.mp4",
  "userId": "user_id_here"
}
```

**Ответ:**
```json
{
  "success": true,
  "video": {
    "id": "video_id",
    "title": "Название видео",
    "description": "Описание видео",
    "url": "https://example.com/video.mp4",
    "userId": "user_id_here",
    "views": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Получить все видео
```http
GET /api/videos
```

**Ответ:**
```json
{
  "success": true,
  "videos": [
    {
      "id": "video_id",
      "title": "Название видео",
      "description": "Описание видео",
      "url": "https://example.com/video.mp4",
      "userId": "user_id_here",
      "views": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "name": "Имя пользователя",
        "email": "email@example.com"
      }
    }
  ]
}
```

## 📺 Сезоны API

### Добавить сезон
```http
POST /api/seasons
Content-Type: application/json

{
  "title": "Название сезона",
  "description": "Описание сезона (необязательно)",
  "seasonNumber": 1,
  "image": "https://example.com/image.jpg" // необязательно
}
```

**Ответ:**
```json
{
  "success": true,
  "season": {
    "id": "season_id",
    "title": "Название сезона",
    "description": "Описание сезона",
    "seasonNumber": 1,
    "isActive": true,
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Получить все сезоны
```http
GET /api/seasons
```

**Ответ:**
```json
{
  "success": true,
  "seasons": [
    {
      "id": "season_id",
      "title": "Название сезона",
      "description": "Описание сезона",
      "seasonNumber": 1,
      "isActive": true,
      "image": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "episodes": [
        {
          "id": "episode_id",
          "title": "Название эпизода",
          "episodeNumber": 1,
          "likes": []
        }
      ]
    }
  ]
}
```

## 🎞️ Эпизоды API

### Добавить эпизод
```http
POST /api/episodes
Content-Type: application/json

{
  "title": "Название эпизода",
  "description": "Описание эпизода",
  "url": "https://example.com/episode.mp4",
  "episodeNumber": 1,
  "seasonId": "season_id_here",
  "userId": "user_id_here",
  "image": "https://example.com/image.jpg" // необязательно
}
```

**Ответ:**
```json
{
  "success": true,
  "episode": {
    "id": "episode_id",
    "title": "Название эпизода",
    "description": "Описание эпизода",
    "url": "https://example.com/episode.mp4",
    "episodeNumber": 1,
    "seasonId": "season_id_here",
    "season": {
      "id": "season_id",
      "title": "Название сезона"
    },
    "userId": "user_id_here",
    "user": {
      "name": "Имя пользователя",
      "email": "email@example.com"
    },
    "image": "https://example.com/image.jpg",
    "views": 0,
    "likes": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Получить все эпизоды
```http
GET /api/episodes
```

### Получить эпизоды конкретного сезона
```http
GET /api/episodes?seasonId=season_id_here
```

**Ответ:**
```json
{
  "success": true,
  "episodes": [
    {
      "id": "episode_id",
      "title": "Название эпизода",
      "description": "Описание эпизода",
      "url": "https://example.com/episode.mp4",
      "episodeNumber": 1,
      "seasonId": "season_id_here",
      "season": {
        "id": "season_id",
        "title": "Название сезона"
      },
      "userId": "user_id_here",
      "user": {
        "name": "Имя пользователя",
        "email": "email@example.com"
      },
      "image": "https://example.com/image.jpg",
      "views": 0,
      "likes": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 📁 Загрузка изображений

### Загрузить изображение
```http
POST /api/upload
Content-Type: multipart/form-data

file: [image file]
```

**Ответ:**
```json
{
  "success": true,
  "url": "/uploads/1234567890.jpg",
  "filename": "1234567890.jpg"
}
```

## 🔗 TRPC API

Также доступны все роутеры через TRPC:

- `/api/trpc` - основной TRPC endpoint
- `video.getVideos()` - получить все видео
- `video.getVideo({id})` - получить видео по ID
- `season.getSeasons()` - получить все сезоны
- `season.getSeason({id})` - получить сезон по ID
- `episode.getEpisodes()` - получить все эпизоды
- `episode.getEpisode({id})` - получить эпизод по ID

## 🧪 Тестирование

Для тестирования API используйте:

```bash
# Запустить сервер разработки
npm run dev

# Запустить тестовый скрипт (в другом терминале)
node test-api.js
```

## 🌐 Веб-интерфейс

После добавления контента через API, он будет доступен в веб-интерфейсе:

- `/gallery` - галерея с вкладками "Видео" и "Сезоны"
- `/gallery/video/[id]` - просмотр видео
- `/gallery/season/[id]` - просмотр сезона с эпизодами
- `/gallery/episode/[id]` - просмотр эпизода
- `/admin` - админ-панель для управления контентом
