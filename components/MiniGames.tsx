"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ===== GENDER-AWARE OPPONENT NAMES =====
const maleNames = ["Alex_99", "Mike_J", "DarkLord", "CoolKid42", "ByteMe", "Jake_Pro", "NoobMaster", "SwiftFox", "Tyler_xo", "Max_GG"];
const femaleNames = ["Luna_xo", "Zara_pk", "PixelQueen", "StarDust", "Bella_99", "SophieGG", "Mia_Pro", "ChloeXD", "Emma_lit", "Lily_ace"];

function getOpponentName(): string {
  if (typeof window === "undefined") return maleNames[0];

  // Try to detect user gender preference from localStorage
  let userGender = localStorage.getItem("lm_gender");
  if (!userGender) {
    // Randomly assign and store
    userGender = Math.random() > 0.5 ? "male" : "female";
    localStorage.setItem("lm_gender", userGender);
  }

  // Show opposite gender names
  const names = userGender === "male" ? femaleNames : maleNames;
  return names[Math.floor(Math.random() * names.length)];
}

// ===== GAME 1: WHACK-A-MOLE =====
export function WhackAMole() {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(-1);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const moveMole = useCallback(() => {
    clearTimeout(intervalRef.current);
    setActive(Math.floor(Math.random() * 9));
    intervalRef.current = setTimeout(() => moveMole(), 600 + Math.random() * 500);
  }, []);

  useEffect(() => { moveMole(); return () => clearTimeout(intervalRef.current); }, [moveMole]);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.5) setOpScore(s => s + 1); }, 2500); return () => clearInterval(t); }, []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🎯</span><span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Whack-a-Mole</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i} onClick={() => { if (i === active) { setScore(s => s + 1); setActive(-1); } }}
            className={`aspect-square rounded-lg text-lg flex items-center justify-center transition-all duration-150 ${i === active ? "bg-emerald-500 scale-105" : "bg-[#1A1A1A] border border-[#222222]"}`}>
            {i === active ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== GAME 2: REACTION TIME =====
export function ReactionGame() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "go" | "result" | "early">("idle");
  const [time, setTime] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [opponent] = useState(getOpponentName);
  const startRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function start() { setPhase("waiting"); timeoutRef.current = setTimeout(() => { startRef.current = Date.now(); setPhase("go"); }, 1000 + Math.random() * 3000); }
  function click() {
    if (phase === "waiting") { clearTimeout(timeoutRef.current); setPhase("early"); }
    else if (phase === "go") { const t = Date.now() - startRef.current; setTime(t); if (!best || t < best) setBest(t); setPhase("result"); }
  }
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">⚡</span><span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Reaction Test</span></div>
        {best && <span className="text-[10px] text-[#555555]">{opponent}: {150 + Math.floor(Math.random() * 100)}ms</span>}
      </div>
      {phase === "idle" && <button onClick={start} className="w-full py-3 bg-[#3B82F6] text-white rounded-lg font-semibold text-sm">Start</button>}
      {phase === "waiting" && <button onClick={click} className="w-full py-4 bg-red-500 text-white rounded-lg font-semibold animate-pulse">Wait for green...</button>}
      {phase === "go" && <button onClick={click} className="w-full py-4 bg-emerald-500 text-white rounded-lg font-bold text-lg">TAP!</button>}
      {phase === "early" && <div className="text-center"><p className="text-red-400 text-sm mb-2">Too early!</p><button onClick={start} className="text-xs text-[#3B82F6]">Retry</button></div>}
      {phase === "result" && <div className="text-center"><p className="text-2xl font-bold text-white">{time}ms</p><p className="text-[#666666] text-xs mb-2">{time < 250 ? "Amazing!" : time < 350 ? "Great!" : "Keep trying!"}</p><button onClick={start} className="text-xs bg-[#3B82F6] text-white px-3 py-1 rounded-lg">Again</button></div>}
    </div>
  );
}

