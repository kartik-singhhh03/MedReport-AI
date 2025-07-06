import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Shield, Globe, Zap, Users, Award, FileText, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const About: React.FC = () => {
  const { t } = useLanguage()

  const steps = [
    {
      icon: FileText,
      title: 'Upload Your Report',
      description: 'Securely upload your medical report in PDF, JPG, or PNG format. Our system supports various types of medical documents.'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes your report, extracting key medical information and identifying important health indicators.'
    },
    {
      icon: Globe,
      title: 'Simple Explanation',
      description: 'Get easy-to-understand explanations in your preferred language, breaking down complex medical terms into simple words.'
    },
    {
      icon: Heart,
      title: 'Personalized Recommendations',
      description: 'Receive tailored health recommendations, lifestyle suggestions, and guidance for next steps in your healthcare journey.'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your medical data is encrypted and securely stored. We follow strict privacy protocols and never share your information.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our AI model is trained on vast medical literature and can identify patterns and insights from your reports.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Available in English and Hindi, making healthcare information accessible to diverse populations.'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get results within minutes, not days. Our system processes reports quickly while maintaining accuracy.'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Designed for everyone, regardless of technical expertise. Simple interface with clear navigation.'
    },
    {
      icon: Award,
      title: 'Trusted Platform',
      description: 'Developed by healthcare professionals and AI experts to ensure reliability and accuracy.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Making medical reports accessible and understandable for everyone through the power of AI and thoughtful design.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 mb-16 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl md:text-2xl leading-relaxed">
              To democratize healthcare information by making complex medical reports understandable to everyone, 
              empowering patients to make informed decisions about their health.
            </p>
          </div>
        </motion.div>

        {/* How It Works */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.howItWorks')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our simple 4-step process makes understanding your medical reports easy and accessible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 text-center hover:shadow-3xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold px-3 py-1 rounded-full w-fit mx-auto mb-3">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MediSimplify?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with user-centric design to deliver the best experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300"
              >
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-8 border-l-4 border-yellow-400"
        >
          <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
            {t('about.disclaimer')}
          </h3>
          <div className="text-yellow-700 dark:text-yellow-300 space-y-3">
            <p>
              {t('about.disclaimerText')}
            </p>
            <p>
              MediSimplify is designed to help you understand your medical reports better, but it is not a substitute for professional medical advice, diagnosis, or treatment. The AI analysis provided is for educational purposes only and should not be used as the sole basis for medical decisions.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have learned from MediSimplify.
            </p>
            <p>
              If you think you may have a medical emergency, call your doctor or emergency services immediately.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Have Questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're here to help you understand your health better. Contact us if you have any questions or need support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Support
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
              View FAQ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About