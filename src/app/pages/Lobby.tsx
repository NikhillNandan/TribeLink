import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { Users, Globe, Zap, Shield } from "lucide-react";
import { lazy } from "react";
import { useUser } from "../../contexts/UserContext";
import { socket } from "../../utils/socket";

const Stadium3D = lazy(() => import("../../components/Stadium3D"));

const TEAM_PRIMARY: Record<string, string> = {
  CSK: "#FFD700", MI: "#004BA0", RCB: "#EC1C24", KKR: "#3A225D",
  DC: "#004C93", PBKS: "#ED1B24", RR: "#254AA5", SRH: "#FF822A",
};
const TEAM_GLOW: Record<string, string> = {
  CSK: "rgba(255,215,0,0.5)", MI: "rgba(0,75,160,0.5)", RCB: "rgba(236,28,36,0.5)",
  KKR: "rgba(58,34,93,0.5)", DC: "rgba(0,76,147,0.5)", PBKS: "rgba(237,27,36,0.5)",
  RR: "rgba(37,74,165,0.5)", SRH: "rgba(255,130,42,0.5)",
};

export default function Lobby() {
  const { team } = useParams<{ team: string }>();
  const navigate = useNavigate();
  const { visitorId, dugoutFriends } = useUser();
  const [waitTime, setWaitTime] = useState(6);
  const [onlineFans, setOnlineFans] = useState(0);
  const [show3D, setShow3D] = useState(false);

  const teamColor = TEAM_PRIMARY[team || "CSK"] || "#FFD700";
  const teamGlow = TEAM_GLOW[team || "CSK"] || "rgba(255,215,0,0.5)";

  useEffect(() => {
    const t = setTimeout(() => setShow3D(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Initial fetch of active users
    socket.emit("get_active_users");
    
    const handleUpdate = (count: number) => {
      setOnlineFans(count);
    };

    socket.on("active_users_update", handleUpdate);

    return () => {
      socket.off("active_users_update", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (waitTime === 0) {
      navigate(`/matching/${team}`);
      return;
    }
    const timer = setTimeout(() => setWaitTime((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [waitTime, team, navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#05050a]">
      <AnimatePresence>
        {show3D && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Suspense fallback={null}>
              <Stadium3D teamColor={teamColor} teamGlow={teamGlow} height="100%" />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to bottom, rgba(5,5,10,0.75) 0%, rgba(5,5,10,0.4) 40%, rgba(5,5,10,0.85) 100%)`,
        }}
      />

      <motion.div
        className="relative z-20 pt-6 px-6 text-center"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-2xl border-2 mb-4"
          style={{
            borderColor: teamColor,
            boxShadow: `0 0 40px ${teamGlow}, inset 0 0 20px rgba(255,255,255,0.04)`,
            background: "rgba(5,5,10,0.6)",
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ background: teamColor }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-2xl font-black tracking-widest" style={{ color: teamColor }}>
            {team} DUGOUT
          </span>
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ background: teamColor }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
          />
        </div>

        <motion.h2
          className="text-xl text-white/80 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Scanning globally for your tribe...
        </motion.h2>
      </motion.div>

      <motion.div
        className="relative z-20 max-w-2xl mx-auto px-4 mt-2 md:mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[
            {
              icon: Users,
              label: "Online Now",
              value: onlineFans.toLocaleString(),
              animate: true,
            },
            {
              icon: Zap,
              label: "Match Time",
              value: `${waitTime}s`,
              animate: false,
            },
            {
              icon: Globe,
              label: "Scope",
              value: "Global",
              animate: false,
            },
          ].map(({ icon: Icon, label, value, animate }) => (
            <div
              key={label}
              className="backdrop-blur-2xl rounded-2xl p-4 border text-center"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-4 h-4" style={{ color: teamColor }} />
                <span className="text-xs text-white/50">{label}</span>
              </div>
              <motion.div
                className="text-lg font-bold text-white"
                key={animate ? value : undefined}
                initial={animate ? { scale: 1.2, color: teamColor } : {}}
                animate={animate ? { scale: 1, color: "#ffffff" } : {}}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="relative z-20 max-w-lg mx-auto mt-8 md:mt-12 flex justify-center items-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "backOut" }}
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: teamColor }}
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: ring * 0.8,
                ease: "easeOut"
              }}
            />
          ))}
          <motion.div
            className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center border-4 backdrop-blur-md"
            style={{ 
              borderColor: teamColor, 
              background: `radial-gradient(circle, ${teamColor}80, rgba(5,5,10,0.8))` 
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Globe className="w-10 h-10 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {dugoutFriends.length > 0 && (
        <motion.div
          className="hidden md:block absolute right-4 top-1/3 z-20 w-44"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div
            className="backdrop-blur-2xl rounded-2xl border p-3"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(5,5,10,0.7)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: teamColor }} />
              <span className="text-xs text-white/60 font-semibold">Your Dugout</span>
            </div>
            {dugoutFriends.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                <div
                  className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: TEAM_PRIMARY[f.team] + "30", color: TEAM_PRIMARY[f.team] }}
                >
                  {f.team[0]}
                </div>
                <span className="text-xs text-white/70 truncate">Fan #{f.fanCode}</span>
              </div>
            ))}
            {dugoutFriends.length > 4 && (
              <p className="text-xs text-white/30 mt-1 text-center">
                +{dugoutFriends.length - 4} more
              </p>
            )}
          </div>
        </motion.div>
      )}

      {visitorId && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl border"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "rgba(5,5,10,0.6)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-white/40">
              Fan ID: {visitorId.substring(0, 8).toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
