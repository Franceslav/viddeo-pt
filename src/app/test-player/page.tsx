'use client'

import PlayerJS from '../(pages)/gallery/video/_components/playerjs'

export default function TestPlayerPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Тест PlayerJS</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест с MP4 видео</h2>
          <PlayerJS 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            title="Big Buck Bunny"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест с HLS (.m3u8)</h2>
          <PlayerJS 
            src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            title="HLS Test Stream"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест без видео (ошибка)</h2>
          <PlayerJS 
            src=""
            title="No Video"
          />
        </div>
      </div>
    </div>
  )
}
