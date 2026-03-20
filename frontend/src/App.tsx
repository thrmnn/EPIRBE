import { useState, useCallback, useRef } from "react";
import Layout from "./components/Layout";
import PlayerBar from "./components/PlayerBar";
import ListenerView from "./components/ListenerView";
import AdminDashboard from "./components/AdminDashboard";
import FirstVisitSplash from "./components/FirstVisitSplash";
import Chat from "./components/Chat";
import Library from "./components/Library";
import { useNowPlaying } from "./hooks/useNowPlaying";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [firstVisit, setFirstVisit] = useState(
    () => localStorage.getItem("epirbe_visited") === null
  );
  const [splashFading, setSplashFading] = useState(false);
  const [showLoginInput, setShowLoginInput] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const { title, artist, listeners, connected } = useNowPlaying();
  const { isAdmin, login, logout } = useAuth();
  const loginInputRef = useRef<HTMLInputElement>(null);

  // Derive isLive from stream status — a connected stream with a title
  // indicates active broadcast; refine when backend exposes explicit live flag
  const isLive = connected && !!title;

  const handleStartListening = useCallback(() => {
    setSplashFading(true);
    setTimeout(() => {
      localStorage.setItem("epirbe_visited", "1");
      setFirstVisit(false);
      setSplashFading(false);
    }, 400);
  }, []);

  const handleDjButtonClick = useCallback(() => {
    if (isAdmin) {
      setShowAdmin((prev) => !prev);
      setShowLoginInput(false);
    } else {
      setShowLoginInput((prev) => !prev);
      setLoginError(false);
      setLoginPassword("");
      // Focus the input on next render
      setTimeout(() => loginInputRef.current?.focus(), 0);
    }
  }, [isAdmin]);

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginPassword.trim()) return;
      const success = await login(loginPassword);
      if (success) {
        setShowAdmin(true);
        setShowLoginInput(false);
        setLoginPassword("");
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    },
    [loginPassword, login]
  );

  const handleLogout = useCallback(() => {
    logout();
    setShowAdmin(false);
  }, [logout]);

  // Build the current track string for the splash screen
  const currentTrack = title
    ? artist
      ? `${title} — ${artist}`
      : title
    : undefined;

  // DJ button + optional login form for the header
  const headerExtra = (
    <div className="flex items-center gap-2">
      {showLoginInput && !isAdmin && (
        <form onSubmit={handleLoginSubmit} className="flex items-center gap-2">
          <label htmlFor="dj-password" className="sr-only">
            DJ password
          </label>
          <input
            ref={loginInputRef}
            id="dj-password"
            type="password"
            autoComplete="current-password"
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
              setLoginError(false);
            }}
            placeholder="Password"
            className={`w-32 px-2 py-1 text-sm bg-radio-surface-base border rounded-lg outline-none focus:border-radio-primary ${
              loginError ? "border-red-500 animate-shake" : "border-radio-border-subtle"
            }`}
          />
          <button
            type="submit"
            className="min-h-[44px] px-3 py-1 text-sm font-semibold bg-radio-primary text-radio-surface-1 rounded-lg hover:bg-radio-primary-hover transition-all"
          >
            Login
          </button>
        </form>
      )}
      <button
        onClick={handleDjButtonClick}
        aria-label={
          isAdmin
            ? showAdmin
              ? "Back to listener view"
              : "Open DJ dashboard"
            : "DJ login"
        }
        className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
          isAdmin
            ? showAdmin
              ? "bg-radio-primary/20 text-radio-primary hover:bg-radio-primary/30"
              : "bg-radio-border-subtle text-radio-text-primary hover:bg-radio-text-secondary/30"
            : "bg-radio-border-subtle text-radio-text-secondary hover:bg-radio-text-secondary/30"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 17,1 12,1Z" />
        </svg>
        {isAdmin ? (showAdmin ? "Listener" : "Dashboard") : "DJ"}
      </button>
    </div>
  );

  return (
    <>
      {firstVisit && (
        <div
          className={`transition-opacity duration-[400ms] ease-out ${
            splashFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <FirstVisitSplash
            onStart={handleStartListening}
            listenerCount={listeners}
            currentTrack={currentTrack}
          />
        </div>
      )}

      <Layout isLive={isLive} headerExtra={headerExtra}>
        {showAdmin && isAdmin ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <ListenerView>
            <Chat />
            <Library />
          </ListenerView>
        )}
      </Layout>

      <PlayerBar isLive={isLive} />
    </>
  );
}
