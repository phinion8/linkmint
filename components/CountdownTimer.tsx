"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

export default function CountdownTimer({ seconds, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  const handleComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleComplete]);

  const progress = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3B82F6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{timeLeft}</span>
        </div>
      </div>
      <p className={`text-sm ${timeLeft > 0 ? "text-[#999999]" : "text-[#3B82F6]"}`}>
        {timeLeft > 0 ? "Please wait..." : "You may continue!"}
      </p>
    </div>
  );
}
