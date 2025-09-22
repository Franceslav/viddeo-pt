'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const SeasonDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 150 // Максимальная длина для мобильной версии
  
  if (description.length <= maxLength) {
    return <p className="text-white">{description}</p>
  }

  return (
    <div>
      <p className="text-white">
        {isExpanded ? description : `${description.substring(0, maxLength)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-yellow-400 hover:text-yellow-300 p-0 h-auto"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Свернуть
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Читать полностью
          </>
        )}
      </Button>
    </div>
  )
}

export default SeasonDescription
