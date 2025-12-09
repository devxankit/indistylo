interface MembershipBonusCardProps {
  date: string
  time: string
  points: number
}

export function MembershipBonusCard({ date, time, points }: MembershipBonusCardProps) {
  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(points >= 995 ? 0 : 1)}k IndiStylo Points`
    }
    return `${points} IndiStylo Points`
  }

  return (
    <div className="bg-[#202020] border border-[#3a3a3a] rounded-lg p-4 mx-4">
      <div className="text-left">
        <h3 className="text-sm font-semibold text-[#f5f5f5] mb-2">Membership Bonus</h3>
        <p className="text-xs text-[#f5f5f5]/60 mb-2">
          {date}, {time}
        </p>
        <p className="text-sm font-medium text-yellow-400">{formatPoints(points)}</p>
      </div>
    </div>
  )
}

