import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { socket } from "../../utils/socket";
import { useUser } from "../../contexts/UserContext";

export default function Matching() {
  const { team } = useParams<{ team: string }>();
  const navigate = useNavigate();
  const { visitorId } = useUser();

  useEffect(() => {
    if (!visitorId || !team) return;

    const myFanCode = visitorId.substring(0, 4).toUpperCase();

    // Ensure we are connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join the queue with global matching
    socket.emit("join_queue", { team, visitorId, fanCode: myFanCode });

    // Listen for the match
    socket.on("match_found", ({ roomId, opponentFanCode, opponentId }) => {
      // Navigate to chat and pass the roomId
      navigate(`/chat/${team}/${opponentFanCode}`, { state: { roomId, opponentId } });
    });

    return () => {
      socket.off("match_found");
    };
  }, [team, navigate, visitorId]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] flex items-center justify-center">
      {/* Starfield Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 2000],
              y: [0, (Math.random() - 0.5) * 2000],
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Hyperspace Tunnel */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              borderColor: `var(--team-primary)`,
              opacity: 0.3 - i * 0.015
            }}
            animate={{
              scale: [1, 3],
              opacity: [0.3 - i * 0.015, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {/* Energy Waves */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--team-glow) 0%, transparent 50%)`
        }}
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinning Cricket Ball */}
        <motion.div
          className="mb-8 mx-auto w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, #ffffff, #cccccc)`,
            boxShadow: `0 0 60px var(--team-glow), inset 0 0 20px rgba(0,0,0,0.3)`
          }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full rounded-full relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-600 -translate-y-1/2" />
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-red-600" />
            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-red-600" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
        >
          <h1 className="text-5xl md:text-7xl mb-4"
            style={{
              fontWeight: 800,
              background: `linear-gradient(135deg, var(--team-primary), var(--team-secondary))`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px var(--team-glow)'
            }}
          >
            HYPER WARP
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Finding your tribe...
          </p>
          <p className="text-lg text-gray-500">
            Scanning {team} fans globally
          </p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{ background: 'var(--team-primary)' }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          className="mt-12 max-w-md mx-auto h-3 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, var(--team-primary), var(--team-secondary))`,
              boxShadow: `0 0 20px var(--team-glow)`
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Particle Effects */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: 'var(--team-primary)',
            boxShadow: `0 0 10px var(--team-glow)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -1000],
            x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 400],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
