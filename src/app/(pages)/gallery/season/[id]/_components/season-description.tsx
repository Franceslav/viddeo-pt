'use client'

const SeasonDescription = ({ description }: { description: string }) => {
  return (
    <p className="text-sm text-white line-clamp-2 md:line-clamp-3">
      {description}
    </p>
  )
}

export default SeasonDescription
