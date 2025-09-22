// Тестовый скрипт для создания сезонов и эпизодов
const BASE_URL = 'http://localhost:3003/api'

async function createTestData() {
  console.log('🧪 Создаем тестовые данные...\n')

  try {
    // 1. Создаем сезон
    console.log('1️⃣ Создаем сезон...')
    const seasonResponse = await fetch(`${BASE_URL}/seasons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Тестовый сезон 1",
        description: "Это тестовый сезон для проверки функциональности",
        seasonNumber: 1
      })
    })
    
    const seasonResult = await seasonResponse.json()
    console.log('✅ Сезон создан:', seasonResult.success ? 'SUCCESS' : 'FAILED')
    if (!seasonResult.success) {
      console.log('❌ Ошибка:', seasonResult.error)
      return
    }
    
    const seasonId = seasonResult.season.id
    console.log('📺 ID сезона:', seasonId)

    // 2. Создаем несколько эпизодов
    console.log('\n2️⃣ Создаем эпизоды...')
    const episodes = [
      {
        title: "Эпизод 1: Начало",
        description: "Первый эпизод тестового сезона",
        episodeNumber: 1,
        url: "https://res.cloudinary.com/drysqeckp/video/upload/v1758292003/samples/dance-1.mp4"
      },
      {
        title: "Эпизод 2: Развитие",
        description: "Второй эпизод тестового сезона",
        episodeNumber: 2,
        url: "https://res.cloudinary.com/drysqeckp/video/upload/v1758292003/samples/dance-2.mp4"
      },
      {
        title: "Эпизод 3: Кульминация",
        description: "Третий эпизод тестового сезона",
        episodeNumber: 3,
        url: "https://res.cloudinary.com/drysqeckp/video/upload/v1758292003/samples/dance-3.mp4"
      }
    ]

    for (const episode of episodes) {
      console.log(`   Создаем ${episode.title}...`)
      const episodeResponse = await fetch(`${BASE_URL}/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...episode,
          seasonId: seasonId,
          userId: "68cd5083cc68d605646fe95e"
        })
      })
      
      const episodeResult = await episodeResponse.json()
      console.log(`   ✅ ${episode.title}:`, episodeResult.success ? 'SUCCESS' : 'FAILED')
      if (!episodeResult.success) {
        console.log(`   ❌ Ошибка:`, episodeResult.error)
      }
    }

    // 3. Проверяем, что сезон создался с эпизодами
    console.log('\n3️⃣ Проверяем созданный сезон...')
    const checkResponse = await fetch(`${BASE_URL}/seasons`)
    const checkResult = await checkResponse.json()
    
    if (checkResult.success) {
      const testSeason = checkResult.seasons.find(s => s.id === seasonId)
      if (testSeason) {
        console.log(`✅ Сезон найден: ${testSeason.title}`)
        console.log(`📊 Эпизодов в сезоне: ${testSeason.episodes.length}`)
        console.log(`🔗 URL для просмотра: http://localhost:3003/gallery/season/${seasonId}`)
      } else {
        console.log('❌ Сезон не найден')
      }
    } else {
      console.log('❌ Ошибка при проверке сезонов:', checkResult.error)
    }

  } catch (error) {
    console.log('❌ Общая ошибка:', error.message)
  }

  console.log('\n🎉 Тестирование завершено!')
  console.log('\n🌐 Откройте в браузере:')
  console.log('   - http://localhost:3003/gallery - галерея')
  console.log('   - http://localhost:3003/gallery/season/[season_id] - конкретный сезон')
}

// Запускаем создание тестовых данных
createTestData().catch(console.error)
