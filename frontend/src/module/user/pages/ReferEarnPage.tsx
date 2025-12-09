import { ReferEarnHeader } from '../components/ReferEarnHeader'
import { ReferralStep } from '../components/ReferralStep'
import { ReferralNote } from '../components/ReferralNote'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Building2, Scissors, Smartphone, Percent, IndianRupee } from 'lucide-react'

export function ReferEarnPage() {
  const steps = [
    {
      stepNumber: 1,
      icon: (
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
      title: 'Step 1 Give One Now (Refer Your Friend)',
      description: 'Get a free haircut and Platinum Discounted Price.',
      highlightedText: ['Give One Now', 'Refer Your Friend'],
    },
    {
      stepNumber: 2,
      icon: (
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
      title: 'Step 2 Your Friend Will Book Free Hair Cut.',
      description: 'Your friend will sign up using referral link & book free hair cut.',
      highlightedText: ['Your Friend Will Book Free Hair Cut'],
    },
    {
      stepNumber: 3,
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-yellow-400" />
        </div>
      ),
      title: 'Step 3 You Get Free Hair Cut',
      description: 'Upon completion of your friends first booking, you will get a free hair cut.',
      highlightedText: ['You Get Free Hair Cut'],
    },
    {
      stepNumber: 4,
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Scissors className="w-6 h-6 text-yellow-400" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border border-[#060606]">
            <Percent className="w-2.5 h-2.5 text-black" />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-yellow-400 font-bold">0%</span>
        </div>
      ),
      title: 'Step 4 Earn IndiStylo Points (ISP)',
      description: 'You will earn ISP and platinum discounted offers.',
      highlightedText: ['Earn IndiStylo Points (ISP)'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5f5f5] relative z-10">
      <ReferEarnHeader />

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Offer Note */}
        <p className="text-sm text-[#f5f5f5]/80">This offer only apply to Dasho Salons.</p>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <ReferralStep
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
              highlightedText={step.highlightedText}
            />
          ))}
        </div>

        {/* Note Section */}
        <ReferralNote
          text={`You are entitled to one free haircut through our "Give One, Get One" offer. After your first free haircut, you'll receive a free ISP with every referral.`}
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

