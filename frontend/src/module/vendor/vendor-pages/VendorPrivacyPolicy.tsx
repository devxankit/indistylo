import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';

const privacySections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content:
      'We collect information you provide directly to us, including business details, contact information, payment details, and service-related data necessary for platform operation.',
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    content:
      'We use collected information to provide services, process payments, communicate with you, improve our platform, and comply with legal obligations.',
  },
  {
    icon: Lock,
    title: '3. Data Security',
    content:
      'We implement industry-standard security measures to protect your personal and business information from unauthorized access, alteration, or disclosure.',
  },
  {
    icon: UserCheck,
    title: '4. Information Sharing',
    content:
      'We do not sell your personal information. We may share information with service providers, business partners, or as required by law, always maintaining confidentiality.',
  },
  {
    icon: Shield,
    title: '5. Your Rights',
    content:
      'You have the right to access, update, correct, or delete your personal information. You can also opt-out of certain communications and data processing activities.',
  },
  {
    icon: AlertTriangle,
    title: '6. Cookies and Tracking',
    content:
      'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content and advertisements.',
  },
  {
    icon: Database,
    title: '7. Data Retention',
    content:
      'We retain your information for as long as necessary to provide services and comply with legal obligations. You may request deletion of your data at any time.',
  },
  {
    icon: Shield,
    title: '8. Third-Party Services',
    content:
      'Our platform may contain links to third-party services. We are not responsible for their privacy practices. Please review their privacy policies separately.',
  },
  {
    icon: Lock,
    title: '9. Children\'s Privacy',
    content:
      'Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.',
  },
  {
    icon: UserCheck,
    title: '10. Changes to Privacy Policy',
    content:
      'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notifications.',
  },
];

export function VendorPrivacyPolicy() {
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
            <h2 className="text-lg font-bold text-foreground">Privacy Policy</h2>
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Privacy Matters</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We are committed to protecting your personal information
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At IndiStylo, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our Vendor Platform.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={transitions.quick}
                  >
                    <Icon className="w-5 h-5 text-primary" />
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
            );
          })}
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Our Commitment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are committed to maintaining the highest standards of data protection and
                privacy. Your trust is important to us, and we work continuously to ensure your
                information is secure and used responsibly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitions.smooth, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Privacy concerns? Contact us at{' '}
            <span className="text-primary">privacy@indistylo.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

