import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing and using IndiStylo Vendor Platform, you accept and agree to be bound by the terms and provision of this agreement.',
  },
  {
    title: '2. Vendor Account',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
  },
  {
    title: '3. Service Provision',
    content:
      'As a vendor, you agree to provide services in accordance with the descriptions and standards set forth in your profile and listings.',
  },
  {
    title: '4. Payment Terms',
    content:
      'Payments will be processed according to the payment schedule agreed upon. IndiStylo may deduct service fees as per the agreed terms.',
  },
  {
    title: '5. Cancellation Policy',
    content:
      'Cancellations must be made in accordance with our cancellation policy. Late cancellations may result in penalties.',
  },
  {
    title: '6. Code of Conduct',
    content:
      'Vendors must maintain professional conduct, provide quality services, and comply with all applicable laws and regulations.',
  },
  {
    title: '7. Intellectual Property',
    content:
      'All content, trademarks, and intellectual property on the platform belong to IndiStylo or its licensors.',
  },
  {
    title: '8. Limitation of Liability',
    content:
      'IndiStylo shall not be liable for any indirect, incidental, or consequential damages arising from the use of the platform.',
  },
  {
    title: '9. Termination',
    content:
      'Either party may terminate this agreement at any time. Upon termination, all outstanding obligations must be fulfilled.',
  },
  {
    title: '10. Changes to Terms',
    content:
      'IndiStylo reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.',
  },
];

export function VendorTermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/vendor/profile')}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-xs text-muted-foreground">Last updated: January 2024</p>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Welcome to IndiStylo</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please read these terms carefully before using our platform
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms and Conditions govern your use of the IndiStylo Vendor Platform. By
            registering as a vendor, you agree to comply with and be bound by these terms.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {termsSections.map((section, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="p-2 bg-primary/10 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={transitions.quick}
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Agreement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl"
        >
          <p className="text-sm text-foreground leading-relaxed">
            By continuing to use IndiStylo Vendor Platform, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitions.smooth, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Questions about these terms? Contact us at{' '}
            <span className="text-primary">support@indistylo.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

