import { useState, useEffect, useCallback, useMemo } from "react";
import { Phone, Clock, Flame, X } from "lucide-react";

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
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("dailyGoal");
      return saved ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });

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
    localStorage.setItem("dailyGoal", dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "c" || e.key === "C") && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        logCall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleLogCallEvent = () => logCall();
    window.addEventListener("log-call", handleLogCallEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("log-call", handleLogCallEvent);
    };
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

  const progressPercent = Math.min(100, Math.round((todayCalls.length / dailyGoal) * 100));
  const remainingCalls = Math.max(0, dailyGoal - todayCalls.length);
  const goalReached = todayCalls.length >= dailyGoal;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center relative">
      <button
        onClick={() => window.close()}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
      >
        <X className="w-5 h-5" />
      </button>
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-zinc-400 text-sm">Today</div>
                <div className="text-zinc-400 text-xs">
                  Goal: {dailyGoal} calls
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Flame className={`w-8 h-8 ${goalReached ? "text-yellow-400" : "text-orange-500"}`} />
                <span className={`text-4xl font-bold ${goalReached ? "text-yellow-400" : ""}`}>{todayCalls.length}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goalReached ? "bg-yellow-400" : "bg-green-500"} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {goalReached ? (
                  <div className="text-center text-yellow-400 text-sm mt-2">
                    Goal reached! 🎉
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 text-sm mt-2">
                    {remainingCalls} more to reach goal
                  </div>
                )}
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-zinc-400 text-sm">Today</div>
                <div className="text-zinc-400 text-xs">
                  Goal: {dailyGoal} calls
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-zinc-600" />
                <span className="text-4xl font-bold text-zinc-500">0</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-zinc-600 rounded-full transition-all duration-300"
                    style={{ width: "0%" }}
                  />
                </div>
                <div className="text-center text-zinc-400 text-sm mt-2">
                  {dailyGoal} more to reach goal
                </div>
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
