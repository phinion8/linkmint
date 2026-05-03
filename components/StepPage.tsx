"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import CountdownTimer from "./CountdownTimer";
import AdBlockDetector from "./AdBlockDetector";
import {
  AdPopunder,
  AdSocialBar,
  AdNativeBanner,
  AdBanner468x60,
  AdBanner300x250,
  AdBanner160x300,
  AdBanner160x600,
  AdBanner320x50,
  AdBanner728x90,
} from "./AdsterraAds";

// ===== DATA =====
const funFacts = [
  "Honey never spoils — 3,000-year-old honey found in Egyptian tombs was still edible.",
  "Octopuses have three hearts and blue blood.",
  "A day on Venus is longer than a year on Venus.",
  "The Eiffel Tower can grow up to 6 inches taller in summer due to heat expansion.",
  "Bananas are berries, but strawberries aren't.",
  "There are more stars in the universe than grains of sand on Earth.",
  "A group of flamingos is called a 'flamboyance'.",
  "The shortest war in history lasted 38 minutes — between Britain and Zanzibar.",
  "Sharks are older than trees — they've existed for over 400 million years.",
  "The human nose can detect over 1 trillion different scents.",
  "Wombat poop is cube-shaped to prevent it from rolling away.",
  "Scotland's national animal is the unicorn.",
  "Hot water freezes faster than cold water — it's called the Mpemba effect.",
  "A bolt of lightning is 5x hotter than the surface of the sun.",
  "The average person walks about 100,000 miles in their lifetime.",
  "Cows have best friends and get stressed when separated.",
  "The moon has moonquakes, just like Earth has earthquakes.",
  "A jiffy is an actual unit of time — 1/100th of a second.",
  "Your brain uses 20% of your body's total energy.",
  "There's enough DNA in the human body to stretch from the Sun to Pluto 17 times.",
];

const jokes = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
  { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!" },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!" },
  { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
  { setup: "Why can't a bicycle stand on its own?", punchline: "It's two-tired!" },
  { setup: "What did the ocean say to the beach?", punchline: "Nothing, it just waved." },
  { setup: "Why did the math book look so sad?", punchline: "Because it had too many problems." },
  { setup: "What do you call a lazy kangaroo?", punchline: "A pouch potato!" },
];

const triviaQuestions = [
  { question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { question: "How many bones does an adult human have?", options: ["186", "206", "226", "246"], answer: 1 },
  { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
  { question: "Which element has the chemical symbol 'Au'?", options: ["Silver", "Gold", "Aluminum", "Argon"], answer: 1 },
  { question: "What year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], answer: 1 },
  { question: "Which country has the most islands?", options: ["Philippines", "Indonesia", "Sweden", "Japan"], answer: 2 },
  { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], answer: 0 },
  { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Malta"], answer: 1 },
  { question: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], answer: 2 },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
];

// ===== COMPONENTS =====

function FunFactCard() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * funFacts.length));
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % funFacts.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">Did You Know?</span>
      </div>
      <p className={`text-[#CCCCCC] text-sm leading-relaxed transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        {funFacts[index]}
      </p>
    </div>
  );
}

function JokeCard() {
  const [joke] = useState(() => jokes[Math.floor(Math.random() * jokes.length)]);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">😄</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">Random Joke</span>
      </div>
      <p className="text-white text-sm mb-3">{joke.setup}</p>
      {revealed ? (
        <p className="text-[#60A5FA] text-sm font-medium animate-fade-up">{joke.punchline}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs px-4 py-1.5 rounded-lg bg-[#60A5FA]/10 text-[#60A5FA] hover:bg-[#60A5FA]/20 transition-colors"
        >
          Reveal Punchline
        </button>
      )}
    </div>
  );
}

function TriviaCard() {
  const [q] = useState(() => triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)]);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Quick Trivia</span>
      </div>
      <p className="text-white text-sm mb-4">{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          let cls = "border border-[#2A2A2A] bg-[#111111] text-[#CCCCCC] hover:bg-[#1A1A1A]";
          if (selected !== null) {
            if (i === q.answer) cls = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
            else if (i === selected) cls = "border-red-500/30 bg-red-500/10 text-red-400";
            else cls = "border-[#222222] bg-[#111111] text-[#666666]";
          }
          return (
            <button
              key={i}
              onClick={() => selected === null && setSelected(i)}
              disabled={selected !== null}
              className={`px-3 py-2 rounded-xl text-sm transition-all ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className={`mt-3 text-xs font-medium ${selected === q.answer ? "text-emerald-400" : "text-red-400"}`}>
          {selected === q.answer ? "Correct! 🎉" : `Wrong — the answer is ${q.options[q.answer]}`}
        </p>
      )}
    </div>
  );
}