// ===== GAME 3: COLOR MATCH =====
export function ColorMatchGame() {
  const colors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-pink-500"];
  const names = ["Red", "Blue", "Green", "Yellow", "Purple", "Pink"];
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 6));
  const [score, setScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);
  const [grid, setGrid] = useState<number[]>([]);

  const shuffle = useCallback(() => {
    const g = Array.from({ length: 12 }, () => Math.floor(Math.random() * 6));
    if (!g.includes(target)) g[Math.floor(Math.random() * 12)] = target;
    setGrid(g);
  }, [target]);

  useEffect(() => { shuffle(); }, [shuffle]);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.6) setOpScore(s => s + 1); }, 2500); return () => clearInterval(t); }, []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🎨</span><span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">Color Match</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <p className="text-[#999999] text-[10px] mb-2">Tap all <span className="text-white font-bold">{names[target]}</span> tiles!</p>
      <div className="grid grid-cols-4 gap-1">
        {grid.map((c, i) => <button key={i} onClick={() => { if (c === target) { setScore(s => s + 1); setTarget(Math.floor(Math.random() * 6)); shuffle(); } }} className={`aspect-square rounded-md ${colors[c]} hover:opacity-80 active:scale-90 transition-all`} />)}
      </div>
    </div>
  );
}

// ===== GAME 4: EMOJI CATCH =====
export function EmojiCatchGame() {
  const emojis = ["🍎", "🍕", "⭐", "💎", "🔥", "🎯"];
  const [targetEmoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);

  const shuffle = useCallback(() => {
    const g = Array.from({ length: 16 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) g[Math.floor(Math.random() * 16)] = targetEmoji;
    setGrid(g);
  }, [targetEmoji]);

  useEffect(() => { shuffle(); }, [shuffle]);
  useEffect(() => { const t = setInterval(shuffle, 3000); return () => clearInterval(t); }, [shuffle]);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.5) setOpScore(s => s + 1); }, 2000); return () => clearInterval(t); }, []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🎪</span><span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Emoji Catch</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <p className="text-[#999999] text-[10px] mb-2">Catch all {targetEmoji} before they vanish!</p>
      <div className="grid grid-cols-4 gap-1">
        {grid.map((e, i) => <button key={i} onClick={() => { if (e === targetEmoji) { setScore(s => s + 1); const g = [...grid]; g[i] = "✅"; setGrid(g); } }} className="aspect-square rounded-md bg-[#1A1A1A] border border-[#222222] text-base flex items-center justify-center active:scale-90 transition-all">{e}</button>)}
      </div>
    </div>
  );
}

// ===== GAME 5: MEMORY MATCH =====
export function MemoryMatchGame() {
  const symbols = ["🎮", "🎲", "🎯", "🏆", "💰", "🔮"];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [opMoves, setOpMoves] = useState(0);
  const [opponent] = useState(getOpponentName);

  useEffect(() => { setCards([...symbols, ...symbols].sort(() => Math.random() - 0.5)); }, []);
  useEffect(() => { const t = setInterval(() => setOpMoves(m => m + 1), 3500); return () => clearInterval(t); }, []);

  function flip(i: number) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const nf = [...flipped, i]; setFlipped(nf); setMoves(m => m + 1);
    if (nf.length === 2) {
      if (cards[nf[0]] === cards[nf[1]]) { setMatched(m => [...m, ...nf]); setFlipped([]); }
      else setTimeout(() => setFlipped([]), 600);
    }
  }

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🧩</span><span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Memory Match</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {moves}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opMoves}</span></div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {cards.map((c, i) => <button key={i} onClick={() => flip(i)} className={`aspect-square rounded-md text-base flex items-center justify-center transition-all ${flipped.includes(i) || matched.includes(i) ? "bg-[#3B82F6]/20 border border-[#3B82F6]/30" : "bg-[#1A1A1A] border border-[#222222]"}`}>{flipped.includes(i) || matched.includes(i) ? c : "❓"}</button>)}
      </div>
      {matched.length === 12 && <p className="text-emerald-400 text-[10px] text-center mt-2 font-semibold">You won! 🎉</p>}
    </div>
  );
}

