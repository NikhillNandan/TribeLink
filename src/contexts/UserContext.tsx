import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export interface DugoutFriend {
  id: string;
  fanCode: string;
  team: string;
  lastSeen: string;
  chatId: string;
}

interface UserContextType {
  visitorId: string | null;
  isLoading: boolean;
  dugoutFriends: DugoutFriend[];
  addFriend: (friend: DugoutFriend) => void;
  removeFriend: (id: string) => void;
  currentTeam: string | null;
  setCurrentTeam: (team: string) => void;
}

const UserContext = createContext<UserContextType>({
  visitorId: null,
  isLoading: true,
  dugoutFriends: [],
  addFriend: () => {},
  removeFriend: () => {},
  currentTeam: null,
  setCurrentTeam: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dugoutFriends, setDugoutFriends] = useState<DugoutFriend[]>([]);
  const [currentTeam, setCurrentTeamState] = useState<string | null>(null);

  useEffect(() => {
    // Initialize FingerprintJS
    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        setVisitorId(result.visitorId);
        setIsLoading(false);

        // Restore team preference from localStorage
        const savedTeam = localStorage.getItem(
          `tribelink_team_${result.visitorId}`
        );
        if (savedTeam) setCurrentTeamState(savedTeam);

        // Restore friend list from localStorage
        const savedFriends = localStorage.getItem(
          `tribelink_friends_${result.visitorId}`
        );
        if (savedFriends) {
          try {
            setDugoutFriends(JSON.parse(savedFriends));
          } catch {
            setDugoutFriends([]);
          }
        }
      })
      .catch(() => {
        // Fallback if FingerprintJS fails
        const fallbackId =
          localStorage.getItem("tribelink_fallback_id") ||
          Math.random().toString(36).substring(2, 15);
        localStorage.setItem("tribelink_fallback_id", fallbackId);
        setVisitorId(fallbackId);
        setIsLoading(false);
      });
  }, []);

  const setCurrentTeam = (team: string) => {
    setCurrentTeamState(team);
    if (visitorId) {
      localStorage.setItem(`tribelink_team_${visitorId}`, team);
      // Update CSS variables globally
      updateTeamCSSVars(team);
    }
  };

  const addFriend = (friend: DugoutFriend) => {
    setDugoutFriends((prev) => {
      const updated = [
        friend,
        ...prev.filter((f) => f.id !== friend.id),
      ].slice(0, 50); // Keep max 50 friends
      if (visitorId) {
        localStorage.setItem(
          `tribelink_friends_${visitorId}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const removeFriend = (id: string) => {
    setDugoutFriends((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (visitorId) {
        localStorage.setItem(
          `tribelink_friends_${visitorId}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        visitorId,
        isLoading,
        dugoutFriends,
        addFriend,
        removeFriend,
        currentTeam,
        setCurrentTeam,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

// ─── Team CSS Variable Map ──────────────────────────────────────────────
const TEAM_COLORS: Record<
  string,
  { primary: string; secondary: string; glow: string; accent: string }
> = {
  CSK: {
    primary: "#FFD700",
    secondary: "#1E3A8A",
    glow: "rgba(255,215,0,0.5)",
    accent: "#FCD34D",
  },
  MI: {
    primary: "#004BA0",
    secondary: "#FFD700",
    glow: "rgba(0,75,160,0.5)",
    accent: "#60A5FA",
  },
  RCB: {
    primary: "#EC1C24",
    secondary: "#000000",
    glow: "rgba(236,28,36,0.5)",
    accent: "#F87171",
  },
  KKR: {
    primary: "#3A225D",
    secondary: "#FFD700",
    glow: "rgba(58,34,93,0.5)",
    accent: "#A78BFA",
  },
  DC: {
    primary: "#004C93",
    secondary: "#EF1B23",
    glow: "rgba(0,76,147,0.5)",
    accent: "#93C5FD",
  },
  PBKS: {
    primary: "#ED1B24",
    secondary: "#A6192E",
    glow: "rgba(237,27,36,0.5)",
    accent: "#FCA5A5",
  },
  RR: {
    primary: "#254AA5",
    secondary: "#FFC0CB",
    glow: "rgba(37,74,165,0.5)",
    accent: "#FBCFE8",
  },
  SRH: {
    primary: "#FF822A",
    secondary: "#000000",
    glow: "rgba(255,130,42,0.5)",
    accent: "#FDBA74",
  },
};

export function updateTeamCSSVars(team: string) {
  const colors = TEAM_COLORS[team];
  if (!colors) return;
  const root = document.documentElement;
  root.style.setProperty("--team-primary", colors.primary);
  root.style.setProperty("--team-secondary", colors.secondary);
  root.style.setProperty("--team-glow", colors.glow);
  root.style.setProperty("--team-accent", colors.accent);
}
