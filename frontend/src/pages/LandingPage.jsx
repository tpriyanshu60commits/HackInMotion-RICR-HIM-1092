import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

// Common Glass Card Component (Internal)
const GlassCard = ({ children, className = '' }) => (
  <div
    className={`bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12] rounded-[20px] shadow-lg ${className}`}
  >
    {children}
  </div>
);

// Eyebrow badge
const Eyebrow = ({ text, icon }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] mb-4">
    {icon && <span className="text-green-500">{icon}</span>}
    <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">{text}</span>
  </div>
);

export default function LandingPage() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // Video state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setTimeout(() => {
        setIsDrawn(true);
      }, 50);
    }
  }, []);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      {/* Global Fixed Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundColor: '#142018',
          backgroundImage: `url("/hero-bg.png"), linear-gradient(135deg, #1a2e22, #0A0F0D)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F0D]/70 via-[#0A0F0D]/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0D]/90 via-[#0A0F0D]/20 to-transparent"></div>
      </div>

      {/* SECTION 1 - Navbar (Progressive Blur + Pill Navbar) */}
      {/* Progressive Blur Mask for smooth scrolling */}
      <div className="fixed top-0 left-0 right-0 h-32 z-[45] pointer-events-none  backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"></div>

      <nav className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between px-6 py-4 bg-[#0A0F0D]/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="flex items-center gap-2">
          <img src="/favicon.svg" className='w-7' alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none">VerdantX</span>
              <span className="text-[10px] text-gray-400 mt-1">Breathe Better. Live Better.</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Features', 'Solutions', 'Community', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 text-sm font-medium bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block px-5 py-2 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SECTION 2 - Hero */}
      <section
        id="home"
        className="relative z-10 min-h-screen pt-32 pb-12 flex flex-col justify-between"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 flex-grow items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center max-w-2xl">
            <div className="self-start">
              <Eyebrow
                text="AI Powered. Data Driven."
                icon={
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="4" />
                  </svg>
                }
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Empowering a <br />
              <span className="text-green-500">Greener</span> <br />
              Tomorrow
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg">
              Real-time environmental intelligence, insights and community-driven solutions for a
              sustainable planet.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-3.5 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto lg:ml-auto">
            {/* AQI Card */}
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-semibold text-gray-400 tracking-wider">
                  AIR QUALITY INDEX:
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="flex items-end gap-4 mb-2">
                <span className="text-6xl font-bold text-white leading-none">42</span>
                <span className="flex items-center gap-1 text-green-400 font-medium pb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                  Good
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">Updated 5 min ago</p>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                  📍 New Delhi, India
                </span>
                <span className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                  🗺 View on Map
                </span>
              </div>

              {/* Sparkline Chart */}
              <div className="h-10 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    ref={pathRef}
                    d="M0 15 C 10 5, 15 5, 25 12 C 35 19, 40 19, 50 10 C 60 3, 65 3, 75 12 C 82 17, 90 17, 100 15"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: pathLength,
                      strokeDashoffset: isDrawn ? 0 : pathLength,
                      transition: pathLength > 0 ? 'stroke-dashoffset 2.5s ease-out' : 'none',
                    }}
                  />
                </svg>
              </div>
            </GlassCard>

            {/* 2x2 Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">PM2.5</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    ></path>
                  </svg>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">18</span>
                  <span className="text-xs text-gray-400">µg/m³</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Good
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">PM10</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">35</span>
                  <span className="text-xs text-gray-400">µg/m³</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Good
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">TEMPERATURE</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">28°C</span>
                </div>
                <div className="text-[10px] text-gray-400">Feels like 30°C</div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">HUMIDITY</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3c-1.2 1.6-3 4-3 6a3 3 0 006 0c0-2-1.8-4.4-3-6z"
                    ></path>
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">65%</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-yellow-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Moderate
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div className="relative z-20 w-full px-6 mt-16">
          <GlassCard className="max-w-7xl mx-auto w-full p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                  title: 'Real-time Data',
                  desc: 'Live air quality, weather and environmental updates',
                },
                {
                  icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  title: 'Smart Insights',
                  desc: 'AI-driven analysis and personalized recommendations',
                },
                {
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                  title: 'Community Driven',
                  desc: 'Connect, share and make an impact',
                },
                {
                  icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                  title: 'Sustainable Future',
                  desc: 'Together we build a better tomorrow',
                },
              ].map((ft, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d={ft.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 text-sm">{ft.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{ft.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 3 - "Understanding Today, Protecting Tomorrow" */}
      <section id="about" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="self-start inline-block">
              <Eyebrow text="Why It Matters" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Understanding Today,
              <br />
              <span className="text-green-500">Protecting</span> Tomorrow
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Our environment is changing rapidly. VerdantX helps you stay informed, take action and
              contribute towards a healthier, greener and safer world.
            </p>

            <ul className="space-y-6">
              {[
                'Air pollution is linked to 7 million+ deaths annually.',
                'Climate change impacts our health, ecosystems and future.',
                'Small actions today lead to a sustainable tomorrow.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <GlassCard className="overflow-hidden p-1">
              <div
                className="relative rounded-xl overflow-hidden aspect-video"
                style={{
                  backgroundColor: '#142018',
                  backgroundImage: `linear-gradient(135deg, #1a2e22, #0A0F0D)`,
                }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  // poster="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop"
                  src="https://videos.pexels.com/video-files/30859401/13196588_2560_1440_60fps.mp4"
                  preload="metadata"
                  controls={isPlaying}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity group-hover:bg-black/50">
                    <button
                      onClick={handlePlayVideo}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:scale-110 hover:bg-white/30 transition-all cursor-pointer z-10"
                    >
                      <svg
                        className="w-6 h-6 text-white translate-x-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>

            <div className="mt-6 flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5 16 5 16s1.5-2.5 4-4l-3-3c2 0 4.5.5 6 1.5l1.5-1.5c1.5-1.5 4.5-2 4.5-2s-.5 3-2 4.5L17 14c1 1.5 1.5 4 1.5 6 0 0-6-3-4-12z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Together, we can create a cleaner, greener planet for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - "Powerful Features for a Better Tomorrow" */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="self-start inline-block">
                <Eyebrow text="Platform Features" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
                Powerful Features <br />
                for a <span className="text-green-500">Better Tomorrow</span>
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-green-500 hover:text-green-400 font-medium inline-flex items-center gap-2 transition-colors"
            >
              Explore All Features
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Real-time Air Quality Monitoring',
                desc: 'Get live AQI updates, pollutant levels and weather conditions anywhere, anytime.',
                icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
              },
              {
                title: 'Personalized Risk Assessment',
                desc: 'AI-powered risk scores based on your location, health and daily activities.',
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
              },
              {
                title: 'Route Risk Analyzer',
                desc: 'Find the safest and healthiest routes for your daily commute with our smart analyzer.',
                icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
              },
              {
                title: 'Historical Trends',
                desc: 'Track air quality and weather trends with interactive charts and reports.',
                icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
              },
              {
                title: 'Community Reports',
                desc: 'Share local environmental issues and stay informed with real-time community contributions.',
                icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
              },
              {
                title: 'AI Assistant',
                desc: 'Ask questions, get insights and receive personalized environmental guidance.',
                icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
              },
              {
                title: 'Alerts & Notifications',
                desc: 'Get timely alerts for pollution spikes, severe weather and health advisories.',
                icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
              },
              {
                title: 'Educational Resources',
                desc: 'Learn about sustainability, pollution, health and how you can make a difference.',
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
              },
            ].map((feature, i) => (
              <GlassCard key={i} className="p-6 hover:bg-white/[0.08] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - "How VerdantX Works" */}
      <section id="solutions" className="relative z-10 py-24 px-6 overflow-hidden">
        {/* Faint forest silhouette (optional subtle gradient to break up black bg) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center">
            <Eyebrow text="How It Works" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-2 mb-20">
            How <span className="text-green-500">VerdantX</span> Works
          </h2>

          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-4 relative">
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] border-t-2 border-dashed border-white/10 z-0"></div>

            {[
              {
                step: 1,
                title: 'Collect Data',
                desc: 'We collect real-time data from trusted environmental sources and community reports.',
                icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
              },
              {
                step: 2,
                title: 'Analyze with AI',
                desc: 'Advanced AI models analyze the data to generate accurate insights and risk scores.',
                icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
              },
              {
                step: 3,
                title: 'Deliver Insights',
                desc: 'Personalized insights, alerts and recommendations delivered to you instantly.',
                icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
              },
              {
                step: 4,
                title: 'Take Action',
                desc: 'Stay informed, make better choices and contribute to a healthier planet.',
                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center max-w-[240px] group"
              >
                <GlassCard className="w-36 h-36 rounded-full flex items-center justify-center mb-6 p-1 border-white/20 group-hover:border-green-500/50 transition-colors">
                  <div className="w-full h-full rounded-full bg-[#0A0F0D] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-green-500/5 rounded-full"></div>
                    <svg
                      className="w-12 h-12 text-green-500 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d={item.icon}
                      />
                    </svg>
                  </div>
                </GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-[#0A0F0D] text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <h4 className="text-xl font-bold text-white whitespace-nowrap">{item.title}</h4>
                </div>
                <p className="text-gray-400 text-sm">{item.desc}</p>

                {/* Mobile Connector */}
                {idx < 3 && (
                  <div className="lg:hidden h-12 border-l-2 border-dashed border-white/10 my-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - CTA banner */}
      <section id="community" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-2xl relative z-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Be Part of the Change
              </h2>
              <p className="text-gray-300 text-lg">
                Join thousands of people who are using VerdantX to breathe better, live healthier
                and build a sustainable future.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors whitespace-nowrap text-center"
              >
                Get Started Now
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors whitespace-nowrap backdrop-blur-md text-center"
              >
                Explore Dashboard
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 7 - Footer */}
      <footer className="relative z-10 bg-[#050806]/70 backdrop-blur-lg border-t border-white/5 px-5 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 VerdantX. All rights reserved.</p>

          <p>
            Made with <span className="text-red-500">❤</span> for a greener planet 🌱
          </p>
        </div>
      </footer>
    </div>
  );
}
