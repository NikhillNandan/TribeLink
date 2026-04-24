import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const TEAM_TRIVIA: Record<string, { question: string; options: string[]; correct: number }> = {
  CSK: {
    question: "Who is the Thala?",
    options: ["MS Dhoni", "Virat Kohli", "Rohit Sharma", "Hardik Pandya"],
    correct: 0
  },
  MI: {
    question: "How many IPL titles has MI won?",
    options: ["3", "4", "5", "6"],
    correct: 2
  },
  RCB: {
    question: "Who is RCB's highest run scorer of all time?",
    options: ["AB de Villiers", "Chris Gayle", "Virat Kohli", "KL Rahul"],
    correct: 2
  },
  KKR: {
    question: "In which year did KKR win their first IPL title?",
    options: ["2010", "2012", "2014", "2016"],
    correct: 1
  },
  DC: {
    question: "What was DC previously known as?",
    options: ["Delhi Daredevils", "Delhi Dynamos", "Delhi Lions", "Delhi Warriors"],
    correct: 0
  },
  PBKS: {
    question: "What is PBKS's home ground?",
    options: ["Wankhede", "Eden Gardens", "PCA Stadium", "Chinnaswamy"],
    correct: 2
  },
  RR: {
    question: "Who captained RR to their IPL 2008 victory?",
    options: ["Shane Warne", "Steve Smith", "Rahul Dravid", "Sanju Samson"],
    correct: 0
  },
  SRH: {
    question: "Which team did SRH replace in IPL?",
    options: ["Deccan Chargers", "Kochi Tuskers", "Pune Warriors", "Gujarat Lions"],
    correct: 0
  }
};

export default function Trivia() {
  const { team } = useParams<{ team: string }>();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const trivia = TEAM_TRIVIA[team || "CSK"];

  useEffect(() => {
    if (showResult && selectedOption === trivia.correct) {
      if (countdown === 0) {
        navigate(`/lobby/${team}`);
        return;
      }

      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showResult, selectedOption, trivia.correct, countdown, team, navigate]);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowResult(true);
  };

  const isCorrect = selectedOption === trivia.correct;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Glowing effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle, var(--team-primary) 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Team Badge */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-2xl backdrop-blur-xl border-2"
            style={{
              borderColor: 'var(--team-primary)',
              boxShadow: `0 0 40px var(--team-glow), inset 0 0 20px rgba(255,255,255,0.1)`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
            }}
          >
            <div className="text-4xl md:text-5xl" style={{
              fontWeight: 800,
              color: 'var(--team-primary)',
              textShadow: '0 0 20px var(--team-glow)'
            }}>
              {team}
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          className="backdrop-blur-2xl rounded-3xl border-2 p-6 md:p-12 mb-6 md:mb-8"
          style={{
            borderColor: 'var(--team-primary)',
            boxShadow: `0 0 60px var(--team-glow), inset 0 0 30px rgba(255,255,255,0.05)`,
            background: 'linear-gradient(135deg, rgba(10,10,15,0.8), rgba(20,20,30,0.9))'
          }}
          initial={{ rotateX: -90 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
        >
          <h2 className="text-2xl md:text-3xl text-white mb-8 text-center">
            {trivia.question}
          </h2>

          <div className="space-y-4">
            {trivia.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className="w-full px-6 py-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden"
                style={{
                  borderColor: showResult
                    ? (index === trivia.correct ? '#10B981' : (index === selectedOption ? '#EF4444' : 'rgba(255,255,255,0.2)'))
                    : 'rgba(255,255,255,0.2)',
                  background: showResult
                    ? (index === trivia.correct ? 'rgba(16, 185, 129, 0.2)' : (index === selectedOption ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)'))
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: showResult && index === trivia.correct
                    ? '0 0 30px rgba(16, 185, 129, 0.5)'
                    : 'none'
                }}
                whileHover={!showResult ? {
                  scale: 1.02,
                  borderColor: 'var(--team-primary)',
                  boxShadow: '0 0 20px var(--team-glow)'
                } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <span className="text-lg text-white relative z-10">{option}</span>
                {showResult && index === trivia.correct && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Result Message */}
        {showResult && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isCorrect ? (
              <>
                <p className="text-2xl text-green-400 mb-4">Perfect! True Fan Detected 🎉</p>
                <p className="text-lg text-gray-400">
                  Finding your tribe in {countdown}...
                </p>
                <motion.div
                  className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--team-primary)' }}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </motion.div>
              </>
            ) : (
              <>
                <p className="text-2xl text-red-400 mb-4">Oops! Try again</p>
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setShowResult(false);
                  }}
                  className="px-8 py-3 rounded-xl border-2 text-white"
                  style={{
                    borderColor: 'var(--team-primary)',
                    background: 'rgba(255,255,255,0.1)',
                  }}
                >
                  Retry
                </button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
