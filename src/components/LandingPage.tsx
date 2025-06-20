'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Code2, 
  Zap, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  Ticket, 
  Database, 
  Clock,
  Bell,
  BarChart3,
  Settings,
  Github,
  Twitter,
  Linkedin,
  Sparkles,
  Cpu,
  Server,
  Terminal,
  Code
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const botRef = useRef(null);
  
  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Update scroll position for effects
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollY(latest * 100);
  });

  // Bot animation based on scroll
  const botScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const botOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.2]);
  const botY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Domain-Specific Chatbot",
      description: "AI trained specifically for API documentation and support queries"
    },
    {
      icon: <Ticket className="w-8 h-8" />,
      title: "Auto Ticket Escalation",
      description: "Seamlessly escalates complex queries to human support"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "API Knowledge Layer",
      description: "Deep understanding of API endpoints, parameters, and responses"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Context Retention",
      description: "Maintains conversation context for better support experience"
    }
  ];

  const bonusFeatures = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Admin Alerts",
      description: "Real-time notifications for support team"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Session Tracking",
      description: "Comprehensive analytics and insights"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Auto-Escalation Timers",
      description: "Smart timing for ticket escalation"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Structured Prompts",
      description: "Optimized AI prompts for better responses"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Ticket Status",
      description: "Real-time status tracking and updates"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "API Health",
      description: "Monitor API status and performance"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "User Query",
      description: "Developer asks a question about API usage or encounters an issue"
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Chatbot analyzes query against comprehensive API knowledge base"
    },
    {
      number: "03",
      title: "Smart Response",
      description: "Provides instant, accurate answers or escalates to human support"
    },
    {
      number: "04",
      title: "Ticket Creation",
      description: "Automatically generates support ticket if escalation is needed"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative"
    >
      {/* Animated Bot Background - Fixed Position */}
      <motion.div
        ref={botRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          scale: botScale,
          opacity: botOpacity,
          y: botY
        }}
      >
        <img 
          src="/image/bot.png" 
          alt="AI Bot Background" 
          className="w-full h-full object-cover object-center"
          style={{
            opacity: 0.1 - (scrollY * 0.001),
            transform: `rotate(${scrollY * 0.2}deg)`
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.8 - (scrollY * 0.008)
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 backdrop-blur-md bg-black/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            MeetYourAPI
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors hover:underline hover:underline-offset-8">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors hover:underline hover:underline-offset-8">
            How It Works
          </Link>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 flex items-center justify-center min-h-screen px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-mono text-cyan-400">INTRODUCING THE FUTURE OF API SUPPORT</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-mono font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
          >
            MeetYourAPI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl mb-4 text-gray-300 font-light"
          >
            Smart Support. <span className="text-cyan-400">Instant Answers.</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 mb-12 max-w-2xl"
          >
            AI-powered chatbot and support ticketing system built specifically for APIhub users. 
            Get instant answers or seamless escalation to human support.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Try the Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-cyan-500/50 rounded-xl font-semibold text-lg hover:bg-cyan-500/10 hover:border-cyan-500 transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
            >
              <Cpu className="w-5 h-5" />
              View Features
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
<motion.section 
  id="features" 
  className="relative z-20 min-h-screen py-32 px-6 bg-black/90"
>
  <div className="max-w-7xl mx-auto w-full">
    <motion.div 
  initial={{ opacity: 0, y: 40 }}
  whileInView={{
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      mass: 0.5,
      stiffness: 100,
      damping: 10,
      delay: 0.1
    }
  }}
  viewport={{ 
    once: true,
    margin: "-100px 0px -50px 0px" // Triggers animation earlier
  }}
  className="text-center mb-20 relative"
>
  {/* Title */}
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2
      }
    }}
    className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
  >
    Core Features
  </motion.h2>

  {/* Subtitle */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.4
      }
    }}
    className="text-lg text-gray-300 max-w-2xl mx-auto"
  >
    Powerful tools designed specifically for API support and documentation
  </motion.p>

  {/* Underline */}
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.6
      }
    }}
    className="mt-6 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400 origin-left"
  />
</motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
      {features.map((feature, index) => {
        // Animation parameters for each box
        const floatDistance = 15;
        const floatDuration = 8 + index * 0.5;
        const floatDelay = index * 0.3;
        
        return (
          <motion.div
            key={index}
            className="group p-10 rounded-2xl backdrop-blur-sm bg-black/40 border border-white/10 transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: floatDelay }
            }}
            animate={{
              y: [0, -floatDistance, 0, floatDistance, 0],
              x: [0, index % 2 === 0 ? floatDistance/2 : -floatDistance/2, 0, index % 2 === 0 ? -floatDistance/2 : floatDistance/2, 0],
            }}
            transition={{
              y: {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: floatDuration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay
              }
            }}
            whileHover={{
              scale: 1.05,
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(34, 211, 238, 0.2), 0 10px 10px -5px rgba(168, 85, 247, 0.1)",
              transition: { duration: 0.3 }
            }}
            viewport={{ once: true }}
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-sm"></div>
            </div>

            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center mb-8 mx-auto relative z-10"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 0 25px rgba(34, 211, 238, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              {feature.icon}
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            <h3 className="text-2xl font-semibold mb-4 text-cyan-400 relative z-10 group-hover:text-white transition-colors duration-300">
              {feature.title}
            </h3>
            
            <p className="text-gray-400 text-lg relative z-10 group-hover:text-gray-200 transition-colors duration-300">
              {feature.description}
            </p>

            {/* Animated underline on hover */}
            <div className="relative mt-6">
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</motion.section>

      {/* How It Works Section */}
<motion.section 
  id="how-it-works" 
  className="relative z-30 min-h-screen py-32 px-6 bg-black/95 flex items-center"
>
  <div className="max-w-7xl mx-auto w-full">
    {/* Title & Subtitle - Matching Features Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.1
        }
      }}
      // viewport={{ margin: "-100px 0px -50px 0px" }}
      className="text-center mb-20 relative"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        How It Works
      </h2>
      
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ 
          width: "100%",
          transition: { 
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4
          }
        }}
        className="mx-auto overflow-hidden"
        style={{ maxWidth: "36rem" }}
      >
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ 
            opacity: 1,
            x: 0,
            transition: { 
              delay: 0.7,
              duration: 0.6,
              ease: "easeOut"
            }
          }}
          className="text-lg md:text-xl text-gray-300 font-light tracking-wide"
        >
          A seamless integration between AI and human support
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ 
          scaleX: 1,
          transition: {
            delay: 0.9,
            duration: 1,
            ease: [0.22, 1, 0.36, 1]
          }
        }}
        className="mt-8 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400 origin-center mx-auto"
        style={{ width: "min(70%, 280px)" }}
      />
    </motion.div>

    {/* Dynamic Circles Section */}
    <div className="relative">
      {/* Animated connector line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute hidden lg:block h-[3px] bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 top-1/2 left-0 right-0 -translate-y-1/2 origin-left"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="relative flex flex-col items-center text-center z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.15,
                type: "spring"
              }
            }}
          >
            {/* Interactive Circle */}
            <motion.div
              className="w-32 h-32 rounded-full mb-8 bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center font-mono font-bold text-3xl text-white cursor-pointer relative overflow-hidden"
              whileHover={{
                scale: 1.1,
                rotate: 10,
                boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)"
              }}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 4 + index,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              {/* Number with floating particles */}
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 10px rgba(255,255,255,0.5)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                {step.number}
              </motion.span>
              
              {/* Floating particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/80"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 40 - 20,
                    y: Math.random() * 40 - 20
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 5,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  style={{
                    width: `${Math.random() * 6 + 3}px`,
                    height: `${Math.random() * 6 + 3}px`,
                  }}
                />
              ))}
            </motion.div>

            <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
              {step.title}
            </h3>
            <p className="text-gray-300 text-lg">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</motion.section>

      {/* Bonus Features Section */}
<motion.section 
  className="relative z-40 min-h-screen py-32 px-6 bg-black/90 flex items-center"
>
  <div className="max-w-7xl mx-auto w-full">
    {/* Title & Subtitle - Matching Features Section Style */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.1
        }
      }}
      viewport={{ margin: "-100px 0px -50px 0px" }}
      className="text-center mb-20 relative"
    >
      {/* Glowing background effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ 
          scale: 1,
          opacity: 0.1,
          transition: { duration: 1.2, ease: "easeOut", delay: 0.3 }
        }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/40 via-purple-500/10 to-transparent blur-xl -z-10"
      />

      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Bonus Features
      </h2>
      
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ 
          width: "100%",
          transition: { 
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4
          }
        }}
        className="mx-auto overflow-hidden"
        style={{ maxWidth: "36rem" }}
      >
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ 
            opacity: 1,
            x: 0,
            transition: { 
              delay: 0.7,
              duration: 0.6,
              ease: "easeOut"
            }
          }}
          className="text-lg md:text-xl text-gray-300 font-light tracking-wide"
        >
          Additional capabilities that enhance your support experience
        </motion.p>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ 
          scaleX: 1,
          transition: {
            delay: 0.9,
            duration: 1,
            ease: [0.22, 1, 0.36, 1]
          }
        }}
        className="mt-8 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400 origin-center mx-auto"
        style={{ width: "min(70%, 280px)" }}
      />
    </motion.div>

    {/* Enhanced Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {bonusFeatures.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 90,
              damping: 12,
              delay: index * 0.07,
              duration: 0.8
            }
          }}
          viewport={{ 
            once: true,
            margin: "-30px 0px -70px 0px" // Triggers animation earlier
          }}
          className="group p-8 rounded-2xl backdrop-blur-sm bg-black/40 border border-white/10 hover:border-purple-500/50 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10"
        >
          {/* Animated Icon Container */}
          <motion.div
            whileHover={{ 
              rotate: 10,
              scale: 1.1
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 mx-auto relative overflow-hidden"
          >
            {feature.icon}
            {/* Particle effect */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/70"
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: Math.random() * 30 - 15,
                  y: Math.random() * 30 - 15
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  x: [
                    Math.random() * 30 - 15, 
                    Math.random() * 40 - 20,
                    Math.random() * 30 - 15
                  ],
                  y: [
                    Math.random() * 30 - 15,
                    Math.random() * 40 - 20,
                    Math.random() * 30 - 15
                  ]
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                }}
              />
            ))}
          </motion.div>

          <h3 className="text-xl font-semibold mb-3 text-purple-400 group-hover:text-cyan-300 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-300 group-hover:text-gray-100 transition-colors">
            {feature.description}
          </p>
          
          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 w-full group-hover:opacity-100 opacity-0 transition-opacity duration-300"
          />
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      {/* CTA Section */}
<motion.section 
  className="relative z-50 min-h-screen py-32 px-6 bg-gradient-to-t from-black to-gray-900/90 flex items-center overflow-hidden"
