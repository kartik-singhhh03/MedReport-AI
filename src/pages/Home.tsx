import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { 
  Activity, 
  Brain, 
  Zap, 
  Shield, 
  ArrowRight, 
  FileText, 
  Stethoscope,
  Microscope,
  Heart,
  Cpu,
  Scan,
  TrendingUp
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const Home: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const features = [
    {
      icon: Brain,
      title: '🧠 Smart Report Parsing',
      description: 'Use OCR and NLP to extract structured data from prescriptions, blood tests, and radiology reports.',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Stethoscope,
      title: '🩺 Disease Prediction Engine',
      description: 'Get AI predictions based on symptoms and history using pretrained models.',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: Microscope,
      title: '💊 Personalized Suggestions',
      description: 'Recommend medicines, tests, and specialists based on patient\'s data trail.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Shield,
      title: '🔒 Privacy First',
      description: 'End-to-end encryption with HIPAA compliance and secure data handling.',
      gradient: 'from-orange-400 to-red-500'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Reports Analyzed', icon: FileText },
    { number: '98.5%', label: 'Accuracy Rate', icon: TrendingUp },
    { number: '15+', label: 'Disease Categories', icon: Heart },
    { number: '24/7', label: 'AI Available', icon: Cpu }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-cyan-400/30"
        >
          <Activity size={40} />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-32 text-purple-400/30"
        >
          <Heart size={32} />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-32 text-green-400/30"
        >
          <Scan size={36} />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6 backdrop-blur-sm border border-cyan-500/30">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                MedReport AI
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-cyan-300 mb-4 font-medium">
              Decode Your Health – Smarter, Faster, Safer.
            </p>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered medical report analyzer with disease prediction and smart recommendations. 
              Transform complex medical data into actionable health insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Upload Report</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl text-cyan-300 font-semibold text-lg hover:bg-slate-700/50 transition-all duration-300">
              Try Sample Report
            </button>
          </motion.div>

          {/* 3D Animated Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 backdrop-blur-sm border border-cyan-500/30"
                >
                  <FileText className="h-12 w-12 text-cyan-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Upload</h3>
                  <p className="text-slate-300 text-sm">Scan medical reports</p>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/30"
                >
                  <Brain className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Analyze</h3>
                  <p className="text-slate-300 text-sm">AI processes data</p>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-green-500/30"
                >
                  <Zap className="h-12 w-12 text-green-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Insights</h3>
                  <p className="text-slate-300 text-sm">Get recommendations</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group-hover:scale-105">
                  <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced AI Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Cutting-edge technology meets healthcare to deliver unprecedented insights from your medical data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 h-full">
                  <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-12 border border-cyan-500/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start with Your First Smart Report
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already making informed health decisions with AI-powered insights.
            </p>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Brain className="h-6 w-6" />
              <span>Launch Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              No signup needed. Privacy guaranteed.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home