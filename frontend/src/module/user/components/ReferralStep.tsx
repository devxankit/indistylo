import type { ReactNode } from "react"

interface ReferralStepProps {
  stepNumber: number
  icon: ReactNode
  title: string
  description: string
  highlightedText?: string[]
}

export function ReferralStep({ stepNumber, icon, title, description, highlightedText = [] }: ReferralStepProps) {
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
    <div className="flex gap-4 items-start">
      {/* Step Icon */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-yellow-400/10 border-2 border-yellow-400/30 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-[#060606]">
          {stepNumber}
        </span>
      </div>

      {/* Step Content */}
      <div className="flex-1 pt-1 text-left">
        <h3 className="text-base font-bold text-[#f5f5f5] mb-2 text-left">
          {renderTextWithHighlights(title, highlightedText)}
        </h3>
        <p className="text-sm text-[#f5f5f5]/80 leading-relaxed text-left">{description}</p>
      </div>
    </div>
  )
}

