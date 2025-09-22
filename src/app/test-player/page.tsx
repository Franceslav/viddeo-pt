'use client'

import PlayerJS from '../(pages)/gallery/video/_components/playerjs'

export default function TestPlayerPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Тест PlayerJS</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест с несколькими плеерами (как на Kinogo)</h2>
          <PlayerJS 
            src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
            title="Sample Video"
            showPlayerSelector={true}
            sources={[
              {
                url: "https://www.w3schools.com/html/mov_bbb.mp4",
                label: "Плеер 2",
                type: "mp4"
              },
              {
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                label: "Плеер 3 (HLS)",
                type: "hls"
              }
            ]}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест с одним плеером</h2>
          <PlayerJS 
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            title="W3Schools Video"
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
          <h2 className="text-lg font-semibold mb-2">Тест с YouTube видео</h2>
          <PlayerJS 
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title="YouTube Video"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Тест с Vimeo видео</h2>
          <PlayerJS 
            src="https://vimeo.com/148751763"
            title="Vimeo Video"
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
