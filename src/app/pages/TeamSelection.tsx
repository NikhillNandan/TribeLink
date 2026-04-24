import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser, updateTeamCSSVars } from "../../contexts/UserContext";

const IPL_TEAMS = [
  {
    id: "CSK",
    name: "Chennai Super Kings",
    primary: "#FFD700",
    secondary: "#1E3A8A",
    glow: "rgba(255, 215, 0, 0.5)"
  },
  {
    id: "MI",
    name: "Mumbai Indians",
    primary: "#004BA0",
    secondary: "#FFD700",
    glow: "rgba(0, 75, 160, 0.5)"
  },
  {
    id: "RCB",
    name: "Royal Challengers Bangalore",
    primary: "#EC1C24",
    secondary: "#000000",
    glow: "rgba(236, 28, 36, 0.5)"
  },
  {
    id: "KKR",
    name: "Kolkata Knight Riders",
    primary: "#3A225D",
    secondary: "#FFD700",
    glow: "rgba(58, 34, 93, 0.5)"
  },
  {
    id: "DC",
    name: "Delhi Capitals",
    primary: "#004C93",
    secondary: "#EF1B23",
    glow: "rgba(0, 76, 147, 0.5)"
  },
  {
    id: "PBKS",
    name: "Punjab Kings",
    primary: "#ED1B24",
    secondary: "#A6192E",
    glow: "rgba(237, 27, 36, 0.5)"
  },
  {
    id: "RR",
    name: "Rajasthan Royals",
    primary: "#254AA5",
    secondary: "#FFC0CB",
    glow: "rgba(37, 74, 165, 0.5)"
  },
  {
    id: "SRH",
    name: "Sunrisers Hyderabad",
    primary: "#FF822A",
    secondary: "#000000",
    glow: "rgba(255, 130, 42, 0.5)"
  },
];

export default function TeamSelection() {
  const navigate = useNavigate();
  const { setCurrentTeam } = useUser();
  const [selectedTeam, setSelectedTeam] = useState<typeof IPL_TEAMS[0] | null>(null);

  const handleTeamSelect = (team: typeof IPL_TEAMS[0]) => {
    setSelectedTeam(team);
    // Update CSS variables AND persist via UserContext
    updateTeamCSSVars(team.id);
    setCurrentTeam(team.id);

    setTimeout(() => {
      navigate(`/trivia/${team.id}`);
    }, 800);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f] py-8 md:py-12">
      {/* Animated Background Grid */}
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
          background: `radial-gradient(circle, ${selectedTeam?.primary || '#FFD700'} 0%, transparent 70%)`,
          top: '10%',
          left: '20%'
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0]
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
          background: `radial-gradient(circle, ${selectedTeam?.secondary || '#1E3A8A'} 0%, transparent 70%)`,
          bottom: '10%',
          right: '20%'
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-4"
            style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFD700, #EC1C24, #004BA0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Team
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Select your favorite IPL team to continue
          </p>
        </motion.div>

        {/* Team Grid - All Teams Visible */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {IPL_TEAMS.map((team, index) => (
            <motion.button
              key={team.id}
              className="relative backdrop-blur-2xl rounded-3xl border-2 overflow-hidden group"
              initial={{
                opacity: 0,
                scale: 0.5,
                y: 50,
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 0 0px rgba(0,0,0,0), inset 0 0 0px rgba(255,255,255,0)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 0 0px rgba(0,0,0,0), inset 0 0 0px rgba(255,255,255,0)',
              }}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
              style={{
                background: `linear-gradient(135deg, ${team.primary}10, ${team.secondary}10)`
              }}
              onClick={() => handleTeamSelect(team)}
              whileHover={{
                scale: 1.08,
                borderColor: team.primary,
                boxShadow: `0 0 40px ${team.glow}, inset 0 0 30px rgba(255,255,255,0.1)`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Continuous Zoom Animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />

              {/* Content */}
              <div className="relative p-4 md:p-8 flex flex-col items-center">
                {/* Team Badge Circle */}
                <motion.div
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full border-3 flex items-center justify-center mb-4"
                  style={{
                    borderColor: team.primary,
                    background: `radial-gradient(circle, ${team.primary}30, ${team.secondary}10)`,
                    boxShadow: `0 0 20px ${team.glow}`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${team.glow}`,
                      `0 0 40px ${team.glow}`,
                      `0 0 20px ${team.glow}`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.15
                  }}
                >
                  <div className="text-3xl md:text-5xl"
                    style={{
                      fontWeight: 900,
                      color: team.primary,
                      textShadow: `0 0 15px ${team.glow}`
                    }}
                  >
                    {team.id}
                  </div>
                </motion.div>

                {/* Team Name */}
                <h3 className="text-sm md:text-base text-center text-white mb-2">
                  {team.name}
                </h3>

                {/* Hover Indicator */}
                <motion.div
                  className="absolute inset-0 border-2 rounded-3xl opacity-0 group-hover:opacity-100"
                  style={{
                    borderColor: team.primary,
                    boxShadow: `0 0 60px ${team.glow}`
                  }}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(45deg, transparent, ${team.primary}30, transparent)`,
                }}
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          className="text-gray-500 mt-8 md:mt-12 text-center text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Click on your team to start connecting with fellow fans
        </motion.p>
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
