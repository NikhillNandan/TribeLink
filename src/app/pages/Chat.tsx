/**
 * Chat.tsx — TribeLink Fan Chat
 * Stadium 3D background in top half + glassmorphism chat in bottom half.
 * FingerprintJS identity used for "Add to Dugout" feature.
 */

import { useParams, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Send, Bot, Sparkles, UserPlus, CheckCircle2, X, FastForward } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { socket } from "../../utils/socket";

const Stadium3D = lazy(() => import("../../components/Stadium3D"));

interface Message {
  id: string;
  text: string;
  sender: "user" | "match";
  timestamp: Date;
  celebration?: boolean;
}

const BANTER_LINES = [
  "Totally agree! That was an epic match! 🏏",
  "Man, I've been following since 2008! You?",
  "That catch was INSANE! Still can't believe it 🔥",
  "Have you been to a live match? The atmosphere is electric!",
  "Best team in the tournament, no debate! 💪",
  "What's your all-time favorite moment from this season?",
  "The rivalry matches are always 🔥🔥🔥",
  "Did you watch last night? Unreal finish!",
  "Our bowlers have been sensational this IPL 🎯",
  "This is our year, I can feel it! 🏆",
];

const TEAM_PRIMARY: Record<string, string> = {
  CSK: "#FFD700", MI: "#004BA0", RCB: "#EC1C24", KKR: "#3A225D",
  DC: "#004C93", PBKS: "#ED1B24", RR: "#254AA5", SRH: "#FF822A",
};
const TEAM_GLOW: Record<string, string> = {
  CSK: "rgba(255,215,0,0.5)", MI: "rgba(0,75,160,0.5)", RCB: "rgba(236,28,36,0.5)",
  KKR: "rgba(58,34,93,0.5)", DC: "rgba(0,76,147,0.5)", PBKS: "rgba(237,27,36,0.5)",
  RR: "rgba(37,74,165,0.5)", SRH: "rgba(255,130,42,0.5)",
};
const TEAM_SECONDARY: Record<string, string> = {
  CSK: "#1E3A8A", MI: "#FFD700", RCB: "#000000", KKR: "#FFD700",
  DC: "#EF1B23", PBKS: "#A6192E", RR: "#FFC0CB", SRH: "#000000",
};

const QUICK_REACTIONS = [
  { label: "🏏 Six!", text: "🏏 SIX! THAT'S MASSIVE!" },
  { label: "🔥 Fire!", text: "That was absolutely FIRE 🔥" },
  { label: "🏆 Champs", text: "We are the CHAMPIONS! 🏆" },
  { label: "😱 What?!", text: "No way that just happened! 😱" },
  { label: "👊 Hype!", text: "Let's GOOO! 👊🔥" },
];

