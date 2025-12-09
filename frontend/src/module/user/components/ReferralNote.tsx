interface ReferralNoteProps {
  text: string
  highlightedText?: string[]
}

export function ReferralNote({ text, highlightedText = [] }: ReferralNoteProps) {
  const renderTextWithHighlights = (text: string, highlights: string[]) => {
    if (highlights.length === 0) return text

    let parts = [text]
    highlights.forEach((highlight) => {
      const newParts: string[] = []
      parts.forEach((part) => {
        const index = part.indexOf(highlight)
        if (index !== -1) {
          newParts.push(part.substring(0, index))
          newParts.push(highlight)
          newParts.push(part.substring(index + highlight.length))
        } else {
          newParts.push(part)
        }
      })
      parts = newParts
    })

    return parts.map((part, index) => {
      const isHighlighted = highlights.some((h) => h === part)
      return isHighlighted ? (
        <span key={index} className="text-yellow-400 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    })
  }

  return (
    <div className="bg-[#202020] border border-[#3a3a3a] rounded-lg p-4">
      <h4 className="text-sm font-semibold text-[#f5f5f5] mb-2">Note:</h4>
      <p className="text-sm text-[#f5f5f5]/80 leading-relaxed">
        {renderTextWithHighlights(text, highlightedText)}
      </p>
    </div>
  )
}