// ===== GAME 6: BALLOON POP =====
export function BalloonPopGame() {
  const [balloons, setBalloons] = useState<{ id: number; x: number; speed: number; color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);
  const nextId = useRef(0);
  const cols = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];

  useEffect(() => {
    const t = setInterval(() => {
      setBalloons(p => [...p.slice(-8), { id: nextId.current++, x: 10 + Math.random() * 80, speed: 2 + Math.random() * 3, color: cols[Math.floor(Math.random() * cols.length)] }]);
    }, 800); return () => clearInterval(t);
  }, []);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.4) setOpScore(s => s + 1); }, 2200); return () => clearInterval(t); }, []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🎈</span><span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Balloon Pop</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <div className="relative h-36 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A] overflow-hidden">
        {balloons.map(b => <button key={b.id} onClick={() => { setBalloons(p => p.filter(x => x.id !== b.id)); setScore(s => s + 1); }}
          className={`absolute w-7 h-9 rounded-full ${b.color} hover:scale-125 active:scale-75 transition-all cursor-pointer`}
          style={{ left: `${b.x}%`, animation: `floatUp ${b.speed}s linear forwards`, bottom: "-36px" }} />)}
      </div>
      <style>{`@keyframes floatUp { from { bottom: -36px; } to { bottom: 160px; } }`}</style>
    </div>
  );
}

// ===== GAME 7: SIMON SAYS =====
export function SimonSaysGame() {
  const colors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [phase, setPhase] = useState<"watch" | "play" | "fail">("watch");
  const [round, setRound] = useState(0);
  const [opponent] = useState(getOpponentName);
  const [opRound, setOpRound] = useState(0);

  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.5) setOpRound(r => r + 1); }, 4000); return () => clearInterval(t); }, []);

  const startRound = useCallback((seq: number[]) => {
    setPhase("watch");
    const newSeq = [...seq, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSeq([]);
    // Play sequence
    newSeq.forEach((c, i) => {
      setTimeout(() => setActiveIdx(c), (i + 1) * 500);
      setTimeout(() => setActiveIdx(-1), (i + 1) * 500 + 300);
    });
    setTimeout(() => setPhase("play"), (newSeq.length + 1) * 500);
  }, []);

  useEffect(() => { startRound([]); }, [startRound]);

  function handleTap(i: number) {
    if (phase !== "play") return;
    const newPlayer = [...playerSeq, i];
    setPlayerSeq(newPlayer);
    setActiveIdx(i);
    setTimeout(() => setActiveIdx(-1), 200);
    if (i !== sequence[newPlayer.length - 1]) { setPhase("fail"); return; }
    if (newPlayer.length === sequence.length) { setRound(r => r + 1); setTimeout(() => startRound(sequence), 500); }
  }

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🔴</span><span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Simon Says</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">Round: {round}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opRound}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {colors.map((c, i) => <button key={i} onClick={() => handleTap(i)} className={`aspect-square rounded-lg transition-all ${i === activeIdx ? `${c} scale-95 brightness-150` : `${c} opacity-40`}`} />)}
      </div>
      {phase === "watch" && <p className="text-amber-400 text-[10px] text-center mt-2">Watch the pattern...</p>}
      {phase === "play" && <p className="text-emerald-400 text-[10px] text-center mt-2">Your turn!</p>}
      {phase === "fail" && <div className="text-center mt-2"><p className="text-red-400 text-[10px]">Wrong! Reached round {round}</p><button onClick={() => { setRound(0); startRound([]); }} className="text-[10px] text-[#3B82F6] mt-1">Retry</button></div>}
    </div>
  );
}