export default function Chat() {
  const { team, matchId } = useParams<{ team: string; matchId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { visitorId, addFriend, dugoutFriends } = useUser();

  const roomId = location.state?.roomId;
  const opponentId = location.state?.opponentId;

  const teamColor = TEAM_PRIMARY[team || "CSK"] || "#FFD700";
  const teamGlow = TEAM_GLOW[team || "CSK"] || "rgba(255,215,0,0.5)";
  const teamSecondary = TEAM_SECONDARY[team || "CSK"] || "#1E3A8A";
  const fanCode = matchId?.substring(0, 4).toUpperCase() || "XXXX";

  const alreadyInDugout = dugoutFriends.some((f) => f.id === opponentId || f.id === matchId);
  const [addedToDugout, setAddedToDugout] = useState(alreadyInDugout);
  const [showBanterBot, setShowBanterBot] = useState(false);
  const [banterTyping, setBanterTyping] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const handleSkip = () => {
    setShowSkipModal(false);
    socket.emit("skip_match", { team, visitorId, fanCode });
    navigate(`/matching/${team}`);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hey fellow ${team} fan! So pumped to meet you! 🎉`,
      sender: "match",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for opponent leaving
    socket.on("opponent_left", () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Fan disconnected... Finding a new match in 3s...",
          sender: "match",
          timestamp: new Date(),
          celebration: false,
        },
      ]);
      setTimeout(() => {
        navigate(`/matching/${team}`);
      }, 3000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("opponent_left");
    };
  }, [team, navigate]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText ?? inputText;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    
    // Update local UI
    setMessages((prev) => [...prev, newMsg]);
    if (!overrideText) setInputText("");

    // Emit to live socket server
    socket.emit("send_message", { text });
  };

  const handleBanterBot = () => {
    setShowBanterBot(false);
    setBanterTyping(true);
    const starters = [
      `Quick question for a ${team} fan: Who's your player of the tournament so far? 🏏`,
      `Rate your season out of 10? I'd say we're at a solid 8! 🔥`,
      `If you could swap one player with any other team, who would it be and why? 👀`,
    ];
    setTimeout(() => {
      setBanterTyping(false);
      const text = starters[Math.floor(Math.random() * starters.length)];
      handleSend(text);
    }, 1500);
  };

  const handleAddToDugout = () => {
    if (!opponentId || addedToDugout) return;
    addFriend({
      id: opponentId,
      fanCode,
      team: team || "CSK",
      lastSeen: new Date().toISOString(),
      chatId: matchId || opponentId,
    });
    setAddedToDugout(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#05050a] flex flex-col">
      {/* ══ TOP HALF: 3D Stadium ══════════════════════════════════════════════ */}
      <motion.div
        className="relative flex-shrink-0 overflow-hidden border-b"
        style={{ height: "42%", borderColor: "rgba(255,255,255,0.08)" }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "backOut" }}
      >
        {/* 3D Canvas */}
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full border-4"
              style={{ borderColor: teamColor, borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        }>
          <Stadium3D teamColor={teamColor} teamGlow={teamGlow} height="100%" />
        </Suspense>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(5,5,10,0.3) 0%, transparent 40%, rgba(5,5,10,0.8) 100%)`,
          }}
        />

        {/* Match info badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-col md:flex-row justify-between items-start gap-2 z-10 pointer-events-none">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-2xl rounded-2xl px-4 py-2 border pointer-events-auto"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              background: "rgba(5,5,10,0.7)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-xs text-white/40 mb-0.5">Connected with</div>
            <div className="text-sm text-white font-bold">Fan #{fanCode}</div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 pointer-events-auto"
          >
            {/* Add to Dugout */}
            <motion.button
              onClick={handleAddToDugout}
              disabled={addedToDugout}
              className="flex items-center gap-1.5 backdrop-blur-2xl rounded-2xl px-3 py-2 border transition-all"
              style={{
                borderColor: addedToDugout ? "#10B981" : teamColor,
                background: addedToDugout
                  ? "rgba(16,185,129,0.15)"
                  : `rgba(${teamColor}, 0.1)`,
              }}
              whileHover={!addedToDugout ? { scale: 1.05 } : {}}
              whileTap={!addedToDugout ? { scale: 0.95 } : {}}
            >
              {addedToDugout ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <UserPlus className="w-4 h-4" style={{ color: teamColor }} />
              )}
              <span
                className="text-xs font-semibold"
                style={{ color: addedToDugout ? "#10B981" : teamColor }}
              >
                {addedToDugout ? "In Dugout" : "Add"}
              </span>
            </motion.button>

            {/* Live indicator */}
            {/* Skip Button */}
            <motion.button
              onClick={() => setShowSkipModal(true)}
              className="flex items-center gap-1.5 backdrop-blur-2xl rounded-2xl px-3 py-2 border transition-all hover:bg-white/5"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                background: "rgba(5,5,10,0.7)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FastForward className="w-4 h-4 text-white/70" />
              <span className="text-xs font-semibold text-white/70">Skip Fan</span>
            </motion.button>

            {/* Live indicator */}
            <div
              className="flex items-center gap-2 backdrop-blur-2xl rounded-2xl px-3 py-2 border"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                background: "rgba(5,5,10,0.7)",
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-white/50">Live</span>
            </div>
          </motion.div>
        </div>

        {/* Team badge center */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring" }}
        >
          <div
            className="w-20 h-20 rounded-full border-4 backdrop-blur-2xl flex items-center justify-center relative"
            style={{
              borderColor: teamColor,
              background: `radial-gradient(circle, ${teamColor}20, ${teamSecondary}15)`,
              boxShadow: `0 0 60px ${teamGlow}, inset 0 0 30px ${teamGlow}`,
            }}
          >
            <span
              className="text-xl font-black"
              style={{ color: teamColor, textShadow: `0 0 20px ${teamGlow}` }}
            >
              {team}
            </span>
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: teamColor, opacity: 0.4 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ══ BOTTOM HALF: Chat ═════════════════════════════════════════════════ */}
      <div className="relative flex flex-col" style={{ height: "58%" }}>
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,10,0.97), rgba(8,8,15,0.99))",
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Messages */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: msg.celebration ? "spring" : "tween",
                  damping: msg.celebration ? 8 : undefined,
                  stiffness: msg.celebration ? 300 : undefined,
                  duration: msg.celebration ? undefined : 0.25,
                }}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl backdrop-blur-xl ${
                    msg.celebration ? "text-3xl" : "text-sm"
                  }`}
                  style={{
                    background:
                      msg.sender === "user"
                        ? `linear-gradient(135deg, ${teamColor}45, ${teamSecondary}30)`
                        : "rgba(255,255,255,0.07)",
                    border:
                      msg.sender === "user"
                        ? `1.5px solid ${teamColor}80`
                        : "1.5px solid rgba(255,255,255,0.1)",
                    boxShadow:
                      msg.sender === "user" ? `0 0 20px ${teamGlow}` : "none",
                  }}
                >
                  <p className="text-white leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Banter bot typing indicator */}
          {banterTyping && (
            <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div
                className="px-4 py-3 rounded-2xl backdrop-blur-xl flex gap-1.5 items-center"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: teamColor }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <motion.div
          className="relative z-10 border-t px-3 pb-3 pt-2"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(5,5,10,0.98)",
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Quick reactions */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_REACTIONS.map((r) => (
              <motion.button
                key={r.label}
                onClick={() => handleSend(r.text)}
                className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border-2 text-white/80 flex-shrink-0"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
                whileHover={{
                  borderColor: teamColor,
                  color: "#ffffff",
                  background: `${teamColor}15`,
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.96 }}
              >
                {r.label}
              </motion.button>
            ))}
          </div>

          {/* Text input row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 bg-transparent text-white placeholder-white/25 focus:outline-none text-sm transition-all"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = teamColor;
                e.target.style.boxShadow = `0 0 15px ${teamGlow}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
            <motion.button
              onClick={() => handleSend()}
              className="p-2.5 rounded-2xl border-2 flex-shrink-0"
              style={{
                borderColor: teamColor,
                background: `linear-gradient(135deg, ${teamColor}50, ${teamSecondary}40)`,
                boxShadow: `0 0 20px ${teamGlow}`,
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Banter Bot FAB ───────────────────────────────────────────────────── */}
      <motion.div
        className="fixed bottom-[58%] right-4 z-30 mb-[-2rem]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      >
        <AnimatePresence>
          {showBanterBot && (
            <motion.div
              className="absolute bottom-16 right-0 w-52 backdrop-blur-2xl rounded-2xl border p-4 mb-2"
              style={{
                borderColor: teamColor,
                background: "rgba(5,5,10,0.95)",
                boxShadow: `0 0 30px ${teamGlow}`,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
            >
              <button
                onClick={() => setShowBanterBot(false)}
                className="absolute top-2 right-2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-white font-bold mb-1">🤖 Banter Bot</p>
              <p className="text-xs text-white/60 mb-3">
                I'll send an AI ice-breaker to get the conversation going!
              </p>
              <motion.button
                onClick={handleBanterBot}
                className="w-full py-2 rounded-xl text-xs font-bold text-black"
                style={{ background: `linear-gradient(135deg, ${teamColor}, ${teamSecondary || "#FFA500"})` }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Send Ice Breaker! 🔥
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setShowBanterBot(!showBanterBot)}
          className="relative w-14 h-14 rounded-full border-3 backdrop-blur-xl flex items-center justify-center"
          style={{
            borderColor: teamColor,
            background: `radial-gradient(circle, ${teamColor}35, ${teamSecondary}25)`,
            boxShadow: `0 0 30px ${teamGlow}`,
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          animate={{ boxShadow: [`0 0 25px ${teamGlow}`, `0 0 50px ${teamGlow}`, `0 0 25px ${teamGlow}`] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Bot className="w-7 h-7 text-white" />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4" style={{ color: teamColor }} />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* ── Skip Confirmation Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showSkipModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ background: "rgba(5,5,10,0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm backdrop-blur-2xl rounded-3xl border-2 p-6"
              style={{
                borderColor: teamColor,
                background: "rgba(10,10,15,0.95)",
                boxShadow: `0 0 40px ${teamGlow}`,
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">Skip this Fan?</h3>
              <p className="text-sm text-white/60 mb-6">
                You will be disconnected from Fan #{fanCode} and sent back to the lobby to find someone new.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white border-2 transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-black transition-transform active:scale-95"
                  style={{ background: teamColor, boxShadow: `0 0 20px ${teamGlow}` }}
                >
                  Find New Fan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
