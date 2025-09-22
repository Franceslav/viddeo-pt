'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SeasonDescription = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false)
  const showToggle = description.length > 140

  return (
    <div>
      <p className={`text-sm text-white ${expanded ? '' : 'line-clamp-2 md:line-clamp-3'}`}>
        {description}
      </p>
      {showToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((s) => !s)}
          className="mt-2 text-yellow-400 hover:text-yellow-300 p-0 h-auto"
          aria-expanded={expanded}
        >
          {expanded ? (
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
      )}
    </div>
  )
}

export default SeasonDescription