>
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ 
        scale: 1,
        opacity: 0.1,
        transition: { duration: 1.5 }
      }}
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/30 via-purple-500/10 to-transparent blur-2xl"
    />
    <motion.div
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute inset-0 bg-[url('/image/grid-pattern.svg')] opacity-10 bg-[length:200px_200px]"
    />
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-cyan-400/20"
        initial={{
          scale: 0,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50
        }}
        animate={{
          scale: [0, Math.random() + 0.5, 0],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          delay: i * 2
        }}
        style={{
          width: `${Math.random() * 200 + 100}px`,
          height: `${Math.random() * 200 + 100}px`,
        }}
      />
    ))}
  </div>
  
  <div className="max-w-4xl mx-auto text-center relative z-10">
    {/* Title with floating particles */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.1
        }
      }}
      className="mb-12"
    >
      <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent relative inline-block">
        Ready to Transform Your API Support?
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-cyan-400/50"
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
              transition: {
                delay: 0.5 + i * 0.1,
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeOut"
              }
            }}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </h2>
      
      {/* Subtitle with typing effect */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ 
          width: "100%",
          transition: { 
            duration: 1.5,
            ease: [0.87, 0, 0.13, 1],
            delay: 0.3
          }
        }}
        className="mx-auto overflow-hidden"
        style={{ maxWidth: "36rem" }}
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ 
            opacity: 1,
            x: 0,
            transition: { 
              delay: 0.8,
              duration: 0.6
            }
          }}
          className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
        >
          Join thousands of developers who trust MeetYourAPI for intelligent support solutions.
        </motion.p>
      </motion.div>
    </motion.div>

    {/* Animated CTA Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5
        }
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="inline-block"
    >
      <Link
        href={isSignedIn ? "/dashboard" : "/sign-in"}
        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-xl relative overflow-hidden group"
      >
        {/* Main gradient */}
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl z-0" />
        
        {/* Hover gradient */}
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0" />
        
        {/* Animated border */}
        <span className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="absolute inset-0 bg-black/80 rounded-xl" />
        </span>
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-3">
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                duration: 2,
                repeat: Infinity
              }
            }}
          >
            Get Started Now
          </motion.span>
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              transition: {
                duration: 3,
                repeat: Infinity
              }
            }}
          >
            <Zap className="w-6 h-6 text-yellow-300 group-hover:text-white transition-colors" />
          </motion.div>
        </span>
      </Link>
    </motion.div>
  </div>