// ===== GAME 8: MATH BLITZ =====
export function MathBlitzGame() {
  const [score, setScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);
  const [problem, setProblem] = useState({ q: "", answer: 0, options: [0, 0, 0, 0] });

  const generate = useCallback(() => {
    const a = 2 + Math.floor(Math.random() * 10);
    const b = 2 + Math.floor(Math.random() * 10);
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * 3)];
    const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
    const opts = [answer, answer + Math.floor(Math.random() * 5) + 1, answer - Math.floor(Math.random() * 5) - 1, answer + Math.floor(Math.random() * 10) - 5].sort(() => Math.random() - 0.5);
    if (!opts.includes(answer)) opts[0] = answer;
    setProblem({ q: `${a} ${op} ${b} = ?`, answer, options: opts });
  }, []);

  useEffect(() => { generate(); }, [generate]);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.5) setOpScore(s => s + 1); }, 3000); return () => clearInterval(t); }, []);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🧮</span><span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Math Blitz</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <p className="text-white text-xl font-bold text-center mb-3">{problem.q}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {problem.options.map((opt, i) => <button key={i} onClick={() => { if (opt === problem.answer) { setScore(s => s + 1); generate(); } }} className="py-2.5 rounded-lg bg-[#1A1A1A] border border-[#222222] text-white text-sm font-medium hover:bg-[#222222] active:scale-95 transition-all">{opt}</button>)}
      </div>
    </div>
  );
}

// ===== GAME 9: SEQUENCE TAP =====
export function SequenceTapGame() {
  const [tiles, setTiles] = useState<{ val: number; done: boolean }[]>([]);
  const [next, setNext] = useState(1);
  const [opTime, setOpTime] = useState(0);
  const [opponent] = useState(getOpponentName);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    const arr = Array.from({ length: 16 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setTiles(arr.map(v => ({ val: v, done: false })));
    setOpTime(8 + Math.floor(Math.random() * 10));
  }, []);

  function tap(i: number) {
    if (tiles[i].val === next) {
      const t = [...tiles]; t[i].done = true; setTiles(t); setNext(n => n + 1);
    }
  }

  const elapsed = next > 16 ? ((Date.now() - startTime) / 1000).toFixed(1) : null;

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🔢</span><span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Sequence Tap</span></div>
        <span className="text-[10px] text-[#555555]">{opponent}: {opTime}s</span>
      </div>
      <p className="text-[#999999] text-[10px] mb-2">Tap 1→16 in order!</p>
      <div className="grid grid-cols-4 gap-1">
        {tiles.map((t, i) => <button key={i} onClick={() => tap(i)} className={`aspect-square rounded-md text-xs font-bold flex items-center justify-center transition-all ${t.done ? "bg-emerald-500/20 text-emerald-400" : t.val === next ? "bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-white" : "bg-[#1A1A1A] border border-[#222222] text-[#999999]"}`}>{t.done ? "✓" : t.val}</button>)}
      </div>
      {elapsed && <p className="text-emerald-400 text-[10px] text-center mt-2">Done in {elapsed}s!</p>}
    </div>
  );
}

// ===== GAME 10: TARGET SWIPE =====
export function TargetSwipeGame() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [size, setSize] = useState(40);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);

  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.4) setOpScore(s => s + 1); }, 2000); return () => clearInterval(t); }, []);

  function hit() {
    setScore(s => s + 1);
    setSize(s => Math.max(20, s - 1));
    setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
  }

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">🎯</span><span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">Target Swipe</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <div className="relative h-36 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A] overflow-hidden cursor-crosshair">
        <button onClick={hit} className="absolute bg-red-500 rounded-full transition-all duration-300 hover:bg-red-400 active:scale-75"
          style={{ width: size, height: size, left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)" }}>
          <div className="w-full h-full rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1/3 h-1/3 rounded-full bg-white/60" />
          </div>
        </button>
      </div>
    </div>
  );
}

