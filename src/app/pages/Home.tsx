import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Zap, Users, MessageCircle, Trophy, ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Glowing Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
          top: '20%',
          left: '10%'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #EC1C24 0%, transparent 70%)',
          bottom: '20%',
          right: '10%'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, #004BA0 0%, transparent 70%)',
          top: '50%',
          right: '20%'
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 70, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl mb-6"
            style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #FFD700, #EC1C24, #004BA0, #3A225D)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            TRIBELINK
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            The Fan Club in Your Pocket
          </motion.p>

          <motion.div
            className="inline-block px-6 py-2 rounded-full backdrop-blur-xl border"
            style={{
              borderColor: 'rgba(255,215,0,0.3)',
              background: 'rgba(255,215,0,0.1)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-sm md:text-base text-yellow-300">
              Zero-Friction • Instant-Match • Same-Team Tribalism
            </p>
          </motion.div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          className="max-w-2xl text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            Find Your Tribe in <span className="text-yellow-400">10 Seconds</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Connect instantly with fellow IPL and Cinema fans who share your passion.
            No login required. Just pure, authentic fan conversations.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {[
            {
              icon: Zap,
              title: "10s Connection",
              description: "Lightning-fast matching with your tribe",
              color: "#FFD700"
            },
            {
              icon: Users,
              title: "Zero Login",
              description: "No registration, no hassle, just connect",
              color: "#EC1C24"
            },
            {
              icon: MessageCircle,
              title: "Real Fans Only",
              description: "Verified through quick trivia challenges",
              color: "#004BA0"
            },
            {
              icon: Trophy,
              title: "Team Spirit",
              description: "Same-team tribalism at its finest",
              color: "#3A225D"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-2xl rounded-3xl p-6 border-2 group cursor-pointer"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                borderColor: feature.color + '80',
                boxShadow: `0 0 30px ${feature.color}50`
              }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  background: `${feature.color}20`,
                  border: `2px solid ${feature.color}40`
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
              </motion.div>
              <h3 className="text-xl text-white mb-2 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-400 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.8, type: "spring" }}
        >
          <motion.button
            onClick={() => navigate('/select-team')}
            className="group relative px-12 py-5 rounded-2xl text-xl md:text-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              boxShadow: '0 0 40px rgba(255,215,0,0.5)',
              border: '2px solid #FFD700'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 60px rgba(255,215,0,0.8)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3 text-black">
              Get Started
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
              </motion.div>
            </span>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ width: '50%' }}
            />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex gap-8 md:gap-12 mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          {[
            { value: "8", label: "IPL Teams" },
            { value: "10s", label: "Match Time" },
            { value: "0", label: "Login Required" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl text-yellow-400 mb-1"
                style={{ fontWeight: 800 }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Footer Links */}
      <div className="relative z-10 w-full pb-6 pt-12 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
          <Link to="/blog" className="hover:text-yellow-400 transition-colors">Blog</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} TribeLink. All rights reserved.</p>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
}