</motion.section>

      {/* Footer */}
<motion.footer 
  className="relative z-50 py-16 px-6 border-t border-white/10 bg-black/90 backdrop-blur-md"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }}
  viewport={{ once: true }}
>
  {/* Floating background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-cyan-500/10"
        initial={{
          scale: 0,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50
        }}
        animate={{
          scale: [0, Math.random() * 0.5 + 0.3, 0],
          opacity: [0, 0.1, 0]
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          delay: i * 3
        }}
        style={{
          width: `${Math.random() * 200 + 100}px`,
          height: `${Math.random() * 200 + 100}px`,
        }}
      />
    ))}
  </div>

  <div className="max-w-7xl mx-auto">
    {/* Main footer content */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ 
        opacity: 1,
        transition: { 
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }}
      className="flex flex-col md:flex-row justify-between items-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring" }}
        className="flex items-center space-x-2 mb-8 md:mb-0"
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Code2 className="w-8 h-8 text-cyan-400" />
        </motion.div>
        <span className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          MeetYourAPI
        </span>
      </motion.div>
      
      {/* Links */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
        className="flex flex-wrap justify-center gap-6 mb-8 md:mb-0"
      >
        {['Docs', 'About', 'Contact', 'Privacy'].map((item, i) => (
          <Link 
            key={item}
            href="#"
            className="text-gray-400 hover:text-cyan-400 transition-colors font-mono relative group"
          >
            {item}
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="absolute left-0 right-0 bottom-0 h-[1px] bg-cyan-400 origin-left group-hover:origin-right transition-transform duration-300"
            />
          </Link>
        ))}
      </motion.div>
      
      {/* Social icons */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
        className="flex space-x-4"
      >
        {[
          { icon: <Github className="w-6 h-6" />, color: "hover:text-gray-300" },
          { icon: <Twitter className="w-6 h-6" />, color: "hover:text-blue-400" },
          { icon: <Linkedin className="w-6 h-6" />, color: "hover:text-blue-500" }
        ].map((social, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link 
              href="#" 
              className={`text-gray-400 transition-colors p-2 rounded-full hover:bg-white/10 ${social.color}`}
            >
              {social.icon}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>

    {/* Copyright */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ 
        opacity: 1,
        transition: { delay: 0.8 }
      }}
      className="mt-12 pt-8 border-t border-white/10 text-center"
    >
      <p className="text-gray-400 font-mono text-sm">
        © {new Date().getFullYear()} MeetYourAPI. Built for developers, by developers.
      </p>
      <motion.div
        animate={{
          opacity: [0.6, 1, 0.6],
          transition: {
            duration: 4,
            repeat: Infinity
          }
        }}
        className="mt-2 text-xs text-cyan-400/80"
      >
        v1.0.0
      </motion.div>
    </motion.div>
  </div>
</motion.footer>

      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 h-2 w-64 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}