const polls = [
  { question: "Coffee or Tea?", optionA: "☕ Coffee", optionB: "🍵 Tea", seedA: 62, seedB: 38 },
  { question: "Mountains or Beach?", optionA: "⛰️ Mountains", optionB: "🏖️ Beach", seedA: 45, seedB: 55 },
  { question: "Cats or Dogs?", optionA: "🐱 Cats", optionB: "🐶 Dogs", seedA: 48, seedB: 52 },
  { question: "Morning or Night?", optionA: "🌅 Morning", optionB: "🌙 Night", seedA: 35, seedB: 65 },
  { question: "Pizza or Burger?", optionA: "🍕 Pizza", optionB: "🍔 Burger", seedA: 57, seedB: 43 },
  { question: "Summer or Winter?", optionA: "☀️ Summer", optionB: "❄️ Winter", seedA: 53, seedB: 47 },
];

function QuickPoll({ step }: { step: number }) {
  const poll = polls[step % polls.length];
  const [voted, setVoted] = useState<"A" | "B" | null>(null);
  const pctA = voted ? poll.seedA + (voted === "A" ? 1 : 0) : poll.seedA;
  const pctB = voted ? poll.seedB + (voted === "B" ? 1 : 0) : poll.seedB;
  const total = pctA + pctB;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🗳️</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">Quick Poll</span>
      </div>
      <p className="text-white text-sm mb-4">{poll.question}</p>
      <div className="space-y-2">
        {(["A", "B"] as const).map((side) => {
          const label = side === "A" ? poll.optionA : poll.optionB;
          const pct = side === "A" ? pctA : pctB;
          const percentage = Math.round((pct / total) * 100);
          const isSelected = voted === side;
          return (
            <button
              key={side}
              onClick={() => !voted && setVoted(side)}
              disabled={voted !== null}
              className={`w-full relative overflow-hidden rounded-xl text-left transition-all ${
                voted
                  ? "cursor-default"
                  : "hover:bg-[#1A1A1A] cursor-pointer"
              } ${isSelected ? "border border-[#3B82F6]/30" : "border border-[#2A2A2A]"} p-3`}
            >
              {voted && (
                <div
                  className="absolute inset-0 bg-[#3B82F6]/10 rounded-xl transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="text-sm text-[#CCCCCC]">{label}</span>
                {voted && <span className="text-xs font-bold tabular-nums text-[#3B82F6]">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== MINI GAMES =====

function ReactionGame() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "go" | "result" | "early">("idle");
  const [reactionTime, setReactionTime] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function startGame() {
    setPhase("waiting");
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase("go");
    }, delay);
  }

  function handleClick() {
    if (phase === "waiting") {
      clearTimeout(timeoutRef.current);
      setPhase("early");
    } else if (phase === "go") {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      if (!best || time < best) setBest(time);
      setPhase("result");
    }
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Reaction Test</span>
        </div>
        {best && <span className="text-xs text-[#666666]">Best: {best}ms</span>}
      </div>

      {phase === "idle" && (
        <button onClick={startGame} className="w-full py-4 bg-[#3B82F6] text-white rounded-xl font-semibold hover:bg-[#2563EB] transition-colors">
          Start — Test Your Reflexes!
        </button>
      )}
      {phase === "waiting" && (
        <button onClick={handleClick} className="w-full py-6 bg-red-500 text-white rounded-xl font-semibold text-lg animate-pulse">
          Wait for green...
        </button>
      )}
      {phase === "go" && (
        <button onClick={handleClick} className="w-full py-6 bg-emerald-500 text-white rounded-xl font-bold text-lg">
          CLICK NOW!
        </button>
      )}
      {phase === "early" && (
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Too early!</p>
          <button onClick={startGame} className="text-sm text-[#3B82F6] hover:text-[#60A5FA]">Try again</button>
        </div>
      )}
      {phase === "result" && (
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-1">{reactionTime}<span className="text-sm text-[#666666] ml-1">ms</span></p>
          <p className="text-sm text-[#999999] mb-3">
            {reactionTime < 200 ? "Incredible!" : reactionTime < 300 ? "Great reflexes!" : reactionTime < 400 ? "Not bad!" : "Keep trying!"}
          </p>
          <button onClick={startGame} className="text-sm bg-[#3B82F6] text-white px-4 py-1.5 rounded-lg hover:bg-[#2563EB] transition-colors">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function WhackAMole() {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const moveMole = useCallback(() => {
    clearTimeout(intervalRef.current);
    const next = Math.floor(Math.random() * 9);
    setActive(next);
    intervalRef.current = setTimeout(() => moveMole(), 600 + Math.random() * 500);
  }, []);

  function handleWhack(i: number) {
    if (i === active) {
      setScore((s) => s + 1);
      setActive(-1);
    }
  }

  // Auto-start on mount
  useEffect(() => {
    moveMole();
    return () => clearTimeout(intervalRef.current);
  }, [moveMole]);

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Whack-a-Mole</span>
        </div>
        <span className="text-sm font-bold text-white">Score: {score}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleWhack(i)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-150 ${
              i === active
                ? "bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222]"
            }`}
          >
            {i === active ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>
      <p className="text-[#555555] text-xs text-center mt-3">Tap the gopher as fast as you can!</p>
    </div>
  );
}

// Fake opponent names for multiplayer feel
const fakeNames = ["Alex_99", "ProGamer", "xDarkLord", "MikeJ", "Luna_xo", "NoobMaster", "Zara_pk", "CoolKid42", "SwiftFox", "PixelQueen", "ByteMe", "StarDust"];
function randomName() { return fakeNames[Math.floor(Math.random() * fakeNames.length)]; }

function ColorMatchGame() {
  const colors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-pink-500"];
  const colorNames = ["Red", "Blue", "Green", "Yellow", "Purple", "Pink"];
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 6));
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponent] = useState(randomName);
  const [grid, setGrid] = useState<number[]>([]);
  const [flash, setFlash] = useState(false);

  const shuffleGrid = useCallback(() => {
    const g = Array.from({ length: 12 }, () => Math.floor(Math.random() * 6));
    if (!g.includes(target)) g[Math.floor(Math.random() * 12)] = target;
    setGrid(g);
  }, [target]);

  useEffect(() => { shuffleGrid(); }, [shuffleGrid]);

  // Fake opponent scoring
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.6) setOpponentScore((s) => s + 1);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  function handleTap(i: number) {
    if (grid[i] === target) {
      setScore((s) => s + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
      setTarget(Math.floor(Math.random() * 6));
      shuffleGrid();
    }
  }

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎨</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">Color Match</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white font-bold">You: {score}</span>
          <span className="text-[#666666]">vs</span>
          <span className="text-amber-400 font-bold">{opponent}: {opponentScore}</span>
        </div>
      </div>
      <p className="text-[#999999] text-xs mb-3">Tap all <span className={`font-bold text-white`}>{colorNames[target]}</span> tiles!</p>
      <div className={`grid grid-cols-4 gap-1.5 transition-all ${flash ? "scale-95" : ""}`}>
        {grid.map((c, i) => (
          <button key={i} onClick={() => handleTap(i)}
            className={`aspect-square rounded-lg ${colors[c]} hover:opacity-80 active:scale-90 transition-all duration-100`} />
        ))}
      </div>
    </div>
  );
}

function EmojiCatchGame() {
  const emojis = ["🍎", "🍕", "⭐", "💎", "🔥", "🎯"];
  const [targetEmoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponent] = useState(randomName);

  const shuffleGrid = useCallback(() => {
    const g = Array.from({ length: 16 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const targetCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < targetCount; i++) {
      g[Math.floor(Math.random() * 16)] = targetEmoji;
    }
    setGrid(g);
  }, [targetEmoji]);

  useEffect(() => { shuffleGrid(); }, [shuffleGrid]);
  useEffect(() => {
    const t = setInterval(() => { shuffleGrid(); }, 3000);
    return () => clearInterval(t);
  }, [shuffleGrid]);

  // Fake opponent
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.5) setOpponentScore((s) => s + 1);
    }, 1800 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  function handleTap(i: number) {
    if (grid[i] === targetEmoji) {
      setScore((s) => s + 1);
      const newGrid = [...grid];
      newGrid[i] = "✅";
      setGrid(newGrid);
    }
  }

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎪</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Emoji Catch</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white font-bold">You: {score}</span>
          <span className="text-[#666666]">vs</span>
          <span className="text-amber-400 font-bold">{opponent}: {opponentScore}</span>
        </div>
      </div>
      <p className="text-[#999999] text-xs mb-3">Catch all the <span className="text-lg">{targetEmoji}</span> before they disappear!</p>
      <div className="grid grid-cols-4 gap-1.5">
        {grid.map((emoji, i) => (
          <button key={i} onClick={() => handleTap(i)}
            className="aspect-square rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222] active:scale-90 transition-all duration-100 text-xl flex items-center justify-center">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoryMatchGame() {
  const symbols = ["🎮", "🎲", "🎯", "🏆", "💰", "🔮", "🎮", "🎲", "🎯", "🏆", "💰", "🔮"];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [opponentMoves, setOpponentMoves] = useState(0);
  const [opponent] = useState(randomName);

  useEffect(() => {
    setCards([...symbols].sort(() => Math.random() - 0.5));
  }, []);

  // Fake opponent
  useEffect(() => {
    const t = setInterval(() => {
      setOpponentMoves((m) => m + 1);
    }, 3000 + Math.random() * 3000);
    return () => clearInterval(t);
  }, []);

  function handleFlip(i: number) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const newFlipped = [...flipped, i];
    setFlipped(newFlipped);
    setMoves((m) => m + 1);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched((m) => [...m, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧩</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Memory Match</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white font-bold">You: {moves}</span>
          <span className="text-[#666666]">vs</span>
          <span className="text-amber-400 font-bold">{opponent}: {opponentMoves}</span>
        </div>
      </div>
      <p className="text-[#999999] text-xs mb-3">Find all pairs — fewer moves wins!</p>
      <div className="grid grid-cols-4 gap-1.5">
        {cards.map((card, i) => (
          <button key={i} onClick={() => handleFlip(i)}
            className={`aspect-square rounded-lg text-xl flex items-center justify-center transition-all duration-200 ${
              flipped.includes(i) || matched.includes(i)
                ? "bg-[#3B82F6]/20 border border-[#3B82F6]/30 scale-95"
                : "bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222]"
            }`}>
            {flipped.includes(i) || matched.includes(i) ? card : "❓"}
          </button>
        ))}
      </div>
      {matched.length === 12 && <p className="text-emerald-400 text-xs text-center mt-3 font-semibold">You won! 🎉</p>}
    </div>
  );
}

function BalloonPopGame() {
  const [balloons, setBalloons] = useState<{ id: number; x: number; speed: number; color: string; popped: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponent] = useState(randomName);
  const nextId = useRef(0);
  const balloonColors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-purple-500"];

  // Spawn balloons
  useEffect(() => {
    const t = setInterval(() => {
      setBalloons((prev) => [
        ...prev.filter((b) => !b.popped).slice(-8),
        {
          id: nextId.current++,
          x: 10 + Math.random() * 80,
          speed: 2 + Math.random() * 3,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          popped: false,
        },
      ]);
    }, 800);
    return () => clearInterval(t);
  }, []);

  // Fake opponent
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.4) setOpponentScore((s) => s + 1);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  function pop(id: number) {
    setBalloons((prev) => prev.map((b) => b.id === id ? { ...b, popped: true } : b));
    setScore((s) => s + 1);
  }

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎈</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Balloon Pop</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white font-bold">You: {score}</span>
          <span className="text-[#666666]">vs</span>
          <span className="text-amber-400 font-bold">{opponent}: {opponentScore}</span>
        </div>
      </div>
      <div className="relative h-48 bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] overflow-hidden">
        {balloons.filter((b) => !b.popped).map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            className={`absolute w-8 h-10 rounded-full ${b.color} hover:scale-125 active:scale-75 transition-all cursor-pointer`}
            style={{
              left: `${b.x}%`,
              animation: `floatUp ${b.speed}s linear forwards`,
              bottom: "-40px",
            }}
          />
        ))}
        {balloons.filter((b) => !b.popped).length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[#444444] text-xs">Balloons incoming...</p>
        )}
      </div>
      <style>{`@keyframes floatUp { from { bottom: -40px; } to { bottom: 200px; } }`}</style>
    </div>
  );
}

// Pick random games based on step number (changes per page)
function GamePicker({ step }: { step: number }) {
  const allGames = [WhackAMole, ColorMatchGame, EmojiCatchGame, MemoryMatchGame, BalloonPopGame, ReactionGame];
  // Use step + position to get different games for left vs right
  const shuffled = [...allGames].sort(() => Math.sin(step * 1000) - 0.5);
  const Game1 = shuffled[0];
  const Game2 = shuffled[1];
  return (
    <>
      <Game1 />
      <Game2 />
    </>
  );
}

function TapSpeedGame() {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, finished]);

  function handleTap() {
    if (!started) {
      setStarted(true);
      setCount(1);
    } else if (!finished) {
      setCount((c) => c + 1);
    }
  }

  function reset() {
    setCount(0);
    setTimeLeft(5);
    setStarted(false);
    setFinished(false);
  }

  return (
    <div className="glass-card p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">👆</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">Speed Tap</span>
        </div>
        {started && !finished && <span className="text-sm font-bold text-amber-400">{timeLeft}s</span>}
      </div>

      {finished ? (
        <div className="text-center py-3">
          <p className="text-3xl font-bold text-white mb-1">{count}</p>
          <p className="text-sm text-[#999999] mb-3">taps in 5 seconds ({(count / 5).toFixed(1)}/sec)</p>
          <button onClick={reset} className="text-sm bg-[#3B82F6] text-white px-4 py-1.5 rounded-lg hover:bg-[#2563EB] transition-colors">
            Try Again
          </button>
        </div>
      ) : (
        <button
          onClick={handleTap}
          className="w-full py-6 bg-[#111111] border-2 border-[#2A2A2A] rounded-xl text-white font-bold text-xl hover:bg-[#1A1A1A] active:scale-95 transition-all select-none"
        >
          {!started ? "TAP TO START" : `${count}`}
        </button>
      )}
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth * 2;
      canvas!.height = canvas!.offsetHeight * 2;
    }
    resize();

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2 + 1,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(59, 130, 246, 0.4)";
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 150)})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Popunder — fires once per session on first user interaction
function PopunderScript() {
  const fired = useRef(false);

  useEffect(() => {
    // Placeholder: Replace the window.__popunder_url with your Adsterra popunder script
    // Adsterra will provide a <script> tag — paste it in the ad_html field
    // or hardcode the script src here
    if (fired.current) return;
    fired.current = true;

    // Example: uncomment and replace with your Adsterra popunder script tag
    // const script = document.createElement("script");
    // script.src = "//your-adsterra-popunder-script-url.js";
    // script.setAttribute("data-cfasync", "false");
    // document.body.appendChild(script);
  }, []);

  return null;
}

// ===== MAIN =====

interface StepPageProps {
  sessionToken: string;
  shortCode: string;
  stepNumber: number;
  totalSteps: number;
  timerSeconds: number;
  buttonText: string;
  adHtml: string | null;
  linkTitle: string | null;
  adLayout?: string;
}

export default function StepPage({
  sessionToken,
  shortCode,
  stepNumber,
  totalSteps,
  timerSeconds,
  buttonText,
  adHtml,
  linkTitle,
  adLayout = "v1",
}: StepPageProps) {
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [continueVisible, setContinueVisible] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [interstitialClosed, setInterstitialClosed] = useState(false);
  const [interstitialCountdown, setInterstitialCountdown] = useState(5);
  const continueRef = useRef<HTMLDivElement>(null);

  // Pick engagement widget based on step number
  const widgetType = stepNumber % 3; // 0=fact, 1=joke, 2=trivia

  const handleTimerComplete = useCallback(() => {
    setCanProceed(true);
  }, []);

  // Show interstitial ad after 2 seconds of timer starting
  useEffect(() => {
    if (interstitialClosed) return;
    const delay = setTimeout(() => setShowInterstitial(true), 2000);
    return () => clearTimeout(delay);
  }, [interstitialClosed]);

  // Interstitial close countdown
  useEffect(() => {
    if (!showInterstitial || interstitialCountdown <= 0) return;
    const t = setTimeout(() => setInterstitialCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showInterstitial, interstitialCountdown]);

  // Track if continue section is in viewport
  useEffect(() => {
    const el = continueRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContinueVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  async function handleContinue() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/go/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken, step: stepNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.nextStep) {
        window.location.href = `/go/${shortCode}?s=${sessionToken}`;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AdBlockDetector>
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Interstitial Ad Overlay */}
      {showInterstitial && !interstitialClosed && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="max-w-md w-full flex flex-col items-center gap-4">
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[#666666] text-xs uppercase tracking-wider">Advertisement</span>
              {interstitialCountdown > 0 ? (
                <span className="text-[#666666] text-xs">
                  Close in <span className="text-white font-bold">{interstitialCountdown}s</span>
                </span>
              ) : (
                <button
                  onClick={() => { setShowInterstitial(false); setInterstitialClosed(true); }}
                  className="flex items-center gap-1.5 text-white text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close Ad
                </button>
              )}
            </div>

            {/* Ad Content */}
            <div className="flex justify-center">
              <AdBanner300x250 />
            </div>

            {/* Timer still running text */}
            <p className="text-[#555555] text-xs text-center">
              Your timer is still running in the background
            </p>
          </div>
        </div>
      )}

      {/* Particle background */}
      <ParticleCanvas />

      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#3B82F6]/[0.06] blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-[#60A5FA]/[0.04] blur-[80px] animate-float" />

      {/* Top bar */}
      <div className="sticky top-0 z-50">
        <div className="bg-black/80 backdrop-blur-2xl border-b border-[#1A1A1A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">LinkMint</span>
              </div>

              {/* Step Progress - Desktop */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < stepNumber
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1A1A1A] text-[#555555] border border-[#2A2A2A]"
                    }`}>
                      {i < stepNumber ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < totalSteps - 1 && (
                      <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${i < stepNumber - 1 ? "bg-[#3B82F6]" : "bg-[#2A2A2A]"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Progress - Mobile */}
              <div className="sm:hidden flex items-center gap-2">
                <span className="text-[#999999] text-sm">Step</span>
                <span className="bg-[#3B82F6] text-white text-xs font-bold px-2.5 py-1 rounded-md">{stepNumber}/{totalSteps}</span>
              </div>

              {/* Secure badge */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-[#666666]">
                <svg className="w-3.5 h-3.5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Link
              </div>
            </div>
          </div>
        </div>
        {/* Thin progress bar */}
        <div className="h-[2px] bg-[#111111]">
          <div className="h-full bg-[#3B82F6] transition-all duration-700 ease-out" style={{ width: `${(stepNumber / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center px-4 py-8 z-10">
        {linkTitle && (
          <h1 className="text-[#CCCCCC] text-lg font-medium text-center max-w-lg mb-5">
            {linkTitle}
          </h1>
        )}

        {adLayout === "v2" ? (
          /* ===== V2 — Optimized Revenue ===== */
          <div className="w-full max-w-6xl mx-auto">
            {/* 3-Column: Games | Center Content | Games */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,480px)_1fr] gap-5 items-start">

              {/* LEFT — Games (randomized per step) */}
              <div className="hidden lg:flex flex-col gap-4">
                <GamePicker step={stepNumber} />
                <FunFactCard />
              </div>

              {/* CENTER — Ads + Timer + Button at bottom */}
              <div className="flex flex-col gap-5 items-center">
                {/* Ad: 300x250 above fold */}
                <AdBanner300x250 />

                {/* Timer */}
                <div className="glass-card-accent p-8 flex flex-col items-center w-full">
                  <CountdownTimer seconds={timerSeconds} onComplete={handleTimerComplete} />
                </div>

                {/* Ad: 468x60 */}
                <AdBanner468x60 />

                {/* Native Banner */}
                <AdNativeBanner />

                {/* Ad: 728x90 / 320x50 */}
                <div className="hidden sm:block"><AdBanner728x90 /></div>
                <div className="sm:hidden"><AdBanner320x50 /></div>

                {/* Mobile games (randomized) */}
                <div className="lg:hidden flex flex-col gap-4 w-full">
                  <GamePicker step={stepNumber} />
                  <FunFactCard />
                </div>

                {/* Sponsored Recommendations */}
                <div className="glass-card p-5 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-[#666666] uppercase tracking-wider">Sponsored</span>
                    <span className="text-[10px] text-[#444444]">Ad</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="https://www.profitablecpmratenetwork.com/rtrqu0a9ej?key=b34039c71b8267e54c94a72871487ae7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl hover:border-[#2A2A2A] hover:bg-[#141414] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-[#3B82F6] transition-colors">Earn Rewards</p>
                        <p className="text-[#666666] text-xs">Discover new ways to earn online</p>
                      </div>
                    </a>
                    <a
                      href="https://www.profitablecpmratenetwork.com/rtrqu0a9ej?key=b34039c71b8267e54c94a72871487ae7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl hover:border-[#2A2A2A] hover:bg-[#141414] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-[#3B82F6] transition-colors">Trending Now</p>
                        <p className="text-[#666666] text-xs">See what&apos;s popular right now</p>
                      </div>
                    </a>
                    <a
                      href="https://www.profitablecpmratenetwork.com/rtrqu0a9ej?key=b34039c71b8267e54c94a72871487ae7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl hover:border-[#2A2A2A] hover:bg-[#141414] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-[#3B82F6] transition-colors">Top Picks</p>
                        <p className="text-[#666666] text-xs">Curated recommendations for you</p>
                      </div>
                    </a>
                    <a
                      href="https://www.profitablecpmratenetwork.com/rtrqu0a9ej?key=b34039c71b8267e54c94a72871487ae7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl hover:border-[#2A2A2A] hover:bg-[#141414] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-[#3B82F6] transition-colors">Featured Offers</p>
                        <p className="text-[#666666] text-xs">Exclusive deals & opportunities</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Continue section — progress + ad + button */}
                <div ref={continueRef} id="continue-section" className="glass-card p-6 flex flex-col items-center gap-5 w-full overflow-hidden">
                  {/* Step progress */}
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-[#666666] mb-1.5">
                      <span>Step {stepNumber} of {totalSteps}</span>
                      <span>{Math.round((stepNumber / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6] rounded-full transition-all duration-500" style={{ width: `${(stepNumber / totalSteps) * 100}%` }} />
                    </div>
                  </div>

                  {/* Ad inside container — scaled to fit */}
                  <div className="w-full overflow-hidden flex justify-center" style={{ maxWidth: "100%" }}>
                    <div className="transform scale-[0.85] sm:scale-100 origin-center">
                      <AdBanner320x50 />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    onClick={handleContinue}
                    disabled={!canProceed || loading}
                    className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-300 text-lg ${
                      canProceed
                        ? "bg-[#3B82F6] text-white hover:bg-[#2563EB] hover:shadow-lg hover:shadow-[#3B82F6]/25 cursor-pointer"
                        : "bg-[#111111] text-[#666666] cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Verifying..." : canProceed ? buttonText : `Please wait ${timerSeconds}s...`}
                  </button>
                </div>

                <div className="h-10" />
              </div>

              {/* RIGHT — Games (different set, randomized) */}
              <div className="hidden lg:flex flex-col gap-4">
                <GamePicker step={stepNumber + 3} />
                <QuickPoll step={stepNumber} />
                <JokeCard />
              </div>
            </div>

            {/* Floating "Go to Continue" bar — appears when timer completes */}
            {canProceed && !continueVisible && (
              <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center animate-fade-up pointer-events-none">
                <button
                  onClick={() => {
                    const el = document.getElementById("continue-section");
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="pointer-events-auto flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2563EB] transition-all shadow-xl shadow-[#3B82F6]/30"
                >
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Scroll down to continue
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ===== V1 — Full Experience ===== */
          <>
            {/* Ad: 728x90 — top leaderboard (desktop only) */}
            <div className="hidden md:block mb-5">
              <AdBanner728x90 />
            </div>

            {/* 3-Column Layout */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-5 items-start">

              {/* LEFT SIDEBAR */}
              <div className="hidden lg:flex flex-col gap-4">
                <AdBanner160x600 />
                <ReactionGame />
                <FunFactCard />
                <QuickPoll step={stepNumber} />
              </div>

              {/* CENTER */}
              <div className="flex flex-col gap-5 w-full items-center">
                <AdBanner468x60 />

                <div className="glass-card-accent p-8 flex flex-col items-center gap-5 w-full max-w-md">
                  <CountdownTimer seconds={timerSeconds} onComplete={handleTimerComplete} />
                </div>

                <AdBanner300x250 />

                <div className="glass-card p-6 flex flex-col items-center gap-4 w-full max-w-md">
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-[#666666] mb-1.5">
                      <span>Progress</span>
                      <span>{stepNumber}/{totalSteps} steps</span>
                    </div>
                    <div className="w-full h-2 bg-[#111111] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-500" style={{ width: `${(stepNumber / totalSteps) * 100}%` }} />
                    </div>
                  </div>

                  <AdBanner320x50 />

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    onClick={handleContinue}
                    disabled={!canProceed || loading}
                    className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300 ${
                      canProceed
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white hover:shadow-lg hover:shadow-[#3B82F6]/25 hover:scale-[1.02] cursor-pointer"
                        : "bg-[#111111] text-[#666666] cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Verifying..." : canProceed ? buttonText : `Please wait ${timerSeconds}s...`}
                  </button>
                </div>

                <AdNativeBanner />

                <div className="lg:hidden flex flex-col gap-4">
                  <WhackAMole />
                  <ReactionGame />
                  <FunFactCard />
                  <TriviaCard />
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="hidden lg:flex flex-col gap-4">
                <AdBanner160x300 />
                <WhackAMole />
                <TriviaCard />
                <TapSpeedGame />
                <JokeCard />
              </div>
            </div>
          </>
        )}

      </div>

      {/* Footer */}
      <div className="relative border-t border-[#222222] px-4 py-3 text-center text-[#555555] text-xs z-10">
        Powered by LinkMint — You will be redirected after completing all steps
      </div>
    </div>
    </AdBlockDetector>
  );
}
