import { useState, useEffect, useCallback, useMemo } from "react";
import { Phone, Clock, Flame } from "lucide-react";

interface CallLog {
  timestamp: number;
}

function App() {
  const [calls, setCalls] = useState<CallLog[]>(() => {
    try {
      const saved = localStorage.getItem("calls");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn("Failed to load calls from localStorage");
      return [];
    }
  });
  const [now, setNow] = useState<number>(0);

  const logCall = useCallback(() => {
    const now = Date.now();
    setCalls((prev) => [...prev, { timestamp: now }]);
  }, []);

  useEffect(() => {
    localStorage.setItem("calls", JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const lastCallTime = calls.length > 0 ? calls[calls.length - 1].timestamp : null;

  const todayCalls = useMemo(() => {
    const today = new Date();
    return calls.filter((call) => {
      const callDate = new Date(call.timestamp);
      return callDate.toDateString() === today.toDateString();
    });
  }, [calls]);

  const resetDaily = useCallback(() => {
    const today = new Date();
    const newCalls = calls.filter((call) => {
      const callDate = new Date(call.timestamp);
      return callDate.toDateString() === today.toDateString();
    });
    setCalls(newCalls);
  }, [calls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        logCall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logCall]);

  const formatTimeSince = useCallback((timestamp: number) => {
    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, [now]);

  const timeSinceLastCall = useMemo(() => {
    if (lastCallTime === null) return "--";
    return formatTimeSince(lastCallTime);
  }, [lastCallTime, formatTimeSince]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-green-500" />
            Call Tracker
          </h1>
          <p className="text-zinc-400 text-sm">Win+Shift+C to log</p>
        </div>

        {lastCallTime ? (
          <div className="text-center space-y-6">
            <div className="bg-zinc-800 rounded-2xl p-8">
              <div className="text-zinc-400 text-sm mb-2">Since last call</div>
              <div className="text-5xl font-mono font-bold text-green-400 flex items-center justify-center gap-3">
                <Clock className="w-8 h-8" />
                {timeSinceLastCall}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-6">
              <div className="text-zinc-400 text-sm mb-2">Today</div>
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-orange-500" />
                <span className="text-4xl font-bold">{todayCalls.length}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-zinc-800 rounded-2xl p-8">
              <div className="text-zinc-400 text-sm mb-2">Since last call</div>
              <div className="text-5xl font-mono font-bold text-zinc-500 flex items-center justify-center gap-3">
                <Clock className="w-8 h-8" />
                --
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-6">
              <div className="text-zinc-400 text-sm mb-2">Today</div>
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-zinc-600" />
                <span className="text-4xl font-bold text-zinc-500">0</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logCall}
          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          +1 Call
        </button>

        {calls.length > 0 && (
          <div className="text-center">
            <button
              onClick={resetDaily}
              className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors"
            >
              Reset to today only
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
