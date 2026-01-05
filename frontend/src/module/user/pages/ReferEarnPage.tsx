import { ReferEarnHeader } from '../components/ReferEarnHeader'
import { ReferralStep } from '../components/ReferralStep'
import { ReferralNote } from '../components/ReferralNote'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Building2, Scissors, Smartphone, Percent, IndianRupee } from 'lucide-react'
import { useContentStore } from '@/module/admin/store/useContentStore'

export function ReferEarnPage() {
  const { referralConfig } = useContentStore();

  const icons = [
    (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="flex items-center gap-0.5">
          <div className="w-3 h-5 bg-yellow-400/30 rounded-sm"></div>
          <div className="relative">
            <Smartphone className="w-5 h-5 text-yellow-400" />
            <IndianRupee className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-400" />
          </div>
          <div className="w-3 h-5 bg-yellow-400/30 rounded-sm"></div>
        </div>
      </div>
    ),
    (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-5 bg-yellow-400/30 rounded-sm"></div>
          <div className="relative">
            <Smartphone className="w-5 h-5 text-yellow-400" />
            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>
    ),
    (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <Building2 className="w-7 h-7 text-yellow-400" />
      </div>
    ),
    (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <Scissors className="w-6 h-6 text-yellow-400" />
        <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border border-[#060606]">
          <Percent className="w-2.5 h-2.5 text-black" />
        </div>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-yellow-400 font-bold">0%</span>
      </div>
    )
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5f5f5] relative z-10">
      <ReferEarnHeader />

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Offer Note */}
        <p className="text-sm text-[#f5f5f5]/80">This offer only apply to Dasho Salons.</p>

        {/* Steps */}
        <div className="space-y-6">
          {referralConfig.steps.map((step, index) => (
            <ReferralStep
              key={step.id}
              stepNumber={index + 1}
              icon={icons[index] || icons[0]}
              title={step.title}
              description={step.description}
              highlightedText={[]}
            />
          ))}
        </div>

        {/* Note Section */}
        <ReferralNote
          text={referralConfig.termsNote}
          highlightedText={['one free haircut', 'first free haircut']}
        />

      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#060606] z-30">
        <Button
          className="w-full h-12 bg-[#151515] text-white hover:bg-[#202020] font-semibold text-base rounded-lg border-0"
          onClick={() => {
            // Handle "Give One Now" action
            console.log('Give One Now clicked')
          }}
        >
          GIVE ONE NOW
        </Button>
      </div>
    </div>
  )
}


