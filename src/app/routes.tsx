import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import TeamSelection from "./pages/TeamSelection";
import Trivia from "./pages/Trivia";
import Lobby from "./pages/Lobby";
import Matching from "./pages/Matching";
import Chat from "./pages/Chat";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Blog from "./pages/Blog";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/select-team",
    Component: TeamSelection,
  },
  {
    path: "/trivia/:team",
    Component: Trivia,
  },
  {
    path: "/lobby/:team",
    Component: Lobby,
  },
  {
    path: "/matching/:team",
    Component: Matching,
  },
  {
    path: "/chat/:team/:matchId",
    Component: Chat,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms",
    Component: TermsOfService,
  },
  {
    path: "/blog",
    Component: Blog,
  },
], { basename: import.meta.env.BASE_URL });
