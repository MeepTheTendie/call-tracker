import { useState, useEffect } from "react";
import { Phone, Clock, Flame } from "lucide-react";

interface CallLog {
  timestamp: number;
}

function App() {
  const [calls, setCalls] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem("calls");
    return saved ? JSON.parse(saved) : [];
  });
  const [lastCallTime, setLastCallTime] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("calls", JSON.stringify(calls));
    if (calls.length > 0) {
      setLastCallTime(calls[calls.length - 1].timestamp);
    }
  }, [calls]);

  const logCall = () => {
    const now = Date.now();
    setCalls((prev) => [...prev, { timestamp: now }]);
    setLastCallTime(now);
  };

  const formatTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const todayCalls = calls.filter((call) => {
    const callDate = new Date(call.timestamp);
    const today = new Date();
    return callDate.toDateString() === today.toDateString();
  });

  const resetDaily = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const newCalls = calls.filter((call) => {
      const callDate = new Date(call.timestamp);
      return callDate.toDateString() === today.toDateString();
    });
    setCalls(newCalls);
    if (newCalls.length > 0) {
      setLastCallTime(newCalls[newCalls.length - 1].timestamp);
    } else {
      setLastCallTime(null);
    }
  };

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
                {formatTimeSince(lastCallTime)}
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