// ===== GAME 11: WORD SCRAMBLE =====
export function WordScrambleGame() {
  const words = ["APPLE", "HOUSE", "WATER", "MUSIC", "BRAIN", "PLANT", "LIGHT", "SMILE", "OCEAN", "TIGER", "DREAM", "STONE", "CLOUD", "FLAME", "SPEED", "LUCKY"];
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [opponent] = useState(getOpponentName);

  const newWord = useCallback(() => {
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setScrambled([...w].sort(() => Math.random() - 0.5));
    setAnswer([]);
  }, []);

  useEffect(() => { newWord(); }, [newWord]);
  useEffect(() => { const t = setInterval(() => { if (Math.random() > 0.5) setOpScore(s => s + 1); }, 4000); return () => clearInterval(t); }, []);

  function tapLetter(i: number) {
    const newAns = [...answer, scrambled[i]];
    setAnswer(newAns);
    const newScr = [...scrambled]; newScr[i] = ""; setScrambled(newScr);
    if (newAns.length === word.length) {
      if (newAns.join("") === word) { setScore(s => s + 1); setTimeout(newWord, 300); }
      else { setScrambled([...word].sort(() => Math.random() - 0.5)); setAnswer([]); }
    }
  }

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">📝</span><span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">Word Scramble</span></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="text-white font-bold">You: {score}</span><span className="text-[#555555]">vs</span><span className="text-amber-400 font-bold">{opponent}: {opScore}</span></div>
      </div>
      <div className="flex gap-1 justify-center mb-2 min-h-[32px]">
        {Array.from({ length: word.length }, (_, i) => <div key={i} className={`w-7 h-8 rounded border flex items-center justify-center text-sm font-bold ${answer[i] ? "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-white" : "border-[#2A2A2A] text-[#444444]"}`}>{answer[i] || "_"}</div>)}
      </div>
      <div className="flex gap-1 justify-center">
        {scrambled.map((l, i) => l ? <button key={i} onClick={() => tapLetter(i)} className="w-7 h-8 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm font-bold hover:bg-[#222222] active:scale-90 transition-all">{l}</button> : <div key={i} className="w-7 h-8" />)}
      </div>
      <button onClick={() => { setScrambled([...word].sort(() => Math.random() - 0.5)); setAnswer([]); }} className="text-[10px] text-[#555555] hover:text-white mt-2 block mx-auto">Clear</button>
    </div>
  );
}

// ===== GAME 12: SPEED TAP =====
export function TapSpeedGame() {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [opponent] = useState(getOpponentName);
  const [opCount] = useState(() => 25 + Math.floor(Math.random() * 20));

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) { setFinished(true); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, finished]);

  return (
    <div className="glass-card p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-base">👆</span><span className="text-[10px] font-semibold uppercase tracking-wider text-[#3B82F6]">Speed Tap</span></div>
        {started && !finished && <span className="text-sm font-bold text-amber-400">{timeLeft}s</span>}
        {finished && <span className="text-[10px] text-[#555555]">{opponent}: {opCount}</span>}
      </div>
      {finished ? (
        <div className="text-center py-2"><p className="text-2xl font-bold text-white">{count}</p><p className="text-[#666666] text-[10px] mb-2">{count > opCount ? "You beat " + opponent + "!" : "Try again!"}</p><button onClick={() => { setCount(0); setTimeLeft(5); setStarted(false); setFinished(false); }} className="text-[10px] bg-[#3B82F6] text-white px-3 py-1 rounded-lg">Retry</button></div>
      ) : (
        <button onClick={() => { if (!started) { setStarted(true); setCount(1); } else setCount(c => c + 1); }}
          className="w-full py-5 bg-[#111111] border-2 border-[#2A2A2A] rounded-xl text-white font-bold text-lg active:scale-95 transition-all select-none">
          {!started ? "TAP TO START" : `${count}`}
        </button>
      )}
    </div>
  );
}

// ===== GAME PICKER — 4 unique games per page, shuffled by step =====
const ALL_GAMES = [
  WhackAMole, ReactionGame, ColorMatchGame, EmojiCatchGame,
  MemoryMatchGame, BalloonPopGame, SimonSaysGame, MathBlitzGame,
  SequenceTapGame, TargetSwipeGame, WordScrambleGame, TapSpeedGame,
];

export function GamePicker({ step, count = 2, offset = 0 }: { step: number; count?: number; offset?: number }) {
  const [games, setGames] = useState<typeof ALL_GAMES>([]);

  useEffect(() => {
    // Fresh random shuffle on every render (page load / refresh / step change)
    const shuffled = [...ALL_GAMES].sort(() => Math.random() - 0.5);
    setGames(shuffled.slice(offset, offset + count));
  }, [step, count, offset]);

  return <>{games.map((Game, i) => <Game key={i} />)}</>;
}
