// Тестовый скрипт для проверки API endpoints
const BASE_URL = 'http://localhost:3000/api'

async function testAPI() {
  console.log('🧪 Тестирование API endpoints...\n')

  // Тест 1: Добавление видео
  console.log('1️⃣ Тестируем добавление видео...')
  try {
    const videoResponse = await fetch(`${BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Еще видео на платформе",
        description: "Еще одно видео",
        url: "https://res.cloudinary.com/drysqeckp/video/upload/v1758292003/samples/dance-2.mp4",
        userId: "68cd5083cc68d605646fe95e"
      })
    })
    
    const videoResult = await videoResponse.json()
    console.log('✅ Видео добавлено:', videoResult.success ? 'SUCCESS' : 'FAILED')
    if (!videoResult.success) console.log('❌ Ошибка:', videoResult.error)
  } catch (error) {
    console.log('❌ Ошибка при добавлении видео:', error.message)
  }

  // Тест 2: Получение всех видео
  console.log('\n2️⃣ Тестируем получение всех видео...')
  try {
    const videosResponse = await fetch(`${BASE_URL}/videos`)
    const videosResult = await videosResponse.json()
    console.log('✅ Видео получены:', videosResult.success ? 'SUCCESS' : 'FAILED')
    if (videosResult.success) {
      console.log(`📹 Найдено видео: ${videosResult.videos.length}`)
    } else {
      console.log('❌ Ошибка:', videosResult.error)
    }
  } catch (error) {
    console.log('❌ Ошибка при получении видео:', error.message)
  }

  // Тест 3: Добавление сезона
  console.log('\n3️⃣ Тестируем добавление сезона...')
  try {
    const seasonResponse = await fetch(`${BASE_URL}/seasons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Тестовый сезон",
        description: "Описание тестового сезона",
        seasonNumber: 1
      })
    })
    
    const seasonResult = await seasonResponse.json()
    console.log('✅ Сезон добавлен:', seasonResult.success ? 'SUCCESS' : 'FAILED')
    if (!seasonResult.success) console.log('❌ Ошибка:', seasonResult.error)
  } catch (error) {
    console.log('❌ Ошибка при добавлении сезона:', error.message)
  }

  // Тест 4: Получение всех сезонов
  console.log('\n4️⃣ Тестируем получение всех сезонов...')
  try {
    const seasonsResponse = await fetch(`${BASE_URL}/seasons`)
    const seasonsResult = await seasonsResponse.json()
    console.log('✅ Сезоны получены:', seasonsResult.success ? 'SUCCESS' : 'FAILED')
    if (seasonsResult.success) {
      console.log(`📺 Найдено сезонов: ${seasonsResult.seasons.length}`)
    } else {
      console.log('❌ Ошибка:', seasonsResult.error)
    }
  } catch (error) {
    console.log('❌ Ошибка при получении сезонов:', error.message)
  }

  console.log('\n🎉 Тестирование завершено!')
}

// Запускаем тесты
testAPI().catch(console.error)
