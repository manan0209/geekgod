"use client";

import ActivityTimeline, { Activity } from "@/components/Greedy/ActivityTimeline";
import { useCallback, useEffect, useState } from "react";

function generateActivities() {
  // Generate 6 random activities with start/end in [1, 20]
  const acts: Activity[] = [];
  for (let i = 1; i <= 6; i++) {
    const start = Math.floor(Math.random() * 15) + 1;
    const end = start + Math.floor(Math.random() * 5) + 2;
    acts.push({ id: i, start, end });
  }
  // Sort by finish time
  acts.sort((a, b) => a.end - b.end);
  return acts;
}

export default function ActivitySelectionPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [history, setHistory] = useState<{ selected: Set<number>; step: number; current: number | null }[]>([]);

  useEffect(() => { setActivities(generateActivities()); reset(); }, []);
  function reset() {
    setSelected(new Set());
    setCurrent(null);
    setStep(0);
    setAutoPlay(false);
    setHistory([]);
  }
  const nextStep = useCallback(() => {
    if (step >= activities.length) return;
    const newSelected = new Set(selected);
    let lastEnd = 0;
    if (newSelected.size > 0) {
      const lastSel = activities.filter(a => newSelected.has(a.id)).slice(-1)[0];
      lastEnd = lastSel.end;
    }
    const act = activities[step];
    setCurrent(act.id);
    if (act.start >= lastEnd) {
      newSelected.add(act.id);
    }
    setHistory([...history, { selected: new Set(selected), step, current }]);
    setSelected(newSelected);
    setStep(step + 1);
  }, [step, activities, selected, history, current]);

  useEffect(() => {
    if (autoPlay && step < activities.length) {
      const t = setTimeout(nextStep, 900);
      return () => clearTimeout(t);
    }
    if (autoPlay && step >= activities.length) setAutoPlay(false);
  }, [autoPlay, step, activities, nextStep]);

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setSelected(new Set(prev.selected));
    setStep(prev.step);
    setCurrent(prev.current);
    setHistory(history.slice(0, -1));
    setAutoPlay(false);
  }
  function randomize() {
    setActivities(generateActivities());
    reset();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Activity Selection Visualization</h1>
        <p className="mb-6 text-gray-300">
          The Activity Selection problem is a classic greedy algorithm problem. The goal is to select the maximum number of non-overlapping activities from a set, always picking the next activity that finishes earliest.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <ActivityTimeline activities={activities} selected={selected} current={current} />
          <div className="flex flex-col gap-3 w-full md:w-56">
            <button onClick={nextStep} disabled={step >= activities.length} className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 font-medium disabled:opacity-50">Next Step</button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={step >= activities.length} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50">{autoPlay ? "Pause" : "Auto Play"}</button>
            <button onClick={undo} disabled={history.length === 0} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 font-medium disabled:opacity-50">Undo</button>
            <button onClick={randomize} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 font-medium">Randomize</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Activity Selection Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Sort all activities by their finish time.</li>
            <li>Select the first activity (with the earliest finish time).</li>
            <li>For each subsequent activity, if its start time is after or equal to the finish time of the last selected activity, select it (<span className='text-cyan-300'>cyan</span>).</li>
            <li>Repeat until all activities are considered.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>
            <span className="text-cyan-300 font-bold">Cyan</span>: Selected activity &nbsp;|
            <span className="text-yellow-400 font-bold"> Yellow</span>: Current activity
          </p>
        </div>
      </div>
    </div>
  );
}
